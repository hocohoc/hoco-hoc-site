"use client"

export default function Prizes() {
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
            <div className="rounded-2xl border-2 border-dashed border-sky-700/50 bg-slate-900/50 p-12 text-center">
              <div className="mx-auto max-w-lg space-y-4">
                <div className="text-6xl">🎁</div>
                <h2 className="text-3xl md:text-4xl font-mono font-bold text-sky-200">
                  2026 Prizes Coming Soon
                </h2>
                <p className="text-slate-300 text-lg leading-relaxed">
                  We&apos;re working on an exciting new prize lineup for HocoHOC 2026.
                  Individual and school prizes haven&apos;t been decided yet; but trust us, it&apos;ll be worth the wait!
                </p>
                <p className="text-slate-400 text-sm font-mono">
                  Check back later for the full prize list.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
