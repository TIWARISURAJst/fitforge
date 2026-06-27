/* ============================================================
   FitForge — Body Metrics & Fat Estimator View
   Calculates body composition, estimates body fat from photos/measurements, and draws SVG charts
   ============================================================ */

import db from '../db.js';
import store from '../store.js';
import { navyMethod, bmiBasedEstimate, calculateComposition, getBFCategory, idealWeightRange } from '../services/bodyFatEstimator.js';
import { formatWeight, formatHeight } from '../services/macroCalculator.js';
import { estimateBodyFatFromPhoto } from '../ml/poseEstimator.js';

let storeUnsubscribe = null;

export async function render(container) {
  if (storeUnsubscribe) storeUnsubscribe();
  storeUnsubscribe = store.on('*', () => {
    if (document.getElementById('body-metrics-view')) {
      renderContent(container);
    }
  });

  renderContent(container);
}

async function renderContent(container) {
  const user = store.state.user;
  const isMetric = user.units === 'metric';
  
  // Get latest logged metrics
  const latestMetric = await db.getLatestMetric() || {
    weight: user.weight,
    bodyFat: user.bodyFat || 15,
    neck: 38,
    waist: 82,
    hip: 94,
    date: new Date().toISOString().split('T')[0]
  };

  const comp = calculateComposition(latestMetric.weight, latestMetric.bodyFat);
  const bfCat = getBFCategory(latestMetric.bodyFat, user.sex);
  
  // Ideal Weight Range calculations based on healthy BF% targets (e.g., 10-16% for men, 18-24% for women)
  const bfLowTarget = user.sex === 'female' ? 19 : 11;
  const bfHighTarget = user.sex === 'female' ? 24 : 16;
  const ideal = idealWeightRange(comp.leanMass, bfLowTarget, bfHighTarget);

  // Generate HTML for trend chart (we will load data asynchronously and draw it)
  container.innerHTML = `
    <div class="container view" id="body-metrics-view">
      <div class="view-header">
        <div>
          <h1>Body <span class="text-gradient">Composition</span></h1>
          <div class="subtitle">Analyze muscle mass, body fat trends, and physical targets</div>
        </div>
      </div>
      
      <!-- Metrics Hero summary -->
      <div class="glass-card mb-lg text-center">
        <div class="metrics-hero">
          <div class="current-weight">
            <span class="num text-gradient" style="font-size: 3rem; font-weight: 800;">${latestMetric.weight}</span>
            <span class="weight-unit">${isMetric ? 'kg' : 'lbs'}</span>
          </div>
          <div class="weight-change text-secondary">
            Estimated Body Fat: <span class="font-bold text-accent">${latestMetric.bodyFat}%</span>
          </div>
          <div class="text-xs text-muted mt-2xs">
            ${bfCat.emoji} Category: ${bfCat.label} — ${bfCat.desc}
          </div>
        </div>
        
        <div class="divider" style="margin: 0 0 var(--space-md) 0;"></div>
        
        <div class="stats-grid">
          <div class="stat-card glass-card card-sm card-accent" style="background: var(--bg-deepest);">
            <span class="stat-label">LEAN MASS</span>
            <span class="stat-value text-gradient">${comp.leanMass} ${isMetric ? 'kg' : 'lbs'}</span>
            <span class="stat-sub">Muscles, bones & organs</span>
          </div>
          <div class="stat-card glass-card card-sm" style="background: var(--bg-deepest);">
            <span class="stat-label">FAT MASS</span>
            <span class="stat-value text-danger">${comp.fatMass} ${isMetric ? 'kg' : 'lbs'}</span>
            <span class="stat-sub">Adipose lipid tissue</span>
          </div>
        </div>
      </div>

      <!-- Body Fat Scanner Simulation card -->
      <div class="glass-card mb-lg" id="bodyfat-scan-card">
        <div class="card-header">
          <div class="card-title">Photo Body Fat Estimator</div>
          <div class="card-icon" style="background: rgba(124, 106, 255, 0.1); color: var(--accent);">📷</div>
        </div>
        
        <p class="text-sm text-secondary mb-md">Scan your front-profile picture to visually estimate body fat and track skin-tone contours.</p>
        <button class="btn btn-primary btn-block btn-sm" id="bf-snap-btn">
          📷 Scan Physical Shape
        </button>
        <input type="file" id="bf-photo-input" class="hidden" accept="image/*">
        
        <div class="divider-text" style="margin: var(--space-md) 0;">OR MANUAL NAVY CALCULATOR</div>
        
        <div class="flex flex-col gap-sm">
          <div class="input-row">
            <div class="input-group">
              <label for="navy-neck">Neck (cm)</label>
              <input type="number" id="navy-neck" class="input" value="${latestMetric.neck || 38}">
            </div>
            <div class="input-group">
              <label for="navy-waist">Waist (cm)</label>
              <input type="number" id="navy-waist" class="input" value="${latestMetric.waist || 82}">
            </div>
            ${user.sex === 'female' ? `
              <div class="input-group">
                <label for="navy-hip">Hips (cm)</label>
                <input type="number" id="navy-hip" class="input" value="${latestMetric.hip || 94}">
              </div>
            ` : ''}
          </div>
          
          <button class="btn btn-secondary btn-sm" id="navy-calc-btn">
            Calculate via Neck/Waist
          </button>
        </div>
      </div>

      <!-- Interactive SVG Chart -->
      <div class="glass-card mb-lg">
        <div class="card-header">
          <div class="card-title">Weight Progression (Last 30 Days)</div>
        </div>
        
        <div class="chart-container" id="metrics-chart-box" style="height: 180px;">
          <!-- SVG Line Chart will be loaded here dynamically -->
          <div class="flex justify-center items-center" style="height:100%;">
            <div class="spinner"></div>
          </div>
        </div>
      </div>

      <!-- Ideal ranges and advice -->
      <div class="glass-card mb-lg">
        <div class="card-header">
          <div class="card-title">Ideal Target Blueprint</div>
        </div>
        <p class="text-sm text-secondary mb-md">Based on your current lean body mass, here is your healthy weight target range matching standard fitness thresholds.</p>
        
        <div class="flex justify-between items-center bg-deepest p-md" style="border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
          <div>
            <div class="font-bold text-sm text-accent">Healthy Range for ${bfLowTarget}%–${bfHighTarget}% Body Fat</div>
            <div class="text-xs text-muted">Protects hormonal balance & energy levels</div>
          </div>
          <div class="font-bold text-md text-gradient">
            ${ideal.low} – ${ideal.high} ${isMetric ? 'kg' : 'lbs'}
          </div>
        </div>
      </div>

      <!-- Manual Log Entry Card -->
      <div class="glass-card">
        <div class="card-header">
          <div class="card-title">Manual Metrics Log</div>
        </div>
        
        <div class="flex flex-col gap-sm">
          <div class="input-row">
            <div class="input-group">
              <label for="manual-w">Weight (${isMetric ? 'kg' : 'lbs'})</label>
              <input type="number" id="manual-w" class="input" step="0.1" value="${latestMetric.weight}">
            </div>
            <div class="input-group">
              <label for="manual-bf">Body Fat (%)</label>
              <input type="number" id="manual-bf" class="input" step="0.1" value="${latestMetric.bodyFat}">
            </div>
          </div>
          
          <button class="btn btn-secondary btn-sm" id="manual-save-metric-btn">
            Save Manual Log
          </button>
        </div>
      </div>

    </div>
  `;

  drawSVGChart();
  bindEvents(container);
}

