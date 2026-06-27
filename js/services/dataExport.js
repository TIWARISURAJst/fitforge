/* ============================================================
   FitForge — Data Export/Import Service
   ============================================================ */

import db from '../db.js';

/**
 * Export all data as a downloadable JSON file
 */
export async function exportData() {
  try {
    const data = await db.exportAll();

    // Add metadata
    const exportData = {
      app: 'FitForge',
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      data
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `fitforge-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => URL.revokeObjectURL(url), 1000);

    return true;
  } catch (error) {
    console.error('[Export] Error:', error);
    return false;
  }
}

/**
 * Import data from a JSON file
 * @param {File} file - JSON file to import
 * @returns {Promise<boolean>} Success status
 */
export async function importData(file) {
  try {
    const text = await file.text();
    const importData = JSON.parse(text);

    if (!importData.app || importData.app !== 'FitForge') {
      throw new Error('Invalid FitForge backup file');
    }

    await db.importAll(importData.data);
    return true;
  } catch (error) {
    console.error('[Import] Error:', error);
    return false;
  }
}

/**
 * Clear all app data
 */
export async function clearAllData() {
  try {
    for (const table of db.tables) {
      await table.clear();
    }
    localStorage.removeItem('fitforge_onboarded');
    localStorage.removeItem('fitforge_recent_foods');
    return true;
  } catch (error) {
    console.error('[Clear] Error:', error);
    return false;
  }
}

export default { exportData, importData, clearAllData };
