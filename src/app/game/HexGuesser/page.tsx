"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useProfile } from "@/app/components/auth-provider/authProvider";
import { awardGamePoints, getUserGameData } from "@/app/services/gameService";
import { getUserData } from "@/app/services/userService";

interface ColorQuestion {
  id: string;
  hex: string;
  points: number;
  difficulty: "easy" | "medium" | "hard";
}

function randomHexChannel(): number {
  return Math.floor(Math.random() * 256);
}

function componentToHex(c: number): string {
  return c.toString(16).padStart(2, "0").toUpperCase();
}

function generateColor(difficulty: "easy" | "medium" | "hard"): string {
  if (difficulty === "easy") {
    // Pure or simple colors
    const simple = [
      "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF",
      "#FFFFFF", "#000000", "#FF8000", "#8000FF", "#008080", "#800000",
      "#808080", "#C0C0C0", "#800080", "#008000",
    ];
    return simple[Math.floor(Math.random() * simple.length)];
  }
  if (difficulty === "medium") {
    // Snap to nearest 0x33 increments (web-safe)
    const snap = (v: number) => Math.round(v / 0x33) * 0x33;
    return `#${componentToHex(snap(randomHexChannel()))}${componentToHex(snap(randomHexChannel()))}${componentToHex(snap(randomHexChannel()))}`;
  }
  // Hard: completely random
  return `#${componentToHex(randomHexChannel())}${componentToHex(randomHexChannel())}${componentToHex(randomHexChannel())}`;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function colorDistance(a: string, b: string): number {
  const [r1, g1, b1] = hexToRgb(a);
  const [r2, g2, b2] = hexToRgb(b);
  return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
}

function generateDecoys(correct: string, count: number): string[] {
  const decoys: string[] = [];
  const [r, g, b] = hexToRgb(correct);
  while (decoys.length < count) {
    const offset = () => Math.max(0, Math.min(255, Math.floor(r + (Math.random() - 0.5) * 180)));
    const candidate = `#${componentToHex(Math.max(0, Math.min(255, r + Math.floor((Math.random() - 0.5) * 180))))}${componentToHex(Math.max(0, Math.min(255, g + Math.floor((Math.random() - 0.5) * 180))))}${componentToHex(Math.max(0, Math.min(255, b + Math.floor((Math.random() - 0.5) * 180))))}`;
    if (colorDistance(candidate, correct) > 40 && !decoys.includes(candidate) && candidate !== correct) {
      decoys.push(candidate);
    }
  }
  return decoys;
}

const POINTS: Record<string, number> = { easy: 2, medium: 4, hard: 7 };

export default function HexGuesserPage() {
  const profile = useProfile();
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [mode, setMode] = useState<"hex-to-color" | "color-to-hex">("hex-to-color");
  const [correctHex, setCorrectHex] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [answered, setAnswered] = useState(false);
  const [chosenAnswer, setChosenAnswer] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [userPoints, setUserPoints] = useState(0);
  const [roundNum, setRoundNum] = useState(0);
  const [completedRounds, setCompletedRounds] = useState<Set<string>>(new Set());

  const newRound = useCallback(() => {
    const hex = generateColor(difficulty);
    setCorrectHex(hex);
    const decoys = generateDecoys(hex, mode === "hex-to-color" ? 3 : 3);
    const allOptions = [hex, ...decoys].sort(() => Math.random() - 0.5);
    setOptions(allOptions);
    setAnswered(false);
    setChosenAnswer(null);
    setRoundNum((r) => r + 1);
  }, [difficulty, mode]);

  useEffect(() => {
    newRound();
  }, [difficulty, mode, newRound]);

  useEffect(() => {
    loadUserPoints();
    loadCompletedRounds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  async function loadUserPoints() {
    if (!profile) { setUserPoints(0); return; }
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

  async function handleAnswer(choice: string) {
    if (answered) return;
    setAnswered(true);
    setChosenAnswer(choice);
    const correct = choice === correctHex;
    const gameId = `hex-guess-${difficulty}-${roundNum}`;
    const pts = POINTS[difficulty];

    if (correct) {
      setStreak((s) => s + 1);
      if (profile && !completedRounds.has(gameId)) {
        try {
          await awardGamePoints(profile.uid, gameId, "hex-guesser", 1, pts);
          setTotalPoints((p) => p + pts);
          setUserPoints((p) => p + pts);
          setCompletedRounds((prev) => new Set(prev).add(gameId));
        } catch { /* silent */ }
      }
    } else {
      setStreak(0);
    }

    setTimeout(() => newRound(), correct ? 1200 : 2000);
  }

  const diffColors: Record<string, string> = {
    easy: "bg-green-600",
    medium: "bg-yellow-600",
    hard: "bg-red-600",
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-gray-900 to-black text-white relative">
      <div className="absolute top-6 left-6">
        <Link href="/game" className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium shadow-md transition">
          ← Back to Games
        </Link>
      </div>
      <div className="pt-20 pb-10 px-6 flex flex-col items-center">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-8 mb-6">
            <h1 className="text-5xl font-bold mb-3">Hex Guesser</h1>
            <p className="text-gray-400 text-lg">
              Test your knowledge of hex color codes{profile ? " and earn points" : " (sign in to earn points)"}!
            </p>
            <div className="flex gap-4 text-base mt-4 flex-wrap">
              {profile && (
                <div className="bg-gray-800 border border-gray-600 px-5 py-3 rounded">
                  <span className="text-gray-400">Points: </span>
                  <span className="text-yellow-400 font-bold">{userPoints}</span>
                </div>
              )}
              <div className="bg-gray-800 border border-gray-600 px-5 py-3 rounded">
                <span className="text-gray-400">Streak: </span>
                <span className="text-orange-400 font-bold">{streak} 🔥</span>
              </div>
              {profile && (
                <div className="bg-gray-800 border border-gray-600 px-5 py-3 rounded">
                  <span className="text-gray-400">Session: </span>
                  <span className="text-green-400 font-bold">+{totalPoints}</span>
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-3 mb-6">
            {(["easy", "medium", "hard"] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`px-5 py-2 rounded-lg font-semibold transition-colors ${
                  difficulty === d ? diffColors[d] + " text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {d.charAt(0).toUpperCase() + d.slice(1)} ({POINTS[d]} pts)
              </button>
            ))}
            <div className="ml-auto">
              <button
                onClick={() => setMode(mode === "hex-to-color" ? "color-to-hex" : "hex-to-color")}
                className="px-5 py-2 rounded-lg font-semibold bg-purple-700 hover:bg-purple-600 transition-colors"
              >
                Mode: {mode === "hex-to-color" ? "Hex → Color" : "Color → Hex"}
              </button>
            </div>
          </div>

          {/* Game Area */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-8">
            {mode === "hex-to-color" ? (
              <>
                {/* Show hex, pick the color */}
                <h2 className="text-center text-3xl font-mono font-bold mb-6">{correctHex}</h2>
                <p className="text-center text-gray-400 mb-6">Which color does this hex code represent?</p>
                <div className="grid grid-cols-2 gap-4">
                  {options.map((hex) => {
                    const isCorrect = hex === correctHex;
                    const isChosen = hex === chosenAnswer;
                    let borderClass = "border-gray-600 hover:border-gray-400";
                    if (answered) {
                      if (isCorrect) borderClass = "border-green-400 ring-2 ring-green-400";
                      else if (isChosen) borderClass = "border-red-400 ring-2 ring-red-400";
                    }
                    return (
                      <button
                        key={hex}
                        onClick={() => handleAnswer(hex)}
                        disabled={answered}
                        className={`h-24 md:h-32 rounded-xl border-2 transition-all ${borderClass} ${answered ? "cursor-default" : "cursor-pointer hover:scale-105"}`}
                        style={{ backgroundColor: hex }}
                        aria-label={`Color option ${hex}`}
                      />
                    );
                  })}
                </div>
              </>
            ) : (
              <>
                {/* Show color, pick the hex */}
                <div
                  className="w-full h-32 md:h-40 rounded-xl mb-6 border-2 border-gray-600"
                  style={{ backgroundColor: correctHex }}
                />
                <p className="text-center text-gray-400 mb-6">What hex code produces this color?</p>
                <div className="grid grid-cols-2 gap-4">
                  {options.map((hex) => {
                    const isCorrect = hex === correctHex;
                    const isChosen = hex === chosenAnswer;
                    let bg = "bg-gray-800 hover:bg-gray-700";
                    if (answered) {
                      if (isCorrect) bg = "bg-green-900 ring-2 ring-green-400";
                      else if (isChosen) bg = "bg-red-900 ring-2 ring-red-400";
                    }
                    return (
                      <button
                        key={hex}
                        onClick={() => handleAnswer(hex)}
                        disabled={answered}
                        className={`p-4 rounded-xl border border-gray-600 font-mono text-lg font-bold transition-all ${bg} ${answered ? "cursor-default" : "cursor-pointer hover:scale-105"}`}
                      >
                        {hex}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* Feedback */}
            {answered && (
              <div className={`mt-6 p-4 rounded-lg text-center font-semibold ${
                chosenAnswer === correctHex
                  ? "bg-green-900/50 border border-green-500 text-green-200"
                  : "bg-red-900/50 border border-red-500 text-red-200"
              }`}>
                {chosenAnswer === correctHex
                  ? `Correct! +${POINTS[difficulty]} points`
                  : `Wrong! The answer was ${correctHex}`}
              </div>
            )}
          </div>

          {/* How to Play */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mt-6">
            <h3 className="text-2xl font-semibold mb-4">How Hex Colors Work</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Hex color codes use <span className="font-mono text-purple-300">#RRGGBB</span> format</li>
              <li>• Each pair (RR, GG, BB) ranges from <span className="font-mono">00</span> to <span className="font-mono">FF</span> (0-255)</li>
              <li>• <span className="font-mono text-red-400">#FF0000</span> = Red, <span className="font-mono text-green-400">#00FF00</span> = Green, <span className="font-mono text-blue-400">#0000FF</span> = Blue</li>
              <li>• <span className="font-mono">#000000</span> = Black, <span className="font-mono text-white">#FFFFFF</span> = White</li>
              <li>• Build a streak for bragging rights!</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
