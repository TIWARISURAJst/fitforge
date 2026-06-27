/* ============================================================
   FitForge — Sleep Tracker View
   Logs sleep, bedtime/waketime offsets, quality rating, and calculates recovery score
   ============================================================ */

import db from '../db.js';
import store from '../store.js';

let storeUnsubscribe = null;
let currentQualityRating = 4; // default 4 stars

export async function render(container) {
  if (storeUnsubscribe) storeUnsubscribe();
  storeUnsubscribe = store.on('*', () => {
    if (document.getElementById('sleep-tracker-view')) {
      renderContent(container);
    }
  });

  renderContent(container);
}

async function renderContent(container) {
  const todayStr = new Date().toISOString().split('T')[0];
  const todaySleep = await db.getSleepByDate(todayStr);
  
  // Calculate sleep scores
  let sleepScore = 0;
  if (todaySleep) {
    // Score out of 100 based on hours (70%) and quality (30%)
    const hoursScore = Math.min(1, todaySleep.hours / 8) * 70;
    const qualityScore = (todaySleep.quality / 5) * 30;
    sleepScore = Math.round(hoursScore + qualityScore);
  }

  container.innerHTML = `
    <div class="container view" id="sleep-tracker-view">
      <div class="view-header">
        <div>
          <h1>Sleep & <span class="text-gradient">Recovery</span></h1>
          <div class="subtitle">Log sleep duration, evaluate recovery, and track sleep hygiene</div>
        </div>
      </div>

      ${todaySleep ? `
        <!-- Display Logged sleep stats -->
        <div class="glass-card mb-lg text-center">
          <div class="card-header">
            <div class="card-title">Sleep Score</div>
            <span class="badge badge-info" style="background: var(--sleep-glow); color: var(--sleep);">Logged</span>
          </div>
          
          <div class="sleep-score-circle" style="margin: var(--space-md) auto;">
            <!-- SVG circular gauge for sleep score -->
            <svg viewBox="0 0 100 100" style="transform: rotate(-90deg); width: 100%; height: 100%;">
              <circle cx="50" cy="50" r="45" fill="none" stroke="var(--bg-elevated)" stroke-width="5" />
              <circle cx="50" cy="50" r="45" fill="none" stroke="var(--sleep)" stroke-width="5" 
                stroke-dasharray="282.7" stroke-dashoffset="${282.7 - (sleepScore / 100) * 282.7}" stroke-linecap="round" />
            </svg>
            <div class="sleep-score-value">
              <span class="score-number">${sleepScore}</span>
              <span class="score-label">Points</span>
            </div>
          </div>
          
          <div class="sleep-duration">${todaySleep.hours.toFixed(1)} Hours</div>
          <p class="text-sm text-secondary">Bedtime: ${formatTimeDisplay(todaySleep.bedtime)} • Wakeup: ${formatTimeDisplay(todaySleep.waketime)}</p>
          <div class="text-xs text-muted mt-2xs">Sleep Quality: ${getSleepQualityDescription(todaySleep.quality)}</div>
          
          <button class="btn btn-secondary btn-sm mt-md" id="delete-sleep-btn">
            🗑️ Delete Log Entry
          </button>
        </div>

        <!-- recovery advisor -->
        <div class="glass-card mb-lg" style="border-color: var(--border-accent); box-shadow: 0 0 15px var(--sleep-glow);">
          <div class="card-header">
            <div class="card-title">Coaching Recovery Advice</div>
          </div>
          <div class="flex gap-md items-start">
            <span style="font-size: 2rem;">🧠</span>
            <p class="text-sm text-secondary" style="line-height: 1.5;">${getRecoveryAdvice(todaySleep.hours, todaySleep.quality)}</p>
          </div>
        </div>
      ` : `
        <!-- Sleep Logger Form -->
        <div class="glass-card mb-lg">
          <div class="card-header">
            <div class="card-title">Log Sleep Session</div>
          </div>
          
          <div class="time-picker-row">
            <div class="time-picker-item">
              <span class="time-label">🛌 BEDTIME</span>
              <input type="time" id="sleep-bedtime" value="23:00">
            </div>
            <div class="time-picker-item">
              <span class="time-label">🌅 WAKE TIME</span>
              <input type="time" id="sleep-waketime" value="07:00">
            </div>
          </div>
          
          <div class="sleep-duration" id="live-sleep-calc">8.0 Hours</div>
          
          <div class="divider"></div>
          
          <div class="input-group">
            <label class="text-center" style="display: block;">How would you rate your sleep quality?</label>
            <div class="quality-stars" id="quality-rating-stars">
              <span class="quality-star active" data-rating="1">★</span>
              <span class="quality-star active" data-rating="2">★</span>
              <span class="quality-star active" data-rating="3">★</span>
              <span class="quality-star active" data-rating="4">★</span>
              <span class="quality-star" data-rating="5">★</span>
            </div>
            <div class="text-xs text-muted text-center" id="quality-val-label">Good rest 😊</div>
          </div>
          
          <button class="btn btn-primary btn-block mt-lg" id="save-sleep-btn">
            Log Recovery Sleep
          </button>
        </div>
      `}

      <!-- Sleep History list -->
      <div class="glass-card">
        <div class="card-header">
          <div class="card-title">Recent Sleep Logs</div>
        </div>
        <div class="flex flex-col gap-sm" id="sleep-history-list">
          <p class="text-xs text-muted text-center py-md">Loading sleep database logs...</p>
        </div>
      </div>
      
    </div>
  `;

  loadSleepHistory();
  bindEvents(container, todaySleep);
}

