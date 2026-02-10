"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { PublicRaffleWinner, getPublicRaffleWinners } from "../services/raffleService"

function firstNameOf(name?: string) {
  if (!name) return "Winner"
  const trimmed = name.trim()
  if (!trimmed) return "Winner"
  const [first] = trimmed.split(/\s+/)
  return first || "Winner"
}

function formatSchool(school?: string) {
  if (!school) return "School not provided"
  return school
}

export default function WinnersPage() {
  const [winners, setWinners] = useState<PublicRaffleWinner[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    async function fetchWinners() {
      try {
        setLoading(true)
        const data = await getPublicRaffleWinners()
        if (active) {
          setWinners(data)
          setError(null)
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Unable to load winners.")
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    fetchWinners()
    return () => {
      active = false
    }
  }, [])

  const orderedWinners = useMemo(() => {
    return [...winners].sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis())
  }, [winners])

  const majorWinners = orderedWinners.filter((winner) => winner.prizeTier === "major")
  const minorWinners = orderedWinners.filter((winner) => winner.prizeTier !== "major")

  return (
    <main className="bg-black min-h-screen text-white flex flex-col items-center p-4">
      <div className="w-full max-w-4xl space-y-6 pt-4">
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-lg">
          <p className="text-xs uppercase tracking-[0.4em] text-sky-400 font-mono">2025 Awards</p>
          <h1 className="mt-4 text-4xl md:text-5xl font-mono font-bold text-sky-200">
            Raffle Prize Winners
          </h1>
          <p className="mt-6 text-lg text-slate-200 leading-relaxed">
            Each raffle prize is awarded randomly based on article completion points. We only publish first names and school names for privacy. Congratulations to this year&apos;s winners!
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/" className="btn-primary px-6 py-2 font-semibold">
              Return Home
            </Link>
            <Link href="/leaderboard" className="btn-secondary px-6 py-2 font-semibold">
              View School Leaderboard
            </Link>
          </div>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-sky-400 font-mono">Official Results</p>
              <h2 className="text-2xl md:text-3xl font-mono font-bold text-sky-200 mt-2">
                Prize Winners
              </h2>
            </div>
            {orderedWinners.length > 0 && (
              <p className="text-sm text-slate-400">
                Last updated {orderedWinners[0].timestamp.toDate().toLocaleDateString()}
              </p>
            )}
          </div>

          {loading && (
            <p className="mt-6 rounded-lg border border-sky-900/50 bg-slate-950 p-4 text-sm text-sky-300">
              Loading winners…
            </p>
          )}

          {error && !loading && (
            <p className="mt-6 rounded-lg border border-red-900/50 bg-red-950/30 p-4 text-sm text-red-200">
              {error}
            </p>
          )}

          {!loading && !error && orderedWinners.length === 0 && (
            <p className="mt-6 rounded-lg border border-sky-900/50 bg-slate-950/60 p-4 text-sm text-sky-300">
              Raffle winners have not been published yet. Check back after the drawing to meet the prize recipients.
            </p>
          )}

          {!loading && !error && orderedWinners.length > 0 && (
            <div className="mt-8 space-y-10">
              {majorWinners.length > 0 && (
                <div>
                  <h3 className="text-xl font-mono font-bold uppercase tracking-[0.3em] text-center mb-6 text-sky-300">
                    Major Prizes
                  </h3>
                  <div className="grid gap-6 md:grid-cols-2">
                    {majorWinners.map((winner) => (
                      <article
                        key={`${winner.prizeId}-${winner.winnerUid}-${winner.timestamp.toMillis()}`}
                        className="rounded-2xl border-2 border-amber-400/40 bg-gradient-to-br from-amber-500/15 via-slate-950 to-black p-6 shadow-xl shadow-amber-900/20 hover:shadow-amber-900/40 transition-shadow"
                      >
                        <p className="text-sm uppercase tracking-[0.4em] text-amber-400 font-mono font-semibold">Major Prize</p>
                        <h3 className="text-2xl md:text-3xl font-mono font-bold text-amber-50 mt-3">{winner.prizeName}</h3>
                        <div className="mt-5 space-y-2">
                          <p className="text-lg font-semibold text-white">
                            {firstNameOf(winner.winnerName)}
                            <span className="text-amber-300/70"> • </span>
                            <span className="text-sky-200">{formatSchool(winner.winnerSchool)}</span>
                          </p>
                          <p className="text-xs text-slate-400 tracking-wider">
                            Drawn on {winner.timestamp.toDate().toLocaleString(undefined, { dateStyle: "long" })}
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {minorWinners.length > 0 && (
                <div>
                  <h3 className="text-xl font-mono font-bold uppercase tracking-[0.3em] text-center mb-6 text-sky-300">
                    Additional Winners
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {minorWinners.map((winner) => (
                      <article
                        key={`${winner.prizeId}-${winner.winnerUid}-${winner.timestamp.toMillis()}`}
                        className="rounded-xl border border-sky-700/50 bg-slate-950/60 backdrop-blur-sm p-5 shadow-lg shadow-sky-900/20 hover:shadow-sky-900/40 transition-shadow hover:border-sky-600/70"
                      >
                        <p className="text-xs uppercase tracking-[0.3em] text-sky-400 font-mono font-semibold">Prize Winner</p>
                        <h3 className="text-xl font-mono font-bold text-sky-200 mt-2">{winner.prizeName}</h3>
                        <div className="mt-4 space-y-2">
                          <p className="text-base font-semibold text-slate-100">
                            {firstNameOf(winner.winnerName)}
                            <span className="text-sky-400/60"> • </span>
                            <span className="text-sky-200">{formatSchool(winner.winnerSchool)}</span>
                          </p>
                          <p className="text-xs text-slate-400">
                            Drawn on {winner.timestamp.toDate().toLocaleString(undefined, { dateStyle: "medium" })}
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}