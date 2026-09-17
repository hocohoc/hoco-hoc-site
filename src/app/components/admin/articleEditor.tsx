"use client"

import ArticleVideo from "../article-renderer/articleVideo"
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
import DeleteContentButton from "./deleteContentButton"

type Props = {
    article: Article
    sectionID: string
    editing: boolean
    onSave: (section: Article, sectionID: string) => void
    onCancel: () => void
    onDelete?: () => Promise<void>
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
    const localVideoId = useId();
    const captionsId = useId();
    const transcriptId = useId();
    const descriptionVideoId = useId();
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

    return <div className="flex flex-col lg:flex-row w-full flex-1 min-h-[calc(100vh-7.5rem)]">
        {
            quizModal ? <ModalContainer labelledBy="quiz-editor-heading" onDismiss={() => setQuizModal(false)}>
                <Modal>
                    <h2 id="quiz-editor-heading" className="text-xl font-bold mb-2">{hasQuiz ? "Edit Quiz" : "Create Quiz"}</h2>
                    <QuizEditor quiz={quiz} editing={false} onCancel={() => setQuizModal(false)} answers={quizAnswers} onSave={handleSave} />
                </Modal>
            </ModalContainer> : ""
        }
        <div className="flex flex-col gap-2 p-2 bg-gray-900 border-r-2 border-r-slate-700 lg:max-w-sm lg:h-[calc(100vh-7.5rem)] overflow-y-auto">
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
            <details className="border border-slate-500 rounded p-3">
                <summary className="cursor-pointer font-semibold">Accessibility before publishing</summary>
                <ul className="list-disc pl-5 space-y-2 mt-2 text-sm">
                    <li>Use headings in order and descriptive link text.</li>
                    <li>Describe meaningful images in Markdown: ![description](image URL). Use an empty description only for decoration. Explain instructional screenshots in the lesson text.</li>
                    <li>Provide accurate captions for spoken video, an equivalent transcript, and audio description for important visuals missing from the narration.</li>
                    <li>Check the preview using the keyboard, enlarged text, and a narrow screen before saving.</li>
                </ul>
            </details>

            <label className="block" htmlFor={tagsFieldId}>Tags (Comma separated)</label>
            <input id={tagsFieldId} type="text" value={article.tags.join(",")} onChange={(e) => setArticle({ ...article, tags: (e.target.value.split(",")) })}></input>

            <label className="block mt-2" htmlFor={videoUrlId}>Video URL (optional)</label>
            <input id={videoUrlId} type="text" placeholder="https://..." value={article.video?.url || ""} onChange={(e) => setArticle({ ...article, video: e.target.value ? { ...(article.video || {}), url: e.target.value } : undefined })} />

            <label className="block mt-2" htmlFor={localVideoId}>Or choose a local video</label>
            <select id={localVideoId} className="mb-2" value={article.video?.url || ""} onChange={(e) => {
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

            {article.video?.url && <fieldset className="flex flex-col gap-2 border border-slate-500 rounded p-3 my-3">
                <legend>Video accessibility</legend>
                <label htmlFor={captionsId}>English captions URL (WebVTT file for MP4 videos)</label>
                <input id={captionsId} type="text" value={article.video.captionsUrl || ""} onChange={e => setArticle({ ...article, video: { ...article.video, captionsUrl: e.target.value } })} />
                <label htmlFor={transcriptId}>Video transcript</label>
                <textarea id={transcriptId} value={article.video.transcript || ""} onChange={e => setArticle({ ...article, video: { ...article.video, transcript: e.target.value } })} />
                <label htmlFor={descriptionVideoId}>Audio-described video URL</label>
                <input id={descriptionVideoId} type="text" value={article.video.audioDescriptionUrl || ""} onChange={e => setArticle({ ...article, video: { ...article.video, audioDescriptionUrl: e.target.value } })} />
                <p className="text-sm text-slate-300">Review captions for accuracy and include meaningful visual information in the transcript. YouTube captions are managed on YouTube. A transcript does not replace required audio description.</p>
            </fieldset>}

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
            {props.editing && props.onDelete && <DeleteContentButton
                itemType="article"
                itemName={article.title}
                onDelete={props.onDelete}
            />}
        </div>
        <div className="min-w-0 flex-1 flex-col h-[calc(100vh-7.5rem)]" data-color-mode="dark">
            <MDEditor className="flex-1"
                textareaProps={{ "aria-label": "Article content in Markdown" }}
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
                            {<ArticleVideo video={article.video} title={article.title} />}
                            <ArticleRenderer markdown={source} />
                        </div>
                    }
                }}
            />
        </div>
    </div>
}
