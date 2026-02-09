"use client";

import Link from "next/link";

interface Game {
  name: string;
  path: string;
  description: string;
  image: string;
  earnsPoints: boolean;
  tag?: string;
}

const games: Game[] = [
  {
    name: "Purr-ceptron",
    path: "/game/Purrceptron",
    description: "Train Purr-ceptron to tell cats from fish!",
    image: "/game/cat/preview.png",
    earnsPoints: false,
    tag: "AI / ML",
  },
  {
    name: "FlexiBot",
    path: "/game/Flexibot",
    description: "Train FlexiBot to recognize anything you want!",
    image: "/game/flexibot/preview.png",
    earnsPoints: false,
    tag: "AI / ML",
  },
  {
    name: "Binary Decoder",
    path: "/game/BinaryDecoder",
    description: "Decode binary messages and earn points!",
    image: "/game/binary-decoder-preview.svg",
    earnsPoints: true,
    tag: "CS Fundamentals",
  },
  {
    name: "Mindstorm",
    path: "/game/Mindstorm",
    description: "Predict what the code will output!",
    image: "/game/mindstorm-preview.svg",
    earnsPoints: true,
    tag: "Programming",
  },
  {
    name: "Algo Sorter",
    path: "/game/AlgoSorter",
    description: "Sort the array in the fewest swaps possible!",
    image: "",
    earnsPoints: true,
    tag: "Algorithms",
  },
  {
    name: "Hex Guesser",
    path: "/game/HexGuesser",
    description: "Test your hex color code knowledge!",
    image: "",
    earnsPoints: true,
    tag: "Web Dev",
  },
];

export default function GameHub() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-950 to-black text-white flex flex-col items-center py-16">
      <h1 className="text-4xl font-bold mb-2">Games</h1>
      <p className="text-gray-400 mb-10 text-center max-w-lg">
        Play games to learn CS concepts. Games marked with <span className="text-yellow-400 font-bold">⭐</span> earn you points toward prizes!
      </p>

      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 px-6">
        {games.map((game) => (
          <Link
            key={game.name}
            href={game.path}
            className="group bg-gray-800 hover:bg-indigo-700 transition-all duration-300 rounded-2xl shadow-lg overflow-hidden flex flex-col justify-between w-72 transform hover:scale-105"
          >
            {/* Game preview image or placeholder */}
            <div className="relative">
              {game.image ? (
                <img
                  src={game.image}
                  alt={game.name}
                  className="w-full h-40 object-cover group-hover:opacity-90"
                />
              ) : (
                <div className="w-full h-40 bg-gradient-to-br from-indigo-900 to-gray-800 flex items-center justify-center">
                  <span className="text-5xl">{game.name === "Algo Sorter" ? "🔢" : "🎨"}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition" />
              {/* Badges */}
              <div className="absolute top-2 left-2 flex gap-1.5">
                {game.earnsPoints && (
                  <span className="bg-yellow-500/90 text-black text-xs font-bold px-2 py-0.5 rounded-full">
                    ⭐ Earns Points
                  </span>
                )}
                {game.tag && (
                  <span className="bg-sky-600/90 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {game.tag}
                  </span>
                )}
              </div>
            </div>

            {/* Game info */}
            <div className="flex flex-col flex-grow justify-between p-5">
              <div>
                <h2 className="text-2xl font-semibold mb-2 group-hover:text-yellow-300">
                  {game.name}
                </h2>
                <p className="text-gray-300 text-sm">{game.description}</p>
              </div>

              <span className="mt-4 text-indigo-300 font-medium group-hover:text-yellow-300">
                ▶ Play
              </span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
