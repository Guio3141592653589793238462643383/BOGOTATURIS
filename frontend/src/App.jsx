import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';

function App() {
  const location = useLocation();
  const hideNavbarPaths = [
    '/login', 
    '/registro', 
    '/verificar-email',
    '/verificacion-exitosa',
    '/usuario',  // Oculta el Navbar en todas las rutas de usuario
    '/admin'     // Oculta el Navbar en todas las rutas de administrador
  ];
  const showNavbar = !hideNavbarPaths.some(path => location.pathname.startsWith(path));

  return (
    <div className="app-container">
      {showNavbar && <Navbar />}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default App;