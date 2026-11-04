import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/site/placeholder-page";

export const metadata: Metadata = { title: "About me · Dhruv Hardin", description: "About Dhruv Hardin." };

export default function Page() {
  return <PlaceholderPage title="About me" text="Dhruv Hardin is a very good looking human being." />;
}
