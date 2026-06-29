/* ============================================================
   FitForge — Meal Tracker View
   Logs meals, simulates food photo scanning, database search, and real-time coaching tips
   ============================================================ */

import db from '../db.js';
import store from '../store.js';
import { FOOD_DB, searchFood } from '../data/foodDatabase.js';
import { classifyFoodImage } from '../ml/foodClassifier.js';

function formatDetectionsSummary(detections) {
  if (!detections || detections.length === 0) return 'No objects recognized';
  const counts = {};
  detections.forEach(d => {
    const key = d.class.toLowerCase();
    counts[key] = (counts[key] || 0) + 1;
  });
  return Object.entries(counts).map(([name, count]) => `${count} ${name}${count > 1 ? 's' : ''}`).join(', ');
}

let storeUnsubscribe = null;
let currentActiveMealSection = 'Breakfast';

// Map food list to have uniform key naming expected by rest of codebase
const FOOD_DATABASE = FOOD_DB.map(f => ({
  name: f.name,
  calories: f.cal,
  protein: f.p,
  carbs: f.c,
  fat: f.f,
  portion: f.portion,
  id: f.id,
  fiber: f.fi || 0,
  sodium: f.na || 0,
  calcium: f.ca || 0,
  iron: f.fe || 0
}));


export async function render(container) {
  if (storeUnsubscribe) storeUnsubscribe();
  storeUnsubscribe = store.on('*', () => {
    if (document.getElementById('meals-view')) {
      renderContent(container);
    }
  });

  renderContent(container);
}

