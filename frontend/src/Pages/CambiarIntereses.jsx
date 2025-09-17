import { useEffect, useState } from "react";
import Logo from '../assets/img/BogotaTurisLogo.png';

export default function CambiarIntereses() {
  const [interesesDisponibles, setInteresesDisponibles] = useState([]);
  const [interesesUsuario, setInteresesUsuario] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");

  // Simulación: cargar intereses desde API
  useEffect(() => {
    const fetchIntereses = async () => {
      try {
        // 🔹 Obtener todos los intereses disponibles
        const resIntereses = await fetch("http://localhost:8000/api/intereses");
        const dataIntereses = await resIntereses.json();

        // 🔹 Obtener intereses actuales del usuario logueado
        const resUsuario = await fetch("http://localhost:8000/api/usuario/intereses/1"); // <-- aquí pasas el id del usuario
        const dataUsuario = await resUsuario.json();

        setInteresesDisponibles(dataIntereses);
        setInteresesUsuario(dataUsuario); // ej: ["Deportes", "Cultura"]
      } catch (error) {
        console.error("Error cargando intereses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIntereses();
  }, []);

  // Manejo de toggle (añadir o quitar intereses seleccionados)
  const handleToggle = (interes) => {
    setInteresesUsuario((prev) =>
      prev.includes(interes)
        ? prev.filter((i) => i !== interes)
        : [...prev, interes]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/api/usuario/actualizar-intereses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intereses: interesesUsuario })
      });

      if (res.ok) {
        setMensaje("✅ Intereses actualizados correctamente");
      } else {
        setMensaje("❌ Error al actualizar intereses");
      }
    } catch {
      setMensaje("❌ Error de conexión con el servidor");
    }
  };

  // Dividir intereses en dos columnas
  const mitad = Math.ceil(interesesDisponibles.length / 2);
  const primeraColumna = interesesDisponibles.slice(0, mitad);
  const segundaColumna = interesesDisponibles.slice(mitad);

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
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Cambiar Intereses</h2>
      {mensaje && <div className="mb-4">{mensaje}</div>}
      {loading ? (
        <p style={{ textAlign: "center", color: "#666" }}>
          Cargando intereses disponibles...
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="tablas-container grid grid-cols-2 gap-6">
            {/* TABLA IZQUIERDA */}
            <table className="tabla-intereses w-full">
              <tbody>
                {primeraColumna.map((interes) => (
                  <tr key={interes.id_inte}>
                    <td className="checkbox-col">
                      <input
                        type="checkbox"
                        value={interes.interes}
                        checked={interesesUsuario.includes(interes.interes)}
                        onChange={() => handleToggle(interes.interes)}
                      />
                    </td>
                    <td className="texto-col">{interes.interes}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* TABLA DERECHA */}
            <table className="tabla-intereses w-full">
              <tbody>
                {segundaColumna.map((interes) => (
                  <tr key={interes.id_inte}>
                    <td className="checkbox-col">
                      <input
                        type="checkbox"
                        value={interes.interes}
                        checked={interesesUsuario.includes(interes.interes)}
                        onChange={() => handleToggle(interes.interes)}
                      />
                    </td>
                    <td className="texto-col">{interes.interes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            type="submit"
            className="mt-6 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
          >
            Guardar Intereses
          </button>
        </form>
      )}
    </div>
    </>
  );
}
