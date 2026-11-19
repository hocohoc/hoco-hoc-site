import type { ReactNode } from "react";
import { createPageMetadata } from "../seo";

export const metadata = createPageMetadata({
  title: "Free Coding and AI Games",
  description: "Play free coding and AI games from HoCoHOC. Explore algorithms, decode binary messages, and train your own machine learning models.",
  path: "/game",
});

export default function GamesLayout({ children }: { children: ReactNode }) {
  return children;
}
