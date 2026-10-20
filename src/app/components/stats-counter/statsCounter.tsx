import { LiveStats } from "@/app/services/statsService"

type Props = {
  className?: string
  liveStats: LiveStats | null
  status: "loading" | "ready" | "unavailable"
}

export default function StatsCounter(props: Props) {
  const displayedStats = props.liveStats

  return (
    <div
      className={`flex flex-col items-center ${props.className} bg-gradient-to-br from-black via-80% via-indigo-950 to-indigo-950 p-4 md:p-8 md:py-32 py-20`}
    >
      <div className="flex flex-col max-w-screen-xl items-start w-full">
        <div className="w-full gap-12 flex flex-col max-w-3xl">
          <div className="flex-1">
            <h1 className="font-mono leading-tight text-5xl md:text-6xl pb-4 font-bold text-indigo-300">
              Join a Growing Community
            </h1>
            <p className="text-xl">
              Compete with students from across the county to learn, win prizes, and bring your school to the top of the leaderboard!
            </p>
          </div>
          <p role="status" className="text-sm text-slate-300">
            {props.status === "loading" ? "Loading community statistics…" : props.status === "unavailable" ? "Live statistics are temporarily unavailable." : ""}
          </p>
          <div className="rounded flex flex-col md:flex-row gap-2 justify-center items-center">
            {[
              { value: displayedStats?.totalUsers, label: "Registered Users" },
              { value: displayedStats?.totalViews, label: "Article Views" },
              { value: displayedStats ? Math.round(displayedStats.totalHours) : undefined, label: "Hours Served" },
            ].map(({ value, label }) => (
              <div key={label} className="p-4 bg-gray-800/50 rounded flex flex-col items-center w-full gap-2">
                {props.status === "loading" ? (
                  <div className="h-14 w-24 rounded bg-indigo-900/50 animate-pulse" />
                ) : (
                  <h1 className="font-mono tabular-nums text-5xl sm:text-6xl font-bold text-indigo-300">
                    {value ?? "—"}
                  </h1>
                )}
                <p className="font-mono text-left text-lg">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
