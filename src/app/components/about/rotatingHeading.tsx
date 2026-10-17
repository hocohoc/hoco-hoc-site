"use client";

import { useEffect, useState } from "react";

const topics = ["CS", "Algorithms", "Web Dev", "ML", "Python", "Java", "C++"];

export default function RotatingHeading() {
    const [reducedMotion, setReducedMotion] = useState(true);
    const [paused, setPaused] = useState(false);
    const [frame, setFrame] = useState({ index: 0, length: 2, deleting: false });

    useEffect(() => {
        const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
        const update = () => setReducedMotion(preference.matches);
        update();
        preference.addEventListener("change", update);
        return () => preference.removeEventListener("change", update);
    }, []);

    useEffect(() => {
        if (reducedMotion || paused) return;
        const word = topics[frame.index];
        const delay = !frame.deleting && frame.length === word.length ? 2000 : frame.deleting ? 60 : 100;
        const timer = window.setTimeout(() => {
            if (!frame.deleting && frame.length === word.length) {
                setFrame({ ...frame, deleting: true });
            } else if (frame.deleting && frame.length === 0) {
                setFrame({ index: (frame.index + 1) % topics.length, length: 0, deleting: false });
            } else {
                setFrame({ ...frame, length: frame.length + (frame.deleting ? -1 : 1) });
            }
        }, delay);
        return () => window.clearTimeout(timer);
    }, [frame, paused, reducedMotion]);

    return (
        <div className="pb-8">
            <h2 className="text-slate-200 font-bold text-4xl md:text-6xl leading-tight">
                <span className="sr-only">Learn computer science the fun way!</span>
                <span aria-hidden="true">
                    Learn <span className="block md:inline-block min-h-[1.25em] font-mono text-sky-300">
                        {reducedMotion ? "CS" : topics[frame.index].slice(0, frame.length)}
                        {!reducedMotion && <span>_</span>}
                    </span>{" "}<span className="underline">the fun way!</span>
                </span>
            </h2>
            {!reducedMotion && (
                <button type="button" className="btn-secondary mt-3" aria-pressed={paused} onClick={() => setPaused(!paused)}>
                    {paused ? "Resume text animation" : "Pause text animation"}
                </button>
            )}
        </div>
    );
}
