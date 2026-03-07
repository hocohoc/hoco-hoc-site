import { LiveStats } from "@/app/services/statsService"
import { useEffect, useRef, useState } from "react"

type Props = {
  className?: string
  liveStats: LiveStats
}

export default function StatsCounter(props: Props) {
  const [displayedStats, setDisplayedStats] = useState<LiveStats>({
    totalUsers: 0,
    totalViews: 0,
    totalHours: 0,
  })
  const displayedStatsRef = useRef(displayedStats)

  useEffect(() => {
    displayedStatsRef.current = displayedStats
  }, [displayedStats])

  useEffect(() => {
    const DURATION = 2000 // total animation time in ms (2s)
    const startTime = performance.now()
    const startStats = displayedStatsRef.current
    const targetStats = props.liveStats
    let frameId = 0

    const animate = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / DURATION, 1) // 0 → 1
      const lerp = (start: number, end: number) => start + (end - start) * progress

      setDisplayedStats({
        totalUsers: Math.round(lerp(startStats.totalUsers, targetStats.totalUsers)),
        totalViews: Math.round(lerp(startStats.totalViews, targetStats.totalViews)),
        totalHours: lerp(startStats.totalHours, targetStats.totalHours),
      })

      if (progress < 1) {
        frameId = requestAnimationFrame(animate)
      }
    }

    frameId = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(frameId)
  }, [props.liveStats.totalUsers, props.liveStats.totalViews, props.liveStats.totalHours])

  return (
    <main
      className={`flex flex-col items-center ${props.className} bg-gradient-to-br from-black via-80% via-indigo-950 to-indigo-950 p-4 md:p-8 md:py-32 py-20`}
    >
      <div className="flex flex-col max-w-screen-xl items-start w-full">
        <div className="w-full gap-12 flex flex-col max-w-3xl">
          <div className="flex-1">
            <h1 className="font-mono leading-tight text-5xl md:text-6xl pb-4 bg-gradient-to-r from-indigo-300 to-indigo-400 text-transparent bg-clip-text font-bold">
              Join a Growing Community
            </h1>
            <p className="text-xl">
              Compete with students from across the county to learn, win prizes, and bring your school to the top of the leaderboard!
            </p>
          </div>
          <div className="rounded flex flex-col md:flex-row gap-2 justify-center items-center">
            {[
              { value: displayedStats.totalUsers, label: "Registered Users" },
              { value: displayedStats.totalViews, label: "Article Views" },
              { value: Math.round(displayedStats.totalHours), label: "Hours Served" },
            ].map(({ value, label }) => (
              <div key={label} className="p-4 bg-gray-800/50 rounded flex flex-col items-center w-full gap-2">
                {props.liveStats.totalUsers === 0 && props.liveStats.totalViews === 0 ? (
                  <div className="h-14 w-24 rounded bg-indigo-900/50 animate-pulse" />
                ) : (
                  <h1 className="bg-gradient-to-b from-indigo-300 to-indigo-400 text-transparent bg-clip-text font-mono text-5xl sm:text-6xl font-bold">
                    {value}
                  </h1>
                )}
                <p className="font-mono text-left text-lg">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
