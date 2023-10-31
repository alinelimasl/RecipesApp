import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LocalStorageRecipesType } from '../Types/types';

type PropsType = {
  path: string,
  idValue: string
  localStorageValue: LocalStorageRecipesType
};

function ShareAndFavoriteButton({ path,
  localStorageValue, idValue }: PropsType) {
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [isLinkCopied, setIsLinkCopied] = useState<string[]>([]);
  const handleShareButtonClick = (pathName: string) => {
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

  const handleFavoriteRecipeClick = (
    lunch: LocalStorageRecipesType,
  ) => {
    if (isFavorite) {
      setIsFavorite(false);
    } else {
      setIsFavorite(true);
    }
    const favoriteRecipeLocalStorage = localStorage.getItem('favoriteRecipes');
    if (favoriteRecipeLocalStorage) {
      if (JSON.parse(favoriteRecipeLocalStorage as string)
        .some((recipe: LocalStorageRecipesType) => recipe.id === lunch.id)) {
        const valueLocalStorage:LocalStorageRecipesType[] = JSON
          .parse(favoriteRecipeLocalStorage as string);
        localStorage.setItem('favoriteRecipes', JSON
          .stringify(valueLocalStorage.filter(({ id }) => id !== lunch.id)));
      } else {
        const valueLocalStorage = JSON.parse(favoriteRecipeLocalStorage);
        valueLocalStorage.push(lunch);
        localStorage.setItem('favoriteRecipes', JSON.stringify(valueLocalStorage));
      }
    } else {
      localStorage.setItem('favoriteRecipes', JSON.stringify([lunch]));
    }
  };

  useEffect(() => {
    if (localStorage.getItem('favoriteRecipes')) {
      const value: LocalStorageRecipesType[] = JSON.parse(localStorage
        .getItem('favoriteRecipes') as string);
      setIsFavorite(value.some((recipe) => recipe.id === idValue));
    }
  }, []);

  return (
    <>
      <button
        onClick={ () => handleFavoriteRecipeClick(localStorageValue) }
      >
        <img
          data-testid="favorite-btn"
          src={ isFavorite ? '/blackHeartIcon.svg'
            : '/whiteHeartIcon.svg' }
          alt="favorite button"
        />
      </button>
      <button
        onClick={ () => handleShareButtonClick(path) }
      >
        <img
          data-testid="share-btn"
          src="/shareIcon.svg"
          alt="share button"
        />
      </button>
      {isLinkCopied.includes(idValue) && <p className="text-copied">Link copied!</p>}
    </>
  );
}

export default ShareAndFavoriteButton;
