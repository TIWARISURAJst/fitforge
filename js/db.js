/* ============================================================
   FitForge — Database (Dexie.js IndexedDB)
   All local data persistence for the fitness tracker
   ============================================================ */

// Dexie will be loaded from CDN in index.html
const db = new Dexie('FitForgeDB');

db.version(1).stores({
  // User profile (single record, key = 'profile')
  userProfile: 'key',

  // Meals: each meal log entry
  meals: '++id, date, mealType',

  // Workouts: each workout session
  workouts: '++id, date, templateId, status',

  // Exercise sets within a workout
  exerciseSets: '++id, workoutId, exerciseId',

  // Body metrics: weight, body fat, measurements
  bodyMetrics: '++id, date',

  // Sleep logs
  sleepLogs: '++id, date',

  // Water intake entries
  waterLogs: '++id, date, time',

  // Schedule events
  scheduleEvents: '++id, date, time, type',

  // Progress photos (photo stored as Blob)
  progressPhotos: '++id, date, category',

  // Custom foods added by user
  customFoods: '++id, name',

  // Custom recipes
  customRecipes: '++id, name',

  // Achievements / PRs
  achievements: '++id, type, date',

  // Daily summaries (cached calculations)
  dailySummaries: 'date'
});

// ── Helper Methods ──────────────────────────────────────────

/**
 * Save or update user profile
 */
db.saveProfile = async function(profile) {
  await this.userProfile.put({ key: 'profile', ...profile });
};

/**
 * Get user profile
 */
db.getProfile = async function() {
  return await this.userProfile.get('profile');
};

/**
 * Get meals for a specific date
 */
db.getMealsByDate = async function(date) {
  return await this.meals.where('date').equals(date).toArray();
};

/**
 * Add a food item to a meal
 */
db.addMealItem = async function(date, mealType, item) {
  // Check if meal exists for this date and type
  let meal = await this.meals.where({ date, mealType }).first();

  if (meal) {
    // Add item to existing meal
    const items = meal.items || [];
    items.push({ ...item, id: Date.now() });
    await this.meals.update(meal.id, { items });
    return meal.id;
  } else {
    // Create new meal
    return await this.meals.add({
      date,
      mealType,
      items: [{ ...item, id: Date.now() }],
      createdAt: new Date().toISOString()
    });
  }
};

/**
 * Remove a food item from a meal
 */
db.removeMealItem = async function(mealId, itemId) {
  const meal = await this.meals.get(mealId);
  if (meal) {
    const items = (meal.items || []).filter(i => i.id !== itemId);
    await this.meals.update(mealId, { items });
  }
};

/**
 * Get today's water total
 */
db.getWaterByDate = async function(date) {
  const logs = await this.waterLogs.where('date').equals(date).toArray();
  return {
    total: logs.reduce((sum, l) => sum + l.amount, 0),
    logs
  };
};

/**
 * Add water entry
 */
db.addWater = async function(date, amount) {
  return await this.waterLogs.add({
    date,
    amount,
    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    createdAt: new Date().toISOString()
  });
};

/**
 * Get latest body metric
 */
db.getLatestMetric = async function() {
  return await this.bodyMetrics.orderBy('date').reverse().first();
};

/**
 * Get body metrics for date range
 */
db.getMetricsRange = async function(startDate, endDate) {
  return await this.bodyMetrics
    .where('date')
    .between(startDate, endDate, true, true)
    .sortBy('date');
};

/**
 * Get sleep log for date
 */
db.getSleepByDate = async function(date) {
  return await this.sleepLogs.where('date').equals(date).first();
};

/**
 * Get workouts for date
 */
db.getWorkoutsByDate = async function(date) {
  return await this.workouts.where('date').equals(date).toArray();
};

/**
 * Get exercise sets for a workout
 */
db.getSetsByWorkout = async function(workoutId) {
  return await this.exerciseSets.where('workoutId').equals(workoutId).toArray();
};

/**
 * Save daily summary (cached totals)
 */
db.saveDailySummary = async function(date, summary) {
  await this.dailySummaries.put({ date, ...summary });
};

/**
 * Get daily summary
 */
db.getDailySummary = async function(date) {
  return await this.dailySummaries.get(date);
};

/**
 * Get streak (consecutive days with logged data)
 */
db.getStreak = async function() {
  const today = new Date();
  let streak = 0;

  for (let i = 0; i < 365; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    const meals = await this.meals.where('date').equals(dateStr).count();
    const water = await this.waterLogs.where('date').equals(dateStr).count();
    const workout = await this.workouts.where('date').equals(dateStr).count();

    if (meals > 0 || water > 0 || workout > 0) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }

  return streak;
};

/**
 * Export all data as JSON
 */
db.exportAll = async function() {
  const data = {};
  for (const table of this.tables) {
    // Skip progressPhotos (too large) — export metadata only
    if (table.name === 'progressPhotos') {
      const photos = await table.toArray();
      data[table.name] = photos.map(p => ({ ...p, photo: '[BLOB]' }));
    } else {
      data[table.name] = await table.toArray();
    }
  }
  return data;
};

/**
 * Import data from JSON
 */
db.importAll = async function(data) {
  await db.transaction('rw', db.tables, async () => {
    for (const [tableName, records] of Object.entries(data)) {
      if (db[tableName] && tableName !== 'progressPhotos') {
        await db[tableName].clear();
        await db[tableName].bulkAdd(records);
      }
    }
  });
};

export default db;
