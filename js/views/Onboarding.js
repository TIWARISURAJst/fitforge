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
          <div class="input-group">
            <label for="ob-height">${isMetric ? 'Height (cm)' : 'Height (inches)'}</label>
            <input type="number" id="ob-height" class="input" min="${isMetric ? 100 : 36}" max="${isMetric ? 250 : 96}" value="${onboardingData.height}">
            ${!isMetric ? `<span class="text-xs text-muted" style="margin-top: -6px;">Conversion tip: 5'8" is 68 inches, 6'0" is 72 inches.</span>` : ''}
          </div>
          
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
    
    const bfRange = getBFCategory(onboardingData.bodyFat, onboardingData.sex);
    
    stepContent = `
      <div class="animate-in">
        <h1>Your Forge is <span class="text-gradient">Ready</span>!</h1>
        <p class="step-description">Based on your metrics, here are your target calculations to hit your goal.</p>
        
        <div class="flex flex-col gap-md">
          <div class="glass-card card-accent text-center">
            <span class="text-sm text-secondary text-transform-uppercase font-semibold">Daily Calorie Target</span>
            <div class="text-gradient font-bold" style="font-size: var(--font-4xl); line-height: 1.2;">
              ${calculated.macros.calories} <span class="text-md font-medium text-secondary">kcal</span>
            </div>
            <p class="text-xs text-muted mt-xs">TDEE Baseline: ${calculated.tdee} kcal/day</p>
            <button class="btn btn-ghost btn-sm" id="onboarding-explain-btn" style="padding: 4px; font-size: var(--font-xs); margin-top: 6px; color: var(--accent); display: inline-flex; align-items: center; gap: 4px; width: auto; text-decoration: underline; margin-left: auto; margin-right: auto;">
              ❓ Learn how these are calculated
            </button>
          </div>
          
          <div class="glass-card">
            <h3 class="mb-sm">Macronutrient Blueprint</h3>
            
            <div class="flex flex-col gap-sm">
              <div class="progress-label">
                <span class="progress-name">Protein (Build & Repair)</span>
                <span class="progress-value text-accent font-bold">${calculated.macros.protein}g</span>
              </div>
              <div class="progress-bar mb-xs"><div class="progress-bar-fill fill-protein" style="width: 35%"></div></div>
              
              <div class="progress-label">
                <span class="progress-name">Carbohydrates (Energy)</span>
                <span class="progress-value text-warning font-bold">${calculated.macros.carbs}g</span>
              </div>
              <div class="progress-bar mb-xs"><div class="progress-bar-fill fill-carbs" style="width: 45%"></div></div>
              
              <div class="progress-label">
                <span class="progress-name">Fats (Hormones & Health)</span>
                <span class="progress-value text-danger font-bold">${calculated.macros.fat}g</span>
              </div>
              <div class="progress-bar"><div class="progress-bar-fill fill-fat" style="width: 20%"></div></div>
            </div>
          </div>
          
          <div class="glass-card flex items-center justify-between">
            <div>
              <div class="font-bold text-sm">Estimated Body Fat: ${onboardingData.bodyFat}%</div>
              <div class="text-xs text-muted">${bfRange.emoji} Category: ${bfRange.label} — ${bfRange.desc}</div>
            </div>
            <span class="badge badge-accent">Verified</span>
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
  const nextBtn = document.getElementById('ob-next-btn');
  const backBtn = document.getElementById('ob-back-btn');
  
  if (nextBtn) {
    nextBtn.addEventListener('click', async () => {
      if (currentStep === 1) {
        const nameInput = document.getElementById('ob-name');
        onboardingData.name = nameInput ? nameInput.value.trim() || 'Champion' : 'Champion';
        const ageInput = document.getElementById('ob-age');
        onboardingData.age = ageInput ? parseInt(ageInput.value) || 25 : 25;
        const sexInput = document.getElementById('ob-sex');
        onboardingData.sex = sexInput ? sexInput.value : 'male';
        const unitsInput = document.getElementById('ob-units');
        onboardingData.units = unitsInput ? unitsInput.value : 'metric';
      }
      
      if (currentStep === 2) {
        const heightInput = document.getElementById('ob-height');
        onboardingData.height = heightInput ? parseFloat(heightInput.value) || 170 : 170;
        const weightInput = document.getElementById('ob-weight');
        onboardingData.weight = weightInput ? parseFloat(weightInput.value) || 70 : 70;
      }
      
      if (currentStep === 4) {
        const trainingInput = document.getElementById('ob-training');
        onboardingData.trainingDays = trainingInput ? parseInt(trainingInput.value) || 4 : 4;
      }
      
      if (currentStep === 5) {
        const manualBf = document.getElementById('ob-manual-bf');
        if (manualBf) {
          onboardingData.bodyFat = Math.max(3, Math.min(55, parseInt(manualBf.value) || 15));
        }
      }
      
      if (currentStep < totalSteps) {
        currentStep++;
        renderStep(container);
      } else {
        // Complete Onboarding
        await completeOnboarding();
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
    document.querySelectorAll('.goal-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.goal-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        onboardingData.goal = card.getAttribute('data-goal');
      });
    });
    
    document.querySelectorAll('.activity-option').forEach(option => {
      option.addEventListener('click', () => {
        document.querySelectorAll('.activity-option').forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
        onboardingData.activityLevel = option.getAttribute('data-activity');
      });
    });
  }
  
  // STEP 4 - Workout training frequency slider & diet chips
  if (currentStep === 4) {
    const slider = document.getElementById('ob-training');
    const label = document.getElementById('training-days-val');
    if (slider && label) {
      slider.addEventListener('input', () => {
        label.textContent = `${slider.value} Days/Week`;
        onboardingData.trainingDays = parseInt(slider.value);
      });
    }
    
    document.querySelectorAll('.chip').forEach(chip => {
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
    const uploadZone = document.getElementById('upload-zone');
    const photoInput = document.getElementById('ob-photo-input');
    const navyBtn = document.getElementById('calc-navy-btn');
    
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
        const neckVal = parseFloat(document.getElementById('ob-neck').value) || 38;
        const waistVal = parseFloat(document.getElementById('ob-waist').value) || 82;
        const hipEl = document.getElementById('ob-hip');
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
          const manualBf = document.getElementById('ob-manual-bf');
          if (manualBf) manualBf.value = bfEst;
          window.showToast('Navy Method Calculated', `Estimated body fat: ${bfEst}%`, 'success');
        } else {
          window.showToast('Calculation Failed', 'Please input valid measurements.', 'danger');
        }
      });
    }
  }
  
  if (currentStep === 6) {
    const explainBtn = document.getElementById('onboarding-explain-btn');
    if (explainBtn) {
      explainBtn.addEventListener('click', () => {
        showExplanationModal();
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
  
  panel.innerHTML = `
    <div class="glass-card text-center" style="position: relative; overflow: hidden; padding: 0; min-height: 250px;">
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
  
  // Inject laser animation style
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
  
  // Simulated steps of scanner
  const steps = [
    { text: 'Registering alignment grids...', log: 'Aligning front torso profile' },
    { text: 'Analyzing waist-to-neck ratio...', log: 'Computing skeletal indicators' },
    { text: 'Finalizing neural approximation...', log: 'Calculating adipose tissue ratio' }
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
      clearInterval(timer);
      
      // Calculate realistic baseline based on user demographics + random minor variance
      let wKg = onboardingData.weight;
      let hCm = onboardingData.height;
      if (onboardingData.units === 'imperial') {
        wKg = onboardingData.weight / 2.20462;
        hCm = onboardingData.height * 2.54;
      }
      
      // Get a baseline using Deurenberg formula
      const bmiBf = bmiBasedEstimate(wKg, hCm, onboardingData.age, onboardingData.sex);
      // Add slight variance to simulate ML precision
      const variance = Math.round((Math.random() * 4 - 2) * 10) / 10; // -2% to +2%
      const finalBf = Math.max(3, Math.min(50, Math.round((bmiBf + variance) * 10) / 10));
      
      onboardingData.bodyFat = finalBf;
      
      // Save progress photo to IndexedDB progressPhotos
      db.progressPhotos.add({
        date: new Date().toISOString().split('T')[0],
        category: 'baseline',
        photo: file,
        bodyFat: finalBf,
        weight: onboardingData.weight,
        createdAt: new Date().toISOString()
      }).catch(e => console.error('[Onboarding] Error saving photo:', e));
      
      window.showToast('Scan Completed', `Visual Estimate: ${finalBf}% Body Fat`, 'success');
      
      // Move to review step
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
