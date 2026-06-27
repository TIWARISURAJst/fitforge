/* ============================================================
   FitForge — Macro Calculator Service
   TDEE calculation, macro targets, and adaptive adjustments
   ============================================================ */

/**
 * Calculate BMR using Mifflin-St Jeor equation
 * @param {number} weight - Weight in kg
 * @param {number} height - Height in cm
 * @param {number} age - Age in years
 * @param {string} sex - 'male', 'female', or 'other'
 * @returns {number} BMR in kcal/day
 */
export function calculateBMR(weight, height, age, sex) {
  // Mifflin-St Jeor is most accurate for general population
  if (sex === 'female') {
    return (10 * weight) + (6.25 * height) - (5 * age) - 161;
  }
  // Male or other
  return (10 * weight) + (6.25 * height) - (5 * age) + 5;
}

/**
 * Activity level multipliers
 */
export const ACTIVITY_LEVELS = {
  sedentary:     { multiplier: 1.2,   label: 'Sedentary',          desc: 'Little or no exercise, desk job' },
  light:         { multiplier: 1.375, label: 'Lightly Active',     desc: 'Light exercise 1-3 days/week' },
  moderate:      { multiplier: 1.55,  label: 'Moderately Active',  desc: 'Moderate exercise 3-5 days/week' },
  active:        { multiplier: 1.725, label: 'Very Active',        desc: 'Hard exercise 6-7 days/week' },
  veryActive:    { multiplier: 1.9,   label: 'Extremely Active',   desc: 'Hard daily exercise + physical job' },
};

/**
 * Goal calorie adjustments
 */
export const GOALS = {
  cut:       { adjustment: -500,  label: 'Cut',       emoji: '🔥', desc: 'Lose fat while preserving muscle' },
  slowCut:   { adjustment: -300,  label: 'Slow Cut',  emoji: '📉', desc: 'Gradual fat loss, minimal muscle loss' },
  maintain:  { adjustment: 0,     label: 'Maintain',  emoji: '⚖️', desc: 'Maintain current weight and composition' },
  slowBulk:  { adjustment: 200,   label: 'Lean Bulk', emoji: '📈', desc: 'Slow muscle gain with minimal fat' },
  bulk:      { adjustment: 400,   label: 'Bulk',      emoji: '💪', desc: 'Maximize muscle growth' },
};

/**
 * Calculate TDEE (Total Daily Energy Expenditure)
 * @param {number} bmr - Basal metabolic rate
 * @param {string} activityLevel - Key from ACTIVITY_LEVELS
 * @returns {number} TDEE in kcal/day
 */
export function calculateTDEE(bmr, activityLevel) {
  const level = ACTIVITY_LEVELS[activityLevel] || ACTIVITY_LEVELS.moderate;
  return Math.round(bmr * level.multiplier);
}

/**
 * Calculate daily calorie target based on goal
 * @param {number} tdee - Total daily energy expenditure
 * @param {string} goal - Key from GOALS
 * @returns {number} Target calories
 */
export function calculateCalorieTarget(tdee, goal) {
  const g = GOALS[goal] || GOALS.maintain;
  return Math.round(tdee + g.adjustment);
}

/**
 * Calculate macronutrient targets
 * @param {number} calories - Target daily calories
 * @param {number} weight - Weight in kg
 * @param {string} goal - Goal type
 * @returns {Object} { protein, carbs, fat, calories }
 */
export function calculateMacros(calories, weight, goal) {
  // Protein: 2.0-2.2g/kg for cutting, 1.6-2.0g/kg for bulking/maintaining
  let proteinPerKg;
  switch (goal) {
    case 'cut':
    case 'slowCut':
      proteinPerKg = 2.2;
      break;
    case 'bulk':
    case 'slowBulk':
      proteinPerKg = 1.8;
      break;
    default:
      proteinPerKg = 2.0;
  }

  const protein = Math.round(weight * proteinPerKg);
  const proteinCalories = protein * 4;

  // Fat: 25-30% of total calories (minimum 0.5g/kg)
  const fatPercent = goal === 'cut' ? 0.25 : 0.28;
  let fat = Math.round((calories * fatPercent) / 9);
  fat = Math.max(fat, Math.round(weight * 0.5)); // Minimum fat threshold

  const fatCalories = fat * 9;

  // Carbs: remaining calories
  const carbCalories = Math.max(0, calories - proteinCalories - fatCalories);
  const carbs = Math.round(carbCalories / 4);

  return {
    protein,
    carbs,
    fat,
    calories: Math.round(proteinCalories + fatCalories + carbCalories)
  };
}

/**
 * Calculate all targets from user profile
 * @param {Object} profile - { weight, height, age, sex, activityLevel, goal }
 * @returns {Object} { bmr, tdee, calories, macros: { protein, carbs, fat, calories } }
 */
export function calculateAllTargets(profile) {
  const { weight, height, age, sex, activityLevel, goal } = profile;

  const bmr = calculateBMR(weight, height, age, sex);
  const tdee = calculateTDEE(bmr, activityLevel);
  const targetCalories = calculateCalorieTarget(tdee, goal);
  const macros = calculateMacros(targetCalories, weight, goal);

  return {
    bmr: Math.round(bmr),
    tdee,
    calories: targetCalories,
    macros
  };
}

/**
 * Calculate water intake recommendation
 * @param {number} weight - Weight in kg
 * @param {string} activityLevel - Activity level
 * @returns {number} Water in ml
 */
export function calculateWaterGoal(weight, activityLevel) {
  // Base: 30-35ml per kg
  let base = weight * 33;
  const level = ACTIVITY_LEVELS[activityLevel];

  if (level && level.multiplier > 1.5) {
    base *= 1.2; // More water for active people
  }

  // Round to nearest 250ml
  return Math.round(base / 250) * 250;
}

/**
 * Convert between metric and imperial
 */
export const conversions = {
  kgToLbs: (kg) => Math.round(kg * 2.20462 * 10) / 10,
  lbsToKg: (lbs) => Math.round(lbs / 2.20462 * 10) / 10,
  cmToFtIn: (cm) => {
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return { feet, inches, display: `${feet}'${inches}"` };
  },
  ftInToCm: (feet, inches) => Math.round((feet * 12 + inches) * 2.54),
  mlToOz: (ml) => Math.round(ml / 29.5735 * 10) / 10,
  ozToMl: (oz) => Math.round(oz * 29.5735),
};

/**
 * Format weight display based on unit preference
 */
export function formatWeight(kg, units) {
  if (units === 'imperial') {
    return `${conversions.kgToLbs(kg)} lbs`;
  }
  return `${kg} kg`;
}

/**
 * Format height display based on unit preference
 */
export function formatHeight(cm, units) {
  if (units === 'imperial') {
    return conversions.cmToFtIn(cm).display;
  }
  return `${cm} cm`;
}

/**
 * Format water display based on unit preference
 */
export function formatWater(ml, units) {
  if (units === 'imperial') {
    return `${conversions.mlToOz(ml)} oz`;
  }
  if (ml >= 1000) {
    return `${(ml / 1000).toFixed(1)} L`;
  }
  return `${ml} ml`;
}

export default {
  calculateBMR,
  calculateTDEE,
  calculateCalorieTarget,
  calculateMacros,
  calculateAllTargets,
  calculateWaterGoal,
  conversions,
  formatWeight,
  formatHeight,
  formatWater,
  ACTIVITY_LEVELS,
  GOALS
};
