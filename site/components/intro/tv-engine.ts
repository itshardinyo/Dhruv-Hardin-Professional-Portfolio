/*
  TV engine: the HBO-style opener, ported from design/tv-intro-reference.html.

  States: warming → intro → idle → leave
          still (reduced motion), off.
  - warming:  0.3s of empty landing background
  - intro:    tube warm-up (done by the Landing component), static, the patch forms out of the snow, RGB split,
              glitch slices, glint. FULL lands at rest at ~3.8s from load, SHORT (header replay) in ~1.2s.
  - idle:     the patch at rest with a faint shimmer and the odd glitch; hovering it glitches harder (RGB split,
              a little static). Waits for a click, tap or Enter.
  - leave:    a short burst of static (the Landing then collapses the CRT to a line and opens the hero)

  Static, scanlines, vignette and the glow and colour fringes are the TV look and the only place where colours
  outside the palette (greys, tints, transparency) are allowed.
*/

export type TvState = "boot" | "warming" | "intro" | "idle" | "leave" | "still" | "off";

type Timeline = {
  ch: number; P: number[]; E: number[]; A: number[]; L: number[]; N: number[]; S: number[]; SL: number[]; SW: number[];
  idle: number;
};

// Opener timeline in ms from the moment the static fills the screen (reference values).
// A snow · P red snow in the patch · E white snow in the embroidery · L the real patch · N snow over the patch
// S RGB split · SL glitch slices · SW glint sweep
const FULL: Timeline = { ch: 150, P: [750, 1250, 1900, 2450], E: [950, 1450, 1850, 2350], A: [1750, 2350], L: [1600, 2350],
  N: [1650, 2600], S: [1600, 2500], SL: [1650, 2300], SW: [2500, 3300], idle: 3300 };
const squeeze = (tl: Timeline, off: number, k: number): Timeline => {
  const o = {} as Record<string, number | number[]>;
  for (const [key, v] of Object.entries(tl)) o[key] = Array.isArray(v) ? v.map((x) => Math.max(0, (x - off) * k)) : Math.max(0, (v - off) * k);
  return o as unknown as Timeline;
};
// Header replay: no blank beat or warm-up, the patch forms in about 1.2s.
const SHORT = squeeze(FULL, 450, 0.42);

const BASE = "#1E1E1E";
const STATIC_TINT = "#ff4a3a"; // multiplies the grey snow inside the patch so it reads red (TV effect only)
const NF = 6, PAD = 48;

const clamp = (v: number, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
const ramp = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const eo = (x: number) => 1 - (1 - x) * (1 - x) * (1 - x);
const mk = (w: number, h: number) => {
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(w)); c.height = Math.max(1, Math.round(h));
  return c;
};

export interface TvCallbacks {
  onChannel?: (on: boolean) => void; // show/hide the "CH 22" OSD
  onIdle?: () => void; // the patch is at rest: show "CLICK TO TUNE IN"
}

export class TvEngine {
  state: TvState = "boot";
  private ctx: CanvasRenderingContext2D;
  private TL: Timeline = FULL;
  private W = 0; private H = 0; private dpr = 1;
  lx = 0; ly = 0; lw = 0; lh = 0;
  private NW = 0; private NH = 0; private noise: HTMLCanvasElement[] = [];
  private tmp!: HTMLCanvasElement; private tx!: CanvasRenderingContext2D;
  private emblem!: HTMLCanvasElement; private sil!: HTMLCanvasElement; private chans: HTMLCanvasElement[] = [];
  private patchS!: HTMLCanvasElement; private emblemS!: HTMLCanvasElement;
  private t0 = 0; private stateT = 0; private raf = 0; private nextGlitch = 0; private glitchUntil = 0;
  private chOn = false;
  hover = false;

  constructor(private cv: HTMLCanvasElement, private logo: HTMLImageElement, private cb: TvCallbacks = {}) {
    this.ctx = cv.getContext("2d")!;
    this.layers();
    this.size();
  }

