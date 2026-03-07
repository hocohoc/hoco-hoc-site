import { collection, doc, getDoc, getDocs, setDoc, deleteDoc, Timestamp } from "firebase/firestore"
import { db } from "../firebase/config"

export type DailyChallenge = {
  id: string
  day: number // 1-7 for each day of the event
  date: string // e.g. "2026-12-08"
  title: string
  description: string
  type: "coding" | "quiz" | "activity"
  content: string // markdown content or code
  answer?: string // expected answer for coding/quiz
  points: number
  difficulty: "easy" | "medium" | "hard"
}

export type UserChallengeCompletion = {
  challengeId: string
  completedAt: Timestamp
  pointsEarned: number
}

// Admin: create or update a daily challenge
export async function saveDailyChallenge(challenge: DailyChallenge): Promise<void> {
  await setDoc(doc(db, "daily-challenges", challenge.id), challenge)
}

// Admin: delete a daily challenge
export async function deleteDailyChallenge(challengeId: string): Promise<void> {
  await deleteDoc(doc(db, "daily-challenges", challengeId))
}

// Get all daily challenges
export async function getDailyChallenges(): Promise<DailyChallenge[]> {
  const snap = await getDocs(collection(db, "daily-challenges"))
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() } as DailyChallenge))
    .sort((a, b) => a.day - b.day)
}

// Get today's challenge
export async function getTodayChallenge(): Promise<DailyChallenge | null> {
  const today = new Date().toISOString().split("T")[0]
  const all = await getDailyChallenges()
  return all.find((c) => c.date === today) ?? null
}

// Get a specific challenge
export async function getDailyChallenge(id: string): Promise<DailyChallenge | null> {
  const snap = await getDoc(doc(db, "daily-challenges", id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as DailyChallenge
}

// Submit a daily challenge completion
export async function submitDailyChallengeAnswer(
  uid: string,
  challengeId: string,
  answer: string
): Promise<{ correct: boolean; points: number }> {
  const challenge = await getDailyChallenge(challengeId)
  if (!challenge) throw new Error("Challenge not found")

  // Check if already completed
  const completionRef = doc(db, `users/${uid}/daily-completions`, challengeId)
  const existing = await getDoc(completionRef)
  if (existing.exists()) {
    return { correct: true, points: 0 }
  }

  // Check answer (case-insensitive, trimmed)
  const isCorrect =
    challenge.answer != null &&
    answer.trim().toLowerCase() === challenge.answer.trim().toLowerCase()

  if (isCorrect) {
    await setDoc(completionRef, {
      challengeId,
      completedAt: Timestamp.now(),
      pointsEarned: challenge.points,
    })
  }

  return { correct: isCorrect, points: isCorrect ? challenge.points : 0 }
}

// Get user's completed daily challenges
export async function getUserDailyChallengeCompletions(uid: string): Promise<UserChallengeCompletion[]> {
  const snap = await getDocs(collection(db, `users/${uid}/daily-completions`))
  return snap.docs.map((d) => d.data() as UserChallengeCompletion)
}
