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
  landing.tsx            the TV layer: opener → patch at rest → leave transition, keyboard (a future Slot A plugs in here)
  tv-engine.ts           canvas engine ported from design/tv-intro-reference.html (+ static sound)
components/site/     header.tsx, hero.tsx, site-footer.tsx, smooth-scroll.tsx, rough-filter.tsx, placeholder-page.tsx,
                     category-gallery.tsx (heading + orbital gallery + viewer), gallery-viewer.tsx (full-image viewer)
components/ui/       pasted components (Slots A–C and later prompts)
lib/                 utils.ts (cn), lenis-store.ts, galleries.ts (all gallery content: categories, titles, images)
public/              artsy/comics/, projects/hustler-jerseys/, projects/school/ (optimised WebP; School also has the PDFs),
                     logo-patch.webp, logo-mark-black.png, signature.png, resume.pdf (PLACEHOLDER)
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
except the TV look (static, scanlines, vignette, glow/fringes on TV text, the hero entrance's brief RGB glitch). Values are colour-profile corrected: use as written.

## Font tokens
- `--font-display` Bebas Neue (`--font-bebas`): headline/display, uppercase, roughened with `filter:url(#rough)` + a thin same-colour text stroke
- `--font-hand` Mouse Memoirs (`--font-mouse`): nav chips, small text
- `--font-osd` VT323 (`--font-vt323`): TV text ("CH 22", "CLICK TO TUNE IN")
- `#rough` (components/site/rough-filter.tsx): turbulence + displacement, scale = 3.4% of the hero font size, 2.5–7.5px

## Layout unit
`--u` = one pixel of the 1512×982 mockup = `min(100vw/1512, 100vh/982)`. Phones (<640px) have their own rules at the end of globals.css.

## Routes
`/` landing + hero · `/artsy` · `/projects` · `/about` (placeholder: header, title, "Coming up next.", footer). Only `/` ever shows the landing.

## Gallery pages (Step 2)
| page | category (id) | source folder (Downloads/DESIGN/…) | public folder |
|---|---|---|---|
| /projects | HUSTLER JERSEYS (#hustler-jerseys) | Hustler Jerseys | projects/hustler-jerseys |
| /projects | CASE STUDIES (#school) | Case Studies (PDF slide decks) | projects/school (one WebP per slide + the PDF) |
| /artsy | COMICS (#comics) | Comics | artsy/comics |
- Content lives in `lib/galleries.ts`. A new category = one entry in `PROJECTS` or `ARTSY` (+ its images in public/).
- Images: WebP, longest side ≤2400px, quality 82, alpha flattened on white; originals untouched in DESIGN/. Order alphabetical (case-insensitive).
- Every category uses the one `components/ui/circular-gallery.tsx`. Rings with fewer than 6 cards repeat their cards (repeats are hidden from Tab and screen readers). Radius grows with the card count.
- Ring turns with horizontal scroll (trackpad / Shift + wheel), drag, swipe and ← →; vertical scroll still moves the page. Paused off screen and with reduced motion.
- Clicking a card opens the viewer: white screen, full image (slide decks: every slide in a scrolling column + "Open the PDF"), ← → or swipe between pieces, Esc/Close returns focus to the card.
- Layout per category: `layout` in lib/galleries.ts. Comics uses "sheet" (components/site/contact-sheet.tsx: a white
  contact sheet with binder holes, numbered prints "01…", square photos, "—" below; 3 columns, 2 on phones), from
  Dhruv's reference. The others use the orbital gallery ("orbit", the default).
- Titles to check: all 13 "Hustler Jerseys · NN" (files were IMG_xxxx), Comics "SONDR" (IMG_0523 2) and "Mr. Sondr" (Illustration_sans_titre).

## Landing states (components/intro/intro-controller.tsx)
`landing → leaving → hero → returning → landing`
- Full load of `/` → landing. Back/forward to `/` → hero. `/?skip=1` → hero. Other routes → never.
- html classes: `intro-on` (landing up, scroll locked), `pre` (hero/header hidden), `go` (hero entrance playing, removed after 1.8s).
- `#site` is `inert` while the landing is up; the footer isn't rendered; Lenis is off.
- Flow: 0.3s blank → tube warm-up → static → patch forms (HBO style) → glint → at rest ~3.8s with
  "CLICK TO TUNE IN" ("TAP TO TUNE IN" on touch) blinking; hovering the patch glitches it → click, tap or Enter →
  static burst + quiet static sound (≤10% volume), CRT collapses to a line (0.3s), line opens into the white hero
  (0.4s) → hero entrance (dots pop, lines wipe in with RGB glitch, signature wipes, header drops; ≤1.6s).
- Header logo ("Replay the SONDR intro"): on `/` the hero collapses like a CRT (0.3s) then the short opener (~1.2s);
  from another page it goes to `/` and plays the short opener. Then it waits for the click again.
- Keyboard: Enter (or Space) tunes in. Esc skips to the hero.
- Reduced motion: no static/CRT; the patch shows still with "CLICK TO TUNE IN"; click/Enter → 200ms crossfade. No parallax, no Lenis.

## Slots
| slot | status | file | notes |
|---|---|---|---|
| A · logo animation | **pending** (default in use) | components/intro/landing.tsx | Dhruv removed the scroll-driven pixel loader (Nov 2026): he wants TV opener → hero directly. The default (hover glitch, click → CRT line → hero) is live. It's still in git history (commit 72535c1) |
| B · nav buttons | **filled** | components/ui/animated-dock.tsx | dock magnification: chips swell 1×→2× within ±150px, label 1→1.5, springs mass .1/stiffness 150/damping 12; mouse only (off on touch and phones) |
| D · orbital gallery | **filled** | components/ui/circular-gallery.tsx (+ site/category-gallery.tsx) | 21st.dev circular gallery; used for HUSTLER JERSEYS and CASE STUDIES (Comics uses the contact sheet). Its dark caption fade, shadow and back-card fade are kept as in the prompt (Dhruv asked for the preview to look like the prompt) |
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
- Step 2e: /projects has no visible "PROJECTS" title (sr-only h1); the Hustler Jerseys logo leads the page (clamp(180px, 48vh, 500px) tall; phones min(86vw, 340px) wide). The red three-dot marks are gone from all category headings; only the hero keeps its dots.
- Step 2d: page titles (PROJECTS, ARTSY) and category headings (Hustler logo, CASE STUDIES, COMICS) centred; Hustler logo enlarged to the PROJECTS line height (220u, min 96px).
- Step 2b: Comics shown as a contact-sheet grid instead of the orbital gallery (layout "sheet").
- Step 2: /projects (Hustler Jerseys, School → renamed Case Studies) and /artsy (Comics) with the orbital gallery and a full-image viewer.
- Step 1b: Slot A removed at Dhruv's request; the landing goes straight from the TV opener to the hero (default transition).
- Projects page tweaks: Hustler Jerseys heading shows the Versatility · Authenticity patch logo (public/projects/hustler-jerseys/hustler-logo.webp, set via `logo` on the category in lib/galleries.ts; title kept as alt text). "School" renamed "Case Studies" (id stays `school`). The scroll/drag hint is hidden on /projects (`hint={false}` on CategoryGallery); /artsy keeps it.
