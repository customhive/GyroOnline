// DOM heads-up display, menus and floating combat text.
import { BLADES, DIFFICULTY, ROUNDS_TO_WIN, KEYS, skillOf, kitOf } from './config.js';

const $ = (s, r = document) => r.querySelector(s);
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };

const svg = (body) => `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
const ICONS = {
  sonic: svg('<path d="M31 5a20 20 0 1 0 0 38 15 19 0 0 1 0-38z" fill="currentColor" stroke="none"/><path d="M4 16h9M2 24h9M4 32h9" stroke-width="2.5" opacity=".6"/>'),
  phantom: svg('<circle cx="33" cy="24" r="9" fill="currentColor" stroke="none"/><circle cx="20" cy="24" r="9" stroke-width="3" opacity=".6" stroke-dasharray="4 4"/><circle cx="10" cy="24" r="7" stroke-width="2.5" opacity=".3" stroke-dasharray="3 4"/>'),
  blitz: svg('<path d="M6 9l15 15L6 39M19 9l15 15-15 15" stroke-width="5"/><path d="M36 14l8 10-8 10" stroke-width="4" opacity=".55"/>'),
  meteor: svg('<circle cx="30" cy="31" r="11" fill="currentColor" stroke="none"/><path d="M5 4l15 17M15 3l11 13M3 15l12 12" stroke-width="3.5" opacity=".7"/><path d="M12 44h34" stroke-width="2.5" opacity=".5"/>'),
  quake: svg('<path d="M24 4l8 26H16z" fill="currentColor" stroke="none"/><path d="M9 16l5 16H5zM39 14l5 18h-9z" fill="currentColor" stroke="none" opacity=".6"/><path d="M3 38l8-3 6 5 7-5 7 5 6-5 8 3" stroke-width="3.5"/>'),
  aegis: svg('<path d="M24 4l17 6v13c0 10-7 17-17 21C14 40 7 33 7 23V10z" stroke-width="3.5"/><path d="M24 12l9 3v8c0 6-4 10-9 12z" fill="currentColor" stroke="none"/>'),
  anchor: svg('<path d="M30 6l12 12-8 8-12-12z" fill="currentColor" stroke="none"/><ellipse cx="19" cy="29" rx="6" ry="3.5" transform="rotate(-45 19 29)" stroke-width="3.5"/><ellipse cx="10" cy="38" rx="6" ry="3.5" transform="rotate(-45 10 38)" stroke-width="3.5" opacity=".65"/>'),
  nova: svg('<circle cx="24" cy="24" r="7" fill="currentColor" stroke="none"/><circle cx="24" cy="24" r="13" stroke-width="3"/><path d="M24 2v6M24 40v6M2 24h6M40 24h6M8 8l5 5M35 35l5 5M40 8l-5 5M13 35l-5 5" stroke-width="3.5" opacity=".75"/>'),
  flare: svg('<path d="M6 24L42 6v36z" fill="currentColor" stroke="none" opacity=".35"/><path d="M6 24L42 6M6 24l36 18" stroke-width="3"/><path d="M18 24c4-4 4 4 8 0s4 4 8 0" stroke-width="3.5"/>'),
  sanctuary: svg('<circle cx="24" cy="24" r="19" stroke-width="3" stroke-dasharray="6 5"/><path d="M24 13v22M13 24h22" stroke-width="7"/>'),
  satellite: svg('<circle cx="24" cy="24" r="7" stroke-width="3.5"/><circle cx="24" cy="6" r="5" fill="currentColor" stroke="none"/><circle cx="8.5" cy="33" r="5" fill="currentColor" stroke="none"/><circle cx="39.5" cy="33" r="5" fill="currentColor" stroke="none"/>'),
  eclipse: svg('<circle cx="29" cy="19" r="13" fill="currentColor" stroke="none"/><circle cx="23" cy="24" r="12" fill="#0a0f1e" stroke="currentColor" stroke-width="2.5"/><path d="M6 42c6-2 8-6 12-9" stroke-width="3.5" opacity=".7"/>'),
};
const FINISH = {
  over: ['OVER FINISH', '場外へ吹き飛ばした！'],
  burst: ['BURST FINISH', '一撃で回転を断ち切った！'],
  spin: ['SPIN FINISH', '回転が尽きた！'],
  time: ['TIME UP', '残り回転数で判定'],
};

export class UI {
  constructor(handlers) {
    this.h = handlers;
    this.hud = $('#hud');
    this.labels = $('#labels');
    this.announceEl = $('#announce');
    this.cutin = $('#cutin');
    this.lockEl = $('#lock');
    this.vignette = $('#vignette');
    this.flashEl = $('#flash');
    this.blade = 'azure';
    this.level = 1;
    this.side = 0;        // which top is "you" (1 when playing as the guest online)
    this.fighters = [this.buildFighter(0), this.buildFighter(1)];
    this.skills = {};
    this.buildTitle();
    this.tags = [];
    this.lastTime = -1;
    $('#btn-mute').onclick = () => this.h.mute();
    $('#btn-pause').onclick = () => this.h.pause();
    $('#btn-resume').onclick = () => this.h.pause();
    $('#btn-quit').onclick = () => this.h.quit();
    $('#btn-again').onclick = () => this.h.again();
    $('#btn-back').onclick = () => this.h.quit();
    $('#btn-host').onclick = () => this.h.host();
    $('#lb-leave').onclick = () => this.h.quit();
    $('#lb-ready').onclick = () => this.h.ready();
    $('#lb-copy').onclick = () => this.h.copy();
    $('#lb-url').onclick = (e) => e.target.select();
    const picks = $('#lb-blades');
    for (const b of Object.values(BLADES)) {
      const c = el('button', 'lb-blade', `<i></i><b>${b.en}</b><span>${b.typeJa}</span>`);
      c.style.setProperty('--c', b.css);
      c.dataset.id = b.id;
      c.onclick = () => this.h.pick(b.id);
      picks.appendChild(c);
    }
    document.querySelectorAll('button').forEach((b) => b.addEventListener('mouseenter', () => this.h.hover()));
  }

  buildFighter(side) {
    const root = $('#f' + side);
    root.innerHTML = `
      <div class="f-head"><span class="f-tag"></span><span class="f-name"></span><span class="f-type"></span></div>
      <div class="gauge"><div class="g-ghost"></div><div class="g-fill"></div><div class="g-ticks"></div><span class="g-num"></span></div>
      <div class="f-foot"><div class="pips"></div><div class="f-ult"><i></i><span>ULT</span></div></div>`;
    return {
      root, tag: $('.f-tag', root), name: $('.f-name', root), type: $('.f-type', root), fill: $('.g-fill', root), ghost: $('.g-ghost', root),
      num: $('.g-num', root), pips: $('.pips', root), ult: $('.f-ult i', root), ultBox: $('.f-ult', root), ghostV: 1, shown: 1,
    };
  }

  // The bar is rebuilt for each match: every blade has its own four skills.
  buildSkills(blade) {
    const bar = $('#skillbar');
    bar.innerHTML = '';
    this.skills = {};
    for (const k of KEYS) {
      const S = kitOf(blade)[KEYS.indexOf(k)];
      const how = S.aim === 'self' ? '押すと即発動' : '長押しで照準 → 離して発動';
      const b = el('div', 'skill' + (S.ult ? ' ult' : ''));
      b.innerHTML = `<div class="s-ring"></div><div class="s-icon">${ICONS[S.id]}</div><div class="s-cd"></div><div class="s-num"></div><div class="s-key">${k}</div>
        <div class="s-tip"><b>${S.name}</b><i>${S.en}</i><p>${S.desc}</p><span>${S.ult ? 'ゲージ 100%' : 'クールダウン ' + +(S.cd * blade.cdMul).toFixed(1) + '秒'}　／　${how}</span></div>`;
      b.addEventListener('mousedown', (e) => { e.stopPropagation(); e.preventDefault(); this.h.skillClick(k); });
      bar.appendChild(b);
      this.skills[k] = { root: b, cd: $('.s-cd', b), num: $('.s-num', b), ring: $('.s-ring', b), ready: true };
    }
  }

  buildTitle() {
    const cards = $('#blades');
    for (const b of Object.values(BLADES)) {
      const c = el('button', 'blade');
      c.style.setProperty('--c', b.css);
      const bar = (label, v) => `<div class="stat"><span>${label}</span><div>${'<i class="on"></i>'.repeat(v)}${'<i></i>'.repeat(5 - v)}</div></div>`;
      c.innerHTML = `<div class="b-disc"><div class="b-disc-in"></div></div><div class="b-type">${b.type}</div><div class="b-en">${b.en}</div><div class="b-name">${b.name}</div>
        <div class="b-stats">${bar('攻撃', b.bars.atk)}${bar('防御', b.bars.def)}${bar('持久', b.bars.sta)}${bar('速度', b.bars.spd)}</div><p>${b.desc}</p>`;
      c.onclick = () => { this.blade = b.id; this.h.ui(); this.refreshTitle(); };
      c.dataset.id = b.id;
      cards.appendChild(c);
    }
    const lv = $('#levels');
    DIFFICULTY.forEach((d, i) => {
      const b = el('button', 'level', `<b>${d.name}</b><span>${d.ja}</span>`);
      b.onclick = () => { this.level = i; this.h.ui(); this.refreshTitle(); };
      b.dataset.i = i;
      lv.appendChild(b);
    });
    $('#btn-start').onclick = () => this.h.start(this.blade, this.level);
    this.refreshTitle();
  }

  refreshTitle() {
    document.querySelectorAll('.blade').forEach((c) => c.classList.toggle('on', c.dataset.id === this.blade));
    document.querySelectorAll('.level').forEach((c) => c.classList.toggle('on', Number(c.dataset.i) === this.level));
    // The skill list follows the selected blade.
    const b = BLADES[this.blade];
    $('#how').style.setProperty('--c', b.css);
    $('#how-name').textContent = b.name + ' のスキル';
    $('#how').innerHTML = kitOf(b).map((S, i) => `<div class="how-row"><kbd>${KEYS[i]}</kbd><div class="how-icon">${ICONS[S.id]}</div><div><b>${S.name}</b><span>${S.desc}</span></div></div>`).join('');
  }

  show(id, on) { $('#' + id).classList.toggle('hidden', !on); }

  setMuted(m) { $('#btn-mute').classList.toggle('off', m); $('#btn-mute').textContent = m ? '♪ OFF' : '♪ ON'; }

  // The left bar is always "you", whichever side of the simulation that is.
  slot(top) { return top.side === this.side ? 0 : 1; }

  startMatch(world, side, foeLabel, foeNote) {
    this.side = side;
    this.labels.innerHTML = '';
    this.tags = [];
    for (const t of world.tops) {
      const mine = t.side === side, f = this.fighters[this.slot(t)];
      f.root.style.setProperty('--c', t.blade.css);
      f.tag.textContent = mine ? 'YOU' : foeLabel;
      f.name.textContent = t.blade.name;
      f.type.textContent = t.blade.typeJa + (!mine && foeNote ? ' ／ ' + foeNote : '');
      f.ghostV = f.shown = 1;
      const tag = el('div', 'tag ' + (mine ? 'me' : 'foe'), `<span>${mine ? 'YOU' : foeLabel}</span><div><i></i></div>`);
      tag.style.setProperty('--c', t.blade.css);
      this.labels.appendChild(tag);
      this.tags[t.side] = { root: tag, fill: $('i', tag) };
    }
    const me = world.tops[side];
    this.buildSkills(me.blade);
    $('#skillbar').style.setProperty('--c', me.blade.css);
    this.setScore([0, 0]);
  }

  // `score` is indexed by simulation side.
  setScore(score) {
    this.fighters.forEach((f, slot) => {
      const n = score[slot === 0 ? this.side : 1 - this.side];
      f.pips.innerHTML = '';
      for (let k = 0; k < ROUNDS_TO_WIN; k++) f.pips.appendChild(el('i', k < n ? 'on' : ''));
    });
  }

  // Connection read-out in the corner; empty string hides it.
  setNet(text, bad) {
    const n = $('#netstat');
    if (n.textContent !== text) n.textContent = text;
    n.classList.toggle('bad', !!bad);
    n.classList.toggle('hidden', !text);
  }

  toast(text) {
    const t = $('#toast');
    t.textContent = text;
    t.className = '';
    void t.offsetWidth;
    t.className = 'show';
  }

  setMenuMode(online) {
    $('#pause-title').textContent = online ? 'MENU' : 'PAUSE';
    $('#pause-note').textContent = online ? 'オンライン対戦中は一時停止できません。' : '';
    $('#btn-quit').textContent = online ? '対戦をやめる' : 'タイトルへ';
    $('#btn-again').textContent = online ? 'もう一度（ロビーへ）' : 'もう一度';
    $('#btn-back').textContent = online ? '退出する' : 'ブレード選択へ';
  }

  // lobby: { role, status, url, me: { blade, ready }, peer: { blade, ready } | null }
  showLobby(lb) {
    const status = {
      opening: 'ルームを準備しています…',
      waiting: '相手の参加を待っています',
      connecting: 'ルームに接続しています…',
      connected: lb.peer && lb.peer.ready && lb.me.ready ? 'まもなく開始します' : '接続しました。ブレードを選んで準備OKを押してください',
      failed: lb.error || '接続できませんでした',
    }[lb.status];
    const s = $('#lb-status');
    s.textContent = status;
    s.className = 'lb-status ' + lb.status;
    $('#lb-invite').classList.toggle('hidden', lb.role !== 'host' || !lb.url);
    if (lb.url && $('#lb-url').value !== lb.url) $('#lb-url').value = lb.url;
    const card = (root, who, p) => {
      const b = p && BLADES[p.blade];
      root.style.setProperty('--c', b ? b.css : '#3a4566');
      root.classList.toggle('ready', !!(p && p.ready));
      root.classList.toggle('empty', !p);
      root.innerHTML = `<span class="lb-who">${who}</span><b>${b ? b.en : '— — —'}</b><span class="lb-name">${b ? b.name + '（' + b.typeJa + '）' : '未接続'}</span><em>${p ? (p.ready ? 'READY' : '選択中…') : ''}</em>`;
    };
    card($('#lb-me'), 'YOU', lb.me);
    card($('#lb-peer'), 'RIVAL', lb.peer);
    document.querySelectorAll('.lb-blade').forEach((c) => {
      c.classList.toggle('on', c.dataset.id === lb.me.blade);
      c.disabled = lb.me.ready;
    });
    const r = $('#lb-ready');
    r.disabled = lb.status !== 'connected';
    r.textContent = lb.me.ready ? '準備を取り消す' : '準備OK';
    r.classList.toggle('armed', lb.me.ready);
    const kit = $('#lb-kit');
    kit.style.setProperty('--c', BLADES[lb.me.blade].css);
    kit.innerHTML = kitOf(BLADES[lb.me.blade]).map((S, i) => `<div class="how-row"><kbd>${KEYS[i]}</kbd><div class="how-icon">${ICONS[S.id]}</div><div><b>${S.name}</b><span>${S.desc}</span></div></div>`).join('');
  }

  setRound(n) { $('#round').textContent = 'ROUND ' + n; }

  announce(text, sub = '', cls = '', dur = 1.2) {
    const a = this.announceEl;
    a.className = '';
    a.innerHTML = `<div class="a-main">${text}</div>${sub ? `<div class="a-sub">${sub}</div>` : ''}`;
    void a.offsetWidth;
    a.style.setProperty('--d', dur + 's');
    a.className = 'show ' + cls;
  }

  finish(kind, won) {
    const [en, ja] = FINISH[kind];
    this.announce(en, `${ja}　<b>${won ? 'ROUND GET!' : 'ROUND LOST…'}</b>`, 'finish ' + (won ? 'win' : 'lose'), 2.6);
  }

  cutIn(skill, css, enemy) {
    const c = this.cutin;
    c.className = '';
    c.style.setProperty('--c', css);
    c.innerHTML = `<div class="ci-bar"></div><div class="ci-text"><span>${enemy ? 'ENEMY ULTIMATE' : 'ULTIMATE'}</span><b>${skill.en}</b><i>${skill.name}</i></div>`;
    void c.offsetWidth;
    c.className = 'show' + (enemy ? ' enemy' : '');
  }

  flash(color = '#fff', strength = 0.5) {
    const f = this.flashEl;
    f.style.background = color;
    f.style.transition = 'none'; f.style.opacity = strength;
    void f.offsetWidth;
    f.style.transition = 'opacity .45s ease-out'; f.style.opacity = 0;
  }

  // Floating number or word at a screen position.
  pop(x, y, text, cls = '') {
    const d = el('div', 'pop ' + cls, text);
    d.style.left = x + 'px'; d.style.top = y + 'px';
    d.style.setProperty('--r', (Math.random() * 60 - 30).toFixed(0) + 'px');
    this.labels.appendChild(d);
    d.addEventListener('animationend', () => d.remove());
  }

  denied(key) {
    const s = this.skills[key].root;
    s.classList.remove('denied'); void s.offsetWidth; s.classList.add('denied');
  }

  castFx(key) {
    const s = this.skills[key].root;
    s.classList.remove('fired'); void s.offsetWidth; s.classList.add('fired');
  }

  update(world, view, timeLeft, aimKey, rdt) {
    world.tops.forEach((t, i) => {
      const f = this.fighters[this.slot(t)];
      const r = Math.max(0, t.spin / t.spinMax);
      // The pale bar behind lingers, then drains, so a big hit stays readable.
      if (f.ghostV < r) f.ghostV = r;
      f.ghostV += (r - f.ghostV) * Math.min(1, rdt * 2.2);
      f.fill.style.transform = `scaleX(${r})`;
      f.ghost.style.transform = `scaleX(${f.ghostV})`;
      f.num.textContent = Math.ceil(Math.max(0, t.spin) * 3.6) + ' rpm';
      f.root.classList.toggle('low', r < 0.25);
      f.ult.style.transform = `scaleX(${t.ult / 100})`;
      f.ultBox.classList.toggle('ready', t.ult >= 100);

      const tag = this.tags[i];
      const hide = t.out || world.result;
      tag.root.style.opacity = hide ? 0 : 1;
      if (!hide) {
        const v = view.tops[i].group.position;
        const s = view.toScreen(v.x, v.y + 2.5, v.z);
        tag.root.style.transform = `translate(${s.x.toFixed(1)}px,${s.y.toFixed(1)}px)`;
        tag.fill.style.transform = `scaleX(${r})`;
      }
    });
    const me = world.tops[this.side];
    for (const k of KEYS) {
      const S = skillOf(me, k);
      const s = this.skills[k], cd = me.cd[k], total = S.cd * me.blade.cdMul;
      const charging = S.ult && me.ult < 100;
      const ready = cd <= 0 && !charging;
      s.cd.style.setProperty('--p', charging ? 0 : Math.min(1, cd / total));
      s.num.textContent = charging ? Math.floor(me.ult) + '%' : cd > 0 ? (cd < 1 ? cd.toFixed(1) : Math.ceil(cd)) : '';
      if (S.ult) s.ring.style.setProperty('--p', me.ult / 100);
      if (ready !== s.ready) {
        s.ready = ready;
        s.root.classList.toggle('wait', !ready);
        if (ready) { s.root.classList.remove('up'); void s.root.offsetWidth; s.root.classList.add('up'); }
      }
      s.root.classList.toggle('aim', aimKey === k);
    }
    const tl = Math.max(0, Math.ceil(timeLeft));
    if (tl !== this.lastTime) {
      this.lastTime = tl;
      const c = $('#time');
      c.textContent = tl;
      c.classList.toggle('hurry', tl <= 10);
    }
    const a = view.aimInfo;
    if (a && a.lock) {
      this.lockEl.style.opacity = 1;
      this.lockEl.style.transform = `translate(${a.x.toFixed(1)}px,${a.y.toFixed(1)}px)`;
    } else {
      this.lockEl.style.opacity = 0;
    }
    const danger = Math.max(0, 1 - me.spin / me.spinMax / 0.25);
    this.vignette.style.opacity = world.result ? 0 : danger * 0.9;
  }

  showResult(won, score, world, stats) {
    const p = world.tops[this.side], c = world.tops[1 - this.side];
    score = [score[this.side], score[1 - this.side]];
    $('#result').classList.toggle('lose', !won);
    $('#res-title').textContent = won ? 'VICTORY' : 'DEFEAT';
    $('#res-sub').textContent = won ? '見事な勝利！' : 'あと一歩…もう一度挑戦しよう';
    $('#res-score').innerHTML = `<b style="color:${p.blade.css}">${score[0]}</b><span>-</span><b style="color:${c.blade.css}">${score[1]}</b>`;
    const row = (label, a, b) => `<tr><td>${a}</td><th>${label}</th><td>${b}</td></tr>`;
    $('#res-stats').innerHTML = `<tr class="head"><td style="color:${p.blade.css}">${p.blade.name}</td><th></th><td style="color:${c.blade.css}">${c.blade.name}</td></tr>`
      + row('与えたダメージ', Math.round(p.stats.dealt), Math.round(c.stats.dealt))
      + row('最大ヒット', Math.round(p.stats.maxHit), Math.round(c.stats.maxHit))
      + row('スキル命中', p.stats.skillHits, c.stats.skillHits)
      + row('パリィ / 反射', p.stats.parries, c.stats.parries)
      + row('激突回数', p.stats.clashes, c.stats.clashes);
    $('#res-finish').textContent = stats.join('　/　');
    this.show('result', true);
  }
}
