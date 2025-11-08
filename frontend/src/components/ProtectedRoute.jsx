import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ requiredRole = null, children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.5rem',
        color: '#666'
      }}>
        <div>
          <span style={{ marginRight: '10px' }}>⏳</span>
          Cargando...
        </div>
      </div>
    );
  }

  // Si el usuario no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si se requiere un rol específico, verificar que el usuario lo tenga
  if (requiredRole) {
    const userRole = user?.rol?.toLowerCase() || '';
    const requiredRoleLower = requiredRole.toLowerCase();
    
    if (userRole !== requiredRoleLower) {
      toast.error('No tienes permiso para acceder a esta página');
      
      // Redirigir según el rol del usuario
      if (userRole === 'administrador') {
        return <Navigate to={`/admin`} replace />;
      } else {
        return <Navigate to="/" replace />;
      }
    }
  }

  // Si todo está bien, renderizar los hijos o el Outlet
  return children || <Outlet />;
};

export default ProtectedRoute;