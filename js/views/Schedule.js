/* ============================================================
   FitForge — Schedule / Planner View
   Plans weekly training splits and displays today's chronological activity timeline
   ============================================================ */

import db from '../db.js';
import store from '../store.js';
import { PRESETS } from '../services/notifications.js';

let storeUnsubscribe = null;
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export async function render(container) {
  if (storeUnsubscribe) storeUnsubscribe();
  storeUnsubscribe = store.on('*', () => {
    if (document.getElementById('schedule-view')) {
      renderContent(container);
    }
  });

  renderContent(container);
}

async function renderContent(container) {
  const user = store.state.user;
  const todayDate = new Date();
  const dayName = WEEKDAYS[todayDate.getDay()];
  
  // Load saved schedule split or seed default
  // Key format: 'schedule-split'
  let split = await db.userProfile.get('schedule-split') || {
    key: 'schedule-split',
    Monday: 'Push Day',
    Tuesday: 'Pull Day',
    Wednesday: 'Rest Day',
    Thursday: 'Legs Day',
    Friday: 'Push Day',
    Saturday: 'Rest Day',
    Sunday: 'Rest Day'
  };

  // Ensure scheduleEvents exists or seed default timeline
  const todayStr = todayDate.toISOString().split('T')[0];
  let events = await db.scheduleEvents.where('date').equals(todayStr).sortBy('time');
  
  if (events.length === 0) {
    // Seed default daily events list
    const defaults = [
      { time: '07:00', type: 'sleep', desc: 'Wakeup and log sleep duration 🛌' },
      { time: '08:30', type: 'meal', desc: 'Breakfast: High protein Oats or Eggs 🍳' },
      { time: '13:30', type: 'meal', desc: 'Lunch: Rice, Chicken Breast/Paneer, Salad 🍛' },
      { time: '17:30', type: 'workout', desc: `Scheduled Training Session: ${split[dayName]} 💪` },
      { time: '20:30', type: 'meal', desc: 'Dinner: Roti, Dal, Stir Fry Veggies 🍲' },
      { time: '22:30', type: 'sleep', desc: 'Bedtime Wind-down schedule 🌙' }
    ];
    
    for (const d of defaults) {
      await db.scheduleEvents.add({
        date: todayStr,
        ...d,
        createdAt: new Date().toISOString()
      });
    }
    
    events = await db.scheduleEvents.where('date').equals(todayStr).sortBy('time');
  }

  container.innerHTML = `
    <div class="container view" id="schedule-view">
      <div class="view-header">
        <div>
          <h1>Schedule & <span class="text-gradient">Planner</span></h1>
          <div class="subtitle">Organize weekly training programs and view daily timelines</div>
        </div>
      </div>

      <!-- Weekly Training Split Card -->
      <div class="glass-card mb-lg">
        <div class="card-header">
          <div class="card-title">Weekly Training split</div>
          <div class="card-icon" style="background: rgba(124, 106, 255, 0.1); color: var(--accent);">📅</div>
        </div>
        
        <p class="text-sm text-secondary mb-md">Plan your weekly training routines. FitForge will dynamically adapt dashboard schedules matching this program.</p>
        
        <div class="flex flex-col gap-2xs" id="weekly-split-list">
          ${WEEKDAYS.map(day => `
            <div class="flex justify-between items-center py-xs px-sm bg-deepest" style="border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); margin-bottom: 2px;">
              <span class="text-sm font-semibold">${day} ${day === dayName ? '<span class="text-accent text-xs">(Today)</span>' : ''}</span>
              <div class="flex items-center gap-xs">
                <select class="input split-select" data-day="${day}" style="padding: 4px 10px; width: 120px; font-size: var(--font-xs);">
                  <option value="Rest Day" ${split[day] === 'Rest Day' ? 'selected' : ''}>Rest Day</option>
                  <option value="Push Day" ${split[day] === 'Push Day' ? 'selected' : ''}>Push Day</option>
                  <option value="Pull Day" ${split[day] === 'Pull Day' ? 'selected' : ''}>Pull Day</option>
                  <option value="Legs Day" ${split[day] === 'Legs Day' ? 'selected' : ''}>Legs Day</option>
                  <option value="Full Body" ${split[day] === 'Full Body' ? 'selected' : ''}>Full Body</option>
                </select>
              </div>
            </div>
          `).join('')}
        </div>
        
        <button class="btn btn-secondary btn-sm btn-block mt-md" id="save-split-btn">
          Save Weekly Split
        </button>
      </div>

      <!-- Chronological Daily Timeline -->
      <div class="glass-card mb-lg">
        <div class="card-header">
          <div class="card-title">Today's Timeline (${dayName})</div>
        </div>
        
        <div class="timeline" id="today-timeline">
          ${events.map(ev => `
            <div class="timeline-item item-${ev.type}">
              <div class="flex justify-between items-start">
                <div>
                  <div class="timeline-time">${formatTimeDisplay(ev.time)}</div>
                  <div class="timeline-content">${ev.desc}</div>
                </div>
                <button class="meal-item-delete delete-event-btn" data-event-id="${ev.id}" style="opacity: 1; padding: 2px; width: 24px; height: 24px;">
                  🗑️
                </button>
              </div>
            </div>
          `).join('')}
        </div>
        
        <button class="add-food-btn" id="add-timeline-event-btn">
          ➕ Add Scheduled Activity
        </button>
      </div>

    </div>
  `;

  bindEvents(container, split);
}

