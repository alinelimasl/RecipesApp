import { useLocation, Link } from 'react-router-dom';
import { useState } from 'react';
import { HeaderType } from '../Types/types';
import SearchBar from './SearchBar';
import '../css/Header.css';

function Header() {
  const [viewSearch, setViewSearch] = useState(false);

  const location = useLocation();
  const path = location.pathname.replace(/^\/+/g, '');
  const title = {
    meals: 'Meals',
    drinks: 'Drinks',
    'done-recipes': 'Done Recipes',
    'favorite-recipes': 'Favorite Recipes',
    profile: 'Profile',
  } as HeaderType;

  return (
    <>
      <header className="header">
        <Link to="/meals">
          <img src="/logo2.png" alt="logo-header" className="logo-header" />
        </Link>
        <div className="header-info">
          <h2>Recipes App</h2>
          {(path === 'meals' || path === 'drinks') && (
            <button type="button" onClick={ () => setViewSearch(!viewSearch) }>
              <img
                src="/searchIcon.svg"
                alt="Ícone de Busca"
                data-testid="search-top-btn"
              />
            </button>
          )}
          <Link
            to="/profile"
          >
            <img
              src="/profileHeaderIcon.svg"
              alt="Ícone de Perfil"
              data-testid="profile-top-btn"
            />
          </Link>
        </div>
      </header>
      {Object.keys(title).includes(path) && (
        <div className="title">
          <img
            src={ `/${path}Icon.svg` }
            alt="title-img"
            className="img-title"
          />
          <h1 data-testid="page-title">{title[path as string]}</h1>
        </div>
      )}
      {viewSearch && (path === 'meals' || path === 'drinks') && (
        <SearchBar />
      )}
    </>
  );
}

export default Header;
