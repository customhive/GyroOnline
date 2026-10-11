// DOM heads-up display, menus and floating combat text.
import { BLADES, DIFFICULTY, STAGES, ARENA_SIZES, ROUNDS_TO_WIN, KEYS, FLASH, skillOf, kitOf } from './config.js';

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
  // GALE RONDO
  galeq: svg('<path d="M4 24h30" stroke-width="5"/><path d="M30 12l14 12-14 12z" fill="currentColor" stroke="none"/><path d="M6 12h14M6 36h14" stroke-width="2.5" opacity=".55"/>'),
  windwall: svg('<path d="M10 6c8 6-8 12 0 18s-8 12 0 18M24 6c8 6-8 12 0 18s-8 12 0 18M38 6c8 6-8 12 0 18s-8 12 0 18" stroke-width="4"/>'),
  sweep: svg('<circle cx="24" cy="24" r="8" stroke-width="3" stroke-dasharray="4 4" opacity=".6"/><path d="M3 34L45 14" stroke-width="5"/><path d="M36 9l9 5-5 9" stroke-width="4"/>'),
  lastbreath: svg('<path d="M24 3l5 15h15l-12 9 5 16-13-10-13 10 5-16L4 18h15z" fill="currentColor" stroke="none"/><path d="M8 44h32" stroke-width="3" opacity=".6"/>'),
  // NOX SHADE
  shuriken: svg('<path d="M24 3l5 16 16 5-16 5-5 16-5-16-16-5 16-5z" fill="currentColor" stroke="none"/><circle cx="24" cy="24" r="4" fill="#0a0f1e" stroke="none"/>'),
  shadow: svg('<circle cx="16" cy="24" r="10" fill="currentColor" stroke="none"/><circle cx="33" cy="24" r="10" stroke-width="3" stroke-dasharray="4 4" opacity=".7"/><path d="M14 40h20" stroke-width="3" opacity=".5"/>'),
  slash: svg('<path d="M6 30a18 18 0 0 1 36 0" stroke-width="6"/><path d="M12 38a12 12 0 0 1 24 0" stroke-width="3" opacity=".6"/>'),
  deathmark: svg('<path d="M8 8l32 32M40 8L8 40" stroke-width="7"/><circle cx="24" cy="24" r="20" stroke-width="2.5" opacity=".6"/>'),
  // CURTAIN CALL
  fourshot: svg('<circle cx="12" cy="12" r="6" fill="currentColor" stroke="none"/><circle cx="36" cy="12" r="6" fill="currentColor" stroke="none"/><circle cx="12" cy="36" r="6" fill="currentColor" stroke="none"/><circle cx="36" cy="36" r="8" fill="currentColor" stroke="none"/><circle cx="36" cy="36" r="11" stroke-width="2" opacity=".7"/>'),
  flourish: svg('<path d="M3 24h42" stroke-width="3"/><path d="M34 16l11 8-11 8" stroke-width="4"/><path d="M8 14l6 10-6 10M18 14l6 10-6 10" stroke-width="2.5" opacity=".6"/>'),
  lotus: svg('<path d="M24 6c6 8 6 16 0 24-6-8-6-16 0-24z" fill="currentColor" stroke="none"/><path d="M6 20c10 0 16 4 18 12-10 0-16-4-18-12zM42 20c-10 0-16 4-18 12 10 0 16-4 18-12z" fill="currentColor" stroke="none" opacity=".65"/><path d="M8 40h32" stroke-width="3"/>'),
  curtaincall: svg('<path d="M4 44L24 4l20 40" stroke-width="3" opacity=".6"/><path d="M24 40V10" stroke-width="5"/><path d="M15 18l9-10 9 10" stroke-width="5"/>'),
  // FROST PHOENIX
  flashfrost: svg('<circle cx="28" cy="24" r="11" fill="currentColor" stroke="none"/><path d="M2 24h12M5 14h8M5 34h8" stroke-width="3" opacity=".6"/><path d="M28 8v-5M28 45v-5M44 24h3" stroke-width="3"/>'),
  icewall: svg('<path d="M8 40V18l7-10 7 10v22zM26 40V14l7-10 7 10v26z" fill="currentColor" stroke="none"/><path d="M3 43h42" stroke-width="3"/>'),
  frostbite: svg('<path d="M24 3v42M6 13l36 22M42 13L6 35" stroke-width="4"/><path d="M18 7l6 6 6-6M18 41l6-6 6 6" stroke-width="3"/>'),
  blizzard: svg('<circle cx="24" cy="24" r="20" stroke-width="3" stroke-dasharray="5 5"/><path d="M24 10v28M12 17l24 14M36 17L12 31" stroke-width="4"/>'),
  // BROKEN EDGE
  brokenwings: svg('<path d="M4 12l10 12L4 36M18 12l10 12-10 12M32 12l10 12-10 12" stroke-width="5"/>'),
  kiburst: svg('<circle cx="24" cy="24" r="6" fill="currentColor" stroke="none"/><path d="M24 3v9M24 36v9M3 24h9M36 24h9M9 9l6 6M33 33l6 6M39 9l-6 6M15 33l-6 6" stroke-width="4"/>'),
  valor: svg('<path d="M26 5l15 5v12c0 9-6 15-15 19-9-4-15-10-15-19V10z" stroke-width="3.5"/><path d="M2 20h10M2 28h8" stroke-width="3" opacity=".6"/>'),
  exile: svg('<path d="M10 44L30 4l8 6-18 36z" fill="currentColor" stroke="none"/><path d="M26 20l14 4M22 28l12 4" stroke-width="3" stroke="#0a0f1e"/><path d="M6 30l8 4" stroke-width="4"/>'),
  // MIRAGE TRICK
  sigil: svg('<circle cx="24" cy="24" r="18" stroke-width="3"/><path d="M24 8l14 24H10z" stroke-width="3"/><circle cx="24" cy="24" r="4" fill="currentColor" stroke="none"/>'),
  distort: svg('<path d="M6 34c10-26 26-26 36 0" stroke-width="4"/><path d="M36 22l6 12-13 1" stroke-width="4"/><path d="M42 40c-10 6-26 6-36 0" stroke-width="2.5" stroke-dasharray="4 4" opacity=".7"/>'),
  ethereal: svg('<ellipse cx="12" cy="24" rx="8" ry="5" stroke-width="4"/><ellipse cx="24" cy="24" rx="8" ry="5" stroke-width="4" opacity=".7"/><ellipse cx="36" cy="24" rx="8" ry="5" stroke-width="4"/>'),
  mimic: svg('<path d="M24 5l5 12 13 1-10 9 3 13-11-7-11 7 3-13-10-9 13-1z" stroke-width="3"/><path d="M24 15l3 7 7 1-5 5 1 7-6-4-6 4 1-7-5-5 7-1z" fill="currentColor" stroke="none"/>'),
  // GUILLOTINE LORD
  decimate: svg('<circle cx="24" cy="24" r="19" stroke-width="7"/><circle cx="24" cy="24" r="7" stroke-width="2" stroke-dasharray="3 3" opacity=".6"/>'),
  cripple: svg('<path d="M30 4L14 26h10l-6 18 18-24H26z" fill="currentColor" stroke="none"/>'),
  apprehend: svg('<path d="M44 8L10 24l34 16" stroke-width="3" opacity=".5"/><path d="M40 24H10" stroke-width="5"/><path d="M20 14L8 24l12 10" stroke-width="5"/>'),
  guillotine: svg('<path d="M6 4h36v18L6 34z" fill="currentColor" stroke="none"/><path d="M6 4v40M42 4v40" stroke-width="4"/><path d="M4 44h40" stroke-width="3"/>'),
  // VENOM TRAIL
  poison: svg('<path d="M4 34c8-10 12 6 20-4s12 6 20-4" stroke-width="6"/><circle cx="12" cy="14" r="4" fill="currentColor" stroke="none"/><circle cx="26" cy="9" r="3" fill="currentColor" stroke="none" opacity=".7"/><circle cx="38" cy="15" r="4" fill="currentColor" stroke="none"/>'),
  glue: svg('<path d="M6 30c0-10 8-16 18-16s18 6 18 16-8 10-18 10S6 40 6 30z" fill="currentColor" stroke="none" opacity=".5"/><path d="M14 30c4-4 6 4 10 0s6 4 10 0" stroke-width="4"/>'),
  fling: svg('<circle cx="10" cy="36" r="6" fill="currentColor" stroke="none"/><path d="M12 28C14 8 34 8 38 26" stroke-width="4"/><path d="M30 22l8 6 5-9" stroke-width="4"/><circle cx="38" cy="38" r="5" stroke-width="3"/>'),
  insanity: svg('<path d="M19 4h10v12l9 18c2 5-1 10-7 10H17c-6 0-9-5-7-10l9-18z" stroke-width="3.5"/><path d="M13 32h22l2 4c1 3-1 5-4 5H15c-3 0-5-2-4-5z" fill="currentColor" stroke="none"/>'),
  // TURRET ENGINEER
  turret: svg('<path d="M10 44h28l-4-12H14z" fill="currentColor" stroke="none"/><circle cx="24" cy="24" r="9" stroke-width="4"/><path d="M30 20L44 8" stroke-width="6"/>'),
  rockets: svg('<path d="M6 40L20 8M16 42l8-34M26 42l2-34M36 42L32 8M44 38L36 8" stroke-width="3.5"/>'),
  grenade: svg('<circle cx="22" cy="28" r="14" fill="currentColor" stroke="none"/><path d="M26 14l6-8h8" stroke-width="4"/><path d="M40 4l4 2M42 10l4-2" stroke-width="2.5"/>'),
  upgrade: svg('<path d="M24 4l16 16H30v12H18V20H8z" fill="currentColor" stroke="none"/><path d="M12 38h24M16 44h16" stroke-width="4"/>'),
  // SAND EMPEROR
  conquer: svg('<circle cx="10" cy="14" r="6" fill="currentColor" stroke="none"/><circle cx="10" cy="34" r="6" fill="currentColor" stroke="none"/><path d="M18 14l20 8M18 34l20-8" stroke-width="4"/><circle cx="40" cy="24" r="5" stroke-width="3"/>'),
  arise: svg('<circle cx="24" cy="16" r="9" fill="currentColor" stroke="none"/><path d="M24 26v10" stroke-width="5"/><path d="M4 42c6-6 12-6 20 0s14 6 20 0" stroke-width="4"/>'),
  shift: svg('<circle cx="38" cy="24" r="7" stroke-width="3" stroke-dasharray="4 3"/><path d="M4 24h24" stroke-width="5"/><path d="M20 15l10 9-10 9" stroke-width="5"/>'),
  divide: svg('<path d="M10 6v36M18 6v36M26 6v36" stroke-width="5"/><path d="M32 24h12M38 17l7 7-7 7" stroke-width="4"/>'),
};
// Stock glyphs for skills that name one with `icon` instead of having their own drawing.
const GLYPHS = {
  shot: svg('<path d="M4 24h26" stroke-width="5"/><path d="M28 13l14 11-14 11z" fill="currentColor" stroke="none"/><path d="M6 14h10M6 34h10" stroke-width="2.5" opacity=".5"/>'),
  beam: svg('<path d="M3 24h42" stroke-width="8"/><path d="M3 14h42M3 34h42" stroke-width="2" opacity=".5"/>'),
  orb: svg('<circle cx="26" cy="24" r="11" fill="currentColor" stroke="none"/><path d="M4 16c8-8 18-8 26-2M4 32c8 8 18 8 26 2" stroke-width="2.5" opacity=".6"/>'),
  dash: svg('<path d="M6 9l15 15L6 39M20 9l15 15-15 15" stroke-width="5"/><path d="M36 15l7 9-7 9" stroke-width="3.5" opacity=".5"/>'),
  blink: svg('<circle cx="34" cy="24" r="9" fill="currentColor" stroke="none"/><circle cx="16" cy="24" r="9" stroke-width="3" stroke-dasharray="4 4" opacity=".55"/>'),
  blast: svg('<circle cx="24" cy="24" r="8" fill="currentColor" stroke="none"/><circle cx="24" cy="24" r="16" stroke-width="3"/><path d="M24 2v6M24 40v6M2 24h6M40 24h6" stroke-width="3.5" opacity=".7"/>'),
  burst: svg('<circle cx="24" cy="24" r="6" fill="currentColor" stroke="none"/><path d="M24 3v10M24 35v10M3 24h10M35 24h10M9 9l7 7M32 32l7 7M39 9l-7 7M16 32l-7 7" stroke-width="4"/>'),
  field: svg('<circle cx="24" cy="24" r="19" stroke-width="3" stroke-dasharray="6 5"/><circle cx="24" cy="24" r="9" fill="currentColor" stroke="none" opacity=".7"/>'),
  cone: svg('<path d="M6 24L42 6v36z" fill="currentColor" stroke="none" opacity=".4"/><path d="M6 24L42 6M6 24l36 18" stroke-width="3"/>'),
  buff: svg('<path d="M24 4l14 14H29v14H19V18H10z" fill="currentColor" stroke="none"/><path d="M14 40h20" stroke-width="4"/>'),
  shield: svg('<path d="M24 4l17 6v13c0 10-7 17-17 21C14 40 7 33 7 23V10z" stroke-width="3.5"/><path d="M24 13l8 3v7c0 6-3 9-8 11z" fill="currentColor" stroke="none"/>'),
  heal: svg('<circle cx="24" cy="24" r="19" stroke-width="3"/><path d="M24 12v24M12 24h24" stroke-width="7"/>'),
  hook: svg('<path d="M40 6L16 30" stroke-width="4"/><path d="M16 30c-8 0-10 12 0 12s10-8 6-12" stroke-width="5"/>'),
  grab: svg('<path d="M42 10L14 24l28 14" stroke-width="3" opacity=".5"/><path d="M40 24H10" stroke-width="5"/><path d="M20 14L8 24l12 10" stroke-width="5"/>'),
  leap: svg('<path d="M6 40C10 12 34 8 40 30" stroke-width="4"/><path d="M32 26l8 6 4-10" stroke-width="4"/><path d="M4 44h40" stroke-width="2.5" opacity=".5"/>'),
  heart: svg('<path d="M24 42C8 30 4 22 4 15a10 10 0 0 1 20-3 10 10 0 0 1 20 3c0 7-4 15-20 27z" fill="currentColor" stroke="none"/>'),
  cross: svg('<path d="M9 9l30 30M39 9L9 39" stroke-width="7"/><circle cx="24" cy="24" r="20" stroke-width="2.5" opacity=".6"/>'),
  trap: svg('<circle cx="24" cy="24" r="18" stroke-width="5"/><circle cx="24" cy="24" r="6" fill="currentColor" stroke="none"/>'),
  star: svg('<path d="M24 3l6 14 15 1-11 10 4 15-14-8-14 8 4-15L3 18l15-1z" fill="currentColor" stroke="none"/>'),
};
const iconOf = (S) => ICONS[S.id] || GLYPHS[S.icon] || GLYPHS.star;
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
    this.vignette = $('#vignette');
    this.flashEl = $('#flash');
    this.blade = 'azure';
    this.side = 0;        // which top is "you" (1 when playing as the guest online)
    this.fighters = [];   // one bar for each top, by its side
    this.skills = {};
    this.buildTitle();
    // One floating tooltip for the skills on the room's cards. It lives on the
    // body so the cards' cut corners cannot clip it.
    this.tipEl = el('div', 'tip');
    document.body.appendChild(this.tipEl);
    // And one floating menu, for choosing who sits in a seat.
    this.menuEl = el('div', 'seat-menu');
    document.body.appendChild(this.menuEl);
    document.addEventListener('click', () => this.menu(null));
    this.meLabel = '';
    this.tags = [];
    this.lastTime = -1;
    $('#btn-mute').onclick = () => this.h.mute();
    $('#btn-pause').onclick = () => this.h.pause();
    $('#btn-resume').onclick = () => this.h.pause();
    $('#btn-quit').onclick = () => this.h.quit();
    $('#btn-again').onclick = () => this.h.again();
    $('#btn-lobby').onclick = () => this.h.lobby();
    $('#btn-back').onclick = () => this.h.back();
    $('#btn-host').onclick = () => this.h.host();
    $('#lb-leave').onclick = () => this.h.quit();
    $('#pk-ok').onclick = () => this.h.edit(-1);
    $('#picker').onclick = (e) => { if (e.target.id === 'picker') this.h.edit(-1); };
    $('#st-prev').onclick = () => this.h.stage(-1);
    $('#st-next').onclick = () => this.h.stage(1);
    $('#lb-ready').onclick = () => this.h.ready();
    $('#lb-start').onclick = () => this.h.start();
    $('#lb-copy').onclick = () => this.h.copy();
    $('#lb-url').onclick = (e) => e.target.select();
    document.querySelectorAll('button').forEach((b) => b.addEventListener('mouseenter', () => this.h.hover()));
  }

  // A spin bar. The player's own is on the left; everyone else is on the right,
  // full size in a duel and compact when there are more.
  buildFighter(left, mini) {
    const root = el('div', 'fighter ' + (left ? 'left' : 'right') + (mini ? ' mini' : ''));
    root.innerHTML = `
      <div class="f-head"><span class="f-tag"></span><span class="f-name"></span><span class="f-type"></span></div>
      <div class="gauge"><div class="g-ghost"></div><div class="g-fill"></div><div class="g-grey"></div><div class="g-ticks"></div><span class="g-num"></span></div>
      <div class="f-foot"><div class="pips"></div><div class="f-ult"><i></i><span>ULT</span></div></div>`;
    $(left ? '#fl' : '#fr').appendChild(root);
    return {
      root, left, tag: $('.f-tag', root), name: $('.f-name', root), type: $('.f-type', root), fill: $('.g-fill', root), grey: $('.g-grey', root), ghost: $('.g-ghost', root),
      num: $('.g-num', root), pips: $('.pips', root), ult: $('.f-ult i', root), ultBox: $('.f-ult', root), ghostV: 1, shown: 1,
    };
  }

  buildSkills(blade) {
    const bar = $('#skillbar');
    bar.innerHTML = '';
    this.skills = {};
    for (const k of KEYS) {
      const S = kitOf(blade)[KEYS.indexOf(k)];
      const how = S.passive ? '常時効果' : S.rapid ? '押している間、撃ち続ける' : S.wind ? '長押しで溜める → 離して発動' : S.aim === 'self' ? '押すと即発動' : '長押しで照準 → 離して発動';
      const b = el('div', 'skill' + (S.ult ? ' ult' : ''));
      b.innerHTML = `<div class="s-ring"></div><div class="s-icon">${iconOf(S)}</div><div class="s-cd"></div><div class="s-num"></div><div class="s-key">${k}</div><div class="s-badge"></div>
        <div class="s-tip"><b>${S.name}</b><i>${S.en}</i><p>${S.desc}</p><span>${S.ult ? 'ゲージ 100%' : 'クールダウン ' + +(S.cd * blade.cdMul).toFixed(1) + '秒'}　／　${how}</span></div>`;
      bar.appendChild(b);
      this.skills[k] = { root: b, cd: $('.s-cd', b), num: $('.s-num', b), ring: $('.s-ring', b), badge: $('.s-badge', b), ready: true, note: '' };
    }
    // FLASH sits beside the four, the same for every blade: lit until it has been used this round.
    const f = el('div', 'skill flash');
    f.innerHTML = `<div class="s-icon">${GLYPHS.blink}</div><div class="s-key">${FLASH.key}</div>
      <div class="s-tip"><b>フラッシュ</b><i>FLASH</i><p>カーソルの位置へ瞬間移動する（遠ければ、その方向へ${FLASH.range}だけ）。1ラウンドに1回だけ使える。スタン・束縛・打ち上げなどで動けない間は使えない。スキルを狙っている最中や溜めている最中にも使える。</p><span>1ラウンドに1回　／　押すと即発動</span></div>`;
    bar.appendChild(f);
    this.skills[FLASH.key] = { root: f };
  }

  buildTitle() {
    const cards = $('#blades');
    // With this many blades the cards only name them; the selected one is
    // described in full beside the skill list.
    this.sheets = {};
    this.bars = {};
    for (const b of Object.values(BLADES)) {
      const c = el('button', 'blade');
      c.style.setProperty('--c', b.css);
      const bar = (label, v) => `<div class="stat"><span>${label}</span><div>${'<i class="on"></i>'.repeat(v)}${'<i></i>'.repeat(5 - v)}</div></div>`;
      c.innerHTML = `<div class="b-disc"><div class="b-disc-in"></div></div><div class="b-type">${b.type}</div><div class="b-en">${b.en}</div><div class="b-name">${b.name}</div>`;
      this.bars[b.id] = `<div class="b-stats">${bar('攻撃', b.bars.atk)}${bar('防御', b.bars.def)}${bar('持久', b.bars.sta)}${bar('速度', b.bars.spd)}</div>`;
      this.sheets[b.id] = `${this.bars[b.id]}<p>${b.desc}</p>`;
      c.onclick = () => this.h.pick(b.id);
      c.dataset.id = b.id;
      cards.appendChild(c);
    }
    const any = el('button', 'blade any', '<div class="b-disc"><div class="b-disc-in"></div></div><div class="b-type">？？？</div><div class="b-en">RANDOM</div><div class="b-name">おまかせ</div>');
    any.dataset.id = 'random';
    any.onclick = () => this.h.pick('random');
    cards.prepend(any);
  }

  // The stat sheet and skill list of one blade, shown under the blade grid.
  showBlade(id) {
    const b = BLADES[id];
    $('#how').style.setProperty('--c', b ? b.css : '#3a4566');
    $('#sheet').style.setProperty('--c', b ? b.css : '#3a4566');
    $('#how-name').textContent = b ? b.name + ' のスキル' : 'おまかせ';
    $('#sheet').innerHTML = b ? this.sheets[b.id] : '<p>対戦のたびにランダムなブレードが選ばれます。</p>';
    $('#how').innerHTML = b ? kitOf(b).map((S, i) => `<div class="how-row"><kbd>${KEYS[i]}</kbd><div class="how-icon">${iconOf(S)}</div><div><b>${S.name}</b><span>${S.desc}</span></div></div>`).join('') : '';
  }

  show(id, on) { $('#' + id).classList.toggle('hidden', !on); }

  setMuted(m) { $('#btn-mute').classList.toggle('off', m); $('#btn-mute').textContent = m ? '♪ OFF' : '♪ ON'; }

  // The left bar is always "you", whichever side of the simulation that is.
  slot(top) { return top.side === this.side ? 0 : 1; }

  // labels / notes: what to call each top ('YOU', 'CPU', 'RIVAL'...) and a word about it, by side.
  startMatch(world, side, labels, notes = []) {
    this.side = side;
    this.labels.innerHTML = '';
    this.tags = [];
    $('#fl').innerHTML = ''; $('#fr').innerHTML = '';
    this.fighters = [];
    const many = world.tops.length > 2, me0 = world.tops[side];
    const teams = new Set(world.tops.map((t) => t.team)).size < world.tops.length;
    $('#hud').classList.toggle('many', many);
    // Your own bar first, then team mates under it; everyone else on the other side.
    const order = [...world.tops].sort((p, q) => (q.side === side) - (p.side === side));
    for (const t of order) {
      const mine = t.side === side, mate = teams && t.team === me0.team;
      const f = (this.fighters[t.side] = this.buildFighter(mine || mate, many && !mine));
      const label = (teams ? 'AB'[t.team] + '・' : '') + (labels[t.side] || (mine ? 'YOU' : 'RIVAL'));
      f.root.classList.toggle('mate', mate && !mine);
      f.root.style.setProperty('--c', t.blade.css);
      f.tag.textContent = label;
      f.name.textContent = t.blade.name;
      f.type.textContent = t.blade.typeJa + (notes[t.side] ? ' ／ ' + notes[t.side] : '');
      f.ghostV = f.shown = 1;
      const tag = el('div', 'tag ' + (mine ? 'me' : mate ? 'mate' : 'foe'), `<span>${label}</span><div><i></i></div>`);
      // The bar and name over a top say whose side it is on, not which blade it is:
      // the top itself already wears the blade's colour.
      this.labels.appendChild(tag);
      this.tags[t.side] = { root: tag, fill: $('i', tag) };
    }
    const me = world.tops[side];
    this.buildSkills(me.blade);
    $('#skillbar').style.setProperty('--c', me.blade.css);
    this.setScore(world.tops.map(() => 0));
  }

  setScore(score) {
    this.fighters.forEach((f, side) => {
      const n = score[side] || 0;
      f.pips.innerHTML = '';
      for (let k = 0; k < ROUNDS_TO_WIN; k++) f.pips.appendChild(el('i', k < n ? 'on' : ''));
    });
  }

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
    $('#btn-again').textContent = online ? '同じブレードで再戦' : 'もう一度';
    $('#btn-lobby').classList.toggle('hidden', !online);
    $('#btn-again').parentElement.classList.toggle('three', online);
    $('#btn-back').textContent = online ? '退出する' : 'ルームに戻る';
  }

  howTo(S) { return S.passive ? '常時効果' : S.rapid ? '押している間、撃ち続ける' : S.wind ? '長押しで溜める → 離して発動' : S.aim === 'self' ? '押すと即発動' : '長押しで照準 → 離して発動'; }

  // Shows the skill tooltip beside `at` (or hides it, with no skill).
  tip(at, S, blade, key) {
    const t = this.tipEl;
    if (!S) { t.classList.remove('on'); return; }
    t.style.setProperty('--c', blade.css);
    t.innerHTML = `<div class="tip-head"><kbd>${key}</kbd><div class="how-icon">${iconOf(S)}</div><div><b>${S.name}</b><i>${S.en}</i></div></div><p>${S.desc}</p><span>${S.ult ? 'ゲージ 100%' : S.passive ? '常時効果' : 'クールダウン ' + +(S.cd * blade.cdMul).toFixed(1) + '秒'}${S.passive ? '' : '　／　' + this.howTo(S)}</span>`;
    t.classList.add('on');
    // To the right of the row if there is room, otherwise to the left; kept on screen.
    const r = at.getBoundingClientRect(), w = t.offsetWidth, h = t.offsetHeight;
    let x = r.right + 14;
    if (x + w > innerWidth - 8) x = r.left - w - 14;
    if (x < 8) x = Math.max(8, Math.min(innerWidth - w - 8, r.left));
    const y = Math.max(8, Math.min(innerHeight - h - 8, r.top + r.height / 2 - h / 2));
    t.style.left = x + 'px'; t.style.top = y + 'px';
  }

  // A small floating menu under `at` (or closes it, with nothing given).
  // items: [{ label, note, on, pick }]
  menu(at, items) {
    const m = this.menuEl;
    if (!at) { m.classList.remove('on'); m.at = null; return; }
    if (m.at === at && m.classList.contains('on')) { this.menu(null); return; }
    m.innerHTML = '';
    for (const it of items) {
      const btn = el('button', it.on ? 'on' : '', `<b>${it.label}</b>${it.note ? `<span>${it.note}</span>` : ''}`);
      btn.onclick = (e) => { e.stopPropagation(); this.menu(null); it.pick(); };
      m.appendChild(btn);
    }
    m.at = at;
    m.classList.add('on');
    const r = at.getBoundingClientRect();
    m.style.minWidth = r.width + 'px';
    m.style.left = Math.max(8, Math.min(innerWidth - m.offsetWidth - 8, r.left)) + 'px';
    m.style.top = Math.min(innerHeight - m.offsetHeight - 8, r.bottom + 4) + 'px';
  }

  // A top-down sketch of a stage: the floor, and whatever wall it has.
  stagePic(g) {
    const R = 78, arc = (a0, a1) => `M ${100 + R * Math.cos(a0)} ${100 - R * Math.sin(a0)} A ${R} ${R} 0 ${a1 - a0 > Math.PI ? 1 : 0} 0 ${100 + R * Math.cos(a1)} ${100 - R * Math.sin(a1)}`;
    let wall = '';
    if (g.wall && !g.gaps.length) wall = `<circle cx="100" cy="100" r="${R}" class="sp-wall"/>`;
    else if (g.wall) {
      const gs = [...g.gaps].sort((p, q) => p[0] - q[0]);
      gs.forEach((p, i) => { const q = gs[(i + 1) % gs.length], a0 = p[0] + p[1], a1 = q[0] - q[1] + (i === gs.length - 1 ? Math.PI * 2 : 0); wall += `<path d="${arc(a0, a1)}" class="sp-wall"/>`; });
      for (const p of gs) wall += `<path d="${arc(p[0] - p[1], p[0] + p[1])}" class="sp-gap"/>`;
    } else wall = `<circle cx="100" cy="100" r="${R}" class="sp-gap"/>`;
    return `<svg viewBox="0 0 200 200"><circle cx="100" cy="100" r="${R + 14}" class="sp-out"/><circle cx="100" cy="100" r="${R}" class="sp-floor"/><circle cx="100" cy="100" r="52" class="sp-ring"/><circle cx="100" cy="100" r="26" class="sp-ring"/><polygon points="100,88 110.4,94 110.4,106 100,112 89.6,106 89.6,94" class="sp-ring"/>${wall}</svg>`;
  }

  // lobby: { role, status, url, slots: [{ kind: 'human' | 'cpu' | 'open', blade, level, ready }], edit, picking, stage }
  // Slot 0 is the host's. The host sets everything up; a guest only picks its own blade.
  showLobby(lb) {
    const host = lb.role === 'host', mine = lb.me, me = lb.slots[mine];
    const waiting = lb.slots.some((p) => p.kind === 'open'), guests = lb.slots.some((p, i) => p.kind === 'human' && i !== mine);
    const linked = lb.status === 'connected';
    const status = {
      opening: 'ルームを準備しています…',
      waiting: waiting ? '招待URLを送って相手を待つか、空いている枠をCPUか「なし」にしてください' : 'CPUと対戦できます。枠を「人間」にすると、招待URLから友だちが入れます',
      connecting: 'ルームに接続しています…',
      connected: host ? (waiting ? '参加を待っている枠があります。CPUか「なし」にすれば今いる人で始められます' : lb.slots.every((p) => p.kind === 'none' || p.kind === 'cpu' || p.ready) ? '全員の準備ができました。ゲーム開始を押してください' : '全員が準備完了を押すと開始できます') : (me.ready ? '準備完了。ホストの開始を待っています' : 'ルームに入りました。ブレードを選んで準備完了を押してください'),
      failed: host ? 'オンラインにつながりません（CPUとの対戦はできます）' : lb.error || '接続できませんでした',
    }[lb.status];
    const s = $('#lb-status');
    // Why the game cannot start yet is said here, not on the button.
    const lopsided = lb.teams && new Set(lb.slots.filter((p) => p.kind !== 'none').map((p) => p.team)).size < 2;
    s.textContent = host && lopsided ? 'チーム戦は、AとBの両方に1人以上必要です。カードの下の TEAM を押すとチームを変えられます' : status;
    s.className = 'lb-status ' + lb.status;
    // The host always has the invitation to hand; it does not come and go with the seats.
    // Host-only controls keep their place for a guest (unseen, not removed),
    // so the room is laid out the same on every screen.
    $('#lb-invite').classList.toggle('ghost', !lb.url);
    if (lb.url && $('#lb-url').value !== lb.url) $('#lb-url').value = lb.url;

    // One tall card for each seat. Everything about a seat is on its card:
    // who sits there (a menu), the blade, and in a team match the team.
    const editable = (i) => { const p = lb.slots[i]; return i === mine ? p.kind === 'human' && !p.ready : false; };
    const cards = $('#lb-cards');
    cards.innerHTML = '';
    this.tip(null);
    this.menu(null);
    lb.slots.forEach((p, i) => {
      const b = BLADES[p.blade], you = i === mine, empty = p.kind === 'open', off = p.kind === 'none';
      const active = !empty && !off;
      const can = active && (editable(i) || (host && p.kind === 'cpu'));
      const taken = i !== mine && p.kind === 'human';
      const card = el('div', 'pcard' + (active ? '' : ' empty') + (off ? ' off' : '') + (active && (p.kind === 'cpu' || p.ready) ? ' ready' : '') + (you ? ' mine' : '')
        + (lb.teams && active ? (p.team ? ' team-b' : ' team-a') : ''));
      card.style.setProperty('--c', active ? (b ? b.css : '#8fa0c8') : '#3a4566');

      // The header: the seat number and how things stand.
      const state = !active ? '' : p.kind === 'cpu' ? 'READY' : p.ready ? 'READY' : '準備中';
      const head = el('div', 'pc-top', `<span class="pc-no">${i + 1}P</span><span class="pc-who">${you ? 'YOU' : i === 0 && p.kind === 'human' ? 'HOST' : ''}</span><em>${state}</em>`);
      card.appendChild(head);

      // Who sits here. The host picks from a menu; everyone else just reads it.
      const label = p.kind === 'cpu' ? `CPU ・ ${DIFFICULTY[p.level].name}` : empty ? '人間（参加待ち）' : off ? 'なし' : i === 0 ? '自分で操作' : taken || !host ? 'プレイヤー' : '人間';
      const sel = el(host && !taken ? 'button' : 'div', 'seat-sel', `<span>${host && i === 0 && p.kind === 'human' ? '自分で操作' : label}</span>${host && !taken ? '<i>▾</i>' : ''}`);
      if (host && !taken) {
        const items = [];
        if (i === 0) items.push({ label: '自分で操作', on: p.kind === 'human', pick: () => this.h.seat(i, 'human') });
        else items.push({ label: '人間（招待URLから参加）', on: p.kind === 'open', pick: () => this.h.seat(i, 'open') });
        DIFFICULTY.forEach((d, n) => items.push({ label: `CPU ・ ${d.name}`, note: d.ja, on: p.kind === 'cpu' && p.level === n, pick: () => this.h.seat(i, 'cpu', n) }));
        if (i > 0) items.push({ label: 'なし', note: 'この席を使わない', on: off, pick: () => this.h.seat(i, 'none') });
        sel.onclick = (e) => { e.stopPropagation(); this.menu(sel, items); };
      }
      card.appendChild(sel);

      // The blade. Clicking it opens the picker.
      const body = el('div', 'pc-body' + (can ? ' can' : ''));
      if (!active) {
        body.innerHTML = empty
          ? `<div class="pc-wait"><div class="pc-plus">＋</div><b>参加待ち</b><span>招待URLを開いた相手が<br>ここに入ります</span></div>`
          : `<div class="pc-wait"><b>—</b></div>`;
      } else {
        const skills = b ? kitOf(b).map((S, k) => `<div class="pc-skill" data-k="${k}"><kbd>${KEYS[k]}</kbd><div class="how-icon">${iconOf(S)}</div><span>${S.name}</span></div>`).join('') : '';
        body.innerHTML = `<div class="pc-disc"><i></i></div><div class="pc-type">${b ? b.type : '？？？'}</div><div class="pc-en">${b ? b.en : 'RANDOM'}</div><div class="pc-name">${b ? b.name : 'おまかせ'}</div>`
          + (b ? `${this.bars[b.id]}<p class="pc-desc">${b.desc}</p><div class="pc-skills">${skills}</div>` : '<p class="pc-desc">対戦のたびにランダムなブレードが選ばれます。</p>');
        if (can) body.onclick = () => this.h.edit(i);
        if (b) body.querySelectorAll('.pc-skill').forEach((row) => {
          const k = Number(row.dataset.k);
          row.onmouseenter = () => this.tip(row, kitOf(b)[k], b, KEYS[k]);
          row.onmouseleave = () => this.tip(null);
        });
      }
      card.appendChild(body);

      // The foot of the card: the team in a team match, otherwise a word about what a click does.
      const foot = el('div', 'pc-foot');
      if (lb.teams && active) {
        const may = (host || you) && !(p.kind === 'human' && p.ready);
        const tb = el(may ? 'button' : 'div', 'pc-team ' + (p.team ? 'b' : 'a'), `<b>TEAM ${p.team ? 'B' : 'A'}</b>${may ? '<i>⇄</i>' : ''}`);
        if (may) { tb.title = 'クリックでチームを変える'; tb.onclick = (e) => { e.stopPropagation(); this.h.team(i); }; }
        foot.appendChild(tb);
      } else foot.innerHTML = `<span>${can ? 'クリックでブレードを変える' : you && p.ready ? '準備完了' : ''}</span>`;
      card.appendChild(foot);
      cards.appendChild(card);
    });

    // The rules, as one choice: everyone for themselves, two teams, or two teams that can hurt their own.
    const rule = lb.teams ? (lb.ff ? 2 : 1) : 0;
    const rules = $('#lb-rules');
    rules.innerHTML = '';
    [['バトルロイヤル', '全員が敵。最後の1体が勝ち'], ['チーム戦', '2チームに分かれる。味方には当たらない'], ['チーム戦（同士討ちあり）', '味方の攻撃も当たる']].forEach(([name, note], n) => {
      const btn = el('button', 'rule' + (rule === n ? ' on' : ''), `<i></i><b>${name}</b><span>${note}</span>`);
      btn.disabled = !host;
      btn.onclick = () => this.h.rule(n);
      rules.appendChild(btn);
    });

    const g = STAGES[lb.stage];
    $('#st-pic').innerHTML = this.stagePic(g);
    $('#st-name').textContent = g.name + (g.soon ? '（準備中）' : '');
    $('#st-ja').textContent = g.ja;
    // How wide the arena is: the host's choice, like the stage.
    const sizes = $('#lb-size');
    sizes.innerHTML = '';
    ARENA_SIZES.forEach((z, n) => {
      const btn = el('button', 'rule' + (lb.size === n ? ' on' : ''), `<i></i><b>${z.name}</b><span>${z.ja}</span>`);
      btn.disabled = !host;
      btn.onclick = () => this.h.size(n);
      sizes.appendChild(btn);
    });
    $('#st-prev').disabled = $('#st-next').disabled = !host;
    $('#st-prev').classList.toggle('ghost', !host);
    $('#st-next').classList.toggle('ghost', !host);

    // The blade picker, laid over the room, edits one seat.
    const open = !!lb.picking && lb.slots[lb.edit].kind !== 'open' && lb.slots[lb.edit].kind !== 'none';
    $('#picker').classList.toggle('hidden', !open);
    if (open) {
      const ed = lb.slots[lb.edit];
      $('#lb-editing').textContent = '　' + (ed.kind === 'cpu' ? `CPU（${lb.edit + 1}P）` : 'あなた');
      document.querySelectorAll('.blade').forEach((c) => {
        c.classList.toggle('on', c.dataset.id === ed.blade);
        });
      this.showBlade(ed.blade);
    }

    // Every person readies up; the host then starts the game.
    const r = $('#lb-ready'), go = $('#lb-start');
    const human = me.kind === 'human';
    // Always there: with a CPU in your own seat there is simply nothing to ready.
    r.disabled = !human || (!host && !linked);
    r.textContent = me.ready ? '準備を取り消す' : '準備完了';
    r.classList.toggle('armed', !!me.ready);
    go.classList.toggle('ghost', !host);
    if (!host) go.disabled = true;
    if (host) {
      const all = lb.slots.every((p) => p.kind === 'none' || p.kind === 'cpu' || (p.kind === 'human' && p.ready))
        && (!lb.teams || new Set(lb.slots.filter((p) => p.kind !== 'none').map((p) => p.team)).size === 2);
      go.disabled = waiting || !!g.soon || !all || lb.slots.filter((p) => p.kind !== 'none').length < 2;
      go.textContent = 'ゲーム開始';
    }
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

  finish(kind, won, watching) {
    const [en, ja] = FINISH[kind];
    this.announce(en, `${ja}　<b>${watching || (won ? 'ROUND GET!' : 'ROUND LOST…')}</b>`, 'finish ' + (won ? 'win' : 'lose'), 2.6);
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
      const f = this.fighters[t.side];
      if (!f) return;
      const r = Math.max(0, t.spin / t.spinMax);
      f.root.classList.toggle('gone', !!t.gone);
      // The pale bar behind lingers, then drains, so a big hit stays readable.
      if (f.ghostV < r) f.ghostV = r;
      f.ghostV += (r - f.ghostV) * Math.min(1, rdt * 2.2);
      f.fill.style.transform = `scaleX(${r})`;
      f.ghost.style.transform = `scaleX(${f.ghostV})`;
      // Grey spin: lost, but not gone. It sits just past the end of the bar.
      const grey = t.blade.grey || t.blade.ignite ? Math.min(1 - r, t.store / t.spinMax) : 0;
      f.grey.style.width = grey * 100 + '%';
      f.grey.style[f.left ? 'left' : 'right'] = r * 100 + '%';
      f.num.textContent = Math.ceil(Math.max(0, t.spin) * 3.6) + ' rpm';
      f.root.classList.toggle('low', r < 0.25);
      f.ult.style.transform = `scaleX(${t.ult / 100})`;
      const hasUlt = KEYS.some((k) => skillOf(t, k).ult);
      f.ultBox.classList.toggle('ready', hasUlt && t.ult >= 100);
      // Some blades have no gauge skill at all.
      f.ultBox.style.visibility = hasUlt ? '' : 'hidden';

      const tag = this.tags[i];
      const hide = t.out || t.gone || world.result || view.hidden(t);
      tag.root.style.opacity = hide ? 0 : 1;
      if (!hide) {
        const v = view.tops[i].group.position;
        const s = view.toScreen(v.x, v.y + 2.5, v.z);
        tag.root.style.transform = `translate(${s.x.toFixed(1)}px,${s.y.toFixed(1)}px)`;
        tag.fill.style.transform = `scaleX(${r})`;
      }
    });
    const me = world.tops[this.side];
    this.skills[FLASH.key].root.classList.toggle('wait', !(me.flash > 0));
    for (const k of KEYS) {
      const S = skillOf(me, k);
      const s = this.skills[k], cd = me.cd[k], total = S.cd * me.blade.cdMul;
      // While the recast window is open the key is live again, whatever the cooldown says.
      const again = !!S.re && me.re[k] > 0;
      const charging = !again && S.ult && me.ult < 100;
      // A stocked skill with nothing left in store is waiting for the next one to
      // come back, however short its own cooldown: it shows that wait, and is not lit.
      const empty = !!S.stock && me.stk <= 0;
      const wait = empty ? Math.max(cd, S.stock.every - me.stkT) : cd, span = empty ? S.stock.every : total;
      const ready = again || (wait <= 0 && !charging);
      s.cd.style.setProperty('--p', charging || again ? 0 : Math.min(1, wait / span));
      s.num.textContent = again ? '' : charging ? Math.floor(me.ult) + '%' : wait > 0 ? (wait < 1 ? wait.toFixed(1) : Math.ceil(wait)) : '';
      s.root.classList.toggle('again', again);
      // LUNAR ARSENAL: each of the three keys wears the colour of the weapon it stands for
      // (in hand, in the other hand, next to come).
      const wi = S.weapons ? me.wm : S.id === 'phase' ? me.wo : S.id === 'nextweapon' ? me.wq[0] : -1;
      if (wi >= 0) {
        const tint = '#' + kitOf(me.blade).find((q) => q.weapons).tints[wi].toString(16).padStart(6, '0');
        if (tint !== s.tint) { s.tint = tint; s.root.style.setProperty('--c', tint); s.root.classList.add('tinted'); }
      }
      const note = this.note(world, me, S, k);
      if (note !== s.note) { s.note = note; s.badge.textContent = note; s.badge.classList.toggle('on', note !== ''); }
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
    const danger = Math.max(0, 1 - me.spin / me.spinMax / 0.25);
    this.vignette.style.opacity = world.result ? 0 : danger * 0.9;
  }

  // The small counter on a skill button: stacks, shots left, objects out.
  note(world, me, S, key) {
    const foe = world.other(me);
    // A subject is chosen: each key shows the spell it would paint.
    if (me.subj && me.blade.painter) return world.aimSkill(me, key).short || '';
    if (S.weapons) return me.re[key] > 0 ? '縛' : S.short[me.wm] + me.wa[me.wm];
    if (S.weapon !== undefined) return kitOf(me.blade).find((q) => q.weapons).short[S.weapon] + me.wa[S.weapon];
    if (S.id === 'bindeclipse') return '縛';
    switch (S.id) {
      case 'inferno': return me.stack ? me.blade.style.ranks[Math.min(me.stack, me.blade.style.max) - 1] : '';
      case 'phase': return kitOf(me.blade).find((q) => q.weapons).short[me.wo];
      case 'nextweapon': return kitOf(me.blade).find((q) => q.weapons).short[me.wq[0]];
      case 'galeq': return me.stack >= S.stacks ? '竜巻' : me.stack ? String(me.stack) : '';
      case 'fourshot': return String(S.shots - me.stack);
      case 'brokenwings': return me.re[key] > 0 ? String(3 - me.stack) : '';
      case 'shadow': case 'distort': return me.re[key] > 0 ? '↩' : '';
      case 'flashfrost': return me.re[key] > 0 ? '炸裂' : '';
      case 'exile': return me.re[key] > 0 ? Math.ceil(me.re[key]) + 's' : '';
      case 'mimic': return KEYS[me.last];
      case 'guillotine': return foe.bleed ? '出血' + foe.bleed : '';
      case 'poison': return me.toggle ? 'ON' : '';
      case 'insanity': case 'upgrade': return me.buff > 0 ? Math.ceil(me.buff) + 's' : '';
      case 'lotus': case 'turret': { const n = world.own(me, S.id).length; return n ? String(n) : ''; }
      case 'conquer': case 'shift': return world.own(me, 'arise').length ? '' : '—';
    }
    // Skills described by fields (see `kind` in config.js).
    if (S.stock) return String(me.stk);
    if (S.star || S.tick) return me.perm ? '★' + me.perm : '';
    if (S.casts) return me.re[key] > 0 ? String(S.casts - me.stack) : '';
    if (S.re) return me.re[key] > 0 ? '↩' : '';
    if (S.permHit) return me.perm ? String(me.perm) : '';
    if (S.id === 'purgatory') return ((me.blade.doom.line + me.blade.doom.per * me.perm) * 100).toFixed(1) + '%';
    if (S.storeShield || S.storeHit || (me.blade.grey && key === 'W')) return me.store >= 1 ? String(Math.round(me.store)) : '';
    if (S.perTag) return foe.tag ? '釘' + foe.tag : '';
    if (S.id === 'bladecaller') { const n = world.own(me, 'feather').length; return n ? String(n) : ''; }
    if (S.id === 'keg') { const n = world.own(me, 'keg').length; return n ? String(n) : ''; }
    if (S.kind === 'buff' && S.dur) return me.buff > 0 ? Math.ceil(me.buff) + 's' : '';
    if (me.blade.ramp && key === 'Q') return me.stack ? '+' + Math.round(me.blade.ramp.per * me.stack * 100) + '%' : '';
    return '';
  }

  showResult(won, score, world, stats, watching) {
    // Your own top first, then the rest in order.
    const tops = [world.tops[this.side], ...world.tops.filter((t) => t.side !== this.side)];
    $('#result').classList.toggle('lose', !won);
    $('#result').classList.toggle('many', tops.length > 2);
    $('#res-title').textContent = watching ? 'FINISH' : won ? 'VICTORY' : 'DEFEAT';
    $('#res-sub').textContent = watching || (won ? '見事な勝利！' : 'あと一歩…もう一度挑戦しよう');
    $('#res-score').innerHTML = tops.map((t) => `<b style="color:${t.blade.css}">${score[t.side] || 0}</b>`).join('<span>-</span>');
    const cells = (f) => tops.map(f);
    const row = (label, f) => { const c = cells(f); return `<tr><td>${c[0]}</td><th>${label}</th>${c.slice(1).map((v) => `<td>${v}</td>`).join('')}</tr>`; };
    $('#res-stats').innerHTML = `<tr class="head"><td style="color:${tops[0].blade.css}">${tops[0].blade.name}</td><th></th>${tops.slice(1).map((t) => `<td style="color:${t.blade.css}">${t.blade.name}</td>`).join('')}</tr>`
      + row('与えたダメージ', (t) => Math.round(t.stats.dealt))
      + row('最大ヒット', (t) => Math.round(t.stats.maxHit))
      + row('スキル命中', (t) => t.stats.skillHits)
      + row('パリィ / 反射', (t) => t.stats.parries)
      + row('激突回数', (t) => t.stats.clashes);
    $('#res-finish').textContent = stats.join('　/　');
    this.show('result', true);
  }
}
