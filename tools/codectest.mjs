// Round-trips match states through the snapshot codec and checks that the
// values a skill check depends on survive exactly.
import { BLADES, DIFFICULTY, KEYS } from '../src/config.js';
import { World } from '../src/sim.js';
import { CpuBrain } from '../src/ai.js';
import { encodeSnapshot, applySnapshot, packEvent, reviveEvent } from '../src/netcode.js';

let bad = 0;
const check = (ok, msg) => { if (!ok) { bad++; if (bad < 40) console.log('FAIL', msg); } };
const a = new World(BLADES.azure, BLADES.sol, 1), b = new World(BLADES.azure, BLADES.sol, 1);
for (let u = 0; u <= 100; u += 0.25) {
  a.tops[0].ult = u; a.tops[1].ult = 100 - u;
  applySnapshot(b, encodeSnapshot(a, { seq: 1, ack: 0, timeLeft: 60 }));
  for (const i of [0, 1]) {
    const src = a.tops[i].ult, got = b.tops[i].ult;
    check((src >= 100) === (got >= 100), `ult ${src} arrived as ${got}: "full" must match`);
    check(Math.abs(src - got) < 0.5, `ult ${src} arrived as ${got}`);
  }
}
for (const t of a.tops) { t.ult = 100; t.cd.Q = 0; t.cd.R = 0; t.tumble = 0; t.x = 1; t.z = 2 * (t.side ? -1 : 1); }
applySnapshot(b, encodeSnapshot(a, { seq: 2, ack: 0, timeLeft: 60 }));
for (const k of KEYS) for (const i of [0, 1]) check(a.canCast(a.tops[i], k) === b.canCast(b.tops[i], k), `canCast ${k} differs for top ${i}`);

// Every blade, mid-fight: bots play a round while each state is copied to a
// second world through the codec and compared field by field. A reader that
// falls out of step with the writer shows up at once as garbage.
const near = (x, y, tol) => Math.abs(x - y) <= tol;
const TOP = { x: 0.01, z: 0.01, vx: 0.01, vz: 0.01, spin: 0.03, tumble: 0.011, launch: 0.013, guard: 0.011, slow: 0.021, empower: 0.021, up: 0.011, ground: 0.011,
  mark: 0.021, scar: 0.013, poison: 0.011, bleed: 0, last: 0, bleedT: 0.026, shield: 1, shieldT: 0.021, buff: 0.051, stack: 0, stackT: 0.051, dmark: 0.017, dacc: 0.021,
  egg: 0.017, eggHp: 1, projN: 0, zoneN: 0, haste: 0.021, stun: 0.011, snare: 0.011, frost: 0.021, doom: 0.026, markK: 0, empN: 0, slowK: 0.006, charm: 0.011, pin: 0.011, store: 0.51, tag: 0, tagT: 0.041, perm: 0, charmDir: 0 };
