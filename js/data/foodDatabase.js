/* ============================================================
   FitForge — Comprehensive Food Database (300+ Entries)
   Macros in grams, micronutrients in mg/mcg, calories in kcal.
   ============================================================ */

export const FOOD_DB = [
  // --- Indian Grain & Breads ---
  { id: 1, name: "Roti (Wheat Flatbread)", cal: 120, p: 3.1, c: 24.4, f: 1.0, fi: 1.8, na: 0, ca: 14, fe: 1.2, portion: "1 roti", g: 40, cat: "Indian Grain", tags: ["indian", "grain", "bread"] },
  { id: 2, name: "Multigrain Roti", cal: 110, p: 3.8, c: 22.0, f: 1.2, fi: 3.1, na: 5, ca: 18, fe: 1.5, portion: "1 roti", g: 40, cat: "Indian Grain", tags: ["indian", "grain", "bread", "healthy"] },
  { id: 3, name: "Naan (Plain)", cal: 262, p: 8.7, c: 45.7, f: 5.1, fi: 1.7, na: 526, ca: 72, fe: 2.5, portion: "1 piece", g: 90, cat: "Indian Grain", tags: ["indian", "grain", "bread"] },
  { id: 4, name: "Butter Naan", cal: 310, p: 8.5, c: 45.0, f: 9.5, fi: 1.5, na: 530, ca: 68, fe: 2.2, portion: "1 piece", g: 90, cat: "Indian Grain", tags: ["indian", "grain", "bread"] },
  { id: 5, name: "Tandoori Roti (Wheat)", cal: 115, p: 3.5, c: 23.5, f: 0.8, fi: 2.0, na: 10, ca: 15, fe: 1.3, portion: "1 roti", g: 45, cat: "Indian Grain", tags: ["indian", "grain", "bread"] },
  { id: 6, name: "Paratha (Plain)", cal: 185, p: 4.0, c: 27.0, f: 7.5, fi: 1.9, na: 200, ca: 20, fe: 1.4, portion: "1 paratha", g: 70, cat: "Indian Grain", tags: ["indian", "grain", "bread"] },
  { id: 7, name: "Aloo Paratha (Stuffed)", cal: 230, p: 5.5, c: 33.0, f: 9.5, fi: 2.2, na: 210, ca: 25, fe: 1.8, portion: "1 piece", g: 100, cat: "Indian Grain", tags: ["indian", "grain", "bread"] },
  { id: 8, name: "Paneer Paratha", cal: 290, p: 11.5, c: 32.0, f: 12.0, fi: 2.5, na: 250, ca: 110, fe: 1.9, portion: "1 piece", g: 110, cat: "Indian Grain", tags: ["indian", "grain", "bread"] },
  { id: 9, name: "Bhatura", cal: 290, p: 6.5, c: 35.0, f: 13.0, fi: 1.2, na: 300, ca: 22, fe: 1.5, portion: "1 bhatura", g: 80, cat: "Indian Grain", tags: ["indian", "grain", "fried"] },
  { id: 10, name: "Puri", cal: 180, p: 3.0, c: 22.0, f: 8.5, fi: 1.0, na: 5, ca: 8, fe: 1.0, portion: "1 puri", g: 40, cat: "Indian Grain", tags: ["indian", "grain", "fried"] },
  { id: 11, name: "White Rice (cooked)", cal: 130, p: 2.7, c: 28.2, f: 0.3, fi: 0.4, na: 1, ca: 10, fe: 0.2, portion: "1 cup", g: 186, cat: "Indian Grain", tags: ["indian", "grain", "rice"] },
  { id: 12, name: "Brown Rice (cooked)", cal: 112, p: 2.6, c: 23.5, f: 0.9, fi: 1.8, na: 5, ca: 10, fe: 0.5, portion: "1 cup", g: 195, cat: "Indian Grain", tags: ["grain", "rice", "healthy"] },
  { id: 13, name: "Basmati Rice (cooked)", cal: 121, p: 3.5, c: 25.2, f: 0.4, fi: 0.3, na: 0, ca: 3, fe: 0.2, portion: "1 cup", g: 163, cat: "Indian Grain", tags: ["indian", "grain", "rice"] },
  { id: 14, name: "Zeera Rice", cal: 155, p: 3.2, c: 31.0, f: 2.0, fi: 0.5, na: 150, ca: 15, fe: 0.5, portion: "1 bowl", g: 180, cat: "Indian Grain", tags: ["indian", "rice"] },
  { id: 15, name: "Chicken Biryani", cal: 290, p: 18.5, c: 32.0, f: 9.5, fi: 1.5, na: 480, ca: 40, fe: 2.0, portion: "1 plate", g: 250, cat: "Indian Grain", tags: ["indian", "rice", "chicken"] },
  { id: 16, name: "Mutton Biryani", cal: 340, p: 19.0, c: 33.0, f: 14.0, fi: 1.5, na: 520, ca: 45, fe: 2.5, portion: "1 plate", g: 250, cat: "Indian Grain", tags: ["indian", "rice", "mutton"] },
  { id: 17, name: "Veg Pulao", cal: 210, p: 5.0, c: 38.0, f: 5.5, fi: 2.5, na: 320, ca: 30, fe: 1.2, portion: "1 bowl", g: 200, cat: "Indian Grain", tags: ["indian", "rice", "veg"] },
  { id: 18, name: "Khichdi", cal: 180, p: 7.5, c: 30.0, f: 4.0, fi: 3.0, na: 280, ca: 45, fe: 2.5, portion: "1 bowl", g: 200, cat: "Indian Grain", tags: ["indian", "rice", "dal", "healthy"] },
  
  // --- Indian Dals & Gravies ---
  { id: 19, name: "Yellow Moong Dal", cal: 150, p: 9.5, c: 20.5, f: 4.0, fi: 3.5, na: 480, ca: 55, fe: 3.1, portion: "1 bowl", g: 150, cat: "Indian Dal", tags: ["indian", "dal", "protein"] },
  { id: 20, name: "Masoor Dal (Red Lentil)", cal: 148, p: 10.2, c: 20.0, f: 3.8, fi: 4.0, na: 460, ca: 60, fe: 3.5, portion: "1 bowl", g: 150, cat: "Indian Dal", tags: ["indian", "dal", "protein"] },
  { id: 21, name: "Dal Makhani", cal: 220, p: 10.0, c: 22.0, f: 10.5, fi: 5.0, na: 520, ca: 75, fe: 3.8, portion: "1 bowl", g: 200, cat: "Indian Dal", tags: ["indian", "dal", "creamy"] },
  { id: 22, name: "Dal Tadka (Toor Dal)", cal: 160, p: 8.8, c: 21.0, f: 4.5, fi: 3.8, na: 470, ca: 50, fe: 2.9, portion: "1 bowl", g: 150, cat: "Indian Dal", tags: ["indian", "dal", "protein"] },
  { id: 23, name: "Rajma (Kidney Bean Curry)", cal: 200, p: 9.5, c: 28.0, f: 5.5, fi: 6.5, na: 490, ca: 65, fe: 4.0, portion: "1 bowl", g: 200, cat: "Indian Dal", tags: ["indian", "dal", "protein"] },
  { id: 24, name: "Chhole (Chickpea Curry)", cal: 215, p: 9.0, c: 30.0, f: 7.0, fi: 7.0, na: 510, ca: 70, fe: 4.5, portion: "1 bowl", g: 200, cat: "Indian Dal", tags: ["indian", "dal", "chickpeas"] },
  { id: 25, name: "Sambhar", cal: 95, p: 4.5, c: 13.0, f: 2.5, fi: 3.5, na: 420, ca: 35, fe: 2.0, portion: "1 bowl", g: 200, cat: "Indian Dal", tags: ["indian", "south-indian", "soup"] },
  { id: 26, name: "Kadhi Pakora", cal: 210, p: 7.0, c: 18.0, f: 12.0, fi: 1.5, na: 540, ca: 110, fe: 1.5, portion: "1 bowl", g: 200, cat: "Indian Dal", tags: ["indian", "yogurt"] },
  
  // --- Paneer & Dairy Dishes ---
  { id: 27, name: "Paneer (Raw)", cal: 265, p: 18.3, c: 3.3, f: 20.8, fi: 0, na: 30, ca: 208, fe: 0.3, portion: "100g", g: 100, cat: "Indian Dairy", tags: ["indian", "dairy", "protein", "paneer"] },
  { id: 28, name: "Palak Paneer", cal: 240, p: 11.0, c: 8.5, f: 18.5, fi: 2.0, na: 460, ca: 180, fe: 3.5, portion: "1 bowl", g: 200, cat: "Indian Dairy", tags: ["indian", "paneer", "spinach"] },
  { id: 29, name: "Paneer Butter Masala", cal: 235, p: 9.5, c: 8.0, f: 19.5, fi: 1.0, na: 480, ca: 175, fe: 1.5, portion: "1 bowl", g: 200, cat: "Indian Dairy", tags: ["indian", "paneer", "creamy"] },
  { id: 30, name: "Paneer Tikka", cal: 280, p: 20.5, c: 5.0, f: 20.0, fi: 0.5, na: 520, ca: 220, fe: 0.5, portion: "6 pieces", g: 150, cat: "Indian Dairy", tags: ["indian", "paneer", "grilled"] },
  { id: 31, name: "Shahi Paneer", cal: 260, p: 10.0, c: 9.0, f: 21.0, fi: 0.8, na: 490, ca: 160, fe: 1.2, portion: "1 bowl", g: 200, cat: "Indian Dairy", tags: ["indian", "paneer", "creamy"] },
  { id: 32, name: "Tofu Palak", cal: 130, p: 9.0, c: 6.0, f: 8.5, fi: 2.5, na: 380, ca: 210, fe: 4.2, portion: "1 bowl", g: 200, cat: "Plant Protein", tags: ["vegan", "tofu", "spinach", "healthy"] },
  { id: 33, name: "Dahi (Plain Curd)", cal: 61, p: 3.5, c: 5.0, f: 3.0, fi: 0, na: 46, ca: 121, fe: 0.1, portion: "1 cup", g: 200, cat: "Indian Dairy", tags: ["indian", "dairy", "probiotic"] },
  { id: 34, name: "Sweet Lassi", cal: 155, p: 5.5, c: 24.5, f: 4.0, fi: 0, na: 65, ca: 160, fe: 0.1, portion: "1 glass", g: 250, cat: "Indian Dairy", tags: ["indian", "dairy", "drink"] },
  { id: 35, name: "Chaas (Buttermilk)", cal: 40, p: 2.0, c: 5.0, f: 1.0, fi: 0, na: 300, ca: 90, fe: 0.1, portion: "1 glass", g: 250, cat: "Indian Dairy", tags: ["indian", "dairy", "drink", "low-cal"] },
  
  // --- Indian Breakfasts & Street Snacks ---
  { id: 36, name: "Idli", cal: 39, p: 1.8, c: 8.0, f: 0.2, fi: 0.5, na: 10, ca: 12, fe: 0.4, portion: "1 piece", g: 30, cat: "Indian Breakfast", tags: ["indian", "breakfast", "south-indian", "low-cal"] },
  { id: 37, name: "Masala Dosa", cal: 220, p: 5.0, c: 35.0, f: 7.5, fi: 1.5, na: 380, ca: 30, fe: 1.8, portion: "1 medium", g: 120, cat: "Indian Breakfast", tags: ["indian", "breakfast", "south-indian", "crispy"] },
  { id: 38, name: "Rava Upma", cal: 190, p: 4.5, c: 32.0, f: 5.5, fi: 2.0, na: 310, ca: 15, fe: 1.0, portion: "1 bowl", g: 180, cat: "Indian Breakfast", tags: ["indian", "breakfast", "semolina"] },
  { id: 39, name: "Poha", cal: 165, p: 3.0, c: 30.5, f: 3.8, fi: 1.5, na: 290, ca: 10, fe: 1.8, portion: "1 bowl", g: 150, cat: "Indian Breakfast", tags: ["indian", "breakfast"] },
  { id: 40, name: "Dhokla (Khaman)", cal: 140, p: 5.2, c: 22.0, f: 3.5, fi: 1.5, na: 420, ca: 28, fe: 1.1, portion: "2 pieces", g: 80, cat: "Indian Breakfast", tags: ["indian", "gujarati", "healthy"] },
  { id: 41, name: "Medu Vada", cal: 200, p: 5.5, c: 24.0, f: 9.5, fi: 1.8, na: 290, ca: 45, fe: 2.2, portion: "2 pieces", g: 80, cat: "Indian Breakfast", tags: ["indian", "breakfast", "fried"] },
  { id: 42, name: "Samosa", cal: 265, p: 5.0, c: 30.0, f: 14.0, fi: 2.0, na: 380, ca: 20, fe: 1.5, portion: "1 piece", g: 100, cat: "Indian Snack", tags: ["indian", "snack", "fried"] },
  { id: 43, name: "Pav Bhaji", cal: 380, p: 9.0, c: 55.0, f: 14.0, fi: 5.0, na: 680, ca: 60, fe: 2.5, portion: "1 plate", g: 300, cat: "Indian Snack", tags: ["indian", "snack", "street"] },
  { id: 44, name: "Vada Pav", cal: 290, p: 7.5, c: 40.0, f: 11.5, fi: 2.5, na: 490, ca: 40, fe: 2.0, portion: "1 piece", g: 130, cat: "Indian Snack", tags: ["indian", "snack", "street"] },
  { id: 45, name: "Bhel Puri", cal: 180, p: 4.5, c: 32.0, f: 4.5, fi: 2.5, na: 350, ca: 20, fe: 1.8, portion: "1 serving", g: 100, cat: "Indian Snack", tags: ["indian", "snack", "street"] },
  
  // --- Indian Non-Veg Entrees ---
  { id: 46, name: "Chicken Tikka (Dry)", cal: 165, p: 30.5, c: 3.5, f: 3.5, fi: 0, na: 480, ca: 15, fe: 1.2, portion: "100g", g: 100, cat: "Indian Chicken", tags: ["indian", "chicken", "protein", "grilled"] },
  { id: 47, name: "Butter Chicken", cal: 205, p: 18.0, c: 8.5, f: 12.0, fi: 0.5, na: 420, ca: 35, fe: 1.5, portion: "1 bowl", g: 200, cat: "Indian Chicken", tags: ["indian", "chicken", "creamy"] },
  { id: 48, name: "Chicken Curry (Home-Style)", cal: 190, p: 20.0, c: 5.0, f: 10.5, fi: 0.8, na: 450, ca: 30, fe: 1.8, portion: "1 bowl", g: 200, cat: "Indian Chicken", tags: ["indian", "chicken"] },
  { id: 49, name: "Tandoori Chicken (Half)", cal: 260, p: 42.0, c: 6.0, f: 8.0, fi: 0.7, na: 750, ca: 30, fe: 2.2, portion: "half chicken", g: 300, cat: "Indian Chicken", tags: ["indian", "chicken", "grilled", "protein"] },
  { id: 50, name: "Mutton Masala", cal: 280, p: 21.0, c: 4.5, f: 20.0, fi: 0.5, na: 530, ca: 25, fe: 3.4, portion: "1 bowl", g: 200, cat: "Indian Meat", tags: ["indian", "mutton", "protein"] },
  { id: 51, name: "Fish Curry (Bengali Style)", cal: 175, p: 19.5, c: 4.0, f: 9.0, fi: 0, na: 410, ca: 45, fe: 1.6, portion: "1 bowl", g: 200, cat: "Indian Fish", tags: ["indian", "fish", "omega3"] },
  { id: 52, name: "Prawn Masala", cal: 170, p: 22.0, c: 5.0, f: 7.5, fi: 0.5, na: 510, ca: 55, fe: 2.0, portion: "1 bowl", g: 180, cat: "Indian Fish", tags: ["indian", "seafood", "protein"] },

  // --- Western Breakfast & Eggs ---
  { id: 53, name: "Boiled Egg (Whole)", cal: 78, p: 6.3, c: 0.6, f: 5.3, fi: 0, na: 62, ca: 25, fe: 0.6, portion: "1 egg", g: 50, cat: "Eggs", tags: ["egg", "protein", "keto"] },
  { id: 54, name: "Egg White", cal: 17, p: 3.6, c: 0.2, f: 0.1, fi: 0, na: 55, ca: 2, fe: 0.03, portion: "1 white", g: 33, cat: "Eggs", tags: ["egg", "protein", "low-cal"] },
  { id: 55, name: "Scrambled Eggs (2 eggs)", cal: 182, p: 12.6, c: 1.2, f: 13.8, fi: 0, na: 183, ca: 60, fe: 1.2, portion: "2 eggs", g: 100, cat: "Eggs", tags: ["egg", "protein", "breakfast"] },
  { id: 56, name: "Western Omelette", cal: 210, p: 14.0, c: 4.0, f: 15.0, fi: 0.6, na: 260, ca: 65, fe: 1.6, portion: "1 serving", g: 130, cat: "Eggs", tags: ["egg", "protein", "breakfast"] },
  { id: 57, name: "Egg & Cheese Toast", cal: 280, p: 14.5, c: 26.0, f: 12.5, fi: 1.5, na: 480, ca: 160, fe: 1.8, portion: "1 piece", g: 110, cat: "Eggs", tags: ["egg", "cheese", "toast"] },

  // --- Poultry & Meat (Western) ---
  { id: 58, name: "Chicken Breast (Grilled)", cal: 165, p: 31.0, c: 0, f: 3.6, fi: 0, na: 74, ca: 15, fe: 0.9, portion: "100g", g: 100, cat: "Poultry", tags: ["chicken", "protein", "lean", "keto"] },
  { id: 59, name: "Chicken Thigh (Skinless)", cal: 185, p: 24.8, c: 0, f: 9.0, fi: 0, na: 84, ca: 12, fe: 1.1, portion: "100g", g: 100, cat: "Poultry", tags: ["chicken", "protein"] },
  { id: 60, name: "Turkey Breast (Sliced)", cal: 104, p: 17.0, c: 1.5, f: 2.0, fi: 0, na: 820, ca: 10, fe: 0.8, portion: "100g", g: 100, cat: "Poultry", tags: ["turkey", "lean", "protein"] },
  { id: 61, name: "Ground Beef (90% Lean)", cal: 196, p: 21.9, c: 0, f: 11.8, fi: 0, na: 75, ca: 17, fe: 2.8, portion: "100g", g: 100, cat: "Beef", tags: ["beef", "protein", "keto"] },
  { id: 62, name: "Ribeye Steak", cal: 290, p: 24.0, c: 0, f: 21.0, fi: 0, na: 60, ca: 12, fe: 2.5, portion: "100g", g: 100, cat: "Beef", tags: ["beef", "protein", "keto"] },
  { id: 63, name: "Pork Chop (Grilled)", cal: 210, p: 26.0, c: 0, f: 11.0, fi: 0, na: 65, ca: 8, fe: 0.9, portion: "100g", g: 100, cat: "Meat", tags: ["pork", "protein"] },

  // --- Western Fish & Seafood ---
  { id: 64, name: "Salmon Fillet (Baked)", cal: 206, p: 28.2, c: 0, f: 9.5, fi: 0, na: 59, ca: 12, fe: 0.8, portion: "100g", g: 100, cat: "Fish", tags: ["fish", "protein", "omega3", "healthy"] },
  { id: 65, name: "Tuna (Canned in Water)", cal: 116, p: 25.5, c: 0, f: 1.0, fi: 0, na: 350, ca: 10, fe: 1.2, portion: "1 can", g: 120, cat: "Fish", tags: ["fish", "protein", "lean", "omega3"] },
  { id: 66, name: "Cod Fillet (Baked)", cal: 95, p: 20.0, c: 0, f: 1.0, fi: 0, na: 80, ca: 15, fe: 0.4, portion: "100g", g: 100, cat: "Fish", tags: ["fish", "protein", "lean"] },
  { id: 67, name: "Shrimp (Boiled)", cal: 99, p: 21.3, c: 0.9, f: 0.9, fi: 0, na: 111, ca: 70, fe: 2.4, portion: "100g", g: 100, cat: "Fish", tags: ["seafood", "protein", "lean"] },

  // --- Western Breads & Grains ---
  { id: 68, name: "White Bread Slices", cal: 150, p: 5.0, c: 28.0, f: 1.8, fi: 1.2, na: 290, ca: 130, fe: 1.8, portion: "2 slices", g: 50, cat: "Bread", tags: ["bread", "grain"] },
  { id: 72, name: "Whole Wheat Bread Slices", cal: 138, p: 7.2, c: 24.0, f: 1.9, fi: 3.5, na: 220, ca: 40, fe: 1.4, portion: "2 slices", g: 50, cat: "Bread", tags: ["bread", "grain", "healthy"] },
  { id: 73, name: "Sourdough Slice", cal: 110, p: 4.0, c: 22.0, f: 0.6, fi: 1.0, na: 230, ca: 12, fe: 1.0, portion: "1 slice", g: 40, cat: "Bread", tags: ["bread", "sourdough"] },
  { id: 75, name: "Rolled Oats (Dry)", cal: 389, p: 16.9, c: 66.3, f: 6.9, fi: 10.6, na: 2, ca: 54, fe: 4.7, portion: "100g", g: 100, cat: "Cereal", tags: ["oats", "grain", "fibre", "healthy"] },
  { id: 76, name: "Oatmeal with Milk", cal: 210, p: 9.0, c: 32.0, f: 5.0, fi: 4.5, na: 70, ca: 180, fe: 2.2, portion: "1 bowl", g: 250, cat: "Cereal", tags: ["oats", "breakfast"] },
  { id: 77, name: "Granola (No Sugar)", cal: 220, p: 5.5, c: 31.0, f: 8.5, fi: 3.5, na: 120, ca: 30, fe: 1.8, portion: "50g", g: 50, cat: "Cereal", tags: ["granola", "breakfast"] },

  // --- Salads & Vegetables ---
  { id: 79, name: "Spinach (Raw)", cal: 23, p: 2.9, c: 3.6, f: 0.4, fi: 2.2, na: 79, ca: 99, fe: 2.7, portion: "100g", g: 100, cat: "Vegetable", tags: ["vegetable", "low-cal", "iron", "calcium"] },
  { id: 80, name: "Steamed Broccoli", cal: 55, p: 3.7, c: 11.2, f: 0.6, fi: 5.1, na: 33, ca: 47, fe: 0.7, portion: "1 cup", g: 156, cat: "Vegetable", tags: ["vegetable", "low-cal", "fibre"] },
  { id: 81, name: "Raw Carrot", cal: 41, p: 0.9, c: 9.6, f: 0.2, fi: 2.8, na: 69, ca: 33, fe: 0.3, portion: "1 medium", g: 100, cat: "Vegetable", tags: ["vegetable", "low-cal"] },
  { id: 82, name: "Sweet Potato (Baked)", cal: 115, p: 2.5, c: 26.5, f: 0.2, fi: 4.0, na: 45, ca: 48, fe: 0.9, portion: "1 medium", g: 130, cat: "Vegetable", tags: ["vegetable", "carbs", "healthy"] },
  { id: 83, name: "White Potato (Boiled)", cal: 130, p: 3.0, c: 29.5, f: 0.2, fi: 2.5, na: 8, ca: 8, fe: 0.5, portion: "1 medium", g: 150, cat: "Vegetable", tags: ["vegetable", "carbs"] },
  { id: 84, name: "Cucumber (With Peel)", cal: 15, p: 0.7, c: 3.6, f: 0.1, fi: 0.5, na: 2, ca: 16, fe: 0.3, portion: "100g", g: 100, cat: "Vegetable", tags: ["vegetable", "low-cal", "hydrating"] },
  { id: 85, name: "Red Tomato", cal: 18, p: 0.9, c: 3.9, f: 0.2, fi: 1.2, na: 5, ca: 10, fe: 0.3, portion: "1 medium", g: 100, cat: "Vegetable", tags: ["vegetable", "low-cal"] },
  { id: 86, name: "Red Bell Pepper", cal: 31, p: 1.0, c: 7.2, f: 0.3, fi: 2.1, na: 4, ca: 7, fe: 0.4, portion: "1 medium", g: 120, cat: "Vegetable", tags: ["vegetable", "low-cal", "vitamin-c"] },
  { id: 87, name: "Mixed Green Salad", cal: 15, p: 1.0, c: 3.0, f: 0.2, fi: 1.5, na: 10, ca: 25, fe: 0.6, portion: "1 large bowl", g: 100, cat: "Vegetable", tags: ["salad", "low-cal", "vegetable"] },
  { id: 88, name: "Greek Salad", cal: 190, p: 6.0, c: 10.0, f: 14.5, fi: 2.5, na: 610, ca: 150, fe: 1.1, portion: "1 large bowl", g: 250, cat: "Vegetable", tags: ["salad", "feta", "mediterranean"] },

  // --- Fruits ---
  { id: 89, name: "Banana", cal: 89, p: 1.1, c: 22.8, f: 0.3, fi: 2.6, na: 1, ca: 5, fe: 0.3, portion: "1 medium", g: 100, cat: "Fruit", tags: ["fruit", "carbs", "pre-workout"] },
  { id: 90, name: "Apple (With skin)", cal: 52, p: 0.3, c: 13.8, f: 0.2, fi: 2.4, na: 1, ca: 6, fe: 0.1, portion: "1 medium", g: 150, cat: "Fruit", tags: ["fruit", "fibre", "low-cal"] },
  { id: 91, name: "Orange", cal: 47, p: 0.9, c: 11.7, f: 0.1, fi: 2.4, na: 0, ca: 40, fe: 0.1, portion: "1 medium", g: 140, cat: "Fruit", tags: ["fruit", "vitamin-c"] },
  { id: 92, name: "Blueberries", cal: 57, p: 0.7, c: 14.5, f: 0.3, fi: 2.4, na: 1, ca: 6, fe: 0.3, portion: "1 cup", g: 100, cat: "Fruit", tags: ["fruit", "antioxidant", "low-cal"] },
  { id: 93, name: "Avocado", cal: 160, p: 2.0, c: 8.5, f: 14.7, fi: 6.7, na: 7, ca: 12, fe: 0.6, portion: "1/2 avocado", g: 100, cat: "Fruit", tags: ["fruit", "fat", "keto", "healthy-fat"] },
  { id: 94, name: "Watermelon Slice", cal: 85, p: 1.5, c: 21.0, f: 0.5, fi: 1.2, na: 3, ca: 20, fe: 0.6, portion: "1 large slice", g: 280, cat: "Fruit", tags: ["fruit", "low-cal", "hydrating"] },

  // --- Supplements & Bars ---
  { id: 95, name: "Whey Protein Isolate", cal: 110, p: 25.0, c: 1.5, f: 0.5, fi: 0, na: 110, ca: 120, fe: 0.3, portion: "1 scoop", g: 30, cat: "Supplement", tags: ["supplement", "protein", "post-workout"] },
  { id: 96, name: "Whey Protein Concentrate", cal: 130, p: 24.0, c: 4.5, f: 1.5, fi: 0, na: 115, ca: 130, fe: 0.3, portion: "1 scoop", g: 33, cat: "Supplement", tags: ["supplement", "protein", "post-workout"] },
  { id: 97, name: "Casein Protein", cal: 120, p: 24.5, c: 3.0, f: 1.0, fi: 0, na: 130, ca: 600, fe: 0.2, portion: "1 scoop", g: 34, cat: "Supplement", tags: ["supplement", "protein", "slow-digest", "night"] },
  { id: 98, name: "Creatine Monohydrate", cal: 0, p: 0, c: 0, f: 0, fi: 0, na: 0, ca: 0, fe: 0, portion: "5g serving", g: 5, cat: "Supplement", tags: ["supplement", "creatine", "strength"] },
  { id: 99, name: "Protein Bar", cal: 200, p: 20.0, c: 23.0, f: 8.0, fi: 13.0, na: 220, ca: 100, fe: 1.0, portion: "1 bar", g: 60, cat: "Supplement", tags: ["supplement", "protein", "bar"] },

  // --- Western Fast Food ---
  { id: 100, name: "Hamburger (Beef Patty)", cal: 295, p: 17.0, c: 24.0, f: 14.5, fi: 1.0, na: 510, ca: 50, fe: 2.5, portion: "1 burger", g: 180, cat: "Fast Food", tags: ["fastfood", "burger", "beef"] },
  { id: 101, name: "Double Cheeseburger", cal: 440, p: 27.5, c: 26.0, f: 25.5, fi: 1.0, na: 860, ca: 200, fe: 3.5, portion: "1 burger", g: 250, cat: "Fast Food", tags: ["fastfood", "burger", "beef", "cheese"] },
  { id: 102, name: "French Fries (Medium)", cal: 365, p: 4.5, c: 48.0, f: 17.5, fi: 4.0, na: 410, ca: 12, fe: 1.0, portion: "1 medium", g: 117, cat: "Fast Food", tags: ["fastfood", "fries"] },
  { id: 103, name: "Pizza (Cheese, Slice)", cal: 272, p: 12.0, c: 33.6, f: 9.8, fi: 2.0, na: 551, ca: 188, fe: 1.7, portion: "1 slice", g: 107, cat: "Fast Food", tags: ["fastfood", "pizza", "cheese"] },
  
  // --- Beverages ---
  { id: 104, name: "Black Coffee (Espresso)", cal: 5, p: 0.3, c: 0.8, f: 0.1, fi: 0, na: 14, ca: 5, fe: 0.2, portion: "1 shot (30ml)", g: 30, cat: "Beverage", tags: ["coffee", "low-cal", "caffeine"] },
  { id: 105, name: "Whole Milk Cappuccino", cal: 80, p: 4.0, c: 8.0, f: 3.0, fi: 0, na: 60, ca: 120, fe: 0, portion: "1 cup (180ml)", g: 180, cat: "Beverage", tags: ["coffee", "dairy", "caffeine"] },
  { id: 106, name: "Coconut Water", cal: 46, p: 1.7, c: 9.0, f: 0.5, fi: 2.6, na: 252, ca: 58, fe: 0.3, portion: "1 cup (250ml)", g: 250, cat: "Beverage", tags: ["hydration", "electrolytes", "natural"] },
  { id: 107, name: "Sports Drink (Gatorade)", cal: 80, p: 0, c: 21.0, f: 0, fi: 0, na: 165, ca: 0, fe: 0, portion: "500ml", g: 500, cat: "Beverage", tags: ["sports", "electrolytes", "carbs"] },
  { id: 108, name: "Water", cal: 0, p: 0, c: 0, f: 0, fi: 0, na: 0, ca: 0, fe: 0, portion: "1 glass", g: 250, cat: "Beverage", tags: ["water", "hydration", "zero-cal"] },

  // --- Extended Cuisines (Indian, Chinese, Nuts, Healthy Fats, Sweets) ---
  // Indian Grains / Breads
  { id: 110, name: "Missi Roti", cal: 145, p: 6.2, c: 22.0, f: 3.0, fi: 3.5, na: 150, ca: 40, fe: 2.1, portion: "1 roti", g: 50, cat: "Indian Grain", tags: ["indian", "roti", "chana", "protein"] },
  { id: 111, name: "Bajra Roti (Pearl Millet)", cal: 135, p: 4.2, c: 26.0, f: 2.0, fi: 4.1, na: 5, ca: 30, fe: 2.5, portion: "1 roti", g: 50, cat: "Indian Grain", tags: ["indian", "millet", "healthy", "fiber"] },
  { id: 112, name: "Makki di Roti (Corn)", cal: 150, p: 3.5, c: 28.0, f: 3.0, fi: 3.0, na: 10, ca: 18, fe: 1.5, portion: "1 roti", g: 55, cat: "Indian Grain", tags: ["indian", "corn", "punjabi"] },
  { id: 113, name: "Lachha Paratha", cal: 260, p: 5.0, c: 38.0, f: 10.0, fi: 1.8, na: 250, ca: 24, fe: 1.6, portion: "1 piece", g: 85, cat: "Indian Grain", tags: ["indian", "paratha"] },
  { id: 114, name: "Ragi Roti (Finger Millet)", cal: 125, p: 3.2, c: 25.0, f: 1.3, fi: 4.8, na: 8, ca: 140, fe: 2.2, portion: "1 roti", g: 50, cat: "Indian Grain", tags: ["indian", "ragi", "millet", "calcium"] },
  { id: 115, name: "Lemon Rice", cal: 240, p: 4.5, c: 42.0, f: 5.5, fi: 1.2, na: 350, ca: 25, fe: 1.1, portion: "1 bowl", g: 200, cat: "Indian Grain", tags: ["indian", "rice", "south-indian"] },
  { id: 116, name: "Coconut Rice", cal: 310, p: 5.0, c: 45.0, f: 12.0, fi: 2.5, na: 280, ca: 20, fe: 1.3, portion: "1 bowl", g: 200, cat: "Indian Grain", tags: ["indian", "rice", "coconut"] },
  { id: 117, name: "Curd Rice", cal: 180, p: 5.5, c: 28.0, f: 4.8, fi: 0.8, na: 380, ca: 160, fe: 0.5, portion: "1 bowl", g: 200, cat: "Indian Grain", tags: ["indian", "rice", "curd", "south-indian"] },
  
  // Indian Vegetarian Curries
  { id: 118, name: "Alu Gobi", cal: 140, p: 3.2, c: 16.0, f: 7.2, fi: 3.2, na: 420, ca: 38, fe: 1.8, portion: "1 bowl", g: 180, cat: "Indian Veg", tags: ["indian", "veg", "aloo", "gobi"] },
  { id: 119, name: "Bhindi Masala (Okra)", cal: 110, p: 2.5, c: 11.0, f: 6.5, fi: 3.8, na: 390, ca: 72, fe: 1.5, portion: "1 bowl", g: 150, cat: "Indian Veg", tags: ["indian", "veg", "bhindi"] },
  { id: 120, name: "Baingan Bharta (Eggplant)", cal: 125, p: 2.1, c: 12.5, f: 8.0, fi: 4.5, na: 360, ca: 40, fe: 1.2, portion: "1 bowl", g: 180, cat: "Indian Veg", tags: ["indian", "veg", "baingan"] },
  { id: 121, name: "Mix Vegetable Curry", cal: 150, p: 3.8, c: 18.0, f: 7.5, fi: 4.2, na: 410, ca: 55, fe: 2.0, portion: "1 bowl", g: 200, cat: "Indian Veg", tags: ["indian", "veg"] },
  { id: 122, name: "Mutter Paneer", cal: 210, p: 10.5, c: 14.0, f: 13.0, fi: 2.8, na: 450, ca: 165, fe: 1.9, portion: "1 bowl", g: 200, cat: "Indian Dairy", tags: ["indian", "paneer", "peas"] },
  { id: 123, name: "Paneer Bhurji", cal: 270, p: 16.0, c: 6.0, f: 21.0, fi: 1.0, na: 480, ca: 230, fe: 1.6, portion: "1 bowl", g: 150, cat: "Indian Dairy", tags: ["indian", "paneer", "eggless"] },
  { id: 124, name: "Kadai Paneer", cal: 250, p: 11.5, c: 9.0, f: 19.5, fi: 2.0, na: 490, ca: 180, fe: 1.8, portion: "1 bowl", g: 200, cat: "Indian Dairy", tags: ["indian", "paneer"] },
  { id: 125, name: "Malai Kofta", cal: 330, p: 8.0, c: 26.0, f: 22.0, fi: 2.5, na: 530, ca: 120, fe: 1.7, portion: "1 bowl", g: 200, cat: "Indian Veg", tags: ["indian", "creamy", "festive"] },
  { id: 126, name: "Dum Aloo", cal: 195, p: 3.5, c: 28.0, f: 8.5, fi: 3.0, na: 440, ca: 28, fe: 1.5, portion: "1 bowl", g: 200, cat: "Indian Veg", tags: ["indian", "aloo", "spicy"] },
  { id: 127, name: "Lauki Kofta (Bottle Gourd)", cal: 140, p: 4.5, c: 16.0, f: 6.8, fi: 2.8, na: 390, ca: 65, fe: 1.4, portion: "1 bowl", g: 200, cat: "Indian Veg", tags: ["indian", "veg", "healthy"] },
  { id: 128, name: "Chana Masala", cal: 180, p: 8.5, c: 26.0, f: 5.0, fi: 6.8, na: 480, ca: 80, fe: 3.8, portion: "1 bowl", g: 200, cat: "Indian Dal", tags: ["indian", "veg", "chana", "protein"] },
  { id: 129, name: "Soybean Curry (Chunks)", cal: 175, p: 18.0, c: 12.0, f: 6.2, fi: 5.0, na: 420, ca: 110, fe: 4.8, portion: "1 bowl", g: 200, cat: "Plant Protein", tags: ["indian", "soya", "protein", "healthy"] },

  // Indian Snacks & Street Food
  { id: 130, name: "Pani Puri (6 pieces)", cal: 180, p: 3.5, c: 29.0, f: 5.5, fi: 2.0, na: 520, ca: 30, fe: 1.5, portion: "6 pieces", g: 120, cat: "Indian Snack", tags: ["indian", "snack", "street"] },
  { id: 131, name: "Papdi Chaat", cal: 260, p: 5.5, c: 38.0, f: 9.8, fi: 2.2, na: 490, ca: 95, fe: 1.9, portion: "1 plate", g: 180, cat: "Indian Snack", tags: ["indian", "snack", "street"] },
  { id: 132, name: "Samosa Chaat", cal: 340, p: 7.2, c: 45.0, f: 15.0, fi: 3.5, na: 580, ca: 80, fe: 2.2, portion: "1 plate", g: 220, cat: "Indian Snack", tags: ["indian", "snack", "street"] },
  { id: 133, name: "Dhokla (Sandwich)", cal: 180, p: 6.5, c: 26.0, f: 5.0, fi: 2.0, na: 460, ca: 35, fe: 1.4, portion: "2 pieces", g: 100, cat: "Indian Breakfast", tags: ["indian", "gujarati"] },
  { id: 134, name: "Kachori (Pyaaz)", cal: 290, p: 5.8, c: 34.0, f: 15.0, fi: 1.8, na: 410, ca: 24, fe: 1.6, portion: "1 piece", g: 90, cat: "Indian Snack", tags: ["indian", "fried", "snack"] },
  { id: 135, name: "Aloo Tikki", cal: 140, p: 2.2, c: 21.0, f: 5.8, fi: 2.0, na: 350, ca: 15, fe: 1.1, portion: "1 piece", g: 80, cat: "Indian Snack", tags: ["indian", "aloo", "street"] },
  { id: 136, name: "Paneer Kathi Roll", cal: 360, p: 14.5, c: 42.0, f: 14.0, fi: 3.0, na: 580, ca: 190, fe: 2.2, portion: "1 roll", g: 160, cat: "Indian Snack", tags: ["indian", "paneer", "wrap"] },
  { id: 137, name: "Chicken Kathi Roll", cal: 390, p: 22.0, c: 40.0, f: 15.0, fi: 2.5, na: 620, ca: 40, fe: 2.5, portion: "1 roll", g: 160, cat: "Indian Snack", tags: ["indian", "chicken", "wrap"] },
  { id: 138, name: "Egg Roll (Indian Style)", cal: 310, p: 12.5, c: 38.0, f: 12.0, fi: 1.8, na: 540, ca: 55, fe: 2.1, portion: "1 roll", g: 150, cat: "Indian Snack", tags: ["indian", "egg", "wrap"] },
  { id: 139, name: "Sabudana Khichdi", cal: 320, p: 2.5, c: 62.0, f: 6.8, fi: 1.5, na: 290, ca: 20, fe: 1.2, portion: "1 plate", g: 150, cat: "Indian Breakfast", tags: ["indian", "fasting", "carbs"] },
  { id: 140, name: "Sabudana Vada", cal: 210, p: 2.0, c: 31.0, f: 9.0, fi: 1.0, na: 260, ca: 15, fe: 0.9, portion: "2 pieces", g: 80, cat: "Indian Snack", tags: ["indian", "fried", "snack"] },
  { id: 141, name: "Uttapam (Plain)", cal: 175, p: 4.2, c: 33.0, f: 3.0, fi: 1.8, na: 310, ca: 25, fe: 1.4, portion: "1 piece", g: 100, cat: "Indian Breakfast", tags: ["indian", "south-indian"] },
  { id: 142, name: "Onion Uttapam", cal: 195, p: 4.5, c: 35.0, f: 4.2, fi: 2.2, na: 320, ca: 30, fe: 1.6, portion: "1 piece", g: 120, cat: "Indian Breakfast", tags: ["indian", "south-indian"] },
  { id: 143, name: "Rava Dosa", cal: 160, p: 3.8, c: 28.0, f: 3.5, fi: 1.5, na: 290, ca: 20, fe: 1.2, portion: "1 medium", g: 90, cat: "Indian Breakfast", tags: ["indian", "south-indian"] },

  // Chinese & East Asian
  { id: 144, name: "Veg Hakka Noodles", cal: 280, p: 6.5, c: 52.0, f: 5.5, fi: 2.8, na: 650, ca: 35, fe: 1.8, portion: "1 plate", g: 200, cat: "Chinese", tags: ["chinese", "noodles", "veg"] },
  { id: 145, name: "Chicken Hakka Noodles", cal: 340, p: 18.5, c: 50.0, f: 7.2, fi: 2.5, na: 680, ca: 40, fe: 2.2, portion: "1 plate", g: 200, cat: "Chinese", tags: ["chinese", "noodles", "chicken"] },
  { id: 146, name: "Veg Fried Rice", cal: 290, p: 5.5, c: 55.0, f: 5.0, fi: 2.0, na: 610, ca: 25, fe: 1.5, portion: "1 plate", g: 200, cat: "Chinese", tags: ["chinese", "rice", "veg"] },
  { id: 147, name: "Chicken Fried Rice", cal: 350, p: 17.5, c: 52.0, f: 7.8, fi: 1.8, na: 640, ca: 30, fe: 1.9, portion: "1 plate", g: 200, cat: "Chinese", tags: ["chinese", "rice", "chicken"] },
  { id: 148, name: "Veg Momos (Steamed)", cal: 160, p: 4.8, c: 31.0, f: 1.8, fi: 1.5, na: 380, ca: 18, fe: 1.0, portion: "5 pieces", g: 100, cat: "Chinese", tags: ["chinese", "momos", "veg"] },
  { id: 149, name: "Chicken Momos (Steamed)", cal: 195, p: 12.5, c: 29.0, f: 3.2, fi: 1.2, na: 420, ca: 20, fe: 1.4, portion: "5 pieces", g: 100, cat: "Chinese", tags: ["chinese", "momos", "chicken"] },
  { id: 150, name: "Veg Manchurian (Gravy)", cal: 210, p: 4.0, c: 24.0, f: 11.0, fi: 2.2, na: 780, ca: 45, fe: 1.2, portion: "1 bowl", g: 200, cat: "Chinese", tags: ["chinese", "manchurian", "veg"] },
  { id: 151, name: "Chilli Paneer (Dry)", cal: 280, p: 12.5, c: 11.0, f: 21.0, fi: 1.0, na: 690, ca: 190, fe: 1.5, portion: "1 plate", g: 150, cat: "Chinese", tags: ["chinese", "paneer"] },
  { id: 152, name: "Chilli Chicken (Dry)", cal: 260, p: 22.0, c: 9.0, f: 15.0, fi: 0.8, na: 720, ca: 25, fe: 1.8, portion: "1 plate", g: 150, cat: "Chinese", tags: ["chinese", "chicken"] },
  { id: 153, name: "Spring Rolls (Veg)", cal: 220, p: 3.5, c: 26.0, f: 11.5, fi: 1.8, na: 450, ca: 22, fe: 1.1, portion: "2 rolls", g: 100, cat: "Chinese", tags: ["chinese", "fried", "snack"] },
  { id: 154, name: "Sushi Salmon Roll (6 pieces)", cal: 240, p: 11.0, c: 38.0, f: 4.5, fi: 1.5, na: 580, ca: 24, fe: 1.0, portion: "6 pieces", g: 160, cat: "Chinese", tags: ["seafood", "salmon", "rice", "japanese"] },

  // Italian & Western Specialties
  { id: 155, name: "Spaghetti Marinara (Veg)", cal: 310, p: 9.5, c: 62.0, f: 2.8, fi: 4.2, na: 480, ca: 42, fe: 2.4, portion: "1 plate", g: 250, cat: "Pasta", tags: ["pasta", "italian", "veg"] },
  { id: 156, name: "Pasta Alfredo (Veg)", cal: 480, p: 12.0, c: 55.0, f: 23.0, fi: 2.5, na: 580, ca: 210, fe: 1.8, portion: "1 plate", g: 250, cat: "Pasta", tags: ["pasta", "italian", "creamy"] },
  { id: 157, name: "Chicken Pasta Alfredo", cal: 540, p: 28.0, c: 53.0, f: 24.5, fi: 2.2, na: 620, ca: 220, fe: 2.4, portion: "1 plate", g: 280, cat: "Pasta", tags: ["pasta", "italian", "chicken", "creamy"] },
  { id: 158, name: "Mac & Cheese", cal: 410, p: 15.0, c: 46.0, f: 18.0, fi: 1.5, na: 710, ca: 280, fe: 1.5, portion: "1 bowl", g: 200, cat: "Pasta", tags: ["pasta", "cheese"] },
  { id: 159, name: "Beef Lasagna", cal: 380, p: 22.0, c: 33.0, f: 17.5, fi: 2.1, na: 640, ca: 250, fe: 2.8, portion: "1 serving", g: 220, cat: "Pasta", tags: ["pasta", "beef", "cheese"] },
  
  // Nuts, Seeds & Nut Butters
  { id: 160, name: "Almonds (Raw)", cal: 164, p: 6.0, c: 6.1, f: 14.1, fi: 3.5, na: 0, ca: 76, fe: 1.0, portion: "1 oz (28g)", g: 28, cat: "Nuts", tags: ["nuts", "healthy-fat", "snack", "calcium"] },
  { id: 161, name: "Cashews (Raw)", cal: 157, p: 5.1, c: 8.6, f: 12.4, fi: 0.9, na: 3, ca: 10, fe: 1.9, portion: "1 oz (28g)", g: 28, cat: "Nuts", tags: ["nuts", "healthy-fat", "snack"] },
  { id: 162, name: "Walnuts", cal: 185, p: 4.3, c: 3.9, f: 18.5, fi: 1.9, na: 1, ca: 28, fe: 0.8, portion: "1 oz (28g)", g: 28, cat: "Nuts", tags: ["nuts", "healthy-fat", "omega3"] },
  { id: 163, name: "Peanuts (Roasted)", cal: 161, p: 7.3, c: 4.6, f: 14.0, fi: 2.4, na: 80, ca: 26, fe: 0.6, portion: "1 oz (28g)", g: 28, cat: "Nuts", tags: ["nuts", "snack", "protein"] },
  { id: 164, name: "Peanut Butter (Smooth)", cal: 190, p: 8.0, c: 6.0, f: 16.0, fi: 2.0, na: 140, ca: 15, fe: 0.6, portion: "2 tbsp", g: 32, cat: "Nuts", tags: ["nuts", "butter", "protein"] },
  { id: 165, name: "Almond Butter", cal: 195, p: 7.0, c: 6.0, f: 17.5, fi: 3.0, na: 5, ca: 85, fe: 1.0, portion: "2 tbsp", g: 32, cat: "Nuts", tags: ["nuts", "butter", "healthy-fat"] },
  { id: 166, name: "Chia Seeds (Dry)", cal: 138, p: 4.7, c: 11.9, f: 8.7, fi: 9.8, na: 5, ca: 179, fe: 2.2, portion: "1 oz (28g)", g: 28, cat: "Nuts", tags: ["seeds", "fiber", "omega3", "calcium"] },
  { id: 167, name: "Flax Seeds (Ground)", cal: 150, p: 5.0, c: 8.0, f: 12.0, fi: 7.5, na: 8, ca: 70, fe: 1.6, portion: "2 tbsp", g: 26, cat: "Nuts", tags: ["seeds", "fiber", "omega3"] },
  { id: 168, name: "Pumpkin Seeds", cal: 158, p: 8.6, c: 3.0, f: 13.0, fi: 1.7, na: 5, ca: 15, fe: 2.3, portion: "1 oz (28g)", g: 28, cat: "Nuts", tags: ["seeds", "protein", "zinc"] },

  // Fats, Oils & Condiments
  { id: 169, name: "Olive Oil (Extra Virgin)", cal: 120, p: 0, c: 0, f: 14.0, fi: 0, na: 0, ca: 0, fe: 0, portion: "1 tbsp", g: 14, cat: "Fats", tags: ["oil", "fat", "healthy-fat"] },
  { id: 170, name: "Desi Ghee (Clarified Butter)", cal: 112, p: 0, c: 0, f: 12.7, fi: 0, na: 0, ca: 0, fe: 0, portion: "1 tsp", g: 13, cat: "Fats", tags: ["indian", "ghee", "fat", "butter"] },
  { id: 171, name: "Salted Butter", cal: 102, p: 0.1, c: 0.1, f: 11.5, fi: 0, na: 90, ca: 3, fe: 0, portion: "1 tbsp", g: 14, cat: "Fats", tags: ["fat", "butter"] },
  { id: 172, name: "Coconut Oil", cal: 120, p: 0, c: 0, f: 14.0, fi: 0, na: 0, ca: 0, fe: 0, portion: "1 tbsp", g: 14, cat: "Fats", tags: ["oil", "fat"] },
  { id: 173, name: "Mayonnaise (Regular)", cal: 94, p: 0.1, c: 0.1, f: 10.3, fi: 0, na: 90, ca: 2, fe: 0, portion: "1 tbsp", g: 14, cat: "Fats", tags: ["fat", "creamy"] },

  // Indian Sweets & Desserts
  { id: 174, name: "Gulab Jamun (1 piece)", cal: 150, p: 2.5, c: 22.0, f: 6.0, fi: 0.2, na: 45, ca: 40, fe: 0.3, portion: "1 piece", g: 45, cat: "Indian Sweet", tags: ["indian", "sweet", "dessert"] },
  { id: 175, name: "Rasgulla (1 piece)", cal: 125, p: 3.0, c: 24.0, f: 1.8, fi: 0, na: 35, ca: 65, fe: 0.2, portion: "1 piece", g: 50, cat: "Indian Sweet", tags: ["indian", "sweet", "dessert"] },
  { id: 176, name: "Kheer (Rice Pudding)", cal: 210, p: 5.5, c: 32.0, f: 6.8, fi: 0.4, na: 80, ca: 170, fe: 0.4, portion: "1 bowl", g: 180, cat: "Indian Sweet", tags: ["indian", "sweet", "dairy"] },
  { id: 177, name: "Jalebi (2 pieces)", cal: 150, p: 1.5, c: 30.0, f: 2.8, fi: 0.2, na: 25, ca: 10, fe: 0.3, portion: "2 pieces", g: 50, cat: "Indian Sweet", tags: ["indian", "sweet", "fried"] },
  { id: 178, name: "Moong Dal Halwa", cal: 290, p: 5.0, c: 38.0, f: 13.5, fi: 1.5, na: 70, ca: 45, fe: 1.8, portion: "1 cup", g: 100, cat: "Indian Sweet", tags: ["indian", "sweet", "dessert"] },
  { id: 179, name: "Kaju Katli (2 pieces)", cal: 120, p: 2.5, c: 14.0, f: 6.2, fi: 0.4, na: 2, ca: 8, fe: 0.6, portion: "2 pieces", g: 25, cat: "Indian Sweet", tags: ["indian", "sweet", "cashews"] },
  
  // Western Sweets & Treats
  { id: 180, name: "Dark Chocolate (70%+)", cal: 170, p: 2.2, c: 13.0, f: 12.0, fi: 3.1, na: 6, ca: 20, fe: 3.4, portion: "30g", g: 30, cat: "Dessert", tags: ["sweet", "chocolate", "antioxidant"] },
  { id: 181, name: "Milk Chocolate Bar", cal: 160, p: 2.0, c: 18.0, f: 9.0, fi: 0.5, na: 25, ca: 50, fe: 0.4, portion: "30g", g: 30, cat: "Dessert", tags: ["sweet", "chocolate"] },
  { id: 182, name: "Vanilla Ice Cream", cal: 137, p: 2.3, c: 15.6, f: 7.2, fi: 0.5, na: 53, ca: 84, fe: 0.1, portion: "1 scoop", g: 72, cat: "Dessert", tags: ["sweet", "icecream", "dairy"] },
  { id: 183, name: "Chocolate Chip Cookie", cal: 150, p: 1.6, c: 20.0, f: 7.0, fi: 0.8, na: 105, ca: 10, fe: 0.8, portion: "1 cookie", g: 30, cat: "Dessert", tags: ["sweet", "cookie"] },
  { id: 184, name: "Gluten-Free Muffin", cal: 240, p: 3.0, c: 38.0, f: 8.5, fi: 1.5, na: 280, ca: 25, fe: 1.0, portion: "1 muffin", g: 75, cat: "Dessert", tags: ["sweet", "muffin", "gluten-free"] },

  // More Common Indian Groceries (Raw ingredients for scanner/lookup)
  { id: 185, name: "Moong Dal (Raw Lentil)", cal: 343, p: 24.0, c: 59.0, f: 1.2, fi: 16.0, na: 6, ca: 132, fe: 6.7, portion: "100g", g: 100, cat: "Indian Dal", tags: ["raw", "moong", "dal"] },
  { id: 186, name: "Toor Dal (Raw)", cal: 335, p: 22.0, c: 58.0, f: 1.5, fi: 15.0, na: 8, ca: 130, fe: 5.2, portion: "100g", g: 100, cat: "Indian Dal", tags: ["raw", "toor", "dal"] },
  { id: 187, name: "Atta (Whole Wheat Flour)", cal: 340, p: 12.0, c: 72.0, f: 1.8, fi: 11.0, na: 2, ca: 34, fe: 3.6, portion: "100g", g: 100, cat: "Indian Grain", tags: ["raw", "wheat", "atta"] },
  { id: 188, name: "Maida (Refined Flour)", cal: 350, p: 10.0, c: 74.0, f: 1.0, fi: 2.0, na: 2, ca: 20, fe: 1.2, portion: "100g", g: 100, cat: "Indian Grain", tags: ["raw", "maida"] },
  { id: 189, name: "Besan (Gram Flour)", cal: 387, p: 22.0, c: 58.0, f: 6.7, fi: 10.8, na: 64, ca: 45, fe: 4.8, portion: "100g", g: 100, cat: "Indian Grain", tags: ["raw", "besan", "chana"] },
  { id: 190, name: "Suji (Semolina)", cal: 360, p: 12.0, c: 73.0, f: 1.0, fi: 3.9, na: 1, ca: 17, fe: 1.2, portion: "100g", g: 100, cat: "Indian Grain", tags: ["raw", "suji", "semolina"] },
  
  // Extra Western Proteins & Cheeses
  { id: 191, name: "Cottage Cheese (Low Fat)", cal: 80, p: 11.0, c: 3.4, f: 2.3, fi: 0, na: 360, ca: 80, fe: 0.1, portion: "100g", g: 100, cat: "Dairy", tags: ["cheese", "dairy", "protein", "lean"] },
  { id: 192, name: "Greek Yogurt (Fat Free)", cal: 59, p: 10.0, c: 3.6, f: 0.4, fi: 0, na: 36, ca: 110, fe: 0.1, portion: "100g", g: 100, cat: "Dairy", tags: ["yogurt", "dairy", "protein", "lean", "healthy"] },
  { id: 193, name: "Cheddar Cheese", cal: 115, p: 7.0, c: 0.4, f: 9.5, fi: 0, na: 180, ca: 200, fe: 0.1, portion: "1 slice (28g)", g: 28, cat: "Dairy", tags: ["cheese", "dairy", "fat", "keto"] },
  { id: 194, name: "Feta Cheese", cal: 75, p: 4.0, c: 1.2, f: 6.0, fi: 0, na: 320, ca: 140, fe: 0.2, portion: "30g", g: 30, cat: "Dairy", tags: ["cheese", "dairy", "greek"] },
  { id: 195, name: "Mozzarella Cheese (Shredded)", cal: 85, p: 6.0, c: 0.8, f: 6.5, fi: 0, na: 190, ca: 150, fe: 0.1, portion: "30g", g: 30, cat: "Dairy", tags: ["cheese", "dairy", "pizza"] },
  { id: 196, name: "Tempeh", cal: 190, p: 20.0, c: 9.0, f: 11.0, fi: 8.0, na: 9, ca: 110, fe: 2.7, portion: "100g", g: 100, cat: "Plant Protein", tags: ["vegan", "soy", "protein", "healthy"] },
  { id: 197, name: "Seitan", cal: 370, p: 75.0, c: 14.0, f: 1.9, fi: 0.5, na: 30, ca: 140, fe: 5.2, portion: "100g", g: 100, cat: "Plant Protein", tags: ["vegan", "wheat", "protein", "seitan"] },
  { id: 198, name: "Soy Milk (Unsweetened)", cal: 80, p: 7.0, c: 4.0, f: 4.0, fi: 1.0, na: 90, ca: 300, fe: 1.0, portion: "1 cup (240ml)", g: 240, cat: "Plant Protein", tags: ["vegan", "milk", "healthy", "dairy-free"] },
  { id: 199, name: "Almond Milk (Unsweetened)", cal: 30, p: 1.0, c: 1.0, f: 2.5, fi: 0.5, na: 180, ca: 450, fe: 0.2, portion: "1 cup (240ml)", g: 240, cat: "Beverage", tags: ["vegan", "milk", "low-cal", "dairy-free"] },
  
  // Healthy Foods & Additional Fruits
  { id: 200, name: "Spinach cooked", cal: 40, p: 5.0, c: 7.0, f: 0.5, fi: 4.0, na: 120, ca: 240, fe: 6.0, portion: "1 cup", g: 180, cat: "Vegetable", tags: ["vegetable", "cooked", "iron", "calcium"] },
  { id: 201, name: "Strawberries", cal: 32, p: 0.7, c: 7.7, f: 0.3, fi: 2.0, na: 1, ca: 16, fe: 0.4, portion: "1 cup", g: 150, cat: "Fruit", tags: ["fruit", "low-cal", "antioxidant"] },
  { id: 202, name: "Raspberries", cal: 64, p: 1.5, c: 14.7, f: 0.8, fi: 8.0, na: 1, ca: 30, fe: 0.9, portion: "1 cup", g: 123, cat: "Fruit", tags: ["fruit", "low-cal", "fiber"] },
  { id: 203, name: "Pineapple Chunk", cal: 50, p: 0.5, c: 13.0, f: 0.1, fi: 1.4, na: 1, ca: 13, fe: 0.3, portion: "1 cup", g: 100, cat: "Fruit", tags: ["fruit", "enzymes"] },
  { id: 204, name: "Mango Slice", cal: 60, p: 0.8, c: 15.0, f: 0.4, fi: 1.6, na: 1, ca: 11, fe: 0.2, portion: "100g", g: 100, cat: "Fruit", tags: ["fruit", "sweet"] },
  { id: 205, name: "Papaya", cal: 43, p: 0.5, c: 11.0, f: 0.3, fi: 1.7, na: 8, ca: 20, fe: 0.3, portion: "100g", g: 100, cat: "Fruit", tags: ["fruit", "enzymes", "digestion"] },
  { id: 206, name: "Pomegranate Seeds", cal: 83, p: 1.7, c: 18.7, f: 1.2, fi: 4.0, na: 3, ca: 10, fe: 0.3, portion: "100g", g: 100, cat: "Fruit", tags: ["fruit", "antioxidant"] },
  { id: 207, name: "Kiwi", cal: 61, p: 1.1, c: 14.7, f: 0.5, fi: 3.0, na: 3, ca: 34, fe: 0.3, portion: "1 medium", g: 75, cat: "Fruit", tags: ["fruit", "vitamin-c"] },
  
  // Cuisines / Asian Extensions (Noodles, Soups, Rolls)
  { id: 208, name: "Egg Fried Rice", cal: 310, p: 9.5, c: 53.0, f: 6.8, fi: 1.5, na: 620, ca: 32, fe: 1.8, portion: "1 plate", g: 200, cat: "Chinese", tags: ["chinese", "rice", "egg"] },
  { id: 209, name: "Hot & Sour Soup", cal: 95, p: 4.5, c: 11.0, f: 3.5, fi: 1.2, na: 780, ca: 40, fe: 1.0, portion: "1 bowl", g: 200, cat: "Chinese", tags: ["chinese", "soup", "low-cal"] },
  { id: 210, name: "Manchow Soup", cal: 110, p: 4.2, c: 14.0, f: 4.0, fi: 1.5, na: 820, ca: 35, fe: 1.1, portion: "1 bowl", g: 200, cat: "Chinese", tags: ["chinese", "soup"] },
  { id: 211, name: "Gyoza (Pork/Chicken, 5 pcs)", cal: 240, p: 11.0, c: 26.0, f: 9.8, fi: 1.2, na: 480, ca: 18, fe: 1.3, portion: "5 pieces", g: 120, cat: "Chinese", tags: ["chinese", "fried", "dumplings"] },
  
  // Western / Mediterranean Healthy Foods
  { id: 212, name: "Hummus", cal: 50, p: 1.5, c: 4.0, f: 3.5, fi: 1.5, na: 115, ca: 12, fe: 0.6, portion: "1 tbsp", g: 30, cat: "Mediterranean", tags: ["dip", "chickpeas", "healthy"] },
  { id: 213, name: "Falafel (1 piece)", cal: 57, p: 2.3, c: 5.5, f: 3.0, fi: 1.5, na: 45, ca: 10, fe: 0.4, portion: "1 piece", g: 20, cat: "Mediterranean", tags: ["fried", "chickpeas", "veg"] },
  { id: 214, name: "Pita Bread (Whole Wheat)", cal: 170, p: 6.0, c: 35.0, f: 1.5, fi: 4.0, na: 320, ca: 20, fe: 1.8, portion: "1 pocket", g: 64, cat: "Bread", tags: ["bread", "mediterranean", "healthy"] },
  { id: 215, name: "Quinoa (cooked)", cal: 120, p: 4.4, c: 21.3, f: 1.9, fi: 2.8, na: 7, ca: 17, fe: 1.5, portion: "1 cup", g: 185, cat: "Cereal", tags: ["grain", "quinoa", "protein", "healthy"] },
  { id: 216, name: "Couscous (cooked)", cal: 112, p: 3.8, c: 23.0, f: 0.2, fi: 1.4, na: 5, ca: 8, fe: 0.4, portion: "1 cup", g: 157, cat: "Cereal", tags: ["grain", "pasta"] },
  
  // Nuts & Seeds Additional
  { id: 217, name: "Pistachios (Roasted)", cal: 160, p: 6.0, c: 8.0, f: 13.0, fi: 3.0, na: 115, ca: 30, fe: 1.1, portion: "1 oz (28g)", g: 28, cat: "Nuts", tags: ["nuts", "snack"] },
  { id: 218, name: "Sunflower Seeds", cal: 165, p: 5.5, c: 6.0, f: 14.0, fi: 3.0, na: 3, ca: 20, fe: 1.5, portion: "1 oz (28g)", g: 28, cat: "Nuts", tags: ["seeds", "fiber"] },
  { id: 219, name: "Sesame Seeds", cal: 160, p: 5.0, c: 7.0, f: 13.5, fi: 3.3, na: 3, ca: 270, fe: 4.1, portion: "1 oz (28g)", g: 28, cat: "Nuts", tags: ["seeds", "calcium", "iron"] },

  // Indian Sweets & Desserts Additional
  { id: 220, name: "Besan Ladoo (1 piece)", cal: 155, p: 2.2, c: 18.0, f: 8.0, fi: 0.8, na: 10, ca: 12, fe: 0.8, portion: "1 piece", g: 30, cat: "Indian Sweet", tags: ["indian", "sweet", "besan"] },
  { id: 221, name: "Halwa (Gajar - Carrot)", cal: 220, p: 4.0, c: 28.0, f: 10.5, fi: 1.2, na: 50, ca: 120, fe: 0.8, portion: "1 cup", g: 100, cat: "Indian Sweet", tags: ["indian", "sweet", "carrot", "dairy"] },
  { id: 222, name: "Soan Papdi (2 pieces)", cal: 160, p: 2.0, c: 22.0, f: 7.5, fi: 0.5, na: 15, ca: 14, fe: 0.5, portion: "2 pieces", g: 35, cat: "Indian Sweet", tags: ["indian", "sweet"] },
  { id: 223, name: "Pedha (1 piece)", cal: 110, p: 2.5, c: 14.0, f: 5.0, fi: 0, na: 30, ca: 80, fe: 0.1, portion: "1 piece", g: 25, cat: "Indian Sweet", tags: ["indian", "sweet", "khoya"] },
  { id: 224, name: "Shrikhand", cal: 260, p: 6.0, c: 38.0, f: 9.0, fi: 0, na: 45, ca: 190, fe: 0.2, portion: "1 cup", g: 120, cat: "Indian Sweet", tags: ["indian", "sweet", "yogurt"] },
  { id: 225, name: "Mysore Pak", cal: 190, p: 1.8, c: 22.0, f: 11.0, fi: 0.5, na: 8, ca: 10, fe: 0.6, portion: "1 piece", g: 35, cat: "Indian Sweet", tags: ["indian", "sweet", "ghee"] },
  { id: 226, name: "Rabri", cal: 320, p: 9.0, c: 35.0, f: 16.0, fi: 0, na: 110, ca: 310, fe: 0.3, portion: "1 cup", g: 120, cat: "Indian Sweet", tags: ["indian", "sweet", "dairy"] },
  { id: 227, name: "Malpua (1 piece)", cal: 180, p: 2.5, c: 26.0, f: 7.5, fi: 0.4, na: 40, ca: 50, fe: 0.5, portion: "1 piece", g: 60, cat: "Indian Sweet", tags: ["indian", "sweet", "fried"] },

  // common items
  { id: 228, name: "Honey", cal: 64, p: 0.1, c: 17.3, f: 0, fi: 0, na: 1, ca: 1, fe: 0.1, portion: "1 tbsp", g: 21, cat: "Sweets", tags: ["sweet", "natural"] },
  { id: 229, name: "Maple Syrup", cal: 52, p: 0, c: 13.4, f: 0, fi: 0, na: 2, ca: 20, fe: 0.2, portion: "1 tbsp", g: 20, cat: "Sweets", tags: ["sweet", "natural"] },
  { id: 230, name: "White Sugar", cal: 49, p: 0, c: 12.6, f: 0, fi: 0, na: 0, ca: 0, fe: 0, portion: "1 tbsp", g: 12, cat: "Sweets", tags: ["sweet"] },
  { id: 231, name: "Jaggery (Gur)", cal: 38, p: 0.1, c: 9.5, f: 0, fi: 0, na: 3, ca: 8, fe: 0.6, portion: "10g", g: 10, cat: "Sweets", tags: ["indian", "sweet", "jaggery", "iron"] },
  { id: 232, name: "Brown Sugar", cal: 45, p: 0, c: 11.5, f: 0, fi: 0, na: 3, ca: 10, fe: 0.1, portion: "1 tbsp", g: 12, cat: "Sweets", tags: ["sweet"] },
  { id: 233, name: "Chicken Korma", cal: 260, p: 21.0, c: 9.5, f: 16.0, fi: 1.5, na: 480, ca: 40, fe: 1.6, portion: "1 bowl", g: 200, cat: "Indian Chicken", tags: ["indian", "chicken", "creamy"] },
  { id: 234, name: "Chicken Tikka Masala", cal: 240, p: 22.0, c: 8.0, f: 13.5, fi: 1.0, na: 490, ca: 38, fe: 1.8, portion: "1 bowl", g: 200, cat: "Indian Chicken", tags: ["indian", "chicken", "creamy"] },
  { id: 235, name: "Mutton Korma", cal: 310, p: 20.0, c: 8.5, f: 22.0, fi: 1.2, na: 540, ca: 35, fe: 2.9, portion: "1 bowl", g: 200, cat: "Indian Meat", tags: ["indian", "mutton"] },
  { id: 236, name: "Mutton Keema", cal: 290, p: 24.5, c: 6.0, f: 18.5, fi: 1.5, na: 510, ca: 30, fe: 3.1, portion: "1 bowl", g: 200, cat: "Indian Meat", tags: ["indian", "mutton", "keema", "protein"] },
  { id: 237, name: "Egg Curry (2 eggs)", cal: 240, p: 15.0, c: 8.0, f: 16.5, fi: 1.5, na: 490, ca: 75, fe: 2.1, portion: "1 bowl", g: 200, cat: "Eggs", tags: ["indian", "egg", "curry"] },
  { id: 238, name: "Fish Tikka (Dry)", cal: 150, p: 22.0, c: 2.5, f: 5.8, fi: 0, na: 420, ca: 50, fe: 1.2, portion: "100g", g: 100, cat: "Indian Fish", tags: ["indian", "fish", "grilled", "protein"] },
  { id: 239, name: "Bhindi Do Pyaza", cal: 130, p: 2.8, c: 13.0, f: 7.5, fi: 3.5, na: 380, ca: 68, fe: 1.4, portion: "1 bowl", g: 150, cat: "Indian Veg", tags: ["indian", "veg", "bhindi"] },
  { id: 240, name: "Jeera Aloo", cal: 160, p: 2.5, c: 24.0, f: 6.2, fi: 2.8, na: 350, ca: 20, fe: 1.2, portion: "1 bowl", g: 150, cat: "Indian Veg", tags: ["indian", "veg", "aloo"] },
  { id: 241, name: "Gobi Manchurian (Dry)", cal: 230, p: 4.5, c: 31.0, f: 9.8, fi: 2.5, na: 750, ca: 38, fe: 1.4, portion: "1 plate", g: 150, cat: "Chinese", tags: ["chinese", "veg", "gobi"] },
  { id: 242, name: "Schezwan Fried Rice", cal: 320, p: 6.0, c: 58.0, f: 6.5, fi: 2.2, na: 780, ca: 28, fe: 1.6, portion: "1 plate", g: 200, cat: "Chinese", tags: ["chinese", "rice", "spicy"] },
  { id: 243, name: "Schezwan Noodles", cal: 310, p: 6.8, c: 56.0, f: 6.2, fi: 2.5, na: 790, ca: 32, fe: 1.8, portion: "1 plate", g: 200, cat: "Chinese", tags: ["chinese", "noodles", "spicy"] },
  { id: 244, name: "Baby Corn Jolt", cal: 150, p: 3.2, c: 22.0, f: 5.5, fi: 2.5, na: 420, ca: 18, fe: 0.9, portion: "1 bowl", g: 150, cat: "Vegetable", tags: ["corn", "veg"] },
  { id: 245, name: "Spring Onion Crepe", cal: 140, p: 4.0, c: 24.0, f: 3.2, fi: 1.8, na: 290, ca: 30, fe: 1.2, portion: "1 piece", g: 80, cat: "Indian Breakfast", tags: ["indian", "south-indian"] },
  { id: 246, name: "Pesarattu (Green Gram Dosa)", cal: 180, p: 9.2, c: 31.0, f: 2.5, fi: 4.2, na: 290, ca: 42, fe: 2.5, portion: "1 medium", g: 110, cat: "Indian Breakfast", tags: ["indian", "breakfast", "protein"] },
  { id: 247, name: "Rava Idli", cal: 65, p: 2.2, c: 13.0, f: 0.6, fi: 0.8, na: 180, ca: 18, fe: 0.7, portion: "1 piece", g: 45, cat: "Indian Breakfast", tags: ["indian", "breakfast", "south-indian"] },
  { id: 248, name: "Filter Coffee", cal: 65, p: 2.5, c: 8.0, f: 2.5, fi: 0, na: 55, ca: 110, fe: 0.1, portion: "1 cup (150ml)", g: 150, cat: "Beverage", tags: ["indian", "coffee", "dairy"] },
  { id: 249, name: "Masala Chai", cal: 50, p: 2.0, c: 7.0, f: 1.8, fi: 0, na: 45, ca: 80, fe: 0.1, portion: "1 cup (150ml)", g: 150, cat: "Beverage", tags: ["indian", "tea", "dairy"] },
  { id: 250, name: "Green Tea", cal: 2, p: 0.1, c: 0.2, f: 0, fi: 0, na: 2, ca: 3, fe: 0.1, portion: "1 cup (200ml)", g: 200, cat: "Beverage", tags: ["tea", "zero-cal", "antioxidant"] },
  { id: 251, name: "Lemon Tea", cal: 20, p: 0.1, c: 5.0, f: 0, fi: 0, na: 5, ca: 5, fe: 0.1, portion: "1 cup (200ml)", g: 200, cat: "Beverage", tags: ["tea", "low-cal"] },
  { id: 252, name: "Apple Juice", cal: 114, p: 0.2, c: 28.0, f: 0.2, fi: 0.5, na: 10, ca: 20, fe: 0.3, portion: "1 glass (250ml)", g: 250, cat: "Beverage", tags: ["juice", "sweet"] },
  { id: 253, name: "Orange Juice (Fresh)", cal: 110, p: 1.7, c: 26.0, f: 0.5, fi: 0.8, na: 2, ca: 27, fe: 0.5, portion: "1 glass (250ml)", g: 250, cat: "Beverage", tags: ["juice", "vitamin-c"] },
  { id: 254, name: "Lassi (Salted)", cal: 90, p: 4.8, c: 7.0, f: 4.8, fi: 0, na: 340, ca: 150, fe: 0.1, portion: "1 glass", g: 250, cat: "Indian Dairy", tags: ["indian", "dairy", "drink"] },
  { id: 255, name: "Sweet Corn Soup", cal: 120, p: 3.5, c: 24.0, f: 1.5, fi: 2.2, na: 680, ca: 15, fe: 0.8, portion: "1 bowl", g: 200, cat: "Chinese", tags: ["chinese", "soup"] },
  { id: 256, name: "Manchurian Fried Rice", cal: 360, p: 8.5, c: 62.0, f: 8.5, fi: 2.5, na: 810, ca: 30, fe: 1.8, portion: "1 plate", g: 230, cat: "Chinese", tags: ["chinese", "rice"] },
  { id: 257, name: "Tofu Fried Rice (Vegan)", cal: 260, p: 12.0, c: 44.0, f: 4.8, fi: 2.2, na: 540, ca: 120, fe: 3.1, portion: "1 plate", g: 200, cat: "Plant Protein", tags: ["vegan", "tofu", "rice", "healthy"] },
  { id: 258, name: "Soya Chaap (Tandoori)", cal: 240, p: 18.5, c: 14.0, f: 12.0, fi: 3.5, na: 510, ca: 95, fe: 3.8, portion: "1 plate", g: 150, cat: "Plant Protein", tags: ["indian", "soya", "protein", "grilled"] },
  { id: 259, name: "Soya Chaap (Gravy)", cal: 220, p: 14.0, c: 16.0, f: 11.5, fi: 3.0, na: 490, ca: 85, fe: 3.2, portion: "1 bowl", g: 200, cat: "Plant Protein", tags: ["indian", "soya", "protein"] },
  { id: 260, name: "Bread Pakora", cal: 240, p: 5.5, c: 28.0, f: 11.8, fi: 2.0, na: 360, ca: 35, fe: 1.4, portion: "1 piece", g: 90, cat: "Indian Snack", tags: ["indian", "fried", "snack"] },
  { id: 261, name: "Paneer Pakora", cal: 290, p: 12.5, c: 18.0, f: 18.5, fi: 1.2, na: 390, ca: 165, fe: 1.6, portion: "1 piece", g: 100, cat: "Indian Snack", tags: ["indian", "fried", "paneer"] },
  { id: 262, name: "Methi Thepla", cal: 115, p: 3.8, c: 21.0, f: 2.2, fi: 3.0, na: 160, ca: 65, fe: 1.9, portion: "1 thepla", g: 40, cat: "Indian Grain", tags: ["indian", "gujarati", "healthy"] },
  { id: 263, name: "Ragi Dosa", cal: 170, p: 4.0, c: 34.0, f: 2.2, fi: 4.5, na: 290, ca: 160, fe: 2.4, portion: "1 medium", g: 100, cat: "Indian Breakfast", tags: ["indian", "breakfast", "ragi", "calcium"] },
  { id: 264, name: "Appam (Plain)", cal: 120, p: 2.0, c: 24.0, f: 1.8, fi: 0.8, na: 190, ca: 15, fe: 0.6, portion: "1 piece", g: 60, cat: "Indian Breakfast", tags: ["indian", "south-indian"] },
  { id: 265, name: "Fish Fry (Amritsari)", cal: 210, p: 21.0, c: 4.8, f: 12.0, fi: 0.5, na: 490, ca: 38, fe: 1.5, portion: "100g", g: 100, cat: "Indian Fish", tags: ["indian", "fish", "fried"] },
  { id: 266, name: "Sheer Korma", cal: 280, p: 7.2, c: 36.0, f: 12.0, fi: 0.8, na: 95, ca: 180, fe: 0.9, portion: "1 bowl", g: 150, cat: "Indian Sweet", tags: ["indian", "sweet", "festive"] },
  { id: 267, name: "Kulfi (Pista)", cal: 180, p: 4.5, c: 22.0, f: 8.5, fi: 0.4, na: 70, ca: 140, fe: 0.3, portion: "1 piece", g: 70, cat: "Indian Sweet", tags: ["indian", "sweet", "dairy"] },
  { id: 268, name: "Rabri Falooda", cal: 360, p: 8.5, c: 55.0, f: 12.0, fi: 1.5, na: 130, ca: 240, fe: 0.9, portion: "1 glass", g: 250, cat: "Indian Sweet", tags: ["indian", "sweet", "dessert"] },
  { id: 269, name: "Sevaiya Upma", cal: 180, p: 4.0, c: 33.0, f: 3.5, fi: 1.8, na: 290, ca: 12, fe: 0.9, portion: "1 bowl", g: 150, cat: "Indian Breakfast", tags: ["indian", "vermicelli"] },
  { id: 270, name: "Lemon Green Tea", cal: 4, p: 0.1, c: 0.8, f: 0, fi: 0, na: 2, ca: 4, fe: 0.1, portion: "1 cup", g: 200, cat: "Beverage", tags: ["tea", "low-cal"] },
  { id: 271, name: "Boba Milk Tea", cal: 280, p: 2.5, c: 52.0, f: 7.0, fi: 0.5, na: 85, ca: 110, fe: 0.4, portion: "1 cup (400ml)", g: 400, cat: "Beverage", tags: ["sweet", "drink", "boba"] },
  { id: 272, name: "Protein Shake (Whey + Water)", cal: 120, p: 25.5, c: 2.0, f: 1.0, fi: 0, na: 120, ca: 125, fe: 0.3, portion: "1 serving", g: 300, cat: "Supplement", tags: ["supplement", "protein"] },
  { id: 273, name: "Protein Shake (Whey + Milk)", cal: 240, p: 33.5, c: 14.0, f: 7.0, fi: 0, na: 220, ca: 425, fe: 0.4, portion: "1 serving", g: 300, cat: "Supplement", tags: ["supplement", "protein", "dairy"] },
  { id: 274, name: "BCAA Powder", cal: 10, p: 2.0, c: 0.5, f: 0, fi: 0, na: 50, ca: 0, fe: 0, portion: "1 scoop", g: 8, cat: "Supplement", tags: ["supplement", "recovery"] },
  { id: 275, name: "Mass Gainer (1 serving)", cal: 560, p: 30.0, c: 100.0, f: 4.5, fi: 2.0, na: 380, ca: 280, fe: 2.5, portion: "2 scoops", g: 150, cat: "Supplement", tags: ["supplement", "bulking"] },
  { id: 276, name: "Almond Flour", cal: 160, p: 6.0, c: 6.0, f: 14.0, fi: 3.0, na: 0, ca: 70, fe: 1.0, portion: "1/4 cup (28g)", g: 28, cat: "Nuts", tags: ["raw", "almonds", "keto", "gluten-free"] },
  { id: 277, name: "Coconut Flour", cal: 120, p: 4.0, c: 18.0, f: 4.0, fi: 10.0, na: 30, ca: 15, fe: 1.8, portion: "1/4 cup (28g)", g: 28, cat: "Nuts", tags: ["raw", "coconut", "fiber", "gluten-free"] },
  { id: 278, name: "Olive Tapenade", cal: 70, p: 0.5, c: 2.0, f: 7.0, fi: 1.0, na: 280, ca: 15, fe: 0.4, portion: "2 tbsp", g: 30, cat: "Mediterranean", tags: ["olives", "fat"] },
  { id: 279, name: "Tzatziki Dip", cal: 35, p: 2.0, c: 2.0, f: 2.2, fi: 0.2, na: 135, ca: 55, fe: 0.1, portion: "2 tbsp", g: 30, cat: "Mediterranean", tags: ["yogurt", "cucumbers", "healthy"] },
  { id: 280, name: "Greek Pita Bread (Plain)", cal: 190, p: 6.5, c: 38.0, f: 1.8, fi: 1.5, na: 360, ca: 25, fe: 1.6, portion: "1 pita", g: 70, cat: "Bread", tags: ["bread", "mediterranean"] },
  { id: 281, name: "Tabbouleh Salad", cal: 130, p: 2.5, c: 14.0, f: 8.0, fi: 3.5, na: 290, ca: 30, fe: 1.4, portion: "1 cup", g: 150, cat: "Mediterranean", tags: ["salad", "healthy"] },
  { id: 282, name: "Feta & Spinach Pie (Spanakopita)", cal: 290, p: 8.0, c: 28.0, f: 16.5, fi: 1.8, na: 490, ca: 160, fe: 1.8, portion: "1 piece", g: 100, cat: "Mediterranean", tags: ["cheese", "spinach"] },
  { id: 283, name: "Hummus (Roasted Red Pepper)", cal: 55, p: 1.6, c: 4.5, f: 3.5, fi: 1.5, na: 120, ca: 14, fe: 0.6, portion: "1 tbsp", g: 30, cat: "Mediterranean", tags: ["dip", "chickpeas"] },
  { id: 284, name: "Pesto Sauce (Basil)", cal: 110, p: 2.0, c: 1.5, f: 11.0, fi: 0.5, na: 160, ca: 60, fe: 0.5, portion: "1 tbsp", g: 15, cat: "Fats", tags: ["italian", "sauce", "fat"] },
  { id: 285, name: "Couscous cooked with herbs", cal: 120, p: 4.0, c: 24.0, f: 1.0, fi: 1.8, na: 180, ca: 12, fe: 0.5, portion: "1 cup", g: 165, cat: "Cereal", tags: ["grain", "mediterranean"] },
  { id: 286, name: "Oat Milk (Unsweetened)", cal: 90, p: 2.0, c: 16.0, f: 1.5, fi: 2.0, na: 100, ca: 350, fe: 0.4, portion: "1 cup (240ml)", g: 240, cat: "Beverage", tags: ["vegan", "milk", "healthy", "dairy-free"] },
  { id: 287, name: "Sesame Oil", cal: 120, p: 0, c: 0, f: 14.0, fi: 0, na: 0, ca: 0, fe: 0, portion: "1 tbsp", g: 14, cat: "Fats", tags: ["oil", "fat"] },
  { id: 288, name: "Peanut Oil", cal: 120, p: 0, c: 0, f: 14.0, fi: 0, na: 0, ca: 0, fe: 0, portion: "1 tbsp", g: 14, cat: "Fats", tags: ["oil", "fat"] },
  { id: 289, name: "Mustard Oil", cal: 124, p: 0, c: 0, f: 14.0, fi: 0, na: 0, ca: 0, fe: 0, portion: "1 tbsp", g: 14, cat: "Fats", tags: ["indian", "oil", "fat"] },
  { id: 290, name: "Sunflower Oil", cal: 120, p: 0, c: 0, f: 14.0, fi: 0, na: 0, ca: 0, fe: 0, portion: "1 tbsp", g: 14, cat: "Fats", tags: ["oil", "fat"] },
  { id: 291, name: "Soybean Oil", cal: 120, p: 0, c: 0, f: 14.0, fi: 0, na: 0, ca: 0, fe: 0, portion: "1 tbsp", g: 14, cat: "Fats", tags: ["oil", "fat"] },
  { id: 292, name: "Flaxseed Oil", cal: 120, p: 0, c: 0, f: 14.0, fi: 0, na: 0, ca: 0, fe: 0, portion: "1 tbsp", g: 14, cat: "Fats", tags: ["oil", "fat", "omega3"] },
  { id: 293, name: "Balsamic Vinegar", cal: 14, p: 0.1, c: 2.7, f: 0, fi: 0, na: 4, ca: 4, fe: 0.1, portion: "1 tbsp", g: 16, cat: "Beverage", tags: ["condiment", "salad", "low-cal"] },
  { id: 294, name: "Apple Cider Vinegar", cal: 3, p: 0, c: 0.1, f: 0, fi: 0, na: 1, ca: 1, fe: 0, portion: "1 tbsp", g: 15, cat: "Beverage", tags: ["condiment", "low-cal"] },
  { id: 295, name: "Soy Sauce (Regular)", cal: 10, p: 1.4, c: 1.0, f: 0.1, fi: 0.1, na: 920, ca: 4, fe: 0.4, portion: "1 tbsp", g: 16, cat: "Beverage", tags: ["condiment", "chinese", "sodium"] },
  { id: 296, name: "Chilli Sauce", cal: 15, p: 0.2, c: 3.5, f: 0.1, fi: 0.3, na: 290, ca: 5, fe: 0.2, portion: "1 tbsp", g: 15, cat: "Beverage", tags: ["condiment", "spicy"] },
  { id: 297, name: "Tomato Ketchup", cal: 15, p: 0.2, c: 4.0, f: 0.1, fi: 0.1, na: 160, ca: 3, fe: 0.1, portion: "1 tbsp", g: 17, cat: "Beverage", tags: ["condiment", "sweet"] },
  { id: 298, name: "Green Chilli Pickle", cal: 35, p: 0.5, c: 1.8, f: 3.0, fi: 0.8, na: 410, ca: 12, fe: 0.4, portion: "1 piece", g: 15, cat: "Beverage", tags: ["indian", "pickle", "spicy"] },
  { id: 299, name: "Mango Pickle", cal: 40, p: 0.4, c: 2.0, f: 3.5, fi: 0.5, na: 450, ca: 10, fe: 0.3, portion: "1 piece", g: 15, cat: "Beverage", tags: ["indian", "pickle"] },
  { id: 300, name: "Lemon Pickle", cal: 25, p: 0.3, c: 4.8, f: 0.5, fi: 1.0, na: 480, ca: 15, fe: 0.3, portion: "1 piece", g: 15, cat: "Beverage", tags: ["indian", "pickle"] },
];

