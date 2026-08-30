import type { ReactNode } from "react";
import { createPageMetadata } from "../seo";

export const metadata = createPageMetadata({
  title: "Join the HoCoHOC Team",
  description: "Help organize Howard County Hour of Code / AI and make computer science education more exciting for local students.",
  path: "/recruitment",
});

export default function RecruitmentLayout({ children }: { children: ReactNode }) {
  return children;
}
