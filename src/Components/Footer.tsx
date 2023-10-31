import { Link, useLocation } from 'react-router-dom';
import '../css/Footer.css';

function Footer() {
  const location = useLocation();
  const path = location.pathname.replace(/^\/+/g, '');
  return (
    <footer
      className="footer"
      data-testid="footer"
    >
      {(path === 'meals' || path === 'drinks' || path === 'profile') && (
        <>
          <Link
            className="drinks-btn"
            to="/drinks"
          >
            <img
              src="footerDrinks.svg"
              alt="Drink Icon"
              data-testid="drinks-bottom-btn"
            />
          </Link>
          <Link
            className="meals-btn"
            to="/meals"
          >
            <img
              src="footerMeals.svg"
              alt="Meal Icon"
              data-testid="meals-bottom-btn"
            />
          </Link>
        </>
      )}
    </footer>
  );
}

export default Footer;
