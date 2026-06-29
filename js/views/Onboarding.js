/* ============================================================
   FitForge — Onboarding View
   Multi-step onboarding flow with dynamic macros calculation & photo scanning simulation
   ============================================================ */

import db from '../db.js';
import store from '../store.js';
import { calculateAllTargets, ACTIVITY_LEVELS, GOALS } from '../services/macroCalculator.js';
import { navyMethod, bmiBasedEstimate, getBFCategory } from '../services/bodyFatEstimator.js';

let currentStep = 1;
const totalSteps = 6;
let onboardingData = {
  name: '',
  age: 25,
  sex: 'male',
  height: 170, // cm
  weight: 70,  // kg
  activityLevel: 'moderate',
  goal: 'maintain',
  trainingDays: 4,
  dietPreferences: [],
  units: 'metric', // metric, imperial
  neck: 38,
  waist: 82,
  hip: 94,
  bodyFat: 15,
  photoBlob: null
};

export async function render(container) {
  currentStep = 1;
  renderStep(container);
}

function renderStep(container) {
  let stepContent = '';
  
  if (currentStep === 1) {
    stepContent = `
      <div class="animate-in">
        <h1>Welcome to <span class="text-gradient">FitForge</span></h1>
        <p class="step-description">Let's craft your custom profile. We'll start with your basic details.</p>
        
        <div class="flex flex-col gap-md">
          <div class="input-group">
            <label for="ob-name">What should we call you?</label>
            <input type="text" id="ob-name" class="input" placeholder="Enter your name" value="${onboardingData.name}">
          </div>
          
          <div class="input-row">
            <div class="input-group">
              <label for="ob-age">Age (years)</label>
              <input type="number" id="ob-age" class="input" min="15" max="100" value="${onboardingData.age}">
            </div>
            
            <div class="input-group">
              <label for="ob-sex">Biological Sex</label>
              <select id="ob-sex" class="input">
                <option value="male" ${onboardingData.sex === 'male' ? 'selected' : ''}>Male</option>
                <option value="female" ${onboardingData.sex === 'female' ? 'selected' : ''}>Female</option>
              </select>
            </div>
          </div>
          
          <div class="input-group">
            <label for="ob-units">Preferred Units System</label>
            <select id="ob-units" class="input">
              <option value="metric" ${onboardingData.units === 'metric' ? 'selected' : ''}>Metric (cm, kg)</option>
              <option value="imperial" ${onboardingData.units === 'imperial' ? 'selected' : ''}>Imperial (ft/in, lbs)</option>
            </select>
          </div>
        </div>
      </div>
    `;
  } else if (currentStep === 2) {
    const isMetric = onboardingData.units === 'metric';
    stepContent = `
      <div class="animate-in">
        <h1>Your <span class="text-gradient">Dimensions</span></h1>
        <p class="step-description">Height and weight inputs help us determine your baseline metabolic rate.</p>
        
        <div class="flex flex-col gap-md">
          ${isMetric ? `
            <div class="input-group">
              <label for="ob-height">Height (cm)</label>
              <input type="number" id="ob-height" class="input" min="100" max="250" value="${onboardingData.height}">
            </div>
          ` : `
            <div class="input-group">
              <label>Height</label>
              <div class="flex gap-sm">
                <div style="flex: 1;">
                  <input type="number" id="ob-height-ft" class="input" min="3" max="8" placeholder="ft" value="${Math.floor((onboardingData.height || 70) / 12)}">
                  <span class="text-2xs text-muted" style="display: block; margin-top: 4px;">Feet</span>
                </div>
                <div style="flex: 1;">
                  <input type="number" id="ob-height-in" class="input" min="0" max="11" placeholder="in" value="${Math.round((onboardingData.height || 70) % 12)}">
                  <span class="text-2xs text-muted" style="display: block; margin-top: 4px;">Inches</span>
                </div>
              </div>
            </div>
          `}
          
          <div class="input-group">
            <label for="ob-weight">${isMetric ? 'Weight (kg)' : 'Weight (lbs)'}</label>
            <input type="number" id="ob-weight" class="input" min="${isMetric ? 30 : 66}" max="${isMetric ? 300 : 660}" step="0.1" value="${onboardingData.weight}">
          </div>
        </div>
      </div>
    `;
  } else if (currentStep === 3) {
    stepContent = `
      <div class="animate-in">
        <h1>What is your <span class="text-gradient">Main Goal</span>?</h1>
        <p class="step-description">Select what you want to achieve with FitForge. We'll adjust your macros accordingly.</p>
        
        <div class="goal-cards mb-lg">
          ${Object.entries(GOALS).map(([key, value]) => `
            <div class="goal-card ${onboardingData.goal === key ? 'selected' : ''}" data-goal="${key}">
              <div class="goal-icon">${value.emoji}</div>
              <div class="goal-info">
                <h3>${value.label}</h3>
                <p>${value.desc}</p>
              </div>
            </div>
          `).join('')}
        </div>
        
        <h3>Activity Level</h3>
        <p class="text-xs text-muted mb-sm">How active is your daily life outside of specific workouts?</p>
        <div class="activity-options">
          ${Object.entries(ACTIVITY_LEVELS).map(([key, value]) => `
            <div class="activity-option ${onboardingData.activityLevel === key ? 'selected' : ''}" data-activity="${key}">
              <div class="activity-dot"></div>
              <div style="flex: 1;">
                <div class="font-medium text-sm">${value.label}</div>
                <div class="text-xs text-muted">${value.desc}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (currentStep === 4) {
    const preferences = ['Vegan', 'Vegetarian', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Halal', 'Low-Carb'];
    stepContent = `
      <div class="animate-in">
        <h1>Training & <span class="text-gradient">Diet</span></h1>
        <p class="step-description">Tell us about your routines and dietary preferences to customize meal suggestions.</p>
        
        <div class="flex flex-col gap-md">
          <div class="input-group">
            <label for="ob-training">Workout frequency (days/week)</label>
            <input type="range" id="ob-training" min="1" max="7" value="${onboardingData.trainingDays}">
            <div class="flex justify-between text-xs font-semibold text-accent mt-xs">
              <span>1 Day</span>
              <span id="training-days-val" class="glass-card card-sm font-bold" style="padding: 2px 8px; border-radius: 4px;">${onboardingData.trainingDays} Days/Week</span>
              <span>7 Days</span>
            </div>
          </div>
          
          <div class="divider"></div>
          
          <div class="input-group">
            <label class="mb-xs">Dietary Preferences / Restrictions</label>
            <div class="chip-group">
              ${preferences.map(pref => `
                <div class="chip ${onboardingData.dietPreferences.includes(pref) ? 'selected' : ''}" data-pref="${pref}">
                  ${pref}
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  } else if (currentStep === 5) {
    stepContent = `
      <div class="animate-in">
        <h1>Photo Body Fat <span class="text-gradient">Scan</span></h1>
        <p class="step-description">Upload a photo to estimate your baseline body fat percentage. Your photo stays 100% private and is only stored locally on this device.</p>
        
        <div class="flex flex-col gap-md" id="onboarding-photo-panel">
          <div class="photo-capture-guide" id="upload-zone" style="cursor: pointer;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            <div class="font-semibold text-md">Snap or Upload Baseline Photo</div>
            <div class="guide-text">Supports JPG, PNG formats.ephemeral locally.</div>
            <input type="file" id="ob-photo-input" class="hidden" accept="image/*">
          </div>
          
          <div class="divider-text">OR ENTER MEASUREMENTS FOR NAVY METHOD</div>
          
          <div class="glass-card">
            <div class="input-row">
              <div class="input-group">
                <label for="ob-neck">Neck Circumference (cm)</label>
                <input type="number" id="ob-neck" class="input" min="20" max="60" value="${onboardingData.neck}">
              </div>
              <div class="input-group">
                <label for="ob-waist">Waist (at navel) (cm)</label>
                <input type="number" id="ob-waist" class="input" min="40" max="180" value="${onboardingData.waist}">
              </div>
              ${onboardingData.sex === 'female' ? `
                <div class="input-group">
                  <label for="ob-hip">Hips (cm)</label>
                  <input type="number" id="ob-hip" class="input" min="40" max="180" value="${onboardingData.hip}">
                </div>
              ` : ''}
            </div>
            
            <button class="btn btn-secondary btn-sm btn-block mt-md" id="calc-navy-btn">
              Calculate via Navy Method
            </button>
          </div>
          
          <div class="flex justify-between items-center mt-sm">
            <span class="text-sm text-secondary">Manual baseline estimate:</span>
            <div class="flex items-center gap-xs">
              <input type="number" id="ob-manual-bf" class="input text-center" style="width: 70px; padding: 6px;" min="3" max="50" value="${onboardingData.bodyFat}">
              <span class="font-bold">% BF</span>
            </div>
          </div>
        </div>
      </div>
    `;
  } else if (currentStep === 6) {
    // Perform dynamic calculations for the profile summary
    // First convert units if imperial
    let weightKg = onboardingData.weight;
    let heightCm = onboardingData.height;
    if (onboardingData.units === 'imperial') {
      weightKg = Math.round(onboardingData.weight / 2.20462 * 10) / 10;
      heightCm = Math.round(onboardingData.height * 2.54);
    }
    
    const calculated = calculateAllTargets({
      age: onboardingData.age,
      sex: onboardingData.sex,
      weight: weightKg,
      height: heightCm,
      activityLevel: onboardingData.activityLevel,
      goal: onboardingData.goal
    });
    
    onboardingData.tdee = calculated.tdee;
    onboardingData.macros = calculated.macros;
    stepContent = `
      <div class="animate-in">
        <h1>Your Forge is <span class="text-gradient">Ready</span>!</h1>
        <p class="step-description">Based on your metrics, here are your target calculations to hit your goal.</p>
        
        <div class="flex flex-col gap-md">
          <div class="glass-card card-accent text-center">
            <span class="text-sm text-secondary text-transform-uppercase font-semibold">Daily Calorie Target</span>
            <div class="text-gradient font-bold" style="font-size: var(--font-4xl); line-height: 1.2;" id="ob-cal-val">
              ${calculated.macros.calories} <span class="text-md font-medium text-secondary">kcal</span>
            </div>
            <p class="text-xs text-muted mt-xs" id="ob-tdee-val">TDEE Baseline: ${calculated.tdee} kcal/day</p>
            <button class="btn btn-ghost btn-sm" id="onboarding-explain-btn" style="padding: 4px; font-size: var(--font-xs); margin-top: 6px; color: var(--accent); display: inline-flex; align-items: center; gap: 4px; width: auto; text-decoration: underline; margin-left: auto; margin-right: auto;">
              ❓ Learn how these are calculated
            </button>
          </div>
          
          <div class="glass-card">
            <h3 class="mb-sm">Macronutrient Blueprint</h3>
            
            <div class="flex flex-col gap-sm">
              <div class="progress-label">
                <span class="progress-name">Protein (Build & Repair)</span>
                <span class="progress-value text-accent font-bold" id="ob-protein-val">${calculated.macros.protein}g</span>
              </div>
              <div class="progress-bar mb-xs"><div class="progress-bar-fill fill-protein" style="width: 35%"></div></div>
              
              <div class="progress-label">
                <span class="progress-name">Carbohydrates (Energy)</span>
                <span class="progress-value text-warning font-bold" id="ob-carbs-val">${calculated.macros.carbs}g</span>
              </div>
              <div class="progress-bar mb-xs"><div class="progress-bar-fill fill-carbs" style="width: 45%"></div></div>
              
              <div class="progress-label">
                <span class="progress-name">Fats (Hormones & Health)</span>
                <span class="progress-value text-danger font-bold" id="ob-fat-val">${calculated.macros.fat}g</span>
              </div>
              <div class="progress-bar"><div class="progress-bar-fill fill-fat" style="width: 20%"></div></div>
            </div>
          </div>
          
          <div class="glass-card flex flex-col gap-sm" style="padding: var(--space-sm);">
            <div class="flex justify-between items-center gap-sm" style="flex-wrap: wrap; width: 100%;">
              <div style="flex: 1; min-width: 150px;">
                <div class="font-bold text-sm" id="ob-bf-category">${bfRange.emoji} Category: ${bfRange.label}</div>
                <div class="text-xs text-muted" id="ob-bf-desc" style="margin-top: 2px;">${bfRange.desc}</div>
              </div>
              <div class="flex items-center gap-xs" style="margin-left: auto;">
                <input type="number" id="ob-bf-override" class="input font-bold text-center text-sm" value="${onboardingData.bodyFat}" style="width: 75px; padding: var(--space-2xs); border-radius: var(--radius-xs); border: 1px solid var(--border-subtle);" min="3" max="50" step="0.5">
                <span class="text-xs font-bold text-secondary">%</span>
              </div>
            </div>
            <p class="text-2xs text-muted" style="line-height: 1.3; margin: 0;">
              * If you feel the photo-estimated body fat percentage is inaccurate (due to camera lighting or posture angle), you can adjust it here.
            </p>
          </div>
        </div>
      </div>
    `;
  }

  // Draw Onboarding Frame
  container.innerHTML = `
    <div class="onboarding">
      <div class="onboarding-bg"></div>
      
      <div class="onboarding-progress">
        <div class="onboarding-progress-bar">
          <div class="onboarding-progress-fill" style="width: ${(currentStep / totalSteps) * 100}%"></div>
        </div>
        <div class="onboarding-step-label">Step ${currentStep} of ${totalSteps}</div>
      </div>
      
      <div class="onboarding-content">
        ${stepContent}
      </div>
      
      <div class="onboarding-footer">
        ${currentStep > 1 ? `
          <button class="btn btn-secondary" id="ob-back-btn">Back</button>
        ` : ''}
        <button class="btn btn-primary" id="ob-next-btn">
          ${currentStep === totalSteps ? 'Enter Forge' : 'Continue'}
        </button>
      </div>
    </div>
  `;
  
  bindEvents(container);
}

function bindEvents(container) {
  // Step navigation buttons
  const nextBtn = container.querySelector('#ob-next-btn');
  const backBtn = container.querySelector('#ob-back-btn');
  
  if (nextBtn) {
    nextBtn.addEventListener('click', async () => {
      console.log('[Onboarding] Next button clicked. Current step:', currentStep);
      try {
        if (currentStep === 1) {
          const nameInput = container.querySelector('#ob-name');
          onboardingData.name = nameInput ? nameInput.value.trim() || 'Champion' : 'Champion';
          const ageInput = container.querySelector('#ob-age');
          onboardingData.age = ageInput ? parseInt(ageInput.value) || 25 : 25;
          const sexInput = container.querySelector('#ob-sex');
          onboardingData.sex = sexInput ? sexInput.value : 'male';
          const unitsInput = container.querySelector('#ob-units');
          const newUnits = unitsInput ? unitsInput.value : 'metric';
          if (newUnits !== onboardingData.units) {
            if (newUnits === 'imperial') {
              // Convert baseline to imperial
              onboardingData.height = Math.round(onboardingData.height / 2.54);
              onboardingData.weight = Math.round(onboardingData.weight * 2.20462);
            } else {
              // Convert baseline to metric
              onboardingData.height = Math.round(onboardingData.height * 2.54);
              onboardingData.weight = Math.round(onboardingData.weight / 2.20462);
            }
            onboardingData.units = newUnits;
          }
          console.log('[Onboarding] Step 1 data captured:', onboardingData);
        }
      
        if (currentStep === 2) {
          const isMetric = onboardingData.units === 'metric';
          if (isMetric) {
            const heightInput = container.querySelector('#ob-height');
            onboardingData.height = heightInput ? parseFloat(heightInput.value) || 170 : 170;
          } else {
            const ftInput = container.querySelector('#ob-height-ft');
            const inInput = container.querySelector('#ob-height-in');
            const ft = ftInput ? parseInt(ftInput.value) || 5 : 5;
            const inch = inInput ? parseInt(inInput.value) || 0 : 0;
            onboardingData.height = (ft * 12) + inch;
          }
          const weightInput = container.querySelector('#ob-weight');
          onboardingData.weight = weightInput ? parseFloat(weightInput.value) || 70 : 70;
        }
      
        if (currentStep === 4) {
          const trainingInput = container.querySelector('#ob-training');
          onboardingData.trainingDays = trainingInput ? parseInt(trainingInput.value) || 4 : 4;
        }
      
        if (currentStep === 5) {
          const manualBf = container.querySelector('#ob-manual-bf');
          if (manualBf) {
            onboardingData.bodyFat = Math.max(3, Math.min(55, parseInt(manualBf.value) || 15));
          }
        }
      
        if (currentStep < totalSteps) {
          currentStep++;
          console.log('[Onboarding] Proceeding to step:', currentStep);
          renderStep(container);
        } else {
          // Complete Onboarding
          await completeOnboarding();
        }
      } catch (err) {
        console.error('[Onboarding] Error during continue click:', err);
        window.showToast('Error', err.message, 'danger');
      }
    });
  }
  
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      if (currentStep > 1) {
        currentStep--;
        renderStep(container);
      }
    });
  }
  
  // STEP 3 - Goal & Activity Selectors
  if (currentStep === 3) {
    container.querySelectorAll('.goal-card').forEach(card => {
      card.addEventListener('click', () => {
        container.querySelectorAll('.goal-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        onboardingData.goal = card.getAttribute('data-goal');
      });
    });
    
    container.querySelectorAll('.activity-option').forEach(option => {
      option.addEventListener('click', () => {
        container.querySelectorAll('.activity-option').forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
        onboardingData.activityLevel = option.getAttribute('data-activity');
      });
    });
  }
  
  // STEP 4 - Workout training frequency slider & diet chips
  if (currentStep === 4) {
    const slider = container.querySelector('#ob-training');
    const label = container.querySelector('#training-days-val');
    if (slider && label) {
      slider.addEventListener('input', () => {
        label.textContent = `${slider.value} Days/Week`;
        onboardingData.trainingDays = parseInt(slider.value);
      });
    }
    
    container.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const pref = chip.getAttribute('data-pref');
        if (chip.classList.toggle('selected')) {
          onboardingData.dietPreferences.push(pref);
        } else {
          onboardingData.dietPreferences = onboardingData.dietPreferences.filter(p => p !== pref);
        }
      });
    });
  }
  
  // STEP 5 - Photo capture & Navy Method
  if (currentStep === 5) {
    const uploadZone = container.querySelector('#upload-zone');
    const photoInput = container.querySelector('#ob-photo-input');
    const navyBtn = container.querySelector('#calc-navy-btn');
    
    if (uploadZone && photoInput) {
      uploadZone.addEventListener('click', () => photoInput.click());
      photoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          simulatePhotoScan(container, file);
        }
      });
    }
    
    if (navyBtn) {
      navyBtn.addEventListener('click', () => {
        const neckVal = parseFloat(container.querySelector('#ob-neck').value) || 38;
        const waistVal = parseFloat(container.querySelector('#ob-waist').value) || 82;
        const hipEl = container.querySelector('#ob-hip');
        const hipVal = hipEl ? parseFloat(hipEl.value) : 94;
        
        onboardingData.neck = neckVal;
        onboardingData.waist = waistVal;
        onboardingData.hip = hipVal;
        
        // Calculate Navy Method Body Fat
        let heightCm = onboardingData.height;
        if (onboardingData.units === 'imperial') {
          heightCm = Math.round(onboardingData.height * 2.54);
        }
        
        const bfEst = navyMethod({
          height: heightCm,
          neck: neckVal,
          waist: waistVal,
          hip: hipVal,
          sex: onboardingData.sex
        });
        
        if (bfEst) {
          onboardingData.bodyFat = bfEst;
          const manualBf = container.querySelector('#ob-manual-bf');
          if (manualBf) manualBf.value = bfEst;
          window.showToast('Navy Method Calculated', `Estimated body fat: ${bfEst}%`, 'success');
        } else {
          window.showToast('Calculation Failed', 'Please input valid measurements.', 'danger');
        }
      });
    }
  }
  
  if (currentStep === 6) {
    const explainBtn = container.querySelector('#onboarding-explain-btn');
    if (explainBtn) {
      explainBtn.addEventListener('click', () => {
        showExplanationModal();
      });
    }

    const bfOverride = container.querySelector('#ob-bf-override');
    if (bfOverride) {
      bfOverride.addEventListener('input', () => {
        let val = parseFloat(bfOverride.value);
        if (isNaN(val)) return;
        if (val < 3) val = 3;
        if (val > 50) val = 50;

        onboardingData.bodyFat = val;

        // Recalculate macros and targets in real time
        let weightKg = onboardingData.weight;
        let heightCm = onboardingData.height;
        if (onboardingData.units === 'imperial') {
          weightKg = onboardingData.weight / 2.20462;
          heightCm = onboardingData.height * 2.54;
        }

        const calculated = calculateAllTargets({
          ...onboardingData,
          weight: weightKg,
          height: heightCm
        });

        // Update elements
        const calVal = container.querySelector('#ob-cal-val');
        if (calVal) calVal.innerHTML = `${calculated.macros.calories} <span class="text-md font-medium text-secondary">kcal</span>`;

        const tdeeVal = container.querySelector('#ob-tdee-val');
        if (tdeeVal) tdeeVal.textContent = `TDEE Baseline: ${calculated.tdee} kcal/day`;

        const pVal = container.querySelector('#ob-protein-val');
        if (pVal) pVal.textContent = `${calculated.macros.protein}g`;

        const cVal = container.querySelector('#ob-carbs-val');
        if (cVal) cVal.textContent = `${calculated.macros.carbs}g`;

        const fVal = container.querySelector('#ob-fat-val');
        if (fVal) fVal.textContent = `${calculated.macros.fat}g`;

        const bfRange = getBFCategory(onboardingData.bodyFat, onboardingData.sex);
        const bfCatEl = container.querySelector('#ob-bf-category');
        const bfDescEl = container.querySelector('#ob-bf-desc');
        if (bfCatEl) bfCatEl.textContent = `${bfRange.emoji} Category: ${bfRange.label}`;
        if (bfDescEl) bfDescEl.textContent = bfRange.desc;
      });
    }
  }
}

