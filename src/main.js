// Game flow: menus, lobby, rounds, input, and the frame loop that ties the
// simulation to the view, HUD, audio and (online) the network.
//
// Online play is host-authoritative. The host runs the real simulation and
// streams snapshots and events. The guest runs the same simulation locally so
// its own top answers input at once, then corrects itself from each snapshot
// (rewind to the host's state, re-apply inputs the host has not seen yet,
// simulate forward by the measured delay).
import { BLADES, DIFFICULTY, ROUND_TIME, ROUNDS_TO_WIN, KEYS, skillOf } from './config.js';
import { World, intercept, predictAt, spinRatio, targetable } from './sim.js';
import { CpuBrain } from './ai.js';
import { View } from './view.js';
import { UI } from './ui.js';
import { Audio } from './audio.js';
import { groundY } from './fx.js';
import { Net, cleanCode } from './net.js';
import { PROTOCOL, PKT_SNAPSHOT, encodeSnapshot, applySnapshot, snapshotHeader, packEvent, reviveEvent, packetType } from './netcode.js';

// Filled in by tools/build.mjs.
const VERSION = `v${__VERSION__} · ${__BUILD__}`;
const STEP = 1 / 120;
// Seconds the CPU telegraphs each aimed skill before it fires.
const CPU_WINDUP = { sonic: 0.42, anchor: 0.45, blitz: 0.48, flare: 0.36, quake: 0.2 };
const SNAP_RATE = 30, SNAP_RATE_SLOW = 15;   // snapshots per second, normal / congested link
const MAX_LEAD = 0.25;                       // most the guest will simulate ahead of a snapshot
const params = new URLSearchParams(location.search);
const canvas = document.getElementById('stage');
const view = new View(canvas);
const audio = new Audio();

const game = {
  state: 'title',      // title | lobby | countdown | fight | finish | result
  mode: 'cpu',         // cpu | host | guest
  side: 0,             // which top this player controls
  paused: false,
  world: null, brain: null, autoBrain: null,
  score: [0, 0], round: 0, timeLeft: ROUND_TIME,
  finishes: [],
  acc: 0, hitstop: 0, slow: { s: 1, t: 0 },
  seq: null,           // countdown script: [{ at, run }]
  seqT: 0,
  aimKey: null, buffer: null,
  cursor: { sx: innerWidth / 2, sy: innerHeight / 2, x: 0, z: 0 },
  mouseDown: false, moveRepeat: 0,
  ultWasReady: false,
  blade: 'azure', level: 1,
  // --- online ---
  net: null,
  lobby: { role: null, status: 'opening', url: '', error: '', me: { blade: 'azure', ready: false }, peer: null },
  outbox: [],          // host: events waiting to be sent
  snapT: 0, snapSeq: 0, tail: 0,
  inSeq: 0, ack: 0,    // guest: last input sent / host: last guest input applied
  pending: [],         // guest: inputs the host has not confirmed yet
  lastSnap: -1, corrections: 0, errSum: 0, errMax: 0, inbox: null, frames: 0,
};

const online = () => game.mode !== 'cpu';
const player = () => game.world.tops[game.side];
const rival = () => game.world.tops[1 - game.side];

const ui = new UI({
  start: (blade, level) => { audio.unlock(); audio.ui(); startCpuMatch(blade, level); },
  // Online, "again" goes to the lobby already marked ready (same blade);
  // "lobby" goes there unready, to change blade or just regroup.
  again: () => { audio.ui(); if (online()) backToLobby(true); else startCpuMatch(game.blade, game.level); },
  lobby: () => { audio.ui(); backToLobby(false); },
  quit: () => { audio.ui(); leaveOnline(); toTitle(); },
  pause: () => togglePause(),
  mute: () => { audio.unlock(); audio.setMuted(!audio.muted); ui.setMuted(audio.muted); },
  ui: () => { audio.unlock(); audio.ui(); },
  hover: () => audio.hover(),
  skillClick: (k) => clickSkill(k),
  host: () => { audio.unlock(); audio.ui(); openRoom(); },
  ready: () => { audio.unlock(); audio.ui(); setReady(!game.lobby.me.ready); },
  pick: (id) => { audio.unlock(); audio.ui(); if (!game.lobby.me.ready) { game.lobby.me.blade = id; ui.blade = id; lobbyChanged(); } },
  copy: () => copyInvite(),
});

function showScreen(name) {
  for (const id of ['title', 'lobby', 'result', 'pause']) ui.show(id, id === name);
  ui.show('hud', name === 'hud');
  document.body.classList.toggle('menu', name !== 'hud');
}

function toTitle() {
  game.state = 'title'; game.mode = 'cpu'; game.side = 0;
  game.paused = false; game.world = null; game.aimKey = null; game.seq = null;
  view.setMatch(null, 0);
  view.orbiting = true;
  audio.stopMusic();
  showScreen('title');
  ui.setMenuMode(false);
  ui.setNet('');
  ui.labels.innerHTML = '';
  ui.vignette.style.opacity = 0;
}

