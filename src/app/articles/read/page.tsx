"use client"

import { getArticleFromID, Article, incrementViewCount } from "@/app/services/articleService"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import Skeleton from 'react-loading-skeleton'
import { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import Link from "next/link"
import { useProfile, useProfileUpdate } from "@/app/components/auth-provider/authProvider";
import Image from "next/image";

import { EyeSlashIcon, CheckCircleIcon } from "@heroicons/react/24/solid"
import ArticleRenderer from "@/app/components/article-renderer/articleRenderer";
import { Profile, signInOrRegister, updateCompletedArticles, updateStartedArticles } from "@/app/services/userService"
import { checkAnswers, getQuiz } from "@/app/services/quizService"
import QuizPrompt from "@/app/components/quiz/Quiz"
import Confetti from "react-confetti"
import { incrementHoursServed } from "@/app/services/statsService"
import { useQuery } from "@tanstack/react-query"
import ErrorPopup from "@/app/components/error-popup/errorPopup"

export default function Read() {
    const params = useSearchParams()
    let [windowSize, setWindowSize] = useState({ width: 100, height: 100 })

    let [quizError, setQuizError] = useState<"not-authenticated" |
        "contest-not-live" | "already-completed"
        | "error" | undefined>(undefined)

    let [showSponsor, setShowSponsor] = useState(true)
    let [visited, setVisited] = useState(false)
    let [progress, setProgress] = useState<"started" | "complete">("started")
    let [enterTime, setEnterTime] = useState<Date>(undefined)

    let [quizCheckWorking, setQuizCheckWorking] = useState<boolean>(false)
    let [wrongAns, setWrongAns] = useState<number[]>([])
    let [confetti, setConfetti] = useState<boolean>(false)

    let profile = useProfile()
    let setProfile = useProfileUpdate()

    const { data: article, isLoading: loadingArticle, error: articleLoadError } = useQuery({
        queryKey: ["article", params.get("article")],
        queryFn: async () => getArticleFromID(params.get("article")),
        enabled: !!params.get("article")
    })

    const { data: quiz, isLoading: loadingQuiz, error: quizLoadError } = useQuery({
        queryKey: ["quiz", article && article.id + "-quiz"],
        queryFn: async () => getQuiz(article.id + "-quiz"),
        enabled: (article != undefined && article.quiz != undefined)
    })

    useEffect(() => {
        if (!enterTime) {
            setEnterTime(new Date())
        }

        if (!visited) {
            incrementViewCount()
                .then(() => console.log("View count incremented"))
                .catch(err => {
                    console.log("Couldn't increment view count, failing gracefully!")
                    console.log(err)
                })
            setVisited(false)
        }

        return () => {
            if (enterTime) {
                const now = new Date()
                const delta = now.getTime() - enterTime.getTime();
                console.log("Time spent (s): " + (delta / 1000))
                incrementHoursServed(delta / 1000).then(() => {
                    console.log("Incremented hours served by " +
                        (delta / 1000) + "seconds")
                }).catch(err => {
                    console.log("Failed to increment hours served!")
                    console.log(err)
                })
            }
        }
    }, [visited, enterTime])

    useEffect(() => {
        const addArticleStarted = (a: Article) => {
            profile.articlesStartedID.push(a.id)
            setProfile(profile)
        }

        if (article && profile && profile.articlesCompletedID.includes(article.id)) {
            setProgress("complete")
        } else {
            if (article && profile && !profile.articlesStartedID.includes(article.id)) {
                updateStartedArticles(profile.uid, article.id).then(() => {
                    addArticleStarted(article)
                    console.log(profile)
                }).catch((err) => {
                    console.log("Failed to update started articles, failing gracefully.")
                    console.log(err)
                })
            } else {
                setProgress("started");
            }
        }
    }, [profile, article, setProfile])

    useEffect(() => {
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight
        })
    }, [])

    function markArticleComplete(updateDB: boolean) {
        let newProfile: Profile = {
            ...profile
        }
        const articleIndex = profile.articlesStartedID.indexOf(article.id)
        if (articleIndex != -1) {
            newProfile.articlesStartedID.splice(articleIndex, 1)
        }
        if (!newProfile.articlesCompletedID.includes(article.id)) {
            newProfile.articlesCompletedID.push(article.id)
        }
        if (updateDB) {
            updateCompletedArticles(profile.uid, article.id)
                .then(() => console.log("Updated completed articles in firebase!"))
                .catch(err => console.log("Error while updating completed: " + err))
        }
        if (newProfile.scores[article.sectionID]) {
            newProfile.scores[article.sectionID] += article.quiz ? article.quiz.points : 0
        } else {
            newProfile.scores[article.sectionID] = article.quiz ? article.quiz.points : 0
        }
        console.log("NEW PROFILE:")
        console.log(newProfile)

        setProfile(newProfile)
        setProgress("complete")
        setWrongAns([])
        setConfetti(true)
        setTimeout(() => setConfetti(false), 7000)
    }


    async function handleQuizSubmit(answers: number[]) {
        setQuizCheckWorking(true)
        const quizID = article.id + "-quiz";
        const checkerResponse = await checkAnswers(quizID, article.id,
            article.sectionID, profile.uid, answers);
        console.log(checkerResponse)
        setQuizCheckWorking(false)
        switch (checkerResponse.verdict) {
            case "correct":
                markArticleComplete(false)
                break;
            case "incorrect":
                const incorrect = checkerResponse.wrong_ans;
                setWrongAns(incorrect)
                break;
            case "not-authenticated":
            case "error":
            case "already-completed":
            case "contest-not-live":
            default:
                setQuizError(checkerResponse.verdict)
                break;
        }
        // setQuizError("contest-not-live")
    }

    return <main className="flex flex-col items-center h-auto">
        {articleLoadError ?
            <ErrorPopup error={articleLoadError}>
                <p className="mb-4">A error occurred while fetching this article. This is most likely because the article you requested does not exist. Try going back to the articles and sections page to find an existing article. If the problem persists, contact us.</p>
                <Link href={"/articles"} className={`font-mono btn-secondary`}> Go back to articles page </Link>
            </ErrorPopup>
            : ""
        }
        {quizLoadError ?
            <ErrorPopup error={quizLoadError}>
                <p className="mb-4">A error occurred while fetching the quiz for this article. This is probably a problem on our end, contact us.</p>
                <Link href={"/articles"} className={`font-mono btn-secondary`}> Go back to articles page </Link>
            </ErrorPopup>
            : ""
        }
        {
            quizError &&
            <ErrorPopup error={new Error(quizError)}>
                <p className="mb-4">An error occurred while trying to submit your quiz.</p>
                <button onClick={() => setQuizError(undefined)} className="btn-secondary font-mono">Close</button>
            </ErrorPopup>
        }
        {
            confetti && <Confetti className="fixed top-0 left-0" numberOfPieces={500} recycle={false} style={{ position: "fixed" }} width={windowSize.width} height={windowSize.height} />
        }
        <div className="max-w-3xl w-full h-full p-4">
            <SkeletonTheme baseColor="#1e293b" highlightColor="#64748b">

                {(!loadingArticle && article && article.sponsor && showSponsor) ?
                    <div className="bg-slate-300 text-slate-950 p-4 rounded">
                        <div className="flex flex-row items-center">
                            <h1 className="text-xl flex-1">Sponsored by {article.sponsor.name}</h1>
                            <button className="p-1 rounded" onClick={() => setShowSponsor(false)}><EyeSlashIcon className="h-5 w-5" /></button>
                        </div>
                        <a href={article.sponsor.siteUrl} target="_blank"> <Image width={100} height={100} className="max-h-40 w-auto mt-2" alt={"Sponsor Logo"} src={article.sponsor.imageUrl} /></a>
                        {article.sponsor.message && (
                            <p className="mt-2">{article.sponsor.message}</p>
                        )}
                    </div> : ""
                }

                <div className="flex flex-row mt-5 items-center gap-2">
                    <h1 className={`text-4xl md:text-5xl font-bold flex-1`}>{!loadingArticle && article ? article.title : <Skeleton width={"10ch"} />}</h1>
                    {(!loadingArticle && profile) && <span className={`bg-sky-300 text-slate-950 rounded p-2 text-sm font-mono flex gap-2 items-center font-bold`}> {progress} {progress == "complete" && <CheckCircleIcon height={10} width={15} className="h-7 w-7" />}</span>}
                </div>
                <p className={`font-mono mt-2 text-slate-300 text-sm`}>{!loadingArticle && article ? article.description : <Skeleton />}</p>
                <div className={`font-mono flex gap-2 mt-2`}>
                    {!loadingArticle && article ? article.tags.map(tag => (
                        <div key={tag} className="bg-sky-300 text-slate-950 p-1 rounded-sm text-xs font-bold">
                            {tag}
                        </div>
                    )) : <Skeleton containerClassName="flex-1" />}
                </div>
                <hr className="mt-3 border-b border-slate-600" />

                {
                    !loadingArticle && article ?
                        <ArticleRenderer markdown={article.content} profile={profile} /> :
                        <div>
                            <p className="mt-5"><Skeleton className="mt-2" count={5} /></p>
                            <Skeleton className="my-4" height={200} />
                            <p><Skeleton className="mt-2" count={7} /></p>
                            <Skeleton className="my-4" height={200} />
                        </div>
                }

            </SkeletonTheme>
            <hr className="mt-6 border-b border-slate-600" />
        </div>
        <div className="max-w-3xl w-full h-full p-4 flex flex-col gap-2">
            {profile && (
                (!loadingQuiz && quiz) ? <QuizPrompt quiz={quiz} onSumbit={handleQuizSubmit} working={quizCheckWorking} completed={progress == "complete"} wrongAns={wrongAns} /> :
                    (!loadingQuiz && progress != "complete") ? <button className="btn-primary font-mono w-full" onClick={() => markArticleComplete(true)}>Mark Article Completed</button> : ""
            )}
            {
                !loadingQuiz && !quiz && progress == "complete" ? <div className="flex items-center justify-center p-3 border-2 border-emerald-400 rounded bg-emerald-400/30 font-mono gap-2 font-bold text-lg">
                    <CheckCircleIcon height={10} width={15} className="h-7 w-7 text-emerald-300" />
                    <p className="text-2xl">Complete</p>
                </div> : ""
            }
            {!profile && (
                <div className="flex gap-4 flex-col md:flex-row md:items-center pb-4">
                    <div className="">
                        <h1 className="font-bold text-2xl"> Log in to complete quizzes and track your progress! </h1>
                    </div>
                    <div className="min-w-48">
                        <button className="font-mono btn-primary w-full" onClick={() => signInOrRegister()}> Log in / Sign up </button>
                    </div>
                </div>
            )}
        </div>
    </main >
}