// Simulated Photo Scan Animation
function simulatePhotoScan(container, file) {
  const panel = document.getElementById('onboarding-photo-panel');
  if (!panel) return;
  
  // Ephemeral Object URL for preview
  const imgUrl = URL.createObjectURL(file);
  onboardingData.photoBlob = file;
  
  // Load the image to inspect real dimensions and aspect ratio
  const img = new Image();
  img.src = imgUrl;
  img.onload = () => {
    const width = img.naturalWidth;
    const height = img.naturalHeight;
    
    // Check if the photo is a high-resolution, full-body portrait
    const isTooSmall = width < 300 || height < 300;
    const isNotPortrait = height / width < 1.1; // full body portrait needs to be taller than wide

    if (isTooSmall || isNotPortrait) {
      panel.innerHTML = `
        <div class="glass-card text-center p-md animate-in" style="border-color: rgba(244, 63, 94, 0.4); background: rgba(244, 63, 94, 0.02);">
          <div style="font-size: 2.2rem; margin-bottom: var(--space-xs);">🚨</div>
          <h3 style="color: #f43f5e; font-weight: 700; margin-bottom: var(--space-xs);">Image Alignment Warning</h3>
          <p class="text-xs text-secondary mb-md" style="line-height: 1.4;">
            The uploaded image (${width}x${height} px) does not appear to be a high-resolution full-body portrait photo. For accurate visual body fat estimation, the system requires a full-height body view in portrait orientation.
          </p>
          <div class="flex flex-col gap-sm">
            <button class="btn btn-primary btn-sm btn-block" id="btn-re-upload">
              📷 Upload Full-Body Portrait
            </button>
            <button class="btn btn-secondary btn-xs btn-block" id="btn-force-scan" style="opacity: 0.8;">
              Skip warning and analyze anyway
            </button>
          </div>
        </div>
      `;

      const reUploadBtn = document.getElementById('btn-re-upload');
      if (reUploadBtn) {
        reUploadBtn.addEventListener('click', () => {
          const input = document.getElementById('ob-photo-input');
          if (input) input.click();
        });
      }

      const forceScanBtn = document.getElementById('btn-force-scan');
      if (forceScanBtn) {
        forceScanBtn.addEventListener('click', () => {
          runScanAnimation(panel, container, file, imgUrl, width, height, img);
        });
      }
    } else {
      runScanAnimation(panel, container, file, imgUrl, width, height, img);
    }
  };
  
  img.onerror = () => {
    runScanAnimation(panel, container, file, imgUrl, 400, 600, null);
  };
}

