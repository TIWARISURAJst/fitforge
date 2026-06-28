/* ============================================================
   FitForge — Hash-based SPA Router
   Handles view navigation with smooth transitions
   ============================================================ */

import store from './store.js';

const routes = {
  'dashboard':  () => import('./views/Dashboard.js'),
  'meals':      () => import('./views/MealTracker.js'),
  'workout':    () => import('./views/WorkoutLogger.js'),
  'planner':    () => import('./views/WorkoutPlanner.js'),
  'demos':      () => import('./views/ExerciseDemos.js'),
  'body':       () => import('./views/BodyMetrics.js'),
  'sleep':      () => import('./views/SleepTracker.js'),
  'hydration':  () => import('./views/Hydration.js'),
  'schedule':   () => import('./views/Schedule.js'),
  'photos':     () => import('./views/ProgressPhotos.js'),
  'settings':   () => import('./views/Settings.js'),
  'onboarding': () => import('./views/Onboarding.js'),
};

let currentModule = null;
let isTransitioning = false;

/**
 * Navigate to a view
 * @param {string} view - View name (matches routes keys)
 */
export function navigate(view) {
  if (isTransitioning) return;
  if (view === store.state.currentView && currentModule) return;

  window.location.hash = view;
}

/**
 * Get current view from hash
 */
function getViewFromHash() {
  const hash = window.location.hash.slice(1) || 'dashboard';
  return routes[hash] ? hash : 'dashboard';
}

/**
 * Render a view into the app container
 */
async function renderView(viewName) {
  const container = document.getElementById('app');
  if (!container) return;

  // Enforce onboarding check
  if (!store.state.isOnboarded && viewName !== 'onboarding') {
    window.location.hash = 'onboarding';
    return;
  }
  if (store.state.isOnboarded && viewName === 'onboarding') {
    window.location.hash = 'dashboard';
    return;
  }

  const loader = routes[viewName];
  if (!loader) {
    console.error(`[Router] Unknown view: ${viewName}`);
    return;
  }

  isTransitioning = true;

  // Cleanup current view
  if (currentModule && currentModule.cleanup) {
    try { currentModule.cleanup(); } catch (e) { console.error('[Router] Cleanup error:', e); }
  }

  // Fade out
  container.style.opacity = '0';
  container.style.transform = 'translateY(8px)';

  await new Promise(r => setTimeout(r, 150));

  try {
    // Load new view module
    const module = await loader();
    currentModule = module;

    // Store navigation state
    store.state.previousView = store.state.currentView;
    store.state.currentView = viewName;

    // Render — view module should export a render(container) function
    if (module.render) {
      container.innerHTML = '';
      await module.render(container);
    }

    // Fade in
    requestAnimationFrame(() => {
      container.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      container.style.opacity = '1';
      container.style.transform = 'translateY(0)';
    });

  } catch (error) {
    console.error(`[Router] Error loading view "${viewName}":`, error);
    container.innerHTML = `
      <div class="container view" style="opacity:1">
        <div class="empty-state">
          <div class="empty-icon">⚠️</div>
          <h3>Something went wrong</h3>
          <p>Could not load this page. Please try again.</p>
          <button class="btn btn-primary" onclick="location.hash='dashboard'">Go Home</button>
        </div>
      </div>
    `;
    container.style.opacity = '1';
    container.style.transform = 'translateY(0)';
  }

  isTransitioning = false;
}

/**
 * Initialize the router
 */
export function initRouter() {
  // Listen for hash changes
  window.addEventListener('hashchange', () => {
    const view = getViewFromHash();
    renderView(view);
  });

  // Initial render
  const initialView = getViewFromHash();
  renderView(initialView);
}

export default { navigate, initRouter };
