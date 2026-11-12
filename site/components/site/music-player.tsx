"use client";

/*
  Site-wide music (tracks in lib/music.ts).
  - The order is shuffled once per visit (lib/music.ts shuffled()).
  - MusicProvider lives in the root layout, outside the pages, so the <audio> keeps playing between pages.
    Browsers only allow sound after a gesture: it starts on the landing's "Tune in" click, or on the first
    click/tap/key on any page you land on directly (unless the visitor paused it before; remembered on the device).
  - The spinning SONDR logo in the header is the player: one click opens MusicPanel (a dark now-playing card like
    Spotify/Apple Music: cover art, title, artist, seekable progress with elapsed/−remaining, ⏪ ❚❚ ⏩, volume, queue). A double click goes back to the TV
    landing ("closes" the site), as the logo did before.
*/

import * as React from "react";
import { PLAYLIST, MUSIC_START_EVENT, shuffled, type Track } from "@/lib/music";

const KEY = "sondr-music-paused";
const VOL_KEY = "sondr-music-volume";

interface MusicState {
  tracks: Track[];
  index: number;
  playing: boolean;
  time: number;
  duration: number;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  pick: (i: number) => void;
  seek: (t: number) => void;
  volume: number;
  setVolume: (v: number) => void;
}

const MusicContext = React.createContext<MusicState | null>(null);
export const useMusic = () => React.useContext(MusicContext);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  // Shuffled once per visit (after mount, so server and client render the same first).
  const [tracks, setTracks] = React.useState<Track[]>(PLAYLIST);
  React.useEffect(() => { setTracks(shuffled(PLAYLIST)); }, []);
  const [index, setIndex] = React.useState(0);
  const [playing, setPlaying] = React.useState(false);
  const [time, setTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const wantPlay = React.useRef(false); // keep playing when the track changes
  const autoStarted = React.useRef(false);
  const [volume, setVol] = React.useState(0.45);
  const volRef = React.useRef(0.45);
  React.useEffect(() => {
    let v = 0.45;
    try { const s = localStorage.getItem(VOL_KEY); if (s !== null) v = Math.min(1, Math.max(0, Number(s))); } catch {}
    volRef.current = v; setVol(v);
  }, []);
  const setVolume = React.useCallback((v: number) => {
    volRef.current = v; setVol(v);
    if (audioRef.current) audioRef.current.volume = v;
    try { localStorage.setItem(VOL_KEY, String(v)); } catch {}
  }, []);

  const fadeTo = React.useCallback((a: HTMLAudioElement, to: number, ms = 800) => {
    const from = a.volume, t0 = performance.now();
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / ms);
      a.volume = from + (to - from) * k;
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, []);

  const play = React.useCallback(() => {
    const a = audioRef.current;
    if (!a || !tracks.length) return;
    wantPlay.current = true;
    try { localStorage.setItem(KEY, "0"); } catch {}
    a.volume = 0;
    a.play().then(() => fadeTo(a, volRef.current)).catch(() => {});
  }, [fadeTo, tracks.length]);

  const pause = React.useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    wantPlay.current = false;
    try { localStorage.setItem(KEY, "1"); } catch {}
    fadeTo(a, 0, 250);
    window.setTimeout(() => a.pause(), 260);
  }, [fadeTo]);

  const toggle = React.useCallback(() => (playing ? pause() : play()), [playing, play, pause]);
  const pick = React.useCallback((i: number) => { wantPlay.current = true; setIndex(i); }, []);
  const next = React.useCallback(() => pick((index + 1) % Math.max(1, tracks.length)), [index, pick, tracks.length]);
  const prev = React.useCallback(() => {
    const a = audioRef.current;
    if (a && a.currentTime > 3) { a.currentTime = 0; return; } // like Spotify: restart first, then previous
    pick((index - 1 + tracks.length) % Math.max(1, tracks.length));
  }, [index, pick, tracks.length]);
  const seek = React.useCallback((t: number) => { const a = audioRef.current; if (a) a.currentTime = t; }, []);

  // First gesture anywhere (or the "Tune in" click) starts the music, unless the visitor paused it before.
  React.useEffect(() => {
    if (!tracks.length) return;
    const onGesture = () => {
      if (autoStarted.current) return;
      autoStarted.current = true;
      let paused = false;
      try { paused = localStorage.getItem(KEY) === "1"; } catch {}
      if (!paused) play();
    };
    window.addEventListener(MUSIC_START_EVENT, onGesture);
    window.addEventListener("pointerdown", onGesture);
    window.addEventListener("keydown", onGesture);
    return () => {
      window.removeEventListener(MUSIC_START_EVENT, onGesture);
      window.removeEventListener("pointerdown", onGesture);
      window.removeEventListener("keydown", onGesture);
    };
  }, [play, tracks.length]);

  // New track: keep playing if we were.
  React.useEffect(() => {
    const a = audioRef.current;
    if (a && wantPlay.current) { a.volume = volRef.current; a.play().catch(() => {}); }
  }, [index]);

  const value = React.useMemo<MusicState>(
    () => ({ tracks, index, playing, time, duration, toggle, next, prev, pick, seek, volume, setVolume }),
    [tracks, index, playing, time, duration, toggle, next, prev, pick, seek, volume, setVolume],
  );

  return (
    <MusicContext.Provider value={value}>
      {children}
      {tracks.length > 0 && (
        <audio
          ref={audioRef}
          src={tracks[index].src}
          preload="none"
          loop={tracks.length === 1}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => { setTime(0); setDuration(e.currentTarget.duration || 0); }}
          onDurationChange={(e) => setDuration(e.currentTarget.duration || 0)}
          onEnded={next}
        />
      )}
    </MusicContext.Provider>
  );
}

