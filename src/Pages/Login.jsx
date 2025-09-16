import React from 'react';
import FormSignUp from './Registro';
const LoginPage = () => {
  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h1>Iniciar Sesión</h1>

        <form>
          <label htmlFor="email">Correo Electrónico *</label>
          <input
            type="email"
            id="email"
            placeholder="usuario@dominio.com"
            required
          />

          <label htmlFor="password">Contraseña *</label>
          <input
            type="password"
            id="password"
            placeholder="Mínimo 8 caracteres"
            required
            minLength={8}
          />

          <button type="submit">Iniciar Sesión </button>
        </form>

        <p className="register-link">
          ¿No tienes cuenta? <a href="./Registro">Regístrate aquí</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;