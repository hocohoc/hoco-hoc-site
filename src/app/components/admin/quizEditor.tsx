"use client"

import { Question, Quiz } from "@/app/services/quizService"
import { useEffect, useId, useRef, useState } from "react"
import QuestionEditor from "./questionEditor"

type Props = {
    quiz: Quiz
    answers?: number[]
    editing: boolean
    onSave: (quiz: Quiz, answers: number[]) => void
    onCancel: () => void
}

export default function QuizEditor(props: Props) {
    let [quiz, setQuiz] = useState<Quiz>(props.quiz)
    let [correctOpts, setCorrectOpts] = useState<number[]>([])
    const pointsFieldId = useId();
    const [errors, setErrors] = useState<string[]>([]);
    const errorSummary = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (errors.length) errorSummary.current?.focus();
    }, [errors]);

    useEffect(() => {
        setQuiz(props.quiz)
    }, [props.quiz])

    useEffect(() => {
        if (props.answers) {
            setCorrectOpts(props.answers)
        } else {
            if (props.quiz)
                setCorrectOpts(props.quiz.questions.map(_ => -1))
        }
    }, [props.answers, props.quiz])

    function handleQuestionSave(index: number, question: Question, correctIndex: number) {
        setQuiz(prevQuiz => {
            const nextQuiz: Quiz = {
                ...prevQuiz,
                questions: [...prevQuiz.questions]
            };

            if (index >= nextQuiz.questions.length) {
                nextQuiz.questions.push(question);
                setCorrectOpts(prev => {
                    const next = [...prev];
                    next[index] = correctIndex;
                    return next;
                });
            } else {
                nextQuiz.questions[index] = question;
                setCorrectOpts(prev => {
                    const next = [...prev];
                    next[index] = correctIndex;
                    return next;
                });
            }

            return nextQuiz;
        });
    }

    function handleQuestionDelete(index: number) {
        setQuiz(prevQuiz => {
            const nextQuiz: Quiz = {
                ...prevQuiz,
                questions: prevQuiz.questions.filter((_, i) => i !== index)
            };
            setCorrectOpts(prev => prev.filter((_, i) => i !== index));
            return nextQuiz;
        });
    }

    function handleQuestionAdd() {
        setQuiz(prevQuiz => ({
            ...prevQuiz,
            questions: [...prevQuiz.questions, {
                question: "Sample Question Text",
                options: ["a", "b", "c"]
            }]
        }));
        setCorrectOpts(prev => [...prev, -1]);
    }

    function handleSave() {
        const issues: string[] = [];
        if (quiz.id !== props.quiz.id) issues.push("The quiz identifier changed. Close and reopen the editor.");
        if (!Number.isFinite(quiz.points) || quiz.points < 1) issues.push("Point Value: enter a number of at least 1.");
        if (!quiz.questions.length) issues.push("Add at least one question.");
        quiz.questions.forEach((question, index) => {
            const label = `Question ${index + 1}`;
            if (!question.question?.trim()) issues.push(`${label}: enter the question text.`);
            if (!question.options?.length) issues.push(`${label}: add at least one answer option.`);
            if (question.options?.some(option => !option.trim())) issues.push(`${label}: enter text for every answer option.`);
            const answer = correctOpts[index];
            if (!Number.isInteger(answer) || answer < 0 || answer >= question.options.length)
                issues.push(`${label}: mark one answer as correct.`);
        });
        setErrors(issues);
        if (!issues.length) props.onSave(quiz, correctOpts);
    }
    return props.quiz && <div className="flex flex-col gap-2 p-2">
        <h1 className="text-xl font-bold">{props.editing ? "Edit Quiz" : "Create Quiz"}</h1>
        {errors.length > 0 && <div ref={errorSummary} tabIndex={-1} role="alert" className="rounded border border-red-400 p-3">
            <p className="font-bold">Correct these issues before saving:</p>
            <ul className="list-disc pl-5">{errors.map(error => <li key={error}>{error}</li>)}</ul>
        </div>}
        <label className="block" htmlFor={pointsFieldId}>Point Value</label>
        <input id={pointsFieldId} type="number" value={quiz.points ?? 0} onChange={e => setQuiz({ ...quiz, points: Number(e.target.value) })} />
        <div className="flex flex-col gap-5">
            {
                quiz.questions.map((question, i) => {
                    return <QuestionEditor key={i} number={i} answer={correctOpts[i]} question={question} onChange={handleQuestionSave} onDelete={handleQuestionDelete} />
                })
            }
        </div>
        <button className="btn-secondary font-mono" type="button" onClick={handleQuestionAdd}>Add Question</button>
        <div className="flex flex-row gap-2">
            <button className="btn-primary flex-1 font-mono" type="button" onClick={handleSave}>Save</button>
            <button className="btn-secondary font-mono" type="button" onClick={props.onCancel}>Cancel</button>
        </div>
    </div>
}
