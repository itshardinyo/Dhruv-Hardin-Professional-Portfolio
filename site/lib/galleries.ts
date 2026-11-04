/*
  Gallery content for /artsy and /projects. Generated from the folders in Downloads/DESIGN:
  DESIGN/Comics → public/artsy/comics, DESIGN/Hustler Jerseys → public/projects/hustler-jerseys,
  DESIGN/School (PDFs) → public/projects/school (the PDF plus one image per slide).
  To add a category, add one entry to ARTSY or PROJECTS. Edit titles and descriptions here.
*/

export interface GalleryImage { src: string; width: number; height: number }

export interface GalleryEntry {
  id: string;
  title: string;
  description?: string;
  /** shown on the card and opened in the viewer */
  image: GalleryImage;
  /** where to centre the crop on the card */
  pos?: string;
  /** extra pages (slide decks): shown one after another in the viewer */
  pages?: GalleryImage[];
  /** a file to open in a new tab from the viewer */
  file?: { href: string; label: string };
}

export interface GalleryCategory {
  id: string;
  title: string;
  /** "Hustler jersey", "School project", "Comic": added to alt text */
  kind: string;
  /** "orbit" (default): the 21st.dev orbital gallery · "sheet": a numbered contact-sheet grid (Comics) */
  layout?: "orbit" | "sheet";
  /** optional logo shown in place of the heading text, with the title curved in red over its top edge */
  logo?: GalleryImage;
  items: GalleryEntry[];
}

const img = (src: string, width: number, height: number): GalleryImage => ({ src, width, height });