function renderContent(container) {
  const today = store.state.today;
  const meals = today.meals || [];
  
  // Categorize meals
  const categorized = {
    Breakfast: { items: [], totalCals: 0 },
    Lunch: { items: [], totalCals: 0 },
    Dinner: { items: [], totalCals: 0 },
    Snacks: { items: [], totalCals: 0 }
  };
  
  meals.forEach(m => {
    const mealType = m.mealType || 'Breakfast';
    if (categorized[mealType]) {
      categorized[mealType].items = m.items || [];
      categorized[mealType].totalCals = (m.items || []).reduce((sum, item) => sum + (item.calories * (item.servings || 1)), 0);
    }
  });

  // Calculate coaching guidelines
  const coachTip = generateCoachingTip();

  container.innerHTML = `
    <div class="container view" id="meals-view">
      <div class="view-header">
        <div>
          <h1>Meal & <span class="text-gradient">Macros</span></h1>
          <div class="subtitle">Log food, scan plates, and track nutrition targets</div>
        </div>
      </div>

      <!-- Micronutrients Card -->
      <div class="glass-card mb-lg">
        <div class="card-header">
          <div class="card-title">Micronutrient Progress</div>
          <div class="card-icon" style="background: rgba(124, 58, 237, 0.1); color: var(--accent);">🔬</div>
        </div>
        
        <div class="micro-grid">
          <div class="micro-card" data-micro="fiber">
            <div class="micro-name">Fiber</div>
            <div class="micro-value">${today.fiberConsumed || 0}g / ${store.state.user.macros.fiber || 30}g</div>
            <div class="micro-progress-container">
              <div class="micro-progress-bar" style="width: ${Math.min(100, ((today.fiberConsumed || 0) / (store.state.user.macros.fiber || 30)) * 100)}%"></div>
            </div>
          </div>
          
          <div class="micro-card" data-micro="sodium">
            <div class="micro-name">Sodium</div>
            <div class="micro-value">${today.sodiumConsumed || 0}mg / ${store.state.user.macros.sodium || 2300}mg</div>
            <div class="micro-progress-container">
              <div class="micro-progress-bar" style="width: ${Math.min(100, ((today.sodiumConsumed || 0) / (store.state.user.macros.sodium || 2300)) * 100)}%"></div>
            </div>
          </div>
          
          <div class="micro-card" data-micro="calcium">
            <div class="micro-name">Calcium</div>
            <div class="micro-value">${today.calciumConsumed || 0}mg / ${store.state.user.macros.calcium || 1000}mg</div>
            <div class="micro-progress-container">
              <div class="micro-progress-bar" style="width: ${Math.min(100, ((today.calciumConsumed || 0) / (store.state.user.macros.calcium || 1000)) * 100)}%"></div>
            </div>
          </div>
          
          <div class="micro-card" data-micro="iron">
            <div class="micro-name">Iron</div>
            <div class="micro-value">${today.ironConsumed || 0}mg / ${store.state.user.macros.iron || 8}mg</div>
            <div class="micro-progress-container">
              <div class="micro-progress-bar" style="width: ${Math.min(100, ((today.ironConsumed || 0) / (store.state.user.macros.iron || 8)) * 100)}%"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Scan Platform card -->
      <div class="glass-card mb-lg card-accent text-center" id="scan-init-panel">
        <div class="card-header">
          <div class="card-title">AI Food Recognition Scan</div>
          <div class="card-icon" style="background: rgba(52, 217, 163, 0.1); color: var(--success);">📷</div>
        </div>
        
        <div class="p-sm flex flex-col items-center gap-sm">
          <p class="text-sm text-secondary">Snap a photo of your plate to instantly identify foods and estimate serving sizes using the camera scan.</p>
          <button class="btn btn-primary btn-sm" id="meal-photo-trigger-btn">
            📷 Snap & Scan Plate
          </button>
          <input type="file" id="meal-photo-file" class="hidden" accept="image/*">
        </div>
      </div>

      <!-- Meal logs by category -->
      <div class="flex flex-col gap-md mb-xl">
        ${Object.entries(categorized).map(([sectionName, section]) => `
          <div class="glass-card meal-section" data-section="${sectionName}">
            <div class="meal-header" onclick="document.querySelector('.meal-section[data-section=\\'${sectionName}\\'] .meal-items').classList.toggle('expanded')">
              <h3>
                <span class="meal-expand expanded">▼</span>
                <span>${sectionName}</span>
              </h3>
              <div class="flex items-center gap-sm">
                <span class="meal-cals font-bold">${Math.round(section.totalCals)} kcal</span>
                <span class="badge badge-accent" style="font-size: 0.65rem;">${section.items.length} items</span>
              </div>
            </div>
            
            <div class="meal-items expanded">
              <div class="divider" style="margin: 0 0 var(--space-xs) 0;"></div>
              
              ${section.items.length === 0 ? `
                <p class="text-xs text-muted py-md text-center">No food logged yet for ${sectionName}.</p>
              ` : `
                <div class="flex flex-col gap-2xs">
                  ${section.items.map(item => `
                    <div class="meal-item">
                      <div class="meal-item-info">
                        <div class="meal-item-name">${item.name}</div>
                        <div class="meal-item-portion">${item.portion} • ${item.servings || 1} serving(s)</div>
                        <div class="text-xs text-muted">P: ${Math.round(item.protein * (item.servings || 1))}g | C: ${Math.round(item.carbs * (item.servings || 1))}g | F: ${Math.round(item.fat * (item.servings || 1))}g</div>
                      </div>
                      <div class="meal-item-cals font-bold">${Math.round(item.calories * (item.servings || 1))} kcal</div>
                      <button class="meal-item-delete" data-meal-type="${sectionName}" data-item-id="${item.id}" title="Remove item">
                        🗑️
                      </button>
                    </div>
                  `).join('')}
                </div>
              `}
              
              <button class="add-food-btn" data-meal-type="${sectionName}">
                ➕ Add Food to ${sectionName}
              </button>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Premium Coach Assistant card -->
      <div class="glass-card" style="border-color: var(--border-accent); box-shadow: 0 0 20px rgba(124,106,255,0.08);">
        <div class="card-header">
          <div class="card-title">FitForge AI Nutrition Coach</div>
          <div class="card-icon" style="background: var(--accent-subtle); color: var(--accent);">⚡</div>
        </div>
        <div class="flex gap-md items-start">
          <span style="font-size: 2.2rem; transform: scaleX(-1);">💡</span>
          <div>
            <div class="font-bold text-sm text-accent mb-2xs">Real-Time Nutrition Coaching</div>
            <p class="text-sm text-secondary" style="line-height: 1.5;">${coachTip}</p>
          </div>
        </div>
      </div>

    </div>
  `;

  bindEvents(container);
}

function bindEvents(container) {
  // Capture photo triggering
  const scanTriggerBtn = document.getElementById('meal-photo-trigger-btn');
  const scanInputFile = document.getElementById('meal-photo-file');
  
  if (scanTriggerBtn && scanInputFile) {
    scanTriggerBtn.addEventListener('click', () => scanInputFile.click());
    scanInputFile.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        triggerPlateScanner(container, file);
      }
    });
  }

  // Deleting meal items
  document.querySelectorAll('.meal-item-delete').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const mealType = btn.getAttribute('data-meal-type');
      const itemId = parseInt(btn.getAttribute('data-item-id'));
      
      const todayStr = new Date().toISOString().split('T')[0];
      const meal = await db.meals.where({ date: todayStr, mealType }).first();
      if (meal) {
        await db.removeMealItem(meal.id, itemId);
        
        // Reload meals and update store
        const meals = await db.getMealsByDate(todayStr);
        store.update('today', { meals });
        store.recalcToday(meals);
        
        window.showToast('Item Removed', 'Food removed from log.', 'info');
      }
    });
  });

  // Open Add Food modal
  document.querySelectorAll('.add-food-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const mealType = btn.getAttribute('data-meal-type');
      currentActiveMealSection = mealType;
      openAddFoodModal(mealType);
    });
  });
}

function generateCoachingTip() {
  const user = store.state.user;
  const today = store.state.today;
  const targetCals = user.macros.calories || 2000;
  const consumedCals = today.caloriesConsumed || 0;
  const proteinTarget = user.macros.protein || 140;
  const proteinConsumed = today.proteinConsumed || 0;
  const fatTarget = user.macros.fat || 65;
  const fatConsumed = today.fatConsumed || 0;
  
  if (consumedCals === 0) {
    return "No meals logged today yet. Kickoff the day with a protein-rich meal (e.g. Eggs, Oats, or Dal) to stimulate muscle protein synthesis and maintain steady energy levels.";
  }

  // If protein deficit
  if (proteinConsumed < proteinTarget * 0.4) {
    return `Your protein intake is currently low (${proteinConsumed}g out of ${proteinTarget}g). To preserve muscle mass and keep satiety high, consider incorporating a scoop of Whey Protein, 150g Paneer, or Grilled Chicken into your next meal.`;
  }
  
  // If calorie boundary
  if (consumedCals > targetCals * 0.9) {
    return `You've utilized ${Math.round((consumedCals / targetCals) * 100)}% of your daily calories. For the rest of the day, prioritize high-volume, low-calorie foods like cucumber, broccoli, or clear soups to satisfy hunger without exceeding targets.`;
  }
  
  // If fats exceeded
  if (fatConsumed > fatTarget * 0.9) {
    return `Your fat consumption is close to your limit (${fatConsumed}g / ${fatTarget}g). Keep your upcoming dishes lean. Opt for boiled foods, skip the oil/butter, and choose egg whites or lean breast meat instead of whole eggs or paneer.`;
  }

  return "Outstanding! Your macronutrient partition is extremely well-balanced today. Ensure you log your dinner and stay hydrated to maximize recovery overnight.";
}

