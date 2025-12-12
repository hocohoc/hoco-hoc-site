"use client";

import React, { useState } from "react";
import * as tf from "@tensorflow/tfjs";
import { trainModel, predictImages, LabeledSample } from "@/ml/model";
import { useProfile } from "@/app/components/auth-provider/authProvider";
import { awardGamePoints } from "@/app/services/gameService";

type Phase = "setup" | "upload" | "train" | "test";

type TrainImage = {
  url: string;
  label: 0 | 1;
};

export default function FlexiBotGame() {
  const profile = useProfile();
  const user = profile;
  const [phase, setPhase] = useState<Phase>("setup");

  const [categoryNames, setCategoryNames] = useState<{
    zero: string;
    one: string;
  }>({
    zero: "",
    one: "",
  });

  const [trainImages, setTrainImages] = useState<TrainImage[]>([]);
  const [status, setStatus] = useState("");
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [testResults, setTestResults] = useState<
    { imageUrl: string; prob: number; label: 0 | 1 }[]
  >([]);
  const [pointsAwarded, setPointsAwarded] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);

  const countLabel = (label: 0 | 1) =>
    trainImages.filter((img) => img.label === label).length;

  const canTrain =
    countLabel(0) > 0 &&
    countLabel(1) > 0 &&
    phase === "upload" &&
    trainImages.length > 1;

  function handleCategoryNameChange(
    field: "zero" | "one",
    value: string
  ) {
    setCategoryNames((prev) => ({ ...prev, [field]: value }));
  }

  function goToUploadPhase() {
    if (!categoryNames.zero.trim() || !categoryNames.one.trim()) {
      alert("Please name both categories first.");
      return;
    }
    setPhase("upload");
  }

  function handleTrainUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    label: 0 | 1
  ) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newImages: TrainImage[] = files.map((file) => ({
      url: URL.createObjectURL(file),
      label,
    }));

    setTrainImages((prev) => [...prev, ...newImages]);
  }

  function removeTrainImage(url: string) {
    URL.revokeObjectURL(url); // cleanup memory
    setTrainImages((prev) => prev.filter((img) => img.url !== url));
  }

  async function handleTrain() {
    if (!canTrain) return;
    setPhase("train");
    setStatus("Training your model...");

    const samples: LabeledSample[] = trainImages.map((img) => ({
      imageUrl: img.url,
      label: img.label,
    }));

    const m = await trainModel(samples, (epoch, logs) => {
      setStatus(
        `Epoch ${epoch + 1}: loss ${logs?.loss?.toFixed(3)} ` +
          `(accuracy: ${(logs?.acc as number | undefined)?.toFixed(
            3
          ) ?? "N/A"})`
      );
    });

    setModel(m);
    setStatus("Training complete! Try testing with new images.");
    setPhase("test");

    // Award points for successfully training the model
    if (user && !pointsAwarded) {
      const imageCount = trainImages.length;
      let points = 0;
      if (imageCount >= 20) points = 40; // 20+ images
      else if (imageCount >= 10) points = 25; // 10+ images
      else if (imageCount >= 5) points = 15; // 5+ images

      if (points > 0) {
        const gameId = `flexibot-${Date.now()}`;
        await awardGamePoints(user.uid, gameId, "flexibot", imageCount, points);
        setPointsAwarded(true);
        setPointsEarned(points);
      }
    }
  }

  async function handleTestUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    if (!model) return;

    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const urls = files.map((file) => URL.createObjectURL(file));
    const preds = await predictImages(model, urls);

    setTestResults((prev) => [...prev, ...preds]);
  }

  function removeTestImage(url: string) {
    URL.revokeObjectURL(url);
    setTestResults((prev) => prev.filter((r) => r.imageUrl !== url));
  }

  function handleReset() {
    if (model) model.dispose();
    setPhase("setup");
    setCategoryNames({ zero: "", one: "" });
    setTrainImages([]);
    setStatus("");
    setModel(null);
    setTestResults([]);
    setPointsAwarded(false);
    setPointsEarned(0);
  }

  const labelToName = (label: 0 | 1) =>
    label === 0 ? categoryNames.zero : categoryNames.one;

  return (
    <div className="p-6 text-center text-slate-100">
      <div className="max-w-4xl mx-auto text-left bg-slate-800 p-6 rounded-2xl shadow-lg mb-8">
        <h2 className="text-xl font-bold text-yellow-300 mb-2">
          Welcome to FlexiBot!
        </h2>
        <p className="text-slate-200 mb-3">
          In this game,{" "}
          <span className="text-sky-300 font-semibold">you</span> choose what
          the computer learns! Pick any two categories (like{" "}
          <span className="text-sky-400">dogs</span> vs{" "}
          <span className="text-pink-400">cats</span>), upload example images,
          and teach FlexiBot to tell them apart.
        </p>
        <h3 className="text-lg font-semibold text-emerald-300 mb-1">
          How it works:
        </h3>
        <ol className="list-decimal list-inside text-slate-200 space-y-1">
          <li>Choose names for your two categories.</li>
          <li>Upload some training images into each category.</li>
          <li>
            Click{" "}
            <span className="text-emerald-300 font-semibold">
              “Train Model”
            </span>{" "}
            to teach FlexiBot.
          </li>
          <li>Upload new images and see which category FlexiBot predicts!</li>
        </ol>
        <p className="text-slate-300 mt-4 italic">
          Tip: The more clear, varied examples you upload, the better FlexiBot
          gets.
        </p>
      </div>

      <h1 className="text-2xl font-bold text-sky-300 mb-4">
        Build Your Own Image Classifier
      </h1>

      {/* 🧾 Phase 1: Setup category names */}
      {phase === "setup" && (
        <div className="max-w-xl mx-auto bg-slate-800 p-6 rounded-2xl shadow-lg">
          <h2 className="text-lg font-semibold mb-4">
            Step 1: Name your two categories
          </h2>

          {/* Two inputs with inside placeholders */}
          <div className="space-y-4">
            <input
              type="text"
              value={categoryNames.zero}
              onChange={(e) =>
                handleCategoryNameChange("zero", e.target.value)
              }
              className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-600 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Category 1 (e.g. Dogs)"
            />

            <input
              type="text"
              value={categoryNames.one}
              onChange={(e) =>
                handleCategoryNameChange("one", e.target.value)
              }
              className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-600 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Category 2 (e.g. Cats)"
            />
          </div>

          <button
            onClick={goToUploadPhase}
            className="mt-6 bg-sky-500 px-4 py-2 rounded-full text-black font-semibold"
          >
            Next: Upload Training Images
          </button>
        </div>
      )}

      {/* 📤 Phase 2: Upload training data */}
      {phase === "upload" && (
        <div className="max-w-4xl mx-auto">
          <h2 className="text-lg font-semibold mb-3">
            Step 2: Upload training images
          </h2>
          <p className="text-slate-300 mb-4">
            Try to upload at least a few images for{" "}
            <span className="font-semibold">{categoryNames.zero}</span> and{" "}
            <span className="font-semibold">{categoryNames.one}</span>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Category 0 */}
            <div className="bg-slate-800 p-4 rounded-xl shadow-md">
              <h3 className="font-semibold text-sky-300 mb-2">
                {categoryNames.zero || "Category 1"} 
              </h3>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleTrainUpload(e, 0)}
                className="block mb-3"
              />
              <p className="text-sm text-slate-300 mb-2">
                Uploaded:{" "}
                <span className="font-semibold">
                  {countLabel(0)} image{countLabel(0) === 1 ? "" : "s"}
                </span>
              </p>

              <div className="flex flex-wrap gap-2 max-h-48 overflow-auto">
                {trainImages
                  .filter((img) => img.label === 0)
                  .map((img, idx) => (
                    <div key={img.url + idx} className="relative">
                      <img
                        src={img.url}
                        alt="train-0"
                        className="w-20 h-20 object-cover rounded-md border border-slate-700 bg-white"
                      />
                      <button
                        onClick={() => removeTrainImage(img.url)}
                        className="absolute top-0 right-0 bg-red-600 hover:bg-red-700 text-xs text-white rounded-full w-5 h-5 flex items-center justify-center"
                        title="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
              </div>
            </div>

            {/* Category 1 */}
            <div className="bg-slate-800 p-4 rounded-xl shadow-md">
              <h3 className="font-semibold text-pink-300 mb-2">
                {categoryNames.one || "Category 2"} 
              </h3>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleTrainUpload(e, 1)}
                className="block mb-3"
              />
              <p className="text-sm text-slate-300 mb-2">
                Uploaded:{" "}
                <span className="font-semibold">
                  {countLabel(1)} image{countLabel(1) === 1 ? "" : "s"}
                </span>
              </p>

              <div className="flex flex-wrap gap-2 max-h-48 overflow-auto">
                {trainImages
                  .filter((img) => img.label === 1)
                  .map((img, idx) => (
                    <div key={img.url + idx} className="relative">
                      <img
                        src={img.url}
                        alt="train-1"
                        className="w-20 h-20 object-cover rounded-md border border-slate-700 bg-white"
                      />
                      <button
                        onClick={() => removeTrainImage(img.url)}
                        className="absolute top-0 right-0 bg-red-600 hover:bg-red-700 text-xs text-white rounded-full w-5 h-5 flex items-center justify-center"
                        title="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleTrain}
            disabled={!canTrain}
            className={`px-4 py-2 rounded-full font-semibold ${
              canTrain
                ? "bg-emerald-500 text-black"
                : "bg-slate-600 text-slate-300 cursor-not-allowed"
            }`}
          >
            {canTrain
              ? "Train Model"
              : "Upload at least 1 image for each category"}
          </button>

          <button
            onClick={handleReset}
            className="ml-3 px-4 py-2 rounded-full font-semibold bg-slate-700 text-slate-100"
          >
            Reset
          </button>
        </div>
      )}

      {/* ⚙️ Phase 3: Training */}
      {phase === "train" && (
        <div className="mt-6">
          <p className="text-amber-300 animate-pulse">{status}</p>
          <button
            onClick={handleReset}
            className="mt-4 bg-slate-700 px-4 py-2 rounded-full text-slate-100 font-semibold"
          >
            Reset
          </button>
        </div>
      )}

      {/* 🧪 Phase 4: Test */}
      {phase === "test" && (
        <div className="mt-6 max-w-4xl mx-auto">
          <p className="text-emerald-300 mb-3 font-semibold">
            Your model is trained! Upload new images and see what FlexiBot
            predicts.
          </p>

          {/* Points Earned Display */}
          {pointsEarned > 0 && (
            <div className="bg-yellow-900 bg-opacity-50 border border-yellow-500 rounded-lg p-4 mb-4">
              <p className="text-yellow-300 font-bold text-xl">
                🎉 You earned {pointsEarned} points!
              </p>
              <p className="text-sm text-gray-300 mt-1">
                {trainImages.length >= 20 ? "Excellent dataset!" : trainImages.length >= 10 ? "Great work!" : "Good start!"}
              </p>
            </div>
          )}

          <div className="bg-slate-800 p-4 rounded-xl shadow-md mb-6">
            <h3 className="text-lg font-semibold text-sky-300 mb-2">
              Upload test images
            </h3>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleTestUpload}
              className="block mb-2"
            />
            <p className="text-sm text-slate-300">
              FlexiBot will guess whether each image is{" "}
              <span className="font-semibold">{categoryNames.zero}</span> or{" "}
              <span className="font-semibold">{categoryNames.one}</span>.
            </p>
          </div>

          {testResults.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {testResults.map((r, idx) => (
                <div
                  key={r.imageUrl + idx}
                  className="relative border border-slate-700 rounded-lg overflow-hidden bg-slate-900"
                >
                  <img
                    src={r.imageUrl}
                    alt="test"
                    className="w-full h-48 object-cover bg-white"
                  />
                  <button
                    onClick={() => removeTestImage(r.imageUrl)}
                    className="absolute top-0 right-0 bg-red-600 hover:bg-red-700 text-xs text-white rounded-full w-5 h-5 flex items-center justify-center"
                    title="Remove image"
                  >
                    ×
                  </button>
                  <div className="p-2 text-sm">
                    <p>
                      FlexiBot says:{" "}
                      <span
                        className={
                          r.label === 0 ? "text-sky-300" : "text-pink-300"
                        }
                      >
                        {labelToName(r.label)}
                      </span>
                    </p>
                    <p className="text-xs text-slate-400">
                      Confidence: {(r.prob * 100).toFixed(1)}% for{" "}
                      {categoryNames.one}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handleReset}
            className="mt-6 bg-sky-500 px-4 py-2 rounded-full text-black font-semibold"
          >
            Start Over
          </button>

          {status && (
            <p className="mt-3 text-xs text-slate-400">
              Training log: {status}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