export const PROJECTS: GalleryCategory[] = [
  {
    id: "hustler-jerseys",
    title: "Hustler Jerseys",
    kind: "Hustler jersey",
    logo: img("/projects/hustler-jerseys/hustler-logo.webp", 900, 736),
    items: [
      { id: "jersey-01", title: "Hustler Jerseys · 01", image: img("/projects/hustler-jerseys/illustration-sans-titre-1.webp", 1800, 2400), pos: "50% 30%" },
      { id: "jersey-02", title: "Hustler Jerseys · 02", image: img("/projects/hustler-jerseys/img-0024.webp", 938, 2031), pos: "50% 30%" },
      { id: "jersey-03", title: "Hustler Jerseys · 03", image: img("/projects/hustler-jerseys/img-0028.webp", 1116, 2046), pos: "50% 30%" },
      { id: "jersey-04", title: "Hustler Jerseys · 04", image: img("/projects/hustler-jerseys/img-0030.webp", 945, 2048), pos: "50% 30%" },
      { id: "jersey-05", title: "Hustler Jerseys · 05", image: img("/projects/hustler-jerseys/img-0036.webp", 677, 1200), pos: "50% 30%" },
      { id: "jersey-06", title: "Hustler Jerseys · 06", image: img("/projects/hustler-jerseys/img-0040.webp", 1200, 1500), pos: "50% 30%" },
      { id: "jersey-07", title: "Hustler Jerseys · 07", image: img("/projects/hustler-jerseys/img-0064.webp", 674, 1200), pos: "50% 30%" },
      { id: "jersey-08", title: "Hustler Jerseys · 08", image: img("/projects/hustler-jerseys/img-0067.webp", 945, 2048), pos: "50% 30%" },
      { id: "jersey-09", title: "Hustler Jerseys · 09", image: img("/projects/hustler-jerseys/img-0073.webp", 720, 891), pos: "50% 30%" },
      { id: "jersey-10", title: "Hustler Jerseys · 10", image: img("/projects/hustler-jerseys/img-0105.webp", 1200, 1481), pos: "50% 30%" },
      { id: "jersey-11", title: "Hustler Jerseys · 11", image: img("/projects/hustler-jerseys/img-0129.webp", 555, 1200), pos: "50% 30%" },
      { id: "jersey-12", title: "Hustler Jerseys · 12", image: img("/projects/hustler-jerseys/img-0130.webp", 944, 2048), pos: "50% 30%" },
      { id: "jersey-13", title: "Hustler Jerseys · 13", image: img("/projects/hustler-jerseys/img-5489.webp", 828, 1104), pos: "50% 30%" },
    ],
  },
  {
    id: "school",
    title: "Case Studies",
    kind: "School project",
    items: [
      {
        id: "school-01",
        title: "Mauritian Creole",
        description: "AFST 310 · An introduction to the language of Mauritius, by Dhruv Hardin. 9 slides.",
        image: img("/projects/school/afst-310-mauritian-creole-01.webp", 1920, 1080),
        pages: [img("/projects/school/afst-310-mauritian-creole-01.webp", 1920, 1080), img("/projects/school/afst-310-mauritian-creole-02.webp", 1920, 1080), img("/projects/school/afst-310-mauritian-creole-03.webp", 1920, 1080), img("/projects/school/afst-310-mauritian-creole-04.webp", 1920, 1080), img("/projects/school/afst-310-mauritian-creole-05.webp", 1920, 1080), img("/projects/school/afst-310-mauritian-creole-06.webp", 1920, 1080), img("/projects/school/afst-310-mauritian-creole-07.webp", 1920, 1080), img("/projects/school/afst-310-mauritian-creole-08.webp", 1920, 1080), img("/projects/school/afst-310-mauritian-creole-09.webp", 1920, 1080)],
        file: { href: "/projects/school/afst-310-mauritian-creole.pdf", label: "Open the PDF" },
      },
      {
        id: "school-02",
        title: "Kirikou et la Sorcière",
        description: "FREN 428 · A presentation in French on Michel Ocelot’s film, by Dhruv Hardin. 14 slides.",
        image: img("/projects/school/kirikou-et-la-sorciere-de-dhruv-hardin-fren-428-01.webp", 1920, 1080),
        pages: [img("/projects/school/kirikou-et-la-sorciere-de-dhruv-hardin-fren-428-01.webp", 1920, 1080), img("/projects/school/kirikou-et-la-sorciere-de-dhruv-hardin-fren-428-02.webp", 1920, 1080), img("/projects/school/kirikou-et-la-sorciere-de-dhruv-hardin-fren-428-03.webp", 1920, 1080), img("/projects/school/kirikou-et-la-sorciere-de-dhruv-hardin-fren-428-04.webp", 1920, 1080), img("/projects/school/kirikou-et-la-sorciere-de-dhruv-hardin-fren-428-05.webp", 1920, 1080), img("/projects/school/kirikou-et-la-sorciere-de-dhruv-hardin-fren-428-06.webp", 1920, 1080), img("/projects/school/kirikou-et-la-sorciere-de-dhruv-hardin-fren-428-07.webp", 1920, 1080), img("/projects/school/kirikou-et-la-sorciere-de-dhruv-hardin-fren-428-08.webp", 1920, 1080), img("/projects/school/kirikou-et-la-sorciere-de-dhruv-hardin-fren-428-09.webp", 1920, 1080), img("/projects/school/kirikou-et-la-sorciere-de-dhruv-hardin-fren-428-10.webp", 1920, 1080), img("/projects/school/kirikou-et-la-sorciere-de-dhruv-hardin-fren-428-11.webp", 1920, 1080), img("/projects/school/kirikou-et-la-sorciere-de-dhruv-hardin-fren-428-12.webp", 1920, 1080), img("/projects/school/kirikou-et-la-sorciere-de-dhruv-hardin-fren-428-13.webp", 1920, 1080), img("/projects/school/kirikou-et-la-sorciere-de-dhruv-hardin-fren-428-14.webp", 1920, 1080)],
        file: { href: "/projects/school/kirikou-et-la-sorciere-de-dhruv-hardin-fren-428.pdf", label: "Open the PDF" },
      },
    ],
  },
];

export const ARTSY: GalleryCategory[] = [
  {
    id: "comics",
    title: "SONDR COMICS Presents: Da Villain Da Begin’nin",
    kind: "Comic",
    layout: "sheet",
    items: [
      { id: "comic-01", title: "Da Monsta", image: img("/artsy/comics/da-monsta.webp", 2400, 1004) },
      { id: "comic-02", title: "Da Prison", image: img("/artsy/comics/da-prison.webp", 2400, 1004) },
      { id: "comic-03", title: "Da Villain: Da Beginnin'", description: "A story from the mind of Dhruv Hardin", image: img("/artsy/comics/da-villain-da-beginnin.webp", 2400, 1004) },
      { id: "comic-04", title: "EduKtion", image: img("/artsy/comics/eduktion.webp", 2400, 1004) },
      { id: "comic-05", title: "Eskapades", image: img("/artsy/comics/eskapades.webp", 2400, 1004) },
      { id: "comic-06", title: "Mr. Sondr", description: "Untitled illustration", image: img("/artsy/comics/illustration-sans-titre.webp", 1697, 2400) },
      { id: "comic-07", title: "SONDR", description: "Untitled (IMG_0523)", image: img("/artsy/comics/img-0523-2.webp", 640, 800) },
      { id: "comic-08", title: "MentAL", image: img("/artsy/comics/mental.webp", 2400, 1004) },
    ],
  },
];
