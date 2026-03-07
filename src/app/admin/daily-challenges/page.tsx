"use client"

import { useEffect, useState } from "react"
import { useProfile } from "@/app/components/auth-provider/authProvider"
import {
  DailyChallenge,
  getDailyChallenges,
  saveDailyChallenge,
  deleteDailyChallenge,
} from "@/app/services/dailyChallengeService"

const EVENT_DATES = [
  "2026-12-08",
  "2026-12-09",
  "2026-12-10",
  "2026-12-11",
  "2026-12-12",
  "2026-12-13",
  "2026-12-14",
  "2026-12-15",
]

const EMPTY_CHALLENGE: Omit<DailyChallenge, "id"> = {
  day: 1,
  date: EVENT_DATES[0],
  title: "",
  description: "",
  type: "coding",
  content: "",
  answer: "",
  points: 5,
  difficulty: "easy",
}

export default function AdminDailyChallengesPage() {
  const profile = useProfile()
  const [challenges, setChallenges] = useState<DailyChallenge[]>([])
  const [editing, setEditing] = useState<DailyChallenge | null>(null)
  const [form, setForm] = useState(EMPTY_CHALLENGE)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState("")

  useEffect(() => {
    loadChallenges()
  }, [])

  async function loadChallenges() {
    const data = await getDailyChallenges()
    setChallenges(data)
  }

  function startNew() {
    setEditing(null)
    setForm(EMPTY_CHALLENGE)
    setMsg("")
  }

  function startEdit(c: DailyChallenge) {
    setEditing(c)
    setForm({
      day: c.day,
      date: c.date,
      title: c.title,
      description: c.description,
      type: c.type,
      content: c.content,
      answer: c.answer || "",
      points: c.points,
      difficulty: c.difficulty,
    })
    setMsg("")
  }

  async function handleSave() {
    setSaving(true)
    setMsg("")
    try {
      const id = editing
        ? editing.id
        : `day-${form.day}-${Date.now()}`
      await saveDailyChallenge({ ...form, id })
      await loadChallenges()
      setMsg("Saved!")
      setEditing(null)
      setForm(EMPTY_CHALLENGE)
    } catch (e) {
      setMsg("Error saving: " + (e as Error).message)
    }
    setSaving(false)
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this challenge?")) return
    await deleteDailyChallenge(id)
    await loadChallenges()
  }

  if (!profile?.admin) {
    return <p className="p-4 text-red-400">Admin access required.</p>
  }

  return (
    <main className="p-4 max-w-4xl mx-auto flex flex-col gap-6">
      <h1 className="text-3xl font-bold font-mono">Daily Challenges</h1>
      <p className="text-slate-400 text-sm">
        Set up one challenge per day for the event week (Dec 8–15, 2026). Students see the challenge for the current day only.
      </p>

      {/* Existing challenges */}
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold">Configured Challenges</h2>
        {challenges.length === 0 && (
          <p className="text-slate-500 text-sm">No challenges configured yet.</p>
        )}
        {challenges.map((c) => (
          <div
            key={c.id}
            className="flex items-center gap-3 bg-slate-800 rounded p-3 border border-slate-700"
          >
            <div className="flex-1 min-w-0">
              <p className="font-bold">
                Day {c.day} — {c.date}
              </p>
              <p className="text-sm text-slate-300 truncate">{c.title}</p>
              <p className="text-xs text-slate-500">
                {c.type} · {c.difficulty} · {c.points} pts
              </p>
            </div>
            <button
              className="btn-secondary text-xs px-3 py-1"
              type="button"
              onClick={() => startEdit(c)}
            >
              Edit
            </button>
            <button
              className="btn-danger text-xs px-3 py-1"
              type="button"
              onClick={() => handleDelete(c.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <hr className="border-slate-700" />

      {/* Form */}
      <div className="bg-slate-800 rounded p-4 border border-slate-700 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold flex-1">
            {editing ? `Editing: ${editing.title}` : "New Challenge"}
          </h2>
          <button type="button" className="btn-secondary text-xs px-3 py-1" onClick={startNew}>
            Reset
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-400">Day (1-8)</label>
            <input
              type="number"
              min={1}
              max={8}
              value={form.day}
              onChange={(e) => {
                const day = parseInt(e.target.value) || 1
                setForm({ ...form, day, date: EVENT_DATES[day - 1] || form.date })
              }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-400">Date</label>
            <input
              type="text"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-400">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-400">Type</label>
            <select
              className="bg-gray-950 p-2 rounded border-2 border-gray-800"
              value={form.type}
              onChange={(e) =>
                setForm({ ...form, type: e.target.value as DailyChallenge["type"] })
              }
            >
              <option value="coding">Coding</option>
              <option value="quiz">Quiz</option>
              <option value="activity">Activity</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-400">Difficulty</label>
            <select
              className="bg-gray-950 p-2 rounded border-2 border-gray-800"
              value={form.difficulty}
              onChange={(e) =>
                setForm({ ...form, difficulty: e.target.value as DailyChallenge["difficulty"] })
              }
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-400">Points</label>
            <input
              type="number"
              min={1}
              value={form.points}
              onChange={(e) => setForm({ ...form, points: parseInt(e.target.value) || 1 })}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-slate-400">Description</label>
          <textarea
            rows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-slate-400">Challenge Content (Markdown)</label>
          <textarea
            rows={6}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-slate-400">
            Expected Answer (leave empty for activity-type)
          </label>
          <input
            type="text"
            value={form.answer}
            onChange={(e) => setForm({ ...form, answer: e.target.value })}
          />
        </div>

        {msg && <p className={`text-sm font-mono ${msg.startsWith("Error") ? "text-red-400" : "text-emerald-400"}`}>{msg}</p>}

        <button
          type="button"
          className="btn-primary font-mono"
          disabled={saving || !form.title}
          onClick={handleSave}
        >
          {saving ? "Saving..." : editing ? "Update Challenge" : "Create Challenge"}
        </button>
      </div>
    </main>
  )
}