  /* ---------- canvas layers ---------- */
  private layers() {
    const logo = this.logo;
    const s = Math.min(1, 1200 / logo.naturalWidth);
    const w = Math.round(logo.naturalWidth * s), h = Math.round(logo.naturalHeight * s);
    const base = mk(w, h), bx = base.getContext("2d", { willReadFrequently: true })!;
    bx.drawImage(logo, 0, 0, w, h);
    this.emblem = mk(w, h); // white embroidery only: the part that forms out of the static first
    const img = bx.getImageData(0, 0, w, h), d = img.data;
    for (let p = 0; p < d.length; p += 4) {
      const m = Math.min(d[p], d[p + 1], d[p + 2]);
      d[p + 3] = d[p + 3] * clamp((m - 120) / 80);
      d[p] = d[p + 1] = d[p + 2] = 255;
    }
    this.emblem.getContext("2d")!.putImageData(img, 0, 0);
    this.sil = mk(w, h); // black silhouette + one canvas per colour channel, for RGB-split glitches
    const sx = this.sil.getContext("2d")!;
    sx.drawImage(base, 0, 0); sx.globalCompositeOperation = "source-in"; sx.fillStyle = "#000"; sx.fillRect(0, 0, w, h);
    this.chans = ["#f00", "#0f0", "#00f"].map((col) => {
      const c = mk(w, h), x = c.getContext("2d")!;
      x.drawImage(base, 0, 0);
      x.globalCompositeOperation = "multiply"; x.fillStyle = col; x.fillRect(0, 0, w, h);
      x.globalCompositeOperation = "destination-in"; x.drawImage(base, 0, 0);
      return c;
    });
  }

