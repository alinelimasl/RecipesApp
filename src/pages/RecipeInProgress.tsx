import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { DrinkType, DrinksType,
  LocalStorageRecipesType, MealType, MealsType } from '../Types/types';
import fetchApi from '../utils/fetchApi';
import Context from '../Context/context';
import ShareAndFavoriteButton from '../Components/ShareAndFavoriteButton';
import '../css/RecipesDetails.css';

function RecipeInProgress() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname.replace(/^\/+/g, '');
  const { dataApi, setDataApi } = useContext(Context);
  const [formInput, setFormInput] = useState<string[]>([]);
  const [localStorageValue, setLocalStorageValue] = useState<LocalStorageRecipesType>(
    {} as LocalStorageRecipesType,
  );

  useEffect(() => {
    const getApi = async () => {
      switch (location.pathname) {
        case `/meals/${id}/in-progress`: {
          const { meals }: MealsType = await fetchApi(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
          setDataApi(({ ...dataApi, meals }));
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
        }
      }
    };
    if (localStorage.getItem('inProgressRecipes')
    && JSON.parse(localStorage.getItem('inProgressRecipes') as string)[path.split('/')[0]]
    ) {
      const inProgressStorage = JSON.parse(localStorage
        .getItem('inProgressRecipes') as string);
      const idArray = Object.keys(inProgressStorage[path.split('/')[0]]);
      if (idArray.some((idValue) => idValue === id)) {
        setFormInput(inProgressStorage[path.split('/')[0]][`${id}`]);
      }
    }

    getApi();
  }, []);

  const handleChecked = (ingredient: string) => {
    const inProgressStorage = JSON.parse(localStorage
      .getItem('inProgressRecipes') as string);
    if (formInput.includes(ingredient)) {
      setFormInput(formInput.filter((ingredients) => ingredients !== ingredient));
      const setItemLocalStorage = {
        ...inProgressStorage,
        [path.split('/')[0]]: {
          [id as string]: formInput.filter((ingredients) => ingredients !== ingredient),
        },
      };
      localStorage.setItem('inProgressRecipes', JSON.stringify(setItemLocalStorage));
    } else {
      const setItemLocalStorage = {
        ...inProgressStorage,
        [path.split('/')[0]]: {
          [id as string]: [...formInput, ingredient],
        },
      };
      setFormInput((prevState) => [...prevState, ingredient]);
      localStorage.setItem('inProgressRecipes', JSON.stringify(setItemLocalStorage));
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

  const isDisabled = () => {
    const recipe: MealType | DrinkType = dataApi[path.split('/')[0] as string][0];
    const isValid = (formInput.length === getIngredients(recipe).length);
    return !isValid;
  };

  const handleFinishRecipe = () => {
    navigate('/done-recipes');
    const dateNow = new Date();
    const setItemLocalStorage = {
      ...localStorageValue,
      doneDate: dateNow.toISOString(),
      tags: dataApi[path.split('/')[0] as string][0].strTags
        ? dataApi[path.split('/')[0] as string][0].strTags
          .split(',').map((tag) => tag.trim()) : [],
    };
    if (localStorage.getItem('doneRecipes')) {
      const doneRecipes = JSON.parse(localStorage.getItem('doneRecipes') as string);
      localStorage.setItem('doneRecipes', JSON
        .stringify([...doneRecipes, setItemLocalStorage]));
    } else {
      localStorage.setItem('doneRecipes', JSON.stringify([setItemLocalStorage]));
    }
  };

  return (
    <>
      {dataApi.meals.map((meal) => (
        <div key={ meal.idMeal } className="details-container">
          <img
            data-testid="recipe-photo"
            src={ meal.strMealThumb }
            alt="recipe-imagem"
            className="details-img"
          />
          <div className="title-details">
            <h1 data-testid="recipe-title" className="title-recipe">{meal.strMeal}</h1>
          </div>
          <p data-testid="recipe-category" className="category-title">
            {meal.strCategory}
          </p>
          <h2>Ingredients</h2>
          <div className="ingredients-list">
            {getIngredients(meal).map((ingredient, index) => (
              <label
                key={ index }
                data-testid={ `${index}-ingredient-step` }
                style={ { textDecoration: formInput.includes(ingredient)
                  ? 'line-through' : 'none' } }
              >
                <p>
                  <input
                    type="checkbox"
                    name={ ingredient }
                    onClick={ () => handleChecked(ingredient) }
                    checked={ formInput.includes(ingredient) }
                  />
                  {ingredient}
                </p>
              </label>
            ))}
          </div>
          <h2>Instructions</h2>
          <div className="instructions">
            <p data-testid="instructions">{meal.strInstructions}</p>
          </div>
          <div className="share-and-button-details">
            <ShareAndFavoriteButton
              idValue={ meal.idMeal }
              localStorageValue={ localStorageValue }
              path={ `/meals/${id}` }
            />
          </div>
        </div>
      ))}
      {path.split('/')[0] === 'drinks' && dataApi.drinks
        .map((drink) => (
          <div key={ drink.idDrink } className="details-container">
            <img
              data-testid="recipe-photo"
              src={ drink.strDrinkThumb }
              alt="recipe-imagem"
              className="details-img"
            />
            <div className="title-details">
              <h1 data-testid="recipe-title">{drink.strDrink}</h1>
            </div>
            <p data-testid="recipe-category" className="category-title">
              {drink.strAlcoholic}
            </p>
            <h2>Ingredients</h2>
            <div className="ingredients-list">
              {getIngredients(drink).map((ingredient, index) => (
                <label
                  key={ index }
                  data-testid={ `${index}-ingredient-step` }
                  style={ { textDecoration: formInput.includes(ingredient)
                    ? 'line-through' : 'none' } }
                >
                  <p>
                    <input
                      type="checkbox"
                      name={ ingredient }
                      onClick={ () => handleChecked(ingredient) }
                      checked={ formInput.includes(ingredient) }
                    />
                    {ingredient}
                  </p>
                </label>
              ))}
            </div>
            <h2>Instructions</h2>
            <div className="instructions">
              <p data-testid="instructions">{drink.strInstructions}</p>
            </div>
            <div className="share-and-button-details">
              <ShareAndFavoriteButton
                idValue={ drink.idDrink }
                localStorageValue={ localStorageValue }
                path={ `/drinks/${id}` }
              />
            </div>
          </div>
        ))}
      {dataApi[path.split('/')[0]][0] && (
        <div className="start-btn">
          <button
            className="button-start"
            data-testid="finish-recipe-btn"
            disabled={ isDisabled() }
            onClick={ () => handleFinishRecipe() }
          >
            Finish Recipe
          </button>
        </div>
      )}
    </>
  );
}

export default RecipeInProgress;
