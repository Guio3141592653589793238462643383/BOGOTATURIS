import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    const storedUserId = localStorage.getItem("usuario_id");
    const storedEmail = localStorage.getItem("user_email");
    const storedRole = localStorage.getItem("user_rol");

    if (storedToken && storedUserId) {
      setToken(storedToken);
      setUser({ 
        id: parseInt(storedUserId, 10), 
        email: storedEmail || null,
        rol: storedRole || 'usuario'  // Cambiado de 'role' a 'rol' para consistencia
      });
    }

    setIsLoading(false);
  }, []);

  const login = async (correo, clave) => {
    try {
      const response = await fetch("http://localhost:8000/api/usuario/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, clave }),
      });

      const data = await response.json();

      if (response.ok) {
        // Asegurarse de que el rol esté en minúsculas y tenga un valor por defecto
        const rolNormalizado = data.rol ? data.rol.toLowerCase() : 'usuario';
        const userId = data.usuario_id || data.id_usuario; // Asegurarse de obtener el ID del usuario
        
        if (!userId) {
          console.error('ID de usuario no encontrado en la respuesta del servidor');
          throw new Error('Error en la autenticación: ID de usuario no encontrado');
        }
        
        // Guardar en localStorage
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("usuario_id", userId);
        localStorage.setItem("user_email", correo); // Usar el correo proporcionado si no viene en la respuesta
        localStorage.setItem("user_rol", rolNormalizado);

        // Actualizar el estado
        setToken(data.access_token);
        const userData = { 
          id: userId, 
          email: correo,
          rol: rolNormalizado
        };
        setUser(userData);

        console.log('Usuario autenticado:', userData);
        return { 
          success: true, 
          user: userData,
          redirectTo: rolNormalizado === 'administrador' ? `/admin/${userId}` : `/usuario/${userId}`
        };
      } else {
        const errorMessage = data.detail || data.message || "Error en el inicio de sesión";
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error("Error en login:", error);
      toast.error("Error de conexión con el servidor");
      return { success: false, error: "Error de conexión con el servidor" };
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("usuario_id");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_rol"); // Corregido de user_role a user_rol
    setToken(null);
    setUser(null);
    navigate("/login", { replace: true });
  };

const isAuthenticated = !!token && !!user;

const value = {
  user,
  token,
  isLoading,
  isAuthenticated,
  login,
  logout,
};

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

export default AuthProvider;
