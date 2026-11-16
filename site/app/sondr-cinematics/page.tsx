import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Sondr Cinematics · Dhruv Hardin",
  description: "Sondr Cinematics, a SONDR brand by Dhruv Hardin. Est. 2022.",
  openGraph: { title: "Sondr Cinematics · Dhruv Hardin", description: "Sondr Cinematics, a SONDR brand by Dhruv Hardin." },
};

/** Sondr Cinematics: the camera logo, centred, with the name under it in the site's display lettering (black). */
export default function Page() {
  return (
    <section className="brand-page">
      <Image
        className="brand-logo" src="/brands/sondr-cinematics.webp" alt="Sondr Cinematics logo: a hand-drawn camera"
        width={982} height={700} priority sizes="(max-width: 639px) 86vw, 46vw"
      />
      <h1 className="display-rough brand-name">Sondr Cinematics</h1>
    </section>
  );
}