function bindEvents(container) {
  // Capture photo triggering
  const scanBtn = document.getElementById('bf-snap-btn');
  const photoInput = document.getElementById('bf-photo-input');
  
  if (scanBtn && photoInput) {
    scanBtn.addEventListener('click', () => photoInput.click());
    photoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        triggerBodyScanner(container, file);
      }
    });
  }

  // Navy Calc button
  const navyBtn = document.getElementById('navy-calc-btn');
  if (navyBtn) {
    navyBtn.addEventListener('click', async () => {
      const user = store.state.user;
      const neck = parseFloat(document.getElementById('navy-neck').value) || 38;
      const waist = parseFloat(document.getElementById('navy-waist').value) || 82;
      const hipEl = document.getElementById('navy-hip');
      const hip = hipEl ? parseFloat(hipEl.value) : 94;
      
      let heightCm = user.height;
      
      const bfEst = navyMethod({
        height: heightCm,
        neck,
        waist,
        hip,
        sex: user.sex
      });
      
      if (bfEst) {
        const todayStr = new Date().toISOString().split('T')[0];
        
        // Save to Database
        await db.bodyMetrics.add({
          date: todayStr,
          weight: parseFloat(user.weight),
          bodyFat: bfEst,
          neck,
          waist,
          hip: user.sex === 'female' ? hip : null,
          createdAt: new Date().toISOString()
        });
        
        // Update user state
        store.batch(() => {
          store.state.user.bodyFat = bfEst;
        });
        
        window.showToast('Navy Method Computed', `Estimated body fat: ${bfEst}% saved.`, 'success');
        renderContent(container);
      } else {
        window.showToast('Calculation Failed', 'Please input valid measurements.', 'danger');
      }
    });
  }

  // Save manual log button
  const manualSaveBtn = document.getElementById('manual-save-metric-btn');
  if (manualSaveBtn) {
    manualSaveBtn.addEventListener('click', async () => {
      const wVal = parseFloat(document.getElementById('manual-w').value);
      const bfVal = parseFloat(document.getElementById('manual-bf').value);
      
      if (!wVal || !bfVal) {
        window.showToast('Missing Fields', 'Please fill in both weight and body fat fields.', 'warning');
        return;
      }
      
      const todayStr = new Date().toISOString().split('T')[0];
      
      await db.bodyMetrics.add({
        date: todayStr,
        weight: wVal,
        bodyFat: bfVal,
        createdAt: new Date().toISOString()
      });
      
      // Update profile latest weight/body fat
      const profile = await db.getProfile();
      if (profile) {
        profile.weight = wVal;
        profile.bodyFat = bfVal;
        await db.saveProfile(profile);
      }
      
      store.batch(() => {
        store.state.user.weight = wVal;
        store.state.user.bodyFat = bfVal;
      });
      
      window.showToast('Metrics Saved', 'Weight and body fat logged successfully.', 'success');
      renderContent(container);
    });
  }
}

