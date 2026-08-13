"use client"

import Link from "next/link"
import Image from "next/image"
import { useMemo, useState } from "react"

interface PictureGroup {
  year: number
  images: {
    src: string
    alt: string
  }[]
  winners?: {
    rank: number
    school: string
    points: number
  }[]
}

// Images are organized by year
const PICTURE_DATA: PictureGroup[] = [
  {
    year: 2025,
    images: [
      { src: "/hoco-hoc-winners/2025-DMS.jpg", alt: "2025 HOCO HOC Winners - DMS" },
      { src: "/hoco-hoc-winners/2025-dms2.jpg", alt: "2025 HOCO HOC Winners - DMS 2" },
      { src: "/hoco-hoc-winners/2025-gcs.jpg", alt: "2025 HOCO HOC Winners - GCS" },
      { src: "/hoco-hoc-winners/2025winner.jpg", alt: "2025 HOCO HOC Winners" },
      { src: "/hoco-hoc-winners/2025-12-22 Hour of AI swansfield.jpg", alt: "2025 HOCO HOC Winners - SES" }
    ],
    winners: [
      { rank: 1, school: "Dunloggin Middle School", points: 54825 },
      { rank: 2, school: "Swansfield Elementary School", points: 43812 },
      { rank: 3, school: "Gorman Crossing Elementary School", points: 41222 },
    ],
  },
]

