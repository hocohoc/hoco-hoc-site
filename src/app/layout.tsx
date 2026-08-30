import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "./components/navbar/navbar";
import AuthProvider from "./components/auth-provider/authProvider";
import Footer from "./components/footer/footer";
import { ReactQueryClientProvider } from "./components/query-provider/queryProvider";
import { Suspense } from "react";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"], display: 'swap', variable: '--font-inter' });
const jbm = JetBrains_Mono({ subsets: ["latin"], display: 'swap', variable: '--font-jbm' })

const siteDescription = "Join Howard County's 7-day computer science event with interactive tutorials, games, AI challenges, and hands-on projects for students of all skill levels.";

export const metadata: Metadata = {
  metadataBase: new URL("https://hocohoc.org"),
  applicationName: "HoCoHOC",
  title: {
    default: "HoCoHOC | Howard County Hour of Code / AI",
    template: "%s | HoCoHOC",
  },
  description: siteDescription,
  authors: [{ name: "Howard County Hour of Code / AI" }],
  creator: "Howard County Hour of Code / AI",
  publisher: "Howard County Hour of Code / AI",
  category: "education",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [{ url: "/icon.png", type: "image/png", sizes: "96x96" }],
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "HoCoHOC",
    title: "HoCoHOC | Howard County Hour of Code / AI",
    description: siteDescription,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "HoCoHOC — Howard County Hour of Code / AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HoCoHOC | Howard County Hour of Code / AI",
    description: siteDescription,
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },
};


export default function RootLayout({ children }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://hocohoc.org/#website",
        "url": "https://hocohoc.org/",
        "name": "HoCoHOC",
        "alternateName": [
          "Howard County Hour of Code / AI",
          "hocohoc.org"
        ],
        "description": siteDescription,
        "publisher": {
          "@id": "https://hocohoc.org/#organization"
        },
        "inLanguage": "en-US"
      },
      {
        "@type": "Organization",
        "@id": "https://hocohoc.org/#organization",
        "name": "Howard County Hour of Code / AI",
        "alternateName": "HoCoHOC",
        "url": "https://hocohoc.org/",
        "logo": {
          "@type": "ImageObject",
          "url": "https://hocohoc.org/icon.png",
          "width": 96,
          "height": 96
        },
        "description": siteDescription
      }
    ]
  };

  return (
    <html lang="en" className="flex flex-col w-full h-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script id="site-structured-data" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </head>
      <body className={`${inter.className} ${inter.variable} ${jbm.variable} w-full h-full antialiased`}>
        <Suspense>
            <ReactQueryClientProvider>
              <AuthProvider>
                <div className="w-full min-h-screen flex flex-col relative">
                  <a href="#main-content" className="skip-link absolute left-2 top-2 -translate-y-[200%] focus-visible:translate-y-0 bg-sky-300 text-slate-900 px-4 py-2 rounded font-medium transition-transform">Skip to main content</a>
                  <NavBar />
                  <main id="main-content" className="flex-1">
                    {children}
                  </main>
                  <Footer />
                </div>
              </AuthProvider>
            </ReactQueryClientProvider>
        </Suspense>
      </body>
    </html>
  )
}
