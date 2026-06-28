/* ============================================================
   FitForge — Workout Planner View
   Manages custom routines and weekly program scheduling
   ============================================================ */

import db from '../db.js';
import store from '../store.js';
import { EXERCISE_DB, searchExercises } from '../data/exerciseDatabase.js';

let storeUnsubscribe = null;
let selectedRoutineId = 1; // Default custom routine ID
const DAYS_OF_WEEK = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export async function render(container) {
  if (storeUnsubscribe) storeUnsubscribe();
  
  storeUnsubscribe = store.on('*', () => {
    if (document.getElementById('planner-view')) {
      renderContent(container);
    }
  });

  // Ensure default custom routine exists in IndexedDB
  const routines = await db.plannerRoutines.toArray();
  if (routines.length === 0) {
    await db.plannerRoutines.add({ 
      id: 1, 
      name: "My Weekly Split",
      dayLabels: {
        monday: 'Chest & Shoulders',
        tuesday: 'Back & Biceps',
        wednesday: 'Rest Day',
        thursday: 'Legs & Core',
        friday: 'Shoulders & Arms',
        saturday: 'Rest Day',
        sunday: 'Rest Day'
      }
    });
  }

  renderContent(container);
}

async function renderContent(container) {
  const routines = await db.plannerRoutines.toArray();
  const currentRoutine = routines.find(r => r.id === selectedRoutineId) || routines[0] || { id: 1, name: "My Weekly Split" };
  
  // Default fallback labels
  const defaultLabels = {
    monday: 'Chest Focus',
    tuesday: 'Back Focus',
    wednesday: 'Rest Day',
    thursday: 'Shoulders Focus',
    friday: 'Arms Focus',
    saturday: 'Legs Focus',
    sunday: 'Rest Day'
  };
  
  const dayLabels = currentRoutine.dayLabels || defaultLabels;

  // Load all exercises for this routine
  const allScheduled = await db.plannerExercises.where({ routineId: currentRoutine.id }).toArray();
  
  // Group by day of week
  const grouped = DAYS_OF_WEEK.reduce((acc, day) => {
    acc[day] = allScheduled.filter(e => e.dayOfWeek === day);
    return acc;
  }, {});

  container.innerHTML = `
    <style>
      .planner-day-focus-badge:hover {
        background: rgba(124, 58, 237, 0.15) !important;
        color: var(--accent) !important;
        border-color: rgba(124, 58, 237, 0.3) !important;
      }
    </style>
    
    <div class="container view" id="planner-view">
      <div class="view-header">
        <div>
          <h1>Workout <span class="text-gradient">Planner</span></h1>
          <div class="subtitle">Design your training week and schedule exercises</div>
        </div>
      </div>

      <!-- Routine selector -->
      <div class="glass-card mb-lg">
        <div class="flex flex-col sm-row justify-between items-center gap-md">
          <div class="flex items-center gap-sm">
            <span style="font-size: 1.5rem;">📅</span>
            <div>
              <div class="font-bold text-sm text-secondary">Active Training Program</div>
              <div class="font-bold text-lg text-gradient" id="active-routine-title">${currentRoutine.name}</div>
            </div>
          </div>
          
          <div class="flex gap-sm">
            <button class="btn btn-secondary btn-sm" id="btn-load-template">Load Preset</button>
            <button class="btn btn-primary btn-sm" id="btn-rename-routine">Rename</button>
          </div>
        </div>
      </div>

      <!-- Weekly Schedule Grid -->
      <div class="planner-week-grid">
        ${DAYS_OF_WEEK.map(day => {
          const exercises = grouped[day] || [];
          const focusStr = dayLabels[day] || 'Rest Day';
          return `
            <div class="planner-day-card" data-day="${day}">
              <div class="planner-day-header" style="display: flex; flex-direction: column; align-items: flex-start; gap: var(--space-2xs); border: none; padding-bottom: var(--space-xs); margin-bottom: var(--space-sm);">
                <div class="flex justify-between items-center w-full">
                  <span class="planner-day-name" style="font-weight: 800; font-size: var(--font-size-md);">${day.substring(0, 3)}</span>
                  <span class="planner-day-label">${exercises.length} lifts</span>
                </div>
                <button class="planner-day-focus-badge" data-day="${day}" style="border: 1px solid var(--border-subtle); background: rgba(255,255,255,0.02); border-radius: var(--radius-sm); color: var(--text-secondary); font-size: 10px; padding: 3px 6px; cursor: pointer; text-align: left; width: 100%; transition: all var(--duration-fast);">
                  🎯 Focus: ${focusStr}
                </button>
              </div>
              
              <div class="planner-day-content">
                ${exercises.length === 0 ? `
                  <div class="text-center py-lg text-xs text-muted flex-grow-1 flex justify-center items-center">Rest Day ⚖️</div>
                ` : `
                  ${exercises.map(item => `
                    <div class="planner-exercise-tag">
                      <div>
                        <div class="font-bold">${item.name}</div>
                        <div class="text-2xs text-muted">${item.sets}x${item.reps} • ${item.equipment}</div>
                      </div>
                      <button class="planner-exercise-delete" data-id="${item.id}" title="Remove exercise">✕</button>
                    </div>
                  `).join('')}
                `}
              </div>
              
              <button class="planner-day-add-btn" data-day="${day}">
                ➕ Add Lift
              </button>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Safety Guideline Card -->
      <div class="glass-card mt-lg" style="border-color: rgba(52, 217, 163, 0.2);">
        <div class="flex gap-md items-start">
          <span style="font-size: 2rem;">💡</span>
          <div>
            <div class="font-bold text-sm text-success mb-2xs">Planner Form Guide</div>
            <p class="text-sm text-secondary" style="line-height: 1.5;">Assign compound movements (squats, bench, deadlifts) at the start of your training days when glycogen stores are high. Schedule at least 1-2 rest days per week to allow muscular recovery and nervous system reset.</p>
          </div>
        </div>
      </div>
    </div>
  `;

  bindEvents(container, currentRoutine);
}

function bindEvents(container, currentRoutine) {
  // Rename Routine
  const renameBtn = document.getElementById('btn-rename-routine');
  if (renameBtn) {
    renameBtn.addEventListener('click', async () => {
      const newName = prompt("Enter new name for your training split:", currentRoutine.name);
      if (newName && newName.trim()) {
        await db.plannerRoutines.update(selectedRoutineId, { name: newName.trim() });
        renderContent(container);
      }
    });
  }

  // Load Preset Program Template
  const templateBtn = document.getElementById('btn-load-template');
  if (templateBtn) {
    templateBtn.addEventListener('click', () => {
      openTemplatePicker(container);
    });
  }

  // Focus Badge Clicks
  container.querySelectorAll('.planner-day-focus-badge').forEach(badge => {
    badge.addEventListener('click', () => {
      const day = badge.getAttribute('data-day');
      openDayFocusModal(container, day, currentRoutine);
    });
  });

  // Add Lift Button clicks
  container.querySelectorAll('.planner-day-add-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const day = btn.getAttribute('data-day');
      openExerciseAddModal(container, day);
    });
  });

  // Delete Lift Button clicks
  container.querySelectorAll('.planner-exercise-delete').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const id = parseInt(btn.getAttribute('data-id'));
      await db.removePlannerExercise(id);
      window.showToast('Lift Removed', 'Exercise removed from plan.', 'info');
      renderContent(container);
    });
  });
}

// Day Focus Selector Modal (Part-wise / Bipart combinations)
function openDayFocusModal(container, day, routine) {
  const commonOptions = [
    // Single Muscle Focus (Part-wise)
    'Chest Focus', 'Back Focus', 'Legs Focus', 'Shoulders Focus', 'Arms Focus', 'Core Focus',
    // Bipart / Combination splits
    'Chest & Shoulders', 'Chest & Triceps', 'Back & Biceps', 'Legs & Core', 'Shoulders & Arms', 
    'Chest & Back', 'Cardio & Abs', 'Push Day', 'Pull Day', 'Full Body Workout', 'Rest Day'
  ];

  const currentFocus = (routine.dayLabels && routine.dayLabels[day]) || 'Rest Day';

  const modalHtml = `
    <div class="flex flex-col gap-md">
      <p class="text-xs text-secondary">Choose a single-part focus or bipart combination split for ${day.toUpperCase()}:</p>
      
      <div class="grid grid-2 gap-xs" style="max-height: 250px; overflow-y: auto; padding: 4px;">
        ${commonOptions.map(opt => `
          <button class="btn btn-secondary btn-xs text-left focus-select-btn ${opt === currentFocus ? 'btn-primary' : ''}" data-value="${opt}">
            ${opt}
          </button>
        `).join('')}
      </div>

      <div class="divider" style="margin: var(--space-xs) 0;"></div>

      <div class="input-group">
        <label for="custom-focus-input" class="text-xs">Custom Combination (e.g. Legs & Shoulders)</label>
        <input type="text" id="custom-focus-input" class="input" placeholder="Type custom split..." value="${commonOptions.includes(currentFocus) ? '' : currentFocus}">
      </div>

      <button class="btn btn-primary btn-block mt-xs" id="btn-save-day-focus">
        Save Split Target
      </button>
    </div>
  `;

  window.showModal(`Configure ${day.toUpperCase()} Focus`, modalHtml);

  // Bind clicks
  let selectedFocus = currentFocus;
  const selectBtns = document.querySelectorAll('.focus-select-btn');
  selectBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      selectBtns.forEach(b => b.classList.remove('btn-primary'));
      btn.classList.add('btn-primary');
      selectedFocus = btn.getAttribute('data-value');
      
      // Clear custom input if clicking preset
      const customInput = document.getElementById('custom-focus-input');
      if (customInput) customInput.value = '';
    });
  });

  const saveBtn = document.getElementById('btn-save-day-focus');
  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      const customInput = document.getElementById('custom-focus-input');
      if (customInput && customInput.value.trim()) {
        selectedFocus = customInput.value.trim();
      }

      if (!routine.dayLabels) routine.dayLabels = {};
      routine.dayLabels[day] = selectedFocus;

      // Update routine in DB
      await db.plannerRoutines.put(routine);
      window.hideModal();
      window.showToast('Day Focus Saved', `Target for ${day} set to ${selectedFocus}`, 'success');
      renderContent(container);
    });
  }
}

// Preset Template Loader Modal
function openTemplatePicker(container) {
  const modalHtml = `
    <div class="flex flex-col gap-md">
      <p class="text-sm text-secondary">Loading a preset split will overwrite your current schedule and day focus labels. Choose from standard gym routines below:</p>
      
      <div class="flex flex-col gap-sm">
        <button class="btn btn-secondary btn-block text-left" id="preset-ppl">
          🔥 Push/Pull/Legs (6-Day Split)
        </button>
        <button class="btn btn-secondary btn-block text-left" id="preset-ul">
          ⚖️ Upper/Lower (4-Day Split)
        </button>
        <button class="btn btn-secondary btn-block text-left" id="preset-fb">
          💪 Full Body (3-Day Split)
        </button>
      </div>
    </div>
  `;

  window.showModal("Select Routine Template", modalHtml);

  // Bind template loader clicks
  const pplBtn = document.getElementById('preset-ppl');
  const ulBtn = document.getElementById('preset-ul');
  const fbBtn = document.getElementById('preset-fb');

  const loadPreset = async (presetName, exercisesList, dayLabelsPreset) => {
    if (!confirm(`Are you sure you want to load the ${presetName} template? This will clear your current scheduled lifts.`)) return;
    
    // Clear existing routine exercises
    await db.plannerExercises.where({ routineId: selectedRoutineId }).delete();
    
    // Insert new preset exercises
    for (const item of exercisesList) {
      await db.addPlannerExercise(selectedRoutineId, item.day, {
        name: item.name,
        sets: item.sets,
        reps: item.reps,
        equipment: item.equipment
      });
    }

    await db.plannerRoutines.put({
      id: selectedRoutineId,
      name: presetName,
      dayLabels: dayLabelsPreset
    });
    window.hideModal();
    window.showToast('Template Loaded', `${presetName} routine generated!`, 'success');
    renderContent(container);
  };

  if (pplBtn) {
    pplBtn.addEventListener('click', () => {
      loadPreset("Push / Pull / Legs", [
        { day: 'monday', name: 'Barbell Bench Press', sets: 4, reps: 8, equipment: 'barbell' },
        { day: 'monday', name: 'Standing Barbell Overhead Press', sets: 3, reps: 10, equipment: 'barbell' },
        { day: 'monday', name: 'Triceps Cable Pushdown', sets: 3, reps: 12, equipment: 'cable' },
        { day: 'tuesday', name: 'Conventional Barbell Deadlift', sets: 3, reps: 5, equipment: 'barbell' },
        { day: 'tuesday', name: 'Pullup', sets: 3, reps: 8, equipment: 'bodyweight' },
        { day: 'tuesday', name: 'Barbell Bicep Curl', sets: 3, reps: 10, equipment: 'barbell' },
        { day: 'wednesday', name: 'Barbell Back Squat', sets: 4, reps: 8, equipment: 'barbell' },
        { day: 'wednesday', name: 'Lying Leg Curl', sets: 3, reps: 12, equipment: 'machine' },
        { day: 'thursday', name: 'Incline Dumbbell Bench Press', sets: 4, reps: 10, equipment: 'dumbbell' },
        { day: 'thursday', name: 'Dumbbell Lateral Raise', sets: 4, reps: 12, equipment: 'dumbbell' },
        { day: 'friday', name: 'Bent-Over Barbell Row', sets: 4, reps: 8, equipment: 'barbell' },
        { day: 'friday', name: 'Dumbbell Hammer Curl', sets: 3, reps: 10, equipment: 'dumbbell' },
        { day: 'saturday', name: 'Barbell Romanian Deadlift', sets: 3, reps: 10, equipment: 'barbell' },
        { day: 'saturday', name: 'Standing Calf Raise', sets: 3, reps: 15, equipment: 'machine' }
      ], {
        monday: 'Chest & Shoulders (Push)',
        tuesday: 'Back & Biceps (Pull)',
        wednesday: 'Legs Focus',
        thursday: 'Chest & Shoulders (Push)',
        friday: 'Back & Biceps (Pull)',
        saturday: 'Legs & Calves',
        sunday: 'Rest Day'
      });
    });
  }

  if (ulBtn) {
    ulBtn.addEventListener('click', () => {
      loadPreset("Upper / Lower Split", [
        { day: 'monday', name: 'Barbell Bench Press', sets: 4, reps: 8, equipment: 'barbell' },
        { day: 'monday', name: 'Bent-Over Barbell Row', sets: 4, reps: 8, equipment: 'barbell' },
        { day: 'monday', name: 'Standing Barbell Overhead Press', sets: 3, reps: 10, equipment: 'barbell' },
        { day: 'tuesday', name: 'Barbell Back Squat', sets: 4, reps: 8, equipment: 'barbell' },
        { day: 'tuesday', name: 'Barbell Romanian Deadlift', sets: 3, reps: 10, equipment: 'barbell' },
        { day: 'tuesday', name: 'Plank', sets: 3, reps: 60, equipment: 'none' },
        { day: 'thursday', name: 'Incline Dumbbell Bench Press', sets: 4, reps: 10, equipment: 'dumbbell' },
        { day: 'thursday', name: 'Pullup', sets: 3, reps: 8, equipment: 'bodyweight' },
        { day: 'thursday', name: 'Dumbbell Lateral Raise', sets: 3, reps: 12, equipment: 'dumbbell' },
        { day: 'friday', name: 'Barbell Back Squat', sets: 3, reps: 10, equipment: 'barbell' },
        { day: 'friday', name: 'Lying Leg Curl', sets: 3, reps: 12, equipment: 'machine' },
        { day: 'friday', name: 'Standing Calf Raise', sets: 3, reps: 15, equipment: 'machine' }
      ], {
        monday: 'Upper Body Focus',
        tuesday: 'Lower Body Focus',
        wednesday: 'Rest Day',
        thursday: 'Upper Body Focus',
        friday: 'Lower Body Focus',
        saturday: 'Rest Day',
        sunday: 'Rest Day'
      });
    });
  }

  if (fbBtn) {
    fbBtn.addEventListener('click', () => {
      loadPreset("Full Body Routine", [
        { day: 'monday', name: 'Barbell Back Squat', sets: 3, reps: 8, equipment: 'barbell' },
        { day: 'monday', name: 'Barbell Bench Press', sets: 3, reps: 8, equipment: 'barbell' },
        { day: 'monday', name: 'Bent-Over Barbell Row', sets: 3, reps: 8, equipment: 'barbell' },
        { day: 'wednesday', name: 'Conventional Barbell Deadlift', sets: 3, reps: 5, equipment: 'barbell' },
        { day: 'wednesday', name: 'Cable Lat Pulldown', sets: 3, reps: 10, equipment: 'cable' },
        { day: 'wednesday', name: 'Dumbbell Lateral Raise', sets: 3, reps: 12, equipment: 'dumbbell' },
        { day: 'friday', name: 'Barbell Back Squat', sets: 3, reps: 10, equipment: 'barbell' },
        { day: 'friday', name: 'Incline Dumbbell Bench Press', sets: 3, reps: 10, equipment: 'dumbbell' },
        { day: 'friday', name: 'Pullup', sets: 3, reps: 8, equipment: 'bodyweight' }
      ], {
        monday: 'Full Body Workout',
        tuesday: 'Rest Day',
        wednesday: 'Full Body Workout',
        thursday: 'Rest Day',
        friday: 'Full Body Workout',
        saturday: 'Rest Day',
        sunday: 'Rest Day'
      });
    });
  }
}

// Add Lift Modal Handler
function openExerciseAddModal(container, day) {
  const modalHtml = `
    <div class="flex flex-col gap-md food-search-container">
      <div class="input-icon-wrapper">
        <input type="text" id="exercise-search-query" class="input" placeholder="Search exercises..." autofocus>
        <span class="input-icon">🔍</span>
      </div>
      
      <div class="food-search-results" id="modal-exercise-results" style="max-height: 200px; overflow-y: auto;">
        <p class="text-xs text-muted text-center py-md">Type above to search exercises...</p>
      </div>
      
      <!-- Sets and Reps config -->
      <div class="glass-card hidden" id="modal-sets-editor">
        <div class="font-bold text-sm mb-sm" id="editor-ex-name">Selected Exercise</div>
        
        <div class="flex gap-md mb-sm">
          <div class="flex-1">
            <label for="editor-sets" class="text-xs text-secondary">Sets</label>
            <input type="number" id="editor-sets" class="input" min="1" max="10" value="3">
          </div>
          <div class="flex-1">
            <label for="editor-reps" class="text-xs text-secondary">Reps</label>
            <input type="number" id="editor-reps" class="input" min="1" max="100" value="10">
          </div>
        </div>
        
        <button class="btn btn-primary btn-block" id="modal-save-ex-btn">
          Schedule for ${day.substring(0, 3).toUpperCase()}
        </button>
      </div>
    </div>
  `;

  window.showModal(`Add Lift to ${day.toUpperCase()}`, modalHtml);

  // Setup search filter logic inside the modal
  const searchInput = document.getElementById('exercise-search-query');
  const resultsContainer = document.getElementById('modal-exercise-results');
  const setsEditor = document.getElementById('modal-sets-editor');
  const editorExName = document.getElementById('editor-ex-name');
  const setsInput = document.getElementById('editor-sets');
  const repsInput = document.getElementById('editor-reps');
  const saveBtn = document.getElementById('modal-save-ex-btn');
  
  let selectedEx = null;

  if (searchInput && resultsContainer) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase().trim();
      if (!query) {
        resultsContainer.innerHTML = `<p class="text-xs text-muted text-center py-md">Type above to search exercises...</p>`;
        return;
      }
      
      const filtered = searchExercises(query);
      
      if (filtered.length === 0) {
        resultsContainer.innerHTML = `<p class="text-xs text-muted text-center py-md">No exercises found.</p>`;
        return;
      }
      
      resultsContainer.innerHTML = filtered.map(ex => `
        <div class="food-result-item" data-ex-id="${ex.id}">
          <div>
            <div class="food-name">${ex.name}</div>
            <div class="food-portion" style="text-transform: capitalize;">${ex.muscle} • ${ex.equipment}</div>
          </div>
        </div>
      `).join('');
      
      // Result click listener
      document.querySelectorAll('.food-result-item').forEach(item => {
        item.addEventListener('click', () => {
          const exId = item.getAttribute('data-ex-id');
          selectedEx = EXERCISE_DB.find(e => e.id === exId);
          
          if (selectedEx) {
            editorExName.textContent = selectedEx.name;
            setsEditor.classList.remove('hidden');
          }
        });
      });
    });
  }

  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      if (selectedEx) {
        const setsVal = parseInt(setsInput.value) || 3;
        const repsVal = parseInt(repsInput.value) || 10;
        
        await db.addPlannerExercise(selectedRoutineId, day, {
          name: selectedEx.name,
          sets: setsVal,
          reps: repsVal,
          equipment: selectedEx.equipment
        });
        
        window.hideModal();
        window.showToast('Lift Scheduled', `${selectedEx.name} added to ${day}.`, 'success');
        renderContent(container);
      }
    });
  }
}

export function cleanup() {
  if (storeUnsubscribe) {
    storeUnsubscribe();
    storeUnsubscribe = null;
  }
}
