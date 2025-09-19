import React from "react";
import { NavLink } from "react-router-dom";
import "../assets/css/Navbar.css";
import Dashboard from "../Pages/Dashboard";
import Inicio from "../Pages/Inicio";
import Logo from '../assets/img/BogotaTurisLogo.png';



const Navbar = () => {
  return (
    <header className="navbar">
<div className="logo">
  <img src={Logo} alt="Bogotá Turis Logo" />
  <h1>BogotaTuris</h1>
</div>
      <nav className="navbar-links">
        <NavLink to="/" className={({ isActive }) => isActive ? "activo" : ""}>Inicio</NavLink>
        <NavLink to="/registro" className={({ isActive }) => isActive ? "activo" : ""}>Registro</NavLink>
        <NavLink to="/login" className={({ isActive }) => isActive ? "activo" : ""}>Iniciar Sesión</NavLink>
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? "activo" : ""}>Dashboard</NavLink>
    
      </nav>
      <nav className="navbar-user">

      </nav>
    </header>
  );
};

export default Navbar;