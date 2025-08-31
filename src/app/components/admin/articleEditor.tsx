"use client"

import { Article, setArticleQuiz } from "@/app/services/articleService"
import MDEditor from "@uiw/react-md-editor"
import { useEffect, useState } from "react"
import ArticleRenderer from "../article-renderer/articleRenderer"
import ModalContainer from "../modal/modalContainer"
import QuizEditor from "./quizEditor"
import Modal from "../modal/modal"
import { Quiz, createQuiz, getQuiz, getQuizAnswers } from "@/app/services/quizService"
import { useQuery } from "@tanstack/react-query"

type Props = {
    article: Article
    sectionID: string
    editing: boolean
    onSave: (section: Article, sectionID: string) => void
    onCancel: () => void
}

export default function ArticleEditor(props: Props) {
    const DEFAULT_QUIZ: Quiz = {
        id: props.article.id + "-quiz",
        points: 1,
        questions: [
            {
                question: "Sample Question",
                options: ["a", "b", "c", "d"]
            }
        ]
    }

    let [article, setArticle] = useState<Article>(props.article)
    let [sectionID, setSectionID] = useState<string>(props.sectionID)
    let [sponsored, setSponsored] = useState(props.article.sponsor ? true : false)
    let [quizModal, setQuizModal] = useState<boolean>(false)
    let [hasQuiz, setHasQuiz] = useState<boolean>(false)

    useEffect(() => {
        console.log("effect!")
        setArticle(props.article)
        setSectionID(props.sectionID)
        setSponsored(props.article.sponsor ? true : false)
    }, [props.article, props.sectionID])


    const { data: quizAnswers, isLoading: loadingAnswers, error: answersLoadError } = useQuery({
        queryKey: ["quiz-ans", article.id + "-quiz"],
        queryFn: async () => getQuizAnswers(article.id + "-quiz"),
        enabled: !!article.quiz,
        initialData: []
    })

    const { data: quiz, isLoading: loadingQuiz, error: quizLoadError } = useQuery({
        queryKey: ["quiz", article.id + "-quiz"],
        queryFn: async () => getQuiz(article.id + "-quiz"),
        enabled: !!article.quiz,
        initialData: DEFAULT_QUIZ
    })

    useEffect(() => {
        if (props.article.quiz) {
            setHasQuiz(true)
        } else {
            setHasQuiz(false)
        }
    }, [props.article])

    function handleSponsor(sponsored: boolean) {
        setSponsored(sponsored)

        if (sponsored) {
            setArticle({ ...article, sponsor: props.article.sponsor })
        } else {
            setArticle({ ...article, sponsor: null })
        }
    }

    function handleSave(quiz: Quiz, answers: number[]) {
        if (quiz) {
            quiz.id = article.id + "-quiz"
            createQuiz(quiz, answers).then(() => {
                setArticleQuiz(props.article.id, props.sectionID, true, quiz.points).then(() => {
                    alert("Quiz successfully created")
                    setQuizModal(false)
                }).catch(err => console.log(err))
            }).catch(err => {
                alert("An error occured while creating the quiz, see console")
                console.log(err)
            })
        } else {
            setArticleQuiz(props.article.id, props.sectionID, false, 0)
        }
    }

    function deleteQuiz() {
        setArticleQuiz(props.article.id, props.sectionID, false, 0)
    }

    return <div className="flex flex-row w-full flex-1 h-[calc(100vh-7.5rem)]">
        {
            quizModal ? <ModalContainer>
                <Modal>
                    <QuizEditor quiz={quiz} editing={false} onCancel={() => setQuizModal(false)} answers={quizAnswers} onSave={handleSave} />
                </Modal>
            </ModalContainer> : ""
        }
        <div className="flex flex-col gap-2 p-2 bg-gray-900 border-r-2 border-r-slate-700 h-[calc(100vh-7.5rem)] overflow-y-scroll">
            <h1 className="text-xl font-bold">{props.editing ? "Edit Article" : "Create Article"}</h1>

            {!props.editing ? <div>
                <label>Article ID: </label>
                <input type="text" placeholder="ID" value={article.id} onChange={(e) => setArticle({ ...article, id: e.target.value })}></input>
            </div> : ""}

            <div>
                <label>Article Section ID: </label>
                <input type="text" placeholder="Section ID" value={props.sectionID} onChange={(e) => {
                    setSectionID(e.target.value)
                }}></input>
            </div>
            <p>Index of article in section: </p>
            <input type="number" value={article.index} onChange={e => setArticle({ ...article, index: parseInt(e.target.value) })} />

            <p>Article Title</p>
            <input type="text" placeholder="Title" value={article.title} onChange={(e) => setArticle({ ...article, title: e.target.value })}></input>

            <p>Description</p>
            <textarea value={article.description} onChange={e => setArticle({ ...article, description: e.target.value })}></textarea>

            <p>Tags (Comma separated)</p>
            <input type="text" value={article.tags.join(",")} onChange={(e) => setArticle({ ...article, tags: (e.target.value.split(",")) })}></input>

            <div>
                <label className="mr-2">Sponsored?</label><input type="checkbox" checked={sponsored} onChange={e => handleSponsor(e.target.checked)} />
            </div>

            {
                sponsored &&
                <div className="flex flex-col gap-2 p-2 bg-gray-800 rounded border-2 border-gray-700">
                    <p>Sponsor name</p>
                    <input type="text" placeholder="Sponsor name" value={article.sponsor ? article.sponsor.name : ""} onChange={(e) => setArticle({ ...article, sponsor: { ...article.sponsor, name: e.target.value } })}></input>
                    <p>Sponsor Image URL</p>
                    <input type="text" placeholder="Sponsor image URL" value={article.sponsor ? article.sponsor.imageUrl : ""} onChange={(e) => setArticle({ ...article, sponsor: { ...article.sponsor, imageUrl: e.target.value } })}></input>
                    <p>Sponsor Website URL</p>
                    <input type="text" placeholder="Sponsor website URL" value={article.sponsor ? article.sponsor.siteUrl : ""} onChange={(e) => setArticle({ ...article, sponsor: { ...article.sponsor, siteUrl: e.target.value } })}></input>
                    <p>Sponsor Message</p>
                    <input type="text" placeholder="e.g. Powered by XYZ" value={article.sponsor?.message || ""} onChange={(e) => setArticle({ ...article, sponsor: { ...article.sponsor, message: e.target.value } })} />
                </div>
            }
            <div className="flex flex-row gap-1">
                <button className="btn-secondary font-mono flex-1" onClick={() => setQuizModal(true)}> {hasQuiz ? "Edit Quiz" : "Create Quiz"} </button>
                {hasQuiz && <button className="btn-danger font-mono" onClick={() => deleteQuiz()}>Delete Quiz </button>}
            </div>
            <div className="flex flex-row gap-1">
                <button className="btn-primary font-mono flex-1" onClick={() => props.onSave(article, sectionID)}> {props.editing ? "Save" : "Create"} </button>
                <button className="btn-secondary font-mono" onClick={props.onCancel}> Cancel </button>
            </div>
        </div>
        <div className="flex-1 flex-col h-[calc(100vh-7.5rem)]">
            <MDEditor className="flex-1"
                value={article.content}
                height={"100%"}
                preview={"live"}
                onChange={(value) => setArticle({ ...article, content: value })}
                components={{
                    preview: (source, state, dispath) => {
                        return <div>
                            <h1 className={`text-4xl md:text-5xl font-bold mt-5`}>{article && article.title}</h1>
                            <p className={`font-mono mt-2 text-slate-300 text-sm`}>{article && article.description}</p>
                            <div className={`font-mono flex gap-2 mt-2`}>
                                {article && article.tags.map(tag => (
                                    <div key={tag} className="bg-sky-300 text-slate-950 p-1 rounded-sm text-xs font-bold">
                                        {tag}
                                    </div>
                                ))}
                            </div>
                            <ArticleRenderer markdown={source} />
                        </div>
                    }
                }}
            />
        </div>
    </div>
}
