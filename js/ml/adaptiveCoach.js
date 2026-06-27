/* ============================================================
   FitForge — Adaptive ML Coaching & Progression Advisor
   Analyzes actual adherence, weights trend lines, and suggests
   contextual calorie/training progression overload tips.
   ============================================================ */

import { calculateWeightTrend, calculateActualTDEE } from './trendPredictor.js';

/**
 * Generate adaptive nutrition & exercise recommendations
 * @param {Object} storeState - Application reactive store state
 * @param {Array} weightLogs - Metrics history logs
 * @param {Array} mealLogs - Daily meal logs
 * @returns {Object} Coaching plan { caloriesChange, tips: [], predictionLabel }
 */
export function generateAdaptiveAdvice(storeState, weightLogs, mealLogs) {
  const user = storeState.user;
  const advice = {
    caloriesChange: 0,
    macrosAdjustment: null,
    nutritionTip: '',
    workoutTip: '',
    prediction: null
  };

  // 1. Core target calculations
  const weightTrend = calculateWeightTrend(weightLogs);
  const actualTdee = calculateActualTDEE(weightLogs, mealLogs, user.tdee || 2400);

  // 2. Linear projection for weight target
  if (weightTrend && Math.abs(weightTrend.slope) > 0.01) {
    const targetWeight = user.goalWeight || (user.goal === 'cut' ? user.weight - 5 : user.weight + 5);
    const weightGap = targetWeight - weightTrend.currentWeight;
    
    // Check if moving in correct direction
    const correctDirection = (user.goal === 'cut' && weightTrend.slope < 0) || 
                              (user.goal === 'bulk' && weightTrend.slope > 0) ||
                              (user.goal === 'maintain' && Math.abs(weightTrend.slope) < 0.05);

    if (correctDirection && Math.abs(weightTrend.slope) > 0.01) {
      const daysToTarget = Math.round(weightGap / weightTrend.slope);
      if (daysToTarget > 0 && daysToTarget < 365) {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + daysToTarget);
        advice.prediction = {
          days: daysToTarget,
          targetDate: targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          weeklyRate: weightTrend.weeklyRate
        };
      }
    }
  }

  // 3. Nutrition advice based on macro intake
  const today = storeState.today || {};
  const calsPct = today.caloriesConsumed / (user.macros.calories || 2000);
  const proteinPct = today.proteinConsumed / (user.macros.protein || 140);
  const carbsPct = today.carbsConsumed / (user.macros.carbs || 200);
  const fatPct = today.fatConsumed / (user.macros.fat || 65);

  if (proteinPct < 0.8) {
    advice.nutritionTip = `💡 Protein intake is currently at ${Math.round(proteinPct * 100)}% of your target. Add 1 scoop of Whey Protein (25g Protein) or 100g Paneer/Chicken to reach your muscle synthesis threshold today.`;
  } else if (calsPct > 1.05 && user.goal === 'cut') {
    advice.nutritionTip = `⚠️ You are ${Math.round((calsPct - 1) * 100)}% over your cutting calorie budget. Focus on low-calorie density volume foods like steamed broccoli or cucumbers for your next meal.`;
  } else if (calsPct < 0.85 && user.goal === 'bulk') {
    advice.nutritionTip = `💪 Calorie deficit detected during active bulk. Add calorie-dense snacks like Almonds/Cashews (30g = 170 kcal) or whole eggs to maintain your muscle-building surplus.`;
  } else {
    // Metabolic adaptation coach
    if (actualTdee !== user.tdee) {
      const diff = actualTdee - user.tdee;
      if (diff > 100) {
        advice.nutritionTip = `🔥 Metabolic adaptation: Your real TDEE is estimated to be ${actualTdee} kcal (+${Math.round(diff)} kcal from static calculations) due to high NEAT. You can consume slightly more calories while maintaining progression pace.`;
      } else if (diff < -100) {
        advice.nutritionTip = `⚖️ Metabolic adaptation: Your estimated actual TDEE is ${actualTdee} kcal (${Math.round(diff)} kcal from calculation). We suggest reducing your daily target by 100 kcal to maintain your weight loss rate.`;
      } else {
        advice.nutritionTip = `🎯 Perfect alignment: Your metabolic output matches calculations. Keep hitting your daily macro targets to maintain progression pace.`;
      }
    } else {
      advice.nutritionTip = "🎯 Keep logging your daily meals and morning weights to unlock calibrated metabolic adjustments and TDEE adaptations.";
    }
  }

  // 4. Workout advisor / Progressive Overload
  const recentWorkouts = today.workout ? [today.workout] : [];
  if (recentWorkouts.length > 0) {
    const lastSession = recentWorkouts[0];
    if (lastSession.status === 'completed') {
      advice.workoutTip = `📈 Progressive Overload Tip: Excellent job completing ${lastSession.templateName || 'your routine'}. In your next session, target adding 2.5 kg to compound exercises (Squats/Bench Press) or adding 1 rep to isolation exercises to keep stimulating hypertrophy.`;
    } else {
      advice.workoutTip = "💪 Active Session Coach: Remember to track RPE (Rate of Perceived Exertion) on your working sets. Aim for an RPE 8-9 (1-2 reps left in reserve) on final sets to stimulate overload.";
    }
  } else {
    advice.workoutTip = "📅 Consistency is key: Hit your scheduled split today. Compound lift progression drives 80% of muscle adaptation. Aim to add reps before adding weight.";
  }

  return advice;
}

export default { generateAdaptiveAdvice };
