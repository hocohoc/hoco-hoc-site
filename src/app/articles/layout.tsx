import type { ReactNode } from "react";
import { createPageMetadata } from "../seo";

export const metadata = createPageMetadata({
  title: "Computer Science Articles for Students",
  description: "Explore student-friendly articles about programming, algorithms, web development, artificial intelligence, and machine learning while earning points for your school.",
  path: "/articles",
});

export default function ArticlesLayout({ children }: { children: ReactNode }) {
  return children;
}
