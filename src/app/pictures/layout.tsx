import type { ReactNode } from "react";
import { createPageMetadata } from "../seo";

export const metadata = createPageMetadata({
  title: "Event Pictures and Highlights",
  description: "View photos, school highlights, and memories from Howard County Hour of Code / AI events.",
  path: "/pictures",
});

export default function PicturesLayout({ children }: { children: ReactNode }) {
  return children;
}
