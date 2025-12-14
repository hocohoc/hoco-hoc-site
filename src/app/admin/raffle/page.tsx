"use client";

import { useProfile } from "@/app/components/auth-provider/authProvider";
import {
    getRaffleConfig,
    getRaffleEntries,
    rollRaffle,
    getRaffleResults,
    initializeRaffle,
    resetRaffle,
    Prize,
} from "@/app/services/raffleService";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const DEFAULT_PRIZES: Prize[] = [
    {
        id: "ipad",
        name: "Apple iPad (A16)",
        quantity: 1,
        description: "1x Apple iPad with A16 chip",
    },
    {
        id: "jbl",
        name: "JBL Tune 720BT",
        quantity: 1,
        description: "1x JBL Tune 720BT Headphones",
    },
    {
        id: "giftcard",
        name: "$10 Amazon Giftcard",
        quantity: 10,
        description: "10x $10 Amazon Giftcards",
    },
];

export default function AdminRafflePage() {
    const profile = useProfile();
    const queryClient = useQueryClient();
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [showResults, setShowResults] = useState(false);

    const {
        data: config,
        isLoading: loadingConfig,
        error: configError,
    } = useQuery({
        queryKey: ["raffle-config"],
        queryFn: getRaffleConfig,
    });

    const {
        data: entries,
        isLoading: loadingEntries,
        error: entriesError,
    } = useQuery({
        queryKey: ["raffle-entries"],
        queryFn: getRaffleEntries,
        enabled: showResults,
    });

    const {
        data: results,
        isLoading: loadingResults,
        error: resultsError,
    } = useQuery({
        queryKey: ["raffle-results"],
        queryFn: getRaffleResults,
    });

    const initMutation = useMutation({
        mutationFn: () => initializeRaffle(DEFAULT_PRIZES),
        onSuccess: () => {
            setSuccessMsg("Raffle initialized successfully!");
            setErrorMsg("");
            queryClient.invalidateQueries({ queryKey: ["raffle-config"] });
            setTimeout(() => setSuccessMsg(""), 3000);
        },
        onError: (err) => {
            setErrorMsg(`Error initializing raffle: ${(err as Error).message}`);
        },
    });

    const rollMutation = useMutation({
        mutationFn: rollRaffle,
        onSuccess: () => {
            setSuccessMsg("Raffle rolled! Check results below.");
            setErrorMsg("");
            queryClient.invalidateQueries({ queryKey: ["raffle-config"] });
            queryClient.invalidateQueries({ queryKey: ["raffle-results"] });
            setTimeout(() => setSuccessMsg(""), 5000);
        },
        onError: (err) => {
            setErrorMsg(`Error rolling raffle: ${(err as Error).message}`);
        },
    });

    const resetMutation = useMutation({
        mutationFn: () => resetRaffle(DEFAULT_PRIZES),
        onSuccess: () => {
            setSuccessMsg("Raffle reset successfully!");
            setErrorMsg("");
            queryClient.invalidateQueries({ queryKey: ["raffle-config"] });
            queryClient.invalidateQueries({ queryKey: ["raffle-results"] });
            setTimeout(() => setSuccessMsg(""), 3000);
        },
        onError: (err) => {
            setErrorMsg(`Error resetting raffle: ${(err as Error).message}`);
        },
    });

    if (!profile || !profile.admin) {
        return (
            <main>
                <p className="p-2">
                    You don&apos;t have admin permissions. If you think this is a
                    mistake, contact us.
                </p>
            </main>
        );
    }

    return (
        <main>
            <div className="w-full h-auto flex justify-center">
                <div className="max-w-3xl w-full h-full p-4 flex flex-col gap-4">
                    <div className="p-2 bg-amber-400 text-slate-900 rounded flex items-center gap-2">
                        <ExclamationCircleIcon className="w-16 h-16" />
                        <p>
                            <span className="font-bold">Raffle System:</span> Roll the
                            raffle to select winners. Users earn 1 entry per 100 points.
                        </p>
                    </div>

                    <h1 className="font-bold text-2xl">Raffle Manager</h1>

                    {/* Messages */}
                    {errorMsg && (
                        <div className="p-3 bg-red-900 text-red-100 rounded border border-red-700">
                            {errorMsg}
                        </div>
                    )}
                    {successMsg && (
                        <div className="p-3 bg-green-900 text-green-100 rounded border border-green-700">
                            {successMsg}
                        </div>
                    )}

                    {/* Prizes Overview */}
                    <div className="border-2 border-slate-700 rounded p-4 bg-slate-800">
                        <h2 className="font-bold text-lg mb-3">Prize Pool</h2>
                        <div className="grid grid-cols-1 gap-2">
                            {DEFAULT_PRIZES.map((prize) => (
                                <div
                                    key={prize.id}
                                    className="bg-slate-700 p-2 rounded flex justify-between items-center"
                                >
                                    <div>
                                        <p className="font-semibold">{prize.name}</p>
                                        <p className="text-sm text-slate-300">
                                            {prize.description}
                                        </p>
                                    </div>
                                    <p className="text-xl font-bold text-yellow-400">
                                        ×{prize.quantity}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Entry Information */}
                    <div className="border-2 border-slate-700 rounded p-4 bg-slate-800">
                        <h2 className="font-bold text-lg mb-3">Raffle Info</h2>
                        {loadingConfig && <p>Loading raffle config...</p>}
                        {configError && (
                            <p className="text-red-400">Error loading config</p>
                        )}
                        {config && (
                            <>
                                <p>
                                    <span className="text-slate-300">
                                        Points per entry:
                                    </span>{" "}
                                    <span className="font-bold">
                                        {config.pointsPerEntry}
                                    </span>
                                </p>
                                <p>
                                    <span className="text-slate-300">Status:</span>{" "}
                                    <span
                                        className={`font-bold ${
                                            config.active
                                                ? "text-green-400"
                                                : "text-red-400"
                                        }`}
                                    >
                                        {config.active ? "ACTIVE" : "COMPLETED"}
                                    </span>
                                </p>
                            </>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2">
                        {!config ? (
                            <button
                                onClick={() => initMutation.mutate()}
                                disabled={initMutation.isPending}
                                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {initMutation.isPending
                                    ? "Initializing..."
                                    : "Initialize Raffle"}
                            </button>
                        ) : (
                            <>
                                {config.active && (
                                    <button
                                        onClick={() => rollMutation.mutate()}
                                        disabled={
                                            rollMutation.isPending ||
                                            loadingEntries
                                        }
                                        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed bg-green-600 hover:bg-green-700"
                                    >
                                        {rollMutation.isPending
                                            ? "Rolling..."
                                            : "🎲 Roll Raffle"}
                                    </button>
                                )}

                                <button
                                    onClick={() => setShowResults(!showResults)}
                                    className="btn-secondary w-full"
                                >
                                    {showResults
                                        ? "Hide Entry Details"
                                        : "View Entry Details"}
                                </button>

                                <button
                                    onClick={() => {
                                        if (
                                            confirm(
                                                "Are you sure? This will reset all raffle results."
                                            )
                                        ) {
                                            resetMutation.mutate();
                                        }
                                    }}
                                    disabled={resetMutation.isPending}
                                    className="btn-secondary w-full text-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {resetMutation.isPending
                                        ? "Resetting..."
                                        : "Reset Raffle"}
                                </button>
                            </>
                        )}
                    </div>

                    {/* Entry Details */}
                    {showResults && (
                        <div className="border-2 border-slate-700 rounded p-4 bg-slate-800">
                            <h2 className="font-bold text-lg mb-3">
                                Current Entries ({entries?.length || 0})
                            </h2>
                            {loadingEntries && <p>Loading entries...</p>}
                            {entriesError && (
                                <p className="text-red-400">Error loading entries</p>
                            )}
                            {entries && entries.length > 0 ? (
                                <div className="max-h-96 overflow-y-auto space-y-2">
                                    {entries
                                        .sort((a, b) => b.entries - a.entries)
                                        .map((entry) => (
                                            <div
                                                key={entry.uid}
                                                className="bg-slate-700 p-2 rounded text-sm"
                                            >
                                                <div className="flex justify-between">
                                                    <div>
                                                        <p className="font-semibold">
                                                            {entry.displayName}
                                                        </p>
                                                        <p className="text-xs text-slate-400">
                                                            {entry.email}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-yellow-400 font-bold">
                                                            {entry.entries} entries
                                                        </p>
                                                        <p className="text-xs text-slate-400">
                                                            {entry.points} pts
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            ) : (
                                <p className="text-slate-400">
                                    No entries yet. Users need 100+ points.
                                </p>
                            )}
                        </div>
                    )}

                    {/* Results */}
                    {results && results.length > 0 && (
                        <div className="border-2 border-yellow-600 rounded p-4 bg-yellow-950">
                            <h2 className="font-bold text-lg mb-3 text-yellow-300">
                                🎉 Raffle Results ({results.length} winners)
                            </h2>
                            <div className="space-y-3">
                                {results.map((result, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-slate-700 p-3 rounded border-l-4 border-yellow-400"
                                    >
                                        <p className="font-bold text-yellow-300">
                                            {result.prizeName}
                                        </p>
                                        <p className="text-lg font-semibold">
                                            {result.winnerName}
                                        </p>
                                        <p className="text-sm text-slate-300">
                                            {result.winnerEmail}
                                        </p>
                                        <p className="text-xs text-slate-400 mt-1">
                                            {result.timestamp
                                                .toDate()
                                                .toLocaleString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
