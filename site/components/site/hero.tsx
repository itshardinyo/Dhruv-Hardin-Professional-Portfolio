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
          a cigarette, smiles, then keeps smoking slowly; the smoke always rises straight up. */}
      <motion.div className="mr-sondr" style={{ opacity: fade }} aria-hidden="true">
        <svg viewBox="0 380 1640 1980" preserveAspectRatio="xMidYMax meet">
          <defs>
            <filter id="ms-brush" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="7" result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="6" />
            </filter>
            {/* a rising plume of smoke (from Dhruv's reference): billowing grey puffs, darker grey shading, black outline,
                curl at the top, a few loose droplets. Base at (100, 360). */}
            <symbol id="ms-plume" viewBox="0 0 200 360" overflow="visible">
              <g filter="url(#ms-brush)">
                <g fill="none" stroke="#000" strokeWidth="12"><circle cx="100" cy="345" r="10" /><circle cx="96" cy="325" r="12" /><circle cx="104" cy="305" r="14" /><circle cx="98" cy="282" r="17" /><circle cx="88" cy="255" r="22" /><circle cx="112" cy="245" r="20" /><circle cx="100" cy="222" r="26" /><circle cx="78" cy="205" r="24" /><circle cx="122" cy="200" r="26" /><circle cx="95" cy="170" r="32" /><circle cx="60" cy="160" r="26" /><circle cx="135" cy="155" r="30" /><circle cx="80" cy="125" r="34" /><circle cx="125" cy="115" r="32" /><circle cx="100" cy="90" r="30" /><circle cx="60" cy="95" r="22" /><circle cx="150" cy="85" r="20" /><circle cx="95" cy="55" r="24" /><circle cx="128" cy="50" r="18" /></g>
                <path d="M74 40 C40 30 45 -5 80 -5 C102 -4 104 18 86 20" fill="none" stroke="#000" strokeWidth="22" strokeLinecap="round" />
                <g fill="#8C8C8C"><circle cx="100" cy="345" r="10" /><circle cx="96" cy="325" r="12" /><circle cx="104" cy="305" r="14" /><circle cx="98" cy="282" r="17" /><circle cx="88" cy="255" r="22" /><circle cx="112" cy="245" r="20" /><circle cx="100" cy="222" r="26" /><circle cx="78" cy="205" r="24" /><circle cx="122" cy="200" r="26" /><circle cx="95" cy="170" r="32" /><circle cx="60" cy="160" r="26" /><circle cx="135" cy="155" r="30" /><circle cx="80" cy="125" r="34" /><circle cx="125" cy="115" r="32" /><circle cx="100" cy="90" r="30" /><circle cx="60" cy="95" r="22" /><circle cx="150" cy="85" r="20" /><circle cx="95" cy="55" r="24" /><circle cx="128" cy="50" r="18" /></g>
                <path d="M74 40 C40 30 45 -5 80 -5 C102 -4 104 18 86 20" fill="none" stroke="#8C8C8C" strokeWidth="11" strokeLinecap="round" />
                <g fill="#5E5E5E"><circle cx="106" cy="250" r="10" /><circle cx="110" cy="208" r="12" /><circle cx="104" cy="178" r="14" /><circle cx="142" cy="162" r="12" /><circle cx="132" cy="122" r="14" /><circle cx="106" cy="97" r="12" /><circle cx="100" cy="62" r="10" /><circle cx="72" cy="132" r="10" /><circle cx="66" cy="166" r="8" /></g>
                <g fill="#5E5E5E" stroke="#000" strokeWidth="3"><circle cx="40" cy="200" r="6" /><circle cx="165" cy="190" r="5" /><circle cx="30" cy="120" r="5" /><circle cx="175" cy="120" r="4" /><circle cx="45" cy="40" r="4" /><circle cx="160" cy="30" r="5" /><circle cx="150" cy="240" r="3" /></g>
              </g>
            </symbol>
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
              {/* smoke rising off the tip */}
              <g className="ms-smoke">
                <g><use href="#ms-plume" x="38" y="-176" width="80" height="144" /></g>
                <g><use href="#ms-plume" x="34" y="-190" width="88" height="158" /></g>
              </g>
            </g>
          </g>
          {/* the slow exhale: a plume out of the corner of his mouth, rising up and drifting off his face */}
          <g className="ms-exhale">
            <g className="ms-exhale-lean"><use href="#ms-plume" x="700" y="944" width="230" height="414" /></g>
          </g>
        </svg>
      </motion.div>
      <motion.div className="sig" style={{ opacity: fade }}>
        <Image src="/signature.png" alt="Dhruv Hardin’s signature" width={1005} height={345} priority sizes="(max-width: 639px) 160px, 21vw" />
      </motion.div>
    </section>
  );
}
