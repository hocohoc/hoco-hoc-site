import Link from "next/link"

const FOOTER_LINKS = [
  { href: "/articles", label: "Articles" },
  { href: "/game", label: "Games" },
  { href: "/sandbox", label: "Challenges" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/aboutus", label: "About Us" },
  { href: "/feedback", label: "Feedback" },
]

export default function Footer() {
  return (
    <footer className="w-full text-slate-400 text-sm bg-slate-950/50 border-t border-t-gray-800">
      <div className="max-w-screen-xl mx-auto px-6 py-8 flex flex-col md:flex-row gap-8">
        {/* Brand + copyright */}
        <div className="flex flex-col gap-2 md:w-1/3">
          <p className="font-bold text-slate-200 text-base">&lt;HocoHOC/&gt;</p>
          <p>Howard County Hour of Code / AI</p>
          <p>&copy; {new Date().getFullYear()} HoCo Hour of Code. All rights reserved.</p>
        </div>

        {/* Quick links */}
        <div className="flex flex-col gap-2 md:w-1/3">
          <p className="font-bold text-slate-300 text-xs uppercase tracking-widest mb-1">Quick Links</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {FOOTER_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-sky-300 transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact + socials */}
        <div className="flex flex-col gap-3 md:w-1/3 md:items-end">
          <p className="font-bold text-slate-300 text-xs uppercase tracking-widest mb-1">Connect</p>
          <a className="hover:text-sky-300 transition-colors" href="mailto:mdhocohoc@gmail.com">
            mdhocohoc@gmail.com
          </a>
          <div className="flex gap-3">
            <a
              href="https://www.instagram.com/mdhocohoc/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Instagram"
              className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              <svg className="w-5 h-5 fill-slate-300" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 py-4 text-center text-xs text-slate-500">
        Made with ❤️ by the HoCoHOC Team
      </div>
    </footer>
  )
}
