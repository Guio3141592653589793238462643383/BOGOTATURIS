import React, { useEffect, useState, useMemo } from "react";
import Logo from "../assets/img/BogotaTurisLogo.png";
import "../assets/css/Navbar.css";

/**
 * NavbarBase
 * - Provee estructura, botón hamburguesa y contenedor de menú responsive.
 * - No define items; los recibe vía render prop `renderMenu(helpers)`.
 * - Cierra el menú móvil cuando cambia `pathKey`.
 * - Aplica body.no-scroll cuando el menú móvil está abierto en móviles.
 *
 * Props:
 * - pathKey: string (p. ej., location.pathname) para cerrar en cambios de ruta
 * - onLogoClick: () => void
 * - showTitle?: boolean (default true)
 * - title?: string (default 'BogotaTuris')
 * - renderMenu: ({ isMobile, isMobileMenuOpen, toggleMobileMenu, ensureMenuOpenOnMobile, closeMenu }) => ReactNode
 */
export default function NavbarBase({
  pathKey,
  onLogoClick,
  renderMenu,
  showTitle = true,
  title = "BogotaTuris",
}) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 968);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 968;
      setIsMobile(mobile);
      if (!mobile) setIsMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Cerrar al cambiar pathKey
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathKey]);

  // Bloquear scroll de fondo cuando abre menú en móvil
  useEffect(() => {
    if (isMobile && isMobileMenuOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
    return () => document.body.classList.remove("no-scroll");
  }, [isMobile, isMobileMenuOpen]);

  const toggleMobileMenu = () => setIsMobileMenuOpen((v) => !v);
  const ensureMenuOpenOnMobile = () => {
    if (isMobile && !isMobileMenuOpen) setIsMobileMenuOpen(true);
  };
  const closeMenu = () => setIsMobileMenuOpen(false);

  const helpers = useMemo(
    () => ({ isMobile, isMobileMenuOpen, toggleMobileMenu, ensureMenuOpenOnMobile, closeMenu }),
    [isMobile, isMobileMenuOpen]
  );

  return (
    <nav className="nav">
      <div className="container1">
        <div className="logo" onClick={onLogoClick} style={{ cursor: "pointer" }}>
          <img src={Logo} alt="BogotaTuris Logo" />
          {showTitle && <h1>{title}</h1>}
        </div>

        {isMobile && (
          <button
            className={`hamburger-btn ${isMobileMenuOpen ? "open" : ""}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        )}

        <ul className={`nav-links ${isMobile && isMobileMenuOpen ? "mobile-menu-open" : ""}`}>
          {typeof renderMenu === "function" ? renderMenu(helpers) : null}
        </ul>
      </div>
    </nav>
  );
}
