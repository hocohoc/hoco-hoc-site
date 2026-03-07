"use client"

import { useEffect, useState } from "react"
import { useProfile } from "@/app/components/auth-provider/authProvider"
import {
  DailyChallenge,
  getTodayChallenge,
  submitDailyChallengeAnswer,
  getUserDailyChallengeCompletions,
  UserChallengeCompletion,
} from "@/app/services/dailyChallengeService"
import { signInOrRegister } from "@/app/services/userService"
import ArticleRenderer from "@/app/components/article-renderer/articleRenderer"
import Confetti from "react-confetti"
import AchievementBadge from "@/app/components/achievement-badge/achievementBadge"

export default function DailyChallengePage() {
  const profile = useProfile()
  const [challenge, setChallenge] = useState<DailyChallenge | null>(null)
  const [loading, setLoading] = useState(true)
  const [answer, setAnswer] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{ correct: boolean; points: number } | null>(null)
  const [alreadyCompleted, setAlreadyCompleted] = useState(false)
  const [completions, setCompletions] = useState<UserChallengeCompletion[]>([])
  const [confetti, setConfetti] = useState(false)
  const [showAchievement, setShowAchievement] = useState(false)

  useEffect(() => {
    getTodayChallenge()
      .then((c) => setChallenge(c))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (profile) {
      getUserDailyChallengeCompletions(profile.uid).then((comps) => {
        setCompletions(comps)
        if (challenge && comps.some((c) => c.challengeId === challenge.id)) {
          setAlreadyCompleted(true)
        }
      })
    }
  }, [profile, challenge])

  async function handleSubmit() {
    if (!profile || !challenge) return
    setSubmitting(true)
    try {
      const res = await submitDailyChallengeAnswer(profile.uid, challenge.id, answer)
      setResult(res)
      if (res.correct && res.points > 0) {
        setAlreadyCompleted(true)
        setConfetti(true)
        setShowAchievement(true)
        setTimeout(() => setConfetti(false), 7000)
      }
    } catch (err) {
      setResult({ correct: false, points: 0 })
    }
    setSubmitting(false)
  }

  const diffColors = {
    easy: "text-emerald-400",
    medium: "text-amber-400",
    hard: "text-red-400",
  }

  if (loading) {
    return (
      <main className="p-4 flex flex-col items-center">
        <div className="max-w-2xl w-full flex flex-col gap-4">
          <div className="h-8 w-48 bg-slate-800 animate-pulse rounded" />
          <div className="h-40 bg-slate-800 animate-pulse rounded" />
        </div>
      </main>
    )
  }

  if (!challenge) {
    return (
      <main className="p-4 flex flex-col items-center">
        <div className="max-w-2xl w-full text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
            <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">No Challenge Today</h1>
          <p className="text-slate-400">
            Daily challenges are available during the event week (December 8–15, 2026). Check back then!
          </p>
          {completions.length > 0 && (
            <p className="mt-4 text-sm text-slate-500 font-mono">
              You&apos;ve completed {completions.length} daily challenge{completions.length !== 1 ? "s" : ""} so far.
            </p>
          )}
        </div>
      </main>
    )
  }

  return (
    <main className="p-4 flex flex-col items-center">
      {confetti && (
        <Confetti
          className="fixed top-0 left-0"
          numberOfPieces={400}
          recycle={false}
          style={{ position: "fixed" }}
          width={typeof window !== "undefined" ? window.innerWidth : 800}
          height={typeof window !== "undefined" ? window.innerHeight : 600}
        />
      )}
      <AchievementBadge
        show={showAchievement}
        title="Daily Challenge Complete!"
        description={`You earned ${challenge.points} points!`}
        onClose={() => setShowAchievement(false)}
      />

      <div className="max-w-2xl w-full flex flex-col gap-4">
        <div className="bg-gradient-to-br from-sky-900/50 to-slate-900 border border-sky-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-mono uppercase tracking-widest text-sky-400">
              Day {challenge.day} Challenge
            </span>
            <span className={`text-xs font-mono uppercase tracking-widest ${diffColors[challenge.difficulty]}`}>
              · {challenge.difficulty}
            </span>
            <span className="text-xs font-mono text-slate-500 ml-auto">
              {challenge.points} pts
            </span>
          </div>

          <h1 className="text-3xl font-bold mb-2">{challenge.title}</h1>
          <p className="text-slate-300">{challenge.description}</p>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <ArticleRenderer markdown={challenge.content} profile={profile} />
        </div>

        {/* Answer section */}
        {challenge.answer != null && challenge.answer !== "" && (
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 flex flex-col gap-3">
            {alreadyCompleted ? (
              <div className="flex items-center gap-2 text-emerald-400 font-mono">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Challenge Completed!
              </div>
            ) : !profile ? (
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <p className="flex-1 font-bold">Log in to submit your answer!</p>
                <button type="button" className="btn-primary font-mono" onClick={() => signInOrRegister()}>
                  Log in / Sign up
                </button>
              </div>
            ) : (
              <>
                <label className="text-sm font-mono text-slate-400">Your Answer</label>
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer..."
                  className="w-full"
                />
                {result && !result.correct && (
                  <p className="text-red-400 text-sm font-mono">Incorrect — try again!</p>
                )}
                <button
                  type="button"
                  className="btn-primary font-mono w-full"
                  disabled={submitting || !answer.trim()}
                  onClick={handleSubmit}
                >
                  {submitting ? "Checking..." : "Submit Answer"}
                </button>
              </>
            )}
          </div>
        )}

        {/* Streak tracker */}
        {profile && completions.length > 0 && (
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <p className="text-sm font-mono text-slate-400">
              Challenge Streak: <span className="text-amber-400 font-bold">{completions.length}</span> day{completions.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
