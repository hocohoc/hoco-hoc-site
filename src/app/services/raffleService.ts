import { 
    collection,
    getDocs,
    doc,
    setDoc,
    updateDoc,
    Timestamp,
    increment,
    getDoc,
    arrayUnion
} from "firebase/firestore";
import { db } from "../firebase/config";

export type Prize = {
    id: string;
    name: string;
    quantity: number;
    description: string;
};

export type RaffleEntry = {
    uid: string;
    displayName: string;
    email: string;
    points: number;
    entries: number; // points / 10
};

export type RaffleResult = {
    prizeId: string;
    prizeName: string;
    winnerUid: string;
    winnerName: string;
    winnerEmail: string;
    timestamp: Timestamp;
};

export type RaffleConfig = {
    pointsPerEntry: number;
    prizes: Prize[];
    results: RaffleResult[];
    active: boolean;
    createdAt: Timestamp;
};

const RAFFLE_DOC = "aggregate/raffle";

// Initialize raffle with default prizes
export async function initializeRaffle(prizes: Prize[]): Promise<void> {
    const config: RaffleConfig = {
        pointsPerEntry: 10,
        prizes,
        results: [],
        active: true,
        createdAt: Timestamp.now(),
    };

    await setDoc(doc(db, RAFFLE_DOC), config);
}

// Get raffle configuration
export async function getRaffleConfig(): Promise<RaffleConfig | null> {
    const snap = await getDoc(doc(db, RAFFLE_DOC));
    return snap.exists() ? (snap.data() as RaffleConfig) : null;
}

// Get all raffle entries based on user points
export async function getRaffleEntries(): Promise<RaffleEntry[]> {
    const userSnap = await getDocs(collection(db, "users"));
    const pointsPerEntry = 10;

    return userSnap.docs
        .map((doc) => {
            const data = doc.data();
            const totalPoints = (Object.values(data.scores || {}) as number[]).reduce(
                (sum: number, score: number) => sum + (score || 0),
                0
            );
            const entries = Math.floor(totalPoints / pointsPerEntry);

            return {
                uid: doc.id,
                displayName: data.displayName || "Unknown",
                email: data.email || "",
                points: totalPoints,
                entries,
            };
        })
        .filter((entry) => entry.entries > 0); // Only include users with at least 1 entry
}

// Roll raffle - select winners for each prize
export async function rollRaffle(): Promise<RaffleResult[]> {
    const config = await getRaffleConfig();
    if (!config) {
        throw new Error("Raffle not configured");
    }

    const entries = await getRaffleEntries();
    const results: RaffleResult[] = [];

    // Create weighted pool: each user appears in the pool once per entry
    const pool: RaffleEntry[] = [];
    entries.forEach((entry) => {
        for (let i = 0; i < entry.entries; i++) {
            pool.push(entry);
        }
    });

    if (pool.length === 0) {
        throw new Error("No raffle entries available");
    }

    // For each prize, randomly select a winner from the pool
    for (const prize of config.prizes) {
        for (let i = 0; i < prize.quantity; i++) {
            // Random selection
            const winnerIndex = Math.floor(Math.random() * pool.length);
            const winner = pool[winnerIndex];

            const result: RaffleResult = {
                prizeId: prize.id,
                prizeName: prize.name,
                winnerUid: winner.uid,
                winnerName: winner.displayName,
                winnerEmail: winner.email,
                timestamp: Timestamp.now(),
            };

            results.push(result);

            // Remove winner from pool after selection (no duplicates)
            pool.splice(winnerIndex, 1);

            if (pool.length === 0) break;
        }

        if (pool.length === 0) break;
    }

    // Save results to Firebase
    if (results.length > 0) {
        await updateDoc(doc(db, RAFFLE_DOC), {
            results: arrayUnion(...results),
            active: false,
        });
    }

    return results;
}

// Get raffle results
export async function getRaffleResults(): Promise<RaffleResult[]> {
    const config = await getRaffleConfig();
    return config?.results || [];
}

// Reset raffle
export async function resetRaffle(prizes: Prize[]): Promise<void> {
    const config: RaffleConfig = {
        pointsPerEntry: 10,
        prizes,
        results: [],
        active: true,
        createdAt: Timestamp.now(),
    };

    await setDoc(doc(db, RAFFLE_DOC), config);
}
