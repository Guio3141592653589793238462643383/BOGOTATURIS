import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import NavbarBase from "./NavbarBase";
import "../assets/css/Navbar.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Navbar = () => {
  const location = useLocation();

  return (
    <NavbarBase
      pathKey={location.pathname}
      onLogoClick={() => { /* sin acción para mantener la lógica actual */ }}
      showTitle={false}
      renderMenu={() => (
        <>
          <li className="nav-item">
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              <i className="bi bi-house-door"></i>
              Inicio
            </NavLink>
          </li>

          {location.pathname !== "/registro" && (
            <li className="nav-item">
              <NavLink
                to="/registro"
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              >
                <i className="bi bi-person-plus"></i>
                Registro
              </NavLink>
            </li>
          )}

          {location.pathname !== "/login" && (
            <li className="nav-item">
              <NavLink
                to="/login"
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              >
                <i className="bi bi-box-arrow-in-right"></i>
                Iniciar Sesión
              </NavLink>
            </li>
          )}
        </>
      )}
    />
  );
};

export default Navbar;