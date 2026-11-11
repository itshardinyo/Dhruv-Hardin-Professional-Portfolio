"use client";

/*
  Site-wide music (lib/music.ts). Lives in the root layout, outside the pages, so it keeps playing as you move
  between pages. Browsers only allow sound after a gesture: it starts on the landing's "Tune in" click, or on the
  first click/tap/key on any page you land on directly. A small chip bottom-right shows the track with red
  equaliser bars and mutes/unmutes; the mute choice is remembered on this device. Hidden while the landing is up
  and when the playlist is empty.
*/

import * as React from "react";
import { PLAYLIST, MUSIC_START_EVENT } from "@/lib/music";
import { useIntro } from "@/components/intro/intro-controller";

const KEY = "sondr-music-muted";
const VOLUME = 0.45;

export function MusicPlayer() {
  const { state } = useIntro();
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [index, setIndex] = React.useState(0);
  const [playing, setPlaying] = React.useState(false);
  const [muted, setMuted] = React.useState(false);
  const startedRef = React.useRef(false);
  const mutedRef = React.useRef(false);

  React.useEffect(() => {
    let m = false;
    try { m = localStorage.getItem(KEY) === "1"; } catch {}
    mutedRef.current = m;
    setMuted(m);
  }, []);

  const fadeTo = React.useCallback((a: HTMLAudioElement, to: number, ms = 900) => {
    const from = a.volume, t0 = performance.now();
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / ms);
      a.volume = from + (to - from) * k;
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, []);

  const start = React.useCallback(() => {
    const a = audioRef.current;
    if (!a || startedRef.current || mutedRef.current || !PLAYLIST.length) return;
    startedRef.current = true;
    a.volume = 0;
    a.play().then(() => { setPlaying(true); fadeTo(a, VOLUME); }).catch(() => { startedRef.current = false; });
  }, [fadeTo]);

  // Start on "Tune in", or on the first gesture anywhere.
  React.useEffect(() => {
    if (!PLAYLIST.length) return;
    const onGesture = () => start();
    window.addEventListener(MUSIC_START_EVENT, onGesture);
    window.addEventListener("pointerdown", onGesture, { once: false });
    window.addEventListener("keydown", onGesture, { once: false });
    return () => {
      window.removeEventListener(MUSIC_START_EVENT, onGesture);
      window.removeEventListener("pointerdown", onGesture);
      window.removeEventListener("keydown", onGesture);
    };
  }, [start]);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    const next = !muted;
    setMuted(next);
    mutedRef.current = next;
    try { localStorage.setItem(KEY, next ? "1" : "0"); } catch {}
    if (next) { fadeTo(a, 0, 300); window.setTimeout(() => { a.pause(); setPlaying(false); }, 320); }
    else {
      startedRef.current = true;
      a.volume = 0;
      a.play().then(() => { setPlaying(true); fadeTo(a, VOLUME); }).catch(() => {});
    }
  };

  const next = () => setIndex((i) => (i + 1) % PLAYLIST.length);

  // Track change: keep playing if we were.
  React.useEffect(() => {
    const a = audioRef.current;
    if (!a || !startedRef.current || mutedRef.current) return;
    a.play().catch(() => {});
  }, [index]);

  if (!PLAYLIST.length) return null;
  const track = PLAYLIST[index];
  const hidden = state === "landing" || state === "leaving" || state === "returning";

  return (
    <>
      <audio ref={audioRef} src={track.src} preload="none" loop={PLAYLIST.length === 1} onEnded={next} />
      <div className={`mp ${hidden ? "mp-hidden" : ""}`}>
        <button type="button" className="mp-btn" onClick={toggle} aria-pressed={!muted}
          aria-label={muted || !playing ? `Play music: ${track.title}` : `Mute music: ${track.title}`}>
          <span className={`mp-eq ${playing && !muted ? "on" : ""}`} aria-hidden="true"><i /><i /><i /><i /></span>
          <span className="mp-title">{track.title}{track.artist ? ` · ${track.artist}` : ""}</span>
        </button>
        {PLAYLIST.length > 1 && (
          <button type="button" className="mp-btn mp-skip" onClick={next} aria-label="Next track">→</button>
        )}
      </div>
    </>
  );
}
