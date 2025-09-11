const API_URL = "http://localhost:8000/api";

// Registrar usuario
export const registrarUsuario = async (data) => {
  const response = await fetch(`${API_URL}/registro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return response.json();
};

// Obtener nacionalidades
export const getNacionalidades = () =>
  fetch(`${API_URL}/usuario/nacionalidades`).then((res) => res.json());

// Obtener intereses
export const getIntereses = () =>
  fetch(`${API_URL}/usuario/intereses`).then((res) => res.json());

// Verificar email
export const checkEmail = (email) =>
  fetch(`${API_URL}/usuario/verificar-email/${email}`).then((res) => res.json());
