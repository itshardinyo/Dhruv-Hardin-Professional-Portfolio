"use client";

import * as React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { AnimatedDock } from "@/components/ui/animated-dock";
import { useIntro } from "@/components/intro/intro-controller";
import { cn } from "@/lib/utils";
import { MusicPanel, useMusic } from "@/components/site/music-player";
import Link from "next/link";
import { BRANDS } from "@/lib/brands";

const MARK_IDS = ["sondr-mark", "sondr-mark-float"];

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
  // Once the header's logo is off screen (scrolled past, or the header hid itself), a small copy of it stays pinned
  // top-left so the music player is always one click away.
  const [float, setFloat] = React.useState(false);
  React.useEffect(() => {
    const el = document.getElementById("sondr-mark");
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      setFloat(!e.isIntersecting); // the open player just slides under whichever logo is showing (MusicPanel)
    }, { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, [pathname]);

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
    <>
    <motion.header
      className={cn("site-header", home ? "is-home" : "is-sticky")}
      animate={{ y: !home && hidden ? "-100%" : "0%" }}
      transition={{ type: "spring", stiffness: 400, damping: 40 }}
    >
      <button
        type="button" id="sondr-mark" className={cn("mark", music?.playing && "is-playing")} onClick={onMark}
        aria-expanded={panel && !float} aria-haspopup="dialog"
        aria-label="SONDR music player (double-click to go back to the TV intro)" title="Music · double-click to go back to the TV"
      >
        <Image src="/logo-mark-black.png" alt="" width={870} height={564} priority sizes="(max-width: 639px) 72px, 18vw" />
      </button>
      {/* Dhruv's brands, always beside the SONDR logo (lib/brands.ts); on / they wipe in with the headline's RGB glitch */}
      <div className="brand-marks">
        {BRANDS.map((b) => (
          <Link
            key={b.slug} href={`/${b.slug}`} className="brand-mark" title={b.name} aria-label={b.name}
            onClick={() => { if (pathname === `/${b.slug}`) window.dispatchEvent(new Event("sondr:cine-replay")); }}
          >
            <Image src={b.logo} alt="" width={b.width} height={b.height} priority sizes="(max-width: 639px) 80px, 16vw" />
          </Link>
        ))}
      </div>
      <nav className="nav" aria-label="Pages">
        <AnimatedDock base={base} items={PAGES.map((p) => ({ ...p, active: pathname === p.link }))} />
      </nav>
    </motion.header>
    {/* outside the header: the header moves (hide on scroll), which would break position: fixed */}
    <button
      type="button" id="sondr-mark-float" className={cn("mark mark-float", float && "is-on", music?.playing && "is-playing")} onClick={onMark}
      aria-expanded={panel && float} aria-haspopup="dialog" tabIndex={float ? 0 : -1} aria-hidden={!float}
      aria-label="SONDR music player (double-click to go back to the TV intro)" title="Music · double-click to go back to the TV"
    >
      <Image src="/logo-mark-black.png" alt="" width={870} height={564} sizes="90px" />
    </button>
    {/* Dhruv's brand logos ride along beside the pinned SONDR logo (same size, no spin), always one click away */}
    <div className={cn("brand-float", float && "is-on")} aria-hidden={!float}>
      {BRANDS.map((b) => (
        <Link
          key={b.slug} href={`/${b.slug}`} className="brand-float-link" title={b.name} aria-label={b.name} tabIndex={float ? 0 : -1}
          onClick={() => { if (pathname === `/${b.slug}`) window.dispatchEvent(new Event("sondr:cine-replay")); }}
        >
          <Image src={b.logo} alt="" width={b.width} height={b.height} sizes="100px" />
        </Link>
      ))}
    </div>
    {/* one player for both logos, fixed on screen so it stays with you while scrolling */}
    <MusicPanel open={panel} onClose={closePanel} anchorIds={MARK_IDS} />
    </>
  );
}
