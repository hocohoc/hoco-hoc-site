import type { ReactNode } from "react";
import { createPageMetadata } from "../../seo";

export const metadata = createPageMetadata({
  title: "FlexiBot Coding Game",
  description: "Build programming and problem-solving skills by guiding FlexiBot through interactive coding challenges.",
  path: "/game/Flexibot",
});

export default function FlexibotLayout({ children }: { children: ReactNode }) {
  return children;
}
