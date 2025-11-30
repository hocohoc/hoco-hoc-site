"use client"

import { Article, setArticleQuiz } from "@/app/services/articleService"
import { LOCAL_VIDEOS } from "@/app/data/localVideos"
import MDEditor from "@uiw/react-md-editor"
import { useEffect, useId, useState } from "react"
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
    const articleIdFieldId = useId();
    const sectionIdFieldId = useId();
    const indexFieldId = useId();
    const titleFieldId = useId();
    const descriptionFieldId = useId();
    const tagsFieldId = useId();
    const sponsorToggleId = useId();
    const sponsorNameId = useId();
    const sponsorImageId = useId();
    const sponsorSiteId = useId();
    const sponsorMessageId = useId();
    const videoUrlId = useId();
    const videoTypeId = useId();

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
            setArticle({ ...article, sponsor: props.article.sponsor ?? { name: "", imageUrl: "", siteUrl: "", message: "" } })
        } else {
            setArticle({ ...article, sponsor: null })
        }
    }

    function renderVideo(video?: { url: string, type?: string }) {
        if (!video || !video.url) return null;

        const url = video.url.trim();

        const youtubeMatch = url.match(/(?:v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{6,})/);
        if ((video.type === "youtube" || (!video.type && youtubeMatch)) && youtubeMatch) {
            const id = youtubeMatch[1];
            const embed = `https://www.youtube.com/embed/${id}`;
            return <div className="my-4">
                <iframe src={embed} title="article-video" className="w-full aspect-video rounded" allowFullScreen />
            </div>
        }

        if (video.type === "mp4" || url.toLowerCase().endsWith(".mp4")) {
            return <div className="my-4">
                <video controls className="w-full rounded">
                    <source src={url} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
        }

        // default: embed via iframe
        return <div className="my-4">
            <iframe src={url} title="article-video" className="w-full aspect-video rounded" allowFullScreen />
        </div>
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
            quizModal ? <ModalContainer labelledBy="quiz-editor-heading" onDismiss={() => setQuizModal(false)}>
                <Modal>
                    <h2 id="quiz-editor-heading" className="text-xl font-bold mb-2">{hasQuiz ? "Edit Quiz" : "Create Quiz"}</h2>
                    <QuizEditor quiz={quiz} editing={false} onCancel={() => setQuizModal(false)} answers={quizAnswers} onSave={handleSave} />
                </Modal>
            </ModalContainer> : ""
        }
        <div className="flex flex-col gap-2 p-2 bg-gray-900 border-r-2 border-r-slate-700 h-[calc(100vh-7.5rem)] overflow-y-scroll">
            <h1 className="text-xl font-bold">{props.editing ? "Edit Article" : "Create Article"}</h1>

            {!props.editing ? <div>
                <label className="block" htmlFor={articleIdFieldId}>Article ID</label>
                <input id={articleIdFieldId} type="text" placeholder="ID" value={article.id} onChange={(e) => setArticle({ ...article, id: e.target.value })}></input>
            </div> : ""}

            <div>
                <label className="block" htmlFor={sectionIdFieldId}>Article Section ID</label>
                <input id={sectionIdFieldId} type="text" placeholder="Section ID" value={sectionID} onChange={(e) => {
                    setSectionID(e.target.value)
                }}></input>
            </div>
            <label className="block" htmlFor={indexFieldId}>Index of article in section</label>
            <input id={indexFieldId} type="number" value={article.index ?? 0} onChange={e => setArticle({ ...article, index: Number(e.target.value) })} />

            <label className="block" htmlFor={titleFieldId}>Article Title</label>
            <input id={titleFieldId} type="text" placeholder="Title" value={article.title} onChange={(e) => setArticle({ ...article, title: e.target.value })}></input>

            <label className="block" htmlFor={descriptionFieldId}>Description</label>
            <textarea id={descriptionFieldId} value={article.description} onChange={e => setArticle({ ...article, description: e.target.value })}></textarea>

            <label className="block" htmlFor={tagsFieldId}>Tags (Comma separated)</label>
            <input id={tagsFieldId} type="text" value={article.tags.join(",")} onChange={(e) => setArticle({ ...article, tags: (e.target.value.split(",")) })}></input>

            <label className="block mt-2" htmlFor={videoUrlId}>Video URL (optional)</label>
            <input id={videoUrlId} type="text" placeholder="https://..." value={article.video?.url || ""} onChange={(e) => setArticle({ ...article, video: e.target.value ? { ...(article.video || {}), url: e.target.value } : undefined })} />

            <label className="block mt-2">Or choose a local video</label>
            <select className="mb-2" value={article.video?.url || ""} onChange={(e) => {
                const val = e.target.value;
                if (!val) {
                    setArticle({ ...article, video: undefined })
                } else {
                    setArticle({ ...article, video: { ...(article.video || {}), url: val, type: 'mp4' } })
                }
            }}>
                <option value="">(none)</option>
                {LOCAL_VIDEOS.map(v => <option key={v} value={v}>{v.replace('/videos/','')}</option>)}
            </select>

            <label className="block mt-2" htmlFor={videoTypeId}>Video Type (optional)</label>
            <select id={videoTypeId} value={article.video?.type || ""} onChange={(e) => setArticle({ ...article, video: { ...(article.video || { url: "" }), type: e.target.value } })}>
                <option value="">Auto</option>
                <option value="youtube">YouTube</option>
                <option value="mp4">MP4</option>
                <option value="iframe">Embed</option>
            </select>

            <div>
                <input id={sponsorToggleId} type="checkbox" className="mr-2" checked={sponsored} onChange={e => handleSponsor(e.target.checked)} />
                <label htmlFor={sponsorToggleId}>Sponsored?</label>
            </div>

            {
                sponsored &&
                <div className="flex flex-col gap-2 p-2 bg-gray-800 rounded border-2 border-gray-700">
                    <label className="block" htmlFor={sponsorNameId}>Sponsor name</label>
                    <input id={sponsorNameId} type="text" placeholder="Sponsor name" value={article.sponsor ? article.sponsor.name : ""} onChange={(e) => setArticle({ ...article, sponsor: { ...article.sponsor, name: e.target.value } })}></input>
                    <label className="block" htmlFor={sponsorImageId}>Sponsor Image URL</label>
                    <input id={sponsorImageId} type="text" placeholder="Sponsor image URL" value={article.sponsor ? article.sponsor.imageUrl : ""} onChange={(e) => setArticle({ ...article, sponsor: { ...article.sponsor, imageUrl: e.target.value } })}></input>
                    <label className="block" htmlFor={sponsorSiteId}>Sponsor Website URL</label>
                    <input id={sponsorSiteId} type="text" placeholder="Sponsor website URL" value={article.sponsor ? article.sponsor.siteUrl : ""} onChange={(e) => setArticle({ ...article, sponsor: { ...article.sponsor, siteUrl: e.target.value } })}></input>
                    <label className="block" htmlFor={sponsorMessageId}>Sponsor Message</label>
                    <input id={sponsorMessageId} type="text" placeholder="e.g. Powered by XYZ" value={article.sponsor?.message || ""} onChange={(e) => setArticle({ ...article, sponsor: { ...article.sponsor, message: e.target.value } })} />
                </div>
            }
            <div className="flex flex-row gap-1">
                <button className="btn-secondary font-mono flex-1" type="button" onClick={() => setQuizModal(true)}> {hasQuiz ? "Edit Quiz" : "Create Quiz"} </button>
                {hasQuiz && <button className="btn-danger font-mono" type="button" onClick={() => deleteQuiz()}>Delete Quiz </button>}
            </div>
            <div className="flex flex-row gap-1">
                <button className="btn-primary font-mono flex-1" type="button" onClick={() => props.onSave(article, sectionID)}> {props.editing ? "Save" : "Create"} </button>
                <button className="btn-secondary font-mono" type="button" onClick={props.onCancel}> Cancel </button>
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
                            {renderVideo(article.video)}
                            <ArticleRenderer markdown={source} />
                        </div>
                    }
                }}
            />
        </div>
    </div>
}
