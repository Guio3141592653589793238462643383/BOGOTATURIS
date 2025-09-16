import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Inicio from "./Pages/Inicio";
import Login from "./Pages/Login";
import Registro from "./Pages/Registro";
import Dashboard from "./Pages/Dashboard";
import Eventos from "./Pages/EventosPage";
import Lugares from "./Pages/LugaresPage";
import Perfil from "./Pages/PerfilPage";

import Navbar from "./components/Navbar";
import Chatbot from "./components/ChatBot";

// NUEVAS IMPORTACIONES
import Lugar from "./Pages/LugaresPage";
import Evento from "./Pages/EventosPage";
import Perfiles from "./Pages/PerfilPage";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/dashboard" element={<Dashboard />} />
    

        {/* RUTAS AGREGADAS */}
        <Route path="/lugares" element={<Lugares />} />
        <Route path="/eventos" element={<Eventos />} />
        <Route path="/perfil" element={<Perfil />} />
      </Routes>

      {/* Chatbot agregado */}
      <Chatbot />
    </Router>
  );
}

export default App;