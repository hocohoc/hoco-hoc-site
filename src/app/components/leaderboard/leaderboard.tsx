import { School } from "@/app/services/schoolsService"
import { useAutoAnimate } from '@formkit/auto-animate/react'

type Props = {
    schools: School[]
    className?: string
}

export default function Leaderboard(props: Props) {
    const [animationParent] = useAutoAnimate()

    function topStyles(rank: number): string {
        if(rank == 0) {
            return "bg-yellow-800 text-white font-bold"
        } else if(rank == 1) {
            return "bg-slate-600 text-white font-bold"
        } else if(rank == 2) {
            return "bg-amber-900 text-white font-bold"
        } else {
            return "even:bg-gray-800"
        }
    }

    return <div className={`w-full h-full text-slate-300 bg-gray-900 rounded-md border-gray-800 border-2 overflow-hidden ${props.className}`}>
        <table className={`w-full h-full table-auto`}>
            <thead className="bg-sky-900 bg-gradient-to-b from-sky-800 to-sky-900 font-mono md:text-xl text-left uppercase">
                <tr>
                    <th className="p-2 text-center border-r border-r-gray-700">Place</th>
                    <th className="p-2 border-r border-r-gray-700">School</th>
                    <th className="p-2 text-center">Points</th>
                </tr>
            </thead>
            <tbody ref={animationParent}>
                {props.schools.map((school, index) => {
                    return <tr key={school.id} className={`border-b border-slate-700 ${topStyles(index)}`}>
                        <td className="p-5 font-bold text-xl md:text-2xl text-center font-mono border-r border-r-gray-700">{index+1}</td>
                        <td className="p-5 md:text-lg border-r border-r-gray-700">{school.name}</td>
                        <td className="p-5 font-bold text-xl md:text-2xl text-center">{school.score}</td>
                    </tr>;
                })}
            </tbody>
        </table>
    </div>
}