function extractSilhouetteMetrics(imgEl, sex, bbox = null) {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 60;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    if (bbox && Array.isArray(bbox) && bbox.length === 4) {
      ctx.drawImage(imgEl, bbox[0], bbox[1], bbox[2], bbox[3], 0, 0, 60, 100);
    } else {
      ctx.drawImage(imgEl, 0, 0, 60, 100);
    }
    const imgData = ctx.getImageData(0, 0, 60, 100).data;
    
    // Step 1: Detect background color (take average of 4 corners)
    const corners = [0, 59, 99 * 60, 99 * 60 + 59];
    let rBg = 0, gBg = 0, bBg = 0;
    corners.forEach(idx => {
      rBg += imgData[idx * 4];
      gBg += imgData[idx * 4 + 1];
      bBg += imgData[idx * 4 + 2];
    });
    rBg /= 4; gBg /= 4; bBg /= 4;
    
    // Step 2: Edge detection threshold
    const threshold = 35;
    const widths = new Array(100).fill(0);
    const leftEdges = new Array(100).fill(0);
    const rightEdges = new Array(100).fill(60);
    
    for (let y = 0; y < 100; y++) {
      let left = -1;
      for (let x = 0; x < 30; x++) {
        const idx = (y * 60 + x) * 4;
        const dist = Math.sqrt(
          Math.pow(imgData[idx] - rBg, 2) +
          Math.pow(imgData[idx+1] - gBg, 2) +
          Math.pow(imgData[idx+2] - bBg, 2)
        );
        if (dist > threshold) {
          left = x;
          break;
        }
      }
      
      let right = -1;
      for (let x = 59; x >= 30; x--) {
        const idx = (y * 60 + x) * 4;
        const dist = Math.sqrt(
          Math.pow(imgData[idx] - rBg, 2) +
          Math.pow(imgData[idx+1] - gBg, 2) +
          Math.pow(imgData[idx+2] - bBg, 2)
        );
        if (dist > threshold) {
          right = x;
          break;
        }
      }
      
      if (left !== -1 && right !== -1 && right >= left) {
        widths[y] = right - left;
        leftEdges[y] = left;
        rightEdges[y] = right;
      }
    }
    
    // Step 3: Extract vertical segments
    let neckWidth = 0, neckCount = 0;
    for (let y = 12; y <= 22; y++) {
      if (widths[y] > 0) {
        neckWidth += widths[y];
        neckCount++;
      }
    }
    neckWidth = neckCount > 0 ? (neckWidth / neckCount) : 12;
    
    let waistWidth = 999;
    for (let y = 45; y <= 60; y++) {
      if (widths[y] > 0 && widths[y] < waistWidth) {
        waistWidth = widths[y];
      }
    }
    if (waistWidth === 999) waistWidth = 24;
    
    let hipWidth = 0;
    for (let y = 65; y <= 80; y++) {
      if (widths[y] > hipWidth) {
        hipWidth = widths[y];
      }
    }
    if (hipWidth === 0) hipWidth = 28;
    
    let silhouetteHeight = 0;
    for (let y = 0; y < 100; y++) {
      if (widths[y] > 0) silhouetteHeight++;
    }
    
    // Strict Human Shape Verification
    if (silhouetteHeight < 40 || waistWidth === 999 || hipWidth === 0) {
      console.warn('[Contour CV] Human silhouette validation failed. height rows:', silhouetteHeight);
      return null;
    }
    
    const waistToHeight = waistWidth / silhouetteHeight;
    const hipToWaist = hipWidth / waistWidth;
    const waistToNeck = waistWidth / neckWidth;
    
    // Relaxed Anthropometric Shape Auditor (prevent false rejections on real human photos)
    let isHumanShape = true;
    if (waistToHeight < 0.05 || waistToHeight > 0.65) isHumanShape = false; // Torso aspect ratio check
    if (hipToWaist < 0.6 || hipToWaist > 2.8) isHumanShape = false;         // Hip curvature ratio check
    if (neckWidth > waistWidth * 1.6) isHumanShape = false;                 // Neck scale verification
    
    if (!isHumanShape) {
      console.warn('[Contour CV] Anthropometric proportions validation failed. waistToHeight:', waistToHeight.toFixed(2), 'hipToWaist:', hipToWaist.toFixed(2));
      return null;
    }
    
    // Body Fat Regression Formula
    let estBf = 15;
    if (sex === 'female') {
      estBf = (waistToHeight * 70.0) + (hipToWaist * 12.0) - 15.0;
    } else {
      estBf = (waistToHeight * 95.0) + (waistToNeck * 5.0) - 26.0;
    }
    
    estBf = Math.max(sex === 'female' ? 10 : 4, Math.min(48, estBf));
    
    return {
      neckWidth,
      waistWidth,
      hipWidth,
      waistToHeight,
      hipToWaist,
      bodyFat: Math.round(estBf * 10) / 10
    };
  } catch (e) {
    console.error('[Contour CV] Edge detection failed:', e);
    return null;
  }
}

