"use client";

import Link from "next/link";

interface Game {
  name: string;
  path: string;
  description: string;
  image: string; 
}

const games: Game[] = [
  {
    name: "Purr-ceptron",
    path: "/game/Purrceptron",
    description: "Train Purr-ceptron to tell cats from fish!",
    image: "/game/cat/preview.png",
  },
  {
    name: "FlexiBot",
    path: "/game/Flexibot",
    description: "Train FlexiBot to recognize anything you want!",
    image: "/game/flexibot/preview.png",
  },
];

export default function GameHub() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-950 to-black text-white flex flex-col items-center py-16">
      <h1 className="text-4xl font-bold mb-10">Games</h1>

      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-6">
        {games.map((game) => (
          <Link
            key={game.name}
            href={game.path}
            className="group bg-gray-800 hover:bg-indigo-700 transition-all duration-300 rounded-2xl shadow-lg overflow-hidden flex flex-col justify-between w-72 transform hover:scale-105"
          >
            {/* Game preview image */}
            <div className="relative">
              <img
                src={game.image}
                alt={game.name}
                className="w-full h-40 object-cover group-hover:opacity-90"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition" />
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
