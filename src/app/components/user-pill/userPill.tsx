"use client"

import { getSchoolByID } from "@/app/services/schoolsService"
import { Profile, logout } from "@/app/services/userService"
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

type Props = {
    user: Profile
}

export default function UserPill(props: Props) {
    const [dropVisible, setDropVisible] = useState(false)
    const triggerRef = useRef<HTMLButtonElement | null>(null)
    const dropdownRef = useRef<HTMLDivElement | null>(null)
    const menuId = "user-menu"

    const toggleDropdown = () => setDropVisible(prev => !prev)

    useEffect(() => {
        if (!dropVisible) {
            return
        }

        const handleOutsideInteraction = (event: MouseEvent | TouchEvent) => {
            const target = event.target as Node
            if (dropdownRef.current?.contains(target) || triggerRef.current?.contains(target)) {
                return
            }
            setDropVisible(false)
        }

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setDropVisible(false)
            }
        }

        document.addEventListener("mousedown", handleOutsideInteraction)
        document.addEventListener("touchstart", handleOutsideInteraction)
        document.addEventListener("keydown", handleEscape)

        const firstFocusable = dropdownRef.current?.querySelector<HTMLElement>("a, button")
        firstFocusable?.focus()

        return () => {
            document.removeEventListener("mousedown", handleOutsideInteraction)
            document.removeEventListener("touchstart", handleOutsideInteraction)
            document.removeEventListener("keydown", handleEscape)
        }
    }, [dropVisible])

    return <div className="relative text-sm">
        <button
            ref={triggerRef}
            className="flex select-none flex-row items-center gap-2 bg-slate-800 border border-slate-700 text-slate-200 rounded p-2 hover:bg-slate-700"
            type="button"
            onClick={toggleDropdown}
            aria-expanded={dropVisible}
            aria-haspopup="true"
            aria-controls={menuId}
        >
            <span>Hello, {props.user.displayName}!</span>
            {props.user.admin && <span className="font-mono text-xs bg-amber-400 text-slate-900 p-1 rounded-sm">ADMIN</span>}
            {dropVisible ? <ChevronUpIcon className="h-4 w-4" aria-hidden="true" /> : <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />}
        </button>
        {dropVisible &&
            <div
                ref={dropdownRef}
                className="flex flex-col absolute right-0 mt-3 rounded z-10 p-2 bg-slate-800 border border-gray-700 w-80 drop-shadow-md"
                id={menuId}
                role="group"
                aria-label="Account options"
            >
                <p className="font-bold text-lg">{props.user.displayName}</p>
                <p className="mt-1">{getSchoolByID(props.user.school).name}</p>
                <Link className={`font-mono bg-slate-700 hover:bg-slate-600 rounded text-slate-200 p-1 w-full mt-3 text-center`} onClick={() => setDropVisible(false)} href="/me">Go to Dashboard</Link>
                <button className={`font-mono bg-slate-700 hover:bg-slate-600 rounded text-slate-200 p-1 w-full mt-1`} type="button" onClick={logout}>Logout</button>
            </div>}
    </div>
}
