import { Quiz } from "@/app/services/quizService"
import QuizQuestion from "./QuizQuestion"
import { useState } from "react"
import { CheckCircleIcon } from "@heroicons/react/24/solid"

type Props = {
    className?: string
    quiz: Quiz
    working: boolean
    completed: boolean
    wrongAns: number[]
    onSumbit: (answers: number[]) => void
}

export default function QuizPrompt(props: Props) {
    let [answers, setAnswers] = useState<number[]>(props.quiz.questions.map(() => -1));

    function handleQuestionAnswered(questionIndex: number, answerIndex: number) {
        setAnswers(prev => {
            const updated = [...prev];
            updated[questionIndex] = answerIndex;
            return updated;
        });
    }

    return <main className={`flex flex-col bg-slate-800 rounded-md overflow-hidden border gap-2 ${props.completed ? "border-2 border-emerald-400" : "border-gray-600"}`}>
        <div className={`p-2 text-slate-200 border-b border-gray-600 flex flex-row items-center gap-2 ${props.completed && "bg-emerald-600/30"}`}>
            {props.completed && <CheckCircleIcon height={10} width={15} className="h-7 w-7 text-emerald-300" />}
            <h1 className="text-2xl font-bold flex-1 font-mono">Quiz</h1>
            <p className={`font-mono text-sm ${props.completed ? "text-slate-100" : "text-slate-400"}`}>{props.quiz.points} pts</p>
        </div>
        {!props.completed && <div className="p-2 flex flex-col gap-9">
            {props.quiz.questions.map((question, index) => <QuizQuestion wrong={props.wrongAns.includes((index))} onChange={(ans) => handleQuestionAnswered(index, ans)} key={index} question={question} number={index + 1} />)}
        </div>}
        {!props.completed && <div className="p-2 pt-0">
            <button className={`btn-primary font-mono w-full ${props.working && "bg-opacity-50 hover:bg-opacity-50 cursor-wait"}`} type="button" disabled={props.working} onClick={() => props.onSumbit(answers)}>{props.working ? "Submitting..." : "Submit"}</button>
        </div>}
    </main>
}
