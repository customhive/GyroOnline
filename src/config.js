// Shared tuning. Distances are in arena units (a top is 1 unit in radius).

export const ARENA = {
  R: 13,            // playable radius (inner face of the rim wall)
  H: 2.4,           // bowl depth at the rim
  K: 3.0,           // strength of the pull toward the centre
  wallE: 0.7,       // wall restitution
  ringOutSpeed: 16.5, // outward speed at the wall that throws a launched top out
};

export const heightAt = (r) => {
  const k = Math.min(r, ARENA.R) / ARENA.R;
  return ARENA.H * k * k;
};

export const ROUND_TIME = 75;
export const ROUNDS_TO_WIN = 2;

export const BLADES = {
  azure: {
    id: 'azure', kit: { Q: 'sonic', W: 'phantom', E: 'blitz', R: 'meteor' },
    name: 'アズール・ファング', en: 'AZURE FANG', type: 'ATTACK', typeJa: 'アタック',
    color: 0x2fb8ff, css: '#2fb8ff', teeth: 3,
    atk: 1.27, def: 0.94, mass: 1.0, speed: 15.5, decay: 7.0, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 5, def: 2, sta: 2, spd: 5 },
    desc: '飛び道具・瞬間移動・突進で攻め立てるヒットアンドアウェイ型。',
  },
  gaia: {
    id: 'gaia', kit: { Q: 'quake', W: 'aegis', E: 'anchor', R: 'nova' },
    name: 'ガイア・バスティオン', en: 'GAIA BASTION', type: 'DEFENSE', typeJa: 'ディフェンス',
    color: 0x4dea8a, css: '#4dea8a', teeth: 6,
    atk: 1.04, def: 1.28, mass: 1.35, speed: 12.5, decay: 5.6, spinMax: 1000, cdMul: 1.0, guardMul: 1.35,
    bars: { atk: 2, def: 5, sta: 3, spd: 2 },
    desc: '足止め・引き寄せ・パリィで相手を捕まえるカウンター型。',
  },
  sol: {
    id: 'sol', kit: { Q: 'flare', W: 'sanctuary', E: 'satellite', R: 'eclipse' },
    name: 'ソル・エターナル', en: 'SOL ETERNAL', type: 'STAMINA', typeJa: 'スタミナ',
    color: 0xffb52e, css: '#ffb52e', teeth: 4,
    atk: 0.96, def: 1.0, mass: 1.05, speed: 14, decay: 5.4, spinMax: 1040, cdMul: 0.9, guardMul: 1.0,
    bars: { atk: 3, def: 3, sta: 5, spd: 3 },
    desc: '回転を吸収・回復しながら粘り勝つドレイン型。',
  },
  gale: {
    id: 'gale', kit: { Q: 'galeq', W: 'windwall', E: 'sweep', R: 'lastbreath' },
    name: 'ゲイル・ロンド', en: 'GALE RONDO', type: 'ATTACK', typeJa: 'アタック',
    color: 0xdfeaf2, css: '#dfeaf2', teeth: 4,
    atk: 1.25, def: 1.0, mass: 0.95, speed: 15.5, decay: 7.0, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 5, def: 2, sta: 2, spd: 5 },
    desc: '風を溜めて竜巻で打ち上げ、空中の相手に必殺技を叩き込む。',
  },
  nox: {
    id: 'nox', kit: { Q: 'shuriken', W: 'shadow', E: 'slash', R: 'deathmark' },
    name: 'ノクス・シェイド', en: 'NOX SHADE', type: 'ATTACK', typeJa: 'アタック',
    color: 0x7a86a8, css: '#7a86a8', teeth: 3,
    atk: 1.25, def: 0.94, mass: 0.95, speed: 15.5, decay: 7.0, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 5, def: 1, sta: 2, spd: 5 },
    desc: '影を置き、本体と影の二方向から攻める。影とは位置を入れ替えられる。',
  },
  curtain: {
    id: 'curtain', kit: { Q: 'fourshot', W: 'flourish', E: 'lotus', R: 'curtaincall' },
    name: 'カーテンコール', en: 'CURTAIN CALL', type: 'ATTACK', typeJa: 'アタック',
    color: 0xff5fb0, css: '#ff5fb0', teeth: 4,
    atk: 1.2, def: 0.94, mass: 0.95, speed: 13.5, decay: 6.6, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 5, def: 2, sta: 3, spd: 2 },
    desc: '4発装填の遠距離型。4発目と必殺技の最後の一発が重い。',
  },
  frost: {
    id: 'frost', kit: { Q: 'flashfrost', W: 'icewall', E: 'frostbite', R: 'blizzard' },
    name: 'フロスト・フェニックス', en: 'FROST PHOENIX', type: 'DEFENSE', typeJa: 'ディフェンス',
    color: 0x9fd8ff, css: '#9fd8ff', teeth: 6,
    atk: 1.05, def: 1.1, mass: 1.15, speed: 12.5, decay: 5.8, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 3, def: 4, sta: 4, spd: 2 },
    egg: { dur: 3, hp: 150, back: 0.3 },
    desc: '氷の壁と吹雪で動きを縛る。1ラウンドに1度、回転が尽きても卵になり、3秒耐えれば復活する。',
  },
  edge: {
    id: 'edge', kit: { Q: 'brokenwings', W: 'kiburst', E: 'valor', R: 'exile' },
    name: 'ブロークン・エッジ', en: 'BROKEN EDGE', type: 'ATTACK', typeJa: 'アタック',
    color: 0x2ee6c0, css: '#2ee6c0', teeth: 3,
    atk: 1.15, def: 1.0, mass: 1.05, speed: 15, decay: 6.8, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 4, def: 3, sta: 2, spd: 4 },
    buff: { atk: 1.15 },
    desc: '小刻みな突進をつないで張り付き、弱った相手を斬撃で仕留める。',
  },
  mirage: {
    id: 'mirage', kit: { Q: 'sigil', W: 'distort', E: 'ethereal', R: 'mimic' },
    name: 'ミラージュ・トリック', en: 'MIRAGE TRICK', type: 'ATTACK', typeJa: 'アタック',
    color: 0xb06bff, css: '#b06bff', teeth: 5,
    atk: 1.25, def: 0.94, mass: 0.92, speed: 15.5, decay: 6.8, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 4, def: 2, sta: 2, spd: 5 },
    buff: { atk: 1.4 },
    desc: '飛び込んでは元の位置へ戻り、直前の技をもう一度使って惑わす。',
  },
  guillo: {
    id: 'guillo', kit: { Q: 'decimate', W: 'cripple', E: 'apprehend', R: 'guillotine' },
    name: 'ギロチン・ロード', en: 'GUILLOTINE LORD', type: 'DEFENSE', typeJa: 'ディフェンス',
    color: 0xe8402e, css: '#e8402e', teeth: 4,
    atk: 1.04, def: 1.1, mass: 1.25, speed: 12.5, decay: 6.0, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 4, def: 4, sta: 3, spd: 2 },
    might: 1.15,
    desc: 'Q・W・Eを当てるたびに出血を重ねる。5スタックで攻撃力が上がり、必殺技の威力も跳ね上がる。',
  },
  venom: {
    id: 'venom', kit: { Q: 'poison', W: 'glue', E: 'fling', R: 'insanity' },
    name: 'ヴェノム・トレイル', en: 'VENOM TRAIL', type: 'STAMINA', typeJa: 'スタミナ',
    color: 0xa4e22a, css: '#a4e22a', teeth: 5,
    atk: 0.95, def: 1.1, mass: 1.2, speed: 14.5, decay: 5.2, spinMax: 1060, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 2, def: 4, sta: 5, spd: 3 },
    buff: { speed: 1.3, armor: 0.75, regen: 12 },
    desc: '走った跡を毒に変え、追いかけてくる相手を削る。近づかれたら背後へ投げ飛ばす。',
  },
  gear: {
    id: 'gear', kit: { Q: 'turret', W: 'rockets', E: 'grenade', R: 'upgrade' },
    name: 'ターレット・エンジニア', en: 'TURRET ENGINEER', type: 'STAMINA', typeJa: 'スタミナ',
    color: 0xff8448, css: '#ff8448', teeth: 6,
    atk: 1.0, def: 1.0, mass: 1.0, speed: 13.5, decay: 5.0, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 3, def: 2, sta: 4, spd: 3 },
    desc: '砲台を並べて陣地を作る設置型。必殺技で次のスキルを強化する。',
  },
  sand: {
    id: 'sand', kit: { Q: 'conquer', W: 'arise', E: 'shift', R: 'divide' },
    name: 'サンド・エンペラー', en: 'SAND EMPEROR', type: 'DEFENSE', typeJa: 'ディフェンス',
    color: 0xe6cf8a, css: '#e6cf8a', teeth: 5,
    atk: 1.05, def: 0.98, mass: 0.98, speed: 13.5, decay: 5.8, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 3, def: 3, sta: 3, spd: 3 },
    desc: '分身の砂兵を置いて戦わせる。砂兵の壁で相手を縁まで押し出す。',
  },
};

