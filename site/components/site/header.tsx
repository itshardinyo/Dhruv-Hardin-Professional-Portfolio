"use client";

import * as React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { AnimatedDock } from "@/components/ui/animated-dock";
import { useIntro } from "@/components/intro/intro-controller";
import { cn } from "@/lib/utils";
import { MusicPanel, useMusic } from "@/components/site/music-player";
import { BrandsPop } from "@/components/site/brands-pop";

const PAGES = [
  { link: "/artsy", label: "Artsy" },
  { link: "/projects", label: "Projects" },
  { link: "/about", label: "About me" },
];

/** Rest size of a chip: 174×63 at 1512×982, scaled with the viewport. Null on phones and touch screens (no dock). */
function useChipBase() {
  const [base, setBase] = React.useState<{ w: number; h: number } | null>(null);
  React.useEffect(() => {
    const touch = window.matchMedia("(hover: none)");
    const set = () => {
      if (touch.matches || window.innerWidth < 640) return setBase(null);
      const u = Math.min(window.innerWidth / 1512, window.innerHeight / 982);
      const fs = Math.max(16, 46 * u);
      setBase({ w: fs * 3.78, h: fs * 1.37 });
    };
    set();
    window.addEventListener("resize", set);
    return () => window.removeEventListener("resize", set);
  }, []);
  return base;
}

export function Header() {
  const pathname = usePathname();
  const { replay } = useIntro();
  const home = pathname === "/";
  const base = useChipBase();
  const [hidden, setHidden] = React.useState(false);
  const { scrollY } = useScroll();
  const music = useMusic();
  const [panel, setPanel] = React.useState(false);
  const [brands, setBrands] = React.useState(false);
  const clickTimer = React.useRef<number | null>(null);
  const clicks = React.useRef(0);
  const closePanel = React.useCallback(() => setPanel(false), []);
  const closeBrands = React.useCallback(() => setBrands(false), []);

  // The logo counts clicks (each within 280ms of the last): 1 = brands side menu, 2 = music player, 3 = back to the TV landing.
  const onMark = () => {
    clicks.current += 1;
    if (clickTimer.current) window.clearTimeout(clickTimer.current);
    const act = () => {
      const n = clicks.current;
      clicks.current = 0;
      clickTimer.current = null;
      if (n >= 3) { setPanel(false); setBrands(false); replay(); }
      else if (n === 2) { setBrands(false); setPanel((p) => !p); }
      else { setPanel(false); setBrands((b) => !b); }
    };
    if (clicks.current >= 3) return act();
    clickTimer.current = window.setTimeout(act, 280);
  };

  // Other pages: hide when scrolling down, come back when scrolling up.
  useMotionValueEvent(scrollY, "change", (y) => {
    if (home) return;
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 120);
  });
  React.useEffect(() => setHidden(false), [pathname]);

  return (
    <motion.header
      className={cn("site-header", home ? "is-home" : "is-sticky")}
      animate={{ y: !home && hidden ? "-100%" : "0%" }}
      transition={{ type: "spring", stiffness: 400, damping: 40 }}
    >
      <button
        type="button" id="sondr-mark" className={cn("mark", music?.playing && "is-playing")} onClick={onMark}
        aria-expanded={brands || panel} aria-haspopup="true"
        aria-label="SONDR brands (double-click: music player, triple-click: back to the TV intro)"
        title="Brands · double-click: music · triple-click: back to the TV"
      >
        <Image src="/logo-mark-black.png" alt="" width={870} height={564} priority sizes="(max-width: 639px) 72px, 18vw" />
      </button>
      <BrandsPop open={brands} onClose={closeBrands} anchorId="sondr-mark" />
      <MusicPanel open={panel} onClose={closePanel} anchorId="sondr-mark" />
      <nav className="nav" aria-label="Pages">
        <AnimatedDock base={base} items={PAGES.map((p) => ({ ...p, active: pathname === p.link }))} />
      </nav>
    </motion.header>
  );
}
