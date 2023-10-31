import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LocalStorageRecipesType } from '../Types/types';
import '../css/FavoriteRecipes.css';
import '../css/DoneRecipes.css';

function FavoriteRecipes() {
  const [isLinkCopied, setIsLinkCopied] = useState<string[]>([]);
  const [favoriteStore, setFavoriteStore] = useState<LocalStorageRecipesType[]>([]);
  useEffect(() => {
    if (localStorage.getItem('favoriteRecipes')) {
      const localStorageValue = JSON.parse(localStorage
        .getItem('favoriteRecipes') as string);
      setFavoriteStore(localStorageValue);
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
  const handleRemoveFavorite = (id: string) => {
    const favoriteRecipes = JSON.parse(localStorage
      .getItem('favoriteRecipes') as string);
    const filteredRecipes = favoriteRecipes
      .filter((recipe: LocalStorageRecipesType) => recipe.id !== id);
    localStorage.setItem('favoriteRecipes', JSON.stringify(filteredRecipes));
    setFavoriteStore(filteredRecipes);
  };

  const handleFilterFavorite = (type: string) => {
    if (localStorage.getItem('favoriteRecipes')) {
      const favoriteRecipesStorage: LocalStorageRecipesType[] = JSON.parse(localStorage
        .getItem('favoriteRecipes') as string);
      if (type === 'meal' || type === 'drink') {
        const filteredRecipes = favoriteRecipesStorage
          .filter((recipe) => recipe.type === type);
        setFavoriteStore(filteredRecipes);
      } else {
        setFavoriteStore(favoriteRecipesStorage);
      }
    } else {
      setFavoriteStore([]);
    }
  };

  return (
    <div className="favorite-recipes-container">
      <div className="btn-filters">
        <button
          onClick={ () => handleFilterFavorite('all') }
          data-testid="filter-by-all-btn"
        >
          <img src="allFilterDoneRecipes.svg" alt="all filter button" />
        </button>
        <button
          onClick={ () => handleFilterFavorite('meal') }
          data-testid="filter-by-meal-btn"
        >
          <img src="mealsFilterDoneRecipes.svg" alt="all filter button" />
        </button>
        <button
          onClick={ () => handleFilterFavorite('drink') }
          data-testid="filter-by-drink-btn"
        >
          <img src="drinksFilterDoneRecipes.svg" alt="all filter button" />
        </button>
      </div>

      {favoriteStore && favoriteStore.map((favorite, index) => (
        <div key={ index } className="favorite-recipe-card">
          <div className="favorite-image-card">
            <Link to={ `/${favorite.type}s/${favorite.id}` }>
              <img
                data-testid={ `${index}-horizontal-image` }
                src={ favorite.image }
                alt="imagem"
              />
            </Link>
          </div>
          <div className="favorite-info-card">
            <div className="favorite-info-title">
              <Link to={ `/${favorite.type}s/${favorite.id}` }>
                <h2 data-testid={ `${index}-horizontal-name` }>{favorite.name}</h2>
              </Link>
            </div>
            <div className="favorite-info-category">
              {favorite.type === 'meal' && (
                <p data-testid={ `${index}-horizontal-top-text` }>
                  {`${favorite.nationality} - ${favorite.category}`}
                </p>
              )}
              {favorite.type === 'drink' && (
                <p data-testid={ `${index}-horizontal-top-text` }>
                  {`${favorite.alcoholicOrNot}`}
                </p>
              )}
            </div>
            {isLinkCopied.includes(favorite.id)
              && <p className="text-copied">Link copied!</p>}
            <div className="share-favorite-div">
              <button
                className="share-favorite-button"
                onClick={ () => handleShareButtonClick(
                  `/${favorite.type}s/${favorite.id}`,
                  favorite.id,
                ) }
              >
                <img
                  data-testid={ `${index}-horizontal-share-btn` }
                  src="shareIcon.svg"
                  alt="share-button"
                />
              </button>
              <button
                className="share-favorite-button"
                onClick={ () => handleRemoveFavorite(favorite.id) }
              >
                <img
                  data-testid={ `${index}-horizontal-favorite-btn` }
                  src="blackHeartIcon.svg"
                  alt="favorite-button"
                />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
export default FavoriteRecipes;
