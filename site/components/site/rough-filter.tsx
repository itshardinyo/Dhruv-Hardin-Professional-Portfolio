"use client";

import * as React from "react";

/*
  The rough, speckled letter edges: an SVG turbulence + displacement filter used on live text (filter: url(#rough)).
  Displacement is 3.4% of the hero headline's font size, clamped to 2.5–7.5px.
*/
export function RoughFilter() {
  const mapRef = React.useRef<SVGFEDisplacementMapElement>(null);
  React.useEffect(() => {
    const set = () => {
      const el = document.querySelector<HTMLElement>(".hero-body") ?? document.querySelector<HTMLElement>(".display-rough");
      const u = Math.min(window.innerWidth / 1512, window.innerHeight / 982);
      const fs = el ? parseFloat(getComputedStyle(el).fontSize) : 190 * u;
      mapRef.current?.setAttribute("scale", Math.min(7.5, Math.max(2.5, fs * 0.034)).toFixed(2));
    };
    set();
    window.addEventListener("resize", set);
    void document.fonts?.ready.then(set);
    const mo = new MutationObserver(set);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { window.removeEventListener("resize", set); mo.disconnect(); };
  }, []);
  return (
    <svg className="svg-defs" aria-hidden="true" focusable="false">
      <filter id="rough" x="-10%" y="-20%" width="120%" height="140%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves={2} seed={11} result="n" />
        <feDisplacementMap ref={mapRef} in="SourceGraphic" in2="n" scale="6" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  );
}
