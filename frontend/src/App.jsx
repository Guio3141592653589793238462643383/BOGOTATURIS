import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Inicio from "./Pages/Inicio";
import Login from "./Pages/Login";
import Registro from "./Pages/Registro";
import Dashboard from "./Pages/Dashboard";
import Eventos from "./Pages/EventosPage";
import Lugares from "./Pages/LugaresPage";
import Perfil from "./Pages/PerfilPage";
import UserView from "./view/UserView";
import CrearComentario from "./Pages/CreateComment";
import ConsultarLugar from "./Pages/ConsultPlaces";
import CambiarPassword from "./Pages/CambiarPassword";
import CambiarIntereses from "./Pages/CambiarIntereses";
import EliminarComentarios from "./Pages/eliminarComentarios";




import Navbar from "./components/Navbar";
import Chatbot from "./components/ChatBot";

// NUEVAS IMPORTACIONES
import Lugar from "./Pages/LugaresPage";
import Evento from "./Pages/EventosPage";
import Perfiles from "./Pages/PerfilPage";

function App() {
  return (
    <Router>
       {!location.pathname.startsWith('/usuario/') && <Navbar />}
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/dashboard" element={<Dashboard />} />
        

    

        {/* RUTAS AGREGADAS */}
        <Route path="/lugares" element={<Lugares />} />
        <Route path="/eventos" element={<Eventos />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/usuario/:userId" element={<UserView />} />
        <Route path="/comentarios/nuevo" element={<CrearComentario />} />
        <Route path="/lugares/:lugarId" element={<ConsultarLugar />} />
        <Route path="/usuario/:id/cambiar-password" element={<CambiarPassword />} />
        <Route path="/cambiar-password" element={<CambiarPassword />} />
        <Route path="/cambiar-intereses" element={<CambiarIntereses />} />
        <Route path="/comentarios" element={<EliminarComentarios />} />
    
      </Routes>

      {/* Rutas duplicadas eliminadas */}
|||||
      {/* Chatbot agregado */}
      <Chatbot />
    </Router>
  );
}

export default App;