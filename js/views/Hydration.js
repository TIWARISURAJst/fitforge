/* ============================================================
   FitForge — Hydration View
   Logs water intake, plays glass animations, and schedules water reminders
   ============================================================ */

import db from '../db.js';
import store from '../store.js';
import { PRESETS, requestPermission } from '../services/notifications.js';
import { formatWater } from '../services/macroCalculator.js';

let storeUnsubscribe = null;

export async function render(container) {
  if (storeUnsubscribe) storeUnsubscribe();
  storeUnsubscribe = store.on('*', () => {
    if (document.getElementById('hydration-view')) {
      renderContent(container);
    }
  });

  renderContent(container);
}

async function renderContent(container) {
  const user = store.state.user;
  const today = store.state.today;
  const target = today.waterGoal || 2500;
  const consumed = today.water || 0;
  const percent = Math.min(100, Math.round((consumed / target) * 100));

  // Retrieve today's detailed logs
  const todayStr = new Date().toISOString().split('T')[0];
  const logsObj = await db.getWaterByDate(todayStr);
  const logsList = logsObj.logs || [];

  container.innerHTML = `
    <div class="container view" id="hydration-view">
      <div class="view-header">
        <div>
          <h1>Hydration <span class="text-gradient">Tracker</span></h1>
          <div class="subtitle">Log water intake, customize targets, and schedule alarms</div>
        </div>
      </div>
      
      <!-- Interactive Glass Card -->
      <div class="glass-card mb-lg text-center">
        <div class="water-visual">
          <div class="water-glass">
            <!-- Filling level via height inline styles -->
            <div style="position: absolute; bottom: 0; left: 0; right: 0; background: var(--water); height: ${percent}%; transition: height 0.8s var(--ease-out);"></div>
          </div>
          
          <div>
            <div class="water-amount">${formatWater(consumed, user.units)}</div>
            <div class="water-goal">Goal: ${formatWater(target, user.units)} (${percent}%)</div>
          </div>
        </div>
        
        <div class="divider" style="margin: 0 0 var(--space-md) 0;"></div>
        
        <div class="water-quick-add">
          <button class="water-btn" data-add="250">🥤 +250 ml (Cup)</button>
          <button class="water-btn" data-add="500">🥛 +500 ml (Bottle)</button>
          <button class="water-btn" data-add="750">💧 +750 ml (Large)</button>
          <button class="water-btn" id="custom-water-trigger-btn">➕ Custom</button>
        </div>
      </div>

      <!-- Smart Reminders Config Card -->
      <div class="glass-card mb-lg">
        <div class="card-header">
          <div class="card-title">Hydration Reminders</div>
          <div class="card-icon" style="background: rgba(0, 180, 255, 0.1); color: var(--water);">⏰</div>
        </div>
        
        <p class="text-sm text-secondary mb-md">Set recurring reminders in the background to ensure you hit your metabolic hydration quota.</p>
        
        <div class="flex gap-sm items-center">
          <select id="water-reminder-interval" class="input" style="flex: 1.5;">
            <option value="0">Reminders Disabled</option>
            <option value="30">Every 30 Mins</option>
            <option value="60" selected>Every 60 Mins</option>
            <option value="90">Every 90 Mins</option>
            <option value="120">Every 2 Hours</option>
          </select>
          
          <button class="btn btn-primary btn-sm" id="save-water-reminder-btn" style="flex: 1;">
            Schedule
          </button>
        </div>
      </div>

      <!-- Water logged logs list -->
      <div class="glass-card">
        <div class="card-header">
          <div class="card-title">Today's Intake Log</div>
        </div>
        
        <div class="water-timeline" id="water-history-timeline" style="margin-top: 0;">
          ${logsList.length === 0 ? `
            <p class="text-xs text-muted text-center py-md">No water logged yet today.</p>
          ` : logsList.map(log => `
            <div class="water-log-entry">
              <div class="water-log-time">${log.time}</div>
              <div class="water-log-amount text-gradient" style="flex: 1;">+ ${formatWater(log.amount, user.units)}</div>
              <button class="meal-item-delete delete-water-log-btn" data-log-id="${log.id}" style="opacity: 1;">
                🗑️
              </button>
            </div>
          `).join('')}
        </div>
      </div>

    </div>
  `;

  bindEvents(container);
}

function bindEvents(container) {
  // Preset quick adds
  document.querySelectorAll('.water-btn[data-add]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const amt = parseInt(btn.getAttribute('data-add'));
      await addWaterAmount(amt);
    });
  });

  // Custom water log trigger modal
  const customBtn = document.getElementById('custom-water-trigger-btn');
  if (customBtn) {
    customBtn.addEventListener('click', () => {
      const modalHtml = `
        <div class="flex flex-col gap-md">
          <div class="input-group">
            <label for="custom-water-input">Volume (ml)</label>
            <input type="number" id="custom-water-input" class="input" placeholder="e.g. 350" min="50" max="2000" step="50" autofocus>
          </div>
          <button class="btn btn-primary btn-block" id="save-custom-water-btn">Log Intake</button>
        </div>
      `;
      
      window.showModal('Log Custom Water', modalHtml);
      
      const saveBtn = document.getElementById('save-custom-water-btn');
      if (saveBtn) {
        saveBtn.addEventListener('click', async () => {
          const input = document.getElementById('custom-water-input');
          const val = parseInt(input.value);
          if (val && val > 0) {
            await addWaterAmount(val);
            window.hideModal();
          } else {
            window.showToast('Invalid Amount', 'Please enter a positive value.', 'warning');
          }
        });
      }
    });
  }

  // Deleting logs
  document.querySelectorAll('.delete-water-log-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const logId = parseInt(btn.getAttribute('data-log-id'));
      await db.waterLogs.delete(logId);
      
      // Update store
      const todayStr = new Date().toISOString().split('T')[0];
      const updated = await db.getWaterByDate(todayStr);
      store.update('today', { water: updated.total });
      
      window.showToast('Log Deleted', 'Water entry removed.', 'info');
      renderContent(container);
    });
  });

  // Reminders scheduler
  const saveReminderBtn = document.getElementById('save-water-reminder-btn');
  if (saveReminderBtn) {
    saveReminderBtn.addEventListener('click', async () => {
      const select = document.getElementById('water-reminder-interval');
      const val = parseInt(select.value);
      
      if (val > 0) {
        // Request notification permission first
        const granted = await requestPermission();
        if (granted) {
          // Schedule background reminders preset
          PRESETS.water(val);
          window.showToast('Reminders Set', `We will prompt you to hydrate every ${val} minutes.`, 'success');
        } else {
          window.showToast('Permission Denied', 'Please enable notifications in browser settings.', 'danger');
        }
      } else {
        // Clear water reminders
        // Notifications are managed ephemerally or via service worker
        window.showToast('Reminders Off', 'Recurring hydration alerts disabled.', 'info');
      }
    });
  }
}

async function addWaterAmount(amount) {
  const todayStr = new Date().toISOString().split('T')[0];
  await db.addWater(todayStr, amount);
  
  // Reload total water logged and update store today
  const updated = await db.getWaterByDate(todayStr);
  store.update('today', { water: updated.total });
  
  window.showToast('Hydration Logged', `+${amount}ml water added.`, 'info');
}

export function cleanup() {
  if (storeUnsubscribe) {
    storeUnsubscribe();
    storeUnsubscribe = null;
  }
}
