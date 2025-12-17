"use client"

import Link from "next/link"

const FORM_SRC = "https://forms.gle/row6o5G195S9Ha88A"

export default function FeedbackPage() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center p-4">
      <div className="w-full max-w-4xl space-y-6 pt-6">
        <header className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-lg">
          <p className="text-xs uppercase tracking-[0.4em] text-sky-400 font-mono">Share Your Thoughts</p>
          <h1 className="mt-4 text-4xl md:text-5xl font-mono font-bold text-sky-200">
            Feedback Form
          </h1>
          <p className="mt-6 text-lg text-slate-200 leading-relaxed">
            We&apos;d love to hear from you! Let us know what you loved, what could be improved, or ideas for future Howard County Hour of Code / AI events. Your feedback directly helps us create a better experience.
          </p>
          <p className="mt-4 text-sm text-slate-400">
            If the embedded form below does not load,{" "}
            <Link href="https://forms.gle/row6o5G195S9Ha88A" className="text-sky-300 hover:text-sky-200 underline transition-colors" target="_blank">
              open the Google Form in a new tab
            </Link>
            .
          </p>
        </header>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-2 shadow-lg">
          <iframe
            title="Howard County Hour of Code Feedback"
            src={FORM_SRC}
            className="w-full min-h-[80vh] rounded-xl border border-slate-800"
            loading="lazy"
          >
            Loading…
          </iframe>
        </section>
      </div>
    </main>
  )
}
