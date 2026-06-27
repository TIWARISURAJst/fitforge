/* ============================================================
   FitForge — Settings View
   Allows adjusting user profiles, switching units, and backing up/restoring data
   ============================================================ */

import db from '../db.js';
import store from '../store.js';
import { calculateAllTargets } from '../services/macroCalculator.js';

let storeUnsubscribe = null;
let installableListener = null;

export async function render(container) {
  if (storeUnsubscribe) storeUnsubscribe();
  storeUnsubscribe = store.on('*', () => {
    if (document.getElementById('settings-view')) {
      renderContent(container);
    }
  });

  if (installableListener) window.removeEventListener('pwa-installable', installableListener);
  installableListener = () => {
    if (document.getElementById('settings-view')) {
      renderContent(container);
    }
  };
  window.addEventListener('pwa-installable', installableListener);

  renderContent(container);
}

function renderContent(container) {
  const user = store.state.user;
  
  let displayHeight = user.height;
  let displayWeight = user.weight;
  
  if (user.units === 'imperial') {
    displayHeight = Math.round((user.height / 2.54) * 10) / 10;
    displayWeight = Math.round((user.weight * 2.20462) * 10) / 10;
  }

  container.innerHTML = `
    <div class="container view" id="settings-view">
      <div class="view-header">
        <div>
          <h1>Forge <span class="text-gradient">Settings</span></h1>
          <div class="subtitle">Update profile parameters, customize metrics, and manage database backups</div>
        </div>
      </div>

      <!-- User Profile Adjustments -->
      <div class="glass-card mb-lg">
        <div class="card-header">
          <div class="card-title">Profile Configuration</div>
        </div>
        
        <div class="flex flex-col gap-md">
          <div class="input-group">
            <label for="settings-name">Name</label>
            <input type="text" id="settings-name" class="input" value="${user.name}">
          </div>
          
          <div class="input-row">
            <div class="input-group">
              <label for="settings-age">Age (years)</label>
              <input type="number" id="settings-age" class="input" value="${user.age}">
            </div>
            
            <div class="input-group">
              <label for="settings-sex">Sex</label>
              <select id="settings-sex" class="input">
                <option value="male" ${user.sex === 'male' ? 'selected' : ''}>Male</option>
                <option value="female" ${user.sex === 'female' ? 'selected' : ''}>Female</option>
              </select>
            </div>
          </div>
          
          <div class="input-row">
            <div class="input-group">
              <label for="settings-height">Height (${user.units === 'metric' ? 'cm' : 'inches'})</label>
              <input type="number" id="settings-height" class="input" value="${displayHeight}">
            </div>
            
            <div class="input-group">
              <label for="settings-weight">Weight (${user.units === 'metric' ? 'kg' : 'lbs'})</label>
              <input type="number" id="settings-weight" class="input" step="0.1" value="${displayWeight}">
            </div>
          </div>

          <div class="input-group">
            <label for="settings-goal">Target Goal</label>
            <select id="settings-goal" class="input">
              <option value="cut" ${user.goal === 'cut' ? 'selected' : ''}>Cut (Fat Loss)</option>
              <option value="slowCut" ${user.goal === 'slowCut' ? 'selected' : ''}>Slow Cut (Preserve Muscle)</option>
              <option value="maintain" ${user.goal === 'maintain' ? 'selected' : ''}>Maintain Weight</option>
              <option value="slowBulk" ${user.goal === 'slowBulk' ? 'selected' : ''}>Lean Bulk (Build Muscle)</option>
              <option value="bulk" ${user.goal === 'bulk' ? 'selected' : ''}>Bulk (Gain Mass)</option>
            </select>
          </div>

          <div class="input-group">
            <label for="settings-activity">Daily Activity Level</label>
            <select id="settings-activity" class="input">
              <option value="sedentary" ${user.activityLevel === 'sedentary' ? 'selected' : ''}>Sedentary (Desk Job)</option>
              <option value="light" ${user.activityLevel === 'light' ? 'selected' : ''}>Lightly Active</option>
              <option value="moderate" ${user.activityLevel === 'moderate' ? 'selected' : ''}>Moderately Active</option>
              <option value="active" ${user.activityLevel === 'active' ? 'selected' : ''}>Very Active</option>
              <option value="veryActive" ${user.activityLevel === 'veryActive' ? 'selected' : ''}>Extremely Active</option>
            </select>
          </div>
          
          <button class="btn btn-primary btn-sm btn-block mt-xs" id="save-profile-settings-btn">
            Save Profile Configurations
          </button>
        </div>
      </div>

      <!-- App Preferences settings group -->
      <div class="glass-card mb-lg">
        <div class="card-header">
          <div class="card-title">Preferences Configuration</div>
        </div>
        
        <div class="settings-group" style="margin-bottom: 0;">
          <!-- Unit system settings item toggle -->
          <div class="settings-item" id="toggle-units-btn" style="padding: var(--space-sm) 0;">
            <div class="settings-item-left">
              <div class="settings-item-icon" style="background: rgba(124, 106, 255, 0.1); color: var(--accent);">⚖️</div>
              <div>
                <div class="settings-item-label">Unit System</div>
                <div class="settings-item-sub">Switch between Metric and Imperial</div>
              </div>
            </div>
            <div class="settings-item-value font-bold" style="color: var(--accent); text-transform: uppercase;">
              ${user.units === 'metric' ? 'Metric (cm, kg)' : 'Imperial (in, lbs)'}
            </div>
          </div>
        </div>
      </div>

      <!-- Database Backups and Sync Card -->
      <div class="glass-card mb-lg">
        <div class="card-header">
          <div class="card-title">Database Backup & Recovery</div>
        </div>
        
        <p class="text-sm text-secondary mb-md">All data is encrypted locally on this client. Create offline backups to ensure you don't lose progress photos or logged profiles.</p>
        
        <div class="flex gap-sm">
          <button class="btn btn-secondary btn-sm" style="flex: 1;" id="export-backup-btn">
            📤 Export JSON Backup
          </button>
          
          <button class="btn btn-secondary btn-sm" style="flex: 1;" id="trigger-import-btn">
            📥 Import Backup File
          </button>
          <input type="file" id="import-backup-file" class="hidden" accept=".json">
        </div>
      </div>

      <!-- PWA Standalone App Download Card -->
      <div class="glass-card mb-lg">
        <div class="card-header">
          <div class="card-title">FitForge Standalone App</div>
        </div>
        <p class="text-sm text-secondary mb-md">Install FitForge directly onto your mobile home screen or desktop taskbar to run as a fast, standalone application with full offline support.</p>
        
        ${window.deferredPrompt ? `
          <button class="btn btn-primary btn-block btn-sm" id="install-pwa-btn">
            📲 Download & Install App
          </button>
        ` : `
          <div class="glass-card card-accent text-center bg-info-glow" style="border-color: var(--accent); padding: var(--space-sm); margin-bottom: 0;">
            <div class="text-xs text-secondary">
              💡 <strong>To Install:</strong> Tap your browser's share icon <svg style="display:inline; width:12px; height:12px; vertical-align:middle; fill:none; stroke:currentColor;" viewBox="0 0 24 24"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" stroke-width="2"/><polyline points="16 6 12 2 8 6" stroke-width="2"/><line x1="12" y1="2" x2="12" y2="15" stroke-width="2"/></svg> and choose <strong>"Add to Home Screen"</strong> (iOS Safari) or select <strong>"Install app"</strong> from the browser settings menu.
            </div>
          </div>
        `}
      </div>

      <!-- Danger zone -->
      <div class="glass-card" style="border-color: rgba(255,107,138,0.3); box-shadow: 0 0 15px var(--danger-glow);">
        <div class="card-header">
          <div class="card-title" style="color: var(--danger);">Danger Zone</div>
        </div>
        <p class="text-sm text-secondary mb-md">Clearing the database will permanently purge your local logs, settings, and progress photo vault. This action is irreversible.</p>
        
        <button class="btn btn-danger btn-sm btn-block" id="clear-all-data-btn">
          🚨 Purge Database & Reset App
        </button>
      </div>

    </div>
  `;

  bindEvents(container);
}