function analyzePhotoQuality(imgEl) {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 10;
    canvas.height = 10;
    const ctx = canvas.getContext('2d');
    if (!ctx) return { lighting: 'Optimal', contrast: 'Good', alignment: 'Resolved' };
    
    ctx.drawImage(imgEl, 0, 0, 10, 10);
    const data = ctx.getImageData(0, 0, 10, 10).data;
    
    let sum = 0, count = 0;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i+1], b = data[i+2];
      sum += (r + g + b) / 3;
      count++;
    }
    
    const avgBrightness = sum / count;
    let lighting = 'Optimal';
    if (avgBrightness < 65) lighting = 'Sub-optimal (Dark) ⚠️';
    else if (avgBrightness > 215) lighting = 'Sub-optimal (Overexposed) ⚠️';
    
    let leftSum = 0, centerSum = 0, rightSum = 0;
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        const idx = (y * 10 + x) * 4;
        const b = (data[idx] + data[idx+1] + data[idx+2]) / 3;
        if (x < 3) leftSum += b;
        else if (x > 6) rightSum += b;
        else centerSum += b;
      }
    }
    
    const leftAvg = leftSum / 30;
    const rightAvg = rightSum / 30;
    const centerAvg = centerSum / 40;
    const deviation = Math.abs((leftAvg + rightAvg) / 2 - centerAvg);
    
    let alignment = 'Silhouette Center Resolved';
    if (deviation < 10) {
      alignment = 'Low Posture Contrast ⚠️';
    }
    
    return {
      lighting,
      contrast: avgBrightness > 100 && avgBrightness < 180 ? 'Optimal' : 'Sufficient',
      alignment
    };
  } catch (e) {
    return { lighting: 'Optimal', contrast: 'Good', alignment: 'Resolved' };
  }
}

