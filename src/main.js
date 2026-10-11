// Game flow: menus, lobby, rounds, input, and the frame loop that ties the
// simulation to the view, HUD, audio and (online) the network.
//
// Online play is host-authoritative. The host runs the real simulation and
// streams snapshots and events. The guest runs the same simulation locally so
// its own top answers input at once, then corrects itself from each snapshot
// (rewind to the host's state, re-apply inputs the host has not seen yet,
// simulate forward by the measured delay).
import { BLADES, DIFFICULTY, STAGES, ROUND_TIME, ROUNDS_TO_WIN, KEYS, skillOf } from './config.js';
import { World, spinRatio } from './sim.js';
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
  brains: [],          // the CPUs in a match set up in the room
  score: [0, 0], round: 0, timeLeft: ROUND_TIME,
  finishes: [],
  acc: 0, hitstop: 0, slow: { s: 1, t: 0 },
  seq: null,           // countdown script: [{ at, run }]
  seqT: 0,
  aimKey: null, buffer: null,
  dragPt: null,        // the first point of a skill aimed with two
  rapidKey: null,      // a held-to-fire key; it keeps firing while other skills are aimed and cast
  cursor: { sx: innerWidth / 2, sy: innerHeight / 2, x: 0, z: 0 },
  holding: false,      // the key being aimed is winding its skill up
  aimT: 0,             // guest: time until the host is next told where a wound-up skill points
  mouseDown: false, moveRepeat: 0,
  ultWasReady: false,
  blade: 'azure', level: 1,
  // --- online ---
  net: null,
  // The room. Slot 0 is the host's, slot 1 the other side: a guest, a CPU, or still open.
  // `me` is this player's own seat. On the host a seat taken by a guest carries that guest's link.
  // `teams` is whether the match is fought in two teams (each seat says which), `ff` whether a team can hurt its own.
  lobby: { role: null, status: 'opening', url: '', error: '', slots: [], me: 0, edit: 0, stage: 0, teams: false, ff: false },
  peers: [],           // host, in a match: the guests playing, as { id, side, ack }
  spectate: false,     // nobody here is playing: both tops are CPUs
  outbox: [],          // host: events waiting to be sent
  snapT: 0, snapSeq: 0, tail: 0,
  inSeq: 0, ack: 0,    // guest: last input sent / host: last guest input applied
  pending: [],         // guest: inputs the host has not confirmed yet
  lastSnap: -1, corrections: 0, errSum: 0, errMax: 0, inbox: null, frames: 0,
};

const online = () => game.mode !== 'cpu';
const player = () => game.world.tops[game.side];
const rival = () => game.world.other(player());

const ui = new UI({
  // "again" repeats the same match: against a CPU at once, against a person by readying up in the room.
  again: () => { audio.ui(); if (online()) backToLobby(true); else if (game.lobby.role === 'host' && roomIsLocal() && !seats().some((p) => p.kind === 'open')) startLocalMatch(); else backToLobby(false); },
  lobby: () => { audio.ui(); backToLobby(false); },
  back: () => { audio.ui(); if (online() && game.mode === 'guest') { leaveOnline(); toTitle(); } else backToLobby(false); },
  quit: () => { audio.ui(); leaveOnline(); toTitle(); },
  pause: () => togglePause(),
  mute: () => { audio.unlock(); audio.setMuted(!audio.muted); ui.setMuted(audio.muted); },
  ui: () => { audio.unlock(); audio.ui(); },
  hover: () => audio.hover(),
  host: () => { audio.unlock(); audio.ui(); openRoom(); },
  ready: () => { audio.unlock(); audio.ui(); pressReady(); },
  start: () => { audio.unlock(); audio.ui(); pressStart(); },
  pick: (id) => { audio.unlock(); audio.ui(); pickBlade(id); },
  // Opens the blade picker on a seat (-1 closes it).
  edit: (i) => { audio.ui(); const lb = game.lobby; if (i < 0) lb.picking = false; else { lb.edit = i; lb.picking = true; } lobbyRefresh(); },
  slotKind: (i, kind) => { audio.ui(); setSlotKind(i, kind); },
  // Who sits in a seat, chosen from its menu: a kind and, for a CPU, a level.
  seat: (i, kind, level) => { audio.ui(); const p = game.lobby.slots[i]; if (p && level !== undefined && game.lobby.role === 'host' && p.link === undefined) p.level = level; setSlotKind(i, kind); },
  // 0: everyone for themselves, 1: two teams, 2: two teams with friendly fire
  rule: (n) => { audio.ui(); const lb = game.lobby; if (lb.role !== 'host') return; const was = lb.teams; lb.teams = n > 0; lb.ff = n === 2; if (was !== lb.teams) for (const p of lb.slots) p.ready = false; lobbyChanged(); },
  slotLevel: (i, n) => { audio.ui(); game.lobby.slots[i].level = n; lobbyChanged(); },
  mode: (teams) => { audio.ui(); const lb = game.lobby; if (lb.role !== 'host') return; lb.teams = !!teams; for (const p of lb.slots) p.ready = false; lobbyChanged(); },
  ff: (on) => { audio.ui(); const lb = game.lobby; if (lb.role !== 'host') return; lb.ff = !!on; lobbyChanged(); },
  team: (i) => { audio.ui(); switchTeam(i); },
  stage: (d) => { audio.ui(); const lb = game.lobby; if (lb.role !== 'host') return; lb.stage = (lb.stage + d + STAGES.length) % STAGES.length; lobbyChanged(); },
  copy: () => copyInvite(),
});

