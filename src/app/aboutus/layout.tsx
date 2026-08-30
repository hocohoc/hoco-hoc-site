import type { ReactNode } from "react";
import { createPageMetadata } from "../seo";

export const metadata = createPageMetadata({
  title: "About Howard County Hour of Code / AI",
  description: "Meet the student-led HoCoHOC team and learn how we make computer science education engaging and accessible across Howard County.",
  path: "/aboutus",
});

export default function AboutLayout({ children }: { children: ReactNode }) {
  return children;
}
