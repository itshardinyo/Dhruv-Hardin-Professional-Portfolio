import type Lenis from "lenis";

/* The one Lenis instance (null during the landing, with reduced motion, or before it starts). */
let current: Lenis | null = null;
export const setLenis = (l: Lenis | null) => { current = l; };
export const getLenis = () => current;

/** Smooth when Lenis is running, instant otherwise. */
export function scrollToTop() {
  if (current) current.scrollTo(0);
  else window.scrollTo({ top: 0, behavior: "auto" });
}
