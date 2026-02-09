"use client"

import Link from "next/link";

export default function LeaderboardPage() {
    return <main className="p-4 flex flex-col items-center min-h-screen">
        <div className="max-w-2xl w-full">
            <div className="bg-sky-800 p-4 rounded mb-4 border-2 border-sky-900 text-center">
                <h1 className="font-mono text-2xl font-bold mb-2">School Leaderboard</h1>
            </div>
            <div className="rounded-2xl border-2 border-dashed border-sky-700/50 bg-slate-900/50 p-12 text-center">
                <div className="mx-auto max-w-md space-y-4">
                    <div className="text-6xl">📊</div>
                    <h2 className="text-2xl md:text-3xl font-mono font-bold text-sky-200">
                        2026 Leaderboard
                    </h2>
                    <p className="text-slate-300 text-base leading-relaxed">
                        The school leaderboard will go live once HocoHOC 2026 kicks off. We&apos;re gearing up for an exciting year &mdash; stay tuned!
                    </p>
                    <p className="text-slate-400 text-sm font-mono">
                        Compete with your school to climb the ranks.
                    </p>
                    <div className="pt-4">
                        <Link href="/" className="btn-primary px-6 py-2 font-semibold">
                            Return Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </main>
}
