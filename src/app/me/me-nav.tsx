"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useProfile } from "../components/auth-provider/authProvider"
import { logout, signInOrRegister } from "../services/userService"

export default function MeNav() {
  const path = usePathname()
  const profile = useProfile()

  return <aside className="w-full h-full md:w-52 flex flex-col gap-2">
    <Link href="/me/" className={`p-3 rounded hover:bg-slate-700 ${path == "/me" && "bg-slate-800"}`}> Dashboard </Link>
    <Link href="/me/settings" className={`p-3 rounded hover:bg-slate-700 ${path == "/me/settings" && "bg-slate-800"}`}> Settings </Link>
    <Link href="/me/help" className={`p-3 rounded hover:bg-slate-700 ${path == "/me/help" && "bg-slate-800"}`}> Help </Link>
    
    {profile?.admin && (
      <>
        <hr className="border border-slate-700 my-2" />
        <p className="text-xs font-mono uppercase text-slate-400 px-3">Admin Panel</p>
        <Link href="/admin/stats" className={`p-3 rounded hover:bg-slate-700 ${path == "/admin/stats" && "bg-slate-800"}`}> Statistics </Link>
        <Link href="/admin/content" className={`p-3 rounded hover:bg-slate-700 ${path == "/admin/content" && "bg-slate-800"}`}> Content </Link>
        <Link href="/admin/raffle" className={`p-3 rounded hover:bg-slate-700 ${path == "/admin/raffle" && "bg-slate-800"}`}> Raffle </Link>
      </>
    )}
    
    <div className="flex-1"></div>
    {profile ? <button className="btn-danger p-3 rounded font-mono text-left" onClick={logout}>Log out </button>
      : <button className="btn-primary p-3 rounded font-mono text-left" onClick={signInOrRegister}> Log in </button>}
  </aside>
}
