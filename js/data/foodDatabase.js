/* ============================================================
   FitForge — Comprehensive Food Database (200+ Entries)
   Macros in grams, micronutrients in mg/mcg, calories in kcal.
   ============================================================ */

export const FOOD_DB = [
  // --- Indian Grain & Breads ---
  { id: 1, name: "Roti (Wheat Flatbread)", cal: 120, p: 3.1, c: 24.4, f: 1.0, fi: 1.8, na: 0, ca: 14, fe: 1.2, vd: 0, vb12: 0, portion: "1 roti", g: 40, cat: "Indian Grain", tags: ["indian", "grain", "bread"] },
  { id: 2, name: "Multigrain Roti", cal: 110, p: 3.8, c: 22.0, f: 1.2, fi: 3.1, na: 5, ca: 18, fe: 1.5, vd: 0, vb12: 0, portion: "1 roti", g: 40, cat: "Indian Grain", tags: ["indian", "grain", "bread", "healthy"] },
  { id: 3, name: "Naan (Plain)", cal: 262, p: 8.7, c: 45.7, f: 5.1, fi: 1.7, na: 526, ca: 72, fe: 2.5, vd: 0, vb12: 0, portion: "1 piece", g: 90, cat: "Indian Grain", tags: ["indian", "grain", "bread"] },
  { id: 4, name: "Butter Naan", cal: 310, p: 8.5, c: 45.0, f: 9.5, fi: 1.5, na: 530, ca: 68, fe: 2.2, vd: 0, vb12: 0.1, portion: "1 piece", g: 90, cat: "Indian Grain", tags: ["indian", "grain", "bread"] },
  { id: 5, name: "Tandoori Roti (Wheat)", cal: 115, p: 3.5, c: 23.5, f: 0.8, fi: 2.0, na: 10, ca: 15, fe: 1.3, vd: 0, vb12: 0, portion: "1 roti", g: 45, cat: "Indian Grain", tags: ["indian", "grain", "bread"] },
  { id: 6, name: "Paratha (Plain)", cal: 185, p: 4.0, c: 27.0, f: 7.5, fi: 1.9, na: 200, ca: 20, fe: 1.4, vd: 0, vb12: 0, portion: "1 paratha", g: 70, cat: "Indian Grain", tags: ["indian", "grain", "bread"] },
  { id: 7, name: "Aloo Paratha (Stuffed)", cal: 230, p: 5.5, c: 33.0, f: 9.5, fi: 2.2, na: 210, ca: 25, fe: 1.8, vd: 0, vb12: 0, portion: "1 piece", g: 100, cat: "Indian Grain", tags: ["indian", "grain", "bread"] },
  { id: 8, name: "Paneer Paratha", cal: 290, p: 11.5, c: 32.0, f: 12.0, fi: 2.5, na: 250, ca: 110, fe: 1.9, vd: 0, vb12: 0.2, portion: "1 piece", g: 110, cat: "Indian Grain", tags: ["indian", "grain", "bread"] },
  { id: 9, name: "Bhatura", cal: 290, p: 6.5, c: 35.0, f: 13.0, fi: 1.2, na: 300, ca: 22, fe: 1.5, vd: 0, vb12: 0, portion: "1 bhatura", g: 80, cat: "Indian Grain", tags: ["indian", "grain", "fried"] },
  { id: 10, name: "Puri", cal: 180, p: 3.0, c: 22.0, f: 8.5, fi: 1.0, na: 5, ca: 8, fe: 1.0, vd: 0, vb12: 0, portion: "1 puri", g: 40, cat: "Indian Grain", tags: ["indian", "grain", "fried"] },
  { id: 11, name: "White Rice (cooked)", cal: 130, p: 2.7, c: 28.2, f: 0.3, fi: 0.4, na: 1, ca: 10, fe: 0.2, vd: 0, vb12: 0, portion: "1 cup", g: 186, cat: "Indian Grain", tags: ["indian", "grain", "rice"] },
  { id: 12, name: "Brown Rice (cooked)", cal: 112, p: 2.6, c: 23.5, f: 0.9, fi: 1.8, na: 5, ca: 10, fe: 0.5, vd: 0, vb12: 0, portion: "1 cup", g: 195, cat: "Indian Grain", tags: ["grain", "rice", "healthy"] },
  { id: 13, name: "Basmati Rice (cooked)", cal: 121, p: 3.5, c: 25.2, f: 0.4, fi: 0.3, na: 0, ca: 3, fe: 0.2, vd: 0, vb12: 0, portion: "1 cup", g: 163, cat: "Indian Grain", tags: ["indian", "grain", "rice"] },
  { id: 14, name: "Zeera Rice", cal: 155, p: 3.2, c: 31.0, f: 2.0, fi: 0.5, na: 150, ca: 15, fe: 0.5, vd: 0, vb12: 0, portion: "1 bowl", g: 180, cat: "Indian Grain", tags: ["indian", "rice"] },
  { id: 15, name: "Chicken Biryani", cal: 290, p: 18.5, c: 32.0, f: 9.5, fi: 1.5, na: 480, ca: 40, fe: 2.0, vd: 0, vb12: 0.5, portion: "1 plate", g: 250, cat: "Indian Grain", tags: ["indian", "rice", "chicken"] },
  { id: 16, name: "Mutton Biryani", cal: 340, p: 19.0, c: 33.0, f: 14.0, fi: 1.5, na: 520, ca: 45, fe: 2.5, vd: 0, vb12: 1.5, portion: "1 plate", g: 250, cat: "Indian Grain", tags: ["indian", "rice", "mutton"] },
  { id: 17, name: "Veg Pulao", cal: 210, p: 5.0, c: 38.0, f: 5.5, fi: 2.5, na: 320, ca: 30, fe: 1.2, vd: 0, vb12: 0, portion: "1 bowl", g: 200, cat: "Indian Grain", tags: ["indian", "rice", "veg"] },
  { id: 18, name: "Khichdi", cal: 180, p: 7.5, c: 30.0, f: 4.0, fi: 3.0, na: 280, ca: 45, fe: 2.5, vd: 0, vb12: 0, portion: "1 bowl", g: 200, cat: "Indian Grain", tags: ["indian", "rice", "dal", "healthy"] },
  
  // --- Indian Dals & Gravies ---
  { id: 19, name: "Yellow Moong Dal", cal: 150, p: 9.5, c: 20.5, f: 4.0, fi: 3.5, na: 480, ca: 55, fe: 3.1, vd: 0, vb12: 0, portion: "1 bowl", g: 150, cat: "Indian Dal", tags: ["indian", "dal", "protein"] },
  { id: 20, name: "Masoor Dal (Red Lentil)", cal: 148, p: 10.2, c: 20.0, f: 3.8, fi: 4.0, na: 460, ca: 60, fe: 3.5, vd: 0, vb12: 0, portion: "1 bowl", g: 150, cat: "Indian Dal", tags: ["indian", "dal", "protein"] },
  { id: 21, name: "Dal Makhani", cal: 220, p: 10.0, c: 22.0, f: 10.5, fi: 5.0, na: 520, ca: 75, fe: 3.8, vd: 0, vb12: 0.1, portion: "1 bowl", g: 200, cat: "Indian Dal", tags: ["indian", "dal", "creamy"] },
  { id: 22, name: "Dal Tadka (Toor Dal)", cal: 160, p: 8.8, c: 21.0, f: 4.5, fi: 3.8, na: 470, ca: 50, fe: 2.9, vd: 0, vb12: 0, portion: "1 bowl", g: 150, cat: "Indian Dal", tags: ["indian", "dal", "protein"] },
  { id: 23, name: "Rajma (Kidney Bean Curry)", cal: 200, p: 9.5, c: 28.0, f: 5.5, fi: 6.5, na: 490, ca: 65, fe: 4.0, vd: 0, vb12: 0, portion: "1 bowl", g: 200, cat: "Indian Dal", tags: ["indian", "dal", "protein"] },
  { id: 24, name: "Chhole (Chickpea Curry)", cal: 215, p: 9.0, c: 30.0, f: 7.0, fi: 7.0, na: 510, ca: 70, fe: 4.5, vd: 0, vb12: 0, portion: "1 bowl", g: 200, cat: "Indian Dal", tags: ["indian", "dal", "chickpeas"] },
  { id: 25, name: "Sambhar", cal: 95, p: 4.5, c: 13.0, f: 2.5, fi: 3.5, na: 420, ca: 35, fe: 2.0, vd: 0, vb12: 0, portion: "1 bowl", g: 200, cat: "Indian Dal", tags: ["indian", "south-indian", "soup"] },
  { id: 26, name: "Kadhi Pakora", cal: 210, p: 7.0, c: 18.0, f: 12.0, fi: 1.5, na: 540, ca: 110, fe: 1.5, vd: 0, vb12: 0.2, portion: "1 bowl", g: 200, cat: "Indian Dal", tags: ["indian", "yogurt"] },

  // --- Paneer & Dairy Dishes ---
  { id: 27, name: "Paneer (Raw Cottage Cheese)", cal: 265, p: 18.3, c: 3.3, f: 20.8, fi: 0, na: 30, ca: 208, fe: 0.3, vd: 0, vb12: 0.5, portion: "100g", g: 100, cat: "Indian Dairy", tags: ["indian", "dairy", "protein", "paneer"] },
  { id: 28, name: "Palak Paneer", cal: 240, p: 11.0, c: 8.5, f: 18.5, fi: 2.0, na: 460, ca: 180, fe: 3.5, vd: 0, vb12: 0.2, portion: "1 bowl", g: 200, cat: "Indian Dairy", tags: ["indian", "paneer", "spinach"] },
  { id: 29, name: "Paneer Butter Masala", cal: 235, p: 9.5, c: 8.0, f: 19.5, fi: 1.0, na: 480, ca: 175, fe: 1.5, vd: 0, vb12: 0.3, portion: "1 bowl", g: 200, cat: "Indian Dairy", tags: ["indian", "paneer", "creamy"] },
  { id: 30, name: "Paneer Tikka", cal: 280, p: 20.5, c: 5.0, f: 20.0, fi: 0.5, na: 520, ca: 220, fe: 0.5, vd: 0, vb12: 0.4, portion: "6 pieces", g: 150, cat: "Indian Dairy", tags: ["indian", "paneer", "grilled"] },
  { id: 31, name: "Shahi Paneer", cal: 260, p: 10.0, c: 9.0, f: 21.0, fi: 0.8, na: 490, ca: 160, fe: 1.2, vd: 0, vb12: 0.3, portion: "1 bowl", g: 200, cat: "Indian Dairy", tags: ["indian", "paneer", "creamy"] },
  { id: 32, name: "Tofu Palak (Vegan Palak Paneer)", cal: 130, p: 9.0, c: 6.0, f: 8.5, fi: 2.5, na: 380, ca: 210, fe: 4.2, vd: 0, vb12: 0, portion: "1 bowl", g: 200, cat: "Plant Protein", tags: ["vegan", "tofu", "spinach", "healthy"] },
  { id: 33, name: "Dahi (Plain Curd)", cal: 61, p: 3.5, c: 5.0, f: 3.0, fi: 0, na: 46, ca: 121, fe: 0.1, vd: 0, vb12: 0.4, portion: "1 cup", g: 200, cat: "Indian Dairy", tags: ["indian", "dairy", "probiotic"] },
  { id: 34, name: "Sweet Lassi", cal: 155, p: 5.5, c: 24.5, f: 4.0, fi: 0, na: 65, ca: 160, fe: 0.1, vd: 0, vb12: 0.6, portion: "1 glass", g: 250, cat: "Indian Dairy", tags: ["indian", "dairy", "drink"] },
  { id: 35, name: "Chaas (Buttermilk)", cal: 40, p: 2.0, c: 5.0, f: 1.0, fi: 0, na: 300, ca: 90, fe: 0.1, vd: 0, vb12: 0.2, portion: "1 glass", g: 250, cat: "Indian Dairy", tags: ["indian", "dairy", "drink", "low-cal"] },

  // --- Indian Breakfasts & Street Snacks ---
  { id: 36, name: "Idli", cal: 39, p: 1.8, c: 8.0, f: 0.2, fi: 0.5, na: 10, ca: 12, fe: 0.4, vd: 0, vb12: 0, portion: "1 piece", g: 30, cat: "Indian Breakfast", tags: ["indian", "breakfast", "south-indian", "low-cal"] },
  { id: 37, name: "Masala Dosa", cal: 220, p: 5.0, c: 35.0, f: 7.5, fi: 1.5, na: 380, ca: 30, fe: 1.8, vd: 0, vb12: 0, portion: "1 medium", g: 120, cat: "Indian Breakfast", tags: ["indian", "breakfast", "south-indian", "crispy"] },
  { id: 38, name: "Rava Upma", cal: 190, p: 4.5, c: 32.0, f: 5.5, fi: 2.0, na: 310, ca: 15, fe: 1.0, vd: 0, vb12: 0, portion: "1 bowl", g: 180, cat: "Indian Breakfast", tags: ["indian", "breakfast", "semolina"] },
  { id: 39, name: "Poha", cal: 165, p: 3.0, c: 30.5, f: 3.8, fi: 1.5, na: 290, ca: 10, fe: 1.8, vd: 0, vb12: 0, portion: "1 bowl", g: 150, cat: "Indian Breakfast", tags: ["indian", "breakfast"] },
  { id: 40, name: "Dhokla (Khaman)", cal: 140, p: 5.2, c: 22.0, f: 3.5, fi: 1.5, na: 420, ca: 28, fe: 1.1, vd: 0, vb12: 0, portion: "2 pieces", g: 80, cat: "Indian Breakfast", tags: ["indian", "gujarati", "healthy"] },
  { id: 41, name: "Medu Vada", cal: 200, p: 5.5, c: 24.0, f: 9.5, fi: 1.8, na: 290, ca: 45, fe: 2.2, vd: 0, vb12: 0, portion: "2 pieces", g: 80, cat: "Indian Breakfast", tags: ["indian", "breakfast", "fried"] },
  { id: 42, name: "Samosa", cal: 265, p: 5.0, c: 30.0, f: 14.0, fi: 2.0, na: 380, ca: 20, fe: 1.5, vd: 0, vb12: 0, portion: "1 piece", g: 100, cat: "Indian Snack", tags: ["indian", "snack", "fried"] },
  { id: 43, name: "Pav Bhaji", cal: 380, p: 9.0, c: 55.0, f: 14.0, fi: 5.0, na: 680, ca: 60, fe: 2.5, vd: 0, vb12: 0.1, portion: "1 plate", g: 300, cat: "Indian Snack", tags: ["indian", "snack", "street"] },
  { id: 44, name: "Vada Pav", cal: 290, p: 7.5, c: 40.0, f: 11.5, fi: 2.5, na: 490, ca: 40, fe: 2.0, vd: 0, vb12: 0, portion: "1 piece", g: 130, cat: "Indian Snack", tags: ["indian", "snack", "street"] },
  { id: 45, name: "Bhel Puri", cal: 180, p: 4.5, c: 32.0, f: 4.5, fi: 2.5, na: 350, ca: 20, fe: 1.8, vd: 0, vb12: 0, portion: "1 serving", g: 100, cat: "Indian Snack", tags: ["indian", "snack", "street"] },
  
  // --- Indian Non-Veg Entrees ---
  { id: 46, name: "Chicken Tikka (Dry)", cal: 165, p: 30.5, c: 3.5, f: 3.5, fi: 0, na: 480, ca: 15, fe: 1.2, vd: 0, vb12: 0.8, portion: "100g", g: 100, cat: "Indian Chicken", tags: ["indian", "chicken", "protein", "grilled"] },
  { id: 47, name: "Butter Chicken", cal: 205, p: 18.0, c: 8.5, f: 12.0, fi: 0.5, na: 420, ca: 35, fe: 1.5, vd: 0, vb12: 0.7, portion: "1 bowl", g: 200, cat: "Indian Chicken", tags: ["indian", "chicken", "creamy"] },
  { id: 48, name: "Chicken Curry (Home-Style)", cal: 190, p: 20.0, c: 5.0, f: 10.5, fi: 0.8, na: 450, ca: 30, fe: 1.8, vd: 0, vb12: 0.9, portion: "1 bowl", g: 200, cat: "Indian Chicken", tags: ["indian", "chicken"] },
  { id: 49, name: "Tandoori Chicken (Half)", cal: 260, p: 42.0, c: 6.0, f: 8.0, fi: 0.7, na: 750, ca: 30, fe: 2.2, vd: 0, vb12: 1.2, portion: "half chicken", g: 300, cat: "Indian Chicken", tags: ["indian", "chicken", "grilled", "protein"] },
  { id: 50, name: "Mutton Masala", cal: 280, p: 21.0, c: 4.5, f: 20.0, fi: 0.5, na: 530, ca: 25, fe: 3.4, vd: 0, vb12: 2.2, portion: "1 bowl", g: 200, cat: "Indian Meat", tags: ["indian", "mutton", "protein"] },
  { id: 51, name: "Fish Curry (Bengali Style)", cal: 175, p: 19.5, c: 4.0, f: 9.0, fi: 0, na: 410, ca: 45, fe: 1.6, vd: 9.5, vb12: 2.1, portion: "1 bowl", g: 200, cat: "Indian Fish", tags: ["indian", "fish", "omega3"] },
  { id: 52, name: "Prawn Masala", cal: 170, p: 22.0, c: 5.0, f: 7.5, fi: 0.5, na: 510, ca: 55, fe: 2.0, vd: 4, vb12: 1.5, portion: "1 bowl", g: 180, cat: "Indian Fish", tags: ["indian", "seafood", "protein"] },

  // --- Western Eggs & Breakfast ---
  { id: 53, name: "Boiled Egg (Whole)", cal: 78, p: 6.3, c: 0.6, f: 5.3, fi: 0, na: 62, ca: 25, fe: 0.6, vd: 1.1, vb12: 0.6, portion: "1 egg", g: 50, cat: "Eggs", tags: ["egg", "protein", "keto"] },
  { id: 54, name: "Egg White", cal: 17, p: 3.6, c: 0.2, f: 0.1, fi: 0, na: 55, ca: 2, fe: 0.03, vd: 0, vb12: 0, portion: "1 white", g: 33, cat: "Eggs", tags: ["egg", "protein", "low-cal"] },
  { id: 55, name: "Scrambled Eggs (2 eggs)", cal: 182, p: 12.6, c: 1.2, f: 13.8, fi: 0, na: 183, ca: 60, fe: 1.2, vd: 2.2, vb12: 1.2, portion: "2 eggs", g: 100, cat: "Eggs", tags: ["egg", "protein", "breakfast"] },
  { id: 56, name: "Western Omelette", cal: 210, p: 14.0, c: 4.0, f: 15.0, fi: 0.6, na: 260, ca: 65, fe: 1.6, vd: 2.0, vb12: 1.1, portion: "1 serving", g: 130, cat: "Eggs", tags: ["egg", "protein", "breakfast"] },
  { id: 57, name: "Egg & Cheese Toast", cal: 280, p: 14.5, c: 26.0, f: 12.5, fi: 1.5, na: 480, ca: 160, fe: 1.8, vd: 1.1, vb12: 0.8, portion: "1 piece", g: 110, cat: "Eggs", tags: ["egg", "cheese", "toast"] },

  // --- Chicken, Turkey & Pork (Western) ---
  { id: 58, name: "Chicken Breast (Grilled)", cal: 165, p: 31.0, c: 0, f: 3.6, fi: 0, na: 74, ca: 15, fe: 0.9, vd: 0, vb12: 0.3, portion: "100g", g: 100, cat: "Poultry", tags: ["chicken", "protein", "lean", "keto"] },
  { id: 59, name: "Chicken Thigh (Skinless, baked)", cal: 185, p: 24.8, c: 0, f: 9.0, fi: 0, na: 84, ca: 12, fe: 1.1, vd: 0, vb12: 0.3, portion: "100g", g: 100, cat: "Poultry", tags: ["chicken", "protein"] },
  { id: 60, name: "Chicken Wings (Baked)", cal: 220, p: 22.0, c: 0, f: 15.0, fi: 0, na: 90, ca: 15, fe: 1.0, vd: 0, vb12: 0.3, portion: "3 wings", g: 100, cat: "Poultry", tags: ["chicken", "protein"] },
  { id: 61, name: "Turkey Breast (Sliced)", cal: 104, p: 17.0, c: 1.5, f: 2.0, fi: 0, na: 820, ca: 10, fe: 0.8, vd: 0, vb12: 0.4, portion: "100g", g: 100, cat: "Poultry", tags: ["turkey", "lean", "protein"] },
  { id: 62, name: "Pork Chop (Grilled)", cal: 210, p: 26.0, c: 0, f: 11.0, fi: 0, na: 65, ca: 8, fe: 0.9, vd: 0.1, vb12: 0.6, portion: "100g", g: 100, cat: "Meat", tags: ["pork", "protein"] },
  { id: 63, name: "Bacon (Pork, Crispy)", cal: 160, p: 12.0, c: 0.5, f: 12.0, fi: 0, na: 580, ca: 5, fe: 0.4, vd: 0.1, vb12: 0.3, portion: "3 strips", g: 30, cat: "Meat", tags: ["pork", "crispy", "fat", "keto"] },

  // --- Beef & Mutton (Western) ---
  { id: 64, name: "Ground Beef (90% Lean)", cal: 196, p: 21.9, c: 0, f: 11.8, fi: 0, na: 75, ca: 17, fe: 2.8, vd: 0, vb12: 2.5, portion: "100g", g: 100, cat: "Beef", tags: ["beef", "protein", "keto"] },
  { id: 65, name: "Ribeye Steak (Grilled)", cal: 290, p: 24.0, c: 0, f: 21.0, fi: 0, na: 60, ca: 12, fe: 2.5, vd: 0.1, vb12: 2.8, portion: "100g", g: 100, cat: "Beef", tags: ["beef", "protein", "keto"] },
  { id: 66, name: "Lamb Chop (Grilled)", cal: 260, p: 23.0, c: 0, f: 18.0, fi: 0, na: 70, ca: 10, fe: 2.8, vd: 0.1, vb12: 2.4, portion: "100g", g: 100, cat: "Meat", tags: ["lamb", "mutton", "protein"] },

  // --- Western Fish & Seafood ---
  { id: 67, name: "Salmon Fillet (Baked)", cal: 206, p: 28.2, c: 0, f: 9.5, fi: 0, na: 59, ca: 12, fe: 0.8, vd: 14.1, vb12: 3.2, portion: "100g", g: 100, cat: "Fish", tags: ["fish", "protein", "omega3", "healthy"] },
  { id: 68, name: "Tuna (Canned in Water)", cal: 116, p: 25.5, c: 0, f: 1.0, fi: 0, na: 350, ca: 10, fe: 1.2, vd: 4.5, vb12: 2.5, portion: "1 can", g: 120, cat: "Fish", tags: ["fish", "protein", "lean", "omega3"] },
  { id: 69, name: "Cod Fillet (Baked)", cal: 95, p: 20.0, c: 0, f: 1.0, fi: 0, na: 80, ca: 15, fe: 0.4, vd: 1.2, vb12: 1.0, portion: "100g", g: 100, cat: "Fish", tags: ["fish", "protein", "lean"] },
  { id: 70, name: "Shrimp (Boiled)", cal: 99, p: 21.3, c: 0.9, f: 0.9, fi: 0, na: 111, ca: 70, fe: 2.4, vd: 0, vb12: 1.2, portion: "100g", g: 100, cat: "Fish", tags: ["seafood", "protein", "lean"] },

  // --- Western Breads & Grains ---
  { id: 71, name: "White Bread Slices", cal: 150, p: 5.0, c: 28.0, f: 1.8, fi: 1.2, na: 290, ca: 130, fe: 1.8, vd: 0, vb12: 0, portion: "2 slices", g: 50, cat: "Bread", tags: ["bread", "grain"] },
  { id: 72, name: "Whole Wheat Bread Slices", cal: 138, p: 7.2, c: 24.0, f: 1.9, fi: 3.5, na: 220, ca: 40, fe: 1.4, vd: 0, vb12: 0, portion: "2 slices", g: 50, cat: "Bread", tags: ["bread", "grain", "healthy"] },
  { id: 73, name: "Sourdough Slice", cal: 110, p: 4.0, c: 22.0, f: 0.6, fi: 1.0, na: 230, ca: 12, fe: 1.0, vd: 0, vb12: 0, portion: "1 slice", g: 40, cat: "Bread", tags: ["bread", "sourdough"] },
  { id: 74, name: "English Muffin", cal: 130, p: 4.5, c: 25.0, f: 1.0, fi: 1.5, na: 220, ca: 80, fe: 1.2, vd: 0, vb12: 0, portion: "1 muffin", g: 57, cat: "Bread", tags: ["bread", "breakfast"] },

  // --- Western Cereals & Oats ---
  { id: 75, name: "Rolled Oats (Dry)", cal: 389, p: 16.9, c: 66.3, f: 6.9, fi: 10.6, na: 2, ca: 54, fe: 4.7, vd: 0, vb12: 0, portion: "100g", g: 100, cat: "Cereal", tags: ["oats", "grain", "fibre", "healthy"] },
  { id: 76, name: "Oatmeal with Milk", cal: 210, p: 9.0, c: 32.0, f: 5.0, fi: 4.5, na: 70, ca: 180, fe: 2.2, vd: 1.5, vb12: 0.6, portion: "1 bowl", g: 250, cat: "Cereal", tags: ["oats", "breakfast"] },
  { id: 77, name: "Corn Flakes", cal: 110, p: 2.0, c: 24.0, f: 0.3, fi: 0.8, na: 200, ca: 2, fe: 4.5, vd: 0, vb12: 0.8, portion: "1 cup", g: 30, cat: "Cereal", tags: ["cereal", "breakfast"] },
  { id: 78, name: "Granola (No Sugar)", cal: 220, p: 5.5, c: 31.0, f: 8.5, fi: 3.5, na: 120, ca: 30, fe: 1.8, vd: 0, vb12: 0, portion: "50g", g: 50, cat: "Cereal", tags: ["granola", "breakfast"] },

  // --- Salads & Vegetables ---
  { id: 79, name: "Spinach (Raw)", cal: 23, p: 2.9, c: 3.6, f: 0.4, fi: 2.2, na: 79, ca: 99, fe: 2.7, vd: 0, vb12: 0, portion: "100g", g: 100, cat: "Vegetable", tags: ["vegetable", "low-cal", "iron", "calcium"] },
  { id: 80, name: "Steamed Broccoli", cal: 55, p: 3.7, c: 11.2, f: 0.6, fi: 5.1, na: 33, ca: 47, fe: 0.7, vd: 0, vb12: 0, portion: "1 cup", g: 156, cat: "Vegetable", tags: ["vegetable", "low-cal", "fibre"] },
  { id: 81, name: "Raw Carrot", cal: 41, p: 0.9, c: 9.6, f: 0.2, fi: 2.8, na: 69, ca: 33, fe: 0.3, vd: 0, vb12: 0, portion: "1 medium", g: 100, cat: "Vegetable", tags: ["vegetable", "low-cal"] },
  { id: 82, name: "Sweet Potato (Baked)", cal: 115, p: 2.5, c: 26.5, f: 0.2, fi: 4.0, na: 45, ca: 48, fe: 0.9, vd: 0, vb12: 0, portion: "1 medium", g: 130, cat: "Vegetable", tags: ["vegetable", "carbs", "healthy"] },
  { id: 83, name: "White Potato (Boiled)", cal: 130, p: 3.0, c: 29.5, f: 0.2, fi: 2.5, na: 8, ca: 8, fe: 0.5, vd: 0, vb12: 0, portion: "1 medium", g: 150, cat: "Vegetable", tags: ["vegetable", "carbs"] },
  { id: 84, name: "Cucumber (With Peel)", cal: 15, p: 0.7, c: 3.6, f: 0.1, fi: 0.5, na: 2, ca: 16, fe: 0.3, vd: 0, vb12: 0, portion: "100g", g: 100, cat: "Vegetable", tags: ["vegetable", "low-cal", "hydrating"] },
  { id: 85, name: "Red Tomato", cal: 18, p: 0.9, c: 3.9, f: 0.2, fi: 1.2, na: 5, ca: 10, fe: 0.3, vd: 0, vb12: 0, portion: "1 medium", g: 100, cat: "Vegetable", tags: ["vegetable", "low-cal"] },
  { id: 86, name: "Red Bell Pepper", cal: 31, p: 1.0, c: 7.2, f: 0.3, fi: 2.1, na: 4, ca: 7, fe: 0.4, vd: 0, vb12: 0, portion: "1 medium", g: 120, cat: "Vegetable", tags: ["vegetable", "low-cal", "vitamin-c"] },
  { id: 87, name: "Mixed Green Salad", cal: 15, p: 1.0, c: 3.0, f: 0.2, fi: 1.5, na: 10, ca: 25, fe: 0.6, vd: 0, vb12: 0, portion: "1 large bowl", g: 100, cat: "Vegetable", tags: ["salad", "low-cal", "vegetable"] },
  { id: 88, name: "Greek Salad", cal: 190, p: 6.0, c: 10.0, f: 14.5, fi: 2.5, na: 610, ca: 150, fe: 1.1, vd: 0, vb12: 0.3, portion: "1 large bowl", g: 250, cat: "Vegetable", tags: ["salad", "feta", "mediterranean"] },

  // --- Fruits ---
  { id: 89, name: "Banana", cal: 89, p: 1.1, c: 22.8, f: 0.3, fi: 2.6, na: 1, ca: 5, fe: 0.3, vd: 0, vb12: 0, portion: "1 medium", g: 100, cat: "Fruit", tags: ["fruit", "carbs", "pre-workout"] },
  { id: 90, name: "Apple (With skin)", cal: 52, p: 0.3, c: 13.8, f: 0.2, fi: 2.4, na: 1, ca: 6, fe: 0.1, vd: 0, vb12: 0, portion: "1 medium", g: 150, cat: "Fruit", tags: ["fruit", "fibre", "low-cal"] },
  { id: 91, name: "Orange", cal: 47, p: 0.9, c: 11.7, f: 0.1, fi: 2.4, na: 0, ca: 40, fe: 0.1, vd: 0, vb12: 0, portion: "1 medium", g: 140, cat: "Fruit", tags: ["fruit", "vitamin-c"] },
  { id: 92, name: "Blueberries", cal: 57, p: 0.7, c: 14.5, f: 0.3, fi: 2.4, na: 1, ca: 6, fe: 0.3, vd: 0, vb12: 0, portion: "1 cup", g: 100, cat: "Fruit", tags: ["fruit", "antioxidant", "low-cal"] },
  { id: 93, name: "Avocado", cal: 160, p: 2.0, c: 8.5, f: 14.7, fi: 6.7, na: 7, ca: 12, fe: 0.6, vd: 0, vb12: 0, portion: "1/2 avocado", g: 100, cat: "Fruit", tags: ["fruit", "fat", "keto", "healthy-fat"] },
  { id: 94, name: "Watermelon Slice", cal: 85, p: 1.5, c: 21.0, f: 0.5, fi: 1.2, na: 3, ca: 20, fe: 0.6, vd: 0, vb12: 0, portion: "1 large slice", g: 280, cat: "Fruit", tags: ["fruit", "low-cal", "hydrating"] },

  // --- Supplements & Bars ---
  { id: 95, name: "Whey Protein Isolate", cal: 110, p: 25.0, c: 1.5, f: 0.5, fi: 0, na: 110, ca: 120, fe: 0.3, vd: 0, vb12: 0, portion: "1 scoop", g: 30, cat: "Supplement", tags: ["supplement", "protein", "post-workout"] },
  { id: 96, name: "Whey Protein Concentrate", cal: 130, p: 24.0, c: 4.5, f: 1.5, fi: 0, na: 115, ca: 130, fe: 0.3, vd: 0, vb12: 0, portion: "1 scoop", g: 33, cat: "Supplement", tags: ["supplement", "protein", "post-workout"] },
  { id: 97, name: "Casein Protein", cal: 120, p: 24.5, c: 3.0, f: 1.0, fi: 0, na: 130, ca: 600, fe: 0.2, vd: 0, vb12: 0, portion: "1 scoop", g: 34, cat: "Supplement", tags: ["supplement", "protein", "slow-digest", "night"] },
  { id: 98, name: "Creatine Monohydrate", cal: 0, p: 0, c: 0, f: 0, fi: 0, na: 0, ca: 0, fe: 0, vd: 0, vb12: 0, portion: "5g serving", g: 5, cat: "Supplement", tags: ["supplement", "creatine", "strength"] },
  { id: 99, name: "Protein Bar (Quest style)", cal: 200, p: 20.0, c: 23.0, f: 8.0, fi: 13.0, na: 220, ca: 100, fe: 1.0, vd: 0, vb12: 0, portion: "1 bar", g: 60, cat: "Supplement", tags: ["supplement", "protein", "bar"] },

  // --- Western Fast Food ---
  { id: 100, name: "Hamburger (Beef Patty)", cal: 295, p: 17.0, c: 24.0, f: 14.5, fi: 1.0, na: 510, ca: 50, fe: 2.5, vd: 0, vb12: 1.5, portion: "1 burger", g: 180, cat: "Fast Food", tags: ["fastfood", "burger", "beef"] },
  { id: 101, name: "Double Cheeseburger", cal: 440, p: 27.5, c: 26.0, f: 25.5, fi: 1.0, na: 860, ca: 200, fe: 3.5, vd: 0.5, vb12: 2.0, portion: "1 burger", g: 250, cat: "Fast Food", tags: ["fastfood", "burger", "beef", "cheese"] },
  { id: 102, name: "French Fries (Medium)", cal: 365, p: 4.5, c: 48.0, f: 17.5, fi: 4.0, na: 410, ca: 12, fe: 1.0, vd: 0, vb12: 0, portion: "1 medium", g: 117, cat: "Fast Food", tags: ["fastfood", "fries"] },
  { id: 103, name: "Pizza (Cheese, Slice)", cal: 272, p: 12.0, c: 33.6, f: 9.8, fi: 2.0, na: 551, ca: 188, fe: 1.7, vd: 0, vb12: 0.4, portion: "1 slice", g: 107, cat: "Fast Food", tags: ["fastfood", "pizza", "cheese"] },
  
  // --- Beverages ---
  { id: 104, name: "Black Coffee (Espresso)", cal: 5, p: 0.3, c: 0.8, f: 0.1, fi: 0, na: 14, ca: 5, fe: 0.2, vd: 0, vb12: 0, portion: "1 shot (30ml)", g: 30, cat: "Beverage", tags: ["coffee", "low-cal", "caffeine"] },
  { id: 105, name: "Whole Milk Cappuccino", cal: 80, p: 4.0, c: 8.0, f: 3.0, fi: 0, na: 60, ca: 120, fe: 0, vd: 1.0, vb12: 0.4, portion: "1 cup (180ml)", g: 180, cat: "Beverage", tags: ["coffee", "dairy", "caffeine"] },
  { id: 106, name: "Coconut Water", cal: 46, p: 1.7, c: 9.0, f: 0.5, fi: 2.6, na: 252, ca: 58, fe: 0.3, vd: 0, vb12: 0, portion: "1 cup (250ml)", g: 250, cat: "Beverage", tags: ["hydration", "electrolytes", "natural"] },
  { id: 107, name: "Sports Drink (Gatorade)", cal: 80, p: 0, c: 21.0, f: 0, fi: 0, na: 165, ca: 0, fe: 0, vd: 0, vb12: 0, portion: "500ml", g: 500, cat: "Beverage", tags: ["sports", "electrolytes", "carbs"] },
  { id: 108, name: "Beer (Can)", cal: 153, p: 1.3, c: 12.6, f: 0, fi: 0, na: 14, ca: 14, fe: 0.1, vd: 0, vb12: 0, portion: "1 can (330ml)", g: 330, cat: "Beverage", tags: ["alcohol", "beer"] },
  { id: 109, name: "Water", cal: 0, p: 0, c: 0, f: 0, fi: 0, na: 0, ca: 0, fe: 0, vd: 0, vb12: 0, portion: "1 glass", g: 250, cat: "Beverage", tags: ["water", "hydration", "zero-cal"] },
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
    fibre:    Math.round(food.fi * r * 10) / 10,
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
  "spaghetti":     [78,79],
  "guacamole":     [93],
  "burrito":       [110],
  "sandwich":      [108],
  "oatmeal":       [75,76],
  "espresso":      [104],
  "cappuccino":    [105],
  "beer glass":    [108],
  "strawberry":    [92],
  "pineapple":     [92],
  "cucumber":      [84],
  "mushroom":      [79],
  "bell pepper":   [86],
  "hen":           [58],
  "ice cream":     [43],
};

export default { FOOD_DB, searchFood, getFoodById, getFoodsByCategory, scaledNutrition, IMAGENET_TO_FOOD_MAP };
