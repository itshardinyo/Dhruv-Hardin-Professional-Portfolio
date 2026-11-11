/*
  Mr. Sondr: the black outline traced from DESIGN/MR_SONDR.png, the cigarette in his mouth, the realistic smoke,
  and (entrance only, under html.go) his hand coming up with the SONDR Zippo to light it. Used on the hero and on
  /about. Place it inside an element with class "mr-sondr"; all motion lives in app/globals.css (ms-* rules).
  The smoking loop starts after --ms-loop (5.3s on the hero, sooner on /about).
*/
export function MrSondrArt() {
  return (
    <svg viewBox="0 380 1640 1980" preserveAspectRatio="xMidYMax meet">
      <defs>
        <filter id="ms-brush" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="6" />
        </filter>
        {/* realistic smoke: soft grey ribbons pushed around by slowly shifting noise, then blurred */}
        <filter id="ms-smokefx" x="-80%" y="-30%" width="260%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="0.018 0.045" numOctaves="3" seed="3" result="t">
            <animate attributeName="baseFrequency" dur="11s" values="0.018 0.045;0.024 0.055;0.018 0.045" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="t" scale="26" xChannelSelector="R" yChannelSelector="G" />
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
        <filter id="ms-smokefx-big" x="-80%" y="-40%" width="260%" height="180%">
          <feTurbulence type="fractalNoise" baseFrequency="0.008 0.02" numOctaves="3" seed="9" result="t">
            <animate attributeName="baseFrequency" dur="13s" values="0.008 0.02;0.012 0.026;0.008 0.02" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="t" scale="90" xChannelSelector="R" yChannelSelector="G" />
          <feGaussianBlur stdDeviation="15" />
        </filter>
        {/* smoke thins out as it rises */}
        <linearGradient id="ms-fade" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#fff" />
          <stop offset=".45" stopColor="#fff" />
          <stop offset="1" stopColor="#000" />
        </linearGradient>
        <mask id="ms-fade-mask" maskContentUnits="objectBoundingBox">
          <rect width="1" height="1" fill="url(#ms-fade)" />
        </mask>
        <filter id="ms-glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="14" /></filter>
      </defs>
      <image href="/mr-sondr-outline.webp" x="0" y="380" width="1640" height="1980" />
      {/* the drawing ran off its canvas on the right: finish the shoulder and sleeve */}
      <g filter="url(#ms-brush)" fill="none" stroke="#000" strokeWidth="28" strokeLinecap="round">
        <path d="M1626 1980 C1700 2030 1762 2120 1798 2250 C1810 2300 1816 2340 1820 2420" />
        <path d="M1572 2092 C1610 2112 1640 2134 1668 2172" />
      </g>
      <image className="ms-mouth" href="/mr-sondr-mouth.webp" x="661" y="1264" width="139" height="166" />
      <g transform="translate(975 1345) scale(1.8)">
        {/* the cigarette, in the corner of his mouth the whole time */}
        <g className="ms-cig">
          <g filter="url(#ms-brush)">
            <path d="M-100 -2 L46 -26 L49 -8 L-97 14 Z" fill="#fff" stroke="#000" strokeWidth="9" strokeLinejoin="round" />
            <path d="M46 -26 L72 -30 L75 -12 L49 -8 Z" fill="#fff" stroke="#000" strokeWidth="9" strokeLinejoin="round" />
            <path className="ms-ember" d="M46 -26 L72 -30 L75 -12 L49 -8 Z" fill="#F80A02" stroke="#000" strokeWidth="9" strokeLinejoin="round" />
          </g>
          {/* a thin stream of smoke rising off the tip, curling and thinning out */}
          <g className="ms-smoke" mask="url(#ms-fade-mask)">
            <g filter="url(#ms-smokefx)" fill="none" stroke="#7D7D7D" strokeLinecap="round">
              <path pathLength={100} strokeWidth="7" d="M76 -28 C60 -70 96 -110 80 -160 C64 -210 104 -250 86 -300 C70 -350 100 -390 84 -440" />
              <path pathLength={100} strokeWidth="6" d="M78 -28 C96 -80 66 -120 88 -170 C110 -220 74 -270 96 -320 C116 -370 86 -400 104 -450" />
              <path pathLength={100} strokeWidth="4" d="M74 -30 C56 -60 74 -100 60 -140 C46 -180 70 -220 54 -270" />
            </g>
          </g>
        </g>
        {/* entrance only: his hand comes up with a SONDR Zippo, flicks it open, lights the tip, then drops away */}
        <g className="ms-lighter">
          <g transform="translate(70 0) scale(1.5) translate(-70 0)">
            <circle className="ms-flame-glow" cx="68" cy="-4" r="26" fill="#F80A02" opacity=".35" filter="url(#ms-glow)" />
            {/* wrist (white, hides what's behind it) */}
            <path fill="#fff" d="M24 420 L40 112 L120 112 L140 420 Z" />
            <g filter="url(#ms-brush)" stroke="#000" strokeLinecap="round" strokeLinejoin="round">
              {/* open lid, standing up on the hinge side */}
              <rect x="98" y="-38" width="26" height="66" rx="4" fill="#fff" strokeWidth="9" />
              {/* chimney with its holes, and the wheel */}
              <rect x="52" y="4" width="40" height="24" fill="#fff" strokeWidth="9" />
              <circle cx="62" cy="12" r="2.4" fill="#000" strokeWidth="0" />
              <circle cx="72" cy="12" r="2.4" fill="#000" strokeWidth="0" />
              <circle cx="82" cy="12" r="2.4" fill="#000" strokeWidth="0" />
              <circle cx="67" cy="21" r="2.4" fill="#000" strokeWidth="0" />
              <circle cx="77" cy="21" r="2.4" fill="#000" strokeWidth="0" />
              <circle cx="46" cy="14" r="8" fill="#fff" strokeWidth="8" />
              {/* the case */}
              <rect x="42" y="28" width="82" height="92" rx="9" fill="#fff" strokeWidth="11" />
              <path d="M44 44 L122 44" fill="none" strokeWidth="5" />
            </g>
            {/* the SONDR logo engraved on the case */}
            <image href="/logo-mark-black.png" x="52" y="54" width="64" height="41.5" />
            <g filter="url(#ms-brush)" fill="none" stroke="#000" strokeLinecap="round" strokeLinejoin="round">
              {/* fingers wrapped round the case, thumb on the wheel */}
              <path d="M44 64 C26 62 22 80 40 84 M42 86 C24 86 22 104 40 106 M44 108 C30 112 32 126 48 122" strokeWidth="11" />
              <path d="M36 40 C24 26 30 8 42 8" strokeWidth="11" />
              {/* wrist going down out of frame */}
              <path d="M46 122 C40 200 32 300 24 420 M122 120 C128 200 134 300 140 420" strokeWidth="14" />
            </g>
            <g className="ms-flame">
              <path d="M70 4 C56 -6 60 -20 68 -34 C74 -22 86 -8 70 4 Z" fill="#F80A02" stroke="#000" strokeWidth="4" strokeLinejoin="round" />
              <path d="M70 0 C64 -6 66 -14 69 -20 C72 -13 77 -6 70 0 Z" fill="#fff" />
            </g>
          </g>
        </g>
      </g>
      {/* the slow exhale: soft smoke rolling out of the corner of his mouth, away from his face, rising */}
      <g className="ms-exhale" filter="url(#ms-smokefx-big)" fill="none" stroke="#B4B4B4" strokeLinecap="round">
        <path pathLength={1} strokeWidth="34" d="M800 1330 C880 1300 900 1240 980 1210 C1060 1180 1060 1110 1130 1070" />
        <path pathLength={1} strokeWidth="26" d="M800 1325 C860 1270 940 1260 990 1190 C1040 1120 1110 1110 1150 1030" />
        <path pathLength={1} strokeWidth="22" d="M795 1335 C870 1340 930 1300 1000 1290 C1080 1280 1110 1220 1180 1200" />
      </g>
    </svg>
  );
}
