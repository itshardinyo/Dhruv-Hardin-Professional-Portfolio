/** Dhruv's brands, listed in the side menu the header SONDR logo opens (one click). A new brand = one entry here + its page in app/. */
export type Brand = { slug: string; name: string; logo: string; width: number; height: number };

export const BRANDS: Brand[] = [
  { slug: "sondr-cinematics", name: "Sondr Cinematics", logo: "/brands/sondr-cinematics.webp", width: 982, height: 700 },
];
