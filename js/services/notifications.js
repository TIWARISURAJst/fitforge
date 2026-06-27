/* ============================================================
   FitForge — Notification / Reminder Service
   Uses Notification API and setTimeout for reminders
   ============================================================ */

let reminders = [];

/**
 * Request notification permission
 * @returns {Promise<boolean>} Whether permission was granted
 */
export async function requestPermission() {
  if (!('Notification' in window)) {
    console.warn('[Notifications] Not supported in this browser');
    return false;
  }

  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;

  const result = await Notification.requestPermission();
  return result === 'granted';
}

/**
 * Show a notification
 * @param {string} title - Notification title
 * @param {Object} options - Notification options
 */
export function showNotification(title, options = {}) {
  if (!('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;

  try {
    new Notification(title, {
      icon: '/manifest.json',
      badge: '/manifest.json',
      vibrate: [200],
      ...options
    });
  } catch (e) {
    console.warn('[Notifications] Failed to create notification object:', e);
  }
}

/**
 * Set a reminder
 * @param {string} id - Unique reminder ID
 * @param {string} message - Reminder message
 * @param {number} delayMs - Delay in milliseconds
 * @param {Function} [callback] - Optional callback when reminder fires
 */
export function setReminder(id, message, delayMs, callback) {
  // Clear existing reminder with same ID
  clearReminder(id);

  const timer = setTimeout(() => {
    showNotification('FitForge Reminder', { body: message });
    if (callback) callback();
    reminders = reminders.filter(r => r.id !== id);
  }, delayMs);

  reminders.push({ id, message, timer, fireAt: Date.now() + delayMs });
}

/**
 * Clear a specific reminder
 */
export function clearReminder(id) {
  const existing = reminders.find(r => r.id === id);
  if (existing) {
    clearTimeout(existing.timer);
    reminders = reminders.filter(r => r.id !== id);
  }
}

/**
 * Clear all reminders
 */
export function clearAllReminders() {
  reminders.forEach(r => clearTimeout(r.timer));
  reminders = [];
}

/**
 * Get active reminders
 */
export function getActiveReminders() {
  return reminders.map(r => ({
    id: r.id,
    message: r.message,
    fireAt: new Date(r.fireAt)
  }));
}

/**
 * Common preset reminders
 */
export const PRESETS = {
  water: (intervalMinutes = 60) => {
    setReminder('water', '💧 Time to drink some water!', intervalMinutes * 60 * 1000, () => {
      // Re-set recurring water reminder
      PRESETS.water(intervalMinutes);
    });
  },
  meal: (mealType, timeStr) => {
    const now = new Date();
    const [hours, minutes] = timeStr.split(':').map(Number);
    const target = new Date(now);
    target.setHours(hours, minutes, 0, 0);
    if (target <= now) target.setDate(target.getDate() + 1);
    const delay = target - now;
    setReminder(`meal-${mealType}`, `🍽️ Time for ${mealType}!`, delay);
  },
  workout: (timeStr) => {
    const now = new Date();
    const [hours, minutes] = timeStr.split(':').map(Number);
    const target = new Date(now);
    target.setHours(hours, minutes, 0, 0);
    if (target <= now) target.setDate(target.getDate() + 1);
    const delay = target - now;
    setReminder('workout', '💪 Time for your workout!', delay);
  },
  sleep: (timeStr) => {
    const now = new Date();
    const [hours, minutes] = timeStr.split(':').map(Number);
    const target = new Date(now);
    target.setHours(hours, minutes, 0, 0);
    if (target <= now) target.setDate(target.getDate() + 1);
    const delay = target - now;
    setReminder('sleep', '🌙 Time to start winding down for bed!', delay);
  }
};

export default {
  requestPermission,
  showNotification,
  setReminder,
  clearReminder,
  clearAllReminders,
  getActiveReminders,
  PRESETS
};
