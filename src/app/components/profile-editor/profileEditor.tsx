"use client"

import { getSchoolByID } from "@/app/services/schoolsService"
import { Profile } from "@/app/services/userService"
import { ALL_LANGUAGES } from "@/app/services/utils"
import { useState } from "react"

type Props = {
    profile: Profile
    onSave: (profile: Profile) => void
    className?: string
    working: boolean
}

export default function ProfileEditor(props: Props) {
    let [profile, setProfile] = useState<Profile>(props.profile)

    return <section className={`flex flex-col ${props.className || ""}`}>
        <div className="my-2">
            <p className="font-bold text-md">Your School</p>
            <p className="text-sm text-slate-300">This is the school you attend as indicated by you when you created your profile. You are not able to change this after your profile was created. </p>
        </div>
        <p className="font-mono bg-gray-950 p-2 rounded border border-gray-800 w-full">
            {getSchoolByID(profile.school).name}
        </p>
        <div className="my-2">
            <p className="font-bold text-md">Preferred programming language</p>
            <p className="text-sm text-slate-300">This is the language you will see code examples in by default (when they are available in that language).</p>
        </div>
    <select className="font-mono bg-gray-950 p-2 rounded border border-gray-800 hover:bg-gray-900 w-full cursor-pointer" value={ALL_LANGUAGES.indexOf(profile.preferredLanguage.toLowerCase())} onChange={(e) => { const selectedIndex = Number(e.target.value); const nextLanguage = ALL_LANGUAGES[selectedIndex] as ("python" | "java" | "cpp"); setProfile({ ...profile, preferredLanguage: nextLanguage }) }}>
            {ALL_LANGUAGES.map((lang, index) =>
                <option key={index} value={index}>{lang}</option>
            )}
        </select>

        <div className="mt-2 flex gap-2">
            <button className={`btn-secondary max-w-40 font-mono flex-1 ${props.working && 'bg-opacity-70'}`} type="button" disabled={props.working} onClick={() => props.onSave(profile)}>{!props.working ? "Update Profile" : "Working..."}</button>
        </div>
    </section>
}