const fmt = (s: number) => {
  if (!isFinite(s) || s < 0) s = 0;
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = Math.floor(s % 60);
  return h ? `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}` : `${m}:${String(sec).padStart(2, "0")}`;
};

/** The drop-down under the logo: now playing, progress, controls, queue. */
export function MusicPanel({ open, onClose, anchorId }: { open: boolean; onClose: () => void; anchorId: string }) {
  const m = useMusic();
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (ref.current?.contains(t) || document.getElementById(anchorId)?.contains(t)) return;
      onClose();
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("pointerdown", onDown); document.removeEventListener("keydown", onKey); };
  }, [open, onClose, anchorId]);

  if (!open || !m) return null;
  const track = m.tracks[m.index];
  const pct = m.duration ? (m.time / m.duration) * 100 : 0;

  return (
    <div ref={ref} className="mp-panel" role="dialog" aria-label="Music player" data-lenis-prevent>
      <div className={`mp-art ${track?.art ? "has-art" : "mp-art-empty"}`}>
        {track?.art ? <img key={track.art} src={track.art} alt="" /> : <img src="/logo-mark-black.png" alt="" className="mp-art-logo" />}
      </div>
      {track ? (
        <>
          <div className="mp-meta">
            <div className="mp-now-text">
              <div className="mp-title">{track.title}</div>
              {track.artist && <div className="mp-artist">{track.artist}</div>}
            </div>
            <span className={`mp-eq ${m.playing ? "on" : ""}`} aria-hidden="true"><i /><i /><i /><i /><i /></span>
          </div>
          <input
            className="mp-bar" type="range" min={0} max={m.duration || 0} step={1} value={Math.min(m.time, m.duration || 0)}
            onChange={(e) => m.seek(Number(e.target.value))} aria-label="Seek" style={{ ["--mp-pct" as string]: `${pct}%` }}
          />
          <div className="mp-times"><span>{fmt(m.time)}</span><span>−{fmt(Math.max(0, m.duration - m.time))}</span></div>
          <div className="mp-controls">
            <button type="button" onClick={m.prev} aria-label="Previous">
              <svg viewBox="0 0 48 28" aria-hidden="true"><path d="M23 2 L2 14 L23 26 Z M46 2 L25 14 L46 26 Z" fill="currentColor" /></svg>
            </button>
            <button type="button" className="mp-play" onClick={m.toggle} aria-label={m.playing ? "Pause" : "Play"}>
              {m.playing
                ? <svg viewBox="0 0 28 34" aria-hidden="true"><rect x="2" y="1" width="8" height="32" rx="2" fill="currentColor" /><rect x="18" y="1" width="8" height="32" rx="2" fill="currentColor" /></svg>
                : <svg viewBox="0 0 28 34" aria-hidden="true"><path d="M3 1 L27 17 L3 33 Z" fill="currentColor" /></svg>}
            </button>
            <button type="button" onClick={m.next} aria-label="Next">
              <svg viewBox="0 0 48 28" aria-hidden="true"><path d="M2 2 L23 14 L2 26 Z M25 2 L46 14 L25 26 Z" fill="currentColor" /></svg>
            </button>
          </div>
          <div className="mp-vol">
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 6h3l4-3v10l-4-3H2z" fill="currentColor" /></svg>
            <input
              className="mp-bar" type="range" min={0} max={1} step={0.01} value={m.volume}
              onChange={(e) => m.setVolume(Number(e.target.value))} aria-label="Volume" style={{ ["--mp-pct" as string]: `${m.volume * 100}%` }}
            />
            <svg viewBox="0 0 22 16" aria-hidden="true"><path d="M2 6h3l4-3v10l-4-3H2z" fill="currentColor" /><path d="M12 5c1.5 1.5 1.5 4.5 0 6M15 3c3 2.5 3 7.5 0 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          </div>
          {m.tracks.length > 1 && (
            <ol className="mp-queue">
              {m.tracks.map((t, i) => (
                <li key={t.src}>
                  <button type="button" className={i === m.index ? "on" : ""} onClick={() => m.pick(i)}>
                    <span className="mp-q-t">{t.title}</span>
                    {t.artist && <span className="mp-q-a">{t.artist}</span>}
                  </button>
                </li>
              ))}
            </ol>
          )}
        </>
      ) : (
        <p className="mp-empty">No tracks yet.</p>
      )}
    </div>
  );
}
