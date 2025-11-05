import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import Logo from '../assets/img/BogotaTurisLogo.png';
import "../assets/css/Navbar.css";

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();

  return (     
    <header className="navbar">
      <div className="logo">   
        <img src={Logo} alt="Bogotá Turis Logo" />   
        <h1>BogotaTuris</h1> 
      </div>       
      <nav className="navbar-links">         
        <NavLink to="/" className={({ isActive }) => isActive ? "activo" : ""}>Inicio</NavLink>
        {!isAuthenticated ? (
          <>
            <NavLink to="/registro" className={({ isActive }) => isActive ? "activo" : ""}>Registro</NavLink>         
            <NavLink to="/login" className={({ isActive }) => isActive ? "activo" : ""}>Iniciar Sesión</NavLink>
          </>
        ) : (
          <>
            {user?.role === 'admin' && (
              <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? "activo" : ""}>Admin</NavLink>
            )}
            <button 
              onClick={logout} 
              className="logout-button"
            >
              Cerrar sesión
            </button>
          </>
        )}
      </nav>       
    </header>   
  ); 
};

export default Navbar;