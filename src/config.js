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
  hammer: {
    id: 'hammer', kit: { Q: 'hshock', W: 'steadfast', E: 'hcharge', R: 'verdict' },
    name: 'アイアン・ハンマー', en: 'IRON HAMMER', type: 'DEFENSE', typeJa: 'ディフェンス',
    color: 0x5f8cff, css: '#5f8cff', teeth: 6,
    atk: 1.16, def: 1.2, mass: 1.3, speed: 12.5, decay: 5.8, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 3, def: 5, sta: 3, spd: 2 },
    pin: { dmg: 40, stun: 1.2 },
    desc: '相手を壁まで運んでスタンさせ、突進してくる相手は陣で止める。必殺技は場外まで吹き飛ばす一撃。',
  },
  fox: {
    id: 'fox', kit: { Q: 'orb', W: 'foxfire', E: 'charm', R: 'rush' },
    name: 'ナインテイル・チャーム', en: 'NINE TAIL CHARM', type: 'ATTACK', typeJa: 'アタック',
    color: 0xff8fd0, css: '#ff8fd0', teeth: 5,
    atk: 1.24, def: 0.98, mass: 0.94, speed: 15.5, decay: 6.6, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 4, def: 2, sta: 2, spd: 5 },
    desc: '行って戻る宝珠と、相手を引き寄せる魅了。必殺技は3回まで続けて使える突進。',
  },
  reaper: {
    id: 'reaper', kit: { Q: 'bonehook', W: 'ghostwater', E: 'undertow', R: 'deathbelow' },
    name: 'ブラッドハーバー・リーパー', en: 'HARBOR REAPER', type: 'ATTACK', typeJa: 'アタック',
    color: 0x1fae8c, css: '#1fae8c', teeth: 3,
    atk: 1.36, def: 1.02, mass: 0.96, speed: 15.5, decay: 6.5, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 5, def: 2, sta: 2, spd: 5 },
    store: { taken: 0.25, dealt: 0, max: 120, fade: 0 },
    grey: { rate: 45, far: 10 },
    desc: '溜めて伸ばす銛で引き寄せ、弱った相手を必殺技で「処刑」する。',
  },
  barrel: {
    id: 'barrel', kit: { Q: 'cask', W: 'drunk', E: 'bodyslam', R: 'bigkeg' },
    name: 'バレル・ブルーザー', en: 'BARREL BRUISER', type: 'DEFENSE', typeJa: 'ディフェンス',
    color: 0xc97a3a, css: '#c97a3a', teeth: 6,
    atk: 1.0, def: 1.12, mass: 1.35, speed: 12.5, decay: 5.7, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 3, def: 4, sta: 4, spd: 2 },
    desc: '樽と体当たりで相手を好きな方向へ吹き飛ばす重量級。',
  },
  chrono: {
    id: 'chrono', kit: { Q: 'timewinder', W: 'parallel', E: 'phasedive', R: 'rewind' },
    name: 'クロノ・リワインド', en: 'CHRONO REWIND', type: 'STAMINA', typeJa: 'スタミナ',
    color: 0x4af0e0, css: '#4af0e0', teeth: 4,
    atk: 1.25, def: 1.04, mass: 0.98, speed: 15, decay: 5.6, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 3, def: 3, sta: 4, spd: 4 },
    rewind: 4,
    desc: '行って戻る弾、踏んで起爆する罠、跳んでからのワープ攻撃。必殺技で4秒前の場所へ戻る。',
  },
  iron: {
    id: 'iron', kit: { Q: 'obliterate', W: 'indestructible', E: 'deathgrasp', R: 'realm' },
    name: 'アイアン・レヴナント', en: 'IRON REVENANT', type: 'DEFENSE', typeJa: 'ディフェンス',
    color: 0x6f9f8a, css: '#6f9f8a', teeth: 4,
    atk: 1.08, def: 1.15, mass: 1.3, speed: 12, decay: 5.8, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 4, def: 4, sta: 4, spd: 1 },
    store: { taken: 0.35, dealt: 0.35, max: 140, fade: 4 },
    buff: { atk: 1.15, armor: 0.85 },
    desc: '与えたダメージも受けたダメージも蓄え、バリアに変える。必殺技は相手から回転を吸い続ける。',
  },
  dragon: {
    id: 'dragon', kit: { Q: 'sonicwave', W: 'safeguard', E: 'tempest', R: 'dragonrage' },
    name: 'ドラゴン・ストライカー', en: 'DRAGON STRIKER', type: 'ATTACK', typeJa: 'アタック',
    color: 0xff5a3c, css: '#ff5a3c', teeth: 3,
    atk: 1.2, def: 0.98, mass: 1.0, speed: 15.5, decay: 6.9, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 5, def: 3, sta: 2, spd: 5 },
    desc: '弾を当てて飛びつき、密着した相手を狙った方向へ蹴り飛ばしてリングアウトを狙う。',
  },
  boss: {
    id: 'boss', kit: { Q: 'knuckle', W: 'haymaker', E: 'facebreaker', R: 'showstopper' },
    name: 'ブロウラー・キング', en: 'BRAWLER KING', type: 'DEFENSE', typeJa: 'ディフェンス',
    color: 0xf0a060, css: '#f0a060', teeth: 4,
    atk: 1.0, def: 1.1, mass: 1.3, speed: 13, decay: 5.8, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 4, def: 4, sta: 3, spd: 2 },
    store: { taken: 0.45, dealt: 0, max: 140, fade: 6 },
    desc: '受けたダメージを「気合」として溜め、拳とバリアにして返す。必殺技は相手を掴んで叩きつける。',
  },
  pirate: {
    id: 'pirate', kit: { Q: 'parrrley', W: 'orange', E: 'keg', R: 'barrage' },
    name: 'パウダー・キャプテン', en: 'POWDER CAPTAIN', type: 'ATTACK', typeJa: 'アタック',
    color: 0xd96a1e, css: '#d96a1e', teeth: 5,
    atk: 1.3, def: 1.02, mass: 1.0, speed: 13.5, decay: 6.0, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 4, def: 3, sta: 3, spd: 3 },
    desc: '火薬樽を並べ、撃って誘爆させる。必殺技はアリーナのどこにでも砲撃を降らせる。',
  },
  ash: {
    id: 'ash', kit: { Q: 'nails', W: 'ignition', E: 'pursuit', R: 'purgatory' },
    name: 'アッシュ・エクソシスト', en: 'ASHEN EXORCIST', type: 'ATTACK', typeJa: 'アタック',
    color: 0xb8b0a8, css: '#b8b0a8', teeth: 3,
    atk: 1.2, def: 0.94, mass: 0.95, speed: 15.5, decay: 6.9, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 5, def: 2, sta: 2, spd: 5 },
    desc: '釘を刺して鈍らせ、弱った相手を封印具で処刑する。封印具を拾うたび、処刑ラインが試合中ずっと上がる。',
  },
  prism: {
    id: 'prism', kit: { Q: 'binding', W: 'barrier', E: 'singularity', R: 'finalspark' },
    name: 'プリズム・レディアンス', en: 'PRISM RADIANCE', type: 'STAMINA', typeJa: 'スタミナ',
    color: 0xfff3a0, css: '#fff3a0', teeth: 6,
    atk: 1.35, def: 1.06, mass: 0.95, speed: 13.5, decay: 5.6, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 4, def: 2, sta: 4, spd: 3 },
    desc: '光で縛り、アリーナを貫く光線で撃ち抜く遠距離型。',
  },
  canvas: {
    id: 'canvas', kit: { Q: 'fireball', W: 'pool', E: 'grimface', R: 'despair' },
    name: 'ヴィジョン・ペインター', en: 'VISION PAINTER', type: 'STAMINA', typeJa: 'スタミナ',
    color: 0x7f7bff, css: '#7f7bff', teeth: 5,
    atk: 1.35, def: 1.06, mass: 0.96, speed: 13.5, decay: 5.4, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 3, def: 2, sta: 5, spd: 3 },
    desc: '炎で焼き、泉で回復し、恐怖で追い払う。必殺技は当てた場所に広がり続ける絶望を残す。',
  },
  star: {
    id: 'star', kit: { Q: 'paddle', W: 'thief', E: 'bubble', R: 'portal' },
    name: 'トワイライト・スター', en: 'TWILIGHT STAR', type: 'ATTACK', typeJa: 'アタック',
    color: 0xffb38a, css: '#ffb38a', teeth: 5,
    atk: 1.18, def: 0.92, mass: 0.92, speed: 15.5, decay: 6.8, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 5, def: 1, sta: 2, spd: 5 },
    desc: '遠くから当てるほど痛い星と、時間差で眠らせる泡。必殺技で飛び込み、すぐ元の場所へ帰れる。',
  },
  spark: {
    id: 'spark', kit: { Q: 'burstfire', W: 'ultrashock', E: 'surge', R: 'crash' },
    name: 'スパーク・サージ', en: 'SPARK SURGE', type: 'ATTACK', typeJa: 'アタック',
    color: 0xd8ff3a, css: '#d8ff3a', teeth: 4,
    atk: 1.2, def: 0.98, mass: 0.92, speed: 16, decay: 6.7, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 4, def: 2, sta: 2, spd: 5 },
    buff: { speed: 1.25, atk: 1.15 },
    desc: '短い間隔で撃ち続ける連射型。必殺技で帯電し、移動も攻撃も一段速くなる。',
  },
  plume: {
    id: 'plume', kit: { Q: 'daggers', W: 'plumage', E: 'bladecaller', R: 'storm' },
    name: 'フェザー・ストーム', en: 'FEATHER STORM', type: 'ATTACK', typeJa: 'アタック',
    color: 0xd03a8c, css: '#d03a8c', teeth: 5,
    atk: 1.32, def: 1.0, mass: 0.95, speed: 14.5, decay: 6.4, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 5, def: 2, sta: 3, spd: 4 },
    buff: { atk: 1.2 },
    desc: '投げた羽根は床に残り、呼び戻すと相手を背後から切り裂く。3枚当てるとスタン。',
  },
  darkin: {
    id: 'darkin', kit: { Q: 'darkinblade', W: 'chains', E: 'umbral', R: 'worldender' },
    name: 'ワールド・エンダー', en: 'WORLD ENDER', type: 'ATTACK', typeJa: 'アタック',
    color: 0xc81e3c, css: '#c81e3c', teeth: 3,
    atk: 1.2, def: 1.05, mass: 1.15, speed: 13.5, decay: 6.4, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 5, def: 3, sta: 3, spd: 3 },
    buff: { atk: 1.25, speed: 1.2, regen: 8 },
    desc: '3連の大剣で打ち上げる重い剣士。必殺技の間は攻撃も速度も上がり、回転が回復し続ける。',
  },
  rose: {
    id: 'rose', kit: { Q: 'flair', W: 'whirl', E: 'wildrush', R: 'inferno' },
    name: 'スタイル・ランカー', en: 'STYLE RANKER', type: 'ATTACK', typeJa: 'アタック',
    color: 0xe8566a, css: '#e8566a', teeth: 4,
    atk: 1.25, def: 0.98, mass: 0.98, speed: 15.5, decay: 6.6, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 5, def: 2, sta: 2, spd: 5 },
    desc: '撃って、弾を斬り払って、すり抜ける。必殺技は自分を中心に弾幕をばらまき続ける。',
  },
  glaive: {
    id: 'glaive', kit: { Q: 'darkglaive', W: 'dreaded', E: 'aureate', R: 'grim' },
    name: 'アンサンダード・グレイヴ', en: 'UNSUNDERED GLAIVE', type: 'DEFENSE', typeJa: 'ディフェンス',
    color: 0xe8b84a, css: '#e8b84a', teeth: 4,
    atk: 0.95, def: 1.05, mass: 1.2, speed: 13.5, decay: 5.8, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 4, def: 4, sta: 4, spd: 2 },
    ramp: { per: 0.01, max: 10 },
    desc: 'スキルを当てるたびに与えるダメージが1%ずつ上がっていく（ラウンド中、最大10回）。長期戦ほど強い。',
  },
  lunar: {
    id: 'lunar', kit: { Q: 'calibrum', W: 'infernum', E: 'gravitum', R: 'vigil' },
    name: 'ルナ・アーセナル', en: 'LUNAR ARSENAL', type: 'ATTACK', typeJa: 'アタック',
    color: 0x8fb8ff, css: '#8fb8ff', teeth: 4,
    atk: 1.34, def: 1.02, mass: 0.94, speed: 13.5, decay: 6.2, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 5, def: 1, sta: 3, spd: 3 },
    desc: '長射程の狙撃・扇状の炎・足止めの重力弾を使い分ける武器庫。',
  },
  cosmos: {
    id: 'cosmos', kit: { Q: 'breath', W: 'flight', E: 'blackhole', R: 'fallingstar' },
    name: 'スターフォージ', en: 'STAR FORGER', type: 'STAMINA', typeJa: 'スタミナ',
    color: 0x5a6cff, css: '#5a6cff', teeth: 6,
    atk: 1.2, def: 1.05, mass: 1.05, speed: 13, decay: 5.4, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 3, def: 3, sta: 5, spd: 2 },
    desc: '息吹を吐き続け、重力の穴に引き込み、星を落とす。大きく飛んで位置も変えられる。',
  },
  hex: {
    id: 'hex', kit: { Q: 'balefulstrike', W: 'darkmatter', E: 'horizon', R: 'primordial' },
    name: 'ダーク・ソーサラー', en: 'DARK SORCERER', type: 'STAMINA', typeJa: 'スタミナ',
    color: 0x9a4aff, css: '#9a4aff', teeth: 5,
    atk: 1.12, def: 1.0, mass: 0.94, speed: 13.5, decay: 5.6, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 3, def: 2, sta: 4, spd: 3 },
    permDmg: 0.02,
    desc: 'Qを当てるたびに魔力が溜まり、与えるダメージが2%ずつ上がる（最大30回）。魔力は次のラウンドにも持ち越す。',
  },
  gauntlet: {
    id: 'gauntlet', kit: { Q: 'vault', W: 'blastshield', E: 'relentless', R: 'cease' },
    name: 'ヴォルト・ブレイカー', en: 'VAULT BREAKER', type: 'ATTACK', typeJa: 'アタック',
    color: 0xff4f9a, css: '#ff4f9a', teeth: 3,
    atk: 1.08, def: 1.05, mass: 1.15, speed: 14.5, decay: 6.6, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 5, def: 3, sta: 3, spd: 4 },
    desc: '長い突進で殴り込む。必殺技は離れた相手に一瞬で詰め寄り、打ち上げる。',
  },
  arcane: {
    id: 'arcane', kit: { Q: 'mystic', W: 'flux', E: 'arcshift', R: 'trueshot' },
    name: 'アーケイン・シューター', en: 'ARCANE SHOOTER', type: 'ATTACK', typeJa: 'アタック',
    color: 0x6ae0ff, css: '#6ae0ff', teeth: 4,
    atk: 1.3, def: 1.0, mass: 0.92, speed: 15, decay: 6.4, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 5, def: 1, sta: 2, spd: 4 },
    desc: 'Qを当てるほど他のスキルが早く戻ってくる。当て続けることが強さになる射撃型。',
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
    range: 11, speed: 32, radius: 0.8, dmg: 24, slow: 1.5, tie: 'CHAINED', dur: 1.5, safe: 6, breakRange: 10.5, pop: 54, root: 1.3,
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
  // ---- IRON HAMMER: walls are weapons ----------------------------------------
  hshock: {
    name: 'ハンマーショック', en: 'HAMMER SHOCK', aim: 'ground', kind: 'blast', icon: 'blast', cd: 6,
    tele: 0.2, range: 5.5, aoe: 2.6, delay: 0.3, twice: 0.9, dmg: 40, slow: 1,
    desc: '床を叩いてスロウにし、同じ場所が少し遅れてもう一度爆発する。',
  },
  steadfast: {
    name: '不動の陣', en: 'STEADFAST PRESENCE', aim: 'self', kind: 'field', icon: 'shield', cd: 12,
    follow: true, block: true, dur: 2.5, aoe: 4, dmg: 22, stun: 0.5, haste: 2.5,
    desc: '2.5秒間、自分の周りに陣を張って加速する。陣の中で突進・瞬間移動した相手を止めて弾き返す。',
  },
  hcharge: {
    name: 'ヒロイックチャージ', en: 'HEROIC CHARGE', aim: 'dash', kind: 'dash', icon: 'dash', cd: 9,
    tele: 0.4, dist: 7, minDist: 3, speed: 34, dmg: 30, kb: 14, carry: 0.9,
    desc: '突進して相手を進行方向へ運ぶ。そのまま壁に叩きつけるとスタンと追加ダメージ。',
  },
  verdict: {
    name: '裁きの一撃', en: "KEEPER'S VERDICT", aim: 'line', kind: 'beam', icon: 'beam', cd: 2, ult: true,
    tele: 0.2, charge: 0.7, root: true, armor: 0.5, range: 14, radius: 1.6, dmg: 115, kb: 24, launch: 2,
    desc: '【必殺技】力を溜めて一直線の衝撃波を放ち、当たった相手を場外まで吹き飛ばす。',
  },
  // ---- NINE TAIL CHARM: out, back, and three more times ----------------------
  orb: {
    name: '欺きの宝珠', en: 'ORB OF DECEPTION', aim: 'line', kind: 'shot', icon: 'orb', cd: 5,
    tele: 0.35, range: 11, speed: 26, radius: 0.9, dmg: 32, pierce: true, ret: true, backMul: 1.3,
    desc: '宝珠が行って戻ってくる。往復とも当たり、戻りのほうが痛い。',
  },
  foxfire: {
    name: '狐火', en: 'FOX-FIRE', aim: 'self', kind: 'bolts', icon: 'star', cd: 7,
    bolt: 'foxbolt', n: 3, haste: 1.5,
    desc: '相手を自動で狙う狐火を3発放ち、少しの間加速する。',
  },
  foxbolt: {
    name: '狐火', en: 'FOX-FIRE', aim: 'line', hidden: true,
    range: 10, speed: 30, radius: 0.5, dmg: 18, kb: 1.5, tumble: 0, launch: 0,
  },
  charm: {
    name: '魅了', en: 'CHARM', aim: 'line', kind: 'shot', icon: 'heart', cd: 10,
    tele: 0.4, range: 11, speed: 30, radius: 0.85, dmg: 30, charm: 1.3,
    desc: '当たった相手は1.3秒間、何もできずにこちらへ歩いてくる。',
  },
  rush: {
    name: 'スピリットラッシュ', en: 'SPIRIT RUSH', aim: 'dash', kind: 'dash', icon: 'dash', cd: 2, ult: true,
    re: 'rush', casts: 3, window: 6, dist: 6, minDist: 3, speed: 38, through: true, bolt: 'foxbolt', n: 2,
    desc: '【必殺技】相手をすり抜ける突進。6秒以内なら3回まで使え、止まるたびに狐火を2発放つ。',
  },
  // ---- HARBOR REAPER: hook, drown, execute -----------------------------------
  bonehook: {
    name: '骨の銛', en: 'BONE SKEWER', aim: 'line', kind: 'shot', icon: 'hook', cd: 8, tele: 0.45,
    wind: { min: 0.5, full: 1, max: 4 }, tap: 'bonestab', near: 3.7, range: 9.3, speed: 34, radius: 0.8, dmg: 46, chain: true, pull: 20, pullDist: 5.5, slow: 1, slowPct: 0.9,
    desc: '長押しで溜めるほど射程が伸びる銛（溜め中は少し遅くなり、4秒で不発）。当たった相手を一定距離だけ手前へ引く。すぐ離すと近距離の突きになる。',
  },
  bonestab: {
    name: '突き', en: 'STAB', aim: 'line', hidden: true,
    range: 2, speed: 60, radius: 1.1, dmg: 46, slow: 1, slowPct: 0.9,
  },
  ghostwater: {
    name: 'ゴーストウォーター', en: 'GHOSTWATER DIVE', aim: 'self', kind: 'buff', icon: 'buff', cd: 10,
    haste: 5,
    desc: '5秒間加速する。受けたダメージの一部はゲージに灰色で残っていて、加速中か、相手から離れている間に戻ってくる。',
  },
  undertow: {
    name: '亡者の引き波', en: 'PHANTOM UNDERTOW', aim: 'dash', kind: 'dash', icon: 'dash', cd: 11,
    dist: 5.5, minDist: 5.5, speed: 36, through: true, echo: 'undertowz',
    desc: 'その場に亡霊を残し、相手をすり抜けて跳ぶ。亡霊は1秒後に自分のいる所へ飛んできて、通り道の相手をスタンさせる。',
  },
  undertowz: {
    name: '亡霊', en: 'PHANTOM', aim: 'ground', hidden: true, ghost: true,
    aoe: 1.2, delay: 1,
  },
  wraith: {
    name: '亡霊', en: 'PHANTOM', aim: 'line', hidden: true, ghost: true,
    range: 30, speed: 26, radius: 1.1, dmg: 44, stun: 0.75, pierce: true,
  },
  deathbelow: {
    name: '水底の急襲', en: 'DEATH FROM BELOW', aim: 'ground', icon: 'cross', cd: 2, ult: true,
    ai: 'blast', tele: 0.2, range: 7.5, aoe: 3.6, arm: 3.6, width: 0.95, delay: 0.5, dmg: 115, line: 0.2,
    desc: '【必殺技】指定地点をX字に断つ。X字の中に相手がいれば、その地点へ瞬時に移動する。回転が20%を切って印の付いた相手は即KO。',
  },
  // ---- BARREL BRUISER: throw them wherever you like --------------------------
  cask: {
    name: '樽転がし', en: 'BARREL ROLL', aim: 'ground', kind: 'field', icon: 'blast', cd: 8,
    re: 'caskpop', range: 9, aoe: 3.2, dur: 2.5, endDmg: 50, endSlow: 1.5,
    desc: '樽を置く。2.5秒後か、もう一度押したときに爆発してスロウにする。',
  },
  caskpop: {
    name: '起爆', en: 'DETONATE', aim: 'self', hidden: true,
    
  },
  drunk: {
    name: '酔いどれ', en: 'DRUNKEN RAGE', aim: 'self', kind: 'buff', icon: 'buff', cd: 7,
    empower: 4, bonus: 26, kb: 7, stun: 0.4, shield: 40, hold: 2.5,
    desc: 'バリアを張り、4秒間、次の体当たりを強化する。当てると一瞬スタン。',
  },
  bodyslam: {
    name: '体当たり', en: 'BODY SLAM', aim: 'dash', kind: 'dash', icon: 'dash', cd: 9,
    tele: 0.4, dist: 6.5, minDist: 3, speed: 32, dmg: 30, keep: 0.5, kb: 6, stun: 0.8,
    desc: '突進し、最初に当たった相手をスタンさせる。',
  },
  bigkeg: {
    name: '爆発樽', en: 'EXPLOSIVE CASK', aim: 'ground', kind: 'blast', icon: 'blast', cd: 2, ult: true,
    tele: 0.15, range: 10, aoe: 4.4, delay: 0.45, dmg: 100, kb: 16, launch: 2,
    desc: '【必殺技】着弾点を中心に外向きへ大きく吹き飛ばす。奥に置けば手前へ、手前に置けば場外へ。',
  },
  // ---- CHRONO REWIND: undo the last four seconds -----------------------------
  timewinder: {
    name: 'タイムワインダー', en: 'TIMEWINDER', aim: 'line', kind: 'shot', icon: 'orb', cd: 7, tele: 0.35,
    range: 7, speed: 40, radius: 0.9, dmg: 46, pierce: true, ret: true, backMul: 1.4, crawl: 3, linger: 1.6, field: 2.4, fieldPct: 0.6,
    desc: '速く飛び、相手に当たるか射程の端で減速フィールドに変わってゆっくり進む。そのあと手元へ戻り、戻りでも当たる。',
  },
  parallel: {
    name: 'パラレルトラップ', en: 'PARALLEL CONVERGENCE', aim: 'ground', icon: 'field', cd: 14,
    ai: 'ground', range: 12, aoe: 3.6, arm: 3, reveal: 2.5, dur: 4.5, stun: 1.35, shield: 90,
    desc: '3秒後に領域が現れ、1.5秒残る（相手には直前まで見えない）。中の相手はスロウ。領域が現れてから自分が中にいると爆発し、相手をスタンさせてバリアを得る。',
  },
  phasedive: {
    name: 'フェイズダイブ', en: 'PHASE DIVE', aim: 'dash', kind: 'dash', icon: 'dash', cd: 7, re: 'phasehit',
    dist: 4, minDist: 4, speed: 34, window: 3,
    desc: '短く跳ぶ。3秒以内にもう一度押すと、近くの相手の元へワープして殴る。',
  },
  phasehit: {
    name: 'フェイズダイブ', en: 'PHASE DIVE', aim: 'self', kind: 'strike', hidden: true,
    need: 'range', grab: 5.2, tp: true, dmg: 66,
  },
  rewind: {
    name: 'クロノブレイク', en: 'CHRONOBREAK', aim: 'self', icon: 'star', cd: 2, ult: true,
    air: 0.35, height: 0, base: 80, aoe: 4.2, dmg: 150, kb: 8,
    desc: '【必殺技】後ろを付いて回る半透明の自分（4秒前の位置）へ無敵で戻り、周囲にダメージを与えて回復する。直前4秒で失った回転が多いほど回復が増える。',
  },
  // ---- IRON REVENANT: every blow is banked -----------------------------------
  obliterate: {
    name: '破砕', en: 'OBLITERATE', aim: 'ground', kind: 'blast', icon: 'blast', cd: 5,
    tele: 0.2, range: 5.5, aoe: 2.7, delay: 0.5, dmg: 58, kb: 4,
    desc: '少し溜めて目の前の床を叩き割る。',
  },
  indestructible: {
    name: '不壊', en: 'INDESTRUCTIBLE', aim: 'self', kind: 'buff', icon: 'shield', cd: 12,
    storeShield: true, min: 30, max: 140, hold: 4,
    desc: '与えた・受けたダメージの蓄えを、4秒間のバリアに変える。',
  },
  deathgrasp: {
    name: '死の掌握', en: "DEATH'S GRASP", aim: 'cone', kind: 'cone', icon: 'grab', cd: 10,
    tele: 0.35, range: 8, half: 0.45, dmg: 26, pull: 16, slow: 1,
    desc: '扇の中の相手を手前へ引きずり込む。',
  },
  realm: {
    name: '死の領域', en: 'REALM OF DEATH', aim: 'self', icon: 'star', cd: 2, ult: true,
    need: 'range', range: 9, dur: 6, drain: 22, heal: 0.6, breakRange: 40,
    desc: '【必殺技】近くの相手を6秒間、どこへ逃げても切れない帯でつなぎ、回転を吸い続ける。その間は攻撃と防御も上がる。',
  },
  // ---- DRAGON STRIKER: mark, follow, kick out --------------------------------
  sonicwave: {
    name: '響波', en: 'SONIC WAVE', aim: 'line', kind: 'shot', icon: 'shot', cd: 7,
    tele: 0.4, re: 'resonate', reOnHit: 3, range: 13, speed: 36, radius: 0.8, dmg: 32,
    desc: '弾を撃つ。当たったら3秒以内にもう一度押すと、相手へ一瞬で飛びつく。',
  },
  resonate: {
    name: '共鳴撃', en: 'RESONATING STRIKE', aim: 'self', kind: 'strike', hidden: true,
    tp: true, dmg: 40, exec: 0.6,
  },
  safeguard: {
    name: '鉄の構え', en: 'SAFEGUARD', aim: 'self', kind: 'buff', icon: 'shield', cd: 9,
    shield: 60, hold: 2, haste: 2,
    desc: '2秒間バリアを張り、加速する。',
  },
  tempest: {
    name: '地裂', en: 'TEMPEST', aim: 'self', kind: 'burst', icon: 'burst', cd: 7,
    aoe: 4, dmg: 34, slow: 1.8,
    desc: '周囲に衝撃波を出してスロウにする。',
  },
  dragonrage: {
    name: '龍の怒り', en: "DRAGON'S RAGE", aim: 'line', kind: 'kick', icon: 'beam', cd: 2, ult: true,
    need: 'range', grab: 3.8, range: 6, radius: 1.2, dmg: 100, kb: 26, launch: 2.2,
    desc: '【必殺技】密着した相手を、狙った方向へ場外まで蹴り飛ばす。',
  },
  // ---- BRAWLER KING: take it, then give it back ------------------------------
  knuckle: {
    name: '拳闘', en: 'KNUCKLE DOWN', aim: 'self', kind: 'buff', icon: 'buff', cd: 6,
    empower: 4, bonus: 30, kb: 8, haste: 1.5,
    desc: '加速し、4秒間、次の体当たりを強化する。',
  },
  haymaker: {
    name: '剛拳', en: 'HAYMAKER', aim: 'cone', kind: 'cone', icon: 'cone', cd: 10,
    tele: 0.4, range: 7.5, half: 0.4, dmg: 34, storeHit: 0.6, hold: 2.5,
    desc: '溜まった気合をすべて拳に乗せて殴り、同じ量のバリアを得る。',
  },
  facebreaker: {
    name: '顔面クラッシュ', en: 'FACEBREAKER', aim: 'self', kind: 'burst', icon: 'grab', cd: 9,
    aoe: 4.2, dmg: 26, pullIn: 14, stun: 0.7,
    desc: '周囲の相手を自分のところへ引き寄せてスタンさせる。',
  },
  showstopper: {
    name: 'ショーストッパー', en: 'THE SHOW STOPPER', aim: 'ground', kind: 'throw', icon: 'leap', cd: 2, ult: true,
    need: 'range', grab: 3.8, range: 8, aoe: 3.6, air: 0.7, height: 5, dmg: 100, massMul: 0.6, stun: 0.5,
    desc: '【必殺技】密着した相手を掴み、指定地点へ叩きつける。重い相手ほどダメージが大きい。',
  },
  // ---- POWDER CAPTAIN: kegs first, then the match ----------------------------
  parrrley: {
    name: '早撃ち', en: 'PARRRLEY', aim: 'line', kind: 'shot', icon: 'shot', cd: 3,
    tele: 0.35, range: 12, speed: 40, radius: 0.7, dmg: 42, kb: 3, tumble: 0.1,
    desc: '弾を撃つ。自分の火薬樽に当てると爆発させられる。',
  },
  orange: {
    name: '壊血病治療', en: 'REMOVE SCURVY', aim: 'self', kind: 'buff', icon: 'heal', cd: 14,
    heal: 0.12, flat: 40, cleanse: true,
    desc: '回転を回復し、スロウ・毒・出血などをすべて消す。',
  },
  keg: {
    name: '火薬樽', en: 'POWDER KEG', aim: 'ground', icon: 'trap', cd: 6,
    ai: 'ground', range: 8, aoe: 3.6, dur: 18, max: 3, dmg: 72, slow: 1.5, kb: 5,
    desc: '火薬樽を置く（最大3個）。自分の弾か体当たりで爆発し、近くの樽も誘爆する。相手に踏まれると不発。',
  },
  barrage: {
    name: '一斉砲撃', en: 'CANNON BARRAGE', aim: 'ground', kind: 'field', icon: 'field', cd: 2, ult: true,
    range: 30, aoe: 6, dur: 5, dps: 44, slowIn: true,
    desc: '【必殺技】アリーナのどこへでも5秒間の砲撃を降らせる。中の相手はスロウになり削られ続ける。',
  },
  // ---- ASHEN EXORCIST: nail them down, then seal them away -------------------
  nails: {
    name: '儀式の釘', en: 'RITUAL NAILS', aim: 'line', kind: 'shot', icon: 'shot', cd: 6,
    tele: 0.3, re: 'nails', casts: 3, window: 2.5, range: 12, speed: 38, radius: 0.7, dmg: 24, nail: 0.25,
    desc: '釘を投げる。続けて3本まで投げられ、刺さった本数だけ相手のスロウが強くなる。',
  },
  ignition: {
    name: '魂の点火', en: 'SOUL IGNITION', aim: 'self', kind: 'buff', icon: 'buff', cd: 11,
    cost: 40, haste: 4, shield: 70, hold: 4,
    desc: '回転を少し燃やして4秒間加速し、バリアを得る。',
  },
  pursuit: {
    name: '灰の追跡', en: 'ASHEN PURSUIT', aim: 'blink', kind: 'blink', icon: 'blink', cd: 8,
    range: 6, speed: 40, aoe: 3, dmg: 34, perTag: 24,
    desc: '瞬間移動して周囲を斬る。相手に刺さった釘を引き抜き、1本ごとに追加ダメージ。',
  },
  purgatory: {
    name: '煉獄', en: 'PURGATORY', aim: 'ground', icon: 'cross', cd: 2, ult: true,
    ai: 'ground', range: 9, aoe: 3.5, dur: 4, dmg: 95, slow: 1.5, line: 0.1, per: 0.02, permMax: 4,
    desc: '【必殺技】封印具を蹴り込み、範囲内の相手に釘を3本刺す。4秒の間に釘の刺さった相手の回転が処刑ライン（10%）を切ると即KO。封印具を自分で拾うとラインが2%上がる（試合中ずっと、最大18%）。',
  },
  // ---- PRISM RADIANCE: bind, then burn a line across the arena ---------------
  binding: {
    name: '光の縛め', en: 'LIGHT BINDING', aim: 'line', kind: 'shot', icon: 'shot', cd: 6,
    tele: 0.45, range: 13, speed: 30, radius: 0.8, dmg: 40, stun: 1.2,
    desc: '当たった相手を1.2秒スタンさせる弾。',
  },
  barrier: {
    name: '虹の障壁', en: 'PRISMATIC BARRIER', aim: 'self', kind: 'buff', icon: 'shield', cd: 9,
    shield: 90, hold: 2.5,
    desc: '2.5秒間のバリアを張る。',
  },
  singularity: {
    name: '光の特異点', en: 'LUCENT SINGULARITY', aim: 'ground', kind: 'field', icon: 'field', cd: 5.5,
    tele: 0.1, range: 10, aoe: 3.2, dur: 1.1, slowIn: true, endDmg: 66, endSlow: 1,
    desc: '中の相手をスロウにする光球を置く。1.3秒後に炸裂する。',
  },
  finalspark: {
    name: '終極の閃光', en: 'FINAL SPARK', aim: 'line', kind: 'beam', icon: 'beam', cd: 2, ult: true,
    tele: 0.1, charge: 0.6, root: true, range: 30, radius: 1.4, dmg: 180,
    desc: '【必殺技】少し溜めて、アリーナを端から端まで貫く光線を放つ。',
  },
  // ---- VISION PAINTER: fire, a spring, and dread -----------------------------
  fireball: {
    name: '破滅の炎', en: 'DEVASTATING FIRE', aim: 'line', kind: 'shot', icon: 'shot', cd: 3.2,
    tele: 0.35, range: 12, speed: 32, radius: 0.8, dmg: 34, splash: 2.6, splashDmg: 26,
    desc: '当たるか射程の端で爆発する火球。',
  },
  pool: {
    name: '安息の泉', en: 'FLEETING CURRENT', aim: 'self', kind: 'field', icon: 'heal', cd: 12,
    aoe: 3.6, dur: 4, regen: 20, hasteIn: true,
    desc: '足元に泉を作る。中にいる間は回転が回復し、加速する。',
  },
  grimface: {
    name: '戦慄の貌', en: 'GRIM VISAGE', aim: 'line', kind: 'shot', icon: 'heart', cd: 8,
    tele: 0.4, range: 11, speed: 34, radius: 0.8, dmg: 32, fear: 1.1,
    desc: '当たった相手は1.1秒間、何もできずに逃げていく。',
  },
  despair: {
    name: '絶望の螺旋', en: 'SPIRALING DESPAIR', aim: 'line', kind: 'shot', icon: 'star', cd: 2, ult: true,
    tele: 0.4, range: 14, speed: 30, radius: 1.0, dmg: 30, spawn: 'despairz',
    desc: '【必殺技】当たった場所に3秒間広がり続ける領域を残す。中の相手はスロウになり削られ、最後に炸裂する。',
  },
  despairz: {
    name: '絶望', en: 'DESPAIR', aim: 'ground', kind: 'field', hidden: true,
    aoe: 5, r0: 2, grow: 2.4, dur: 3, dps: 50, slowIn: true, endDmg: 90,
  },
  // ---- TWILIGHT STAR: the further the better ---------------------------------
  paddle: {
    name: '流れ星', en: 'PADDLE STAR', aim: 'line', kind: 'shot', icon: 'star', cd: 5,
    tele: 0.4, range: 16, speed: 30, radius: 0.8, dmg: 24, far: 1.4,
    desc: '星を投げる。遠くまで飛んでから当たるほどダメージが上がる（最大2.4倍）。',
  },
  thief: {
    name: '呪文泥棒', en: 'SPELL THIEF', aim: 'self', kind: 'bolts', icon: 'star', cd: 8,
    bolt: 'starbolt', n: 3, haste: 2,
    desc: '相手を自動で狙う光弾を3発放ち、加速する。',
  },
  starbolt: {
    name: '光弾', en: 'STAR BOLT', aim: 'line', hidden: true,
    range: 10, speed: 30, radius: 0.5, dmg: 15, kb: 1.5, tumble: 0, launch: 0,
  },
  bubble: {
    name: 'おやすみ泡', en: 'SLEEPY TROUBLE BUBBLE', aim: 'line', kind: 'shot', icon: 'orb', cd: 10,
    range: 11, speed: 26, radius: 0.9, dmg: 18, slow: 1.4, tie: 'DROWSY', dur: 1.2, breakRange: 99, pop: 30, root: 1.6,
    desc: '当たった相手はうとうとしてスロウになり、1.2秒後に眠って1.6秒動けなくなる。',
  },
  portal: {
    name: 'ポータルジャンプ', en: 'PORTAL JUMP', aim: 'blink', kind: 'blink', icon: 'blink', cd: 2, ult: true,
    re: 'recall', window: 1.8, range: 7, speed: 60, aoe: 3.2, dmg: 95, kb: 6,
    desc: '【必殺技】瞬間移動して周囲を吹き飛ばす。1.8秒以内にもう一度押すと元の場所へ帰る。',
  },
  // ---- SPARK SURGE: never stop shooting --------------------------------------
  burstfire: {
    name: '連射', en: 'BURST FIRE', aim: 'line', kind: 'shot', icon: 'shot', cd: 1.1,
    tele: 0.2, range: 9, speed: 44, radius: 0.6, dmg: 16, fan: 3, half: 0.1, kb: 1, tumble: 0, launch: 0,
    desc: '3発の弾を細い扇で撃つ。クールダウンがとても短い。',
  },
  ultrashock: {
    name: 'ウルトラショック', en: 'ULTRASHOCK LASER', aim: 'line', kind: 'shot', icon: 'beam', cd: 8,
    tele: 0.4, range: 18, speed: 50, radius: 0.7, dmg: 46, slow: 1.5,
    desc: '長射程の電撃。当たった相手をスロウにする。',
  },
  surge: {
    name: 'スパークサージ', en: 'SPARK SURGE', aim: 'dash', kind: 'dash', icon: 'dash', cd: 7,
    dist: 6, minDist: 4, speed: 40, through: true, haste: 2,
    desc: '相手をすり抜ける突進。そのあと2秒間加速する。',
  },
  crash: {
    name: 'ライトニングクラッシュ', en: 'LIGHTNING CRASH', aim: 'self', kind: 'burst', icon: 'burst', cd: 2, ult: true,
    aoe: 5, dmg: 110, kb: 8, buff: 8,
    desc: '【必殺技】周囲に放電し、8秒間、移動速度と与えるダメージが上がる。',
  },
  // ---- FEATHER STORM: the feathers come back ---------------------------------
  daggers: {
    name: '双刃', en: 'DOUBLE DAGGERS', aim: 'line', kind: 'shot', icon: 'shot', cd: 4,
    tele: 0.3, range: 12, speed: 38, radius: 0.7, dmg: 26, fan: 2, half: 0.09, pierce: true, feather: true,
    desc: '貫通する羽根を2枚投げる。羽根は落ちた場所に6秒残る。',
  },
  feather: {
    name: '羽根', en: 'FEATHER', aim: 'ground', hidden: true,
    aoe: 0.6, dur: 6, max: 6,
  },
  plumage: {
    name: '死の羽衣', en: 'DEADLY PLUMAGE', aim: 'self', kind: 'buff', icon: 'buff', cd: 12,
    dur: 4, haste: 2,
    desc: '4秒間、与えるダメージが20%上がり、少しの間加速する。',
  },
  bladecaller: {
    name: 'ブレードコーラー', en: 'BLADECALLER', aim: 'self', icon: 'grab', cd: 7,
    ai: 'feathers',
    desc: '床の羽根をすべて自分へ呼び戻す。途中の相手を切り裂き、3枚当たるとスタン。',
  },
  quill: {
    name: '羽根', en: 'QUILL', aim: 'line', hidden: true,
    range: 30, speed: 40, radius: 0.9, dmg: 28, pierce: true, root: 1.2,
  },
  storm: {
    name: 'フェザーストーム', en: 'FEATHERSTORM', aim: 'leap', kind: 'leap', icon: 'leap', cd: 2, ult: true,
    range: 6, aoe: 1.5, air: 0.9, height: 6, shot: 'daggers', fan: 5, half: 0.5,
    desc: '【必殺技】跳び上がって攻撃をかわし、扇状に羽根を5枚ばらまく。',
  },
  // ---- WORLD ENDER: three swings and the end of the world --------------------
  darkinblade: {
    name: 'ダーキンブレード', en: 'THE DARKIN BLADE', aim: 'ground', kind: 'blast', icon: 'blast', cd: 10,
    tele: 0.15, re: 'darkinblade', casts: 3, window: 3.5, range: 6, aoe: 2.7, delay: 0.45, dmg: 42, up: 0.5,
    desc: '大剣を叩きつけて打ち上げる。続けて3回まで使える。',
  },
  chains: {
    name: '業火の鎖', en: 'INFERNAL CHAINS', aim: 'line', kind: 'shot', icon: 'hook', cd: 11,
    tele: 0.4, range: 10, speed: 30, radius: 0.8, dmg: 22, slow: 1.3, tie: 'CHAINED', dur: 1.3, safe: 4, breakRange: 6, pop: 30, yank: 16,
    desc: '鎖でつなぐ。1.3秒のあいだに離れなければ、手元まで引きずり戻す。',
  },
  umbral: {
    name: '影の突進', en: 'UMBRAL DASH', aim: 'dash', kind: 'dash', icon: 'dash', cd: 5,
    dist: 4.5, minDist: 3, speed: 34, dmg: 10, keep: 0.3, kb: 4, heal: 0.05,
    desc: '短く突進し、減った回転を少し取り戻す。',
  },
  worldender: {
    name: 'ワールドエンダー', en: 'WORLD ENDER', aim: 'self', kind: 'buff', icon: 'star', cd: 2, ult: true,
    dur: 9,
    desc: '【必殺技】9秒間、攻撃と速度が上がり、回転が回復し続ける。',
  },
  // ---- STYLE RANKER: shoot, cut, pass through --------------------------------
  flair: {
    name: '早撃ち', en: 'FLAIR', aim: 'line', kind: 'shot', icon: 'shot', cd: 2.5,
    tele: 0.3, range: 10, speed: 40, radius: 0.7, dmg: 36, kb: 3, tumble: 0.1,
    desc: '弾を撃つ。クールダウンが短い。',
  },
  whirl: {
    name: '円刃', en: 'BLADE WHIRL', aim: 'self', kind: 'field', icon: 'burst', cd: 11,
    follow: true, eat: true, dur: 0.8, aoe: 3.4, dmg0: 32,
    desc: '周囲を斬り、0.8秒間、近くに飛んできた相手の弾をすべて斬り落とす。',
  },
  wildrush: {
    name: 'ワイルドラッシュ', en: 'WILD RUSH', aim: 'dash', kind: 'dash', icon: 'dash', cd: 6,
    tele: 0.3, dist: 6, minDist: 4, speed: 38, through: true, pass: 38, haste: 1.5,
    desc: '相手をすり抜けて斬る突進。そのあと少しの間加速する。',
  },
  inferno: {
    name: '地獄の引き金', en: 'INFERNO TRIGGER', aim: 'self', kind: 'field', icon: 'burst', cd: 2, ult: true,
    follow: true, dur: 2.2, aoe: 5.5, dps: 100,
    desc: '【必殺技】2.2秒間、自分の周囲に弾幕をばらまき続ける。動きながら撃てる。',
  },
  // ---- UNSUNDERED GLAIVE: stronger with every hit ----------------------------
  darkglaive: {
    name: 'ダーキングレイヴ', en: 'THE DARKIN GLAIVE', aim: 'self', kind: 'buff', icon: 'buff', cd: 6,
    empower: 4, bonus: 30, kb: 7, up: 0.4, healMax: 0.025,
    desc: '回転を少し回復し、4秒間、次の体当たりを強化する。当てると打ち上げる。',
  },
  dreaded: {
    name: '戦慄の帰還', en: 'DREADED RETURN', aim: 'line', kind: 'shot', icon: 'hook', cd: 8,
    tele: 0.4, range: 9, speed: 34, radius: 0.9, dmg: 34, chain: true, pull: 16, slow: 0.8,
    desc: '槍で突き、当たった相手を引き寄せる。',
  },
  aureate: {
    name: '黄金の突進', en: 'AUREATE RUSH', aim: 'dash', kind: 'dash', icon: 'dash', cd: 8,
    dist: 5.5, minDist: 3, speed: 34, aoe: 4.2, inner: 2, land: 38, weak: 20,
    desc: '突進した先で周囲を薙ぐ。外周で当てたほうがダメージが大きい。',
  },
  grim: {
    name: '冷酷な救済', en: 'GRIM DELIVERANCE', aim: 'leap', kind: 'leap', icon: 'leap', cd: 2, ult: true,
    range: 8, air: 0.8, height: 6, aoe: 4, dmg: 115, kb: 10, healHit: 0.2,
    desc: '【必殺技】跳び上がって突き下ろす。与えたダメージの20%ぶん回転が回復する。',
  },
  // ---- LUNAR ARSENAL: a gun for every range ----------------------------------
  calibrum: {
    name: '月光狙撃', en: 'CALIBRUM', aim: 'line', kind: 'shot', icon: 'beam', cd: 6,
    tele: 0.45, range: 20, speed: 52, radius: 0.7, dmg: 46, mark: 4,
    desc: '長射程の狙撃。当たると印が付き、次のスキルが当たると炸裂する。',
  },
  infernum: {
    name: '蒼炎放射', en: 'INFERNUM', aim: 'cone', kind: 'cone', icon: 'cone', cd: 5,
    tele: 0.3, range: 7.5, half: 0.5, dmg: 50, kb: 4,
    desc: '扇状に炎を噴く。',
  },
  gravitum: {
    name: '重力弾', en: 'GRAVITUM', aim: 'line', kind: 'shot', icon: 'orb', cd: 10,
    tele: 0.4, range: 12, speed: 34, radius: 0.8, dmg: 20, slow: 2.5, tie: 'ROOTING', dur: 0.9, breakRange: 99, pop: 12, root: 1.0,
    desc: '当たった相手を強いスロウにし、0.9秒後にその場へ縛り付ける。',
  },
  vigil: {
    name: '月光の番人', en: 'MOONLIGHT VIGIL', aim: 'line', kind: 'shot', icon: 'star', cd: 2, ult: true,
    tele: 0.4, range: 16, speed: 24, radius: 1.4, dmg: 70, slow: 1.5, splash: 4, splashDmg: 100,
    desc: '【必殺技】ゆっくり進む月光弾。当たるか射程の端で大きく爆発する。',
  },
  // ---- STAR FORGER: breath, gravity, a falling star --------------------------
  breath: {
    name: '星の息吹', en: 'BREATH OF LIGHT', aim: 'cone', kind: 'cone', icon: 'cone', cd: 1.6,
    tele: 0.2, range: 8, half: 0.3, dmg: 30,
    desc: '細い扇で息吹を吐く。クールダウンがとても短い。',
  },
  flight: {
    name: '星間飛行', en: 'ASTRAL FLIGHT', aim: 'leap', kind: 'leap', icon: 'leap', cd: 13,
    range: 12, aoe: 1.5, air: 0.9, height: 5,
    desc: '遠くまで飛ぶ。飛んでいる間は攻撃を受けない。',
  },
  blackhole: {
    name: '特異点', en: 'SINGULARITY', aim: 'ground', kind: 'field', icon: 'field', cd: 10,
    tele: 0.1, range: 9, aoe: 4, dur: 4, dps: 30, pullIn: 6, slowIn: true,
    desc: '4秒間の重力の穴を置く。中の相手は中心へ引かれ、スロウになり削られ続ける。',
  },
  fallingstar: {
    name: '流星', en: 'FALLING STAR', aim: 'ground', kind: 'blast', icon: 'blast', cd: 2, ult: true,
    tele: 0.1, range: 10, aoe: 5, delay: 0.9, dmg: 150, stun: 1.2, kb: 6,
    desc: '【必殺技】指定地点に星を落とす。巻き込んだ相手をスタンさせる。',
  },
  // ---- DARK SORCERER: it only gets worse for them ----------------------------
  balefulstrike: {
    name: '魔力の一撃', en: 'BALEFUL STRIKE', aim: 'line', kind: 'shot', icon: 'shot', cd: 3.5,
    tele: 0.35, range: 12, speed: 36, radius: 0.85, dmg: 38, kb: 3, tumble: 0.1, permHit: 30,
    desc: '弾を撃つ。当てるたびに魔力が1溜まる。',
  },
  darkmatter: {
    name: '暗黒物質', en: 'DARK MATTER', aim: 'ground', kind: 'blast', icon: 'blast', cd: 7,
    range: 10, aoe: 2.9, delay: 0.9, dmg: 90,
    desc: '0.9秒後、指定地点に暗黒物質が落ちる。',
  },
  horizon: {
    name: '事象の地平', en: 'EVENT HORIZON', aim: 'ground', kind: 'field', icon: 'trap', cd: 14,
    range: 9, aoe: 4.2, dur: 3, cage: 1.4, arm: 0.5, dmg: 10,
    desc: '3秒間の輪を置く。輪の縁に触れた相手を1.4秒スタンさせる。',
  },
  primordial: {
    name: '原初の爆発', en: 'PRIMORDIAL BURST', aim: 'self', kind: 'strike', icon: 'star', cd: 2, ult: true,
    need: 'range', range: 9, dmg: 105, exec: 1.0,
    desc: '【必殺技】近くの相手に必中の魔弾を撃つ。相手の回転が少ないほど威力が上がる（最大2倍）。',
  },
  // ---- VAULT BREAKER: straight in --------------------------------------------
  vault: {
    name: 'ヴォルトブレイカー', en: 'VAULT BREAKER', aim: 'dash', kind: 'dash', icon: 'dash', cd: 8,
    tele: 0.45, dist: 9, minDist: 4, speed: 40, dmg: 38, keep: 0.6, kb: 12,
    desc: '長い突進。当てると大ダメージと強いノックバック。',
  },
  blastshield: {
    name: 'ブラストシールド', en: 'BLAST SHIELD', aim: 'self', kind: 'buff', icon: 'shield', cd: 10,
    shield: 75, hold: 3,
    desc: '3秒間のバリアを張る。',
  },
  relentless: {
    name: '連打', en: 'RELENTLESS FORCE', aim: 'self', kind: 'buff', icon: 'buff', cd: 6,
    empower: 5, bonus: 26, kb: 6,
    desc: '5秒間、次の体当たりを強化する。クールダウンが短い。',
  },
  cease: {
    name: '強制執行', en: 'CEASE AND DESIST', aim: 'self', kind: 'strike', icon: 'star', cd: 2, ult: true,
    need: 'range', range: 9, tp: true, dmg: 115, up: 1.0,
    desc: '【必殺技】近くの相手へ一瞬で詰め寄り、打ち上げる。',
  },
  // ---- ARCANE SHOOTER: land the shot, get everything back --------------------
  mystic: {
    name: 'ミスティックショット', en: 'MYSTIC SHOT', aim: 'line', kind: 'shot', icon: 'shot', cd: 3,
    tele: 0.35, range: 15, speed: 44, radius: 0.7, dmg: 38, kb: 3, tumble: 0.1, refund: 1,
    desc: '弾を撃つ。当てると、すべてのスキルのクールダウンが1秒縮む。',
  },
  flux: {
    name: 'エッセンスフラックス', en: 'ESSENCE FLUX', aim: 'line', kind: 'shot', icon: 'orb', cd: 8,
    tele: 0.4, range: 13, speed: 36, radius: 0.9, dmg: 18, mark: 4,
    desc: '印を付ける弾。印は次のスキルが当たると炸裂する。',
  },
  arcshift: {
    name: 'アーケインシフト', en: 'ARCANE SHIFT', aim: 'blink', kind: 'blink', icon: 'blink', cd: 9,
    range: 6, speed: 40, bolt: 'arcbolt', n: 1,
    desc: '瞬間移動し、移動先から相手を自動で狙う弾を撃つ。',
  },
  arcbolt: {
    name: '魔弾', en: 'ARCANE BOLT', aim: 'line', hidden: true,
    range: 11, speed: 34, radius: 0.6, dmg: 32, kb: 2, tumble: 0, launch: 0,
  },
  trueshot: {
    name: 'トゥルーショット', en: 'TRUESHOT BARRAGE', aim: 'line', kind: 'shot', icon: 'beam', cd: 2, ult: true,
    tele: 0.5, range: 40, speed: 34, radius: 2, dmg: 150, pierce: true,
    desc: '【必殺技】アリーナを横断する太い光波を放つ。',
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
