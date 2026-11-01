# Dhruv Hardin portfolio: read this first

Personal portfolio for Dhruv Hardin (brand: SONDR, "SONDR rules the world · Est. 2022").
Update this file after every change.

@AGENTS.md

## Stack
- Next.js 16 (App Router, Turbopack, `cacheComponents` on) + TypeScript + Tailwind CSS v4 + shadcn/ui config (`components.json`)
- Motion (`motion/react`) for animation, Lenis for smooth scrolling. No GSAP or three.js (no prompt needed them).
- Fonts from Google Fonts via `next/font/google` in `app/layout.tsx`.
- Free/open-source only. Git repo lives one level up (`dhruv-hardin-portfolio/`), with `design/` next to `site/`.
- Run: `npm install`, then `npm run dev` → http://localhost:3000 (`/?skip=1` opens straight on the hero).

## Folders
```
app/                 layout.tsx (fonts, boot script, providers, header/footer), globals.css (tokens + all site CSS)
  page.tsx           "/" = landing + hero
  artsy/ projects/ about/   placeholder pages
  icon.png apple-icon.png opengraph-image.png twitter-image.png
components/intro/    everything about the landing (one controller)
  intro-controller.tsx   IntroProvider + useIntro(): state, replay(), finish()
  boot-script.ts         <head> script: sets html classes before first paint
  landing.tsx            the TV layer: opener → Slot A → leave transition, keyboard
  tv-engine.ts           canvas engine ported from design/tv-intro-reference.html (+ static sound)
  slot-a.tsx             adapter that maps Slot A onto SONDR (swap Slot A here)
  patch-frames.ts        66×53 1-bit frames of the patch turning, generated from public/logo-patch.webp
components/site/     header.tsx, hero.tsx, site-footer.tsx, smooth-scroll.tsx, rough-filter.tsx, placeholder-page.tsx
components/ui/       pasted components (Slots A–C and later prompts)
lib/                 utils.ts (cn), lenis-store.ts
public/              logo-patch.webp, logo-mark-black.png, signature.png, resume.pdf (PLACEHOLDER)
```

## Colour tokens (the only colours; defined once in `app/globals.css` as CSS variables + Tailwind theme)
| token | value | use |
|---|---|---|
| `--color-red` | #F80A02 | headline, dots, active chip, footer band |
| `--color-cream` | #FFF3D8 | nav chips |
| `--color-black` | #000000 | nav text, small text |
| `--color-white` | #FFFFFF | page background |
| `--color-landing` | #1E1E1E | landing background |
Tailwind's default palette is switched off (`--color-*: initial`). No other colours, tints, gradients or transparency,
except the TV look (static, scanlines, vignette, glow/fringes on TV text, the hero entrance's brief RGB glitch) and
Slot A's on-screen design-tool layer (it is drawn on the TV screen). Values are colour-profile corrected: use as written.

## Font tokens
- `--font-display` Bebas Neue (`--font-bebas`): headline/display, uppercase, roughened with `filter:url(#rough)` + a thin same-colour text stroke
- `--font-hand` Mouse Memoirs (`--font-mouse`): nav chips, small text
- `--font-osd` VT323 (`--font-vt323`): TV text ("CH 22", "CLICK TO TUNE IN") and Slot A's labels
- `#rough` (components/site/rough-filter.tsx): turbulence + displacement, scale = 3.4% of the hero font size, 2.5–7.5px

## Layout unit
`--u` = one pixel of the 1512×982 mockup = `min(100vw/1512, 100vh/982)`. Phones (<640px) have their own rules at the end of globals.css.

## Routes
`/` landing + hero · `/artsy` · `/projects` · `/about` (placeholders: header, title, "Coming up next.", footer). Only `/` ever shows the landing.

## Landing states (components/intro/intro-controller.tsx)
`landing → leaving → hero → returning → landing`
- Full load of `/` → landing. Back/forward to `/` → hero. `/?skip=1` → hero. Other routes → never.
- html classes: `intro-on` (landing up, scroll locked), `pre` (hero/header hidden), `go` (hero entrance playing, removed after 1.8s).
- `#site` is `inert` while the landing is up; the footer isn't rendered; Lenis is off.
- Flow: 0.3s blank → tube warm-up → static → patch forms (HBO style) → glint → at rest ~3.8s → patch pixelates into
  Slot A (white field, TV overlay kept: scanlines, vignette, faint static) → visitor scrolls Slot A → "Tune in" →
  pixels reassemble, patch turns once ("Tuning in") → static burst, CRT collapses to a line, line opens into the
  white hero → hero entrance (dots pop, lines wipe in with RGB glitch, signature wipes, header drops; ≤1.6s).
- Header logo ("Replay the SONDR intro"): on `/` the hero collapses like a CRT (0.3s) then the short opener (~1.2s);
  from another page it goes to `/` and plays the short opener. Then Slot A waits again.
- Keyboard: Enter plays Slot A (scrolls it to the button and focuses it; Enter again presses it). Esc skips to the hero.
- Reduced motion: no static/CRT; the patch shows still with "CLICK TO TUNE IN"; click/Enter → 200ms crossfade. No parallax, no Lenis.

## Slots
| slot | status | file | notes |
|---|---|---|---|
| A · logo animation | **filled** | components/ui/loading-animation.tsx (+ intro/slot-a.tsx) | scroll-driven pixel loader; trigger = scroll inside the landing's own scroll container; its "Scroll" cue replaces "CLICK TO TUNE IN" |
| B · nav buttons | **filled** | components/ui/animated-dock.tsx | dock magnification: chips swell 1×→2× within ±150px, label 1→1.5, springs mass .1/stiffness 150/damping 12; mouse only (off on touch and phones) |
| C · footer | **filled** | components/ui/halftone-wordmark-footer.tsx (+ site/site-footer.tsx) | halftone "HARDIN" in Bebas, red band, white dots that snap black when pushed; grain off |
All changes inside pasted files are marked `SONDR:`.

## Rules for pasted prompts (Slots A–C and every later prompt)
1. Install the component as its own file in `components/ui/` with its dependencies.
2. Keep its motion, timing, easing and interaction exactly.
3. Swap its demo content for Dhruv's as described in its section. Recolour it to the palette and set it in the site fonts.
4. Delete demo-only code.
5. If it imports `framer-motion`, switch the import to `motion/react`. If it's written for an older Tailwind setup, translate it to Tailwind v4. Don't downgrade.
6. Never break the landing → hero flow or the header logo replay.
If a slot says "(empty)", build that slot's default and mark it "pending" here.

## Details
- LinkedIn https://www.linkedin.com/in/dhruv-hardin-b01390176/ · Email dhruv.d.hardin@gmail.com · Resume `/resume.pdf` (**placeholder: replace public/resume.pdf**)
- Footer: Email copies the address and shows "Copied" (plus a mailto link), LinkedIn and Resume open new tabs, Back to top uses Lenis.
- Hero scroll on `/`: line 1 rises 8vh, line 2 14vh, dots + signature fade, over the first screen of scrolling (or the whole distance to the footer when that's shorter, which it is: the footer is 560px).
- Set `NEXT_PUBLIC_SITE_URL` when deploying so Open Graph image URLs are absolute.
- Lint: `react-hooks/refs` and `react-hooks/set-state-in-effect` are warnings on purpose (pasted components' patterns; mount-time browser reads).

## Changelog
- Step 1: landing (TV opener + Slot A), hero, header (Slot B), footer (Slot C), Lenis, placeholder pages, favicon, OG image.
