import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/site/placeholder-page";

export const metadata: Metadata = { title: "Artsy · Dhruv Hardin" };

export default function Page() {
  return <PlaceholderPage title="Artsy" />;
}
