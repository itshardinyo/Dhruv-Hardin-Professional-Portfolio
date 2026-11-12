/*
  Site music. Add tracks you have the rights to (your own, licensed, or royalty-free) as MP3s in public/music/ and
  list them here. The player starts when a visitor clicks "Tune in" (or on their first click/tap/keypress on any
  other page), keeps playing across every page, and loops through the list. Empty list = no player.
*/
export interface Track {
  src: string;
  title: string;
  artist?: string;
  /** cover art (square image in public/music/), shown in the player; the SONDR logo stands in until there is one */
  art?: string;
}

/** One cover for the whole playlist (Dhruv's black-and-white image with the SONDR logo). */
const COVER = "/music/art/cover.webp";

export const PLAYLIST: Track[] = [
  { src: "/music/brazil.mp3", title: "Brazil", artist: "Antonio Carlos Jobim", art: COVER },
  { src: "/music/waiting-in-vain.mp3", title: "Waiting in Vain", artist: "Bob Marley & The Wailers", art: COVER },
  { src: "/music/learning-to-fly.mp3", title: "Learning to Fly", artist: "Tom Petty and the Heartbreakers", art: COVER },
  { src: "/music/it-aint-easy.mp3", title: "It Ain't Easy", artist: "2Pac", art: COVER },
  { src: "/music/family-business.mp3", title: "Family Business", artist: "Kanye West", art: COVER },
  { src: "/music/fashion-killa.mp3", title: "Fashion Killa", artist: "A$AP Rocky", art: COVER },
];

/** A fresh random order of the playlist (Fisher–Yates). The player shuffles once per visit. */
export function shuffled<T>(list: readonly T[]): T[] {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Fired by the landing's "Tune in" click so the music starts on that exact gesture. */
export const MUSIC_START_EVENT = "sondr:music-start";