const ids = Object.keys(BLADES);
let states = 0, biggest = 0, events = 0;
ids.forEach((id, n) => {
  const foe = ids[(n + 5) % ids.length];
  const w = new World(BLADES[id], BLADES[foe], 77 + n), m = new World(BLADES[id], BLADES[foe], 77 + n);
  const brains = w.tops.map((t) => new CpuBrain(w, t, DIFFICULTY[2]));
  for (const t of w.tops) t.ult = 100;
  for (let i = 0; i < 120 * 40 && !w.result; i++) {
    for (const br of brains) br.update(1 / 120);
    w.step(1 / 120);
    // Events must survive the trip too: anything that is not plain data has
    // to come back as the matching object on the other side.
    for (const e of w.events) {
      const back = reviveEvent(JSON.parse(JSON.stringify(packEvent(e))), m);
      events++;
      for (const k in e) {
        const v = e[k];
        if (v == null || typeof v !== 'object') continue;
        if ('blade' in v) check(back[k] === m.tops[v.side], `${e.type}.${k}: top lost`);
        else if ('aim' in v) check(back[k].id === v.id, `${e.type}.${k}: skill lost`);
        else check(back[k] && back[k].skill.id === v.skill.id, `${e.type}.${k}: object lost`);
      }
    }
    w.events.length = 0;
    if (i % 7) continue;
    const buf = encodeSnapshot(w, { seq: i, ack: 0, timeLeft: 30 });
    biggest = Math.max(biggest, buf.byteLength);
    applySnapshot(m, buf);
    states++;
    const tag = `${id} vs ${foe} @${w.time.toFixed(2)}`;
    w.tops.forEach((t, s) => {
      const o = m.tops[s];
      for (const f in TOP) check(near(f === 'spin' ? Math.max(0, t[f]) : t[f], o[f], TOP[f]), `${tag} top${s}.${f}: ${t[f]} -> ${o[f]}`);
      for (const k of KEYS) { check(near(t.cd[k], o.cd[k], 0.001), `${tag} top${s}.cd.${k}`); check(near(t.re[k], o.re[k], 0.051), `${tag} top${s}.re.${k}: ${t.re[k]} -> ${o.re[k]}`); }
      check(t.toggle === o.toggle && t.eggUsed === o.eggUsed, `${tag} top${s} flags`);
      for (const f of ['cmd', 'dash', 'blink', 'air', 'out', 'charge', 'orbs', 'tether', 'chan', 'ret', 'ret2', 'hold']) check(!!t[f] === !!o[f], `${tag} top${s}.${f} presence`);
      for (const f of ['dash', 'blink', 'air', 'charge', 'tether', 'chan']) if (t[f] && o[f]) check(t[f].skill === o[f].skill, `${tag} top${s}.${f}.skill`);
      if (t.dash && o.dash) check(t.dash.hit === o.dash.hit && near(t.dash.t, o.dash.t, 0.005), `${tag} top${s}.dash`);
      if (t.air && o.air) check(t.air.by === o.air.by && near(t.air.tx, o.air.tx, 0.01), `${tag} top${s}.air`);
      if (t.chan && o.chan) check(t.chan.n === o.chan.n && near(t.chan.dx, o.chan.dx, 0.001), `${tag} top${s}.chan`);
      if (t.ret && o.ret) check(near(t.ret.x, o.ret.x, 0.01), `${tag} top${s}.ret`);
      for (const k of KEYS) check(w.aimSkill(t, k) === m.aimSkill(o, k), `${tag} top${s} aimSkill ${k}`);
    });
    check(w.projectiles.length === m.projectiles.length, `${tag} projectile count`);
    w.projectiles.forEach((p, j) => {
      const q = m.projectiles[j];
      if (!q) return;
      check(p.id === q.id && p.skill.id === q.skill.id && p.owner.side === q.owner.side && p.hit === q.hit && p.back === q.back && p.crawl === q.crawl, `${tag} proj ${j} identity`);
      check(near(p.x, q.x, 0.01) && near(p.z, q.z, 0.01) && near(p.left, q.left, 0.001) && near(p.dmg, q.dmg, 0.006) && p.speed === q.speed && p.r === q.r, `${tag} proj ${j} values`);
    });
    check(w.zones.length === m.zones.length, `${tag} zone count`);
    w.zones.forEach((z, j) => {
      const q = m.zones[j];
      if (!q) return;
      check(z.id === q.id && z.kind === q.kind && z.skill === q.skill && z.owner.side === q.owner.side && z.c === q.c, `${tag} zone ${j} identity`);
      check(near(z.x, q.x, 0.01) && near(z.z, q.z, 0.01) && near(z.dx, q.dx, 0.01) && near(z.dz, q.dz, 0.01) && near(z.t, q.t, 0.001) && near(z.a, q.a, 0.006) && near(Math.max(0, z.b), q.b, 0.011) && z.T === q.T, `${tag} zone ${j} values (${z.kind})`);
    });
  }
});
console.log(`${states} states, ${events} events, largest snapshot ${biggest} bytes`);
console.log(bad ? `${bad} problem(s)` : 'codec OK');
process.exit(bad ? 1 : 0);
