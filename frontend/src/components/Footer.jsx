import React, { useState } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaTripadvisor } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import "../assets/css/Footer.css";

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      // Here you would typically send the email to your backend
      console.log('Subscribing email:', email);
      setSubscribed(true);
      setEmail('');
      // Reset subscription status after 3 seconds
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="text-white pt-12 pb-6" style={{ background: 'linear-gradient(to top right, #0f1a2e, #2a3f5f, #4a6ea9)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[#D9E1F1] mb-4">Bogotá Turis</h3>
            <p className="text-gray-300 text-sm !text-gray-300">
              Descubre la magia de Bogotá con nuestras experiencias únicas. Ofrecemos los mejores recorridos y actividades para que vivas la ciudad como nunca antes.
            </p>
            <div className="flex space-x-4 pt-2 ">
              <a href="#" className="text-gray-200 hover:text-white transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-200 hover:text-white transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-200 hover:text-white transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-200 hover:text-white transition-colors">
                <FaYoutube size={20} />
              </a>
              <a href="#" className="text-gray-200 hover:text-white transition-colors">
                <FaTripadvisor size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#D9E1F1]">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li><Link to="/tours" className="text-gray-300 hover:text-[#D9E1F1] transition-colors text-sm">Tours Disponibles</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">Sobre Nosotros</Link></li>
              <li><Link to="/gallery" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">Galería</Link></li>
              <li><Link to="/blog" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">Blog de Viajes</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">Contacto</Link></li>
              <li><Link to="/faq" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">Preguntas Frecuentes</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#D9E1F1]">Contáctanos</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FaMapMarkerAlt className="mt-1 mr-3 text-[#D9E1F1]" />
                <span className="text-gray-300 text-sm">Carrera 10 #25-90, Bogotá, Colombia</span>
              </li>
              <li className="flex items-center">
                <FaPhone className="mr-3 text-[#D9E1F1]" />
                <a href="tel:+571234567890" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">+57 123 456 7890</a>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-3 text-[#D9E1F1]" />
                <a href="mailto:info@bogotaturis.com" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">info@bogotaturis.com</a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#D9E1F1]">Boletín Informativo</h3>
            <p className="text-gray-300 text-sm mb-3">Suscríbete para recibir ofertas especiales y actualizaciones.</p>
            {subscribed ? (
              <div className="bg-green-600 text-white p-3 rounded text-sm">
                ¡Gracias por suscribirte! Pronto recibirás nuestras ofertas.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Tu correo electrónico"
                  className="w-full px-4 py-2 rounded bg-[#1a2b4a] border border-[#2a3f5f] focus:outline-none focus:ring-2 focus:ring-[#D9E1F1] text-sm text-white placeholder-gray-400"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-[#D9E1F1] hover:bg-white text-[#192338] font-medium py-2 px-4 rounded transition-colors text-sm"
                >
                  Suscribirse
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#2a3f5f] my-6"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <div className="mb-4 md:mb-0">
            &copy; {currentYear} Bogotá Turis. Todos los derechos reservados.
          </div>
          <div className="flex space-x-6">
            <Link to="/privacy" className="hover:text-[#D9E1F1] transition-colors">Política de Privacidad</Link>
            <Link to="/terms" className="hover:text-yellow-400 transition-colors">Términos y Condiciones</Link>
            <Link to="/sitemap" className="hover:text-yellow-400 transition-colors">Mapa del Sitio</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;