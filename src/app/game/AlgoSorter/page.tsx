"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useProfile } from "@/app/components/auth-provider/authProvider";
import { awardGamePoints, getGameStats, getUserGameData } from "@/app/services/gameService";
import { getUserData } from "@/app/services/userService";

type Difficulty = "easy" | "medium" | "hard";

interface Level {
  size: number;
  optimalSwaps: number;
  points: number;
}

const DIFFICULTY_CONFIG: Record<Difficulty, Level> = {
  easy: { size: 4, optimalSwaps: 6, points: 3 },
  medium: { size: 6, optimalSwaps: 8, points: 5 },
  hard: { size: 8, optimalSwaps: 12, points: 8 },
};

function shuffle(arr: number[]): number[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  // Ensure it's not already sorted
  if (a.every((v, i) => v === i + 1)) {
    [a[0], a[a.length - 1]] = [a[a.length - 1], a[0]];
  }
  return a;
}

function isSorted(arr: number[]): boolean {
  return arr.every((v, i) => i === 0 || arr[i - 1] <= v);
}

export default function AlgoSorterPage() {
  const profile = useProfile();
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [numbers, setNumbers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [swaps, setSwaps] = useState(0);
  const [solved, setSolved] = useState(false);
  const [round, setRound] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [userPoints, setUserPoints] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [completedRounds, setCompletedRounds] = useState<Set<string>>(new Set());

  const config = DIFFICULTY_CONFIG[difficulty];

  const newRound = useCallback(() => {
    const arr = Array.from({ length: config.size }, (_, i) => i + 1);
    setNumbers(shuffle(arr));
    setSelected(null);
    setSwaps(0);
    setSolved(false);
    setFeedback(null);
    setRound((r) => r + 1);
  }, [config.size]);

  useEffect(() => {
    newRound();
  }, [difficulty, newRound]);

  useEffect(() => {
    loadUserPoints();
    loadCompletedRounds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  async function loadUserPoints() {
    if (!profile) {
      setUserPoints(0);
      return;
    }
    const userData = await getUserData(profile.uid);
    setUserPoints(userData?.scores?.["games"] || 0);
  }

  async function loadCompletedRounds() {
    if (!profile) return;
    const gameData = await getUserGameData(profile.uid);
    if (gameData?.completedGames) {
      setCompletedRounds(new Set(Object.keys(gameData.completedGames)));
    }
  }

  function handleTap(index: number) {
    if (solved) return;

    if (selected === null) {
      setSelected(index);
    } else if (selected === index) {
      setSelected(null);
    } else {
      // Swap
      const copy = [...numbers];
      [copy[selected], copy[index]] = [copy[index], copy[selected]];
      setNumbers(copy);
      setSelected(null);
      const newSwaps = swaps + 1;
      setSwaps(newSwaps);

      if (isSorted(copy)) {
        setSolved(true);
        handleWin(newSwaps);
      }
    }
  }

  async function handleWin(finalSwaps: number) {
    const bonus = finalSwaps <= config.optimalSwaps ? config.points : Math.max(1, config.points - (finalSwaps - config.optimalSwaps));
    const earned = Math.max(1, bonus);
    const gameId = `algo-sort-${difficulty}-${round}`;

    if (profile && !completedRounds.has(gameId)) {
      try {
        await awardGamePoints(profile.uid, gameId, "algo-sorter", finalSwaps, earned);
        setTotalPoints((p) => p + earned);
        setUserPoints((p) => p + earned);
        setCompletedRounds((prev) => new Set(prev).add(gameId));
        setFeedback(`Sorted in ${finalSwaps} swaps! +${earned} points!`);
      } catch {
        setFeedback(`Sorted in ${finalSwaps} swaps! (Error saving points)`);
      }
    } else if (!profile) {
      setFeedback(`Sorted in ${finalSwaps} swaps! Sign in to earn points.`);
    } else {
      setFeedback(`Sorted in ${finalSwaps} swaps!`);
    }
  }

  const diffColors: Record<Difficulty, string> = {
    easy: "bg-green-600",
    medium: "bg-yellow-600",
    hard: "bg-red-600",
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-950 via-gray-900 to-black text-white relative">
      <div className="absolute top-6 left-6">
        <Link
          href="/game"
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium shadow-md transition"
        >
          ← Back to Games
        </Link>
      </div>
      <div className="pt-20 pb-10 px-6 flex flex-col items-center">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-8 mb-6">
            <h1 className="text-5xl font-bold mb-3">Algo Sorter</h1>
            <p className="text-gray-400 text-lg">
              Swap elements to sort the array in ascending order{profile ? " and earn points" : " (sign in to earn points)"}!
            </p>
            {profile && (
              <div className="flex gap-4 text-base mt-4">
                <div className="bg-gray-800 border border-gray-600 px-5 py-3 rounded">
                  <span className="text-gray-400">Game Points: </span>
                  <span className="text-yellow-400 font-bold">{userPoints}</span>
                </div>
                <div className="bg-gray-800 border border-gray-600 px-5 py-3 rounded">
                  <span className="text-gray-400">Session: </span>
                  <span className="text-green-400 font-bold">+{totalPoints}</span>
                </div>
              </div>
            )}
          </div>

          {/* Difficulty Selector */}
          <div className="flex gap-3 mb-6">
            {(["easy", "medium", "hard"] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                  difficulty === d ? diffColors[d] + " text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {d.charAt(0).toUpperCase() + d.slice(1)} ({DIFFICULTY_CONFIG[d].points} pts)
              </button>
            ))}
          </div>

          {/* Game Area */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-400 text-sm font-mono">Swaps: <span className="text-white font-bold text-lg">{swaps}</span></span>
              <span className="text-gray-400 text-sm font-mono">Target: ≤ <span className="text-yellow-400 font-bold text-lg">{config.optimalSwaps}</span> for full points</span>
            </div>

            <div className="flex justify-center gap-3 flex-wrap mb-8">
              {numbers.map((num, i) => {
                const isSelected = selected === i;
                const isCorrectPos = num === i + 1 && solved;
                return (
                  <button
                    key={i}
                    onClick={() => handleTap(i)}
                    disabled={solved}
                    className={`
                      w-16 h-16 md:w-20 md:h-20 rounded-xl text-2xl md:text-3xl font-bold transition-all duration-200 border-2
                      ${isCorrectPos
                        ? "bg-green-600 border-green-400 scale-105"
                        : isSelected
                          ? "bg-indigo-600 border-indigo-400 scale-110 shadow-lg shadow-indigo-500/50"
                          : "bg-gray-800 border-gray-600 hover:bg-gray-700 hover:border-gray-500"
                      }
                      ${solved ? "cursor-default" : "cursor-pointer"}
                    `}
                  >
                    {num}
                  </button>
                );
              })}
            </div>

            {/* Feedback */}
            {feedback && (
              <div className={`p-4 rounded-lg text-center font-semibold text-lg mb-4 ${
                solved ? "bg-green-900/50 border border-green-500 text-green-200" : ""
              }`}>
                {feedback}
              </div>
            )}

            <button
              onClick={newRound}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold transition-colors"
            >
              {solved ? "Next Round" : "New Shuffle"}
            </button>
          </div>

          {/* How to Play */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mt-6">
            <h3 className="text-2xl font-semibold mb-4">How to Play</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Tap two numbers to swap their positions</li>
              <li>• Sort all numbers in ascending order (1, 2, 3...)</li>
              <li>• Fewer swaps = more points!</li>
              <li>• Hit the target swap count for full point value</li>
              <li>• Try harder difficulties for more points per round</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
