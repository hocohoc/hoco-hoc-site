import { Question } from "@/app/services/quizService"
import { useId, useState } from "react"
import Markdown from "react-markdown"
import { useProfile } from "../auth-provider/authProvider"
import { mdCodeBlockParser } from "@/app/services/utils"
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex'

type Props = {
    className?: string
    question: Question
    number: number
    wrong: boolean
    onChange: (selection: number) => void
}

export default function QuizQuestion(props: Props) {
    let [selected, setSelected] = useState<number>(-1)
    let profile = useProfile()
    const groupId = useId()

    function handleSelectionChange(selectionIndex: number) {
        console.log("Selected ", selectionIndex)
        setSelected(selectionIndex)
        props.onChange(selectionIndex)
    }

    return <section className={`flex flex-col ${props.className} gap-2`}>
        <div className={`flex flex-row items-start gap-2 ${props.wrong && "border rounded border-red-400 bg-red-400/30"}`}>
            <div>
                <p className="ml-1 font-bold font-mono text-lg">{props.number}.</p>
            </div>
            <div className="w-5/6 min-w-0" id={`${groupId}-question`}>
                <Markdown className="text-lg w-full"
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={{
                        code(code_props) {
                            return mdCodeBlockParser(code_props, profile)
                        }
                    }}
                >{props.question.question}</Markdown>
            </div>
        </div>
        {props.wrong && <p id={`${groupId}-error`} className="text-red-300">Your answer to question {props.number} is incorrect. Choose another answer and try again.</p>}
        <fieldset className="flex flex-col gap-1" aria-labelledby={`${groupId}-question`} aria-invalid={props.wrong} aria-describedby={props.wrong ? `${groupId}-error` : undefined}>
            <legend className="sr-only">Question {props.number} answer choices</legend>
            {props.question.options.map((opt, i) => {
                const optionId = `${groupId}-opt-${i}`;
                const isSelected = i === selected;
                return (
                    <label
                        key={optionId}
                        htmlFor={optionId}
                        className={`flex flex-row gap-2 items-center rounded border p-2 py-4 cursor-pointer hover:bg-sky-700/30 focus-within:ring-2 focus-within:ring-sky-300 ${isSelected ? "bg-sky-700/30 border-sky-300" : "bg-slate-900/30 border-slate-500"}`}
                    >
                        <input
                            id={optionId}
                            type="radio"
                            name={groupId}
                            value={i}
                            checked={isSelected}
                            onChange={() => handleSelectionChange(i)}
                            className="w-5 h-5 shrink-0 appearance-none rounded-full border-2 border-slate-300 bg-slate-900 checked:border-[6px] checked:border-sky-300"
                        />
                        <Markdown className=""
                            remarkPlugins={[remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                            components={{
                                code(code_props) {
                                    return mdCodeBlockParser(code_props, profile)
                                }
                            }}
                        >{opt}</Markdown>
                    </label>
                );
            })}
        </fieldset>
    </section>
}
