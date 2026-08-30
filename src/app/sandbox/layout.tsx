import type { ReactNode } from "react";
import { createPageMetadata } from "../seo";

export const metadata = createPageMetadata({
  title: "Interactive Coding Challenges",
  description: "Practice predicting and writing code with interactive HoCoHOC challenges for students at every experience level.",
  path: "/sandbox",
});

export default function SandboxLayout({ children }: { children: ReactNode }) {
  return children;
}
