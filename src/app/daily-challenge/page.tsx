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

export default function DailyChallengePage() {
  const profile = useProfile()
  const [challenge, setChallenge] = useState<DailyChallenge | null>(null)
  const [loading, setLoading] = useState(true)
  const [answer, setAnswer] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{ correct: boolean; points: number } | null>(null)
  const [alreadyCompleted, setAlreadyCompleted] = useState(false)
  const [completions, setCompletions] = useState<UserChallengeCompletion[]>([])

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
      }
    } catch (err) {
      setResult({ correct: false, points: 0 })
    }
    setSubmitting(false)
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12 sm:px-8 md:py-16">
        <div className="w-full flex flex-col gap-8">
          <div className="h-8 w-48 bg-slate-800 animate-pulse rounded" />
          <div className="h-40 bg-slate-800 animate-pulse rounded" />
        </div>
      </div>
    )
  }

  if (!challenge) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12 sm:px-8 md:py-16">
        <div className="w-full">
          <header className="border-b border-slate-700 pb-8">
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Daily challenge</h1>
            <p className="mt-3 text-slate-300">A new computer science problem each day of the event.</p>
          </header>
          <div className="py-10">
            <p className="mb-3 text-sm text-slate-400">December 8–15, 2026</p>
            <h2 className="text-xl font-medium text-slate-100">Challenges begin during event week</h2>
            <p className="mt-3 max-w-xl leading-relaxed text-slate-300">Return here during the event to read the day&apos;s problem and submit your answer.</p>
            <a href="/articles" className="mt-6 inline-block text-sm text-sky-300 underline underline-offset-4 hover:text-sky-200">Browse articles while you wait</a>
          </div>
          {completions.length > 0 && (
            <p className="border-t border-slate-700 pt-6 text-sm text-slate-400">
              You&apos;ve completed {completions.length} daily challenge{completions.length !== 1 ? "s" : ""} so far.
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 sm:px-8 md:py-16">
      <div className="w-full flex flex-col gap-8">
        <div className="border-b border-slate-700 pb-8">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-5 text-sm text-slate-400">
            <span className="text-sky-300">
              Daily challenge / Day {challenge.day}
            </span>
            <span className="capitalize">
              {challenge.difficulty}
            </span>
            <span className="text-sm tabular-nums text-slate-300 sm:ml-auto">
              {challenge.points} points
            </span>
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl mb-4">{challenge.title}</h1>
          <p className="leading-relaxed text-slate-300">{challenge.description}</p>
        </div>

        <div className="py-2">
          <ArticleRenderer markdown={challenge.content} profile={profile} />
        </div>

        {/* Answer section */}
        {challenge.answer != null && challenge.answer !== "" && (
          <div className="border-t border-slate-700 pt-8 flex flex-col gap-4">
            {alreadyCompleted ? (
              <div role="status" className="flex items-center gap-2 text-emerald-300">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {result?.correct ? `Answer accepted. You earned ${result.points} points.` : "You have completed this challenge."}
              </div>
            ) : !profile ? (
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <p className="flex-1 text-slate-300">Log in to submit your answer.</p>
                <button type="button" className="btn-primary font-medium" onClick={() => signInOrRegister()}>
                  Log in / Sign up
                </button>
              </div>
            ) : (
              <>
                <label htmlFor="daily-answer" className="text-sm font-medium text-slate-300">Your answer</label>
                <input
                  id="daily-answer"
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer..."
                  className="w-full"
                />
                <div role="status" aria-atomic="true">{result && !result.correct && (
                  <p className="text-red-300 text-sm">That answer isn’t correct. Try again.</p>
                )}</div>
                <button
                  type="button"
                  className="btn-primary font-medium self-start px-5 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={submitting || !answer.trim()}
                  onClick={handleSubmit}
                >
                  {submitting ? "Checking..." : "Submit answer"}
                </button>
              </>
            )}
          </div>
        )}

        {/* Completion history */}
        {profile && completions.length > 0 && (
          <div className="border-t border-slate-800 pt-6">
            <p className="text-sm font-medium text-slate-300">
              Challenges completed: <span className="text-slate-100 font-medium">{completions.length}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
