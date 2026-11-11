import type { Metadata } from "next";
import { MrSondrArt } from "@/components/site/mr-sondr";

export const metadata: Metadata = {
  title: "About me · Dhruv Hardin",
  description: "Dhruv Hardin is a simple Human Being. He has big dreams, creative ambitions, and above all, he tries.",
};

/*
  About me: Mr. Sondr bottom-left (same art as the hero) in headphones: lights up, smokes, nods to the music, the title top-right and the bio
  under it. The copy is Dhruv's own words; edit it here.
*/
export default function Page() {
  return (
    <section className="about">
      <div className="mr-sondr" aria-hidden="true">
        <MrSondrArt vibing />
      </div>
      <div className="about-body">
        <h1 className="display-rough about-title">About me</h1>
        <div className="about-text">
          <p>
            Dhruv Hardin is a simple Human Being. He has big dreams, creative ambitions, and above all, he tries.
          </p>
          <blockquote className="about-quote">
            <p>
              “Change is always apprehensive. But everything falls in place. Quicker than you think. All will be good.
              Trust yourself and all the good in you.”
            </p>
            <footer>— Robin Hardin</footer>
          </blockquote>
          <figure className="about-rating">
            <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
              <filter id="ms-brush-crown" x="-10%" y="-10%" width="120%" height="120%">
                <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="2" seed="4" result="n" />
                <feDisplacementMap in="SourceGraphic" in2="n" scale="3.5" />
              </filter>
            </svg>
            <div className="about-stars" role="img" aria-label="Six crowns out of five">
              {Array.from({ length: 6 }, (_, i) => (
                <svg key={i} viewBox="0 0 120 92" aria-hidden="true">
                  {/* Dhruv's crown (original): loose black ink, five points, three horizontal lines across it */}
                  <g fill="none" stroke="#000" strokeLinecap="round" strokeLinejoin="round" filter="url(#ms-brush-crown)">
                    <path d="M14 84 L10 22 L32 48 L46 14 L60 42 L74 14 L88 48 L110 22 L106 84 Z" fill="#fff" strokeWidth="7" />
                    <path d="M14 58 L106 58 M13 68 L107 68 M13 77 L107 77" strokeWidth="4.5" />
                  </g>
                </svg>
              ))}
            </div>
            <div className="about-reviews">
              <blockquote>Physical discipline.</blockquote>
              <blockquote>Emotional discipline.</blockquote>
              <blockquote>Financial discipline.</blockquote>
              <blockquote>Mental discipline.</blockquote>
              <blockquote>Professional discipline.</blockquote>
            </div>
          </figure>
          <p className="about-sondr">
            <strong>Sondr</strong> is the deep realization that each person has a life as complex, ambitious, and rich in
            depth as you do.
          </p>
        </div>
      </div>
    </section>
  );
}
