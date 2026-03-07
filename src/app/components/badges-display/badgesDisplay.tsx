"use client"

import { useEffect, useState, useCallback } from "react"
import { ALL_BADGES, UserBadges, Badge, updateBadgesAndStreak, getUserBadges } from "@/app/services/badgeService"
import { getUserDailyChallengeCompletions } from "@/app/services/dailyChallengeService"
import { Profile } from "@/app/services/userService"
import AchievementBadge from "@/app/components/achievement-badge/achievementBadge"

type Props = {
  profile: Profile
}

export default function BadgesDisplay({ profile }: Props) {
  const [badges, setBadges] = useState<UserBadges | null>(null)
  const [newBadge, setNewBadge] = useState<Badge | null>(null)

  const checkBadges = useCallback(async () => {
    const completions = await getUserDailyChallengeCompletions(profile.uid)
    const result = await updateBadgesAndStreak(profile.uid, profile, completions.length)
    setBadges(result.badges)
    if (result.newBadges.length > 0) {
      setNewBadge(result.newBadges[0])
    }
  }, [profile])

  useEffect(() => {
    checkBadges()
  }, [checkBadges])

  if (!badges) {
    return (
      <div className="bg-slate-800 rounded p-4">
        <div className="h-6 w-32 bg-slate-700 animate-pulse rounded mb-3" />
        <div className="flex gap-2">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="w-12 h-12 bg-slate-700 animate-pulse rounded-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      <AchievementBadge
        show={!!newBadge}
        title={newBadge?.name || ""}
        description={newBadge?.description || ""}
        onClose={() => setNewBadge(null)}
      />

      <div className="bg-slate-800 rounded p-4">
        <div className="flex items-center gap-3 mb-3">
          <h2 className="text-lg font-bold flex-1">Achievements</h2>
          <div className="flex items-center gap-1 text-sm font-mono">
            <span className="text-amber-400">🔥</span>
            <span className="text-slate-300">
              {badges.currentStreak} day streak
            </span>
            {badges.longestStreak > badges.currentStreak && (
              <span className="text-slate-500 text-xs">(best: {badges.longestStreak})</span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {ALL_BADGES.map((badge) => {
            const earned = badges.earned.includes(badge.id)
            return (
              <div
                key={badge.id}
                className={`group relative flex flex-col items-center justify-center w-14 h-14 rounded-full border-2 transition-all ${
                  earned
                    ? "bg-slate-700/50 border-amber-500/60 cursor-default"
                    : "bg-slate-800 border-slate-700 opacity-40"
                }`}
                title={`${badge.name}: ${badge.description}`}
              >
                <span className="text-xl">{badge.icon}</span>
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block z-10 pointer-events-none">
                  <div className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs whitespace-nowrap shadow-lg">
                    <p className="font-bold text-slate-100">{badge.name}</p>
                    <p className="text-slate-400">{badge.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <p className="text-xs text-slate-500 font-mono mt-3">
          {badges.earned.length}/{ALL_BADGES.length} unlocked
        </p>
      </div>
    </>
  )
}
