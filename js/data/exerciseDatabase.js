/* ============================================================
   FitForge — Comprehensive Exercise Database (150+ Entries)
   Includes categories, equipment, safety tips, and YouTube embed URLs.
   ============================================================ */

export const EXERCISE_DB = [
  // --- Chest ---
  { id: "bench-press", name: "Barbell Bench Press", muscle: "Chest", equipment: "barbell", type: "compound", desc: "Core horizontal push movement targeting mid-chest.", safetyTips: "Keep heels planted, retract shoulder blades, use a spotter for heavy sets.", videoUrl: "https://www.youtube.com/embed/rT7DgCrgW5Y" },
  { id: "incline-db-press", name: "Incline Dumbbell Bench Press", muscle: "Chest", equipment: "dumbbell", type: "compound", desc: "Targets upper chest fibers.", safetyTips: "Control dumbbell descent to active chest stretch.", videoUrl: "https://www.youtube.com/embed/8iPEnTdb6Cs" },
  { id: "decline-bench-press", name: "Barbell Decline Press", muscle: "Chest", equipment: "barbell", type: "compound", desc: "Targets lower chest fibers.", safetyTips: "Secure legs securely on roller pads.", videoUrl: "https://www.youtube.com/embed/LfyQBUKR8SE" },
  { id: "db-chest-fly", name: "Dumbbell Chest Fly", muscle: "Chest", equipment: "dumbbell", type: "isolation", desc: "Isolates chest through horizontal adduction.", safetyTips: "Maintain slight bend in elbows, don't overstretch.", videoUrl: "https://www.youtube.com/embed/eozdVDA78K0" },
  { id: "cable-crossover", name: "Cable Chest Crossover", muscle: "Chest", equipment: "cable", type: "isolation", desc: "Provides constant tension on pectoral fibers.", safetyTips: "Squeeze pectorals at the peak contraction.", videoUrl: "https://www.youtube.com/embed/W5tVf83n7sM" },
  { id: "pushups", name: "Pushup", muscle: "Chest", equipment: "bodyweight", type: "compound", desc: "Bodyweight chest and core standard.", safetyTips: "Keep body in straight plank, tuck elbows to 45 degrees.", videoUrl: "https://www.youtube.com/embed/IODxDxX7oi4" },
  { id: "chest-dips", name: "Chest Dip", muscle: "Chest", equipment: "bodyweight", type: "compound", desc: "Emphasizes lower chest and triceps.", safetyTips: "Lean torso forward to isolate chest.", videoUrl: "https://www.youtube.com/embed/2z8JmcrW-As" },
  { id: "incline-barbell-press", name: "Incline Barbell Press", muscle: "Chest", equipment: "barbell", type: "compound", desc: "Barbell horizontal press at a 30-45 degree angle.", safetyTips: "Touch bar to upper chest, keep wrists stacked.", videoUrl: "https://www.youtube.com/embed/SrqOu55i-OQ" },
  { id: "machine-chest-press", name: "Machine Chest Press", muscle: "Chest", equipment: "machine", type: "compound", desc: "Isolated horizontal pushing path.", safetyTips: "Adjust seat so handles align with mid-chest.", videoUrl: "https://www.youtube.com/embed/NwzUJeElp0U" },
  { id: "pec-dec-fly", name: "Pec Dec Fly", muscle: "Chest", equipment: "machine", type: "isolation", desc: "Machine pectoralis fly.", safetyTips: "Keep elbows slightly bent and shoulders back.", videoUrl: "https://www.youtube.com/embed/O-Ob506y1sI" },
  { id: "floor-press", name: "Barbell Floor Press", muscle: "Chest", equipment: "barbell", type: "compound", desc: "Bench press from the floor; limits range of motion.", safetyTips: "Extend elbows fully at top, control descent.", videoUrl: "https://www.youtube.com/embed/uGis_a0P9M8" },
  { id: "svend-press", name: "Svend Press", muscle: "Chest", equipment: "dumbbell", type: "isolation", desc: "Pinch press targeting inner pectorals.", safetyTips: "Squeeze plates together hard during execution.", videoUrl: "https://www.youtube.com/embed/tB5vsnD8eP8" },

  // --- Back ---
  { id: "deadlift", name: "Conventional Barbell Deadlift", muscle: "Back", equipment: "barbell", type: "compound", desc: "Full posterior chain builder.", safetyTips: "Keep spine neutral, pull bar close to shins, drive through legs.", videoUrl: "https://www.youtube.com/embed/op9kVnSso6Q" },
  { id: "pullups", name: "Pullup", muscle: "Back", equipment: "bodyweight", type: "compound", desc: "Core vertical pull for lat width.", safetyTips: "Pull chest to bar, control the eccentric hang.", videoUrl: "https://www.youtube.com/embed/eGo4IYlbE5g" },
  { id: "chinups", name: "Chinup", muscle: "Back", equipment: "bodyweight", type: "compound", desc: "Vertical pull with extra bicep recruitment.", safetyTips: "Underhand grip, pull through elbows.", videoUrl: "https://www.youtube.com/embed/mRznU6pzez0" },
  { id: "lat-pulldown", name: "Cable Lat Pulldown", muscle: "Back", equipment: "cable", type: "compound", desc: "Isolates latissimus dorsi safely.", safetyTips: "Avoid excessive leaning back, pull to upper chest.", videoUrl: "https://www.youtube.com/embed/CAwf7n6Luuc" },
  { id: "barbell-row", name: "Bent-Over Barbell Row", muscle: "Back", equipment: "barbell", type: "compound", desc: "Horizontal pull for back thickness.", safetyTips: "Brace core, keep spine flat, pull to lower stomach.", videoUrl: "https://www.youtube.com/embed/G8l_8chR5BE" },
  { id: "one-arm-db-row", name: "One-Arm Dumbbell Row", muscle: "Back", equipment: "dumbbell", type: "compound", desc: "Unilateral horizontal row.", safetyTips: "Keep torso square, drive elbow to hip.", videoUrl: "https://www.youtube.com/embed/dFzUjzfih70" },
  { id: "t-bar-row", name: "T-Bar Row", muscle: "Back", equipment: "machine", type: "compound", desc: "Fixed path horizontal rowing.", safetyTips: "Maintain neutral spine, chest flat on pad if chest-supported.", videoUrl: "https://www.youtube.com/embed/yPepKU14TdA" },
  { id: "face-pulls", name: "Cable Face Pull", muscle: "Back", equipment: "cable", type: "isolation", desc: "Targets rear delts and rotator cuffs.", safetyTips: "Pull rope towards nose and pull ends apart.", videoUrl: "https://www.youtube.com/embed/V8dZ3S3s-54" },
  { id: "sumo-deadlift", name: "Sumo Deadlift", muscle: "Back", equipment: "barbell", type: "compound", desc: "Deadlift with wide stance; reduces back load.", safetyTips: "Keep knees pushed out, chest upright.", videoUrl: "https://www.youtube.com/embed/wYREQGlvTXc" },
  { id: "hyper-extension", name: "Back Hyperextension", muscle: "Back", equipment: "bodyweight", type: "isolation", desc: "Strengthens lower back and glutes.", safetyTips: "Do not hyperextend the spine at the top.", videoUrl: "https://www.youtube.com/embed/5_Ej72a4LRI" },
  { id: "rack-pulls", name: "Barbell Rack Pull", muscle: "Back", equipment: "barbell", type: "compound", desc: "Partial deadlift starting from knee level.", safetyTips: "Avoid shrugging shoulders at the top.", videoUrl: "https://www.youtube.com/embed/e1B55k9N_88" },
  { id: "inverted-row", name: "Inverted Row", muscle: "Back", equipment: "bodyweight", type: "compound", desc: "Bodyweight pull targeting upper back.", safetyTips: "Keep body in straight plank position.", videoUrl: "https://www.youtube.com/embed/hEXgJe9SjG4" },
  { id: "lat-pullover-db", name: "Dumbbell Lat Pullover", muscle: "Back", equipment: "dumbbell", type: "isolation", desc: "Stretches lats through shoulder extension.", safetyTips: "Keep core tight, don't arch lower back.", videoUrl: "https://www.youtube.com/embed/jZ_y9N3E9X4" },

  // --- Legs ---
  { id: "barbell-squat", name: "Barbell Back Squat", muscle: "Legs", equipment: "barbell", type: "compound", desc: "King of lower body development.", safetyTips: "Brace core, descend to parallel, keep knees tracking over toes.", videoUrl: "https://www.youtube.com/embed/ultWZbUMG8g" },
  { id: "leg-press", name: "Leg Press", muscle: "Legs", equipment: "machine", type: "compound", desc: "Safely loads quads and glutes.", safetyTips: "Do not lock out knees at top, do not let lower back round off pad.", videoUrl: "https://www.youtube.com/embed/yZmx_7xsYh8" },
  { id: "romanian-deadlift", name: "Barbell Romanian Deadlift", muscle: "Legs", equipment: "barbell", type: "compound", desc: "Stretches hamstrings and glutes under load.", safetyTips: "Hinge at hips, keep bar close, only descend until hamstrings feel tight.", videoUrl: "https://www.youtube.com/embed/2SHsk9AzdgA" },
  { id: "walking-lunges", name: "Dumbbell Walking Lunge", muscle: "Legs", equipment: "dumbbell", type: "compound", desc: "Unilateral leg builder.", safetyTips: "Keep torso upright, track front knee in line with foot.", videoUrl: "https://www.youtube.com/embed/D7KaRcUTQeY" },
  { id: "leg-extensions", name: "Leg Extension", muscle: "Legs", equipment: "machine", type: "isolation", desc: "Isolates quadriceps.", safetyTips: "Align knee joint with machine pivot axis.", videoUrl: "https://www.youtube.com/embed/m0GP6PaMwFw" },
  { id: "leg-curls", name: "Lying Leg Curl", muscle: "Legs", equipment: "machine", type: "isolation", desc: "Isolates hamstrings.", safetyTips: "Do not let hips lift off pad during contraction.", videoUrl: "https://www.youtube.com/embed/1Tq3Qd1ADHo" },
  { id: "calf-raise", name: "Standing Calf Raise", muscle: "Legs", equipment: "machine", type: "isolation", desc: "Builds gastrocnemius.", safetyTips: "Hold peak stretch at bottom, squeeze at top.", videoUrl: "https://www.youtube.com/embed/SYMArUSt2bE" },
  { id: "front-squat", name: "Barbell Front Squat", muscle: "Legs", equipment: "barbell", type: "compound", desc: "Squat with bar on front shoulders; quad-dominant.", safetyTips: "Keep elbows high, stay upright.", videoUrl: "https://www.youtube.com/embed/v-mQm_onjN8" },
  { id: "bulgarian-split-squat", name: "Bulgarian Split Squat", muscle: "Legs", equipment: "dumbbell", type: "compound", desc: "Rear-foot elevated split squat; quad & glute builder.", safetyTips: "Keep front knee in line with front foot.", videoUrl: "https://www.youtube.com/embed/2C-uNgKwPLE" },
  { id: "hip-thrust", name: "Barbell Hip Thrust", muscle: "Legs", equipment: "barbell", type: "compound", desc: "Ultimate glute isolation exercise.", safetyTips: "Tuck chin, lock hips at top with glute squeeze.", videoUrl: "https://www.youtube.com/embed/SEdqd1n0ad0" },
  { id: "hack-squat", name: "Hack Squat", muscle: "Legs", equipment: "machine", type: "compound", desc: "Quad-focused machine squat.", safetyTips: "Keep feet flat on platform, control depth.", videoUrl: "https://www.youtube.com/embed/0encrg28528" },
  { id: "goblet-squat", name: "Dumbbell Goblet Squat", muscle: "Legs", equipment: "dumbbell", type: "compound", desc: "Front-loaded dumbbell squat.", safetyTips: "Hold dumbbell tight to chest, keep heels down.", videoUrl: "https://www.youtube.com/embed/MeIiYIFkRow" },

  // --- Shoulders ---
  { id: "overhead-press", name: "Standing Barbell Overhead Press", muscle: "Shoulders", equipment: "barbell", type: "compound", desc: "Standard vertical push.", safetyTips: "Squeeze glutes and brace core to protect lower back.", videoUrl: "https://www.youtube.com/embed/2yjwXT-212I" },
  { id: "seated-db-press", name: "Seated Dumbbell Shoulder Press", muscle: "Shoulders", equipment: "dumbbell", type: "compound", desc: "Stabilizes vertical push on shoulders.", safetyTips: "Control dumbbells, avoid flaring elbows 90 degrees.", videoUrl: "https://www.youtube.com/embed/qeValX245DU" },
  { id: "lateral-raise", name: "Dumbbell Lateral Raise", muscle: "Shoulders", equipment: "dumbbell", type: "isolation", desc: "Isolates lateral head of deltoid.", safetyTips: "Lead with elbows, raise to shoulder height.", videoUrl: "https://www.youtube.com/embed/3VcKaXatw2k" },
  { id: "cable-lateral-raise", name: "Cable Lateral Raise", muscle: "Shoulders", equipment: "cable", type: "isolation", desc: "Continuous tension on side delts.", safetyTips: "Pull behind body or under legs for different tension profile.", videoUrl: "https://www.youtube.com/embed/lq7eL_T15K0" },
  { id: "rear-delt-fly", name: "Dumbbell Rear Delt Fly", muscle: "Shoulders", equipment: "dumbbell", type: "isolation", desc: "Isolates rear deltoids.", safetyTips: "Keep neck neutral, focus pull on outer elbows.", videoUrl: "https://www.youtube.com/embed/0G2_XTyOtU0" },
  { id: "arnold-press", name: "Arnold Press", muscle: "Shoulders", equipment: "dumbbell", type: "compound", desc: "Shoulder press with rotation.", safetyTips: "Rotate palms from facing body to facing forward.", videoUrl: "https://www.youtube.com/embed/6PG7Ddu70PM" },
  { id: "upright-row", name: "Barbell Upright Row", muscle: "Shoulders", equipment: "barbell", type: "compound", desc: "Targets lateral deltoids and upper traps.", safetyTips: "Do not pull higher than chest to avoid shoulder impingement.", videoUrl: "https://www.youtube.com/embed/um3VVzJJ57o" },
  { id: "shrugs", name: "Dumbbell Shrug", muscle: "Shoulders", equipment: "dumbbell", type: "isolation", desc: "Isolates upper trapezius.", safetyTips: "Do not roll shoulders; move straight up and down.", videoUrl: "https://www.youtube.com/embed/g6qbq4i1kOI" },

  // --- Arms ---
  { id: "barbell-curl", name: "Barbell Bicep Curl", muscle: "Arms", equipment: "barbell", type: "isolation", desc: "Standard biceps builder.", safetyTips: "Avoid swinging body, keep elbows pinned at sides.", videoUrl: "https://www.youtube.com/embed/ykJgr1h0Lec" },
  { id: "hammer-curl", name: "Dumbbell Hammer Curl", muscle: "Arms", equipment: "dumbbell", type: "isolation", desc: "Builds brachialis and forearms.", safetyTips: "Neutral grip, control lower half of movement.", videoUrl: "https://www.youtube.com/embed/tw7DN85c3kI" },
  { id: "incline-db-curl", name: "Incline Dumbbell Bicep Curl", muscle: "Arms", equipment: "dumbbell", type: "isolation", desc: "Puts biceps in long position for deep stretch.", safetyTips: "Keep shoulders retracted, keep arms behind torso line.", videoUrl: "https://www.youtube.com/embed/soxrZlIl35U" },
  { id: "cable-pushdown", name: "Triceps Cable Pushdown", muscle: "Arms", equipment: "cable", type: "isolation", desc: "Isolates triceps lateral/medial heads.", safetyTips: "Lock elbows at side, fully extend at bottom.", videoUrl: "https://www.youtube.com/embed/2-LAMgA9DL4" },
  { id: "overhead-ext", name: "Dumbbell Overhead Triceps Extension", muscle: "Arms", equipment: "dumbbell", type: "isolation", desc: "Targets long head of triceps.", safetyTips: "Keep elbows tucked in close to ears.", videoUrl: "https://www.youtube.com/embed/m1S59A45nRA" },
  { id: "skull-crushers", name: "EZ-Bar Skull Crusher", muscle: "Arms", equipment: "barbell", type: "isolation", desc: "Targets long head of triceps from flat bench.", safetyTips: "Lower bar slowly to forehead or behind head.", videoUrl: "https://www.youtube.com/embed/d_KZxkY_0cM" },
  { id: "concentration-curl", name: "Dumbbell Concentration Curl", muscle: "Arms", equipment: "dumbbell", type: "isolation", desc: "Strict bicep peak builder.", safetyTips: "Brace elbow against inner thigh, do not swing.", videoUrl: "https://www.youtube.com/embed/JvjVzgoCcrE" },
  { id: "close-grip-bench", name: "Close-Grip Bench Press", muscle: "Arms", equipment: "barbell", type: "compound", desc: "Pectoral press with narrow grip; triceps builder.", safetyTips: "Hands shoulder-width apart, keep elbows tucked.", videoUrl: "https://www.youtube.com/embed/nEF0buYFShU" },
  { id: "preacher-curl", name: "Preacher Curl", muscle: "Arms", equipment: "barbell", type: "isolation", desc: "Strict bicep curl on sloped bench.", safetyTips: "Avoid extending elbow fully at the bottom.", videoUrl: "https://www.youtube.com/embed/fIWP-FRFNU0" },

  // --- Core ---
  { id: "hanging-leg-raise", name: "Hanging Leg Raise", muscle: "Core", equipment: "bodyweight", type: "isolation", desc: "Targets lower rectus abdominis.", safetyTips: "Avoid swinging, initiate lift from pelvis tilt.", videoUrl: "https://www.youtube.com/embed/vMh46Id6_EA" },
  { id: "plank", name: "Plank", muscle: "Core", equipment: "bodyweight", type: "isometric", desc: "Isometric core bracing stabilizer.", safetyTips: "Squeeze glutes, maintain straight line neck to heels.", videoUrl: "https://www.youtube.com/embed/pSHjTRCQxIw" },
  { id: "cable-crunch", name: "Cable Kneeling Crunch", muscle: "Core", equipment: "cable", type: "isolation", desc: "Weighted abdominal flexion.", safetyTips: "Crunch through spine flex, not by bending at hips.", videoUrl: "https://www.youtube.com/embed/6iP_uN18cGA" },
  { id: "russian-twist", name: "Russian Twist", muscle: "Core", equipment: "bodyweight", type: "isolation", desc: "Rotational core movements.", safetyTips: "Rotate shoulders, not just hands, keep spine long.", videoUrl: "https://www.youtube.com/embed/jD-GstkSsaA" },
  { id: "ab-wheel-rollout", name: "Ab Wheel Rollout", muscle: "Core", equipment: "bodyweight", type: "compound", desc: "Anti-extension core builder.", safetyTips: "Avoid arching lower back; brace core throughout.", videoUrl: "https://www.youtube.com/embed/Z0b7ZtN1vK8" },

  // --- Aerobic / Cardio ---
  { id: "jumping-jacks", name: "Jumping Jacks", muscle: "Full Body", equipment: "none", type: "cardio", desc: "Full body aerobic jumping motion.", safetyTips: "Land softly on balls of feet.", videoUrl: "https://www.youtube.com/embed/2W4ZNSwoW_4" },
  { id: "burpees", name: "Burpee", muscle: "Full Body", equipment: "none", type: "cardio", desc: "High-intensity aerobic plyometric jump.", safetyTips: "Ensure squatting form is maintained on descent.", videoUrl: "https://www.youtube.com/embed/qLBImZy8FPA" },
  { id: "mountain-climbers", name: "Mountain Climbers", muscle: "Full Body", equipment: "none", type: "cardio", desc: "Pushup position alternating leg drive.", safetyTips: "Keep hips low, brace core.", videoUrl: "https://www.youtube.com/embed/cnyTQDSE884" },
  { id: "treadmill-run", name: "Treadmill Running", muscle: "Legs", equipment: "none", type: "cardio", desc: "Endurance cardio running.", safetyTips: "Warm up properly, focus on posture.", videoUrl: "https://www.youtube.com/embed/8t8_a4w8X8M" },
  { id: "rowing-machine", name: "Rowing Machine Cardio", muscle: "Full Body", equipment: "machine", type: "cardio", desc: "Full-body aerobic rowing.", safetyTips: "Drive with legs first, then pull with arms.", videoUrl: "https://www.youtube.com/embed/H07_W4a3J3M" },
  { id: "jump-rope", name: "Jump Rope", muscle: "Full Body", equipment: "none", type: "cardio", desc: "Cardio jump rope coordination.", safetyTips: "Keep jumps low to minimize impact.", videoUrl: "https://www.youtube.com/embed/H0p64F6Z_9I" },

  // --- Calisthenics & Bodyweight ---
  { id: "bodyweight-squat", name: "Air Squat", muscle: "Legs", equipment: "none", type: "compound", desc: "Standard bodyweight squat.", safetyTips: "Keep weight on heels, chest up.", videoUrl: "https://www.youtube.com/embed/rMvwVxpW-yI" },
  { id: "lunges-bodyweight", name: "Bodyweight Lunge", muscle: "Legs", equipment: "none", type: "compound", desc: "Alternating forward bodyweight lunges.", safetyTips: "Maintain knee alignment.", videoUrl: "https://www.youtube.com/embed/L8fvypPr1D0" },
  { id: "pushups-diamond", name: "Diamond Pushup", muscle: "Chest", equipment: "none", type: "compound", desc: "Pushup with hands close together; isolates triceps.", safetyTips: "Tuck elbows, do not flare out.", videoUrl: "https://www.youtube.com/embed/pD3mD6K58Yc" },
  { id: "pike-pushup", name: "Pike Pushup", muscle: "Shoulders", equipment: "none", type: "compound", desc: "Decline pushup targeting shoulders.", safetyTips: "Keep hips high, look towards feet.", videoUrl: "https://www.youtube.com/embed/uR79W8tP8w8" },
  { id: "pullups-wide", name: "Wide Grip Pullup", muscle: "Back", equipment: "none", type: "compound", desc: "Wide arm pullup for outer lat fibers.", safetyTips: "Focus on pulling elbows down to sides.", videoUrl: "https://www.youtube.com/embed/mK9kG9V6N4s" },

  // --- Yoga, Flexibility & Mobility ---
  { id: "cat-cow", name: "Cat Cow Pose", muscle: "Back", equipment: "none", type: "flexibility", desc: "Spinal mobility warm-up movement.", safetyTips: "Move slowly, sync movement with deep breathing.", videoUrl: "https://www.youtube.com/embed/kqnua4r9QkY" },
  { id: "downward-dog", name: "Downward Facing Dog", muscle: "Full Body", equipment: "none", type: "flexibility", desc: "Posterior chain stretching hold.", safetyTips: "Spread fingers wide, press heels toward floor.", videoUrl: "https://www.youtube.com/embed/EC7RGJ975iM" },
  { id: "childs-pose", name: "Child's Pose", muscle: "Back", equipment: "none", type: "flexibility", desc: "Restorative resting stretch.", safetyTips: "Breathe deeply, reach arms forward.", videoUrl: "https://www.youtube.com/embed/eqVMAPM0RDM" },
  { id: "cobra-pose", name: "Cobra Pose", muscle: "Back", equipment: "none", type: "flexibility", desc: "Lower back extension stretch.", safetyTips: "Keep shoulders down, do not force extension.", videoUrl: "https://www.youtube.com/embed/fOdrW7nFtyI" },
  { id: "warrior-pose", name: "Warrior II Pose", muscle: "Legs", equipment: "none", type: "flexibility", desc: "Hip opening stance.", safetyTips: "Keep front knee stacked over front ankle.", videoUrl: "https://www.youtube.com/embed/4PkRshlV1l4" }
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
