import { useEffect, useState } from "react";
import Logo from '../assets/img/BogotaTurisLogo.png';

export default function TablaComentarios() {
  const [comentarios, setComentarios] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/comentarios/")
      .then((res) => res.json())
      .then((data) => setComentarios(data));
  }, []);

  const handleEliminar = async (id_com) => {
    if (!window.confirm("¿Seguro que deseas eliminar este comentario?")) return;

    const response = await fetch(`http://localhost:8000/comentarios/${id_com}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setComentarios(comentarios.filter((c) => c.id_com !== id_com));
    } else {
      alert("Error al eliminar comentario");
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
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">Comentarios</h2>
      <table className="w-full border border-gray-300 rounded-lg">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Tipo</th>
            <th className="p-2 border">Fecha</th>
            <th className="p-2 border">ID Usuario</th>
          </tr>
        </thead>
        <tbody>
          {comentarios.map((c) => (
            <tr key={c.id_com} className="text-center">
              <td className="p-2 border">{c.id_com}</td>
              <td className="p-2 border">{c.tipo_com}</td>
              <td className="p-2 border">{c.fecha_com}</td>
              <td className="p-2 border">{c.id_usuario}</td>
              <td className="p-2 border">
                <button
                  onClick={() => handleEliminar(c.id_com)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
}
