import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [randomMeals, setRandomMeals] = useState([]);
  const [cocktails, setCocktails] = useState([]);
  const [randomCocktail, setRandomCocktail] = useState(null);
  const [ingredients, setIngredients] = useState([]);
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

  useEffect(() => {
    const fetchRandomCocktail = async () => {
      const response = await fetch(
        "https://www.thecocktaildb.com/api/json/v1/1/random.php"
      );
      const data = await response.json();
      if (data.drinks) setRandomCocktail(data.drinks[0]);
    };

    fetchRandomCocktail();
  }, []);

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

  const handleViewIngredients = async (id) => {
    try {
      const response = await fetch(
        `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`
      );
      const data = await response.json();
      const cocktail = data.drinks[0];

      const ingredientsList = [];
      for (let i = 1; i <= 15; i++) {
        const ingredient = cocktail[`strIngredient${i}`];
        const measure = cocktail[`strMeasure${i}`];
        if (ingredient) {
          ingredientsList.push(`${ingredient} - ${measure}`);
        }
      }
      setIngredients(ingredientsList);
    } catch (error) {
      console.error("Error fetching ingredients:", error);
    }
  };

  return (
    <div className="main">
      {/* Header */}
      <header className="header">
        <div className="logo">All In 1</div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button onClick={fetchRecipes}>Search</button>
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
                      <div className="recipe-card" key={recipe.idMeal}>
                        <img src={recipe.strMealThumb} alt={recipe.strMeal} />
                        <h3>{recipe.strMeal}</h3>
                        <button
                          className="view-ingredients-btn"
                          onClick={() => handleViewIngredients(recipe.idMeal)}
                        >
                          View Ingredients
                        </button>
                        <a
                          href={recipe.strYoutube || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`watch-video-btn ${
                            recipe.strYoutube ? "" : "disabled"
                          }`}
                        >
                          Watch Video
                        </a>
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
                    <div className="recipe-card" key={meal.idMeal}>
                      <img src={meal.strMealThumb} alt={meal.strMeal} />
                      <h3>{meal.strMeal}</h3>
                      <button
                        className="view-ingredients-btn"
                        onClick={() => handleViewIngredients(meal.idMeal)}
                      >
                        View Ingredients
                      </button>
                      <a
                        href={meal.strYoutube || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`watch-video-btn ${
                          meal.strYoutube ? "" : "disabled"
                        }`}
                      >
                        Watch Video
                      </a>
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
            <section className="cocktail-section">
              <h2>Cocktail Recipes</h2>
              <div className="recipes-grid">
                {cocktails.length > 0 ? (
                  cocktails.map((cocktail) => (
                    <div className="recipe-card" key={cocktail.idDrink}>
                      <img src={cocktail.strDrinkThumb} alt={cocktail.strDrink} />
                      <h3>{cocktail.strDrink}</h3>
                      {/* Ingredients button */}
                      <button
                        className="view-ingredients-btn"
                        onClick={() => handleViewIngredients(cocktail.idDrink)}
                      >
                        View Ingredients
                      </button>
                    </div>
                  ))
                ) : (
                  <p>No cocktails found. Try searching for something else!</p>
                )}
              </div>
            </section>

            {/* Random Cocktail Section */}
            <section className="random-cocktail-section">
              <h2>Random Cocktail</h2>
              {randomCocktail && (
                <div className="recipe-card">
                  <img
                    src={randomCocktail.strDrinkThumb}
                    alt={randomCocktail.strDrink}
                  />
                  <h3>{randomCocktail.strDrink}</h3>
                  {/* Ingredients button */}
                  <button
                    className="view-ingredients-btn"
                    onClick={() => handleViewIngredients(randomCocktail.idDrink)}
                  >
                    View Ingredients
                  </button>
                </div>
              )}
            </section>
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
