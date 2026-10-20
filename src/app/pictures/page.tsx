"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"

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
      { src: "/hoco-hoc-winners/2025-DMS.jpg", alt: "Dunloggin Middle School" },
      { src: "/hoco-hoc-winners/2025-dms2.jpg", alt: "Dunloggin Middle School — photo 2" },
      { src: "/hoco-hoc-winners/2025-gcs.jpg", alt: "Gorman Crossing Elementary School" },
      { src: "/hoco-hoc-winners/2025winner.jpg", alt: "HoCoHOC 2025 winners" },
      { src: "/hoco-hoc-winners/2025-12-22 Hour of AI swansfield.jpg", alt: "Swansfield Elementary School" }
    ],
    winners: [
      { rank: 1, school: "Dunloggin Middle School", points: 54825 },
      { rank: 2, school: "Swansfield Elementary School", points: 43812 },
      { rank: 3, school: "Gorman Crossing Elementary School", points: 41222 },
    ],
  },
]

export default function PicturesPage() {
  const [selectedPhoto, setSelectedPhoto] = useState<{ year: number; index: number } | null>(null)
  const imageDialog = useRef<HTMLDialogElement>(null)
  const opener = useRef<HTMLButtonElement | null>(null)
  const picturesByYear = [...PICTURE_DATA].sort((a, b) => b.year - a.year)
  const selectedGroup = picturesByYear.find((group) => group.year === selectedPhoto?.year)
  const image = selectedGroup && selectedPhoto ? selectedGroup.images[selectedPhoto.index] : null
  const viewerOpen = selectedPhoto !== null

  useEffect(() => {
    if (!viewerOpen) return
    imageDialog.current?.showModal()
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = previous }
  }, [viewerOpen])

  function closePhoto() {
    imageDialog.current?.close()
    setSelectedPhoto(null)
    opener.current?.focus()
  }

  function movePhoto(direction: number) {
    if (!selectedGroup) return
    setSelectedPhoto((current) => current && ({
      ...current,
      index: (current.index + direction + selectedGroup.images.length) % selectedGroup.images.length,
    }))
  }

  return (
    <div className="mx-auto max-w-screen-xl px-6 py-12 sm:px-8 md:py-16">
      <header className="border-b border-slate-700 pb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Event photos</h1>
        <p className="mt-3 text-base leading-relaxed text-slate-300">Photos and school results from past years of Howard County Hour of Code.</p>
      </header>

      {picturesByYear.map((group) => (
        <section key={group.year} aria-labelledby={`photos-${group.year}`} className="pt-10">
          <div className="mb-6 flex items-baseline justify-between gap-4">
            <h2 id={`photos-${group.year}`} className="text-2xl font-semibold text-white">{group.year}</h2>
            <p className="text-sm text-slate-400">{group.images.length} photos</p>
          </div>

          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {group.images.map((photo, index) => (
              <figure key={photo.src}>
                <button
                  type="button"
                  aria-label={`Enlarge photo: ${photo.alt}`}
                  aria-haspopup="dialog"
                  className="relative block aspect-[4/3] w-full overflow-hidden rounded-sm bg-slate-950 focus-visible:outline-offset-4"
                  onClick={(event) => {
                    opener.current = event.currentTarget
                    setSelectedPhoto({ year: group.year, index })
                  }}
                >
                  <Image
                    src={photo.src.replace("/hoco-hoc-winners/", "/optimized/thumbnails/")}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                    className="object-cover"
                  />
                </button>
                <figcaption className="mt-3 text-sm leading-relaxed text-slate-300">{photo.alt}</figcaption>
              </figure>
            ))}
          </div>

          {group.winners && group.winners.length > 0 && (
            <div className="mt-10 border-t border-slate-700 pt-6">
              <h3 className="mb-4 text-lg font-semibold text-white">School results</h3>
              <ol className="grid gap-x-8 sm:grid-cols-3">
                {group.winners.map((winner) => (
                  <li key={winner.rank} className="flex gap-4 py-3">
                    <span className="text-sm tabular-nums text-slate-400">{winner.rank}.</span>
                    <div>
                      <p className="text-sm font-medium leading-relaxed text-slate-100">{winner.school}</p>
                      <p className="mt-1 text-sm tabular-nums text-slate-400">{winner.points.toLocaleString("en-US")} points</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </section>
      ))}

      {image && selectedGroup && selectedPhoto && (
        <dialog
          ref={imageDialog}
          aria-label={`${selectedGroup.year} event photo viewer`}
          onCancel={(event) => { event.preventDefault(); closePhoto() }}
          onClick={(event) => { if (event.target === event.currentTarget) closePhoto() }}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") { event.preventDefault(); movePhoto(-1) }
            if (event.key === "ArrowRight") { event.preventDefault(); movePhoto(1) }
          }}
          className="fixed inset-0 m-auto h-[90dvh] max-h-[90dvh] w-[calc(100%_-_2rem)] max-w-6xl border border-slate-700 bg-slate-950 p-4 text-slate-100 backdrop:bg-black/80 sm:p-6"
        >
          <div className="flex h-full flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-slate-400">{selectedGroup.year} · Photo {selectedPhoto.index + 1} of {selectedGroup.images.length}</p>
              <button autoFocus type="button" onClick={closePhoto} className="min-h-10 px-3 text-sm text-slate-200 underline underline-offset-4 hover:text-white">Close</button>
            </div>
            <div className="relative min-h-0 flex-1">
              <Image
                src={image.src.replace("/hoco-hoc-winners/", "/optimized/gallery/")}
                alt={image.alt}
                fill
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-contain"
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-4">
              <p aria-live="polite" className="text-sm text-slate-300">{image.alt}</p>
              <div className="flex gap-2">
                <button type="button" onClick={() => movePhoto(-1)} className="min-h-10 rounded border border-slate-700 px-4 text-sm hover:bg-slate-800">Previous</button>
                <button type="button" onClick={() => movePhoto(1)} className="min-h-10 rounded border border-slate-700 px-4 text-sm hover:bg-slate-800">Next</button>
              </div>
            </div>
          </div>
        </dialog>
      )}
    </div>
  )
}
