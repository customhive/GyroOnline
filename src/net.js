// Peer-to-peer session. PeerJS's public broker introduces the browsers; after
// that everything flows directly between them over WebRTC. The host holds one
// link to each guest; a guest holds one link, to the host.
//
// Each link uses two channels:
//   - PeerJS's own data connection: reliable and ordered, for lobby messages,
//     inputs and events (things that must arrive, in order).
//   - a second, unreliable and unordered channel for snapshots and pings, so a
//     lost packet never holds up the newer ones behind it.
import { Peer } from 'peerjs';
import { PKT_PING, PKT_PONG, encodePing, packetType, pingTime, toBase64, fromBase64 } from './netcode.js';

const PREFIX = 'gyroclash-online-2-';
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O, 1/I
const STATE_CHANNEL_ID = 77;
const BACKLOG_LIMIT = 16 * 1024;
const MAX_GUESTS = 3;

export const randomCode = () => Array.from({ length: 6 }, () => ALPHABET[(Math.random() * ALPHABET.length) | 0]).join('');
export const cleanCode = (s) => (s || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);

// One connection to one other browser.
class Link {
  constructor(net, id, conn) {
    this.net = net; this.id = id; this.conn = conn; this.ch = null;
    this.up = false;
    this.rtt = 0.08; this.jitter = 0; this.rttKnown = false;
    this.lastHeard = 0; this.pingT = 0;
  }

  get fast() { return !!(this.ch && this.ch.readyState === 'open'); }
  get congested() { return this.fast && this.ch.bufferedAmount > BACKLOG_LIMIT / 4; }

  // Both sides create the same pre-agreed channel, so no extra signalling is needed.
  openStateChannel() {
    try {
      const ch = this.conn.peerConnection.createDataChannel('gc-state', { negotiated: true, id: STATE_CHANNEL_ID, ordered: false, maxRetransmits: 0 });
      ch.binaryType = 'arraybuffer';
      ch.onmessage = (m) => { this.lastHeard = performance.now(); if (m.data instanceof ArrayBuffer) this.receive(m.data); };
      this.ch = ch;
    } catch { this.ch = null; }
  }

  receive(buf) {
    const net = this.net;
    net.stats.in++; net.stats.bytesIn += buf.byteLength;
    const type = packetType(buf);
    if (type === PKT_PING) { this.sendPacket(encodePing(PKT_PONG, pingTime(buf))); return; }
    if (type === PKT_PONG) {
      const s = Math.max(0, (performance.now() - pingTime(buf)) / 1000);
      if (!this.rttKnown) { this.rtt = s; this.rttKnown = true; }
      else { this.jitter = this.jitter * 0.85 + Math.abs(s - this.rtt) * 0.15; this.rtt = this.rtt * 0.85 + s * 0.15; }
      return;
    }
    net.h.packet(buf, this.id);
  }

  send(obj) {
    const c = this.conn, net = this.net;
    if (!c || !c.open) return;
    net.stats.out++;
    if (net.sim) net.later(true, () => { if (c.open) c.send(obj); }); else c.send(obj);
  }

  // Unreliable send. Returns false when the packet was dropped on purpose
  // because the channel is backed up (sending more would only add delay).
  sendPacket(buf) {
    const net = this.net;
    if (!this.up) return false;
    if (net.sim) {
      if (Math.random() < net.sim.loss) return true;
      const ch = this.ch;
      net.later(false, () => { try { if (ch && ch.readyState === 'open') ch.send(buf); } catch { /* closed meanwhile */ } });
    } else if (this.fast) {
      if (this.ch.bufferedAmount > BACKLOG_LIMIT) return false;
      try { this.ch.send(buf); } catch { return false; }
    } else {
      this.send({ t: 'b', d: toBase64(buf) });
    }
    net.stats.out++; net.stats.bytesOut += buf.byteLength;
    return true;
  }
}

export class Net {
  // handlers: status(state, detail), open(id), message(obj, id), packet(arrayBuffer, id), closed(reason, id)
  // `id` says which link it was: a guest has one (0); the host has one for each guest.
  constructor(handlers) {
    this.h = handlers;
    this.peer = null; this.links = []; this.nextId = 0;
    this.role = null; this.code = '';
    this.joinTimer = 0;
    this.sim = null;
    this.stats = { out: 0, in: 0, bytesOut: 0, bytesIn: 0, lost: 0, rateOut: 0, rateIn: 0, t: 0, lastOut: 0, lastIn: 0 };
  }

  // The first link: all there is for a guest, and what the status line reads.
  get link() { return this.links.find((l) => l.up) || this.links[0] || null; }
  get connected() { return this.links.some((l) => l.up); }
  get fast() { const l = this.link; return !!(l && l.fast); }
  get congested() { return this.links.some((l) => l.congested); }
  get rtt() { const l = this.link; return l ? l.rtt : 0.08; }
  get jitter() { const l = this.link; return l ? l.jitter : 0; }
  get rttKnown() { const l = this.link; return !!(l && l.rttKnown); }
  byId(id) { return this.links.find((l) => l.id === id) || null; }

  host() {
    this.role = 'host';
    this.openRoom(randomCode());
  }

