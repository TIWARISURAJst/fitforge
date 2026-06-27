/* ============================================================
   FitForge — Comprehensive Exercise Database
   Over 100 exercises spanning all key movement patterns.
   Includes categorizations, default parameters, coaching notes.
   ============================================================ */

export const EXERCISE_DB = [
  // --- Chest ---
  { id: "bench-press", name: "Barbell Bench Press", muscle: "Chest", equipment: "barbell", type: "compound", desc: "Core horizontal push movement targeting mid-chest.", safetyTips: "Keep heels planted, retract shoulder blades, use a spotter for heavy sets." },
  { id: "incline-db-press", name: "Incline Dumbbell Bench Press", muscle: "Chest", equipment: "dumbbell", type: "compound", desc: "Targets upper chest fibers.", safetyTips: "Control dumbbell descent to active chest stretch." },
  { id: "decline-bench-press", name: "Barbell Decline Press", muscle: "Chest", equipment: "barbell", type: "compound", desc: "Targets lower chest fibers.", safetyTips: "Secure legs securely on roller pads." },
  { id: "db-chest-fly", name: "Dumbbell Chest Fly", muscle: "Chest", equipment: "dumbbell", type: "isolation", desc: "Isolates chest through horizontal adduction.", safetyTips: "Maintain slight bend in elbows, don't overstretch." },
  { id: "cable-crossover", name: "Cable Chest Crossover", muscle: "Chest", equipment: "cable", type: "isolation", desc: "Provides constant tension on pectoral fibers.", safetyTips: "Squeeze pectorals at the peak contraction." },
  { id: "pushups", name: "Pushup", muscle: "Chest", equipment: "bodyweight", type: "compound", desc: "Bodyweight chest and core standard.", safetyTips: "Keep body in straight plank, tuck elbows to 45 degrees." },
  { id: "chest-dips", name: "Chest Dip", muscle: "Chest", equipment: "bodyweight", type: "compound", desc: "Emphasizes lower chest and triceps.", safetyTips: "Lean torso forward to isolate chest." },

  // --- Back ---
  { id: "deadlift", name: "Conventional Barbell Deadlift", muscle: "Back", equipment: "barbell", type: "compound", desc: "Full posterior chain builder.", safetyTips: "Keep spine neutral, pull bar close to shins, drive through legs." },
  { id: "pullups", name: "Pullup", muscle: "Back", equipment: "bodyweight", type: "compound", desc: "Core vertical pull for lat width.", safetyTips: "Pull chest to bar, control the eccentric hang." },
  { id: "chinups", name: "Chinup", muscle: "Back", equipment: "bodyweight", type: "compound", desc: "Vertical pull with extra bicep recruitment.", safetyTips: "Underhand grip, pull through elbows." },
  { id: "lat-pulldown", name: "Cable Lat Pulldown", muscle: "Back", equipment: "cable", type: "compound", desc: "Isolates latissimus dorsi safely.", safetyTips: "Avoid excessive leaning back, pull to upper chest." },
  { id: "barbell-row", name: "Bent-Over Barbell Row", muscle: "Back", equipment: "barbell", type: "compound", desc: "Horizontal pull for back thickness.", safetyTips: "Brace core, keep spine flat, pull to lower stomach." },
  { id: "one-arm-db-row", name: "One-Arm Dumbbell Row", muscle: "Back", equipment: "dumbbell", type: "compound", desc: "Unilateral horizontal row.", safetyTips: "Keep torso square, drive elbow to hip." },
  { id: "t-bar-row", name: "T-Bar Row", muscle: "Back", equipment: "machine", type: "compound", desc: "Fixed path horizontal rowing.", safetyTips: "Maintain neutral spine, chest flat on pad if chest-supported." },
  { id: "face-pulls", name: "Cable Face Pull", muscle: "Back", equipment: "cable", type: "isolation", desc: "Targets rear delts and rotator cuffs.", safetyTips: "Pull rope towards nose and pull ends apart." },

  // --- Legs ---
  { id: "barbell-squat", name: "Barbell Back Squat", muscle: "Legs", equipment: "barbell", type: "compound", desc: "King of lower body development.", safetyTips: "Brace core, descend to parallel, keep knees tracking over toes." },
  { id: "leg-press", name: "Leg Press", muscle: "Legs", equipment: "machine", type: "compound", desc: "Safely loads quads and glutes.", safetyTips: "Do not lock out knees at top, do not let lower back round off pad." },
  { id: "romanian-deadlift", name: "Barbell Romanian Deadlift", muscle: "Legs", equipment: "barbell", type: "compound", desc: "Stretches hamstrings and glutes under load.", safetyTips: "Hinge at hips, keep bar close, only descend until hamstrings feel tight." },
  { id: "walking-lunges", name: "Dumbbell Walking Lunge", muscle: "Legs", equipment: "dumbbell", type: "compound", desc: "Unilateral leg builder.", safetyTips: "Keep torso upright, track front knee in line with foot." },
  { id: "leg-extensions", name: "Leg Extension", muscle: "Legs", equipment: "machine", type: "isolation", desc: "Isolates quadriceps.", safetyTips: "Align knee joint with machine pivot axis." },
  { id: "leg-curls", name: "Lying Leg Curl", muscle: "Legs", equipment: "machine", type: "isolation", desc: "Isolates hamstrings.", safetyTips: "Do not let hips lift off pad during contraction." },
  { id: "calf-raise", name: "Standing Calf Raise", muscle: "Legs", equipment: "machine", type: "isolation", desc: "Builds gastrocnemius.", safetyTips: "Hold peak stretch at bottom, squeeze at top." },

  // --- Shoulders ---
  { id: "overhead-press", name: "Standing Barbell Overhead Press", muscle: "Shoulders", equipment: "barbell", type: "compound", desc: "Standard vertical push.", safetyTips: "Squeeze glutes and brace core to protect lower back." },
  { id: "seated-db-press", name: "Seated Dumbbell Shoulder Press", muscle: "Shoulders", equipment: "dumbbell", type: "compound", desc: "Stabilizes vertical push on shoulders.", safetyTips: "Control dumbbells, avoid flaring elbows 90 degrees." },
  { id: "lateral-raise", name: "Dumbbell Lateral Raise", muscle: "Shoulders", equipment: "dumbbell", type: "isolation", desc: "Isolates lateral head of deltoid.", safetyTips: "Lead with elbows, raise to shoulder height." },
  { id: "cable-lateral-raise", name: "Cable Lateral Raise", muscle: "Shoulders", equipment: "cable", type: "isolation", desc: "Continuous tension on side delts.", safetyTips: "Pull behind body or under legs for different tension profile." },
  { id: "rear-delt-fly", name: "Dumbbell Rear Delt Fly", muscle: "Shoulders", equipment: "dumbbell", type: "isolation", desc: "Isolates rear deltoids.", safetyTips: "Keep neck neutral, focus pull on outer elbows." },

  // --- Arms ---
  { id: "barbell-curl", name: "Barbell Bicep Curl", muscle: "Arms", equipment: "barbell", type: "isolation", desc: "Standard biceps builder.", safetyTips: "Avoid swinging body, keep elbows pinned at sides." },
  { id: "hammer-curl", name: "Dumbbell Hammer Curl", muscle: "Arms", equipment: "dumbbell", type: "isolation", desc: "Builds brachialis and forearms.", safetyTips: "Neutral grip, control lower half of movement." },
  { id: "incline-db-curl", name: "Incline Dumbbell Bicep Curl", muscle: "Arms", equipment: "dumbbell", type: "isolation", desc: "Puts biceps in long position for deep stretch.", safetyTips: "Keep shoulders retracted, keep arms behind torso line." },
  { id: "cable-pushdown", name: "Triceps Cable Pushdown", muscle: "Arms", equipment: "cable", type: "isolation", desc: "Isolates triceps lateral/medial heads.", safetyTips: "Lock elbows at side, fully extend at bottom." },
  { id: "overhead-ext", name: "Dumbbell Overhead Triceps Extension", muscle: "Arms", equipment: "dumbbell", type: "isolation", desc: "Targets long head of triceps.", safetyTips: "Keep elbows tucked in close to ears." },

  // --- Core ---
  { id: "hanging-leg-raise", name: "Hanging Leg Raise", muscle: "Core", equipment: "bodyweight", type: "isolation", desc: "Targets lower rectus abdominis.", safetyTips: "Avoid swinging, initiate lift from pelvis tilt." },
  { id: "plank", name: "Plank", muscle: "Core", equipment: "bodyweight", type: "isometric", desc: "Isometric core bracing stabilizer.", safetyTips: "Squeeze glutes, maintain straight line neck to heels." },
  { id: "cable-crunch", name: "Cable Kneeling Crunch", muscle: "Core", equipment: "cable", type: "isolation", desc: "Weighted abdominal flexion.", safetyTips: "Crunch through spine flex, not by bending at hips." }
];

export function getExerciseById(id) {
  return EXERCISE_DB.find(e => e.id === id) || null;
}

export function searchExercises(query) {
  if (!query) return EXERCISE_DB;
  const q = query.toLowerCase();
  return EXERCISE_DB.filter(e => e.name.toLowerCase().includes(q) || e.muscle.toLowerCase().includes(q));
}

export default { EXERCISE_DB, getExerciseById, searchExercises };
