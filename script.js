const categoryURL = "https://www.themealdb.com/api/json/v1/1/categories.php";
    const searchURL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
    const filterURL = "https://www.themealdb.com/api/json/v1/1/filter.php?c=";
    const detailURL = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";

    const categoriesDiv = document.getElementById("categories");
    const mealsSection = document.getElementById("meal-section");
    const mealDetails = document.getElementById("meal-details");
    const menu = document.getElementById("menu");

    function toggleMenu() {
      menu.style.display = menu.style.display === "block" ? "none" : "block";
    }

    function createCategoryMenu(categories) {
      menu.innerHTML = `
        <div class="menu-close" onclick="toggleMenu()"><i class="fa-solid fa-xmark"></i></div>
        ${categories.map(cat =>
          `<a href="#" onclick="loadMealsByCategory('${cat.strCategory}')">${cat.strCategory}</a>`
        ).join("")}
      `;
    }

    async function loadCategories() {
      try {
        const res = await fetch(categoryURL);
        const data = await res.json();
        categoriesDiv.innerHTML = data.categories.map(cat => `
          <div class="category-card" onclick="loadMealsByCategory('${cat.strCategory}')">
            <img src="${cat.strCategoryThumb}" alt="${cat.strCategory}">
            <p>${cat.strCategory}</p>
          </div>
        `).join("");
        createCategoryMenu(data.categories);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    }

    function handleEnterKey(event) {
      if (event.key === 'Enter') {
        searchMeal();
      }
    }

    async function searchMeal() {
      const input = document.getElementById("searchInput").value.trim();
      if (!input) return;
      
      try {
        const res = await fetch(`${searchURL}${input}`);
        const data = await res.json();
        displayMeals(data.meals, `Search results for "${input}"`);
      } catch (error) {
        console.error('Error searching meals:', error);
      }
    }
    async function loadMealsByCategory(category) {
        try {
          const mealRes = await fetch(`${filterURL}${category}`);
          const mealData = await mealRes.json();
      
          const catRes = await fetch(categoryURL);
          const catData = await catRes.json();
          const selectedCategory = catData.categories.find(c => c.strCategory === category);
      
          
          const categoryDescription = `
            <div style="grid-column: 1/-1;">
              <h3 class="section-title">${selectedCategory.strCategory}</h3>
              <p style="margin-bottom: 1rem;">${selectedCategory.strCategoryDescription}</p>
            </div>
          `;
      
          displayMeals(mealData.meals, category, categoryDescription);
          menu.style.display = "none";
      
          document.getElementById('meal-section').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        } catch (error) {
          console.error('Error loading meals by category:', error);
        }
      }
      
      function displayMeals(meals, title = "Meals", extraContent = "") {
        mealDetails.style.display = "none";
      
        if (!meals) {
          mealsSection.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 2rem;">
              <h3 class="section-title">${title}</h3>
              <p>No meals found.</p>
            </div>
          `;
          return;
        }
      
        mealsSection.innerHTML = `
          ${extraContent}
          ${meals.map(meal => `
            <div class="meal-card" onclick="loadMealDetail('${meal.idMeal}')">
              <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
              <p>${meal.strMeal}</p>
            </div>
          `).join("")}
        `;
      }
      

    async function loadMealDetail(id) {
      try {
        const res = await fetch(`${detailURL}${id}`);
        const data = await res.json();
        const meal = data.meals[0];

        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
          const ing = meal[`strIngredient${i}`];
          const measure = meal[`strMeasure${i}`];
          if (ing && ing.trim()) {
            ingredients.push(`${measure ? measure.trim() : ''} ${ing.trim()}`.trim());
          }
        }

        
        mealsSection.innerHTML = "";
        mealDetails.style.display = "block";
        mealDetails.innerHTML = `
          <button class="back-btn" onclick="goBack()">
            <i class="fa-solid fa-arrow-left"></i> Back to Meals
          </button>
          <h2>${meal.strMeal}</h2>
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
          <div class="tags">
            <div class="tag"><strong>Category:</strong> ${meal.strCategory}</div>
            <div class="tag"><strong>Area:</strong> ${meal.strArea}</div>
            ${meal.strTags ? `<div class="tag"><strong>Tags:</strong> ${meal.strTags}</div>` : ""}
          </div>
          <h3>Ingredients</h3>
          <div class="ingredients">
            ${ingredients.map(ing => `<div class="tag">${ing}</div>`).join("")}
          </div>
          <h3>Instructions</h3>
          <div class="instructions">
            ${meal.strInstructions.split('\n').filter(p => p.trim()).map(p => `<p>${p}</p>`).join("")}
          </div>
        `;

        mealDetails.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      } catch (error) {
        console.error('Error loading meal details:', error);
      }
    }

    function goBack() {
      mealDetails.style.display = "none";
      loadCategories(); 
      
    
      document.querySelector('.categories-section').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }

    
    loadCategories();

    async function updateHeroBackgroundWithCategory() {
      try {
        const res = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
        const data = await res.json();
        const categories = data.categories;
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    
        const hero = document.querySelector('.hero');
        hero.style.background = `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${randomCategory.strCategoryThumb})`;
        hero.style.backgroundSize = "cover";
        hero.style.backgroundPosition = "center";
        hero.style.color = "white";
      } catch (error) {
        console.error("Failed to load hero background image from category:", error);
      }
    }

    updateHeroBackgroundWithCategory();

    

  
    