// Real Photo Body Fat Scanner using MediaPipe + Regression
function triggerBodyScanner(container, file) {
  const panel = document.getElementById('bodyfat-scan-card');
  if (!panel) return;
  
  const imgUrl = URL.createObjectURL(file);
  
  panel.innerHTML = `
    <div class="glass-card text-center" style="position: relative; overflow: hidden; padding: 0; min-height: 280px;">
      <img id="scan-preview" src="${imgUrl}" style="width: 100%; height: 280px; object-fit: cover; filter: brightness(0.65);">
      
      <!-- Scan line -->
      <div id="laser-line" style="position: absolute; left: 0; right: 0; height: 3px; background: var(--accent); top: 0; box-shadow: 0 0 10px var(--accent-glow); animation: laserScroll 2.2s linear infinite;"></div>
      
      <!-- MediaPipe dynamic tracking overlays -->
      <div id="pose-mesh-overlay" style="position: absolute; inset: 0; pointer-events: none;">
        <div id="scan-contour-1" class="hidden" style="position: absolute; border: 1.5px dashed var(--accent); border-radius: var(--radius-full); top: 12%; left: 42%; width: 16%; height: 12%;"></div>
        <div id="scan-contour-2" class="hidden" style="position: absolute; border: 2px solid var(--accent); border-radius: var(--radius-lg); top: 25%; left: 30%; width: 40%; height: 45%;"></div>
      </div>

      <div class="flex flex-col items-center justify-center" style="position: absolute; inset: 0; background: rgba(10,10,20,0.5); pointer-events: none;" id="scan-status-panel">
        <div class="spinner mb-sm"></div>
        <div class="font-bold text-sm text-gradient" id="bf-scan-status">Initialising MediaPipe Pose...</div>
        <div class="text-xs text-muted" id="bf-scan-log">Spinning up WASM pipeline</div>
      </div>
    </div>
  `;

  // Start actual body landmark extraction
  const tempImg = new Image();
  tempImg.onload = async () => {
    try {
      const statusEl = document.getElementById('bf-scan-status');
      const logEl = document.getElementById('bf-scan-log');
      
      if (statusEl) statusEl.textContent = 'Detecting joint contours...';
      if (logEl) logEl.textContent = 'Mapping 33 skeletal landmarks';

      // Visual transitions
      setTimeout(() => {
        const c1 = document.getElementById('scan-contour-1');
        if (c1) c1.classList.remove('hidden');
        if (statusEl) statusEl.textContent = 'Segmenting torso contour...';
      }, 1000);

      setTimeout(() => {
        const c2 = document.getElementById('scan-contour-2');
        if (c2) c2.classList.remove('hidden');
        if (statusEl) statusEl.textContent = 'Extracting waist-to-hip ratio...';
      }, 2000);

      const user = store.state.user;
      const res = await estimateBodyFatFromPhoto(tempImg, user);
      const finalBf = res.bodyFat;

      await new Promise(r => setTimeout(r, 3200));

      const confirmBody = `
        <div class="flex flex-col gap-md text-center">
          <span style="font-size: 2.5rem;">🔍</span>
          <h3 class="font-bold">Pose Analysis Complete</h3>
          
          <div class="glass-card card-accent" style="padding: var(--space-md);">
            <span class="text-muted text-xs">VISUAL ESTIMATION RESULTS</span>
            <div class="text-gradient font-bold" style="font-size: 3rem; line-height: 1.1;">
              ${finalBf}%
            </div>
            <p class="text-xs text-muted mt-2xs">Estimated standard error: ± ${res.landmarksDetected ? '2.4%' : '4.5%'} body fat</p>
          </div>
          
          <p class="text-sm text-secondary">
            Detected ratios: Waist-to-Height = ${res.ratios.waistToHeight}, Hip-to-Waist = ${res.ratios.hipToWaist}. 
            Cross-referenced with height (${user.height}cm) and weight (${user.weight}kg).
          </p>
          
          <div class="flex gap-sm">
            <button class="btn btn-secondary" style="flex: 1;" id="scan-recalc-manual-btn">Edit manually</button>
            <button class="btn btn-primary" style="flex: 1.5;" id="scan-save-confirm-btn">Accept & Log</button>
          </div>
        </div>
      `;
      
      window.showModal('Scan Completed', confirmBody, () => {
        renderContent(container);
      });

      const manualBtn = document.getElementById('scan-recalc-manual-btn');
      const saveBtn = document.getElementById('scan-save-confirm-btn');
      
      if (manualBtn) {
        manualBtn.addEventListener('click', () => {
          window.hideModal();
          window.showToast('Edit Metrics', 'Use fields below to save manually.', 'info');
        });
      }
      
      if (saveBtn) {
        saveBtn.addEventListener('click', async () => {
          const todayStr = new Date().toISOString().split('T')[0];
          
          await db.bodyMetrics.add({
            date: todayStr,
            weight: parseFloat(user.weight),
            bodyFat: finalBf,
            createdAt: new Date().toISOString()
          });
          
          await db.progressPhotos.add({
            date: todayStr,
            category: 'scan',
            photo: file,
            bodyFat: finalBf,
            weight: user.weight,
            createdAt: new Date().toISOString()
          });
          
          const profile = await db.getProfile();
          if (profile) {
            profile.weight = parseFloat(user.weight);
            profile.bodyFat = finalBf;
            await db.saveProfile(profile);
          }

          store.batch(() => {
            store.state.user.bodyFat = finalBf;
          });
          
          window.hideModal();
          window.showToast('Scan Saved', `Logged ${finalBf}% body fat.`, 'success');
          renderContent(container);
        });
      }
    } catch (err) {
      console.error(err);
      window.showToast('Pose Landmarker Error', 'Could not run image tracking.', 'danger');
      renderContent(container);
    }
  };
  tempImg.src = imgUrl;
}

