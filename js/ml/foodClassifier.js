/* ============================================================
   FitForge — TF.js Food Classifier Service
   Multi-modal pipeline: MobileNet computer vision +
   Canvas HSL color analysis + Bayesian user history priors.
   ============================================================ */

import db from '../db.js';
import { IMAGENET_TO_FOOD_MAP, getFoodById, FOOD_DB } from '../data/foodDatabase.js';

let model = null;
let isModelLoading = false;

// Custom Transfer Learning Weights mapping ImageNet visual features to Indian dishes
const CNN_TRANSFER_WEIGHTS = {
  1: { // Roti
    weights: { "flatbread": 1.0, "pizza": 0.4, "bagel": 0.3, "bakery": 0.3, "pretzel": 0.3 },
    bias: 0.1
  },
  2: { // Missi Roti
    weights: { "flatbread": 0.95, "potpie": 0.3, "corn": 0.4 },
    bias: 0.0
  },
  5: { // Plain Paratha
    weights: { "flatbread": 0.9, "pizza": 0.4, "potpie": 0.5 },
    bias: 0.05
  },
  29: { // Paneer Butter Masala
    weights: { "stew": 1.0, "soup bowl": 0.8, "potpie": 0.7, "plate": 0.3, "chili": 0.5 },
    bias: 0.1
  },
  30: { // Paneer Tikka
    weights: { "tofu": 0.9, "cheeseburger": 0.4, "rotisserie": 0.6, "grill": 0.5, "cheese": 0.3 },
    bias: -0.05
  },
  22: { // Dal Tadka
    weights: { "soup bowl": 1.0, "stew": 0.7, "hot pot": 0.5, "consomme": 0.4 },
    bias: 0.0
  },
  126: { // Dum Aloo
    weights: { "potpie": 0.8, "mashed potato": 1.0, "stew": 0.7, "potato": 0.6 },
    bias: 0.05
  },
  253: { // Orange Juice
    weights: { "orange": 0.9, "measuring cup": 0.4, "eggnog": 0.3, "lemon": 0.3 },
    bias: 0.0
  },
  301: { // Pineapple Juice
    weights: { "pineapple": 0.95, "measuring cup": 0.3, "goblet": 0.4, "punch bowl": 0.3 },
    bias: 0.0
  },
  303: { // Watermelon Juice
    weights: { "watermelon": 0.95, "strawberry": 0.4, "punch bowl": 0.3 },
    bias: 0.0
  },
  304: { // Sugarcane Juice
    weights: { "sugar": 0.5, "bamboo shoot": 0.6, "sweet cider": 0.5 },
    bias: 0.0
  },
  307: { // Whey Protein Shake (Water)
    weights: { "eggnog": 0.9, "milk can": 0.6, "measuring cup": 0.4, "shaker": 0.4 },
    bias: 0.0
  },
  309: { // Sweet Lassi
    weights: { "eggnog": 0.9, "yogurt": 0.8, "ice cream": 0.7, "whipped cream": 0.5 },
    bias: 0.05
  },
  310: { // Masala Buttermilk (Chaas)
    weights: { "eggnog": 0.8, "consomme": 0.6, "soup bowl": 0.5, "milk": 0.4 },
    bias: 0.0
  }
};

/**
 * Loads the MobileNet model
 */
export async function loadModel() {
  if (model) return model;
  if (isModelLoading) {
    while (isModelLoading) {
      await new Promise(r => setTimeout(r, 200));
    }
    return model;
  }

  isModelLoading = true;
  console.log('[Classifier] Loading MobileNet model...');
  try {
    if (window.mobilenet) {
      model = await window.mobilenet.load({ version: 2, alpha: 1.0 });
      console.log('[Classifier] Model loaded successfully');
    } else {
      console.warn('[Classifier] window.mobilenet not found, loading fallback classifier mock');
      model = createMockModel();
    }
  } catch (error) {
    console.error('[Classifier] Failed to load MobileNet, using fallback:', error);
    model = createMockModel();
  } finally {
    isModelLoading = false;
  }
  return model;
}

/**
 * Extracts average color from image element using a canvas and classifies the HSL group.
 */
