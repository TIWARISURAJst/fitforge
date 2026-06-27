/* ============================================================
   FitForge — Workout Logger View
   Logs active workouts, templates selection, sets progression, and rest timer
   ============================================================ */

import db from '../db.js';
import store from '../store.js';

let storeUnsubscribe = null;
let workoutTimerInterval = null;
let activeSession = null; // { templateName, startTime, durationSec, exercises: [...] }

// Pre-seeded exercise directory
const EXERCISE_DIRECTORY = [
  { id: 'bench-press', name: 'Barbell Bench Press', muscle: 'Chest' },
  { id: 'incline-db-press', name: 'Incline Dumbbell Press', muscle: 'Chest' },
  { id: 'overhead-press', name: 'Overhead Barbell Press', muscle: 'Shoulders' },
  { id: 'lateral-raise', name: 'Dumbbell Lateral Raise', muscle: 'Shoulders' },
  { id: 'squat', name: 'Barbell Squat', muscle: 'Legs (Quads)' },
  { id: 'deadlift', name: 'Barbell Deadlift', muscle: 'Legs/Back' },
  { id: 'lunge', name: 'Dumbbell Walking Lunge', muscle: 'Legs' },
  { id: 'lat-pulldown', name: 'Lat Pulldown', muscle: 'Back' },
  { id: 'cable-row', name: 'Seated Cable Row', muscle: 'Back' },
  { id: 'bicep-curl', name: 'Dumbbell Bicep Curl', muscle: 'Biceps' },
  { id: 'tricep-pushdown', name: 'Cable Tricep Pushdown', muscle: 'Triceps' },
  { id: 'leg-curl', name: 'Lying Leg Curl', muscle: 'Legs (Hamstrings)' },
];

// Pre-defined templates
const TEMPLATES = [
  {
    id: 'push',
    name: 'Push Routine',
    emoji: '🔥',
    desc: 'Chest, Shoulders & Triceps',
    exercises: [
      { id: 'bench-press', name: 'Barbell Bench Press', muscle: 'Chest', sets: [{ weight: 60, reps: 8, done: false }, { weight: 60, reps: 8, done: false }, { weight: 60, reps: 8, done: false }] },
      { id: 'overhead-press', name: 'Overhead Barbell Press', muscle: 'Shoulders', sets: [{ weight: 40, reps: 8, done: false }, { weight: 40, reps: 8, done: false }] },
      { id: 'tricep-pushdown', name: 'Cable Tricep Pushdown', muscle: 'Triceps', sets: [{ weight: 25, reps: 12, done: false }, { weight: 25, reps: 10, done: false }] }
    ]
  },
  {
    id: 'pull',
    name: 'Pull Routine',
    emoji: '💪',
    desc: 'Back, Rear Delts & Biceps',
    exercises: [
      { id: 'deadlift', name: 'Barbell Deadlift', muscle: 'Legs/Back', sets: [{ weight: 100, reps: 5, done: false }, { weight: 100, reps: 5, done: false }] },
      { id: 'lat-pulldown', name: 'Lat Pulldown', muscle: 'Back', sets: [{ weight: 55, reps: 10, done: false }, { weight: 55, reps: 10, done: false }, { weight: 55, reps: 8, done: false }] },
      { id: 'bicep-curl', name: 'Dumbbell Bicep Curl', muscle: 'Biceps', sets: [{ weight: 12.5, reps: 12, done: false }, { weight: 12.5, reps: 12, done: false }] }
    ]
  },
  {
    id: 'legs',
    name: 'Legs Routine',
    emoji: '🦵',
    desc: 'Quads, Hamstrings & Calves',
    exercises: [
      { id: 'squat', name: 'Barbell Squat', muscle: 'Legs (Quads)', sets: [{ weight: 80, reps: 8, done: false }, { weight: 80, reps: 8, done: false }, { weight: 80, reps: 8, done: false }] },
      { id: 'leg-curl', name: 'Lying Leg Curl', muscle: 'Legs (Hamstrings)', sets: [{ weight: 35, reps: 12, done: false }, { weight: 35, reps: 10, done: false }] },
      { id: 'lunge', name: 'Dumbbell Walking Lunge', muscle: 'Legs', sets: [{ weight: 15, reps: 10, done: false }, { weight: 15, reps: 10, done: false }] }
    ]
  }
];