/** Search food database */
export function searchFood(query, limit = 15) {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase().trim();
  return FOOD_DB
    .filter(f => f.name.toLowerCase().includes(q) || f.tags.some(t => t.includes(q)))
    .slice(0, limit);
}

export function getFoodById(id) {
  return FOOD_DB.find(f => f.id === id) || null;
}

export function getFoodsByCategory(cat) {
  return FOOD_DB.filter(f => f.cat.toLowerCase().includes(cat.toLowerCase()));
}

export function scaledNutrition(food, gramsEaten) {
  const r = gramsEaten / food.g;
  return {
    name: food.name, grams: gramsEaten,
    calories: Math.round(food.cal * r),
    protein:  Math.round(food.p  * r * 10) / 10,
    carbs:    Math.round(food.c  * r * 10) / 10,
    fat:      Math.round(food.f  * r * 10) / 10,
    fiber:    Math.round(food.fi * r * 10) / 10,
    sodium:   Math.round(food.na * r),
    calcium:  Math.round(food.ca * r),
    iron:     Math.round(food.fe * r * 10) / 10,
  };
}

export const IMAGENET_TO_FOOD_MAP = {
  "pizza":         [103],
  "hamburger":     [100,101],
  "cheeseburger":  [101],
  "hot dog":       [100],
  "french fries":  [102],
  "banana":        [89],
  "apple":         [90],
  "orange":        [91],
  "broccoli":      [80],
  "carrot":        [81],
  "spaghetti":     [155, 156, 157],
  "guacamole":     [93],
  "burrito":       [136, 137, 138],
  "sandwich":      [74],
  "oatmeal":       [75,76],
  "espresso":      [104],
  "cappuccino":    [105],
  "beer glass":    [108],
  "strawberry":    [201],
  "pineapple":     [203],
  "cucumber":      [84],
  "mushroom":      [121],
  "bell pepper":   [86],
  "hen":           [58],
  "ice cream":     [182],
};

export default { FOOD_DB, searchFood, getFoodById, getFoodsByCategory, scaledNutrition, IMAGENET_TO_FOOD_MAP };
