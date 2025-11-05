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
  title: "Howard County Hour of Code",
  description: "Howard County Hour of Code is a 7-day event to promote learning more about computer science!",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en" className="flex flex-col w-full h-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
