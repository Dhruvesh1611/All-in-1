import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [randomMeals, setRandomMeals] = useState([]);
  const [randomCocktails, setRandomCocktails] = useState([]);
  const [cocktails, setCocktails] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null); // Store the selected recipe for ingredients modal
  const [selectedType, setSelectedType] = useState("meals");

  // Fetch 9 random meals on initial load
  useEffect(() => {
    const fetchRandomMeals = async () => {
      const meals = [];
      for (let i = 0; i < 9; i++) {
        const response = await fetch(
          "https://www.themealdb.com/api/json/v1/1/random.php"
        );
        const data = await response.json();
        if (data.meals) meals.push(data.meals[0]);
      }
      setRandomMeals(meals);
    };

    fetchRandomMeals();
  }, []);

  // Fetch 9 random cocktails on initial load
  useEffect(() => {
    const fetchRandomCocktails = async () => {
      const cocktailsArr = [];
      for (let i = 0; i < 9; i++) {
        const response = await fetch(
          "https://www.thecocktaildb.com/api/json/v1/1/random.php"
        );
        const data = await response.json();
        if (data.drinks) cocktailsArr.push(data.drinks[0]);
      }
      setRandomCocktails(cocktailsArr);
    };

    fetchRandomCocktails();
  }, []);

  // Fetch Recipes for meals
  const fetchRecipes = async () => {
    if (!query.trim()) {
      alert("Please enter a search term.");
      return;
    }

    const apiURL = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;

    try {
      const response = await fetch(apiURL);
      const data = await response.json();
      setRecipes(data.meals || []);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  // Fetch Cocktails for search
  const fetchCocktails = async (query) => {
    const apiURL = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${query}`;

    try {
      const response = await fetch(apiURL);
      const data = await response.json();
      setCocktails(data.drinks || []);
    } catch (error) {
      console.error("Error fetching cocktails:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      fetchRecipes();
      fetchCocktails(query);
    }
  };

  const handleViewIngredients = async (id, type) => {
    try {
      let response;
      if (type === "meal") {
        response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        );
      } else {
        response = await fetch(
          `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`
        );
      }

      const data = await response.json();
      const item = type === "meal" ? data.meals[0] : data.drinks[0];

      const ingredientsList = [];
      for (let i = 1; i <= 15; i++) {
        const ingredient = item[`strIngredient${i}`];
        const measure = item[`strMeasure${i}`];
        if (ingredient) {
          ingredientsList.push(`${ingredient} - ${measure}`);
        }
      }
      setIngredients(ingredientsList);
      setSelectedRecipe(item); // Set the selected recipe for ingredient details
    } catch (error) {
      console.error("Error fetching ingredients:", error);
    }
  };

  return (
    <div className="main">
      {/* Header */}
      <header className={`header ${selectedType === 'cocktails' ? 'purple' : 'orange'}`}>
        <div className="logo">All In 1</div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button onClick={() => {
            fetchRecipes();
            fetchCocktails(query);
          }}>Search</button>
        </div>
      </header>

      {/* Navigation to switch between sections */}
      <div className="section-selector">
        <button onClick={() => setSelectedType("meals")}>Meals</button>
        <button onClick={() => setSelectedType("cocktails")}>Cocktails</button>
      </div>

      <div className="content-container">
        {selectedType === "meals" && (
          <>
            {/* Meals Section */}
            {query && (
              <section className="search-results-section">
                <h2>Search Results</h2>
                <div className="recipes-grid">
                  {recipes.length > 0 ? (
                    recipes.map((recipe) => (
                      <div
                        className="recipe-card"
                        key={recipe.idMeal}
                        onClick={() => handleViewIngredients(recipe.idMeal, "meal")}
                      >
                        <img src={recipe.strMealThumb} alt={recipe.strMeal} />
                        <h3>{recipe.strMeal}</h3>
                        {recipe.strYoutube && (
                          <a
                            href={recipe.strYoutube}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="watch-video-btn"
                          >
                            Watch Video
                          </a>
                        )}
                        {/* View Ingredients Button */}
                        <button onClick={() => handleViewIngredients(recipe.idMeal, "meal")}>
                          View Ingredients
                        </button>
                      </div>
                    ))
                  ) : (
                    <p>No recipes found. Try searching for something else!</p>
                  )}
                </div>
              </section>
            )}

            {/* Random Meals Section */}
            {!query && (
              <section className="random-meals-section">
                <h2>Random Meals</h2>
                <div className="recipes-grid">
                  {randomMeals.map((meal) => (
                    <div
                      className="recipe-card"
                      key={meal.idMeal}
                      onClick={() => handleViewIngredients(meal.idMeal, "meal")}
                    >
                      <img src={meal.strMealThumb} alt={meal.strMeal} />
                      <h3>{meal.strMeal}</h3>
                      {meal.strYoutube && (
                        <a
                          href={meal.strYoutube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="watch-video-btn"
                        >
                          Watch Video
                        </a>
                      )}
                      {/* View Ingredients Button */}
                      <button onClick={() => handleViewIngredients(meal.idMeal, "meal")}>
                        View Ingredients
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {selectedType === "cocktails" && (
          <>
            {/* Cocktails Section */}
            {query && (
              <section className="search-results-section">
                <h2>Search Results</h2>
                <div className="recipes-grid">
                  {cocktails.length > 0 ? (
                    cocktails.map((cocktail) => (
                      <div
                        className="recipe-card"
                        key={cocktail.idDrink}
                        onClick={() => handleViewIngredients(cocktail.idDrink, "cocktail")}
                      >
                        <img
                          src={cocktail.strDrinkThumb}
                          alt={cocktail.strDrink}
                        />
                        <h3>{cocktail.strDrink}</h3>
                        {cocktail.strVideo && (
                          <a
                            href={cocktail.strVideo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="watch-video-btn"
                          >
                            Watch Video
                          </a>
                        )}
                        {/* View Ingredients Button */}
                        <button onClick={() => handleViewIngredients(cocktail.idDrink, "cocktail")}>
                          View Ingredients
                        </button>
                      </div>
                    ))
                  ) : (
                    <p>No cocktails found. Try searching for something else!</p>
                  )}
                </div>
              </section>
            )}

            {/* Random Cocktail Section */}
            {!query && (
              <section className="random-cocktail-section">
                <h2>Random Cocktails</h2>
                <div className="recipes-grid">
                  {randomCocktails.map((cocktail) => (
                    <div
                      className="recipe-card"
                      key={cocktail.idDrink}
                      onClick={() => handleViewIngredients(cocktail.idDrink, "cocktail")}
                    >
                      <img
                        src={cocktail.strDrinkThumb}
                        alt={cocktail.strDrink}
                      />
                      <h3>{cocktail.strDrink}</h3>
                      {cocktail.strVideo && (
                        <a
                          href={cocktail.strVideo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="watch-video-btn"
                        >
                          Watch Video
                        </a>
                      )}
                      {/* View Ingredients Button */}
                      <button onClick={() => handleViewIngredients(cocktail.idDrink, "cocktail")}>
                        View Ingredients
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>

      {/* Ingredients Modal */}
      {ingredients.length > 0 && (
        <div className="ingredients-modal">
          <h2>Ingredients</h2>
          <ul>
            {ingredients.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <button onClick={() => setIngredients([])}>Close</button>
        </div>
      )}
    </div>
  );
};

export default App;
