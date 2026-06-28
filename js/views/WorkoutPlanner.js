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
    await db.plannerRoutines.add({ id: 1, name: "My Weekly Split" });
  }

  renderContent(container);
}

async function renderContent(container) {
  const routines = await db.plannerRoutines.toArray();
  const currentRoutine = routines.find(r => r.id === selectedRoutineId) || routines[0] || { id: 1, name: "My Weekly Split" };
  
  // Load all exercises for this routine
  const allScheduled = await db.plannerExercises.where({ routineId: currentRoutine.id }).toArray();
  
  // Group by day of week
  const grouped = DAYS_OF_WEEK.reduce((acc, day) => {
    acc[day] = allScheduled.filter(e => e.dayOfWeek === day);
    return acc;
  }, {});

  container.innerHTML = `
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
          return `
            <div class="planner-day-card" data-day="${day}">
              <div class="planner-day-header">
                <span class="planner-day-name">${day.substring(0, 3)}</span>
                <span class="planner-day-label">${exercises.length} lifts</span>
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

  bindEvents(container);
}

function bindEvents(container) {
  // Rename Routine
  const renameBtn = document.getElementById('btn-rename-routine');
  if (renameBtn) {
    renameBtn.addEventListener('click', async () => {
      const newName = prompt("Enter new name for your training split:", "My Weekly Split");
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

// Preset Template Loader Modal
function openTemplatePicker(container) {
  const modalHtml = `
    <div class="flex flex-col gap-md">
      <p class="text-sm text-secondary">Loading a preset split will overwrite your current schedule. Choose from standard gym routines below:</p>
      
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

  const loadPreset = async (presetName, exercisesList) => {
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

    await db.plannerRoutines.update(selectedRoutineId, { name: presetName });
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
      ]);
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
      ]);
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
      ]);
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
