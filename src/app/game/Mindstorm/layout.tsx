import type { ReactNode } from "react";
import { createPageMetadata } from "../../seo";

export const metadata = createPageMetadata({
  title: "Mindstorm Coding Game",
  description: "Challenge your computational thinking and problem-solving skills in the HoCoHOC Mindstorm game.",
  path: "/game/Mindstorm",
});

export default function MindstormLayout({ children }: { children: ReactNode }) {
  return children;
}
