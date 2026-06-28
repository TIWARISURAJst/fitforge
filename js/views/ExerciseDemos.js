/* ============================================================
   FitForge — Exercise Demos View
   Displays video demonstrations, form tips, and safety protocols
   ============================================================ */

import store from '../store.js';
import { EXERCISE_DB, searchExercises } from '../data/exerciseDatabase.js';

let activeCategory = 'All';

const MUSCLES = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Full Body'];

export async function render(container) {
  renderContent(container);
}

function renderContent(container) {
  // Filter exercises
  let exercises = EXERCISE_DB;
  if (activeCategory !== 'All') {
    exercises = EXERCISE_DB.filter(e => e.muscle.toLowerCase() === activeCategory.toLowerCase());
  }

  container.innerHTML = `
    <div class="container view" id="demos-view">
      <div class="view-header">
        <div>
          <h1>Exercise <span class="text-gradient">Demos</span></h1>
          <div class="subtitle">Watch video form guides and check safety tips</div>
        </div>
      </div>

      <!-- Search Box -->
      <div class="input-icon-wrapper mb-lg">
        <input type="text" id="demo-search-input" class="input" placeholder="Search form guides...">
        <span class="input-icon">🔍</span>
      </div>

      <!-- Muscle Category Tabs -->
      <div class="tabs mb-lg" style="overflow-x: auto; white-space: nowrap; flex-wrap: nowrap; display: flex; justify-content: flex-start;">
        ${MUSCLES.map(m => `
          <div class="tab ${activeCategory === m ? 'active' : ''}" data-cat="${m}" style="flex: 0 0 auto;">
            ${m}
          </div>
        `).join('')}
      </div>

      <!-- Exercises Grid -->
      <div class="grid grid-2 sm-grid-3 gap-md" id="demos-grid">
        ${renderGridHTML(exercises)}
      </div>
    </div>
  `;

  bindEvents(container);
}

function renderGridHTML(exercises) {
  if (exercises.length === 0) {
    return `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-icon">🔍</div>
        <h3>No exercises found</h3>
        <p>Try searching for a different term or muscle group.</p>
      </div>
    `;
  }

  return exercises.map(ex => `
    <div class="glass-card exercise-demo-card" data-id="${ex.id}" style="cursor: pointer; transition: transform 0.2s ease;">
      <div class="font-bold text-gradient text-sm mb-2xs">${ex.name}</div>
      <div class="text-xs text-muted mb-xs" style="text-transform: capitalize;">${ex.muscle} • ${ex.equipment}</div>
      <div class="text-2xs text-secondary line-clamp-2" style="line-height: 1.4;">${ex.desc}</div>
      
      <div class="flex justify-between items-center mt-sm">
        <span class="badge ${ex.type === 'compound' ? 'badge-accent' : 'badge-secondary'}" style="font-size: 0.6rem;">${ex.type}</span>
        <span class="text-accent text-xs font-bold" style="display: flex; align-items: center; gap: 2px;">▶️ Watch</span>
      </div>
    </div>
  `).join('');
}

function bindEvents(container) {
  // Category tabs
  container.querySelectorAll('.tabs .tab').forEach(tab => {
    tab.addEventListener('click', () => {
      activeCategory = tab.getAttribute('data-cat');
      renderContent(container);
    });
  });

  // Search input
  const searchInput = document.getElementById('demo-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase().trim();
      let filtered = EXERCISE_DB;
      
      if (activeCategory !== 'All') {
        filtered = filtered.filter(e => e.muscle.toLowerCase() === activeCategory.toLowerCase());
      }
      
      if (query) {
        filtered = filtered.filter(e => e.name.toLowerCase().includes(query) || e.desc.toLowerCase().includes(query));
      }
      
      const grid = document.getElementById('demos-grid');
      if (grid) grid.innerHTML = renderGridHTML(filtered);
      bindCardClicks(container);
    });
  }

  bindCardClicks(container);
}

function bindCardClicks(container) {
  // Card clicks to open modal video player
  container.querySelectorAll('.exercise-demo-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      const ex = EXERCISE_DB.find(e => e.id === id);
      if (ex) {
        openVideoModal(ex);
      }
    });
  });
}

function openVideoModal(ex) {
  const modalHtml = `
    <div class="flex flex-col gap-md">
      <!-- 16:9 Video Container -->
      <div class="video-container">
        <iframe src="${ex.videoUrl}?autoplay=1&rel=0" 
                title="${ex.name} Form Guide"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
        </iframe>
      </div>
      
      <div>
        <div class="font-bold text-sm text-secondary mb-2xs">Description</div>
        <p class="text-sm text-secondary" style="line-height: 1.5;">${ex.desc}</p>
      </div>

      <!-- Safety guidelines box -->
      <div class="exercise-safety-box">
        <h4>🚨 Safety Checklist</h4>
        <p class="text-xs text-secondary" style="line-height: 1.4; margin-top: 4px;">${ex.safetyTips}</p>
      </div>
    </div>
  `;

  window.showModal(`${ex.name} Form Guide`, modalHtml);
}

export function cleanup() {
  // No persistent event listeners
}
