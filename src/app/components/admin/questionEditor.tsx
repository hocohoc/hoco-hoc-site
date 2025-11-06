import { Question } from "@/app/services/quizService"
import { mdCodeBlockParser } from "@/app/services/utils"
import { useEffect, useState } from "react"
import Markdown from "react-markdown"
import { useProfile } from "../auth-provider/authProvider"

type Props = {
    className?: string
    question: Question
    onChange: (index: number, question: Question, correct: number) => void
    onDelete: (index: number) => void
    number: number
    answer?: number
}

export default function QuestionEditor(props: Props) {
    let [question, setQuestion] = useState<Question>(props.question)
    let [correctIndex, setCorrectIndex] = useState<number>(props.answer ?? -1)
    let [newOpt, setNewOpt] = useState<string>("")
    const profile = useProfile()

    useEffect(() => {
        setQuestion(props.question)
    }, [props.question])

    useEffect(() => {
        setCorrectIndex(props.answer ?? -1)
    }, [props.answer])

    function removeOption(index: number) {
        setCorrectIndex(-1)
        let newQuestion = { ...question }

        newQuestion.options.splice(index, 1)
        setQuestion(newQuestion)
        props.onChange(props.number, question, correctIndex)
    }

    function handleMarkCorrect(index: number) {
        setCorrectIndex(index)
        props.onChange(props.number, question, index)
    }

    function handleAddOption() {
        let newQuestion = { ...question }

        newQuestion.options.push(newOpt)
        setQuestion(newQuestion)
        setNewOpt("")
        props.onChange(props.number, newQuestion, correctIndex)
    }

    function handleQuestionTextChange(text: string) {
        setQuestion({ ...question, question: text })
        props.onChange(props.number, { ...question, question: text }, correctIndex)
    }

    return <main className={`flex flex-col gap-1 border rounded bg-slate-800/50 border-slate-700 p-2 ${props.className}`}>
        <div className="flex flex-row gap-2 items-center">
            <p className="flex-1">Question {props.number + 1}</p>
            <button className="btn-danger font-mono" type="button" onClick={() => props.onDelete(props.number)}>Delete</button>
        </div>
        <textarea value={question.question} onChange={e => handleQuestionTextChange(e.target.value)} />
        <p>Options (Hover over option text and click to delete)</p>
        {
            question.options.map((opt, i) => {
                return <div key={i} className="flex flex-row items-center border rounded p-2 border-slate-700">
                    <button
                        className="text-left flex-1 hover:line-through hover:text-red-400 hover:font-bold"
                        type="button"
                        onClick={() => removeOption(i)}
                        aria-label={`Delete option ${i + 1}`}
                    >
                        <span className="sr-only">Option {i + 1}</span>
                        <Markdown className="w-full"
                            components={{
                                code(code_props) {
                                    return mdCodeBlockParser(code_props, profile)
                                }
                            }}
                        >{opt}</Markdown>
                    </button>
                    <div className="flex-1"></div>
                    <button className={`btn-secondary font-mono ${correctIndex == i && "bg-green-400"}`} type="button" onClick={() => handleMarkCorrect(i)}>[Mark Correct]</button>
                </div>
            })
        }
        <div className="flex flex-row gap-2 items-center">
            <textarea className="flex-1" value={newOpt} placeholder="Add another option..." onChange={e => setNewOpt(e.target.value)} />
            <button className="btn-primary font-mono" type="button" onClick={handleAddOption} disabled={newOpt.length == 0}>Add Option</button>
        </div>
    </main>
}
