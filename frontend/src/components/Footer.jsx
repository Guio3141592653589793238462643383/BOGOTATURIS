import React, { useEffect } from "react";
import "../assets/css/Footer.css";

const Footer = () => {
  // Cargar la fuente Lobster Two
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Lobster+Two:ital,wght@0,400;0,700;1,400;1,700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <footer 
      className="bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 py-8 border-t border-white/50"
      style={{ fontFamily: "Lobster Two, cursive" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h3 
          className="text-xl sm:text-2xl font-bold text-purple-400 mb-2"
          style={{ fontFamily: "Lobster Two, cursive" }}
        >
          BogotáTuris
        </h3>
        <p 
          className="text-purple-300 text-sm sm:text-base"
          style={{ fontFamily: "Lobster Two, cursive" }}
        >
          © 2025 Todos los derechos reservados
        </p>
        <div className="mt-4 flex justify-center space-x-6">
          <a
            href="#"
            className="text-purple-300 hover:text-purple-400 transition-colors text-sm"
            style={{ fontFamily: "Lobster Two, cursive" }}
          >
            Política de Privacidad
          </a>
          <a
            href="#"
            className="text-purple-300 hover:text-purple-400 transition-colors text-sm"
            style={{ fontFamily: "Lobster Two, cursive" }}
          >
            Términos de Servicio
          </a>
          <a
            href="#"
            className="text-purple-300 hover:text-purple-400 transition-colors text-sm"
            style={{ fontFamily: "Lobster Two, cursive" }}
          >
            Contacto
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;