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
components/site/     header.tsx, hero.tsx, music-player.tsx (site-wide music, mounted in layout), mr-sondr.tsx (MrSondrArt: the Mr. Sondr SVG, shared by hero + about), site-footer.tsx, contact-form.tsx, smooth-scroll.tsx, rough-filter.tsx, placeholder-page.tsx,
                     category-gallery.tsx (heading + orbital gallery + viewer), gallery-viewer.tsx (full-image viewer)
components/ui/       pasted components (Slots A–C and later prompts)
lib/                 music.ts (PLAYLIST: tracks in public/music/), utils.ts (cn), lenis-store.ts, galleries.ts (all gallery content: categories, titles, images)
public/              artsy/comics/, projects/hustler-jerseys/, projects/school/ (optimised WebP; School also has the PDFs),
                     logo-patch.webp, logo-mark-black.png, signature.png, resume.pdf (Dhruv_Hardin_Resume.pdf from DESIGN/)
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
except the music card (#1E1E1E landing black, greys #2c2c2c/#4a4a4a/#a7a7a7/#d6d6d6, shadow; Dhruv's Spotify reference), Mr. Sondr's smoke (grey #8A8A8A, blur/turbulence, fades) and the lighter's soft red glow and the TV look (static, scanlines, vignette, glow/fringes on TV text, the hero entrance's brief RGB glitch). Values are colour-profile corrected: use as written.

## Font tokens
- `--font-display` Bebas Neue (`--font-bebas`): headline/display, uppercase, roughened with `filter:url(#rough)` + a thin same-colour text stroke
- `--font-hand` Mouse Memoirs (`--font-mouse`): nav chips, small text
- `--font-osd` VT323 (`--font-vt323`): TV text ("CH 22", "CLICK TO TUNE IN")
- `#rough` (components/site/rough-filter.tsx): turbulence + displacement, scale = 3.4% of the hero font size, 2.5–7.5px

## Layout unit
`--u` = one pixel of the 1512×982 mockup = `min(100vw/1512, 100vh/982)`. Phones (<640px) have their own rules at the end of globals.css.

## Routes
`/` landing + hero · `/artsy` · `/projects` · `/about` (Mr. Sondr bottom-left in headphones: lights up with the Zippo on arrival, smokes, nods to the music; "ABOUT ME" top-right with Dhruv's bio under it; copy in app/about/page.tsx). Only `/` ever shows the landing.

## Gallery pages (Step 2)
| page | category (id) | source folder (Downloads/DESIGN/…) | public folder |
|---|---|---|---|
| /projects | HUSTLER JERSEYS (#hustler-jerseys) | Hustler Jerseys | projects/hustler-jerseys |
| /projects | CASE STUDIES (#school) | Case Studies (PDF slide decks) | projects/school (one WebP per slide + the PDF) |
| /artsy | COMICS (#comics) | Comics | artsy/comics |
| /artsy | MR. SONDR (#mr-sondr) | Comics (Mr Sondr Ponders) + Dhruv's uploads | artsy/mr-sondr |
| /artsy | SONDR UNIVERSE (#sondr-universe) | Comics (Sondr Sunset) + Dhruv's uploads | artsy/sondr-universe |
- Content lives in `lib/galleries.ts`. A new category = one entry in `PROJECTS` or `ARTSY` (+ its images in public/).
- Images: WebP, longest side ≤2400px, quality 82, alpha flattened on white; originals untouched in DESIGN/. Order alphabetical (case-insensitive).
- Every category uses the one `components/ui/circular-gallery.tsx`. Rings with fewer than 6 cards repeat their cards (repeats are hidden from Tab and screen readers). Radius grows with the card count.
- Ring turns with horizontal scroll (trackpad / Shift + wheel), drag, swipe and ← →; vertical scroll still moves the page. Flicks carry momentum and the ring keeps cruising; mouse hover on a card stops it. Paused off screen and with reduced motion.
- Clicking a card opens the viewer: white screen, full image (slide decks: every slide in a scrolling column + "Open the PDF"), ← → or swipe between pieces, Esc/Close returns focus to the card.
- Layout per category: `layout` in lib/galleries.ts. Comics uses "sheet" (components/site/contact-sheet.tsx: a white
  contact sheet with binder holes, numbered prints "01…", square photos, "—" below; 3 columns, 2 on phones), from
  Dhruv's reference. The others use the orbital gallery ("orbit", the default).
- Titles to check: all 13 "Hustler Jerseys · NN" (files were IMG_xxxx), Mr. Sondr / Sondr Universe titles came from Dhruv's file names.

## Landing states (components/intro/intro-controller.tsx)
`landing → leaving → hero → returning → landing`
- Full load of `/` → landing. Back/forward to `/` → hero. `/?skip=1` → hero. Other routes → never.
- html classes: `intro-on` (landing up, scroll locked), `pre` (hero/header hidden), `go` (hero entrance playing, removed after 5.8s).
- `#site` is `inert` while the landing is up; the footer isn't rendered; Lenis is off.
- Flow: 0.3s blank → tube warm-up → static → patch forms (HBO style) → glint → at rest ~3.8s with
  "CLICK TO TUNE IN" ("TAP TO TUNE IN" on touch) blinking; hovering the patch glitches it → click, tap or Enter →
  static burst + quiet static sound (≤10% volume), CRT collapses to a line (0.3s), line opens into the white hero
  (0.4s) → hero entrance: dots pop, lines wipe in with RGB glitch, signature wipes, header drops (≤1.6s); then Mr. Sondr pops up with the cigarette already in his mouth (1.5s), his hand comes up with a Zippo engraved with the SONDR logo (2.4s), flame (3s), tip catches (3.3s), smoke (3.55s), hand drops away (≈5.1s), he smiles (5s). The smoking loop (drags + exhales, cigarette stays in his mouth) starts at 5.3s.
- Header logo: single click = music player; double click = back to the TV landing: on `/` the hero collapses like a CRT (0.3s) then the short opener (~1.2s);
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
- LinkedIn https://www.linkedin.com/in/dhruv-hardin-b01390176/ · Instagram https://www.instagram.com/itsd.hardin_/ · Email dhruv.d.hardin@gmail.com · Resume `/resume.pdf` (Dhruv’s real resume, from DESIGN/Dhruv_Hardin_Resume.pdf)
- Footer: brand + two columns. "Say hi" (the title) and "Email" open the contact form; LinkedIn and Instagram are logo-only links, Instagram under LinkedIn (labels kept for screen readers). Second column: Resume (opens /resume.pdf in a new tab), Artsy, Projects, About me with no visible "Pages" heading. No Files column. Back to top uses Lenis.
- Contact form (components/site/contact-form.tsx): name, your email, subject, message → POST to FormSubmit (formsubmit.co/ajax/dhruv.d.hardin@gmail.com, free, no account). The first message from the live site sends Dhruv a one-time "Activate form" email; he clicks it once, then messages arrive in his inbox (reply goes to the sender). On failure it offers a prefilled mailto. The one exception to "no transparency": its black veil behind the card.
- Hero scroll on `/`: line 1 rises 8vh, line 2 14vh, dots + signature fade, over the first screen of scrolling (or the whole distance to the footer when that's shorter, which it is: the footer is 560px).
- Music: list tracks (MP3s Dhruv has the rights to) in `PLAYLIST` in lib/music.ts, files in public/music/. `MusicProvider` (components/site/music-player.tsx) wraps the site in the root layout, so the audio keeps playing across pages. Starts on the "Tune in" click (landing dispatches `sondr:music-start`) or on the first click/tap/key on any other page, unless the visitor paused it before (localStorage). The header SONDR logo is the player: one click opens a dark now-playing card after Dhruv's Spotify reference (`MusicPanel`: cover art (`art` on a track; SONDR logo until then), title, artist, seekable progress with elapsed/−remaining, ⏪ ❚❚ ⏩, volume (remembered), queue); a double click (two clicks within 260ms) goes back to the TV landing (replay). The logo spins faster while music plays. Spotify can't autoplay full tracks for visitors, so it isn't the source.
- Set `NEXT_PUBLIC_SITE_URL` when deploying so Open Graph image URLs are absolute.
- Lint: `react-hooks/refs` and `react-hooks/set-state-in-effect` are warnings on purpose (pasted components' patterns; mount-time browser reads).

## Changelog
- Step 3u: cover art is now Dhruv's animated GIF ("Making a playlist is a delicate art."), converted to animated WebP (same file name, public/music/art/making-a-playlist.webp).
- Step 3t: cover art fills the frame at the image's own shape (no black bars).
- Step 3s: cover art for "Just One More Drink": Dhruv's image (public/music/art/making-a-playlist.webp, shown whole, not cropped). Tracks without `art` show the white SONDR logo.
- Step 3r: music drop-down redesigned after Dhruv's Spotify reference: dark rounded card, square cover art (SONDR logo placeholder; `art` field per track), bold title + grey artist, thin progress bar with elapsed and −remaining, big white ⏪ ❚❚ ⏩, volume slider. Hint text removed.
- Step 3q: "Just One More Drink · Jazz Noir" back in the playlist (public/music/just-one-more-drink.mp3).
- Step 3p: Resume back in the footer, first in the page links.
- Step 3o: the spinning header logo is the music player (one click: Spotify-like drop-down; double click: back to the TV landing). Floating music chip removed. Ready for more MP3s.
- Step 3n: "Just One More Drink" removed at Dhruv's request; playlist empty again, so the player is hidden.
- Step 3m: first track: "Just One More Drink · Jazz Noir" (82-min mix, re-encoded 64 kbps MP3 ≈39 MB, public/music/just-one-more-drink.mp3). Audio preload="none" (streams once it starts); a single track loops.
- Step 3l: five crowns, one per discipline.
- Step 3k: crowns now red with three even points; the three horizontal lines kept.
- Step 3j: rating crowns redrawn as Dhruv's crown, original: loose black ink outline, white fill, five points, three horizontal lines across. (Basquiat's crown, even with lines added, is not used: it's his estate's trademark.)
- Step 3i: site-wide music player (components/site/music-player.tsx, lib/music.ts), waiting for tracks.
- Step 3h: rating stars → six original SONDR crowns (red, five points, three white jewels, black brush outline; not Basquiat's crown, which is his estate's trademark); disciplines in a centred 3-over-2 formation.
- Step 3g: headphones redrawn flat (one thick black band, chunky black cups, white SONDR on the cups). No Marshall branding (their trademark).
- Step 3f: /about title centred in its column; six 3D poster-style stars (hard black drop, tilted, pop in one by one); disciplines shown as quoted poster review blurbs (Bebas); "creative ambitions".
- Step 3e: MrSondrArt `vibing` prop (/about): black on-ear headphones drawn in his brush style (no brand logo), head cut at the neck (clipPaths at y=1600) so the head + cigarette + headphones nod (.ms-head-vibe, 0.92s) while the body stays still. /about now plays the Zippo lighting on arrival (.9–3.7s); loop from 3.9s.
- Step 3d: /about copy replaced with Dhruv's own words: intro line, Robin Hardin quote (red rule), six red stars over the five disciplines in quotes (movie-rating style), the SONDR definition.
- Step 3c: footer page links (Artsy, Projects, About me) back, without the "Pages" heading; Instagram logo under LinkedIn. Header SONDR logo spins slowly on its vertical axis (9s, pauses on hover, off with reduced motion).
- Step 3b: /about rebuilt: Mr. Sondr (shared MrSondrArt) smoking bottom-left (fades up, loop starts after 1.2s via `--ms-loop`), title top-right, draft bio (from what Dhruv has shared; he'll edit). Signature removed from /about.
- Step 3a: footer: Pages column removed, LinkedIn/Instagram shown as logos only, "Say hi" opens a contact form (name, email, subject, message) sent to Dhruv's inbox via FormSubmit.
- Step 2z: cigarette now sits in his mouth (no smoking hand); in the entrance his hand comes up holding a Zippo with the SONDR logo (public/logo-mark-black.png) on the case, lights it, drops away. Loop = drags (tip glows, cigarette lifts) + slow exhale. `go` lasts 5.8s.
- Step 2y: footer: duplicate email line removed, LinkedIn + Instagram logos (simple currentColor SVGs, `icon` on FooterLink), Files column (Resume) removed, grid now brand + 2 columns.
- Step 2x: lighting animation in the entrance (lighter in his other hand, flickering red flame + glow, tip catches, smoke starts). Smoke made realistic: soft grey ribbons through animated turbulence + blur (#ms-smokefx), a thin stream flowing up off the tip and thinning out (mask), a soft exhale rolling up from his mouth. Cartoon plume symbol removed. Loop starts at 4.6s; `go` lasts 5s.
- Step 2w: viewer shows a single piece as big as the screen allows (fills the stage with object-fit: contain, small originals scale up); bars a little slimmer.
- Step 2v: smoke redone from Dhruv's Pinterest reference: one `#ms-plume` symbol (billowing grey puffs, darker grey shading, black outline, curl on top, loose droplets) that only rises straight up — off the tip (2 staggered) and one big plume on the exhale. Opening puff over the headline removed. Loop starts at 2.4s; `go` lasts 3.8s.
- Step 2u: headline nudged back toward Mr. Sondr (spare room split 22% left / 78% right instead of centred).
- Step 2t: smoke is now puff clouds, not scribbles: one `#ms-cloud` symbol (bumpy white blob, thick black brush outline, small curls) reused for the little puffs off the tip, the exhale clouds in the loop and the opening puff (clouds billow out of his mouth, then drift up and fade).
- Step 2s: headline (with its dots) centred in the space right of Mr. Sondr so his face and hand show (`--ms-r` = his right edge), font 190u → 176u so it keeps a margin on the right. Phones keep their own rule.
- Step 2r: back to the cigarette (joint removed) and the original headline entrance (wipe + RGB glitch). Mr. Sondr comes last again; his puff now just follows his pop-up (no longer reveals the text). Smoke loop unchanged. `go` lasts 4.8s.
- Step 2q: drawing finished past its canvas (right shoulder + sleeve), cigarette now a joint (cone, roach, twisted burning end). Entrance reordered around him: he opens it, his puff (.ms-puff, above the headline) reveals "You've reached, Dhruv Hardin." (replaces the wipe/RGB glitch on the lines). Smoking loop slowed to 12s with eased hand moves, slow drawn-out exhale and lazier tip smoke. `go` lasts 4.3s.
- Step 2p: Mr. Sondr fades removed (plain black outline). Added a smoking hand drawn in SVG in his brush style (thick round black strokes, #ms-brush turbulence, red ember): cigarette at the corner of his mouth; loop every 7s from 3.2s: hand lowers while 3 puffs drift out of his mouth, then back up; 3 thin wisps always curl off the tip. Reduced motion: still.
- Step 2o: Mr. Sondr much bigger (min(72vh, 700u) tall, ~a quarter of the screen, flush bottom-left, behind the headline), masked to fade out at the top (toward the logo) and on the right (into the headline). Smile is now his own drawn mouth opening up from a closed line (scale/rotate on public/mr-sondr-mouth.webp), not a drawn curve.
- Step 2n: Mr. Sondr on the hero, bottom-left opposite the signature: black outline traced from DESIGN/MR_SONDR.png (grid removed; public/mr-sondr-outline.webp, his drawn mouth split out as public/mr-sondr-mouth.webp). Last in the entrance: pops up from the bottom edge, then the mouth shrinks away and a drawn smile strokes in. Resting state = smiling. Fades on scroll with the signature. `go` now lasts 3.3s.
- Step 2m: set orders (Dhruv's, not alphabetical): MR. SONDR = Detective Sondr, Mr Sondr Ponders, Mr. Sondr; SONDR UNIVERSE = Sondr Sunset, Sondr Universe, Sondr Smiles (title was "Sondr Miles").
- Step 2l: orbital gallery momentum: a flick (horizontal scroll, drag, swipe) keeps the ring gliding, easing to a steady cruise (0.15°/frame) in the spun direction; it never stops by itself. Hovering a card with the mouse stops it; moving off resumes. Arrow keys don't add momentum. Constants MAX_VEL/FRICTION/CRUISE in circular-gallery.tsx.
- Step 2k: /artsy gets two more contact sheets under the comics: MR. SONDR (Detective Sondr, Mr. Sondr, Mr Sondr Ponders) and SONDR UNIVERSE (Sondr Miles, Sondr Sunset, Sondr Universe). Ponders and Sunset moved out of Comics (now 6 pieces).
- Step 1: landing (TV opener + Slot A), hero, header (Slot B), footer (Slot C), Lenis, placeholder pages, favicon, OG image.
- Step 2j: About me shows the signature bottom-right, same size and place as on the hero (`signature` prop on PlaceholderPage, reuses `.sig`).
- Step 2i: "•EST•" left and "•2024•" right of the Hustler logo, level with its centre, same black lettering (`logoSides` in lib/galleries.ts).
- Step 2h: Hustler logo lettering is black and heavier (same-colour outline), letters set closer (each word spans 50% of its half-oval). Comics reordered to match DESIGN/Comics (1 Da Villain … 6 Eskapades, 7 Mr Sondr Ponders, 8 Sondr Sunset). Artsy hint hidden. About: "Dhruv Hardin is a very good looking human being."
- Step 2g: /about shows "Dhruv Hardin is really good looking human being" under the title; real resume at public/resume.pdf (copy in design/resume.pdf).
- Step 2f: "HUSTLER" spread across the top of the logo's oval and "JERSEYS" across the bottom (upright), in red, ringing the logo (components/site/arc-logo.tsx, SVG textPath, Bebas + #rough). Comics category renamed "SONDR COMICS Presents: Da Villain Da Begin’nin" (shown uppercase, balanced over two lines).
- Step 2e: /projects has no visible "PROJECTS" title (sr-only h1); the Hustler Jerseys logo leads the page (clamp(180px, 48vh, 500px) tall; phones min(86vw, 340px) wide). The red three-dot marks are gone from all category headings; only the hero keeps its dots.
- Step 2d: page titles (PROJECTS, ARTSY) and category headings (Hustler logo, CASE STUDIES, COMICS) centred; Hustler logo enlarged to the PROJECTS line height (220u, min 96px).
- Step 2b: Comics shown as a contact-sheet grid instead of the orbital gallery (layout "sheet").
- Step 2: /projects (Hustler Jerseys, School → renamed Case Studies) and /artsy (Comics) with the orbital gallery and a full-image viewer.
- Step 1b: Slot A removed at Dhruv's request; the landing goes straight from the TV opener to the hero (default transition).
- Projects page tweaks: Hustler Jerseys heading shows the Versatility · Authenticity patch logo (public/projects/hustler-jerseys/hustler-logo.webp, set via `logo` on the category in lib/galleries.ts; title kept as alt text). "School" renamed "Case Studies" (id stays `school`). The scroll/drag hint is hidden on /projects (`hint={false}` on CategoryGallery); /artsy keeps it.
