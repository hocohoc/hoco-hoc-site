import type { ReactNode } from "react";
import { createPageMetadata } from "../../seo";

export const metadata = createPageMetadata({
  title: "Purr-ceptron AI Game",
  description: "Train a perceptron to distinguish cats from fish in this playful introduction to machine learning.",
  path: "/game/Purrceptron",
});

export default function PurrceptronLayout({ children }: { children: ReactNode }) {
  return children;
}
