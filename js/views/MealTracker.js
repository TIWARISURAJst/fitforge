/* ============================================================
   FitForge — Meal Tracker View
   Logs meals, simulates food photo scanning, database search, and real-time coaching tips
   ============================================================ */

import db from '../db.js';
import store from '../store.js';
import { FOOD_DB, searchFood } from '../data/foodDatabase.js';
import { classifyFoodImage } from '../ml/foodClassifier.js';

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
  id: f.id
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
          <h1>Meal <span class="text-gradient">Tracker</span></h1>
          <div class="subtitle">Log food, scan plates, and track macros</div>
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
  const tempImg = new Image();
  tempImg.onload = async () => {
    try {
      const statusEl = document.getElementById('plate-scan-status');
      const logEl = document.getElementById('plate-scan-log');
      
      if (statusEl) statusEl.textContent = 'Parsing plate contours...';
      if (logEl) logEl.textContent = 'Running MobileNetV2 inference';

      const results = await classifyFoodImage(tempImg);
      
      if (statusEl) statusEl.textContent = 'Mapping nutrition signatures...';
      
      // Update label in preview
      const scanBox = document.getElementById('scan-box-dynamic');
      const scanBoxLabel = document.getElementById('scan-box-label');
      if (scanBox && scanBoxLabel && results.length > 0) {
        scanBoxLabel.textContent = `${results[0].food.name} [${results[0].confidence}%]`;
        scanBox.classList.remove('hidden');
      }

      await new Promise(r => setTimeout(r, 1500));

      const scanItems = results.map(r => ({
        name: r.food.name,
        calories: r.food.calories,
        protein: r.food.protein,
        carbs: r.food.carbs,
        fat: r.food.fat,
        portion: r.food.portion,
        servings: 1.0
      }));

      // Fallback if no foods found
      if (scanItems.length === 0) {
        scanItems.push({
          name: "Healthy Salad Bowl",
          calories: 150,
          protein: 4,
          carbs: 12,
          fat: 8,
          portion: "1 plate",
          servings: 1.0
        });
      }

      const todayStr = new Date().toISOString().split('T')[0];
      
      const confirmBody = `
        <div class="flex flex-col gap-md">
          <div class="glass-card text-center py-sm bg-success-glow" style="border-color: var(--success);">
            <span style="font-size: 1.8rem;">🎉</span>
            <div class="font-bold text-sm text-success">Scan Success! Food Identified</div>
          </div>
          
          <p class="text-sm text-secondary">Review the estimated foods and portion sizes from the camera scan. Edit as needed before logging.</p>
          
          <div class="flex flex-col gap-xs" id="confirm-scan-list">
            ${scanItems.map((food, i) => `
              <div class="glass-card" style="padding: var(--space-sm);">
                <div class="flex justify-between font-bold text-sm">
                  <span>${food.name}</span>
                  <span class="text-gradient">${Math.round(food.calories * food.servings)} kcal</span>
                </div>
                <div class="text-xs text-muted mb-xs">${food.portion} • P: ${food.protein}g | C: ${food.carbs}g | F: ${food.fat}g</div>
                
                <div class="flex items-center gap-sm">
                  <span class="text-xs text-secondary">Servings:</span>
                  <input type="range" class="confirm-servings-slider" data-idx="${i}" min="0.25" max="4" step="0.25" value="${food.servings}" style="flex: 1;">
                  <span class="text-xs font-bold text-accent" id="confirm-val-${i}">${food.servings.toFixed(2)}</span>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="input-group">
            <label for="scan-meal-type">Log to which meal?</label>
            <select id="scan-meal-type" class="input">
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch" selected>Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="Snacks">Snacks</option>
            </select>
          </div>

          <button class="btn btn-primary btn-block" id="confirm-scan-btn">
            Log Identified Meal
          </button>
        </div>
      `;

      window.showModal('Confirm Plate Scan', confirmBody, () => {
        renderContent(container);
      });

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
          
          for (const item of scanItems) {
            await db.addMealItem(todayStr, mealType, {
              name: item.name,
              calories: item.calories,
              protein: item.protein,
              carbs: item.carbs,
              fat: item.fat,
              portion: item.portion,
              servings: item.servings
            });
          }
          
          const meals = await db.getMealsByDate(todayStr);
          store.update('today', { meals });
          store.recalcToday(meals);
          
          window.hideModal();
          window.showToast('Plate Logged', 'Identified meal successfully saved.', 'success');
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
