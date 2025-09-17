import { useState } from "react";
import "../assets/css/FormSignUp.css";
import Logo from "../assets/img/BogotaTurisLogo.png";

function CambiarPassword() {
  const [mensaje, setMensaje] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMensaje("❌ Las contraseñas no coinciden");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/usuario/cambiar-password", {
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

  return (
    <>
      <nav className="nav">
        <div className="container1">
          <div className="logo">
            <img src={Logo} alt="BogotaTuris Logo" />
          </div>
          <ul className="nav-links">
            <li><a href="#">Inicio</a></li>
            <li><a href="#">Cerrar Sesión</a></li>
          </ul>
        </div>
      </nav>

      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Cambiar Contraseña</h2>
        {mensaje && <div className="mb-4">{mensaje}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Contraseña actual */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña actual"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-2 rounded pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg"
            >
            </button>
          </div>

          {/* Nueva contraseña */}
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="Nueva contraseña"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border p-2 rounded pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg"
            >
            </button>
          </div>

          {/* Confirmar nueva contraseña */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirmar nueva contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border p-2 rounded pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg"
            >
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-lg hover:opacity-90 transition"
          >
            Actualizar Contraseña
          </button>
        </form>
      </div>
    </>
  );
}

export default CambiarPassword;
