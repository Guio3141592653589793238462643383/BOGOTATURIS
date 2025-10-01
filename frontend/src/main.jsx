import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import './index.css';

// Componentes
import App from './App.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Páginas públicas
import Inicio from './Pages/Inicio';
import Login from './Pages/Login';
import Registro from './Pages/Registro';

// Páginas protegidas
import Dashboard from './Pages/Dashboard';
import Eventos from './Pages/EventosPage';
import Lugares from './Pages/LugaresPage';
import Perfil from './Pages/PerfilPage';
import UserView from './view/UserView';
import CrearComentario from './Pages/CreateComment';
import ConsultarLugar from './Pages/ConsultPlaces';
import CambiarPassword from './Pages/CambiarPassword';
import CambiarIntereses from './Pages/CambiarIntereses';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        {/* Layout principal con Navbar */}
        <Route element={<App />}>
          {/* Páginas públicas */}
          <Route path="/" element={<Inicio />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          {/* Páginas protegidas con Navbar */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/eventos" element={<Eventos />} />
            <Route path="/lugares" element={<Lugares />} />
            <Route path="/perfil" element={<Perfil />} />
          </Route>
        </Route>

        {/* Páginas protegidas SIN Navbar */}
        <Route element={<ProtectedRoute />}>
          <Route path="/usuario/:userId" element={<UserView />} />
          <Route path="/usuario/:userId/perfil" element={<Perfil />} />
          <Route path="/usuario/:userId/comentarios/nuevo" element={<CrearComentario />} />
          <Route path="/consultar-lugar/:lugarId" element={<ConsultarLugar />} />
          <Route path="/usuario/:userId/cambiar-password" element={<CambiarPassword />} />
          <Route path="/usuario/:userId/cambiar-intereses" element={<CambiarIntereses />} />
        </Route>

        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);
