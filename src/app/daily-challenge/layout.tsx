import type { ReactNode } from "react";
import { createPageMetadata } from "../seo";

export const metadata = createPageMetadata({
  title: "Daily Coding Challenge",
  description: "Take on the latest HoCoHOC coding challenge, test your computer science skills, and earn points for your school.",
  path: "/daily-challenge",
});

export default function DailyChallengeLayout({ children }: { children: ReactNode }) {
  return children;
}