async function runScanAnimation(panel, container, file, imgUrl, width, height, imgEl) {
  panel.innerHTML = `
    <div class="glass-card text-center animate-in" style="position: relative; overflow: hidden; padding: 0; min-height: 250px;">
      <img id="scan-preview" src="${imgUrl}" style="width: 100%; height: 250px; object-fit: cover; filter: brightness(0.6);">
      
      <!-- Scan overlay -->
      <div id="laser-line" style="position: absolute; left: 0; right: 0; height: 3px; background: var(--success); top: 0; box-shadow: 0 0 10px var(--success-glow); animation: laserScroll 2s linear infinite;"></div>
      
      <!-- scanning indicators -->
      <div class="flex flex-col items-center justify-center" style="position: absolute; inset: 0; background: rgba(10,10,20,0.6); pointer-events: none;">
        <div class="spinner mb-sm"></div>
        <div class="font-bold text-sm text-gradient" id="scan-status">Initialising object detector...</div>
        <div class="text-xs text-muted" id="scan-log">Loading neural validation layers</div>
      </div>
    </div>
  `;
  
  if (!document.getElementById('laser-style')) {
    const style = document.createElement('style');
    style.id = 'laser-style';
    style.textContent = `
      @keyframes laserScroll {
        0% { top: 0%; }
        50% { top: 100%; }
        100% { top: 0%; }
      }
    `;
    document.head.appendChild(style);
  }

  // 1. Await COCO-SSD object check to count people in the image
  let people = [];
  if (imgEl && window.cocoSsd) {
    try {
      console.log('[Scanner SSD] Loading COCO-SSD for person check...');
      const cocoModel = await window.cocoSsd.load();
      const detections = await cocoModel.detect(imgEl);
      console.log('[Scanner SSD] All detections:', detections);
      people = detections.filter(p => p.class === 'person' && p.score >= 0.35);
    } catch (e) {
      console.warn('[Scanner SSD] cocoSsd failed, fallback to silhouette contour validation:', e);
    }
  }

  // 2. If multiple people are found, show selection UI with canvas bounding boxes
  if (people.length >= 2) {
    console.log('[Scanner SSD] Multiple people detected, prompting user choice.');
    people.sort((a, b) => a.bbox[0] - b.bbox[0]); // Sort left to right
    
    panel.innerHTML = `
      <div class="glass-card text-center p-md animate-in" style="max-width: 100%;">
        <div style="font-size: 2.2rem; margin-bottom: var(--space-xs);">👥</div>
        <h3 style="color: var(--accent); font-weight: 700; margin-bottom: var(--space-xs); font-size: 1.1rem;">Multiple People Detected</h3>
        <p class="text-xs text-secondary mb-md" style="line-height: 1.4; margin-bottom: var(--space-sm);">
          We found ${people.length} people in this photo. Please select the correct person you would like to estimate body fat for:
        </p>
        
        <div style="position: relative; display: inline-block; margin-bottom: var(--space-md); border-radius: var(--radius-sm); overflow: hidden; border: 1px solid var(--border-subtle); width: 100%; background: #000;">
          <canvas id="multi-person-canvas" style="max-width: 100%; height: auto; display: block; margin: 0 auto;"></canvas>
        </div>

        <div class="flex flex-col gap-xs" style="width: 100%;">
          ${people.map((p, idx) => `
            <button class="btn btn-secondary btn-sm btn-block select-person-btn" data-idx="${idx}" style="text-align: left; padding: var(--space-sm) var(--space-md); display: flex; justify-content: space-between; align-items: center;">
              <span>👤 Person ${idx + 1} (${p.bbox[0] < width / 2 ? 'Left Side' : 'Right Side'})</span>
              <span class="text-2xs text-accent">${Math.round(p.score * 100)}% Match</span>
            </button>
          `).join('')}
          
          <button class="btn btn-secondary btn-xs mt-xs" id="btn-multi-reupload" style="opacity: 0.8;">
            📷 Upload Different Photo
          </button>
        </div>
      </div>
    `;

    const canvas = document.getElementById('multi-person-canvas');
    if (canvas) {
      // Calculate scaled aspect ratio for canvas preview
      const maxW = 320;
      const scale = Math.min(1, maxW / width);
      canvas.width = width * scale;
      canvas.height = height * scale;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(imgEl, 0, 0, canvas.width, canvas.height);
        
        people.forEach((p, idx) => {
          const [bx, by, bw, bh] = p.bbox.map(v => v * scale);
          ctx.strokeStyle = idx === 0 ? '#34d9a3' : '#7c6aff';
          ctx.lineWidth = 3;
          ctx.strokeRect(bx, by, bw, bh);
          
          ctx.fillStyle = idx === 0 ? '#34d9a3' : '#7c6aff';
          ctx.font = 'bold 12px sans-serif';
          ctx.fillText(`Person ${idx + 1}`, bx + 5, by + 15);
        });
      }
    }

    const reUploadBtn = document.getElementById('btn-multi-reupload');
    if (reUploadBtn) {
      reUploadBtn.addEventListener('click', () => {
        const input = document.getElementById('ob-photo-input');
        if (input) input.click();
      });
    }

    document.querySelectorAll('.select-person-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'));
        const selectedPerson = people[idx];
        runSinglePersonScan(panel, container, file, imgUrl, width, height, imgEl, selectedPerson.bbox);
      });
    });
    return;
  }

  // 3. If 0 or 1 person, scan directly
  const selectedBbox = people.length === 1 ? people[0].bbox : null;
  runSinglePersonScan(panel, container, file, imgUrl, width, height, imgEl, selectedBbox);
}

