import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const VerificacionExitosa = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirigir al login después de 5 segundos
    const timer = setTimeout(() => {
      navigate('/login');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center p-8 bg-white rounded-lg shadow-md">
        <div className="flex justify-center">
          <FaCheckCircle className="text-green-500 text-6xl mb-4" />
        </div>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          ¡Verificación Exitosa!
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Tu correo electrónico ha sido verificado correctamente.
        </p>
        <p className="text-sm text-gray-500">
          Serás redirigido al inicio de sesión en unos segundos...
        </p>
        <div className="mt-6">
          <button
            onClick={() => navigate('/login')}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Ir al Inicio de Sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificacionExitosa;
