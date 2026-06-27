/* ============================================================
   FitForge — Dashboard View
   Displays calorie/macro progress, water consumption, sleep logs, and workout stats
   ============================================================ */

import db from '../db.js';
import store from '../store.js';
import { formatWeight, formatWater } from '../services/macroCalculator.js';

let storeUnsubscribe = null;

export async function render(container) {
  // Subscribe to store updates for reactive rendering
  if (storeUnsubscribe) storeUnsubscribe();
  storeUnsubscribe = store.on('*', async () => {
    // Only re-render if the container is still in the document
    if (document.getElementById('dashboard-view')) {
      await renderContent(container);
    }
  });

  await renderContent(container);
}

async function renderContent(container) {
  const user = store.state.user;
  const today = store.state.today;
  const streak = store.state.streak;
  
  // Load metrics & meals history for ML adaptation
  let weightLogs = [];
  let mealLogs = [];
  try {
    weightLogs = await db.bodyMetrics.toArray();
    mealLogs = await db.meals.toArray();
  } catch (err) {
    console.error('[Dashboard] DB load error:', err);
  }

  // Load adaptive coach dynamically
  let advice = { nutritionTip: 'Log daily food and body weights to initialize adaptive coaching.', workoutTip: 'Brace your core on working sets.' };
  try {
    const { generateAdaptiveAdvice } = await import('../ml/adaptiveCoach.js');
    advice = generateAdaptiveAdvice(store.state, weightLogs, mealLogs);
  } catch (err) {
    console.error('[Dashboard] Coach error:', err);
  }
  
  // Calculate calorie consumption metrics
  const calTarget = user.macros.calories || 2000;
  const calConsumed = today.caloriesConsumed || 0;
  
  // Workout active burn estimate (mock or based on today's session)
  const workoutBurn = today.workout ? (today.workout.duration || 45) * 6 : 0; // estimate 6 kcal/min
  const calRemaining = Math.max(0, calTarget - calConsumed + workoutBurn);
  
  // Circumference for macro rings (2 * PI * r, r=34) => ~213.6
  const ringCircumference = 213.6;
  
  // Nutrient progress ratios
  const proteinTarget = user.macros.protein || 140;
  const proteinConsumed = today.proteinConsumed || 0;
  const proteinPercent = Math.min(100, Math.round((proteinConsumed / proteinTarget) * 100));
  const proteinOffset = ringCircumference - (proteinPercent / 100) * ringCircumference;
  
  const carbsTarget = user.macros.carbs || 200;
  const carbsConsumed = today.carbsConsumed || 0;
  const carbsPercent = Math.min(100, Math.round((carbsConsumed / carbsTarget) * 100));
  const carbsOffset = ringCircumference - (carbsPercent / 100) * ringCircumference;
  
  const fatTarget = user.macros.fat || 65;
  const fatConsumed = today.fatConsumed || 0;
  const fatPercent = Math.min(100, Math.round((fatConsumed / fatTarget) * 100));
  const fatOffset = ringCircumference - (fatPercent / 100) * ringCircumference;
  
  // Calorie ring offset (r=54 => circ ~339.3)
  const calCirc = 339.3;
  const calPercent = Math.min(100, Math.round((calConsumed / calTarget) * 100));
  const calOffset = calCirc - (calPercent / 100) * calCirc;

  // Hydration metrics
  const waterTarget = today.waterGoal || 2500;
  const waterConsumed = today.water || 0;
  const waterPercent = Math.min(100, Math.round((waterConsumed / waterTarget) * 100));

  const options = { weekday: 'long', month: 'short', day: 'numeric' };
  const dateDisplay = new Date().toLocaleDateString('en-US', options);

  container.innerHTML = `
    <div class="container view" id="dashboard-view">
      <!-- Dashboard Header -->
      <div class="view-header flex justify-between items-start">
        <div class="dashboard-greeting">
          <div class="greeting-text">Hey, Champion!</div>
          <div class="greeting-name">${user.name || 'Athleted'}</div>
          <div class="greeting-date">${dateDisplay}</div>
        </div>
        
        <div class="streak-badge">
          <span class="streak-fire">🔥</span>
          <span>${streak} Day Streak</span>
        </div>
      </div>
      
      <!-- Calorie ring hero progress card -->
      <div class="glass-card mb-lg card-accent text-center" style="position: relative;">
        <div class="card-header">
          <div class="card-title">Daily Calorie Target</div>
          <div class="card-icon" style="background: var(--accent-subtle); color: var(--accent);">📊</div>
        </div>
        
        <div class="flex justify-center items-center py-md" style="gap: var(--space-2xl); flex-wrap: wrap;">
          <div class="macro-ring ring-lg" style="width: 140px; height: 140px;">
            <svg viewBox="0 0 120 120">
              <circle class="ring-bg" cx="60" cy="60" r="54" stroke-width="6" />
              <circle class="ring-fill" cx="60" cy="60" r="54" stroke="var(--calories)" stroke-width="6" 
                stroke-dasharray="${calCirc}" stroke-dashoffset="${calOffset}" />
            </svg>
            <div class="ring-center">
              <div class="ring-value" style="font-size: var(--font-2xl);">${calRemaining}</div>
              <div class="ring-unit" style="font-size: var(--font-xs);">kcal left</div>
            </div>
          </div>
          
          <div class="flex flex-col gap-xs text-left" style="min-width: 150px;">
            <div class="flex justify-between items-center text-sm">
              <span class="text-muted">Target Goal:</span>
              <span class="font-bold">${calTarget} kcal</span>
            </div>
            <div class="flex justify-between items-center text-sm">
              <span class="text-muted">Food Logged:</span>
              <span class="font-bold text-success">${calConsumed} kcal</span>
            </div>
            <div class="flex justify-between items-center text-sm">
              <span class="text-muted">Active Burn:</span>
              <span class="font-bold text-danger">${workoutBurn} kcal</span>
            </div>
            
            <div class="divider" style="margin: var(--space-xs) 0;"></div>
            
            <span class="badge badge-accent" style="align-self: flex-start;">
              ${calPercent}% Consumed
            </span>
          </div>
        </div>
      </div>
      
      <!-- Macro progress rings row -->
      <div class="glass-card mb-lg">
        <div class="card-header">
          <div class="card-title">Daily Macronutrients</div>
        </div>
        
        <div class="macro-rings-container">
          <!-- Protein -->
          <div class="macro-ring-wrapper">
            <div class="macro-ring">
              <svg viewBox="0 0 80 80">
                <circle class="ring-bg" cx="40" cy="40" r="34" stroke-width="4" />
                <circle class="ring-fill" cx="40" cy="40" r="34" stroke="var(--protein)" stroke-width="4" 
                  stroke-dasharray="${ringCircumference}" stroke-dashoffset="${proteinOffset}" />
              </svg>
              <div class="ring-center">
                <div class="ring-value text-accent">${proteinConsumed}</div>
                <div class="ring-unit">/ ${proteinTarget}g</div>
              </div>
            </div>
            <span class="macro-ring-label">Protein</span>
          </div>
          
          <!-- Carbs -->
          <div class="macro-ring-wrapper">
            <div class="macro-ring">
              <svg viewBox="0 0 80 80">
                <circle class="ring-bg" cx="40" cy="40" r="34" stroke-width="4" />
                <circle class="ring-fill" cx="40" cy="40" r="34" stroke="var(--carbs)" stroke-width="4" 
                  stroke-dasharray="${ringCircumference}" stroke-dashoffset="${carbsOffset}" />
              </svg>
              <div class="ring-center">
                <div class="ring-value text-warning">${carbsConsumed}</div>
                <div class="ring-unit">/ ${carbsTarget}g</div>
              </div>
            </div>
            <span class="macro-ring-label">Carbs</span>
          </div>
          
          <!-- Fat -->
          <div class="macro-ring-wrapper">
            <div class="macro-ring">
              <svg viewBox="0 0 80 80">
                <circle class="ring-bg" cx="40" cy="40" r="34" stroke-width="4" />
                <circle class="ring-fill" cx="40" cy="40" r="34" stroke="var(--fat)" stroke-width="4" 
                  stroke-dasharray="${ringCircumference}" stroke-dashoffset="${fatOffset}" />
              </svg>
              <div class="ring-center">
                <div class="ring-value text-danger">${fatConsumed}</div>
                <div class="ring-unit">/ ${fatTarget}g</div>
              </div>
            </div>
            <span class="macro-ring-label">Fat</span>
          </div>
        </div>
      </div>
      
      <!-- Quick Action Buttons -->
      <div class="quick-actions mb-lg">
        <a href="#meals" class="quick-action">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          <span>Log Meal</span>
        </a>
        <a href="#workout" class="quick-action">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 6.5h11"/><path d="M6.5 17.5h11"/><path d="M6.5 6.5v11"/><path d="M17.5 6.5v11"/><path d="M4 8v8"/><path d="M20 8v8"/></svg>
          <span>Workout</span>
        </a>
        <a href="#body" class="quick-action">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
          <span>Body Fat</span>
        </a>
      </div>
      
      <!-- Hydration card with interactive animation -->
      <div class="glass-card mb-lg">
        <div class="card-header">
          <div class="card-title">Hydration Tracker</div>
          <div class="card-icon" style="background: rgba(0, 180, 255, 0.1); color: var(--water);">💧</div>
        </div>
        
        <div class="flex justify-between items-center py-sm" style="flex-wrap: wrap; gap: var(--space-md);">
          <div class="flex items-center gap-md">
            <!-- Simulated Glass filling level -->
            <div class="water-glass" style="width: 50px; height: 75px; border-width: 2px;">
              <div style="position: absolute; bottom: 0; left: 0; right: 0; background: var(--water); height: ${waterPercent}%; transition: height 0.6s;"></div>
            </div>
            <div>
              <div class="water-amount" style="font-size: var(--font-xl);">${formatWater(waterConsumed, user.units)}</div>
              <div class="water-goal">Goal: ${formatWater(waterTarget, user.units)} (${waterPercent}%)</div>
            </div>
          </div>
          
          <button class="btn btn-secondary btn-sm" id="dash-add-water-btn">
            + 250 ml Glass
          </button>
        </div>
      </div>
      
      <!-- Training Status card -->
      <div class="glass-card mb-lg">
        <div class="card-header">
          <div class="card-title">Today's Training</div>
          <div class="card-icon" style="background: rgba(124, 106, 255, 0.1); color: var(--accent);">💪</div>
        </div>
        
        <div class="flex justify-between items-center">
          <div>
            ${today.workout ? `
              <div class="font-bold text-sm">${today.workout.templateName || 'Custom Routine'}</div>
              <div class="text-xs text-muted">Completed in ${today.workout.duration || 45} mins — Logged at ${today.workout.endTime || '12:00 PM'}</div>
            ` : `
              <div class="font-bold text-sm">Rest Day / Pending Workout</div>
              <div class="text-xs text-muted">Schedule recommends ${user.trainingDays} sessions per week.</div>
            `}
          </div>
          
          ${today.workout ? `
            <span class="badge badge-success">Done</span>
          ` : `
            <a href="#workout" class="btn btn-primary btn-sm">Start Session</a>
          `}
        </div>
      </div>
      
      <!-- Recovery and Sleep card -->
      <div class="glass-card mb-lg">
        <div class="card-header">
          <div class="card-title">Sleep & Recovery</div>
          <div class="card-icon" style="background: rgba(179, 136, 255, 0.1); color: var(--sleep);">🌙</div>
        </div>
        
        <div class="flex justify-between items-center">
          <div>
            ${today.sleep ? `
              <div class="font-bold text-sm">${today.sleep.hours} hours logged</div>
              <div class="text-xs text-muted">Sleep Quality: ${getSleepQualityLabel(today.sleep.quality)} / 5</div>
            ` : `
              <div class="font-bold text-sm">No sleep log for today</div>
              <div class="text-xs text-muted">Tracking sleep helps estimate recovery coefficient.</div>
            `}
          </div>
          
          ${today.sleep ? `
            <span class="badge badge-info" style="background: var(--sleep-glow); color: var(--sleep);">Resting</span>
          ` : `
            <a href="#sleep" class="btn btn-secondary btn-sm">Log Sleep</a>
          `}
        </div>
      </div>

      <!-- FitForge Adaptive ML Coach card -->
      <div class="glass-card mb-xl" style="border-color: var(--border-accent); box-shadow: 0 0 20px rgba(124,106,255,0.08);">
        <div class="card-header">
          <div class="card-title">FitForge AI Coach</div>
          <div class="card-icon" style="background: var(--accent-subtle); color: var(--accent);">⚡</div>
        </div>
        
        <div class="flex flex-col gap-md">
          <div class="flex gap-md items-start">
            <span style="font-size: 1.8rem; min-width: 32px; text-align: center;">🥗</span>
            <div>
              <div class="font-bold text-sm text-accent mb-2xs">Nutrition Adaptation</div>
              <p class="text-xs text-secondary" style="line-height: 1.4;">${advice.nutritionTip}</p>
            </div>
          </div>
          
          <div class="divider" style="margin: 0;"></div>
          
          <div class="flex gap-md items-start">
            <span style="font-size: 1.8rem; min-width: 32px; text-align: center;">🏋️</span>
            <div>
              <div class="font-bold text-sm text-accent mb-2xs">Exercise Progression</div>
              <p class="text-xs text-secondary" style="line-height: 1.4;">${advice.workoutTip}</p>
            </div>
          </div>
          
          ${advice.prediction ? `
            <div class="divider" style="margin: 0;"></div>
            
            <div class="flex gap-md items-start" style="background: rgba(52,217,163,0.06); padding: var(--space-xs); border-radius: var(--radius-sm); border: 1px solid rgba(52,217,163,0.15);">
              <span style="font-size: 1.8rem; min-width: 32px; text-align: center;">📈</span>
              <div>
                <div class="font-bold text-sm text-success mb-2xs">Regression Goal Projection</div>
                <p class="text-xs text-secondary" style="line-height: 1.4;">
                  At your current rate of <strong>${advice.prediction.weeklyRate} kg/week</strong>, you are projected to reach your goal in <strong>${advice.prediction.days} days</strong> (approx <strong>${advice.prediction.targetDate}</strong>).
                </p>
              </div>
            </div>
          ` : ''}
        </div>
      </div>
      
    </div>
  `;

  bindEvents(container);
}

function bindEvents(container) {
  // Handle adding water from dashboard
  const addWaterBtn = document.getElementById('dash-add-water-btn');
  if (addWaterBtn) {
    addWaterBtn.addEventListener('click', async () => {
      const todayStr = new Date().toISOString().split('T')[0];
      await db.addWater(todayStr, 250);
      
      // Load updated water total and update store
      const updated = await db.getWaterByDate(todayStr);
      store.update('today', { water: updated.total });
      
      window.showToast('Hydration Logged', '+250ml water added to your log.', 'info');
    });
  }
}

function getSleepQualityLabel(quality) {
  const labels = {
    1: 'Poor recovery 😫',
    2: 'Restless sleep 😴',
    3: 'Average recovery 🙂',
    4: 'Good rest 😊',
    5: 'Deep sleep, fully recovered! ⚡'
  };
  return labels[quality] || 'Logged';
}

export function cleanup() {
  if (storeUnsubscribe) {
    storeUnsubscribe();
    storeUnsubscribe = null;
  }
}
