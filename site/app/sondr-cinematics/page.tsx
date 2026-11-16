import type { Metadata } from "next";
import Image from "next/image";
import { CategoryGallery } from "@/components/site/category-gallery";
import { CinematicsIntro } from "@/components/site/cinematics-intro";
import { CINEMATICS } from "@/lib/galleries";

export const metadata: Metadata = {
  title: "Sondr Cinematics · Dhruv Hardin",
  description: "Sondr Cinematics, a SONDR brand by Dhruv Hardin. Est. 2022.",
  openGraph: { title: "Sondr Cinematics · Dhruv Hardin", description: "Sondr Cinematics, a SONDR brand by Dhruv Hardin." },
};

/**
 * Sondr Cinematics: opens on Mr. Sondr walking (CinematicsIntro), then the page: camera logo + name,
 * then FRAMES and ANIMATIONS, laid out like /artsy (content in CINEMATICS, lib/galleries.ts).
 */
export default function Page() {
  return (
    <>
      <CinematicsIntro />
      <div className="gallery-page gallery-page--logo-led">
        <header className="brand-head">
          <Image
            className="brand-logo" src="/brands/sondr-cinematics-red.webp" alt="Sondr Cinematics logo: a hand-drawn camera"
            width={982} height={700} priority sizes="(max-width: 639px) 86vw, 46vw"
          />
          <h1 className="display-rough brand-name">Sondr Cinematics</h1>
        </header>
        {CINEMATICS.map((c) => (
          <CategoryGallery key={c.id} category={c} hint={false} />
        ))}
      </div>
    </>
  );
}
