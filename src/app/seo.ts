import type { Metadata } from "next";

const SITE_NAME = "HoCoHOC";
const SOCIAL_IMAGE = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "HoCoHOC — Howard County Hour of Code / AI",
};

type PageMetadataOptions = {
  title: string;
  description: string;
  path: `/${string}`;
  noIndex?: boolean;
};

export function createPageMetadata({
  title,
  description,
  path,
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const canonicalPath = path.endsWith("/") ? path : `${path}/`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: canonicalPath,
      siteName: SITE_NAME,
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [SOCIAL_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [SOCIAL_IMAGE.url],
    },
    ...(noIndex
      ? {
          robots: {
            index: false,
            follow: false,
          },
        }
      : {}),
  };
}
