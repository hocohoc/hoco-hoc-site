"use client"

import { useEffect, useState } from "react"

const EVENT_START = new Date("2026-12-08T00:00:00-05:00")
const EVENT_END = new Date("2026-12-15T23:59:59-05:00")

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number }

function getTimeLeft(): { phase: "before" | "during" | "after"; timeLeft: TimeLeft } {
  const now = new Date()
  let target: Date
  let phase: "before" | "during" | "after"

  if (now < EVENT_START) {
    target = EVENT_START
    phase = "before"
  } else if (now <= EVENT_END) {
    target = EVENT_END
    phase = "during"
  } else {
    return { phase: "after", timeLeft: { days: 0, hours: 0, minutes: 0, seconds: 0 } }
  }

  const diff = target.getTime() - now.getTime()
  return {
    phase,
    timeLeft: {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    },
  }
}

function Digit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-mono text-3xl sm:text-5xl md:text-6xl font-extrabold tabular-nums bg-gradient-to-b from-sky-200 to-sky-400 text-transparent bg-clip-text">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[10px] sm:text-xs uppercase tracking-widest text-sky-300/70 mt-1">
        {label}
      </span>
    </div>
  )
}

export default function Countdown() {
  const [state, setState] = useState(getTimeLeft)

  useEffect(() => {
    const id = setInterval(() => setState(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  if (state.phase === "after") {
    return (
      <section className="bg-gradient-to-b from-sky-950 to-slate-900 py-8 text-center">
        <p className="font-mono text-xl text-sky-300 font-bold">
          The event has ended — thanks for participating!
        </p>
      </section>
    )
  }

  const { days, hours, minutes, seconds } = state.timeLeft
  const heading =
    state.phase === "before"
      ? "Event Starts In"
      : "Event Ends In"

  return (
    <section className="bg-gradient-to-b from-sky-950 to-slate-900 py-8 md:py-10">
      <div className="max-w-screen-xl mx-auto px-6 flex flex-col items-center gap-4">
        <p className="text-xs sm:text-sm uppercase tracking-[0.35em] font-mono text-sky-400/80">
          {heading}
        </p>
        <div className="flex items-center gap-3 sm:gap-6">
          <Digit value={days} label="Days" />
          <span className="text-sky-500/50 text-2xl sm:text-4xl font-light select-none">:</span>
          <Digit value={hours} label="Hours" />
          <span className="text-sky-500/50 text-2xl sm:text-4xl font-light select-none">:</span>
          <Digit value={minutes} label="Min" />
          <span className="text-sky-500/50 text-2xl sm:text-4xl font-light select-none">:</span>
          <Digit value={seconds} label="Sec" />
        </div>
      </div>
    </section>
  )
}
