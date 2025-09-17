export default function Card({ imagen, titulo, descripcion, onClick }) {
  return (
    <div
      className="card-container"
      onClick={onClick}
    >
      <div className="w-full h-64 overflow-hidden">
        {/* image fills the area without leaving white gaps */}
        <img src={imagen} alt={titulo} className="w-full h-full object-cover block" />
      </div>

      <div className="p-4 bg-white">
        <h3 className="text-lg font-bold">{titulo}</h3>
        <p className="text-gray-600">{descripcion}</p>
      </div>
    </div>
  );
}