// ------------------------------------------------------------------ match --
function beginMatch(world, side, foeLabel, foeNote) {
  game.world = world; game.side = side;
  game.score = [0, 0]; game.round = 0; game.finishes = [];
  game.paused = false;
  view.setMatch(world, side);
  view.orbiting = false;
  showScreen('hud');
  ui.setMenuMode(online());
  ui.startMatch(world, side, foeLabel, foeNote);
  audio.startMusic();
}

function startCpuMatch(bladeId, levelIdx) {
  game.mode = 'cpu';
  game.blade = bladeId; game.level = levelIdx;
  const level = DIFFICULTY[levelIdx];
  const others = Object.keys(BLADES).filter((b) => b !== bladeId);
  const foe = params.get('foe') || others[(Math.random() * others.length) | 0];
  const w = new World(BLADES[bladeId], BLADES[foe], (Date.now() & 0xffffff) + 1);
  beginMatch(w, 0, 'CPU', level.name);
  const c = rival();
  // The CPU winds up before firing so its skills can be read and dodged.
  for (const k of KEYS) c.windup[k] = (CPU_WINDUP[skillOf(c, k).id] || 0) * level.windup;
  game.brain = new CpuBrain(w, c, level);
  game.autoBrain = params.has('auto') ? new CpuBrain(w, player(), DIFFICULTY[1]) : null;
  startRound(1);
}

// Host and guest both build the same world: side 0 is the host's top.
function startOnlineMatch(blades) {
  const w = new World(BLADES[blades[0]], BLADES[blades[1]], 1);
  beginMatch(w, game.mode === 'host' ? 0 : 1, 'RIVAL', '');
  game.brain = null;
  game.outbox.length = 0; game.pending.length = 0;
  game.inSeq = 0; game.ack = 0; game.snapSeq = 0; game.lastSnap = -1; game.corrections = 0; game.errSum = game.errMax = 0; game.inbox = null;
  game.lobby.me.ready = false;
  if (game.lobby.peer) game.lobby.peer.ready = false;
  // Test aid: ?auto lets a bot play this side through the normal input path.
  game.autoBrain = params.has('auto') ? new CpuBrain(game.mode === 'host' ? w : remoteControlled(w), player(), DIFFICULTY[1]) : null;
}

function startRound(n) {
  const w = game.world;
  game.round = n;
  w.resetRound();
  w.events.length = 0;
  view.clearRound();
  for (const v of view.tops) { v.hold = true; v.drop = 7; }
  game.state = 'countdown';
  game.timeLeft = ROUND_TIME; game.acc = 0; game.hitstop = 0; game.slow.t = 0; game.aimKey = null; game.buffer = null;
  game.pending.length = 0; game.outbox.length = 0; game.lastSnap = -1; game.inbox = null;
  ui.setRound(n);
  ui.setScore(game.score);
  if (game.mode === 'host') game.net.send({ t: 'round', n, score: game.score });
  const final = game.score[0] === ROUNDS_TO_WIN - 1 && game.score[1] === ROUNDS_TO_WIN - 1;
  const quick = params.has('quick');
  const t0 = quick ? 0.1 : 1.5, gap = quick ? 0.05 : 0.62;
  const release = () => { for (const v of view.tops) { v.hold = false; v.dropV = 0; } };
  game.seqT = 0;
  game.seq = [
    { at: 0.05, run: () => ui.announce(final ? 'FINAL ROUND' : 'ROUND ' + n, `${player().blade.en}　vs　${rival().blade.en}`, 'round', 1.4) },
    { at: t0, run: () => { ui.announce('3', '', 'count', 0.6); audio.beep(); } },
    { at: t0 + gap, run: () => { ui.announce('2', '', 'count', 0.6); audio.beep(); } },
    { at: t0 + gap * 2, run: () => { ui.announce('1', '', 'count', 0.6); audio.beep(); } },
    { at: t0 + gap * 3, run: () => { ui.announce('GO SPIN!', '', 'go', 0.9); audio.beep(true); release(); } },
  ];
  // The guest starts fighting when the host says so, not on its own clock.
  if (game.mode !== 'guest') game.seq.push({ at: t0 + gap * 3 + 0.38, run: beginFight });
}

function beginFight() {
  if (game.state !== 'countdown') return;
  for (const v of view.tops) { v.hold = false; }
  game.state = 'fight';
  game.snapT = 0;
  audio.clash(18);
  if (game.mode === 'host') game.net.send({ t: 'go' });
}

