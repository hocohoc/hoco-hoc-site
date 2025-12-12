"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useProfile } from "@/app/components/auth-provider/authProvider";
import { checkCodingAnswer, generateAICodingChallenge, getGameStats, type CodingChallenge } from "@/app/services/gameService";
import { getUserData } from "@/app/services/userService";

export default function MindstormPage() {
    const profile = useProfile();
    const user = profile;
    const [challenge, setChallenge] = useState<CodingChallenge | null>(null);
    const [userAnswer, setUserAnswer] = useState("");
    const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | "all">("all");
    const [feedback, setFeedback] = useState<{
        show: boolean;
        correct: boolean;
        message: string;
    }>({ show: false, correct: false, message: "" });
    const [stats, setStats] = useState({ totalPoints: 0, challengesCompleted: 0 });
    const [loading, setLoading] = useState(false);
    const [userPoints, setUserPoints] = useState(0);
    const [userLanguage, setUserLanguage] = useState<"python" | "cpp" | "java">("python");

    useEffect(() => {
        loadUserLanguage();
    }, [user]);

    useEffect(() => {
        if (userLanguage) {
            loadNewChallenge();
            loadStats();
            loadUserPoints();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, difficulty, userLanguage]);

    async function loadUserLanguage() {
        if (!user) {
            setUserLanguage("python"); // Default for anonymous
            return;
        }
        const userData = await getUserData(user.uid);
        const lang = userData?.preferredLanguage || "python";
        setUserLanguage(lang);
    }

    async function loadNewChallenge() {
        setLoading(true);
        const selectedDifficulty = difficulty === "all" 
            ? (["easy", "medium", "hard"][Math.floor(Math.random() * 3)] as "easy" | "medium" | "hard")
            : difficulty;
        
        const newChallenge = await generateAICodingChallenge(userLanguage, selectedDifficulty);
        setChallenge(newChallenge);
        setUserAnswer("");
        setFeedback({ show: false, correct: false, message: "" });
        setLoading(false);
    }

    function handleDifficultyChange(newDifficulty: "easy" | "medium" | "hard" | "all") {
        setDifficulty(newDifficulty);
        setFeedback({ show: false, correct: false, message: "" });
    }

    async function loadStats() {
        if (!user) {
            setStats({ totalPoints: 0, challengesCompleted: 0 });
            return;
        }
        const gameStats = await getGameStats(user.uid);
        setStats({
            totalPoints: gameStats.totalPoints,
            challengesCompleted: gameStats.gamesCompleted
        });
    }

    async function loadUserPoints() {
        if (!user) {
            setUserPoints(0);
            return;
        }
        const userData = await getUserData(user.uid);
        const gamePoints = userData?.scores?.["games"] || 0;
        setUserPoints(gamePoints);
    }

    async function handleSubmit() {
        if (!challenge || !userAnswer.trim()) return;

        setLoading(true);
        const result = await checkCodingAnswer(user?.uid || "anonymous", challenge.id, userAnswer.trim());

        if (result.correct) {
            const pointsMsg = user 
                ? `Correct! You earned ${result.pointsEarned} points!`
                : `Correct! (Sign in to earn ${challenge.points} points)`;
            setFeedback({
                show: true,
                correct: true,
                message: pointsMsg
            });
            await loadStats();
            await loadUserPoints();
            setTimeout(() => {
                loadNewChallenge();
            }, 2000);
        } else {
            setFeedback({
                show: true,
                correct: false,
                message: `Incorrect. The output is "${challenge.output}". Try again!`
            });
        }
        setLoading(false);
    }

    const difficultyColors = {
        easy: "bg-green-500 hover:bg-green-600",
        medium: "bg-yellow-500 hover:bg-yellow-600",
        hard: "bg-red-500 hover:bg-red-600",
        all: "bg-blue-500 hover:bg-blue-600"
    };

    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col items-center py-12 px-4">
            {/* Header */}
            <div className="w-full max-w-5xl mb-8">
                <Link href="/game" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">
                    ← Back to Games
                </Link>
                <div className="flex justify-between items-center">
                    <h1 className="text-5xl font-bold">Mindstorm</h1>
                    <div className="flex items-center gap-4">
                        {user && (
                            <>
                                <div className="text-right">
                                    <p className="text-gray-400 text-sm">Language</p>
                                    <p className="text-xl font-bold text-blue-400 uppercase">{userLanguage}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-gray-400 text-sm">Your Total Game Points</p>
                                    <p className="text-3xl font-bold text-yellow-400">{userPoints}</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <p className="text-gray-300 mt-2">Predict what the code will output!</p>
            </div>

            {/* Main Content */}
            <div className="w-full max-w-5xl">
                {/* Difficulty Selector */}
                <div className="flex gap-4 mb-6 flex-wrap">
                    {(["easy", "medium", "hard", "all"] as const).map((diff) => (
                        <button
                            key={diff}
                            onClick={() => handleDifficultyChange(diff)}
                            disabled={loading}
                            className={`px-6 py-3 rounded-lg font-bold transition ${
                                difficulty === diff
                                    ? difficultyColors[diff]
                                    : "bg-gray-700 hover:bg-gray-600"
                            } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            {diff.toUpperCase()}
                        </button>
                    ))}
                    {challenge && (
                        <div className="ml-auto flex items-center gap-2 px-4 py-3 bg-gray-800 rounded-lg">
                            <span className="text-xl font-bold text-yellow-400">{challenge.points} pts</span>
                        </div>
                    )}
                </div>

                {/* Challenge Display */}
                {challenge && (
                    <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold mb-4 text-blue-300">What will this code output?</h2>
                            
                            {/* Code Block */}
                            <div className="bg-gray-900 rounded-lg p-6 font-mono text-sm overflow-x-auto">
                                <pre className="text-green-400">{challenge.code}</pre>
                            </div>
                        </div>

                        {/* Answer Input */}
                        <div className="mb-6">
                            <label className="block text-lg mb-2 text-gray-300">
                                Enter the output:
                            </label>
                            <input
                                type="text"
                                value={userAnswer}
                                onChange={(e) => setUserAnswer(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !loading) {
                                        handleSubmit();
                                    }
                                }}
                                placeholder="Type the exact output..."
                                disabled={loading}
                                className="w-full px-5 py-4 bg-gray-700 border-2 border-gray-600 rounded-lg text-white text-lg focus:border-blue-500 focus:outline-none disabled:opacity-50"
                            />
                            <p className="text-sm text-gray-400 mt-2">
                                Tip: Type exactly what you see, including spaces and punctuation
                            </p>
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            disabled={loading || !userAnswer.trim()}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-bold text-lg transition"
                        >
                            {loading ? "Checking..." : "Check Answer"}
                        </button>

                        {/* Feedback */}
                        {feedback.show && (
                            <div
                                className={`mt-6 p-5 rounded-lg ${
                                    feedback.correct
                                        ? "bg-green-900 border-2 border-green-500"
                                        : "bg-red-900 border-2 border-red-500"
                                }`}
                            >
                                <p className="text-xl font-bold">{feedback.message}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Stats */}
                {user && (
                    <div className="mt-8 grid grid-cols-2 gap-4">
                        <div className="bg-gray-800 rounded-lg p-6 text-center">
                            <p className="text-gray-400 text-sm mb-1">Challenges Completed</p>
                            <p className="text-4xl font-bold text-blue-400">{stats.challengesCompleted}</p>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-6 text-center">
                            <p className="text-gray-400 text-sm mb-1">Points Earned (This Game)</p>
                            <p className="text-4xl font-bold text-yellow-400">{stats.totalPoints}</p>
                        </div>
                    </div>
                )}

                {/* Tutorial Section */}
                {!user && (
                    <div className="mt-8 bg-blue-900 bg-opacity-30 border border-blue-500 rounded-lg p-6">
                        <p className="text-blue-300 text-center">
                            Sign in to save your progress and earn points!
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}
