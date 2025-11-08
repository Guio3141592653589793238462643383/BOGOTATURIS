import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Componentes
import App from "./App.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Páginas públicas

import Inicio from './Pages/Inicio';
import Login from './Pages/Login';
import Registro from './Pages/Registro';
import VerificarEmail from './Pages/VerificarEmail';
import VerificacionExitosa from './Pages/VerificacionExitosa';
import SolicitarRestablecimiento from './Pages/SolicitarRestablecimiento';
import NuevaContrasena from './Pages/NuevaContrasena';



// Páginas protegidas
import Perfil from "./Pages/PerfilPage";
import UserView from "./view/UserView";
import AdminView from "./view/AdminView";
import CrearComentario from "./Pages/CreateComment";
import ConsultarLugar from "./Pages/ConsultPlaces";
import CambiarPassword from "./Pages/CambiarPassword";
import CambiarIntereses from "./Pages/CambiarIntereses";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ToastContainer position="top-right" autoClose={5000} />
        <Routes>
          <Route element={<App />}>
            {/* Rutas públicas */}
            <Route index element={<Inicio />} />
            <Route path="login" element={<Login />} />
            <Route path="registro" element={<Registro />} />
            <Route path="verificar-email" element={<VerificarEmail />} />
            <Route path="verificacion-exitosa" element={<VerificacionExitosa />} />
            <Route path="solicitar-restablecimiento" element={<SolicitarRestablecimiento />} />
            <Route path="nueva-contrasena" element={<NuevaContrasena />} />

            <Route
              path="verificacion-exitosa"
              element={<VerificacionExitosa />}
            />
>>>>>>> f6614fd (Subiendo gran parte de vista admini y usuario, faltando imagen y categoria)

            {/* Rutas protegidas para usuarios normales */}
            <Route element={<ProtectedRoute />}>
              <Route path="/usuario/:userId" element={<UserView />} />
              <Route path="/usuario/:userId/perfil" element={<Perfil />} />
              <Route
                path="/usuario/:userId/comentarios/nuevo"
                element={<CrearComentario />}
              />
              <Route
                path="/consultar-lugar/:lugarId"
                element={<ConsultarLugar />}
              />
              <Route
                path="/usuario/:userId/cambiar-password"
                element={<CambiarPassword />}
              />
              <Route
                path="/usuario/:userId/cambiar-intereses"
                element={<CambiarIntereses />}
              />
            </Route>

            {/* Ruta protegida solo para administradores */}
            <Route path="admin">
              <Route
                index
                element={
                  <ProtectedRoute requiredRole="administrador">
                    <AdminView />
                  </ProtectedRoute>
                }
              />
              <Route
                path=":userId"
                element={
                  <ProtectedRoute requiredRole="administrador">
                    <AdminView />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Ruta por defecto */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
