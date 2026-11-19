import type { ReactNode } from "react";
import { createPageMetadata } from "../seo";

export const metadata = createPageMetadata({
  title: "Interactive Coding Challenges",
  description: "Practice Python, predict code output, and solve interactive coding challenges with HoCoHOC. Build your skills with beginner to advanced problems.",
  path: "/sandbox",
});

export default function SandboxLayout({ children }: { children: ReactNode }) {
  return children;
}
