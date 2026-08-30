import type { ReactNode } from "react";
import { createPageMetadata } from "../seo";

export const metadata = createPageMetadata({
  title: "Howard County School Leaderboard",
  description: "See how Howard County schools rank in the HoCoHOC computer science competition and follow the latest school point totals.",
  path: "/leaderboard",
});

export default function LeaderboardLayout({ children }: { children: ReactNode }) {
  return children;
}