function bindEvents(container) {
  // Save profile settings
  const saveBtn = document.getElementById('save-profile-settings-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      const name = document.getElementById('settings-name').value.trim();
      const age = parseInt(document.getElementById('settings-age').value) || 25;
      const sex = document.getElementById('settings-sex').value;
      const enteredHeight = parseFloat(document.getElementById('settings-height').value) || 170;
      const enteredWeight = parseFloat(document.getElementById('settings-weight').value) || 70;
      const goal = document.getElementById('settings-goal').value;
      const activityLevel = document.getElementById('settings-activity').value;
      
      if (!name) {
        window.showToast('Name missing', 'Please enter your name.', 'warning');
        return;
      }
      
      let height = enteredHeight;
      let weight = enteredWeight;
      if (store.state.user.units === 'imperial') {
        height = Math.round(enteredHeight * 2.54);
        weight = Math.round(enteredWeight / 2.20462 * 10) / 10;
      }
      
      const profile = {
        name,
        age,
        sex,
        height,
        weight,
        goal,
        activityLevel,
        units: store.state.user.units,
        bodyFat: store.state.user.bodyFat || 15
      };
      
      store.state.isLoading = true;
      
      try {
        await db.saveProfile(profile);
        
        // Recalculate targets
        const targets = calculateAllTargets(profile);
        
        store.batch(() => {
          store.state.user = {
            ...store.state.user,
            ...profile,
            macros: targets.macros,
            tdee: targets.tdee
          };
        });
        
        window.showToast('Settings Saved', 'Profile configuration updated.', 'success');
      } catch (e) {
        console.error('[Settings] Save failed:', e);
        window.showToast('Save Failed', 'Please verify inputs.', 'danger');
      } finally {
        store.state.isLoading = false;
      }
    });
  }

  // Toggle unit systems
  const toggleUnitsBtn = document.getElementById('toggle-units-btn');
  if (toggleUnitsBtn) {
    toggleUnitsBtn.addEventListener('click', async () => {
      const currentUnits = store.state.user.units;
      const nextUnits = currentUnits === 'metric' ? 'imperial' : 'metric';
      
      const profile = {
        ...store.state.user,
        units: nextUnits
      };
      
      // Save
      await db.saveProfile(profile);
      
      store.batch(() => {
        store.state.user.units = nextUnits;
      });
      
      window.showToast('Units System Switched', `Active units system: ${nextUnits}`, 'info');
      renderContent(container);
    });
  }

  // Export JSON backup
  const exportBtn = document.getElementById('export-backup-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async () => {
      try {
        const backupData = await db.exportAll();
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
        
        const dlAnchorElem = document.createElement('a');
        dlAnchorElem.setAttribute("href", dataStr);
        dlAnchorElem.setAttribute("download", `fitforge_backup_${new Date().toISOString().split('T')[0]}.json`);
        dlAnchorElem.click();
        
        window.showToast('Backup Created', 'JSON file download initiated.', 'success');
      } catch (error) {
        console.error('[Backup] Export failed:', error);
        window.showToast('Backup Failed', 'Could not export database contents.', 'danger');
      }
    });
  }

  // Trigger Import dialog
  const triggerImportBtn = document.getElementById('trigger-import-btn');
  const importFileInput = document.getElementById('import-backup-file');
  
  if (triggerImportBtn && importFileInput) {
    triggerImportBtn.addEventListener('click', () => importFileInput.click());
    importFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const data = JSON.parse(event.target.result);
            
            if (confirm('Importing this file will overwrite your current settings, weights, and logs. Progress photos metadata will also be restored. Proceed?')) {
              store.state.isLoading = true;
              
              await db.importAll(data);
              
              window.showToast('Import Complete', 'Database successfully restored. Reloading app...', 'success');
              
              // Force application reload to reboot state from IndexedDB
              setTimeout(() => {
                window.location.reload();
              }, 1500);
            }
          } catch (err) {
            console.error('[Backup] Import failed:', err);
            window.showToast('Import Failed', 'Selected file is not a valid JSON backup.', 'danger');
          }
        };
        reader.readAsText(file);
      }
    });
  }

  // Purge Database
  const purgeBtn = document.getElementById('clear-all-data-btn');
  if (purgeBtn) {
    purgeBtn.addEventListener('click', async () => {
      if (confirm('🚨 DANGER! This will permanently delete your profiles, water records, meals, workouts, sleep, and physical progress photos locally. This cannot be undone. Are you absolutely sure?')) {
        store.state.isLoading = true;
        
        try {
          await db.delete();
          window.showToast('Purge complete', 'App state cleared. Resetting onboarding split...', 'info');
          
          // Clear localStorage or cookies if any
          localStorage.clear();
          
          setTimeout(() => {
            window.location.hash = 'onboarding';
            window.location.reload();
          }, 1500);
        } catch (e) {
          console.error('[Purge] Reset failed:', e);
          window.showToast('Purge Failed', 'Please try clearing browser storage manually.', 'danger');
        }
      }
    });
  }

  // PWA Prompt trigger
  const installPwaBtn = document.getElementById('install-pwa-btn');
  if (installPwaBtn) {
    installPwaBtn.addEventListener('click', async () => {
      const promptEvent = window.deferredPrompt;
      if (!promptEvent) {
        window.showToast('Already Installed or Unsupported', 'FitForge might already be installed or your browser does not support quick installation.', 'warning');
        return;
      }
      // Show the install prompt
      promptEvent.prompt();
      // Wait for the user to respond to the prompt
      const { outcome } = await promptEvent.userChoice;
      console.log(`[PWA] User choice outcome: ${outcome}`);
      // Clear the deferred prompt, it can only be used once
      window.deferredPrompt = null;
      renderContent(container);
    });
  }
}

export function cleanup() {
  if (storeUnsubscribe) {
    storeUnsubscribe();
    storeUnsubscribe = null;
  }
  if (installableListener) {
    window.removeEventListener('pwa-installable', installableListener);
    installableListener = null;
  }
}
