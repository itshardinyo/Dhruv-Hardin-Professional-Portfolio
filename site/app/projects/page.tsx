import type { Metadata } from "next";
import { CategoryGallery } from "@/components/site/category-gallery";
import { PROJECTS } from "@/lib/galleries";

export const metadata: Metadata = {
  title: "Projects · Dhruv Hardin",
  description: "Hustler Jerseys and case studies by Dhruv Hardin.",
  openGraph: { title: "Projects · Dhruv Hardin", description: "Hustler Jerseys and case studies by Dhruv Hardin." },
};

/** Projects: one orbital gallery per category. Add a category in lib/galleries.ts. */
export default function Page() {
  return (
    <div className="gallery-page gallery-page--logo-led">
      {/* the Hustler Jerseys logo leads the page; the title stays for screen readers and search */}
      <h1 className="sr-only">Projects</h1>
      {PROJECTS.map((c) => (
        <CategoryGallery key={c.id} category={c} hint={false} />
      ))}
    </div>
  );
}
