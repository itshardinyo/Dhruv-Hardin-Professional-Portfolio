import type { Metadata } from "next";
import { DarkPage } from "@/components/site/dark-page";
import { CategoryGallery } from "@/components/site/category-gallery";
import { ARTSY } from "@/lib/galleries";

export const metadata: Metadata = {
  title: "Artsy · Dhruv Hardin",
  description: "Comics and art by Dhruv Hardin.",
  openGraph: { title: "Artsy · Dhruv Hardin", description: "Comics and art by Dhruv Hardin." },
};

/** Artsy: one orbital gallery per category. Add a category in lib/galleries.ts. */
export default function Page() {
  return (
    <div className="gallery-page page-dark page-artsy">
      <DarkPage />
      <h1 className="display-rough artsy-title">Artsy</h1>
      {ARTSY.map((c) => (
        <CategoryGallery key={c.id} category={c} hint={false} />
      ))}
    </div>
  );
}
