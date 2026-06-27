/* ============================================================
   FitForge — Main App Controller
   Bootstraps the application, PWA registration, and global UI
   ============================================================ */

import db from './db.js';
import store from './store.js';
import router from './router.js';
import { calculateAllTargets } from './services/macroCalculator.js';

// ── PWA Service Worker Registration ──────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(reg => console.log('[PWA] Service Worker registered:', reg.scope))
      .catch(err => console.error('[PWA] Service Worker registration failed:', err));
  });
}

// ── PWA Installation Event Handlers ──────────────────────────
window.deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later.
  window.deferredPrompt = e;
  // Dispatch a custom event to notify components that PWA is installable
  window.dispatchEvent(new CustomEvent('pwa-installable'));
  console.log('[PWA] Install prompt deferred and ready.');
});

window.addEventListener('appinstalled', () => {
  // Clear the deferredPrompt
  window.deferredPrompt = null;
  window.showToast('App Installed Successfully', 'FitForge has been added to your device home screen!', 'success');
  console.log('[PWA] FitForge app installed successfully.');
});

// ── Toast Notification System ────────────────────────────────
window.showToast = function(title, message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  // Icon based on type
  let icon = '🔔';
  if (type === 'success') icon = '✅';
  if (type === 'danger') icon = '⚠️';
  if (type === 'warning') icon = '⚡';
  
  toast.innerHTML = `
    <div class="toast-icon">${icon}</div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
  `;
  
  container.appendChild(toast);
  
  // Auto-remove after 4 seconds
  setTimeout(() => {
    toast.classList.add('toast-out');
    toast.addEventListener('animationend', () => toast.remove());
  }, 4000);
};

// ── Reusable Modal System ────────────────────────────────────
let activeModalCloseCallback = null;

window.showModal = function(title, contentHtml, onClose = null) {
  const overlay = document.getElementById('global-modal-overlay');
  const titleEl = document.getElementById('global-modal-title');
  const bodyEl = document.getElementById('global-modal-body');
  
  if (!overlay || !titleEl || !bodyEl) return;
  
  titleEl.textContent = title;
  bodyEl.innerHTML = contentHtml;
  activeModalCloseCallback = onClose;
  
  overlay.classList.add('open');
  store.state.activeModal = title;
};

window.hideModal = function() {
  const overlay = document.getElementById('global-modal-overlay');
  if (!overlay) return;
  
  overlay.classList.remove('open');
  store.state.activeModal = null;
  
  if (activeModalCloseCallback) {
    try { activeModalCloseCallback(); } catch(e) { console.error('[Modal] Callback error:', e); }
    activeModalCloseCallback = null;
  }
};

// ── Global Event Listeners ───────────────────────────────────
function setupGlobalUIListeners() {
  const moreTrigger = document.getElementById('more-menu-trigger');
  const moreMenu = document.getElementById('more-menu');
  const modalClose = document.getElementById('global-modal-close');
  const modalOverlay = document.getElementById('global-modal-overlay');
  
  // Toggle More Menu drawer
  if (moreTrigger && moreMenu) {
    moreTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = moreMenu.classList.toggle('open');
      store.state.moreMenuOpen = isOpen;
      if (isOpen) {
        moreTrigger.classList.add('active');
      } else {
        updateActiveNavTab(store.state.currentView);
      }
    });
  }
  
  // Close More Menu if clicking outside
  document.addEventListener('click', (e) => {
    if (moreMenu && moreMenu.classList.contains('open')) {
      if (!moreMenu.contains(e.target) && !moreTrigger.contains(e.target)) {
        moreMenu.classList.remove('open');
        store.state.moreMenuOpen = false;
        updateActiveNavTab(store.state.currentView);
      }
    }
  });
  
  // Modal Close buttons
  if (modalClose) {
    modalClose.addEventListener('click', window.hideModal);
  }
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) window.hideModal();
    });
  }
}

