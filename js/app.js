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
  const menuToggleBtn = document.getElementById('menu-toggle-btn');
  const sidebarOverlay = document.getElementById('sidebar-overlay');
  const modalClose = document.getElementById('global-modal-close');
  const modalOverlay = document.getElementById('global-modal-overlay');
  
  // Toggle Sidebar Drawer on mobile
  if (menuToggleBtn) {
    menuToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('sidebar-open');
    });
  }
  
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', () => {
      document.body.classList.remove('sidebar-open');
    });
  }
  
  // Close sidebar on mobile navigation
  document.querySelectorAll('.sidebar-menu .menu-item').forEach(item => {
    item.addEventListener('click', () => {
      document.body.classList.remove('sidebar-open');
    });
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
  // Remove active state from all items in sidebar
  document.querySelectorAll('.sidebar-menu .menu-item').forEach(el => {
    el.classList.remove('active');
  });

  // Activate matching nav link
  const activeEl = document.getElementById(`nav-${view}`);
  if (activeEl) {
    activeEl.classList.add('active');
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
  
  const header = document.getElementById('mobile-header');
  const sidebar = document.getElementById('sidebar-nav');
  const layout = document.querySelector('.main-layout');

  function toggleSidebarVisibility(visible) {
    if (header && sidebar) {
      if (visible) {
        header.classList.remove('hidden');
        sidebar.classList.remove('hidden');
        if (layout) {
          layout.style.marginLeft = '';
          layout.style.paddingTop = '';
        }
      } else {
        header.classList.add('hidden');
        sidebar.classList.add('hidden');
        if (layout) {
          layout.style.marginLeft = '0';
          layout.style.paddingTop = '0';
        }
      }
    }
  }

  // 1. Fetch user profile from IndexedDB
  const profile = await db.getProfile();
  
  if (profile) {
    store.state.isOnboarded = true;
    store.state.user = { ...store.state.user, ...profile };
    
    // Calculate macro/calorie targets
    const targets = calculateAllTargets(store.state.user);
    store.state.user.macros = targets.macros;
    store.state.user.tdee = targets.tdee;
    
    // Show navigation layout
    toggleSidebarVisibility(true);
    
    // Load daily items
    await loadTodayData();
  } else {
    store.state.isOnboarded = false;
    // Hide navigation layout for onboarding
    toggleSidebarVisibility(false);
  }
  
  // 2. Set store listeners for UI updates
  store.on('currentView', (newView) => {
    // Hide navigation in onboarding view
    if (newView === 'onboarding') {
      toggleSidebarVisibility(false);
    } else {
      toggleSidebarVisibility(true);
    }
    
    // Update active visual navigation highlight
    updateActiveNavTab(newView);
    
    // Close modal if open
    window.hideModal();
  });

  store.on('isOnboarded', (isOnboarded) => {
    if (isOnboarded) {
      toggleSidebarVisibility(true);
      loadTodayData();
    } else {
      toggleSidebarVisibility(false);
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
