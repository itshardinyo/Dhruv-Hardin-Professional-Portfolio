import type { Metadata } from "next";
import CollabsSwitch from "@/components/site/collabs-switch";

export const metadata: Metadata = {
  title: "Collabs · Dhruv Hardin",
  description: "SONDR × Cortez and SONDR × Converse by D·Hardin: hand-drawn one-of-one pairs, in 3D.",
  openGraph: { title: "Collabs · Dhruv Hardin", description: "SONDR × Cortez and SONDR × Converse by D·Hardin: hand-drawn one-of-one pairs, in 3D." },
};

/**
 * Collabs: the SONDR × Cortez pair in 3D. The viewer is a self-contained page in public/collabs/
 * (viewer.html + viewer.js, the Cortez model cortez.glb, Dhruv's art in art/), embedded full-screen under the header.
 * Pair spins (drag to rotate) → click splits into left/right → click one for the dark full-screen view.
 */
export default function Page() {
  return (
    <div className="collabs-page">
      <h1 className="sr-only">Collabs: SONDR × Cortez and SONDR × Converse by D·Hardin</h1>
      <CollabsSwitch />
    </div>
  );
}
