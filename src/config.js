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
    atk: 1.56, def: 1.16, mass: 0.95, speed: 15.5, decay: 6.6, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 5, def: 2, sta: 2, spd: 5 },
    desc: '風を溜めて竜巻で打ち上げ、空中の相手に必殺技を叩き込む。',
  },
  nox: {
    id: 'nox', kit: { Q: 'shuriken', W: 'shadow', E: 'slash', R: 'deathmark' },
    name: 'ノクス・シェイド', en: 'NOX SHADE', type: 'ATTACK', typeJa: 'アタック',
    color: 0x7a86a8, css: '#7a86a8', teeth: 3,
    atk: 1.5, def: 1.04, mass: 0.95, speed: 15.5, decay: 6.6, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
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
    atk: 1.28, def: 1.15, mass: 1.15, speed: 12.5, decay: 5.5, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 3, def: 4, sta: 4, spd: 2 },
    egg: { dur: 3, hp: 150, back: 0.3 },
    desc: '凍らせてから氷柱で砕く。氷の壁と吹雪で動きを縛る。1ラウンドに1度、回転が尽きても卵になり、3秒耐えれば復活する。',
  },
  edge: {
    id: 'edge', kit: { Q: 'brokenwings', W: 'kiburst', E: 'valor', R: 'exile' },
    name: 'ブロークン・エッジ', en: 'BROKEN EDGE', type: 'ATTACK', typeJa: 'アタック',
    color: 0x2ee6c0, css: '#2ee6c0', teeth: 3,
    atk: 1.15, def: 1.0, mass: 1.05, speed: 15, decay: 6.8, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 4, def: 3, sta: 2, spd: 4 },
    buff: { atk: 1.2 },
    desc: '小刻みな突進をつないで張り付き、弱った相手を斬撃で仕留める。',
  },
  mirage: {
    id: 'mirage', kit: { Q: 'sigil', W: 'distort', E: 'ethereal', R: 'mimic' },
    name: 'ミラージュ・トリック', en: 'MIRAGE TRICK', type: 'ATTACK', typeJa: 'アタック',
    color: 0xb06bff, css: '#b06bff', teeth: 5,
    atk: 1.48, def: 1.06, mass: 0.92, speed: 15.5, decay: 6.2, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 4, def: 2, sta: 2, spd: 5 },
    buff: { atk: 1.4 },
    ghostRet: true,
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
    atk: 0.95, def: 1.02, mass: 1.2, speed: 14.5, decay: 5.6, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 2, def: 4, sta: 5, spd: 3 },
    buff: { speed: 1.3, armor: 0.8, regen: 8 },
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
    atk: 1.02, def: 1.15, mass: 1.3, speed: 12.5, decay: 5.9, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 3, def: 5, sta: 3, spd: 2 },
    pin: { dmg: 40, stun: 2 },
    desc: '相手を壁へ押し込んでスタンさせ、突進してくる相手は陣で止める。溜めた必殺技は相手をほぼ場外まで吹き飛ばす。',
  },
  fox: {
    id: 'fox', kit: { Q: 'orb', W: 'foxfire', E: 'charm', R: 'rush' },
    name: 'ナインテイル・チャーム', en: 'NINE TAIL CHARM', type: 'ATTACK', typeJa: 'アタック',
    color: 0xff8fd0, css: '#ff8fd0', teeth: 5,
    atk: 1.34, def: 1.0, mass: 0.94, speed: 15.5, decay: 6.4, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
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
    grey: { rate: 45 },
    desc: '溜めて伸ばす銛で引き寄せ、弱った相手を必殺技で「処刑」する。',
  },
  barrel: {
    id: 'barrel', kit: { Q: 'cask', W: 'drunk', E: 'bodyslam', R: 'bigkeg' },
    name: 'バレル・ブルーザー', en: 'BARREL BRUISER', type: 'DEFENSE', typeJa: 'ディフェンス',
    color: 0xc97a3a, css: '#c97a3a', teeth: 6,
    atk: 0.94, def: 1.1, mass: 1.35, speed: 12.5, decay: 5.8, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 3, def: 4, sta: 4, spd: 2 },
    buff: { armor: 0.8 },
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
    atk: 1.25, def: 1.25, mass: 1.3, speed: 12.5, decay: 5.4, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 4, def: 4, sta: 4, spd: 1 },
    store: { taken: 0.15, dealt: 0.45, max: 140, fade: 4 },
    // DARKNESS RISE: three blows in a row (each within `keep` of the last) light an aura for `dur`,
    // kept alight by every blow after; it burns whatever is within `r` and quickens its owner.
    aura: { hits: 3, keep: 4, dur: 4, r: 3.4, dps: 18, speed: 1.09 },
    desc: '攻撃を3回続けて当てると4秒間オーラをまとい、少し速くなって周囲の相手を焼き続ける（当て続けるかぎり消えない）。与えたダメージを蓄えてバリアに変える。必殺技は相手ひとりを冥界に連れ去り、1対1に閉じ込める。',
  },
  dragon: {
    id: 'dragon', kit: { Q: 'sonicwave', W: 'safeguard', E: 'tempest', R: 'dragonrage' },
    name: 'ドラゴン・ストライカー', en: 'DRAGON STRIKER', type: 'ATTACK', typeJa: 'アタック',
    color: 0xff5a3c, css: '#ff5a3c', teeth: 3,
    atk: 1.08, def: 0.98, mass: 1.0, speed: 15.5, decay: 6.9, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 5, def: 3, sta: 2, spd: 5 },
    buff: { leech: 0.26 },
    desc: '弾を当てて飛びつき、相手の裏へ回り込んで場外へ蹴り出す。',
  },
  boss: {
    id: 'boss', kit: { Q: 'knuckle', W: 'haymaker', E: 'facebreaker', R: 'showstopper' },
    name: 'ブロウラー・キング', en: 'BRAWLER KING', type: 'DEFENSE', typeJa: 'ディフェンス',
    color: 0xf0a060, css: '#f0a060', teeth: 4,
    atk: 0.88, def: 1.0, mass: 1.3, speed: 13, decay: 6.0, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 4, def: 4, sta: 3, spd: 2 },
    store: { taken: 1, dealt: 0, max: 110, fade: 10 },
    desc: '受けたダメージを「闘魂」として溜め、拳とバリアにして返す。必殺技は相手を掴んで叩きつける。',
  },
  pirate: {
    id: 'pirate', kit: { Q: 'parrrley', W: 'orange', E: 'keg', R: 'barrage' },
    name: 'パウダー・キャプテン', en: 'POWDER CAPTAIN', type: 'ATTACK', typeJa: 'アタック',
    color: 0xd96a1e, css: '#d96a1e', teeth: 5,
    atk: 1.4, def: 1.08, mass: 1.0, speed: 13.5, decay: 5.9, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 4, def: 3, sta: 3, spd: 3 },
    desc: '火薬樽を並べ、撃って誘爆させる。必殺技はアリーナのどこにでも砲撃を降らせる。',
  },
  ash: {
    id: 'ash', kit: { Q: 'nails', W: 'ignition', E: 'pursuit', R: 'purgatory' },
    name: 'アッシュ・エクソシスト', en: 'ASHEN EXORCIST', type: 'ATTACK', typeJa: 'アタック',
    color: 0xb8b0a8, css: '#b8b0a8', teeth: 3,
    atk: 1.2, def: 0.94, mass: 0.95, speed: 15.5, decay: 6.9, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 5, def: 2, sta: 2, spd: 5 },
    nailPop: [20, 45, 80],
    doom: { line: 0.12, per: 0.005, max: 12 },
    ignite: { pay: 0.02, bonus: 30 },
    store: { taken: 1, dealt: 0, max: 120, fade: 0, whileBuff: true },
    desc: '釘を刺して鈍らせ、弱った相手を封印具で処刑する。',
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
    id: 'canvas', kit: { Q: 'subjdisaster', W: 'subjserenity', E: 'subjtorment', R: 'despair' }, painter: true,
    name: 'ヴィジョン・ペインター', en: 'VISION PAINTER', type: 'STAMINA', typeJa: 'スタミナ',
    color: 0x7f7bff, css: '#7f7bff', teeth: 5,
    atk: 1.46, def: 1.1, mass: 0.96, speed: 13.5, decay: 5.4, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 3, def: 2, sta: 5, spd: 3 },
    desc: 'Q・W・Eで題材（厄災・静謐・苦悩）を選び、もう一度Q・W・Eを押して技を出す。3×3で9つの技を使い分ける。Rは題材を選んでいる間は取り消し、選んでいなければ必殺技。',
  },
  star: {
    id: 'star', kit: { Q: 'paddle', W: 'thief', E: 'bubble', R: 'portal' },
    name: 'トワイライト・スター', en: 'TWILIGHT STAR', type: 'ATTACK', typeJa: 'アタック',
    color: 0xffb38a, css: '#ffb38a', teeth: 5,
    atk: 1.4, def: 1.05, mass: 0.92, speed: 15.5, decay: 6.4, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 5, def: 1, sta: 2, spd: 5 },
    desc: '打ち直して遠くから当てるほど痛い星と、時間差で眠らせる泡。Rは1秒だけ別の場所から撃つための瞬間移動で、ゲージの必殺技は持たない。',
  },
  spark: {
    id: 'spark', kit: { Q: 'burstfire', W: 'ultrashock', E: 'surge', R: 'crash' },
    name: 'スパーク・サージ', en: 'SPARK SURGE', type: 'ATTACK', typeJa: 'アタック',
    color: 0xd8ff3a, css: '#d8ff3a', teeth: 4,
    atk: 1.1, def: 1.0, mass: 0.92, speed: 16, decay: 6.6, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 4, def: 2, sta: 2, spd: 5 },
    buff: { speed: 1.15, atk: 1.15, extendTo: 5 },
    desc: 'Qを押しっぱなしにして小さな弾を浴びせ続ける連射型。必殺技で過充電に入る。',
  },
  plume: {
    id: 'plume', kit: { Q: 'daggers', W: 'plumage', E: 'bladecaller', R: 'storm' },
    name: 'フェザー・ストーム', en: 'FEATHER STORM', type: 'ATTACK', typeJa: 'アタック',
    color: 0xd03a8c, css: '#d03a8c', teeth: 5,
    atk: 1.32, def: 1.0, mass: 0.95, speed: 14.5, decay: 6.4, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 5, def: 2, sta: 3, spd: 4 },
    plume: 'plumeshot',
    desc: '投げた羽根は床に残り、呼び戻すと相手を背後から切り裂く。3枚当てると動けなくする。',
  },
  darkin: {
    id: 'darkin', kit: { Q: 'darkinblade', W: 'chains', E: 'umbral', R: 'worldender' },
    name: 'ワールド・エンダー', en: 'WORLD ENDER', type: 'ATTACK', typeJa: 'アタック',
    color: 0xc81e3c, css: '#c81e3c', teeth: 3,
    atk: 1.6, def: 1.32, mass: 1.15, speed: 13.5, decay: 5.8, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 5, def: 3, sta: 3, spd: 3 },
    buff: { atk: 1.3, speed: 1.2, leech: 0.3 },
    desc: '形の違う3連の大剣を、剣先で当てていく剣士。必殺技の間は攻撃も速度も上がり、与えたダメージで回復する。',
  },
  rose: {
    id: 'rose', kit: { Q: 'flair', W: 'whirl', E: 'wildrush', R: 'inferno' },
    name: 'スタイル・ランカー', en: 'STYLE RANKER', type: 'ATTACK', typeJa: 'アタック',
    color: 0xe8566a, css: '#e8566a', teeth: 4,
    atk: 1.25, def: 0.98, mass: 0.98, speed: 15.5, decay: 6.6, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 5, def: 2, sta: 2, spd: 5 },
    style: { max: 6, keep: 8, speed: 0.035, ranks: ['E', 'D', 'C', 'B', 'A', 'S'] },
    desc: '直前と違う攻撃（体当たり・射撃・斬り・爆撃・W・E）を当てるたびにスタイルのランクが上がり、足が速くなる。ランクSまで上げるとRが撃てる。ゲージの必殺技は持たない。',
  },
  glaive: {
    id: 'glaive', kit: { Q: 'darkglaive', W: 'dreaded', E: 'aureate', R: 'grim' },
    name: 'アンサンダード・グレイヴ', en: 'UNSUNDERED GLAIVE', type: 'DEFENSE', typeJa: 'ディフェンス',
    color: 0xe8b84a, css: '#e8b84a', teeth: 4,
    atk: 0.76, def: 0.9, mass: 1.2, speed: 13.5, decay: 7.4, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 4, def: 4, sta: 4, spd: 2 },
    ramp: { per: 0.008, max: 12, expire: 5 },
    egg: { dur: 3, hp: 150, back: 0.5, needStack: 12 },
    desc: '攻撃を当て続けるほど強くなる（5秒当てないと消える）。12回ぶん溜まった状態なら、回転が尽きても一度だけ復活する。',
  },
  lunar: {
    id: 'lunar', kit: { Q: 'arsenal', W: 'phase', E: 'nextweapon', R: 'vigil' },
    name: 'ルナ・アーセナル', en: 'LUNAR ARSENAL', type: 'ATTACK', typeJa: 'アタック',
    color: 0x8fb8ff, css: '#8fb8ff', teeth: 4,
    atk: 1.28, def: 1.02, mass: 0.94, speed: 13.5, decay: 6.2, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 5, def: 1, sta: 3, spd: 3 },
    desc: '5つの武器のうち2つを持ち、主と副を持ち替えながら戦う。撃ち切った武器は次の武器に入れ替わり、ラウンドをまたいで持ち越す。Eのスキルは無い。',
  },
  cosmos: {
    id: 'cosmos', kit: { Q: 'breath', W: 'flight', E: 'blackhole', R: 'fallingstar' },
    name: 'スターフォージ', en: 'STAR FORGER', type: 'STAMINA', typeJa: 'スタミナ',
    color: 0x5a6cff, css: '#5a6cff', teeth: 6,
    atk: 1.1, def: 1.0, mass: 1.05, speed: 13, decay: 5.6, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 3, def: 3, sta: 5, spd: 2 },
    desc: '息吹を吐き続け、重力の穴に引き込み、星を落とす。当てるほど星屑が溜まり、技が大きくなる。',
  },
  hex: {
    id: 'hex', kit: { Q: 'balefulstrike', W: 'darkmatter', E: 'horizon', R: 'primordial' },
    name: 'ダーク・ソーサラー', en: 'DARK SORCERER', type: 'STAMINA', typeJa: 'スタミナ',
    color: 0x9a4aff, css: '#9a4aff', teeth: 5,
    atk: 1.28, def: 1.06, mass: 0.94, speed: 13.5, decay: 5.4, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 3, def: 2, sta: 4, spd: 3 },
    permDmg: 0.02,
    desc: 'Qを当てるたびに魔力が溜まり、与えるダメージが2%ずつ上がる（最大30回）。魔力は次のラウンドにも持ち越す。',
  },
  gauntlet: {
    id: 'gauntlet', kit: { Q: 'vault', W: 'denting', E: 'relentless', R: 'cease' },
    name: 'ヴォルト・ブレイカー', en: 'VAULT BREAKER', type: 'ATTACK', typeJa: 'アタック',
    color: 0xff4f9a, css: '#ff4f9a', teeth: 3,
    atk: 0.86, def: 0.98, mass: 1.15, speed: 14.5, decay: 6.8, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 5, def: 3, sta: 3, spd: 4 },
    dent: { dmg: 16, shred: 1.2, dur: 4, window: 3 },
    desc: '溜めた突進で殴り込み、3発ごとに相手を凹ませる。必殺技は離れた相手に一瞬で詰め寄り、打ち上げる。',
  },
  arcane: {
    id: 'arcane', kit: { Q: 'mystic', W: 'flux', E: 'arcshift', R: 'trueshot' },
    name: 'アーケイン・シューター', en: 'ARCANE SHOOTER', type: 'ATTACK', typeJa: 'アタック',
    color: 0x6ae0ff, css: '#6ae0ff', teeth: 4,
    atk: 1.58, def: 1.1, mass: 0.92, speed: 15, decay: 5.9, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 5, def: 1, sta: 2, spd: 4 },
    desc: 'Qを当てるほど他のスキルが早く戻ってくる。当て続けることが強さになる射撃型。',
  },
  magus: {
    id: 'magus', kit: { Q: 'arcanopulse', W: 'eyeofdestruction', E: 'shockorb', R: 'arcanerite' },
    name: 'メイガス・アセンダント', en: 'MAGUS ASCENDANT', type: 'ATTACK', typeJa: 'アタック',
    color: 0x5aa8ff, css: '#5aa8ff', teeth: 5,
    atk: 1.34, def: 1.0, mass: 0.94, speed: 13, decay: 6.0, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 5, def: 1, sta: 3, spd: 2 },
    desc: '溜めて伸ばす光線、中心が痛い落雷、遠いほど長く止める弾。必殺技はその場に構えて、アリーナのどこへでも砲撃を落とす。',
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
    desc: 'スキルのたびに回転を払い、噛んだ相手の出血で取り戻す。Wの間は自分では止まれず、一番近い相手へ勝手に突っ込み続ける。止める手段はEだけ。',
  },
  golem: {
    id: 'golem', kit: { Q: 'rocketgrab', W: 'overdrive', E: 'powerfist', R: 'staticfield' },
    name: 'スチーム・ゴーレム', en: 'STEAM GOLEM', type: 'DEFENSE', typeJa: 'ディフェンス',
    color: 0xf2b23a, css: '#f2b23a', teeth: 4,
    atk: 1.0, def: 1.12, mass: 1.3, speed: 12.5, decay: 5.7, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 3, def: 4, sta: 4, spd: 2 },
    lowShield: { at: 0.3, amount: 150, hold: 5 },
    desc: '腕を伸ばして手元まで引きずり込み、殴って打ち上げる。必殺技の放電は相手のバリアを消し、少しの間スキルを封じる。',
  },
  voideye: {
    id: 'voideye', kit: { Q: 'plasmafission', W: 'voidrift', E: 'tectonic', R: 'liferay' },
    name: 'ヴォイド・アイ', en: 'VOID EYE', type: 'ATTACK', typeJa: 'アタック',
    color: 0xb04cff, css: '#b04cff', teeth: 6,
    atk: 1.42, def: 1.04, mass: 0.94, speed: 13, decay: 6.0, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 5, def: 1, sta: 3, spd: 2 },
    decon: { n: 3, keep: 7, dmg: 42 },
    desc: '同じ相手にスキルを3回当てると、防御を無視して分解する。左右に分かれる弾、二度裂ける直線、カーソルを追う必殺の光線。',
  },
  purifier: {
    id: 'purifier', kit: { Q: 'piercinglight', W: 'ardentblaze', E: 'lightslide', R: 'culling' },
    name: 'ツイン・ピュリファイア', en: 'TWIN PURIFIER', type: 'ATTACK', typeJa: 'アタック',
    color: 0xf4f0d8, css: '#f4f0d8', teeth: 4,
    atk: 1.62, def: 1.12, mass: 0.96, speed: 15, decay: 6.0, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 5, def: 2, sta: 2, spd: 5 },
    dbl: { window: 3.5, mul: 0.6, cuts: 'lightslide', cut: 2 },
    desc: 'スキルのあとの体当たりは2回当たり、そのたびにEが早く戻る。撃って、ぶつかって、滑ってを繰り返す。',
  },
  weaver: {
    id: 'weaver', kit: { Q: 'threadedvolley', W: 'seismicshove', E: 'unraveled', R: 'weaverwall' },
    name: 'ストーン・ウィーバー', en: 'STONE WEAVER', type: 'STAMINA', typeJa: 'スタミナ',
    color: 0xc98a4a, css: '#c98a4a', teeth: 5,
    atk: 1.42, def: 1.02, mass: 0.96, speed: 13.5, decay: 6.0, spinMax: 1000, cdMul: 1.0, guardMul: 1.0,
    bars: { atk: 4, def: 2, sta: 3, spd: 3 },
    surf: 1.25,
    desc: '岩をまいた床へ、地面ごと相手を放り込む。攻撃を受けていなければ壁際で速くなり、必殺技の壁でアリーナを区切る。',
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
    desc: '15秒に一度、スタンや打ち上げを踏み倒す。そのとき近くに薬瓶が落ち、拾うと回転が少し戻って次の踏み倒しが早まる（相手に先に踏まれると消える）。受けたダメージを溜め込んで取り戻し、必殺技の間は回転がどんどん戻る。',
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
    range: 4.5, speed: 46, radius: 1.0, dmg: 42, kb: 4, tumble: 0.15, launch: 0, stacks: 2, keep: 8, ring: 3.2,
    desc: '短い突きを放つ。QかEを合わせて2回当てると、次の一撃が相手を打ち上げる長射程の竜巻になる。Eの突進中に使うと、突進の終わりに自分の周りを斬る（竜巻が溜まっていれば周りを打ち上げる）。',
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
    name: '颯歩', en: 'SWEEPING BLADE', aim: 'dash', cd: 6, tele: 0.35, re: 'sweep', reHit: 2, againMul: 1.25, fly: true,
    dist: 5.5, minDist: 5.5, speed: 36, through: true, pass: 36, slow: 0.4,
    desc: '相手をすり抜ける短い突進。すれ違いざまにダメージを与え、Qの風も溜まる。当てると2秒以内にもう一度だけ使え、2回目は25%強い。突進中にもスキルを使える。',
  },
  lastbreath: {
    name: '終の息吹', en: 'LAST BREATH', aim: 'self', cd: 2, ult: true, need: 'up',
    range: 15, dmg: 170, kb: 12, gap: 2.6,
    desc: '【必殺技】打ち上げ中の相手にだけ使える。瞬時に飛びつき、連撃して外側へ叩き落とす。',
  },
  // ---- NOX SHADE: strike from two places at once ------------------------------
  shuriken: {
    name: '影手裏剣', en: 'RAZOR SHURIKEN', aim: 'line', cd: 6, tele: 0.4,
    range: 7.5, speed: 36, radius: 0.8, dmg: 56, kb: 5, tumble: 0.2, pierce: true,
    desc: '貫通する手裏剣を投げる。影があれば、影からも同じ地点へ向けて投げる。',
  },
  shadow: {
    name: '影分身', en: 'LIVING SHADOW', aim: 'ground', cd: 16, re: 'swap',
    range: 6.5, aoe: 1.3, dur: 5, max: 2, fly: 26,
    desc: '狙った地点へ影を飛ばし、5秒留める。もう一度押すと影と位置を入れ替える。',
  },
  swap: { name: '影渡り', en: 'SHADOW SWAP', aim: 'self', hidden: true },
  markswap: { name: '影渡り', en: 'SHADOW SWAP', aim: 'self', hidden: true },
  slash: {
    name: '影薙ぎ', en: 'SHADOW SLASH', aim: 'self', cd: 3,
    aoe: 2.9, dmg: 34, kb: 4, tumble: 0.2, shadowSlow: 1.5, slowPct: 0.4, cut: 3,
    desc: '本体と影の周囲を同時に斬る。影の斬撃は40%のスロウ。当てるたびにWの待ち時間が3秒縮む。',
  },
  deathmark: {
    name: '死の刻印', en: 'DEATH MARK', aim: 'self', cd: 2, ult: true, need: 'range', re: 'markswap', window: 5,
    range: 10, gap: 2.6, dur: 3, pop: 80, share: 0.5, air: 0.75, height: 0,
    desc: '【必殺技】影に沈んで攻撃をかわし、相手の背後に現れて刻印を付ける。元いた場所に影が残り、もう一度押すと入れ替わって戻れる。3秒間に与えたダメージの50%が最後にまとめて炸裂する。',
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
    name: '致命の一閃', en: 'DEADLY FLOURISH', aim: 'line', cd: 12, tele: 0.45,
    range: 24, speed: 60, radius: 0.6, dmg: 44, root: 2.25, markT: 4,
    desc: 'アリーナの端まで届く細い弾を撃つ。直前4秒に自分の攻撃が当たっていれば、相手を2.25秒その場に縛る（スキルは使われる）。',
  },
  lotus: {
    name: '蓮の罠', en: 'LOTUS TRAP', aim: 'ground', cd: 2, stock: { max: 2, every: 14 },
    range: 7.5, aoe: 3, trig: 1.7, arm: 1, fuse: 2, dur: 25, max: 3, dmg: 66, slowPct: 0.35, kb: 5,
    desc: '見えにくい罠を置く。踏まれると35%スロウの領域になり、2秒後に爆発する。2個ぶん溜めておける（14秒で1個ぶん戻る）。',
  },
  curtaincall: {
    name: '終幕', en: 'CURTAIN CALL', aim: 'self', cd: 2, ult: true, re: 'curtainfire', stance: true,
    range: 26, half: Math.PI, shots: 4, first: 0.5, every: 0.7, window: 10,
    desc: '【必殺技】その場で構える。そのあとRを押すたびに、どの方向へでも狙った向きに超長射程弾を1発（最大4発、10秒以内）。当たると80%のスロウ。相手の回転が減っているほど重く、最後の一発は2倍。',
  },
  curtainfire: { name: '終幕', en: 'CURTAIN CALL', aim: 'line', hidden: true, fire: true, range: 26, radius: 1.0 },
  curtainshot: {
    name: '終幕', en: 'CURTAIN CALL', aim: 'line', hidden: true,
    range: 30, speed: 46, radius: 1.0, dmg: 34, kb: 7, slow: 0.5, slowPct: 0.8, exec: 3,
  },
  curtainlast: {
    name: '終幕', en: 'CURTAIN CALL', aim: 'line', hidden: true,
    range: 30, speed: 46, radius: 1.4, dmg: 68, kb: 15, slow: 0.5, slowPct: 0.8, exec: 3,
  },
  // ---- FROST PHOENIX: walls, chill and a second life ----------------------------
  flashfrost: {
    name: 'フラッシュフロスト', en: 'FLASH FROST', aim: 'line', cd: 7, tele: 0.3, re: 'shatter',
    range: 8.65, speed: 9.5, radius: 1.2, dmg: 32, slow: 3, slowPct: 0.3, frost: 3, pierce: true,
    desc: 'ゆっくり進む氷塊を撃ち、触れた相手をスロウにして凍らせる。もう一度押すとその場で炸裂し、周囲をスタンさせる。',
  },
  shatter: {
    name: 'フラッシュフロスト・炸裂', en: 'SHATTER', aim: 'self', hidden: true,
    aoe: 3.3, dmg: 52, stun: 1.5, slow: 3, slowPct: 0.3, frost: 3,
  },
  icewall: {
    name: 'アイスウォール', en: 'CRYSTALLIZE', aim: 'ground', cd: 17,
    range: 10, wall: 5, aoe: 5, dur: 5, solid: true,
    desc: '狙った地点に幅の広い氷の壁を5秒作る。コマも飛び道具も通れない。相手の真上に置くと押しのける。',
  },
  frostbite: {
    name: 'フロストバイト', en: 'FROSTBITE', aim: 'line', cd: 4, tele: 0.35,
    range: 4.8, speed: 30, radius: 0.8, dmg: 40, kb: 3, tumble: 0.1, frostMul: 2,
    desc: '短射程の氷柱。凍っている相手には2倍のダメージ。',
  },
  blizzard: {
    name: 'ブリザード', en: 'GLACIAL STORM', aim: 'ground', cd: 2, ult: true,
    range: 7.5, aoe: 4.6, r0: 2.6, grow: 1.5, dur: 6, dps: 20, frost: 3,
    desc: '【必殺技】1.5秒かけて広がる吹雪を6秒起こす。中の相手はスロウになり削られ続ける。広がりきると威力が3倍になり、スロウが強まり、相手を凍らせる。',
  },
  // ---- BROKEN EDGE: short dashes, then the finishing cut ------------------------
  brokenwings: {
    name: '折れた翼', en: 'BROKEN WINGS', aim: 'dash', cd: 13, tele: 0.3, re: 'brokenwings',
    dist: 2.75, minDist: 2.75, speed: 30, dmg: 26, keep: 0.3, kb: 5, window: 4, aoe: 2.9, slam: 36, slamUp: 0.75,
    desc: '斬りながら短く踏み込む。4秒以内なら3回まで続けて使え、3回目は跳んで周囲を打ち上げる。',
  },
  kiburst: {
    name: '気功破', en: 'KI BURST', aim: 'self', cd: 7,
    aoe: 3.2, dmg: 30, stun: 0.75,
    desc: '周囲の相手を0.75秒スタンさせる。',
  },
  valor: {
    name: '勇躍', en: 'VALOR', aim: 'dash', cd: 6,
    dist: 2.5, minDist: 2.5, speed: 32, dmg: 8, keep: 0.3, kb: 4, shield: 80, hold: 1.5,
    desc: '短く踏み込み、1.5秒間ダメージを肩代わりするバリアを張る。',
  },
  exile: {
    name: '追放者の剣', en: 'BLADE OF THE EXILE', aim: 'self', cd: 2, ult: true, re: 'windslash',
    dur: 10,
    desc: '【必殺技】10秒間、与えるダメージが20%上がる。その間にもう一度押すと扇状の衝撃波を飛ばし、相手の回転が少ないほど大ダメージ（最大3倍）。',
  },
  windslash: {
    name: 'ウィンドスラッシュ', en: 'WIND SLASH', aim: 'cone', hidden: true,
    range: 7.2, half: 0.3, speed: 36, radius: 0.9, dmg: 46, kb: 9, exec: 2, fan: 3,
  },
  // ---- MIRAGE TRICK: in, out, and once more ---------------------------------------
  sigil: {
    name: 'シジルマリス', en: 'SIGIL OF MALICE', aim: 'line', cd: 6, tele: 0.38,
    range: 5.3, speed: 36, radius: 0.8, dmg: 40, kb: 3, tumble: 0.1, mark: 3.5, pop: 46,
    desc: '弾を当てて3.5秒間の印を付ける。印は次に自分のスキルが当たると炸裂する。',
  },
  distort: {
    name: 'ディストーション', en: 'DISTORTION', aim: 'dash', cd: 10, tele: 0.3, re: 'recall',
    dist: 6, minDist: 3, speed: 38, through: true, aoe: 2.9, dmg: 50, kb: 6, tumble: 0.25, window: 4,
    desc: 'その場に鏡像を残して跳び、着地点の周囲にダメージ。4秒以内にもう一度押すと鏡像の場所へ戻る。',
  },
  recall: { name: 'ゆがみ・帰還', en: 'RETURN', aim: 'self', hidden: true },
  ethereal: {
    name: 'エーテルチェイン', en: 'ETHEREAL CHAINS', aim: 'line', cd: 11, tele: 0.42,
    range: 7.55, speed: 32, radius: 0.8, dmg: 24, tie: 'CHAINED', dur: 1.5, safe: 7, breakRange: 9.9, pop: 54, snareT: 1.5,
    desc: '鎖でつなぐ。1.5秒のあいだ引きちぎられなければ、相手をその場に縛り付ける。',
  },
  mimic: {
    name: '再演', en: 'MIMIC', aim: 'self', cd: 2, ult: true,
    dur: 2.8,
    desc: '【必殺技】直前に使ったスキルを、威力を40%上げてもう一度使う。印の弾を再演すると、その印は2倍の威力で炸裂する。跳躍を再演した場合は、それ専用の鏡像へ戻れる。',
  },
  // ---- GUILLOTINE LORD: bleed them, then end it ------------------------------------
  decimate: {
    name: '皆殺しの斧', en: 'DECIMATE', aim: 'self', cd: 5,
    charge: 0.75, aoe: 4.85, inner: 3.3, dmg: 54, weak: 19, heal: 0.17, bleed: 1,
    desc: '0.75秒溜めて周囲を斬る。刃（外周）で当てると大ダメージで、減った回転の17%を取り戻す。柄（内側）はダメージが65%減る。出血を付ける。',
  },
  cripple: {
    name: '脚削ぎ', en: 'CRIPPLING STRIKE', aim: 'self', cd: 5,
    empower: 4, bonus: 30, kb: 6, slow: 1, slowPct: 0.9, bleed: 1,
    desc: '4秒間、次の体当たりを強化する。当てると1秒間90%のスロウと出血を付ける。',
  },
  apprehend: {
    name: '捕縛', en: 'APPREHEND', aim: 'cone', cd: 16, tele: 0.35,
    range: 5.35, half: 0.5, dmg: 20, pull: 17, slow: 2, bleed: 1,
    desc: '扇の中の相手を手前へ引き寄せ、2秒間スロウにする。出血を付ける。',
  },
  guillotine: {
    name: 'ノクサスギロチン', en: 'NOXIAN GUILLOTINE', aim: 'dash', cd: 2, ult: true, tele: 0.4,
    dist: 9.5, minDist: 4, speed: 38, dmg: 80, kb: 12, perBleed: 0.2, trueDmg: true,
    desc: '【必殺技】狙った方向へ突進し、当たった相手を断つ。相手の防御を無視し、出血1スタックにつき威力が20%上がる（最大2倍）。',
  },
  // ---- VENOM TRAIL: make them chase you ---------------------------------------------
  poison: {
    name: '毒の軌跡', en: 'POISON TRAIL', aim: 'self', cd: 1,
    cost: 0, every: 0.3, aoe: 1.4, dur: 3.25, dps: 18, linger: 2,
    desc: '切り替え式。オンの間、通った跡を毒の床にする。触れた相手は2秒間毒を受ける。',
  },
  glue: {
    name: '強力粘着剤', en: 'MEGA ADHESIVE', aim: 'ground', cd: 13,
    range: 10, aoe: 3.5, dur: 3, slowPct: 0.7,
    desc: '粘着床を3秒置く。中の相手は70%のスロウになり、突進・瞬間移動・跳躍が使えない。',
  },
  fling: {
    name: 'すくい投げ', en: 'FLING', aim: 'self', cd: 8, need: 'range',
    range: 3.6, dist: 5.5, air: 0.55, height: 3.2, dmg: 46, snare: 2,
    desc: '密着した相手を自分の背後へ放り投げる。粘着床に落とすと、その場に縛り付ける。',
  },
  insanity: {
    name: '狂人のポーション', en: 'INSANITY POTION', aim: 'self', cd: 2, ult: true,
    dur: 10,
    desc: '【必殺技】10秒間、移動速度が上がり、被ダメージが減り、回転が回復し続ける。',
  },
  // ---- TURRET ENGINEER: hold ground with machines ------------------------------------
  turret: {
    name: '砲台設置', en: 'H-28G TURRET', aim: 'ground', cd: 1, big: true, stock: { max: 3, every: 14 },
    range: 3.5, aoe: 1.1, dur: 40, bigDur: 8, max: 4, cap: 3, reach: 10.5, rate: 0.9, dmg: 20, bigDmg: 38,
    leash: 10, idle: 8, laserEvery: 90,
    desc: '相手を自動で撃つ砲台をすぐそばに置く（最大3基）。3基ぶん溜めておける（14秒で1基ぶん戻る）。Wを当てるとレーザーが溜まり、Eを当てると全基がすぐレーザーを撃つ。離れすぎて8秒経つと止まる。体当たりされると壊れる。',
  },
  turretlaser: { name: 'レーザー', en: 'LASER', aim: 'line', hidden: true, range: 10, radius: 0.6, dmg: 34 },
  biglaser: { name: 'レーザー', en: 'LASER', aim: 'line', hidden: true, range: 10, radius: 0.9, dmg: 60 },
  bigshot: { name: '大型砲台', en: 'APEX TURRET', aim: 'line', hidden: true, range: 11, speed: 28, radius: 0.8, dmg: 13, kb: 1.5, tumble: 0, launch: 0, slow: 1, slowPct: 0.25 },
  turretshot: {
    name: '砲台', en: 'TURRET', aim: 'line', hidden: true,
    range: 11, speed: 28, radius: 0.5, dmg: 13, kb: 1.5, tumble: 0, launch: 0,
  },
  rockets: {
    name: 'マイクロロケット', en: 'MICRO-ROCKETS', aim: 'ground', cd: 7, tele: 0.35, big: true,
    range: 12, near: 3, aoe: 0.8, speed: 30, radius: 0.55, dmg: 44, next: 0.2, charge: 0.2, kb: 2, tumble: 0, launch: 0,
    fan: 5, spread: 0.9, volleys: 4, lag: 2.2,
    desc: '5発のロケットを撃つ。狙った地点で1つに集まり、そのまままっすぐ飛び続ける。1発目だけが重く、残りは軽い。',
  },
  grenade: {
    name: '電磁グレネード', en: 'CH-2 GRENADE', aim: 'ground', cd: 11, tele: 0.15, big: true,
    range: 8.8, aoe: 3, bigAoe: 4.3, delay: 0.55, core: 1.6, bigCore: 2.8, dmg: 56, bigDmg: 96, stun: 1.5, slow: 2, slowPct: 0.35, bigSlowPct: 0.8,
    bounces: 3, hop: 3.4,
    desc: '爆弾を投げる。中心で当てるとスタン、外側は35%のスロウ。当たると自分の砲台がすぐレーザーを撃つ。',
  },
  upgrade: {
    name: 'アップグレード!!!', en: 'UPGRADE!!!', aim: 'self', cd: 2, ult: true,
    dur: 10,
    desc: '【必殺技】10秒以内の次のQ・W・Eを強化する（8秒で自壊する大型砲台／4連射20発のロケット／3回跳ねて3回爆発するグレネード）。',
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
    speed: 36, dmg: 30, keep: 0.5, kb: 3, liftUp: 0.7, shield: 60, hold: 2, fly: true,
    cursor: true,
    desc: 'カーソルに一番近い砂兵へ突進する。途中で相手に当たると打ち上げ、バリアを得る。突進中にQで砂兵を動かすと、その砂兵を追いかけて飛び続ける。',
  },
  divide: {
    name: '皇帝の分砂嶺', en: "EMPEROR'S DIVIDE", aim: 'line', cd: 2, ult: true, tele: 0.3,
    range: 8, radius: 3.6, wall: 3.6, back: 1, travel: 7, speed: 22, hold: 4, dmg: 100, kb: 18, solid: true,
    desc: '【必殺技】背後から砂兵の壁が前進し、相手を強く押し出す。壁は4秒残り、自分だけ通り抜けられる。',
  },
  // ---- IRON HAMMER: walls are weapons ----------------------------------------
  hshock: {
    name: 'ハンマーショック', en: 'HAMMER SHOCK', aim: 'line', icon: 'beam', cd: 4, ai: 'cone',
    tele: 0.2, range: 4.3, radius: 1.3, half: 0.3, dmg: 34, slow: 1, slowPct: 0.32, delay: 1,
    desc: '目の前の地面を一直線に叩いてスロウにする。1秒後、同じ場所がもう一度爆発する。',
  },
  steadfast: {
    name: 'ステッドファスト', en: 'STEADFAST PRESENCE', aim: 'self', kind: 'field', icon: 'shield', cd: 12,
    follow: true, block: true, dur: 2, aoe: 4, dmg: 24, blockUp: 0.5, groundT: 2, slowPct: 0.25, haste: 2,
    desc: '2秒間加速し、自分の周りに陣を張る。陣に突進・瞬間移動で触れた相手を打ち上げ、2秒間スロウにして突進を封じる。',
  },
  hcharge: {
    name: 'ヒロイックチャージ', en: 'HEROIC CHARGE', aim: 'dash', kind: 'dash', icon: 'dash', cd: 10,
    tele: 0.4, dist: 4.75, minDist: 3, speed: 34, dmg: 30, kb: 14, carry: 0.9,
    desc: '突進して相手を進行方向へ押し出す。そのまま壁に叩きつけるとスタンと追加ダメージ。',
  },
  verdict: {
    name: '守護者の鉄鎚', en: "KEEPER'S VERDICT", aim: 'line', icon: 'beam', cd: 2, ult: true, ai: 'shot',
    tele: 0.2, wind: { min: 0.5, full: 1, max: 4 }, tap: 'verdicttap', near: 4, range: 9.5, speed: 40, radius: 1.6,
    desc: '【必殺技】長押しで溜める（溜め中は少し遅くなり、4秒で不発）。すぐ離すと目の前を打ち上げる。溜めるほど遠くまで届く衝撃波になり、当たった相手をほぼ場外まで吹き飛ばす。',
  },
  verdicttap: {
    name: '守護者の鉄鎚', en: "KEEPER'S VERDICT", aim: 'cone', hidden: true,
    range: 5, half: 0.6, dmg: 80, up: 1,
  },
  verdictwave: {
    name: '守護者の鉄鎚', en: "KEEPER'S VERDICT", aim: 'line', hidden: true,
    range: 9.5, speed: 40, radius: 1.6, dmg: 90, kb: 40, tumble: 0.9, launch: 3,
  },
  // ---- NINE TAIL CHARM: out, back, and three more times ----------------------
  orb: {
    name: '幻惑のオーブ', en: 'ORB OF DECEPTION', aim: 'line', kind: 'shot', icon: 'orb', cd: 7,
    tele: 0.35, range: 7.9, speed: 26, radius: 0.9, dmg: 32, pierce: true, ret: true, backTrue: true,
    desc: 'オーブが行って戻ってくる。往復とも当たり、戻りは相手の防御を無視する。',
  },
  foxfire: {
    name: 'フォックスファイア', en: 'FOX-FIRE', aim: 'self', icon: 'star', cd: 5,
    count: 3, dur: 2.5, wait: 0.35, orbit: 2.2, size: 0.5, seek: 8, bolt: 'foxbolt', haste: 2,
    desc: '3つの狐火をまとって加速する。狐火は近くの相手へ自動で飛んでいく。',
  },
  foxbolt: {
    name: '狐火', en: 'FOX-FIRE', aim: 'line', hidden: true,
    range: 10, speed: 30, radius: 0.5, dmg: 18, kb: 1.5, tumble: 0, launch: 0,
  },
  charm: {
    name: 'チャーム', en: 'CHARM', aim: 'line', kind: 'shot', icon: 'heart', cd: 12,
    tele: 0.4, range: 8, speed: 30, radius: 0.85, dmg: 30, charm: 1.8, slow: 1.8, slowPct: 0.65,
    desc: '当たった相手は1.8秒間、何もできずにゆっくりこちらへ歩いてくる。相手の突進も止める。',
  },
  rush: {
    name: 'スピリットラッシュ', en: 'SPIRIT RUSH', aim: 'dash', kind: 'dash', icon: 'dash', cd: 2, ult: true, re: 'rush',
    casts: 3, window: 10, dist: 4.5, minDist: 4.5, speed: 38, through: true, bolt: 'foxbolt', n: 1,
    desc: '【必殺技】相手をすり抜けて跳び、止まるたびに狐火を放つ。10秒以内なら3回まで使える。',
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
    desc: '5秒間加速する。受けたダメージの一部はゲージに灰色で残っていて、加速している間に戻ってくる。',
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
    range: 30, speed: 26, radius: 1.1, dmg: 44, stun: 1.25, pierce: true,
  },
  deathbelow: {
    name: '水底の急襲', en: 'DEATH FROM BELOW', aim: 'ground', icon: 'cross', cd: 2, ult: true,
    ai: 'blast', tele: 0.2, range: 7.5, aoe: 3.6, arm: 3.6, width: 0.95, delay: 0.5, dmg: 115, line: 0.2,
    desc: '【必殺技】指定地点をX字に断つ。X字の中に相手がいれば、その地点へ瞬時に移動する。回転が20%を切って印の付いた相手は即KO。',
  },
  // ---- BARREL BRUISER: throw them wherever you like --------------------------
  cask: {
    name: 'タル転がし', en: 'BARREL ROLL', aim: 'ground', kind: 'field', icon: 'blast', cd: 6, re: 'caskpop',
    range: 8.5, aoe: 3.75, dur: 4, ripen: 2, ripeMul: 0.5, endDmg: 44, endSlow: 2, endSlowPct: 0.6, ripeSlowPct: 0.9,
    desc: '樽を置く。置いて2秒かけて威力とスロウ（60%→90%）が増していく。4秒後か、もう一度押したときに爆発する。',
  },
  caskpop: { name: '起爆', en: 'DETONATE', aim: 'self', hidden: true, pops: 'cask' },
  drunk: {
    name: '飲みすぎ注意', en: 'DRUNKEN RAGE', aim: 'self', kind: 'buff', icon: 'buff', cd: 5,
    buff: 2.5, empower: 5, bonus: 30, kb: 7,
    desc: '2.5秒間、受けるダメージが減る。5秒間、次の体当たりを強化する。',
  },
  bodyslam: {
    name: 'ボディスラム', en: 'BODY SLAM', aim: 'dash', kind: 'dash', icon: 'dash', cd: 12,
    tele: 0.4, dist: 6, minDist: 3, speed: 32, dmg: 30, keep: 0.5, kb: 6, stun: 1, refundHit: 0.4,
    desc: '突進し、最初に当たった相手をスタンさせる。当てると、残りクールダウンの40%が戻る。',
  },
  bigkeg: {
    name: 'ワシの奢りじゃ！', en: 'EXPLOSIVE CASK', aim: 'ground', kind: 'blast', icon: 'blast', cd: 2, ult: true,
    tele: 0.15, range: 10, aoe: 4.4, delay: 0.5, dmg: 100, kb: 16, launch: 2,
    desc: '【必殺技】0.5秒後に爆発し、着弾点を中心に外向きへ大きく吹き飛ばす。奥に置けば手前へ、手前に置けば場外へ。',
  },
  // ---- CHRONO REWIND: undo the last four seconds -----------------------------
  timewinder: {
    name: 'タイムワインダー', en: 'TIMEWINDER', aim: 'line', kind: 'shot', icon: 'orb', cd: 7, tele: 0.35,
    range: 7, speed: 40, radius: 0.9, dmg: 46, pierce: true, ret: true, backMul: 1.4, crawl: 3, linger: 1.6, field: 2.4, fieldPct: 0.6,
    desc: '速く飛び、相手に当たるか射程の端で減速フィールドに変わってゆっくり進む。そのあと手元へ戻り、戻りでも当たる。',
  },
  parallel: {
    name: 'パラレルトラップ', en: 'PARALLEL CONVERGENCE', aim: 'ground', icon: 'field', cd: 14,
    ai: 'ground', range: 12, aoe: 3.6, arm: 3, reveal: 2.5, dur: 4.5, stun: 2.25, shield: 90,
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
    name: '破砕', en: 'OBLITERATE', aim: 'line', kind: 'beam', icon: 'blast', cd: 4,
    tele: 0.2, charge: 0.5, root: true, range: 5.6, radius: 1.3, dmg: 72, kb: 4,
    desc: '半秒振りかぶって、目の前へまっすぐメイスを叩きつける。',
  },
  indestructible: {
    name: '不壊', en: 'INDESTRUCTIBLE', aim: 'self', kind: 'buff', icon: 'shield', cd: 8, re: 'shieldheal', window: 4,
    storeShield: true, min: 30, max: 140, hold: 4,
    desc: '与えた・受けたダメージの蓄えを、4秒間のバリアに変える。その間にもう一度押すと、残ったバリアの45%を回転に変えて回復する。',
  },
  deathgrasp: {
    name: '死の掌握', en: "DEATH'S GRASP", aim: 'ground', kind: 'blast', icon: 'grab', cd: 8,
    tele: 0.2, range: 6.5, aoe: 2.3, delay: 0.5, dmg: 40, pull: 16,
    desc: '狙った場所に爪を呼び出す。半秒後、そこにいる相手を自分のほうへ引きずり込む。',
  },
  shieldheal: { name: '吸収', en: 'CONSUME', aim: 'self', hidden: true, heal: 0.45 },
  realm: {
    name: '死の領域', en: 'REALM OF DEATH', aim: 'self', icon: 'star', cd: 2, ult: true,
    need: 'range', range: 6.5, charge: 0.5, root: true, castSlow: 0.75, steal: 0.2,
    desc: '【必殺技】カーソルに一番近い相手を、0.5秒かけて冥界へ連れ去る。7秒間、輪の中に2人だけで閉じ込められ、どちらも外へ出られず、外の誰とも見えず触れ合えない。その間は相手の攻撃と防御を2割ずつ奪う（与えるダメージ1.5倍、受けるダメージ3分の2）。',
  },
  // The ring of the realm: `aoe` is how wide the two are shut in, `dur` for how long.
  realmz: { name: '死の領域', en: 'REALM OF DEATH', aim: 'ground', hidden: true, aoe: 7, dur: 7 },
  // ---- DRAGON STRIKER: mark, follow, kick out --------------------------------
  sonicwave: {
    name: '響掌', en: 'SONIC WAVE', aim: 'line', kind: 'shot', icon: 'shot', cd: 6,
    tele: 0.4, re: 'resonate', reOnHit: 3, range: 9.3, speed: 36, radius: 0.8, dmg: 34,
    desc: '衝撃波を飛ばす。当たったら3秒以内にもう一度押すと、相手へ飛びついて殴る（相手の回転が少ないほど強い）。',
  },
  resonate: {
    name: '共鳴撃', en: 'RESONATING STRIKE', aim: 'self', kind: 'strike', hidden: true,
    tp: true, dmg: 40, exec: 1.0,
  },
  safeguard: {
    name: '守りの型', en: 'SAFEGUARD', aim: 'self', kind: 'buff', icon: 'shield', cd: 7, re: 'ironwill',
    shield: 70, hold: 2, window: 3,
    desc: '2秒間バリアを張る。3秒以内にもう一度押すと、4秒間、与えたダメージの26%を回転として取り戻す。',
  },
  tempest: {
    name: '破風', en: 'TEMPEST', aim: 'self', kind: 'burst', icon: 'burst', cd: 8, re: 'cripplekick',
    aoe: 5.1, dmg: 36, reHit: 3,
    desc: '周囲に衝撃波を出す。当たったら3秒以内にもう一度押すと、相手を4秒間75%のスロウにする。',
  },
  dragonrage: {
    name: '龍の怒り', en: "DRAGON'S RAGE", aim: 'self', kind: 'kick', icon: 'beam', cd: 2, ult: true,
    need: 'range', grab: 5, dmg: 85, kb: 24, launch: 2.2,
    desc: '【必殺技】密着した相手を、自分から見て向こう側へ場外まで蹴り飛ばす。どこへ飛ばすかは自分の立ち位置で決まる。',
  },
  ironwill: { name: '鉄の意志', en: 'IRON WILL', aim: 'self', kind: 'buff', hidden: true, dur: 4 },
  cripplekick: { name: '縛脚', en: 'CRIPPLE', aim: 'self', kind: 'strike', hidden: true, need: 'range', grab: 6.3, dmg: 0, slow: 4, slowPct: 0.75 },
  // ---- BRAWLER KING: take it, then give it back ------------------------------
  knuckle: {
    name: 'ナックルダウン', en: 'KNUCKLE DOWN', aim: 'self', kind: 'buff', icon: 'buff', cd: 5,
    empower: 5, empN: 2, bonus: 20, kb: 7, haste: 1.5,
    desc: '少しの間加速し、5秒以内の次の2回の体当たりを強化する。',
  },
  haymaker: {
    name: 'ヘイメイカー', en: 'HAYMAKER', aim: 'cone', kind: 'cone', icon: 'cone', cd: 12,
    tele: 0.2, charge: 0.75, range: 7.9, half: 0.24, core: 0.4, dmg: 30, storeHit: 1, hold: 3,
    desc: '受けたダメージは「闘魂」として溜まる。0.75秒溜めて、闘魂をすべて乗せた拳を放ち、同じ量のバリアを得る。扇の中心線で当てると相手の防御を無視する。',
  },
  facebreaker: {
    name: 'フェイスブレイカー', en: 'FACEBREAKER', aim: 'self', kind: 'burst', icon: 'grab', cd: 10,
    aoe: 5.5, dmg: 26, pullIn: 14, slow: 0.5, slowPct: 0.7,
    desc: '周囲の相手を自分のところへ引き寄せ、短い間70%のスロウにする。',
  },
  showstopper: {
    name: 'ショーストッパー', en: 'THE SHOW STOPPER', aim: 'self', kind: 'throw', icon: 'leap', cd: 2, ult: true,
    need: 'range', grab: 5.25, carry: 4, air: 0.7, height: 5, aoe: 3.6, dmg: 100, massMul: 0.6, slow: 1, slowPct: 0.99,
    desc: '【必殺技】密着した相手を掴み、そのまま向こう側へ運んで叩きつける。重い相手ほどダメージが大きい。叩きつけられた相手は1秒間ほとんど動けない。',
  },
  // ---- POWDER CAPTAIN: kegs first, then the match ----------------------------
  parrrley: {
    name: '早撃ち', en: 'PARRRLEY', aim: 'line', kind: 'shot', icon: 'shot', cd: 4.5,
    tele: 0.35, range: 6, speed: 40, radius: 0.7, dmg: 50, kb: 3, tumble: 0.1,
    desc: '短い射程の弾を撃つ。火薬樽に当てると耐久を1削り、とどめなら爆発させる。',
  },
  orange: {
    name: '壊血病治療', en: 'REMOVE SCURVY', aim: 'self', kind: 'buff', icon: 'heal', cd: 14,
    heal: 0.12, flat: 40, cleanse: true,
    desc: '回転を回復し、スタン・束縛・魅了・スロウ・毒・出血などをすべて消す。動けない間にも使える（打ち上げられている間は使えない）。',
  },
  keg: {
    name: '火薬樽', en: 'POWDER KEG', aim: 'ground', icon: 'trap', cd: 0.5, stock: { max: 3, every: 8 },
    ai: 'ground', range: 8, aoe: 3.6, dur: 25, max: 5, hp: 3, decay: 1, touch: 0.5, dmg: 72, slow: 2, slowPct: 0.8, kb: 5, blowHaste: 2,
    desc: '火薬樽を置く。3個ぶん溜めておける（8秒で1個ぶん戻る）。樽の耐久は3で、時間とともに1まで減る。誰のどんな攻撃や体当たりでも1ずつ削れ、自分がとどめを刺せば爆発して近くの樽も誘爆し、80%のスロウ。相手にとどめを刺されると不発。',
  },
  barrage: {
    name: '一斉砲撃', en: 'CANNON BARRAGE', aim: 'ground', kind: 'field', icon: 'field', cd: 2, ult: true,
    range: 30, aoe: 6, dur: 8, slowIn: true, slowPct: 0.3, wave: { first: 0.4, every: 2, dmg: 60 },
    desc: '【必殺技】アリーナのどこへでも8秒間の砲撃を降らせる。2秒ごとに4回着弾し、中の相手は30%のスロウになる。',
  },
  // ---- ASHEN EXORCIST: nail them down, then seal them away -------------------
  nails: {
    name: 'リチュアル・ネイル', en: 'RITUAL NAILS', aim: 'line', kind: 'shot', icon: 'shot', cd: 6, re: 'nails',
    tele: 0.3, casts: 3, window: 4, refundUnused: 0.2, range: 7.9, speed: 38, radius: 0.7, dmg: 24, pierce: true, nail: true,
    desc: '貫通する釘を投げ、刺さった相手をスロウにする（2本以上で60%・2秒）。4秒以内なら3本まで投げられ、投げなかった分はクールダウンが戻る。刺さった釘は体当たりかEで引き抜いて追加ダメージ。',
  },
  ignition: {
    name: 'ソウル・イグニッション', en: 'SOUL IGNITION', aim: 'self', kind: 'buff', icon: 'buff', cd: 14, re: 'soulrelease',
    dur: 6, haste: 3, window: 6,
    desc: '6秒間、魂を燃やして加速する。その間は回転を少しずつ失うが、失った分と受けたダメージはゲージに灰色で残り、終わるか、もう一度押すと取り戻せる。',
  },
  pursuit: {
    name: '灰塵の追撃', en: 'ASHEN PURSUIT', aim: 'blink', kind: 'blink', icon: 'blink', cd: 10, re: 'pursuit2',
    range: 4.25, speed: 40, still: true, aoe: 3, dmg: 30, perTag: 24, window: 4,
    desc: 'ワープして周囲を斬る。4秒以内にもう一度押すと、近くの相手へ飛びかかって殴る。刺さった釘を引き抜いて追加ダメージ。',
  },
  purgatory: {
    name: '煉獄', en: 'PURGATORY', aim: 'ground', kind: 'blast', icon: 'cross', cd: 2, ult: true,
    tele: 0.1, range: 10, aoe: 3.5, delay: 0.75, dmg: 95, slow: 2, slowPct: 0.99, doom: 5,
    desc: '【必殺技】封印具を投げ込む。範囲内の相手はほとんど動けなくなり、5秒間の印が付く。印の付いた相手は、どこにいても回転が処刑ライン（12%）を切った瞬間に即KO。処刑するたびにラインが0.5%上がり、次のラウンドにも持ち越す。',
  },
  soulrelease: { name: '魂の解放', en: 'RELEASE', aim: 'self', hidden: true },
  pursuit2: {
    name: '灰塵の追撃', en: 'ASHEN PURSUIT', aim: 'self', kind: 'strike', hidden: true,
    need: 'range', grab: 5.25, tp: true, dmg: 40, perTag: 24,
  },
  // ---- PRISM RADIANCE: bind, then burn a line across the arena ---------------
  binding: {
    name: 'ライトバインド', en: 'LIGHT BINDING', aim: 'line', kind: 'shot', icon: 'shot', cd: 10,
    tele: 0.45, range: 10, speed: 30, radius: 0.8, dmg: 44, snare: 2,
    desc: '当たった相手を2秒、その場に縛り付ける光の弾。',
  },
  barrier: {
    name: 'プリズムバリア', en: 'PRISMATIC BARRIER', aim: 'line', kind: 'shot', icon: 'shield', cd: 10,
    range: 9, speed: 16, radius: 0.7, dmg: 0, friendly: true, ret: true, shieldAdd: 50, shieldMax: 100, hold: 2.5,
    desc: '杖を投げる。投げたときと、戻ってきた杖を受け取ったときの2回、バリアが重なる。',
  },
  singularity: {
    name: 'シンギュラリティ', en: 'LUCENT SINGULARITY', aim: 'ground', kind: 'field', icon: 'field', cd: 8, re: 'lightpop',
    tele: 0.1, range: 11, aoe: 3.4, dur: 5, slowIn: true, slowPct: 0.45, endDmg: 66, endSlow: 1, endSlowPct: 0.45,
    desc: '光の球を投げ、着いた場所に5秒置く（飛んでいる途中で風の壁や氷の壁に当たると消える）。中の相手は45%のスロウ。もう一度押すか、時間が来ると炸裂する。',
  },
  finalspark: {
    name: 'ファイナルスパーク', en: 'FINAL SPARK', aim: 'line', kind: 'beam', icon: 'beam', cd: 2, ult: true,
    tele: 0.1, charge: 1, root: true, range: 33, radius: 1.4, dmg: 170, litBonus: 0.25,
    desc: '【必殺技】1秒構えて、アリーナを端から端まで貫く光線を放つ。直前にスキルを当てていた相手には威力が上がる。',
  },
  lightorb: { name: 'シンギュラリティ', en: 'LUCENT SINGULARITY', aim: 'line', hidden: true, range: 11, speed: 30, radius: 0.7, dmg: 0, friendly: true, opens: 'singularity' },
  lightpop: { name: '起爆', en: 'DETONATE', aim: 'self', hidden: true, pops: 'singularity' },
  // ---- VISION PAINTER: fire, a spring, and dread -----------------------------
  subjdisaster: {
    name: '題材：厄災', en: 'SUBJECT: DISASTER', aim: 'self', icon: 'shot', cd: 6, ai: 'subject',
    spells: { Q: 'hfire', W: 'hbolt', E: 'hlava' },
    desc: '題材を選ぶ（まだ何も起きない）。続けて押すキーで技が決まる。Q＝火球（当たるか端で爆発）／W＝1秒後に落雷（相手の回転が減っているほど重い）／E＝直線に次々噴き上がる溶岩（残ってスロウ35%）。Rで取り消し。',
  },
  subjserenity: {
    name: '題材：静謐', en: 'SUBJECT: SERENITY', aim: 'self', icon: 'heal', cd: 16, ai: 'subject',
    spells: { Q: 'hcurrent', W: 'hpool', E: 'hlights' },
    desc: '題材を選ぶ。Q＝水流（上にいる間加速）／W＝泉（上にいる間バリアが増えていく）／E＝次の3回の攻撃に追加ダメージ。Rで取り消し。',
  },
  subjtorment: {
    name: '題材：苦悩', en: 'SUBJECT: TORMENT', aim: 'self', icon: 'heart', cd: 10, ai: 'subject',
    spells: { Q: 'hvisage', W: 'hgaze', E: 'hmaw' },
    desc: '題材を選ぶ。Q＝恐怖の顔（逃げ出させて60%スロウ）／W＝置いた目が近くの相手を狙って縛る／E＝顎で挟んで中央へ引き寄せ、70%スロウ。Rで取り消し。',
  },
  washbrush: { name: '洗筆', en: 'WASH BRUSH', aim: 'self', hidden: true, short: '消', ai: 'wash' },
  hfire: {
    name: '荒廃の炎', en: 'DEVASTATING FIRE', aim: 'line', kind: 'shot', hidden: true, short: '火',
    tele: 0.35, range: 9, speed: 32, radius: 0.8, dmg: 26, splash: 2.4, splashDmg: 40,
  },
  hbolt: {
    name: '断ち切る稲妻', en: 'SEVERING BOLT', aim: 'ground', kind: 'blast', hidden: true, short: '雷',
    tele: 0.1, range: 9, aoe: 2.3, delay: 1, dmg: 44, exec: 2.5,
  },
  hlava: {
    name: '沸き立つ大地', en: 'MOLTEN FISSURE', aim: 'line', hidden: true, short: '溶', ai: 'cone',
    tele: 0.2, range: 8.4, radius: 1.3, n: 4, first: 1.8, gap: 2.1, delay: 0.6, every: 0.2,
  },
  lavapool: { name: '溶岩', en: 'LAVA', aim: 'ground', kind: 'field', hidden: true, aoe: 1.5, dur: 2.5, dmg: 22, dps: 20, slowPct: 0.35 },
  hcurrent: {
    name: '流るる蒼', en: 'FLEETING CURRENT', aim: 'line', hidden: true, short: '流', ai: 'none',
    range: 8, radius: 1.5, n: 4, first: 1, gap: 2.2,
  },
  currentpool: { name: '水流', en: 'CURRENT', aim: 'ground', kind: 'field', hidden: true, friendly: true, aoe: 1.6, dur: 4, hasteIn: true },
  hpool: {
    name: '内省の泉', en: 'POOL OF REFLECTION', aim: 'ground', kind: 'field', hidden: true, short: '泉', friendly: true,
    range: 6, aoe: 2.6, dur: 3, shieldIn: { first: 45, per: 16, max: 90 },
  },
  hlights: { name: '迸る光彩', en: 'STIRRING LIGHTS', aim: 'self', hidden: true, short: '光', ai: 'lights', hits: 3, dur: 9, bonus: 18 },
  hvisage: {
    name: '恐怖の形相', en: 'GRIM VISAGE', aim: 'line', kind: 'shot', hidden: true, short: '恐',
    tele: 0.4, range: 9, speed: 34, radius: 0.8, dmg: 40, fear: 1.5, slow: 1.5, slowPct: 0.6,
  },
  hgaze: { name: '深淵の眼差し', en: 'GAZE OF THE ABYSS', aim: 'ground', hidden: true, short: '眼', ai: 'ground', range: 9, aoe: 4, dur: 3, arm: 0.95 },
  gazeeye: { name: '深淵の眼', en: 'ABYSSAL EYE', aim: 'ground', kind: 'field', hidden: true, aoe: 4, dur: 3, arm: 0.95 },
  gazeshot: { name: '深淵の眼差し', en: 'GAZE OF THE ABYSS', aim: 'line', hidden: true, range: 7, speed: 40, radius: 0.8, dmg: 40, snare: 2 },
  hmaw: {
    name: '粉砕の牙', en: 'CRUSHING MAW', aim: 'ground', kind: 'blast', hidden: true, short: '牙',
    tele: 0.1, range: 8, aoe: 2.6, delay: 0.4, dmg: 40, pullMid: 14, slow: 1.25, slowPct: 0.7,
  },
  despair: {
    name: '絶望の螺旋', en: 'SPIRALING DESPAIR', aim: 'line', kind: 'shot', icon: 'star', cd: 2, ult: true,
    tele: 0.4, range: 12, speed: 30, radius: 1.0, dmg: 20, spawn: 'despairz',
    desc: '【必殺技】当たった相手を中心に3秒間広がり続ける領域を作る。相手は逃げられず、スロウがどんどん重くなり、最後に炸裂する。題材を選んでいる間は使えない（Rは取り消しになる）。',
  },
  despairz: {
    name: '絶望', en: 'DESPAIR', aim: 'ground', kind: 'field', hidden: true,
    aoe: 5, r0: 2, grow: 2.4, dur: 3, dps: 22, stick: true, slowGrow: 0.1, slowMax: 0.9, endDmg: 150,
  },
  // ---- TWILIGHT STAR: the further the better ---------------------------------
  paddle: {
    name: '流れ星', en: 'PADDLE STAR', aim: 'line', kind: 'shot', icon: 'star', cd: 6.5, re: 'paddle2', noRe: true,
    tele: 0.4, range: 7, speed: 30, radius: 0.8, dmg: 40, rest: 'reststar',
    desc: '星を打つ。何にも当たらなければ飛んだ先で1秒止まり、その間にもう一度押すと、星のいる場所から狙った地点のほうへ飛ばし直せる。飛ばし直した星は長く飛ぶほど重くなる（最大2.5倍）。',
  },
  paddle2: {
    name: '流れ星', en: 'PADDLE STAR', aim: 'ground', kind: 'shot', hidden: true,
    range: 28, aoe: 0.8, speed: 30, radius: 0.8, dmg: 40, far: 1.5, farAt: 17.5,
  },
  reststar: { name: '流れ星', en: 'PADDLE STAR', aim: 'ground', kind: 'field', hidden: true, aoe: 0.8, dur: 1 },
  bubbletrap: { name: 'おやすみ泡', en: 'SLEEPY TROUBLE BUBBLE', aim: 'ground', hidden: true, aoe: 1.8, dur: 4.8, arm: 0.8 },
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
    name: 'おやすみ泡', en: 'SLEEPY TROUBLE BUBBLE', aim: 'line', kind: 'shot', icon: 'orb', cd: 14,
    range: 7, speed: 26, radius: 0.9, dmg: 30, slow: 1.4, slowPct: 0.3, tie: 'DROWSY', dur: 1.4, breakRange: 99, pop: 0, root: 2.2, sleep: true, wake: 30,
    trap: 'bubbletrap', refundSelf: 0.3,
    desc: '当たった相手はうとうとして、1.4秒後に眠って2.2秒動けなくなる。眠った相手への最初の一撃は重くなる。外れた泡はその場で4秒間の罠になる。当てると待ち時間が30%戻る。',
  },
  portal: {
    name: 'ポータルジャンプ', en: 'PORTAL JUMP', aim: 'blink', kind: 'blink', icon: 'blink', cd: 5,
    range: 5, speed: 60, autoRet: 1, still: true, ai: 'none',
    desc: '狙った方向へ瞬間移動し、1秒後に元の場所へ自動で戻る。移動先では動けないが、スキルは使える。',
  },
  // ---- SPARK SURGE: never stop shooting --------------------------------------
  burstfire: {
    name: 'バーストファイア', en: 'BURST FIRE', aim: 'line', kind: 'shot', icon: 'shot', cd: 0.13, rapid: true,
    range: 5.6, speed: 55, radius: 0.5, dmg: 5.5, alt: 'burstfire2', altKey: 'E', refundKey: { E: 0.5 },
    desc: '押している間、カーソルへ向けて小さな弾を撃ち続ける。当てるたびにEのクールダウンが0.5秒縮む。',
  },
  ultrashock: {
    name: 'ウルトラショックレーザー', en: 'ULTRASHOCK LASER', aim: 'line', kind: 'beam', icon: 'beam', cd: 8,
    tele: 0.2, charge: 0.4, root: true, range: 15, radius: 1.0, dmg: 46, slow: 2, slowPct: 0.5,
    desc: '一瞬構えて、長いレーザーを放つ。当たった相手を2秒間50%のスロウにする。',
  },
  surge: {
    name: 'スパークサージ', en: 'SPARK SURGE', aim: 'dash', kind: 'dash', icon: 'dash', cd: 18,
    dist: 3, minDist: 3, speed: 40, through: true, linger: 5, slides: 'wallride', grab: 1,
    desc: '短く駆け抜ける。そのあと5秒間、Qの弾が相手を貫通し、威力が上がる。壁に向かって使うと壁に乗り、縁に沿って最大で半周ほど滑る（滑りながらQを撃てる）。移動のクリックをするか、壁が途切れると降りる。',
  },
  wallride: { name: 'スパークサージ', en: 'SPARK SURGE', aim: 'dash', hidden: true, slide: true, speed: 24, arc: Math.PI, through: true, fly: true },
  crash: {
    name: 'ライトニングクラッシュ', en: 'LIGHTNING CRASH', aim: 'self', kind: 'burst', icon: 'burst', cd: 2, ult: true,
    aoe: 8.6, dmg: 110, kb: 6, buffHit: 5,
    desc: '【必殺技】周囲に放電する。当たると5秒間の過充電に入り、移動速度と与えるダメージが上がる。弾を当て続けるかぎり過充電は切れない。',
  },
  burstfire2: {
    name: 'バーストファイア', en: 'BURST FIRE', aim: 'line', kind: 'shot', hidden: true, rapid: true,
    range: 5.6, speed: 55, radius: 0.5, dmg: 7.5, pierce: true, refundKey: { E: 0.5 },
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
    name: '死の羽衣', en: 'DEADLY PLUMAGE', aim: 'self', kind: 'buff', icon: 'buff', cd: 14,
    dur: 4, haste: 2,
    desc: '4秒間、体当たりのたびに相手を貫く羽根が1枚飛ぶ。少しの間加速する。',
  },
  bladecaller: {
    name: 'ブレードコーラー', en: 'BLADECALLER', aim: 'self', icon: 'grab', cd: 8,
    ai: 'feathers',
    desc: '床の羽根をすべて自分へ呼び戻す。途中の相手を切り裂き、3枚当たると動けなくする。',
  },
  plumeshot: { name: '羽根', en: 'PLUME', aim: 'line', hidden: true, range: 4.5, speed: 38, radius: 0.7, dmg: 12, pierce: true, feather: true },
  quill: {
    name: '羽根', en: 'QUILL', aim: 'line', hidden: true,
    range: 30, speed: 40, radius: 0.9, dmg: 28, pierce: true, root: 1.25, fall: 0.05,
  },
  storm: {
    name: 'フェザーストーム', en: 'FEATHERSTORM', aim: 'line', kind: 'shot', icon: 'leap', cd: 2, ult: true,
    charge: 1.5, veil: true, range: 5.5, speed: 38, radius: 0.7, dmg: 40, fan: 5, half: 0.4, pierce: true, feather: true,
    desc: '【必殺技】1.5秒間、攻撃を受けない状態で自由に動ける。終わりに、狙った方向へ貫通する羽根を5枚投げる。',
  },
  // ---- WORLD ENDER: three swings and the end of the world --------------------
  darkinblade: {
    name: 'ダーキンブレード', en: 'THE DARKIN BLADE', aim: 'line', icon: 'blast', cd: 6, tele: 0.3, re: 'darkinblade', window: 4, pause: 1,
    desc: '大剣を3回まで続けて振る。1回目は長い直線、2回目は扇、3回目は目の前への叩きつけで、振るたびに25%強くなる。剣先（3回目は中心）で当てるとダメージが75%増え、相手を打ち上げる。キーを押している間に狙い、離した瞬間に振る。次の一振りまでは1秒空く。狙っている間にEを押すと、狙いを保ったまま踏み込める。',
  },
  chains: {
    name: '業火の鎖', en: 'INFERNAL CHAINS', aim: 'line', kind: 'shot', icon: 'hook', cd: 12,
    tele: 0.4, range: 6.6, speed: 30, radius: 0.8, dmg: 30, slow: 1.5, slowPct: 0.35, spawn: 'chainzone',
    desc: '鎖を放ち、当たった相手を1.5秒間35%のスロウにする。当たった場所の周りに1.5秒留まっていると、その中心へ引きずり戻して追加ダメージ。',
  },
  darkin1: {
    name: 'ダーキンブレード', en: 'THE DARKIN BLADE', aim: 'line', kind: 'beam', hidden: true, ai: 'darkin', window: 4,
    charge: 0, loose: true, still: true, range: 5.6, radius: 1.2, tip: 3.5, dmg: 44, tipMul: 0.75, tipUp: 0.25,
  },
  darkin2: {
    name: 'ダーキンブレード', en: 'THE DARKIN BLADE', aim: 'cone', kind: 'cone', hidden: true, ai: 'darkin', window: 4,
    charge: 0, loose: true, still: true, range: 4.6, half: 0.55, tip: 3.0, dmg: 55, tipMul: 0.75, tipUp: 0.25,
  },
  darkin3: {
    name: 'ダーキンブレード', en: 'THE DARKIN BLADE', aim: 'line', kind: 'slam', hidden: true, ai: 'darkin', window: 4,
    charge: 0, loose: true, still: true, range: 2, radius: 1.2, ahead: 1.8, aoe: 2.3, tip: 1.2, dmg: 66, tipMul: 0.75, tipUp: 0.25,
  },
  chainzone: {
    name: '業火の鎖', en: 'INFERNAL CHAINS', aim: 'ground', kind: 'field', hidden: true,
    aoe: 2.6, dur: 1.5, endDmg: 30, endPull: 14,
  },
  umbral: {
    name: '影の突進', en: 'UMBRAL DASH', aim: 'dash', kind: 'dash', icon: 'dash', cd: 5,
    dist: 4.5, minDist: 1.5, speed: 34, halt: true, snap: true,
    desc: '踏み込む。Qを狙っている最中に押すと、狙いを保ったままその場で踏み込むので、剣先を合わせたり、相手の技をかわしたりできる。',
  },
  worldender: {
    name: 'ワールドエンダー', en: 'WORLD ENDER', aim: 'self', kind: 'buff', icon: 'star', cd: 2, ult: true,
    dur: 10,
    desc: '【必殺技】10秒間、攻撃と速度が上がり、与えたダメージの一部で回転が回復する。',
  },
  // ---- STYLE RANKER: shoot, cut, pass through --------------------------------
  flair: {
    name: '早撃ち', en: 'FLAIR', aim: 'line', kind: 'shot', icon: 'shot', cd: 2,
    tele: 0.3, range: 8.6, speed: 40, radius: 0.7, dmg: 36, kb: 3, tumble: 0.1,
    desc: '弾を撃つ。相手が目の前にいれば剣で斬る。Eの突進中に使うと、突進のあと通り道を爆撃する。',
  },
  flairslash: { name: '早撃ち', en: 'FLAIR', aim: 'cone', kind: 'cone', hidden: true, range: 2.6, half: 0.9, dmg: 36, kb: 3, tumble: 0.1 },
  flairbomb: { name: '早撃ち', en: 'FLAIR', aim: 'line', hidden: true, range: 6, radius: 1.3, dmg: 36 },
  whirl: {
    name: '円刃', en: 'BLADE WHIRL', aim: 'self', kind: 'field', icon: 'burst', cd: 22,
    follow: true, eat: true, dur: 0.75, aoe: 3.4, dmg0: 32, endDmg: 32,
    desc: '0.75秒間、近くに飛んできた相手の弾をすべて斬り落とす。始めと終わりの2回、周囲を斬る。動きながら使える。',
  },
  wildrush: {
    name: 'ワイルドラッシュ', en: 'WILD RUSH', aim: 'dash', kind: 'dash', icon: 'dash', cd: 12,
    tele: 0.3, dist: 6, minDist: 4, speed: 38, through: true, pass: 38, haste: 1.5, fly: true,
    desc: '相手をすり抜けて斬る突進。そのあと少しの間加速する。突進中にもスキルを使える。',
  },
  inferno: {
    name: '地獄の引き金', en: 'INFERNO TRIGGER', aim: 'self', kind: 'field', icon: 'burst', cd: 5, need: 'style',
    follow: true, dur: 2, aoe: 5.5, dps: 110, selfSlow: 0.3,
    desc: 'スタイルがランクSのときだけ使える。2秒間、自分の周囲に弾幕をばらまき続ける。その間は自分も30%遅くなる。終わるとランクは最初に戻る。',
  },
  // ---- UNSUNDERED GLAIVE: stronger with every hit ----------------------------
  darkglaive: {
    name: 'ダーキングレイヴ', en: 'THE DARKIN GLAIVE', aim: 'self', kind: 'buff', icon: 'buff', cd: 6, re: 'glaiveup',
    empower: 5, bonus: 30, kb: 6, hitHeal: 0.09, window: 4,
    desc: '5秒間、次の体当たりが二連撃になり、当てると回転を回復する。当てたあと4秒以内にもう一度押すと、次の体当たりが相手を打ち上げる。',
  },
  dreaded: {
    name: '戦慄の再臨', en: 'DREADED RETURN', aim: 'line', kind: 'shot', icon: 'hook', cd: 12,
    tele: 0.1, charge: 0.5, root: true, range: 6.7, speed: 44, radius: 0.9, dmg: 36, chain: true, pull: 16, stun: 0.25,
    desc: '0.5秒構えて薙刀を突き出す。当たった相手を一瞬止め、手元へ引き寄せる。',
  },
  aureate: {
    name: '絢爛たる進撃', en: 'AUREATE RUSH', aim: 'dash', kind: 'dash', icon: 'dash', cd: 8,
    dist: 3.5, minDist: 3.5, speed: 34, aoe: 4.2, inner: 2.9, land: 42, weak: 28,
    desc: '跳んだ先で周囲を薙ぐ。斬撃の外縁で当てるとダメージが50%増える。',
  },
  grim: {
    name: '無慈悲なる裁き', en: 'GRIM DELIVERANCE', aim: 'leap', kind: 'leap', icon: 'leap', cd: 2, ult: true,
    range: 6, air: 0.8, height: 6, aoe: 4, dmg: 115, kb: 10, healHit: 0.33,
    desc: '【必殺技】跳び上がって突き下ろす。与えたダメージの33%ぶん回転が回復する。',
  },
  glaiveup: {
    name: 'ダーキングレイヴ', en: 'THE DARKIN GLAIVE', aim: 'self', kind: 'buff', hidden: true,
    empower: 5, bonus: 30, kb: 5, up: 0.75,
  },
  // ---- LUNAR ARSENAL: a gun for every range ----------------------------------
  arsenal: {
    name: '武器のスキル', en: 'WEAPON SKILL', aim: 'line', icon: 'beam', cd: 4, re: 'bindeclipse',
    weapons: ['moonshot', 'onslaught', 'gravshot', 'duskwave', 'sentry'], ammo: 5, short: ['狙', '鎌', '重', '炎', '輪'],
    // Each weapon has a colour of its own, on its key and on everything it fires.
    tints: [0x4fe08a, 0xff4a5a, 0xb46bff, 0x4aa8ff, 0xf2f6ff],
    // What the weapon in the other hand adds when it joins in: a light blow, and something of its own.
    off: { dmg: 14, fx: [{ mark: 4.5 }, { leech: 1 }, { slow: 2.5, slowPct: 0.3 }, { mul: 1.5, splash: 2.4 }, { mul: 2 }] },
    desc: 'いま主に持っている武器の技を出す。武器は5発撃つと次の武器に入れ替わる。狙撃銃＝長射程弾と印／鎌＝1.75秒加速しながら近くの相手を斬り続けて回復／重力砲＝スロウ弾、スロウ中にもう一度押すとどこにいても縛る／火炎＝扇状の炎／円月輪＝近づいた相手を撃つ見張りを置く。武器にはそれぞれ色があり（狙撃銃＝緑、鎌＝赤、重力砲＝紫、火炎＝青、円月輪＝白）、キーと弾の色でわかる。狙撃銃の弾・火炎・鎌の斬撃が当たった相手には、副の武器も軽く追撃する（狙撃銃＝印、鎌＝回復、重力砲＝スロウ、火炎・円月輪＝追加ダメージ）。見張りには、置いたときの副の武器が載る。',
  },
  phase: {
    name: 'フェーズ', en: 'PHASE', aim: 'self', icon: 'buff', cd: 0.8, ai: 'phase',
    desc: '主の武器と副の武器を入れ替える。待ち時間は武器ごとに別なので、撃ったら持ち替えてもう一方を撃てる。',
  },
  nextweapon: {
    name: '次の武器', en: 'NEXT WEAPON', aim: 'self', icon: 'orb', cd: 0, passive: true,
    desc: '【常時効果】弾を撃ち切った武器の代わりに、次に手元へ来る武器。武器はラウンドをまたいで持ち越す。',
  },
  moonshot: {
    name: 'ムーンショット', en: 'CALIBRUM', aim: 'line', kind: 'shot', hidden: true, weapon: 0, cd: 4, tint: 0x4fe08a,
    tele: 0.45, range: 13.5, speed: 52, radius: 0.7, dmg: 46, mark: 4.5, offhand: true,
  },
  onslaught: {
    name: 'オンスロート', en: 'SEVERUM', aim: 'self', kind: 'field', hidden: true, weapon: 1, cd: 4, tint: 0xff4a5a,
    follow: true, dur: 1.75, aoe: 4.6, dps: 44, leechIn: 0.35, haste: 1.75, offEvery: 0.5,
  },
  gravshot: {
    name: '重力弾', en: 'GRAVITUM', aim: 'line', kind: 'shot', hidden: true, weapon: 2, cd: 5, tint: 0xb46bff,
    tele: 0.4, range: 10, speed: 34, radius: 0.8, dmg: 30, slow: 2.5, slowPct: 0.3, eclipse: 2.5,
  },
  bindeclipse: { name: '束縛のエクリプス', en: 'BINDING ECLIPSE', aim: 'self', hidden: true, tint: 0xb46bff, ai: 'bindeclipse', dmg: 40, snareT: 1, bigSnare: 1.35 },
  duskwave: {
    name: 'ダスクウェーブ', en: 'INFERNUM', aim: 'cone', kind: 'cone', hidden: true, weapon: 3, cd: 2.5, tint: 0x4aa8ff,
    tele: 0.3, range: 5.6, half: 0.5, dmg: 42, kb: 3, offhand: true,
  },
  sentry: {
    name: 'セントリー', en: 'CRESCENDUM', aim: 'ground', hidden: true, weapon: 4, cd: 3, ai: 'ground', tint: 0xf2f6ff,
    range: 4, aoe: 1.1, dur: 20, live: 4, reach: 5, wake: 0.35, rate: 0.8, max: 3,
  },
  sentryshot: { name: '見張り', en: 'SENTRY', aim: 'line', hidden: true, tint: 0xf2f6ff, range: 9, speed: 32, radius: 0.55, dmg: 20, kb: 1.5, tumble: 0, launch: 0 },
  vigil: {
    name: '月光の番人', en: 'MOONLIGHT VIGIL', aim: 'line', kind: 'shot', icon: 'star', cd: 2, ult: true,
    tele: 0.4, range: 12, speed: 24, radius: 1.4, dmg: 70, splash: 4, splashDmg: 70,
    arm: [{ mark: 4.5 }, { heal: 90 }, { slow: 2.5, slowPct: 0.99 }, { dmg: 50 }, { sentry: true }],
    desc: '【必殺技】ゆっくり進む月光弾。当たるか射程の端で大きく爆発する。主の武器で追加効果が変わる：狙撃銃＝2倍で炸裂する印／鎌＝回復／重力砲＝ほぼ動けなくなるスロウ／火炎＝追加ダメージ／円月輪＝その場に起動済みの見張り。',
  },
  // ---- STAR FORGER: breath, gravity, a falling star --------------------------
  breath: {
    name: '星炎の息吹', en: 'BREATH OF LIGHT', aim: 'cone', kind: 'cone', icon: 'cone', cd: 0.125, rapid: true,
    stream: { max: 3.25, cd: 3, gap: 0.3 }, range: 7.4, half: 0.2, dmg: 6.5, tick: { n: 8, dmg: 26, gain: 2 },
    desc: '押している間、カーソルへ向けて息吹を吐き続ける（最大3.25秒）。同じ相手に1秒当て続けるごとに爆発し、星屑を2つ得る。',
  },
  flight: {
    name: '天空への飛翔', en: 'ASTRAL FLIGHT', aim: 'dash', kind: 'dash', icon: 'leap', cd: 16, re: 'flightstop',
    dist: 24, minDist: 6, speed: 16, through: true, fly: true, window: 2,
    desc: '狙った方向へ長い距離を飛ぶ。途中でもう一度押すとその場で降りる。飛んでいる間もスキルを使え、Qは途切れず、時間切れにもならない。',
  },
  blackhole: {
    name: '特異点', en: 'SINGULARITY', aim: 'ground', kind: 'field', icon: 'field', cd: 12,
    tele: 0.1, range: 7.4, aoe: 4, dur: 5, dps: 15, pullIn: 75, slowIn: true, star: true, gain: 1, core: 1.4, line: 0.05, perLine: 0.00026,
    desc: '5秒間のブラックホールを置く。中の相手は中心へ引かれ続け、中にいる間は毎秒星屑を1つ得る。中心で回転が5%を切った相手は即KO。星屑が多いほど広がる。',
  },
  fallingstar: {
    name: '星の邂逅', en: 'FALLING STAR', aim: 'ground', kind: 'blast', icon: 'blast', cd: 2, ult: true,
    tele: 0.1, range: 12.5, aoe: 5, delay: 0.9, dmg: 150, stun: 1, star: true, gain: 5, evolve: 'skies', evolveAt: 75,
    desc: '【必殺技】指定地点に星を落とし、巻き込んだ相手をスタンさせる。当てると星屑を5つ得る。星屑が多いほど広がり、75個で「崩れ落つ天穹」になって相手を打ち上げる。星屑は次のラウンドにも持ち越す。',
  },
  flightstop: { name: '着地', en: 'LAND', aim: 'self', hidden: true },
  skies: {
    name: '崩れ落つ天穹', en: 'THE SKIES DESCEND', aim: 'ground', kind: 'blast', hidden: true,
    aoe: 6.5, delay: 0.9, dmg: 170, up: 1, slow: 1, slowPct: 0.5, star: true, gain: 5,
  },
  // ---- DARK SORCERER: it only gets worse for them ----------------------------
  balefulstrike: {
    name: 'イーヴィルストライク', en: 'BALEFUL STRIKE', aim: 'line', kind: 'shot', icon: 'shot', cd: 4,
    tele: 0.35, range: 8.25, speed: 36, radius: 0.85, dmg: 38, kb: 3, tumble: 0.1, permHit: 30,
    desc: '弾を撃つ。当てるたびに魔力が1溜まる。',
  },
  darkmatter: {
    name: 'ダークマター', en: 'DARK MATTER', aim: 'ground', kind: 'blast', icon: 'blast', cd: 8,
    range: 9.5, aoe: 2.9, delay: 1.25, dmg: 96,
    desc: '1.25秒後、指定地点に暗黒物質が落ちる。',
  },
  horizon: {
    name: 'イベントホライズン', en: 'EVENT HORIZON', aim: 'ground', kind: 'field', icon: 'trap', cd: 14,
    range: 7.25, aoe: 4.25, dur: 3.5, cage: 2.5, arm: 0.5, dmg: 10,
    desc: '0.5秒後に3秒間の輪が現れる。縁に触れた相手を2.5秒スタンさせる。突進で越えようとしても止める。',
  },
  primordial: {
    name: 'メテオバースト', en: 'PRIMORDIAL BURST', aim: 'self', kind: 'strike', icon: 'star', cd: 2, ult: true,
    need: 'range', range: 7.75, dmg: 105, exec: 1.0, execCap: 0.667,
    desc: '【必殺技】近くの相手に必中の魔弾を撃つ。相手の回転が少ないほど威力が上がる（最大2倍）。',
  },
  // ---- VAULT BREAKER: straight in --------------------------------------------
  vault: {
    name: '真っすぐいってぶっとばす', en: 'VAULT BREAKER', aim: 'dash', kind: 'dash', icon: 'dash', cd: 6,
    tele: 0.45, wind: { min: 0, full: 1.25, max: 4, cancelCd: 3 }, near: 2.5, range: 7.25, dist: 7.25, minDist: 2.5, speed: 40, dmg: 26, powMul: 1, keep: 0.5, kb: 9,
    desc: '長押しで溜める（溜め中は少し遅くなり、4秒で不発）。溜めるほど遠くまで突進し、威力も最大2倍になる。相手に当たるとそこで止まり、押し飛ばす。',
  },
  denting: {
    name: 'メッタ打ち', en: 'DENTING BLOWS', aim: 'self', icon: 'burst', cd: 0, passive: true,
    desc: '【常時効果】体当たりやスキルを3回当てるごとに追加ダメージを与え、4秒間、相手の受けるダメージを20%増やす。',
  },
  relentless: {
    name: '無慈悲な連撃', en: 'RELENTLESS FORCE', aim: 'self', kind: 'buff', icon: 'buff', cd: 1,
    stock: { max: 2, every: 8 }, empower: 7, bonus: 30, kb: 6, wave: 'relentwave',
    desc: '7秒間、次の体当たりを強化する。当てると相手の後ろへ扇状の衝撃波が抜ける。2回ぶん溜めておける（8秒で1回ぶん戻る）。',
  },
  cease: {
    name: '突入捜査', en: 'CEASE AND DESIST', aim: 'self', kind: 'strike', icon: 'star', cd: 2, ult: true,
    need: 'range', range: 9.25, tp: true, dmg: 115, up: 1.3,
    desc: '【必殺技】近くの相手へ一瞬で詰め寄り、打ち上げる。',
  },
  relentwave: { name: '衝撃波', en: 'SHOCKWAVE', aim: 'cone', hidden: true, range: 4.5, half: 0.5, dmg: 20 },
  // ---- ARCANE SHOOTER: land the shot, get everything back --------------------
  mystic: {
    name: 'ミスティックショット', en: 'MYSTIC SHOT', aim: 'line', kind: 'shot', icon: 'shot', cd: 4.5,
    tele: 0.35, range: 9.9, speed: 44, radius: 0.7, dmg: 40, kb: 3, tumble: 0.1, refund: 1.5,
    desc: '弾を撃つ。当てると、すべてのスキルのクールダウンが1.5秒縮む。',
  },
  flux: {
    name: 'エッセンスフラックス', en: 'ESSENCE FLUX', aim: 'line', kind: 'shot', icon: 'orb', cd: 8,
    tele: 0.4, range: 9.7, speed: 36, radius: 0.9, dmg: 26, mark: 4,
    desc: '印を付ける弾。印は次にスキルが当たると炸裂する。',
  },
  arcshift: {
    name: 'アーケインシフト', en: 'ARCANE SHIFT', aim: 'blink', kind: 'blink', icon: 'blink', cd: 14,
    range: 4.75, speed: 40, still: true, bolt: 'arcbolt', n: 1,
    desc: '瞬間移動する（相手もすり抜ける）。移動先でぴたりと止まり、相手を自動で狙う弾を撃つ。',
  },
  arcbolt: {
    name: '魔弾', en: 'ARCANE BOLT', aim: 'line', hidden: true,
    range: 11, speed: 34, radius: 0.6, dmg: 32, kb: 2, tumble: 0, launch: 0,
  },
  trueshot: {
    name: 'トゥルーショットバラージ', en: 'TRUESHOT BARRAGE', aim: 'line', kind: 'shot', icon: 'beam', cd: 2, ult: true,
    tele: 0.1, charge: 1, root: true, range: 40, speed: 40, radius: 2, dmg: 175, pierce: true,
    desc: '【必殺技】1秒構えたあと、アリーナを横断する太い光波を放つ。',
  },
  // ---- MAGUS ASCENDANT (Xerath)
  arcanopulse: {
    name: 'アルカノパルス', en: 'ARCANOPULSE', aim: 'line', kind: 'beam', icon: 'beam', cd: 5,
    tele: 0.5, wind: { min: 0, full: 1.5, max: 3, cancelCd: 2.5 }, near: 6, range: 12.5, radius: 0.9, dmg: 58,
    desc: '長押しで溜めるほど射程が伸びる貫通光線（1.5秒で最大。溜め中は遅くなり、3秒で不発）。離すと放つ。',
  },
  eyeofdestruction: {
    name: 'デストラクションアイ', en: 'EYE OF DESTRUCTION', aim: 'ground', kind: 'blast', icon: 'blast', cd: 10,
    tele: 0.15, range: 9, aoe: 2.2, delay: 0.5, dmg: 40, slow: 2.5, slowPct: 0.25, coreR: 1.0, coreMul: 1.667, coreSlowPct: 0.8,
    desc: '半秒後に雷を落とし、25%のスロウにする。中心で当てるとダメージが67%増え、スロウが80%になる。',
  },
  shockorb: {
    name: 'ショックオーブ', en: 'SHOCKING ORB', aim: 'line', kind: 'shot', icon: 'orb', cd: 11,
    tele: 0.4, range: 9.5, speed: 30, radius: 0.85, dmg: 44, stunFar: [0.75, 2.25],
    desc: '弾を撃ち、当たった相手をスタンさせる。遠くまで飛んでから当たるほどスタンが長い（0.75〜2.25秒）。',
  },
  arcanerite: {
    name: 'アーケーンライト', en: 'RITE OF THE ARCANE', aim: 'self', icon: 'star', cd: 2, ult: true, re: 'arcanefire', stance: true, ai: 'stance',
    range: 40, half: Math.PI, shots: 6, first: 0.4, every: 0.8, window: 10,
    desc: '【必殺技】その場で構える。そのあとRを押すたびに、アリーナのどこへでも砲撃を落とす（最大6発、10秒以内、半秒後に着弾）。当てるたびに次の一発が重くなる。',
  },
  arcanefire: { name: '蒼の天弾', en: 'ARCANE BARRAGE', aim: 'ground', hidden: true, fire: true, range: 40, aoe: 2.2 },
  arcanebarrage: { name: '蒼の天弾', en: 'ARCANE BARRAGE', aim: 'ground', kind: 'blast', hidden: true, aoe: 2.2, delay: 0.5, dmg: 52, heavier: 9 },
  // ---- CRIMSON HUNGER (Briar)
  headrush: {
    name: 'ヘッドラッシュ', en: 'HEAD RUSH', aim: 'self', kind: 'strike', icon: 'dash', cd: 9,
    need: 'range', range: 5.2, tp: true, dmg: 46, stun: 0.85, shredT: 5, shredK: 1.2,
    desc: 'カーソルに一番近い相手へ飛びかかる。0.85秒スタンさせ、5秒間その相手が受けるダメージを20%増やす。',
  },
  bloodfrenzy: {
    name: '血の狂乱', en: 'BLOOD FRENZY', aim: 'dash', icon: 'buff', cd: 10, re: 'snackattack', ai: 'dash',
    dist: 3.5, minDist: 3.5, speed: 34, frenzy: 5, halt: false,
    desc: '前へ跳び、5秒間狂乱する。速くなり、一番近い相手へ勝手に突っ込み続ける（移動は受け付けない）。噛みつきは周りの相手にも当たる。もう一度押すと、次の噛みつきが重くなり回復する。',
  },
  snackattack: {
    name: '衝動噛み', en: 'SNACK ATTACK', aim: 'self', kind: 'buff', hidden: true, free: true,
    empower: 5, bonus: 20, missing: 70, hitHeal: 0.05, kb: 4,
  },
  chillingscream: {
    name: '呪福の叫び', en: 'CHILLING SCREAM', aim: 'line', kind: 'beam', icon: 'cone', cd: 16,
    tele: 0.1, wind: { min: 0.15, full: 1, max: 1, auto: true }, armor: 0.65, chargeHeal: 0.11, near: 3, range: 5.2, radius: 2.2, dmg: 60, slow: 0.5, slowPct: 0.8, kb: 13, tumble: 0.6, pinT: 1,
    desc: 'キーを押している間、最大1秒息を吸う（その間は受けるダメージが35%減り、回復する）。離すか1秒経つと、目の前の幅広い範囲へ叫び、80%のスロウ。長く吸うほど遠くまで届く。吸い切っていれば吹き飛ばし、壁に当たった相手はスタンして追加ダメージ。使うと狂乱が止まる。',
  },
  certaindeath: {
    name: '迫りくる死', en: 'CERTAIN DEATH', aim: 'line', icon: 'star', cd: 2, ult: true, ai: 'shot',
    tele: 0.4, range: 30, speed: 42, radius: 0.9, dmg: 20, flyTo: 'certainland', frenzy: 8,
    desc: '【必殺技】アリーナの端まで届く石を蹴る。当たった相手へ止められない勢いで飛びつき、着地で周りを吹き飛ばす。そのあと8秒間、その相手を追う狂乱になる。',
  },
  certainland: { name: '迫りくる死', en: 'CERTAIN DEATH', aim: 'leap', hidden: true, air: 0.55, height: 4, aoe: 3.2, dmg: 90, kb: 4, track: true },
  // ---- STEAM GOLEM (Blitzcrank)
  rocketgrab: {
    name: 'ロケットグラブ', en: 'ROCKET GRAB', aim: 'line', kind: 'shot', icon: 'hook', cd: 16,
    tele: 0.45, range: 9.8, speed: 30, radius: 0.9, dmg: 60, chain: true, pull: 24, stun: 0.65,
    desc: '腕を伸ばし、当たった相手を手元まで引きずり込む。0.65秒スタンさせる。',
  },
  overdrive: {
    name: 'オーバードライブ', en: 'OVERDRIVE', aim: 'self', icon: 'buff', cd: 15, ai: 'buff',
    haste: 5, after: 1.5, afterPct: 0.3,
    desc: '5秒間加速する。切れたあと1.5秒間、自分が30%遅くなる。',
  },
  powerfist: {
    name: 'パワーフィスト', en: 'POWER FIST', aim: 'self', kind: 'buff', icon: 'burst', cd: 5,
    empower: 5, bonus: 44, heldMul: 2, up: 1, kb: 3,
    desc: '5秒以内の次の体当たりが2倍の重さになり、相手を1秒打ち上げる。スタン中や打ち上げ中の相手に当てると、追加ダメージがさらに2倍になる。',
  },
  staticfield: {
    name: 'イナズマフィールド', en: 'STATIC FIELD', aim: 'self', icon: 'burst', cd: 2, ult: true, ai: 'burst',
    aoe: 5.5, dmg: 110, strip: true, silence: 0.5,
    desc: '【必殺技】周囲に放電する。相手のバリアとガードを消し、0.5秒スキルを封じる。',
  },
  // ---- VOID EYE (Vel'Koz)
  decon: { name: '有機分解', en: 'DECONSTRUCTION', aim: 'self', hidden: true },
  plasmafission: {
    name: '電離炸裂弾', en: 'PLASMA FISSION', aim: 'line', icon: 'shot', cd: 7, re: 'fissionsplit', ai: 'shot',
    tele: 0.35, range: 9.5, speed: 26, radius: 0.8, dmg: 46, slow: 2, slowPct: 0.7, window: 0.6,
    desc: '弾を撃ち、70%のスロウにする。当たるか、飛んでいる間にもう一度押すと、左右90度に分かれて飛ぶ。',
  },
  fissionsplit: { name: '分裂', en: 'SPLIT', aim: 'self', hidden: true, free: true },
  plasmashard: { name: '電離炸裂弾', en: 'PLASMA FISSION', aim: 'line', hidden: true, range: 10, speed: 30, radius: 0.8, dmg: 46, slow: 2, slowPct: 0.7 },
  voidrift: {
    name: 'ヴォイドの裂谷', en: 'VOID RIFT', aim: 'line', icon: 'beam', cd: 1.5, stock: { max: 2, every: 15 }, ai: 'beam',
    tele: 0.3, range: 9.5, radius: 0.9, dmg: 18,
    desc: '直線を裂き、0.25秒後に同じ場所が爆発する。2回ぶん溜めておける（15秒で1回ぶん戻る）。',
  },
  riftz: { name: 'ヴォイドの裂谷', en: 'VOID RIFT', aim: 'line', hidden: true, range: 9.5, radius: 0.9, dmg: 28, delay: 0.25 },
  tectonic: {
    name: '地殻砕裂', en: 'TECTONIC DISRUPTION', aim: 'ground', kind: 'blast', icon: 'blast', cd: 10,
    tele: 0.15, range: 7.2, aoe: 2.2, delay: 0.4, dmg: 44, kb: 8, tumble: 0.75, launch: 0.5, away: true,
    desc: '狙った場所を少し遅れて爆発させ、そこにいた相手を自分から遠ざかる向きへ跳ね飛ばす。',
  },
  liferay: {
    name: '生体破壊光線', en: 'LIFE FORM DISINTEGRATION RAY', aim: 'line', icon: 'star', cd: 0.13, ult: true, rapid: true,
    stream: { max: 2.6, cd: 2, gap: 0.3 }, range: 14.5, radius: 0.9, dmg: 11, slow: 1, slowPct: 0.2, turn: 0.22, every: 5,
    desc: '【必殺技】押している間（最大2.6秒）、カーソルをゆっくり追う貫通レーザーを撃ち続ける。その間は動けない。20%のスロウ。当て続けると分解も進む。',
  },
  // ---- TWIN PURIFIER (Lucian)
  lightslinger: { name: '二挺拳銃', en: 'LIGHTSLINGER', aim: 'self', hidden: true },
  piercinglight: {
    name: 'ピアシングライト', en: 'PIERCING LIGHT', aim: 'line', kind: 'beam', icon: 'beam', cd: 5,
    tele: 0.2, charge: 0.3, range: 9, radius: 0.8, dmg: 54,
    desc: '一瞬構えて、相手を貫く光線を撃つ。',
  },
  ardentblaze: {
    name: 'アーデントブレイズ', en: 'ARDENT BLAZE', aim: 'line', kind: 'shot', icon: 'cross', cd: 10,
    tele: 0.35, range: 8.2, speed: 32, radius: 0.8, dmg: 12, splash: 2.8, splashDmg: 34, markT: 6, rush: 1,
    desc: '当たるか射程の端で弾ける弾。巻き込んだ相手に6秒間の印を付け、印の相手に攻撃を当てるたびに少しの間加速する。',
  },
  lightslide: {
    name: 'スライド', en: 'RELENTLESS PURSUIT', aim: 'dash', kind: 'dash', icon: 'dash', cd: 14,
    dist: 4.4, minDist: 2.5, speed: 36, halt: true,
    desc: '狙った方向へ滑る。スキルのあとの2回当たる体当たりを決めるたびに、待ち時間が2秒縮む。',
  },
  culling: {
    name: '二挺掃射', en: 'THE CULLING', aim: 'line', icon: 'star', cd: 2, ult: true, re: 'cullstop', ai: 'shot',
    tele: 0.3, dur: 3, shots: 22, range: 13, speed: 44,
    desc: '【必殺技】3秒間、決めた方向へ撃ち続ける。撃ちながら動けて、Eも使える。もう一度押すと止める。',
  },
  cullstop: { name: '撃ち方やめ', en: 'CEASE FIRE', aim: 'self', hidden: true, free: true },
  cullshot: { name: '二挺掃射', en: 'THE CULLING', aim: 'line', hidden: true, range: 13, speed: 44, radius: 0.6, dmg: 9, kb: 0.6, tumble: 0, launch: 0 },
  // ---- STONE WEAVER (Taliyah)
  threadedvolley: {
    name: 'スレッドボレー', en: 'THREADED VOLLEY', aim: 'line', icon: 'shot', cd: 3, ai: 'shot',
    tele: 0.3, range: 9.2, speed: 34, shots: 5, every: 0.1, cdOn: 1.5,
    desc: '動きながら石を5発撃つ（1発目だけ重い）。足元の地面を加工する。加工した地面の上で使うと、スロウの付いた大きな石1発になり、待ち時間が半分になる。',
  },
  threadrock: { name: 'スレッドボレー', en: 'THREADED VOLLEY', aim: 'line', hidden: true, range: 9.2, speed: 34, radius: 0.6, dmg: 30, next: 0.4, kb: 1, tumble: 0, launch: 0 },
  bigrock: { name: 'スレッドボレー', en: 'THREADED VOLLEY', aim: 'line', hidden: true, range: 9.2, speed: 34, radius: 0.95, dmg: 54, slow: 1.5, slowPct: 0.4, kb: 3 },
  workedground: { name: '加工された地面', en: 'WORKED GROUND', aim: 'ground', kind: 'field', hidden: true, friendly: true, aoe: 3.6, dur: 20, max: 2 },
  seismicshove: {
    name: 'サイズミックシャーブ', en: 'SEISMIC SHOVE', aim: 'ground', icon: 'blast', cd: 8, drag: true, ai: 'ground',
    tele: 0.15, range: 8, aoe: 2.3, push: 4,
    desc: '押した位置に地点を決め、離した方向を向きにする。0.75秒後に地面が盛り上がり、そこにいた相手をその向きへ飛ばす。',
  },
  shovez: { name: 'サイズミックシャーブ', en: 'SEISMIC SHOVE', aim: 'ground', kind: 'blast', hidden: true, aoe: 2.3, delay: 0.75, kb: 11, tumble: 0.6 },
  unraveled: {
    name: 'アンレイベルアース', en: 'UNRAVELED EARTH', aim: 'cone', icon: 'cone', cd: 14, ai: 'cone',
    tele: 0.3, range: 7.5, half: 0.5, dmg: 40,
    desc: '扇状に岩をまく（4秒）。上にいる相手は20%のスロウ。突進や吹き飛ばしで岩の上を通った相手は爆発に巻き込まれ、スタンする。',
  },
  boulders: { name: 'アンレイベルアース', en: 'UNRAVELED EARTH', aim: 'cone', kind: 'field', hidden: true, range: 7.5, half: 0.5, aoe: 7.5, dur: 4, dmg: 36, stun: 1, slowPct: 0.2, again: 1 },
  weaverwall: {
    name: 'ウィーバーウォール', en: "WEAVER'S WALL", aim: 'line', icon: 'star', cd: 2, ult: true, re: 'wallstop', ai: 'none',
    tele: 0.4, len: 20, side: 1.7, speed: 17, dist: 20, minDist: 3, through: true, fly: true,
    desc: '【必殺技】狙った方向へアリーナを横切る岩の壁を4秒立て、そのわきを端まで滑る。途中でもう一度押すと降りる。壁はコマを通さない。',
  },
  wallstop: { name: '降りる', en: 'STEP OFF', aim: 'self', hidden: true, free: true },
  weaverz: { name: 'ウィーバーウォール', en: "WEAVER'S WALL", aim: 'ground', hidden: true, solid: true, grown: true, wall: 10, aoe: 1, dur: 4 },
  // ---- MAD DOCTOR (Dr. Mundo)
  canister: { name: '薬瓶', en: 'CANISTER', aim: 'ground', hidden: true, aoe: 0.9, dur: 7, heal: 0.04, cut: 15 },
  bonesaw: {
    name: '骨切りノコギリ', en: 'INFECTED BONESAW', aim: 'line', kind: 'shot', icon: 'shot', cd: 4,
    tele: 0.35, range: 9, speed: 34, radius: 0.8, dmg: 40, curPct: 0.15, slow: 2, slowPct: 0.4,
    desc: 'ノコギリを投げる。相手に残っている回転の15%（少なくとも一定量）を削り、2秒間40%のスロウにする。',
  },
  heartzapper: {
    name: '心臓ビリビリ', en: 'HEART ZAPPER', aim: 'self', kind: 'field', icon: 'field', cd: 15, re: 'zapburst',
    follow: true, dur: 3, aoe: 3.3, dps: 20, buff: 3, endDmg: 34, storeHeal: 0.5,
    desc: '3秒間、周囲を焼く。その間に受けたダメージの半分は灰色でゲージに残り、終わりの爆発で戻ってくる（爆発を当てれば全部、外せば半分）。もう一度押すとすぐ爆発する。',
  },
  zapburst: { name: '爆発', en: 'DISCHARGE', aim: 'self', hidden: true, free: true },
  blunttrauma: {
    name: '野蛮な痛み', en: 'BLUNT FORCE TRAUMA', aim: 'self', kind: 'buff', icon: 'burst', cd: 6,
    empower: 4, bonus: 22, selfMiss: 44, kb: 7,
    desc: '4秒以内の次の体当たりを強化する。自分の回転が減っているほど重くなる（7割減で最大）。',
  },
  maxdose: {
    name: 'マキシマム投与', en: 'MAXIMUM DOSAGE', aim: 'self', kind: 'buff', icon: 'star', cd: 2, ult: true, ai: 'recover',
    dur: 8,
    desc: '【必殺技】8秒間、回転がどんどん戻り（合計で最大値の35%）、足が速くなる。',
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
