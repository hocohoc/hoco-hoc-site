"use client"

import { useEffect, useState } from "react";
import Leaderboard from "../components/leaderboard/leaderboard";
import { School, getSchoolByID, onScoresChange } from "../services/schoolsService";

export default function LeaderboardPage() {
    let [schools, setSchools] = useState<School[]>([])

    useEffect(() => {
        let unsub = onScoresChange((scores) => {
            console.log(scores)
            let arr: School[] = []
            for (let id in scores) {
                let school = getSchoolByID(id)
                school.score = scores[id]
                arr.push(school)
            }
            setSchools(arr)
        })

        return unsub
    }, [])

    function sort(schools: School[]): School[] {
        return schools.filter(a => a.score > 0).sort((a, b) => {
            return a.score == b.score ? (a.name > b.name ? 1 : -1) : (b.score - a.score)
        })
    }

    return <main className="p-4 flex flex-col items-center">
        <div className="max-w-2xl w-full">
            <div className="bg-sky-800 p-4 rounded mb-2 border-2 border-sky-900">
                <h1 className="font-mono text-2xl font-bold mb-2">School Leaderboard</h1>
                <p className="text-sm text-slate-300"> Don&apos;t see your school? Schools that have zero points are not included on the leaderboard. </p>
            </div>
            {sort(schools).length > 0 ?
                <Leaderboard schools={sort(schools)} className="w-full" />
                : <p className="p-2 bg-slate-800 rounded"> No schools have gained any points... </p>
            }
        </div>
    </main>
}