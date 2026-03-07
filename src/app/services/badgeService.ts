import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore"
import { db } from "../firebase/config"
import { Profile } from "./userService"

export type Badge = {
  id: string
  name: string
  description: string
  icon: string // emoji
  condition: (profile: Profile, streakDays: number, completedChallenges: number) => boolean
}

export type UserBadges = {
  earned: string[] // badge ids
  currentStreak: number
  longestStreak: number
  lastActiveDate: string // ISO date string
}

// Badge definitions
export const ALL_BADGES: Badge[] = [
  {
    id: "first-article",
    name: "First Steps",
    description: "Complete your first article",
    icon: "📖",
    condition: (p) => p.articlesCompletedID.length >= 1,
  },
  {
    id: "five-articles",
    name: "Bookworm",
    description: "Complete 5 articles",
    icon: "📚",
    condition: (p) => p.articlesCompletedID.length >= 5,
  },
  {
    id: "ten-articles",
    name: "Scholar",
    description: "Complete 10 articles",
    icon: "🎓",
    condition: (p) => p.articlesCompletedID.length >= 10,
  },
  {
    id: "all-articles",
    name: "Completionist",
    description: "Complete 20+ articles",
    icon: "🏆",
    condition: (p) => p.articlesCompletedID.length >= 20,
  },
  {
    id: "first-points",
    name: "On the Board",
    description: "Earn your first points",
    icon: "⭐",
    condition: (p) => Object.values(p.scores).some((s) => s > 0),
  },
  {
    id: "fifty-points",
    name: "Point Collector",
    description: "Earn 50 total points",
    icon: "💎",
    condition: (p) => Object.values(p.scores).reduce((a, b) => a + b, 0) >= 50,
  },
  {
    id: "hundred-points",
    name: "Century Club",
    description: "Earn 100 total points",
    icon: "💯",
    condition: (p) => Object.values(p.scores).reduce((a, b) => a + b, 0) >= 100,
  },
  {
    id: "streak-3",
    name: "3-Day Streak",
    description: "Visit 3 days in a row",
    icon: "🔥",
    condition: (_, streak) => streak >= 3,
  },
  {
    id: "streak-5",
    name: "5-Day Streak",
    description: "Visit 5 days in a row",
    icon: "🔥",
    condition: (_, streak) => streak >= 5,
  },
  {
    id: "streak-7",
    name: "Week Warrior",
    description: "Visit all 7 days!",
    icon: "🏅",
    condition: (_, streak) => streak >= 7,
  },
  {
    id: "daily-challenge-1",
    name: "Challenger",
    description: "Complete your first daily challenge",
    icon: "⚡",
    condition: (_, __, challenges) => challenges >= 1,
  },
  {
    id: "daily-challenge-5",
    name: "Challenge Master",
    description: "Complete 5 daily challenges",
    icon: "🌟",
    condition: (_, __, challenges) => challenges >= 5,
  },
]

// Get or initialize user badge data
export async function getUserBadges(uid: string): Promise<UserBadges> {
  const ref = doc(db, `users/${uid}/meta`, "badges")
  const snap = await getDoc(ref)
  if (snap.exists()) {
    return snap.data() as UserBadges
  }
  const initial: UserBadges = {
    earned: [],
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: "",
  }
  return initial
}

// Update streak and check for new badges
export async function updateBadgesAndStreak(
  uid: string,
  profile: Profile,
  completedChallenges: number
): Promise<{ newBadges: Badge[]; badges: UserBadges }> {
  const ref = doc(db, `users/${uid}/meta`, "badges")
  const existing = await getUserBadges(uid)

  const today = new Date().toISOString().split("T")[0]
  let { currentStreak, longestStreak, lastActiveDate } = existing

  if (lastActiveDate !== today) {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split("T")[0]

    if (lastActiveDate === yesterdayStr) {
      currentStreak += 1
    } else if (lastActiveDate !== today) {
      currentStreak = 1
    }
    longestStreak = Math.max(longestStreak, currentStreak)
    lastActiveDate = today
  }

  // Check which badges are newly earned
  const newBadges: Badge[] = []
  const earned = [...existing.earned]

  for (const badge of ALL_BADGES) {
    if (!earned.includes(badge.id) && badge.condition(profile, currentStreak, completedChallenges)) {
      earned.push(badge.id)
      newBadges.push(badge)
    }
  }

  const updated: UserBadges = { earned, currentStreak, longestStreak, lastActiveDate }
  await setDoc(ref, updated)

  return { newBadges, badges: updated }
}
