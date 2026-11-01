import { preload } from "react-dom";
import { Hero } from "@/components/site/hero";

export default function Home() {
  // The TV opener draws the patch first thing, so fetch it early (only on "/").
  preload("/logo-patch.webp", { as: "image", type: "image/webp", fetchPriority: "high" });
  return <Hero />;
}
