/* ============================================================
   FitForge — Progress Photos View
   Manages local secure photo vault and side-by-side progress comparisons
   ============================================================ */

import db from '../db.js';
import store from '../store.js';

let storeUnsubscribe = null;
let compareSelectMode = false;
let selectedPhotosToCompare = []; // array of photo objects

export async function render(container) {
  if (storeUnsubscribe) storeUnsubscribe();
  storeUnsubscribe = store.on('*', () => {
    if (document.getElementById('progress-photos-view')) {
      renderContent(container);
    }
  });

  renderContent(container);
}

async function renderContent(container) {
  const photos = await db.progressPhotos.orderBy('date').reverse().toArray();

  container.innerHTML = `
    <div class="container view" id="progress-photos-view">
      <div class="view-header">
        <div>
          <h1>Progress <span class="text-gradient">Photos</span></h1>
          <div class="subtitle">Secure local physical progression vault</div>
        </div>
      </div>
      
      <!-- Privacy Statement Alert -->
      <div class="glass-card mb-lg" style="border-color: var(--success-glow); background: rgba(52, 217, 163, 0.03);">
        <div class="flex gap-sm items-start">
          <span style="font-size: 1.4rem;">🔐</span>
          <div>
            <div class="font-bold text-xs text-success mb-2xs" style="text-transform: uppercase;">Encrypted Local Vault</div>
            <p class="text-xs text-secondary" style="line-height: 1.4;">All physical snaps are saved directly inside your browser database (IndexedDB) as raw blobs. Your photos never leave your device and are never transmitted to external cloud systems.</p>
          </div>
        </div>
      </div>

      <!-- Comparison Slider Platform -->
      ${selectedPhotosToCompare.length === 2 ? `
        <div class="glass-card mb-lg text-center">
          <div class="card-header">
            <div class="card-title">Progression Comparison</div>
            <button class="btn btn-ghost btn-sm text-danger" id="clear-compare-btn">Reset</button>
          </div>
          
          <div class="photo-compare">
            <div class="photo-compare-item">
              <img src="${URL.createObjectURL(selectedPhotosToCompare[1].photo)}" style="aspect-ratio:3/4; object-fit:cover; width:100%; border-radius: var(--radius-md);">
              <span class="badge badge-accent" style="position:absolute; bottom: 8px; left: 8px;">Before: ${selectedPhotosToCompare[1].date} (${selectedPhotosToCompare[1].weight}kg)</span>
            </div>
            <div class="photo-compare-item">
              <img src="${URL.createObjectURL(selectedPhotosToCompare[0].photo)}" style="aspect-ratio:3/4; object-fit:cover; width:100%; border-radius: var(--radius-md);">
              <span class="badge badge-success" style="position:absolute; bottom: 8px; left: 8px;">After: ${selectedPhotosToCompare[0].date} (${selectedPhotosToCompare[0].weight}kg)</span>
            </div>
          </div>
        </div>
      ` : ''}

      <!-- Add snaps and Compare commands -->
      <div class="flex gap-md mb-lg">
        <button class="btn btn-primary" style="flex: 1.5;" id="trigger-upload-photo-btn">
          📷 Add Progression Snap
        </button>
        <input type="file" id="progress-photo-file" class="hidden" accept="image/*">
        
        <button class="btn btn-secondary ${compareSelectMode ? 'card-accent' : ''}" style="flex: 1;" id="compare-mode-btn">
          ${compareSelectMode ? 'Cancel' : 'Compare snaps'}
        </button>
      </div>

      ${compareSelectMode ? `
        <div class="glass-card mb-md py-sm bg-accent-subtle text-center text-xs font-semibold text-accent animate-in" style="border-color: var(--border-accent);">
          Select 2 photos from the gallery below to match them side-by-side
        </div>
      ` : ''}

      <!-- Gallery Grid -->
      <div class="glass-card">
        <div class="card-header">
          <div class="card-title">Snaps Gallery (${photos.length})</div>
        </div>
        
        ${photos.length === 0 ? `
          <div class="empty-state">
            <div class="empty-icon">📷</div>
            <h3>No snaps logged</h3>
            <p>Upload progression photos periodically to visually track changes.</p>
          </div>
        ` : `
          <div class="photo-grid">
            ${photos.map(p => {
              const objectUrl = URL.createObjectURL(p.photo);
              const isSelected = selectedPhotosToCompare.some(sp => sp.id === p.id);
              return `
                <div class="photo-item ${isSelected ? 'selected-compare-item' : ''}" data-photo-id="${p.id}" style="${isSelected ? 'border: 3px solid var(--accent); opacity: 0.8;' : ''}">
                  <img src="${objectUrl}" alt="Progress photo">
                  <div class="photo-date">${p.date} (${p.weight} kg)</div>
                  
                  ${compareSelectMode ? `
                    <div style="position: absolute; top: 6px; right: 6px; width: 18px; height: 18px; border-radius:50%; border:2px solid white; display:flex; align-items:center; justify-content:center; background: ${isSelected ? 'var(--accent)' : 'rgba(0,0,0,0.5)'}; font-size:0.55rem; font-weight:700; color:white;">
                      ${isSelected ? '✓' : ''}
                    </div>
                  ` : `
                    <button class="delete-photo-btn" data-photo-id="${p.id}" style="position: absolute; top: 4px; right: 4px; padding: 2px; border-radius:50%; background:rgba(255,0,0,0.6); width:24px; height:24px; font-size:0.6rem;">
                      ❌
                    </button>
                  `}
                </div>
              `;
            }).join('')}
          </div>
        `}
      </div>

    </div>
  `;

  bindEvents(container, photos);
}

