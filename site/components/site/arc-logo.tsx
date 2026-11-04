/**
 * A round logo with its name set in red along the curve above it (Hustler Jerseys).
 * One SVG: the logo image, plus the title on an oval arc that follows the logo's edge.
 */
export function ArcLogo({ src, width, height, text }: { src: string; width: number; height: number; text: string }) {
  const cx = width / 2, cy = height / 2;
  const gap = width * 0.035; // space between the logo's rim and the letters
  const fs = width * 0.13; // letter size, relative to the logo
  const rx = cx + gap, ry = cy + gap;
  const top = Math.ceil(gap + fs * 0.95); // room above the logo for the lettering
  const side = Math.ceil(gap + fs * 0.4);
  const id = `arc-${text.replace(/\W+/g, "-").toLowerCase()}`;
  return (
    <svg
      className="cat-logo cat-logo--arc"
      viewBox={`${-side} ${-top} ${width + side * 2} ${height + top}`}
      role="img"
      aria-label={text}
    >
      <defs>
        {/* left → right over the top of the oval, so the letters stand upright on the outside */}
        <path id={id} d={`M ${cx - rx} ${cy} A ${rx} ${ry} 0 0 1 ${cx + rx} ${cy}`} />
      </defs>
      <image href={src} x={0} y={0} width={width} height={height} />
      <text className="cat-arc-text" fontSize={fs} filter="url(#rough)">
        <textPath href={`#${id}`} startOffset="50%" textAnchor="middle">
          {text.toUpperCase()}
        </textPath>
      </text>
    </svg>
  );
}
