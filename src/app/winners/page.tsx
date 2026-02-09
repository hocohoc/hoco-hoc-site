"use client"

import Link from "next/link"

export default function WinnersPage() {
  return (
    <main className="bg-black min-h-screen text-white flex flex-col items-center p-4">
      <div className="w-full max-w-4xl space-y-6 pt-4">
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-lg text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-sky-400 font-mono">2026</p>
          <h1 className="mt-4 text-4xl md:text-5xl font-mono font-bold text-sky-200">
            Winners &amp; Prizes
          </h1>
          <div className="mt-8 mx-auto max-w-lg space-y-4">
            <p className="text-lg text-slate-200 leading-relaxed">
              HocoHOC 2026 is currently in the planning phase. Winners will be announced here once the event takes place. Get ready &mdash; it&apos;s going to be exciting!
            </p>
            <p className="text-slate-400 text-sm font-mono">
              Stay tuned for updates on dates, prizes, and more.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/" className="btn-primary px-6 py-2 font-semibold">
              Return Home
            </Link>
            <Link href="/articles" className="btn-secondary px-6 py-2 font-semibold">
              Browse Articles
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
