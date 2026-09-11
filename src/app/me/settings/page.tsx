"use client"
import { useProfile, useProfileUpdate } from "@/app/components/auth-provider/authProvider";
import ProfileEditor from "@/app/components/profile-editor/profileEditor";
import { Profile, updateUserProfile } from "@/app/services/userService";
import { useState } from "react";

export default function ProfileSettingsPage() {
  const profile = useProfile()
  const setProfile = useProfileUpdate()
  let [error, setError] = useState(false)
  const [saved, setSaved] = useState(false)
  let [working, setWorking] = useState(false)

  function handleEdit(profile: Profile) {
    setError(false)
    setSaved(false)
    setWorking(true)
    updateUserProfile(profile.uid, profile.preferredLanguage).then(() => {
      setWorking(false)
      setProfile(profile)
      setSaved(true)
      console.log("UPDATED!")
    }).catch((err) => {
      console.log(err)
      setWorking(false)
      setError(true)
    })
  }

  return <div className="w-full h-full">
    {profile ?
      <div className="w-full h-full flex flex-col">
        <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
        <hr className="border border-slate-600 mb-4" />
        <p role="alert" className="text-red-300">{error ? "Your changes could not be saved. Check your connection and try Update Profile again." : ""}</p>
        <p role="status" aria-atomic="true">{working ? "Saving profile…" : saved ? "Profile saved." : ""}</p>
        <ProfileEditor working={working} profile={profile} onSave={(newProf) => handleEdit(newProf)} />
      </div> : "You are not logged in!"}
  </div>
}
