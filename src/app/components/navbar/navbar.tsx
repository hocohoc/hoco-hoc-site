"use client";

import { logout, signInOrRegister } from "@/app/services/userService";
import Link from "next/link";
import Image from "next/image";
import { useProfile } from "../auth-provider/authProvider";
import UserPill from "../user-pill/userPill";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function NavBar() {
  let profile = useProfile();
  let [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const sidebarRef = useRef<HTMLElement | null>(null);
  const sidebarId = "sidebar-navigation";

  function toggleSidebar(): void {
    setSidebarOpen((prev) => !prev);
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSidebarOpen(false);
      }
    };

    if (sidebarOpen) {
      document.addEventListener("keydown", handleKeyDown);
      const focusable =
        sidebarRef.current?.querySelector<HTMLElement>("a, button");
      focusable?.focus();
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [sidebarOpen]);

  return (
    <>
      {/* Top Navigation Bar */}
      <nav
        className="bg-slate-900 bg-opacity-50 backdrop-blur-md h-14 p-2 flex flex-row items-center justify-center border-b-2 border-b-sky-900 top-0 sticky z-40 w-full"
        aria-label="Primary"
      >
        <div className="flex flex-row items-center w-full max-w-screen-xl gap-3">
          <Link
            onClick={() => setSidebarOpen(false)}
            href={"/"}
            aria-label="Howard County Hour of Code / AI home"
            className="flex items-center"
          >
            <Image
              src="/sponsors/hcpss-logo-outlined.png"
              alt="HCPSS Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </Link>
          <Link
            onClick={() => setSidebarOpen(false)}
            className={`font-mono text-sky-300 text-xl md:text-2xl font-bold`}
            href={"/"}
            aria-label="Howard County Hour of Code / AI home"
          >
            &lt;HocoHOC/&gt;
          </Link>

          <div className="flex-1"></div>
          <div className="flex max-md:hidden flex-row text-xs gap-5 md:text-md items-stretch">
            <Link
              className={`font-mono rounded text-lg items-center justify-center md:flex font-bold text-blue-400 hover:text-sky-300 hover:underline`}
              href={"/recruitment"}
            >
              Get Involved!
            </Link>

            {/* Hamburger Menu Button */}
            <button
              className="text-slate-300 hover:text-sky-300 transition-colors font-mono font-bold text-lg"
              type="button"
              onClick={toggleSidebar}
              aria-expanded={sidebarOpen}
              aria-controls={sidebarId}
              aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              Menu
            </button>

            {profile ? (
              <UserPill user={profile} />
            ) : (
              <button
                className={`font-mono btn-primary`}
                type="button"
                onClick={() => signInOrRegister()}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-30 top-14"
              onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar */}
            <motion.nav
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed right-0 top-14 h-[calc(100vh-3.5rem)] w-64 bg-slate-900 border-l border-sky-900 flex flex-col gap-3 p-4 overflow-y-auto z-40"
              id={sidebarId}
              aria-label="Sidebar"
              ref={sidebarRef}
              tabIndex={-1}
            >
              {profile && (
                <h1 className="text-lg font-bold text-sky-300 pb-2 border-b border-slate-700">
                  Hello, {profile.displayName}!
                </h1>
              )}

              <Link
                className={`font-mono py-2 px-3 hover:text-sky-300 hover:bg-slate-800 rounded transition-colors text-sm`}
                href={"/"}
                onClick={() => setSidebarOpen(false)}
              >
                Home
              </Link>

              <Link
                className={`font-mono py-2 px-3 hover:text-sky-300 hover:bg-slate-800 rounded transition-colors text-sm`}
                href={"/aboutus"}
                onClick={() => setSidebarOpen(false)}
              >
                About Us
              </Link>
              <Link
                className={`font-mono py-2 px-3 hover:text-sky-300 hover:bg-slate-800 rounded transition-colors text-sm`}
                href={"/sandbox"}
                onClick={() => setSidebarOpen(false)}
              >
                Test Your Code!
              </Link>

              <Link
                className={`font-mono py-2 px-3 hover:text-sky-300 hover:bg-slate-800 rounded transition-colors text-sm`}
                href={"/game"}
                onClick={() => setSidebarOpen(false)}
              >
                Games
              </Link>

              <Link
                className={`font-mono py-2 px-3 hover:text-sky-300 hover:bg-slate-800 rounded transition-colors text-sm`}
                href={"/articles"}
                onClick={() => setSidebarOpen(false)}
              >
                Articles
              </Link>

              <Link
                className={`font-mono py-2 px-3 hover:text-sky-300 hover:bg-slate-800 rounded transition-colors text-sm`}
                href={"/pictures"}
                onClick={() => setSidebarOpen(false)}
              >
                Pictures
              </Link>

              <Link
                className={`font-mono py-2 px-3 hover:text-sky-300 hover:bg-slate-800 rounded transition-colors text-sm`}
                href={"/leaderboard"}
                onClick={() => setSidebarOpen(false)}
              >
                Leaderboard
              </Link>

              <Link
                className={`font-mono py-2 px-3 hover:text-sky-300 hover:bg-slate-800 rounded transition-colors text-sm`}
                href={"/feedback"}
                onClick={() => setSidebarOpen(false)}
              >
                Feedback
              </Link>

              {profile && (
                <Link
                  className={`font-mono py-2 px-3 hover:text-sky-300 hover:bg-slate-800 rounded transition-colors text-sm border-t border-slate-700 pt-3`}
                  href={"/me"}
                  onClick={() => setSidebarOpen(false)}
                >
                  Dashboard
                </Link>
              )}

              {profile && (
                <div className="border-t border-slate-700 mt-auto pt-3">
                  <UserPill user={profile} />
                </div>
              )}
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
