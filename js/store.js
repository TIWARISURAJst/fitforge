/* ============================================================
   FitForge — Reactive State Store
   Proxy-based state management with pub/sub notifications
   ============================================================ */

const listeners = new Map();
let batchDepth = 0;
let pendingNotifications = new Set();

function createReactiveState(initialState) {
  return new Proxy(initialState, {
    set(target, key, value) {
      const oldValue = target[key];
      target[key] = value;

      if (oldValue !== value) {
        if (batchDepth > 0) {
          pendingNotifications.add(key);
        } else {
          notifyListeners(key, value, oldValue);
        }
      }
      return true;
    },
    get(target, key) {
      return target[key];
    }
  });
}

function notifyListeners(key, newValue, oldValue) {
  // Notify specific key listeners
  if (listeners.has(key)) {
    listeners.get(key).forEach(fn => {
      try { fn(newValue, oldValue, key); }
      catch (e) { console.error(`[Store] Listener error for "${key}":`, e); }
    });
  }
  // Notify wildcard listeners
  if (listeners.has('*')) {
    listeners.get('*').forEach(fn => {
      try { fn(newValue, oldValue, key); }
      catch (e) { console.error('[Store] Wildcard listener error:', e); }
    });
  }
}

// Public API
const store = {
  state: createReactiveState({
    // App state
    currentView: 'dashboard',
    previousView: null,
    isOnboarded: false,
    isLoading: false,

    // User profile
    user: {
      name: '',
      age: 0,
      sex: 'male',
      height: 170,        // cm
      weight: 70,          // kg
      activityLevel: 'moderate',
      goal: 'maintain',    // cut, maintain, bulk
      trainingDays: 4,
      dietPreferences: [],
      units: 'metric',     // metric or imperial
      tdee: 0,
      macros: { protein: 0, carbs: 0, fat: 0, calories: 0, fiber: 30, sodium: 2300, calcium: 1000, iron: 8 }
    },

    // Today's data
    today: {
      date: new Date().toISOString().split('T')[0],
      meals: [],
      water: 0,
      waterGoal: 2500,
      workout: null,
      sleep: null,
      caloriesConsumed: 0,
      proteinConsumed: 0,
      carbsConsumed: 0,
      fatConsumed: 0,
      fiberConsumed: 0,
      sodiumConsumed: 0,
      calciumConsumed: 0,
      ironConsumed: 0
    },

    // UI state
    activeModal: null,
    modalData: null,
    moreMenuOpen: false,
    activeTab: null,

    // Streak
    streak: 0
  }),

  /**
   * Subscribe to state changes
   * @param {string} key - State key to watch, or '*' for all
   * @param {Function} callback - (newValue, oldValue, key) => void
   * @returns {Function} Unsubscribe function
   */
  on(key, callback) {
    if (!listeners.has(key)) {
      listeners.set(key, new Set());
    }
    listeners.get(key).add(callback);
    return () => listeners.get(key).delete(callback);
  },

  /**
   * Batch multiple state updates (reduces re-renders)
   * @param {Function} fn - Function containing state updates
   */
  batch(fn) {
    batchDepth++;
    try {
      fn();
    } finally {
      batchDepth--;
      if (batchDepth === 0) {
        const notifications = [...pendingNotifications];
        pendingNotifications.clear();
        notifications.forEach(key => {
          notifyListeners(key, store.state[key], undefined);
        });
      }
    }
  },

  /**
   * Get a snapshot of current state
   * @returns {Object} Shallow copy of state
   */
  getSnapshot() {
    return { ...this.state };
  },

  /**
   * Update nested state (creates new reference for change detection)
   * @param {string} key - Top-level state key
   * @param {Object} updates - Partial updates to merge
   */
  update(key, updates) {
    const current = this.state[key];
    if (typeof current === 'object' && current !== null) {
      this.state[key] = { ...current, ...updates };
    } else {
      this.state[key] = updates;
    }
  },

  recalcToday(meals) {
    let calories = 0, protein = 0, carbs = 0, fat = 0;
    let fiber = 0, sodium = 0, calcium = 0, iron = 0;
    meals.forEach(meal => {
      if (meal.items) {
        meal.items.forEach(item => {
          const mult = (item.servings || 1);
          calories += (item.calories || 0) * mult;
          protein += (item.protein || 0) * mult;
          carbs += (item.carbs || 0) * mult;
          fat += (item.fat || 0) * mult;
          fiber += (item.fiber || item.fi || 0) * mult;
          sodium += (item.sodium || item.na || 0) * mult;
          calcium += (item.calcium || item.ca || 0) * mult;
          iron += (item.iron || item.fe || 0) * mult;
        });
      }
    });
    this.update('today', {
      caloriesConsumed: Math.round(calories),
      proteinConsumed: Math.round(protein),
      carbsConsumed: Math.round(carbs),
      fatConsumed: Math.round(fat),
      fiberConsumed: Math.round(fiber * 10) / 10,
      sodiumConsumed: Math.round(sodium),
      calciumConsumed: Math.round(calcium),
      ironConsumed: Math.round(iron * 10) / 10
    });
  }
};

export default store;
