"use client";
import { useState } from "react";

const PAIRS = [
  { key: "cortez", label: "SONDR × Cortez", src: "/collabs/viewer.html" },
  { key: "converse", label: "SONDR × Converse", src: "/collabs/converse/viewer.html" },
];

/** Collabs: one 3D viewer at a time, with a small switch between the pairs. */
export default function CollabsSwitch() {
  const [i, setI] = useState(0);
  const p = PAIRS[i];
  return (
    <>
      <iframe key={p.key} className="collabs-frame" src={p.src} title={`${p.label} by D·Hardin, 3D viewer`} allow="fullscreen" />
      <nav className="collabs-switch" aria-label="Choose a collab">
        {PAIRS.map((q, k) => (
          <button key={q.key} type="button" aria-pressed={k === i} className={k === i ? "on" : ""} onClick={() => setI(k)}>{q.label}</button>
        ))}
      </nav>
    </>
  );
}
