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

      <section className="bg-slate-900">
        <div className="max-w-screen-xl mx-auto px-6 py-12 md:py-20 flex flex-col gap-6 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-sky-300/80 font-mono">2025 Champions</p>
          <h2 className="text-4xl md:text-6xl font-mono font-extrabold leading-tight text-sky-200">
            Congratulations to <br className="hidden md:block" />
            <span className="block md:inline">Dunloggin Middle School</span>
          </h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Outstanding performance in this year's Howard County Hour of Code / AI competition
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-2">
            <a href="/winners" className="btn-primary px-8 py-3 text-base font-semibold">
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
