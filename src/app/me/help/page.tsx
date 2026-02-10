"use client"

import { EventStatus, onEventStatusChange } from "@/app/services/eventService";
import { useEffect, useState } from "react";

export default function HelpPage() {
  let [status, setStatus] = useState<EventStatus>(undefined)

  useEffect(() => {
    return onEventStatusChange((status) => {
      console.log(status)
      setStatus(status)
    })
  }, [])

  return <div className="w-full h-full">
    <main className="w-full h-full flex flex-col">
      <div className="flex items-center gap-2">
        <h1 className="text-3xl font-bold mb-2 flex-1">Help</h1>
        <div className={`p-1 px-3 text-sm font-mono uppercase font-bold ${status && status.live ? 'animate-pulse text-slate-950 bg-emerald-400' : 'bg-red-600'} rounded-full`}> {status && status.live ? "Event is live!" : "Event is not live"} </div>
      </div>
      <hr className="border border-slate-600 mb-4" />
      <p className="text-lg mb-4">
        Encounter issues or have questions? Contact us at <a className="font-bold underline" href="mailto:mdhocohoc@gmail.com"> mdhocohoc@gmail.com </a>.
      </p>
      {status && status.statusMessage.length > 0 ?
        <div className="p-2 bg-amber-400/50 rounded border border-amber-400">
          <h1 className="font-bold text-lg mb-2 uppercase font-mono">Current Status Message</h1>
          <p> {status.statusMessage} </p>
        </div>
        : <p className="p-2 bg-sky-300/50 rounded border border-sky-300 font-bold">😀 No active status messages at this time! </p>
      }
    </main>
  </div>
}
