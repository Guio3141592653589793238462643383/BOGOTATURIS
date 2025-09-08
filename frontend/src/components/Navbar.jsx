import FormSignUp from "./FormSignUp";
export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img 
            src="/_img/registro/Logo.png" 
            alt="BogotaTuris Logo" 
            className="h-8 w-auto"
          />
          <h1 className="text-xl font-bold">BogotaTuris</h1>
        </div>
        <ul className="flex space-x-4 items-center">
          <li>
            <a href="#" className="hover:text-gray-300">
              Inicio
            </a>
          </li>
          <li>
             <a href="/registro" component={FormSignUp} className="hover:text-gray-300 font-semibold text-blue-300">
              Registro
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-gray-300">
              Iniciar Sesión
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}