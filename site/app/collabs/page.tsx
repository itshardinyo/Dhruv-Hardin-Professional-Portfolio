import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Collabs · Dhruv Hardin",
  description: "SONDR × Cortez by D·Hardin: a hand-drawn one-of-one Nike Cortez pair, in 3D.",
  openGraph: { title: "Collabs · Dhruv Hardin", description: "SONDR × Cortez by D·Hardin: a hand-drawn one-of-one Nike Cortez pair, in 3D." },
};

/**
 * Collabs: the SONDR × Cortez pair in 3D. The viewer is a self-contained page in public/collabs/
 * (viewer.html + viewer.js, the Cortez model cortez.glb, Dhruv's art in art/), embedded full-screen under the header.
 * Pair spins (drag to rotate) → click splits into left/right → click one for the dark full-screen view.
 */
export default function Page() {
  return (
    <div className="collabs-page">
      <h1 className="sr-only">Collabs: SONDR × Cortez by D·Hardin</h1>
      <iframe className="collabs-frame" src="/collabs/viewer.html" title="SONDR × Cortez by D·Hardin, 3D viewer" allow="fullscreen" />
    </div>
  );
}