  openRoom(code) {
    this.code = code;
    const peer = (this.peer = new Peer(PREFIX + code));
    peer.on('open', () => this.h.status('waiting', code));
    peer.on('connection', (c) => {
      if (this.links.length >= MAX_GUESTS) {
        c.on('open', () => { c.send({ t: 'full' }); setTimeout(() => c.close(), 400); });
        return;
      }
      this.attach(c);
    });
    peer.on('error', (err) => {
      if (err.type === 'unavailable-id' && !this.links.length) { peer.destroy(); this.openRoom(randomCode()); return; }
      if (err.type === 'peer-unavailable') return;
      if (!this.connected) this.fail(err.type);
    });
    // Losing the broker does not affect a link that is already up; it only
    // matters for letting someone (re)join, so quietly reconnect.
    peer.on('disconnected', () => { if (!peer.destroyed) setTimeout(() => { if (!peer.destroyed) peer.reconnect(); }, 1500); });
  }

  join(code) {
    this.role = 'guest';
    this.code = code;
    const peer = (this.peer = new Peer());
    peer.on('open', () => {
      this.h.status('connecting', code);
      this.attach(peer.connect(PREFIX + code, { reliable: true, serialization: 'json' }));
      this.joinTimer = setTimeout(() => { if (!this.connected) this.fail('timeout'); }, 20000);
    });
    peer.on('error', (err) => { if (!this.connected) this.fail(err.type); });
  }

  attach(c) {
    const link = new Link(this, this.nextId++, c);
    this.links.push(link);
    c.on('open', () => {
      clearTimeout(this.joinTimer);
      link.up = true;
      link.lastHeard = performance.now();
      link.openStateChannel();
      this.h.open(link.id);
    });
    c.on('data', (d) => {
      link.lastHeard = performance.now();
      if (!d || typeof d !== 'object') return;
      // Fallback path for binary packets when the fast channel is not available.
      if (d.t === 'b' && typeof d.d === 'string') { try { link.receive(fromBase64(d.d)); } catch { /* malformed */ } return; }
      this.h.message(d, link.id);
    });
    c.on('close', () => this.drop('close', link.id));
    c.on('error', () => this.drop('error', link.id));
  }

  // Reliable send: to one link, or to everyone.
  send(obj, id) {
    for (const l of this.links) if (id === undefined || l.id === id) l.send(obj);
  }

  // Test aid (?lag=100&jitter=20&loss=5): pretend the link is slow and lossy.
  // Reliable messages are only delayed and kept in order; packets may also vanish.
  simulate(lagMs, jitterMs, lossPct) {
    this.sim = { lag: lagMs / 2, jitter: jitterMs, loss: lossPct / 100, last: 0, queue: [] };
  }
  // Delayed sends are released from update(), not from timers, because
  // browsers slow timers right down in a tab that is not in front.
  later(ordered, fn) {
    const s = this.sim;
    let at = performance.now() + s.lag + Math.random() * s.jitter;
    if (ordered) { at = Math.max(at, s.last + 0.01); s.last = at; }
    s.queue.push({ at, fn });
  }

  // Unreliable send, to one link or to everyone. False if it went to nobody.
  sendPacket(buf, id) {
    let sent = false;
    for (const l of this.links) if (id === undefined || l.id === id) sent = l.sendPacket(buf) || sent;
    return sent;
  }

  update(dt) {
    if (!this.connected) return;
    const now = performance.now();
    if (this.sim && this.sim.queue.length) {
      const due = this.sim.queue.filter((q) => q.at <= now);
      this.sim.queue = this.sim.queue.filter((q) => q.at > now);
      for (const q of due) q.fn();
    }
    for (const l of [...this.links]) {
      if (!l.up) continue;
      l.pingT -= dt;
      if (l.pingT <= 0) { l.pingT = l.rttKnown ? 0.5 : 0.15; l.sendPacket(encodePing(PKT_PING, now)); }
      if (now - l.lastHeard > 8000) this.drop('timeout', l.id);
    }
    const st = this.stats;
    st.t += dt;
    if (st.t >= 1) {
      st.rateOut = (st.bytesOut - st.lastOut) / st.t; st.rateIn = (st.bytesIn - st.lastIn) / st.t;
      st.lastOut = st.bytesOut; st.lastIn = st.bytesIn; st.t = 0;
    }
  }

  // Closes one link (the first, if none is named).
  drop(reason, id) {
    const link = id === undefined ? this.link : this.byId(id);
    if (!link) return;
    this.links = this.links.filter((l) => l !== link);
    const was = link.up;
    link.up = false;
    try { link.conn.close(); } catch { /* already gone */ }
    try { if (link.ch) link.ch.close(); } catch { /* already gone */ }
    if (was) this.h.closed(reason, link.id);
    else if (this.role === 'guest') this.fail(reason);
  }

  fail(reason) {
    clearTimeout(this.joinTimer);
    this.h.status('failed', reason);
  }

  leave() {
    clearTimeout(this.joinTimer);
    const links = this.links;
    this.links = [];
    for (const l of links) { l.up = false; try { l.conn.send({ t: 'bye' }); } catch { /* not open */ } }
    setTimeout(() => { try { if (this.peer) this.peer.destroy(); } catch { /* gone */ } this.peer = null; }, 150);
    this.role = null;
  }
}
