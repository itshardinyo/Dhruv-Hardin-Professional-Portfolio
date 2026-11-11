"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useIntro } from "@/components/intro/intro-controller";

/*
  The hero (hero-mockup.png), drawn in mockup pixels: 1u = one pixel of the 1512×982 frame.
  Dots, each headline line, the signature and Mr. Sondr are separate elements so each can be animated on its own.
  Scrolling toward the footer: line 1 rises 8vh, line 2 14vh, the dots and signature fade out, all over the
  first screen of scrolling (or the whole scroll distance to the footer when that is shorter).
*/
export function Hero() {
  const { reduced } = useIntro();
  const { scrollY } = useScroll();
  const [range, setRange] = React.useState({ dist: 1, vh: 1 });
  React.useEffect(() => {
    const set = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setRange({ dist: Math.max(1, Math.min(window.innerHeight, max)), vh: window.innerHeight });
    };
    set();
    window.addEventListener("resize", set);
    const ro = new ResizeObserver(set);
    ro.observe(document.body);
    return () => { window.removeEventListener("resize", set); ro.disconnect(); };
  }, []);
  const p = useTransform(scrollY, (y) => (reduced ? 0 : Math.min(1, Math.max(0, y / range.dist))));
  const y1 = useTransform(p, (v) => -v * 0.08 * range.vh);
  const y2 = useTransform(p, (v) => -v * 0.14 * range.vh);
  const fade = useTransform(p, (v) => 1 - v);

  return (
    <section className="hero" aria-labelledby="headline">
      <div className="hero-body">
        <motion.div className="dots" aria-hidden="true" style={{ opacity: fade }}>
          <i />
          <i />
          <i />
        </motion.div>
        <h1 className="headline" id="headline" tabIndex={-1}>
          <motion.span className="line l1" style={{ y: y1 }}>
            <span className="txt">You’ve reached,</span>
          </motion.span>{" "}
          <motion.span className="line l2" style={{ y: y2 }}>
            <span className="txt">Dhruv Hardin.</span>
          </motion.span>
        </h1>
      </div>
      {/* Mr. Sondr (black outline of DESIGN/MR_SONDR.png), opposite the signature. Comes last in the entrance: pops up with
          a cigarette, blows a puff of smoke, smiles, then keeps smoking slowly. */}
      <motion.div className="mr-sondr" style={{ opacity: fade }} aria-hidden="true">
        <svg viewBox="0 380 1640 1980" preserveAspectRatio="xMidYMax meet">
          <defs>
            <filter id="ms-brush" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="7" result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="6" />
            </filter>
          </defs>
          <image href="/mr-sondr-outline.webp" x="0" y="380" width="1640" height="1980" />
          {/* the drawing ran off its canvas on the right: finish the shoulder and sleeve */}
          <g filter="url(#ms-brush)" fill="none" stroke="#000" strokeWidth="28" strokeLinecap="round">
            <path d="M1626 1980 C1700 2030 1762 2120 1798 2250 C1810 2300 1816 2340 1820 2420" />
            <path d="M1572 2092 C1610 2112 1640 2134 1668 2172" />
          </g>
          <image className="ms-mouth" href="/mr-sondr-mouth.webp" x="661" y="1264" width="139" height="166" />
          <g className="ms-hand" transform="translate(975 1345) scale(1.8)">
            <g className="ms-hand-move">
              {/* arm + hand silhouette (white, hides the face lines behind it) */}
              <path fill="#fff" d="M-40 70 C-50 20 -45 -40 -30 -75 C-20 -92 0 -88 10 -66 C22 -96 46 -96 50 -70 C56 -40 54 -10 54 0 C78 -12 98 6 92 30 C112 32 122 52 110 78 C112 120 98 152 74 172 L180 700 L-60 700 L14 166 C-20 150 -42 120 -42 92 C-72 74 -80 40 -60 24 C-50 20 -42 40 -40 70 Z" />
              <g filter="url(#ms-brush)" fill="none" stroke="#000" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round">
                <path d="M-40 70 C-50 20 -45 -40 -30 -75 C-20 -92 0 -88 4 -66" />
                <path d="M6 -40 C8 -10 6 15 8 42" />
                <path d="M12 -64 C22 -96 46 -96 50 -70 C55 -38 53 -8 52 22" />
                <path d="M58 -2 C80 -12 98 6 92 30" />
                <path d="M96 34 C114 34 122 54 110 78" />
                <path d="M110 84 C112 122 98 150 72 170" />
                <path d="M-40 84 C-72 74 -80 40 -60 24 C-50 18 -40 32 -36 44" />
                <path d="M-38 100 C-36 130 -14 152 14 166" />
                <path d="M14 172 C0 260 -24 400 -40 600" />
                <path d="M74 178 C100 260 140 400 170 600" />
                <path d="M-14 112 L-2 96" strokeWidth="10" />
                <path d="M30 120 L44 108" strokeWidth="10" />
              </g>
              {/* cigarette: from the corner of his mouth, out between the fingers */}
              <g filter="url(#ms-brush)">
                <path d="M-100 -2 L46 -26 L49 -8 L-97 14 Z" fill="#fff" stroke="#000" strokeWidth="9" strokeLinejoin="round" />
                <path className="ms-ember" d="M46 -26 L72 -30 L75 -12 L49 -8 Z" fill="#F80A02" stroke="#000" strokeWidth="9" strokeLinejoin="round" />
              </g>
              {/* smoke drifting off the tip */}
              <g className="ms-smoke" fill="none" stroke="#000" strokeWidth="5" strokeLinecap="round">
                <path d="M82 -40 C62 -90 112 -120 88 -170 C68 -210 114 -240 94 -290 C80 -320 104 -350 92 -380" />
                <path d="M88 -44 C112 -96 72 -130 102 -180 C126 -220 86 -260 112 -310 C128 -340 104 -370 118 -400" />
                <path d="M78 -42 C52 -80 86 -110 64 -150 C46 -184 76 -210 60 -246 C50 -270 70 -296 58 -320" />
              </g>
            </g>
          </g>
          {/* the slow exhale in the loop */}
          <g className="ms-exhale" fill="none" stroke="#000" strokeWidth="9" strokeLinecap="round">
            <path pathLength={1} d="M780 1330 C730 1290 770 1240 720 1190 C670 1140 730 1090 690 1030 C660 985 700 940 670 890" />
            <path pathLength={1} d="M770 1340 C700 1340 690 1290 630 1270 C570 1250 590 1190 540 1160 C500 1135 520 1090 490 1060" />
            <path pathLength={1} d="M790 1325 C800 1270 760 1230 790 1170 C820 1110 780 1070 800 1010 C812 970 790 940 800 900" />
          </g>
        </svg>
      </motion.div>
      {/* his first puff: smoke from his mouth drifting out over the headline */}
      <div className="ms-puff" aria-hidden="true">
        <svg viewBox="0 0 1150 600" fill="none" stroke="#000" strokeWidth="4" strokeLinecap="round">
          <path pathLength={1} d="M0 300 C80 260 140 330 230 280 S380 200 470 250 S640 330 760 240 S960 160 1100 220" />
          <path pathLength={1} d="M0 304 C70 330 160 360 260 330 S430 380 560 340 S760 300 880 360 S1020 420 1120 380" />
          <path pathLength={1} d="M8 292 C90 220 170 210 230 160 S360 120 430 170 S560 140 640 100 S800 60 900 110" />
          <path pathLength={1} d="M8 310 C100 380 200 440 320 430 S500 500 620 470 S780 520 900 480" />
          <path pathLength={1} d="M380 280 c-40 -40 30 -80 60 -40 s-10 60 -40 40" />
          <path pathLength={1} d="M700 330 c-40 -40 30 -80 60 -40 s-10 60 -40 40" />
          <path pathLength={1} d="M520 180 c-30 -30 25 -60 45 -30 s-8 45 -30 30" />
          <path pathLength={1} d="M860 250 c-34 -34 28 -70 52 -36 s-9 52 -34 36" />
        </svg>
      </div>
      <motion.div className="sig" style={{ opacity: fade }}>
        <Image src="/signature.png" alt="Dhruv Hardin’s signature" width={1005} height={345} priority sizes="(max-width: 639px) 160px, 21vw" />
      </motion.div>
    </section>
  );
}
