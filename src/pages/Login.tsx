import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css';

export default function Login() {
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const navigate = useNavigate();

  const { email, password } = form;

  const handleChange = ({ target } : React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form,
      [target.name]: target.value,
    });
  };

  const isFormValid = () => {
    const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const resultado = regexEmail.test(email);
    return resultado && password.length > 6;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    localStorage.setItem('user', JSON.stringify({ email }));
    navigate('/meals');
  };

  if (loading) {
    return (
      <div className="initial-page">
        <img src="/src/images/logoPage.svg" alt="login-page" />
        <p>Recipes App</p>
      </div>
    );
  }

  return (
    <div className="container-login">
      <img src="/src/images/fotocomida.png" alt="tomato" className="food-login" />
      <div className="top-div">
        <img src="/src/images/logo.png" alt="imagem de fundo" />
      </div>
      <form onSubmit={ handleSubmit }>
        <h2 className="login-text">Login</h2>
        <input
          type="email"
          name="email"
          data-testid="email-input"
          onChange={ (e) => handleChange(e) }
        />
        <input
          type="password"
          name="password"
          data-testid="password-input"
          onChange={ handleChange }
        />
        <button
          type="submit"
          data-testid="login-submit-btn"
          disabled={ !isFormValid() }
        >
          Enter
        </button>
      </form>
    </div>
  );
}