function endRound(e) {
  const won = e.winner.side === game.side;
  game.score[e.winner.side]++;
  game.finishes.push(`R${game.round} ${won ? 'WIN' : 'LOSE'}（${{ over: 'オーバー', burst: 'バースト', spin: 'スピン', time: '判定' }[e.kind]}）`);
  game.state = 'finish';
  game.aimKey = null; game.buffer = null;
  game.slow = { s: 0.16, t: e.kind === 'time' ? 0.3 : 1.25 };
  game.hitstop = e.kind === 'time' ? 0 : 0.2;
  game.tail = 4; // a few more snapshots so the guest sees the final state
  ui.finish(e.kind, won);
  ui.setScore(game.score);
  ui.flash('#fff', e.kind === 'time' ? 0.2 : 0.7);
  audio.finish(won);
  game.seqT = 0;
  // The guest waits for the host to announce what comes next.
  if (game.mode === 'guest') { game.seq = null; return; }
  const done = game.score[0] >= ROUNDS_TO_WIN || game.score[1] >= ROUNDS_TO_WIN;
  game.seq = [{ at: 3.3, run: () => {
    if (!done) return startRound(game.round + 1);
    if (game.mode === 'host') game.net.send({ t: 'result', score: game.score, stats: game.world.tops.map((t) => t.stats) });
    showResult();
  } }];
}

function showResult() {
  game.state = 'result';
  view.orbiting = true;
  audio.stopMusic();
  ui.announceEl.className = '';
  ui.labels.innerHTML = '';
  ui.showResult(game.score[game.side] > game.score[1 - game.side], game.score, game.world, game.finishes);
  showScreen('result');
}

// ------------------------------------------------------------------ lobby --
function inviteUrl(code) { return `${location.origin}${location.pathname}?room=${code}`; }

function newNet() {
  if (game.net) game.net.leave();
  game.net = new Net({ status: netStatus, open: netOpen, message: netMessage, packet: netPacket, closed: netClosed });
  if (params.has('lag')) game.net.simulate(Number(params.get('lag')) || 0, Number(params.get('jitter')) || 0, Number(params.get('loss')) || 0);
  return game.net;
}

function enterLobby(role) {
  game.mode = role; game.state = 'lobby';
  const lb = game.lobby;
  lb.role = role; lb.status = 'opening'; lb.url = ''; lb.error = ''; lb.peer = null;
  lb.me = { blade: ui.blade, ready: false };
  view.setMatch(null, 0);
  view.orbiting = true;
  showScreen('lobby');
  ui.showLobby(lb);
}

function openRoom() {
  enterLobby('host');
  newNet().host();
}

function joinRoom(code) {
  enterLobby('guest');
  newNet().join(code);
}

// Our own choice changed: tell the other side, then refresh.
function lobbyChanged() {
  const lb = game.lobby;
  if (game.net && game.net.connected) game.net.send({ t: 'lobby', blade: lb.me.blade, ready: lb.me.ready });
  lobbyRefresh();
}

// Redraws the lobby and, on the host, starts the match once both are ready.
function lobbyRefresh() {
  const lb = game.lobby;
  if (game.state === 'lobby') ui.showLobby(lb);
  if (game.mode === 'host' && game.state === 'lobby' && lb.me.ready && lb.peer && lb.peer.ready) {
    const blades = [lb.me.blade, lb.peer.blade];
    game.net.send({ t: 'start', blades });
    startOnlineMatch(blades);
    startRound(1);
  }
}

function setReady(on) {
  if (game.lobby.status !== 'connected') return;
  game.lobby.me.ready = on;
  lobbyChanged();
}

// After a match both players return here; the link stays up for a rematch.
function backToLobby(ready) {
  if (!game.net || !game.net.connected) { toTitle(); return; }
  game.state = 'lobby'; game.world = null; game.seq = null;
  view.setMatch(null, 0);
  view.orbiting = true;
  audio.stopMusic();
  ui.labels.innerHTML = '';
  ui.vignette.style.opacity = 0;
  showScreen('lobby');
  game.lobby.me.ready = !!ready;
  lobbyChanged();
}

function leaveOnline() {
  if (game.net) { game.net.leave(); game.net = null; }
  if (params.has('room')) history.replaceState(null, '', location.pathname);
}

async function copyInvite() {
  const url = game.lobby.url;
  if (!url) return;
  try { await navigator.clipboard.writeText(url); ui.toast('招待URLをコピーしました'); }
  catch { document.getElementById('lb-url').select(); ui.toast('URLを選択しました。Ctrl+C でコピーしてください'); }
}

const FAILS = {
  'peer-unavailable': 'ルームが見つかりません。URLが古いか、ホストがルームを閉じています。',
  timeout: '接続がタイムアウトしました。ネットワーク環境によっては直接接続できない場合があります。',
  network: '仲介サーバーに接続できません。インターネット接続を確認してください。',
  'server-error': '仲介サーバーに接続できません。少し待ってからもう一度お試しください。',
  'browser-incompatible': 'このブラウザはオンライン対戦（WebRTC）に対応していません。',
  full: 'このルームは満員です。',
  version: '相手とゲームのバージョンが違います。両方のページを再読み込みしてください。',
};

