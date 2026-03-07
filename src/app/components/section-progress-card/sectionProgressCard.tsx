import { Section } from "@/app/services/articleService";
import { truncate } from "@/app/services/utils";

type Props = {
  section: Section
  points: number
  className?: string
}
export default function SectionProgressCard(props: Props) {

  function possibleSectionPoints(): number {
    let sum = 0;
    for (let id in props.section.points) {
      sum += props.section.points[id]
    }
    return sum;
  }

  function percentComplete(): number {
    return (possibleSectionPoints() == 0 || !props.points) ? 0 : Math.round(props.points * 100 / possibleSectionPoints())
  }

  const isComplete = percentComplete() === 100

  return <main className={`rounded p-4 flex flex-col ${isComplete ? "bg-emerald-900/30 border border-emerald-500/40" : "bg-slate-800"} ${props.className || ""}`}>
    <div className="flex items-center gap-2">
      <h1 className="font-bold text-lg mb-2 flex-1"> {props.section.title} </h1>
      {isComplete && (
        <span className="text-xs font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full whitespace-nowrap">
          ★ Complete
        </span>
      )}
    </div>
    <p className="text-sm text-slate-300"> {truncate(props.section.description, 50)} </p>
    <p className="mt-auto text-sm font-mono text-slate-500"> Earned {Math.round(props.points ?? 0)}/{possibleSectionPoints()}pts ({percentComplete()}%)</p>
    <div className="w-full bg-slate-700 rounded-full mt-2 h-2 overflow-hidden">
      <div style={{ width: `${percentComplete()}%` }} className={`h-full ${isComplete ? "bg-emerald-300" : "bg-emerald-400"}`}> </div>
    </div>
  </main >
}
