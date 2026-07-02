import fs from 'fs';

// Read extractSilhouetteMetrics function text from js/views/Onboarding.js
const onboardingCode = fs.readFileSync('js/views/Onboarding.js', 'utf8');

// Extract the extractSilhouetteMetrics function body
const startMarker = "function extractSilhouetteMetrics(imgEl, sex, bbox = null) {";
const endMarker = "function analyzePhotoQuality(imgEl) {";

const startIdx = onboardingCode.indexOf(startMarker);
const endIdx = onboardingCode.indexOf(endMarker);

if (startIdx === -1 || endIdx === -1) {
  console.error("Could not extract function code!");
  process.exit(1);
}

let functionBody = onboardingCode.substring(startIdx, endIdx).trim();

// Mock JSDOM canvas environment
const mockContext = {
  getImageData: (x, y, w, h) => {
    return { data: mockContext.currentPixelData };
  },
  drawImage: () => {}
};

global.document = {
  createElement: (type) => {
    if (type === 'canvas') {
      return {
        width: 60,
        height: 100,
        getContext: () => mockContext
      };
    }
    return {};
  }
};

global.onboardingData = {
  height: 180,
  units: 'metric'
};

global.navyMethod = ({ height, neck, waist, hip, sex }) => {
  let bf;
  if (sex === 'female') {
    if (!hip) return null;
    bf = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(height)) - 450;
  } else {
    bf = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
  }
  return Math.max(2, Math.min(60, Math.round(bf * 10) / 10));
};

// Evaluate the function code in the global scope
const extractSilhouetteMetrics = new Function('imgEl', 'sex', 'bbox', `
  try {
    ${functionBody.substring(startMarker.length, functionBody.length - 1)}
  } catch(e) {
    console.error(e);
    return null;
  }
`);

console.log("=========================================");
console.log("   FitForge CV Contour Validation Test   ");
console.log("=========================================\n");

// Test Case 1: Standing Human Image Mock
// A tall, narrow silhouette with a neck, waist, and hips
const humanPixels = new Uint8Array(60 * 100 * 4);
humanPixels.fill(255); // background white (255, 255, 255)

for (let y = 0; y < 100; y++) {
  let left = -1, right = -1;
  if (y >= 15 && y <= 25) { // Neck
    left = 22; right = 38;
  } else if (y >= 45 && y <= 60) { // Waist
    left = 18; right = 42;
  } else if (y >= 65 && y <= 80) { // Hips
    left = 15; right = 45;
  } else if (y >= 10 && y <= 90) { // General torso
    left = 18; right = 42;
  }
  
  if (left !== -1) {
    for (let x = left; x <= right; x++) {
      const idx = (y * 60 + x) * 4;
      humanPixels[idx] = 100;     // Dark body color (different from background)
      humanPixels[idx+1] = 100;
      humanPixels[idx+2] = 100;
      humanPixels[idx+3] = 255;
    }
  }
}

mockContext.currentPixelData = humanPixels;
const resultHuman = extractSilhouetteMetrics({}, 'male');

if (resultHuman && resultHuman.bodyFat) {
  console.log(`\x1b[32m[PASS]\x1b[0m Human Image Detected Successfully!`);
  console.log(`       Resolved Metrics: Neck=${resultHuman.neckWidth.toFixed(1)}px | Waist=${resultHuman.waistWidth.toFixed(1)}px | Hips=${resultHuman.hipWidth.toFixed(1)}px | Body Fat=${resultHuman.bodyFat}%`);
} else {
  console.error(`\x1b[31m[FAIL]\x1b[0m Human Image Not Detected.`);
}

// Test Case 2: Non-Human Image Mock (Circular Food Plate)
// A wide, short circular pattern (height 30, width 44)
const foodPixels = new Uint8Array(60 * 100 * 4);
foodPixels.fill(255);

for (let y = 35; y <= 65; y++) {
  for (let x = 8; x <= 52; x++) {
    const idx = (y * 60 + x) * 4;
    foodPixels[idx] = 120; // dark color
    foodPixels[idx+1] = 120;
    foodPixels[idx+2] = 120;
    foodPixels[idx+3] = 255;
  }
}

mockContext.currentPixelData = foodPixels;
const resultFood = extractSilhouetteMetrics({}, 'male');

if (resultFood === null) {
  console.log(`\x1b[32m[PASS]\x1b[0m Non-Human Food Plate Correctly Rejected!`);
  console.log(`       Scanner response: Silhouette validation failed (returned null).`);
} else {
  console.error(`\x1b[31m[FAIL]\x1b[0m Food Plate was incorrectly accepted as a human!`);
  console.error(`       Returned body fat estimate: ${resultFood.bodyFat}%`);
}
console.log("\n=========================================");