function bindEvents(container, currentSplit) {
  // Save split button
  const saveSplitBtn = document.getElementById('save-split-btn');
  if (saveSplitBtn) {
    saveSplitBtn.addEventListener('click', async () => {
      const selects = document.querySelectorAll('.split-select');
      const newSplit = { key: 'schedule-split' };
      
      selects.forEach(s => {
        const day = s.getAttribute('data-day');
        newSplit[day] = s.value;
      });
      
      await db.userProfile.put(newSplit);
      
      // Update store user training split
      store.batch(() => {
        store.state.user.trainingDays = Object.values(newSplit).filter(v => v !== 'Rest Day').length;
      });
      
      // Reschedule workout reminders if any
      const splitVal = newSplit[WEEKDAYS[new Date().getDay()]];
      if (splitVal !== 'Rest Day') {
        PRESETS.workout('17:30'); // schedule workout alarm at 5:30 PM default
      }
      
      window.showToast('Split Saved', 'Weekly schedule split updated.', 'success');
      renderContent(container);
    });
  }

  // Add Custom timeline event modal
  const addEventBtn = document.getElementById('add-timeline-event-btn');
  if (addEventBtn) {
    addEventBtn.addEventListener('click', () => {
      const modalHtml = `
        <div class="flex flex-col gap-md">
          <div class="input-group">
            <label for="event-time">Time</label>
            <input type="time" id="event-time" class="input" value="12:00">
          </div>
          <div class="input-group">
            <label for="event-type">Category</label>
            <select id="event-type" class="input">
              <option value="meal">Meal 🍽️</option>
              <option value="workout">Workout 💪</option>
              <option value="water">Water / Drink 💧</option>
              <option value="sleep">Sleep 🌙</option>
            </select>
          </div>
          <div class="input-group">
            <label for="event-desc">Description</label>
            <input type="text" id="event-desc" class="input" placeholder="e.g. Protein shake with berries">
          </div>
          <button class="btn btn-primary btn-block" id="modal-save-event-btn">Add to Timeline</button>
        </div>
      `;
      
      window.showModal('Add Activity', modalHtml);
      
      const saveBtn = document.getElementById('modal-save-event-btn');
      if (saveBtn) {
        saveBtn.addEventListener('click', async () => {
          const time = document.getElementById('event-time').value;
          const type = document.getElementById('event-type').value;
          const desc = document.getElementById('event-desc').value.trim();
          
          if (!desc) {
            window.showToast('Description missing', 'Please enter a description.', 'warning');
            return;
          }
          
          const todayStr = new Date().toISOString().split('T')[0];
          
          await db.scheduleEvents.add({
            date: todayStr,
            time,
            type,
            desc,
            createdAt: new Date().toISOString()
          });
          
          // Schedule background alarm reminder
          if (type === 'workout') {
            PRESETS.workout(time);
          } else if (type === 'sleep') {
            PRESETS.sleep(time);
          } else if (type === 'meal') {
            PRESETS.meal(desc.substring(0, 15), time);
          }
          
          window.hideModal();
          window.showToast('Activity Added', 'Activity inserted into timeline.', 'success');
          renderContent(container);
        });
      }
    });
  }

  // Delete timeline event
  document.querySelectorAll('.delete-event-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = parseInt(btn.getAttribute('data-event-id'));
      await db.scheduleEvents.delete(id);
      
      window.showToast('Activity Removed', 'Timeline activity deleted.', 'info');
      renderContent(container);
    });
  });
}

function formatTimeDisplay(timeStr) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':');
  const hours = parseInt(h);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${m} ${ampm}`;
}

export function cleanup() {
  if (storeUnsubscribe) {
    storeUnsubscribe();
    storeUnsubscribe = null;
  }
}
