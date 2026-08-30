import type { ReactNode } from "react";
import { createPageMetadata } from "../../seo";

export const metadata = createPageMetadata({
  title: "Hex Guesser Game",
  description: "Practice hexadecimal colors and web-development fundamentals with the interactive HoCoHOC Hex Guesser game.",
  path: "/game/HexGuesser",
});

export default function HexGuesserLayout({ children }: { children: ReactNode }) {
  return children;
}
