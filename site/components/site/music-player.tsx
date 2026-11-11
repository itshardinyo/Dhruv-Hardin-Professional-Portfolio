"use client";

/*
  Site-wide music (tracks in lib/music.ts).
  - MusicProvider lives in the root layout, outside the pages, so the <audio> keeps playing between pages.
    Browsers only allow sound after a gesture: it starts on the landing's "Tune in" click, or on the first
    click/tap/key on any page you land on directly (unless the visitor paused it before; remembered on the device).
  - The spinning SONDR logo in the header is the player: one click opens MusicPanel (a Spotify-like drop-down:
    track, artist, seekable progress, previous/play-pause/next, the queue). A double click goes back to the TV
    landing ("closes" the site), as the logo did before.
*/

import * as React from "react";
import { PLAYLIST, MUSIC_START_EVENT, type Track } from "@/lib/music";

const KEY = "sondr-music-paused";
const VOLUME = 0.45;

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
}

const MusicContext = React.createContext<MusicState | null>(null);
export const useMusic = () => React.useContext(MusicContext);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [index, setIndex] = React.useState(0);
  const [playing, setPlaying] = React.useState(false);
  const [time, setTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const wantPlay = React.useRef(false); // keep playing when the track changes
  const autoStarted = React.useRef(false);

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
    if (!a || !PLAYLIST.length) return;
    wantPlay.current = true;
    try { localStorage.setItem(KEY, "0"); } catch {}
    a.volume = 0;
    a.play().then(() => fadeTo(a, VOLUME)).catch(() => {});
  }, [fadeTo]);

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
  const next = React.useCallback(() => pick((index + 1) % Math.max(1, PLAYLIST.length)), [index, pick]);
  const prev = React.useCallback(() => {
    const a = audioRef.current;
    if (a && a.currentTime > 3) { a.currentTime = 0; return; } // like Spotify: restart first, then previous
    pick((index - 1 + PLAYLIST.length) % Math.max(1, PLAYLIST.length));
  }, [index, pick]);
  const seek = React.useCallback((t: number) => { const a = audioRef.current; if (a) a.currentTime = t; }, []);

  // First gesture anywhere (or the "Tune in" click) starts the music, unless the visitor paused it before.
  React.useEffect(() => {
    if (!PLAYLIST.length) return;
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
  }, [play]);

  // New track: keep playing if we were.
  React.useEffect(() => {
    const a = audioRef.current;
    if (a && wantPlay.current) { a.volume = VOLUME; a.play().catch(() => {}); }
  }, [index]);

  const value = React.useMemo<MusicState>(
    () => ({ tracks: PLAYLIST, index, playing, time, duration, toggle, next, prev, pick, seek }),
    [index, playing, time, duration, toggle, next, prev, pick, seek],
  );

  return (
    <MusicContext.Provider value={value}>
      {children}
      {PLAYLIST.length > 0 && (
        <audio
          ref={audioRef}
          src={PLAYLIST[index].src}
          preload="none"
          loop={PLAYLIST.length === 1}
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
      <div className="mp-label">{!m.tracks.length ? "Music" : m.playing ? "Now playing" : "Paused"}</div>
      {track ? (
        <>
          <div className="mp-now">
            <span className={`mp-eq ${m.playing ? "on" : ""}`} aria-hidden="true"><i /><i /><i /><i /></span>
            <div className="mp-now-text">
              <div className="mp-title">{track.title}</div>
              {track.artist && <div className="mp-artist">{track.artist}</div>}
            </div>
          </div>
          <div className="mp-progress">
            <input
              type="range" min={0} max={m.duration || 0} step={1} value={Math.min(m.time, m.duration || 0)}
              onChange={(e) => m.seek(Number(e.target.value))}
              aria-label="Seek" style={{ ["--mp-pct" as string]: `${pct}%` }}
            />
            <div className="mp-times"><span>{fmt(m.time)}</span><span>{fmt(m.duration)}</span></div>
          </div>
          <div className="mp-controls">
            <button type="button" onClick={m.prev} aria-label="Previous">⏮</button>
            <button type="button" className="mp-play" onClick={m.toggle} aria-label={m.playing ? "Pause" : "Play"}>
              {m.playing ? "❚❚" : "▶"}
            </button>
            <button type="button" onClick={m.next} aria-label="Next">⏭</button>
          </div>
          {m.tracks.length > 1 && (
            <ol className="mp-queue">
              {m.tracks.map((t, i) => (
                <li key={t.src}>
                  <button type="button" className={i === m.index ? "on" : ""} onClick={() => m.pick(i)}>
                    <span className="mp-q-n">{i + 1}</span>
                    <span className="mp-q-t">{t.title}</span>
                    {t.artist && <span className="mp-q-a">{t.artist}</span>}
                  </button>
                </li>
              ))}
            </ol>
          )}
        </>
      ) : (
        <p className="mp-empty">No tracks yet. Coming soon.</p>
      )}
      <p className="mp-hint">Double-click the logo to go back to the TV.</p>
    </div>
  );
}