function bindEvents(container, photos) {
  // Photo upload trigger
  const triggerBtn = document.getElementById('trigger-upload-photo-btn');
  const fileInput = document.getElementById('progress-photo-file');
  
  if (triggerBtn && fileInput) {
    triggerBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (file) {
        const user = store.state.user;
        const todayStr = new Date().toISOString().split('T')[0];
        
        await db.progressPhotos.add({
          date: todayStr,
          category: 'manual',
          photo: file,
          bodyFat: user.bodyFat || 15,
          weight: user.weight || 70,
          createdAt: new Date().toISOString()
        });
        
        window.showToast('Photo Saved', 'Progression snap uploaded successfully.', 'success');
        renderContent(container);
      }
    });
  }

  // Toggle compare select mode
  const compareBtn = document.getElementById('compare-mode-btn');
  if (compareBtn) {
    compareBtn.addEventListener('click', () => {
      compareSelectMode = !compareSelectMode;
      if (!compareSelectMode) selectedPhotosToCompare = [];
      renderContent(container);
    });
  }

  // Clear comparison
  const clearCompareBtn = document.getElementById('clear-compare-btn');
  if (clearCompareBtn) {
    clearCompareBtn.addEventListener('click', () => {
      selectedPhotosToCompare = [];
      renderContent(container);
    });
  }

  // Deleting photo or selecting photo for comparison
  document.querySelectorAll('.photo-item').forEach(item => {
    item.addEventListener('click', async (e) => {
      const photoId = parseInt(item.getAttribute('data-photo-id'));
      const photo = photos.find(p => p.id === photoId);
      if (!photo) return;
      
      if (compareSelectMode) {
        e.preventDefault();
        
        const existsIdx = selectedPhotosToCompare.findIndex(sp => sp.id === photoId);
        if (existsIdx >= 0) {
          // Deselect
          selectedPhotosToCompare.splice(existsIdx, 1);
        } else {
          // Select if length < 2
          if (selectedPhotosToCompare.length < 2) {
            selectedPhotosToCompare.push(photo);
          } else {
            // Replace the oldest selection
            selectedPhotosToCompare.shift();
            selectedPhotosToCompare.push(photo);
          }
        }
        
        renderContent(container);
      }
    });
  });

  // Direct delete button listener (when not in compare mode)
  document.querySelectorAll('.delete-photo-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const photoId = parseInt(btn.getAttribute('data-photo-id'));
      
      if (confirm('Are you sure you want to permanently delete this photo from your local vault?')) {
        await db.progressPhotos.delete(photoId);
        window.showToast('Snap Deleted', 'Deleted from local database.', 'info');
        renderContent(container);
      }
    });
  });
}

export function cleanup() {
  if (storeUnsubscribe) {
    storeUnsubscribe();
    storeUnsubscribe = null;
  }
}
