"use client"
import { useProfile } from "../components/auth-provider/authProvider"
import ProfileDashboard from "../components/dashboard/dashboard"
import ShareButtons from "../components/share-buttons/shareButtons"
import { signInOrRegister } from "../services/userService"
import Link from "next/link"

export default function Dashboard() {
  const profile = useProfile()

  const totalPoints = profile
    ? Object.values(profile.scores).reduce((sum, v) => sum + (v || 0), 0)
    : 0

  return <div className="w-full h-full">
    {profile ?
      <main className="w-full h-full flex flex-col">
        <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
          <h1 className="text-3xl font-bold flex-1">Welcome, {profile.displayName}!</h1>
          <ShareButtons text={`I've earned ${Math.round(totalPoints)} points on HoCo Hour of Code / AI! Join me and compete!`} />
        </div>
        <hr className="border border-slate-600 mb-4" />
        <ProfileDashboard profile={profile} />
      </main> : (
        <main className="w-full h-full flex flex-col items-center justify-center py-16">
          <div className="max-w-md w-full text-center flex flex-col items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-sky-900/50 border border-sky-800 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-2">You&apos;re not logged in</h1>
              <p className="text-slate-400">Sign in with your school account to track your progress, earn points, and compete on the leaderboard.</p>
            </div>
            <button
              className="btn-primary px-8 py-3 text-base font-semibold font-mono w-full"
              type="button"
              onClick={() => signInOrRegister()}
            >
              Log in / Sign up
            </button>
            <Link href="/" className="text-sm text-sky-400 hover:text-sky-300">
              &larr; Back to home
            </Link>
          </div>
        </main>
      )}
  </div>
}
