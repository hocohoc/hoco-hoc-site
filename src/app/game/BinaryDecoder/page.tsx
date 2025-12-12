"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useProfile } from "@/app/components/auth-provider/authProvider";
import { checkBinaryAnswer, getRandomChallenge, getGameStats, type BinaryChallenge } from "@/app/services/gameService";
import { getUserData } from "@/app/services/userService";

export default function BinaryDecoderPage() {
    const profile = useProfile();
    const user = profile;
    const [challenge, setChallenge] = useState<BinaryChallenge | null>(null);
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

    useEffect(() => {
        loadNewChallenge();
        loadStats();
        loadUserPoints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, difficulty]);

    async function loadNewChallenge() {
        setLoading(true);
        const newChallenge = await getRandomChallenge(user?.uid || "anonymous", difficulty);
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
        const result = await checkBinaryAnswer(user?.uid || "anonymous", challenge.id, userAnswer);

        if (result.correct) {
            const pointsMsg = user 
                ? `Correct! You earned ${result.pointsEarned} points!`
                : `Correct! (Sign in to earn ${challenge.points} points)`;
            setFeedback({
                show: true,
                correct: true,
                message: pointsMsg
            });
            // Reload stats and get new challenge after a delay
            setTimeout(() => {
                loadStats();
                loadUserPoints();
                loadNewChallenge();
            }, 2000);
        } else {
            setFeedback({
                show: true,
                correct: false,
                message: "Incorrect. Moving to next question..."
            });
            // Move to next question after brief delay
            setTimeout(() => {
                loadNewChallenge();
            }, 1500);
        }
        setLoading(false);
    }

    function getDifficultyColor(difficulty: string) {
        switch (difficulty) {
            case "easy": return "text-green-400";
            case "medium": return "text-yellow-400";
            case "hard": return "text-red-400";
            default: return "text-gray-400";
        }
    }

    return (
        <main className="min-h-screen bg-gradient-to-b from-blue-950 via-gray-900 to-black text-white relative">
            <div className="absolute top-6 left-6">
                <Link
                    href="/game"
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium shadow-md transition"
                >
                    ← Back to Games
                </Link>
            </div>
            <div className="pt-20 pb-10 px-6">
                <div className="w-full">
                    {/* Header with Stats */}
                    <div className="bg-gray-900 border border-gray-700 rounded-lg p-8 mb-6">
                        <h1 className="text-5xl font-bold mb-3 text-white">Binary Decoder</h1>
                        <p className="text-gray-400 text-lg mb-6">Convert binary to decimal numbers{user ? " to earn points" : " (sign in to earn points)"}!</p>
                        {user && (
                            <div className="flex gap-4 text-base">
                                <div className="bg-gray-800 border border-gray-600 px-5 py-3 rounded">
                                    <span className="text-gray-400">Points: </span>
                                    <span className="text-yellow-400 font-bold">{userPoints}</span>
                                </div>
                                <div className="bg-gray-800 border border-gray-600 px-5 py-3 rounded">
                                    <span className="text-gray-400">Completed: </span>
                                    <span className="text-green-400 font-bold">{stats.challengesCompleted}</span>
                                </div>
                            </div>
                        )}
                    </div>

            {/* Difficulty Selector */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-semibold mb-4">Difficulty</h2>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => handleDifficultyChange("all")}
                        className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                            difficulty === "all"
                                ? "bg-indigo-600 text-white"
                                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                    >
                        All Levels
                    </button>
                    <button
                        onClick={() => handleDifficultyChange("easy")}
                        className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                            difficulty === "easy"
                                ? "bg-green-600 text-white"
                                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                    >
                        Easy (2-3 pts)
                    </button>
                    <button
                        onClick={() => handleDifficultyChange("medium")}
                        className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                            difficulty === "medium"
                                ? "bg-yellow-600 text-white"
                                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                    >
                        Medium (4-5 pts)
                    </button>
                    <button
                        onClick={() => handleDifficultyChange("hard")}
                        className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                            difficulty === "hard"
                                ? "bg-red-600 text-white"
                                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                    >
                        Hard (6-7 pts)
                    </button>
                </div>
            </div>

            {/* Tutorial Section */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-semibold mb-5">Binary to Decimal Conversion</h2>
                <div className="space-y-4 text-gray-200">
                    <p className="text-sm">Convert binary numbers (0s and 1s) to decimal numbers. Each position has a value based on powers of 2.</p>
                    
                    {/* Conversion Guide */}
                    <div className="bg-gray-800 border border-gray-600 p-5 rounded">
                        <h3 className="font-semibold text-xl text-cyan-400 mb-4">Position Values</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-center font-mono">
                                <thead>
                                    <tr className="text-yellow-300 text-3xl font-bold">
                                        <td>128</td>
                                        <td>64</td>
                                        <td>32</td>
                                        <td>16</td>
                                        <td>8</td>
                                        <td>4</td>
                                        <td>2</td>
                                        <td>1</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="text-gray-300 text-xl">
                                        <td>2⁷</td>
                                        <td>2⁶</td>
                                        <td>2⁵</td>
                                        <td>2⁴</td>
                                        <td>2³</td>
                                        <td>2²</td>
                                        <td>2¹</td>
                                        <td>2⁰</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Example */}
                    <div className="bg-gray-800 border border-gray-600 p-5 rounded">
                        <h3 className="font-semibold text-xl text-cyan-400 mb-4">Example: 01001010 = 74</h3>
                        <div className="space-y-2 font-mono text-xl">
                            <div className="grid grid-cols-8 gap-2 text-center">
                                <div>0</div>
                                <div>1</div>
                                <div>0</div>
                                <div>0</div>
                                <div>1</div>
                                <div>0</div>
                                <div>1</div>
                                <div>0</div>
                            </div>
                            <div className="grid grid-cols-8 gap-2 text-center text-yellow-300">
                                <div>×128</div>
                                <div>×64</div>
                                <div>×32</div>
                                <div>×16</div>
                                <div>×8</div>
                                <div>×4</div>
                                <div>×2</div>
                                <div>×1</div>
                            </div>
                            <div className="grid grid-cols-8 gap-2 text-center text-green-300">
                                <div>0</div>
                                <div className="font-bold">64</div>
                                <div>0</div>
                                <div>0</div>
                                <div className="font-bold">8</div>
                                <div>0</div>
                                <div className="font-bold">2</div>
                                <div>0</div>
                            </div>
                            <p className="text-center mt-3 text-2xl">64 + 8 + 2 = <span className="text-yellow-300 font-bold">74</span></p>
                        </div>
                    </div>

                    {/* Quick Reference */}
                    <div className="bg-gray-800 border border-gray-600 p-5 rounded">
                        <h3 className="font-semibold text-xl text-cyan-400 mb-4">Quick Reference</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-base font-mono">
                            <div className="bg-gray-800 p-2 rounded">00000001 = <span className="text-yellow-300">1</span></div>
                            <div className="bg-gray-800 p-2 rounded">00000010 = <span className="text-yellow-300">2</span></div>
                            <div className="bg-gray-800 p-2 rounded">00001010 = <span className="text-yellow-300">10</span></div>
                            <div className="bg-gray-800 p-2 rounded">00010100 = <span className="text-yellow-300">20</span></div>
                            <div className="bg-gray-800 p-2 rounded">00110010 = <span className="text-yellow-300">50</span></div>
                            <div className="bg-gray-800 p-2 rounded">01100100 = <span className="text-yellow-300">100</span></div>
                            <div className="bg-gray-800 p-2 rounded">10000000 = <span className="text-yellow-300">128</span></div>
                            <div className="bg-gray-800 p-2 rounded">11111111 = <span className="text-yellow-300">255</span></div>
                        </div>
                    </div>

                    <div className="bg-blue-900 bg-opacity-30 border border-blue-600 p-4 rounded">
                        <p className="font-semibold text-blue-300">Tip:</p>
                        <p className="text-sm">Only add the position values where you see a 1. Positions with 0 contribute nothing to the total!</p>
                    </div>
                </div>
            </div>

            {/* Challenge Section */}
            {(loading && !challenge) ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
                    <p className="mt-4 text-gray-400">Loading challenge...</p>
                </div>
            ) : challenge ? (
                <div className="bg-gray-900 border border-gray-700 rounded-lg p-8">
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <span className={`text-sm font-semibold uppercase ${getDifficultyColor(challenge.difficulty)}`}>
                                {challenge.difficulty}
                            </span>
                            <span className="text-yellow-400 font-bold">{challenge.points} pts</span>
                        </div>
                        <div className="bg-black bg-opacity-50 p-6 rounded-lg font-mono text-4xl mb-6 overflow-x-auto text-center font-bold">
                            {challenge.binary}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <input
                            type="text"
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
                            placeholder="Enter decoded message..."
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-indigo-500 text-white placeholder-gray-500"
                            disabled={loading}
                        />

                        <button
                            onClick={handleSubmit}
                            disabled={loading || !userAnswer.trim()}
                            className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
                        >
                            {loading ? "Checking..." : "Submit Answer"}
                        </button>
                    </div>

                    {/* Feedback */}
                    {feedback.show && (
                        <div className={`mt-6 p-4 rounded-lg ${
                            feedback.correct 
                                ? "bg-green-900 bg-opacity-50 border border-green-500" 
                                : "bg-red-900 bg-opacity-50 border border-red-500"
                        }`}>
                            <p className="text-center font-semibold">{feedback.message}</p>
                        </div>
                    )}

                    {/* Hint Section */}
                    <div className="mt-6 p-4 bg-blue-900 bg-opacity-30 rounded-lg border border-blue-700">
                        <p className="text-sm text-gray-300">
                            <span className="font-semibold text-blue-400">Hint:</span> Each group of 8 binary digits represents one character. Convert each byte to its ASCII character.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="bg-gray-900 border border-gray-700 rounded-lg p-12 text-center">
                    <h2 className="text-3xl font-bold mb-4">Congratulations!</h2>
                    <p className="text-xl text-gray-300 mb-2">You&apos;ve completed all binary challenges!</p>
                    <p className="text-gray-400">Check back later for more challenges.</p>
                    <div className="mt-6 p-4 bg-yellow-900 bg-opacity-30 rounded-lg inline-block">
                        <p className="text-yellow-400 font-bold text-2xl">{stats.totalPoints} Total Points</p>
                    </div>
                </div>
            )}

            {/* How to Play */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                <h3 className="text-2xl font-semibold mb-4">How to Play</h3>
                <ul className="space-y-2 text-gray-300">
                    <li>• Each challenge shows a binary message (groups of 0s and 1s)</li>
                    <li>• Convert each 8-digit binary number to its ASCII character</li>
                    <li>• Type the decoded message and submit your answer</li>
                    <li>• Earn points for each correct answer!</li>
                    <li>• Difficulty levels: <span className="text-green-400">Easy</span>, <span className="text-yellow-400">Medium</span>, <span className="text-red-400">Hard</span></li>
                </ul>
            </div>
                </div>
            </div>
        </main>
    );
}