// ── Update Navigation Highlight ──────────────────────────────
function updateActiveNavTab(view) {
  // Remove active state from all items in bottom nav and more menu
  document.querySelectorAll('.bottom-nav .nav-item, .more-menu .more-menu-item').forEach(el => {
    el.classList.remove('active');
  });
  
  // More menu trigger reset
  const moreTrigger = document.getElementById('more-menu-trigger');
  if (moreTrigger) moreTrigger.classList.remove('active');

  // Activate matching nav link
  const activeEl = document.getElementById(`nav-${view}`);
  if (activeEl) {
    activeEl.classList.add('active');
    
    // If active item is in the more menu, also highlight the "More" trigger
    if (activeEl.classList.contains('more-menu-item') && moreTrigger) {
      moreTrigger.classList.add('active');
    }
  }
}

// ── Load Today's Data from Local DB ─────────────────────────
async function loadTodayData() {
  const todayStr = new Date().toISOString().split('T')[0];
  
  try {
    const meals = await db.getMealsByDate(todayStr);
    const water = await db.getWaterByDate(todayStr);
    const sleep = await db.getSleepByDate(todayStr);
    const workouts = await db.getWorkoutsByDate(todayStr);
    const streak = await db.getStreak();
    
    // Get latest metrics for calorie calculation reference
    const latestMetric = await db.getLatestMetric();
    if (latestMetric && latestMetric.weight) {
      store.state.user.weight = latestMetric.weight;
      if (latestMetric.bodyFat) {
        store.state.user.bodyFat = latestMetric.bodyFat;
      }
      // Recompute macros target based on updated weight
      if (store.state.isOnboarded) {
        const targets = calculateAllTargets(store.state.user);
        store.state.user.macros = targets.macros;
        store.state.user.tdee = targets.tdee;
      }
    }
    
    // Update daily store state
    store.state.streak = streak;
    store.update('today', {
      date: todayStr,
      meals,
      water: water.total,
      sleep,
      workout: workouts.length > 0 ? workouts[0] : null
    });
    
    // Recalculate nutrient totals
    store.recalcToday(meals);
    
  } catch (error) {
    console.error('[App] Error loading today\'s data:', error);
  }
}

// ── App Initialization ────────────────────────────────────────
async function initApp() {
  setupGlobalUIListeners();
  
  // 1. Fetch user profile from IndexedDB
  const profile = await db.getProfile();
  
  if (profile) {
    store.state.isOnboarded = true;
    store.state.user = { ...store.state.user, ...profile };
    
    // Calculate macro/calorie targets
    const targets = calculateAllTargets(store.state.user);
    store.state.user.macros = targets.macros;
    store.state.user.tdee = targets.tdee;
    
    // Show bottom navigation bar
    const bottomNav = document.getElementById('bottom-nav');
    if (bottomNav) bottomNav.classList.remove('hidden-nav');
    
    // Load daily items
    await loadTodayData();
  } else {
    store.state.isOnboarded = false;
    // Keep bottom nav hidden for onboarding
    const bottomNav = document.getElementById('bottom-nav');
    if (bottomNav) bottomNav.classList.add('hidden-nav');
  }
  
  // 2. Set store listeners for UI updates
  store.on('currentView', (newView) => {
    // Hide bottom nav in onboarding view
    const bottomNav = document.getElementById('bottom-nav');
    if (bottomNav) {
      if (newView === 'onboarding') {
        bottomNav.classList.add('hidden-nav');
      } else {
        bottomNav.classList.remove('hidden-nav');
      }
    }
    
    // Update active visual navigation highlight
    updateActiveNavTab(newView);
    
    // Close More menu drawer when changing views
    const moreMenu = document.getElementById('more-menu');
    if (moreMenu) {
      moreMenu.classList.remove('open');
      store.state.moreMenuOpen = false;
    }
    
    // Close modal if open
    window.hideModal();
  });

  store.on('isOnboarded', (isOnboarded) => {
    const bottomNav = document.getElementById('bottom-nav');
    if (bottomNav) {
      if (isOnboarded) {
        bottomNav.classList.remove('hidden-nav');
        loadTodayData();
      } else {
        bottomNav.classList.add('hidden-nav');
      }
    }
  });
  
  // 3. Initialize Hash SPA Router
  router.initRouter();
  
  // Force a navigation check
  const currentHash = window.location.hash.slice(1);
  if (!currentHash) {
    window.location.hash = store.state.isOnboarded ? 'dashboard' : 'onboarding';
  } else if (!store.state.isOnboarded && currentHash !== 'onboarding') {
    window.location.hash = 'onboarding';
  }
}

// Start the application
initApp();