  size() {
    const { logo } = this;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2); // capped at 2x
    this.W = window.innerWidth; this.H = window.innerHeight;
    const { W, H, dpr } = this;
    this.cv.width = Math.round(W * dpr); this.cv.height = Math.round(H * dpr);
    const ar = logo.naturalWidth / logo.naturalHeight;
    this.lw = Math.min(W * 0.9, H * 0.74 * ar); this.lh = this.lw / ar; // patch: 90% of width or 74% of height
    this.lx = (W - this.lw) / 2; this.ly = (H - this.lh) / 2;
    const g = Math.max(2, Math.round(W / 800)); // 2px grain
    const nw = Math.ceil(W / g), nh = Math.ceil(H / g);
    if (nw !== this.NW || nh !== this.NH || !this.noise.length) { this.NW = nw; this.NH = nh; this.makeNoise(); }
    this.tmp = mk(this.lw / 2, this.lh / 2); this.tx = this.tmp.getContext("2d")!;
    this.patchS = mk(this.tmp.width, this.tmp.height); this.patchS.getContext("2d")!.drawImage(logo, 0, 0, this.tmp.width, this.tmp.height);
    this.emblemS = mk(this.tmp.width, this.tmp.height); this.emblemS.getContext("2d")!.drawImage(this.emblem, 0, 0, this.tmp.width, this.tmp.height);
    if (this.state === "still") this.drawStill();
  }

  // Pre-baked frames of analog snow: 2px grain, a little horizontal smear, per-line gain.
  private makeNoise() {
    this.noise = [];
    const w = this.NW + PAD, h = this.NH + PAD;
    for (let f = 0; f < NF; f++) {
      const c = mk(w, h), x = c.getContext("2d")!, img = x.createImageData(w, h), d = img.data;
      let p = 0;
      for (let y = 0; y < h; y++) {
        const row = 0.72 + Math.random() * 0.42;
        let prev = Math.random() * 255;
        for (let i = 0; i < w; i++, p += 4) {
          let v = Math.random() * 255 * 0.68 + prev * 0.32;
          prev = v;
          v = ((v - 128) * 1.45 + 128) * row;
          d[p] = d[p + 1] = d[p + 2] = v;
          d[p + 3] = 255;
        }
      }
      x.putImageData(img, 0, 0);
      this.noise.push(c);
    }
  }

  private pick = () => this.noise[(Math.random() * NF) | 0];
  private jit = () => (Math.random() * PAD) | 0;

  private clearTube(bg = BASE) {
    const { ctx, dpr, W, H } = this;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  }

  private drawNoise(a: number) {
    const { ctx } = this;
    ctx.globalAlpha = a; ctx.imageSmoothingEnabled = false;
    ctx.drawImage(this.pick(), this.jit(), this.jit(), this.NW, this.NH, 0, 0, this.W, this.H);
    ctx.globalAlpha = 1;
  }

  private maskedNoise(mask: HTMLCanvasElement, a: number, mode: GlobalCompositeOperation, tint?: string) {
    const { tx, tmp, ctx, W, H, NW, NH, lx, ly, lw, lh } = this;
    const tw = tmp.width, th = tmp.height;
    tx.globalCompositeOperation = "source-over"; tx.globalAlpha = 1; tx.imageSmoothingEnabled = false;
    tx.drawImage(this.pick(), this.jit() + (lx / W) * NW, this.jit() + (ly / H) * NH, (lw / W) * NW, (lh / H) * NH, 0, 0, tw, th);
    if (tint) { tx.globalCompositeOperation = "multiply"; tx.fillStyle = tint; tx.fillRect(0, 0, tw, th); }
    tx.globalCompositeOperation = "destination-in"; tx.drawImage(mask, 0, 0);
    tx.globalCompositeOperation = "source-over";
    ctx.globalCompositeOperation = mode; ctx.globalAlpha = a; ctx.imageSmoothingEnabled = false;
    ctx.drawImage(tmp, lx, ly, lw, lh);
    ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
  }

  private drawLogo(a: number, s: number, slices: boolean) {
    const { ctx, logo, lx, ly, lw, lh } = this;
    ctx.globalAlpha = a; ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
    if (slices) {
      const nw = logo.naturalWidth, nh = logo.naturalHeight, n = 4 + ((Math.random() * 7) | 0);
      let y = 0;
      for (let i = 0; i < n && y < nh; i++) {
        const hh = i === n - 1 ? nh - y : Math.min(nh - y, Math.max(6, ((Math.random() * 2 * nh) / n) | 0));
        const off = Math.random() < 0.55 ? (Math.random() - 0.5) * lw * 0.07 : 0;
        ctx.drawImage(logo, 0, y, nw, hh, lx + off, ly + (y / nh) * lh, lw, (hh / nh) * lh);
        y += hh;
      }
    } else if (s < 0.5) {
      ctx.drawImage(logo, lx, ly, lw, lh);
    } else {
      ctx.drawImage(this.sil, lx, ly, lw, lh);
      ctx.globalCompositeOperation = "lighter";
      ctx.drawImage(this.chans[0], lx - s, ly, lw, lh);
      ctx.drawImage(this.chans[1], lx, ly, lw, lh);
      ctx.drawImage(this.chans[2], lx + s, ly + s * 0.25, lw, lh);
      ctx.globalCompositeOperation = "source-over";
    }
    ctx.globalAlpha = 1;
  }

  // The glint that runs across the patch once it has resolved.
  private sweep(p: number) {
    const { tx, tmp, ctx, lx, ly, lw, lh } = this;
    const tw = tmp.width, th = tmp.height;
    tx.globalCompositeOperation = "source-over"; tx.globalAlpha = 1;
    tx.clearRect(0, 0, tw, th);
    const c = -0.25 + p * 1.5, g = tx.createLinearGradient(0, 0, tw, th * 0.6);
    g.addColorStop(clamp(c - 0.14), "rgba(255,255,255,0)");
    g.addColorStop(clamp(c), "rgba(255,255,255,0.5)");
    g.addColorStop(clamp(c + 0.14), "rgba(255,255,255,0)");
    tx.fillStyle = g; tx.fillRect(0, 0, tw, th);
    tx.globalCompositeOperation = "destination-in"; tx.imageSmoothingEnabled = true; tx.drawImage(this.patchS, 0, 0);
    tx.globalCompositeOperation = "source-over";
    ctx.globalCompositeOperation = "lighter"; ctx.imageSmoothingEnabled = true;
    ctx.drawImage(tmp, lx, ly, lw, lh);
    ctx.globalCompositeOperation = "source-over";
  }

  /* ---------- the loop ---------- */
  private frame = (now: number) => {
    this.raf = requestAnimationFrame(this.frame);
    const st = this.state;
    let A = 0, P = 0, E = 0, L = 0, N = 0, s = 0, sl = false, sw = -1, fl = 0;
    if (st === "intro") {
      const T = this.TL, t = now - this.t0;
      A = 1 - eo(ramp(t, T.A[0], T.A[1]));
      P = eo(ramp(t, T.P[0], T.P[1])) * (1 - ramp(t, T.P[2], T.P[3]));
      E = 0.9 * eo(ramp(t, T.E[0], T.E[1])) * (1 - ramp(t, T.E[2], T.E[3]));
      L = eo(ramp(t, T.L[0], T.L[1]));
      N = 0.85 * (1 - eo(ramp(t, T.N[0], T.N[1])));
      s = 16 * (1 - eo(ramp(t, T.S[0], T.S[1]))) * (0.5 + Math.random());
      sl = t > T.SL[0] && t < T.SL[1] && Math.random() < 0.22;
      if (t > T.SW[0] && t < T.SW[1]) sw = (t - T.SW[0]) / (T.SW[1] - T.SW[0]);
      if (t > T.ch && !this.chOn) { this.chOn = true; this.cb.onChannel?.(true); }
      if (t > T.idle) { this.state = "idle"; this.nextGlitch = now + 2400; this.cb.onIdle?.(); }
    } else if (st === "idle") {
      A = this.hover ? 0.09 : 0.035; L = 1;
      N = this.hover ? 0.08 + Math.random() * 0.12 : 0.025;
      s = this.hover ? 2 + Math.random() * 5 : 0;
      sl = this.hover && Math.random() < 0.08;
      fl = Math.random() * 0.05;
      if (now > this.nextGlitch) { this.glitchUntil = now + 120; this.nextGlitch = now + 2600 + Math.random() * 3400; }
      if (now < this.glitchUntil) { s = Math.max(s, 6); sl = Math.random() < 0.6; N = Math.max(N, 0.2); }
    } else if (st === "leave") {
      const t = now - this.stateT;
      A = eo(ramp(t, 0, 200)); L = 1;
      N = 0.25 + 0.65 * ramp(t, 0, 220);
      s = 6 + 22 * Math.random() * ramp(t, 0, 200);
      sl = Math.random() < 0.55;
    } else {
      return;
    }
    this.clearTube();
    if (A > 0.004) this.drawNoise(A);
    if (P > 0.004) this.maskedNoise(this.patchS, P, "source-over", STATIC_TINT);
    if (E > 0.004) this.maskedNoise(this.emblemS, E, "lighter");
    if (L > 0.004) this.drawLogo(L, s, sl);
    if (N > 0.004 && L > 0.004) this.maskedNoise(this.patchS, N * L, "source-over");
    if (sw >= 0) this.sweep(sw);
    if (fl > 0) { this.ctx.fillStyle = "rgba(0,0,0," + fl.toFixed(3) + ")"; this.ctx.fillRect(0, 0, this.W, this.H); }
  };

  private loop() { if (!this.raf) this.raf = requestAnimationFrame(this.frame); }

  /** First load: 0.3s of empty background, then the opener (the Landing runs the tube warm-up on the screen element). */
  warm(onScreenOn: () => void) {
    this.state = "warming";
    this.clearTube();
    window.setTimeout(() => {
      if (this.state !== "warming") return;
      this.TL = FULL; this.t0 = performance.now() + 260; this.state = "intro";
      onScreenOn();
      this.loop();
    }, 300);
  }

  /** Header replay: straight into the static, no blank pause or warm-up. */
  short() {
    this.chOn = false; this.cb.onChannel?.(false);
    this.TL = SHORT; this.t0 = performance.now(); this.state = "intro";
    this.loop();
  }

  leave() { this.state = "leave"; this.stateT = performance.now(); this.loop(); }

  drawStill() { this.state = "still"; this.clearTube(); this.drawLogo(1, 0, false); }

  stop() { cancelAnimationFrame(this.raf); this.raf = 0; this.state = "off"; }
}

/* ---------- sound: a burst of static and a CRT thunk (peaks at 0.07 and 0.1 gain, i.e. ≤10% volume) ---------- */
let ac: AudioContext | null = null;
export function staticSound() {
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    ac = ac || new AC(); if (ac.state === "suspended") void ac.resume();
    const t = ac.currentTime, sr = ac.sampleRate, len = Math.floor(sr * 0.7);
    const buf = ac.createBuffer(1, len, sr), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = ac.createBufferSource(); src.buffer = buf;
    const hp = ac.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 700;
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.07, t + 0.02);
    g.gain.setValueAtTime(0.07, t + 0.22);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
    src.connect(hp); hp.connect(g); g.connect(ac.destination);
    src.start(t); src.stop(t + 0.7);
    const o = ac.createOscillator(), og = ac.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(140, t + 0.22); o.frequency.exponentialRampToValueAtTime(38, t + 0.5);
    og.gain.setValueAtTime(0.0001, t + 0.21); og.gain.exponentialRampToValueAtTime(0.1, t + 0.24); og.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
    o.connect(og); og.connect(ac.destination); o.start(t + 0.2); o.stop(t + 0.6);
  } catch { /* sound is optional */ }
}
