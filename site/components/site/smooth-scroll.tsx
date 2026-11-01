"use client";

import * as React from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useIntro } from "@/components/intro/intro-controller";
import { setLenis } from "@/lib/lenis-store";

/** Lenis smooth scrolling (lerp 0.1). Off during the landing and when reduced motion is on. */
export function SmoothScroll() {
  const { state, reduced } = useIntro();
  const pathname = usePathname();
  const lenisRef = React.useRef<Lenis | null>(null);
  const on = state === "hero" && !reduced;

  React.useEffect(() => {
    if (!on) return;
    const lenis = new Lenis({ lerp: 0.1, autoRaf: true, prevent: (node) => !!node.closest?.("[data-lenis-prevent]") });
    lenisRef.current = lenis;
    setLenis(lenis);
    return () => { lenis.destroy(); lenisRef.current = null; setLenis(null); };
  }, [on]);

  // New page: start at the top without a smooth glide.
  React.useEffect(() => { lenisRef.current?.scrollTo(0, { immediate: true }); }, [pathname]);

  return null;
}
