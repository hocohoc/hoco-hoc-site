import type { ReactNode } from "react";
import { createPageMetadata } from "../../seo";

export const metadata = createPageMetadata({
  title: "Algo Sorter Game",
  description: "Learn how sorting algorithms work by arranging data correctly in this interactive HoCoHOC game.",
  path: "/game/AlgoSorter",
});

export default function AlgoSorterLayout({ children }: { children: ReactNode }) {
  return children;
}
