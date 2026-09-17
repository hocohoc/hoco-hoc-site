import { Quiz } from "@/app/services/quizService"
import QuizQuestion from "./QuizQuestion"
import { useEffect, useRef, useState } from "react"
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
    const [reviewing, setReviewing] = useState(false);
    const [validation, setValidation] = useState("");

    const resultRef = useRef<HTMLParagraphElement>(null);
    useEffect(() => { if (props.completed) resultRef.current?.focus(); }, [props.completed]);

    function handleQuestionAnswered(questionIndex: number, answerIndex: number) {
        setReviewing(false);
        setValidation("");
        setAnswers(prev => {
            const updated = [...prev];
            updated[questionIndex] = answerIndex;
            return updated;
        });
    }

    return <div className={`flex flex-col bg-slate-800 rounded-md overflow-hidden border gap-2 ${props.completed ? "border-2 border-emerald-400" : "border-gray-600"}`}>
        <div className={`p-2 text-slate-200 border-b border-gray-600 flex flex-row items-center gap-2 ${props.completed && "bg-emerald-600/30"}`}>
            {props.completed && <CheckCircleIcon height={10} width={15} className="h-7 w-7 text-emerald-300" />}
            <h2 className="text-2xl font-bold flex-1 font-mono">Quiz</h2>
            <p className={`font-mono text-sm ${props.completed ? "text-slate-100" : "text-slate-400"}`}>{props.quiz.points} pts</p>
        </div>
        <p ref={resultRef} tabIndex={-1} role="status" aria-atomic="true" className="px-2">{props.working ? "Checking your answers…" : props.completed ? "Quiz completed." : props.wrongAns.length ? `Review the incorrect answers for questions ${props.wrongAns.map(i => i + 1).join(", ")}, then submit again.` : ""}</p>
        {!props.completed && <div className="p-2 flex flex-col gap-9">
            {props.quiz.questions.map((question, index) => <QuizQuestion wrong={props.wrongAns.includes((index))} onChange={(ans) => handleQuestionAnswered(index, ans)} key={index} question={question} number={index + 1} />)}
        </div>}
        {!props.completed && <div className="p-2 pt-0">
            <p role="alert">{validation}</p>
            <p role="status" className="mb-2">{reviewing ? "Review your selected answers above. You can change any answer before confirming your submission." : ""}</p>
            <button className={`btn-primary font-mono w-full ${props.working && "bg-opacity-50 hover:bg-opacity-50 cursor-wait"}`} type="button" aria-disabled={props.working} onClick={() => {
                if (props.working) return;
                const unanswered = answers.flatMap((answer, index) => answer < 0 ? [index + 1] : []);
                if (unanswered.length) { setValidation(`Choose an answer for questions ${unanswered.join(", ")} before submitting.`); return; }
                if (!reviewing) { setReviewing(true); return; }
                props.onSumbit(answers);
                setReviewing(false);
            }}>{props.working ? "Submitting..." : reviewing ? "Confirm and submit answers" : "Review answers"}</button>
        </div>}
    </div>
}
