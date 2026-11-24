"use client";

import { useEffect } from "react";

/**
 * Turns the page black while this page is the one on screen (html.dark-page).
 * The site keeps visited pages alive in the background, so a CSS :has() check would leak the black onto other
 * pages; this effect is cleaned up as soon as the page is hidden or left.
 */
export function DarkPage() {
  useEffect(() => {
    const html = document.documentElement;
    html.classList.add("dark-page");
    return () => html.classList.remove("dark-page");
  }, []);
  return null;
}
