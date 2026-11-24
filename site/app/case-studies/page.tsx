import type { Metadata } from "next";
import { CategoryGallery } from "@/components/site/category-gallery";
import { PROJECTS } from "@/lib/galleries";

export const metadata: Metadata = {
  title: "Case Studies · Dhruv Hardin",
  description: "Case studies by Dhruv Hardin.",
  openGraph: { title: "Case Studies · Dhruv Hardin", description: "Case studies by Dhruv Hardin." },
};

const category = PROJECTS.find((c) => c.id === "school")!;

/** Case Studies on its own page (Projects → Case Studies). Content lives in lib/galleries.ts (category id "school"). */
export default function Page() {
  return (
    <div className="gallery-page gallery-page--logo-led page-cases">
      <h1 className="sr-only">Case Studies</h1>
      <CategoryGallery category={category} hint={false} />
    </div>
  );
}
