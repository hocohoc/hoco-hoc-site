"use client"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useProfile } from "../auth-provider/authProvider"
import { logout, signInOrRegister } from "@/app/services/userService"

export default function Hero() {
    const profile = useProfile()
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        window.addEventListener("resize", () => handleResize());
        handleResize()
    })

    function handleResize() {
        if (canvasRef.current) {
            const parent = canvasRef.current.parentElement;

            if (parent) {
                const rect = parent.getBoundingClientRect()
                canvasRef.current.width = rect.width;
                canvasRef.current.height = rect.height;
            }
        }
        draw()
    }

    function draw() {
        const canvas = canvasRef.current;
        if (canvas) {
            const context = canvas.getContext("2d");
            context.clearRect(0, 0, canvas.width, canvas.height)
            context.lineCap = "round";
            const radius = canvas.width < 600 ? 200 : 300;
            context.translate(canvas.width < 600 ? canvas.width : canvas.width * 0.75, canvas.height / 2);
            context.beginPath()
            context.arc(0, 0, radius * 0.85, -Math.PI / 2, Math.PI * 2 / 3);
            context.lineWidth = 10;
            context.strokeStyle = "#bfdbfe";
            context.stroke();

            context.beginPath()
            context.arc(0, 0, radius * 0.95, -Math.PI / 2, Math.PI * 4 / 3);
            context.lineWidth = 10;
            context.strokeStyle = "#38bdf8";
            context.stroke();

            context.beginPath()
            context.arc(0, 0, radius * 0.9, -Math.PI / 2, 2 * Math.PI);
            context.lineWidth = 10;
            context.strokeStyle = "#0c4a6e";
            context.stroke();

            context.beginPath()
            context.moveTo(0, 0)
            context.strokeStyle = "#FFFFFF";
            context.lineWidth = 10;
            context.lineTo(Math.cos(4 * Math.PI / 3) * (0.8 * radius), Math.sin(4 * Math.PI / 3) * (0.5 * radius));
            context.stroke()

            context.beginPath()
            context.moveTo(0, 0)
            context.strokeStyle = "#00b7ff";
            context.lineWidth = 5;
            context.lineTo(Math.cos((2.0 / 3.0) * Math.PI) * (0.95 * radius), Math.sin((2.0 / 3.0) * Math.PI) * (0.6 * radius));
            context.stroke()
        }
    }

    function handleAuth() {
        console.log(profile)
        if (profile) {
            logout()
        } else {
            signInOrRegister()
        }
    }

    return <main className={`h-[60vh] md:h-[75vh] min-h-[30rem] bg-sky-950 relative border-b-2 border-b-sky-900 overflow-hidden`}>
        <canvas onResize={handleResize} ref={canvasRef} className="relative top-0 left-0"> </canvas>
        <div className="flex flex-row items-center justify-center z-20 absolute top-0 left-0 w-full h-full p-8 bg-opacity-80 bg-slate-900 md:bg-opacity-100 md:bg-transparent md:bg-gradient-to-bl md:via-90% md:via-slate-900 md:from-transparent md:to-slate-900">
            <div className="flex flex-row items-center w-full max-w-screen-xl">
                <div className="md:w-2/3 w-full">
                    <h1 className="text-2xl md:text-6xl">Howard County</h1>
                    <h1 className={`bg-gradient-to-b from-sky-300 to-sky-500 text-transparent bg-clip-text text-7xl md:text-8xl font-extrabold mb-2 mt-2`}>Hour of Code</h1>
                    <p className="text-md mt-3 md:text-base">Compete, Learn, and Win Prizes!</p>
                    <p className={`font-mono text-slate-400 text-sm`}> Howard County Hour of Code is a 7-day event taking place from December 8, 2025 to December 15, 2025. </p>
                    <div className={`font-mono flex flex-row mt-4 gap-2`}>
                        <button className={`btn-primary ${profile && ("bg-red-400 hover:bg-red-300")}`} onClick={handleAuth}> {profile ? "Logout" : "Login"} </button>
                        <Link className="btn-secondary" href={"/articles"}> View Articles </Link>
                    </div>
                </div>
            </div>
        </div>
    </main>
}
