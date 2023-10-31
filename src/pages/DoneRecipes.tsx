import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LocalStorageRecipesType } from '../Types/types';
import '../css/DoneRecipes.css';

function DoneRecipes() {
  const [isLinkCopied, setIsLinkCopied] = useState<string[]>([]);
  const [doneRecipes, setDoneRecipes] = useState<LocalStorageRecipesType[]>([]);

  useEffect(() => {
    if (localStorage.getItem('doneRecipes')) {
      const doneRecipesStorage = JSON.parse(localStorage
        .getItem('doneRecipes') as string);
      setDoneRecipes(doneRecipesStorage);
    }
  }, []);

  const handleShareButtonClick = (pathName: string, idValue: string) => {
    navigator.clipboard.writeText(`http://localhost:3000${pathName}`).then(
      () => {
        try {
          setIsLinkCopied([idValue]);
        } finally {
          setTimeout(() => {
            setIsLinkCopied([]);
          }, 1500);
        }
      },
    );
  };

  const handleFilterRecipe = (type: string) => {
    if (localStorage.getItem('doneRecipes')) {
      const doneRecipesStorage: LocalStorageRecipesType[] = JSON.parse(localStorage
        .getItem('doneRecipes') as string);
      if (type === 'meal' || type === 'drink') {
        const filteredRecipes = doneRecipesStorage
          .filter((recipe) => recipe.type === type);
        setDoneRecipes(filteredRecipes);
      } else {
        setDoneRecipes(doneRecipesStorage);
      }
    } else {
      setDoneRecipes([]);
    }
  };

  const transformDate = (date: string) => {
    const dataHora = new Date(date);
    const dia = String(dataHora.getDate()).padStart(2, '0');
    const mes = String(dataHora.getMonth() + 1).padStart(2, '0');
    const ano = dataHora.getFullYear();
    const horas = String(dataHora.getHours()).padStart(2, '0');
    const minutos = String(dataHora.getMinutes()).padStart(2, '0');
    const dataHoraFormatada = `${dia}/${mes}/${ano} - ${horas}:${minutos}`;
    return dataHoraFormatada;
  };

  return (
    <div className="done-recipes-container">
      <div className="btn-filters">
        <button
          data-testid="filter-by-all-btn"
          onClick={ () => handleFilterRecipe('all') }
        >
          <img src="allFilterDoneRecipes.svg" alt="all filter button" />
        </button>
        <button
          data-testid="filter-by-meal-btn"
          onClick={ () => handleFilterRecipe('meal') }
        >
          <img src="mealsFilterDoneRecipes.svg" alt="all filter button" />
        </button>
        <button
          data-testid="filter-by-drink-btn"
          onClick={ () => handleFilterRecipe('drink') }
        >
          <img src="drinksFilterDoneRecipes.svg" alt="all filter button" />
        </button>
      </div>
      {doneRecipes.map((recipe, index) => (
        <div key={ recipe.id } className="done-recipe-card">
          <div className="done-image-card">
            <Link to={ `/${recipe.type}s/${recipe.id}` }>
              <img
                src={ recipe.image }
                alt="imagem"
                data-testid={ `${index}-horizontal-image` }
              />
            </Link>
          </div>
          <div className="done-info-card">
            <div className="done-info-title">
              <Link to={ `/${recipe.type}s/${recipe.id}` }>
                <h2 data-testid={ `${index}-horizontal-name` }>{recipe.name}</h2>
              </Link>
              <button
                onClick={ () => handleShareButtonClick(
                  `/${recipe.type}s/${recipe.id}`,
                  recipe.id,
                ) }
              >
                <img
                  data-testid={ `${index}-horizontal-share-btn` }
                  src="shareIcon.svg"
                  alt="share button"
                />
              </button>
            </div>
            <div className="done-info-category">
              {recipe.type === 'meal' && (
                <p data-testid={ `${index}-horizontal-top-text` }>
                  {`${recipe.nationality} - ${recipe.category}`}
                </p>
              )}
              {recipe.type === 'drink' && (
                <p data-testid={ `${index}-horizontal-top-text` }>
                  {`${recipe.alcoholicOrNot}`}
                </p>
              )}
            </div>
            <p data-testid={ `${index}-horizontal-done-date` } className="done-date">
              {`Done in: ${transformDate(recipe.doneDate as string)}`}
            </p>
            {isLinkCopied.includes(recipe.id)
            && <p className="text-copied">Link copied!</p>}
            <div className="done-tags">
              {recipe.tags && recipe.tags.map((tag) => (
                <div className="done-tag" key={ tag }>
                  <p
                    data-testid={ `${index}-${tag}-horizontal-tag` }
                  >
                    {tag}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
export default DoneRecipes;
