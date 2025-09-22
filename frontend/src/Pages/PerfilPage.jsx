
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Logo from "../assets/img/BogotaTurisLogo.png";
import logoUser from "../assets/img/user.png";
import "../assets/css/UserView.css";

export default function ProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const usuarioId = userId || localStorage.getItem("usuario_id");

  const [usuarioData, setUsuarioData] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    primer_nombre: "",
    segundo_nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    correo: "",
    id_nac: "", // Aquí guardas el id de la nacionalidad
  });
  // Estados para nacionalidades
  const [nacionalidades, setNacionalidades] = useState([]);
  const [loadingNacionalidades, setLoadingNacionalidades] = useState(false);

  useEffect(() => {
    if (!usuarioId) {
      navigate("/login");
      return;
    }

    const fetchUsuarioData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/usuario/perfil/${usuarioId}`
        );
        if (response.ok) {
          const data = await response.json();
          setUsuarioData(data); // 🔧 Agregar esta línea
          setFormData({
            primer_nombre: data.primer_nombre || "",
            segundo_nombre: data.segundo_nombre || "",
            primer_apellido: data.primer_apellido || "",
            segundo_apellido: data.segundo_apellido || "",
            correo: data.correo || "",
            id_nac: data.id_nac ? String(data.id_nac) : "", // Asegurar string para select
          });
        } else {
          alert("No se pudo cargar el perfil.");
        }
      } catch (error) {
        setError("Error de conexión con el servidor.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarioData();
  }, [usuarioId, navigate]);

  useEffect(() => {
    const fetchNacionalidades = async () => {
      setLoadingNacionalidades(true);
      try {
        const response = await fetch("http://localhost:8000/api/usuario/nacionalidades");
        if (response.ok) {
          const data = await response.json();
          setNacionalidades(data);
        } else {
          console.error("No se pudieron cargar las nacionalidades");
        }
      } catch (error) {
        console.error("Error al conectar con el servidor de nacionalidades");
      } finally {
        setLoadingNacionalidades(false);
      }
    };

    fetchNacionalidades();
  }, []);

  if (loading)
    return <h2 className="text-center mt-20">Cargando perfil...</h2>;
  if (error)
    return <h2 className="text-center mt-20 text-red-500">{error}</h2>;
  
  //Funciones de navegacion
  const handleCambiarPassword = () => {
    navigate(`/usuario/${usuarioId}/cambiar-password`);
  };
  
  const handleCambiarIntereses = () => {
    navigate(`/usuario/${usuarioId}/cambiar-intereses`);
  };

  // 🔧 FUNCIÓN ACTUALIZADA - La clave está aquí
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/api/usuario/perfil/${usuarioId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        // 🔧 1. Obtener los datos actualizados del servidor
        const updatedData = await response.json();
        
        // 🔧 2. Actualizar el estado local
        setUsuarioData(updatedData);
        
        // 🔧 3. Actualizar localStorage para sincronizar con UserView
        localStorage.setItem("usuarioData", JSON.stringify(updatedData));
        
        // 🔧 4. Disparar evento personalizado para notificar a UserView
        const event = new CustomEvent('userDataUpdated', {
          detail: updatedData
        });
        window.dispatchEvent(event);
        
        alert("Perfil actualizado exitosamente");
        
        // 🔧 5. Opcional: redirigir de vuelta al UserView
        // navigate(`/usuario/${usuarioId}`);
        
      } else {
        alert("Error al actualizar el perfil");
      }
    } catch (error) {
      console.error("Error al enviar datos:", error);
      alert("Error de conexión");
    }
  };

  return (
    <>
      <nav className="nav">
        <div className="container1">
          <div className="logo">
            <img src={Logo} alt="BogotaTuris Logo" />
            <h1>BogotaTuris</h1>
          </div>
          <ul className="nav-links">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="userDropdown"
                role="button"
              >
                <strong className="user-section">
                  {/* 🔧 Usar usuarioData actualizado */}
                  Bienvenido {usuarioData?.correo || formData.correo || "Usuario"}
                  <img
                    src={logoUser}
                    alt="Logo Usuario"
                    className="user-logo"
                  />
                </strong>
              </a>

              {/* Dropdown siempre en el DOM, pero oculto con CSS */}
              <ul className="dropdown-menu" aria-labelledby="userDropdown">
                <li>
                  <a className="dropdown-item" onClick={handleCambiarPassword}>
                    Cambiar Contraseña
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" onClick={handleCambiarIntereses}>
                    Cambiar Intereses
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 gap-12 px-4">

        {/* 📝 Formulario de edición */}
        <div className="form-container">
          <h2>Editar Información</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Primer Nombre</label>
              <input 
                type="text" 
                value={formData.primer_nombre} 
                onChange={(e) => setFormData({ ...formData, primer_nombre: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Segundo Nombre</label>
              <input 
                type="text" 
                value={formData.segundo_nombre || ""} 
                onChange={(e) => setFormData({ ...formData, segundo_nombre: e.target.value })} 
              />
            </div>
            <div className="form-group">
              <label>Primer Apellido</label>
              <input 
                type="text" 
                value={formData.primer_apellido} 
                onChange={(e) => setFormData({ ...formData, primer_apellido: e.target.value })} 
              />
            </div>
            <div className="form-group">
              <label>Segundo Apellido</label>
              <input 
                type="text" 
                value={formData.segundo_apellido || ""}  
                onChange={(e) => setFormData({ ...formData, segundo_apellido: e.target.value })} 
              />
            </div>
            <div className="form-group">
              <label>Correo</label>
              <input 
                type="email" 
                value={formData.correo} 
                onChange={(e) => setFormData({ ...formData, correo: e.target.value })} 
              />
            </div>
            <div className="form-group">
              <label>Nacionalidad</label>
              <select
                value={formData.id_nac}
                onChange={(e) => setFormData({ ...formData, id_nac: e.target.value })}
              >
                <option value="" disabled>
                  Selecciona una opción
                </option>
                {loadingNacionalidades ? (
                  <option value="">Cargando nacionalidades...</option>
                ) : (
                  nacionalidades.map((nac) => (
                    <option key={nac.id_nac} value={String(nac.id_nac)}>
                      {nac.nacionalidad}
                    </option>
                  ))
                )}
              </select>
            </div>

            <button type="submit">Guardar Cambios</button>
          </form>
        </div>

        {/* Card del perfil */}
        <div className="profile-card">
          <h2>Mi Perfil</h2>
          <div className="profile-info">
            <p><span>Nombre:</span> {formData.primer_nombre} {formData.segundo_nombre}</p>
            <p><span>Apellidos:</span> {formData.primer_apellido} {formData.segundo_apellido}</p>
            <p><span>Correo:</span> {formData.correo}</p>
            <p><span>Nacionalidad:</span> {
              nacionalidades.find(n => String(n.id_nac) === formData.id_nac)?.nacionalidad || "No disponible"
            }</p>
          </div>
        </div>
      </div>
    </>
  );
}