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

    <span className='text-center bg-gradient-to-r from-sky-500 to-blue-700 p-2'>
      Congrats to <strong>Dunloggin Middle School</strong> for winning the 2025 Howard County Hour of Code!
    </span>
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
