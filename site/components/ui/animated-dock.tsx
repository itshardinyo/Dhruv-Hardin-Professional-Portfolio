"use client"

/*
  Animated Dock (Slot B: nav button animation), pasted component.
  Motion is untouched: items swell on the same distance curve (±150px), up to 2x, on the same springs
  (mass 0.1, stiffness 150, damping 12), with the label scaling 1 → 1.5.
  SONDR changes, marked "SONDR:": icons → text chips; sizes are expressed relative to each chip's rest size
  (the demo's 40px → 80px is the same 1x → 2x) so the chips keep the mockup's 174×63; the rounded translucent
  dock tray and shadow are removed (square cream chips on the page); chips hang from the top edge
  (items-start) because the nav sits at the top; the current page's chip is red.
*/

import * as React from "react"
import { useRef } from "react"
import {
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export interface AnimatedDockProps {
  className?: string
  items: DockItemData[]
  /** SONDR: rest size of one chip in px. When null the chips keep their CSS size and don't magnify (touch, phones). */
  base: { w: number; h: number } | null
}

export interface DockItemData {
  link: string
  /** SONDR: was `Icon`. */
  label: React.ReactNode
  target?: string
  /** SONDR: the current page. */
  active?: boolean
}

export const AnimatedDock = ({ className, items, base }: AnimatedDockProps) => {
  const mouseX = useMotionValue(Infinity)

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn("dock flex items-start", className)}
    >
      {items.map((item, index) => (
        <DockItem key={index} mouseX={mouseX} base={base} active={item.active}>
          <Link
            href={item.link}
            target={item.target}
            aria-current={item.active ? "page" : undefined}
            className="dock-link grow flex items-center justify-center w-full h-full"
          >
            {item.label}
          </Link>
        </DockItem>
      ))}
    </motion.div>
  )
}

interface DockItemProps {
  mouseX: MotionValue<number>
  children: React.ReactNode
  base: { w: number; h: number } | null
  active?: boolean
}

export const DockItem = ({ mouseX, children, base, active }: DockItemProps) => {
  const ref = useRef<HTMLDivElement>(null)

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
    return val - bounds.x - bounds.width / 2
  })

  // SONDR: [40, 80, 40] px → [1, 2, 1] × the chip's rest size
  const widthSync = useTransform(distance, [-150, 0, 150], [1, 2, 1])
  const grow = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  })
  const width = useTransform(grow, (k) => (base ? k * base.w : 0))
  const height = useTransform(grow, (k) => (base ? k * base.h : 0))

  const iconScale = useTransform(grow, [1, 2], [1, 1.5])
  const iconSpring = useSpring(iconScale, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  })

  return (
    <motion.div
      ref={ref}
      style={base ? { width, height } : undefined}
      className={cn("dock-chip flex items-center justify-center", active && "is-active")}
    >
      <motion.div
        style={base ? { scale: iconSpring } : undefined}
        className="flex items-center justify-center w-full h-full grow"
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
