"use client";

import { logout, signInOrRegister } from "@/app/services/userService";
import Link from "next/link";
import Image from "next/image";
import { useProfile } from "../auth-provider/authProvider";
import UserPill from "../user-pill/userPill";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Home", mobileOnly: false },
  { href: "/aboutus", label: "About Us", mobileOnly: false },
  { href: "/recruitment", label: "Get Involved!", mobileOnly: true },
  { href: "/sandbox", label: "Code Challenges", mobileOnly: false },
  { href: "/game", label: "Games", mobileOnly: false },
  { href: "/articles", label: "Articles", mobileOnly: false },
  { href: "/pictures", label: "Pictures", mobileOnly: false },
  { href: "/leaderboard", label: "Leaderboard", mobileOnly: false },
  { href: "/feedback", label: "Feedback", mobileOnly: false },
];

const QUICK_LINKS = [
  { href: "/articles", label: "Articles" },
  { href: "/game", label: "Games" },
  { href: "/sandbox", label: "Challenges" },
  { href: "/leaderboard", label: "Leaderboard" },
];

export default function NavBar() {
  let profile = useProfile();
  let [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const sidebarRef = useRef<HTMLElement | null>(null);
  const sidebarId = "sidebar-navigation";
  const pathname = usePathname();

  function toggleSidebar(): void {
    setSidebarOpen((prev) => !prev);
  }

  // Close sidebar when pathname changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

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
        className="bg-slate-900 bg-opacity-50 backdrop-blur-md h-16 px-4 flex flex-row items-center justify-center border-b-2 border-b-sky-900 top-0 sticky z-40 w-full"
        aria-label="Primary"
      >
        <div className="flex flex-row items-center w-full max-w-screen-xl gap-4">
          {/* Logo + Title */}
          <Link
            onClick={() => setSidebarOpen(false)}
            href={"/"}
            aria-label="Howard County Hour of Code / AI home"
            className="flex items-center gap-3"
          >
            <Image
              src="/sponsors/hcpss-logo-outlined.png"
              alt="HCPSS Logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <span className="font-mono text-sky-300 text-xl md:text-2xl font-bold">
              &lt;HocoHOC/&gt;
            </span>
          </Link>

          {/* Desktop Quick Links */}
          <div className="hidden lg:flex items-center gap-1 ml-6">
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.href}
                className="font-mono text-sm text-slate-300 hover:text-sky-300 px-3 py-1.5 rounded hover:bg-slate-800 transition-colors"
                href={link.href}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex-1" />

          <div className="flex flex-row gap-2 md:gap-3 items-center">
            <Link
              className="hidden md:flex items-center font-mono text-sm font-bold text-blue-400 hover:text-sky-300 hover:underline"
              href={"/recruitment"}
            >
              Get Involved
            </Link>

            {/* Hamburger Menu Button */}
            <button
              className="flex items-center gap-2 text-slate-300 hover:text-sky-300 transition-colors font-mono font-bold text-sm px-2 py-1.5 rounded hover:bg-slate-800"
              type="button"
              onClick={toggleSidebar}
              aria-expanded={sidebarOpen}
              aria-controls={sidebarId}
              aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              <div className="flex flex-col gap-1 w-4">
                <motion.span
                  animate={sidebarOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                  className="h-0.5 w-full bg-current rounded-full"
                />
                <motion.span
                  animate={sidebarOpen ? { opacity: 0 } : { opacity: 1 }}
                  className="h-0.5 w-full bg-current rounded-full"
                />
                <motion.span
                  animate={sidebarOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                  className="h-0.5 w-full bg-current rounded-full"
                />
              </div>
              <span className="hidden sm:inline">Menu</span>
            </button>

            {profile ? (
              <UserPill user={profile} />
            ) : (
              <button
                className="font-mono btn-primary"
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
              className="fixed inset-0 bg-black bg-opacity-50 z-30 top-16"
              onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar */}
            <motion.nav
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-64 bg-slate-900 border-l border-sky-900 flex flex-col p-4 z-40"
              id={sidebarId}
              aria-label="Sidebar"
              ref={sidebarRef}
              tabIndex={-1}
            >
              {/* Scrollable Link Section */}
              <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-2 custom-scrollbar">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    className={`font-mono py-2 px-3 hover:text-sky-300 hover:bg-slate-800 rounded transition-colors text-sm ${link.mobileOnly ? "md:hidden" : ""}`}
                    href={link.href}
                    onClick={() => setSidebarOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}

                {profile && (
                  <Link
                    className="font-mono py-2 px-3 hover:text-sky-300 hover:bg-slate-800 rounded transition-colors text-sm border-t border-slate-700 pt-3"
                    href={"/me"}
                    onClick={() => setSidebarOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}
              </div>

              {/* Fixed Bottom Section */}
              {profile && (
                <div className="border-t border-slate-700 mt-4 pt-3 shrink-0">
                  <button
                    onClick={() => {
                      logout();
                      setSidebarOpen(false);
                    }}
                    className="w-full font-mono py-2 px-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded transition-colors text-sm"
                  >
                    Logout
                  </button>
                </div>
              )}
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
