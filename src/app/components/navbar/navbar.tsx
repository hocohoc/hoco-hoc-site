"use client";

import { logout, signInOrRegister } from "@/app/services/userService";
import Link from "next/link";
import Image from "next/image";
import { useProfile } from "../auth-provider/authProvider";
import UserPill from "../user-pill/userPill";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ModalContainer from "../modal/modalContainer";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Home", mobileOnly: false },
  { href: "/aboutus", label: "About Us", mobileOnly: false },
  { href: "/recruitment", label: "Get Involved!", mobileOnly: true },
  { href: "/daily-challenge", label: "Daily Challenge", mobileOnly: false },
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
  { href: "/daily-challenge", label: "Daily" },
  { href: "/sandbox", label: "Challenges" },
  { href: "/leaderboard", label: "Leaderboard" },
];

export default function NavBar() {
  let profile = useProfile();
  let [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const navRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const measure = () => document.documentElement.style.setProperty("--site-nav-height", `${nav.getBoundingClientRect().height}px`);
    const observer = new ResizeObserver(measure);
    observer.observe(nav);
    measure();
    return () => observer.disconnect();
  }, []);
  const sidebarId = "sidebar-navigation";
  const pathname = usePathname();

  function toggleSidebar(): void {
    setSidebarOpen((prev) => !prev);
  }

  // Close sidebar when pathname changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);


  return (
    <>
      {/* Top Navigation Bar */}
      <nav
        ref={navRef}
        className="bg-slate-900 bg-opacity-50 backdrop-blur-md min-h-16 py-2 px-2 sm:px-4 flex flex-row items-center justify-center border-b-2 border-b-sky-900 top-0 sticky z-40 w-full"
        aria-label="Primary"
      >
        <div className="flex flex-row items-center w-full max-w-screen-xl gap-2 sm:gap-4 flex-wrap">
          {/* Logo + Title */}
          <Link
            onClick={() => setSidebarOpen(false)}
            href={"/"}
            aria-label="Howard County Hour of Code / AI home"
            className="flex items-center gap-2"
          >
            <Image
              src="/sponsors/hcpss-logo-outlined.png"
              alt="HCPSS Logo"
              width={40}
              height={40}
              className="object-contain w-8 h-8 sm:w-10 sm:h-10"
            />
            <span className="font-mono text-sky-300 text-base sm:text-xl md:text-2xl font-bold">
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
          <ModalContainer ariaLabel="Site menu" onDismiss={() => setSidebarOpen(false)} className="!p-0 !items-end">
            {/* Sidebar */}
            <motion.nav
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="h-full w-72 max-w-full bg-slate-900 border-l border-sky-900 flex flex-col p-4 z-40"
              id={sidebarId}
              aria-label="Sidebar"
              tabIndex={-1}
            >
              <button type="button" onClick={() => setSidebarOpen(false)} className="btn-secondary self-end mb-4">Close menu</button>
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
          </ModalContainer>
        )}
      </AnimatePresence>
    </>
  );
}