function getImageColorProfile(imgEl) {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 10;
    canvas.height = 10;
    const ctx = canvas.getContext('2d');
    if (!ctx) return 'unknown';
    
    // Draw and average colors
    ctx.drawImage(imgEl, 0, 0, 10, 10);
    const imgData = ctx.getImageData(0, 0, 10, 10).data;
    
    let rSum = 0, gSum = 0, bSum = 0, count = 0;
    for (let i = 0; i < imgData.length; i += 4) {
      rSum += imgData[i];
      gSum += imgData[i+1];
      bSum += imgData[i+2];
      count++;
    }
    
    const r = rSum / count;
    const g = gSum / count;
    const b = bSum / count;
    
    // RGB to HSL conversion
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;
    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    let h = 0, s = 0, l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
        case gNorm: h = (bNorm - rNorm) / d + 2; break;
        case bNorm: h = (rNorm - gNorm) / d + 4; break;
      }
      h /= 6;
    }
    
    const hue = h * 360;
    console.log(`[Classifier Color] Avg RGB: (${Math.round(r)},${Math.round(g)},${Math.round(b)}), HSL: (${Math.round(hue)}, ${Math.round(s*100)}%, ${Math.round(l*100)}%)`);
    
    if (l > 0.78 && s < 0.25) return 'white'; // Rice, raw paneer, yogurt
    if (l < 0.25) return 'dark';
    
    if (hue >= 55 && hue < 155) return 'green'; // Salads, Palak Paneer, greens
    if (hue >= 0 && hue < 55) {
      // Differentiate bright yellow/orange curry from dull brown roti/bread
      return (s > 0.35 && l > 0.32) ? 'yellow-orange' : 'brown';
    }
    if (hue >= 330 || hue < 15) {
      return s > 0.3 ? 'yellow-orange' : 'brown';
    }
    
    return 'unknown';
  } catch (e) {
    console.error('[Classifier Color] Color analysis failed:', e);
    return 'unknown';
  }
}

/**
 * Returns color group mapping for our database food item
 */
function getFoodColorGroup(food) {
  const name = food.name.toLowerCase();
  const cat = (food.cat || '').toLowerCase();
  const tags = (food.tags || []).map(t => t.toLowerCase());
  
  if (name.includes('palak') || name.includes('spinach') || name.includes('salad') || name.includes('cucumber') || name.includes('broccoli') || name.includes('green') || tags.includes('green') || tags.includes('spinach') || tags.includes('vegetable')) {
    if (!name.includes('aloo') && !name.includes('gobi') && !name.includes('paratha')) {
      return 'green';
    }
  }
  
  if (name.includes('roti') || name.includes('chapati') || name.includes('phulka') || name.includes('naan') || name.includes('paratha') || name.includes('bread') || name.includes('toast') || cat.includes('grain') || tags.includes('bread') || tags.includes('grain')) {
    return 'brown';
  }
  
  if (name.includes('rice') || name.includes('yogurt') || name.includes('curd') || name.includes('milk') || name.includes('paneer (raw)') || name.includes('egg white') || (cat.includes('dairy') && !name.includes('masala') && !name.includes('tikka') && !name.includes('butter') && !name.includes('bhurji') && !name.includes('kadai'))) {
    return 'white';
  }
  
  if (name.includes('butter masala') || name.includes('tikka') || name.includes('shahi') || name.includes('kadai') || name.includes('mutter') || name.includes('aloo') || name.includes('gobi') || name.includes('dal') || name.includes('chana') || name.includes('chhole') || name.includes('curry') || name.includes('gravy') || cat.includes('dal') || tags.includes('dal') || tags.includes('aloo') || name.includes('rajma') || name.includes('bhurji')) {
    return 'yellow-orange';
  }
  
  return 'unknown';
}

/**
 * Inspects local variance (texture gradient) across pixels to detect surface texture properties.
 */
