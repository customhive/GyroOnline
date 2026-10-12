// Shared tuning. Distances are in arena units (a top is 1 unit in radius).

export const ARENA = {
  R: 13,            // playable radius (inner face of the rim wall)
  H: 2.4,           // bowl depth at the rim
  K: 3.0,           // strength of the pull toward the centre
  wallE: 0.7,       // wall restitution
  ringOutSpeed: 16.5, // outward speed at the wall that throws a launched top out
};

// How wide the arena is: the room's host chooses. Everything measures itself
// against ARENA.R, so this is the one number that changes.
export const ARENA_SIZES = [
  { id: 'std', R: 13, name: '標準', ja: 'いつもの広さ' },
  { id: 'wide', R: 16, name: '広い', ja: '面積1.5倍。3〜4人向け' },
];
export const setArenaSize = (i) => { ARENA.R = (ARENA_SIZES[i] || ARENA_SIZES[0]).R; };

export const heightAt = (r) => {
  const k = Math.min(r, ARENA.R) / ARENA.R;
  return ARENA.H * k * k;
};

// FLASH: every top can step straight to a spot nearby, once a round.
export const FLASH = { key: 'F', range: 4 };

export const ROUND_TIME = 75;
export const ROUNDS_TO_WIN = 2;

export const BLADES = {
  azure: {
    id: 'azure', kit: { Q: 'sonic', W: 'phantom', E: 'blitz', R: 'meteor' },
    name: 'アズール・ファング', en: 'AZURE FANG', type: 'ATTACK', typeJa: 'アタック',
    color: 0x2fb8ff, css: '#2fb8ff', teeth: 3,
    atk: 1.27, def: 0.94, mass: 1.0, speed: 15.5, decay: 7.0, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 5, def: 2, sta: 2, spd: 5 },
    desc: '弾・瞬間移動・突進で攻めては離れるヒットアンドアウェイ型。',
  },
  gaia: {
    id: 'gaia', kit: { Q: 'quake', W: 'aegis', E: 'anchor', R: 'nova' },
    name: 'ガイア・バスティオン', en: 'GAIA BASTION', type: 'DEFENSE', typeJa: 'ディフェンス',
    color: 0x4dea8a, css: '#4dea8a', teeth: 6,
    atk: 1.04, def: 1.28, mass: 1.35, speed: 12.5, decay: 5.6, spinMax: 1000, cdMul: 1.0, guardMul: 1.35,
    bars: { atk: 2, def: 5, sta: 3, spd: 2 },
    desc: 'スタン・引き寄せ・反撃で相手を捕まえるカウンター型。',
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
    atk: 1.56, def: 1.16, mass: 0.95, speed: 15.5, decay: 6.6, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 5, def: 2, sta: 2, spd: 5 },
    desc: 'QとEで風を溜め、竜巻で打ち上げた相手を必殺技で仕留める。',
  },
  nox: {
    id: 'nox', kit: { Q: 'shuriken', W: 'shadow', E: 'slash', R: 'deathmark' },
    name: 'ノクス・シェイド', en: 'NOX SHADE', type: 'ATTACK', typeJa: 'アタック',
    color: 0x7a86a8, css: '#7a86a8', teeth: 3,
    atk: 1.5, def: 1.04, mass: 0.95, speed: 15.5, decay: 6.6, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 5, def: 1, sta: 2, spd: 5 },
    desc: '影を置き、自分と影の2方向から攻める。影とは位置を入れ替えられる。',
  },
  curtain: {
    id: 'curtain', kit: { Q: 'fourshot', W: 'flourish', E: 'lotus', R: 'curtaincall' },
    name: 'フィナーレ・ガンナー', en: 'FINALE GUNNER', type: 'ATTACK', typeJa: 'アタック',
    color: 0xff5fb0, css: '#ff5fb0', teeth: 4,
    atk: 1.2, def: 0.94, mass: 0.95, speed: 13.5, decay: 6.6, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 5, def: 2, sta: 3, spd: 2 },
    desc: '4発ごとに装填する遠距離型。4発目と、必殺技の最後の1発はダメージが大きい。',
  },
  frost: {
    id: 'frost', kit: { Q: 'flashfrost', W: 'icewall', E: 'frostbite', R: 'blizzard' },
    name: 'フロスト・フェニックス', en: 'FROST PHOENIX', type: 'DEFENSE', typeJa: 'ディフェンス',
    color: 0x9fd8ff, css: '#9fd8ff', teeth: 6,
    atk: 1.28, def: 1.15, mass: 1.15, speed: 12.5, decay: 5.5, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 3, def: 4, sta: 4, spd: 2 },
    egg: { dur: 3, hp: 150, back: 0.3 },
    desc: '凍結させた相手に大きなダメージを与え、氷の壁と吹雪で動きを制限する。1ラウンドに1度、回転が尽きても卵になり、3秒間耐えれば復活する。',
  },
  edge: {
    id: 'edge', kit: { Q: 'brokenwings', W: 'kiburst', E: 'valor', R: 'exile' },
    name: 'ブロークン・エッジ', en: 'BROKEN EDGE', type: 'ATTACK', typeJa: 'アタック',
    color: 0x2ee6c0, css: '#2ee6c0', teeth: 3,
    atk: 1.15, def: 1.0, mass: 1.05, speed: 15, decay: 6.8, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 4, def: 3, sta: 2, spd: 4 },
    buff: { atk: 1.2 },
    desc: '短い突進をつないで張り付き、回転の減った相手を必殺技で仕留める。',
  },
  mirage: {
    id: 'mirage', kit: { Q: 'sigil', W: 'distort', E: 'ethereal', R: 'mimic' },
    name: 'ミラージュ・トリック', en: 'MIRAGE TRICK', type: 'ATTACK', typeJa: 'アタック',
    color: 0xb06bff, css: '#b06bff', teeth: 5,
    atk: 1.48, def: 1.06, mass: 0.92, speed: 15.5, decay: 6.2, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 4, def: 2, sta: 2, spd: 5 },
    buff: { atk: 1.4 },
    ghostRet: true,
    desc: '突進しては元の位置へ戻り、直前のスキルをもう一度使って攻める。',
  },
  guillo: {
    id: 'guillo', kit: { Q: 'decimate', W: 'cripple', E: 'apprehend', R: 'guillotine' },
    name: 'ギロチン・ロード', en: 'GUILLOTINE LORD', type: 'DEFENSE', typeJa: 'ディフェンス',
    color: 0xe8402e, css: '#e8402e', teeth: 4,
    atk: 1.04, def: 1.1, mass: 1.25, speed: 12.5, decay: 6.0, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 4, def: 4, sta: 3, spd: 2 },
    might: 1.15,
    desc: 'Q・W・Eを当てるたびに出血を重ねる。出血が5つ重なった相手には与えるダメージが15%増え、必殺技のダメージも増える。',
  },
  venom: {
    id: 'venom', kit: { Q: 'poison', W: 'glue', E: 'fling', R: 'insanity' },
    name: 'ヴェノム・トレイル', en: 'VENOM TRAIL', type: 'STAMINA', typeJa: 'スタミナ',
    color: 0xa4e22a, css: '#a4e22a', teeth: 5,
    atk: 0.95, def: 1.02, mass: 1.2, speed: 14.5, decay: 5.6, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 2, def: 4, sta: 5, spd: 3 },
    buff: { speed: 1.3, armor: 0.8, regen: 8 },
    desc: '通った跡を毒の床に変え、追ってくる相手にダメージを与える。近づいた相手は背後へ投げる。',
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
    name: 'デューン・コマンダー', en: 'DUNE COMMANDER', type: 'DEFENSE', typeJa: 'ディフェンス',
    color: 0xe6cf8a, css: '#e6cf8a', teeth: 5,
    atk: 1.05, def: 0.98, mass: 0.98, speed: 13.5, decay: 5.8, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 3, def: 3, sta: 3, spd: 3 },
    desc: '衛兵を置いて戦わせる設置型。必殺技の壁で相手を吹き飛ばす。',
  },
  hammer: {
    id: 'hammer', kit: { Q: 'hshock', W: 'steadfast', E: 'hcharge', R: 'verdict' },
    name: 'アイアン・ハンマー', en: 'IRON HAMMER', type: 'DEFENSE', typeJa: 'ディフェンス',
    color: 0x5f8cff, css: '#5f8cff', teeth: 6,
    atk: 1.02, def: 1.15, mass: 1.3, speed: 12.5, decay: 5.9, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 3, def: 5, sta: 3, spd: 2 },
    pin: { dmg: 40, stun: 2 },
    desc: '相手を壁へ運んでスタンさせ、突進してくる相手はWで止める。溜めた必殺技は相手を場外近くまで吹き飛ばす。',
  },
  fox: {
    id: 'fox', kit: { Q: 'orb', W: 'foxfire', E: 'charm', R: 'rush' },
    name: 'ナインテイル・フレア', en: 'NINE TAIL FLARE', type: 'ATTACK', typeJa: 'アタック',
    color: 0xff8fd0, css: '#ff8fd0', teeth: 5,
    atk: 1.34, def: 1.0, mass: 0.94, speed: 15.5, decay: 6.4, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 4, def: 2, sta: 2, spd: 5 },
    desc: '行って戻る弾と、相手を引き寄せる魅了で攻める。必殺技は3回まで使える突進。',
  },
  reaper: {
    id: 'reaper', kit: { Q: 'bonehook', W: 'ghostwater', E: 'undertow', R: 'deathbelow' },
    name: 'ハープーン・ダイバー', en: 'HARPOON DIVER', type: 'ATTACK', typeJa: 'アタック',
    color: 0x1fae8c, css: '#1fae8c', teeth: 3,
    atk: 1.36, def: 1.02, mass: 0.96, speed: 15.5, decay: 6.5, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 5, def: 2, sta: 2, spd: 5 },
    store: { taken: 0.25, dealt: 0, max: 120, fade: 0 },
    grey: { rate: 45 },
    desc: 'Qで相手を引き寄せ、回転が20%未満の相手を必殺技で処刑する。',
  },
  barrel: {
    id: 'barrel', kit: { Q: 'cask', W: 'drunk', E: 'bodyslam', R: 'bigkeg' },
    name: 'バレル・ブルーザー', en: 'BARREL BRUISER', type: 'DEFENSE', typeJa: 'ディフェンス',
    color: 0xc97a3a, css: '#c97a3a', teeth: 6,
    atk: 0.94, def: 1.1, mass: 1.35, speed: 12.5, decay: 5.8, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 3, def: 4, sta: 4, spd: 2 },
    buff: { armor: 0.8 },
    desc: '樽と突進で、相手を狙った方向へ吹き飛ばす重量級。',
  },
  chrono: {
    id: 'chrono', kit: { Q: 'timewinder', W: 'parallel', E: 'phasedive', R: 'rewind' },
    name: 'クロノ・リワインド', en: 'CHRONO REWIND', type: 'STAMINA', typeJa: 'スタミナ',
    color: 0x4af0e0, css: '#4af0e0', teeth: 4,
    atk: 1.25, def: 1.04, mass: 0.98, speed: 15, decay: 5.6, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 3, def: 3, sta: 4, spd: 4 },
    rewind: 4,
    desc: '行って戻る弾、中に入って爆発させる罠、突進からの瞬間移動で攻める。必殺技で4秒前の位置へ戻る。',
  },
  iron: {
    id: 'iron', kit: { Q: 'obliterate', W: 'indestructible', E: 'deathgrasp', R: 'realm' },
    name: 'メイス・タイラント', en: 'MACE TYRANT', type: 'DEFENSE', typeJa: 'ディフェンス',
    color: 0x6f9f8a, css: '#6f9f8a', teeth: 4,
    atk: 1.25, def: 1.25, mass: 1.3, speed: 12.5, decay: 5.4, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 4, def: 4, sta: 4, spd: 1 },
    store: { taken: 0.15, dealt: 0.45, max: 140, fade: 4 },
    // DARKNESS RISE: three blows in a row (each within `keep` of the last) light an aura for `dur`,
    // kept alight by every blow after; it burns whatever is within `r` and quickens its owner.
    aura: { hits: 3, keep: 4, dur: 4, r: 3.4, dps: 18, speed: 1.09 },
    desc: '攻撃を3回続けて当てると4秒間、9%加速し、周囲の相手にダメージを与え続ける（当て続けるかぎり続く）。与えたダメージを蓄えてバリアに変える。必殺技は相手1人と自分を7秒間、輪の中に閉じ込める。',
  },
  dragon: {
    id: 'dragon', kit: { Q: 'sonicwave', W: 'safeguard', E: 'tempest', R: 'dragonrage' },
    name: 'ドラゴン・ストライカー', en: 'DRAGON STRIKER', type: 'ATTACK', typeJa: 'アタック',
    color: 0xff5a3c, css: '#ff5a3c', teeth: 3,
    atk: 1.08, def: 0.98, mass: 1.0, speed: 15.5, decay: 6.9, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 5, def: 3, sta: 2, spd: 5 },
    buff: { leech: 0.26 },
    desc: '弾を当てた相手へ瞬間移動し、背後に回って必殺技で場外へ吹き飛ばす。',
  },
  boss: {
    id: 'boss', kit: { Q: 'knuckle', W: 'haymaker', E: 'facebreaker', R: 'showstopper' },
    name: 'ブロウラー・キング', en: 'BRAWLER KING', type: 'DEFENSE', typeJa: 'ディフェンス',
    color: 0xf0a060, css: '#f0a060', teeth: 4,
    atk: 0.88, def: 1.0, mass: 1.3, speed: 13, decay: 6.0, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 4, def: 4, sta: 3, spd: 2 },
    store: { taken: 1, dealt: 0, max: 110, fade: 10 },
    desc: '受けたダメージを蓄え、攻撃とバリアに変える。必殺技は相手を掴んで運び、叩きつける。',
  },
  pirate: {
    id: 'pirate', kit: { Q: 'parrrley', W: 'orange', E: 'keg', R: 'barrage' },
    name: 'パウダー・キャプテン', en: 'POWDER CAPTAIN', type: 'ATTACK', typeJa: 'アタック',
    color: 0xd96a1e, css: '#d96a1e', teeth: 5,
    atk: 1.4, def: 1.08, mass: 1.0, speed: 13.5, decay: 5.9, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 4, def: 3, sta: 3, spd: 3 },
    desc: '樽を並べ、撃って連鎖爆発させる。必殺技はアリーナのどこへでも砲撃を降らせる。',
  },
  ash: {
    id: 'ash', kit: { Q: 'nails', W: 'ignition', E: 'pursuit', R: 'purgatory' },
    name: 'シンダー・ネイル', en: 'CINDER NAIL', type: 'ATTACK', typeJa: 'アタック',
    color: 0xb8b0a8, css: '#b8b0a8', teeth: 3,
    atk: 1.2, def: 0.94, mass: 0.95, speed: 15.5, decay: 6.9, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 5, def: 2, sta: 2, spd: 5 },
    nailPop: [20, 45, 80],
    doom: { line: 0.12, per: 0.005, max: 12 },
    ignite: { pay: 0.02, bonus: 30 },
    store: { taken: 1, dealt: 0, max: 120, fade: 0, whileBuff: true },
    desc: '釘を当ててスロウにし、回転の減った相手を必殺技で処刑する。',
  },
  prism: {
    id: 'prism', kit: { Q: 'binding', W: 'barrier', E: 'singularity', R: 'finalspark' },
    name: 'プリズム・レディアンス', en: 'PRISM RADIANCE', type: 'STAMINA', typeJa: 'スタミナ',
    color: 0xfff3a0, css: '#fff3a0', teeth: 6,
    atk: 1.35, def: 1.06, mass: 0.95, speed: 13.5, decay: 5.6, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 4, def: 2, sta: 4, spd: 3 },
    desc: '相手の移動を封じ、アリーナの端まで届く光線で撃つ遠距離型。',
  },
  canvas: {
    id: 'canvas', kit: { Q: 'subjdisaster', W: 'subjserenity', E: 'subjtorment', R: 'despair' }, painter: true,
    name: 'ヴィジョン・アーティスト', en: 'VISION ARTIST', type: 'STAMINA', typeJa: 'スタミナ',
    color: 0x7f7bff, css: '#7f7bff', teeth: 5,
    atk: 1.46, def: 1.1, mass: 0.96, speed: 13.5, decay: 5.4, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 3, def: 2, sta: 5, spd: 3 },
    desc: 'Q・W・Eでパレット（赤・青・紫）を選び、もう一度Q・W・Eを押してスキルを使う。3×3で9つのスキルを使い分ける。Rはパレットを選んでいる間は取り消し、選んでいなければ必殺技。',
  },
  star: {
    id: 'star', kit: { Q: 'paddle', W: 'thief', E: 'bubble', R: 'portal' },
    name: 'トワイライト・スター', en: 'TWILIGHT STAR', type: 'ATTACK', typeJa: 'アタック',
    color: 0xffb38a, css: '#ffb38a', teeth: 5,
    atk: 1.4, def: 1.05, mass: 0.92, speed: 15.5, decay: 6.4, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 5, def: 1, sta: 2, spd: 5 },
    desc: '飛ばし直して遠くから当てるほどダメージが増える弾と、時間差で眠らせる弾で攻める。Rは1秒間だけ別の位置から撃つための瞬間移動で、ゲージの必殺技は持たない。',
  },
  spark: {
    id: 'spark', kit: { Q: 'burstfire', W: 'ultrashock', E: 'surge', R: 'crash' },
    name: 'ボルト・ランナー', en: 'VOLT RUNNER', type: 'ATTACK', typeJa: 'アタック',
    color: 0xd8ff3a, css: '#d8ff3a', teeth: 4,
    atk: 1.1, def: 1.0, mass: 0.92, speed: 16, decay: 6.6, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 4, def: 2, sta: 2, spd: 5 },
    buff: { speed: 1.15, atk: 1.15, extendTo: 5 },
    desc: 'Qを押している間、弾を撃ち続ける連射型。必殺技を当てると加速し、与えるダメージが増える。',
  },
  plume: {
    id: 'plume', kit: { Q: 'daggers', W: 'plumage', E: 'bladecaller', R: 'storm' },
    name: 'プルーム・ダンサー', en: 'PLUME DANCER', type: 'ATTACK', typeJa: 'アタック',
    color: 0xd03a8c, css: '#d03a8c', teeth: 5,
    atk: 1.32, def: 1.0, mass: 0.95, speed: 14.5, decay: 6.4, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 5, def: 2, sta: 3, spd: 4 },
    plume: 'plumeshot',
    desc: '投げた羽根は床に残り、呼び戻すと通り道の相手にダメージを与える。3枚当てると移動を封じる。',
  },
  darkin: {
    id: 'darkin', kit: { Q: 'darkinblade', W: 'chains', E: 'umbral', R: 'worldender' },
    name: 'ブラッド・クレイモア', en: 'BLOOD CLAYMORE', type: 'ATTACK', typeJa: 'アタック',
    color: 0xc81e3c, css: '#c81e3c', teeth: 3,
    atk: 1.6, def: 1.32, mass: 1.15, speed: 13.5, decay: 5.8, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 5, def: 3, sta: 3, spd: 3 },
    buff: { atk: 1.3, speed: 1.2, leech: 0.3 },
    desc: '形の違う3回の斬撃を、先端で当てていく。必殺技の間は攻撃力が上がって加速し、与えたダメージで回転が回復する。',
  },
  rose: {
    id: 'rose', kit: { Q: 'flair', W: 'whirl', E: 'wildrush', R: 'inferno' },
    name: 'スタイル・ランカー', en: 'STYLE RANKER', type: 'ATTACK', typeJa: 'アタック',
    color: 0xe8566a, css: '#e8566a', teeth: 4,
    atk: 1.25, def: 0.98, mass: 0.98, speed: 15.5, decay: 6.6, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 5, def: 2, sta: 2, spd: 5 },
    style: { max: 6, keep: 8, speed: 0.035, ranks: ['E', 'D', 'C', 'B', 'A', 'S'] },
    desc: '直前と違う攻撃（体当たり・弾・斬撃・爆撃・W・E）を当てるたびにランクが上がり、加速する。ランクSでRが使える。ゲージの必殺技は持たない。',
  },
  glaive: {
    id: 'glaive', kit: { Q: 'darkglaive', W: 'dreaded', E: 'aureate', R: 'grim' },
    name: 'ゴールデン・グレイヴ', en: 'GOLDEN GLAIVE', type: 'DEFENSE', typeJa: 'ディフェンス',
    color: 0xe8b84a, css: '#e8b84a', teeth: 4,
    atk: 0.76, def: 0.9, mass: 1.2, speed: 13.5, decay: 7.4, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 4, def: 4, sta: 4, spd: 2 },
    ramp: { per: 0.008, max: 12, expire: 5 },
    egg: { dur: 3, hp: 150, back: 0.5, needStack: 12 },
    desc: '攻撃を当てるたびに攻撃力が上がる（5秒間当てないと消える）。12回ぶん溜まっていれば、回転が尽きても1度だけ復活する。',
  },
  lunar: {
    id: 'lunar', kit: { Q: 'arsenal', W: 'phase', E: 'nextweapon', R: 'vigil' },
    name: 'ルナ・アーセナル', en: 'LUNAR ARSENAL', type: 'ATTACK', typeJa: 'アタック',
    color: 0x8fb8ff, css: '#8fb8ff', teeth: 4,
    atk: 1.28, def: 1.02, mass: 0.94, speed: 13.5, decay: 6.2, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 5, def: 1, sta: 3, spd: 3 },
    desc: '5つの武器のうち2つを持ち、主と副を入れ替えながら戦う。使い切った武器は次の武器に替わり、次のラウンドに持ち越す。Eのスキルは無い。',
  },
  cosmos: {
    id: 'cosmos', kit: { Q: 'breath', W: 'flight', E: 'blackhole', R: 'fallingstar' },
    name: 'ネビュラ・ドレイク', en: 'NEBULA DRAKE', type: 'STAMINA', typeJa: 'スタミナ',
    color: 0x5a6cff, css: '#5a6cff', teeth: 6,
    atk: 1.1, def: 1.0, mass: 1.05, speed: 13, decay: 5.6, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 3, def: 3, sta: 5, spd: 2 },
    desc: '当てるたびにエナジーが溜まり、スキルの範囲が広がる。エナジーは次のラウンドに持ち越す。',
  },
  hex: {
    id: 'hex', kit: { Q: 'balefulstrike', W: 'darkmatter', E: 'horizon', R: 'primordial' },
    name: 'ダーク・ソーサラー', en: 'DARK SORCERER', type: 'STAMINA', typeJa: 'スタミナ',
    color: 0x9a4aff, css: '#9a4aff', teeth: 5,
    atk: 1.28, def: 1.06, mass: 0.94, speed: 13.5, decay: 5.4, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 3, def: 2, sta: 4, spd: 3 },
    permDmg: 0.02,
    desc: 'Qを当てるたびに魔力が溜まり、与えるダメージが2%ずつ増える（最大30回）。魔力は次のラウンドに持ち越す。',
  },
  gauntlet: {
    id: 'gauntlet', kit: { Q: 'vault', W: 'denting', E: 'relentless', R: 'cease' },
    name: 'ガントレット・ラッシュ', en: 'GAUNTLET RUSH', type: 'ATTACK', typeJa: 'アタック',
    color: 0xff4f9a, css: '#ff4f9a', teeth: 3,
    atk: 0.86, def: 0.98, mass: 1.15, speed: 14.5, decay: 6.8, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 5, def: 3, sta: 3, spd: 4 },
    dent: { dmg: 16, shred: 1.2, dur: 4, window: 3 },
    desc: '溜めた突進で攻め、3回当てるたびに相手の受けるダメージを増やす。必殺技は離れた相手を追って突進し、打ち上げる。',
  },
  arcane: {
    id: 'arcane', kit: { Q: 'mystic', W: 'flux', E: 'arcshift', R: 'trueshot' },
    name: 'アーケイン・シューター', en: 'ARCANE SHOOTER', type: 'ATTACK', typeJa: 'アタック',
    color: 0x6ae0ff, css: '#6ae0ff', teeth: 4,
    atk: 1.58, def: 1.1, mass: 0.92, speed: 15, decay: 5.9, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 5, def: 1, sta: 2, spd: 4 },
    desc: 'Qを当てるたびに、すべてのスキルのクールダウンが縮む射撃型。',
  },
  magus: {
    id: 'magus', kit: { Q: 'arcanopulse', W: 'eyeofdestruction', E: 'shockorb', R: 'arcanerite' },
    name: 'サンダー・セージ', en: 'THUNDER SAGE', type: 'ATTACK', typeJa: 'アタック',
    color: 0x5aa8ff, css: '#5aa8ff', teeth: 5,
    atk: 1.34, def: 1.0, mass: 0.94, speed: 13, decay: 6.0, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 5, def: 1, sta: 3, spd: 2 },
    desc: '溜めて伸ばす光線、中心で当てるとダメージが増える落雷、遠いほど長くスタンさせる弾で攻める。必殺技はその場から、アリーナのどこへでも砲撃を落とす。',
  },
  hunger: {
    id: 'hunger', kit: { Q: 'headrush', W: 'bloodfrenzy', E: 'chillingscream', R: 'certaindeath' },
    name: 'クリムゾン・ハンガー', en: 'CRIMSON HUNGER', type: 'ATTACK', typeJa: 'アタック',
    color: 0xd4264a, css: '#d4264a', teeth: 3,
    atk: 0.66, def: 0.88, mass: 1.0, speed: 14.5, decay: 7.4, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 5, def: 2, sta: 3, spd: 4 },
    costPct: 0.05, bleedAll: 1, bleedLeech: 0.25,
    buff: { speed: 1.4, frenzy: 3, hunt: true, leech: 0.1 },
    pin: { dmg: 70, stun: 1.5 },
    desc: 'スキルを使うたびに今の回転の5%を払い、出血させた相手から回転が回復する。Wの間は移動を操作できず、一番近い相手へ自動で突進し続ける。止める手段はEだけ。',
  },
  golem: {
    id: 'golem', kit: { Q: 'rocketgrab', W: 'overdrive', E: 'powerfist', R: 'staticfield' },
    name: 'ボイラー・タイタン', en: 'BOILER TITAN', type: 'DEFENSE', typeJa: 'ディフェンス',
    color: 0xf2b23a, css: '#f2b23a', teeth: 4,
    atk: 1.0, def: 1.12, mass: 1.3, speed: 12.5, decay: 5.7, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 3, def: 4, sta: 4, spd: 2 },
    lowShield: { at: 0.3, amount: 150, hold: 5 },
    desc: 'Qで相手を手元まで引き寄せ、Eで打ち上げる。必殺技は相手のバリアを消し、0.5秒間スキルを封じる。',
  },
  voideye: {
    id: 'voideye', kit: { Q: 'plasmafission', W: 'voidrift', E: 'tectonic', R: 'liferay' },
    name: 'アビス・レンズ', en: 'ABYSS LENS', type: 'ATTACK', typeJa: 'アタック',
    color: 0xb04cff, css: '#b04cff', teeth: 6,
    atk: 1.42, def: 1.04, mass: 0.94, speed: 13, decay: 6.0, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 5, def: 1, sta: 3, spd: 2 },
    decon: { n: 3, keep: 7, dmg: 42 },
    desc: '同じ相手にスキルを3回当てると分解し、防御を無視する追加ダメージを与える。左右に分かれる弾、2回爆発する直線、カーソルを追う必殺技の光線で攻める。',
  },
  purifier: {
    id: 'purifier', kit: { Q: 'piercinglight', W: 'ardentblaze', E: 'lightslide', R: 'culling' },
    name: 'ツイン・トリガー', en: 'TWIN TRIGGER', type: 'ATTACK', typeJa: 'アタック',
    color: 0xf4f0d8, css: '#f4f0d8', teeth: 4,
    atk: 1.62, def: 1.12, mass: 0.96, speed: 15, decay: 6.0, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 5, def: 2, sta: 2, spd: 5 },
    dbl: { window: 3.5, mul: 0.6, cuts: 'lightslide', cut: 2 },
    desc: 'スキルのあとの体当たりは2回当たり、そのたびにEのクールダウンが2秒縮む。',
  },
  weaver: {
    id: 'weaver', kit: { Q: 'threadedvolley', W: 'seismicshove', E: 'unraveled', R: 'weaverwall' },
    name: 'ロック・サーファー', en: 'ROCK SURFER', type: 'STAMINA', typeJa: 'スタミナ',
    color: 0xc98a4a, css: '#c98a4a', teeth: 5,
    atk: 1.42, def: 1.02, mass: 0.96, speed: 13.5, decay: 6.0, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 4, def: 2, sta: 3, spd: 3 },
    surf: 1.25,
    desc: '岩をまいた床へ相手を吹き飛ばして攻める。攻撃を受けていなければ壁際で加速し、必殺技の壁でアリーナを区切る。',
  },
  doctor: {
    id: 'doctor', kit: { Q: 'bonesaw', W: 'heartzapper', E: 'blunttrauma', R: 'maxdose' },
    name: 'マッド・ドクター', en: 'MAD DOCTOR', type: 'DEFENSE', typeJa: 'ディフェンス',
    color: 0x9be04a, css: '#9be04a', teeth: 4,
    atk: 0.66, def: 0.9, mass: 1.25, speed: 13, decay: 6.2, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 3, def: 4, sta: 5, spd: 2 },
    shrug: { cd: 15, pay: 0.04, far: 3 },
    store: { taken: 0.5, dealt: 0, max: 220, fade: 0, whileBuff: true },
    grey: { rate: 0 },
    buff: { regen: 44, speed: 1.2 },
    desc: '15秒に1度、スタンや打ち上げを無効にする。そのとき近くに薬瓶が落ち、拾うと回転が回復して次の無効化が早まる（相手が先に触れると消える）。受けたダメージの一部を蓄えて回復し、必殺技の間は回転が回復し続ける。',
  },
};

