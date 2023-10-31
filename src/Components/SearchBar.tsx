import { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import fetchApi from '../utils/fetchApi';
import Context from '../Context/context';

const fetchLink = (baseUrl: string, searchRad: string, search: string) => {
  switch (searchRad) {
    case 'ingredient': {
      return `${baseUrl}filter.php?i=${search}`;
    }
    case 'name': {
      return `${baseUrl}search.php?s=${search}`;
    }
    default: {
      return `${baseUrl}search.php?f=${search}`;
    }
  }
};

function SearchBar() {
  const [form, setForm] = useState({
    search: '',
    searchRadio: '',
  });
  const { dataApi, setDataApi } = useContext(Context);
  const { search, searchRadio } = form;

  const location = useLocation();
  const path = location.pathname.replace(/^\/+/g, '');
  const navigate = useNavigate();

  const getApi = async (pathLink: string, link: string) => {
    if (search.length > 1 && searchRadio === 'first') {
      window.alert('Your search must have only 1 (one) character');
      return { [pathLink]: [] };
    } const data = await fetchApi(fetchLink(link, searchRadio, search));
    return data;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (path === 'meals') {
      const data = await getApi(path, 'https://www.themealdb.com/api/json/v1/1/');
      const { meals } = data;
      if (meals === null) {
        window.alert("Sorry, we haven't found any recipes for these filters.");
      } else if (meals.length === 1) {
        navigate(`/meals/${meals[0].idMeal}`);
      } else {
        const newMeals = meals.slice(0, 12);
        setDataApi({ ...dataApi, meals: newMeals });
      }
    } else if (path === 'drinks') {
      const data = await getApi(path, 'https://www.thecocktaildb.com/api/json/v1/1/');
      const { drinks } = data;
      if (drinks === null) {
        window.alert("Sorry, we haven't found any recipes for these filters.");
      } else if (drinks.length === 1) {
        navigate(`/drinks/${drinks[0].idDrink}`);
      } else {
        const newDrinks = drinks.slice(0, 12);
        setDataApi({ ...dataApi, drinks: newDrinks });
      }
    }
  };

  const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  return (
    <div className="search-input">
      <form onSubmit={ handleSubmit }>
        <input
          type="text"
          className="input-text"
          placeholder="Insert your text here"
          data-testid="search-input"
          name="search"
          value={ search }
          onChange={ handleChange }
        />
        <div className="inputs-search">
          <div className="custom-radio">
            <input
              className="input-radio"
              type="radio"
              name="searchRadio"
              value="ingredient"
              id="input-ingredient"
              data-testid="ingredient-search-radio"
              onChange={ handleChange }
            />
            <label htmlFor="input-ingredient">
              Ingredient
            </label>
            <input
              className="input-radio"
              type="radio"
              name="searchRadio"
              value="name"
              id="input-name"
              data-testid="name-search-radio"
              onChange={ handleChange }
            />
            <label htmlFor="input-name">
              Name
            </label>
            <input
              className="input-radio"
              type="radio"
              name="searchRadio"
              value="first"
              id="input-first"
              data-testid="first-letter-search-radio"
              onChange={ handleChange }
            />
            <label htmlFor="input-first">
              First letter
            </label>
          </div>
          <button
            type="submit"
            data-testid="exec-search-btn"
          >
            Filter
          </button>
        </div>
      </form>
    </div>

  );
}

export default SearchBar;
