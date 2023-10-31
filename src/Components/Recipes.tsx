import { useContext, useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import fetchApi from '../utils/fetchApi';
import { DrinkType, MealType } from '../Types/types';
import Context from '../Context/context';
import '../css/Recipes.css';

function Recipes() {
  const location = useLocation();
  const path = location.pathname.replace(/^\/+/g, '');
  const { dataApi, setDataApi } = useContext(Context);
  const [categories, setCategories] = useState([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  useEffect(() => {
    const getApi = async () => {
      switch (path) {
        case 'meals': {
          const data = await fetchApi('https://www.themealdb.com/api/json/v1/1/search.php?s=');
          setDataApi(({ ...dataApi, meals: data.meals.slice(0, 12) }));
          const categoriesData = await fetchApi('https://www.themealdb.com/api/json/v1/1/list.php?c=list');
          setCategories(categoriesData.meals.slice(0, 5));
          break;
        }
        default: {
          const data = await fetchApi('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=');
          setDataApi(({ ...dataApi, drinks: data.drinks.slice(0, 12) }));
          const categoriesData = await fetchApi('https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list');
          setCategories(categoriesData.drinks.slice(0, 5));
          break;
        }
      }
    };
    getApi();
  }, [path]);

  const handleFilterByCategory = async (category: string) => {
    if (selectedOption === category) {
      setSelectedOption(null);
      removeAllFilters();
    } else {
      setSelectedOption(category);
      if (path === 'meals') {
        const data = await fetchApi(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
        setDataApi({ ...dataApi, meals: data.meals.slice(0, 12) });
      } else if (path === 'drinks') {
        const data = await fetchApi(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${category}`);
        setDataApi({ ...dataApi, drinks: data.drinks.slice(0, 12) });
      }
    }
  };

  const imagesFilter = {
    Beef: '/src/images/beefFilter.svg',
    Breakfast: '/src/images/breakfastFilter.svg',
    Chicken: '/src/images/chickenFilter.svg',
    Dessert: '/src/images/dessertFilter.svg',
    Goat: '/src/images/goatFilter.svg',
    Cocktail: '/src/images/cocktailFilter.svg',
    'Ordinary Drink': '/src/images/ordinaryDrinkFilter.svg',
    Shake: '/src/images/shakeFilter.svg',
    'Other / Unknown': '/src/images/otherUnknownFilter.svg',
    Cocoa: '/src/images/cocoaFilter.svg',
  };

  const removeAllFilters = async () => {
    switch (path) {
      case 'meals': {
        const data = await fetchApi('https://www.themealdb.com/api/json/v1/1/search.php?s=');
        setDataApi(({ ...dataApi, meals: data.meals.slice(0, 12) }));
        break;
      }
      default: {
        const data = await fetchApi('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=');
        setDataApi(({ ...dataApi, drinks: data.drinks.slice(0, 12) }));
        break;
      }
    }
  };

  return (
    <div className="container">
      <div className="input-search">
        <button
          className="all-category-filter"
          data-testid="All-category-filter"
          onClick={ removeAllFilters }
        >
          <img
            src={ path === 'meals'
              ? '/src/images/allFilterIcon.svg' : '/src/images/allFilterIconDrink.svg' }
            alt="Filtro Icon All"
          />
        </button>
        {(path === 'meals' || path === 'drinks')
      && categories.map(({ strCategory }, index) => (
        <div className="radio-buttons" key={ strCategory }>
          <input
            id={ `input-category-${index}` }
            type="radio"
            name="categories"
            data-testid={ `${strCategory}-category-filter` }
            onChange={ () => handleFilterByCategory(strCategory) }
            checked={ selectedOption === strCategory }
          />
          <label htmlFor={ `input-category-${index}` }>
            <img src={ imagesFilter[strCategory] } alt="filter button" />
            {/* {strCategory} */}
          </label>
        </div>
      ))}
      </div>
      <div className="meals-drinks-container">
        {(path === 'meals')
          && dataApi.meals.length >= 1
          && (dataApi.meals as MealType[]).map((meal, index) => (
            <Link
              className="recipe-card"
              key={ meal.idMeal }
              to={ `/meals/${meal.idMeal}` }
            >
              <div
                data-testid={ `${index}-recipe-card` }
              >
                <img
                  className="recipe-img"
                  src={ meal.strMealThumb }
                  alt={ meal.strMeal }
                  data-testid={ `${index}-card-img` }
                />
                <p
                  className="recipe-name"
                  data-testid={ `${index}-card-name` }
                >
                  { meal.strMeal }
                </p>
              </div>
            </Link>
          ))}
      </div>
      <div className="meals-drinks-container">
        {(path === 'drinks') && dataApi.drinks.length >= 1
        && (dataApi.drinks as DrinkType[]).map((drink, index) => (
          <Link
            className="recipe-card"
            key={ drink.idDrink }
            to={ `/drinks/${drink.idDrink}` }
          >
            <div
              data-testid={ `${index}-recipe-card` }
            >
              <img
                className="recipe-img"
                src={ drink.strDrinkThumb }
                alt={ drink.strDrink }
                data-testid={ `${index}-card-img` }
              />
              <p
                className="recipe-name"
                data-testid={ `${index}-card-name` }
              >
                { drink.strDrink }
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Recipes;
