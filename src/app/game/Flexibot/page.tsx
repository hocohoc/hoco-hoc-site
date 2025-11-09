"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import CustomTrainer from "@/app/components/games/CustomTrainer";

export default function CatBotPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-950 via-gray-900 to-black text-white relative">
      {/* Back Button */}
      <div className="absolute top-6 left-6">
        <Link
          href="/game"
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium shadow-md transition"
        >
          ← Back to Games
        </Link>
      </div>

      {/* Game Component */}
      <div className="flex flex-col items-center justify-center pt-20 pb-10">
        <CustomTrainer />
      </div>
    </main>
  );
}