function netStatus(state, detail) {
  const lb = game.lobby;
  if (state === 'failed') {
    lb.status = 'failed'; lb.error = FAILS[detail] || `接続できませんでした（${detail}）`;
    if (game.state !== 'lobby') { ui.toast(lb.error); leaveOnline(); toTitle(); return; }
  } else {
    lb.status = state;
    if (state === 'waiting') lb.url = inviteUrl(detail);
  }
  if (game.state === 'lobby') ui.showLobby(lb);
}

function netOpen() {
  const lb = game.lobby;
  lb.status = 'connected';
  game.net.send({ t: 'hello', v: PROTOCOL, build: VERSION, blade: lb.me.blade, ready: lb.me.ready });
  if (game.state === 'lobby') ui.showLobby(lb);
}

function netClosed(reason) {
  const lb = game.lobby;
  lb.peer = null; lb.me.ready = false;
  ui.setNet('');
  const mid = game.state !== 'lobby' && game.state !== 'title';
  if (game.mode === 'host') {
    // The room stays open so the same or another guest can come in.
    lb.status = 'waiting';
    game.state = 'lobby'; game.world = null; game.seq = null; game.paused = false;
    view.setMatch(null, 0); view.orbiting = true;
    audio.stopMusic();
    ui.labels.innerHTML = '';
    showScreen('lobby');
    ui.showLobby(lb);
    ui.toast(mid ? '相手との接続が切れました' : '相手が退出しました');
  } else if (game.mode === 'guest') {
    ui.toast(reason === 'timeout' ? '接続がタイムアウトしました' : 'ホストとの接続が切れました');
    leaveOnline();
    toTitle();
  }
}

const num = (v) => (Number.isFinite(v) ? Math.max(-50, Math.min(50, v)) : 0);

function netMessage(m) {
  const lb = game.lobby, w = game.world;
  switch (m.t) {
    case 'hello':
      if (m.v !== PROTOCOL) { netStatus('failed', 'version'); game.net.leave(); return; }
      // Compatible, but not the same build: worth knowing when something looks off.
      if (typeof m.build === 'string' && m.build !== VERSION) ui.toast(`相手は別の版です（${m.build.slice(0, 40)}）`);
    // falls through
    case 'lobby':
      if (!BLADES[m.blade]) return;
      lb.peer = { blade: m.blade, ready: !!m.ready };
      // Seeing the other side in the lobby while still on the result screen
      // means they want a rematch.
      if (game.state === 'result') ui.toast(m.ready ? '相手が再戦を待っています' : '相手がロビーに戻りました');
      lobbyRefresh();
      break;
    case 'full': netStatus('failed', 'full'); break;
    case 'bye': if (game.net) game.net.drop('bye'); break;

    // ---- host -> guest ----
    case 'start':
      if (game.mode !== 'guest' || !Array.isArray(m.blades) || !BLADES[m.blades[0]] || !BLADES[m.blades[1]]) return;
      startOnlineMatch(m.blades);
      break;
    case 'round':
      if (game.mode !== 'guest' || !w) return;
      game.score = [m.score[0] | 0, m.score[1] | 0];
      startRound(m.n | 0);
      break;
    case 'go':
      if (game.mode === 'guest' && w) { game.seq = null; beginFight(); }
      break;
    case 'ev':
      if (game.mode !== 'guest' || !w || !Array.isArray(m.l)) return;
      for (const o of m.l) remoteEvent(reviveEvent(o, w));
      break;
    case 'result':
      if (game.mode !== 'guest' || !w) return;
      game.score = [m.score[0] | 0, m.score[1] | 0];
      m.stats.forEach((s, i) => Object.assign(w.tops[i].stats, s));
      showResult();
      break;

    // ---- guest -> host ----
    case 'in': {
      if (game.mode !== 'host' || !w || game.state !== 'fight') return;
      const t = w.tops[1];
      if (m.k === 'm') w.issueMove(t, num(m.x), num(m.z));
      else if (m.k === 'c' && KEYS.includes(m.key)) w.cast(t, m.key, num(m.x), num(m.z));
      game.ack = m.s | 0;
      break;
    }
  }
}

// An event that happened on the host. The local world is brought into line
// where the event says something final, then it is shown like any other.
function remoteEvent(e) {
  const w = game.world;
  if (e.type === 'ringout' && e.top && !e.top.out) e.top.out = { t: 0, y: 0, vy: 7 + (e.power || 0) * 0.35 };
  if (e.type === 'finish') {
    if (game.state !== 'fight') return;
    w.result = { winner: e.winner, loser: e.loser, kind: e.kind };
    if (e.kind === 'spin' || e.kind === 'burst') e.loser.spin = 0;
  }
  onEvent(e);
}

