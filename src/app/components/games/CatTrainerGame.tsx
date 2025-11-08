"use client";

import React, { useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import { trainModel, evaluateModel, LabeledSample } from "@/ml/model";

// 🎲 Shuffle helper
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// 🐱 Training data (10 cats + 10 fish)
const allImages = [
  // Cats
  { url: "/game/cat/cat/cat1.png", isCat: true },
  { url: "/game/cat/cat/cat2.png", isCat: true },
  { url: "/game/cat/cat/cat3.png", isCat: true },
  { url: "/game/cat/cat/cat4.png", isCat: true },
  { url: "/game/cat/cat/cat5.png", isCat: true },
  { url: "/game/cat/cat/cat6.png", isCat: true },
  { url: "/game/cat/cat/cat7.png", isCat: true },
  { url: "/game/cat/cat/cat8.png", isCat: true },
  { url: "/game/cat/cat/cat9.png", isCat: true },
  { url: "/game/cat/cat/cat10.png", isCat: true },

  // Fish
  { url: "/game/cat/fish/fish1.png", isCat: false },
  { url: "/game/cat/fish/fish2.png", isCat: false },
  { url: "/game/cat/fish/fish3.png", isCat: false },
  { url: "/game/cat/fish/fish4.png", isCat: false },
  { url: "/game/cat/fish/fish5.png", isCat: false },
  { url: "/game/cat/fish/fish6.png", isCat: false },
  { url: "/game/cat/fish/fish7.png", isCat: false },
  { url: "/game/cat/fish/fish8.png", isCat: false },
  { url: "/game/cat/fish/fish9.png", isCat: false },
  { url: "/game/cat/fish/fish10.png", isCat: false },
];

// 🧪 Extra test-only images (never shown during training)
const extraTestImages = [
  { url: "/game/cat/cat/cat11.png", isCat: true },
  { url: "/game/cat/cat/cat12.png", isCat: true },
  { url: "/game/cat/cat/cat13.png", isCat: true },
  { url: "/game/cat/fish/fish11.png", isCat: false },
  { url: "/game/cat/fish/fish12.png", isCat: false },
  { url: "/game/cat/fish/fish13.png", isCat: false },
];

type Phase = "label" | "train" | "test";

export default function CatTrainerGame() {
  const [phase, setPhase] = useState<Phase>("label");
  const [labels, setLabels] = useState<Record<string, 0 | 1>>({});
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [shuffledImages, setShuffledImages] = useState(allImages);

  useEffect(() => {
    setShuffledImages(shuffleArray(allImages));
  }, []);

  const current = shuffledImages[index];

  async function handleTrain() {
    setPhase("train");
    setStatus("Training CatBot...");

    const samples: LabeledSample[] = shuffledImages.map((i) => ({
      imageUrl: i.url,
      label: labels[i.url]!,
    }));

    const m = await trainModel(samples, (epoch, logs) =>
      setStatus(`Epoch ${epoch + 1}: loss ${logs?.loss?.toFixed(3)}`)
    );

    setModel(m);
    setStatus("Training done! Testing on unseen images...");

    // ✅ test on new cat11–13 + fish11–13
    const { results, accuracy } = await evaluateModel(
      m,
      extraTestImages.map((i) => ({
        imageUrl: i.url,
        groundTruth: i.isCat ? 1 : 0,
      }))
    );

    setResults(results);
    setAccuracy(accuracy);
    setPhase("test");
  }

  function handleLabel(label: 0 | 1) {
    setLabels({ ...labels, [current.url]: label });
    setIndex((prev) => Math.min(prev + 1, shuffledImages.length - 1));
  }

  function handleReset() {
    model?.dispose();
    setPhase("label");
    setLabels({});
    setResults([]);
    setAccuracy(null);
    setIndex(0);
    setStatus("");
    setShuffledImages(shuffleArray(allImages));
  }

  return (
    
    <div className="p-6 text-center text-slate-100">
        <div className="max-w-2xl mx-auto text-left bg-slate-800 p-6 rounded-2xl shadow-lg mb-8">
      <h2 className="text-xl font-bold text-yellow-300 mb-2">Welcome to CatBot’s Training Lab!</h2>
      <p className="text-slate-200 mb-3">
        Computers can learn by looking at examples, just like us! In this game, you will teach
        <span className="text-sky-300 font-semibold"> CatBot</span> how to tell the difference between
        pictures of <span className="text-sky-400 font-semibold">cats 🐱</span> and
        <span className="text-pink-400 font-semibold"> fish 🐟</span>.
      </p>
    
      <h3 className="text-lg font-semibold text-emerald-300 mb-1">How it works:</h3>
      <ul className="list-disc list-inside text-slate-200 mb-3">
        <li>Machine learning means giving the computer lots of examples so it can “learn” patterns.</li>
        <li>Each picture you label helps CatBot understand what cats and fish look like.</li>
        <li>After training, CatBot will test itself on new pictures it has <em>never seen before!</em></li>
      </ul>
    
      <h3 className="text-lg font-semibold text-sky-300 mb-1">🎮 How to play:</h3>
      <ol className="list-decimal list-inside text-slate-200">
        <li>Look at each picture carefully.</li>
        <li>Click <span className="text-sky-400 font-semibold">“🐱 Cat”</span> if it’s a cat, or <span className="text-pink-400 font-semibold">“🐟 Fish</span> if it’s a fish.</li>
        <li>After you label all the pictures, click <span className="text-emerald-300 font-semibold">“Train CatBot”</span>.</li>
        <li>Watch CatBot learn! When it’s done, see how well it can tell cats and fish apart!</li>
      </ol>
    
      <p className="text-slate-300 mt-4 italic">
        Tip: If CatBot makes mistakes, try training again!
      </p>
    </div>
      <h1 className="text-2xl font-bold text-sky-300 mb-3">
        🐱 Train the Cat Detector
      </h1>

      {phase === "label" && current && (
        <div>
          <p className="mb-2">
            Image {index + 1} of {shuffledImages.length} — Is this a cat?
          </p>
          <img
            src={current.url}
            alt="training"
            className="mx-auto w-64 h-64 object-cover rounded-xl mb-3 border border-slate-600"
          />
          <div className="flex justify-center gap-3">
            <button
              onClick={() => handleLabel(1)}
              className="bg-sky-500 px-4 py-2 rounded-full text-black font-semibold"
            >
              🐱 Cat
            </button>
            <button
              onClick={() => handleLabel(0)}
              className="bg-pink-500 px-4 py-2 rounded-full text-black font-semibold"
            >
              🐟 Fish
            </button>
          </div>

          <p className="mt-3 text-sm">
            Labeled {Object.keys(labels).length} / {shuffledImages.length}
          </p>

          {Object.keys(labels).length === shuffledImages.length && (
            <button
              onClick={handleTrain}
              className="mt-4 bg-emerald-500 px-4 py-2 rounded-full text-black font-semibold"
            >
              Train CatBot
            </button>
          )}
        </div>
      )}

      {phase === "train" && (
        <div>
          <p className="text-amber-300 animate-pulse">{status}</p>
        </div>
      )}

      {phase === "test" && (
        <div>
          <p className="text-emerald-400 font-semibold mb-2">
            CatBot Accuracy: {(accuracy! * 100).toFixed(1)}%
          </p>
          <div className="grid grid-cols-2 gap-3">
            {results.map((r) => (
              <div
                key={r.imageUrl}
                className="border border-slate-700 rounded-lg overflow-hidden bg-slate-900"
              >
                <img src={r.imageUrl} className="w-full h-40 object-cover" alt="test" />
                <p className="text-sm p-2">
                  CatBot says:{" "}
                  <span className={r.label === 1 ? "text-sky-400" : "text-pink-400"}>
                    {r.label === 1 ? "Cat 🐱" : "Fish 🐟"}
                  </span>
                  <br />
                  {r.label === r.groundTruth ? "✅ Correct" : "❌ Wrong"}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={handleReset}
            className="mt-4 bg-sky-500 px-4 py-2 rounded-full text-black font-semibold"
          >
            Train Again
          </button>
        </div>
      )}
    </div>
  );
}
