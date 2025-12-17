import { 
    collection,
    getDocs,
    doc,
    setDoc,
    updateDoc,
    Timestamp,
    getDoc,
    arrayUnion
} from "firebase/firestore";
import { db } from "../firebase/config";
import { getAllSchools } from "./schoolsService";

export type Prize = {
    id: string;
    name: string;
    quantity: number;
    description: string;
    tier: "major" | "minor";
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

export type PublicRaffleWinner = RaffleResult & {
    winnerSchool?: string;
    prizeTier?: Prize["tier"];
};

export type RaffleConfig = {
    pointsPerEntry: number;
    prizes: Prize[];
    results: RaffleResult[];
    active: boolean;
    createdAt: Timestamp;
};

const RAFFLE_DOC = "aggregate/raffle";

export const DEFAULT_PRIZES: Prize[] = [
    {
        id: "ipad",
        name: "Apple iPad (A16)",
        quantity: 1,
        description: "1x Apple iPad with A16 chip",
        tier: "major",
    },
    {
        id: "jbl",
        name: "JBL Tune 720BT",
        quantity: 1,
        description: "1x JBL Tune 720BT Headphones",
        tier: "major",
    },
    {
        id: "giftcard",
        name: "$10 Amazon Giftcard",
        quantity: 10,
        description: "10x $10 Amazon Giftcards",
        tier: "minor",
    },
];

type StoredPrize = Omit<Prize, "tier"> & {
    tier?: Prize["tier"];
};

type FirestoreRaffleConfig = Omit<RaffleConfig, "prizes"> & {
    prizes?: StoredPrize[];
};

function normalizePrizes(prizes?: StoredPrize[]): Prize[] {
    const source = prizes && prizes.length > 0 ? prizes : DEFAULT_PRIZES;
    return source.map((prize) => ({
        ...prize,
        tier: prize.tier ?? "minor",
    }));
}

function resolveSchoolName(school?: string): string | undefined {
    if (!school) return undefined;
    const match = getAllSchools().find((s) => s.id === school);
    return match?.name ?? school;
}

// Initialize raffle with default prizes
export async function initializeRaffle(prizes: Prize[]): Promise<void> {
    const config: RaffleConfig = {
        pointsPerEntry: 10,
        prizes: normalizePrizes(prizes),
        results: [],
        active: true,
        createdAt: Timestamp.now(),
    };

    await setDoc(doc(db, RAFFLE_DOC), config);
}

// Get raffle configuration
export async function getRaffleConfig(): Promise<RaffleConfig | null> {
    const snap = await getDoc(doc(db, RAFFLE_DOC));
    if (!snap.exists()) {
        return null;
    }
    const data = snap.data() as FirestoreRaffleConfig;
    return {
        ...data,
        prizes: normalizePrizes(data.prizes),
    };
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

export async function getPublicRaffleWinners(): Promise<PublicRaffleWinner[]> {
    const [results, config] = await Promise.all([
        getRaffleResults(),
        getRaffleConfig(),
    ]);

    if (results.length === 0) {
        return [];
    }

    const uniqueWinnerIds = Array.from(
        new Set(results.map((result) => result.winnerUid).filter(Boolean))
    );

    const schoolEntries = await Promise.all(
        uniqueWinnerIds.map(async (uid) => {
            try {
                const snap = await getDoc(doc(db, "users/" + uid));
                const school = snap.exists() ? (snap.data()?.school as string | undefined) : undefined;
                return [uid, school] as const;
            } catch {
                return [uid, undefined] as const;
            }
        })
    );

    const schoolMap = new Map(schoolEntries);
    const prizeTierMap = new Map(
        (config?.prizes ?? DEFAULT_PRIZES).map((prize) => [prize.id, prize.tier])
    );

    return results.map((result) => ({
        ...result,
        winnerSchool: resolveSchoolName(schoolMap.get(result.winnerUid)),
        prizeTier: prizeTierMap.get(result.prizeId) ?? "minor",
    }));
}

export async function saveRafflePrizes(prizes: Prize[]): Promise<void> {
    const normalized = normalizePrizes(prizes);
    const ref = doc(db, RAFFLE_DOC);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
        const config: RaffleConfig = {
            pointsPerEntry: 10,
            prizes: normalized,
            results: [],
            active: true,
            createdAt: Timestamp.now(),
        };
        await setDoc(ref, config);
        return;
    }

    await updateDoc(ref, { prizes: normalized });
}

// Reset raffle
export async function resetRaffle(prizes: Prize[]): Promise<void> {
    const config: RaffleConfig = {
        pointsPerEntry: 10,
        prizes: normalizePrizes(prizes),
        results: [],
        active: true,
        createdAt: Timestamp.now(),
    };

    await setDoc(doc(db, RAFFLE_DOC), config);
}