// Snapshots are only noted when they arrive and applied at the start of the
// next frame, where the exact time since arrival is known.
function netPacket(buf) {
  if (game.mode !== 'guest' || packetType(buf) !== PKT_SNAPSHOT) return;
  if (!game.world || game.state !== 'fight') return;
  // Out-of-order or duplicate: a newer state is already here.
  const head = snapshotHeader(buf);
  if (game.lastSnap >= 0) {
    const d = (head.seq - game.lastSnap) & 0xffff;
    if (d === 0 || d > 0x8000) return;
    if (d > 1) game.net.stats.lost += d - 1;
  }
  game.lastSnap = head.seq;
  game.inbox = { buf, head, at: performance.now() };
}

// Rewind to the host's state, re-apply what it had not seen yet, and simulate
// forward to the present. Returns true if a snapshot was applied.
function reconcile() {
  const snap = game.inbox, w = game.world;
  game.inbox = null;
  if (!snap || !w || game.state !== 'fight') return false;
  const before = view.capture();
  applySnapshot(w, snap.buf);
  game.timeLeft = snap.head.timeLeft;
  const ack = snap.head.ack;
  game.pending = game.pending.filter((p) => { const d = (p.s - ack) & 0xffff; return d !== 0 && d < 0x8000; });
  const me = player();
  for (const p of game.pending) {
    if (p.k === 'm') w.issueMove(me, p.x, p.z); else w.cast(me, p.key, p.x, p.z);
  }
  // The snapshot left the host half a round trip ago and has waited here
  // since it arrived.
  const lead = Math.min(MAX_LEAD, game.net.rtt / 2 + (performance.now() - snap.at) / 1000);
  for (let i = Math.round(lead / STEP); i > 0; i--) w.step(STEP);
  w.events.length = 0;
  game.acc = 0;
  view.absorb(before);
  // How far off the local forecast was: the number the smoothing has to hide.
  let err = 0;
  w.tops.forEach((t, i) => { if (!t.air && !t.out && !t.blink) err = Math.max(err, Math.hypot(t.x - before[i].x, t.z - before[i].z)); });
  game.corrections++;
  game.errSum += err; game.errMax = Math.max(game.errMax, err);
  return true;
}

// Guest side: the bot (and nothing else) sees the world through this, so its
// orders travel the same road as a human's.
function remoteControlled(world) {
  return new Proxy(world, {
    get(target, prop) {
      if (prop === 'cast') return (top, key, x, z) => doCast(key, x, z);
      if (prop === 'issueMove') return (top, x, z) => doMove(x, z);
      const v = target[prop];
      return typeof v === 'function' ? v.bind(target) : v;
    },
  });
}

// ------------------------------------------------------------------ input --
// Every order from this player goes through these two. The guest applies it
// locally at once and also sends it to the host.
function doMove(x, z) {
  const w = game.world, me = player();
  if (!w.issueMove(me, x, z)) return false;
  if (game.mode === 'guest') sendInput({ k: 'm', x: me.cmd.x, z: me.cmd.z });
  return true;
}

function doCast(key, x, z) {
  const w = game.world;
  if (!w.cast(player(), key, x, z)) return false;
  if (game.mode === 'guest') { w.events.length = 0; sendInput({ k: 'c', key, x, z }); }
  return true;
}

function sendInput(p) {
  p.s = game.inSeq = (game.inSeq + 1) & 0xffff;
  p.x = Math.round(p.x * 100) / 100; p.z = Math.round(p.z * 100) / 100;
  game.pending.push(p);
  if (game.pending.length > 40) game.pending.shift();
  game.net.send({ t: 'in', ...p });
}

function refreshCursor() {
  const p = view.pick(game.cursor.sx, game.cursor.sy);
  if (p) { game.cursor.x = p.x; game.cursor.z = p.z; }
}

function orderMove(silent) {
  if (game.state !== 'fight' || game.paused) return;
  refreshCursor();
  const me = player();
  if (doMove(game.cursor.x, game.cursor.z) && !silent) {
    view.marker(me.cmd.x, me.cmd.z);
    audio.move();
  }
}

function tryCast(key, x, z, buffered) {
  if (game.state !== 'fight' || game.paused) return false;
  const me = player();
  if (!doCast(key, x, z)) {
    // Pressed a moment too early (still reeling or mid-dash): hold the input
    // briefly and fire as soon as the top can act.
    const S = skillOf(me, key);
    const far = S.id === 'eclipse' && !game.world.busy(me) && me.cd[key] <= 0 && me.ult >= 100;
    const soon = !far && me.cd[key] <= 0.25 && (!S.ult || me.ult >= 100) && !me.air && !me.out;
    if (soon && !buffered) game.buffer = { key, x, z, t: 0.45 };
    else if (!buffered) { audio.denied(); ui.denied(key); if (far) popAt(me, '射程外', 'word dim'); }
    return false;
  }
  game.buffer = null;
  ui.castFx(key);
  return true;
}