export const ENEMY_COLOR = 0xff3b4e;
// Stacking damage over time left by GUILLOTINE LORD's skills.
export const BLEED = { max: 5, dur: 8, dps: 3 };

// `aim` decides how a skill is targeted:
//   line / dash / blink / cone  -> a direction from the top toward the cursor
//   ground / leap               -> a point on the floor, limited by `range`
//   self                        -> fires on key press, no aiming
// Other fields shared by many skills:
//   tele    seconds the CPU telegraphs the skill before it fires
//   re      id of the skill the same key casts while its recast window is open
//   need    'range' (target within `range`), 'up' (target knocked up), 'soldier'
//   hidden  not in any kit: a second stage, or something an object fires
//   kb / tumble / launch / slow / stun / up / bleed / mark   what a hit does
//   keep    share of the ordinary collision damage a dash hit adds on top of its own
export const SKILLS = {
  // ---- AZURE FANG: hit-and-run attacker ------------------------------------
  sonic: {
    name: 'ソニックエッジ', en: 'SONIC EDGE', aim: 'line', cd: 3.5, tele: 0.42,
    range: 17, speed: 34, radius: 0.85, dmg: 46, kb: 9.5, slow: 1.2,
    desc: '狙った方向へ衝撃波を放つ。命中した相手を弾き飛ばし、少しの間スロウにする。',
  },
  phantom: {
    name: 'ファントムステップ', en: 'PHANTOM STEP', aim: 'blink', cd: 7,
    range: 6, speed: 30, empower: 3, bonus: 40, kb: 8,
    desc: '残像を残して瞬間移動する。移動中は無敵。その後3秒間、次の体当たりが強化される。',
  },
  blitz: {
    name: 'ブリッツダッシュ', en: 'BLITZ DASH', aim: 'dash', cd: 6, tele: 0.48,
    dist: 9.5, minDist: 4, speed: 40, dmg: 54, kb: 13.5,
    desc: '狙った地点へ高速で突進する。当てると大ダメージと強いノックバック。',
  },
  meteor: {
    name: 'メテオドライブ', en: 'METEOR DRIVE', aim: 'leap', cd: 2, ult: true,
    range: 11.5, aoe: 4.6, air: 1.0, height: 7.5, dmg: 165, kb: 18.5,
    desc: '【必殺技】空高く跳び、指定地点へ落下して周囲を吹き飛ばす。',
  },
  // ---- GAIA BASTION: control and counter -----------------------------------
  quake: {
    name: 'クエイクピラー', en: 'QUAKE PILLAR', aim: 'ground', cd: 4.5, tele: 0.2,
    range: 10.5, aoe: 2.8, delay: 0.6, dmg: 72, stun: 1.0, kb: 4,
    desc: '指定地点の床を少し遅れて突き上げる。巻き込んだ相手にダメージを与え、動きを止める。',
  },
  aegis: {
    name: 'イージスガード', en: 'AEGIS GUARD', aim: 'self', cd: 7,
    dur: 1.4, parryDmg: 36,
    desc: '短時間バリアを張る。体当たりを受けるとパリィして反撃、飛び道具は撃ち返す。',
  },
  anchor: {
    name: 'アンカーチェーン', en: 'ANCHOR CHAIN', aim: 'line', cd: 8, tele: 0.45,
    range: 13.5, speed: 30, radius: 0.85, dmg: 36, pull: 19, slow: 1.8, chain: true,
    desc: '鎖を撃ち出し、命中した相手を自分の方へ引き寄せる。',
  },
  nova: {
    name: 'フォートレスノヴァ', en: 'FORTRESS NOVA', aim: 'self', cd: 2, ult: true,
    charge: 0.8, root: true, aoe: 6.5, dmg: 185, kb: 20, armor: 0.3,
    desc: '【必殺技】その場で力を溜め（溜め中は被ダメージ激減）、周囲一帯を吹き飛ばす。',
  },
  // ---- SOL ETERNAL: drain and outlast --------------------------------------
  flare: {
    name: 'プロミネンス', en: 'PROMINENCE', aim: 'cone', cd: 4.5, tele: 0.36,
    range: 6.8, half: 0.6, dmg: 42, heal: 0.4, kb: 6,
    desc: '扇状に炎を噴き出す。与えたダメージの40%ぶん自分の回転が回復する。',
  },
  sanctuary: {
    name: 'サンクチュアリ', en: 'SANCTUARY', aim: 'self', cd: 12,
    radius: 4.4, dur: 5, regen: 13,
    desc: '足元に陽だまりを作る。中にいる間は回転が回復し続け、踏み込んだ相手はスロウになる。',
  },
  satellite: {
    name: 'サテライト', en: 'SATELLITE', aim: 'self', cd: 9,
    count: 3, dur: 6, orbit: 2.5, size: 0.55, dmg: 21, kb: 7,
    desc: '3つの光球を6秒間まとう。触れた相手にダメージを与えて弾く。',
  },
  eclipse: {
    name: 'エクリプス', en: 'ECLIPSE', aim: 'self', cd: 2, ult: true, need: 'range',
    range: 9.5, breakRange: 12.5, dur: 3, drain: 38, heal: 0.5,
    desc: '【必殺技】近くの相手と光の帯でつながり、3秒間回転を吸い取り続ける。離れすぎると切れる。',
  },
  // ---- GALE RONDO: stack wind, knock up, finish in the air -------------------
  galeq: {
    name: '旋風刃', en: 'STEEL GALE', aim: 'line', cd: 2.4, tele: 0.3,
    range: 7.5, speed: 46, radius: 1.0, dmg: 42, kb: 4, tumble: 0.15, launch: 0, stacks: 2, keep: 8,
    desc: '短い突きを放つ。QかEを合わせて2回当てると、次の一撃が相手を打ち上げる長射程の竜巻になる。',
  },
  tornado: {
    name: '旋風', en: 'TORNADO', aim: 'line', hidden: true,
    range: 15, speed: 26, radius: 1.6, dmg: 56, up: 1.2,
  },
  windwall: {
    name: '風の壁', en: 'WIND WALL', aim: 'line', cd: 14,
    ahead: 2.8, wall: 3.2, dur: 4,
    desc: '狙った方向に風の壁を4秒張る。相手の飛び道具を消す。',
  },
  sweep: {
    name: '颯歩', en: 'SWEEPING BLADE', aim: 'dash', cd: 3, tele: 0.35,
    dist: 5.5, minDist: 5.5, speed: 36, through: true, pass: 36, slow: 0.4,
    desc: '相手をすり抜ける短い突進。すれ違いざまにダメージを与え、Qの風も溜まる。',
  },
  lastbreath: {
    name: '終の息吹', en: 'LAST BREATH', aim: 'self', cd: 2, ult: true, need: 'up',
    range: 15, dmg: 170, kb: 12, gap: 2.6,
    desc: '【必殺技】打ち上げ中の相手にだけ使える。瞬時に飛びつき、連撃して外側へ叩き落とす。',
  },
  // ---- NOX SHADE: strike from two places at once ------------------------------
  shuriken: {
    name: '影手裏剣', en: 'RAZOR SHURIKEN', aim: 'line', cd: 3.5, tele: 0.4,
    range: 15, speed: 36, radius: 0.8, dmg: 44, kb: 5, tumble: 0.2,
    desc: '手裏剣を投げる。影があれば、影からも同じ地点へ向けて投げる。',
  },
  shadow: {
    name: '影分身', en: 'LIVING SHADOW', aim: 'ground', cd: 9, re: 'swap',
    range: 8, aoe: 1.3, dur: 4.5, max: 2,
    desc: '指定地点に影を4.5秒置く。もう一度押すと影と位置を入れ替える。',
  },
  swap: { name: '影渡り', en: 'SHADOW SWAP', aim: 'self', hidden: true },
  slash: {
    name: '影薙ぎ', en: 'SHADOW SLASH', aim: 'self', cd: 5,
    aoe: 3.3, dmg: 44, kb: 5, tumble: 0.2, shadowSlow: 1.6,
    desc: '本体と影の周囲を同時に斬る。影の斬撃が当たるとスロウ。',
  },
  deathmark: {
    name: '死の刻印', en: 'DEATH MARK', aim: 'self', cd: 2, ult: true, need: 'range',
    range: 10, gap: 2.6, dur: 3, pop: 80, share: 0.5,
    desc: '【必殺技】相手の背後へ瞬時に回り込み、刻印を付ける。3秒間に与えたダメージの50%が最後にまとめて炸裂する。',
  },
  // ---- CURTAIN CALL: four shots, the fourth is the heavy one --------------------
  fourshot: {
    name: '四拍子', en: 'FOUR COUNT', aim: 'line', cd: 1.5, tele: 0.3,
    range: 16, speed: 38, radius: 0.75, dmg: 30, kb: 5, tumble: 0.15, shots: 4, reload: 5,
    desc: '弾を撃つ。4発目は相手の回転が減っているほど威力が上がり、撃ったあとは装填が入る。',
  },
  fourth: {
    name: '四発目', en: 'FOURTH SHOT', aim: 'line', hidden: true,
    range: 18, speed: 42, radius: 1.0, dmg: 52, kb: 11, exec: 0.8,
  },
  flourish: {
    name: '致命の一閃', en: 'DEADLY FLOURISH', aim: 'line', cd: 9, tele: 0.45,
    range: 22, speed: 60, radius: 0.6, dmg: 40, slow: 1.5, root: 1.2,
    desc: '細く長い弾を撃ちスロウにする。直前2.5秒に自分の攻撃が当たっていれば、スタンに変わる。',
  },
  lotus: {
    name: '蓮の罠', en: 'LOTUS TRAP', aim: 'ground', cd: 8,
    range: 9, aoe: 3, trig: 1.7, arm: 0.6, fuse: 0.9, dur: 20, max: 2, dmg: 60, slow: 2, kb: 5,
    desc: '見えにくい罠を置く（最大2個）。踏んだ相手をスロウにし、少し遅れて爆発する。',
  },
  curtaincall: {
    name: '終幕', en: 'CURTAIN CALL', aim: 'cone', cd: 2, ult: true,
    range: 26, half: 0.5, shots: 4, first: 0.5, every: 0.75,
    desc: '【必殺技】その場に留まり、扇の中にいる相手を狙って超長射程弾を4発撃つ。最後の一発は特大。',
  },
  curtainshot: {
    name: '終幕', en: 'CURTAIN CALL', aim: 'line', hidden: true,
    range: 30, speed: 46, radius: 1.0, dmg: 50, kb: 7, slow: 1,
  },
  curtainlast: {
    name: '終幕', en: 'CURTAIN CALL', aim: 'line', hidden: true,
    range: 30, speed: 46, radius: 1.4, dmg: 105, kb: 15, slow: 1.5, exec: 0.5,
  },
  // ---- FROST PHOENIX: walls, chill and a second life ----------------------------
  flashfrost: {
    name: '氷閃', en: 'FLASH FROST', aim: 'line', cd: 8, tele: 0.3, re: 'shatter',
    range: 14, speed: 13, radius: 1.2, dmg: 32, slow: 1.5, pierce: true,
    desc: 'ゆっくり進む氷球を撃ち、通過した相手をスロウにする。もう一度押すとその場で炸裂し、周囲をスタン。',
  },
  shatter: {
    name: '氷閃・炸裂', en: 'SHATTER', aim: 'self', hidden: true,
    aoe: 3.3, dmg: 52, stun: 1.1,
  },
  icewall: {
    name: '氷壁', en: 'CRYSTALLIZE', aim: 'ground', cd: 14,
    range: 9, wall: 3.2, aoe: 3.2, dur: 4, solid: true,
    desc: '狙った地点に氷の壁を4秒作る。コマも飛び道具も通れない。',
  },
  frostbite: {
    name: '凍傷', en: 'FROSTBITE', aim: 'line', cd: 4, tele: 0.35,
    range: 8.5, speed: 30, radius: 0.8, dmg: 40, kb: 3, tumble: 0.1, chill: 2,
    desc: '短射程の氷弾。スロウ・スタン・打ち上げ中の相手には2倍のダメージ。',
  },
  blizzard: {
    name: '吹雪', en: 'GLACIAL STORM', aim: 'ground', cd: 2, ult: true,
    range: 10, aoe: 5.6, r0: 2.6, grow: 1.5, dur: 6, dps: 40,
    desc: '【必殺技】徐々に広がる吹雪を6秒起こす。中の相手はスロウになり、回転を削られ続ける。',
  },
  // ---- BROKEN EDGE: short dashes, then the finishing cut ------------------------
  brokenwings: {
    name: '三連舞', en: 'BROKEN WINGS', aim: 'dash', cd: 10, tele: 0.3, re: 'brokenwings',
    dist: 4.2, minDist: 3, speed: 30, dmg: 18, keep: 0.3, kb: 5, window: 3, aoe: 2.9, slam: 28, slamUp: 0.6,
    desc: '3回まで続けて使える短い突進。3回目は着地点の周囲を打ち上げる。',
  },
  kiburst: {
    name: '気合', en: 'KI BURST', aim: 'self', cd: 7,
    aoe: 3.1, dmg: 26, stun: 0.55,
    desc: '周囲の相手を一瞬スタンさせる。',
  },
  valor: {
    name: '勇進', en: 'VALOR', aim: 'dash', cd: 8,
    dist: 4.8, minDist: 3, speed: 32, dmg: 8, keep: 0.3, kb: 4, shield: 70, hold: 2,
    desc: '短く突進し、2秒間ダメージを肩代わりするバリアを張る。',
  },
  exile: {
    name: '追放者の刃', en: 'BLADE OF THE EXILE', aim: 'self', cd: 2, ult: true, re: 'windslash',
    dur: 10,
    desc: '【必殺技】10秒間、与えるダメージが15%上がる。その間にもう一度押すと斬撃を飛ばし、相手の回転が少ないほど大ダメージ。',
  },
  windslash: {
    name: '風斬り', en: 'WIND SLASH', aim: 'cone', hidden: true,
    range: 13, half: 0.3, speed: 36, radius: 0.9, dmg: 54, kb: 9, exec: 1.0, fan: 3,
  },
  // ---- MIRAGE TRICK: in, out, and once more ---------------------------------------
  sigil: {
    name: '悪意の印', en: 'SIGIL OF MALICE', aim: 'line', cd: 4.5, tele: 0.38,
    range: 13, speed: 36, radius: 0.8, dmg: 38, kb: 3, tumble: 0.1, mark: 3.5, pop: 46,
    desc: '弾を当てて印を付ける。印は次に自分のスキルが当たると炸裂する。',
  },
  distort: {
    name: 'ゆがみ', en: 'DISTORTION', aim: 'dash', cd: 8, tele: 0.3, re: 'recall',
    dist: 8, minDist: 3, speed: 38, through: true, aoe: 2.9, dmg: 50, kb: 6, tumble: 0.25, window: 3,
    desc: '狙った地点へ飛び込み、着地点の周囲にダメージ。3秒以内にもう一度押すと元の位置へ戻る。',
  },
  recall: { name: 'ゆがみ・帰還', en: 'RETURN', aim: 'self', hidden: true },
  ethereal: {
    name: '幻の鎖', en: 'ETHEREAL CHAINS', aim: 'line', cd: 11, tele: 0.42,
    range: 11, speed: 32, radius: 0.8, dmg: 24, slow: 1.5, dur: 1.5, safe: 6, breakRange: 10.5, pop: 54, root: 1.3,
    desc: '鎖でつなぐ。1.5秒のあいだ引きちぎられなければ、相手をスタンさせる。',
  },
  mimic: {
    name: '再演', en: 'MIMIC', aim: 'self', cd: 2, ult: true,
    dur: 2.8,
    desc: '【必殺技】直前に使ったスキルを、威力を40%上げてもう一度使う。',
  },
  // ---- GUILLOTINE LORD: bleed them, then end it ------------------------------------
  decimate: {
    name: '皆殺しの斧', en: 'DECIMATE', aim: 'self', cd: 7,
    charge: 0.5, aoe: 5.2, inner: 2.7, dmg: 54, weak: 20, heal: 0.08, bleed: 1,
    desc: '少し溜めてドーナツ状に斬る。外周で当てると大ダメージと回復、内側は威力が低い。出血を付ける。',
  },
  cripple: {
    name: '脚砕き', en: 'CRIPPLING STRIKE', aim: 'self', cd: 6,
    empower: 4, bonus: 30, kb: 6, slow: 2.2, bleed: 1,
    desc: '4秒間、次の体当たりを強化する。当てると強いスロウと出血を付ける。',
  },
  apprehend: {
    name: '捕縛', en: 'APPREHEND', aim: 'cone', cd: 10, tele: 0.35,
    range: 7.8, half: 0.5, dmg: 20, pull: 17, slow: 1.2, bleed: 1,
    desc: '扇の中の相手を手前へ引き寄せる。出血を付ける。',
  },
  guillotine: {
    name: '断頭台', en: 'NOXIAN GUILLOTINE', aim: 'dash', cd: 2, ult: true, tele: 0.4,
    dist: 9.5, minDist: 4, speed: 38, dmg: 85, kb: 12, perBleed: 0.15,
    desc: '【必殺技】狙った方向へ突進し、当たった相手を断つ。相手の出血1スタックにつき威力が15%上がる。',
  },
  // ---- VENOM TRAIL: make them chase you ---------------------------------------------
  poison: {
    name: '毒の軌跡', en: 'POISON TRAIL', aim: 'self', cd: 1,
    cost: 7, every: 0.3, aoe: 1.4, dur: 3.2, dps: 23, linger: 1.2,
    desc: '切り替え式。オンの間は回転を少しずつ消費し、通った跡を毒の床にする。',
  },
  glue: {
    name: '強力粘着剤', en: 'MEGA ADHESIVE', aim: 'ground', cd: 12,
    range: 10, aoe: 3.3, dur: 5,
    desc: '粘着床を5秒置く。中の相手は大きくスロウになり、突進・瞬間移動・跳躍が使えない。',
  },
  fling: {
    name: '投げ飛ばし', en: 'FLING', aim: 'self', cd: 9, need: 'range',
    range: 3.6, dist: 5.5, air: 0.55, height: 3.2, dmg: 42, stun: 1.4,
    desc: '密着した相手を自分の背後へ放り投げる。粘着床に落とすとスタン。',
  },
  insanity: {
    name: '狂気の薬', en: 'INSANITY POTION', aim: 'self', cd: 2, ult: true,
    dur: 8,
    desc: '【必殺技】8秒間、移動速度が上がり、被ダメージが減り、回転が回復し続ける。',
  },
  // ---- TURRET ENGINEER: hold ground with machines ------------------------------------
  turret: {
    name: '砲台設置', en: 'H-28G TURRET', aim: 'ground', cd: 6, big: true,
    range: 7, aoe: 1.1, dur: 18, bigDur: 9, max: 3, reach: 10.5, rate: 0.9, dmg: 20, bigDmg: 38,
    desc: '相手を自動で撃つ砲台を置く（最大3基）。体当たりされると壊れる。',
  },
  turretshot: {
    name: '砲台', en: 'TURRET', aim: 'line', hidden: true,
    range: 11, speed: 28, radius: 0.5, dmg: 13, kb: 1.5, tumble: 0, launch: 0,
  },
  rockets: {
    name: 'マイクロロケット', en: 'MICRO-ROCKETS', aim: 'cone', cd: 7, tele: 0.35, big: true,
    range: 12, half: 0.26, speed: 30, radius: 0.55, dmg: 24, kb: 2, tumble: 0, launch: 0, fan: 5, bigFan: 9,
    desc: '扇状に5発のロケットを撃つ。近いほど多く当たる。',
  },
  grenade: {
    name: '電磁グレネード', en: 'CH-2 GRENADE', aim: 'ground', cd: 8, tele: 0.15, big: true,
    range: 10, aoe: 3, bigAoe: 4.3, delay: 0.55, core: 1.4, dmg: 56, bigDmg: 96, stun: 1.4, slow: 1.8, boost: 3,
    desc: '爆弾を投げる。中心で当てるとスタン、外側はスロウ。巻き込んだ自分の砲台は3秒間連射する。',
  },
  upgrade: {
    name: 'アップグレード!!!', en: 'UPGRADE!!!', aim: 'self', cd: 2, ult: true,
    dur: 10,
    desc: '【必殺技】10秒以内の次のQ・W・Eを強化する（大型砲台／9連ロケット／全域スタンの大型グレネード）。',
  },
  // ---- SAND EMPEROR: soldiers fight, the emperor shoves ------------------------------
  conquer: {
    name: '征服の砂', en: 'CONQUERING SANDS', aim: 'ground', cd: 6, need: 'soldier',
    range: 10, aoe: 1.6, speed: 30, dmg: 42, slow: 1.2,
    desc: 'すべての砂兵を指定地点へ突進させる。通り道の相手にダメージとスロウ。',
  },
  arise: {
    name: '目覚めよ！', en: 'ARISE!', aim: 'ground', cd: 3.5,
    range: 8, aoe: 2.7, reach: 2.7, leash: 10, dur: 9, max: 2, rate: 1.0, dmg: 18, kb: 3,
    desc: '分身の砂兵を置く（最大2体）。近づいた相手を自動で突く。自分が離れすぎると動かない。',
  },
  shift: {
    name: '流砂', en: 'SHIFTING SANDS', aim: 'self', cd: 9, need: 'soldier',
    speed: 36, dmg: 30, keep: 0.5, kb: 3, liftUp: 0.7, shield: 60, hold: 2,
    desc: '一番近い砂兵へ突進する。途中で相手に当たると打ち上げ、バリアを得る。',
  },
  divide: {
    name: '皇帝の分砂嶺', en: "EMPEROR'S DIVIDE", aim: 'line', cd: 2, ult: true, tele: 0.3,
    range: 8, radius: 3.6, wall: 3.6, back: 1, travel: 7, speed: 22, hold: 4, dmg: 100, kb: 18, solid: true,
    desc: '【必殺技】背後から砂兵の壁が前進し、相手を強く押し出す。壁は4秒残り、自分だけ通り抜けられる。',
  },
};
for (const id in SKILLS) SKILLS[id].id = id;

export const KEYS = ['Q', 'W', 'E', 'R'];
export const skillOf = (top, key) => SKILLS[top.blade.kit[key]];
export const kitOf = (blade) => KEYS.map((k) => SKILLS[blade.kit[k]]);
// The skill (if any) that powers up a blade's next body hit.
for (const b of Object.values(BLADES)) b.emp = kitOf(b).find((S) => S.bonus) || null;

export const DIFFICULTY = [
  { id: 'easy', name: 'EASY', ja: 'やさしい', think: 0.95, aimErr: 3.2, dodge: 0.15, cast: 0.3, chase: 0.3, windup: 1.35 },
  { id: 'normal', name: 'NORMAL', ja: 'ふつう', think: 0.55, aimErr: 1.5, dodge: 0.5, cast: 0.5, chase: 0.5, windup: 1.0 },
  { id: 'hard', name: 'HARD', ja: 'つよい', think: 0.3, aimErr: 0.5, dodge: 0.85, cast: 0.75, chase: 0.7, windup: 0.8 },
];
