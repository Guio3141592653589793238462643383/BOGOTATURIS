import { useState } from "react";

function ComentariosNuevo() {
  const [tipo, setTipo] = useState("");
  const [fecha, setFecha] = useState("");

  const usuarioRaw = localStorage.getItem("usuario");
  const usuario = usuarioRaw ? JSON.parse(usuarioRaw) : null;
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!usuario) {
      alert("Debes iniciar sesión antes de comentar ❌");
      return;
    }

    const comentarioData = {
      tipo_com: tipo,
      fecha_com: fecha,
      id_usuario: usuario.usuario_id, // ojo con el nombre que devuelves en login
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/api/comentarios/nuevo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // si lo usas
        },
        body: JSON.stringify(comentarioData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Error al guardar comentario");

      alert("Comentario guardado ✅");
    } catch (error) {
      console.error("Error:", error);
      alert("No se pudo guardar el comentario ❌");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Tipo de comentario"
        value={tipo}
        onChange={(e) => setTipo(e.target.value)}
      />
      <input
        type="date"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
      />
      <button type="submit">Guardar</button>
    </form>
  );
}

export default ComentariosNuevo;
