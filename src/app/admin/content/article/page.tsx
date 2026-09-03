"use client"
import ArticleEditor from "@/app/components/admin/articleEditor"
import { useProfile } from "@/app/components/auth-provider/authProvider"
import { Article, createArticle, deleteArticle, getArticleFromID, } from "@/app/services/articleService"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"

export default function AdminArticleEditPage() {
    const placeHolderID = "[REPLACE WITH THE ID YOU WANT]";
    const defaultArticle: Article = {
        index: 1,
        id: placeHolderID,
        title: "Untitled article",
        description: "Description...",
        content: "Some content...",
        sectionID: "placeholder_section_id",
        tags: []
    }

    let profile = useProfile()
    const router = useRouter()
    const queryClient = useQueryClient()
    const params = useSearchParams()
    let [editing, setEditing] = useState(false);

    const { data: article, isLoading: loadingArticle, error: articleLoadError } = useQuery({
        queryKey: ["article", params.get("id")],
        queryFn: async () => getArticleFromID(params.get("id")),
        enabled: !!params.get("id") && !!params.get("section")
    })

    useEffect(() => {
        if (params.get("id") && params.get("section")) {
            setEditing(true)
        } else {
            //New
            setEditing(false)
        }
    }, [article, params])

    function handleSave(article: Article, sectionID: string) {
        //console.log(article)
        //console.log(sectionID)
        article.sectionID = sectionID

        createArticle(article, sectionID).then(() => {
            alert("Section successfully updated/created!")
            router.back()
        }).catch(err => {
            alert("An error occured, see the console!")
            console.log(err)
        })
    }

    function handleCancel() {
        router.back()
    }

    async function handleDelete() {
        await deleteArticle(article.id, params.get("section"))
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: ["articles"] }),
            queryClient.invalidateQueries({ queryKey: ["sections"] })
        ])
        router.push("/admin/content")
    }

    return <main className="max-h-[calc(100vh-7.5rem)] flex flex-col h-full">
        {(profile && profile.admin) ?
            <div className="w-full flex flex-1 flex-col justify-center">
                <div className="w-full flex-1 flex flex-col gap-2">
                    <ArticleEditor sectionID={params.get("section")} article={!loadingArticle && !articleLoadError && editing ? article : defaultArticle} editing={editing} onSave={handleSave} onCancel={handleCancel} onDelete={editing && article ? handleDelete : undefined}></ArticleEditor>
                </div>
            </div> : <p className="p-2">You don&apos;t have admin permissions. If you think this is a mistake, contact us.</p>}
    </main>
}
