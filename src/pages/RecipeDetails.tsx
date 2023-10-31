import { useContext, useEffect, useState } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import fetchApi from '../utils/fetchApi';
import Context from '../Context/context';
import { DataApiType, DrinkType,
  DrinksType, LocalStorageRecipesType, MealType, MealsType } from '../Types/types';
import ShareAndFavoriteButton from '../Components/ShareAndFavoriteButton';
import Recommendations from '../Components/Recommendations';
import '../css/RecipesDetails.css';

function RecipeDetails() {
  const { id } = useParams();
  const location = useLocation();
  const path = location.pathname.replace(/^\/+/g, '');
  const { dataApi, setDataApi } = useContext(Context);
  const [recipe, setRecipe] = useState<'doneRecipes' | 'none' | 'inProgress'>('none');
  const [localStorageValue, setLocalStorageValue] = useState<LocalStorageRecipesType>(
    {} as LocalStorageRecipesType,
  );
  const [recommendations, setRecommendations] = useState<DataApiType>({} as DataApiType);

  useEffect(() => {
    const getApi = async () => {
      switch (path) {
        case `meals/${id}`: {
          const { meals }: MealsType = await fetchApi(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
          const meal = meals[0];
          const value = {
            id: meal.idMeal,
            type: 'meal',
            nationality: meal.strArea,
            category: meal.strCategory,
            alcoholicOrNot: '',
            name: meal.strMeal,
            image: meal.strMealThumb,
          };
          setLocalStorageValue(value);
          setDataApi(({ ...dataApi, meals }));
          const recommendation = await fetchApi('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=');
          setRecommendations((prevState) => ({ ...prevState,
            drinks: recommendation.drinks.slice(0, 6) }));
          break;
        }
        default: {
          const { drinks }: DrinksType = await fetchApi(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`);
          setDataApi(({ ...dataApi, drinks }));
          const drink = drinks[0];
          const value = {
            id: drink.idDrink,
            type: 'drink',
            nationality: '',
            category: drink.strCategory,
            alcoholicOrNot: drink.strAlcoholic,
            name: drink.strDrink,
            image: drink.strDrinkThumb,
          };
          setLocalStorageValue(value);
          const recommendation = await fetchApi('https://www.themealdb.com/api/json/v1/1/search.php?s=');
          setRecommendations((prevState) => ({ ...prevState,
            meals: recommendation.meals.slice(0, 6) }));
          break;
        }
      }
    };
    getApi();
    handleLocalStorage();
  }, []);

  const handleLocalStorage = () => {
    const inProgressLocalStorage = localStorage.getItem('inProgressRecipes');
    const doneRecipesStorage = localStorage.getItem('doneRecipes');
    if (inProgressLocalStorage) {
      const inProgressRecipes = JSON.parse(inProgressLocalStorage);
      if (inProgressRecipes[path.split('/')[0]]) {
        const inProgress = (Object.keys(inProgressRecipes[path.split('/')[0]])
          .some((idRecipe) => idRecipe === id)) ? 'inProgress' : 'none';
        setRecipe(inProgress);
      }
    } if (doneRecipesStorage) {
      const doneRecipes = JSON.parse(doneRecipesStorage);
      if (doneRecipes
        .some((recipeDone: LocalStorageRecipesType) => recipeDone.id === id)) {
        setRecipe('doneRecipes');
      }
    }
  };

  const getIngredients = (recipes: MealType | DrinkType) => {
    const ingredients: string[] = [];
    for (let index = 1; index <= 20; index++) {
      const ingredient = recipes[`strIngredient${index}`];
      const measure = recipes[`strMeasure${index}`];
      if (ingredient !== null && ingredient !== '' && ingredient !== undefined) {
        ingredients.push(`${measure} - ${ingredient}`);
      }
    }
    return ingredients;
  };

  return (
    <>
      {(path === `meals/${id}`)
      && dataApi.meals.map((meal) => (
        <div key={ meal.strMeal } className="details-container">
          <img
            src={ meal.strMealThumb }
            alt={ meal.strMeal }
            data-testid="recipe-photo"
            className="details-img"
          />
          <div className="title-details">
            <h1 className="title-recipe" data-testid="recipe-title">
              {meal.strMeal}
            </h1>
          </div>
          <p data-testid="recipe-category" className="category-title">
            {meal.strCategory}
          </p>
          <h2>Ingredients</h2>
          <div className="ingredients-list">
            <ul>
              {getIngredients(dataApi.meals[0]).map((ingredients, index) => (
                <li
                  data-testid={ `${index}-ingredient-name-and-measure` }
                  key={ index }
                >
                  {ingredients}
                </li>
              ))}
            </ul>
          </div>
          <h2>Instructions</h2>
          <div className="instructions">
            <p data-testid="instructions">{meal.strInstructions}</p>
          </div>
          {meal.strYoutube && (
            <iframe
              title="YouTube Video"
              data-testid="video"
              width="560"
              height="315"
              src={ `https://www.youtube.com/embed/${meal.strYoutube.split('v=')[1]}` }
              allowFullScreen
            />
          )}
          <div className="share-and-button-details">
            <ShareAndFavoriteButton
              localStorageValue={ localStorageValue }
              idValue={ meal.idMeal }
              path={ location.pathname }
            />
          </div>
          <div className="recommendation-container">
            {recommendations.drinks && recommendations.drinks.map((drink, index) => (
              <Recommendations
                key={ drink.idDrink }
                image={ drink.strDrinkThumb }
                index={ index }
                name={ drink.strDrink }
              />
            ))}
          </div>
        </div>
      ))}
      {(path === `drinks/${id}`)
      && dataApi.drinks.map((drink) => (
        <div key={ drink.strDrink } className="details-container">
          <img
            src={ drink.strDrinkThumb }
            alt={ drink.strDrink }
            data-testid="recipe-photo"
            className="details-img"
          />
          <div className="title-details">
            <h1
              data-testid="recipe-title"
              className="title-recipe"
            >
              {drink.strDrink}
            </h1>
          </div>
          <p data-testid="recipe-category" className="category-title">
            {drink.strAlcoholic}
          </p>
          <h2>Ingredients</h2>
          <div className="ingredients-list">
            <ul>
              {getIngredients(dataApi.drinks[0]).map((ingredients, index) => (
                <li
                  data-testid={ `${index}-ingredient-name-and-measure` }
                  key={ index }
                >
                  {ingredients}
                </li>
              ))}
            </ul>
          </div>
          <h2>Instructions</h2>
          <div className="instructions">
            <p data-testid="instructions">{drink.strInstructions}</p>
          </div>
          <div className="share-and-button-details">
            <ShareAndFavoriteButton
              localStorageValue={ localStorageValue }
              path={ location.pathname }
              idValue={ drink.idDrink }
            />
          </div>
          <div className="recommendation-container">
            {recommendations.meals && recommendations.meals.map((meal, index) => (
              <Recommendations
                key={ meal.idMeal }
                image={ meal.strMealThumb }
                index={ index }
                name={ meal.strMeal }
              />
            ))}
          </div>
        </div>
      ))}
      <Link to={ `/${path}/in-progress` } className="start-btn">
        <button data-testid="start-recipe-btn" className="button-start">
          {recipe === 'none' ? 'Start Recipe' : 'Continue Recipe'}
        </button>
      </Link>
    </>
  );
}

export default RecipeDetails;
