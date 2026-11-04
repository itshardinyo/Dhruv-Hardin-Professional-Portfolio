/**
 * A round logo ringed by its name in red (Hustler Jerseys): the first word fills the top of the oval,
 * the rest fills the bottom, both reading upright, left to right; optional marks either side ("•EST•", "•2024•").
 * One SVG: logo image + two curved text paths + two side labels.
 */

/** length of half an ellipse (numeric, good to well under 1%) */
function halfEllipse(rx: number, ry: number) {
  let len = 0, px = rx, py = 0;
  for (let i = 1; i <= 180; i++) {
    const t = (Math.PI * i) / 180, x = rx * Math.cos(t), y = ry * Math.sin(t);
    len += Math.hypot(x - px, y - py);
    px = x; py = y;
  }
  return len;
}

export function ArcLogo({
  src, width, height, text, left, right,
}: { src: string; width: number; height: number; text: string; left?: string; right?: string }) {
  const words = text.toUpperCase().trim().split(/\s+/);
  const topWord = words[0], bottomWord = words.slice(1).join(" ") || "";
  const cx = width / 2, cy = height / 2;
  const fs = width * 0.16; // letter size, relative to the logo
  const cap = fs * 0.72; // Bebas Neue cap height
  const gap = width * 0.03; // space between the logo's rim and the letters
  // top: baseline just outside the rim, letters stand outward
  const tx = cx + gap, ty = cy + gap;
  // bottom: letters sit between the rim and the baseline, so the baseline is one cap height further out
  const bx = cx + gap + cap, by = cy + gap + cap;
  const pad = Math.ceil(gap + fs);
  // side marks, level with the middle of the logo (like "•EST•" / "•2022•" on the SONDR mark)
  const sfs = fs * 0.62;
  const sideW = Math.max(left?.length ?? 0, right?.length ?? 0) * sfs * 0.46;
  const padX = Math.ceil(Math.max(pad, gap * 1.4 + sideW));
  const id = `arc-${text.replace(/\W+/g, "-").toLowerCase()}`;
  const fill = 0.5; // share of each half-oval the word spreads across: centred over the top / under the bottom, letters close together
  return (
    <svg
      className="cat-logo cat-logo--arc"
      viewBox={`${-padX} ${-pad} ${width + padX * 2} ${height + pad * 2}`}
      role="img"
      aria-label={text}
    >
      <defs>
        {/* over the top, left → right */}
        <path id={`${id}-top`} d={`M ${cx - tx} ${cy} A ${tx} ${ty} 0 0 1 ${cx + tx} ${cy}`} />
        {/* under the bottom, left → right, so the letters read upright */}
        <path id={`${id}-bottom`} d={`M ${cx - bx} ${cy} A ${bx} ${by} 0 0 0 ${cx + bx} ${cy}`} />
      </defs>
      <image href={src} x={0} y={0} width={width} height={height} />
      <text className="cat-arc-text" fontSize={fs} filter="url(#rough)">
        <textPath href={`#${id}-top`} startOffset="50%" textAnchor="middle" textLength={halfEllipse(tx, ty) * fill} lengthAdjust="spacing">
          {topWord}
        </textPath>
      </text>
      {left && (
        <text className="cat-arc-text" fontSize={sfs} filter="url(#rough)" x={-gap * 1.4} y={cy} textAnchor="end" dominantBaseline="central">
          {left}
        </text>
      )}
      {right && (
        <text className="cat-arc-text" fontSize={sfs} filter="url(#rough)" x={width + gap * 1.4} y={cy} textAnchor="start" dominantBaseline="central">
          {right}
        </text>
      )}
      {bottomWord && (
        <text className="cat-arc-text" fontSize={fs} filter="url(#rough)">
          <textPath href={`#${id}-bottom`} startOffset="50%" textAnchor="middle" textLength={halfEllipse(bx, by) * fill} lengthAdjust="spacing">
            {bottomWord}
          </textPath>
        </text>
      )}
    </svg>
  );
}