// Add Food Modal Dialog Handler
function openAddFoodModal(mealType) {
  const modalHtml = `
    <div class="flex flex-col gap-md food-search-container">
      <div class="input-icon-wrapper">
        <input type="text" id="food-search-query" class="input" placeholder="Search food database..." autofocus>
        <span class="input-icon">🔍</span>
      </div>
      
      <div class="food-search-results" id="modal-food-results">
        <p class="text-xs text-muted text-center py-md">Type above to search common foods...</p>
      </div>
      
      <!-- Portion configuration (hidden initially, visible on result click) -->
      <div class="glass-card hidden" id="modal-portion-editor">
        <div class="font-bold text-sm mb-xs" id="editor-food-name">Selected Food</div>
        <div class="text-xs text-muted mb-sm" id="editor-food-portion">1 portion</div>
        
        <div class="input-group mb-sm">
          <label for="editor-servings">Servings Count</label>
          <input type="range" id="editor-servings" min="0.25" max="5" step="0.25" value="1">
          <div class="flex justify-between text-xs font-semibold text-accent mt-xs">
            <span>0.25</span>
            <span id="editor-servings-val" class="font-bold text-gradient">1.0 servings</span>
            <span>5.0</span>
          </div>
        </div>
        
        <button class="btn btn-primary btn-block" id="modal-save-food-btn">
          Log to ${mealType}
        </button>
      </div>
    </div>
  `;

  window.showModal(`Add Food to ${mealType}`, modalHtml, () => {
    // Cleanup if necessary
  });

  // Setup search filter logic inside the modal
  const searchInput = document.getElementById('food-search-query');
  const resultsContainer = document.getElementById('modal-food-results');
  const portionEditor = document.getElementById('modal-portion-editor');
  const editorFoodName = document.getElementById('editor-food-name');
  const editorFoodPortion = document.getElementById('editor-food-portion');
  const servingsSlider = document.getElementById('editor-servings');
  const servingsLabel = document.getElementById('editor-servings-val');
  const saveBtn = document.getElementById('modal-save-food-btn');
  
  let selectedFood = null;

  if (searchInput && resultsContainer) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase().trim();
      if (!query) {
        resultsContainer.innerHTML = `<p class="text-xs text-muted text-center py-md">Type above to search common foods...</p>`;
        return;
      }
      
      const filtered = FOOD_DATABASE.filter(f => f.name.toLowerCase().includes(query));
      
      if (filtered.length === 0) {
        resultsContainer.innerHTML = `<p class="text-xs text-muted text-center py-md">No matching foods found. Create a custom item?</p>`;
        return;
      }
      
      resultsContainer.innerHTML = filtered.map(food => `
        <div class="food-result-item" data-food-name="${food.name}">
          <div>
            <div class="food-name">${food.name}</div>
            <div class="food-portion">${food.portion}</div>
          </div>
          <div class="text-right">
            <div class="food-name text-gradient">${food.calories} kcal</div>
            <div class="food-macros">P: ${food.protein}g | C: ${food.carbs}g | F: ${food.fat}g</div>
          </div>
        </div>
      `).join('');
      
      // Result click listener
      document.querySelectorAll('.food-result-item').forEach(item => {
        item.addEventListener('click', () => {
          const foodName = item.getAttribute('data-food-name');
          selectedFood = FOOD_DATABASE.find(f => f.name === foodName);
          
          if (selectedFood) {
            editorFoodName.textContent = selectedFood.name;
            editorFoodPortion.textContent = `Standard serving size: ${selectedFood.portion} (${selectedFood.calories} kcal)`;
            portionEditor.classList.remove('hidden');
          }
        });
      });
    });
  }
  
  if (servingsSlider && servingsLabel) {
    servingsSlider.addEventListener('input', () => {
      servingsLabel.textContent = `${parseFloat(servingsSlider.value).toFixed(2)} servings`;
    });
  }
  
  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      if (selectedFood) {
        const servings = parseFloat(servingsSlider.value) || 1;
        const todayStr = new Date().toISOString().split('T')[0];
        
        await db.addMealItem(todayStr, mealType, {
          name: selectedFood.name,
          calories: selectedFood.calories,
          protein: selectedFood.protein,
          carbs: selectedFood.carbs,
          fat: selectedFood.fat,
          fiber: selectedFood.fiber || 0,
          sodium: selectedFood.sodium || 0,
          calcium: selectedFood.calcium || 0,
          iron: selectedFood.iron || 0,
          portion: selectedFood.portion,
          servings: servings
        });
        
        // Reload meals and update store
        const meals = await db.getMealsByDate(todayStr);
        store.update('today', { meals });
        store.recalcToday(meals);
        
        window.hideModal();
        window.showToast('Meal Logged', `${selectedFood.name} added to ${mealType}.`, 'success');
      }
    });
  }
}