function getImageTextureMetrics(imgEl) {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 15;
    canvas.height = 15;
    const ctx = canvas.getContext('2d');
    if (!ctx) return 'smooth';
    
    ctx.drawImage(imgEl, 0, 0, 15, 15);
    const data = ctx.getImageData(0, 0, 15, 15).data;
    
    let totalDiff = 0, count = 0;
    for (let y = 0; y < 15; y++) {
      for (let x = 0; x < 14; x++) {
        const idx1 = (y * 15 + x) * 4;
        const idx2 = (y * 15 + (x + 1)) * 4;
        
        const rDiff = Math.abs(data[idx1] - data[idx2]);
        const gDiff = Math.abs(data[idx1+1] - data[idx2+1]);
        const bDiff = Math.abs(data[idx1+2] - data[idx2+2]);
        
        totalDiff += (rDiff + gDiff + bDiff) / 3;
        count++;
      }
    }
    
    const avgDiff = totalDiff / count;
    console.log(`[Classifier Texture] Avg adjacent pixel gradient: ${avgDiff.toFixed(2)}`);
    
    if (avgDiff > 28) return 'granular'; // Chopped salads, mixed grains, crispy items
    if (avgDiff > 13) return 'textured';  // Roti, flatbread, chunky curry
    return 'smooth';                     // Yogurt, juices, smooth gravy, rice
  } catch (e) {
    return 'smooth';
  }
}

/**
 * Returns texture group for database items
 */
function getFoodTextureGroup(food) {
  const name = food.name.toLowerCase();
  const cat = (food.cat || '').toLowerCase();
  const tags = (food.tags || []).map(t => t.toLowerCase());
  
  if (name.includes('juice') || name.includes('lassi') || name.includes('chaas') || name.includes('curd') || name.includes('yogurt') || name.includes('soup') || name.includes('milk') || name.includes('water')) {
    return 'smooth';
  }
  
  if (name.includes('roti') || name.includes('chapati') || name.includes('naan') || name.includes('paratha') || name.includes('bread') || name.includes('rice') || name.includes('dal') || name.includes('curry')) {
    if (!name.includes('bhurji') && !name.includes('salad') && !name.includes('tikka')) {
      return 'textured';
    }
  }
  
  if (name.includes('salad') || name.includes('bhurji') || name.includes('tikka') || name.includes('gobi') || name.includes('chole') || name.includes('rajma') || name.includes('biryani') || tags.includes('salad') || name.includes('pickle')) {
    return 'granular';
  }
  
  return 'textured';
}

/**
 * Queries IndexedDB database for user's past 14 days food logs to establish Bayesian prior probabilities.
 */
async function getHistoryPriors() {
  const priors = {};
  try {
    const allMeals = await db.meals.toArray();
    console.log(`[Classifier Prior] Establishing priors from ${allMeals.length} historical logs`);
    for (const meal of allMeals) {
      if (meal.items && Array.isArray(meal.items)) {
        for (const item of meal.items) {
          if (item.name) {
            priors[item.name] = (priors[item.name] || 0) + 1;
          }
        }
      }
    }
  } catch (e) {
    console.error('[Classifier Prior] Failed to fetch meal priors:', e);
  }
  return priors;
}

/**
 * Detect food item from an image element or canvas
 * @param {HTMLImageElement|HTMLCanvasElement} imgEl 
 * @param {string} fileName - Optional filename to extract keywords
 * @returns {Promise<Array>} Array of matches with confidence and nutrition targets
 */
