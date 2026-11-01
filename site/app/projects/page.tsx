import type { Metadata } from "next";
import { CategoryGallery } from "@/components/site/category-gallery";
import { PROJECTS } from "@/lib/galleries";

export const metadata: Metadata = {
  title: "Projects · Dhruv Hardin",
  description: "Hustler Jerseys and school projects by Dhruv Hardin.",
  openGraph: { title: "Projects · Dhruv Hardin", description: "Hustler Jerseys and school projects by Dhruv Hardin." },
};

/** Projects: one orbital gallery per category. Add a category in lib/galleries.ts. */
export default function Page() {
  return (
    <div className="gallery-page">
      <h1 className="display-rough">Projects</h1>
      {PROJECTS.map((c) => (
        <CategoryGallery key={c.id} category={c} />
      ))}
    </div>
  );
}
