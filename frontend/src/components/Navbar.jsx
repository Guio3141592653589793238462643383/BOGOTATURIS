export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">MI APP</h1>
        <ul className="flex space-x-4 items-center">
          <li>
            <a href="#" className="hover:text-gray-300">
              Inicio
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-gray-300">
              Servicios
            </a>
          </li>
          <li className="flex items-center space-x-2">
            <a href="#" className="hover:text-gray-300">
              Contacto
            </a>
            <button className="p-1 rounded hover:bg-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

