"use client"

import { useProfile } from "@/app/components/auth-provider/authProvider"
import DeleteContentButton from "@/app/components/admin/deleteContentButton";
import { Article, Section, deleteArticle, deleteSection, getAllArticles, getSections } from "@/app/services/articleService";
import Link from "next/link";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline"
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function AdminContentPage() {
    let profile = useProfile()
    const queryClient = useQueryClient()
    const { data: sections, isLoading: loadingSections, error: sectionLoadErr } = useQuery({
        queryKey: ["sections"],
        queryFn: getSections,
    })

    const { data: articles, isLoading: loadingArticles, error: articleLoadErr } = useQuery({
        queryKey: ["articles"],
        queryFn: getAllArticles,
    })

    function articlesForSection(section: Section): Article[] {
        if (articles) {
            return articles.filter(article => {
                let found = section.articles.find((ref) => ref.id == article.id)
                return found ? true : false
            })
        } else {
            return []
        }
    }

    async function handleDeleteArticle(article: Article, section: Section) {
        await deleteArticle(article.id, section.id)
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: ["articles"] }),
            queryClient.invalidateQueries({ queryKey: ["sections"] })
        ])
    }

    async function handleDeleteSection(section: Section) {
        await deleteSection(section.id)
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: ["articles"] }),
            queryClient.invalidateQueries({ queryKey: ["sections"] })
        ])
    }

    return <main>

        {
            (profile && profile.admin) ?
                <div className="w-full h-auto flex justify-center">
                    <div className="max-w-3xl w-full h-full p-4 flex flex-col gap-2">
                        <div className="p-2 bg-amber-400 text-slate-900 rounded flex items-center gap-2">
                            <ExclamationCircleIcon className="w-16 h-16" />
                            <p><span className="font-bold">Warning:</span> Changes made here will impact content on the site! Make sure to double-check your edits and backup work if necesssary. <span className="font-bold">Changes can not be undone easily if at all!</span> </p>
                        </div>
                        <h1 className="font-bold text-2xl">Manage Content</h1>
                        <Link href={`/admin/content/section`} className="btn-primary font-mono">Add New Section</Link>
                        {(sectionLoadErr || articleLoadErr) && <p className="rounded border border-red-400/60 bg-red-950/50 p-3 text-red-200" role="alert">The content list could not be loaded. Please refresh and try again.</p>}
                        {!loadingSections && !loadingArticles && !sectionLoadErr && !articleLoadErr && sections.length === 0 && <p className="rounded border border-slate-700 bg-slate-800 p-4 text-slate-300">No sections yet. Add one to get started.</p>}
                        {!loadingSections && !loadingArticles && !sectionLoadErr && !articleLoadErr && [...sections].sort(
                            (a, b) => a.index - b.index
                        ).map(section => {
                            const sectionArticles = articlesForSection(section).sort((a, b) => a.index - b.index)
                            const ownedArticleCount = articles.filter(article => article.sectionID === section.id).length

                            return <div key={section.id} className="border-2 border-slate-700 rounded">
                                <div className="flex flex-row flex-wrap items-center bg-slate-800 gap-2 p-2 border-b-2 border-b-slate-700">
                                    <div className="mr-auto min-w-0">
                                        <p className="font-bold truncate">{section.title}</p>
                                        <span className="font-mono text-xs text-slate-400">{sectionArticles.length} {sectionArticles.length === 1 ? "article" : "articles"}</span>
                                    </div>
                                    <Link href={`/admin/content/section?id=${section.id}`} className="btn-secondary font-mono ml-auto text-sm">Edit Section</Link>
                                    <Link href={`/admin/content/article?section=${section.id}`} className="btn-secondary font-mono text-sm">Add Article</Link>
                                    <DeleteContentButton
                                        itemType="section"
                                        itemName={section.title}
                                        compact
                                        warning={`${ownedArticleCount} ${ownedArticleCount === 1 ? "article" : "articles"} owned by this section and their quiz data will also be deleted. This cannot be undone.`}
                                        onDelete={() => handleDeleteSection(section)}
                                    />
                                </div>
                                <div className="bg-slate-800 space-y-1">
                                    {sectionArticles.length === 0 && <p className="p-3 text-sm text-slate-400">No articles in this section.</p>}
                                    {sectionArticles.map(article => {
                                        return <div key={article.id} className="flex items-center border-b-2 border-b-slate-700 p-2">
                                            <div className="flex-1">
                                                <p>{article.title}</p>
                                                <span className="font-mono text-xs">(ID: {article.id}, index: {article.index})</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Link href={`/admin/content/article?section=${section.id}&id=${article.id}`} className="btn-secondary font-mono text-sm">
                                                    Edit
                                                </Link>
                                                <DeleteContentButton
                                                    itemType="article"
                                                    itemName={article.title}
                                                    compact
                                                    onDelete={() => handleDeleteArticle(article, section)}
                                                />
                                            </div>
                                        </div>
                                    })}
                                </div>

                            </div>
                        })}
                    </div>
                </div> :
                <p className="p-2">You don&apos;t have admin permissions. If you think this is a mistake, contact us.</p>
        }
    </main>
}