function showScreen(name) {
  for (const id of ['title', 'lobby', 'result', 'pause']) ui.show(id, id === name);
  if (name !== 'lobby') { game.lobby.picking = false; ui.show('picker', false); }
  ui.show('hud', name === 'hud');
  document.body.classList.toggle('menu', name !== 'hud');
}

function toTitle() {
  game.state = 'title'; game.mode = 'cpu'; game.side = 0; game.spectate = false; game.lobby.role = null;
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
// labels / notes: what each top is called on screen and a word about it, by side.
function beginMatch(world, side, labels, notes) {
  game.world = world; game.side = side;
  game.score = world.tops.map(() => 0); game.round = 0; game.finishes = [];
  game.paused = false;
  game.brains = [];
  view.stage.setStage(STAGES[world.stage]);
  view.setMatch(world, side);
  view.orbiting = false;
  showScreen('hud');
  ui.setMenuMode(online());
  ui.startMatch(world, side, labels, notes);
  audio.startMusic();
}

function startCpuMatch(bladeId, levelIdx) {
  game.mode = 'cpu'; game.spectate = false; ui.meLabel = '';
  game.blade = bladeId; game.level = levelIdx;
  const level = DIFFICULTY[levelIdx];
  const others = Object.keys(BLADES).filter((b) => b !== bladeId);
  const foe = params.get('foe') || others[(Math.random() * others.length) | 0];
  const w = new World(BLADES[bladeId], BLADES[foe], (Date.now() & 0xffffff) + 1, Number(params.get('stage') || 0));
  beginMatch(w, 0, ['YOU', 'CPU'], ['', level.name]);
  const c = rival();
  // The CPU winds up before firing so its skills can be read and dodged.
  for (const k of KEYS) c.windup[k] = (skillOf(c, k).tele || 0) * level.windup;
  game.brain = new CpuBrain(w, c, level);
  game.autoBrain = params.has('auto') ? new CpuBrain(w, player(), DIFFICULTY[1]) : null;
  startRound(1);
}

// Seats in play, in order: a seat set to "none" is left out.
const seats = () => game.lobby.slots.filter((p) => p.kind !== 'none');
// The blades for a match, with every "random" settled (no two alike while there are enough).
function drawBlades(list) {
  const out = list.slice(), ids = Object.keys(BLADES);
  out.forEach((b, i) => {
    if (b !== 'random') return;
    const free = ids.filter((id) => !out.includes(id));
    out[i] = (free.length ? free : ids)[(Math.random() * (free.length || ids.length)) | 0];
  });
  return out;
}
// CPUs wind up before firing so their skills can be read and dodged.
function cpuFor(w, t, level) {
  for (const k of KEYS) t.windup[k] = (skillOf(t, k).tele || 0) * level.windup;
  return new CpuBrain(w, t, level);
}

// A match set up in the room with nobody else connected: the host and CPUs, or CPUs alone.
function startLocalMatch() {
  const lb = game.lobby, S = seats();
  const blades = drawBlades(S.map((p) => p.blade));
  for (const p of lb.slots) p.ready = false;
  game.mode = 'cpu';
  game.peers = [];
  game.spectate = S[0].kind === 'cpu';
  const w = new World(blades.map((b) => BLADES[b]), { seed: (Date.now() & 0xffffff) + 1, stage: lb.stage, ...teamOpts(S) });
  let n = 0;
  const labels = S.map((p, i) => (p.kind === 'cpu' ? (S.filter((q) => q.kind === 'cpu').length > 1 ? 'CPU ' + ++n : 'CPU') : i === 0 ? 'YOU' : 'RIVAL'));
  ui.meLabel = '';
  beginMatch(w, 0, labels, S.map((p) => (p.kind === 'cpu' ? DIFFICULTY[p.level].name : '')));
  game.brain = game.autoBrain = null;
  game.brains = S.map((p, i) => (p.kind === 'cpu' ? cpuFor(w, w.tops[i], DIFFICULTY[p.level]) : null)).filter(Boolean);
  startRound(1);
}

// Host and guest both build the same world: side 0 is the host's top.
// `kinds` says which tops are CPUs (the host plays those).
function startOnlineMatch(blades, stage = 0, kinds = [], mine = 0, T = {}) {
  game.spectate = false; ui.meLabel = '';
  const w = new World(blades.map((b) => BLADES[b]), { seed: 1, stage, ...T });
  let n = 0;
  const cpus = kinds.filter((k) => k === 'cpu').length;
  beginMatch(w, mine, blades.map((_, i) => (kinds[i] === 'cpu' ? (cpus > 1 ? 'CPU ' + ++n : 'CPU') : i === mine ? 'YOU' : blades.length > 2 ? 'P' + (i + 1) : 'RIVAL')), []);
  game.brain = null;
  game.outbox.length = 0; game.pending.length = 0;
  game.inSeq = 0; game.ack = 0; game.snapSeq = 0; for (const p of game.peers) p.ack = 0; game.lastSnap = -1; game.corrections = 0; game.errSum = game.errMax = 0; game.inbox = null;
  for (const p of game.lobby.slots) p.ready = false;
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
  const final = game.score.filter((n) => n === ROUNDS_TO_WIN - 1).length > 1 && !game.score.some((n) => n < ROUNDS_TO_WIN - 1 && w.tops.length === 2);
  const quick = params.has('quick');
  const t0 = quick ? 0.1 : 1.5, gap = quick ? 0.05 : 0.62;
  const release = () => { for (const v of view.tops) { v.hold = false; v.dropV = 0; } };
  game.seqT = 0;
  game.seq = [
    { at: 0.05, run: () => ui.announce(final ? 'FINAL ROUND' : 'ROUND ' + n, w.tops.length > 2 ? `${w.tops.length} BLADES　BATTLE ROYAL` : `${player().blade.en}　vs　${rival().blade.en}`, 'round', 1.4) },
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
  const won = e.winner.team === player().team;
  for (const t of game.world.tops) if (t.team === e.winner.team) game.score[t.side]++;
  game.finishes.push(`R${game.round} ${won ? 'WIN' : 'LOSE'}（${{ over: 'オーバー', burst: 'バースト', spin: 'スピン', time: '判定' }[e.kind]}）`);
  game.state = 'finish';
  game.aimKey = null; game.buffer = null;
  game.slow = { s: 0.16, t: e.kind === 'time' ? 0.3 : 1.25 };
  game.hitstop = e.kind === 'time' ? 0 : 0.2;
  game.tail = 4; // a few more snapshots so the guest sees the final state
  ui.finish(e.kind, won, game.spectate ? `${e.winner.blade.name} が取った` : '');
  ui.setScore(game.score);
  ui.flash('#fff', e.kind === 'time' ? 0.2 : 0.7);
  audio.finish(won);
  game.seqT = 0;
  // The guest waits for the host to announce what comes next.
  if (game.mode === 'guest') { game.seq = null; return; }
  const done = game.score.some((n) => n >= ROUNDS_TO_WIN);
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
  const best = Math.max(...game.score), champ = game.world.tops[game.score.indexOf(best)];
  const lead = game.score[game.side] === best;
  const teams = new Set(game.world.tops.map((t) => t.team)).size < game.world.tops.length;
  ui.showResult(lead, game.score, game.world, game.finishes, game.spectate ? `${teams ? 'チーム' + 'AB'[champ.team] : champ.blade.name} の勝ち` : '');
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

const mySlot = () => game.lobby.slots[game.lobby.me];
// Seats held by guests (the host's own does not count).
const guestSeats = () => game.lobby.slots.filter((p) => p.kind === 'human' && p.link !== undefined);
// Nobody else is in the room: a match is the host and CPUs.
const roomIsLocal = () => !guestSeats().length;

function enterLobby(role) {
  game.mode = role; game.state = 'lobby';
  const lb = game.lobby;
  lb.role = role; lb.status = 'opening'; lb.url = ''; lb.error = '';
  const blade = BLADES[ui.blade] || ui.blade === 'random' ? ui.blade : 'azure';
  // Four seats. The third and fourth start empty; the host can put CPUs in them.
  const none = () => ({ kind: 'none', blade: 'random', level: 1, ready: false });
  lb.slots = role === 'host'
    ? [{ kind: 'human', blade, level: 1, ready: false }, { kind: 'open', blade: 'random', level: 1, ready: false }, none(), none()]
    : [{ kind: 'human', blade: 'azure', level: 1, ready: false }, { kind: 'human', blade, level: 1, ready: false }, none(), none()]; // until the host says which seat is ours
  lb.me = role === 'host' ? 0 : 1;
  lb.teams = false; lb.ff = false;
  lb.slots.forEach((p, i) => { p.team = i % 2; });
  lb.edit = lb.me;
  lb.picking = false;
  lb.stage = 0;
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
  // A guest can pass the invitation on too: the room takes up to four.
  game.lobby.url = inviteUrl(code);
  newNet().join(code);
}

// The room as the guests are told it, and which seat is theirs.
function sendRoom() {
  const lb = game.lobby;
  if (lb.role !== 'host' || !game.net) return;
  const slots = lb.slots.map((p) => ({ kind: p.kind, blade: p.blade, level: p.level, ready: p.ready, team: p.team }));
  lb.slots.forEach((p, i) => { if (p.link !== undefined) game.net.send({ t: 'room', slots, stage: lb.stage, teams: lb.teams, ff: lb.ff, you: i }, p.link); });
}

// Something in the room changed here: tell the others, then refresh.
// The host owns the room; a guest only reports its own blade and readiness.
function lobbyChanged() {
  const lb = game.lobby;
  if (game.net && game.net.connected) {
    if (lb.role === 'host') sendRoom();
    else game.net.send({ t: 'lobby', blade: mySlot().blade, ready: mySlot().ready, team: mySlot().team });
  }
  lobbyRefresh();
}

// Redraws the room. The arena turning behind it is the stage chosen.
function lobbyRefresh() {
  if (game.state === 'lobby') { ui.showLobby(game.lobby); view.stage.setStage(STAGES[game.lobby.stage]); }
}

// Every seat is filled, every person in the room is ready, and in a team match both teams have someone.
const roomReady = () => {
  const S = seats();
  if (S.length < 2 || !S.every((p) => p.kind === 'cpu' || (p.kind === 'human' && p.ready))) return false;
  return !game.lobby.teams || new Set(S.map((p) => p.team)).size === 2;
};
// What a match is told about teams: who is on which, and whether they can hurt their own.
const teamOpts = (S) => (game.lobby.teams ? { teams: S.map((p) => p.team), ff: game.lobby.ff } : {});

// A seat changes team: the host can move anyone, a guest only itself.
function switchTeam(i) {
  const lb = game.lobby, p = lb.slots[i];
  if (!lb.teams || !p || p.kind === 'none' || p.kind === 'open') return;
  if (lb.role !== 'host' && i !== lb.me) return;
  if (p.kind === 'human' && p.ready) return;
  p.team = p.team ? 0 : 1;
  lobbyChanged();
}

// The host starts an online match once everyone has readied up. Any CPU
// seats are played by the host's machine.
function startOnline() {
  const lb = game.lobby, S = seats();
  if (lb.role !== 'host' || game.state !== 'lobby' || roomIsLocal() || !roomReady() || !(game.net && game.net.connected)) return;
  // "Random" is settled here, so everyone is told the same blades.
  const blades = drawBlades(S.map((p) => p.blade)), kinds = S.map((p) => p.kind);
  game.mode = 'host';
  // A top's side is its place among the seats in play.
  game.peers = S.map((p, side) => (p.link !== undefined ? { id: p.link, side, ack: 0 } : null)).filter(Boolean);
  const T = teamOpts(S);
  for (const p of game.peers) game.net.send({ t: 'start', blades, stage: lb.stage, kinds, you: p.side, ...T }, p.id);
  startOnlineMatch(blades, lb.stage, kinds, 0, T);
  const w = game.world;
  game.brains = S.map((p, i) => (p.kind === 'cpu' ? cpuFor(w, w.tops[i], DIFFICULTY[p.level]) : null)).filter(Boolean);
  // The host may hand its own top to a CPU and watch.
  if (S[0].kind === 'cpu') game.spectate = true;
  startRound(1);
}

// Every person in the room says when they are ready.
function pressReady() {
  const lb = game.lobby, p = mySlot();
  lb.picking = false;
  if (p.kind !== 'human' || (lb.role === 'guest' && lb.status !== 'connected')) return;
  p.ready = !p.ready;
  lobbyChanged();
}

// The host starts the game once every person is ready (CPUs always are).
function pressStart() {
  const lb = game.lobby;
  lb.picking = false;
  if (lb.role !== 'host' || game.state !== 'lobby' || STAGES[lb.stage].soon) return;
  if (!roomReady()) return;
  if (roomIsLocal()) startLocalMatch(); else startOnline();
}

// A blade for whichever slot is being edited: your own, or (for the host) a CPU's.
function pickBlade(id) {
  // `lb.me`, not a fixed seat: a guest is put wherever there is room, which is
  // 3P or 4P when 2P is closed or taken.
  const lb = game.lobby, host = lb.role === 'host', mine = lb.me;
  if (game.state !== 'lobby') return;
  let i = lb.edit;
  const p = lb.slots[i];
  const own = i === mine && p.kind === 'human' && !p.ready, cpu = host && p.kind === 'cpu';
  if (!own && !cpu) return;
  if (id !== 'random' && !BLADES[id]) return;
  p.blade = id;
  if (own) ui.blade = id;
  lobbyChanged();
}

function setSlotKind(i, kind) {
  const lb = game.lobby, p = lb.slots[i];
  // A seat a guest is sitting in is theirs. The host's own is itself or a CPU;
  // the others wait for a person, hold a CPU, or are left out.
  if (lb.role !== 'host' || p.link !== undefined) return;
  if (i === 0 ? kind !== 'human' && kind !== 'cpu' : !['open', 'cpu', 'none'].includes(kind)) return;
  p.kind = kind; p.ready = false;
  if (kind === 'human') p.blade = BLADES[ui.blade] || ui.blade === 'random' ? ui.blade : 'azure';
  else if (kind === 'cpu' && !BLADES[p.blade]) p.blade = 'random';
  lb.slots[0].ready = false;
  lb.edit = kind === 'open' || kind === 'none' ? 0 : i;
  lb.picking = false;
  lobbyChanged();
}

// Back to the room after a match. Online the link stays up for a rematch.
function backToLobby(ready) {
  const lb = game.lobby;
  if (!lb.role || (lb.role === 'guest' && !(game.net && game.net.connected))) { leaveOnline(); toTitle(); return; }
  game.mode = lb.role;
  game.state = 'lobby'; game.world = null; game.seq = null; game.paused = false; game.spectate = false;
  view.setMatch(null, 0);
  view.orbiting = true;
  audio.stopMusic();
  ui.labels.innerHTML = '';
  ui.vignette.style.opacity = 0;
  ui.setNet('');
  showScreen('lobby');
  for (const p of lb.slots) p.ready = false;
  // Asking for a rematch comes back already ready.
  if (ready && mySlot().kind === 'human') mySlot().ready = true;
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
    // A host without a connection can still play CPUs; a guest has nowhere to be.
    if (lb.role === 'host') { if (game.state !== 'lobby' && online()) { ui.toast(lb.error); backToLobby(false); return; } }
    else if (game.state !== 'lobby') { ui.toast(lb.error); leaveOnline(); toTitle(); return; }
  } else {
    lb.status = state;
    if (state === 'waiting') lb.url = inviteUrl(detail);
  }
  if (game.state === 'lobby') ui.showLobby(lb);
}

function netOpen(id) {
  const lb = game.lobby;
  lb.status = 'connected';
  game.net.send({ t: 'hello', v: PROTOCOL, build: VERSION, blade: mySlot().blade, ready: mySlot().ready }, id);
  if (game.state === 'lobby') ui.showLobby(lb);
}

function netClosed(reason, id) {
  const lb = game.lobby;
  const mid = game.state !== 'lobby' && game.state !== 'title';
  if (lb.role === 'host') {
    // The room stays open so the same or another guest can come in.
    const i = lb.slots.findIndex((p) => p.link === id);
    if (i >= 0) lb.slots[i] = { kind: 'open', blade: 'random', level: 1, ready: false, team: lb.slots[i].team };
    if (!game.net.connected) { lb.status = 'waiting'; ui.setNet(''); }
    if (lb.edit === i) { lb.edit = 0; lb.picking = false; }
    const peer = game.peers.find((p) => p.id === id);
    game.peers = game.peers.filter((p) => p.id !== id);
    if (i < 0) return;
    if (online() && mid && peer) {
      if (game.peers.length && game.world) {
        // Others are still playing: a CPU takes over the top that was left.
        const t = game.world.tops[peer.side];
        if (t && !t.gone) game.brains.push(cpuFor(game.world, t, DIFFICULTY[1]));
        ui.toast(`${i + 1}P との接続が切れました。CPUが引き継ぎます`);
        sendRoom();
        return;
      }
      backToLobby(false);
      ui.toast('相手との接続が切れました');
      return;
    }
    ui.toast(`${i + 1}P が退出しました`);
    lobbyChanged();
  } else if (lb.role === 'guest') {
    ui.setNet('');
    ui.toast(reason === 'timeout' ? '接続がタイムアウトしました' : 'ホストとの接続が切れました');
    leaveOnline();
    toTitle();
  }
}

const num = (v) => (Number.isFinite(v) ? Math.max(-50, Math.min(50, v)) : 0);

function netMessage(m, id) {
  const lb = game.lobby, w = game.world;
  switch (m.t) {
    case 'hello':
      if (m.v !== PROTOCOL) {
        // A guest on another version is turned away; the room goes on.
        if (lb.role === 'host') { game.net.send({ t: 'version' }, id); game.net.drop('version', id); return; }
        netStatus('failed', 'version'); game.net.leave(); return;
      }
      // Compatible, but not the same build: worth knowing when something looks off.
      if (typeof m.build === 'string' && m.build !== VERSION) ui.toast(`相手は別の版です（${m.build.slice(0, 40)}）`);
      if (lb.role !== 'host') break; // the host's room follows
    // falls through
    case 'lobby': {
      // A guest reporting itself. New, it takes a seat that is waiting for a
      // person, or failing that one that was left out.
      if (lb.role !== 'host' || !(BLADES[m.blade] || m.blade === 'random')) return;
      let i = lb.slots.findIndex((p) => p.link === id);
      const fresh = i < 0;
      if (fresh) {
        i = lb.slots.findIndex((p, k) => k > 0 && p.kind === 'open');
        if (i < 0) i = lb.slots.findIndex((p, k) => k > 0 && p.kind === 'none');
        if (i < 0) { game.net.send({ t: 'full' }, id); setTimeout(() => game.net && game.net.drop('full', id), 400); return; }
      }
      lb.slots[i] = { kind: 'human', blade: m.blade, level: 1, ready: !!m.ready, link: id, team: fresh ? lb.slots[i].team : m.team ? 1 : 0 };
      // Seeing someone in the room while still on the result screen means they want a rematch.
      if (game.state === 'result' && online()) ui.toast(m.ready ? `${i + 1}P が再戦を待っています` : `${i + 1}P がルームに戻りました`);
      else if (fresh && game.state !== 'lobby') ui.toast('招待した相手がルームに入りました');
      else if (fresh) ui.toast(`${i + 1}P が入りました`);
      sendRoom();
      lobbyRefresh();
      break;
    }
    case 'room': {
      // The host's room as it stands, and which seat is ours. What we chose for
      // our own seat stays ours.
      if (lb.role !== 'guest' || !Array.isArray(m.slots) || m.slots.length !== 4) return;
      const you = m.you | 0;
      if (you < 1 || you > 3) return;
      const mine = lb.slots[lb.me];
      const seat = (q) => ({ kind: ['human', 'cpu', 'open', 'none'].includes(q && q.kind) ? q.kind : 'none', blade: q && (BLADES[q.blade] || q.blade === 'random') ? q.blade : 'random', level: Math.max(0, Math.min(DIFFICULTY.length - 1, (q && q.level) | 0)), ready: !!(q && q.ready), team: q && q.team ? 1 : 0 });
      lb.slots = m.slots.map(seat);
      // Our own blade and readiness are ours; which team we are on is the host's to say.
      lb.slots[you] = { kind: 'human', blade: mine.blade, level: 1, ready: mine.ready, team: lb.slots[you].team };
      lb.teams = !!m.teams; lb.ff = !!m.ff;
      if (lb.edit === lb.me) lb.edit = you;
      lb.me = you;
      lb.stage = Math.max(0, Math.min(STAGES.length - 1, m.stage | 0));
      if (game.state === 'result') ui.toast('ホストがルームに戻りました');
      lobbyRefresh();
      break;
    }
    case 'version': netStatus('failed', 'version'); break;
    case 'full': netStatus('failed', 'full'); break;
    case 'bye': if (game.net) game.net.drop('bye', id); break;

    // ---- host -> guest ----
    case 'start':
      if (lb.role !== 'guest' || !Array.isArray(m.blades) || m.blades.length < 2 || m.blades.length > 4 || !m.blades.every((b) => BLADES[b])) return;
      game.mode = 'guest';
      lb.stage = Math.max(0, Math.min(STAGES.length - 1, m.stage | 0));
      startOnlineMatch(m.blades, lb.stage, Array.isArray(m.kinds) ? m.kinds : [], Math.max(0, Math.min(m.blades.length - 1, m.you | 0)),
        Array.isArray(m.teams) && m.teams.length === m.blades.length ? { teams: m.teams.map((t) => (t ? 1 : 0)), ff: !!m.ff } : {});
      break;
    case 'round':
      if (game.mode !== 'guest' || !w) return;
      game.score = w.tops.map((_, i) => m.score[i] | 0);
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
      game.score = w.tops.map((_, i) => m.score[i] | 0);
      m.stats.forEach((s, i) => Object.assign(w.tops[i].stats, s));
      showResult();
      break;

    // ---- guest -> host ----
    case 'in': {
      if (game.mode !== 'host' || !w || game.state !== 'fight') return;
      const peer = game.peers.find((p) => p.id === id), t = peer && w.tops[peer.side];
      if (!t) return;
      if (m.k === 'm') w.issueMove(t, num(m.x), num(m.z), !!m.f);
      else if (m.k === 'a') w.aimHold(t, num(m.x), num(m.z));
      else if (m.k === 'h' && KEYS.includes(m.key)) w.hold(t, m.key);
      else if (m.k === 'c' && KEYS.includes(m.key)) w.cast(t, m.key, num(m.x), num(m.z), 0, m.bx === undefined ? undefined : num(m.bx), m.bz === undefined ? undefined : num(m.bz));
      peer.ack = m.s | 0;
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
    if (p.k === 'm') w.issueMove(me, p.x, p.z, !!p.f); else if (p.k === 'a') w.aimHold(me, p.x, p.z); else if (p.k === 'h') w.hold(me, p.key); else w.cast(me, p.key, p.x, p.z, 0, p.bx, p.bz);
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
      if (prop === 'hold') return (top, key) => doHold(key);
      if (prop === 'issueMove') return (top, x, z, fresh) => doMove(x, z, fresh);
      const v = target[prop];
      return typeof v === 'function' ? v.bind(target) : v;
    },
  });
}

// ------------------------------------------------------------------ input --
// Every order from this player goes through these two. The guest applies it
// locally at once and also sends it to the host.
// `fresh`: a new click, as opposed to the repeat of a button held down.
function doMove(x, z, fresh = false) {
  if (game.spectate) return false;
  const w = game.world, me = player();
  if (!w.issueMove(me, x, z, fresh)) return false;
  if (game.mode === 'guest') sendInput(fresh ? { k: 'm', x: me.cmd.x, z: me.cmd.z, f: 1 } : { k: 'm', x: me.cmd.x, z: me.cmd.z });
  return true;
}

// (bx, bz): a second point, for a skill aimed with two.
function doCast(key, x, z, bx, bz) {
  if (game.spectate) return false;
  const w = game.world;
  if (!w.cast(player(), key, x, z, 0, bx, bz)) return false;
  if (game.mode === 'guest') { w.events.length = 0; sendInput(bx === undefined ? { k: 'c', key, x, z } : { k: 'c', key, x, z, bx: Math.round(bx * 100) / 100, bz: Math.round(bz * 100) / 100 }); }
  return true;
}

// Begins winding up a skill that is charged by holding its key.
function doHold(key) {
  if (game.spectate || !game.world.hold(player(), key)) return false;
  if (game.mode === 'guest') { game.world.events.length = 0; sendInput({ k: 'h', key, x: 0, z: 0 }); }
  return true;
}

// While a skill is being wound up, the others are shown which way it points.
// The guest tells the host a few times a second, not every frame.
function aimHeld(rdt) {
  const me = player();
  // A wind-up that ended by itself (it went off when full, or was knocked out
  // of the hands) leaves nothing to let go of.
  if (!me.hold && game.holding) { game.holding = false; game.aimKey = null; }
  if (!me.hold || game.spectate) { game.aimT = 0; return; }
  refreshCursor();
  game.world.aimHold(me, game.cursor.x, game.cursor.z);
  if (game.mode !== 'guest') return;
  game.aimT -= rdt;
  if (game.aimT <= 0) { game.aimT = 0.1; sendInput({ k: 'a', x: game.cursor.x, z: game.cursor.z }); }
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
  if (doMove(game.cursor.x, game.cursor.z, !silent) && !silent) {
    view.marker(me.cmd.x, me.cmd.z);
    audio.move();
  }
}

function tryCast(key, x, z, buffered, bx, bz) {
  if (game.state !== 'fight' || game.paused || game.spectate) return false;
  const me = player();
  if (!doCast(key, x, z, bx, bz)) {
    // Pressed a moment too early (still reeling or mid-dash): hold the input
    // briefly and fire as soon as the top can act.
    const w = game.world;
    // Ready, but something about the situation rules it out (out of range, no soldier...).
    const why = !w.busy(me) && w.ready(me, key) ? w.blocked(me, key) : null;
    const soon = !why && w.ready(me, key, 0.25) && !me.air && !me.out;
    if (soon && !buffered) game.buffer = { key, x, z, t: 0.45 };
    else if (!buffered) { audio.denied(); ui.denied(key); if (why) popAt(me, why, 'word dim'); }
    return false;
  }
  game.buffer = null;
  ui.castFx(key);
  return true;
}

canvas.addEventListener('mousemove', (e) => { game.cursor.sx = e.clientX; game.cursor.sy = e.clientY; });
canvas.addEventListener('mousedown', (e) => {
  audio.unlock();
  game.cursor.sx = e.clientX; game.cursor.sy = e.clientY;
  if (e.button === 2 && game.aimKey && !(game.world && player().hold)) { game.aimKey = null; return; }
  if (e.button !== 0 && e.button !== 2) return;
  game.mouseDown = true; game.moveRepeat = 0.12;
  orderMove(false);
});
window.addEventListener('mouseup', () => { game.mouseDown = false; });
canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  if (!['countdown', 'fight', 'finish'].includes(game.state) || game.paused) return;
  view.zoomBy(e.deltaY * (e.deltaMode === 1 ? 33 : 1));
}, { passive: false });
window.addEventListener('contextmenu', (e) => e.preventDefault());