async function loadSleepHistory() {
  const list = document.getElementById('sleep-history-list');
  if (!list) return;
  
  try {
    const logs = await db.sleepLogs.orderBy('date').reverse().limit(5).toArray();
    
    if (logs.length === 0) {
      list.innerHTML = `<p class="text-xs text-muted text-center py-md">No recovery logs recorded.</p>`;
      return;
    }
    
    list.innerHTML = logs.map(l => `
      <div class="glass-card card-sm" style="background: var(--bg-deepest); margin-bottom: 2px;">
        <div class="flex justify-between items-center text-xs">
          <div>
            <div class="font-bold text-accent">${l.hours.toFixed(1)} Hours</div>
            <div class="text-muted">${l.date}</div>
          </div>
          <span style="color: var(--sleep); font-weight: 600;">Quality: ${l.quality}/5 ★</span>
        </div>
      </div>
    `).join('');
    
  } catch (error) {
    console.error('[SleepHistory] Error loading:', error);
    list.innerHTML = `<p class="text-xs text-danger text-center">Failed to load sleep history.</p>`;
  }
}

function bindEvents(container, todaySleep) {
  if (todaySleep) {
    // Delete log button
    const deleteBtn = document.getElementById('delete-sleep-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', async () => {
        if (confirm('Are you sure you want to delete today\'s sleep entry?')) {
          await db.sleepLogs.delete(todaySleep.id);
          
          // Clear in store
          store.update('today', { sleep: null });
          
          window.showToast('Log Deleted', 'Sleep log entry deleted.', 'info');
          renderContent(container);
        }
      });
    }
    return;
  }
  
  // Sleep duration calculator based on time inputs
  const bedInput = document.getElementById('sleep-bedtime');
  const wakeInput = document.getElementById('sleep-waketime');
  const liveCalc = document.getElementById('live-sleep-calc');
  
  const updateDuration = () => {
    if (!bedInput || !wakeInput || !liveCalc) return;
    
    const [bedH, bedM] = bedInput.value.split(':').map(Number);
    const [wakeH, wakeM] = wakeInput.value.split(':').map(Number);
    
    let hours = wakeH - bedH;
    let mins = wakeM - bedM;
    
    if (mins < 0) {
      hours--;
      mins += 60;
    }
    if (hours < 0) {
      hours += 24;
    }
    
    const totalHours = hours + (mins / 60);
    liveCalc.textContent = `${totalHours.toFixed(1)} Hours`;
    return totalHours;
  };
  
  if (bedInput && wakeInput) {
    bedInput.addEventListener('change', updateDuration);
    wakeInput.addEventListener('change', updateDuration);
  }

  // Star rating events
  const stars = document.querySelectorAll('.quality-star');
  const qualityLabel = document.getElementById('quality-val-label');
  
  stars.forEach(star => {
    star.addEventListener('click', () => {
      const rating = parseInt(star.getAttribute('data-rating'));
      currentQualityRating = rating;
      
      // Update star classes
      stars.forEach((s, idx) => {
        if (idx < rating) {
          s.classList.add('active');
        } else {
          s.classList.remove('active');
        }
      });
      
      // Update description
      if (qualityLabel) {
        qualityLabel.textContent = getSleepQualityDescription(rating);
      }
    });
  });

  // Save log button
  const saveBtn = document.getElementById('save-sleep-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      const bedtime = bedInput.value;
      const waketime = wakeInput.value;
      const hours = updateDuration();
      const todayStr = new Date().toISOString().split('T')[0];
      
      await db.sleepLogs.add({
        date: todayStr,
        bedtime,
        waketime,
        hours,
        quality: currentQualityRating,
        createdAt: new Date().toISOString()
      });
      
      // Load and update store today
      const sleep = await db.getSleepByDate(todayStr);
      store.update('today', { sleep });
      
      window.showToast('Sleep Logged', 'Sleep and recovery data saved successfully.', 'success');
      renderContent(container);
    });
  }
}

function getSleepQualityDescription(rating) {
  const descriptions = {
    1: 'Poor recovery 😫 (Woke up tired)',
    2: 'Restless sleep 😴 (Woke up multiple times)',
    3: 'Average recovery 🙂 (Feeling normal)',
    4: 'Good rest 😊 (Slept well)',
    5: 'Deep sleep, fully recovered! ⚡ (Energized)'
  };
  return descriptions[rating] || 'Logged';
}

function getRecoveryAdvice(hours, quality) {
  if (hours < 6.0) {
    return "⚠️ <b>Deprived Sleep Recovery:</b> Sleeping less than 6 hours hampers muscle recovery, carbohydrate glycogen replenishment, and mental alertness. Keep workout weights moderate today, focus on strict form, and drink extra water to balance cellular hydration.";
  }
  
  if (hours >= 7.5 && quality >= 4) {
    return "⚡ <b>Optimal Rest Coefficient:</b> Your body spent sufficient time in deep and REM sleep cycles. Your nervous system is fully primed. This is a perfect day to perform high-intensity lifts, try heavier weights, or hit a PR!";
  }
  
  return "👍 <b>Sufficient Rest:</b> You received healthy sleep. Your recovery metrics are solid. Prepare for a standard training session and keep your nutrition targets locked.";
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