function runSinglePersonScan(panel, container, file, imgUrl, width, height, imgEl, bbox) {
  panel.innerHTML = `
    <div class="glass-card text-center animate-in" style="position: relative; overflow: hidden; padding: 0; min-height: 250px;">
      <img id="scan-preview" src="${imgUrl}" style="width: 100%; height: 250px; object-fit: cover; filter: brightness(0.6);">
      
      <!-- Scan overlay -->
      <div id="laser-line" style="position: absolute; left: 0; right: 0; height: 3px; background: var(--success); top: 0; box-shadow: 0 0 10px var(--success-glow); animation: laserScroll 2s linear infinite;"></div>
      
      <!-- scanning indicators -->
      <div class="flex flex-col items-center justify-center" style="position: absolute; inset: 0; background: rgba(10,10,20,0.4); pointer-events: none;">
        <div class="spinner mb-sm"></div>
        <div class="font-bold text-sm text-gradient" id="scan-status">Detecting contours...</div>
        <div class="text-xs text-muted" id="scan-log">Constructing visual baseline</div>
      </div>
    </div>
  `;

  const quality = imgEl ? analyzePhotoQuality(imgEl) : { lighting: 'Sufficient', contrast: 'Good', alignment: 'Resolved' };
  const cvMetrics = imgEl ? extractSilhouetteMetrics(imgEl, onboardingData.sex, bbox) : null;
  
  // Simulated steps of scanner
  const steps = [
    { text: 'Registering alignment grids...', log: bbox ? 'ROI cropping and body boundary mapping...' : 'Aligning front torso profile...' },
    { text: 'Analyzing camera environment...', log: `Lighting: ${quality.lighting} | Contrast: ${quality.contrast}` },
    { text: 'Scanning skeletal boundaries...', log: cvMetrics ? `Neck: ${cvMetrics.neckWidth.toFixed(1)}px | Waist: ${cvMetrics.waistWidth.toFixed(1)}px | Hips: ${cvMetrics.hipWidth.toFixed(1)}px` : `Posture: ${quality.alignment}` },
    { text: 'Computing body fat metrics...', log: cvMetrics ? `Waist-to-Height Ratio: ${cvMetrics.waistToHeight.toFixed(2)}` : 'Resolving body composition...' }
  ];
  
  let currentSubStep = 0;
  
  const timer = setInterval(() => {
    const statusEl = document.getElementById('scan-status');
    const logEl = document.getElementById('scan-log');
    
    if (statusEl && logEl && currentSubStep < steps.length) {
      statusEl.textContent = steps[currentSubStep].text;
      logEl.textContent = steps[currentSubStep].log;
      currentSubStep++;
    } else {
      if (!cvMetrics) {
        clearInterval(timer);
        panel.innerHTML = `
          <div class="glass-card text-center p-md animate-in" style="border-color: rgba(239, 68, 68, 0.4); background: rgba(239, 68, 68, 0.03); max-width: 100%;">
            <div style="font-size: 2.2rem; margin-bottom: var(--space-xs);">👤❌</div>
            <h3 style="color: var(--danger); font-weight: 700; margin-bottom: var(--space-xs); font-size: 1.1rem;">Human Silhouette Not Detected</h3>
            <p class="text-xs text-secondary mb-md" style="line-height: 1.4; margin-bottom: var(--space-sm);">
              The image analyzer could not map a standing human silhouette in this photo (potentially due to camera alignment, distance, or lighting). 
              For visual scanning, please upload a clear, full-body portrait photo, or enter your body fat percentage manually to proceed:
            </p>
            
            <div class="flex flex-col gap-sm" style="width: 100%;">
              <div class="glass-card flex items-center justify-between" style="padding: var(--space-sm); border-color: var(--border-subtle); background: rgba(0,0,0,0.15);">
                <span class="text-xs font-bold text-secondary">Body Fat Percentage:</span>
                <div class="flex items-center gap-xs">
                  <input type="number" id="ob-manual-bf-fallback" class="input font-bold text-center text-sm" value="18" style="width: 65px; padding: var(--space-2xs);" min="3" max="50" step="0.5">
                  <span class="text-xs font-bold text-secondary">%</span>
                </div>
              </div>

              <div class="flex gap-sm">
                <button class="btn btn-secondary btn-sm" id="btn-err-reupload" style="flex: 1;">
                  📷 Retry Photo
                </button>
                <button class="btn btn-primary btn-sm" id="btn-err-proceed" style="flex: 1;">
                  Manual Entry 🚀
                </button>
              </div>
            </div>
          </div>
        `;
        
        const reUploadBtn = document.getElementById('btn-err-reupload');
        if (reUploadBtn) {
          reUploadBtn.addEventListener('click', () => {
            const input = document.getElementById('ob-photo-input');
            if (input) input.click();
          });
        }
        
        const proceedBtn = document.getElementById('btn-err-proceed');
        if (proceedBtn) {
          proceedBtn.addEventListener('click', () => {
            const valInput = document.getElementById('ob-manual-bf-fallback');
            const manualVal = valInput ? parseFloat(valInput.value) : 18;
            onboardingData.bodyFat = manualVal;
            
            window.showToast('Manual Entry Saved', `Proceeding with manual baseline: ${manualVal}%`, 'info');
            currentStep = 6;
            renderStep(container);
          });
        }
        return;
      }

      clearInterval(timer);
      
      const finalBf = cvMetrics.bodyFat;
      console.log('[Onboarding Scanner] CV resolved Body Fat:', finalBf, cvMetrics);
      onboardingData.bodyFat = finalBf;
      
      db.progressPhotos.add({
        date: new Date().toISOString().split('T')[0],
        category: 'baseline',
        photo: file,
        bodyFat: finalBf,
        weight: onboardingData.weight,
        createdAt: new Date().toISOString()
      }).catch(e => console.error('[Onboarding] Error saving photo:', e));
      
      window.showToast('Scan Completed', `Visual Estimate: ${finalBf}% Body Fat`, 'success');
      
      currentStep = 6;
      renderStep(container);
    }
  }, 1500);
}

