import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import Logo from "../assets/img/BogotaTurisLogo.png";
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

  // Hook para cerrar dropdown al hacer click fuera y con tecla ESC
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        const dropdownMenu = dropdownRef.current.querySelector(".dropdown-menu");
        if (dropdownMenu && dropdownMenu.classList.contains("show")) {
          dropdownMenu.classList.remove("show");
        }
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        const dropdownMenu = dropdownRef.current?.querySelector(".dropdown-menu");
        if (dropdownMenu && dropdownMenu.classList.contains("show")) {
          dropdownMenu.classList.remove("show");
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
      navigate("/login", { replace: true });
    };
  };

  const handleInicio = () => navigate(`/usuario/${usuarioId}`);
  const handleMiCuenta = () => navigate(`/usuario/${usuarioId}/perfil`);
  const handleCambiarPassword = () =>
    navigate(`/usuario/${usuarioId}/cambiar-password`);
  const handleCambiarIntereses = () =>
    navigate(`/usuario/${usuarioId}/cambiar-intereses`);

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

  return (
    <nav className="nav">
      <div className="container1">
        <div
          className="logo"
          onClick={handleInicio}
          style={{ cursor: "pointer" }}
        >
          <img src={Logo} alt="BogotaTuris Logo" />
          <h1>BogotaTuris</h1>
        </div>

        <ul className="nav-links">
          {/* Solo mostrar "Inicio" si NO estamos en la página de inicio */}
          {!isInicioActive && (
            <li className="nav-item">
              <a
                className="nav-link"
                onClick={handleInicio}
                role="button"
                tabIndex={0}
              >
                <i className="bi bi-house-door me-2"></i>
                Inicio
              </a>
            </li>
          )}

          <li className="nav-item dropdown" ref={dropdownRef}>
            <button
              className="nav-link dropdown-toggle"
              type="button"
              id="userDropdown"
              aria-haspopup="true"
              aria-expanded="false"
              onClick={(e) => {
                e.preventDefault();
                const menu = e.currentTarget.nextElementSibling;
                if (menu) {
                  menu.classList.toggle("show");
                  e.currentTarget.setAttribute(
                    "aria-expanded",
                    menu.classList.contains("show")
                  );
                }
              }}
            >
              <strong className="user-section">
                {showWelcome && "Bienvenido"} {getNombreUsuario()}
                <img src={logoUser} alt="Logo Usuario" className="user-logo" />
              </strong>
            </button>

            <ul
              className="dropdown-menu enhanced-dropdown"
              aria-labelledby="userDropdown"
            >
              <li>
                <a className="dropdown-item" onClick={handleMiCuenta}>
                  <i className="bi bi-person-circle me-2"></i> Mi Cuenta
                </a>
              </li>
              <li>
                <a className="dropdown-item" onClick={handleCambiarPassword}>
                  <i className="bi bi-key me-2"></i> Cambiar Contraseña
                </a>
              </li>
              <li>
                <a className="dropdown-item" onClick={handleCambiarIntereses}>
                  <i className="bi bi-heart me-2"></i> Cambiar Intereses
                </a>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li className="logout-item">
                <a className="dropdown-item" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2"></i> Cerrar Sesión
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  );
}