// Clicking a skill button aims it for you, using the same prediction the
// indicator shows.
function clickSkill(key) {
  audio.unlock();
  if (game.state !== 'fight' || game.paused) return;
  const me = player(), foe = rival();
  const S = skillOf(me, key);
  let p = { x: foe.x, z: foe.z };
  if (targetable(foe)) {
    if (S.aim === 'line' || S.aim === 'dash') p = intercept(me.x, me.z, foe, me, S.speed);
    else if (S.aim === 'leap') p = predictAt(foe, me, S.air);
    else if (S.aim === 'ground') p = predictAt(foe, me, S.delay);
  }
  tryCast(key, p.x, p.z);
}

canvas.addEventListener('mousemove', (e) => { game.cursor.sx = e.clientX; game.cursor.sy = e.clientY; });
canvas.addEventListener('mousedown', (e) => {
  audio.unlock();
  game.cursor.sx = e.clientX; game.cursor.sy = e.clientY;
  if (e.button === 2 && game.aimKey) { game.aimKey = null; return; }
  if (e.button !== 0 && e.button !== 2) return;
  game.mouseDown = true; game.moveRepeat = 0.12;
  orderMove(false);
});
window.addEventListener('mouseup', () => { game.mouseDown = false; });
window.addEventListener('contextmenu', (e) => e.preventDefault());

window.addEventListener('keydown', (e) => {
  if (e.repeat || e.target.tagName === 'INPUT') return;
  const k = e.key.toUpperCase();
  if (k === 'ESCAPE') { if (game.aimKey) game.aimKey = null; else togglePause(); return; }
  if (k === 'P') return togglePause();
  if (k === 'M') { audio.unlock(); audio.setMuted(!audio.muted); ui.setMuted(audio.muted); return; }
  if (game.state !== 'fight' || game.paused || !KEYS.includes(k)) return;
  audio.unlock();
  const me = player(), S = skillOf(me, k);
  if (S.aim === 'self') { tryCast(k, me.x, me.z); return; }
  // Aiming is allowed while briefly unable to act; only a real cooldown refuses.
  if (me.cd[k] > 0.25 || (S.ult && me.ult < 100) || me.air || me.out) { audio.denied(); ui.denied(k); return; }
  game.aimKey = k;
});
window.addEventListener('keyup', (e) => {
  const k = e.key.toUpperCase();
  if (k !== game.aimKey) return;
  game.aimKey = null;
  refreshCursor();
  tryCast(k, game.cursor.x, game.cursor.z);
});
window.addEventListener('blur', () => {
  game.aimKey = null; game.mouseDown = false;
  if (game.state === 'fight' && !game.paused && !online() && !params.has('auto')) togglePause();
});

// Offline this pauses. Online it only opens the menu: the match goes on.
function togglePause() {
  if (!['countdown', 'fight', 'finish'].includes(game.state)) return;
  game.paused = !game.paused;
  game.aimKey = null;
  ui.show('pause', game.paused);
  audio.ui();
}
const frozen = () => game.paused && !online();

// ----------------------------------------------------------------- events --
function popAt(top, text, cls) {
  const s = view.toScreen(top.x, groundY(top.x, top.z) + 2.2, top.z);
  ui.pop(s.x, s.y, text, cls);
}
function dmgPop(top, dmg) {
  if (dmg < 1) return;
  const size = dmg >= 90 ? 'huge' : dmg >= 45 ? 'big' : '';
  popAt(top, Math.round(dmg), `dmg ${top.side === game.side ? 'taken' : 'dealt'} ${size}`);
}
function healPop(top, amount) {
  if (amount >= 1) popAt(top, '+' + Math.round(amount), 'heal');
}

