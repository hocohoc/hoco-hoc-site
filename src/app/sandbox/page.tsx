"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useProfile } from "../components/auth-provider/authProvider";
import { signInOrRegister } from "../services/userService";
import {
  CodingChallenge,
  getRandomCodingChallenge,
  checkCodingAnswer,
  getGameStats,
} from "../services/gameService";
import { motion, AnimatePresence } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

type Difficulty = "easy" | "medium" | "hard" | "all";
type Tab = "predict" | "write";

const DIFFICULTY_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; border: string; points: string }
> = {
  all: { label: "All Levels", color: "text-slate-300", bg: "bg-slate-700/30", border: "border-slate-600", points: "3-8" },
  easy: { label: "Easy", color: "text-emerald-400", bg: "bg-emerald-900/30", border: "border-emerald-700", points: "3" },
  medium: { label: "Medium", color: "text-amber-400", bg: "bg-amber-900/30", border: "border-amber-700", points: "5" },
  hard: { label: "Hard", color: "text-red-400", bg: "bg-red-900/30", border: "border-red-700", points: "8" },
};

// ---- Write-code challenge definitions ----
type WriteChallenge = {
  id: string;
  title: string;
  description: string;
  starterCode: string;
  testCases: { input: string; expected: string }[];
  points: number;
  difficulty: "easy" | "medium" | "hard";
  hint?: string;
};

const WRITE_CHALLENGES: WriteChallenge[] = [
  // EASY
  {
    id: "write-1",
    title: "Double It",
    description: "Write a function `solve(n)` that returns the number multiplied by 2.",
    starterCode: "def solve(n):\n    # your code here\n    pass",
    testCases: [
      { input: "5", expected: "10" },
      { input: "0", expected: "0" },
      { input: "-3", expected: "-6" },
    ],
    points: 3,
    difficulty: "easy",
    hint: "Return n * 2",
  },
  {
    id: "write-2",
    title: "Is Even?",
    description: "Write a function `solve(n)` that returns `True` if n is even, `False` otherwise.",
    starterCode: "def solve(n):\n    # your code here\n    pass",
    testCases: [
      { input: "4", expected: "True" },
      { input: "7", expected: "False" },
      { input: "0", expected: "True" },
    ],
    points: 3,
    difficulty: "easy",
    hint: "Use the modulo operator %",
  },
  {
    id: "write-3",
    title: "String Length",
    description: "Write a function `solve(s)` that returns the length of the string s.",
    starterCode: "def solve(s):\n    # your code here\n    pass",
    testCases: [
      { input: "'hello'", expected: "5" },
      { input: "''", expected: "0" },
      { input: "'Python'", expected: "6" },
    ],
    points: 3,
    difficulty: "easy",
  },
  {
    id: "write-4",
    title: "Absolute Value",
    description: "Write a function `solve(n)` that returns the absolute value of n without using abs().",
    starterCode: "def solve(n):\n    # your code here\n    pass",
    testCases: [
      { input: "-5", expected: "5" },
      { input: "3", expected: "3" },
      { input: "0", expected: "0" },
    ],
    points: 3,
    difficulty: "easy",
    hint: "If n < 0, return -n",
  },
  // MEDIUM
  {
    id: "write-5",
    title: "Sum of List",
    description: "Write a function `solve(nums)` that returns the sum of all numbers in the list without using sum().",
    starterCode: "def solve(nums):\n    # your code here\n    pass",
    testCases: [
      { input: "[1, 2, 3]", expected: "6" },
      { input: "[]", expected: "0" },
      { input: "[10, -5, 3]", expected: "8" },
    ],
    points: 5,
    difficulty: "medium",
    hint: "Use a loop to accumulate a total",
  },
  {
    id: "write-6",
    title: "Reverse String",
    description: "Write a function `solve(s)` that returns the string reversed.",
    starterCode: "def solve(s):\n    # your code here\n    pass",
    testCases: [
      { input: "'hello'", expected: "olleh" },
      { input: "'abc'", expected: "cba" },
      { input: "'a'", expected: "a" },
    ],
    points: 5,
    difficulty: "medium",
  },
  {
    id: "write-7",
    title: "Count Vowels",
    description: "Write a function `solve(s)` that returns the number of vowels (a, e, i, o, u) in the string (case-insensitive).",
    starterCode: "def solve(s):\n    # your code here\n    pass",
    testCases: [
      { input: "'hello'", expected: "2" },
      { input: "'AEIOU'", expected: "5" },
      { input: "'xyz'", expected: "0" },
    ],
    points: 5,
    difficulty: "medium",
  },
  {
    id: "write-8",
    title: "Find Maximum",
    description: "Write a function `solve(nums)` that returns the largest number in the list without using max().",
    starterCode: "def solve(nums):\n    # your code here\n    pass",
    testCases: [
      { input: "[3, 1, 4, 1, 5]", expected: "5" },
      { input: "[-1, -5, -2]", expected: "-1" },
      { input: "[42]", expected: "42" },
    ],
    points: 5,
    difficulty: "medium",
  },
  // HARD
  {
    id: "write-9",
    title: "FizzBuzz Value",
    description: "Write a function `solve(n)` that returns 'FizzBuzz' if n is divisible by both 3 and 5, 'Fizz' if divisible by 3, 'Buzz' if divisible by 5, or the number as a string otherwise.",
    starterCode: "def solve(n):\n    # your code here\n    pass",
    testCases: [
      { input: "15", expected: "FizzBuzz" },
      { input: "9", expected: "Fizz" },
      { input: "10", expected: "Buzz" },
      { input: "7", expected: "7" },
    ],
    points: 8,
    difficulty: "hard",
  },
  {
    id: "write-10",
    title: "Palindrome Check",
    description: "Write a function `solve(s)` that returns `True` if the string is a palindrome (reads the same forwards and backwards), `False` otherwise. Ignore case.",
    starterCode: "def solve(s):\n    # your code here\n    pass",
    testCases: [
      { input: "'racecar'", expected: "True" },
      { input: "'Hello'", expected: "False" },
      { input: "'Aba'", expected: "True" },
    ],
    points: 8,
    difficulty: "hard",
  },
  {
    id: "write-11",
    title: "Fibonacci",
    description: "Write a function `solve(n)` that returns the nth Fibonacci number (0-indexed). F(0)=0, F(1)=1.",
    starterCode: "def solve(n):\n    # your code here\n    pass",
    testCases: [
      { input: "0", expected: "0" },
      { input: "1", expected: "1" },
      { input: "6", expected: "8" },
      { input: "10", expected: "55" },
    ],
    points: 8,
    difficulty: "hard",
    hint: "Use a loop or recursion. F(n) = F(n-1) + F(n-2)",
  },
  {
    id: "write-12",
    title: "Remove Duplicates",
    description: "Write a function `solve(nums)` that returns a new list with duplicates removed, preserving the original order.",
    starterCode: "def solve(nums):\n    # your code here\n    pass",
    testCases: [
      { input: "[1, 2, 2, 3, 1]", expected: "[1, 2, 3]" },
      { input: "[]", expected: "[]" },
      { input: "[5, 5, 5]", expected: "[5]" },
    ],
    points: 8,
    difficulty: "hard",
  },
];

