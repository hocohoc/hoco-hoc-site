"use client"
import Link from "next/link"
import { useProfile } from "../auth-provider/authProvider"
import { logout, signInOrRegister } from "@/app/services/userService"

export default function Hero() {
    const profile = useProfile()
    function handleAuth() {
        if (profile) {
            logout()
        } else {
            signInOrRegister()
        }
    }

    return <section className="min-h-[30rem] bg-sky-950 relative border-b-2 border-b-sky-900 overflow-hidden">
        <svg className="absolute right-[-10rem] top-1/2 h-[36rem] w-[36rem] -translate-y-1/2 opacity-40 md:right-[3%] md:opacity-80" viewBox="0 0 600 600" fill="none" aria-hidden="true">
            <circle cx="300" cy="300" r="270" stroke="#0c4a6e" strokeWidth="10" />
            <circle cx="300" cy="300" r="285" stroke="#38bdf8" strokeWidth="10" strokeDasharray="1490 301" transform="rotate(-90 300 300)" strokeLinecap="round" />
            <circle cx="300" cy="300" r="255" stroke="#bfdbfe" strokeWidth="10" strokeDasharray="1335 267" transform="rotate(-90 300 300)" strokeLinecap="round" />
            <path d="M180 170 L300 300" stroke="white" strokeWidth="10" strokeLinecap="round" />
            <path d="M300 300 L158 456" stroke="#00b7ff" strokeWidth="5" strokeLinecap="round" />
        </svg>

        <div className="flex flex-row items-center justify-center z-20 relative w-full min-h-[30rem] md:min-h-[75vh] p-6 sm:p-8 py-16 bg-opacity-80 bg-slate-900 md:bg-opacity-100 md:bg-transparent md:bg-gradient-to-bl md:via-90% md:via-slate-900 md:from-transparent md:to-slate-900">
            <div className="flex flex-row items-center w-full max-w-screen-xl">
                <div className="md:w-2/3 w-full">
                    <p className="mb-6 font-sans text-base font-medium text-slate-300 sm:text-lg">
                        <time dateTime="2026-12-08">December 8</time>
                        {"–"}
                        <time dateTime="2026-12-15">15, 2026</time>
                    </p>

                    <h1 className="mb-2">
                        <span className="block text-2xl md:text-6xl">Howard County</span>
                        <span className="block text-5xl md:text-6xl font-extrabold mt-2 text-sky-300">
                            Hour of Code / AI
                        </span>
                    </h1>
                    <p className="text-md mt-3 md:text-base">Compete, Learn, and Win Prizes!</p>

                    <p className="font-mono text-slate-400 text-sm">
                        A 7-day event where students across Howard County explore computer science through articles, games, and coding challenges.
                    </p>

                    <div className="font-mono flex flex-row flex-wrap mt-4 gap-2">
                        <button
                            className={`btn-primary ${profile && "bg-red-400 hover:bg-red-300"}`}
                            type="button"
                            onClick={handleAuth}
                        >
                            {profile ? "Logout" : "Login"}
                        </button>
                        <Link className="btn-secondary" href="/articles">
                            View Articles
                        </Link>
                        <Link className="btn-secondary" href="/game">
                            Play Games
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </section>
}
