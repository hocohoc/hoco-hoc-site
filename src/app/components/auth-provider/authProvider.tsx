"use client"

import { auth } from "@/app/firebase/config"
import { Profile, createUserProfile, getUserData, logout } from "@/app/services/userService"
import { User, onAuthStateChanged } from "firebase/auth"
import { ReactNode, createContext, useContext, useEffect, useState } from "react"
import ModalContainer from "../modal/modalContainer"
import Modal from "../modal/modal"
import { getAllSchools, School } from "@/app/services/schoolsService"
import { ALL_LANGUAGES } from "@/app/services/utils"

type Props = {
    children?: ReactNode
}

type ProfileContext = {
    profile: Profile
    setProfile: (newProfile: Profile) => void
}

const AuthContext = createContext<ProfileContext>({
    profile: null,
    setProfile: (newProfile) => { }
});

export function useProfile(): Profile {
    const context = useContext(AuthContext)
    return context.profile
}

export function useProfileUpdate() {
    const context = useContext(AuthContext)
    return context.setProfile
}

export default function AuthProvider(props: Props) {
    const schools = getAllSchools()

    let [profileContext, setProfileContext] = useState<ProfileContext>(
        {
            profile: null,
            setProfile: (n) => { setProfileContext({ ...profileContext, profile: n }) }
        }
    );
    let [firebaseUser, setFirebaseUser] = useState<User>(undefined);
    let [showRegisterModal, setShowRegisterModal] = useState(false);
    let [school, setSchool] = useState<School>(schools[0])
    let [language, setLanguage] = useState<string>(ALL_LANGUAGES[0])
    let [loading, setLoading] = useState(false)
    const registerHeadingId = "create-profile-heading";

    useEffect(() => {
        //console.log("Update")
        const listener = onAuthStateChanged(auth, user => {
            setFirebaseUser(user)
            if (user) {
                if (!profileContext.profile) {
                    getUserData(user.uid).then(prof => {
                        if (prof) {
                            setProfileContext(
                                { ...profileContext, profile: prof }
                            )
                        } else {
                            setShowRegisterModal(true)
                        }
                    }).catch(err => {
                        console.log(err)
                        alert("Fatal error: failed to fetch user data. See console for details.")
                    })
                }
            } else {
                //console.log("Here")
                if (profileContext.profile != null) {
                    setProfileContext(
                        { ...profileContext, profile: null }
                    )
                }
                setShowRegisterModal(false)
            }
        })

        return listener;
    }, [profileContext, showRegisterModal, firebaseUser])

    function registerProfile() {
        setLoading(true);
        console.log(school)
        console.log(language)

        createUserProfile(firebaseUser, school.id, language.toLowerCase() as ("python" | "java" | "cpp")).then((newProfile) => {
            profileContext.setProfile(newProfile)
            setLoading(false)
            setShowRegisterModal(false)
        }).catch(err => {
            console.log(err)
            setLoading(false)
        })
    }

    function handleRegisterCancel() {
        if (!loading) {
            logout();
        }
    }

    return (
        <AuthContext.Provider value={profileContext}>
            {showRegisterModal && <ModalContainer labelledBy={registerHeadingId} onDismiss={loading ? undefined : handleRegisterCancel}>
                <Modal className="flex flex-col">
                    <h1 className={`font-mono text-2xl font-bold mb-2`} id={registerHeadingId}>Create your profile</h1>
                    <p className="mb-4 text-slate-300 text-sm md:text-base">It looks like this is your first time logging in to Howard County Hour of Code, welcome! Please fill out the following information to create your profile and start learning.</p>

                    <div>
                        <div className="mb-2">
                            <p className="font-bold text-md">Select your highschool</p>
                            <p className="text-sm text-slate-300">Note: You will not be able to change this later!</p>
                        </div>
                        <select className="font-mono bg-gray-700 p-2 rounded border-2 border-gray-600 hover:bg-gray-600 w-full cursor-pointer" value={school.id} onChange={(e) => setSchool(schools.find(sc => sc.id == e.target.value))}>
                            {schools.map((s, index) =>
                                <option key={index} value={s.id}>{s.name}</option>
                            )}
                        </select>
                        <div className="my-2">
                            <p className="font-bold text-md">Select your preferred programming language</p>
                            <p className="text-sm text-slate-300">This is the language you will see code examples in by default (when they are available in that language).</p>
                        </div>
                        <select className="font-mono bg-gray-700 p-2 rounded border-2 border-gray-600 hover:bg-gray-600 w-full cursor-pointer" value={ALL_LANGUAGES.indexOf(language)} onChange={(e) => { const selectedIndex = Number(e.target.value); setLanguage(ALL_LANGUAGES[selectedIndex]); }}>
                            {ALL_LANGUAGES.map((lang, index) =>
                                <option key={index} value={index}>{lang}</option>
                            )}
                        </select>
                    </div>

                    <div className="mt-2 flex flex-row gap-2">
                        <button className="btn-primary font-mono flex-1" type="button" onClick={() => registerProfile()} disabled={loading}>{loading ? "Creating..." : "Create"}</button>
                        <button className="btn-secondary font-mono" type="button" onClick={handleRegisterCancel} disabled={loading}>Cancel</button>
                    </div>
                </Modal>
            </ModalContainer>}
            {props.children || ""}
        </AuthContext.Provider>
    )
}
