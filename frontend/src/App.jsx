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





import Navbar from "./components/Navbar";


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
        <Route path="/usuario/:userId/perfil" element={<Perfil />} />
        <Route path="/usuario/:userId/comentarios/nuevo" element={<CrearComentario />} />
        <Route path="/consultar-lugar/:lugarId" element={<ConsultarLugar />} />
        <Route path="/usuario/:userId/cambiar-password" element={<CambiarPassword />} />
        <Route path="/usuario/:userId/cambiar-intereses" element={<CambiarIntereses />} />

    
      </Routes>
    </Router>
  );
}

export default App;