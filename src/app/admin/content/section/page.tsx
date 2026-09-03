"use client"
import SectionEditor from "@/app/components/admin/sectionEditor"
import { useProfile } from "@/app/components/auth-provider/authProvider"
import { Section, createSection, deleteSection, getSection } from "@/app/services/articleService"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"

export default function AdminSectionEditPage() {
    const placeHolderID = "[REPLACE WITH THE ID YOU WANT]";
    const defaultSection: Section = {
        points: {},
        id: placeHolderID,
        title: "Untitled Section",
        index: 0,
        articles: [],
        description: "Description goes here..."
    }

    let profile = useProfile()
    const router = useRouter()
    const queryClient = useQueryClient()
    const params = useSearchParams()
    let [editing, setEditing] = useState(false);

    const { data: section, isLoading: loadingSection, error: sectionLoadError } = useQuery({
        queryKey: ["section", params.get("id")],
        queryFn: async () => getSection(params.get("id")),
        enabled: !!params.get("id")
    })

    useEffect(() => {
        if (params.get("id")) {
            setEditing(true)
        } else {
            //New
            setEditing(false)
        }
    }, [params])

    function handleSave(section: Section) {
        createSection(section).then(() => {
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
        await deleteSection(section.id)
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: ["articles"] }),
            queryClient.invalidateQueries({ queryKey: ["sections"] })
        ])
        router.push("/admin/content")
    }

    return <main>
        {sectionLoadError && <span className="text-red-400"> An error occured while loading the requested section! </span>}
        {loadingSection && <span className="text-slate-400"> Loading... </span>}
        {(profile && profile.admin) ?
            <div className="w-full h-auto flex justify-center">
                <div className="max-w-3xl w-full h-full p-4 flex flex-col gap-2">
                    <SectionEditor section={!loadingSection && !sectionLoadError && editing ? section : defaultSection} editing={editing} onSave={handleSave} onCancel={handleCancel} onDelete={editing && section ? handleDelete : undefined}></SectionEditor>
                </div>
            </div> : <p className="p-2">You don&apos;t have admin permissions. If you think this is a mistake, contact us.</p>}
    </main>
}