export default function CodingChallengesPage() {
  const profile = useProfile();
  const userId = profile?.uid ?? "anonymous";

  const [tab, setTab] = useState<Tab>("predict");
  const [difficulty, setDifficulty] = useState<Difficulty>("all");
  const [challenge, setChallenge] = useState<CodingChallenge | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<{
    type: "correct" | "wrong" | "already-done" | "error";
    points: number;
    correctAnswer?: string;
    errorMsg?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ totalPoints: 0, gamesCompleted: 0 });
  const [streak, setStreak] = useState(0);
  const [allDone, setAllDone] = useState(false);
  const [totalAvailable] = useState(100);

  // Write-code state
  const [writeChallenge, setWriteChallenge] = useState<WriteChallenge | null>(null);
  const [code, setCode] = useState("");
  const [writeFeedback, setWriteFeedback] = useState<{
    type: "pass" | "fail" | "error";
    message: string;
    results?: { input: string; expected: string; got: string; pass: boolean }[];
    points?: number;
  } | null>(null);
  const [writeLoading, setWriteLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [writeDifficulty, setWriteDifficulty] = useState<Difficulty>("all");
  const [completedWriteIds, setCompletedWriteIds] = useState<Set<string>>(new Set());
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const lineNumRef = useRef<HTMLDivElement>(null);
  const [cursorInfo, setCursorInfo] = useState({ line: 1, col: 1 });

  // Fetch user stats
  const refreshStats = useCallback(async () => {
    if (userId === "anonymous") return;
    const s = await getGameStats(userId);
    setStats({ totalPoints: s.totalPoints, gamesCompleted: s.gamesCompleted });
  }, [userId]);

  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  // Load a predict challenge
  const loadChallenge = useCallback(async () => {
    setLoading(true);
    setFeedback(null);
    setUserAnswer("");
    setAllDone(false);
    try {
      const c = await getRandomCodingChallenge(userId, difficulty);
      if (!c) {
        setAllDone(true);
        setChallenge(null);
      } else {
        setChallenge(c);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, [userId, difficulty]);

  useEffect(() => {
    if (tab === "predict") loadChallenge();
  }, [loadChallenge, tab]);

  // Load a write challenge
  const loadWriteChallenge = useCallback(() => {
    setWriteFeedback(null);
    setShowHint(false);
    const filtered = writeDifficulty === "all"
      ? WRITE_CHALLENGES
      : WRITE_CHALLENGES.filter((c) => c.difficulty === writeDifficulty);
    const available = filtered.filter((c) => !completedWriteIds.has(c.id));
    if (available.length === 0) {
      setWriteChallenge(null);
      return;
    }
    const picked = available[Math.floor(Math.random() * available.length)];
    setWriteChallenge(picked);
    setCode(picked.starterCode);
  }, [writeDifficulty, completedWriteIds]);

  useEffect(() => {
    if (tab === "write") loadWriteChallenge();
  }, [loadWriteChallenge, tab]);

  // Submit predict answer
  async function handleSubmit() {
    if (!challenge || !userAnswer.trim()) return;
    setLoading(true);
    try {
      const result = await checkCodingAnswer(userId, challenge, userAnswer.trim());
      if (result.correct) {
        setFeedback({ type: "correct", points: result.pointsEarned });
        setStreak((s) => s + 1);
        refreshStats();
      } else if (result.pointsEarned === 0 && result.correctAnswer && userAnswer.trim() === challenge.output) {
        // They got it right but already completed it
        setFeedback({ type: "already-done", points: 0 });
      } else {
        setFeedback({
          type: "wrong",
          points: 0,
          correctAnswer: result.correctAnswer,
        });
        setStreak(0);
      }
    } catch (err) {
      console.error("Submit error:", err);
      // Fallback: check answer client-side so the user always gets feedback
      const correct = userAnswer.trim() === challenge.output;
      if (correct) {
        setFeedback({ type: "correct", points: 0 });
        setStreak((s) => s + 1);
      } else {
        setFeedback({ type: "wrong", points: 0, correctAnswer: challenge.output });
        setStreak(0);
      }
    }
    setLoading(false);
  }

  // Run & check write-code challenge (client-side Python eval via simple test harness)
  async function handleRunCode() {
    if (!writeChallenge || !code.trim()) return;
    setWriteLoading(true);
    setWriteFeedback(null);

    try {
      // We run the user's code + test cases via a hidden iframe with Pyodide
      const results: { input: string; expected: string; got: string; pass: boolean }[] = [];

      for (const tc of writeChallenge.testCases) {
        try {
          const got = await runPython(code, tc.input);
          const pass = got.trim() === tc.expected.trim();
          results.push({ input: tc.input, expected: tc.expected, got: got.trim(), pass });
        } catch (err: unknown) {
          const errMsg = err instanceof Error ? err.message : String(err);
          results.push({ input: tc.input, expected: tc.expected, got: `Error: ${errMsg}`, pass: false });
        }
      }

      const allPassed = results.every((r) => r.pass);

      if (allPassed) {
        setCompletedWriteIds((prev) => new Set(prev).add(writeChallenge.id));
        // Award points via game service if logged in
        if (userId !== "anonymous") {
          try {
            const { awardGamePoints } = await import("../services/gameService");
            await awardGamePoints(userId, writeChallenge.id, "mindstorm", writeChallenge.points, writeChallenge.points);
            refreshStats();
          } catch {
            // ignore if already completed in DB
          }
        }
        setWriteFeedback({
          type: "pass",
          message: `All ${results.length} test cases passed!`,
          results,
          points: writeChallenge.points,
        });
      } else {
        const passCount = results.filter((r) => r.pass).length;
        setWriteFeedback({
          type: "fail",
          message: `${passCount}/${results.length} test cases passed.`,
          results,
        });
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      setWriteFeedback({ type: "error", message: errMsg });
    }
    setWriteLoading(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  // Handle Tab key in code textarea
  function handleCodeKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;

    if (e.key === "Tab") {
      e.preventDefault();
      if (e.shiftKey) {
        // Shift+Tab: dedent current line
        const lineStart = code.lastIndexOf("\n", start - 1) + 1;
        const lineText = code.substring(lineStart, start);
        const spaces = lineText.match(/^ {1,4}/);
        if (spaces) {
          const newCode = code.substring(0, lineStart) + code.substring(lineStart + spaces[0].length);
          setCode(newCode);
          requestAnimationFrame(() => {
            ta.selectionStart = ta.selectionEnd = Math.max(lineStart, start - spaces[0].length);
          });
        }
      } else {
        // Tab: insert 4 spaces
        const newCode = code.substring(0, start) + "    " + code.substring(end);
        setCode(newCode);
        requestAnimationFrame(() => {
          ta.selectionStart = ta.selectionEnd = start + 4;
        });
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      // Smart indent: match current line indent + extra after ':'
      const lineStart = code.lastIndexOf("\n", start - 1) + 1;
      const currentLine = code.substring(lineStart, start);
      const indent = currentLine.match(/^(\s*)/)?.[1] || "";
      const trimmed = code.substring(lineStart, start).trimEnd();
      const extraIndent = trimmed.endsWith(":") ? "    " : "";
      const insertion = "\n" + indent + extraIndent;
      const newCode = code.substring(0, start) + insertion + code.substring(end);
      setCode(newCode);
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + insertion.length;
      });
    } else if (e.key === "Backspace") {
      // Smart dedent: if cursor is at end of whitespace-only prefix, remove 4 spaces
      const lineStart = code.lastIndexOf("\n", start - 1) + 1;
      const beforeCursor = code.substring(lineStart, start);
      if (beforeCursor.length > 0 && beforeCursor.trimEnd() === "" && beforeCursor.length % 4 === 0 && start === end) {
        e.preventDefault();
        const remove = Math.min(4, beforeCursor.length);
        const newCode = code.substring(0, start - remove) + code.substring(end);
        setCode(newCode);
        requestAnimationFrame(() => {
          ta.selectionStart = ta.selectionEnd = start - remove;
        });
      }
    }
  }

  // Sync scroll between textarea, highlight overlay, and line numbers
  function handleEditorScroll() {
    const ta = textareaRef.current;
    if (ta && highlightRef.current) {
      highlightRef.current.scrollTop = ta.scrollTop;
      highlightRef.current.scrollLeft = ta.scrollLeft;
    }
    if (ta && lineNumRef.current) {
      lineNumRef.current.scrollTop = ta.scrollTop;
    }
  }

  // Track cursor position for status bar
  function updateCursorInfo() {
    const ta = textareaRef.current;
    if (!ta) return;
    const pos = ta.selectionStart;
    const textBefore = code.substring(0, pos);
    const line = (textBefore.match(/\n/g) || []).length + 1;
    const lastNewline = textBefore.lastIndexOf("\n");
    const col = pos - lastNewline;
    setCursorInfo({ line, col });
  }

  const diffConfig = challenge
    ? DIFFICULTY_CONFIG[challenge.difficulty]
    : DIFFICULTY_CONFIG[difficulty];

  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-sky-400 font-mono mb-2">
              Code Challenges
            </p>
            <h1 className="text-3xl md:text-4xl font-mono font-bold text-sky-200 tracking-tight">
              Practice & Earn Points
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-lg">
              Solve coding challenges to sharpen your skills and climb the leaderboard.
            </p>
          </div>

          {/* Stats Bar */}
          {profile && (
            <div className="flex gap-3">
              <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-center min-w-[80px]">
                <p className="text-2xl font-bold font-mono text-sky-300">{stats.totalPoints}</p>
                <p className="text-[10px] uppercase tracking-wider text-slate-500">Points</p>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-center min-w-[80px]">
                <p className="text-2xl font-bold font-mono text-emerald-400">{stats.gamesCompleted}</p>
                <p className="text-[10px] uppercase tracking-wider text-slate-500">Solved</p>
              </div>
              {streak > 1 && (
                <div className="bg-amber-900/30 border border-amber-700 rounded-xl px-4 py-2.5 text-center min-w-[80px]">
                  <p className="text-2xl font-bold font-mono text-amber-400">{streak}</p>
                  <p className="text-[10px] uppercase tracking-wider text-amber-500/70">Streak</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 border-b border-slate-700 pb-0">
          <button
            onClick={() => setTab("predict")}
            className={`font-mono text-sm px-4 py-2.5 border-b-2 transition-colors ${
              tab === "predict"
                ? "border-sky-400 text-sky-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            Predict Output
          </button>
          <button
            onClick={() => setTab("write")}
            className={`font-mono text-sm px-4 py-2.5 border-b-2 transition-colors ${
              tab === "write"
                ? "border-sky-400 text-sky-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            Write Code
          </button>
        </div>

        {/* Login Prompt */}
        {!profile && (
          <div className="rounded-xl border border-sky-900 bg-sky-950/50 p-5">
            <p className="text-slate-300 text-sm">
              <strong className="text-sky-300">Sign in</strong> to save your progress and earn points towards the leaderboard!
            </p>
            <button
              className="mt-3 font-mono btn-primary text-sm"
              onClick={() => signInOrRegister()}
            >
              Login to Track Progress
            </button>
          </div>
        )}

        {/* ============ PREDICT TAB ============ */}
        {tab === "predict" && (
          <>
            {/* Difficulty Filter */}
            <div className="flex flex-wrap gap-2">
              {(["all", "easy", "medium", "hard"] as Difficulty[]).map((d) => {
                const cfg = DIFFICULTY_CONFIG[d];
                return (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`font-mono text-sm px-4 py-2 rounded-lg border transition-colors ${
                      difficulty === d
                        ? `${cfg.bg} ${cfg.border} ${cfg.color}`
                        : "border-slate-700 text-slate-500 hover:text-slate-300 hover:border-slate-600 hover:bg-slate-800"
                    }`}
                  >
                    {cfg.label} ({cfg.points} pts)
                  </button>
                );
              })}
            </div>

            {/* All Done */}
            {allDone && (
              <div className="rounded-xl border border-emerald-800 bg-emerald-950/30 p-8 text-center">
                <h2 className="text-xl font-mono font-bold text-emerald-300 mb-2">
                  All Challenges Complete!
                </h2>
                <p className="text-slate-400 text-sm mb-4">
                  You&apos;ve solved all {difficulty === "all" ? "" : difficulty + " "}coding challenges. Amazing work!
                </p>
                <button
                  onClick={() => { if (difficulty !== "all") setDifficulty("all"); }}
                  className="font-mono text-sm px-5 py-2 btn-secondary"
                >
                  Try Another Difficulty
                </button>
              </div>
            )}

            {/* Challenge Card */}
            <AnimatePresence mode="wait">
              {challenge && !allDone && (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-xl border border-slate-700 bg-slate-800 overflow-hidden"
                >
                  {/* Challenge Header */}
                  <div className="flex items-center justify-between px-5 py-3 bg-slate-800 border-b border-slate-700">
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-mono font-semibold px-2.5 py-1 rounded-full ${diffConfig.bg} ${diffConfig.border} ${diffConfig.color} border`}>
                        {challenge.difficulty.toUpperCase()}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        {challenge.id}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-slate-500 font-mono">Reward:</span>
                      <span className={`text-sm font-bold font-mono ${diffConfig.color}`}>
                        +{challenge.points} pts
                      </span>
                    </div>
                  </div>

                  {/* Code Block */}
                  <div className="p-5">
                    <p className="text-xs uppercase tracking-wider text-slate-500 mb-3 font-mono">
                      What does this code print?
                    </p>
                    <div className="bg-gray-950 border border-slate-700 rounded-lg p-4 font-mono text-sm leading-relaxed overflow-x-auto">
                      {challenge.code.split("\n").map((line, i) => (
                        <div key={i} className="flex">
                          <span className="text-slate-600 select-none w-8 inline-block text-right mr-4 text-xs leading-relaxed">
                            {i + 1}
                          </span>
                          <span className="text-sky-100 whitespace-pre">{line}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Answer Input */}
                  <div className="px-5 pb-5">
                    {!feedback ? (
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={userAnswer}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder="Type the exact output..."
                          className="flex-1 bg-gray-950 border border-slate-600 rounded-lg px-4 py-3 font-mono text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30 transition-all"
                          disabled={loading}
                          autoFocus
                        />
                        <button
                          onClick={handleSubmit}
                          disabled={loading || !userAnswer.trim()}
                          className="font-mono text-sm font-semibold btn-primary px-6 py-3 disabled:opacity-40"
                        >
                          {loading ? "..." : "Submit"}
                        </button>
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`rounded-lg p-4 border ${
                          feedback.type === "correct"
                            ? "bg-emerald-950/30 border-emerald-800"
                            : feedback.type === "already-done"
                            ? "bg-amber-950/30 border-amber-800"
                            : "bg-red-950/30 border-red-800"
                        }`}
                      >
                        {feedback.type === "correct" && (
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-mono font-bold text-emerald-300">Correct!</p>
                              {feedback.points > 0 && (
                                <p className="text-xs text-emerald-400/70 font-mono">
                                  +{feedback.points} points earned
                                </p>
                              )}
                            </div>
                            <button onClick={loadChallenge} className="font-mono text-sm font-semibold bg-emerald-900/40 hover:bg-emerald-900/60 text-emerald-300 px-5 py-2 rounded-lg border border-emerald-800 transition-colors">
                              Next Challenge
                            </button>
                          </div>
                        )}
                        {feedback.type === "wrong" && (
                          <div>
                            <p className="font-mono font-bold text-red-300 mb-1">Not quite!</p>
                            <p className="text-xs text-red-400/70 font-mono mb-3">
                              The correct answer was: <code className="bg-red-900/30 px-1.5 py-0.5 rounded text-red-200">{feedback.correctAnswer}</code>
                            </p>
                            <button onClick={loadChallenge} className="font-mono text-sm font-semibold bg-slate-700 hover:bg-slate-600 text-slate-200 px-5 py-2 rounded-lg transition-colors">
                              Next Challenge
                            </button>
                          </div>
                        )}
                        {feedback.type === "already-done" && (
                          <div className="flex items-center justify-between">
                            <p className="font-mono text-amber-300 text-sm">
                              You&apos;ve already solved this one!
                            </p>
                            <button onClick={loadChallenge} className="font-mono text-sm font-semibold bg-amber-900/40 hover:bg-amber-900/60 text-amber-300 px-5 py-2 rounded-lg border border-amber-800 transition-colors">
                              Next Challenge
                            </button>
                          </div>
                        )}
                        {feedback.type === "error" && (
                          <div>
                            <p className="font-mono font-bold text-red-300 mb-1">Something went wrong</p>
                            <p className="text-xs text-red-400/70 font-mono mb-3">{feedback.errorMsg || "Please try again."}</p>
                            <button onClick={loadChallenge} className="font-mono text-sm font-semibold bg-slate-700 hover:bg-slate-600 text-slate-200 px-5 py-2 rounded-lg transition-colors">
                              Try Again
                            </button>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading skeleton */}
            {loading && !challenge && !allDone && (
              <div className="rounded-xl border border-slate-700 bg-slate-800 p-8 animate-pulse">
                <div className="h-4 bg-slate-700 rounded w-24 mb-4" />
                <div className="h-32 bg-slate-750 rounded-lg mb-4" />
                <div className="h-10 bg-slate-750 rounded-lg w-full" />
              </div>
            )}
          </>
        )}

        {/* ============ WRITE CODE TAB ============ */}
        {tab === "write" && (
          <>
            {/* Difficulty Filter */}
            <div className="flex flex-wrap gap-2">
              {(["all", "easy", "medium", "hard"] as Difficulty[]).map((d) => {
                const cfg = DIFFICULTY_CONFIG[d];
                return (
                  <button
                    key={d}
                    onClick={() => setWriteDifficulty(d)}
                    className={`font-mono text-sm px-4 py-2 rounded-lg border transition-colors ${
                      writeDifficulty === d
                        ? `${cfg.bg} ${cfg.border} ${cfg.color}`
                        : "border-slate-700 text-slate-500 hover:text-slate-300 hover:border-slate-600 hover:bg-slate-800"
                    }`}
                  >
                    {cfg.label} ({cfg.points} pts)
                  </button>
                );
              })}
            </div>

            {!writeChallenge ? (
              <div className="rounded-xl border border-emerald-800 bg-emerald-950/30 p-8 text-center">
                <h2 className="text-xl font-mono font-bold text-emerald-300 mb-2">
                  All Done!
                </h2>
                <p className="text-slate-400 text-sm mb-4">
                  You&apos;ve completed all {writeDifficulty === "all" ? "" : writeDifficulty + " "}write-code challenges.
                </p>
                <button onClick={() => { if (writeDifficulty !== "all") setWriteDifficulty("all"); }} className="font-mono text-sm px-5 py-2 btn-secondary">
                  Try Another Difficulty
                </button>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={writeChallenge.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  {/* Problem Card */}
                  <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-mono font-semibold px-2.5 py-1 rounded-full border ${DIFFICULTY_CONFIG[writeChallenge.difficulty].bg} ${DIFFICULTY_CONFIG[writeChallenge.difficulty].border} ${DIFFICULTY_CONFIG[writeChallenge.difficulty].color}`}>
                          {writeChallenge.difficulty.toUpperCase()}
                        </span>
                        <h2 className="font-mono font-bold text-sky-200">{writeChallenge.title}</h2>
                      </div>
                      <span className={`text-sm font-bold font-mono ${DIFFICULTY_CONFIG[writeChallenge.difficulty].color}`}>
                        +{writeChallenge.points} pts
                      </span>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">{writeChallenge.description}</p>

                    {/* Test case examples */}
                    <div className="mt-4">
                      <p className="text-xs uppercase tracking-wider text-slate-500 font-mono mb-2">Examples</p>
                      <div className="grid gap-2">
                        {writeChallenge.testCases.slice(0, 2).map((tc, i) => (
                          <div key={i} className="bg-gray-950 border border-slate-700 rounded-lg px-4 py-2 font-mono text-xs flex gap-6">
                            <span className="text-slate-400">Input: <span className="text-sky-200">{tc.input}</span></span>
                            <span className="text-slate-400">Expected: <span className="text-emerald-300">{tc.expected}</span></span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Hint */}
                    {writeChallenge.hint && (
                      <div className="mt-3">
                        {!showHint ? (
                          <button onClick={() => setShowHint(true)} className="text-xs text-sky-400 hover:text-sky-300 font-mono transition-colors">
                            Show Hint
                          </button>
                        ) : (
                          <p className="text-xs text-slate-400 font-mono bg-sky-950/40 border border-sky-900 rounded px-3 py-2">
                            Hint: {writeChallenge.hint}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Code Editor — IDE style */}
                  <div className="rounded-xl border border-slate-700 bg-[#1e1e1e] overflow-hidden">
                    {/* Title bar with traffic lights */}
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-[#404040]">
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1.5">
                          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                          <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
                          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
                        </div>
                        <span className="font-mono text-xs text-slate-400 bg-[#1e1e1e] px-3 py-0.5 rounded-t border-t border-x border-[#404040] -mb-[9px]">
                          solution.py
                        </span>
                      </div>
                      <button
                        onClick={() => { setCode(writeChallenge.starterCode); setWriteFeedback(null); }}
                        className="font-mono text-xs text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        Reset
                      </button>
                    </div>

                    {/* Editor body: line numbers + code area */}
                    <div className="flex" style={{ height: "280px" }}>
                      {/* Line numbers */}
                      <div
                        ref={lineNumRef}
                        className="flex-shrink-0 bg-[#1e1e1e] text-right select-none overflow-hidden border-r border-[#333]"
                        style={{ width: "48px", paddingTop: "16px", paddingBottom: "16px" }}
                      >
                        {code.split("\n").map((_, i) => (
                          <div
                            key={i}
                            className="font-mono text-xs leading-[1.7rem] pr-3"
                            style={{ color: cursorInfo.line === i + 1 ? "#c6c6c6" : "#6e7681" }}
                          >
                            {i + 1}
                          </div>
                        ))}
                      </div>

                      {/* Code area with highlight overlay + textarea */}
                      <div className="relative flex-1 overflow-hidden">
                        {/* Syntax highlight layer (behind textarea) */}
                        <div
                          ref={highlightRef}
                          className="absolute inset-0 overflow-hidden pointer-events-none"
                          aria-hidden
                          style={{ padding: "16px 16px 16px 12px" }}
                        >
                          <SyntaxHighlighter
                            language="python"
                            style={vscDarkPlus}
                            customStyle={{
                              background: "transparent",
                              padding: 0,
                              margin: 0,
                              fontSize: "14px",
                              lineHeight: "1.7rem",
                              fontFamily: "var(--font-jbm), ui-monospace, monospace",
                              overflow: "visible",
                              whiteSpace: "pre",
                            }}
                            codeTagProps={{
                              style: {
                                fontFamily: "var(--font-jbm), ui-monospace, monospace",
                                fontSize: "14px",
                                lineHeight: "1.7rem",
                              }
                            }}
                          >
                            {code || " "}
                          </SyntaxHighlighter>
                        </div>

                        {/* Transparent textarea (on top for input) */}
                        <textarea
                          ref={textareaRef}
                          value={code}
                          onChange={(e) => { setCode(e.target.value); updateCursorInfo(); }}
                          onKeyDown={handleCodeKeyDown}
                          onKeyUp={updateCursorInfo}
                          onClick={updateCursorInfo}
                          onScroll={handleEditorScroll}
                          className="absolute inset-0 w-full h-full resize-none focus:outline-none font-mono text-sm"
                          style={{
                            padding: "16px 16px 16px 12px",
                            background: "transparent",
                            color: "transparent",
                            caretColor: "#aeafad",
                            lineHeight: "1.7rem",
                            fontSize: "14px",
                            fontFamily: "var(--font-jbm), ui-monospace, monospace",
                            whiteSpace: "pre",
                            overflowWrap: "normal",
                            overflowX: "auto",
                            overflowY: "auto",
                          }}
                          spellCheck={false}
                          autoCapitalize="off"
                          autoCorrect="off"
                          placeholder="Write your Python code here..."
                        />
                      </div>
                    </div>

                    {/* Status bar */}
                    <div className="flex items-center justify-between px-4 py-1.5 bg-[#007acc] text-white text-xs font-mono">
                      <div className="flex items-center gap-4">
                        <span>Ln {cursorInfo.line}, Col {cursorInfo.col}</span>
                        <span>Spaces: 4</span>
                        <span>UTF-8</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span>Python</span>
                        <button
                          onClick={handleRunCode}
                          disabled={writeLoading || !code.trim()}
                          className="bg-white/20 hover:bg-white/30 disabled:opacity-40 px-3 py-0.5 rounded transition-colors"
                        >
                          {writeLoading ? "Running..." : "▶ Run & Check"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Results */}
                  {writeFeedback && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`rounded-xl border p-5 ${
                        writeFeedback.type === "pass"
                          ? "border-emerald-800 bg-emerald-950/30"
                          : writeFeedback.type === "fail"
                          ? "border-red-800 bg-red-950/30"
                          : "border-red-800 bg-red-950/30"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className={`font-mono font-bold ${writeFeedback.type === "pass" ? "text-emerald-300" : "text-red-300"}`}>
                            {writeFeedback.type === "pass" ? "All Tests Passed!" : writeFeedback.type === "fail" ? "Some Tests Failed" : "Error"}
                          </p>
                          <p className="text-xs text-slate-400 font-mono">{writeFeedback.message}</p>
                          {writeFeedback.points && writeFeedback.points > 0 && (
                            <p className="text-xs text-emerald-400 font-mono mt-1">+{writeFeedback.points} points earned</p>
                          )}
                        </div>
                        {writeFeedback.type === "pass" && (
                          <button onClick={loadWriteChallenge} className="font-mono text-sm font-semibold bg-emerald-900/40 hover:bg-emerald-900/60 text-emerald-300 px-5 py-2 rounded-lg border border-emerald-800 transition-colors">
                            Next Challenge
                          </button>
                        )}
                      </div>

                      {/* Test case breakdown */}
                      {writeFeedback.results && (
                        <div className="space-y-2 mt-3">
                          {writeFeedback.results.map((r, i) => (
                            <div key={i} className={`font-mono text-xs rounded-lg px-3 py-2 border ${r.pass ? "border-emerald-800 bg-emerald-950/20" : "border-red-800 bg-red-950/20"}`}>
                              <div className="flex items-center gap-2 mb-1">
                                <span className={r.pass ? "text-emerald-400" : "text-red-400"}>{r.pass ? "PASS" : "FAIL"}</span>
                                <span className="text-slate-500">solve({r.input})</span>
                              </div>
                              <div className="flex gap-4 text-slate-400">
                                <span>Expected: <span className="text-emerald-300">{r.expected}</span></span>
                                <span>Got: <span className={r.pass ? "text-emerald-300" : "text-red-300"}>{r.got}</span></span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Skip */}
                  {!writeFeedback?.type || writeFeedback.type !== "pass" ? (
                    <button onClick={loadWriteChallenge} className="font-mono text-sm text-slate-500 hover:text-slate-300 transition-colors">
                      Skip this challenge
                    </button>
                  ) : null}
                </motion.div>
              </AnimatePresence>
            )}
          </>
        )}

        {/* How It Works */}
        <div className="rounded-xl border border-slate-700 bg-slate-800 p-6">
          <h2 className="font-mono font-bold text-sky-200 text-lg mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="font-mono text-sm font-semibold text-slate-200 mb-1">1. Read the Problem</p>
              <p className="text-xs text-slate-500">
                {tab === "predict"
                  ? "Each challenge shows a code snippet. Trace through the logic carefully."
                  : "Read the problem description and check the example test cases."}
              </p>
            </div>
            <div>
              <p className="font-mono text-sm font-semibold text-slate-200 mb-1">2. Solve It</p>
              <p className="text-xs text-slate-500">
                {tab === "predict"
                  ? "Type exactly what the code would print. Spaces and formatting matter!"
                  : "Write your Python code in the editor. Tab inserts spaces, and you can reset anytime."}
              </p>
            </div>
            <div>
              <p className="font-mono text-sm font-semibold text-slate-200 mb-1">3. Earn Points</p>
              <p className="text-xs text-slate-500">
                Easy = 3 pts, Medium = 5 pts, Hard = 8 pts. Points count towards the leaderboard!
              </p>
            </div>
          </div>
        </div>

        {/* Progress */}
        {profile && stats.gamesCompleted > 0 && (
          <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="font-mono text-sm text-slate-400">Challenge Progress</p>
              <p className="font-mono text-xs text-slate-500">
                {stats.gamesCompleted} / {totalAvailable} solved
              </p>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((stats.gamesCompleted / totalAvailable) * 100, 100)}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 rounded-full"
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

// ---- Lightweight Python runner via Pyodide in a sandboxed iframe ----
let pyodideResolve: ((value: (code: string, input: string) => Promise<string>) => void) | null = null;
let pyodideRunner: ((code: string, input: string) => Promise<string>) | null = null;

function getPyodideRunner(): Promise<(code: string, input: string) => Promise<string>> {
  if (pyodideRunner) return Promise.resolve(pyodideRunner);

  return new Promise((resolve) => {
    if (pyodideResolve) {
      // already loading
      const interval = setInterval(() => {
        if (pyodideRunner) {
          clearInterval(interval);
          resolve(pyodideRunner);
        }
      }, 100);
      return;
    }
    pyodideResolve = resolve;

    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.sandbox.add("allow-scripts");
    iframe.srcdoc = `
      <html><body><script src="https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js"><\/script>
      <script>
        let pyodide;
        async function init() {
          pyodide = await loadPyodide();
          parent.postMessage({ type: 'pyodide-ready' }, '*');
        }
        init();
        window.addEventListener('message', async (e) => {
          if (e.data.type === 'run') {
            try {
              const fullCode = e.data.code + '\\nresult = solve(' + e.data.input + ')\\nstr(result)';
              const result = await pyodide.runPythonAsync(fullCode);
              parent.postMessage({ type: 'result', id: e.data.id, value: result }, '*');
            } catch (err) {
              parent.postMessage({ type: 'error', id: e.data.id, value: err.message }, '*');
            }
          }
        });
      <\/script></body></html>
    `;
    document.body.appendChild(iframe);

    const pending = new Map<string, { resolve: (v: string) => void; reject: (e: Error) => void }>();

    window.addEventListener("message", (e) => {
      if (e.data.type === "pyodide-ready") {
        const runner = (code: string, input: string): Promise<string> => {
          return new Promise((res, rej) => {
            const id = Math.random().toString(36).slice(2);
            pending.set(id, { resolve: res, reject: rej });
            iframe.contentWindow?.postMessage({ type: "run", code, input, id }, "*");
            setTimeout(() => {
              if (pending.has(id)) {
                pending.delete(id);
                rej(new Error("Execution timed out (5s)"));
              }
            }, 5000);
          });
        };
        pyodideRunner = runner;
        resolve(runner);
      }
      if (e.data.type === "result" || e.data.type === "error") {
        const p = pending.get(e.data.id);
        if (p) {
          pending.delete(e.data.id);
          if (e.data.type === "result") p.resolve(e.data.value);
          else p.reject(new Error(e.data.value));
        }
      }
    });
  });
}

async function runPython(code: string, input: string): Promise<string> {
  const runner = await getPyodideRunner();
  return runner(code, input);
}
