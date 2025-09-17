import { useNavigate } from 'react-router-dom'

export default function Modal({ open, onClose, card }) {
  const navigate = useNavigate()

  if (!open || !card) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-lg w-[90%] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón de cerrar */}
<button
  onClick={onClose}
  className="absolute top-3 right-3 p-2 rounded-full text-gray-600 hover:text-red-500 hover:bg-gray-100 text-2xl leading-none transition"
>
  ×
</button>


        {/* Imagen */}
        <img
          src={card.imagen}
          alt={card.titulo}
          className="w-full h-72 object-cover rounded-t-lg"
        />

        {/* Contenido */}
        <div className="p-4">
          <h2 className="text-2xl font-bold">{card.titulo}</h2>
          <p className="mt-2 text-gray-700">{card.descripcion}</p>

          {/* Botón para crear comentario */}
 <button
  onClick={() => navigate('/comentarios/nuevo')}
  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
>
  Crear comentario
</button>
          <button
            onClick={() =>
              navigate(`/lugares/${card.id}`, { state: { lugar: card } })
            }
            className="mt-4 ml-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Consultar lugar
          </button>
<button
  onClick={() => navigate("/comentarios")}  // Ir a la tabla de comentarios
  className="mt-4 ml-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
>
  Eliminar Comentarios
</button>
        </div>
      </div>
    </div>
  )
}