async function completeOnboarding() {
  store.state.isLoading = true;
  
  try {
    let weightKg = onboardingData.weight;
    let heightCm = onboardingData.height;
    if (onboardingData.units === 'imperial') {
      weightKg = Math.round(onboardingData.weight / 2.20462 * 10) / 10;
      heightCm = Math.round(onboardingData.height * 2.54);
    }
    
    // Save metric preferences as part of profile
    const profile = {
      name: onboardingData.name,
      age: onboardingData.age,
      sex: onboardingData.sex,
      height: heightCm,
      weight: weightKg,
      activityLevel: onboardingData.activityLevel,
      goal: onboardingData.goal,
      trainingDays: onboardingData.trainingDays,
      dietPreferences: onboardingData.dietPreferences,
      units: onboardingData.units,
      bodyFat: onboardingData.bodyFat
    };
    
    await db.saveProfile(profile);
    
    // Save first body metric log entry
    await db.bodyMetrics.add({
      date: new Date().toISOString().split('T')[0],
      weight: weightKg,
      bodyFat: onboardingData.bodyFat,
      neck: onboardingData.neck,
      waist: onboardingData.waist,
      hip: onboardingData.sex === 'female' ? onboardingData.hip : null,
      createdAt: new Date().toISOString()
    });
    
    // Set global store state
    store.batch(() => {
      store.state.user = {
        ...store.state.user,
        ...profile,
        macros: onboardingData.macros,
        tdee: onboardingData.tdee
      };
      store.state.isOnboarded = true;
    });
    
    window.showToast('Welcome Aboard!', `Let's reach your goals, ${onboardingData.name}!`, 'success');
    window.location.hash = 'dashboard';
    
  } catch (error) {
    console.error('[Onboarding] Completion failed:', error);
    window.showToast('Save Failed', 'Could not save profile data. Please try again.', 'danger');
  } finally {
    store.state.isLoading = false;
  }
}

