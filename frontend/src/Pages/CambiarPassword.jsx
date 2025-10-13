import "../assets/css/FormSignUp.css";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import logoUser  from "../assets/img/user.png";
import Logo from "../assets/img/BogotaTurisLogo.png";

function CambiarPassword() {
  const [mensaje, setMensaje] = useState("");
  const { userId } = useParams();
  const navigate = useNavigate();
  const usuarioId = userId || localStorage.getItem("usuario_id");
  const [usuarioData, setUsuarioData] = useState(null);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!usuarioId) {
      navigate("/login");
      return;
    }
    const fetchUsuarioData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/usuario/perfil/${usuarioId}`);
        if (response.ok) {
          const data = await response.json();
          setUsuarioData(data);
        } else {
          // Manejar error si quieres
        }
      } catch (error) {
        // Manejar error si quieres
      }
    };
    fetchUsuarioData();
  }, [usuarioId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMensaje("❌ Las contraseñas no coinciden");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/api/usuario/cambiar-password/${usuarioId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actual: password,
          nueva: newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje("✅ Contraseña actualizada correctamente");
        setPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setMensaje(`❌ ${data.detail || "Error al cambiar contraseña"}`);
      }
    } catch {
      setMensaje("❌ Error de conexión con el servidor");
    }
  };

  const handleCambiarIntereses = () => {
    navigate(`/usuario/${usuarioId}/cambiar-intereses`);
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
              <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button">
                <strong className="user-section">
                  Bienvenido {usuarioData?.correo || "Usuario"}
                  <img src={logoUser } alt="Logo Usuario" className="user-logo" />
                </strong>
              </a>
              <ul className="dropdown-menu enhanced-dropdown" aria-labelledby="userDropdown">
                <li>
                  <a className="dropdown-item" onClick={handleCambiarIntereses}>
                    <i className="bi bi-heart me-2"></i> Cambiar Intereses
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>

<form onSubmit={handleSubmit} className="form-container1">
      <h2>Cambiar Contraseña</h2>
  <div className="form-group1 relative">
    <label htmlFor="password">Contraseña Actual</label>
    <input
      id="password"
      type={showPassword ? "text" : "password"}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
      placeholder="Ingrese su clave "
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
    >
      {showPassword ? "🙈" : "👁️"}
    </button>
  </div>

  <div className="form-group1 relative">

    <label htmlFor="newPassword">Nueva Contraseña</label>
    <input
      id="newPassword"
      type={showNewPassword ? "text" : "password"}
      value={newPassword}
      onChange={(e) => setNewPassword(e.target.value)}
      required
      placeholder="Ingrese nueva clave"
    />
    <button
      type="button"
      onClick={() => setShowNewPassword(!showNewPassword)}
      aria-label={showNewPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
    >
      {showNewPassword ? "🙈" : "👁️"}
    </button>
  </div>

  <div className="form-group1 relative">
    <label htmlFor="confirmPassword">Confirmar Nueva Contraseña</label>
    <input
      id="confirmPassword"
      type={showConfirmPassword ? "text" : "password"}
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      required
      placeholder="Confirme nueva clave"
    />
    <button
      type="button"
      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
      aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
    >
      {showConfirmPassword ? "🙈" : "👁️"}
    </button>
  </div>

  {mensaje && <p className="mensaje1">{mensaje}</p>}

  <button type="submit" className="form-submit-btn1">
    Actualizar Contraseña
  </button>
</form>
    </>
  );
}

export default CambiarPassword;