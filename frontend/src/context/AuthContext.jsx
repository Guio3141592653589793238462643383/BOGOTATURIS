import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");  // ✅ unificado
    const storedUserId = localStorage.getItem("usuario_id");
    const storedEmail = localStorage.getItem("user_email");

    if (storedToken && storedUserId) {
      setToken(storedToken);
      setUser({ id: parseInt(storedUserId, 10), email: storedEmail || null });
    }

    setIsLoading(false);
  }, []);

  // 🔑 Iniciar sesión
  const login = async (correo, password) => {
    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // 👇 Usa siempre las mismas keys
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("usuario_id", data.usuario_id);
        localStorage.setItem("user_email", data.usuario.correo);

        // 👇 Actualiza el estado en memoria
        setToken(data.access_token);
        setUser({ id: data.usuario_id, email: data.usuario.correo });

        // 🚀 Redirige a UserView
        navigate(`/usuario/${data.usuario_id}`);
        return true;
      } else {
        toast.error(data.message || "Error en el login");
        return false;
      }
    } catch (error) {
      toast.error("Error de conexión con el servidor");
      return false;
    }
  };

  // 🔒 Cerrar sesión
  const logout = () => {
    localStorage.removeItem("access_token"); // ✅ corregido
    localStorage.removeItem("usuario_id");
    localStorage.removeItem("user_email");
    setToken(null);
    setUser(null);
    navigate("/login", { replace: true });
  };

  // Estado de autenticación
  const isAuthenticated = !!token && !!user;

  const value = {
    user,
    token,
    isLoading,
    login,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personalizado
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};