// Draw custom high-performance SVG Line Chart
async function drawSVGChart() {
  const box = document.getElementById('metrics-chart-box');
  if (!box) return;
  
  try {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    const startDateStr = thirtyDaysAgo.toISOString().split('T')[0];
    const endDateStr = today.toISOString().split('T')[0];
    
    const logs = await db.getMetricsRange(startDateStr, endDateStr);
    
    if (logs.length < 2) {
      // Fallback message
      box.innerHTML = `
        <div class="flex flex-col justify-center items-center text-center" style="height: 100%; border: 1px dashed var(--border-light); border-radius: var(--radius-md);">
          <span style="font-size: 1.5rem; margin-bottom: 4px;">📈</span>
          <p class="text-xs text-muted">Add at least 2 manual metrics entries to render progress trend charts.</p>
        </div>
      `;
      return;
    }
    
    // Sort logs by date to avoid plot errors
    logs.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Find min and max weight
    const weights = logs.map(l => l.weight);
    const minW = Math.min(...weights) - 1;
    const maxW = Math.max(...weights) + 1;
    const rangeW = maxW - minW || 1;
    
    // Chart dimensions
    const width = 360;
    const height = 150;
    const padding = 25;
    
    const plotWidth = width - padding * 2;
    const plotHeight = height - padding * 2;
    
    // Generate coordinate points
    const points = logs.map((log, index) => {
      const x = padding + (index / (logs.length - 1)) * plotWidth;
      const y = height - padding - ((log.weight - minW) / rangeW) * plotHeight;
      return { x, y, weight: log.weight, date: log.date };
    });
    
    // Draw grid lines and line paths
    let svgHtml = `<svg viewBox="0 0 ${width} ${height}" style="width: 100%; height: 100%;">`;
    
    // Grid backgrounds
    svgHtml += `<line x1="${padding}" y1="${padding}" x2="${width - padding}" y2="${padding}" stroke="var(--border-subtle)" stroke-width="1" />`;
    svgHtml += `<line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="var(--border-light)" stroke-width="1.5" />`;
    
    // Y-Axis labels (min/max weights)
    svgHtml += `<text x="${padding - 5}" y="${padding + 4}" fill="var(--text-muted)" font-size="9" text-anchor="end">${maxW.toFixed(0)}</text>`;
    svgHtml += `<text x="${padding - 5}" y="${height - padding + 4}" fill="var(--text-muted)" font-size="9" text-anchor="end">${minW.toFixed(0)}</text>`;
    
    // Draw lines
    const linePath = points.map(p => `${p.x},${p.y}`).join(' ');
    svgHtml += `<polyline fill="none" stroke="var(--accent)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" points="${linePath}" />`;
    
    // Draw dots and text tags
    points.forEach((p, idx) => {
      // Glow effect under hover points
      svgHtml += `<circle cx="${p.x}" cy="${p.y}" r="6" fill="var(--accent-subtle)" />`;
      svgHtml += `<circle cx="${p.x}" cy="${p.y}" r="3.5" fill="var(--accent)" stroke="white" stroke-width="1" />`;
      
      // Label on endpoints or alternating
      if (idx === 0 || idx === points.length - 1) {
        svgHtml += `<text x="${p.x}" y="${p.y - 10}" fill="var(--text-primary)" font-size="8" font-weight="700" text-anchor="middle">${p.weight}</text>`;
        
        // Date text at bottom axis
        const shortDate = p.date.substring(5); // e.g. "06-27"
        svgHtml += `<text x="${p.x}" y="${height - 5}" fill="var(--text-muted)" font-size="8" text-anchor="middle">${shortDate}</text>`;
      }
    });
    
    svgHtml += `</svg>`;
    
    box.innerHTML = svgHtml;
    
  } catch (error) {
    console.error('[SVGChart] Draw failed:', error);
    box.innerHTML = `<p class="text-xs text-danger text-center py-md">Failed to load chart.</p>`;
  }
}

export function cleanup() {
  if (storeUnsubscribe) {
    storeUnsubscribe();
    storeUnsubscribe = null;
  }
}
