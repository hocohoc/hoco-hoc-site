import type { ReactNode } from "react";
import { createPageMetadata } from "../seo";

export const metadata = createPageMetadata({
  title: "Free Coding and AI Games",
  description: "Play free interactive coding, algorithms, binary, and AI games created for Howard County students by the HoCoHOC team.",
  path: "/game",
});

export default function GamesLayout({ children }: { children: ReactNode }) {
  return children;
}
