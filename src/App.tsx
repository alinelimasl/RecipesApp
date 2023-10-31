import './App.css';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Meals from './pages/Meals';
import FavoriteRecipes from './pages/FavoriteRecipes';
import Profile from './pages/Profile';
import DoneRecipes from './pages/DoneRecipes';
import Drinks from './pages/Drinks';
import RecipeInProgress from './pages/RecipeInProgress';
import ContextProvider from './Context/provider';
import RecipeDetails from './pages/RecipeDetails';
import Layout from './Components/Layout';

function App() {
  return (
    <ContextProvider>

      <Routes>
        <Route path="/" element={ <Login /> } />
        <Route path="/" element={ <Layout /> }>
          <Route path="meals" element={ <Meals /> } />
          <Route path="meals/:id" element={ <RecipeDetails /> } />
          <Route path="drinks" element={ <Drinks /> } />
          <Route path="drinks/:id" element={ <RecipeDetails /> } />
          <Route path="profile" element={ <Profile /> } />
          <Route path="done-recipes" element={ <DoneRecipes /> } />
          <Route path="favorite-recipes" element={ <FavoriteRecipes /> } />
          <Route
            path="/meals/:id/in-progress"
            element={ <RecipeInProgress /> }
          />
          <Route
            path="/drinks/:id/in-progress"
            element={ <RecipeInProgress /> }
          />
        </Route>
      </Routes>
    </ContextProvider>
  );
}

export default App;
