import { Question } from "@/app/services/quizService"
import { mdCodeBlockParser } from "@/app/services/utils"
import { useEffect, useId, useState } from "react"
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
    const questionId = useId()
    const optionId = useId()

    useEffect(() => {
        setQuestion(props.question)
    }, [props.question])

    useEffect(() => {
        setCorrectIndex(props.answer ?? -1)
    }, [props.answer])

    function removeOption(index: number) {
        setCorrectIndex(-1)
        const newQuestion = { ...question, options: question.options.filter((_, i) => i !== index) }
        setQuestion(newQuestion)
        props.onChange(props.number, newQuestion, -1)
    }

    function handleMarkCorrect(index: number) {
        setCorrectIndex(index)
        props.onChange(props.number, question, index)
    }

    function handleAddOption() {
        const newQuestion = { ...question, options: [...question.options, newOpt] }
        setQuestion(newQuestion)
        setNewOpt("")
        props.onChange(props.number, newQuestion, correctIndex)
    }

    function handleQuestionTextChange(text: string) {
        setQuestion({ ...question, question: text })
        props.onChange(props.number, { ...question, question: text }, correctIndex)
    }

    return <div className={`flex flex-col gap-1 border rounded bg-slate-800/50 border-slate-700 p-2 ${props.className}`}>
        <div className="flex flex-row gap-2 items-center">
            <p className="flex-1">Question {props.number + 1}</p>
            <button className="btn-danger font-mono" type="button" onClick={() => props.onDelete(props.number)}>Delete</button>
        </div>
        <label htmlFor={questionId}>Question {props.number + 1} text</label>
        <textarea id={questionId} value={question.question} onChange={e => handleQuestionTextChange(e.target.value)} />
        <p>Options</p>
        {
            question.options.map((opt, i) => {
                return <div key={i} className="flex flex-row flex-wrap gap-2 items-center border rounded p-2 border-slate-700">
                    <div className="text-left flex-1 min-w-0">
                        <span>Option {i + 1}</span>
                        <Markdown className="w-full"
                            components={{
                                code(code_props) {
                                    return mdCodeBlockParser(code_props, profile)
                                }
                            }}
                        >{opt}</Markdown>
                    </div>
                    <button className="btn-danger" type="button" onClick={() => removeOption(i)} aria-label={`Delete option ${i + 1}`}>Delete</button>
                    <button aria-label={`Mark Correct: option ${i + 1}`} aria-pressed={correctIndex === i} className={`btn-secondary font-mono ${correctIndex == i && "bg-green-400"}`} type="button" onClick={() => handleMarkCorrect(i)}>Mark Correct</button>
                </div>
            })
        }
        <label htmlFor={optionId}>New answer option</label>
        <div className="flex flex-row gap-2 items-center">
            <textarea id={optionId} className="flex-1" value={newOpt} placeholder="Add another option..." onChange={e => setNewOpt(e.target.value)} />
            <button className="btn-primary font-mono" type="button" onClick={handleAddOption} disabled={newOpt.length == 0}>Add Option</button>
        </div>
    </div>
}
