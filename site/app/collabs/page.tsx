import type { Metadata } from "next";

const DESC = "SONDR × Cortez and SONDR × Converse Star Player 76 by D·Hardin: hand-drawn one-of-one pairs, in 3D.";
export const metadata: Metadata = {
  title: "Shoe Collaborations · Dhruv Hardin",
  description: DESC,
  openGraph: { title: "Shoe Collaborations · Dhruv Hardin", description: DESC },
};

const PAIRS = [
  { key: "cortez", title: "SONDR × Cortez", src: "/collabs/cortez/viewer.html" },
  { key: "converse", title: "SONDR × Converse Star Player 76", src: "/collabs/converse/viewer.html" },
];

/**
 * Collabs: each pair is a self-contained 3D viewer page in public/collabs/ (Cortez: viewer.html; Converse: converse/viewer.html),
 * stacked one per screen; scroll down to go from one pair to the next.
 * Pair spins (drag to rotate) → click splits into left/right → click one for the dark full-screen view.
 */
export default function Page() {
  return (
    <div className="collabs-stack">
      <h1 className="sr-only">Shoe Collaborations: SONDR × Cortez and SONDR × Converse Star Player 76 by D·Hardin</h1>
      {PAIRS.map((p) => (
        <section key={p.key} className="collabs-page" aria-label={`${p.title} by D·Hardin`}>
          <iframe className="collabs-frame" src={p.src} title={`${p.title} by D·Hardin, 3D viewer`} allow="fullscreen" loading={p.key === "cortez" ? "eager" : "lazy"} />
        </section>
      ))}
    </div>
  );
}
