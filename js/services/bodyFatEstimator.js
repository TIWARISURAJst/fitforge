/* ============================================================
   FitForge — Body Fat Estimator Service
   Navy Method, BMI-based, and visual estimation
   ============================================================ */

/**
 * Navy Method body fat calculation
 * @param {Object} params
 * @param {number} params.height - Height in cm
 * @param {number} params.neck - Neck circumference in cm
 * @param {number} params.waist - Waist circumference in cm (at navel)
 * @param {number} params.hip - Hip circumference in cm (women only)
 * @param {string} params.sex - 'male' or 'female'
 * @returns {number} Estimated body fat percentage
 */
export function navyMethod({ height, neck, waist, hip, sex }) {
  if (!height || !neck || !waist) return null;

  let bf;

  if (sex === 'female') {
    if (!hip) return null;
    bf = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(height)) - 450;
  } else {
    bf = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
  }

  return Math.max(2, Math.min(60, Math.round(bf * 10) / 10));
}

/**
 * BMI-based body fat estimate (Deurenberg formula)
 * Less accurate but requires fewer measurements
 * @param {number} weight - Weight in kg
 * @param {number} height - Height in cm
 * @param {number} age - Age in years
 * @param {string} sex - 'male' or 'female'
 * @returns {number} Estimated body fat percentage
 */
export function bmiBasedEstimate(weight, height, age, sex) {
  const heightM = height / 100;
  const bmi = weight / (heightM * heightM);
  const sexFactor = sex === 'female' ? 1 : 0;

  // Deurenberg formula
  const bf = (1.20 * bmi) + (0.23 * age) - (10.8 * (1 - sexFactor)) - 5.4;

  return Math.max(2, Math.min(60, Math.round(bf * 10) / 10));
}

/**
 * Calculate lean body mass
 * @param {number} weight - Weight in kg
 * @param {number} bodyFat - Body fat percentage
 * @returns {Object} { leanMass, fatMass }
 */
export function calculateComposition(weight, bodyFat) {
  const fatMass = Math.round(weight * (bodyFat / 100) * 10) / 10;
  const leanMass = Math.round((weight - fatMass) * 10) / 10;
  return { leanMass, fatMass };
}

/**
 * Calculate BMI
 * @param {number} weight - Weight in kg
 * @param {number} height - Height in cm
 * @returns {Object} { bmi, category }
 */
export function calculateBMI(weight, height) {
  const heightM = height / 100;
  const bmi = Math.round(weight / (heightM * heightM) * 10) / 10;

  let category;
  if (bmi < 18.5) category = 'Underweight';
  else if (bmi < 25) category = 'Normal';
  else if (bmi < 30) category = 'Overweight';
  else category = 'Obese';

  return { bmi, category };
}

/**
 * Body fat visual reference guide
 */
export const BF_RANGES = [
  { min: 5,  max: 9,  label: 'Essential',      emoji: '🏆', desc: 'Competition-ready, very low fat', sex: 'male' },
  { min: 10, max: 14, label: 'Athletic',        emoji: '💪', desc: 'Visible abs, very lean', sex: 'male' },
  { min: 15, max: 19, label: 'Fit',             emoji: '✅', desc: 'Healthy and fit, some definition', sex: 'male' },
  { min: 20, max: 24, label: 'Average',         emoji: '📊', desc: 'Healthy range, moderate fat', sex: 'male' },
  { min: 25, max: 30, label: 'Above Average',   emoji: '📈', desc: 'Some excess fat', sex: 'male' },
  { min: 31, max: 50, label: 'High',            emoji: '⚠️', desc: 'Consider fat loss for health', sex: 'male' },

  { min: 12, max: 16, label: 'Essential',       emoji: '🏆', desc: 'Competition-ready, very low fat', sex: 'female' },
  { min: 17, max: 21, label: 'Athletic',        emoji: '💪', desc: 'Very lean and toned', sex: 'female' },
  { min: 22, max: 26, label: 'Fit',             emoji: '✅', desc: 'Healthy and fit', sex: 'female' },
  { min: 27, max: 31, label: 'Average',         emoji: '📊', desc: 'Healthy range', sex: 'female' },
  { min: 32, max: 37, label: 'Above Average',   emoji: '📈', desc: 'Some excess fat', sex: 'female' },
  { min: 38, max: 55, label: 'High',            emoji: '⚠️', desc: 'Consider fat loss for health', sex: 'female' },
];

/**
 * Get body fat category for a given percentage and sex
 */
export function getBFCategory(bodyFat, sex = 'male') {
  const ranges = BF_RANGES.filter(r => r.sex === sex);
  return ranges.find(r => bodyFat >= r.min && bodyFat <= r.max) || ranges[ranges.length - 1];
}

/**
 * Calculate ideal weight range based on body fat targets
 * @param {number} leanMass - Current lean mass in kg
 * @param {number} targetBfLow - Target low BF%
 * @param {number} targetBfHigh - Target high BF%
 * @returns {Object} { low, high } weight range in kg
 */
export function idealWeightRange(leanMass, targetBfLow = 12, targetBfHigh = 18) {
  return {
    low: Math.round(leanMass / (1 - targetBfHigh / 100) * 10) / 10,
    high: Math.round(leanMass / (1 - targetBfLow / 100) * 10) / 10,
  };
}

export default {
  navyMethod,
  bmiBasedEstimate,
  calculateComposition,
  calculateBMI,
  getBFCategory,
  idealWeightRange,
  BF_RANGES
};