export async function render(container) {
  if (storeUnsubscribe) storeUnsubscribe();
  storeUnsubscribe = store.on('*', () => {
    if (document.getElementById('workout-view')) {
      renderContent(container);
    }
  });

  renderContent(container);
}

function renderContent(container) {
  // If there's an active session, render the active logging view
  if (activeSession) {
    renderActiveSession(container);
    return;
  }
  
  // Render template selection and history list
  container.innerHTML = `
    <div class="container view" id="workout-view">
      <div class="view-header">
        <div>
          <h1>Workout <span class="text-gradient">Logger</span></h1>
          <div class="subtitle">Select a routine template or log a custom session</div>
        </div>
      </div>
      
      <!-- Templates grid -->
      <div class="glass-card mb-lg">
        <div class="card-header">
          <div class="card-title">Training Templates</div>
        </div>
        
        <div class="template-grid">
          ${TEMPLATES.map(t => `
            <div class="template-card" data-template-id="${t.id}">
              <div class="template-icon">${t.emoji}</div>
              <div class="template-name">${t.name}</div>
              <div class="template-desc">${t.desc}</div>
            </div>
          `).join('')}
          
          <div class="template-card" id="start-custom-workout" style="border-style: dashed;">
            <div class="template-icon">➕</div>
            <div class="template-name">Custom Session</div>
            <div class="template-desc">Build your training on the fly</div>
          </div>
        </div>
      </div>
      
      <!-- Workout History Logs -->
      <div class="glass-card">
        <div class="card-header">
          <div class="card-title">Workout History</div>
        </div>
        
        <div id="workout-history-list" class="flex flex-col gap-sm">
          <p class="text-xs text-muted text-center py-md">Loading exercise history...</p>
        </div>
      </div>
      
    </div>
  `;
  
  loadWorkoutHistory();
  bindSelectionEvents(container);
}

async function loadWorkoutHistory() {
  const historyList = document.getElementById('workout-history-list');
  if (!historyList) return;
  
  try {
    const workouts = await db.workouts.orderBy('date').reverse().limit(5).toArray();
    
    if (workouts.length === 0) {
      historyList.innerHTML = `<p class="text-xs text-muted text-center py-md">No workouts logged yet. Smash your first workout above!</p>`;
      return;
    }
    
    historyList.innerHTML = workouts.map(w => `
      <div class="glass-card card-sm" style="background: var(--bg-deepest); margin-bottom: 2px;">
        <div class="flex justify-between items-center">
          <div>
            <div class="font-bold text-sm text-accent">${w.templateName}</div>
            <div class="text-xs text-muted">${w.date} • ${w.duration || 45} mins logged • Feel: ${w.rpe || 7}/10 RPE</div>
          </div>
          <span class="badge ${w.status === 'completed' ? 'badge-success' : 'badge-warning'}">
            ${w.status === 'completed' ? 'Completed' : 'Draft'}
          </span>
        </div>
      </div>
    `).join('');
    
  } catch (error) {
    console.error('[WorkoutHistory] Error fetching history:', error);
    historyList.innerHTML = `<p class="text-xs text-danger text-center py-md">Could not fetch history.</p>`;
  }
}

function bindSelectionEvents(container) {
  // Start preset template
  document.querySelectorAll('.template-card[data-template-id]').forEach(card => {
    card.addEventListener('click', () => {
      const templateId = card.getAttribute('data-template-id');
      const template = TEMPLATES.find(t => t.id === templateId);
      if (template) {
        startWorkoutSession(container, template.name, JSON.parse(JSON.stringify(template.exercises)));
      }
    });
  });

  // Start custom workout
  const customBtn = document.getElementById('start-custom-workout');
  if (customBtn) {
    customBtn.addEventListener('click', () => {
      startWorkoutSession(container, 'Custom Session', []);
    });
  }
}

function startWorkoutSession(container, name, exercises) {
  activeSession = {
    templateName: name,
    startTime: Date.now(),
    durationSec: 0,
    exercises: exercises
  };
  
  // Update state in store
  store.update('today', {
    workout: {
      templateName: name,
      status: 'active'
    }
  });

  // Start stopwatch
  workoutTimerInterval = setInterval(() => {
    if (activeSession) {
      activeSession.durationSec++;
      const timerEl = document.getElementById('workout-duration-timer');
      if (timerEl) {
        timerEl.textContent = formatDuration(activeSession.durationSec);
      }
    }
  }, 1000);
  
  renderActiveSession(container);
  window.showToast('Workout Started', `Active session: "${name}"`, 'success');
}

