/* ============================================================
   FitForge — Linear Regression & Predictive Weight Engine
   Applies Ordinary Least Squares (OLS) regression over weight logs,
   recalculates actual vs predicted TDEE, and estimates date of target completion.
   ============================================================ */

/**
 * Calculates weight linear regression over historical data
 * @param {Array} logs - Array of bodyMetrics logs { date, weight }
 * @returns {Object|null} Regression coefficients and projections
 */
export function calculateWeightTrend(logs) {
  if (!logs || logs.length < 3) return null;

  // Sort chronologically
  const sorted = [...logs].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // Convert dates to numeric day offset from start date
  const startMs = new Date(sorted[0].date).getTime();
  const dataPoints = sorted.map(l => ({
    x: (new Date(l.date).getTime() - startMs) / (1000 * 60 * 60 * 24), // days
    y: l.weight
  }));

  const n = dataPoints.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
  
  for (const p of dataPoints) {
    sumX += p.x;
    sumY += p.y;
    sumXY += p.x * p.y;
    sumXX += p.x * p.x;
  }

  // Calculate slope (m) and intercept (c) -> y = mx + c
  const denominator = (n * sumXX - sumX * sumX);
  if (denominator === 0) return null;

  const slope = (n * sumXY - sumX * sumY) / denominator; // kg per day
  const intercept = (sumY - slope * sumX) / n;

  const currentWeight = sorted[sorted.length - 1].weight;
  const weeklyRate = slope * 7; // kg change per week

  return {
    slope,
    intercept,
    weeklyRate: Math.round(weeklyRate * 100) / 100,
    currentWeight,
    totalDaysLogged: dataPoints[dataPoints.length - 1].x,
    rSquared: calculateRSquared(dataPoints, slope, intercept)
  };
}

/**
 * Recalculate Actual TDEE based on metabolic math (weight changes vs. intake)
 * @param {Array} weightLogs - metrics array
 * @param {Array} mealLogs - meals logs with calories consumed
 * @param {number} defaultTdee - Calculated TDEE target base
 * @returns {number} Calibrated actual metabolic rate
 */
export function calculateActualTDEE(weightLogs, mealLogs, defaultTdee) {
  if (weightLogs.length < 3 || mealLogs.length < 5) return defaultTdee;

  // Get total calorie intake over matching date range
  const sortedWeights = [...weightLogs].sort((a, b) => new Date(a.date) - new Date(b.date));
  const startStr = sortedWeights[0].date;
  const endStr = sortedWeights[sortedWeights.length - 1].date;

  const startMs = new Date(startStr).getTime();
  const endMs = new Date(endStr).getTime();
  const totalDays = Math.max(1, (endMs - startMs) / (1000 * 60 * 60 * 24));

  // Find all meals eaten between start and end date
  const rangeMeals = mealLogs.filter(m => {
    const d = new Date(m.date).getTime();
    return d >= startMs && d <= endMs;
  });

  let totalCaloriesIn = 0;
  rangeMeals.forEach(m => {
    const items = m.items || [];
    items.forEach(it => {
      totalCaloriesIn += (it.calories || 0) * (it.servings || 1);
    });
  });

  const dailyAvgIntake = totalCaloriesIn / totalDays;

  // Weight delta: 1kg fat ~= 7700 kcal energy equivalent
  const weightDelta = sortedWeights[sortedWeights.length - 1].weight - sortedWeights[0].weight;
  const totalEnergyImbalance = weightDelta * 7700;
  const dailyImbalance = totalEnergyImbalance / totalDays;

  // Actual TDEE = Intake - Surplus/Deficit
  // e.g. if weight decreased, dailyImbalance is negative, making TDEE > intake
  const actualTDEE = dailyAvgIntake - dailyImbalance;

  // Sanity check: cap adjustment within reasonable metabolic limits (±600 kcal from baseline)
  return Math.max(defaultTdee - 600, Math.min(defaultTdee + 600, Math.round(actualTDEE)));
}

/**
 * OLS Goodness-of-fit R2
 */
function calculateRSquared(points, slope, intercept) {
  const meanY = points.reduce((sum, p) => sum + p.y, 0) / points.length;
  let ssTot = 0; // Total sum of squares
  let ssRes = 0; // Residual sum of squares

  for (const p of points) {
    const fit = slope * p.x + intercept;
    ssTot += Math.pow(p.y - meanY, 2);
    ssRes += Math.pow(p.y - fit, 2);
  }

  if (ssTot === 0) return 1;
  return Math.max(0, Math.min(1, 1 - (ssRes / ssTot)));
}

export default { calculateWeightTrend, calculateActualTDEE };
