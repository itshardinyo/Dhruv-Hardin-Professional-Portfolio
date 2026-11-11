"use client";

import * as React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { AnimatedDock } from "@/components/ui/animated-dock";
import { useIntro } from "@/components/intro/intro-controller";
import { cn } from "@/lib/utils";
import { MusicPanel, useMusic } from "@/components/site/music-player";

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
  const clickTimer = React.useRef<number | null>(null);
  const closePanel = React.useCallback(() => setPanel(false), []);

  // The logo: one click opens the music player, a double click goes back to the TV landing.
  const onMark = () => {
    if (clickTimer.current) {
      window.clearTimeout(clickTimer.current);
      clickTimer.current = null;
      setPanel(false);
      replay();
      return;
    }
    clickTimer.current = window.setTimeout(() => { clickTimer.current = null; setPanel((p) => !p); }, 260);
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
        aria-expanded={panel} aria-haspopup="dialog"
        aria-label="SONDR music player (double-click to go back to the TV intro)" title="Music · double-click to go back to the TV"
      >
        <Image src="/logo-mark-black.png" alt="" width={870} height={564} priority sizes="(max-width: 639px) 72px, 18vw" />
      </button>
      <MusicPanel open={panel} onClose={closePanel} anchorId="sondr-mark" />
      <nav className="nav" aria-label="Pages">
        <AnimatedDock base={base} items={PAGES.map((p) => ({ ...p, active: pathname === p.link }))} />
      </nav>
    </motion.header>
  );
}