function formatDuration(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function renderActiveSession(container) {
  container.innerHTML = `
    <div class="container view" id="active-workout-view">
      
      <!-- Timer bar -->
      <div class="workout-status-bar flex justify-between items-center">
        <div>
          <div class="workout-timer-label">ACTIVE WORKOUT</div>
          <div class="font-bold text-sm text-accent">${activeSession.templateName}</div>
        </div>
        <div class="text-right">
          <div class="workout-timer-label">DURATION</div>
          <div class="workout-timer" id="workout-duration-timer">${formatDuration(activeSession.durationSec)}</div>
        </div>
      </div>
      
      <!-- Exercises logs -->
      <div id="active-exercises-list" class="flex flex-col gap-md mb-xl">
        ${activeSession.exercises.length === 0 ? `
          <div class="glass-card text-center py-xl">
            <p class="text-sm text-secondary mb-md">No exercises added to this workout yet.</p>
            <button class="btn btn-secondary btn-sm" id="active-add-ex-prompt">
              ➕ Add First Exercise
            </button>
          </div>
        ` : activeSession.exercises.map((ex, exIdx) => `
          <div class="glass-card exercise-card" data-ex-idx="${exIdx}">
            <div class="exercise-card-header">
              <div>
                <span class="exercise-name">${ex.name}</span>
                <span class="exercise-muscle badge badge-accent" style="margin-left: var(--space-xs); font-size: 0.65rem;">${ex.muscle}</span>
              </div>
              <button class="btn btn-ghost btn-sm text-danger remove-ex-btn" data-ex-idx="${exIdx}">Remove</button>
            </div>
            
            <table class="sets-table">
              <thead>
                <tr>
                  <th>Set</th>
                  <th>Weight (kg)</th>
                  <th>Reps</th>
                  <th>Done</th>
                </tr>
              </thead>
              <tbody>
                ${ex.sets.map((set, setIdx) => `
                  <tr class="set-row">
                    <td><span class="set-num">${setIdx + 1}</span></td>
                    <td>
                      <input type="number" class="set-input set-weight" data-ex-idx="${exIdx}" data-set-idx="${setIdx}" value="${set.weight}" min="0">
                    </td>
                    <td>
                      <input type="number" class="set-input set-reps" data-ex-idx="${exIdx}" data-set-idx="${setIdx}" value="${set.reps}" min="0">
                    </td>
                    <td>
                      <button class="set-check ${set.done ? 'checked' : ''}" data-ex-idx="${exIdx}" data-set-idx="${setIdx}">
                        ${set.done ? '✓' : ''}
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <button class="add-food-btn add-set-btn" data-ex-idx="${exIdx}" style="border-style: dashed; padding: var(--space-xs); font-size: var(--font-xs);">
              ➕ Add Set
            </button>
          </div>
        `).join('')}
      </div>
      
      <!-- Actions panel -->
      <div class="flex gap-md mb-lg">
        <button class="btn btn-secondary" style="flex: 1;" id="active-add-ex-btn">
          ➕ Add Exercise
        </button>
        <button class="btn btn-primary" style="flex: 1.5;" id="active-finish-btn">
          💪 Finish Session
        </button>
      </div>
      
      <button class="btn btn-ghost btn-block text-danger font-semibold" id="active-cancel-btn">
        Cancel Workout
      </button>

      <!-- Rest Timer Overlay (injected dynamically when checked) -->
      <div class="rest-timer-overlay hidden" id="rest-timer-overlay">
        <div class="rest-timer-circle glass-card" style="border-color: var(--accent); border-radius: var(--radius-full); box-shadow: 0 0 30px var(--accent-glow);">
          <div class="rest-timer-value text-gradient" id="rest-timer-countdown">60s</div>
        </div>
        <div class="font-bold text-lg text-center">Take a Rest! 💧</div>
        <button class="btn btn-secondary btn-sm" id="skip-rest-btn">Skip Rest</button>
      </div>

    </div>
  `;
  
  bindActiveSessionEvents(container);
}

function bindActiveSessionEvents(container) {
  // Input fields changes
  document.querySelectorAll('.set-weight').forEach(input => {
    input.addEventListener('change', () => {
      const exIdx = parseInt(input.getAttribute('data-ex-idx'));
      const setIdx = parseInt(input.getAttribute('data-set-idx'));
      const value = parseFloat(input.value) || 0;
      activeSession.exercises[exIdx].sets[setIdx].weight = value;
    });
  });
  
  document.querySelectorAll('.set-reps').forEach(input => {
    input.addEventListener('change', () => {
      const exIdx = parseInt(input.getAttribute('data-ex-idx'));
      const setIdx = parseInt(input.getAttribute('data-set-idx'));
      const value = parseInt(input.value) || 0;
      activeSession.exercises[exIdx].sets[setIdx].reps = value;
    });
  });

  // Adding sets
  document.querySelectorAll('.add-set-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const exIdx = parseInt(btn.getAttribute('data-ex-idx'));
      const ex = activeSession.exercises[exIdx];
      const lastSet = ex.sets[ex.sets.length - 1] || { weight: 50, reps: 10 };
      
      ex.sets.push({
        weight: lastSet.weight,
        reps: lastSet.reps,
        done: false
      });
      
      renderActiveSession(container);
    });
  });

  // Toggling set completed check
  document.querySelectorAll('.set-check').forEach(btn => {
    btn.addEventListener('click', () => {
      const exIdx = parseInt(btn.getAttribute('data-ex-idx'));
      const setIdx = parseInt(btn.getAttribute('data-set-idx'));
      const set = activeSession.exercises[exIdx].sets[setIdx];
      
      set.done = !set.done;
      
      // If completed, trigger rest timer
      if (set.done) {
        triggerRestTimer(90); // 90 seconds default rest
      }
      
      renderActiveSession(container);
    });
  });

  // Removing exercise
  document.querySelectorAll('.remove-ex-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const exIdx = parseInt(btn.getAttribute('data-ex-idx'));
      activeSession.exercises.splice(exIdx, 1);
      renderActiveSession(container);
    });
  });

  // Prompt adding exercise
  const addExPromptBtn = document.getElementById('active-add-ex-prompt');
  const addExBtn = document.getElementById('active-add-ex-btn');
  if (addExPromptBtn) addExPromptBtn.addEventListener('click', () => openAddExerciseModal(container));
  if (addExBtn) addExBtn.addEventListener('click', () => openAddExerciseModal(container));

  // Cancel workout
  const cancelBtn = document.getElementById('active-cancel-btn');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to discard this workout? Progress will not be saved.')) {
        discardWorkout();
        renderContent(container);
      }
    });
  }

  // Finish Workout
  const finishBtn = document.getElementById('active-finish-btn');
  if (finishBtn) {
    finishBtn.addEventListener('click', () => {
      openFinishWorkoutModal(container);
    });
  }
}

// Add Exercise Modal Dialog
function openAddExerciseModal(container) {
  const modalHtml = `
    <div class="flex flex-col gap-md food-search-container">
      <div class="input-icon-wrapper">
        <input type="text" id="ex-search-query" class="input" placeholder="Search exercises..." autofocus>
        <span class="input-icon">🔍</span>
      </div>
      
      <div class="food-search-results" id="modal-ex-results" style="max-height: 250px;">
        <!-- Exercise list injected here -->
      </div>
    </div>
  `;

  window.showModal('Add Exercise', modalHtml);

  const searchInput = document.getElementById('ex-search-query');
  const resultsContainer = document.getElementById('modal-ex-results');

  const renderExList = (query = '') => {
    const filtered = EXERCISE_DIRECTORY.filter(ex => 
      ex.name.toLowerCase().includes(query) || ex.muscle.toLowerCase().includes(query)
    );
    
    if (filtered.length === 0) {
      resultsContainer.innerHTML = `<p class="text-xs text-muted text-center py-md">No matching exercises found.</p>`;
      return;
    }
    
    resultsContainer.innerHTML = filtered.map(ex => `
      <div class="food-result-item" data-ex-id="${ex.id}">
        <div>
          <div class="food-name">${ex.name}</div>
          <div class="food-portion" style="color: var(--accent); font-weight: 500;">${ex.muscle}</div>
        </div>
        <span class="badge badge-accent">➕ Add</span>
      </div>
    `).join('');
    
    // Bind click
    document.querySelectorAll('.food-result-item[data-ex-id]').forEach(item => {
      item.addEventListener('click', () => {
        const exId = item.getAttribute('data-ex-id');
        const exItem = EXERCISE_DIRECTORY.find(e => e.id === exId);
        if (exItem) {
          activeSession.exercises.push({
            id: exItem.id,
            name: exItem.name,
            muscle: exItem.muscle,
            sets: [{ weight: 40, reps: 10, done: false }]
          });
          
          window.hideModal();
          renderActiveSession(container);
          window.showToast('Exercise Added', `${exItem.name} inserted.`, 'info');
        }
      });
    });
  };

  renderExList();

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      renderExList(searchInput.value.toLowerCase().trim());
    });
  }
}

// Finish Workout Dialog
function openFinishWorkoutModal(container) {
  // Check if there are completed sets
  let totalSetsCount = 0;
  let completedSetsCount = 0;
  let volume = 0;
  
  activeSession.exercises.forEach(ex => {
    ex.sets.forEach(s => {
      totalSetsCount++;
      if (s.done) {
        completedSetsCount++;
        volume += s.weight * s.reps;
      }
    });
  });

  if (completedSetsCount === 0) {
    window.showToast('Log sets first', 'Please complete at least one set before finishing.', 'danger');
    return;
  }

  const modalHtml = `
    <div class="flex flex-col gap-md" style="text-align: left;">
      <div class="glass-card card-accent text-center bg-success-glow" style="border-color: var(--success); padding: var(--space-sm);">
        <span style="font-size: 2rem;">🏆</span>
        <div class="font-bold text-md text-success">Training Completed!</div>
        <div class="text-xs text-muted">Completed ${completedSetsCount} sets out of ${totalSetsCount}</div>
      </div>
      
      <div class="stats-grid">
        <div class="stat-card glass-card card-sm">
          <span class="stat-label">TOTAL VOLUME</span>
          <span class="stat-value text-gradient">${volume} kg</span>
        </div>
        <div class="stat-card glass-card card-sm">
          <span class="stat-label">DURATION</span>
          <span class="stat-value text-accent">${Math.round(activeSession.durationSec / 60)}m</span>
        </div>
      </div>
      
      <div class="input-group">
        <label for="finish-rpe">RPE Intensity (1-10)</label>
        <input type="range" id="finish-rpe" min="1" max="10" value="7">
        <div class="flex justify-between text-xs font-semibold text-accent mt-xs">
          <span>1 (Warmup)</span>
          <span id="finish-rpe-val" class="font-bold text-gradient">7 / 10 RPE</span>
          <span>10 (Max Limit)</span>
        </div>
        <div class="text-xs text-muted text-center" id="rpe-desc-val" style="margin-top: 4px;">Solid effort (3 reps left in reserve) 👍</div>
      </div>

      <div class="glass-card mb-sm" style="padding: var(--space-sm); border-color: var(--border-accent);">
        <span class="badge badge-accent mb-xs" style="font-size: 0.65rem;">Progressive Overload Coach Tip</span>
        <p class="text-xs text-secondary" style="line-height: 1.4;">Excellent work. To force muscle adaptation in your next session, attempt to add 2.5 kg on your compound lifts (like Bench Press or Squat) or execute 1-2 more reps per set with this same weight.</p>
      </div>
      
      <button class="btn btn-primary btn-block" id="modal-complete-save-btn">
        Save Workout & Log Recovery
      </button>
    </div>
  `;

  window.showModal('Complete Workout', modalHtml);

  const rpeSlider = document.getElementById('finish-rpe');
  const rpeLabel = document.getElementById('finish-rpe-val');
  const rpeDesc = document.getElementById('rpe-desc-val');
  const saveBtn = document.getElementById('modal-complete-save-btn');
  
  if (rpeSlider && rpeLabel) {
    rpeSlider.addEventListener('input', () => {
      const val = parseInt(rpeSlider.value);
      rpeLabel.textContent = `${val} / 10 RPE`;
      if (rpeDesc) {
        rpeDesc.textContent = getRPEDescription(val);
      }
    });
  }
  
  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      const rpe = parseInt(rpeSlider.value) || 7;
      const durationMin = Math.round(activeSession.durationSec / 60) || 1;
      const todayStr = new Date().toISOString().split('T')[0];
      
      store.state.isLoading = true;
      
      try {
        // Save workout session
        const workoutId = await db.workouts.add({
          date: todayStr,
          templateName: activeSession.templateName,
          duration: durationMin,
          rpe: rpe,
          volume: volume,
          status: 'completed',
          createdAt: new Date().toISOString()
        });
        
        // Save exercise sets details
        for (const ex of activeSession.exercises) {
          for (const set of ex.sets) {
            if (set.done) {
              await db.exerciseSets.add({
                workoutId: workoutId,
                exerciseId: ex.id,
                exerciseName: ex.name,
                weight: set.weight,
                reps: set.reps,
                createdAt: new Date().toISOString()
              });
            }
          }
        }
        
        // Add to achievements if volume is high
        if (volume > 1000) {
          await db.achievements.add({
            type: 'PR Volume hit',
            title: `Hit ${volume}kg lift volume on ${activeSession.templateName}`,
            date: todayStr,
            createdAt: new Date().toISOString()
          });
        }
        
        // Clear active session
        discardWorkout();
        
        // Reload today's workouts and update store
        const workouts = await db.getWorkoutsByDate(todayStr);
        const streak = await db.getStreak();
        store.batch(() => {
          store.state.streak = streak;
          store.update('today', {
            workout: workouts.length > 0 ? workouts[0] : null
          });
        });
        
        window.hideModal();
        window.showToast('Workout Saved!', `Logged ${volume}kg of total training volume!`, 'success');
        
        // Return to selection dashboard
        renderContent(container);
        
      } catch (error) {
        console.error('[WorkoutLogger] Save failed:', error);
        window.showToast('Error saving', 'Check console logs.', 'danger');
      } finally {
        store.state.isLoading = false;
      }
    });
  }
}

// Rest Timer Overlay Handler
let restTimerSeconds = 0;
let restTimerInterval = null;

function triggerRestTimer(seconds) {
  const overlay = document.getElementById('rest-timer-overlay');
  const countdown = document.getElementById('rest-timer-countdown');
  const skipBtn = document.getElementById('skip-rest-btn');
  
  if (!overlay || !countdown) return;
  
  restTimerSeconds = seconds;
  countdown.textContent = `${restTimerSeconds}s`;
  overlay.classList.remove('hidden');
  
  // Clear any existing interval
  if (restTimerInterval) clearInterval(restTimerInterval);
  
  restTimerInterval = setInterval(() => {
    restTimerSeconds--;
    countdown.textContent = `${restTimerSeconds}s`;
    
    if (restTimerSeconds <= 0) {
      closeRestTimer();
    }
  }, 1000);
  
  if (skipBtn) {
    skipBtn.onclick = closeRestTimer;
  }
}

function closeRestTimer() {
  if (restTimerInterval) {
    clearInterval(restTimerInterval);
    restTimerInterval = null;
  }
  const overlay = document.getElementById('rest-timer-overlay');
  if (overlay) overlay.classList.add('hidden');
}

function discardWorkout() {
  if (workoutTimerInterval) {
    clearInterval(workoutTimerInterval);
    workoutTimerInterval = null;
  }
  closeRestTimer();
  activeSession = null;
  
  // Clear active workout from store
  store.update('today', {
    workout: null
  });
}

function getRPEDescription(val) {
  if (val === 10) return 'Absolute failure (0 reps left in reserve) 🥵';
  if (val === 9) return 'Very hard effort (1 rep left in reserve) 🔥';
  if (val === 8) return 'Challenging effort (2 reps left in reserve) 💪';
  if (val === 7) return 'Solid effort (3 reps left in reserve) 👍';
  if (val === 6) return 'Moderate load (4 reps left in reserve) 🙂';
  if (val === 5) return 'Submaximal load (5 reps left in reserve) 👌';
  return 'Light warmup or active recovery level 🌱';
}

export function cleanup() {
  if (storeUnsubscribe) {
    storeUnsubscribe();
    storeUnsubscribe = null;
  }
  if (workoutTimerInterval) {
    clearInterval(workoutTimerInterval);
    workoutTimerInterval = null;
  }
  if (restTimerInterval) {
    clearInterval(restTimerInterval);
    restTimerInterval = null;
  }
}
