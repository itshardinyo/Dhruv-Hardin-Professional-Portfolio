import type { Metadata } from "next";
import { CategoryGallery } from "@/components/site/category-gallery";
import { PROJECTS } from "@/lib/galleries";

export const metadata: Metadata = {
  title: "Hustler Jerseys · Dhruv Hardin",
  description: "Hustler Jerseys by Dhruv Hardin.",
  openGraph: { title: "Hustler Jerseys · Dhruv Hardin", description: "Hustler Jerseys by Dhruv Hardin." },
};

const category = PROJECTS.find((c) => c.id === "hustler-jerseys")!;

/** Hustler Jerseys on its own page (Projects → Hustler Jerseys). Content lives in lib/galleries.ts. */
export default function Page() {
  return (
    <div className="gallery-page gallery-page--logo-led">
      {/* the Hustler Jerseys logo leads the page; the title stays for screen readers and search */}
      <h1 className="sr-only">Hustler Jerseys</h1>
      <CategoryGallery category={category} hint={false} />
    </div>
  );
}
