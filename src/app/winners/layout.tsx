import type { ReactNode } from "react";
import { createPageMetadata } from "../seo";

export const metadata = createPageMetadata({
  title: "HoCoHOC Winners and Champions",
  description: "Celebrate the students, raffle winners, and school champions from Howard County Hour of Code / AI.",
  path: "/winners",
});

export default function WinnersLayout({ children }: { children: ReactNode }) {
  return children;
}
