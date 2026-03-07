import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "./components/navbar/navbar";
import AuthProvider from "./components/auth-provider/authProvider";
import Footer from "./components/footer/footer";
import { ReactQueryClientProvider } from "./components/query-provider/queryProvider";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"], display: 'swap', variable: '--font-inter' });
const jbm = JetBrains_Mono({ subsets: ["latin"], display: 'swap', variable: '--font-jbm' })

export const metadata = {
  title: "Howard County Hour of Code / AI - Learn Computer Science",
  description: "Join Howard County's 7-day computer science event with interactive tutorials, games, AI challenges, and hands-on projects for all skill levels.",
  keywords: ["computer science", "coding", "AI", "hour of code", "Howard County", "education", "programming"],
  authors: [{ name: "Howard County Hour of Code / AI" }],
  creator: "Howard County Hour of Code / AI",
  publisher: "Howard County Hour of Code / AI",
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://hocohoc.org",
    title: "Howard County Hour of Code / AI - Learn Computer Science",
    description: "A 7-day event promoting computer science education with interactive challenges, games, and AI projects.",
    images: [
      {
        url: "https://hocohoc.org/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Howard County Hour of Code / AI",
      },
    ],
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
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Howard County Hour of Code / AI",
    "url": "https://hocohoc.org",
    "logo": "https://hocohoc.org/og-image.jpg",
    "description": "A 7-day event promoting computer science education with interactive challenges, games, and AI projects.",
    "directors": [
      {
        "@type": "Person",
        "name": "Daniel Gao",
        "jobTitle": "Director"
      },
      {
        "@type": "Person",
        "name": "Ankit Mohanty",
        "jobTitle": "Director"
      }
    ]
  };

  return (
    <html lang="en" className="flex flex-col w-full h-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
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
