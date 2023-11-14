import React, { useEffect, useState } from "react";
import "./Login.css";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [networkError, setNetworkError] = useState<string>("");
  const [formValid, setFormValid] = useState<boolean>(false);

  const fetchPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await axios
      .post(`https://backend/`, {
        username: email,
        password: password,
      })
      .then(function (res) {
        localStorage.setItem("accessToken", res.data.access);
        localStorage.setItem("refreshToken", res.data.refresh);
      })
      .catch(function (error) {
        setNetworkError("Ошибка авторизации");
      });
  };

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      setEmailError("Пожалуйста введите корректный email");
      return false;
    } else {
      setEmailError("");
      return true;
    }
  };

  const validatePassword = () => {
    if (password && password.length < 6) {
      setPasswordError("Пароль должен быть длинее 5 символов");
      return false;
    } else {
      setPasswordError("");
      return true;
    }
  };
  const handleSubmitValidate = () => {
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    if (isEmailValid && isPasswordValid) {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  };
  useEffect(() => {
    handleSubmitValidate();
  }, [email, password]);

  return (
    <div className="login-container">
      <h2>Авторизация</h2>
      <form
        onChange={handleSubmitValidate}
        onSubmit={fetchPost}
        className="login-form"
      >
        <input
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          type="text"
          placeholder="Введите адрес эл.почты"
          required
        />
        <p className="error">{emailError}</p>
        <input
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          type="password"
          placeholder="Введите пароль"
          required
        />
        <p className="error">{passwordError}</p>
        <button type="submit" disabled={!formValid}>
          Войти
        </button>
      </form>
      {networkError && <p className="error">{networkError}</p>}
      <div className="signup-link">
        У вас еще нет аккаунта? <a href="#">Зарегистрироваться</a>
      </div>
    </div>
  );
}
export default Login;
