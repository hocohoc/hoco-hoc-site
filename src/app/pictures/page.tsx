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
    year: 2026,
    images: [],
    winners: [],
  },
  {
    year: 2025,
    images: [
      { src: "/hoco-hoc-winners/2025-DMS.jpg", alt: "2025 HOCO HOC Winners - DMS" },
      { src: "/hoco-hoc-winners/2025-dms2.jpg", alt: "2025 HOCO HOC Winners - DMS 2" },
      { src: "/hoco-hoc-winners/2025-gcs.jpg", alt: "2025 HOCO HOC Winners - GCS" },
      { src: "/hoco-hoc-winners/2025winner.jpg", alt: "2025 HOCO HOC Winners" },
    ],
    winners: [
      { rank: 1, school: "Dunloggin Middle School", points: 54825 },
      { rank: 2, school: "Swansfield Elementary School", points: 43812 },
      { rank: 3, school: "Gorman Crossing Elementary School", points: 41222 },
    ],
  },
  {
    year: 2024,
    images: [],
    winners: [
      { rank: 1, school: "Bonnie Branch Middle School", points: 17000 },
      { rank: 2, school: "Thomas Viaduct Middle School", points: 15940 },
      { rank: 3, school: "Glenelg High School", points: 7185 },
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
    <main className="bg-slate-950 min-h-screen text-white flex flex-col items-center p-4">
      <div className="w-full max-w-4xl space-y-6 pt-4">
        {/* Header Section */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-lg">
          <p className="text-xs uppercase tracking-[0.4em] text-sky-400 font-mono">Memory Bank</p>
          <h1 className="mt-4 text-4xl md:text-5xl font-mono font-bold text-sky-200">
            Past Events
          </h1>
          <p className="mt-6 text-lg text-slate-200 leading-relaxed">
            Explore photos from previous years of HoCoHOC events. Select a year to view the gallery and relive those memorable moments! 2026 is coming soon — get excited!
          </p>
        </section>

        {/* Year Selection Grid */}
        <section className="rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-sky-400 font-mono">
              Select Year
            </p>
            <h2 className="text-2xl md:text-3xl font-mono font-bold text-sky-200 mt-2">
              Choose an Event
            </h2>
          </div>

          {/* Year Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {picturesByYear.map((yearGroup) => (
              <button
                key={yearGroup.year}
                onClick={() => setSelectedYear(yearGroup.year)}
                className="relative p-8 rounded-lg border-2 border-slate-700 hover:border-sky-400 transition-all duration-300 bg-slate-800 hover:bg-slate-700 group cursor-pointer"
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <span className="text-4xl md:text-5xl font-mono font-bold text-sky-200 group-hover:text-sky-300 transition-colors">
                    {yearGroup.year}
                  </span>
                  {yearGroup.images.length > 0 && (
                    <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
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
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setSelectedYear(null)}
        >
          <div
            className="relative w-full h-full max-w-5xl max-h-[90vh] flex flex-col rounded-lg border border-slate-700 bg-slate-900 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-700 bg-slate-800">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-sky-400 font-mono">
                  Year Gallery
                </p>
                <h3 className="text-3xl font-mono font-bold text-sky-200 mt-1">
                  {currentYearData.year} HoCoHOC
                </h3>
              </div>
              <button
                onClick={() => setSelectedYear(null)}
                className="bg-sky-500 hover:bg-sky-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg transition-colors flex-shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Modal Content - Image Grid */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Winners Section */}
              {currentYearData.winners && currentYearData.winners.length > 0 && (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.4em] text-sky-400 font-mono">
                      School Leaders
                    </p>
                    <h4 className="text-2xl font-mono font-bold text-sky-200 mt-2">
                      Top Schools
                    </h4>
                  </div>
                  <div className="space-y-3">
                    {currentYearData.winners.map((winner) => {
                      const medals = ["1st", "2nd", "3rd"]
                      const medal = medals[winner.rank - 1] || `#${winner.rank}`
                      return (
                        <div
                          key={winner.rank}
                          className="flex items-center justify-between p-4 rounded-lg bg-slate-800 border border-slate-700 hover:border-sky-400 transition-all"
                        >
                          <div className="flex items-center gap-4">
                            <span className="text-2xl">{medal}</span>
                            <div>
                              <p className="font-semibold text-white">{winner.school}</p>
                              <p className="text-sm text-slate-400">{winner.points.toLocaleString()} points</p>
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
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.4em] text-sky-400 font-mono">
                      Photos
                    </p>
                    <h4 className="text-2xl font-mono font-bold text-sky-200 mt-2">
                      Event Gallery
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentYearData.images.map((image, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg overflow-hidden border border-slate-700 hover:border-sky-400 transition-all duration-300 cursor-pointer group"
                        onClick={() => setSelectedImage(image.src)}
                      >
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                          <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-semibold">
                            View Full
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentYearData.images.length === 0 && (!currentYearData.winners || currentYearData.winners.length === 0) && (
                <div className="text-center space-y-4 py-8">
                  <p className="text-slate-300 text-lg">
                    {currentYearData.year === 2026
                      ? "HocoHOC 2026 is in the planning phase. Photos and results will appear here after the event!"
                      : `No content available for ${currentYearData.year}`}
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
          className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative w-full h-full max-w-5xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-sky-500 hover:bg-sky-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg transition-colors z-10"
            >
              ✕
            </button>
            <div className="relative w-full h-full">
              <Image
                src={selectedImage}
                alt="Full size view"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
