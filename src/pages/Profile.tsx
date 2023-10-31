import { Link, useNavigate } from 'react-router-dom';
import '../css/Profile.css';

function Profile() {
  const navigate = useNavigate();

  const emailData = localStorage.getItem('user');
  const userEmail = emailData ? JSON.parse(emailData).email : '';

  function handleLogout() {
    localStorage.clear();
    navigate('/');
  }

  return (
    <div className="profile-container">
      <span
        className="profile-email"
        data-testid="profile-email"
      >
        {' '}
        {userEmail}
        {' '}
      </span>
      <Link className="link" to="/done-recipes">
        <div
          className="profile-btn"
          data-testid="profile-done-btn"
        >
          <img src="done-recipesIcon.svg" alt="Done Recipes Icon" />
          <p>Done Recipes</p>
        </div>
      </Link>
      <Link className="link" to="/favorite-recipes">
        <div
          className="profile-btn"
          data-testid="profile-favorite-btn"
        >
          <img
            src="favorite-recipesIcon.svg"
            alt="Favorite Recipes Icon"
          />
          <p>Favorite Recipes</p>
        </div>
      </Link>
      <Link className="link" to="/">
        <button
          className="profile-btn"
          data-testid="profile-logout-btn"
          onClick={ handleLogout }
        >
          <img src="logoutIcon.svg" alt="Logout icon" />
          <p>Logout</p>
        </button>
      </Link>
    </div>
  );
}
export default Profile;
