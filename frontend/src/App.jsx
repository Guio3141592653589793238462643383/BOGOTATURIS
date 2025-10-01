import { useLocation, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

function App() {
  const location = useLocation();

  const shouldShowNavbar = !location.pathname.startsWith('/usuario/');

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <Outlet />
    </>
  );
}

export default App;
