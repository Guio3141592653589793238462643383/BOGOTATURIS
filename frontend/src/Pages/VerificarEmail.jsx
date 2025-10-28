import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/css/VerificarEmail.css';

export default function VerificarEmail() {
  const [searchParams] = useSearchParams();
  const [estado, setEstado] = useState('verificando'); // verificando, exito, error
  const [mensaje, setMensaje] = useState('');
  const [yaVerificado, setYaVerificado] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setEstado('error');
      setMensaje('Token no válido o no proporcionado');
      return;
    }
    
    verificarToken(token);
  }, [searchParams]);
  
  const verificarToken = async (token) => {
    try {
      const response = await axios.post('http://localhost:8000/api/verificacion/verificar-email', {
        token
      });
      
      setEstado('exito');
      setMensaje(response.data.message);
      setYaVerificado(response.data.ya_verificado);
      
      // NO redirigir automáticamente, dejar que el usuario elija
      // El usuario puede hacer clic en "Ir al Login Ahora" cuando esté listo
    } catch (error) {
      setEstado('error');
      setMensaje(error.response?.data?.detail || 'Error al verificar email');
    }
  };
  
  const handleReenviar = async () => {
    const email = prompt('Ingresa tu correo electrónico:');
    if (!email) return;
    
    try {
      const response = await axios.post('http://localhost:8000/api/verificacion/reenviar-verificacion', {
        email
      });
      
      alert(response.data.message);
    } catch (error) {
      alert(error.response?.data?.detail || 'Error al reenviar email');
    }
  };
  
  return (
    <div className="verificar-email-container">
      <div className="verificar-email-card">
        {estado === 'verificando' && (
          <div className="verificar-content">
            <div className="spinner-large"></div>
            <h2>⏳ Verificando tu email...</h2>
            <p>Por favor espera un momento mientras validamos tu cuenta</p>
          </div>
        )}
        
        {estado === 'exito' && (
          <div className="verificar-content exito">
            <div className="icon-success">✅</div>
            <h2>¡Email Verificado!</h2>
            <p className="mensaje-principal">{mensaje}</p>
            {yaVerificado && (
              <p className="mensaje-secundario">Tu email ya estaba verificado anteriormente</p>
            )}
            <p className="redireccion">Ahora puedes iniciar sesión con tu cuenta</p>
            <button 
              className="btn-primary"
              onClick={() => navigate('/login')}
            >
              Ir al Login
            </button>
          </div>
        )}
        
        {estado === 'error' && (
          <div className="verificar-content error">
            <div className="icon-error">❌</div>
            <h2>Error de Verificación</h2>
            <p className="mensaje-error">{mensaje}</p>
            
            <div className="acciones-error">
              <button 
                className="btn-primary"
                onClick={handleReenviar}
              >
                📧 Reenviar Email de Verificación
              </button>
              
              <button 
                className="btn-secondary"
                onClick={() => navigate('/login')}
              >
                Ir al Login
              </button>
              
              <button 
                className="btn-secondary"
                onClick={() => navigate('/registro')}
              >
                Volver al Registro
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
