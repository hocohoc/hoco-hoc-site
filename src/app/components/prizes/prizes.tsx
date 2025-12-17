"use client"

import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { DEFAULT_PRIZES, Prize, getRaffleConfig } from "@/app/services/raffleService"

function formatQuantity(prize: Prize) {
  if (prize.quantity <= 1) {
    return ""
  }
  return `×${prize.quantity}`
}

export default function Prizes() {
  const { data } = useQuery({
    queryKey: ["raffle-config-public"],
    queryFn: getRaffleConfig,
  })

  const prizes = useMemo<Prize[]>(() => {
    if (data?.prizes && data.prizes.length > 0) {
      return data.prizes
    }
    return DEFAULT_PRIZES
  }, [data?.prizes])

  return (
    <div>
      <div className="p-8 flex flex-col items-center bg-slate-950 md:py-32 py-20">
        <div className="flex flex-col max-w-screen-xl items-start w-full">
          <div className="w-full gap-12 flex flex-col max-w-3xl">
            <div className="flex-1">
              <h1 className="font-mono leading-tight text-5xl md:text-6xl pb-4 text-sky-300 font-bold bg-gradient-to-b from-gray-300 to-gray-400 text-transparent bg-clip-text">
                Prizes
              </h1>
            </div>
          </div>
        </div>
        <div className="flex flex-col max-w-screen-xl items-start w-full pt-8">
          <div className="w-full">
            <h2 className="text-white text-3xl font-mono bg-slate-900 rounded-t border border-slate-700 p-4">
              Individual Prizes
            </h2>
            <div className="rounded-b bg-slate-900 p-6 border border-slate-700 grid gap-4 md:grid-cols-2">
              {prizes.map((prize) => {
                const isMajor = prize.tier === "major"
                return (
                  <div
                    key={prize.id}
                    className={`rounded-xl border p-4 shadow-lg ${
                      isMajor
                        ? "border-amber-500/60 bg-gradient-to-br from-yellow-500/5 via-slate-900 to-black"
                        : "border-slate-700 bg-slate-950"
                    }`}
                  >
                    <p
                      className={`text-xs uppercase tracking-[0.3em] ${
                        isMajor ? "text-amber-300" : "text-slate-400"
                      }`}
                    >
                      {isMajor ? "Major Prize" : "Minor Prize"}
                    </p>
                    <div className="flex items-center justify-between gap-4 mt-2">
                      <div>
                        <h3 className={`text-2xl font-bold ${isMajor ? "text-white" : "text-slate-100"}`}>
                          {prize.name}
                        </h3>
                        <p className="text-slate-300 text-sm">{prize.description}</p>
                      </div>
                      <span className={`text-2xl font-extrabold ${isMajor ? "text-amber-200" : "text-slate-400"}`}>
                        {formatQuantity(prize)}
                      </span>
                    </div>
                  </div>
                )
              })}
              {prizes.length === 0 && (
                <p className="text-slate-400 text-sm">No prizes have been configured yet. Check back soon!</p>
              )}
            </div>
          </div>
          <div className="w-full gap-12 flex flex-col lg:flex-row ">
            <div className="flex-1 pt-8">
              <h2 className="text-white text-3xl font-mono bg-slate-900 rounded-t border border-slate-700 p-4">
                School Prizes
              </h2>
              <ul className="rounded-b bg-slate-800 p-4 pl-8 list-disc text-lg border border-slate-700">
                <li>Website banner</li>
                <li>$300 to the winning school&apos;s computer science department</li>
                <br />
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
