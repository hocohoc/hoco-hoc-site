import type { ReactNode } from "react";
import { createPageMetadata } from "../seo";

export const metadata = createPageMetadata({
  title: "Teacher Dashboard",
  description: "HoCoHOC teacher dashboard.",
  path: "/teachers",
  noIndex: true,
});

export default function TeachersLayout({ children }: { children: ReactNode }) {
  return children;
}