export const ENEMY_COLOR = 0xff3b4e;
// How long anything that takes a top out of its owner's hands lasts: stuns,
// snares, knock-ups, charms, fears, silence and sleep. Each skill is written
// with the time it has in the original; this one number stretches or shrinks
// them all together (1 = as written, 0.6 = the shorter holds of earlier builds).
// Slows are not part of it.
export const CC = { scale: 1 };
// Stacking damage over time left by GUILLOTINE LORD's skills.
export const BLEED = { max: 5, dur: 5, dps: 3 };

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
//   slowPct share of its speed a slow takes away (0.4 unless given)
//   ghost   drawn as a faint copy of its owner
//   keep    share of the ordinary collision damage a dash hit adds on top of its own
// Newer skills are described entirely by fields; `kind` picks the behaviour
// (see World.generic and World.genericZone in sim.js):
//   shot / bolts / dash / blink / blast / field / burst / cone / buff / leap / beam / kick / strike / throw
//   icon    which stock glyph the HUD draws for it
//   wind    { min, full, max }: the key is held to wind the skill up (see World.hold)
export const SKILLS = {
  // ---- AZURE FANG: hit-and-run attacker ------------------------------------
  sonic: {
    name: 'ソニックエッジ', en: 'SONIC EDGE', aim: 'line', cd: 3.5, tele: 0.42,
    range: 17, speed: 34, radius: 0.85, dmg: 46, kb: 9.5, slow: 1.2,
    desc: '狙った方向へ弾を撃つ。当たった相手を吹き飛ばし、1.2秒間40%のスロウにする。',
  },
  phantom: {
    name: 'ファントムステップ', en: 'PHANTOM STEP', aim: 'blink', cd: 7,
    range: 6, speed: 30, empower: 3, bonus: 40, kb: 8,
    desc: '瞬間移動する。移動中は無敵。その後3秒以内の次の体当たりを強化する。',
  },
  blitz: {
    name: 'ブリッツダッシュ', en: 'BLITZ DASH', aim: 'dash', cd: 6, tele: 0.48,
    dist: 9.5, minDist: 4, speed: 40, dmg: 54, kb: 13.5,
    desc: '狙った方向へ突進する。当たった相手に大きなダメージを与え、吹き飛ばす。',
  },
  meteor: {
    name: 'メテオドライブ', en: 'METEOR DRIVE', aim: 'leap', cd: 2, ult: true,
    range: 11.5, aoe: 4.6, air: 1.0, height: 7.5, dmg: 165, kb: 18.5,
    desc: '【必殺技】狙った地点へ跳躍し、着地点の周囲を吹き飛ばす。',
  },
  // ---- GAIA BASTION: control and counter -----------------------------------
  quake: {
    name: 'クエイクピラー', en: 'QUAKE PILLAR', aim: 'ground', cd: 4.5, tele: 0.2,
    range: 10.5, aoe: 2.8, delay: 0.6, dmg: 72, stun: 1.0, kb: 4,
    desc: '狙った地点を0.6秒後に突き上げる。範囲内の相手にダメージを与え、1秒間スタンさせる。',
  },
  aegis: {
    name: 'イージスガード', en: 'AEGIS GUARD', aim: 'self', cd: 7,
    dur: 1.4, parryDmg: 36,
    desc: '1.4秒間バリアを張る。体当たりを受けると反撃し、弾は撃ち返す。',
  },
  anchor: {
    name: 'アンカーチェーン', en: 'ANCHOR CHAIN', aim: 'line', cd: 8, tele: 0.45,
    range: 13.5, speed: 30, radius: 0.85, dmg: 36, pull: 19, slow: 1.8, chain: true,
    desc: '狙った方向へ鎖を撃つ。当たった相手を引き寄せ、1.8秒間40%のスロウにする。',
  },
  nova: {
    name: 'フォートレスノヴァ', en: 'FORTRESS NOVA', aim: 'self', cd: 2, ult: true,
    charge: 0.8, root: true, aoe: 6.5, dmg: 185, kb: 20, armor: 0.3,
    desc: '【必殺技】0.8秒間溜め、周囲を吹き飛ばす。溜めている間は移動できず、受けるダメージが70%減る。',
  },
  // ---- SOL ETERNAL: drain and outlast --------------------------------------
  flare: {
    name: 'プロミネンス', en: 'PROMINENCE', aim: 'cone', cd: 4.5, tele: 0.36,
    range: 6.8, half: 0.6, dmg: 42, heal: 0.4, kb: 6,
    desc: '扇状に炎を放つ。与えたダメージの40%ぶん回転が回復する。',
  },
  sanctuary: {
    name: 'サンクチュアリ', en: 'SANCTUARY', aim: 'self', cd: 12,
    radius: 4.4, dur: 5, regen: 13,
    desc: '足元に5秒間の領域を作る。中にいる自分と味方は回転が回復し続け、中の相手はスロウになる。',
  },
  satellite: {
    name: 'サテライト', en: 'SATELLITE', aim: 'self', cd: 9,
    count: 3, dur: 6, orbit: 2.5, size: 0.55, dmg: 21, kb: 7,
    desc: '3つの光球を6秒間まとう。触れた相手にダメージを与え、吹き飛ばす。',
  },
  eclipse: {
    name: 'エクリプス', en: 'ECLIPSE', aim: 'self', cd: 2, ult: true, need: 'range',
    range: 9.5, breakRange: 12.5, dur: 3, drain: 38, heal: 0.5,
    desc: '【必殺技】近くの相手とつながり、3秒間回転を吸収し続ける。相手が離れすぎると切れる。',
  },
  // ---- GALE RONDO: stack wind, knock up, finish in the air -------------------
  galeq: {
    name: 'ゲイルスラスト', en: 'GALE THRUST', aim: 'line', cd: 2.4, tele: 0.3,
    range: 4.5, speed: 46, radius: 1.0, dmg: 42, kb: 4, tumble: 0.15, launch: 0, stacks: 2, keep: 8, ring: 3.2,
    desc: '短い直線を突く。QかEを2回当てると、次のQが竜巻になり、当たった相手を1.2秒間打ち上げる。Eの突進中に使うと、突進の終わりに周囲を斬る（竜巻なら周囲を打ち上げる）。',
  },
  tornado: {
    name: 'ゲイルスラスト', en: 'GALE THRUST', aim: 'line', hidden: true,
    range: 15, speed: 26, radius: 1.6, dmg: 56, up: 1.2,
  },
  windwall: {
    name: 'エアスクリーン', en: 'AIR SCREEN', aim: 'line', cd: 14,
    ahead: 2.8, wall: 3.2, dur: 4,
    desc: '狙った方向に風の壁を4秒間張る。相手の弾を消す。',
  },
  sweep: {
    name: 'スリップステップ', en: 'SLIP STEP', aim: 'dash', cd: 6, tele: 0.35, re: 'sweep', reHit: 2, againMul: 1.25, fly: true,
    dist: 5.5, minDist: 5.5, speed: 36, through: true, pass: 36, slow: 0.4,
    desc: '相手をすり抜けて短く突進し、ダメージを与える。当てると2秒以内にもう一度使え、2回目はダメージが25%増える。突進中もスキルを使える。',
  },
  lastbreath: {
    name: 'スカイフォール', en: 'SKYFALL', aim: 'self', cd: 2, ult: true, need: 'up',
    range: 15, dmg: 170, kb: 12, gap: 2.6, also: 4.5,
    desc: '【必殺技】打ち上げ中の相手にだけ使える。瞬間移動して斬り、外側へ吹き飛ばす。近くで打ち上げ中のほかの相手も巻き込む。',
  },
  // ---- NOX SHADE: strike from two places at once ------------------------------
  shuriken: {
    name: 'ツインシュリケン', en: 'TWIN SHURIKEN', aim: 'line', cd: 6, tele: 0.4,
    range: 7.5, speed: 36, radius: 0.8, dmg: 56, kb: 5, tumble: 0.2, pierce: true,
    desc: '貫通する弾を投げる。影があれば、影からも同じ地点へ投げる。',
  },
  shadow: {
    name: 'デコイシェイド', en: 'DECOY SHADE', aim: 'ground', cd: 16, re: 'swap',
    range: 6.5, aoe: 1.3, dur: 5, max: 2, fly: 26,
    desc: '狙った地点へ影を飛ばし、5秒間置く。もう一度押すと、影と位置を入れ替える。',
  },
  swap: { name: 'デコイシェイド', en: 'DECOY SHADE', aim: 'self', hidden: true },
  markswap: { name: 'アフターバースト', en: 'AFTER BURST', aim: 'self', hidden: true },
  slash: {
    name: 'ダブルスラッシュ', en: 'DOUBLE SLASH', aim: 'self', cd: 3,
    aoe: 2.9, dmg: 34, kb: 4, tumble: 0.2, shadowSlow: 1.5, slowPct: 0.4, cut: 3,
    desc: '自分と影の周囲を同時に斬る。影の斬撃は1.5秒間40%のスロウにする。当てるたびにWのクールダウンが3秒縮む。',
  },
  deathmark: {
    name: 'アフターバースト', en: 'AFTER BURST', aim: 'self', cd: 2, ult: true, need: 'range', re: 'markswap', window: 5,
    range: 10, gap: 2.6, dur: 3, pop: 80, share: 0.5, air: 0.75, height: 0,
    desc: '【必殺技】相手の背後へ瞬間移動し（移動中は無敵）、3秒間の印を付ける。元の位置に影が残り、もう一度押すと、影と位置を入れ替える。印が切れるとき、その間に与えたダメージの50%ぶん爆発する。',
  },
  // ---- CURTAIN CALL: four shots, the fourth is the heavy one --------------------
  fourshot: {
    name: 'フォーカウント', en: 'FOUR COUNT', aim: 'line', cd: 1.5, tele: 0.3,
    range: 16, speed: 38, radius: 0.75, dmg: 30, kb: 5, tumble: 0.15, shots: 4, reload: 5,
    desc: '弾を撃つ。4発目は相手の回転が減っているほどダメージが増える。4発撃つと5秒間の装填に入る。',
  },
  fourth: {
    name: 'フォーカウント', en: 'FOUR COUNT', aim: 'line', hidden: true,
    range: 18, speed: 42, radius: 1.0, dmg: 52, kb: 11, exec: 0.8,
  },
  flourish: {
    name: 'ピンショット', en: 'PIN SHOT', aim: 'line', cd: 12, tele: 0.45,
    range: 24, speed: 60, radius: 0.6, dmg: 44, root: 2.25, markT: 4,
    desc: 'アリーナの端まで届く細い弾を撃つ。直前の4秒以内に自分か味方の攻撃が当たっていた相手には、2.25秒間、移動を封じる。',
  },
  lotus: {
    name: 'サイレントマイン', en: 'SILENT MINE', aim: 'ground', cd: 2, stock: { max: 2, every: 14 },
    range: 7.5, aoe: 3, trig: 1.7, arm: 1, fuse: 2, dur: 25, max: 3, dmg: 66, slowPct: 0.35, kb: 5,
    desc: '相手から見えにくい罠を置く。相手が触れると35%のスロウの領域になり、2秒後に爆発する。2個ぶん溜めておける（14秒で1個ぶん戻る）。',
  },
  curtaincall: {
    name: 'グランドフィナーレ', en: 'GRAND FINALE', aim: 'self', cd: 2, ult: true, re: 'curtainfire', stance: true,
    range: 26, half: Math.PI, shots: 4, first: 0.5, every: 0.7, window: 10,
    desc: '【必殺技】その場に止まり、10秒間、Rを押すたびに狙った方向へ長射程の弾を1発撃つ（最大4発）。当たった相手を0.5秒間80%のスロウにする。相手の回転が減っているほどダメージが増え、4発目は2倍になる。',
  },
  curtainfire: { name: 'グランドフィナーレ', en: 'GRAND FINALE', aim: 'line', hidden: true, fire: true, range: 26, radius: 1.0 },
  curtainshot: {
    name: 'グランドフィナーレ', en: 'GRAND FINALE', aim: 'line', hidden: true,
    range: 30, speed: 46, radius: 1.0, dmg: 34, kb: 7, slow: 0.5, slowPct: 0.8, exec: 3,
  },
  curtainlast: {
    name: 'グランドフィナーレ', en: 'GRAND FINALE', aim: 'line', hidden: true,
    range: 30, speed: 46, radius: 1.4, dmg: 68, kb: 15, slow: 0.5, slowPct: 0.8, exec: 3,
  },
  // ---- FROST PHOENIX: walls, chill and a second life ----------------------------
  flashfrost: {
    name: 'フローズンコメット', en: 'FROZEN COMET', aim: 'line', cd: 7, tele: 0.3, re: 'shatter',
    range: 8.65, speed: 9.5, radius: 1.2, dmg: 32, slow: 3, slowPct: 0.3, frost: 3, pierce: true,
    desc: '遅い弾を撃つ。触れた相手を3秒間30%のスロウにし、凍結させる。もう一度押すとその場で爆発し、周囲の相手を1.5秒間スタンさせる。',
  },
  shatter: {
    name: 'フローズンコメット', en: 'FROZEN COMET', aim: 'self', hidden: true,
    aoe: 3.3, dmg: 52, stun: 1.5, slow: 3, slowPct: 0.3, frost: 3,
  },
  icewall: {
    name: 'グレイシャーウォール', en: 'GLACIER WALL', aim: 'ground', cd: 17,
    range: 10, wall: 5, aoe: 5, dur: 5, solid: true,
    desc: '狙った地点に氷の壁を5秒間作る。コマも弾も通れない。相手の真上に作ると、相手を押しのける。',
  },
  frostbite: {
    name: 'アイシクルランス', en: 'ICICLE LANCE', aim: 'line', cd: 4, tele: 0.35,
    range: 4.8, speed: 30, radius: 0.8, dmg: 40, kb: 3, tumble: 0.1, frostMul: 2,
    desc: '短い射程の弾を撃つ。凍結している相手にはダメージが2倍になる。',
  },
  blizzard: {
    name: 'ホワイトアウト', en: 'WHITEOUT', aim: 'ground', cd: 2, ult: true,
    range: 7.5, aoe: 4.6, r0: 2.6, grow: 1.5, dur: 6, dps: 20, frost: 3,
    desc: '【必殺技】狙った地点に、1.5秒かけて広がる6秒間の領域を作る。中の相手はスロウになり、ダメージを受け続ける。広がりきるとダメージが3倍になり、スロウが強まり、相手を凍結させる。',
  },
  // ---- BROKEN EDGE: short dashes, then the finishing cut ------------------------
  brokenwings: {
    name: 'コンボカット', en: 'COMBO CUT', aim: 'dash', cd: 13, tele: 0.3, re: 'brokenwings',
    dist: 2.75, minDist: 2.75, speed: 30, dmg: 26, keep: 0.3, kb: 5, window: 4, aoe: 2.9, slam: 36, slamUp: 0.75,
    desc: '短く突進して斬る。4秒以内にもう一度押すと、もう一度突進する（3回まで）。3回目は周囲の相手を0.75秒間打ち上げる。',
  },
  kiburst: {
    name: 'スタンパルス', en: 'STUN PULSE', aim: 'self', cd: 7,
    aoe: 3.2, dmg: 30, stun: 0.75,
    desc: '周囲の相手を0.75秒間スタンさせる。',
  },
  valor: {
    name: 'ガードステップ', en: 'GUARD STEP', aim: 'dash', cd: 6,
    dist: 2.5, minDist: 2.5, speed: 32, dmg: 8, keep: 0.3, kb: 4, shield: 80, hold: 1.5,
    desc: '短く突進し、1.5秒間バリアを張る。',
  },
  exile: {
    name: 'エッジリリース', en: 'EDGE RELEASE', aim: 'self', cd: 2, ult: true, re: 'windslash',
    dur: 10,
    desc: '【必殺技】10秒間、与えるダメージが20%増える。その間にもう一度押すと、扇状に弾を放つ。相手の回転が減っているほどダメージが増える（最大3倍）。',
  },
  windslash: {
    name: 'エッジリリース', en: 'EDGE RELEASE', aim: 'cone', hidden: true,
    range: 7.2, half: 0.3, speed: 36, radius: 0.9, dmg: 46, kb: 9, exec: 2, fan: 3,
  },
  // ---- MIRAGE TRICK: in, out, and once more ---------------------------------------
  sigil: {
    name: 'トリガーマーク', en: 'TRIGGER MARK', aim: 'line', cd: 6, tele: 0.38,
    range: 5.3, speed: 36, radius: 0.8, dmg: 40, kb: 3, tumble: 0.1, mark: 3.5, pop: 46,
    desc: '弾を撃ち、当たった相手に3.5秒間の印を付ける。印は、次に自分のスキルが当たると爆発する。',
  },
  distort: {
    name: 'ミラーリープ', en: 'MIRROR LEAP', aim: 'dash', cd: 10, tele: 0.3, re: 'recall',
    dist: 6, minDist: 3, speed: 38, through: true, aoe: 2.9, dmg: 50, kb: 6, tumble: 0.25, window: 4,
    desc: '鏡像を残して突進し、着地点の周囲にダメージを与える。4秒以内にもう一度押すと、鏡像の位置へ戻る。',
  },
  recall: { name: 'ミラーリープ', en: 'MIRROR LEAP', aim: 'self', hidden: true },
  ethereal: {
    name: 'テザーロック', en: 'TETHER LOCK', aim: 'line', cd: 11, tele: 0.42,
    range: 7.55, speed: 32, radius: 0.8, dmg: 24, tie: 'CHAINED', dur: 1.5, safe: 7, breakRange: 9.9, pop: 54, snareT: 1.5,
    desc: '鎖を撃ち、当たった相手とつながる。1.5秒間つながったままなら、相手の移動を1.5秒間封じる。',
  },
  mimic: {
    name: 'リプレイ', en: 'REPLAY', aim: 'self', cd: 2, ult: true,
    dur: 2.8,
    desc: '【必殺技】直前に使ったスキルを、ダメージを40%増やしてもう一度使う。Qの場合、その印は2倍のダメージで爆発する。Wの場合、専用の鏡像へ戻れる。',
  },
  // ---- GUILLOTINE LORD: bleed them, then end it ------------------------------------
  decimate: {
    name: 'アウターエッジ', en: 'OUTER EDGE', aim: 'self', cd: 5,
    charge: 0.75, aoe: 4.85, inner: 3.3, dmg: 54, weak: 19, heal: 0.17, bleed: 1,
    desc: '0.75秒間溜め、周囲を斬る。外周で当てると大きなダメージを与え、失った回転の17%ぶん回復する。内側で当てるとダメージが65%減る。出血を付ける。',
  },
  cripple: {
    name: 'レッグカット', en: 'LEG CUT', aim: 'self', cd: 5,
    empower: 4, bonus: 30, kb: 6, slow: 1, slowPct: 0.9, bleed: 1,
    desc: '4秒以内の次の体当たりを強化する。当てると相手を1秒間90%のスロウにし、出血を付ける。',
  },
  apprehend: {
    name: 'フックプル', en: 'HOOK PULL', aim: 'cone', cd: 16, tele: 0.35,
    range: 5.35, half: 0.5, dmg: 20, pull: 17, slow: 2, bleed: 1,
    desc: '扇状の範囲の相手を引き寄せ、2秒間40%のスロウにする。出血を付ける。',
  },
  guillotine: {
    name: 'ギロチンダイブ', en: 'GUILLOTINE DIVE', aim: 'dash', cd: 2, ult: true, tele: 0.4,
    dist: 9.5, minDist: 4, speed: 38, dmg: 80, kb: 12, perBleed: 0.2, trueDmg: true,
    desc: '【必殺技】狙った方向へ突進し、当たった相手に防御を無視するダメージを与える。出血1つにつきダメージが20%増える（最大2倍）。',
  },
  // ---- VENOM TRAIL: make them chase you ---------------------------------------------
  poison: {
    name: 'トキシックライン', en: 'TOXIC LINE', aim: 'self', cd: 1,
    cost: 0, every: 0.3, aoe: 1.4, dur: 3.25, dps: 18, linger: 2,
    desc: '切り替え式。オンの間、通った跡が毒の床になる。触れた相手は2秒間、毒のダメージを受ける。',
  },
  glue: {
    name: 'スティッキーフロア', en: 'STICKY FLOOR', aim: 'ground', cd: 13,
    range: 10, aoe: 3.5, dur: 3, slowPct: 0.7,
    desc: '狙った地点に粘着床を3秒間置く。中の相手は70%のスロウになり、突進・瞬間移動・跳躍が使えない。',
  },
  fling: {
    name: 'バックトス', en: 'BACK TOSS', aim: 'self', cd: 8, need: 'range',
    range: 3.6, dist: 5.5, air: 0.55, height: 3.2, dmg: 46, snare: 2,
    desc: '密着した相手を自分の背後へ投げる。粘着床に落とすと、2秒間、移動を封じる。',
  },
  insanity: {
    name: 'ケミカルブースト', en: 'CHEMICAL BOOST', aim: 'self', cd: 2, ult: true,
    dur: 10,
    desc: '【必殺技】10秒間、30%加速し、受けるダメージが20%減り、回転が回復し続ける。',
  },
  // ---- TURRET ENGINEER: hold ground with machines ------------------------------------
  turret: {
    name: 'オートタレット', en: 'AUTO TURRET', aim: 'ground', cd: 1, big: true, stock: { max: 3, every: 14 },
    range: 3.5, aoe: 1.1, dur: 40, bigDur: 8, max: 4, cap: 3, reach: 10.5, rate: 0.9, dmg: 20, bigDmg: 38,
    leash: 10, idle: 8, laserEvery: 90,
    desc: '相手を自動で撃つ砲台を近くに置く（同時に3基まで）。3基ぶん溜めておける（14秒で1基ぶん戻る）。Wを当てると砲台の光線が溜まり、Eを当てると全基がすぐに光線を撃つ。自分が離れて8秒経つと止まる。体当たりを受けると壊れる。',
  },
  turretlaser: { name: 'オートタレット', en: 'AUTO TURRET', aim: 'line', hidden: true, range: 10, radius: 0.6, dmg: 34 },
  biglaser: { name: 'オートタレット', en: 'AUTO TURRET', aim: 'line', hidden: true, range: 10, radius: 0.9, dmg: 60 },
  bigshot: { name: 'オートタレット', en: 'AUTO TURRET', aim: 'line', hidden: true, range: 11, speed: 28, radius: 0.8, dmg: 13, kb: 1.5, tumble: 0, launch: 0, slow: 1, slowPct: 0.25 },
  turretshot: {
    name: 'オートタレット', en: 'AUTO TURRET', aim: 'line', hidden: true,
    range: 11, speed: 28, radius: 0.5, dmg: 13, kb: 1.5, tumble: 0, launch: 0,
  },
  rockets: {
    name: 'ロケットクラスター', en: 'ROCKET CLUSTER', aim: 'ground', cd: 7, tele: 0.35, big: true,
    range: 12, near: 3, aoe: 0.8, speed: 30, radius: 0.55, dmg: 44, next: 0.2, charge: 0.2, kb: 2, tumble: 0, launch: 0,
    fan: 5, spread: 0.9, volleys: 4, lag: 2.2,
    desc: '弾を5発撃つ。狙った地点で1つに集まり、そのまま直進する。2発目以降はダメージが80%減る。',
  },
  grenade: {
    name: 'ショックグレネード', en: 'SHOCK GRENADE', aim: 'ground', cd: 11, tele: 0.15, big: true,
    range: 8.8, aoe: 3, bigAoe: 4.3, delay: 0.55, core: 1.6, bigCore: 2.8, dmg: 56, bigDmg: 96, stun: 1.5, slow: 2, slowPct: 0.35, bigSlowPct: 0.8,
    bounces: 3, hop: 3.4,
    desc: '狙った地点に爆弾を投げる。中心で当てると1.5秒間スタンさせ、外側は2秒間35%のスロウにする。当たると自分の砲台がすぐに光線を撃つ。',
  },
  upgrade: {
    name: 'オーバーホール', en: 'OVERHAUL', aim: 'self', cd: 2, ult: true,
    dur: 10,
    desc: '【必殺技】10秒以内の次のQ・W・Eを強化する（Q＝8秒で壊れる大型の砲台／W＝4連射で20発／E＝3回跳ねて3回爆発）。',
  },
  // ---- SAND EMPEROR: soldiers fight, the emperor shoves ------------------------------
  conquer: {
    name: 'ランスオーダー', en: 'LANCE ORDER', aim: 'ground', cd: 6, need: 'soldier',
    range: 10, aoe: 1.6, speed: 30, dmg: 42, slow: 1.2,
    desc: 'すべての衛兵を狙った地点へ突進させる。通り道の相手にダメージを与え、1.2秒間40%のスロウにする。',
  },
  arise: {
    name: 'デューンガード', en: 'DUNE GUARD', aim: 'ground', cd: 1.5, stock: { max: 2, every: 6 },
    range: 8, aoe: 2.7, reach: 2.7, leash: 10, dur: 10, max: 4, rate: 1.0, dmg: 18, kb: 3,
    desc: '狙った地点に衛兵を置く。2体ぶん溜めておける（6秒で1体ぶん戻る）。衛兵は10秒間残り、同時に4体まで置ける。近づいた相手を自動で攻撃する。自分が離れすぎると攻撃しない。',
  },
  shift: {
    name: 'デューンライド', en: 'DUNE RIDE', aim: 'self', cd: 9, need: 'soldier',
    speed: 36, dmg: 30, keep: 0.5, kb: 3, stockHit: true, shield: 60, hold: 1.5, fly: true,
    cursor: true,
    desc: 'カーソルに一番近い衛兵へ突進し、1.5秒間バリアを張る。途中で相手に当たるとそこで止まり、衛兵を1体ぶん置けるようになる。突進中にQを使うと、動かした衛兵を追って突進し続ける。',
  },
  divide: {
    name: 'ファランクスウォール', en: 'PHALANX WALL', aim: 'line', cd: 2, ult: true, tele: 0.3,
    range: 8, radius: 3.6, wall: 3.6, back: 1, travel: 7, speed: 22, hold: 4, dmg: 100, kb: 18, solid: true,
    desc: '【必殺技】背後から衛兵の壁が狙った方向へ進み、相手を吹き飛ばす。壁は4秒間残り、自分と味方だけが通り抜けられる。',
  },
  // ---- IRON HAMMER: walls are weapons ----------------------------------------
  hshock: {
    name: 'ツインインパクト', en: 'TWIN IMPACT', aim: 'line', icon: 'beam', cd: 4, ai: 'cone',
    tele: 0.2, range: 4.3, radius: 1.3, half: 0.3, dmg: 34, slow: 1, slowPct: 0.32, delay: 1,
    desc: '前方の直線を叩き、1秒間32%のスロウにする。1秒後、同じ場所がもう一度爆発する。',
  },
  steadfast: {
    name: 'ストップゾーン', en: 'STOP ZONE', aim: 'self', kind: 'field', icon: 'shield', cd: 12,
    follow: true, block: true, dur: 2, aoe: 4, dmg: 24, blockUp: 0.5, groundT: 2, slowPct: 0.25, haste: 2,
    desc: '2秒間加速し、自分の周囲に領域を張る。突進や瞬間移動で領域に触れた相手を0.5秒間打ち上げ、2秒間25%のスロウにして突進を封じる。',
  },
  hcharge: {
    name: 'ウォールプレス', en: 'WALL PRESS', aim: 'dash', kind: 'dash', icon: 'dash', cd: 10,
    tele: 0.4, dist: 4.75, minDist: 3, speed: 34, dmg: 30, kb: 14, carry: 0.9,
    desc: '突進し、当たった相手を進行方向へ運ぶ。壁に当てると2秒間スタンさせ、追加ダメージを与える。',
  },
  verdict: {
    name: 'ホームランスイング', en: 'HOMERUN SWING', aim: 'line', icon: 'beam', cd: 2, ult: true, ai: 'shot',
    tele: 0.2, wind: { min: 0.5, full: 1, max: 4 }, tap: 'verdicttap', near: 4, range: 9.5, speed: 40, radius: 1.6,
    desc: '【必殺技】長押しで溜める（溜めている間はスロウになり、4秒で不発）。すぐ離すと前方の相手を1秒間打ち上げる。溜めるほど遠くまで届く弾になり、当たった相手とその近くの相手を場外近くまで吹き飛ばす。',
  },
  verdicttap: {
    name: 'ホームランスイング', en: 'HOMERUN SWING', aim: 'cone', hidden: true,
    range: 5, half: 0.6, dmg: 80, up: 1,
  },
  verdictwave: {
    name: 'ホームランスイング', en: 'HOMERUN SWING', aim: 'line', hidden: true,
    range: 9.5, speed: 40, radius: 1.6, dmg: 90, kb: 40, tumble: 0.9, launch: 3, around: 3,
  },
  // ---- NINE TAIL CHARM: out, back, and three more times ----------------------
  orb: {
    name: 'リターンオーブ', en: 'RETURN ORB', aim: 'line', kind: 'shot', icon: 'orb', cd: 7,
    tele: 0.35, range: 7.9, speed: 26, radius: 0.9, dmg: 32, pierce: true, ret: true, backTrue: true,
    desc: '行って戻る弾を撃つ。行きも戻りも当たり、戻りは防御を無視する。',
  },
  foxfire: {
    name: 'ウィスプトリオ', en: 'WISP TRIO', aim: 'self', icon: 'star', cd: 5,
    count: 3, dur: 2.5, wait: 0.35, orbit: 2.2, size: 0.5, seek: 8, bolt: 'foxbolt', haste: 2,
    desc: '3つの火の玉をまとい、2秒間加速する。火の玉は近くの相手へ自動で飛ぶ。',
  },
  foxbolt: {
    name: 'ウィスプトリオ', en: 'WISP TRIO', aim: 'line', hidden: true,
    range: 10, speed: 30, radius: 0.5, dmg: 18, kb: 1.5, tumble: 0, launch: 0,
  },
  charm: {
    name: 'ハートショット', en: 'HEART SHOT', aim: 'line', kind: 'shot', icon: 'heart', cd: 12,
    tele: 0.4, range: 8, speed: 30, radius: 0.85, dmg: 30, charm: 1.8, slow: 1.8, slowPct: 0.65,
    desc: '弾を撃ち、当たった相手を1.8秒間魅了する（操作できず、こちらへ歩く）。相手の突進も止める。',
  },
  rush: {
    name: 'フォックストロット', en: 'FOXTROT', aim: 'dash', kind: 'dash', icon: 'dash', cd: 2, ult: true, re: 'rush',
    casts: 3, window: 10, dist: 4.5, minDist: 4.5, speed: 38, through: true, bolt: 'foxbolt', n: 1,
    desc: '【必殺技】相手をすり抜けて突進し、止まるたびに火の玉を1つ放つ。10秒以内にもう一度押すと、もう一度突進する（3回まで）。',
  },
  // ---- HARBOR REAPER: hook, drown, execute -----------------------------------
  bonehook: {
    name: 'ロングハープーン', en: 'LONG HARPOON', aim: 'line', kind: 'shot', icon: 'hook', cd: 8, tele: 0.45,
    wind: { min: 0.5, full: 1, max: 4 }, tap: 'bonestab', near: 3.7, range: 9.3, speed: 34, radius: 0.8, dmg: 46, chain: true, pull: 20, pullDist: 5.5, slow: 1, slowPct: 0.9,
    desc: '長押しで溜める（溜めている間はスロウになり、4秒で不発）。溜めるほど射程が伸びる弾を撃ち、当たった相手を引き寄せる。すぐ離すと短い射程の突きになる。どちらも1秒間90%のスロウにする。',
  },
  bonestab: {
    name: 'ロングハープーン', en: 'LONG HARPOON', aim: 'line', hidden: true,
    range: 2, speed: 60, radius: 1.1, dmg: 46, slow: 1, slowPct: 0.9,
  },
  ghostwater: {
    name: 'サブマージ', en: 'SUBMERGE', aim: 'self', kind: 'buff', icon: 'buff', cd: 10,
    haste: 5,
    desc: '5秒間加速する。受けたダメージの一部はゲージに灰色で残り、加速している間に回復する。',
  },
  undertow: {
    name: 'アフターウェイク', en: 'AFTER WAKE', aim: 'dash', kind: 'dash', icon: 'dash', cd: 11,
    dist: 5.5, minDist: 5.5, speed: 36, through: true, echo: 'undertowz',
    desc: '分身を残し、相手をすり抜けて突進する。分身は1秒後に自分の位置へ飛び、通り道の相手を1.25秒間スタンさせる。',
  },
  undertowz: {
    name: 'アフターウェイク', en: 'AFTER WAKE', aim: 'ground', hidden: true, ghost: true,
    aoe: 1.2, delay: 1,
  },
  wraith: {
    name: 'アフターウェイク', en: 'AFTER WAKE', aim: 'line', hidden: true, ghost: true,
    range: 30, speed: 26, radius: 1.1, dmg: 44, stun: 1.25, pierce: true,
  },
  deathbelow: {
    name: 'クロスエンド', en: 'CROSS END', aim: 'ground', icon: 'cross', cd: 2, ult: true,
    ai: 'blast', tele: 0.2, range: 7.5, aoe: 3.6, arm: 3.6, width: 0.95, delay: 0.5, dmg: 115, line: 0.2,
    desc: '【必殺技】狙った地点をX字に斬る。範囲内に相手がいれば、その地点へ瞬間移動する。回転が20%未満の相手（印が付く）は処刑する。',
  },
  // ---- BARREL BRUISER: throw them wherever you like --------------------------
  cask: {
    name: 'タイマーカスク', en: 'TIMER CASK', aim: 'ground', kind: 'field', icon: 'blast', cd: 6, re: 'caskpop',
    range: 8.5, aoe: 3.75, dur: 4, ripen: 2, ripeMul: 0.5, endDmg: 44, endSlow: 2, endSlowPct: 0.6, ripeSlowPct: 0.9,
    desc: '狙った地点に樽を置く。2秒かけてダメージとスロウ（60%→90%）が増える。4秒後か、もう一度押すと爆発する。',
  },
  caskpop: { name: 'タイマーカスク', en: 'TIMER CASK', aim: 'self', hidden: true, pops: 'cask' },
  drunk: {
    name: 'タフボディ', en: 'TOUGH BODY', aim: 'self', kind: 'buff', icon: 'buff', cd: 5,
    buff: 2.5, empower: 5, bonus: 30, kb: 7,
    desc: '2.5秒間、受けるダメージが20%減る。5秒以内の次の体当たりを強化する。',
  },
  bodyslam: {
    name: 'ヘビータックル', en: 'HEAVY TACKLE', aim: 'dash', kind: 'dash', icon: 'dash', cd: 12,
    tele: 0.4, dist: 6, minDist: 3, speed: 32, dmg: 30, keep: 0.5, kb: 6, stun: 1, refundHit: 0.4,
    desc: '突進し、最初に当たった相手を1秒間スタンさせる。当てると、残りのクールダウンが40%縮む。',
  },
  bigkeg: {
    name: 'ビッグバンカスク', en: 'BIG BANG CASK', aim: 'ground', kind: 'blast', icon: 'blast', cd: 2, ult: true,
    tele: 0.15, range: 10, aoe: 4.4, delay: 0.5, dmg: 100, kb: 16, launch: 2,
    desc: '【必殺技】狙った地点が0.5秒後に爆発し、範囲内の相手を中心から外側へ吹き飛ばす。',
  },
  // ---- CHRONO REWIND: undo the last four seconds -----------------------------
  timewinder: {
    name: 'ヨーヨーギア', en: 'YOYO GEAR', aim: 'line', kind: 'shot', icon: 'orb', cd: 7, tele: 0.35,
    range: 7, speed: 40, radius: 0.9, dmg: 46, pierce: true, ret: true, backMul: 1.4, crawl: 3, linger: 1.6, field: 2.4, fieldPct: 0.6,
    desc: '弾を撃つ。相手に当たるか射程の端に着くと、60%のスロウの領域になってゆっくり進む。その後、手元へ戻り、戻りも当たる。',
  },
  parallel: {
    name: 'フューチャーゾーン', en: 'FUTURE ZONE', aim: 'ground', icon: 'field', cd: 14,
    ai: 'ground', range: 12, aoe: 3.6, arm: 3, reveal: 2.5, dur: 4.5, stun: 2.25, shield: 90,
    desc: '狙った地点に3秒後、1.5秒間の領域が現れる（相手には直前まで見えない）。中の相手はスロウになる。領域が現れてから自分が中に入ると爆発し、相手を2.25秒間スタンさせ、バリアを得る。',
  },
  phasedive: {
    name: 'ツーステップ', en: 'TWO STEP', aim: 'dash', kind: 'dash', icon: 'dash', cd: 7, re: 'phasehit',
    dist: 4, minDist: 4, speed: 34, window: 3,
    desc: '短く突進する。3秒以内にもう一度押すと、近くの相手の位置へ瞬間移動して攻撃する。',
  },
  phasehit: {
    name: 'ツーステップ', en: 'TWO STEP', aim: 'self', kind: 'strike', hidden: true,
    need: 'range', grab: 5.2, tp: true, dmg: 66,
  },
  rewind: {
    name: 'ロールバック', en: 'ROLLBACK', aim: 'self', icon: 'star', cd: 2, ult: true,
    air: 0.35, height: 0, base: 80, aoe: 4.2, dmg: 150, kb: 8,
    desc: '【必殺技】4秒前の位置（後ろを付いてくる半透明の分身）へ瞬間移動する。移動中は無敵。周囲にダメージを与え、回転が回復する。直前の4秒間に失った回転が多いほど回復が増える。',
  },
  // ---- IRON REVENANT: every blow is banked -----------------------------------
  obliterate: {
    name: 'メイスドロップ', en: 'MACE DROP', aim: 'line', kind: 'beam', icon: 'blast', cd: 4,
    tele: 0.2, charge: 0.5, root: true, range: 5.6, radius: 1.3, dmg: 72, kb: 4,
    desc: '0.5秒間溜め、前方の直線を叩く。溜めている間は移動できない。',
  },
  indestructible: {
    name: 'リザーブバリア', en: 'RESERVE BARRIER', aim: 'self', kind: 'buff', icon: 'shield', cd: 8, re: 'shieldheal', window: 4,
    storeShield: true, min: 30, max: 140, hold: 4,
    desc: '与えたダメージと受けたダメージの蓄えを、4秒間のバリアに変える。その間にもう一度押すと、残ったバリアの45%ぶん回転が回復する。',
  },
  deathgrasp: {
    name: 'グラウンドクロウ', en: 'GROUND CLAW', aim: 'ground', kind: 'blast', icon: 'grab', cd: 8,
    tele: 0.2, range: 6.5, aoe: 2.3, delay: 0.5, dmg: 40, pull: 16,
    desc: '狙った地点を0.5秒後に攻撃し、範囲内の相手を引き寄せる。',
  },
  shieldheal: { name: 'リザーブバリア', en: 'RESERVE BARRIER', aim: 'self', hidden: true, heal: 0.45 },
  realm: {
    name: 'デュエルリング', en: 'DUEL RING', aim: 'self', icon: 'star', cd: 2, ult: true,
    need: 'range', range: 6.5, charge: 0.5, root: true, castSlow: 0.75, steal: 0.2,
    desc: '【必殺技】カーソルに一番近い相手を、0.5秒後に輪の中へ閉じ込める。7秒間、自分と相手は輪の外へ出られず、外からは見えず、攻撃も届かない。その間、自分が与えるダメージは1.5倍になり、受けるダメージは3分の2になる。',
  },
  // The ring of the realm: `aoe` is how wide the two are shut in, `dur` for how long.
  realmz: { name: 'デュエルリング', en: 'DUEL RING', aim: 'ground', hidden: true, aoe: 7, dur: 7 },
  // ---- DRAGON STRIKER: mark, follow, kick out --------------------------------
  sonicwave: {
    name: 'タグウェーブ', en: 'TAG WAVE', aim: 'line', kind: 'shot', icon: 'shot', cd: 6,
    tele: 0.4, re: 'resonate', reOnHit: 3, range: 9.3, speed: 36, radius: 0.8, dmg: 34,
    desc: '弾を撃つ。当たったら3秒以内にもう一度押すと、相手の位置へ瞬間移動して攻撃する（相手の回転が減っているほどダメージが増える）。',
  },
  resonate: {
    name: 'タグウェーブ', en: 'TAG WAVE', aim: 'self', kind: 'strike', hidden: true,
    tp: true, dmg: 40, exec: 1.0,
  },
  safeguard: {
    name: 'ガードスタンス', en: 'GUARD STANCE', aim: 'self', kind: 'buff', icon: 'shield', cd: 7, re: 'ironwill', cursor: true,
    shield: 70, hold: 2, window: 3, reach: 7, speed: 38, through: true, halt: true,
    desc: '2秒間バリアを張る。カーソルを味方に合わせて使うと、その味方へ突進し、2人ともバリアを得る。3秒以内にもう一度押すと、4秒間、与えたダメージの26%ぶん回転が回復する。',
  },
  tempest: {
    name: 'グラウンドスラップ', en: 'GROUND SLAP', aim: 'self', kind: 'burst', icon: 'burst', cd: 8, re: 'cripplekick',
    aoe: 5.1, dmg: 36, reHit: 3,
    desc: '周囲にダメージを与える。当たったら3秒以内にもう一度押すと、相手を4秒間75%のスロウにする。',
  },
  dragonrage: {
    name: 'ドラゴンキック', en: 'DRAGON KICK', aim: 'self', kind: 'kick', icon: 'beam', cd: 2, ult: true,
    need: 'range', grab: 5, dmg: 85, kb: 24, launch: 2.2, pass: 60, passUp: 1, passT: 0.9,
    desc: '【必殺技】密着した相手を、自分の反対側へ場外まで吹き飛ばす。吹き飛ばした相手がほかの相手に当たると、その相手にもダメージを与え、1秒間打ち上げる。',
  },
  ironwill: { name: 'ガードスタンス', en: 'GUARD STANCE', aim: 'self', kind: 'buff', hidden: true, dur: 4 },
  cripplekick: { name: 'グラウンドスラップ', en: 'GROUND SLAP', aim: 'self', kind: 'strike', hidden: true, need: 'range', grab: 6.3, dmg: 0, slow: 4, slowPct: 0.75 },
  // ---- BRAWLER KING: take it, then give it back ------------------------------
  knuckle: {
    name: 'ワンツーパンチ', en: 'ONE-TWO PUNCH', aim: 'self', kind: 'buff', icon: 'buff', cd: 5,
    empower: 5, empN: 2, bonus: 20, kb: 7, haste: 1.5,
    desc: '1.5秒間加速し、5秒以内の次の2回の体当たりを強化する。',
  },
  haymaker: {
    name: 'カウンターブロー', en: 'COUNTER BLOW', aim: 'cone', kind: 'cone', icon: 'cone', cd: 12,
    tele: 0.2, charge: 0.75, range: 7.9, half: 0.24, core: 0.4, dmg: 30, storeHit: 1, hold: 3,
    desc: '受けたダメージは蓄えとして溜まる。0.75秒間溜めて扇状に攻撃し、蓄えをすべてダメージに加え、同じ量のバリアを得る。扇の中心線で当てると防御を無視する。',
  },
  facebreaker: {
    name: 'クリンチ', en: 'CLINCH', aim: 'self', kind: 'burst', icon: 'grab', cd: 10,
    aoe: 5.5, dmg: 26, pullIn: 14, slow: 0.5, slowPct: 0.7,
    desc: '周囲の相手を自分の位置へ引き寄せ、0.5秒間70%のスロウにする。',
  },
  showstopper: {
    name: 'キャリースラム', en: 'CARRY SLAM', aim: 'self', kind: 'throw', icon: 'leap', cd: 2, ult: true,
    need: 'range', grab: 5.25, carry: 4, air: 0.7, height: 5, aoe: 3.6, dmg: 100, massMul: 0.6, slow: 1, slowPct: 0.99, around: 0.75,
    desc: '【必殺技】密着した相手を掴み、自分の反対側へ運んで叩きつける。相手が重いほどダメージが増える。着地点の近くのほかの相手も巻き込む。叩きつけた相手を1秒間99%のスロウにする。',
  },
  // ---- POWDER CAPTAIN: kegs first, then the match ----------------------------
  parrrley: {
    name: 'ピストルショット', en: 'PISTOL SHOT', aim: 'line', kind: 'shot', icon: 'shot', cd: 4.5,
    tele: 0.35, range: 6, speed: 40, radius: 0.7, dmg: 50, kb: 3, tumble: 0.1,
    desc: '短い射程の弾を撃つ。樽に当てると耐久を1減らし、0にすると爆発させる。',
  },
  orange: {
    name: 'シトラスキュア', en: 'CITRUS CURE', aim: 'self', kind: 'buff', icon: 'heal', cd: 14,
    heal: 0.12, flat: 40, cleanse: true,
    desc: '回転が回復し、スタン・移動封じ・魅了・スロウ・毒・出血などをすべて消す。スタン中でも使える（打ち上げ中は使えない）。',
  },
  keg: {
    name: 'ボムバレル', en: 'BOMB BARREL', aim: 'ground', icon: 'trap', cd: 0.5, stock: { max: 3, every: 8 },
    ai: 'ground', range: 8, aoe: 3.6, dur: 25, max: 5, hp: 3, decay: 1, touch: 0.5, dmg: 72, slow: 2, slowPct: 0.8, kb: 5, blowHaste: 2,
    desc: '狙った地点に樽を置く。3個ぶん溜めておける（8秒で1個ぶん戻る）。樽の耐久は3で、時間とともに1まで減る。誰の攻撃や体当たりでも1ずつ減り、自分が0にすると爆発して近くの樽も連鎖し、2秒間80%のスロウにする。相手が0にすると爆発しない。',
  },
  barrage: {
    name: 'シェルレイン', en: 'SHELL RAIN', aim: 'ground', kind: 'field', icon: 'field', cd: 2, ult: true,
    range: 30, aoe: 6, dur: 8, slowIn: true, slowPct: 0.3, wave: { first: 0.4, every: 2, dmg: 60 },
    desc: '【必殺技】アリーナのどこへでも、8秒間の砲撃を降らせる。2秒ごとに4回着弾し、中の相手は30%のスロウになる。',
  },
  // ---- ASHEN EXORCIST: nail them down, then seal them away -------------------
  nails: {
    name: 'トリプルネイル', en: 'TRIPLE NAIL', aim: 'line', kind: 'shot', icon: 'shot', cd: 6, re: 'nails',
    tele: 0.3, casts: 3, window: 4, refundUnused: 0.2, range: 7.9, speed: 38, radius: 0.7, dmg: 24, pierce: true, nail: true,
    desc: '貫通する釘を投げ、当たった相手をスロウにする（2本以上で2秒間60%）。4秒以内にもう一度押すと、もう1本投げる（3本まで）。投げなかったぶんクールダウンが縮む。刺さった釘は、体当たりかEを当てると追加ダメージになる。',
  },
  ignition: {
    name: 'バーンラン', en: 'BURN RUN', aim: 'self', kind: 'buff', icon: 'buff', cd: 14, re: 'soulrelease',
    dur: 6, haste: 3, window: 6,
    desc: '6秒間加速する。その間は回転を失い続けるが、失ったぶんと受けたダメージはゲージに灰色で残り、終わるか、もう一度押すと回復する。',
  },
  pursuit: {
    name: 'シンダーステップ', en: 'CINDER STEP', aim: 'blink', kind: 'blink', icon: 'blink', cd: 10, re: 'pursuit2',
    range: 4.25, speed: 40, still: true, aoe: 3, dmg: 30, perTag: 24, window: 4,
    desc: '瞬間移動し、周囲を斬る。4秒以内にもう一度押すと、近くの相手の位置へ瞬間移動して攻撃する。刺さった釘があれば追加ダメージを与える。',
  },
  purgatory: {
    name: 'デッドライン', en: 'DEADLINE', aim: 'ground', kind: 'blast', icon: 'cross', cd: 2, ult: true,
    tele: 0.1, range: 10, aoe: 3.5, delay: 0.75, dmg: 95, slow: 2, slowPct: 0.99, doom: 5,
    desc: '【必殺技】狙った地点を0.75秒後に攻撃する。範囲内の相手を2秒間99%のスロウにし、5秒間の印を付ける。印の付いた相手は、回転が12%未満になった瞬間に処刑する。処刑するたびにこの値が0.5%上がり、次のラウンドに持ち越す。',
  },
  soulrelease: { name: 'バーンラン', en: 'BURN RUN', aim: 'self', hidden: true },
  pursuit2: {
    name: 'シンダーステップ', en: 'CINDER STEP', aim: 'self', kind: 'strike', hidden: true,
    need: 'range', grab: 5.25, tp: true, dmg: 40, perTag: 24,
  },
  // ---- PRISM RADIANCE: bind, then burn a line across the arena ---------------
  binding: {
    name: 'ホールドライト', en: 'HOLD LIGHT', aim: 'line', kind: 'shot', icon: 'shot', cd: 10,
    tele: 0.45, range: 10, speed: 30, radius: 0.8, dmg: 44, snare: 2,
    desc: '弾を撃ち、当たった相手の移動を2秒間封じる。',
  },
  barrier: {
    name: 'ブーメランバリア', en: 'BOOMERANG BARRIER', aim: 'line', kind: 'shot', icon: 'shield', cd: 10,
    range: 9, speed: 16, radius: 0.7, dmg: 0, friendly: true, ret: true, shieldAdd: 50, shieldMax: 100, hold: 2.5,
    desc: '行って戻る弾を投げる。投げたときと受け取ったときの2回、自分にバリアが重なる。弾が通過した味方にも、行きと戻りで1回ずつバリアが付く。',
  },
  singularity: {
    name: 'ライトボム', en: 'LIGHT BOMB', aim: 'ground', kind: 'field', icon: 'field', cd: 8, re: 'lightpop',
    tele: 0.1, range: 11, aoe: 3.4, dur: 5, slowIn: true, slowPct: 0.45, endDmg: 66, endSlow: 1, endSlowPct: 0.45,
    desc: '狙った地点に球を投げ、5秒間置く（途中で壁に当たると消える）。中の相手は45%のスロウになる。もう一度押すか、5秒経つと爆発する。',
  },
  finalspark: {
    name: 'プリズムレイ', en: 'PRISM RAY', aim: 'line', kind: 'beam', icon: 'beam', cd: 2, ult: true,
    tele: 0.1, charge: 1, root: true, range: 33, radius: 1.4, dmg: 170, litBonus: 0.25,
    desc: '【必殺技】1秒間溜め、アリーナの端まで届く貫通する光線を放つ。溜めている間は移動できない。直前にスキルを当てていた相手にはダメージが25%増える。',
  },
  lightorb: { name: 'ライトボム', en: 'LIGHT BOMB', aim: 'line', hidden: true, range: 11, speed: 30, radius: 0.7, dmg: 0, friendly: true, opens: 'singularity' },
  lightpop: { name: 'ライトボム', en: 'LIGHT BOMB', aim: 'self', hidden: true, pops: 'singularity' },
  // ---- VISION PAINTER: fire, a spring, and dread -----------------------------
  subjdisaster: {
    name: 'レッドパレット', en: 'RED PALETTE', aim: 'self', icon: 'shot', cd: 6, ai: 'subject',
    spells: { Q: 'hfire', W: 'hbolt', E: 'hlava' },
    desc: 'パレットを選ぶ（まだ何も起きない）。続けて押すキーでスキルが決まる。Q＝当たるか射程の端で爆発する弾／W＝1秒後に落雷（相手の回転が減っているほどダメージが増える）／E＝直線に並ぶ溶岩（35%のスロウ）。Rで取り消す。',
  },
  subjserenity: {
    name: 'ブルーパレット', en: 'BLUE PALETTE', aim: 'self', icon: 'heal', cd: 16, ai: 'subject',
    spells: { Q: 'hcurrent', W: 'hpool', E: 'hlights' },
    desc: 'パレットを選ぶ。Q＝水流（上にいる間は加速する）／W＝泉（上にいる間はバリアが増える）／E＝次の3回の攻撃に追加ダメージ。水流と泉は味方にも効く。Rで取り消す。',
  },
  subjtorment: {
    name: 'パープルパレット', en: 'PURPLE PALETTE', aim: 'self', icon: 'heart', cd: 10, ai: 'subject',
    spells: { Q: 'hvisage', W: 'hgaze', E: 'hmaw' },
    desc: 'パレットを選ぶ。Q＝1.5秒間恐怖させ（操作できず、逃げる）、60%のスロウにする弾／W＝近くの相手の移動を2秒間封じる目を置く／E＝中央へ引き寄せ、1.25秒間70%のスロウにする。Rで取り消す。',
  },
  washbrush: { name: 'キャンセル', en: 'CANCEL', aim: 'self', hidden: true, short: '消', ai: 'wash' },
  hfire: {
    name: 'ブレイズボール', en: 'BLAZE BALL', aim: 'line', kind: 'shot', hidden: true, short: '火',
    tele: 0.35, range: 9, speed: 32, radius: 0.8, dmg: 26, splash: 2.4, splashDmg: 40,
  },
  hbolt: {
    name: 'サンダードロップ', en: 'THUNDER DROP', aim: 'ground', kind: 'blast', hidden: true, short: '雷',
    tele: 0.1, range: 9, aoe: 2.3, delay: 1, dmg: 44, exec: 2.5,
  },
  hlava: {
    name: 'ラヴァライン', en: 'LAVA LINE', aim: 'line', hidden: true, short: '溶', ai: 'cone',
    tele: 0.2, range: 8.4, radius: 1.3, n: 4, first: 1.8, gap: 2.1, delay: 0.6, every: 0.2,
  },
  lavapool: { name: 'ラヴァライン', en: 'LAVA LINE', aim: 'ground', kind: 'field', hidden: true, aoe: 1.5, dur: 2.5, dmg: 22, dps: 20, slowPct: 0.35 },
  hcurrent: {
    name: 'スピードストリーム', en: 'SPEED STREAM', aim: 'line', hidden: true, short: '流', ai: 'none',
    range: 8, radius: 1.5, n: 4, first: 1, gap: 2.2,
  },
  currentpool: { name: 'スピードストリーム', en: 'SPEED STREAM', aim: 'ground', kind: 'field', hidden: true, friendly: true, aoe: 1.6, dur: 4, hasteIn: true },
  hpool: {
    name: 'バリアプール', en: 'BARRIER POOL', aim: 'ground', kind: 'field', hidden: true, short: '泉', friendly: true,
    range: 6, aoe: 2.6, dur: 3, shieldIn: { first: 45, per: 16, max: 90 },
  },
  hlights: { name: 'ボーナスライト', en: 'BONUS LIGHT', aim: 'self', hidden: true, short: '光', ai: 'lights', hits: 3, dur: 9, bonus: 18 },
  hvisage: {
    name: 'スケアフェイス', en: 'SCARE FACE', aim: 'line', kind: 'shot', hidden: true, short: '恐',
    tele: 0.4, range: 9, speed: 34, radius: 0.8, dmg: 40, fear: 1.5, slow: 1.5, slowPct: 0.6,
  },
  hgaze: { name: 'ウォッチアイ', en: 'WATCH EYE', aim: 'ground', hidden: true, short: '眼', ai: 'ground', range: 9, aoe: 4, dur: 3, arm: 0.95 },
  gazeeye: { name: 'ウォッチアイ', en: 'WATCH EYE', aim: 'ground', kind: 'field', hidden: true, aoe: 4, dur: 3, arm: 0.95 },
  gazeshot: { name: 'ウォッチアイ', en: 'WATCH EYE', aim: 'line', hidden: true, range: 7, speed: 40, radius: 0.8, dmg: 40, snare: 2 },
  hmaw: {
    name: 'ジョートラップ', en: 'JAW TRAP', aim: 'ground', kind: 'blast', hidden: true, short: '牙',
    tele: 0.1, range: 8, aoe: 2.6, delay: 0.4, dmg: 40, pullMid: 14, slow: 1.25, slowPct: 0.7,
  },
  despair: {
    name: 'スパイラルゾーン', en: 'SPIRAL ZONE', aim: 'line', kind: 'shot', icon: 'star', cd: 2, ult: true,
    tele: 0.4, range: 12, speed: 30, radius: 1.0, dmg: 20, spawn: 'despairz',
    desc: '【必殺技】弾を撃ち、当たった相手を中心に3秒間広がり続ける領域を作る。領域は相手に付いて動き、スロウが強まり続け（最大90%）、最後に爆発する。パレットを選んでいる間は使えない（Rは取り消しになる）。',
  },
  despairz: {
    name: 'スパイラルゾーン', en: 'SPIRAL ZONE', aim: 'ground', kind: 'field', hidden: true,
    aoe: 5, r0: 2, grow: 2.4, dur: 3, dps: 22, stick: true, slowGrow: 0.1, slowMax: 0.9, endDmg: 150,
  },
  // ---- TWILIGHT STAR: the further the better ---------------------------------
  paddle: {
    name: 'リバウンドスター', en: 'REBOUND STAR', aim: 'line', kind: 'shot', icon: 'star', cd: 6.5, re: 'paddle2', noRe: true,
    tele: 0.4, range: 7, speed: 30, radius: 0.8, dmg: 40, rest: 'reststar',
    desc: '弾を撃つ。何にも当たらなければ射程の端で1秒間止まる。その間にもう一度押すと、弾を狙った地点へ飛ばし直す。飛ばし直した弾は長く飛ぶほどダメージが増える（最大2.5倍）。',
  },
  paddle2: {
    name: 'リバウンドスター', en: 'REBOUND STAR', aim: 'ground', kind: 'shot', hidden: true,
    range: 28, aoe: 0.8, speed: 30, radius: 0.8, dmg: 40, far: 1.5, farAt: 17.5,
  },
  reststar: { name: 'リバウンドスター', en: 'REBOUND STAR', aim: 'ground', kind: 'field', hidden: true, aoe: 0.8, dur: 1 },
  bubbletrap: { name: 'ドリームバブル', en: 'DREAM BUBBLE', aim: 'ground', hidden: true, aoe: 1.8, dur: 4.8, arm: 0.8 },
  thief: {
    name: 'チェイスボルト', en: 'CHASE BOLT', aim: 'self', kind: 'bolts', icon: 'star', cd: 8,
    bolt: 'starbolt', n: 3, haste: 2,
    desc: '相手を自動で狙う弾を3発撃ち、2秒間加速する。',
  },
  starbolt: {
    name: 'チェイスボルト', en: 'CHASE BOLT', aim: 'line', hidden: true,
    range: 10, speed: 30, radius: 0.5, dmg: 15, kb: 1.5, tumble: 0, launch: 0,
  },
  bubble: {
    name: 'ドリームバブル', en: 'DREAM BUBBLE', aim: 'line', kind: 'shot', icon: 'orb', cd: 14,
    range: 7, speed: 26, radius: 0.9, dmg: 30, slow: 1.4, slowPct: 0.3, tie: 'DROWSY', dur: 1.4, breakRange: 99, pop: 0, root: 2.2, sleep: true, wake: 30,
    trap: 'bubbletrap', refundSelf: 0.3,
    desc: '弾を撃つ。当たった相手を1.4秒間30%のスロウにし、その後2.2秒間眠らせる。眠った相手への最初の攻撃は追加ダメージを与える。外れた弾はその場で4秒間の罠になる。当てるとクールダウンが30%縮む。',
  },
  portal: {
    name: 'ラウンドトリップ', en: 'ROUND TRIP', aim: 'blink', kind: 'blink', icon: 'blink', cd: 5,
    range: 5, speed: 60, autoRet: 1, still: true, ai: 'none',
    desc: '狙った方向へ瞬間移動し、1秒後に元の位置へ自動で戻る。移動先では移動できないが、スキルは使える。',
  },
  // ---- SPARK SURGE: never stop shooting --------------------------------------
  burstfire: {
    name: 'ラピッドボルト', en: 'RAPID BOLT', aim: 'line', kind: 'shot', icon: 'shot', cd: 0.13, rapid: true,
    range: 5.6, speed: 55, radius: 0.5, dmg: 5.5, alt: 'burstfire2', altKey: 'E', refundKey: { E: 0.5 },
    desc: '押している間、カーソルへ向けて弾を撃ち続ける。当てるたびにEのクールダウンが0.5秒縮む。',
  },
  ultrashock: {
    name: 'ボルトライン', en: 'VOLT LINE', aim: 'line', kind: 'beam', icon: 'beam', cd: 8,
    tele: 0.2, charge: 0.4, root: true, range: 15, radius: 1.0, dmg: 46, slow: 2, slowPct: 0.5,
    desc: '0.4秒間溜め、長い光線を放つ。当たった相手を2秒間50%のスロウにする。',
  },
  surge: {
    name: 'ウォールラン', en: 'WALL RUN', aim: 'dash', kind: 'dash', icon: 'dash', cd: 18,
    dist: 3, minDist: 3, speed: 40, through: true, linger: 5, slides: 'wallride', grab: 1,
    desc: '短く突進する。その後5秒間、Qの弾が貫通し、ダメージが増える。壁に向かって使うと壁に乗り、壁に沿って最大で半周移動する（移動中もQを使える）。移動のクリックをするか、壁が途切れると降りる。',
  },
  wallride: { name: 'ウォールラン', en: 'WALL RUN', aim: 'dash', hidden: true, slide: true, speed: 24, arc: Math.PI, through: true, fly: true },
  crash: {
    name: 'ハイボルテージ', en: 'HIGH VOLTAGE', aim: 'self', kind: 'burst', icon: 'burst', cd: 2, ult: true,
    aoe: 8.6, dmg: 110, kb: 6, buffHit: 5,
    desc: '【必殺技】周囲にダメージを与える。当てると5秒間、15%加速し、与えるダメージが15%増える。弾を当て続けるかぎり効果は切れない。',
  },
  burstfire2: {
    name: 'ラピッドボルト', en: 'RAPID BOLT', aim: 'line', kind: 'shot', hidden: true, rapid: true,
    range: 5.6, speed: 55, radius: 0.5, dmg: 7.5, pierce: true, refundKey: { E: 0.5 },
  },
  // ---- FEATHER STORM: the feathers come back ---------------------------------
  daggers: {
    name: 'ツインフェザー', en: 'TWIN FEATHER', aim: 'line', kind: 'shot', icon: 'shot', cd: 4,
    tele: 0.3, range: 12, speed: 38, radius: 0.7, dmg: 26, fan: 2, half: 0.09, pierce: true, feather: true,
    desc: '貫通する羽根を2枚投げる。羽根は落ちた位置に6秒間残る。',
  },
  feather: {
    name: 'ツインフェザー', en: 'TWIN FEATHER', aim: 'ground', hidden: true,
    aoe: 0.6, dur: 6, max: 6,
  },
  plumage: {
    name: 'フェザーコート', en: 'FEATHER COAT', aim: 'self', kind: 'buff', icon: 'buff', cd: 14,
    dur: 4, haste: 2,
    desc: '4秒間、体当たりのたびに貫通する羽根を1枚飛ばす。2秒間加速する。',
  },
  bladecaller: {
    name: 'フェザーリコール', en: 'FEATHER RECALL', aim: 'self', icon: 'grab', cd: 8,
    ai: 'feathers',
    desc: '床の羽根をすべて自分へ呼び戻す。通り道の相手にダメージを与え、3枚当たると1.25秒間、移動を封じる。',
  },
  plumeshot: { name: 'フェザーコート', en: 'FEATHER COAT', aim: 'line', hidden: true, range: 4.5, speed: 38, radius: 0.7, dmg: 12, pierce: true, feather: true },
  quill: {
    name: 'フェザーリコール', en: 'FEATHER RECALL', aim: 'line', hidden: true,
    range: 30, speed: 40, radius: 0.9, dmg: 28, pierce: true, root: 1.25, fall: 0.05,
  },
  storm: {
    name: 'エアリアルファン', en: 'AERIAL FAN', aim: 'line', kind: 'shot', icon: 'leap', cd: 2, ult: true,
    charge: 1.5, veil: true, range: 5.5, speed: 38, radius: 0.7, dmg: 40, fan: 5, half: 0.4, pierce: true, feather: true,
    desc: '【必殺技】1.5秒間無敵になり、自由に移動できる。終わりに、狙った方向へ貫通する羽根を5枚投げる。',
  },
  // ---- WORLD ENDER: three swings and the end of the world --------------------
  darkinblade: {
    name: 'トリプルスイング', en: 'TRIPLE SWING', aim: 'line', icon: 'blast', cd: 6, tele: 0.3, re: 'darkinblade', window: 4, pause: 1,
    desc: '3回まで使える斬撃。1回目は長い直線、2回目は扇状、3回目は前方の円で、使うたびにダメージが25%増える。先端（3回目は中心）で当てるとダメージが75%増え、相手を0.25秒間打ち上げる。押している間に狙い、離すと斬る。次の斬撃までは1秒空く。狙っている間にEを押すと、狙いを保ったまま突進する。',
  },
  chains: {
    name: 'プルバックチェーン', en: 'PULLBACK CHAIN', aim: 'line', kind: 'shot', icon: 'hook', cd: 12,
    tele: 0.4, range: 6.6, speed: 30, radius: 0.8, dmg: 30, slow: 1.5, slowPct: 0.35, spawn: 'chainzone',
    desc: '鎖を撃ち、当たった相手を1.5秒間35%のスロウにする。当たった位置の周囲に相手が1.5秒間とどまると、中心へ引き寄せて追加ダメージを与える。',
  },
  darkin1: {
    name: 'トリプルスイング', en: 'TRIPLE SWING', aim: 'line', kind: 'beam', hidden: true, ai: 'darkin', window: 4,
    charge: 0, loose: true, still: true, range: 5.6, radius: 1.2, tip: 3.5, dmg: 44, tipMul: 0.75, tipUp: 0.25,
  },
  darkin2: {
    name: 'トリプルスイング', en: 'TRIPLE SWING', aim: 'cone', kind: 'cone', hidden: true, ai: 'darkin', window: 4,
    charge: 0, loose: true, still: true, range: 4.6, half: 0.55, tip: 3.0, dmg: 55, tipMul: 0.75, tipUp: 0.25,
  },
  darkin3: {
    name: 'トリプルスイング', en: 'TRIPLE SWING', aim: 'line', kind: 'slam', hidden: true, ai: 'darkin', window: 4,
    charge: 0, loose: true, still: true, range: 2, radius: 1.2, ahead: 1.8, aoe: 2.3, tip: 1.2, dmg: 66, tipMul: 0.75, tipUp: 0.25,
  },
  chainzone: {
    name: 'プルバックチェーン', en: 'PULLBACK CHAIN', aim: 'ground', kind: 'field', hidden: true,
    aoe: 2.6, dur: 1.5, endDmg: 30, endPull: 14,
  },
  umbral: {
    name: 'エイムステップ', en: 'AIM STEP', aim: 'dash', kind: 'dash', icon: 'dash', cd: 5,
    dist: 4.5, minDist: 1.5, speed: 34, halt: true, snap: true,
    desc: '短く突進する。Qを狙っている間に使うと、狙いを保ったまま突進する。',
  },
  worldender: {
    name: 'レッドレイジ', en: 'RED RAGE', aim: 'self', kind: 'buff', icon: 'star', cd: 2, ult: true,
    dur: 10,
    desc: '【必殺技】10秒間、攻撃力が30%上がり、20%加速し、与えたダメージの30%ぶん回転が回復する。',
  },
  // ---- STYLE RANKER: shoot, cut, pass through --------------------------------
  flair: {
    name: 'デュアルショット', en: 'DUAL SHOT', aim: 'line', kind: 'shot', icon: 'shot', cd: 2,
    tele: 0.3, range: 8.6, speed: 40, radius: 0.7, dmg: 36, kb: 3, tumble: 0.1,
    desc: '弾を撃つ。相手が近くにいれば、代わりに扇状に斬る。Eの突進中に使うと、突進のあと通り道を爆撃する。',
  },
  flairslash: { name: 'デュアルショット', en: 'DUAL SHOT', aim: 'cone', kind: 'cone', hidden: true, range: 2.6, half: 0.9, dmg: 36, kb: 3, tumble: 0.1 },
  flairbomb: { name: 'デュアルショット', en: 'DUAL SHOT', aim: 'line', hidden: true, range: 6, radius: 1.3, dmg: 36 },
  whirl: {
    name: 'バレットカッター', en: 'BULLET CUTTER', aim: 'self', kind: 'field', icon: 'burst', cd: 22,
    follow: true, eat: true, dur: 0.75, aoe: 3.4, dmg0: 32, endDmg: 32,
    desc: '0.75秒間、周囲に飛んできた相手の弾をすべて消す。始めと終わりの2回、周囲を斬る。移動しながら使える。',
  },
  wildrush: {
    name: 'クロスラン', en: 'CROSS RUN', aim: 'dash', kind: 'dash', icon: 'dash', cd: 12,
    tele: 0.3, dist: 6, minDist: 4, speed: 38, through: true, pass: 38, haste: 1.5, fly: true,
    desc: '相手をすり抜けて突進し、ダメージを与える。その後1.5秒間加速する。突進中もスキルを使える。',
  },
  inferno: {
    name: 'フルオートスピン', en: 'FULL AUTO SPIN', aim: 'self', kind: 'field', icon: 'burst', cd: 5, need: 'style',
    follow: true, dur: 2, aoe: 5.5, dps: 110, selfSlow: 0.3,
    desc: 'ランクSのときだけ使える。2秒間、周囲にダメージを与え続ける。その間、自分は30%のスロウになる。終わるとランクは最初に戻る。',
  },
  // ---- UNSUNDERED GLAIVE: stronger with every hit ----------------------------
  darkglaive: {
    name: 'ツインストライク', en: 'TWIN STRIKE', aim: 'self', kind: 'buff', icon: 'buff', cd: 6, re: 'glaiveup',
    empower: 5, bonus: 30, kb: 6, hitHeal: 0.09, window: 4,
    desc: '5秒以内の次の体当たりが2回当たり、当てると回転が回復する。当ててから4秒以内にもう一度押すと、次の体当たりが相手を0.75秒間打ち上げる。',
  },
  dreaded: {
    name: 'グレイヴフック', en: 'GLAIVE HOOK', aim: 'line', kind: 'shot', icon: 'hook', cd: 12,
    tele: 0.1, charge: 0.5, root: true, range: 6.7, speed: 44, radius: 0.9, dmg: 36, chain: true, pull: 16, stun: 0.25,
    desc: '0.5秒間溜め、前方を突く。溜めている間は移動できない。当たった相手を0.25秒間スタンさせ、引き寄せる。',
  },
  aureate: {
    name: 'サークルリープ', en: 'CIRCLE LEAP', aim: 'dash', kind: 'dash', icon: 'dash', cd: 8,
    dist: 3.5, minDist: 3.5, speed: 34, aoe: 4.2, inner: 2.9, land: 42, weak: 28,
    desc: '短く突進し、着地点の周囲を斬る。外周で当てるとダメージが50%増える。',
  },
  grim: {
    name: 'ドレインダイブ', en: 'DRAIN DIVE', aim: 'leap', kind: 'leap', icon: 'leap', cd: 2, ult: true,
    range: 6, air: 0.8, height: 6, aoe: 4, dmg: 115, kb: 10, healHit: 0.33,
    desc: '【必殺技】狙った地点へ跳躍し、着地点の周囲にダメージを与える。与えたダメージの33%ぶん回転が回復する。',
  },
  glaiveup: {
    name: 'ツインストライク', en: 'TWIN STRIKE', aim: 'self', kind: 'buff', hidden: true,
    empower: 5, bonus: 30, kb: 5, up: 0.75,
  },
  // ---- LUNAR ARSENAL: a gun for every range ----------------------------------
  arsenal: {
    name: 'ウェポンスキル', en: 'WEAPON SKILL', aim: 'line', icon: 'beam', cd: 4, re: 'bindeclipse',
    weapons: ['moonshot', 'onslaught', 'gravshot', 'duskwave', 'chakram'], ammo: 5, short: ['狙', '鎌', '重', '炎', '輪'],
    // Each weapon has a colour of its own, on its key and on everything it fires.
    tints: [0x4fe08a, 0xff4a5a, 0xb46bff, 0x4aa8ff, 0xf2f6ff],
    // What the weapon in the other hand adds when it joins in: a light blow, and something of its own.
    off: { dmg: 14, fx: [{ mul: 2 }, { leech: 1 }, { slow: 2.5, slowPct: 0.3 }, { blast: 4.5, blastDmg: 10 }, { chak: 1 }] },
    // CRESCENDUM: chakrams circle whoever holds them (up to `max`). A follow-up of its own that lands adds one; its
    // skill adds one and then throws them all, one after another. One that strikes comes back; one that misses is lost.
    // With none gained and none landed for `dur` seconds they all go; they flicker for the last `warn` of it.
    chak: { max: 5, dur: 8, warn: 2 },
    // Where no match is on, a skill of this kit is described by its text and then a line for each weapon, in that
    // weapon's colour (`lines` names the field of the weapon the line is taken from). In a match the key says only
    // what it does with the weapons in hand right now.
    lines: 'briefLine',
    desc: '5回使うと次の武器に替わる。',
  },
  phase: {
    name: 'スイッチ', en: 'SWITCH', aim: 'self', icon: 'buff', cd: 0.8, ai: 'phase',
    lines: 'offLine',
    desc: '主の武器と副の武器を入れ替える。副の武器は追撃する。',
    nowLine: '主の武器と副の武器を入れ替える。',
  },
  nextweapon: {
    name: 'ネクストウェポン', en: 'NEXT WEAPON', aim: 'self', icon: 'orb', cd: 0, passive: true,
    lines: 'order',
    desc: '【常時効果】主の武器を5回使うと、次に来る武器。武器は次のラウンドに持ち越す。',
    nowLine: '主の武器を5回使うと、次にこの武器が来る。',
    orderLine: '最初の順番：',
  },
  moonshot: {
    name: 'ロングライフル', en: 'LONG RIFLE', aim: 'line', kind: 'shot', hidden: true, weapon: 0, cd: 4, tint: 0x4fe08a,
    tele: 0.45, range: 13.5, speed: 52, radius: 0.7, dmg: 46, mark: 4.5, again: 'longshot',
    desc: '長射程の弾を撃つ。当てると、4.5秒以内にもう一度押して追撃。',
    briefLine: '長射程の弾。当てると、もう一度押して追撃。',
    offLine: '追撃：ダメージを与える。',
    ultLine: '強化追撃：ダメージを2回与える。',
  },
  // The follow-up on a marked target, on the same key: it reaches however far off the target is,
  // sets the mark off, and the weapon in the other hand lands its blow with it.
  longshot: { name: 'ロングライフル', en: 'LONG RIFLE', aim: 'self', hidden: true, tint: 0x4fe08a, ai: 'longshot' },
  onslaught: {
    name: 'ドレインサイス', en: 'DRAIN SCYTHE', aim: 'self', hidden: true, weapon: 1, cd: 4, tint: 0xff4a5a, ai: 'volley',
    // Six blows in 1.75 seconds at whoever is nearest: the other hand, then the scythe, by turns.
    dur: 1.75, shots: 6, range: 5.5, dmg: 26, leech: 0.35, haste: 1.75,
    desc: '1.75秒間加速し、いちばん近い相手に攻撃と追撃を交互にする。',
    briefLine: '加速し、いちばん近い相手に攻撃と追撃を交互にする。',
    offLine: '追撃：与えたダメージぶん回転が回復する。',
    ultLine: '強化追撃：回転が大きく回復する。',
  },
  gravshot: {
    name: 'グラビティキャノン', en: 'GRAVITY CANNON', aim: 'line', kind: 'shot', hidden: true, weapon: 2, cd: 5, tint: 0xb46bff,
    tele: 0.4, range: 10, speed: 34, radius: 0.8, dmg: 30, slow: 2.5, slowPct: 0.3, eclipse: 2.5,
    desc: '弾を撃ち、2.5秒間30%のスロウを与える。スロウ中の相手がいるときに押すと、その全員の移動を1秒間封じる。',
    briefLine: 'スロウの弾。スロウ中の相手全員の移動を封じる。',
    offLine: '追撃：2.5秒間30%のスロウを与える。',
    ultLine: '強化追撃：2.5秒間99%のスロウを与える。',
  },
  bindeclipse: { name: 'グラビティキャノン', en: 'GRAVITY CANNON', aim: 'self', hidden: true, tint: 0xb46bff, ai: 'bindeclipse', weapon: 2, cd: 5, dmg: 40, snareT: 1, bigSnare: 1.35 },
  duskwave: {
    name: 'フレイムスロワー', en: 'FLAME THROWER', aim: 'line', kind: 'shot', hidden: true, weapon: 3, cd: 2.5, tint: 0x4aa8ff,
    // A wide disc that drifts across the floor, slow enough to walk out of, through everyone in its way.
    tele: 0.3, range: 12, speed: 9, radius: 2, dmg: 42, pierce: true, disc: true, kb: 0, tumble: 0, launch: 0, offhand: true,
    desc: '狙った方向へ、ゆっくり進む炎の円を放つ。貫通する。',
    briefLine: 'ゆっくり進む炎の円を放つ。貫通する。',
    offLine: '追撃：爆発し、周囲の相手にもダメージを与える。',
    ultLine: '強化追撃：大爆発し、周囲の相手にもダメージを与える。',
  },
  chakram: {
    name: 'ガードチャクラム', en: 'GUARD CHAKRAM', aim: 'line', hidden: true, weapon: 4, cd: 3, ai: 'shot', tint: 0xf2f6ff,
    tele: 0.3, range: 9, speed: 36, radius: 0.6, dmg: 26, every: 0.12, kb: 1, tumble: 0, launch: 0,
    desc: '円月輪を1つ得て、持っている円月輪をすべて、狙った方向へ続けて撃つ。当たった円月輪は戻り、外れた円月輪は失う。',
    briefLine: '円月輪を1つ得て、持っている分を続けて撃つ。当たれば戻る。',
    offLine: '追撃：円月輪を1つ得る（5つまで）。',
    ultLine: '強化追撃：円月輪を5つ得る。',
  },
  sentry: {
    name: 'ガードチャクラム', en: 'GUARD CHAKRAM', aim: 'ground', hidden: true, cd: 3, ai: 'ground', tint: 0xf2f6ff,
    range: 4.75, aoe: 1.1, dur: 20, live: 4, reach: 5, wake: 0.35, rate: 0.8, max: 3,
  },
  sentryshot: { name: 'ガードチャクラム', en: 'GUARD CHAKRAM', aim: 'line', hidden: true, tint: 0xf2f6ff, range: 9, speed: 32, radius: 0.55, dmg: 20, kb: 1.5, tumble: 0, launch: 0 },
  vigil: {
    name: 'ムーンバースト', en: 'MOON BURST', aim: 'line', kind: 'shot', icon: 'star', cd: 2, ult: true,
    tele: 0.4, range: 13, speed: 24, radius: 1.4, dmg: 70, splash: 4, splashDmg: 70, onHit: true,
    arm: [{ twice: 0.18 }, { heal: 90 }, { slow: 2.5, slowPct: 0.99 }, { blast: 6.5, blastDmg: 30 }, { chak: 5 }],
    lines: 'ultLine',
    desc: '【必殺技】遅い弾を撃つ。相手に当たると爆発し、当たった相手と周囲の相手に、主の武器が強化された追撃をする。',
  },
  // ---- STAR FORGER: breath, gravity, a falling star --------------------------
  breath: {
    name: 'ネビュラブレス', en: 'NEBULA BREATH', aim: 'cone', kind: 'cone', icon: 'cone', cd: 0.125, rapid: true,
    stream: { max: 3.25, cd: 3, gap: 0.3 }, range: 7.4, half: 0.2, dmg: 6.5, tick: { n: 8, dmg: 26, gain: 2 },
    desc: '押している間、カーソルへ向けて扇状に攻撃し続ける（最大3.25秒）。同じ相手に1秒間当て続けるたびに爆発し、エナジーを2得る。',
  },
  flight: {
    name: 'ロングフライト', en: 'LONG FLIGHT', aim: 'dash', kind: 'dash', icon: 'leap', cd: 16, re: 'flightstop',
    dist: 24, minDist: 6, speed: 16, through: true, fly: true, window: 2,
    desc: '狙った方向へ長い距離を突進する。途中でもう一度押すと、その場で止まる。突進中もスキルを使え、Qは途切れず、時間切れにもならない。',
  },
  blackhole: {
    name: 'ブラックホール', en: 'BLACK HOLE', aim: 'ground', kind: 'field', icon: 'field', cd: 12,
    tele: 0.1, range: 7.4, aoe: 4, dur: 5, dps: 15, pullIn: 75, slowIn: true, star: true, gain: 1, core: 1.4, line: 0.05, perLine: 0.00026,
    desc: '狙った地点に5秒間の領域を置く。中の相手は中心へ引き寄せられ続け、中にいる間は毎秒エナジーを1得る。中心にいる回転が5%未満の相手は処刑する。エナジーが多いほど範囲が広がる。',
  },
  fallingstar: {
    name: 'スタードロップ', en: 'STAR DROP', aim: 'ground', kind: 'blast', icon: 'blast', cd: 2, ult: true,
    tele: 0.1, range: 12.5, aoe: 5, delay: 0.9, dmg: 150, stun: 1, star: true, gain: 5, evolve: 'skies', evolveAt: 75,
    desc: '【必殺技】狙った地点を0.9秒後に攻撃し、範囲内の相手を1秒間スタンさせる。当てるとエナジーを5得る。エナジーが多いほど範囲が広がり、75以上で相手を1秒間打ち上げるようになる。エナジーは次のラウンドに持ち越す。',
  },
  flightstop: { name: 'ロングフライト', en: 'LONG FLIGHT', aim: 'self', hidden: true },
  skies: {
    name: 'スタードロップ', en: 'STAR DROP', aim: 'ground', kind: 'blast', hidden: true,
    aoe: 6.5, delay: 0.9, dmg: 170, up: 1, slow: 1, slowPct: 0.5, star: true, gain: 5,
  },
  // ---- DARK SORCERER: it only gets worse for them ----------------------------
  balefulstrike: {
    name: 'マナボルト', en: 'MANA BOLT', aim: 'line', kind: 'shot', icon: 'shot', cd: 4,
    tele: 0.35, range: 8.25, speed: 36, radius: 0.85, dmg: 38, kb: 3, tumble: 0.1, permHit: 30,
    desc: '弾を撃つ。当てるたびに魔力が1溜まる。',
  },
  darkmatter: {
    name: 'ダークフォール', en: 'DARK FALL', aim: 'ground', kind: 'blast', icon: 'blast', cd: 8,
    range: 9.5, aoe: 2.9, delay: 1.25, dmg: 96,
    desc: '狙った地点を1.25秒後に攻撃する。',
  },
  horizon: {
    name: 'スタンリング', en: 'STUN RING', aim: 'ground', kind: 'field', icon: 'trap', cd: 14,
    range: 7.25, aoe: 4.25, dur: 3.5, cage: 2.5, arm: 0.5, dmg: 10,
    desc: '狙った地点に0.5秒後、3秒間の輪が現れる。縁に触れた相手を2.5秒間スタンさせる。突進で越えようとした相手も止める。',
  },
  primordial: {
    name: 'ラストスペル', en: 'LAST SPELL', aim: 'self', kind: 'strike', icon: 'star', cd: 2, ult: true,
    need: 'range', range: 7.75, dmg: 105, exec: 1.0, execCap: 0.667,
    desc: '【必殺技】近くの相手に必ず当たる弾を撃つ。相手の回転が減っているほどダメージが増える（最大2倍）。',
  },
  // ---- VAULT BREAKER: straight in --------------------------------------------
  vault: {
    name: 'チャージナックル', en: 'CHARGE KNUCKLE', aim: 'dash', kind: 'dash', icon: 'dash', cd: 6,
    tele: 0.45, wind: { min: 0, full: 1.25, max: 4, cancelCd: 3 }, near: 2.5, range: 7.25, dist: 7.25, minDist: 2.5, speed: 40, dmg: 26, powMul: 1, keep: 0.5, kb: 9,
    desc: '長押しで溜める（溜めている間はスロウになり、4秒で不発）。溜めるほど遠くまで突進し、ダメージが増える（最大2倍）。相手に当たるとそこで止まり、吹き飛ばす。',
  },
  denting: {
    name: 'サードブレイク', en: 'THIRD BREAK', aim: 'self', icon: 'burst', cd: 0, passive: true,
    desc: '【常時効果】体当たりやスキルを3回当てるたびに追加ダメージを与え、4秒間、相手の受けるダメージを20%増やす。',
  },
  relentless: {
    name: 'スルーパンチ', en: 'THROUGH PUNCH', aim: 'self', kind: 'buff', icon: 'buff', cd: 1,
    stock: { max: 2, every: 8 }, empower: 7, bonus: 30, kb: 6, wave: 'relentwave',
    desc: '7秒以内の次の体当たりを強化する。当てると、相手の後ろへ扇状の追加攻撃が出る。2回ぶん溜めておける（8秒で1回ぶん戻る）。',
  },
  cease: {
    name: 'ロックオンアッパー', en: 'LOCK-ON UPPER', aim: 'self', icon: 'star', cd: 2, ult: true, ai: 'strike',
    need: 'range', range: 9.25, speed: 34, homing: true, unstoppable: true, maxT: 1.5, dmg: 115, keep: 0, kb: 2, up: 1.3, aside: 0.75, asideKb: 9,
    desc: '【必殺技】カーソルに一番近い相手へ突進する。相手が動いても追い、突進中はスタンや吹き飛ばしで止まらない。当たった相手を1.3秒間打ち上げる。途中で当たったほかの相手には75%のダメージを与え、横へ吹き飛ばす。',
  },
  relentwave: { name: 'スルーパンチ', en: 'THROUGH PUNCH', aim: 'cone', hidden: true, range: 4.5, half: 0.5, dmg: 20 },
  // ---- ARCANE SHOOTER: land the shot, get everything back --------------------
  mystic: {
    name: 'リフレッシュショット', en: 'REFRESH SHOT', aim: 'line', kind: 'shot', icon: 'shot', cd: 4.5,
    tele: 0.35, range: 9.9, speed: 44, radius: 0.7, dmg: 40, kb: 3, tumble: 0.1, refund: 1.5,
    desc: '弾を撃つ。当てると、すべてのスキルのクールダウンが1.5秒縮む。',
  },
  flux: {
    name: 'プライムショット', en: 'PRIME SHOT', aim: 'line', kind: 'shot', icon: 'orb', cd: 8,
    tele: 0.4, range: 9.7, speed: 36, radius: 0.9, dmg: 26, mark: 4,
    desc: '弾を撃ち、当たった相手に4秒間の印を付ける。印は、次に自分のスキルが当たると爆発する。',
  },
  arcshift: {
    name: 'ブリンクショット', en: 'BLINK SHOT', aim: 'blink', kind: 'blink', icon: 'blink', cd: 14,
    range: 4.75, speed: 40, still: true, bolt: 'arcbolt', n: 1,
    desc: '瞬間移動する（相手もすり抜ける）。移動先で止まり、相手を自動で狙う弾を1発撃つ。',
  },
  arcbolt: {
    name: 'ブリンクショット', en: 'BLINK SHOT', aim: 'line', hidden: true,
    range: 11, speed: 34, radius: 0.6, dmg: 32, kb: 2, tumble: 0, launch: 0,
  },
  trueshot: {
    name: 'ワイドウェーブ', en: 'WIDE WAVE', aim: 'line', kind: 'shot', icon: 'beam', cd: 2, ult: true,
    tele: 0.1, charge: 1, root: true, range: 40, speed: 40, radius: 2, dmg: 175, pierce: true,
    desc: '【必殺技】1秒間溜め、アリーナの端まで届く幅の広い貫通する弾を放つ。溜めている間は移動できない。',
  },
  // ---- MAGUS ASCENDANT (Xerath)
  arcanopulse: {
    name: 'チャージレイ', en: 'CHARGE RAY', aim: 'line', kind: 'beam', icon: 'beam', cd: 5,
    tele: 0.5, wind: { min: 0, full: 1.5, max: 3, cancelCd: 2.5 }, near: 6, range: 12.5, radius: 0.9, dmg: 58,
    desc: '長押しで溜める（溜めている間はスロウになり、3秒で不発）。溜めるほど射程が伸び（1.5秒で最大）、離すと貫通する光線を放つ。',
  },
  eyeofdestruction: {
    name: 'コアストライク', en: 'CORE STRIKE', aim: 'ground', kind: 'blast', icon: 'blast', cd: 10,
    tele: 0.15, range: 9, aoe: 2.2, delay: 0.5, dmg: 40, slow: 2.5, slowPct: 0.25, coreR: 1.0, coreMul: 1.667, coreSlowPct: 0.8,
    desc: '狙った地点を0.5秒後に攻撃し、2.5秒間25%のスロウにする。中心で当てるとダメージが67%増え、スロウが80%になる。',
  },
  shockorb: {
    name: 'ディスタンスオーブ', en: 'DISTANCE ORB', aim: 'line', kind: 'shot', icon: 'orb', cd: 11,
    tele: 0.4, range: 9.5, speed: 30, radius: 0.85, dmg: 44, stunFar: [0.75, 2.25],
    desc: '弾を撃ち、当たった相手をスタンさせる。遠くで当たるほどスタンが長い（0.75〜2.25秒）。',
  },
  arcanerite: {
    name: 'サンダーアーティラリー', en: 'THUNDER ARTILLERY', aim: 'self', icon: 'star', cd: 2, ult: true, re: 'arcanefire', stance: true, ai: 'stance',
    range: 40, half: Math.PI, shots: 6, first: 0.4, every: 0.8, window: 10,
    desc: '【必殺技】その場に止まり、10秒間、Rを押すたびにアリーナのどこへでも砲撃を落とす（最大6発、0.5秒後に着弾）。当てるたびに次の1発のダメージが増える。',
  },
  arcanefire: { name: 'サンダーアーティラリー', en: 'THUNDER ARTILLERY', aim: 'ground', hidden: true, fire: true, range: 40, aoe: 2.2 },
  arcanebarrage: { name: 'サンダーアーティラリー', en: 'THUNDER ARTILLERY', aim: 'ground', kind: 'blast', hidden: true, aoe: 2.2, delay: 0.5, dmg: 52, heavier: 9 },
  // ---- CRIMSON HUNGER (Briar)
  headrush: {
    name: 'バイトラッシュ', en: 'BITE RUSH', aim: 'self', kind: 'strike', icon: 'dash', cd: 9,
    need: 'range', range: 5.2, tp: true, dmg: 46, stun: 0.85, shredT: 5, shredK: 1.2,
    desc: 'カーソルに一番近い相手の位置へ瞬間移動して攻撃する。0.85秒間スタンさせ、5秒間、その相手の受けるダメージを20%増やす。',
  },
  bloodfrenzy: {
    name: 'バーサクラン', en: 'BERSERK RUN', aim: 'dash', icon: 'buff', cd: 10, re: 'snackattack', ai: 'dash',
    dist: 3.5, minDist: 3.5, speed: 34, frenzy: 5, halt: false,
    desc: '短く突進し、5秒間、40%加速して一番近い相手へ自動で突進し続ける（移動は操作できない）。体当たりは周囲の相手にも当たる。もう一度押すと、次の体当たりのダメージが増え、回転が回復する。',
  },
  snackattack: {
    name: 'バーサクラン', en: 'BERSERK RUN', aim: 'self', kind: 'buff', hidden: true, free: true,
    empower: 5, bonus: 20, missing: 70, hitHeal: 0.05, kb: 4,
  },
  chillingscream: {
    name: 'チャージシャウト', en: 'CHARGE SHOUT', aim: 'line', kind: 'beam', icon: 'cone', cd: 16,
    tele: 0.1, wind: { min: 0.15, full: 1, max: 1, auto: true }, armor: 0.65, chargeHeal: 0.11, near: 3, range: 5.2, radius: 2.2, dmg: 60, slow: 0.5, slowPct: 0.8, kb: 13, tumble: 0.6, pinT: 1,
    desc: '長押しで最大1秒間溜める。溜めている間は受けるダメージが35%減り、回転が回復する。離すと前方の幅の広い範囲を攻撃し、0.5秒間80%のスロウにする。溜めるほど遠くまで届く。最大まで溜めると相手を吹き飛ばし、壁に当たった相手を1.5秒間スタンさせて追加ダメージを与える。使うとWの効果が終わる。',
  },
  certaindeath: {
    name: 'ハンティングダイブ', en: 'HUNTING DIVE', aim: 'line', icon: 'star', cd: 2, ult: true, ai: 'shot',
    tele: 0.4, range: 30, speed: 42, radius: 0.9, dmg: 20, flyTo: 'certainland', frenzy: 8,
    desc: '【必殺技】アリーナの端まで届く弾を撃つ。当たった相手へ跳躍し（途中で止められない）、着地点の周囲を吹き飛ばす。巻き込んだほかの相手を1.5秒間恐怖させる（操作できず、逃げる）。その後8秒間、当たった相手を追うWの効果に入る。',
  },
  certainland: { name: 'ハンティングダイブ', en: 'HUNTING DIVE', aim: 'leap', hidden: true, air: 0.55, height: 4, aoe: 3.2, dmg: 90, kb: 4, track: true, scare: 1.5 },
  // ---- STEAM GOLEM (Blitzcrank)
  rocketgrab: {
    name: 'ピストンアーム', en: 'PISTON ARM', aim: 'line', kind: 'shot', icon: 'hook', cd: 16,
    tele: 0.45, range: 9.8, speed: 30, radius: 0.9, dmg: 60, chain: true, pull: 24, stun: 0.65,
    desc: '弾を撃ち、当たった相手を手元まで引き寄せ、0.65秒間スタンさせる。',
  },
  overdrive: {
    name: 'スチームブースト', en: 'STEAM BOOST', aim: 'self', icon: 'buff', cd: 15, ai: 'buff',
    haste: 5, after: 1.5, afterPct: 0.3,
    desc: '5秒間加速する。終わったあと1.5秒間、自分が30%のスロウになる。',
  },
  powerfist: {
    name: 'リフトパンチ', en: 'LIFT PUNCH', aim: 'self', kind: 'buff', icon: 'burst', cd: 5,
    empower: 5, bonus: 44, heldMul: 2, up: 1, kb: 3,
    desc: '5秒以内の次の体当たりを強化する。当てると追加ダメージを与え、相手を1秒間打ち上げる。スタン中か打ち上げ中の相手には、追加ダメージが2倍になる。',
  },
  staticfield: {
    name: 'ショートサーキット', en: 'SHORT CIRCUIT', aim: 'self', icon: 'burst', cd: 2, ult: true, ai: 'burst',
    aoe: 5.5, dmg: 110, strip: true, silence: 0.5,
    desc: '【必殺技】周囲にダメージを与える。相手のバリアとガードを消し、0.5秒間スキルを封じる。',
  },
  // ---- VOID EYE (Vel'Koz)
  decon: { name: 'ブレイクダウン', en: 'BREAKDOWN', aim: 'self', hidden: true },
  plasmafission: {
    name: 'スプリットショット', en: 'SPLIT SHOT', aim: 'line', icon: 'shot', cd: 7, re: 'fissionsplit', ai: 'shot',
    tele: 0.35, range: 9.5, speed: 26, radius: 0.8, dmg: 46, slow: 2, slowPct: 0.7, window: 0.6,
    desc: '弾を撃ち、当たった相手を2秒間70%のスロウにする。当たるか、飛んでいる間にもう一度押すと、左右90度に分かれて飛ぶ。',
  },
  fissionsplit: { name: 'スプリットショット', en: 'SPLIT SHOT', aim: 'self', hidden: true, free: true },
  plasmashard: { name: 'スプリットショット', en: 'SPLIT SHOT', aim: 'line', hidden: true, range: 10, speed: 30, radius: 0.8, dmg: 46, slow: 2, slowPct: 0.7 },
  voidrift: {
    name: 'クラックライン', en: 'CRACK LINE', aim: 'line', icon: 'beam', cd: 1.5, stock: { max: 2, every: 15 }, ai: 'beam',
    tele: 0.3, range: 9.5, radius: 0.9, dmg: 18,
    desc: '前方の直線を攻撃し、0.25秒後に同じ場所が爆発する。2回ぶん溜めておける（15秒で1回ぶん戻る）。',
  },
  riftz: { name: 'クラックライン', en: 'CRACK LINE', aim: 'line', hidden: true, range: 9.5, radius: 0.9, dmg: 28, delay: 0.25 },
  tectonic: {
    name: 'プッシュブラスト', en: 'PUSH BLAST', aim: 'ground', kind: 'blast', icon: 'blast', cd: 10,
    tele: 0.15, range: 7.2, aoe: 2.2, delay: 0.4, dmg: 44, kb: 8, tumble: 0.75, launch: 0.5, away: true,
    desc: '狙った地点を0.4秒後に爆発させ、範囲内の相手を自分から遠ざかる方向へ吹き飛ばす。',
  },
  liferay: {
    name: 'トラッキングレイ', en: 'TRACKING RAY', aim: 'line', icon: 'star', cd: 0.13, ult: true, rapid: true,
    stream: { max: 2.6, cd: 2, gap: 0.3 }, range: 14.5, radius: 0.9, dmg: 11, slow: 1, slowPct: 0.2, turn: 0.22, every: 5,
    desc: '【必殺技】押している間（最大2.6秒）、カーソルをゆっくり追う貫通する光線を放ち続ける。その間は移動できない。当たった相手を20%のスロウにする。当て続けると分解も進む。',
  },
  // ---- TWIN PURIFIER (Lucian)
  lightslinger: { name: 'ダブルヒット', en: 'DOUBLE HIT', aim: 'self', hidden: true },
  piercinglight: {
    name: 'ストレートレイ', en: 'STRAIGHT RAY', aim: 'line', kind: 'beam', icon: 'beam', cd: 5,
    tele: 0.2, charge: 0.3, range: 9, radius: 0.8, dmg: 54,
    desc: '0.3秒間溜め、貫通する光線を放つ。',
  },
  ardentblaze: {
    name: 'クロススパーク', en: 'CROSS SPARK', aim: 'line', kind: 'shot', icon: 'cross', cd: 10,
    tele: 0.35, range: 8.2, speed: 32, radius: 0.8, dmg: 12, splash: 2.8, splashDmg: 34, markT: 6, rush: 1,
    desc: '当たるか射程の端で爆発する弾を撃つ。範囲内の相手に6秒間の印を付ける。自分か味方が印の付いた相手に攻撃を当てるたびに、自分が1秒間加速する。',
  },
  lightslide: {
    name: 'クイックスライド', en: 'QUICK SLIDE', aim: 'dash', kind: 'dash', icon: 'dash', cd: 14,
    dist: 4.4, minDist: 2.5, speed: 36, halt: true,
    desc: '狙った方向へ突進する。スキルのあとの2回当たる体当たりを当てるたびに、クールダウンが2秒縮む。',
  },
  culling: {
    name: 'ランアンドガン', en: 'RUN AND GUN', aim: 'line', icon: 'star', cd: 2, ult: true, re: 'cullstop', ai: 'shot',
    tele: 0.3, dur: 3, shots: 22, range: 13, speed: 44,
    desc: '【必殺技】3秒間、決めた方向へ弾を撃ち続ける。撃ちながら移動でき、Eも使える。もう一度押すと止まる。',
  },
  cullstop: { name: 'ランアンドガン', en: 'RUN AND GUN', aim: 'self', hidden: true, free: true },
  cullshot: { name: 'ランアンドガン', en: 'RUN AND GUN', aim: 'line', hidden: true, range: 13, speed: 44, radius: 0.6, dmg: 9, kb: 0.6, tumble: 0, launch: 0 },
  // ---- STONE WEAVER (Taliyah)
  threadedvolley: {
    name: 'ペブルショット', en: 'PEBBLE SHOT', aim: 'line', icon: 'shot', cd: 3, ai: 'shot',
    tele: 0.3, range: 9.2, speed: 34, shots: 5, every: 0.1, cdOn: 1.5,
    desc: '移動しながら弾を5発撃つ（2発目以降はダメージが60%減る）。使うと足元が20秒間、荒れた地面になる。荒れた地面の上で使うと、1.5秒間40%のスロウにする大きな弾1発になり、クールダウンが半分になる。',
  },
  threadrock: { name: 'ペブルショット', en: 'PEBBLE SHOT', aim: 'line', hidden: true, range: 9.2, speed: 34, radius: 0.6, dmg: 30, next: 0.4, kb: 1, tumble: 0, launch: 0 },
  bigrock: { name: 'ペブルショット', en: 'PEBBLE SHOT', aim: 'line', hidden: true, range: 9.2, speed: 34, radius: 0.95, dmg: 54, slow: 1.5, slowPct: 0.4, kb: 3 },
  workedground: { name: 'ペブルショット', en: 'PEBBLE SHOT', aim: 'ground', kind: 'field', hidden: true, friendly: true, aoe: 3.6, dur: 20, max: 2 },
  seismicshove: {
    name: 'グラウンドトス', en: 'GROUND TOSS', aim: 'ground', icon: 'blast', cd: 8, drag: true, ai: 'ground',
    tele: 0.15, range: 8, aoe: 2.3, push: 4,
    desc: '押した位置を地点にし、離した方向を向きにする。0.75秒後、その地点にいた相手を決めた向きへ吹き飛ばす。',
  },
  shovez: { name: 'グラウンドトス', en: 'GROUND TOSS', aim: 'ground', kind: 'blast', hidden: true, aoe: 2.3, delay: 0.75, kb: 11, tumble: 0.6 },
  unraveled: {
    name: 'ロックカーペット', en: 'ROCK CARPET', aim: 'cone', icon: 'cone', cd: 14, ai: 'cone',
    tele: 0.3, range: 7.5, half: 0.5, dmg: 40,
    desc: '扇状の範囲に岩を4秒間まく。上にいる相手は20%のスロウになる。突進や吹き飛ばしで岩の上を通った相手は爆発を受け、1秒間スタンする。',
  },
  boulders: { name: 'ロックカーペット', en: 'ROCK CARPET', aim: 'cone', kind: 'field', hidden: true, range: 7.5, half: 0.5, aoe: 7.5, dur: 4, dmg: 36, stun: 1, slowPct: 0.2, again: 1 },
  weaverwall: {
    name: 'ウォールサーフ', en: 'WALL SURF', aim: 'line', icon: 'star', cd: 2, ult: true, re: 'wallstop', ai: 'none',
    tele: 0.4, len: 20, side: 1.7, speed: 17, dist: 20, minDist: 3, through: true, fly: true,
    desc: '【必殺技】狙った方向へ、アリーナを横切る岩の壁を4秒間作り、壁に沿って端まで移動する。途中でもう一度押すと降りる。壁はコマを通さない。',
  },
  wallstop: { name: 'ウォールサーフ', en: 'WALL SURF', aim: 'self', hidden: true, free: true },
  weaverz: { name: 'ウォールサーフ', en: 'WALL SURF', aim: 'ground', hidden: true, solid: true, grown: true, wall: 10, aoe: 1, dur: 4 },
  // ---- MAD DOCTOR (Dr. Mundo)
  canister: { name: 'メディボトル', en: 'MEDI BOTTLE', aim: 'ground', hidden: true, aoe: 0.9, dur: 7, heal: 0.04, cut: 15 },
  bonesaw: {
    name: 'ソースロー', en: 'SAW THROW', aim: 'line', kind: 'shot', icon: 'shot', cd: 4,
    tele: 0.35, range: 9, speed: 34, radius: 0.8, dmg: 40, curPct: 0.15, slow: 2, slowPct: 0.4,
    desc: '弾を投げる。相手に残っている回転の15%ぶん（最低値あり）のダメージを与え、2秒間40%のスロウにする。',
  },
  heartzapper: {
    name: 'ショックオーラ', en: 'SHOCK AURA', aim: 'self', kind: 'field', icon: 'field', cd: 15, re: 'zapburst',
    follow: true, dur: 3, aoe: 3.3, dps: 20, buff: 3, endDmg: 34, storeHeal: 0.5,
    desc: '3秒間、周囲にダメージを与え続ける。その間に受けたダメージの50%はゲージに灰色で残り、終わりの爆発で回復する（爆発を当てれば全部、外せば半分）。もう一度押すと、すぐ爆発する。',
  },
  zapburst: { name: 'ショックオーラ', en: 'SHOCK AURA', aim: 'self', hidden: true, free: true },
  blunttrauma: {
    name: 'ピンチブロー', en: 'PINCH BLOW', aim: 'self', kind: 'buff', icon: 'burst', cd: 6,
    empower: 4, bonus: 22, selfMiss: 44, kb: 7,
    desc: '4秒以内の次の体当たりを強化する。自分の回転が減っているほどダメージが増える（70%減で最大）。',
  },
  maxdose: {
    name: 'リカバリーラッシュ', en: 'RECOVERY RUSH', aim: 'self', kind: 'buff', icon: 'star', cd: 2, ult: true, ai: 'recover',
    dur: 8,
    desc: '【必殺技】8秒間、回転が回復し続け（合計で最大値の35%）、20%加速する。',
  },
};
for (const id in SKILLS) SKILLS[id].id = id;
// A skill that is used on someone picks the enemy nearest the cursor, so the
// cursor is sent along even though nothing is aimed.
for (const id in SKILLS) if (SKILLS[id].need === 'range' || SKILLS[id].need === 'up') SKILLS[id].cursor = true;

