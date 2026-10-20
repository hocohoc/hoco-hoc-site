import { doc, increment, onSnapshot, updateDoc } from "firebase/firestore"
import { db } from "../firebase/config"
import { Unsubscribe } from "firebase/auth"

export type LiveStats = {
    totalViews: number,
    totalUsers: number,
    totalHours: number
}

export async function incrementHoursServed(seconds: number) {
    const ref = doc(db, "aggregate/stats")
    await updateDoc(ref, {
        totalHours: increment(seconds / (60 * 60))
    })
}

export function onStatsChange(callback: (stats: LiveStats) => void, onError?: (error: Error) => void): Unsubscribe {
    let ref = doc(db, "aggregate/stats")
    return onSnapshot(ref, (doc) => {
        const data = doc.data()
        if (!data || ![data.totalUsers, data.totalViews, data.totalHours].every(value => typeof value === "number" && Number.isFinite(value))) {
            onError?.(new Error("Community statistics are unavailable."))
            return
        }
        callback(data as LiveStats)
    }, onError)
}
