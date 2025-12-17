"use client";

import { useEffect, useMemo, useState } from "react";
import { useProfile } from "@/app/components/auth-provider/authProvider";
import {
    DEFAULT_PRIZES,
    Prize,
    getRaffleConfig,
    saveRafflePrizes,
    getPublicRaffleWinners,
    PublicRaffleWinner,
} from "@/app/services/raffleService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

type PrizeField = keyof Pick<Prize, "name" | "description" | "tier"> | "quantity";

function firstNameOf(name?: string) {
    if (!name) return "Winner";
    const [first] = name.trim().split(/\s+/);
    return first || "Winner";
}

export default function AdminPrizesPage() {
    const profile = useProfile();
    const queryClient = useQueryClient();
    const [editablePrizes, setEditablePrizes] = useState<Prize[]>(DEFAULT_PRIZES);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const {
        data: config,
        isLoading: loadingConfig,
        error: configError,
    } = useQuery({
        queryKey: ["raffle-config"],
        queryFn: getRaffleConfig,
    });

    const {
        data: winners,
        isLoading: loadingWinners,
        error: winnersError,
    } = useQuery<PublicRaffleWinner[]>({
        queryKey: ["raffle-public-winners"],
        queryFn: getPublicRaffleWinners,
    });

    useEffect(() => {
        if (config?.prizes && config.prizes.length > 0) {
            setEditablePrizes(config.prizes);
        }
    }, [config?.prizes]);

    const saveMutation = useMutation({
        mutationFn: async () => {
            await saveRafflePrizes(editablePrizes);
        },
        onSuccess: () => {
            setSuccessMsg("Prizes updated successfully.");
            setErrorMsg("");
            queryClient.invalidateQueries({ queryKey: ["raffle-config"] });
            queryClient.invalidateQueries({ queryKey: ["raffle-results"] });
            setTimeout(() => setSuccessMsg(""), 3000);
        },
        onError: (err) => {
            setErrorMsg((err as Error).message);
        },
    });

    function updatePrize(index: number, field: PrizeField, value: string) {
        setEditablePrizes((prev) =>
            prev.map((prize, i) => {
                if (i !== index) return prize;
                if (field === "quantity") {
                    const quantity = Math.max(1, parseInt(value || "1", 10));
                    return { ...prize, quantity };
                }
                return { ...prize, [field]: value };
            })
        );
    }

    function addPrize() {
        const randomId =
            typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `prize-${Date.now()}`;
        setEditablePrizes((prev) => [
            ...prev,
            {
                id: `custom-${randomId}`,
                name: "New Prize",
                description: "Describe this prize",
                quantity: 1,
                tier: "minor",
            },
        ]);
    }

    function removePrize(index: number) {
        setEditablePrizes((prev) => prev.filter((_, i) => i !== index));
    }

    const majorPrizesCount = useMemo(() => editablePrizes.filter((p) => p.tier === "major").length, [editablePrizes]);

    if (!profile || !profile.admin) {
        return (
            <main>
                <p className="p-4">You do not have admin access for this page.</p>
            </main>
        );
    }

    return (
        <main className="flex justify-center">
            <div className="max-w-4xl w-full p-4 flex flex-col gap-6">
                <div className="p-3 bg-sky-900 text-sky-50 rounded flex items-center gap-3">
                    <ExclamationCircleIcon className="w-10 h-10" />
                    <p>
                        Configure all raffle prizes here. Any changes are reflected on the home page, raffle roll logic,
                        and the public winners page.
                    </p>
                </div>

                {successMsg && <p className="p-3 bg-green-900 text-green-100 rounded">{successMsg}</p>}
                {errorMsg && <p className="p-3 bg-red-900 text-red-100 rounded">{errorMsg}</p>}
                {configError && <p className="p-3 bg-red-900 text-red-100 rounded">Error loading config.</p>}

                <section className="border border-slate-800 rounded bg-slate-900">
                    <div className="border-b border-slate-800 px-4 py-3 flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-semibold text-white">Prize Editor</h2>
                            <p className="text-sm text-slate-400">
                                {majorPrizesCount} major prize{majorPrizesCount === 1 ? "" : "s"} configured
                            </p>
                        </div>
                        <button onClick={addPrize} className="btn-secondary">
                            + Add Prize
                        </button>
                    </div>

                    {loadingConfig ? (
                        <p className="p-4 text-slate-400">Loading current prizes…</p>
                    ) : (
                        <div className="divide-y divide-slate-800">
                            {editablePrizes.map((prize, index) => (
                                <div key={prize.id} className="p-4 flex flex-col gap-4">
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <div className="flex-1">
                                            <label className="text-xs uppercase tracking-wide text-slate-400 block mb-1">
                                                Prize Name
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full rounded bg-slate-800 border border-slate-700 p-2"
                                                value={prize.name}
                                                onChange={(e) => updatePrize(index, "name", e.target.value)}
                                            />
                                        </div>
                                        <div className="w-full md:w-32">
                                            <label className="text-xs uppercase tracking-wide text-slate-400 block mb-1">
                                                Quantity
                                            </label>
                                            <input
                                                type="number"
                                                min={1}
                                                className="w-full rounded bg-slate-800 border border-slate-700 p-2"
                                                value={prize.quantity}
                                                onChange={(e) => updatePrize(index, "quantity", e.target.value)}
                                            />
                                        </div>
                                        <div className="w-full md:w-40">
                                            <label className="text-xs uppercase tracking-wide text-slate-400 block mb-1">
                                                Tier
                                            </label>
                                            <select
                                                className="w-full rounded bg-slate-800 border border-slate-700 p-2"
                                                value={prize.tier}
                                                onChange={(e) => updatePrize(index, "tier", e.target.value)}
                                            >
                                                <option value="major">Major</option>
                                                <option value="minor">Minor</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs uppercase tracking-wide text-slate-400 block mb-1">
                                            Description
                                        </label>
                                        <textarea
                                            className="w-full rounded bg-slate-800 border border-slate-700 p-2"
                                            rows={2}
                                            value={prize.description}
                                            onChange={(e) => updatePrize(index, "description", e.target.value)}
                                        />
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className="text-xs text-slate-500 font-mono">ID: {prize.id}</p>
                                        {editablePrizes.length > 1 && (
                                            <button
                                                className="text-red-400 text-sm hover:underline"
                                                onClick={() => removePrize(index)}
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="px-4 py-3 border-t border-slate-800 flex justify-end">
                        <button
                            className="btn-primary"
                            onClick={() => saveMutation.mutate()}
                            disabled={saveMutation.isPending}
                        >
                            {saveMutation.isPending ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </section>

                <section className="border border-slate-800 rounded bg-slate-900">
                    <div className="border-b border-slate-800 px-4 py-3 flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-semibold text-white">Current Winners</h2>
                            <p className="text-sm text-slate-400">
                                Full school names are pulled directly from the participant roster.
                            </p>
                        </div>
                        {winners && winners.length > 0 && (
                            <p className="text-xs text-slate-500">
                                Updated {winners[0].timestamp.toDate().toLocaleDateString()}
                            </p>
                        )}
                    </div>

                    {loadingWinners && <p className="p-4 text-slate-400">Loading winners…</p>}
                    {winnersError && <p className="p-4 text-red-400">Unable to load winners.</p>}
                    {!loadingWinners && !winnersError && (!winners || winners.length === 0) && (
                        <p className="p-4 text-slate-400">No winners have been announced yet.</p>
                    )}

                    {!loadingWinners && !winnersError && winners && winners.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead className="bg-slate-950 text-slate-300 uppercase text-xs">
                                    <tr>
                                        <th className="text-left px-4 py-2">Tier</th>
                                        <th className="text-left px-4 py-2">Prize</th>
                                        <th className="text-left px-4 py-2">Winner</th>
                                        <th className="text-left px-4 py-2">School</th>
                                        <th className="text-left px-4 py-2">Drawn</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {winners.map((winner) => (
                                        <tr key={`${winner.prizeId}-${winner.winnerUid}`} className="border-t border-slate-800">
                                            <td className="px-4 py-2 font-mono text-xs text-slate-400">
                                                {winner.prizeTier === "major" ? "Major" : "Minor"}
                                            </td>
                                            <td className="px-4 py-2">{winner.prizeName}</td>
                                            <td className="px-4 py-2 font-semibold">
                                                {firstNameOf(winner.winnerName)}
                                            </td>
                                            <td className="px-4 py-2 text-slate-200">{winner.winnerSchool ?? "Unknown"}</td>
                                            <td className="px-4 py-2 text-slate-400">
                                                {winner.timestamp.toDate().toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
