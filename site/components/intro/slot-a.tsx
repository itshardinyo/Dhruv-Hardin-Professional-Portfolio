"use client";

/*
  Slot A adapter: maps the pasted component (components/ui/loading-animation.tsx) onto SONDR.
  Swap Slot A by replacing this file's body; the Landing only needs `resetClock()` and `onComplete`.

  Its trigger is scroll, so it runs inside the landing's own scroll container (page scroll stays locked).
  Its own hint ("Scroll") replaces "CLICK TO TUNE IN". Its button ("Tune in") pulls the pixels back together,
  the patch turns once as the loader, then onComplete hands over to the hero.
*/

import * as React from "react";
import { LoadingAnimation, type ChipRow, type LoadingAnimationHandle } from "@/components/ui/loading-animation";
import { PATCH_FRAMES } from "./patch-frames";

export type SlotAHandle = Pick<LoadingAnimationHandle, "resetClock">;

const ROWS: ChipRow[] = [
  [["You’ve "], ["reached,", "frame"]],
  [["Dhruv Hardin."]],
];

// Palette only: red pixels and button, black ink and frames, white field.
const COLORS = { accent: "#F80A02", blue: "#000000", ink: "#000000", tint: "#FFFFFF" };

export function SlotA({
  scroller,
  size,
  handleRef,
  onComplete,
}: {
  scroller: React.RefObject<HTMLDivElement | null>;
  size: number;
  handleRef: React.MutableRefObject<SlotAHandle | null>;
  onComplete: () => void;
}) {
  const [el, setEl] = React.useState<HTMLElement | null>(null);
  const [uiFont, setUiFont] = React.useState<string | null>(null);
  React.useEffect(() => {
    setEl(scroller.current);
    setUiFont(getComputedStyle(document.body).getPropertyValue("--font-vt323").trim() || "monospace");
  }, [scroller]);
  if (!el || !uiFont) return null;
  return (
    <LoadingAnimation
      handleRef={handleRef as React.MutableRefObject<LoadingAnimationHandle | null>}
      scroller={el}
      uiFont={uiFont}
      frames={PATCH_FRAMES}
      fadeRows={0}
      maxWidth={0.9}
      size={size}
      rows={ROWS}
      name="SONDR"
      role="Est. 2022"
      cta="Tune in"
      loadingLabel="Tuning in"
      readyLabel="Tuned in"
      colors={COLORS}
      onComplete={onComplete}
    />
  );
}
