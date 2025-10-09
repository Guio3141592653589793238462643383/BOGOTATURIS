import { useEffect, useState } from "react";
import Logo from "../assets/img/BogotaTurisLogo.png";
import { useParams, useNavigate } from "react-router-dom";
import logoUser from "../assets/img/user.png";
import "../assets/css/UserView.css";

export default function CambiarIntereses() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const usuarioId = userId || localStorage.getItem("usuario_id");
  const [usuarioData, setUsuarioData] = useState(null);
  const [error, setError] = useState(null);
  const [interesesDisponibles, setInteresesDisponibles] = useState([]);
  const [interesesUsuario, setInteresesUsuario] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  // Simulación: cargar intereses desde API
  useEffect(() => {
  const fetchIntereses = async () => {
    try {
      const resIntereses = await fetch("http://localhost:8000/api/usuario/intereses");
      const dataIntereses = await resIntereses.json();

      const resUsuario = await fetch(`http://localhost:8000/api/usuario/intereses/${usuarioId}`);
      const dataUsuario = await resUsuario.json();

      setInteresesDisponibles(dataIntereses);
      setInteresesUsuario(dataUsuario);
    } catch (error) {
      console.error("Error cargando intereses:", error);
    } finally {
      setLoading(false);
    }
  };

  if (usuarioId) {
    fetchIntereses();
  }
}, [usuarioId]);

  // Manejo de toggle (añadir o quitar intereses seleccionados)
  const handleToggle = (interesId) => {
    setInteresesUsuario((prev) =>
      prev.includes(interesId)
        ? prev.filter((id) => id !== interesId)
        : [...prev, interesId]
    );
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Actualizar intereses del usuario
      const res = await fetch(`http://localhost:8000/api/usuario/actualizar-intereses/${usuarioId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ intereses: interesesUsuario }),
        }
      );

      if (res.ok) {
        setMensaje("✅ Intereses actualizados correctamente");
      } else {
        const errorData = await res.json();
        setMensaje(`❌ ${errorData.detail || "Error al actualizar intereses"}`);
      }
    } catch {
      setMensaje("❌ Error de conexión con el servidor");
    }
  };

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
          setUsuarioData(data);
        } else {
          setError("No se pudo cargar el perfil.");
        }
      } catch (error) {
        setError("Error de conexión con el servidor.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarioData();
  }, [usuarioId, navigate]);

  if (loading) return <h2 className="text-center mt-20">Cargando perfil...</h2>;
  if (error) return <h2 className="text-center mt-20 text-red-500">{error}</h2>;
  if (!interesesDisponibles.length);

  // Dividir intereses en dos columnas
  const mitad = Math.ceil(interesesDisponibles.length / 2);
  const primeraColumna = interesesDisponibles.slice(0, mitad);
  const segundaColumna = interesesDisponibles.slice(mitad);
  const handleInicio = () => {
    navigate(`/usuario/${usuarioId}/`);
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
                  Bienvenido {usuarioData?.correo || "Usuario"}
                  <img
                    src={logoUser}
                    alt="Logo Usuario"
                    className="user-logo"
                  />
                </strong>
              </a>

              {/* Dropdown siempre en el DOM, pero oculto con CSS */}
<ul className="dropdown-menu enhanced-dropdown" aria-labelledby="userDropdown">
                <li>
                  <a className="dropdown-item" onClick={handleInicio}>
                    inicio
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>
      <div className="form-container1">
        <h2 className="form-title">Cambiar Intereses</h2>
        {mensaje && <p className="mensaje1">{mensaje}</p>}
        {loading ? (
          <p style={{ textAlign: "center", color: "#f0f4f8" }}>
            Cargando intereses disponibles...
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="tablas-container ">
              {/* TABLA IZQUIERDA */}
              <div className="tabla-columna">
              <table className="tabla-intereses ">
<tbody>
  {primeraColumna.map((interes) => {
    const isSelected = interesesUsuario.includes(interes.id_inte);
    return (
      <tr
        key={interes.id_inte}
        className={isSelected ? "selected" : ""}
        onClick={() => handleToggle(interes.id_inte)}
        style={{ cursor: "pointer" }}
      >
        <td className="checkbox-col" onClick={e => e.stopPropagation()}>
          <input
            type="checkbox"
            value={interes.id_inte}
            checked={isSelected}
            onChange={() => handleToggle(interes.id_inte)}
          />
        </td>
        <td className="texto-col">{interes.interes}</td>
      </tr>
    );
  })}
</tbody>
              </table>
              </div>


              {/* TABLA DERECHA */}
              <div className="tabla-columna">
              <table className="tabla-intereses ">
                

                <tbody>
                  {segundaColumna.map((interes) => {
                    const isSelected = interesesUsuario.includes(interes.id_inte);
                    return (
                    <tr key={interes.id_inte}
                      className={isSelected ? "selected" : ""}
                      onClick={() => handleToggle(interes.id_inte)}
                      style={{ cursor: "pointer" }}
                    >
                      <td className="checkbox-col" onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          value={interes.id_inte}
                    
                          checked={isSelected}
                          onChange={() => handleToggle(interes.id_inte)}
                        />
                      </td>
                      <td className="texto-col">{interes.interes}</td>
                    </tr>
                    );
})}
                </tbody>
              </table>
              </div>
            </div>

            <button type="submit" className="form-submit-btn1 mt-6">
              Guardar Intereses
            </button>
          </form>
        )}
      </div>
    </>
  );
}