function onEvent(e) {
  view.handle(e);
  const mine = (t) => t && t.side === game.side;
  switch (e.type) {
    case 'clash':
      audio.clash(e.power);
      dmgPop(e.a, e.dmgA); dmgPop(e.b, e.dmgB);
      if (e.kind === 'parry') {
        audio.parry();
        game.hitstop = 0.17;
        popAt(e.src, 'PARRY!', 'word gold');
        ui.flash('#ffe9a0', 0.3);
      } else if (e.kind === 'dash' || e.kind === 'empower') {
        audio.projHit();
        game.hitstop = 0.14;
        popAt(e.src === e.a ? e.b : e.a, e.kind === 'dash' ? 'DASH HIT!' : 'PHANTOM STRIKE!', 'word');
        ui.flash(e.src.blade.css, 0.22);
      } else if (e.power > 9) {
        game.hitstop = Math.max(game.hitstop, Math.min(0.1, 0.015 + e.power * 0.0035));
      }
      break;
    case 'wall':
      audio.wall(e.power, e.slam);
      dmgPop(e.top, e.dmg);
      if (e.slam && e.dmg > 8) { popAt(e.top, 'WALL SLAM', 'word red'); game.hitstop = Math.max(game.hitstop, 0.07); }
      break;
    case 'cast':
      if (e.windup > 0) audio.windup();
      if (e.skill.ult) ui.cutIn(e.skill, e.top.blade.css, !mine(e.top));
      break;
    case 'blink': audio.blink(); break;
    case 'blinkEnd': if (mine(e.top)) popAt(e.top, 'POWER UP', 'word gold'); break;
    case 'zone':
      if (e.zone.kind === 'sanctuary') audio.heal(); else audio.windup();
      break;
    case 'quake':
      audio.quake();
      if (e.hit) { dmgPop(e.target, e.hit); popAt(e.target, 'STUN', 'word red'); game.hitstop = 0.12; }
      break;
    case 'charge':
      audio.leap();
      game.slow = { s: 0.4, t: 0.25 };
      break;
    case 'nova':
      audio.meteor();
      ui.flash('#fff', 0.5);
      if (e.hit) { dmgPop(e.target, e.hit); game.hitstop = 0.2; game.slow = { s: 0.35, t: 0.45 }; }
      else popAt(e.top, 'MISS', 'word dim');
      break;
    case 'flare':
      audio.flare();
      if (e.hit) { dmgPop(e.target, e.hit); healPop(e.top, e.heal); game.hitstop = 0.07; }
      break;
    case 'orbs': audio.guard(); break;
    case 'orbHit':
      audio.projHit();
      dmgPop(e.target, e.dmg);
      game.hitstop = 0.06;
      break;
    case 'tether':
      audio.leap();
      game.slow = { s: 0.4, t: 0.25 };
      break;
    case 'drain':
      audio.drain();
      dmgPop(e.target, e.dmg); healPop(e.top, e.heal);
      break;
    case 'tetherEnd':
      if (e.broke && !game.world.result) popAt(e.top, 'BREAK', 'word dim');
      break;
    case 'heal':
      healPop(e.top, e.amount);
      break;
    case 'shoot': if (e.proj.skill.chain) audio.chain(); else audio.shoot(); break;
    case 'reflect':
      audio.parry();
      popAt(e.top, 'REFLECT!', 'word gold');
      game.hitstop = 0.1;
      break;
    case 'projHit':
      audio.projHit();
      dmgPop(e.top, e.dmg);
      if (e.proj.skill.chain) popAt(e.top, 'HOOKED!', 'word');
      game.hitstop = 0.09;
      break;
    case 'guard': audio.guard(); break;
    case 'dash': audio.dash(); break;
    case 'leap':
      audio.leap();
      game.slow = { s: 0.3, t: 0.32 };
      break;
    case 'meteor':
      audio.meteor();
      ui.flash('#fff', 0.55);
      if (e.hit) { dmgPop(e.target, e.hit); game.hitstop = 0.2; game.slow = { s: 0.35, t: 0.45 }; }
      else popAt(e.top, 'MISS', 'word dim');
      break;
    case 'ringout':
      audio.ringout();
      break;
    case 'finish':
      endRound(e);
      break;
  }
}

// ------------------------------------------------------------------- loop --
function hostSend(rdt) {
  const net = game.net;
  if (game.outbox.length) { net.send({ t: 'ev', l: game.outbox.splice(0) }); }
  const live = game.state === 'fight' || (game.state === 'finish' && game.tail > 0);
  if (!live) return;
  game.snapT -= rdt;
  if (game.snapT > 0) return;
  // Halve the rate while the link is backed up instead of piling on more.
  game.snapT += 1 / (net.congested ? SNAP_RATE_SLOW : SNAP_RATE);
  if (game.snapT < 0) game.snapT = 0;
  if (game.state === 'finish') game.tail--;
  game.snapSeq = (game.snapSeq + 1) & 0xffff;
  net.sendPacket(encodeSnapshot(game.world, { seq: game.snapSeq, ack: game.ack, timeLeft: game.timeLeft }));
}

