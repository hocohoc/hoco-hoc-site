import { ReactNode } from "react"
import MeNav from "./me-nav"
import { createPageMetadata } from "../seo"

export const metadata = createPageMetadata({
  title: "Student Dashboard",
  description: "Your private HoCoHOC student dashboard.",
  path: "/me",
  noIndex: true,
})

export default function ProfileDashboardPage({ children }: { children: ReactNode }) {
  return <main className="w-full h-full flex flex-col p-2 md:p-8 items-center">
    <div className="w-full max-w-screen-xl flex flex-col md:flex-row md:justify-center items-start gap-4 md:gap-8">
      <MeNav />
      <div className="md:flex-1 w-full h-full p-2">
        {children}
      </div>
    </div>
  </main>
}
