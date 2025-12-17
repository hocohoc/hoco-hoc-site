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
      <div className="w-full max-w-4xl space-y-6">
        <section className="rounded-2xl border border-sky-900 bg-gradient-to-br from-sky-900 via-slate-900 to-black p-6 shadow-xl">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-300">2025 Howard County Hour of Code / AI</p>
          <h1 className="mt-2 text-4xl font-bold text-white md:text-5xl">Raffle Prize Winners</h1>
          <p className="mt-4 text-lg text-slate-200">
            Each raffle prize is awarded randomly based on article completion points. We only publish first names and
            school names for privacy. Congratulations to this year&apos;s winners!
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/" className="btn-primary">
              Return Home
            </Link>
            <Link href="/leaderboard" className="btn-secondary">
              View School Leaderboard
            </Link>
          </div>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Official Results</p>
              <h2 className="text-2xl font-semibold text-white">Prize Winners</h2>
            </div>
            {orderedWinners.length > 0 && (
              <p className="text-sm text-slate-400">
                Last updated {orderedWinners[0].timestamp.toDate().toLocaleDateString()}
              </p>
            )}
          </div>

          {loading && (
            <p className="mt-4 rounded border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-300">
              Loading winners…
            </p>
          )}

          {error && !loading && (
            <p className="mt-4 rounded border border-red-900 bg-red-950/60 p-4 text-sm text-red-200">
              {error}
            </p>
          )}

          {!loading && !error && orderedWinners.length === 0 && (
            <p className="mt-4 rounded border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-300">
              Raffle winners have not been published yet. Check back after the drawing to meet the prize recipients.
            </p>
          )}

          {!loading && !error && orderedWinners.length > 0 && (
            <div className="mt-6 space-y-10">
              {majorWinners.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-white uppercase tracking-[0.3em] text-center mb-4">
                    Major Prizes
                  </h3>
                  <div className="grid gap-6 md:grid-cols-2">
                    {majorWinners.map((winner) => (
                      <article
                        key={`${winner.prizeId}-${winner.winnerUid}-${winner.timestamp.toMillis()}`}
                        className="rounded-3xl border-2 border-amber-400/30 bg-gradient-to-br from-yellow-500/10 via-slate-900 to-black p-6 shadow-2xl shadow-amber-900/30"
                      >
                        <p className="text-sm uppercase tracking-[0.4em] text-amber-300">Major Prize</p>
                        <h3 className="text-3xl font-extrabold text-white mt-2">{winner.prizeName}</h3>
                        <div className="mt-5 space-y-2">
                          <p className="text-lg font-semibold text-white">
                            {firstNameOf(winner.winnerName)}
                            <span className="text-amber-200"> • </span>
                            <span className="text-slate-100">{formatSchool(winner.winnerSchool)}</span>
                          </p>
                          <p className="text-xs text-slate-300 tracking-wider">
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
                  <h3 className="text-xl font-semibold text-white uppercase tracking-[0.3em] text-center mb-4">
                    Additional Winners
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {minorWinners.map((winner) => (
                      <article
                        key={`${winner.prizeId}-${winner.winnerUid}-${winner.timestamp.toMillis()}`}
                        className="rounded-xl border border-sky-900/40 bg-slate-950/60 p-4 shadow-md shadow-black/30"
                      >
                        <p className="text-sm uppercase tracking-widest text-sky-400">Prize</p>
                        <h3 className="text-xl font-semibold text-white">{winner.prizeName}</h3>
                        <div className="mt-4 space-y-1">
                          <p className="text-base font-semibold text-slate-100">
                            {firstNameOf(winner.winnerName)}
                            <span className="text-slate-500"> • </span>
                            <span className="text-slate-200">{formatSchool(winner.winnerSchool)}</span>
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
