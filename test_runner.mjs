/* ============================================================
   FitForge — Backend Test Runner (Node.js)
   Validates core math, regression models, and coach tip rules
   ============================================================ */

import { navyMethod, bmiBasedEstimate, calculateComposition, idealWeightRange } from './js/services/bodyFatEstimator.js';
import { calculateBMR, calculateTDEE, calculateCalorieTarget, calculateMacros, calculateAllTargets } from './js/services/macroCalculator.js';
import { calculateWeightTrend, calculateActualTDEE } from './js/ml/trendPredictor.js';
import { generateAdaptiveAdvice } from './js/ml/adaptiveCoach.js';

let passed = 0;
let failed = 0;

function assert(name, condition, details = "") {
  if (condition) {
    passed++;
    console.log(`\x1b[32m[PASS]\x1b[0m ${name}`);
    if (details) console.log(`       ${details}`);
  } else {
    failed++;
    console.error(`\x1b[31m[FAIL]\x1b[0m ${name}`);
    if (details) console.error(`       ${details}`);
  }
}

async function runTests() {
  console.log("=========================================");
  console.log("   FitForge Core Mathematical Test Suite  ");
  console.log("=========================================\n");

  // 1. Navy Body Fat Calculator Tests
  const maleBf = navyMethod({ height: 180, neck: 38, waist: 86, hip: 0, sex: 'male' });
  assert(
    "Navy Method Formula (Male)",
    maleBf !== null && maleBf > 15 && maleBf < 18,
    `Calculated male BF%: ${maleBf}% (expected ~16-17%)`
  );

  const femaleBf = navyMethod({ height: 165, neck: 32, waist: 72, hip: 94, sex: 'female' });
  assert(
    "Navy Method Formula (Female)",
    femaleBf !== null && femaleBf > 23 && femaleBf < 27,
    `Calculated female BF%: ${femaleBf}% (expected ~24-26%)`
  );

  const comp = calculateComposition(80, 15);
  assert(
    "Lean Mass / Fat Mass Composition",
    comp.leanMass === 68 && comp.fatMass === 12,
    `Calculated Lean: ${comp.leanMass}kg, Fat: ${comp.fatMass}kg for 80kg at 15% body fat`
  );

  const ideal = idealWeightRange(68, 11, 16);
  assert(
    "Ideal weight range mapping",
    ideal.low === 76.4 && ideal.high === 81.0,
    `Ideal weight range calculated: ${ideal.low}kg - ${ideal.high}kg`
  );

  // 2. Macro Calculator Tests
  const bmrMale = calculateBMR(80, 180, 25, 'male');
  assert(
    "BMR Calculation (Male)",
    bmrMale === 1805,
    `BMR for 80kg, 180cm, 25yo male: ${bmrMale} kcal (expected 1805)`
  );

  const tdee = calculateTDEE(1700, 'moderate');
  assert(
    "TDEE Calculation",
    tdee === 2635,
    `TDEE for BMR 1700 at moderate activity: ${tdee} kcal (expected 2635)`
  );

  const calTarget = calculateCalorieTarget(2635, 'cut');
  assert(
    "Calorie Target Goal Offset (Cut)",
    calTarget === 2135,
    `Calorie target for cutting (TDEE 2635): ${calTarget} kcal (expected 2135)`
  );

  const macros = calculateMacros(2135, 80, 'cut');
  assert(
    "Macros splitting (Protein/Carbs/Fat)",
    macros.protein === 176 && macros.fat === 59 && macros.calories === 2135,
    `Calculated protein: ${macros.protein}g, fat: ${macros.fat}g, carbs: ${macros.carbs}g`
  );

  // 3. OLS Weight Trend Line Regression
  const mockMetrics = [
    { date: '2026-06-01', weight: 80.0 },
    { date: '2026-06-08', weight: 79.5 },
    { date: '2026-06-15', weight: 79.0 },
    { date: '2026-06-22', weight: 78.5 }
  ];
  const trend = calculateWeightTrend(mockMetrics);
  assert(
    "OLS Weight Regression",
    trend !== null && trend.slope < 0 && Math.abs(trend.weeklyRate - (-0.5)) < 0.05,
    `Weekly weight change rate: ${trend ? trend.weeklyRate : 'null'} kg/week (expected -0.5 kg/week)`
  );

  // 4. Adaptive metabolic TDEE calculation
  const mockMeals = [
    { date: '2026-06-01', items: [{ calories: 2000, servings: 1 }] },
    { date: '2026-06-02', items: [{ calories: 2000, servings: 1 }] },
    { date: '2026-06-03', items: [{ calories: 2000, servings: 1 }] },
    { date: '2026-06-04', items: [{ calories: 2000, servings: 1 }] },
    { date: '2026-06-05', items: [{ calories: 2000, servings: 1 }] }
  ];
  const weightLogs = [
    { date: '2026-06-01', weight: 80.0 },
    { date: '2026-06-03', weight: 79.5 },
    { date: '2026-06-05', weight: 79.0 }
  ];
  const actualTdee = calculateActualTDEE(weightLogs, mockMeals, 2500);
  assert(
    "Metabolic Adaptation Calculation",
    actualTdee > 2500,
    `Actual metabolic TDEE: ${actualTdee} kcal/day (expected > 2500 due to weight loss on 2000 kcal)`
  );

  // 5. Adaptive Coach Tips Rule Engine
  const storeState = {
    user: { name: "Champion", age: 25, sex: "male", height: 180, weight: 80, goal: "cut", trainingDays: 4, macros: { calories: 2000, protein: 140, carbs: 200, fat: 65 } },
    today: { caloriesConsumed: 1200, proteinConsumed: 60, carbsConsumed: 150, fatConsumed: 40, workout: null, sleep: null },
    streak: 5
  };
  const advice = generateAdaptiveAdvice(storeState, weightLogs, mockMeals);
  assert(
    "Coaching Advice Generation",
    advice.nutritionTip && advice.nutritionTip.includes("Protein"),
    `Generated nutrition advice: "${advice.nutritionTip}"`
  );

  console.log("\n=========================================");
  console.log(`Test Execution Summary:`);
  console.log(`  \x1b[32mPassed: ${passed}\x1b[0m`);
  console.log(`  \x1b[31mFailed: ${failed}\x1b[0m`);
  console.log("=========================================");

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();
