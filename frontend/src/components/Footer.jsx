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
      className="py-2 sm:py-3 border-t border-white/20 shadow-[0_-8px_32px_rgba(0,0,0,0.2)]"
      style={{ 
        fontFamily: 'Poppins, sans-serif',
        background: 'linear-gradient(to top right, #192338, #395886, #628ECB)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Línea decorativa superior */}
        <div 
          className="w-20 h-1 mx-auto mb-2 sm:mb-3 rounded-full"
          style={{
            background: 'linear-gradient(90deg, transparent, #8FB3E2, transparent)',
            boxShadow: '0 0 10px rgba(143, 179, 226, 0.5)'
          }}
        />
        
        <h3 
          className="text-base sm:text-lg font-bold mb-1 transition-transform hover:scale-105 cursor-default"
          style={{ 
            fontFamily: 'Montserrat, sans-serif',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #8FB3E2 50%, #628ECB 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3))'
          }}
        >
          BogotaTuris
        </h3>
        
        <p 
          className="text-[0.7rem] sm:text-xs mb-2 sm:mb-3 opacity-90"
          style={{ 
            fontFamily: 'Poppins, sans-serif',
            color: '#D9E1F1'
          }}
        >
          2025 Todos los derechos reservados
        </p>
        
      </div>
    </footer>
  );
};

export default Footer;