// Real Plate Photo Scanner using TF.js
function triggerPlateScanner(container, file) {
  const panel = document.getElementById('scan-init-panel');
  if (!panel) return;
  
  const imgUrl = URL.createObjectURL(file);
  
  panel.innerHTML = `
    <div class="glass-card text-center" style="position: relative; overflow: hidden; padding: 0; min-height: 250px;">
      <img id="scan-preview" src="${imgUrl}" style="width: 100%; height: 250px; object-fit: cover; filter: brightness(0.6);">
      
      <!-- Scan overlay -->
      <div id="laser-line" style="position: absolute; left: 0; right: 0; height: 3px; background: var(--success); top: 0; box-shadow: 0 0 10px var(--success-glow); animation: laserScroll 2s linear infinite;"></div>
      
      <!-- Dynamic bounding boxes -->
      <div id="scan-box-dynamic" class="glass-card card-flush hidden" style="position: absolute; border: 2px solid var(--success); box-shadow: 0 0 10px var(--success-glow); top: 25%; left: 25%; width: 50%; height: 50%; pointer-events: none;">
        <span id="scan-box-label" class="badge badge-success" style="position: absolute; top: -10px; left: 4px; font-size: 0.6rem;">Detecting...</span>
      </div>

      <div class="flex flex-col items-center justify-center" style="position: absolute; inset: 0; background: rgba(10,10,20,0.5); pointer-events: none;" id="scan-status-panel">
        <div class="spinner mb-sm"></div>
        <div class="font-bold text-sm text-gradient" id="plate-scan-status">Initialising TF.js Engine...</div>
        <div class="text-xs text-muted" id="plate-scan-log">Loading neural network weights</div>
      </div>
    </div>
  `;

  // Start actual model run
    tempImg.onload = async () => {
    try {
      const statusEl = document.getElementById('plate-scan-status');
      const logEl = document.getElementById('plate-scan-log');
      
      if (statusEl) statusEl.textContent = 'Analyzing plate contours...';
      if (logEl) logEl.textContent = 'Extracting pixel HSL color profile...';
      await new Promise(r => setTimeout(r, 600));

      if (statusEl) statusEl.textContent = 'Reading local database...';
      if (logEl) logEl.textContent = 'Loading Bayesian dietary history priors...';
      await new Promise(r => setTimeout(r, 600));

      if (statusEl) statusEl.textContent = 'Running Computer Vision...';
      if (logEl) logEl.textContent = 'MobileNetV2 neural feature extraction...';
      
      const results = await classifyFoodImage(tempImg, file.name);
      
      if (statusEl) statusEl.textContent = 'Synthesizing predictions...';
      if (logEl) logEl.textContent = 'Aligning color and history signatures...';
      await new Promise(r => setTimeout(r, 600));
      
      const isNotFood = results.length > 0 && results[0].error === 'NOT_FOOD';
      const isLowConfidence = results.length === 0 || results[0].confidence < 40 || results[0].labelMatched.includes('fallback:');

      if (isNotFood || isLowConfidence) {
        const todayStr = new Date().toISOString().split('T')[0];
        const detectionsSummary = formatDetectionsSummary(results.detections);
        
        let headerHtml = '';
        if (isNotFood) {
          headerHtml = `
            <div class="glass-card text-center py-sm animate-in" style="border-color: var(--danger); background: rgba(239, 68, 68, 0.04); padding: var(--space-sm);">
              <span style="font-size: 1.8rem;">🍽️❌</span>
              <div class="font-bold text-sm text-danger" style="margin-top: 4px; font-weight: 700;">Food Plate Not Detected</div>
              <p class="text-xs text-secondary mt-xs" style="line-height: 1.4; margin: 4px 0 0 0;">
                The visual analyzer detected non-food items in this photo.<br>
                <strong>Detected:</strong> <span class="text-accent">${detectionsSummary}</span>
              </p>
            </div>
          `;
        } else {
          headerHtml = `
            <div class="glass-card text-center py-sm" style="border-color: rgba(239, 68, 68, 0.4); background: rgba(239, 68, 68, 0.03); padding: var(--space-sm);">
              <span style="font-size: 1.8rem;">🔍</span>
              <div class="font-bold text-sm text-danger" style="margin-top: 4px; font-weight: 700;">Food Not Recognized</div>
              <p class="text-xs text-secondary mt-xs" style="line-height: 1.4; margin: 4px 0 0 0;">
                We were not able to recognize the food in this photo with high confidence.<br>
                <strong>Detected:</strong> <span class="text-accent">${detectionsSummary}</span>
              </p>
            </div>
          `;
        }

        const confirmBody = `
          <div class="flex flex-col gap-md">
            ${headerHtml}
            
            <div class="input-group relative" style="margin-bottom: var(--space-xs);">
              <label class="text-xs font-bold text-secondary">Search Food Item</label>
              <input type="text" id="manual-scan-search" class="input" placeholder="Type to search (e.g. Orange Juice, Roti)..." style="margin-top: var(--space-2xs);" autocomplete="off">
              <div id="manual-scan-results" class="hidden" style="max-height: 180px; overflow-y: auto; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); background: rgba(20,20,35,0.98); position: absolute; left: 0; right: 0; top: 100%; z-index: 100; box-shadow: 0 4px 15px rgba(0,0,0,0.5); backdrop-filter: blur(10px);"></div>
            </div>

            <div class="glass-card hidden" id="manual-scan-selected-card" style="padding: var(--space-sm); border-color: var(--accent);">
              <div class="flex justify-between font-bold text-sm">
                <span id="manual-selected-name">Selected Food</span>
                <span class="text-gradient" id="manual-selected-cal">0 kcal</span>
              </div>
              <div class="text-xs text-secondary mb-sm" id="manual-selected-macros">Portion info</div>
              
              <div class="flex items-center gap-sm">
                <span class="text-xs text-secondary">Servings:</span>
                <input type="range" id="manual-selected-servings-slider" min="0.25" max="4" step="0.25" value="1.0" style="flex: 1;">
                <span class="text-xs font-bold text-accent" id="manual-selected-servings-val">1.00</span>
              </div>
            </div>
            
            <div class="input-group">
              <label for="scan-meal-type">Meal Logging Type</label>
              <select id="scan-meal-type" class="input">
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch" selected>Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Snacks">Snacks</option>
              </select>
            </div>
            
            <button class="btn btn-primary btn-block disabled" id="confirm-manual-scan-btn" disabled style="opacity: 0.5; pointer-events: none;">
              Log Selected Food
            </button>
          </div>
        `;

        window.showModal("Confirm Plate Scan", confirmBody);

        let selectedFood = null;
        let currentServings = 1.0;

        const searchInput = document.getElementById('manual-scan-search');
        const resultsDiv = document.getElementById('manual-scan-results');
        const selectedCard = document.getElementById('manual-scan-selected-card');
        const confirmManualBtn = document.getElementById('confirm-manual-scan-btn');

        if (searchInput && resultsDiv) {
          searchInput.addEventListener('input', () => {
            const query = searchInput.value;
            if (!query || query.length < 2) {
              resultsDiv.innerHTML = '';
              resultsDiv.classList.add('hidden');
              return;
            }

            const matches = searchFood(query);
            if (matches.length === 0) {
              resultsDiv.innerHTML = `<div style="padding: var(--space-sm); font-size: 0.8rem; color: var(--text-muted); text-align: center;">No matches found</div>`;
              resultsDiv.classList.remove('hidden');
              return;
            }

            resultsDiv.innerHTML = matches.map(food => `
              <div class="manual-search-item" data-id="${food.id}" style="padding: var(--space-sm); cursor: pointer; border-bottom: 1px solid var(--border-subtle); font-size: 0.8rem;">
                <div class="font-bold flex justify-between">
                  <span>${food.emoji || '🍽️'} ${food.name}</span>
                  <span class="text-accent">${food.cal || food.calories} kcal</span>
                </div>
                <div style="font-size: 0.7rem; color: var(--text-muted);">${food.portion} • P: ${food.p || food.protein}g | C: ${food.c || food.carbs}g | F: ${food.f || food.fat}g</div>
              </div>
            `).join('');
            resultsDiv.classList.remove('hidden');

            document.querySelectorAll('.manual-search-item').forEach(item => {
              item.addEventListener('click', () => {
                const foodId = parseInt(item.getAttribute('data-id'));
                const found = FOOD_DB.find(f => f.id === foodId);
                if (found) {
                  selectedFood = found;
                  currentServings = 1.0;
                  
                  document.getElementById('manual-selected-name').textContent = selectedFood.name;
                  document.getElementById('manual-selected-cal').textContent = `${Math.round((selectedFood.cal || selectedFood.calories) * currentServings)} kcal`;
                  document.getElementById('manual-selected-macros').textContent = `${selectedFood.portion} • P: ${selectedFood.p || selectedFood.protein}g | C: ${selectedFood.c || selectedFood.carbs}g | F: ${selectedFood.f || selectedFood.fat}g`;
                  
                  const slider = document.getElementById('manual-selected-servings-slider');
                  if (slider) slider.value = 1.0;
                  const valSpan = document.getElementById('manual-selected-servings-val');
                  if (valSpan) valSpan.textContent = "1.00";

                  selectedCard.classList.remove('hidden');
                  confirmManualBtn.removeAttribute('disabled');
                  confirmManualBtn.classList.remove('disabled');
                  confirmManualBtn.style.opacity = '1';
                  confirmManualBtn.style.pointerEvents = 'auto';
                  resultsDiv.classList.add('hidden');
                  searchInput.value = selectedFood.name;
                }
              });
            });
          });
        }

        const manualSlider = document.getElementById('manual-selected-servings-slider');
        if (manualSlider) {
          manualSlider.addEventListener('input', () => {
            if (!selectedFood) return;
            currentServings = parseFloat(manualSlider.value);
            document.getElementById('manual-selected-servings-val').textContent = currentServings.toFixed(2);
            document.getElementById('manual-selected-cal').textContent = `${Math.round((selectedFood.cal || selectedFood.calories) * currentServings)} kcal`;
          });
        }

        if (confirmManualBtn) {
          confirmManualBtn.addEventListener('click', async () => {
            if (!selectedFood) return;
            const mealType = document.getElementById('scan-meal-type').value;

            await db.addMealItem(todayStr, mealType, {
              name: selectedFood.name,
              calories: selectedFood.cal || selectedFood.calories,
              protein: selectedFood.p || selectedFood.protein,
              carbs: selectedFood.c || selectedFood.carbs,
              fat: selectedFood.f || selectedFood.fat,
              fiber: selectedFood.fi || selectedFood.fiber || 0,
              sodium: selectedFood.na || selectedFood.sodium || 0,
              calcium: selectedFood.ca || selectedFood.calcium || 0,
              iron: selectedFood.fe || selectedFood.iron || 0,
              portion: selectedFood.portion,
              servings: currentServings
            });

            const meals = await db.getMealsByDate(todayStr);
            store.update('today', { meals });
            store.recalcToday(meals);
            
            window.hideModal();
            window.showToast('Plate Logged', `Logged ${selectedFood.name} successfully!`, 'success');
            renderContent(container);
          });
        }
        return;
      }

      // Update label in preview
      const scanBox = document.getElementById('scan-box-dynamic');
      const scanBoxLabel = document.getElementById('scan-box-label');
      if (scanBox && scanBoxLabel && results.length > 0) {
        scanBoxLabel.textContent = `${results[0].food.name} [${results[0].confidence}%]`;
        scanBox.classList.remove('hidden');
      }

      await new Promise(r => setTimeout(r, 600));

      const scanItems = results.map(r => {
        const dbFood = FOOD_DB.find(f => f.id === r.food.id) || r.food;
        return {
          name: dbFood.name,
          calories: dbFood.cal || dbFood.calories,
          protein: dbFood.p || dbFood.protein,
          carbs: dbFood.c || dbFood.carbs,
          fat: dbFood.f || dbFood.fat,
          fiber: dbFood.fi || dbFood.fiber || 0,
          sodium: dbFood.na || dbFood.sodium || 0,
          calcium: dbFood.ca || dbFood.calcium || 0,
          iron: dbFood.fe || dbFood.iron || 0,
          portion: dbFood.portion,
          servings: 1.0,
          confidence: r.confidence
        };
      });

      // Fallback if no foods found
      if (scanItems.length === 0) {
        scanItems.push({
          name: "Healthy Salad Bowl",
          calories: 150,
          protein: 4,
          carbs: 12,
          fat: 8,
          fiber: 4,
          sodium: 120,
          calcium: 40,
          iron: 1.5,
          portion: "1 plate",
          servings: 1.0,
          confidence: 70
        });
      }

      const todayStr = new Date().toISOString().split('T')[0];
      
      const confirmBody = `
        <div class="flex flex-col gap-md">
          <div class="glass-card text-center py-sm bg-success-glow" style="border-color: var(--success);">
            <span style="font-size: 1.8rem;">🎉</span>
            <div class="font-bold text-sm text-success">Plate Analysis Complete!</div>
          </div>
          
          <p class="text-sm text-secondary">We identified the following food candidates from your photo. Check the foods you actually ate and adjust servings:</p>
          
          <div class="flex flex-col gap-xs" id="confirm-scan-list" style="max-height: 200px; overflow-y: auto; padding-right: 4px;">
            ${scanItems.slice(0, 4).map((food, i) => `
              <div class="glass-card" style="padding: var(--space-sm); border-color: ${i === 0 ? 'rgba(52, 217, 163, 0.4)' : 'var(--border-subtle)'};">
                <div class="flex items-center gap-sm mb-xs">
                  <input type="checkbox" class="confirm-item-checkbox" data-idx="${i}" ${i === 0 ? 'checked' : ''} style="width: 16px; height: 16px; accent-color: var(--accent); cursor: pointer;">
                  <div style="flex: 1;">
                    <div class="flex justify-between font-bold text-sm">
                      <span>${food.name} <span class="text-2xs text-muted">(${food.confidence}% match)</span></span>
                      <span class="text-gradient">${Math.round(food.calories * food.servings)} kcal</span>
                    </div>
                    <div class="text-xs text-secondary">${food.portion} • P: ${food.protein}g | C: ${food.carbs}g | F: ${food.fat}g</div>
                  </div>
                </div>
                
                <div class="flex items-center gap-sm mt-xs">
                  <span class="text-xs text-secondary">Servings:</span>
                  <input type="range" class="confirm-servings-slider" data-idx="${i}" min="0.25" max="4" step="0.25" value="${food.servings}" style="flex: 1;">
                  <span class="text-xs font-bold text-accent" id="confirm-val-${i}">${food.servings.toFixed(2)}</span>
                </div>
              </div>
            `).join('')}
          </div>
          
          <div class="input-group">
            <label for="scan-meal-type">Meal Logging Type</label>
            <select id="scan-meal-type" class="input">
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch" selected>Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="Snacks">Snacks</option>
            </select>
          </div>
          
          <button class="btn btn-primary btn-block" id="confirm-scan-btn">
            Log Checked Food(s) to Journal
          </button>
        </div>
      `;

      window.showModal("Confirm Plate Scan", confirmBody);

      // Bind servings slider updates
      document.querySelectorAll('.confirm-servings-slider').forEach(slider => {
        slider.addEventListener('input', () => {
          const idx = parseInt(slider.getAttribute('data-idx'));
          const valSpan = document.getElementById(`confirm-val-${idx}`);
          const value = parseFloat(slider.value);
          scanItems[idx].servings = value;
          if (valSpan) valSpan.textContent = value.toFixed(2);
        });
      });

      const confirmBtn = document.getElementById('confirm-scan-btn');
      if (confirmBtn) {
        confirmBtn.addEventListener('click', async () => {
          const mealType = document.getElementById('scan-meal-type').value;
          const checkboxes = document.querySelectorAll('.confirm-item-checkbox');
          
          let loggedCount = 0;
          for (let i = 0; i < scanItems.length; i++) {
            const cb = checkboxes[i];
            if (cb && !cb.checked) continue;
            
            const item = scanItems[i];
            loggedCount++;
            await db.addMealItem(todayStr, mealType, {
              name: item.name,
              calories: item.calories,
              protein: item.protein,
              carbs: item.carbs,
              fat: item.fat,
              fiber: item.fiber || 0,
              sodium: item.sodium || 0,
              calcium: item.calcium || 0,
              iron: item.iron || 0,
              portion: item.portion,
              servings: item.servings
            });
          }
          
          if (loggedCount === 0) {
            window.showToast('No Food Selected', 'Please check at least one food item to log.', 'warning');
            return;
          }
          
          const meals = await db.getMealsByDate(todayStr);
          store.update('today', { meals });
          store.recalcToday(meals);
          
          window.hideModal();
          window.showToast('Plate Logged', `Logged ${loggedCount} item(s) successfully!`, 'success');
          renderContent(container);
        });
      }
    } catch (err) {
      console.error(err);
      window.showToast('Classifier Error', 'Failed to run image scanning.', 'danger');
      renderContent(container);
    }
  };
  tempImg.src = imgUrl;
}

export function cleanup() {
  if (storeUnsubscribe) {
    storeUnsubscribe();
    storeUnsubscribe = null;
  }
}
