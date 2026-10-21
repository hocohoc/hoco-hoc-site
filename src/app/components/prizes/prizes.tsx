import { DEFAULT_PRIZES } from "@/app/services/raffleService"

export default function Prizes() {
  // The announced event lineup is independent of previously saved raffle draws.
  const prizes = DEFAULT_PRIZES

  return (
    <section aria-labelledby="prizes-heading" className="bg-slate-950 px-6 py-16 sm:px-8 md:py-24">
      <div className="mx-auto max-w-screen-xl">
        <header className="border-b border-slate-700 pb-8">
          <h2 id="prizes-heading" className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Prizes</h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-300">Individual prizes and awards for the top three schools.</p>
        </header>
        <div className="grid gap-12 pt-8 lg:grid-cols-[2fr_1fr] lg:gap-16">
          <div>
            <h3 className="mb-2 text-lg font-semibold text-white">Individual prizes</h3>
            <ul className="divide-y divide-slate-800">
              {prizes.map((prize) => (
                <li key={prize.id} className="flex items-start justify-between gap-6 py-6">
                  <div>
                    <h4 className="text-lg font-medium text-slate-100">{prize.name}</h4>
                    {prize.description && prize.description.trim() !== prize.name.trim() && (
                      <p className="mt-1 text-sm leading-relaxed text-slate-400">{prize.description}</p>
                    )}
                  </div>
                  <span className="shrink-0 pt-1 text-sm tabular-nums text-slate-400">{prize.quantity} available</span>
                </li>
              ))}
            </ul>
            {prizes.length === 0 && <p className="py-6 text-slate-400">Prizes will be announced here.</p>}
          </div>
          <div className="border-t border-slate-700 pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            <h3 className="text-lg font-semibold text-white">School awards</h3>
            <dl className="mt-4 divide-y divide-slate-800">
              {[
                { place: "First place", amount: "$300" },
                { place: "Second place", amount: "$50" },
                { place: "Third place", amount: "$50" },
              ].map(({ place, amount }) => (
                <div key={place} className="flex items-baseline justify-between gap-6 py-4">
                  <dt className="text-sm text-slate-300">{place}</dt>
                  <dd className="text-xl font-semibold tabular-nums text-sky-300">{amount}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">First prize supports the winning school&apos;s computer science department.</p>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">The winning school is also recognized with a banner on our website.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
