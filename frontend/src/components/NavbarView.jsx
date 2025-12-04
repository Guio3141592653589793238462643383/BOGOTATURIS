import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import NavbarBase from "./NavbarBase";
import logoUser from "../assets/img/user.png";
import "../assets/css/Navbar.css";

export default function NavbarView({
  usuarioData,
  onRefreshUserData,
  showWelcome = true,
}) {
  const navigate = useNavigate();
  const { userId } = useParams();
  const location = useLocation();
  const usuarioId = userId || localStorage.getItem("usuario_id");
  const dropdownRef = useRef(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // ========================================
  // 2. HOOK PARA CERRAR DROPDOWN AL HACER CLIC FUERA
  // ========================================
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // ========================================
  // 3. HOOK PARA CERRAR MENÚS AL CAMBIAR DE RUTA
  // ========================================
  useEffect(() => {
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  // ========================================
  // FUNCIONES DE NAVEGACIÓN
  // ========================================
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
      navigate("/login", { replace: true });
    };
  };

  const handleInicio = () => {
    navigate(`/usuario/${usuarioId}`);
  };

  const handleMiCuenta = () => {
    navigate(`/usuario/${usuarioId}/perfil`);
  };

  const handleCambiarPassword = () => {
    navigate(`/usuario/${usuarioId}/cambiar-password`);
  };

  const handleCambiarIntereses = () => {
    navigate(`/usuario/${usuarioId}/cambiar-intereses`);
  };

  // ========================================
  // FUNCIONES DE UTILIDAD
  // ========================================
  const getNombreUsuario = () => {
    if (usuarioData?.primer_nombre) {
      return `${usuarioData.primer_nombre} ${
        usuarioData.primer_apellido || ""
      }`.trim();
    }
    return usuarioData?.correo || "Usuario";
  };

  // Determinar si "Inicio" está activo
  const isInicioActive = location.pathname === `/usuario/${usuarioId}`;

  // ========================================
  // RENDER
  // ========================================
  return (
    <NavbarBase
      pathKey={location.pathname}
      onLogoClick={handleInicio}
      renderMenu={({ isMobile, ensureMenuOpenOnMobile }) => (
        <>
          {!isInicioActive && (
            <li className="nav-item">
              <a
                className="nav-link"
                onClick={handleInicio}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleInicio();
                  }
                }}
              >
                <i className="bi bi-house-door me-2"></i>
                Inicio
              </a>
            </li>
          )}

          <li className="nav-item dropdown user-dropdown" ref={dropdownRef}>
            <button
              className="nav-link dropdown-toggle user-dropdown-btn"
              type="button"
              id="userDropdown"
              aria-haspopup="true"
              aria-expanded={isUserMenuOpen}
              aria-controls="userDropdownMenu"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (isMobile) ensureMenuOpenOnMobile();
                setIsUserMenuOpen((prev) => !prev);
              }}
            >
              <strong className="user-section">
                {showWelcome && "Bienvenido"} {getNombreUsuario()}
                <img src={logoUser} alt="Logo Usuario" className="user-logo" />
                <span className="user-dropdown-indicator">
                  {isUserMenuOpen ? "▴" : "▾"}
                </span>
              </strong>
            </button>

            <ul
              id="userDropdownMenu"
              className={`dropdown-menu enhanced-dropdown ${isUserMenuOpen ? 'show' : ''}`}
              aria-labelledby="userDropdown"
              role="menu"
            >
              <li>
                <a 
                  className="dropdown-item" 
                  onClick={handleMiCuenta}
                  role="button"
                  tabIndex={0}
                >
                  <i className="bi bi-person-circle me-2"></i> Mi Cuenta
                </a>
              </li>
              <li>
                <a 
                  className="dropdown-item" 
                  onClick={handleCambiarPassword}
                  role="button"
                  tabIndex={0}
                >
                  <i className="bi bi-key me-2"></i> Cambiar Contraseña
                </a>
              </li>
              <li>
                <a 
                  className="dropdown-item" 
                  onClick={handleCambiarIntereses}
                  role="button"
                  tabIndex={0}
                >
                  <i className="bi bi-heart me-2"></i> Cambiar Intereses
                </a>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li className="logout-item">
                <a 
                  className="dropdown-item" 
                  onClick={handleLogout}
                  role="button"
                  tabIndex={0}
                >
                  <i className="bi bi-box-arrow-right me-2"></i> Cerrar Sesión
                </a>
              </li>
            </ul>
          </li>
        </>
      )}
    />
  );
}