"use client"

import Link from "next/link"

const FORM_SRC = "https://forms.gle/row6o5G195S9Ha88A"

export default function FeedbackPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center p-4">
      <div className="w-full max-w-4xl space-y-6">
        <header className="rounded-2xl border border-sky-900 bg-gradient-to-br from-slate-900 to-black p-6 shadow-xl">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">We&apos;d love to hear from you</p>
          <h1 className="mt-2 text-4xl font-bold text-white md:text-5xl">Share Your Feedback</h1>
          <p className="mt-4 text-lg text-slate-200">
            Let us know what you loved, what could be improved, or ideas for future Howard County Hour of Code / AI
            events. Responses go directly to the organizing team.
          </p>
          <p className="mt-4 text-sm text-slate-400">
            If the embedded form below does not load,{" "}
            <Link href="https://forms.gle/row6o5G195S9Ha88A" className="underline text-sky-300" target="_blank">
              open the Google Form in a new tab
            </Link>
            .
          </p>
        </header>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow">
          <iframe
            title="Howard County Hour of Code Feedback"
            src={FORM_SRC}
            className="w-full min-h-[80vh] rounded border border-slate-800"
            loading="lazy"
          >
            Loading…
          </iframe>
        </section>
      </div>
    </main>
  )
}
