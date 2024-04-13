"use client"

import { useState } from "react"
import { getAllArticles, getSections, Article } from "../services/articleService"
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link"
import "./page.css"
import { useQuery } from "@tanstack/react-query"
import { useProfile } from "../components/auth-provider/authProvider";
import ErrorPopup from "../components/error-popup/errorPopup";

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
            sectionObj.articles = section.articles.map(article => articles.find(a => a.id == article.id))
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

    return <main className="h-[calc(100vh-3.5rem-4rem)] overflow-hidden">
        {error ? <ErrorPopup error={error}>
            <p className="mb-4">An error occured while fetching articles and sections. Try again or contact us if the problem persists.</p>
            <button onClick={() => refetch()} className={`font-mono btn-secondary text-left`}> Try Again </button>
        </ErrorPopup> : ""}
        <div className="flex flex-col lg:flex-row h-full">
            <div className="lg:flex-1 p-10 lg:p-16 bg-gradient-to-tr from-sky-800 to-blue-800 border-r flex flex-col items-end border-r-slate-800">
                <div className="w-full h-full lg:max-w-xl flex flex-col">
                    <h1 className="font-bold text-6xl md:text-7xl mb-3"> Articles </h1>
                    <p className="text-lg text-slate-400">
                        Complete articles to get points, which are transformed into raffle tickets and earns your school points!
                    </p>
                    <div className="flex-1 min-h-4" />
                    {!isLoading && !error && <div className="rounded-md border border-slate-800 bg-slate-950/50 p-4">
                        <div className="w-full rounded-full bg-slate-800 h-3 mb-2 overflow-hidden">
                            <div style={{ width: `${Math.round(getOverallProgress().percent * 100)}%` }} className={`h-full bg-sky-400`} />
                        </div>
                        <p> Earned {getOverallProgress().points}/{getOverallProgress().total} total points.</p>
                    </div>}
                </div>
            </div>
            <div className="flex-1 p-10 lg:px-10 lg:py-16 flex flex-col overflow-y-scroll">
                {isLoading && <div className="w-full h-full flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-sky-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>}
                {!isLoading && !error && sections.map((section, index) => {
                    return (
                        <div key={index} className="flex flex-col w-full lg:max-w-xl">
                            <div
                                onClick={() => toggleSectionExpansion(section.id)} className="hover:-translate-y-2 z-20 bg-slate-800 cursor-pointer p-4 rounded-lg border border-slate-700 mb-4 ease-in-out duration-300 hover:shadow-xl hover:shadow-sky-500/20">
                                <p className="font-bold font-mono text-2xl">{section.title}</p>
                                <p className="pt-4">{section.description}</p>
                                <div className="w-full rounded-full bg-slate-700 h-3 mt-4 overflow-hidden">
                                    <div style={{ width: `${Math.round(getSectionProgress(section.id).percent * 100)}%` }} className={`h-full bg-emerald-400`} />
                                </div>
                            </div>
                            <AnimatePresence>
                                {expandedSections[section.id] &&
                                    section.articles.map((article, articleIndex) => (
                                        <motion.div key={articleIndex}
                                            initial={{ y: -100, height: 0, opacity: 0 }}
                                            animate={{ y: 0, height: 'auto', opacity: 1 }}
                                            exit={{ y: -100, height: 0, opacity: 0 }}
                                            transition={{ delay: articleIndex / 40 }}
                                        >
                                            <Link href={`/articles/read?article=${article.id}`} passHref>
                                                <div className="flex justify-left hover:-translate-y-2 cursor-pointer p-4 rounded-lg border mb-4 ease-in-out duration-300 hover:shadow-xl border-slate-700">
                                                    <div>
                                                        <div className="flex flex-row ml-3 justify-left">
                                                            <div className="text-xl font-mono">{article.title}</div>
                                                            <div className="ml-3 pl-2 pr-2 h-1/6 bg-cyan-500 rounded-lg">
                                                                To-Do
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-row mt-2 ">
                                                            {article.tags.map((tag, tagIndex) => (
                                                                <div key={tagIndex} className="ml-3 pl-2 pr-2 bg-cyan-500 rounded-lg"> {tag} </div>
                                                            ))}
                                                        </div>
                                                        <div className="ml-3 mt-2">
                                                            <p className="text-lg text-slate-400"> {article.description}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
        </div>
    </main>
}
