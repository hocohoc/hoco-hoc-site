"use client"

import { useEffect, useState } from "react";
import Hero from "./components/hero/hero";
import StatsCounter from "./components/stats-counter/statsCounter";
import { LiveStats, onStatsChange } from "./services/statsService";
import AboutSection from './components/about/about';
import Faq from './components/faq/faq';
import Prizes from './components/prizes/prizes';
import Team from './components/team/team';
import Sponsors from "./components/sponsors/sponsors";

export default function Home() {
  let [stats, setStats] = useState<LiveStats>({ totalHours: 0, totalUsers: 0, totalViews: 0 })

  useEffect(() => {
    console.log("Hello")
    let unsub = onStatsChange((live) => {
      setStats(live)
    })
    return unsub
  }, [])

  return (
    <main className="flex flex-col bg-black">

      <section className="bg-gradient-to-r from-sky-500 via-blue-700 to-indigo-800 text-white">
      <div className="max-w-screen-xl mx-auto px-6 py-6 md:py-10 flex flex-col gap-3 text-center">
        <p className="text-sm uppercase tracking-[0.4em] text-sky-100/80">2025 Champions</p>
        <h2 className="text-3xl md:text-5xl font-extrabold leading-tight">
          Congratulations to <span className="underline decoration-white/60">Dunloggin Middle School</span>
        </h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-3">
          <a href="/winners" className="btn-primary bg-white text-sky-900 hover:bg-slate-100">
            View All Winners
          </a>
        </div>
        </div>
    </section>
      <Hero />
      <div className="bg-slate-900" id="about" >
        <AboutSection></AboutSection>
      </div>
      <StatsCounter liveStats={stats} className="w-full" />
      <div className="bg-slate-900">
        <Prizes></Prizes>
      </div>
      <div className="bg-black" id="team">
        <Team></Team>
      </div>
      <div className="bg-gray-900" id="faq" >
        <Faq></Faq>
      </div>
      <div>
        <Sponsors />
      </div>
    </main>
  );
}
