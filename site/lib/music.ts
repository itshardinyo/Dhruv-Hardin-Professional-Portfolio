/*
  Site music. Add tracks you have the rights to (your own, licensed, or royalty-free) as MP3s in public/music/ and
  list them here. The player starts when a visitor clicks "Tune in" (or on their first click/tap/keypress on any
  other page), keeps playing across every page, and loops through the list. Empty list = no player.
*/
export interface Track { src: string; title: string; artist?: string }

export const PLAYLIST: Track[] = [
  { src: "/music/just-one-more-drink.mp3", title: "Just One More Drink", artist: "Jazz Noir" },
];

/** Fired by the landing's "Tune in" click so the music starts on that exact gesture. */
export const MUSIC_START_EVENT = "sondr:music-start";