window.addEventListener('keydown', (e) => {
  if (e.repeat || e.target.tagName === 'INPUT') return;
  const k = e.key.toUpperCase();
  if (k === 'ESCAPE') { if (game.aimKey) { if (!(game.world && player().hold)) game.aimKey = null; } else togglePause(); return; }
  if (k === 'P') return togglePause();
  if (k === 'M') { audio.unlock(); audio.setMuted(!audio.muted); ui.setMuted(audio.muted); return; }
  if (game.state !== 'fight' || game.paused || game.spectate || !KEYS.includes(k)) return;
  audio.unlock();
  // What the key does can change mid-fight (a second stage, a copied skill).
  const me = player(), S = game.world.aimSkill(me, k), base = skillOf(me, k);
  if (base.passive) return; // always on: the key does nothing
  // Held-to-fire: it needs no aiming indicator (the stream itself shows where
  // it goes) and leaves the other keys free.
  if (base.rapid) { game.rapidKey = k; return; }
  // Some need no aiming but still care where the cursor is (which soldier to fly to).
  if (S.aim === 'self' && S.cursor) { refreshCursor(); tryCast(k, game.cursor.x, game.cursor.z); return; }
  if (S.aim === 'self') { tryCast(k, me.x, me.z); return; }
  // A step that can be taken while another skill is being aimed: it goes at
  // once, toward the cursor, and the aim that was held stays held.
  if (S.snap && game.aimKey && game.aimKey !== k) { refreshCursor(); tryCast(k, game.cursor.x, game.cursor.z); return; }
  // Aiming is allowed while briefly unable to act; only a real cooldown refuses.
  // (Between two swings of a chain the next one may be lined up straight away.)
  if (!(game.world.ready(me, k, 0.25) || (base.pause && me.re[k] > 0)) || me.air || me.out) { audio.denied(); ui.denied(k); return; }
  game.aimKey = k;
  // A skill aimed with two points: where the key went down is the first.
  refreshCursor();
  game.dragPt = S.drag ? { x: game.cursor.x, z: game.cursor.z } : null;
  // Some skills wind up for as long as the key stays down.
  game.holding = !!S.wind && doHold(k);
});
window.addEventListener('keyup', (e) => {
  const k = e.key.toUpperCase();
  if (k === game.rapidKey) { game.rapidKey = null; return; }
  if (k !== game.aimKey) return;
  game.aimKey = null;
  refreshCursor();
  const dp = game.dragPt;
  game.dragPt = null;
  // Where it went down, then which way it was let go.
  if (dp) tryCast(k, dp.x, dp.z, false, game.cursor.x, game.cursor.z);
  else tryCast(k, game.cursor.x, game.cursor.z);
});
window.addEventListener('blur', () => {
  game.aimKey = null; game.rapidKey = null; game.mouseDown = false;
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

// What happens between tops in another world than this player's is neither seen nor heard.
function elsewhere(e) {
  if (['finish', 'ko', 'realm', 'realmEnd'].includes(e.type)) return false;
  const who = e.top || e.a || (e.proj && e.proj.owner) || (e.zone && e.zone.owner) || e.src;
  return !!who && who.realm !== player().realm;
}

function onEvent(e) {
  if (elsewhere(e)) return;
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
        popAt(e.src === e.a ? e.b : e.a, e.kind === 'dash' ? 'DASH HIT!' : !e.src.blade.emp ? 'POWER HIT!' : e.src.blade.emp.id === 'phantom' ? 'PHANTOM STRIKE!' : e.src.blade.emp.en + '!', 'word');
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
    case 'bump': audio.wall(e.power * 0.6, false); break;
    case 'hold': audio.windup(); break;
    case 'formed': audio.ultReady(); break;
    case 'cast':
      if (e.windup > 0) audio.windup();
      if (e.ult) ui.cutIn(e.base, e.top.blade.css, !mine(e.top));
      break;
    case 'blink': audio.blink(); break;
    case 'blinkEnd': if (mine(e.top)) popAt(e.top, 'POWER UP', 'word gold'); break;
    case 'zone': {
      const k = e.zone.kind;
      if (k === 'sanctuary') audio.heal(); else if (k === 'quake' || k === 'grenade') audio.windup(); else if (e.zone.skill.ult) audio.leap(); else audio.guard();
      break;
    }
    case 'blast':
      if (e.skill.ult) { audio.meteor(); ui.flash('#fff', 0.4); } else audio.quake();
      if (e.hit) { dmgPop(e.target, e.hit); game.hitstop = e.skill.ult ? 0.18 : 0.1; }
      break;
    case 'strike':
      audio.projHit();
      dmgPop(e.top, e.dmg);
      game.hitstop = e.big ? 0.18 : 0.07;
      if (e.big) ui.flash(e.src.blade.css, 0.3);
      break;
    case 'say': popAt(e.top, e.text, 'word ' + (e.tone || '')); break;
    case 'beam':
      audio.meteor();
      if (e.skill.ult) ui.flash('#fff', 0.45);
      if (e.hit) { dmgPop(e.target, e.hit); game.hitstop = e.skill.ult ? 0.2 : 0.1; }
      break;
    case 'dot': dmgPop(e.top, e.dmg); break;
    case 'warp': audio.blink(); break;
    case 'buff':
      if (e.off) audio.move(); else audio.guard();
      if (e.skill.ult && mine(e.top)) popAt(e.top, 'POWER UP', 'word gold');
      break;
    case 'cone':
      if (e.skill.rapid) { if (e.hit >= 12) dmgPop(e.target, e.hit); break; }
      audio.flare();
      if (e.hit) { dmgPop(e.target, e.hit); game.hitstop = 0.07; }
      break;
    case 'fling': audio.dash(); break;
    case 'chan':
      audio.leap();
      game.slow = { s: 0.4, t: 0.25 };
      break;
    case 'egg':
      audio.guard();
      popAt(e.top, 'EGG', 'word gold');
      ui.flash(e.top.blade.css, 0.3);
      break;
    case 'rebirth':
      audio.heal();
      popAt(e.top, 'REBIRTH!', 'word gold');
      ui.flash(e.top.blade.css, 0.4);
      break;
    case 'quake':
      audio.quake();
      if (e.hit) { dmgPop(e.target, e.hit); game.hitstop = 0.12; }
      break;
    case 'charge':
      if (e.skill.ult) { audio.leap(); game.slow = { s: 0.4, t: 0.25 }; } else audio.windup();
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
    case 'shoot': if (e.proj.skill.chain) audio.chain(); else if (e.proj.skill.rapid) audio.tone('square', 1900, 1100, 0.045, 0.07); else audio.shoot(); break;
    case 'reflect':
      audio.parry();
      popAt(e.top, 'REFLECT!', 'word gold');
      game.hitstop = 0.1;
      break;
    case 'projHit':
      // A stream of small shots: a tick each, no freeze.
      if (e.proj.skill.rapid) { audio.tone('square', 700, 300, 0.04, 0.09); dmgPop(e.top, e.dmg); break; }
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
    case 'realm':
      // Those taken see their world change; the rest only hear it happen.
      audio.leap();
      if (mine(e.top) || mine(e.target)) { audio.meteor(); ui.flash(e.top.blade.css, 0.6); }
      break;
    case 'realmEnd':
      if (mine(e.top) || mine(e.target)) { audio.blink(); ui.flash('#fff', 0.35); }
      break;
    case 'ko':
      // One top is out; the round goes on for the rest.
      ui.toast(`${e.top.blade.name} 脱落（${{ over: 'オーバー', burst: 'バースト', spin: 'スピン', time: '判定' }[e.kind]}）`);
      ui.flash('#fff', 0.25);
      audio.clash(22);
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
  for (const p of game.peers) net.sendPacket(encodeSnapshot(game.world, { seq: game.snapSeq, ack: p.ack, timeLeft: game.timeLeft }), p.id);
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
      // A key held on a rapid-fire skill shoots at the cursor every time it comes off cooldown.
      if (game.rapidKey && game.state === 'fight' && !game.paused && w.canCast(player(), game.rapidKey)) {
        refreshCursor();
        doCast(game.rapidKey, game.cursor.x, game.cursor.z);
      }
      if (game.state === 'fight' && !game.paused) aimHeld(rdt);
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
          for (const b of game.brains) if (!b.me.gone) b.update(STEP);
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
    if (game.aimKey) aim = { key: game.aimKey, x: game.cursor.x, z: game.cursor.z, from: game.dragPt };
  }
  // Shut in a realm, this player's whole screen is somewhere else.
  document.body.classList.toggle('realm', !!w && ['fight', 'finish'].includes(game.state) && player().realm > 0);
  view.update(dt, frozen() ? 0 : rdt, aim);
  if (w && ['countdown', 'fight', 'finish'].includes(game.state)) {
    ui.update(w, view, game.timeLeft, game.aimKey || game.rapidKey, rdt);
    audio.intensity = 1 - Math.min(...w.tops.filter((t) => !t.gone).map(spinRatio), 1);
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