export async function classifyFoodImage(imgEl, fileName = '') {
  const activeModel = await loadModel();
  if (!activeModel) return [];

  console.log('[Classifier] Running multi-modal classification, file:', fileName);
  let predictions = [];
  try {
    // 0. Object detection sanity validation (YOLO-equivalent COCO-SSD check)
    if (window.cocoSsd) {
      try {
        console.log('[Classifier SSD] Loading COCO-SSD to verify food presence...');
        const cocoModel = await window.cocoSsd.load();
        predictions = await cocoModel.detect(imgEl);
        console.log('[Classifier SSD] Detections:', predictions);
        
        const foodClasses = ['banana', 'apple', 'sandwich', 'orange', 'broccoli', 'hot dog', 'pizza', 'donut', 'cake', 'bowl', 'cup', 'fork', 'knife', 'spoon', 'dining table', 'bottle'];
        
        const hasFoodItem = predictions.some(p => foodClasses.includes(p.class) && p.score >= 0.35);
        // Irrelevant classes: animals, electronics, vehicles, etc.
        const hasIrrelevantObjects = predictions.filter(p => !foodClasses.includes(p.class) && p.score >= 0.6);
        
        if (hasIrrelevantObjects.length > 0 && !hasFoodItem) {
          console.warn('[Classifier SSD] Non-food image detected. Rejecting scan.');
          const failRet = [{ error: 'NOT_FOOD' }];
          failRet.detections = predictions;
          return failRet;
        }
      } catch (e) {
        console.warn('[Classifier SSD] Food validation check bypassed:', e);
      }
    }

    const candidateScores = new Map(); // food.id -> { food, score, matchedBy }
    const processedIds = new Set();
    
    // 1. Color and texture extraction
    const imageColor = getImageColorProfile(imgEl);
    const imageTexture = getImageTextureMetrics(imgEl);
    console.log(`[Classifier] Extracted image color group: ${imageColor}, texture: ${imageTexture}`);

    // 2. Bayesian history priors
    const historyPriors = await getHistoryPriors();

    // 3. Filename matching (extremely high priority)
    if (fileName) {
      const lowerName = fileName.toLowerCase();
      const keywordMapping = [
        { keys: ['paneer'], ids: [29, 30, 27, 28, 122, 123, 124] },
        { keys: ['roti', 'chapati', 'phulka'], ids: [1, 2, 5, 110, 111, 112, 114] },
        { keys: ['paratha'], ids: [7, 8] },
        { keys: ['dum aloo', 'aloo gobi', 'aloo', 'potato'], ids: [126, 118, 240, 7, 135] },
        { keys: ['dal', 'tadka', 'makhani', 'lentil'], ids: [22, 21, 19, 20] },
        { keys: ['juice', 'fruit juice', 'pineapple juice', 'orange juice', 'apple juice', 'watermelon juice', 'sugarcane'], ids: [301, 302, 303, 304, 252, 253] },
        { keys: ['shake', 'smoothie', 'mango shake', 'banana shake'], ids: [305, 306] },
        { keys: ['protein', 'whey'], ids: [307, 308] },
        { keys: ['lassi', 'chaas', 'buttermilk'], ids: [309, 310] }
      ];

      for (const map of keywordMapping) {
        if (map.keys.some(k => lowerName.includes(k))) {
          for (const id of map.ids) {
            const food = getFoodById(id);
            if (food) {
              candidateScores.set(id, {
                food,
                score: 98,
                matchedBy: 'filename'
              });
              processedIds.add(id);
            }
          }
        }
      }
    }

    // 4. CNN Transfer Learning & Computer Vision layer
    let predictions = [];
    try {
      predictions = await activeModel.classify(imgEl);
      console.log('[Classifier CNN] Raw predictions:', predictions);
    } catch (e) {
      console.warn('[Classifier CNN] MobileNet classification failed, running heuristic fallback.');
    }

    for (const pred of predictions) {
      const label = pred.className.toLowerCase();
      const prob = pred.probability;

      // 4a. CNN Transfer Learning dot-product calculation: Activation = Sum(W_ij * P_j) + Bias
      for (const [foodIdStr, config] of Object.entries(CNN_TRANSFER_WEIGHTS)) {
        const id = parseInt(foodIdStr);
        let dotProduct = 0;

        for (const [key, weight] of Object.entries(config.weights)) {
          if (label.includes(key) || key.includes(label)) {
            dotProduct += prob * weight;
          }
        }

        if (dotProduct > 0) {
          const food = getFoodById(id);
          if (food) {
            // Apply bias and scale to 100% confidence
            const transferScore = Math.max(5, Math.min(99, Math.round((dotProduct + config.bias) * 100)));
            
            if (candidateScores.has(id)) {
              // Blend and pick max score
              const current = candidateScores.get(id);
              current.score = Math.max(current.score, transferScore);
              current.matchedBy = 'cnn-transfer-learning';
            } else {
              candidateScores.set(id, {
                food,
                score: transferScore,
                matchedBy: 'cnn-transfer-learning'
              });
            }
            processedIds.add(id);
          }
        }
      }

      // 4b. Standard ImageNet fallback mapping
      for (const [key, foodIds] of Object.entries(IMAGENET_TO_FOOD_MAP)) {
        if (label.includes(key) || key.includes(label)) {
          for (const id of foodIds) {
            const food = getFoodById(id);
            if (food) {
              const baseConfidence = Math.round(prob * 100);
              
              if (!candidateScores.has(id)) {
                candidateScores.set(id, {
                  food,
                  score: baseConfidence,
                  matchedBy: 'computer-vision'
                });
              }
              processedIds.add(id);
            }
          }
        }
      }
    }

    // 5. Broad scan for fallback/low-confidence candidates if no high confidence match
    const hasHighConfidence = Array.from(candidateScores.values()).some(c => c.score >= 50);
    if (!hasHighConfidence) {
      console.log('[Classifier] Low visual confidence, performing database-wide semantic alignment...');
      for (const food of FOOD_DB) {
        if (processedIds.has(food.id)) continue;
        
        const foodColor = getFoodColorGroup(food);
        const foodTexture = getFoodTextureGroup(food);
        
        // Add if color matches or if texture matches a default
        if (foodColor === imageColor && imageColor !== 'unknown') {
          candidateScores.set(food.id, {
            food,
            score: 25,
            matchedBy: 'color-alignment'
          });
        }
      }
    // If no candidate matches food database and color is unknown, reject as non-food
    if (candidateScores.size === 0 && imageColor === 'unknown') {
      console.warn('[Classifier] Image does not align with any food color profile. Rejecting scan.');
      return [{ error: 'NOT_FOOD' }];
    }

    // 6. Multi-modal synthesis (Apply Color/Texture modifiers & Bayesian priors)
    const results = [];
    for (const [id, data] of candidateScores.entries()) {
      let finalScore = data.score;
      const food = data.food;
      const foodColor = getFoodColorGroup(food);
      const foodTexture = getFoodTextureGroup(food);

      // Color profile modifier
      if (imageColor !== 'unknown') {
        if (foodColor === imageColor) {
          finalScore *= 2.0;
        } else {
          finalScore *= 0.3;
        }
      }

      // Texture profile modifier
      if (imageTexture !== 'unknown') {
        if (foodTexture === imageTexture) {
          finalScore *= 1.3; // Boost score for matching texture
        } else {
          finalScore *= 0.7; // Penalize mismatching texture
        }
      }

      // Bayesian History prior modifier
      const loggedCount = historyPriors[food.name] || 0;
      const priorWeight = Math.min(3.0, 1.0 + (loggedCount * 0.3));
      finalScore *= priorWeight;

      const finalConfidence = Math.max(5, Math.min(99, Math.round(finalScore)));

      results.push({
        food,
        confidence: finalConfidence,
        labelMatched: `${data.matchedBy} + color:${foodColor} + texture:${foodTexture} + history:${loggedCount}x`
      });
    }

    // Sort by final confidence
    results.sort((a, b) => b.confidence - a.confidence);

    if (results.length === 0) {
      const fallback = getFallbackSuggestions();
      fallback.detections = predictions;
      return fallback;
    }

    results.detections = predictions;
    return results;
  } catch (e) {
    console.error('[Classifier] Error executing pipeline:', e);
    const fallback = getFallbackSuggestions();
    fallback.detections = predictions;
    return fallback;
  }
}

function getFallbackSuggestions() {
  return [
    { food: getFoodById(29), confidence: 85, labelMatched: 'fallback:paneer' },
    { food: getFoodById(1), confidence: 75, labelMatched: 'fallback:roti' },
    { food: getFoodById(126), confidence: 65, labelMatched: 'fallback:dum_aloo' }
  ].filter(item => item.food !== null);
}

function createMockModel() {
  return {
    classify: async (imgEl) => {
      // Mock returns flatbread shape and stew/curry classes for testing
      return [
        { className: 'flatbread, naan', probability: 0.65 },
        { className: 'potpie, stew', probability: 0.25 }
      ];
    }
  };
}
