"use client";

/*
  The one controller for the landing on "/".

  states:  landing → leaving → hero → returning → landing → …
  - landing:   the full-screen TV layer is up (opener, then Slot A). Page scroll is locked, the header is hidden,
               the footer is not rendered and the rest of the site is inert.
  - leaving:   Slot A has finished; the CRT collapses and opens into the hero.
  - hero:      the landing layer is gone.
  - returning: the header logo was clicked. On "/" the hero switches off like a CRT first; from another page we
               navigate to "/" and the short opener plays.

  Rules: every full load of "/" starts on the landing; the back button to "/" shows the hero (in-app navigation
  keeps the "hero" state, and a back/forward full load is caught by the boot script in app/layout.tsx);
  "/?skip=1" opens on the hero; other routes never show the landing.

  Nothing outside components/intro reads the landing internals: the header, hero and footer only use
  `state`, `replay()` and the html classes below. Swap Slot A inside components/intro/landing.tsx only.

  html classes (set before paint by the boot script, then kept in sync here):
  intro-on  landing is up (locks scroll)
  pre       hero elements are hidden, waiting for their entrance
  go        the hero entrance is playing
*/

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";

export type IntroState = "landing" | "leaving" | "hero" | "returning";

interface IntroContextValue {
  state: IntroState;
  setState: (s: IntroState) => void;
  /** Header logo: replay the landing. */
  replay: () => void;
  /** Landing → hero. `entrance` plays the hero entrance animation. */
  finish: (entrance: boolean) => void;
  /** True when the hero should collapse like a CRT before the short opener. */
  collapseRef: React.MutableRefObject<boolean>;
  reduced: boolean;
}

const IntroContext = React.createContext<IntroContextValue | null>(null);

export function useIntro() {
  const v = React.useContext(IntroContext);
  if (!v) throw new Error("useIntro must be used inside <IntroProvider>");
  return v;
}

const html = () => document.documentElement.classList;

export function useReducedMotion() {
  // Read synchronously on the client so the landing's first effect already knows (it decides TV vs still patch).
  const [reduced, setReduced] = React.useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  React.useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(m.matches);
    on();
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);
  return reduced;
}

export function IntroProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const reduced = useReducedMotion();
  const [state, setState] = React.useState<IntroState>(() => (pathname === "/" ? "landing" : "hero"));
  const collapseRef = React.useRef(false);

  // ?skip=1 and back/forward full loads open on the hero (the boot script marked them before paint).
  React.useLayoutEffect(() => {
    if (html().contains("intro-skip")) {
      html().remove("intro-skip", "intro-on", "pre");
      setState("hero");
    }
  }, []);

  // Keep the rest of the site inert while the landing is up.
  const onLanding = pathname === "/" && state !== "hero";
  React.useLayoutEffect(() => {
    const site = document.getElementById("site");
    if (site) site.inert = onLanding;
    if (!onLanding) html().remove("intro-on");
  }, [onLanding]);

  const finish = React.useCallback(
    (entrance: boolean) => {
      html().remove("intro-on", "pre");
      if (entrance && !reduced) {
        html().add("go");
        window.setTimeout(() => html().remove("go"), 3300); // so the hero doesn't replay it after in-app navigation
      }
      setState("hero");
      requestAnimationFrame(() => {
        const site = document.getElementById("site");
        if (site) site.inert = false;
        document.getElementById("headline")?.focus({ preventScroll: true });
      });
    },
    [reduced],
  );

  const replay = React.useCallback(() => {
    if (state !== "hero") return;
    html().remove("go");
    if (pathname === "/") {
      collapseRef.current = true;
      setState("returning");
    } else {
      collapseRef.current = false;
      html().add("intro-on", "pre");
      setState("returning");
      router.push("/");
    }
  }, [state, pathname, router]);

  // Any route other than "/" is always the plain site.
  React.useEffect(() => {
    if (pathname !== "/" && state !== "hero" && state !== "returning") setState("hero");
  }, [pathname, state]);

  const value = React.useMemo(() => ({ state, setState, replay, finish, collapseRef, reduced }), [state, replay, finish, reduced]);
  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>;
}