function frame(rdt, draw = true) {
  const w = game.world, net = game.net;
  if (net) net.update(rdt);
  let dt = 0;
  if (!frozen()) {
    if (game.seq) {
      game.seqT += rdt;
      while (game.seq && game.seq.length && game.seq[0].at <= game.seqT) {
        const s = game.seq.shift();
        s.run();
      }
      if (game.seq && !game.seq.length) game.seq = null;
    }
    if (w && (game.state === 'fight' || game.state === 'finish')) {
      // Freezes and slow motion change the simulation's clock, which both
      // ends of an online match have to share, so there they are skipped
      // until the round is decided.
      if (online() && game.state === 'fight') { game.hitstop = 0; game.slow.t = 0; }
      let scale = 1;
      if (game.hitstop > 0) { game.hitstop -= rdt; scale = 0; }
      else if (game.slow.t > 0) { game.slow.t -= rdt; scale = game.slow.s; }
      dt = rdt * scale;
      if (game.buffer) {
        game.buffer.t -= rdt;
        if (tryCast(game.buffer.key, game.buffer.x, game.buffer.z, true) || (game.buffer && game.buffer.t <= 0)) game.buffer = null;
      }
      if (game.mouseDown && game.state === 'fight' && !game.paused) {
        game.moveRepeat -= rdt;
        if (game.moveRepeat <= 0) { game.moveRepeat = 0.1; orderMove(true); }
      }
      // A fresh snapshot already brings the guest up to the present, so this
      // frame's own time must not be added on top.
      if (game.mode === 'guest' && game.inbox && reconcile()) dt = 0;
      game.acc += dt;
      while (game.acc >= STEP) {
        game.acc -= STEP;
        if (game.state === 'fight') {
          if (game.brain) game.brain.update(STEP);
          if (game.autoBrain) game.autoBrain.update(STEP);
          game.timeLeft -= STEP;
          if (game.mode !== 'guest' && game.timeLeft <= 0 && !w.result) w.timeUp();
        }
        w.step(STEP);
        if (w.events.length) {
          const ev = w.events.splice(0);
          // The guest's own simulation is only a forecast: what really
          // happened arrives from the host.
          if (game.mode !== 'guest') {
            for (const e of ev) {
              if (game.mode === 'host') game.outbox.push(packEvent(e));
              onEvent(e);
            }
          }
        }
        if (game.hitstop > 0) { game.acc = 0; break; }
      }
      if (game.state === 'fight') {
        const ready = player().ult >= 100;
        if (ready && !game.ultWasReady) { audio.ultReady(); popAt(player(), 'ULT READY', 'word gold'); }
        game.ultWasReady = ready;
      }
    }
    if (game.mode === 'host' && w && net && net.connected) hostSend(rdt);
  }
  if (!draw) return;
  game.frames++;
  let aim = null;
  if (w && game.state === 'fight' && !game.paused) {
    refreshCursor();
    if (game.aimKey) aim = { key: game.aimKey, x: game.cursor.x, z: game.cursor.z };
  }
  view.update(dt, frozen() ? 0 : rdt, aim);
  if (w && ['countdown', 'fight', 'finish'].includes(game.state)) {
    ui.update(w, view, game.timeLeft, game.aimKey, rdt);
    audio.intensity = 1 - Math.min(spinRatio(player()), spinRatio(rival()));
  }
  if (net && net.connected && net.rttKnown) {
    const ms = Math.round(net.rtt * 1000);
    ui.setNet(`PING ${ms}ms${net.fast ? '' : ' ・ 低速回線モード'}`, ms > 160 || !net.fast);
  } else if (!online()) ui.setNet('');
  audio.update();
  if (!params.has('norender')) view.render();
}

let last = performance.now();
function tick(now, draw) {
  const elapsed = Math.max(0, (now - last) / 1000);
  last = now;
  // A hidden tab only gets the odd timer tick; make up the lost time in
  // slices (simulating without drawing) so the match keeps its pace.
  // Online the clock is shared with the other player, so a slow frame is also
  // made up rather than turned into slow motion.
  let left = Math.min(elapsed, !draw ? 1 : online() ? 0.25 : 0.05);
  while (left > 0.05) { frame(0.05, false); left -= 0.05; }
  frame(left, draw);
}
function loop(now) {
  tick(now, true);
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

// Browsers stop animation frames in a background tab. Offline that is a free
// pause; online the other player is still there, so a worker (which keeps
// ticking) drives the simulation without drawing.
try {
  const src = 'setInterval(() => postMessage(0), 16);';
  const worker = new Worker(URL.createObjectURL(new Blob([src], { type: 'text/javascript' })));
  worker.onmessage = () => { if (document.hidden && online() && game.net && game.net.connected) tick(performance.now(), false); };
} catch { /* no worker: a hidden tab will simply lag */ }
document.addEventListener('visibilitychange', () => { if (!document.hidden) last = performance.now(); });
window.addEventListener('pagehide', () => { if (game.net) game.net.leave(); });

toTitle();
ui.setMuted(false);
document.getElementById('version').textContent = VERSION;
// Test hook: lets a script drive frames by hand and inspect the match.
window.__gc = { game, view, ui, audio, frame, startMatch: startCpuMatch, openRoom, joinRoom, BLADES };
const room = cleanCode(params.get('room'));
if (room.length === 6) joinRoom(room);
else if (params.has('host')) openRoom();
else if (params.has('demo')) startCpuMatch(params.get('blade') || 'azure', Number(params.get('level') || 1));