export default function PicturesPage() {
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const picturesByYear = useMemo(() => {
    return PICTURE_DATA.sort((a, b) => b.year - a.year)
  }, [])

  const currentYearData = picturesByYear.find((group) => group.year === selectedYear)

  return (
    <main className="bg-slate-950 min-h-screen text-white flex flex-col items-center p-4 selection:bg-sky-500/30">
      <div className="w-full max-w-4xl space-y-8 pt-4 pb-12">
        {/* Header Section */}
        <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-8 shadow-2xl backdrop-blur-sm">
          <div className="absolute top-0 right-0 -mt-16 -mr-16 h-64 w-64 rounded-full bg-sky-500/5 blur-[80px]"></div>
          
          <div className="relative z-10">
            <p className="text-xs uppercase tracking-[0.4em] text-sky-400 font-mono font-semibold">Memory Bank</p>
            <h1 className="mt-4 text-4xl md:text-5xl font-mono font-extrabold bg-gradient-to-br from-white via-sky-100 to-sky-400 bg-clip-text text-transparent">
              Past Events
            </h1>
            <p className="mt-6 text-lg text-slate-300 leading-relaxed max-w-2xl">
              Explore photos from previous years of HoCoHOC events. Select a year to view the gallery and relive those memorable moments! 2026 is coming soon — get excited!
            </p>
          </div>
        </section>

        {/* Year Selection Grid */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 shadow-xl">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-sky-400 font-mono">
              Select Year
            </p>
            <h2 className="text-2xl md:text-3xl font-mono font-bold text-slate-100 mt-2">
              Choose an Event
            </h2>
          </div>

          {/* Year Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {picturesByYear.map((yearGroup) => (
              <button
                key={yearGroup.year}
                onClick={() => setSelectedYear(yearGroup.year)}
                className="relative p-8 rounded-xl border border-slate-700 hover:border-sky-400 transition-all duration-300 bg-slate-800 hover:bg-slate-800/80 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(56,189,248,0.15)] group cursor-pointer overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-sky-500/0 to-sky-500/0 group-hover:from-sky-500/5 group-hover:to-transparent transition-all duration-500"></div>
                <div className="relative flex flex-col items-center justify-center gap-2 z-10">
                  <span className="text-4xl md:text-5xl font-mono font-bold text-white group-hover:text-sky-300 transition-colors">
                    {yearGroup.year}
                  </span>
                  {yearGroup.images.length > 0 && (
                    <span className="text-xs font-medium text-slate-400 group-hover:text-sky-200 transition-colors">
                      {yearGroup.images.length} photo{yearGroup.images.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Year Modal */}
      {selectedYear && currentYearData && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 cursor-pointer transition-opacity"
          onClick={() => setSelectedYear(null)}
        >
          <div
            className="relative w-full h-full max-w-5xl max-h-[90vh] flex flex-col rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden cursor-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 md:p-8 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-sky-400 font-mono font-semibold">
                  Year Gallery
                </p>
                <h3 className="text-3xl font-mono font-bold text-white mt-1">
                  {currentYearData.year} HoCoHOC
                </h3>
              </div>
              <button
                onClick={() => setSelectedYear(null)}
                className="bg-slate-800 hover:bg-sky-500 text-slate-300 hover:text-white rounded-full w-10 h-10 flex items-center justify-center text-lg transition-all border border-slate-700 hover:border-sky-400 flex-shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Modal Content - Image Grid */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-10 custom-scrollbar">
              {/* Winners Section */}
              {currentYearData.winners && currentYearData.winners.length > 0 && (
                <div className="space-y-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.4em] text-sky-400 font-mono">
                      School Leaders
                    </p>
                    <h4 className="text-2xl font-mono font-bold text-white mt-2">
                      Top Schools
                    </h4>
                  </div>
                  <div className="grid gap-3">
                    {currentYearData.winners.map((winner) => {
                      const medals = ["1st", "2nd", "3rd"]
                      const medal = medals[winner.rank - 1] || `#${winner.rank}`
                      
                      // Dynamic styling based on rank
                      let rankStyle = "text-slate-400 bg-slate-800 border-slate-700"
                      if (winner.rank === 1) rankStyle = "text-yellow-400 bg-yellow-400/10 border-yellow-400/20 shadow-[0_0_15px_rgba(250,204,21,0.05)]"
                      if (winner.rank === 2) rankStyle = "text-slate-300 bg-slate-300/10 border-slate-300/20"
                      if (winner.rank === 3) rankStyle = "text-amber-600 bg-amber-900/20 border-amber-700/30"

                      return (
                        <div
                          key={winner.rank}
                          className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-sky-500/50 hover:bg-slate-800 transition-all group"
                        >
                          <div className="flex items-center gap-5">
                            <div className={`flex items-center justify-center w-14 h-14 rounded-lg border ${rankStyle}`}>
                              <span className="text-xl font-bold font-mono">{medal}</span>
                            </div>
                            <div>
                              <p className="font-semibold text-lg text-slate-100 group-hover:text-white transition-colors">{winner.school}</p>
                              <p className="text-sm font-mono text-sky-400/80">{winner.points.toLocaleString()} pts</p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Images Section */}
              {currentYearData.images.length > 0 && (
                <div className="space-y-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.4em] text-sky-400 font-mono">
                      Photos
                    </p>
                    <h4 className="text-2xl font-mono font-bold text-white mt-2">
                      Event Gallery
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                    {currentYearData.images.map((image, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-xl overflow-hidden border border-slate-700 hover:border-sky-400 hover:shadow-[0_0_20px_rgba(56,189,248,0.2)] transition-all duration-300 cursor-pointer group bg-slate-800"
                        onClick={() => setSelectedImage(image.src)}
                      >
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          className="object-cover group-hover:scale-110 group-hover:rotate-1 transition-all duration-500 ease-out"
                        />
                        <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/40 backdrop-blur-[0px] group-hover:backdrop-blur-[2px] transition-all duration-300 flex items-center justify-center">
                          <span className="translate-y-4 group-hover:translate-y-0 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 font-semibold bg-sky-500/80 px-4 py-2 rounded-full text-sm">
                            View Image
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentYearData.images.length === 0 && (!currentYearData.winners || currentYearData.winners.length === 0) && (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-4 bg-slate-800/30 rounded-xl border border-slate-800 border-dashed">
                  <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-2">
                    <span className="text-2xl text-slate-500">📸</span>
                  </div>
                  <p className="text-slate-300 text-lg max-w-md">
                    {currentYearData.year === 2026
                      ? "HocoHOC 2026 is in the planning phase. Photos and results will appear here after the event!"
                      : `We're still hunting for photos from ${currentYearData.year}.`}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Image Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-slate-950/95 backdrop-blur-xl z-[60] flex items-center justify-center p-4 sm:p-8 cursor-pointer transition-opacity"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative w-full h-full max-w-6xl max-h-[90vh] flex items-center justify-center cursor-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-0 right-0 md:-top-4 md:-right-4 bg-slate-800 hover:bg-sky-500 text-slate-300 hover:text-white rounded-full w-12 h-12 flex items-center justify-center text-xl transition-all border border-slate-700 hover:border-sky-400 z-10 shadow-xl"
            >
              ✕
            </button>
            <div className="relative w-full h-full">
              <Image
                src={selectedImage}
                alt="Full size view"
                fill
                className="object-contain drop-shadow-2xl"
                priority
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
            </div>
          </div>
        </div>
      )}
    </main>
  )
}