export const KEYS = ['Q', 'W', 'E', 'R'];
export const skillOf = (top, key) => SKILLS[top.blade.kit[key]];
export const kitOf = (blade) => KEYS.map((k) => SKILLS[blade.kit[k]]);
// The skill (if any) that powers up a blade's next body hit.
for (const b of Object.values(BLADES)) b.emp = kitOf(b).find((S) => S.bonus) || null;
for (const b of Object.values(BLADES)) b.hasUlt = kitOf(b).some((S) => S.ult);

// Where the match is fought. `gaps` are the openings in the rim wall, as
// [centre angle, half width] in radians, the angle measured on screen: 0 is
// to the right, a quarter turn is the far side. `wall: false` has no wall.
// The tops start near and far, so the gaps are placed the same for both.
const GATE = 0.3;
export const STAGES = [
  { id: 'classic', name: 'スタンダード', en: 'STANDARD', ja: '壁に囲まれた基本のアリーナ。強く吹き飛ばして壁に叩きつけると場外。', wall: true, gaps: [] },
  { id: 'gates', name: 'スリーゲート', en: 'THREE GATES', ja: '壁の3か所に穴が開いている。穴から転がり出ると場外。', wall: true, gaps: [[0, GATE], [(Math.PI * 2) / 3, GATE], [(Math.PI * 4) / 3, GATE]] },
  { id: 'open', name: 'オープン', en: 'OPEN RING', ja: '壁が無い。端から出るとそのまま場外。', wall: false, gaps: [] },
];
// The stretches of wall a stage has, as [from, to] angles (to > from).
export const wallArcs = (g) => {
  if (!g.wall) return [];
  if (!g.gaps.length) return [[0, Math.PI * 2]];
  const gs = [...g.gaps].sort((p, q) => p[0] - q[0]);
  return gs.map((p, i) => { const q = gs[(i + 1) % gs.length]; return [p[0] + p[1], q[0] - q[1] + (i === gs.length - 1 ? Math.PI * 2 : 0)]; });
};

export const DIFFICULTY = [
  { id: 'easy', name: 'EASY', ja: 'やさしい', think: 0.95, aimErr: 3.2, dodge: 0.15, cast: 0.3, chase: 0.3, windup: 1.35 },
  { id: 'normal', name: 'NORMAL', ja: 'ふつう', think: 0.55, aimErr: 1.5, dodge: 0.5, cast: 0.5, chase: 0.5, windup: 1.0 },
  { id: 'hard', name: 'HARD', ja: 'つよい', think: 0.3, aimErr: 0.5, dodge: 0.85, cast: 0.75, chase: 0.7, windup: 0.8 },
];
