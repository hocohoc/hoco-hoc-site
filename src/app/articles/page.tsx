"use client"

import { useState } from "react"
import { getAllArticles, getSections, Article } from "../services/articleService"
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link"
import "./page.css"
import { useQuery } from "@tanstack/react-query"
import { useProfile } from "../components/auth-provider/authProvider";
import ErrorPopup from "../components/error-popup/errorPopup";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

type PopulatedSection = {
    id: string,
    index: number,
    title: string,
    description: string,
    articles: Article[]
}

export default function Articles() {
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({}); // Track expanded state for each section

    const profile = useProfile()
    const { data: sections, isLoading, error, refetch } = useQuery({
        queryKey: ["pop-sections"],
        queryFn: fetchSections
    })

    async function fetchSections(): Promise<PopulatedSection[]> {
        let [sections, articles] = await Promise.all([getSections(), getAllArticles()])

        let hydrated: PopulatedSection[] = []

        sections.sort((a, b) => a.index - b.index)
        sections.forEach(section => {
            let sectionObj: PopulatedSection = {
                id: section.id,
                index: section.index,
                title: section.title,
                description: section.description,
                articles: [] as Article[]
            }
            sectionObj.articles = section.articles.map(article => articles.find(a => a.id == article.id)).sort(
                (a, b) => a.index - b.index
            )
            hydrated.push(sectionObj)
        })

        return hydrated
    }


    function toggleSectionExpansion(sectionId: string) {
        setExpandedSections(prevState => ({
            ...prevState,
            [sectionId]: !prevState[sectionId] // Toggle the state
        }));
    }

    function getSectionProgress(sectionID: string): { points: number; total: number; percent: number; } {
        let section = sections.find(s => s.id === sectionID)
        let totalPoints = section.articles.reduce((accum, cur) => {
            return accum + (cur.quiz ? cur.quiz.points : 0)
        }, 0)

        return {
            points: profile && profile.scores[section.id] ? profile.scores[section.id] : 0,
            total: totalPoints,
            percent: profile && profile.scores[section.id] ? profile.scores[section.id] / totalPoints : 0
        } as { points: number, total: number, percent: number }
    }

    function getOverallProgress(): { points: number; total: number; percent: number; } {
        let totalScore = 0
        let totalPts = 0
        for (let section of sections) {
            let prog = getSectionProgress(section.id)
            totalScore += prog.points
            totalPts += prog.total
        }

        return {
            points: totalScore,
            total: totalPts,
            percent: totalPts > 0 ? totalScore / totalPts : 0
        } as { points: number, total: number, percent: number }
    }

    function getArticleStatus(id: string): string {
        if (!profile) return "To-Do"

        if (profile.articlesCompletedID.includes(id)) {
            return "Done!"
        } else if (profile.articlesStartedID.includes(id)) {
            return "Started"
        } else {
            return "To-Do"
        }
    }


    return <main className="h-[calc(100vh-3.5rem-4rem)] overflow-hidden">
        {error ? <ErrorPopup error={error}>
            <p className="mb-4">An error occured while fetching articles and sections. Try again or contact us if the problem persists.</p>
            <button onClick={() => refetch()} type="button" className={`font-mono btn-secondary text-left`}> Try Again </button>
        </ErrorPopup> : ""}
        <div className="flex flex-col lg:flex-row h-full">
            <div className="lg:flex-1 p-4 lg:p-16 bg-gradient-to-tr from-sky-800 to-blue-800 border-r flex flex-col items-end border-r-slate-800">
                <div className="w-full h-full lg:max-w-xl flex flex-col">
                    <h1 className="font-bold text-3xl md:text-7xl mb-1 md:mb-3"> Articles </h1>
                    <p className="text-sm md:text-lg text-slate-400">
                        Complete articles to get points, which are transformed into raffle tickets and earns your school points!
                    </p>
                    <div className="flex-1 min-h-2 md:min-h-4" />
                    {!isLoading && !error && profile && <div className="rounded-md text-sm md:text-base border border-slate-800 bg-slate-950/50 p-2 md:p-4">
                        <div className="w-full rounded-full bg-slate-800 h-3 mb-2 overflow-hidden">
                            <div style={{ width: `${Math.round(getOverallProgress().percent * 100)}%` }} className={`h-full bg-sky-300`} />
                        </div>
                        <p> Earned {getOverallProgress().points}/{getOverallProgress().total} total points.</p>
                    </div>}
                    {!profile && <div className="rounded-md text-sm md:text-base border border-slate-800 bg-slate-950/50 p-2 md:p-4">
                        Sign in to see your progress here!
                    </div>}
                </div>
            </div>
            <div className="flex-1 flex flex-col h-1/2 lg:h-full">
                <div className="flex flex-col w-full lg:max-w-xl bg-slate-800/70 h-full overflow-y-scroll">
                    {isLoading && <div className="w-full h-full flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-sky-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>}
                    {!isLoading && !error && sections.map((section, index) => {
                        return (
                            <div key={index} className="flex flex-col w-full">
                                <button
                                    type="button"
                                    onClick={() => toggleSectionExpansion(section.id)}
                                    className={`text-left z-[20] w-full p-4 border-b border-r drop-shadow-2xl bg-slate-800 ${!expandedSections[section.id] ? " border-slate-700" : "border-b-4 border-r-slate-700 border-b-sky-300"} ease-in-out duration-300`}
                                    aria-expanded={Boolean(expandedSections[section.id])}
                                    aria-controls={`section-${section.id}`}
                                >
                                    <div className="flex gap-2 items-center">
                                        <h2 className="font-bold flex-1 font-mono text-xl md:text-2xl">{section.title}</h2>
                                        <ChevronDownIcon className={`h-6 w-6 duration-300 ease-in-out ${expandedSections[section.id] ? 'rotate-180' : 'rotate-0'}`} />
                                    </div>
                                    <p className="pt-4">{section.description}</p>
                                    {profile && <div className="w-full rounded-full bg-slate-700 h-2 mt-4 overflow-hidden">
                                        <div style={{ width: `${Math.round(getSectionProgress(section.id).percent * 100)}%` }} className={`h-full bg-sky-300`} />
                                    </div>}
                                    {profile && <p className="font-mono text-sm text-slate-400 mt-2">Earned {getSectionProgress(section.id).points}/{getSectionProgress(section.id).total} section points</p>}
                                </button>
                                <AnimatePresence>
                                    {expandedSections[section.id] && (
                                        <motion.div
                                            key={`${section.id}-panel`}
                                            id={`section-${section.id}`}
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div>
                                                {section.articles.map((article, articleIndex) => (
                                                    <motion.div key={articleIndex}
                                                        initial={{ y: -50, opacity: 0 }}
                                                        animate={{ y: 0, opacity: 1 }}
                                                        exit={{ y: -50, opacity: 0 }}
                                                        transition={{ delay: articleIndex / 40 }}
                                                    >
                                                        <Link href={`/articles/read?article=${article.id}`} passHref>
                                                            <div className="content-box flex bg-slate-700/50 flex-col justify-left cursor-pointer p-4 border-b border-r hover:border-b-sky-300 ease-in-out duration-75 hover:shadow-xl border-slate-700">
                                                                <div className="flex flex-row gap-2 items-start justify-left">
                                                                    <div className="text-xl flex-1 font-bold">{article.title}</div>
                                                                    <div className="p-1 font-mono bg-sky-300 rounded-sm text-slate-900 text-xs md:text-sm">
                                                                        {getArticleStatus(article.id)}
                                                                    </div>
                                                                    <div className="flex p-1 items-center justify-center bg-slate-600 font-mono rounded-sm text-xs md:text-sm">
                                                                        {
                                                                            article.quiz ? `${article.quiz.points}pts` : "NQ"
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <div className="flex flex-row gap-2 mt-2">
                                                                    {article.tags.map((tag, tagIndex) => (
                                                                        <div key={tagIndex} className="p-1 text-xs bg-sky-300 text-slate-900 font-mono rounded-sm"> {tag} </div>
                                                                    ))}
                                                                </div>
                                                                <div className="mt-2">
                                                                    <p className="text-slate-400"> {article.description}</p>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    </main>
}
