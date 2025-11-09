import * as tf from "@tensorflow/tfjs";

export type LabeledSample = {
  imageUrl: string;
  label: 0 | 1; // 1 = category B (e.g. "cats"), 0 = category A
};

// 🧠 Cache MobileNet globally so it loads only once
let cachedMobilenet: tf.LayersModel | null = null;

/**
 * Load and preprocess an image to a [1, 224, 224, 3] tensor
 */
async function loadImageTensor(url: string): Promise<tf.Tensor4D> {
  return new Promise<tf.Tensor4D>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; // works for blob URLs and remote
    img.src = url;
    img.onload = () => {
      try {
        const tensor = tf.tidy(() => {
          const t = tf.browser
            .fromPixels(img)
            .resizeBilinear([224, 224])
            .toFloat()
            .div(255)
            .expandDims(0); // [1, 224, 224, 3]
          return t as tf.Tensor4D;
        });
        resolve(tensor);
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = (err) => reject(err);
  });
}

/**
 * Train a small classifier using MobileNet features.
 */
export async function trainModel(
  samples: LabeledSample[],
  onEpoch?: (epoch: number, logs?: tf.Logs) => void
): Promise<tf.LayersModel> {
  // 1️⃣ Load (or reuse) MobileNet
  if (!cachedMobilenet) {
    cachedMobilenet = await tf.loadLayersModel(
      "https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json"
    );
  }

  const mobilenet = cachedMobilenet;
  const featureLayer = mobilenet.getLayer("conv_pw_13_relu");
  const extractor = tf.model({
    inputs: mobilenet.inputs,
    outputs: featureLayer.output,
  });

  // 2️⃣ Extract features for each labeled image
  const featureTensors: tf.Tensor[] = [];
  const labels: number[] = [];

  for (const sample of samples) {
    const imgTensor = await loadImageTensor(sample.imageUrl);
    const feat = extractor.predict(imgTensor) as tf.Tensor;
    featureTensors.push(feat.flatten());
    labels.push(sample.label);
    imgTensor.dispose();
    feat.dispose();
  }

  const xs = tf.stack(featureTensors);
  const ys = tf.tensor2d(labels, [labels.length, 1]);

  // 3️⃣ Build small classifier
  const model = tf.sequential();
  model.add(
    tf.layers.dense({
      units: 64,
      activation: "relu",
      inputShape: [xs.shape[1]],
    })
  );
  model.add(tf.layers.dropout({ rate: 0.3 }));
  model.add(tf.layers.dense({ units: 1, activation: "sigmoid" }));

  model.compile({
    optimizer: tf.train.adam(0.0005),
    loss: "binaryCrossentropy",
    metrics: ["accuracy"],
  });

  // 4️⃣ Train
  await model.fit(xs, ys, {
    epochs: 10,
    batchSize: 4,
    shuffle: true,
    callbacks: {
      onEpochEnd: async (epoch, logs) => {
        onEpoch?.(epoch, logs);
        await tf.nextFrame(); // allow UI to update
      },
    },
  });

  // ✅ Cleanup
  featureTensors.forEach((t) => t.dispose());
  xs.dispose();
  ys.dispose();
  // Don't dispose mobilenet — it's cached globally

  return model;
}

/**
 * Evaluate model on test images using the same MobileNet feature extractor.
 * (Used by CatBot – keeps ground truth + accuracy.)
 */
export async function evaluateModel(
  model: tf.LayersModel,
  testSet: { imageUrl: string; groundTruth: 0 | 1 }[]
): Promise<{ results: any[]; accuracy: number }> {
  // Ensure MobileNet is available
  if (!cachedMobilenet) {
    cachedMobilenet = await tf.loadLayersModel(
      "https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json"
    );
  }

  const mobilenet = cachedMobilenet;
  const featureLayer = mobilenet.getLayer("conv_pw_13_relu");
  const extractor = tf.model({
    inputs: mobilenet.inputs,
    outputs: featureLayer.output,
  });

  const results: any[] = [];
  let correct = 0;

  for (const sample of testSet) {
    const imgTensor = await loadImageTensor(sample.imageUrl);
    const feat = extractor.predict(imgTensor) as tf.Tensor;
    const features = feat.flatten().expandDims(0); // shape [1, N]

    const prob = (model.predict(features) as tf.Tensor).dataSync()[0];
    const label: 0 | 1 = prob > 0.5 ? 1 : 0;

    if (label === sample.groundTruth) correct++;
    results.push({ ...sample, prob, label });

    imgTensor.dispose();
    feat.dispose();
    features.dispose();
  }

  const accuracy = results.length ? correct / results.length : 0;
  return { results, accuracy };
}

/**
 * 🔍 Predict on *unlabeled* images (for the custom game).
 * Returns probability + predicted label for each image URL.
 */
export async function predictImages(
  model: tf.LayersModel,
  imageUrls: string[]
): Promise<{ imageUrl: string; prob: number; label: 0 | 1 }[]> {
  // Ensure MobileNet is available
  if (!cachedMobilenet) {
    cachedMobilenet = await tf.loadLayersModel(
      "https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json"
    );
  }

  const mobilenet = cachedMobilenet;
  const featureLayer = mobilenet.getLayer("conv_pw_13_relu");
  const extractor = tf.model({
    inputs: mobilenet.inputs,
    outputs: featureLayer.output,
  });

  const results: { imageUrl: string; prob: number; label: 0 | 1 }[] = [];

  for (const url of imageUrls) {
    const imgTensor = await loadImageTensor(url);
    const feat = extractor.predict(imgTensor) as tf.Tensor;
    const features = feat.flatten().expandDims(0);

    const prob = (model.predict(features) as tf.Tensor).dataSync()[0];
    const label: 0 | 1 = prob > 0.5 ? 1 : 0;

    results.push({ imageUrl: url, prob, label });

    imgTensor.dispose();
    feat.dispose();
    features.dispose();
  }

  return results;
}
