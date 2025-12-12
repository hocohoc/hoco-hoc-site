"use client";

import React, { useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import { trainModel, evaluateModel, LabeledSample } from "@/ml/model";
import { useProfile } from "@/app/components/auth-provider/authProvider";
import { awardGamePoints } from "@/app/services/gameService";

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

// 🧪 Extra test-only images
const extraTestImages = [
  { url: "/game/cat/cat/cat11.png", isCat: true },
  { url: "/game/cat/cat/cat12.png", isCat: true },
  { url: "/game/cat/cat/cat13.png", isCat: true },
  { url: "/game/cat/fish/fish11.png", isCat: false },
  { url: "/game/cat/fish/fish12.png", isCat: false },
  { url: "/game/cat/fish/fish13.png", isCat: false },
];

type Phase = "label" | "train" | "test" | "upload";

export default function CatTrainerGame() {
  const profile = useProfile();
  const user = profile;
  const [phase, setPhase] = useState<Phase>("label");
  const [labels, setLabels] = useState<Record<string, 0 | 1>>({});
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [uploadedResults, setUploadedResults] = useState<any[]>([]);
  const [shuffledImages, setShuffledImages] = useState(allImages);
  const [pointsAwarded, setPointsAwarded] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);

  useEffect(() => {
    setShuffledImages(shuffleArray(allImages));
  }, []);

  const current = shuffledImages[index];

  // 🧠 Train and test automatically
  async function handleTrain() {
    setPhase("train");
    setStatus("Training Purr-ceptron...");

    const samples: LabeledSample[] = shuffledImages.map((i) => ({
      imageUrl: i.url,
      label: labels[i.url]!,
    }));

    const m = await trainModel(samples, (epoch, logs) =>
      setStatus(`Epoch ${epoch + 1}: loss ${logs?.loss?.toFixed(3)}`)
    );

    setModel(m);
    setStatus("Training done! Testing on unseen images...");

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

    // Award points based on accuracy
    if (user && !pointsAwarded) {
      let points = 0;
      if (accuracy >= 0.9) points = 50; // 90%+ accuracy
      else if (accuracy >= 0.8) points = 30; // 80%+ accuracy
      else if (accuracy >= 0.7) points = 15; // 70%+ accuracy

      if (points > 0) {
        const gameId = `purrceptron-${Date.now()}`;
        await awardGamePoints(user.uid, gameId, "purrceptron", accuracy * 100, points);
        setPointsAwarded(true);
        setPointsEarned(points);
      }
    }
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
    setUploadedResults([]);
    setAccuracy(null);
    setIndex(0);
    setStatus("");
    setShuffledImages(shuffleArray(allImages));
    setPointsAwarded(false);
    setPointsEarned(0);
  }

  // 🧩 Upload user test images
  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!model) return;
    const files = Array.from(e.target.files || []);
    const urls = files.map((file) => URL.createObjectURL(file));

    const { results } = await evaluateModel(
      model,
      urls.map((u) => ({ imageUrl: u, groundTruth: 0 }))
    );

    setUploadedResults((prev) => [...prev, ...results]);
  }

  // 🗑️ Remove uploaded photo
  function removeUploadedImage(url: string) {
    URL.revokeObjectURL(url); // free memory
    setUploadedResults((prev) => prev.filter((r) => r.imageUrl !== url));
  }

  return (
    <div className="p-6 text-center text-slate-100">
      {/* 🧾 Intro Section */}
      <div className="max-w-4xl mx-auto text-left bg-slate-800 p-6 rounded-2xl shadow-lg mb-8">
        <h2 className="text-xl font-bold text-yellow-300 mb-2">Welcome to Purr-ceptron!</h2> 
        <p className="text-slate-200 mb-3"> Computers can learn by looking at examples, just like us! In this game, you will teach 
          <span className="text-sky-300 font-semibold"> Purr-ceptron</span> how to tell the difference between pictures of 
          <span className="text-sky-400 font-semibold"> 🐱 cats </span> and <span className="text-pink-400 font-semibold"> 🐟 fish</span>. 
        </p>
        <h3 className="text-lg font-semibold text-emerald-300 mb-1">How it works:</h3>
         <ul className="list-disc list-inside text-slate-200 mb-3">
           <li>Machine learning means giving the computer lots of examples so it can “learn” patterns.</li>
            <li>Each picture you label helps Purr-ceptron understand what cats and fish look like.</li> 
            <li>After training, Purr-ceptron will test itself on new pictures it has <em>never seen before!</em></li> 
          </ul> 
          <h3 className="text-lg font-semibold text-sky-300 mb-1">How to play:</h3>
         <ol className="list-decimal list-inside text-slate-200"> 
          <li>Look at each picture carefully.</li>
          <li>Click <span className="text-sky-400 font-semibold">“🐱 Cat”</span> if it’s a cat, or 
          <span className="text-pink-400 font-semibold">“🐟 Fish</span> if it’s a fish.</li>
           <li>After you label all the pictures, click <span className="text-emerald-300 font-semibold">“Train Purr-ceptron”</span>. </li> 
           <li>Watch Purr-ceptron learn! When it’s done, see how well it can tell cats and fish apart!</li> 
          </ol> 
          <p className="text-slate-300 mt-4 italic"> Tip: If Purr-ceptron makes mistakes, try training again! </p>
           </div>
      <h1 className="text-2xl font-bold text-sky-300 mb-3">
        Train Purr-ceptron!
      </h1>

      {/* 🏷️ Label Phase */}
      {phase === "label" && current && (
        <div>
          <p className="mb-2">
            Image {index + 1} of {shuffledImages.length} ─ Is this a cat?
          </p>
          <img
            src={current.url}
            alt="training"
            className="mx-auto w-64 h-64 object-cover rounded-xl mb-3 border bg-white border-slate-600"
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
              Train Purr-ceptron
            </button>
          )}
        </div>
      )}

      {/* ⚙️ Training Phase */}
      {phase === "train" && (
        <div>
          <p className="text-amber-300 animate-pulse">{status}</p>
        </div>
      )}

      {/* 🧪 Test Phase */}
      {phase === "test" && (
        <div>
          <p className="text-emerald-400 font-semibold mb-2">
            Purr-ceptron Accuracy on Unseen Images: {(accuracy! * 100).toFixed(1)}%
          </p>

          {/* Points Earned Display */}
          {pointsEarned > 0 && (
            <div className="bg-yellow-900 bg-opacity-50 border border-yellow-500 rounded-lg p-4 mb-4">
              <p className="text-yellow-300 font-bold text-xl">
                🎉 You earned {pointsEarned} points!
              </p>
              <p className="text-sm text-gray-300 mt-1">
                {accuracy! >= 0.9 ? "Amazing accuracy!" : accuracy! >= 0.8 ? "Great job!" : "Good start!"}
              </p>
            </div>
          )}

          {/* Test Results */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {results.map((r) => (
              <div
                key={r.imageUrl}
                className="border border-slate-700 rounded-lg overflow-hidden bg-slate-900"
              >
                <img
                  src={r.imageUrl}
                  className="w-64 h-64 object-cover"
                  alt="test"
                />
                <p className="text-sm p-2">
                  Purr-ceptron says:{" "}
                  <span
                    className={
                      r.label === 1 ? "text-sky-400" : "text-pink-400"
                    }
                  >
                    {r.label === 1 ? "Cat 🐱" : "Fish 🐟"}
                  </span>
                  <br />
                  {r.label === r.groundTruth ? "✅ Correct" : "❌ Wrong"}
                </p>
              </div>
            ))}
          </div>

          {/* 🧩 Upload & Predict Section */}
          <div className="mt-6 bg-slate-800 p-4 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold text-sky-300 mb-2">
              Upload your own images for Purr-ceptron to guess!
            </h3>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
              className="block mx-auto mb-3"
            />

            {uploadedResults.length > 0 && (
              <div className="grid grid-cols-2 gap-3 mt-4">
                {uploadedResults.map((r, idx) => (
                  <div
                    key={r.imageUrl + idx}
                    className="relative border border-slate-700 rounded-lg overflow-hidden bg-slate-900"
                  >
                    <img
                      src={r.imageUrl}
                      className="w-64 h-64 object-cover bg-white"
                      alt="uploaded"
                    />
                    {/* 🗑️ Remove button */}
                    <button
                      onClick={() => removeUploadedImage(r.imageUrl)}
                      className="absolute top-0 right-0 bg-red-600 hover:bg-red-700 text-xs text-white rounded-full w-5 h-5 flex items-center justify-center"
                      title="Remove image"
                    >
                      ×
                    </button>

                    <p className="text-sm p-2">
                      Purr-ceptron says:{" "}
                      <span
                        className={
                          r.label === 1 ? "text-sky-400" : "text-pink-400"
                        }
                      >
                        {r.label === 1 ? "Cat 🐱" : "Fish 🐟"}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleReset}
            className="mt-6 bg-sky-500 px-4 py-2 rounded-full text-black font-semibold"
          >
            Train Again
          </button>
        </div>
      )}
    </div>
  );
}
