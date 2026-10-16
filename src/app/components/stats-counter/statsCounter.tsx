import { LiveStats } from "@/app/services/statsService"
import { useEffect, useState } from "react"

type Props = {
  className?: string
  liveStats: LiveStats
}

export default function StatsCounter(props: Props) {
  const [paused, setPaused] = useState(false)
  const [displayedStats, setDisplayedStats] = useState<LiveStats>(props.liveStats ?? { totalUsers: 0, totalViews: 0, totalHours: 0 })
  useEffect(() => {
    if (!paused && props.liveStats) setDisplayedStats(props.liveStats)
  }, [paused, props.liveStats])

  return (
    <div
      className={`flex flex-col items-center ${props.className} bg-gradient-to-br from-black via-80% via-indigo-950 to-indigo-950 p-4 md:p-8 md:py-32 py-20`}
    >
      <div className="flex flex-col max-w-screen-xl items-start w-full">
        <div className="w-full gap-12 flex flex-col max-w-3xl">
          <div className="flex-1">
            <h2 className="font-mono leading-tight text-5xl md:text-6xl pb-4 font-bold text-indigo-300">
              Join a Growing Community
            </h2>
            <p className="text-xl">
              Compete with students from across the county to learn, win prizes, and bring your school to the top of the leaderboard!
            </p>
          </div>
          <button type="button" className="btn-secondary self-start" aria-pressed={paused} onClick={() => setPaused(value => !value)}>
            {paused ? "Resume live statistics" : "Pause live statistics"}
          </button>
          <div className="rounded flex flex-col md:flex-row gap-2 justify-center items-center">
            {[
              { value: displayedStats.totalUsers, label: "Registered Users" },
              { value: displayedStats.totalViews, label: "Article Views" },
              { value: Math.round(displayedStats.totalHours), label: "Hours Served" },
            ].map(({ value, label }) => (
              <div key={label} className="p-4 bg-gray-800/50 rounded flex flex-col items-center w-full gap-2">
                <p className="text-indigo-300 font-mono text-5xl sm:text-6xl font-bold">{value}</p>
                <p className="font-mono text-left text-lg">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
