"use client";

import { useProfile } from "@/app/components/auth-provider/authProvider";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { getAllUsers, Profile } from "@/app/services/userService";
// ^^^ change this import path to the file you pasted earlier

type CountMap = Record<string, number>;

function computeStats(users: Profile[]) {
    const totalUsers = users.length;

    const schoolCounts: CountMap = {};
    const languageCounts: CountMap = {};
    let adminCount = 0;
    let nonAdminCount = 0;

    users.forEach((u) => {
        // ----- schools -----
        const school = (u.school || "").trim() || "Unknown / Not set";
        schoolCounts[school] = (schoolCounts[school] ?? 0) + 1;

        // ----- admin vs non-admin -----
        if (u.admin) adminCount++;
        else nonAdminCount++;

        // ----- languages -----
        const lang = u.preferredLanguage || "unset";
        languageCounts[lang] = (languageCounts[lang] ?? 0) + 1;
    });

    const numSchools = Object.keys(schoolCounts).length;

    return {
        totalUsers,
        schoolCounts,
        numSchools,
        adminCount,
        nonAdminCount,
        languageCounts,
    };
}

export default function AdminStatsPage() {
    const profile = useProfile();

    const {
        data: users,
        isLoading,
        error,
    } = useQuery<Profile[]>({
        queryKey: ["admin-users-stats"],
        queryFn: getAllUsers,
    });

    // gate by admin like your old page
    if (!profile || !profile.admin) {
        return (
            <main>
                <p className="p-2">
                    You don&apos;t have admin permissions. If you think this is a mistake, contact us.
                </p>
            </main>
        );
    }

    const stats = users ? computeStats(users) : null;

    return (
        <main>
            <div className="w-full h-auto flex justify-center">
                <div className="max-w-3xl w-full h-full p-4 flex flex-col gap-4">
                    <div className="p-2 bg-amber-400 text-slate-900 rounded flex items-center gap-2">
                        <ExclamationCircleIcon className="w-16 h-16" />
                        <p>
                            <span className="font-bold">Admin Stats:</span>{" "}
                            These numbers are based on all user profiles in Firestore.
                        </p>
                    </div>

                    <h1 className="font-bold text-2xl">User Statistics</h1>

                    {isLoading && <p>Loading stats…</p>}
                    {error && (
                        <p className="text-red-400">
                            Error loading stats: {(error as Error).message}
                        </p>
                    )}

                    {stats && (
                        <>
                            {/* High level cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="border-2 border-slate-700 rounded p-3 bg-slate-800">
                                    <p className="text-sm text-slate-300 uppercase">
                                        Total Users
                                    </p>
                                    <p className="text-3xl font-bold">
                                        {stats.totalUsers}
                                    </p>
                                </div>

                                <div className="border-2 border-slate-700 rounded p-3 bg-slate-800">
                                    <p className="text-sm text-slate-300 uppercase">
                                        Schools Participated
                                    </p>
                                    <p className="text-3xl font-bold">
                                        {stats.numSchools}
                                    </p>
                                </div>

                                <div className="border-2 border-slate-700 rounded p-3 bg-slate-800">
                                    <p className="text-sm text-slate-300 uppercase">
                                        Admin Accounts
                                    </p>
                                    <p className="text-3xl font-bold">
                                        {stats.adminCount}
                                    </p>
                                </div>

                                <div className="border-2 border-slate-700 rounded p-3 bg-slate-800">
                                    <p className="text-sm text-slate-300 uppercase">
                                        Non-Admin Users
                                    </p>
                                    <p className="text-3xl font-bold">
                                        {stats.nonAdminCount}
                                    </p>
                                </div>
                            </div>

                            {/* Language breakdown */}
                            <div className="border-2 border-slate-700 rounded bg-slate-800 mt-4">
                                <div className="border-b-2 border-b-slate-700 px-3 py-2">
                                    <h2 className="font-bold text-lg">
                                        Preferred Languages
                                    </h2>
                                </div>
                                <div className="max-h-64 overflow-y-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-slate-900 sticky top-0">
                                            <tr>
                                                <th className="text-left px-3 py-2">Language</th>
                                                <th className="text-right px-3 py-2">Users</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.entries(stats.languageCounts)
                                                .sort((a, b) => b[1] - a[1])
                                                .map(([lang, count]) => (
                                                    <tr
                                                        key={lang}
                                                        className="border-t border-slate-700"
                                                    >
                                                        <td className="px-3 py-1">{lang}</td>
                                                        <td className="px-3 py-1 text-right font-mono">
                                                            {count}
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* School breakdown */}
                            <div className="border-2 border-slate-700 rounded bg-slate-800 mt-4">
                                <div className="border-b-2 border-b-slate-700 px-3 py-2">
                                    <h2 className="font-bold text-lg">
                                        Users per School
                                    </h2>
                                    <p className="text-xs text-slate-400">
                                        How many users are from each school
                                    </p>
                                </div>

                                <div className="max-h-96 overflow-y-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-slate-900 sticky top-0">
                                            <tr>
                                                <th className="text-left px-3 py-2">School</th>
                                                <th className="text-right px-3 py-2">Users</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.entries(stats.schoolCounts)
                                                .sort((a, b) => b[1] - a[1]) // most users first
                                                .map(([school, count]) => (
                                                    <tr
                                                        key={school}
                                                        className="border-t border-slate-700"
                                                    >
                                                        <td className="px-3 py-1">{school}</td>
                                                        <td className="px-3 py-1 text-right font-mono">
                                                            {count}
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}
