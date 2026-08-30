import type { ReactNode } from "react";
import { createPageMetadata } from "../seo";

export const metadata = createPageMetadata({
  title: "Share Feedback",
  description: "Share feedback and ideas to help improve future Howard County Hour of Code / AI events.",
  path: "/feedback",
});

export default function FeedbackLayout({ children }: { children: ReactNode }) {
  return children;
}