function showExplanationModal() {
  const html = `
    <div class="flex flex-col gap-md text-sm text-secondary" style="line-height: 1.5; text-align: left;">
      <p>FitForge calculates your metabolic blueprint using scientifically validated equations. Here is a breakdown of what these numbers mean:</p>
      
      <div class="glass-card card-sm">
        <h3 class="font-bold text-accent mb-2xs" style="font-size: var(--font-sm); text-transform: uppercase;">1. BMR (Basal Metabolic Rate)</h3>
        <p class="text-xs">Your BMR is the baseline energy (calories) your body burns at rest just to keep you alive (e.g., breathing, circulation, brain activity). We calculate this using the <b>Mifflin-St Jeor</b> equation, the gold standard for healthy adults.</p>
      </div>
      
      <div class="glass-card card-sm">
        <h3 class="font-bold text-gradient mb-2xs" style="font-size: var(--font-sm); text-transform: uppercase;">2. TDEE (Total Daily Energy Expenditure)</h3>
        <p class="text-xs">Your TDEE is your BMR multiplied by your daily activity multiplier. This represents the total number of calories your body burns in a 24-hour period including walking, working, and workouts.</p>
      </div>
      
      <div class="glass-card card-sm">
        <h3 class="font-bold text-success mb-2xs" style="font-size: var(--font-sm); text-transform: uppercase;">3. Goal Adjustments (Deficit/Surplus)</h3>
        <p class="text-xs">To alter weight, we adjust calories relative to your TDEE:</p>
        <ul style="list-style-type: disc; padding-left: 16px; margin-top: 4px;" class="text-xs">
          <li><b>Cut:</b> -500 kcal daily (safe, progressive fat loss).</li>
          <li><b>Lean Bulk:</b> +200 kcal daily (muscle growth with minimal fat gains).</li>
          <li><b>Bulk:</b> +400 kcal daily (maximize muscle gains).</li>
          <li><b>Maintain:</b> 0 kcal adjustment (body recomposition).</li>
        </ul>
      </div>

      <div class="glass-card card-sm">
        <h3 class="font-bold text-warning mb-2xs" style="font-size: var(--font-sm); text-transform: uppercase;">4. Macronutrient Distribution</h3>
        <p class="text-xs">Calories are divided into macros supporting structural recovery and fuel:</p>
        <ul style="list-style-type: disc; padding-left: 16px; margin-top: 4px;" class="text-xs">
          <li><b>Protein (4 kcal/g):</b> Target of 1.8–2.2g per kg of weight to repair muscle fibers.</li>
          <li><b>Fats (9 kcal/g):</b> Kept at 25-30% of energy for hormonal support and joint function.</li>
          <li><b>Carbs (4 kcal/g):</b> Fills the remaining calorie target to provide clean performance glycogen.</li>
        </ul>
      </div>
    </div>
  `;
  window.showModal('Metabolic Calculations Guide', html);
}

export function cleanup() {
  // Cleanup object URLs or active timers
}
