"use client"

import { Question, Quiz } from "@/app/services/quizService"
import { useEffect, useId, useState } from "react"
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

    function validate(): boolean {
        if (quiz.id != props.quiz.id) return false
        if (!quiz.points || quiz.points < 1) return false
        if (quiz.questions.length < 1) return false
        if (correctOpts.length != quiz.questions.length) return false

        for (let i = 0; i < quiz.questions.length; i++) {
            const q = quiz.questions[i]
            if (!q.question || q.question.length == 0) return false
            if (!q.options || q.options.length == 0) return false
            if (correctOpts[i] < 0 || correctOpts[i] >= q.options.length) return false
        }

        return true
    }

    function handleSave() {
        //TODO: Finish validation, pull in answers, figure out logic for saving answers and stuff
        if (validate()) {
            console.log("inputs valid!")
            console.log(quiz)
            console.log(correctOpts)

            props.onSave(quiz, correctOpts)
        } else {
            alert("Data seems to be invalid, double check your inputs!")
        }
    }
    return props.quiz && <main className="flex flex-col gap-2 p-2">
        <h1 className="text-xl font-bold">{props.editing ? "Edit Quiz" : "Create Quiz"}</h1>
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
    </main>
}
