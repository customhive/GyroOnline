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
};

export const ENEMY_COLOR = 0xff3b4e;

// `aim` decides how a skill is targeted:
//   line / dash / blink / cone  -> a direction from the top toward the cursor
//   ground / leap               -> a point on the floor, limited by `range`
//   self                        -> fires on key press, no aiming
export const SKILLS = {
  // ---- AZURE FANG: hit-and-run attacker ------------------------------------
  sonic: {
    name: 'ソニックエッジ', en: 'SONIC EDGE', aim: 'line', cd: 3.5,
    range: 17, speed: 34, radius: 0.85, dmg: 46, kb: 9.5, slow: 1.2,
    desc: '狙った方向へ衝撃波を放つ。命中した相手を弾き飛ばし、少しの間スロウにする。',
  },
  phantom: {
    name: 'ファントムステップ', en: 'PHANTOM STEP', aim: 'blink', cd: 7,
    range: 6, speed: 30, empower: 3, bonus: 40, kb: 8,
    desc: '残像を残して瞬間移動する。移動中は無敵。その後3秒間、次の体当たりが強化される。',
  },
  blitz: {
    name: 'ブリッツダッシュ', en: 'BLITZ DASH', aim: 'dash', cd: 6,
    dist: 9.5, minDist: 4, speed: 40, dmg: 54, kb: 13.5,
    desc: '狙った地点へ高速で突進する。当てると大ダメージと強いノックバック。',
  },
  meteor: {
    name: 'メテオドライブ', en: 'METEOR DRIVE', aim: 'leap', cd: 2, ult: true,
    range: 11.5, aoe: 4.6, air: 1.0, dmg: 165, kb: 18.5,
    desc: '【必殺技】空高く跳び、指定地点へ落下して周囲を吹き飛ばす。',
  },
  // ---- GAIA BASTION: control and counter -----------------------------------
  quake: {
    name: 'クエイクピラー', en: 'QUAKE PILLAR', aim: 'ground', cd: 4.5,
    range: 10.5, aoe: 2.8, delay: 0.6, dmg: 72, stun: 1.0, kb: 4,
    desc: '指定地点の床を少し遅れて突き上げる。巻き込んだ相手にダメージを与え、動きを止める。',
  },
  aegis: {
    name: 'イージスガード', en: 'AEGIS GUARD', aim: 'self', cd: 7,
    dur: 1.4, parryDmg: 36,
    desc: '短時間バリアを張る。体当たりを受けるとパリィして反撃、飛び道具は撃ち返す。',
  },
  anchor: {
    name: 'アンカーチェーン', en: 'ANCHOR CHAIN', aim: 'line', cd: 8,
    range: 13.5, speed: 30, radius: 0.85, dmg: 36, pull: 19, slow: 1.8, chain: true,
    desc: '鎖を撃ち出し、命中した相手を自分の方へ引き寄せる。',
  },
  nova: {
    name: 'フォートレスノヴァ', en: 'FORTRESS NOVA', aim: 'self', cd: 2, ult: true,
    charge: 0.8, aoe: 6.5, dmg: 185, kb: 20, armor: 0.3,
    desc: '【必殺技】その場で力を溜め（溜め中は被ダメージ激減）、周囲一帯を吹き飛ばす。',
  },
  // ---- SOL ETERNAL: drain and outlast --------------------------------------
  flare: {
    name: 'プロミネンス', en: 'PROMINENCE', aim: 'cone', cd: 4.5,
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
    name: 'エクリプス', en: 'ECLIPSE', aim: 'self', cd: 2, ult: true,
    range: 9.5, breakRange: 12.5, dur: 3, drain: 38, heal: 0.5,
    desc: '【必殺技】近くの相手と光の帯でつながり、3秒間回転を吸い取り続ける。離れすぎると切れる。',
  },
};
for (const id in SKILLS) SKILLS[id].id = id;

export const KEYS = ['Q', 'W', 'E', 'R'];
export const skillOf = (top, key) => SKILLS[top.blade.kit[key]];
export const kitOf = (blade) => KEYS.map((k) => SKILLS[blade.kit[k]]);

export const DIFFICULTY = [
  { id: 'easy', name: 'EASY', ja: 'やさしい', think: 0.95, aimErr: 3.2, dodge: 0.15, cast: 0.3, chase: 0.3, windup: 1.35 },
  { id: 'normal', name: 'NORMAL', ja: 'ふつう', think: 0.55, aimErr: 1.5, dodge: 0.5, cast: 0.5, chase: 0.5, windup: 1.0 },
  { id: 'hard', name: 'HARD', ja: 'つよい', think: 0.3, aimErr: 0.5, dodge: 0.85, cast: 0.75, chase: 0.7, windup: 0.8 },
];
