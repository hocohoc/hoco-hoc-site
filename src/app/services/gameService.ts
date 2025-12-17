import { doc, getDoc, increment, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";

export type GameType = "binary-decoder" | "purrceptron" | "flexibot" | "mindstorm";

export type GameCompletion = {
    gameId: string;
    completedAt: Date;
    score: number;
    pointsEarned: number;
};

// Track completed games per user
export type UserGameData = {
    completedGames: {
        [gameId: string]: GameCompletion;
    };
    totalGamePoints: number;
};

// Binary decoder challenges
export type BinaryChallenge = {
    id: string;
    binary: string;
    answer: string;
    points: number;
    difficulty: "easy" | "medium" | "hard";
};

// Coding challenges (predict output)
export type CodingChallenge = {
    id: string;
    code: string;
    output: string;
    points: number;
    difficulty: "easy" | "medium" | "hard";
    language?: "python" | "cpp" | "java" | "blockly" | "scratch";
    isAI?: boolean;
};

// Pre-defined binary challenges (converted to decimal)
const BINARY_CHALLENGES: BinaryChallenge[] = [
    { id: "bin-1", binary: "00001010", answer: "10", points: 2, difficulty: "easy" },
    { id: "bin-2", binary: "00001111", answer: "15", points: 2, difficulty: "easy" },
    { id: "bin-3", binary: "00011001", answer: "25", points: 3, difficulty: "easy" },
    { id: "bin-4", binary: "00100000", answer: "32", points: 3, difficulty: "easy" },
    { id: "bin-5", binary: "01001100", answer: "76", points: 4, difficulty: "medium" },
    { id: "bin-6", binary: "01100100", answer: "100", points: 4, difficulty: "medium" },
    { id: "bin-7", binary: "01111111", answer: "127", points: 5, difficulty: "medium" },
    { id: "bin-8", binary: "10000000", answer: "128", points: 6, difficulty: "hard" },
    { id: "bin-9", binary: "11111111", answer: "255", points: 6, difficulty: "hard" },
    { id: "bin-10", binary: "10101010", answer: "170", points: 7, difficulty: "hard" },
];

// Pre-defined coding challenges (Python-style)
const CODING_CHALLENGES: CodingChallenge[] = [
    // EASY - Basic Operations (3 points)
    { id: "code-1", code: 'print(5 + 3)', output: "8", points: 3, difficulty: "easy" },
    { id: "code-2", code: 'print("Hello" + " " + "World")', output: "Hello World", points: 3, difficulty: "easy" },
    { id: "code-3", code: 'x = 10\nprint(x * 2)', output: "20", points: 3, difficulty: "easy" },
    { id: "code-4", code: 'print(len("Python"))', output: "6", points: 3, difficulty: "easy" },
    { id: "code-5", code: 'nums = [1, 2, 3]\nprint(sum(nums))', output: "6", points: 3, difficulty: "easy" },
    { id: "code-6", code: 'print(10 - 7)', output: "3", points: 3, difficulty: "easy" },
    { id: "code-7", code: 'print(4 * 5)', output: "20", points: 3, difficulty: "easy" },
    { id: "code-8", code: 'print(20 / 4)', output: "5.0", points: 3, difficulty: "easy" },
    { id: "code-9", code: 'print(20 // 3)', output: "6", points: 3, difficulty: "easy" },
    { id: "code-10", code: 'print("Hi" * 3)', output: "HiHiHi", points: 3, difficulty: "easy" },
    { id: "code-11", code: 'x = 7\ny = 3\nprint(x + y)', output: "10", points: 3, difficulty: "easy" },
    { id: "code-12", code: 'text = "code"\nprint(len(text))', output: "4", points: 3, difficulty: "easy" },
    { id: "code-13", code: 'nums = [5, 10, 15]\nprint(len(nums))', output: "3", points: 3, difficulty: "easy" },
    { id: "code-14", code: 'print(abs(-42))', output: "42", points: 3, difficulty: "easy" },
    { id: "code-15", code: 'print(min(5, 3, 9))', output: "3", points: 3, difficulty: "easy" },
    { id: "code-16", code: 'print(max(5, 3, 9))', output: "9", points: 3, difficulty: "easy" },
    { id: "code-17", code: 'print(2 + 3 * 4)', output: "14", points: 3, difficulty: "easy" },
    { id: "code-18", code: 'print((2 + 3) * 4)', output: "20", points: 3, difficulty: "easy" },
    { id: "code-19", code: 'x = "hello"\nprint(x[0])', output: "h", points: 3, difficulty: "easy" },
    { id: "code-20", code: 'nums = [10, 20, 30]\nprint(nums[0])', output: "10", points: 3, difficulty: "easy" },
    { id: "code-21", code: 'print(3 > 2)', output: "True", points: 3, difficulty: "easy" },
    { id: "code-22", code: 'print(5 == 5)', output: "True", points: 3, difficulty: "easy" },
    { id: "code-23", code: 'print(7 < 4)', output: "False", points: 3, difficulty: "easy" },
    { id: "code-24", code: 'print(True and False)', output: "False", points: 3, difficulty: "easy" },
    { id: "code-25", code: 'print(True or False)', output: "True", points: 3, difficulty: "easy" },
    { id: "code-26", code: 'print(not True)', output: "False", points: 3, difficulty: "easy" },
    { id: "code-27", code: 'text = "HELLO"\nprint(text.lower())', output: "hello", points: 3, difficulty: "easy" },
    { id: "code-28", code: 'nums = [1, 2, 3, 4]\nprint(nums[-1])', output: "4", points: 3, difficulty: "easy" },
    { id: "code-29", code: 'print(round(3.7))', output: "4", points: 3, difficulty: "easy" },
    { id: "code-30", code: 'print(round(3.2))', output: "3", points: 3, difficulty: "easy" },
    
    // MEDIUM - Intermediate Operations (5 points)
    { id: "code-31", code: 'x = 5\ny = 3\nprint(x ** y)', output: "125", points: 5, difficulty: "medium" },
    { id: "code-32", code: 'text = "code"\nprint(text.upper())', output: "CODE", points: 5, difficulty: "medium" },
    { id: "code-33", code: 'nums = [1, 2, 3, 4, 5]\nprint(nums[2])', output: "3", points: 5, difficulty: "medium" },
    { id: "code-34", code: 'x = 10\nif x > 5:\n    print("big")\nelse:\n    print("small")', output: "big", points: 5, difficulty: "medium" },
    { id: "code-35", code: 'nums = [10, 20, 30]\nprint(max(nums))', output: "30", points: 5, difficulty: "medium" },
    { id: "code-36", code: 'nums = [10, 20, 30]\nprint(min(nums))', output: "10", points: 5, difficulty: "medium" },
    { id: "code-37", code: 'text = "hello world"\nprint(text.split()[0])', output: "hello", points: 5, difficulty: "medium" },
    { id: "code-38", code: 'nums = [1, 2, 3]\nnums.append(4)\nprint(nums)', output: "[1, 2, 3, 4]", points: 5, difficulty: "medium" },
    { id: "code-39", code: 'text = "python"\nprint(text[:3])', output: "pyt", points: 5, difficulty: "medium" },
    { id: "code-40", code: 'text = "python"\nprint(text[2:])', output: "thon", points: 5, difficulty: "medium" },
    { id: "code-41", code: 'nums = [1, 2, 3, 2, 1]\nprint(nums.count(2))', output: "2", points: 5, difficulty: "medium" },
    { id: "code-42", code: 'text = "banana"\nprint(text.count("a"))', output: "3", points: 5, difficulty: "medium" },
    { id: "code-43", code: 'x = 7\nif x % 2 == 0:\n    print("even")\nelse:\n    print("odd")', output: "odd", points: 5, difficulty: "medium" },
    { id: "code-44", code: 'nums = [5, 2, 8, 1]\nprint(sorted(nums))', output: "[1, 2, 5, 8]", points: 5, difficulty: "medium" },
    { id: "code-45", code: 'text = "abc"\nprint(text * 2)', output: "abcabc", points: 5, difficulty: "medium" },
    { id: "code-46", code: 'x = 15\nprint(x % 4)', output: "3", points: 5, difficulty: "medium" },
    { id: "code-47", code: 'nums = [1, 2, 3]\nprint(nums[::-1])', output: "[3, 2, 1]", points: 5, difficulty: "medium" },
    { id: "code-48", code: 'text = "hello"\nprint(text[::-1])', output: "olleh", points: 5, difficulty: "medium" },
    { id: "code-49", code: 'x = [1, 2]\ny = [3, 4]\nprint(x + y)', output: "[1, 2, 3, 4]", points: 5, difficulty: "medium" },
    { id: "code-50", code: 'nums = list(range(5))\nprint(nums)', output: "[0, 1, 2, 3, 4]", points: 5, difficulty: "medium" },
    { id: "code-51", code: 'text = "  hello  "\nprint(text.strip())', output: "hello", points: 5, difficulty: "medium" },
    { id: "code-52", code: 'words = ["a", "b", "c"]\nprint("-".join(words))', output: "a-b-c", points: 5, difficulty: "medium" },
    { id: "code-53", code: 'nums = [1, 2, 3, 4]\nprint(sum(nums) / len(nums))', output: "2.5", points: 5, difficulty: "medium" },
    { id: "code-54", code: 'x = 5\ny = 2\nprint(x / y)', output: "2.5", points: 5, difficulty: "medium" },
    { id: "code-55", code: 'text = "Python3"\nprint(text.replace("3", ""))', output: "Python", points: 5, difficulty: "medium" },
    { id: "code-56", code: 'nums = [10, 20, 30, 40]\nprint(nums[1:3])', output: "[20, 30]", points: 5, difficulty: "medium" },
    { id: "code-57", code: 'x = 3\nresult = "yes" if x > 2 else "no"\nprint(result)', output: "yes", points: 5, difficulty: "medium" },
    { id: "code-58", code: 'nums = [1, 2, 3]\nprint(2 in nums)', output: "True", points: 5, difficulty: "medium" },
    { id: "code-59", code: 'text = "hello"\nprint("z" in text)', output: "False", points: 5, difficulty: "medium" },
    { id: "code-60", code: 'nums = [5, 5, 5]\nprint(len(set(nums)))', output: "1", points: 5, difficulty: "medium" },
    
    // HARD - Advanced Operations (8 points)
    { id: "code-61", code: 'result = [x * 2 for x in range(3)]\nprint(result)', output: "[0, 2, 4]", points: 8, difficulty: "hard" },
    { id: "code-62", code: 'def add(a, b):\n    return a + b\nprint(add(7, 8))', output: "15", points: 8, difficulty: "hard" },
    { id: "code-63", code: 'for i in range(3):\n    print(i, end=" ")', output: "0 1 2 ", points: 8, difficulty: "hard" },
    { id: "code-64", code: 'text = "hello"\nprint(text[1:4])', output: "ell", points: 8, difficulty: "hard" },
    { id: "code-65", code: 'result = [x for x in range(5) if x % 2 == 0]\nprint(result)', output: "[0, 2, 4]", points: 8, difficulty: "hard" },
    { id: "code-66", code: 'nums = [1, 2, 3, 4]\nresult = [x ** 2 for x in nums]\nprint(result)', output: "[1, 4, 9, 16]", points: 8, difficulty: "hard" },
    { id: "code-67", code: 'def greet(name):\n    return f"Hi {name}"\nprint(greet("Bob"))', output: "Hi Bob", points: 8, difficulty: "hard" },
    { id: "code-68", code: 'nums = [[1, 2], [3, 4]]\nprint(nums[1][0])', output: "3", points: 8, difficulty: "hard" },
    { id: "code-69", code: 'text = "a,b,c"\nprint(text.split(","))', output: "['a', 'b', 'c']", points: 8, difficulty: "hard" },
    { id: "code-70", code: 'def factorial(n):\n    return 1 if n == 0 else n * factorial(n-1)\nprint(factorial(4))', output: "24", points: 8, difficulty: "hard" },
    { id: "code-71", code: 'nums = [1, 2, 3, 4, 5]\nprint([x for x in nums if x > 2])', output: "[3, 4, 5]", points: 8, difficulty: "hard" },
    { id: "code-72", code: 'result = sum([x ** 2 for x in range(4)])\nprint(result)', output: "14", points: 8, difficulty: "hard" },
    { id: "code-73", code: 'nums = [1, 2, 3]\nfor i, n in enumerate(nums):\n    print(f"{i}:{n}", end=" ")', output: "0:1 1:2 2:3 ", points: 8, difficulty: "hard" },
    { id: "code-74", code: 'def multiply(a, b=2):\n    return a * b\nprint(multiply(5))', output: "10", points: 8, difficulty: "hard" },
    { id: "code-75", code: 'nums = [3, 1, 4, 1, 5]\nprint(sorted(set(nums)))', output: "[1, 3, 4, 5]", points: 8, difficulty: "hard" },
    { id: "code-76", code: 'text = "aabbcc"\nprint("".join(sorted(text)))', output: "aabbcc", points: 8, difficulty: "hard" },
    { id: "code-77", code: 'words = ["hi", "bye"]\nprint([w.upper() for w in words])', output: "['HI', 'BYE']", points: 8, difficulty: "hard" },
    { id: "code-78", code: 'nums = [1, 2, 3]\nresult = list(map(lambda x: x * 2, nums))\nprint(result)', output: "[2, 4, 6]", points: 8, difficulty: "hard" },
    { id: "code-79", code: 'nums = [1, 2, 3, 4]\nresult = list(filter(lambda x: x % 2 == 0, nums))\nprint(result)', output: "[2, 4]", points: 8, difficulty: "hard" },
    { id: "code-80", code: 'data = {"a": 1, "b": 2}\nprint(data["a"])', output: "1", points: 8, difficulty: "hard" },
    { id: "code-81", code: 'data = {"x": 10, "y": 20}\nprint(list(data.keys()))', output: "['x', 'y']", points: 8, difficulty: "hard" },
    { id: "code-82", code: 'data = {"x": 10, "y": 20}\nprint(list(data.values()))', output: "[10, 20]", points: 8, difficulty: "hard" },
    { id: "code-83", code: 'text = "aabbbcc"\nfrom collections import Counter\nprint(Counter(text)["b"])', output: "3", points: 8, difficulty: "hard" },
    { id: "code-84", code: 'nums = [1, 2, 3, 4, 5]\nprint(nums[::2])', output: "[1, 3, 5]", points: 8, difficulty: "hard" },
    { id: "code-85", code: 'matrix = [[1, 2], [3, 4]]\nprint([row[0] for row in matrix])', output: "[1, 3]", points: 8, difficulty: "hard" },
    { id: "code-86", code: 'def power(x, n=2):\n    return x ** n\nprint(power(3, 3))', output: "27", points: 8, difficulty: "hard" },
    { id: "code-87", code: 'nums = [5, 3, 8, 1, 9]\nprint(nums[1:4])', output: "[2, 8, 1]", points: 8, difficulty: "hard" },
    { id: "code-88", code: 'text = "hello"\nresult = {c: text.count(c) for c in set(text)}\nprint(result["l"])', output: "2", points: 8, difficulty: "hard" },
    { id: "code-89", code: 'nums = [1, 2, 3]\nresult = sum(x ** 2 for x in nums)\nprint(result)', output: "14", points: 8, difficulty: "hard" },
    { id: "code-90", code: 'def check(x):\n    return x > 5\nprint(check(7))', output: "True", points: 8, difficulty: "hard" },
    { id: "code-91", code: 'nums = [10, 20, 30]\nfor i in range(len(nums)):\n    print(nums[i], end=" ")', output: "10 20 30 ", points: 8, difficulty: "hard" },
    { id: "code-92", code: 'result = [i for i in range(10) if i % 3 == 0]\nprint(result)', output: "[0, 3, 6, 9]", points: 8, difficulty: "hard" },
    { id: "code-93", code: 'words = ["cat", "dog", "bird"]\nprint([len(w) for w in words])', output: "[3, 3, 4]", points: 8, difficulty: "hard" },
    { id: "code-94", code: 'def is_even(n):\n    return n % 2 == 0\nprint(list(filter(is_even, [1, 2, 3, 4])))', output: "[2, 4]", points: 8, difficulty: "hard" },
    { id: "code-95", code: 'nums = [5, 3, 8, 1]\nprint(nums[1:3][::-1])', output: "[8, 3]", points: 8, difficulty: "hard" },
    { id: "code-96", code: 'text = "abc"\nprint(",".join(text))', output: "a,b,c", points: 8, difficulty: "hard" },
    { id: "code-97", code: 'nums = [1, 2, 3]\nprint(all(x > 0 for x in nums))', output: "True", points: 8, difficulty: "hard" },
    { id: "code-98", code: 'nums = [1, 2, 3]\nprint(any(x > 2 for x in nums))', output: "True", points: 8, difficulty: "hard" },
    { id: "code-99", code: 'def double(x):\n    return x * 2\nnums = [1, 2, 3]\nprint(list(map(double, nums)))', output: "[2, 4, 6]", points: 8, difficulty: "hard" },
    { id: "code-100", code: 'result = {x: x**2 for x in range(3)}\nprint(result[2])', output: "4", points: 8, difficulty: "hard" },
];

// Get a random binary challenge that the user hasn't completed
export async function getRandomChallenge(
    userId: string,
    difficulty: "easy" | "medium" | "hard" | "all" = "all"
): Promise<BinaryChallenge | null> {
    // Filter by difficulty first
    const filteredChallenges =
        difficulty === "all"
            ? BINARY_CHALLENGES
            : BINARY_CHALLENGES.filter((c) => c.difficulty === difficulty);

    // For anonymous users, just return random challenges from filtered set
    if (userId === "anonymous") {
        if (filteredChallenges.length === 0) return null;
        return filteredChallenges[Math.floor(Math.random() * filteredChallenges.length)];
    }
    
    const userGames = await getUserGameData(userId);
    const completedChallenges = Object.keys(userGames?.completedGames || {});
    
    const availableChallenges = filteredChallenges.filter(
        (challenge) => !completedChallenges.includes(challenge.id)
    );

    if (availableChallenges.length === 0) {
        return null; // All challenges completed for this difficulty
    }

    // Return random challenge from available ones
    return availableChallenges[Math.floor(Math.random() * availableChallenges.length)];
}

// Get all binary challenges for display
export function getAllChallenges(): BinaryChallenge[] {
    return BINARY_CHALLENGES;
}

// Get user's game data
export async function getUserGameData(userId: string): Promise<UserGameData | null> {
    try {
        const docRef = doc(db, "user-games/" + userId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            return docSnap.data() as UserGameData;
        }
        return null;
    } catch (err) {
        console.error("Error fetching user game data:", err);
        return null;
    }
}

// Check binary decoder answer and award points
export async function checkBinaryAnswer(
    userId: string,
    challengeId: string,
    userAnswer: string
): Promise<{ correct: boolean; pointsEarned: number; correctAnswer?: string }> {
    const challenge = BINARY_CHALLENGES.find((c) => c.id === challengeId);
    
    if (!challenge) {
        return { correct: false, pointsEarned: 0 };
    }

    // For anonymous users, don't check completion or award points
    if (userId === "anonymous") {
        const correct = userAnswer.trim().toLowerCase() === challenge.answer.toLowerCase();
        return {
            correct,
            pointsEarned: 0,
            correctAnswer: !correct ? challenge.answer : undefined,
        };
    }

    // Check if already completed
    const userGames = await getUserGameData(userId);
    if (userGames?.completedGames?.[challengeId]) {
        return {
            correct: false,
            pointsEarned: 0,
            correctAnswer: challenge.answer,
        };
    }

    // Check answer (case-insensitive)
    const correct = userAnswer.trim().toLowerCase() === challenge.answer.toLowerCase();

    if (correct) {
        // Award points
        await awardGamePoints(
            userId,
            challengeId,
            "binary-decoder",
            challenge.points,
            challenge.points
        );
        return { correct: true, pointsEarned: challenge.points };
    }

    return { correct: false, pointsEarned: 0, correctAnswer: challenge.answer };
}

// Award points for any game completion
export async function awardGamePoints(
    userId: string,
    gameId: string,
    gameType: GameType,
    score: number,
    pointsToAward: number
): Promise<void> {
    try {
        const gameDocRef = doc(db, "user-games/" + userId);
        const userDocRef = doc(db, "users/" + userId);

        const completion: GameCompletion = {
            gameId,
            completedAt: new Date(),
            score,
            pointsEarned: pointsToAward,
        };

        // Check if document exists
        const docSnap = await getDoc(gameDocRef);
        
        if (!docSnap.exists()) {
            // Create new document
            await setDoc(gameDocRef, {
                completedGames: {
                    [gameId]: completion,
                },
                totalGamePoints: pointsToAward,
            });
        } else {
            // Update existing document
            await updateDoc(gameDocRef, {
                [`completedGames.${gameId}`]: completion,
                totalGamePoints: increment(pointsToAward),
            });
        }

        // Also update user's scores under a "games" section
        await updateDoc(userDocRef, {
            ["scores.games"]: increment(pointsToAward),
        });

        console.log(`Awarded ${pointsToAward} points to user ${userId} for ${gameType}`);
    } catch (err) {
        console.error("Error awarding game points:", err);
        throw err;
    }
}

// Get user's stats for games
export async function getGameStats(userId: string): Promise<{
    totalPoints: number;
    gamesCompleted: number;
    challengesCompleted: string[];
}> {
    const gameData = await getUserGameData(userId);
    
    if (!gameData) {
        return {
            totalPoints: 0,
            gamesCompleted: 0,
            challengesCompleted: [],
        };
    }

    return {
        totalPoints: gameData.totalGamePoints || 0,
        gamesCompleted: Object.keys(gameData.completedGames || {}).length,
        challengesCompleted: Object.keys(gameData.completedGames || {}),
    };
}

// Get a random coding challenge that the user hasn't completed (static set only)
export async function getRandomCodingChallenge(
    userId: string,
    difficulty: "easy" | "medium" | "hard" | "all" = "all"
): Promise<CodingChallenge | null> {
    const filteredChallenges =
        difficulty === "all"
            ? CODING_CHALLENGES
            : CODING_CHALLENGES.filter((c) => c.difficulty === difficulty);

    if (userId === "anonymous") {
        if (filteredChallenges.length === 0) return null;
        return filteredChallenges[Math.floor(Math.random() * filteredChallenges.length)];
    }
    
    const userGames = await getUserGameData(userId);
    const completedChallenges = Object.keys(userGames?.completedGames || {});
    
    const availableChallenges = filteredChallenges.filter(
        (challenge) => !completedChallenges.includes(challenge.id)
    );

    if (availableChallenges.length === 0) {
        return null;
    }

    return availableChallenges[Math.floor(Math.random() * availableChallenges.length)];
}

// Generate AI-based coding challenge using API route
export async function generateAICodingChallenge(
    language: "python" | "cpp" | "java" | "blockly" | "scratch",
    difficulty: "easy" | "medium" | "hard" | "all" = "easy"
): Promise<CodingChallenge> {
    try {
        const response = await fetch("/api/mindstorm", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ language, difficulty }),
        });

        if (!response.ok) {
            throw new Error("Failed to generate challenge");
        }

        const challenge = await response.json();

        const result: CodingChallenge = {
            id: challenge.id,
            code: challenge.code,
            output: challenge.output,
            points: challenge.points,
            difficulty: challenge.difficulty,
            language,
            isAI: true,
        };

        return result;
    } catch (error) {
        console.error("Error generating AI challenge:", error);

        // Fallback to pre-defined challenges if AI fails
        const filtered =
            CODING_CHALLENGES.filter((c) => c.difficulty === difficulty);
        if (filtered.length > 0) {
            return filtered[Math.floor(Math.random() * filtered.length)];
        }

        // If somehow none, fallback to any challenge
        return CODING_CHALLENGES[Math.floor(Math.random() * CODING_CHALLENGES.length)];
    }
}

// Check coding challenge answer and award points
// NOTE: takes the full challenge object so it works for both static + AI challenges
export async function checkCodingAnswer(
    userId: string,
    challenge: CodingChallenge,
    userAnswer: string
): Promise<{ correct: boolean; pointsEarned: number; correctAnswer?: string }> {
    // For anonymous users, don't record or award points
    if (userId === "anonymous") {
        const correct = userAnswer === challenge.output;
        return {
            correct,
            pointsEarned: 0,
            correctAnswer: !correct ? challenge.output : undefined,
        };
    }

    // Check if already completed
    const userGames = await getUserGameData(userId);
    if (userGames?.completedGames?.[challenge.id]) {
        return {
            correct: false,
            pointsEarned: 0,
            correctAnswer: challenge.output,
        };
    }

    // Check answer (exact string match)
    const correct = userAnswer === challenge.output;

    if (correct) {
        await awardGamePoints(
            userId,
            challenge.id,
            "mindstorm",
            challenge.points,
            challenge.points
        );
        return { correct: true, pointsEarned: challenge.points };
    }

    return {
        correct: false,
        pointsEarned: 0,
        correctAnswer: challenge.output,
    };
}
