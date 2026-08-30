import type { ReactNode } from "react";
import { createPageMetadata } from "../../seo";

export const metadata = createPageMetadata({
  title: "Binary Decoder Game",
  description: "Learn how computers represent information by decoding binary values in this interactive HoCoHOC game.",
  path: "/game/BinaryDecoder",
});

export default function BinaryDecoderLayout({ children }: { children: ReactNode }) {
  return children;
}
