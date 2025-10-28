import Logo from "../assets/img/BogotaTurisLogo.png";
import logoUser from "../assets/img/user.png";
import "../assets/css/AdminView.css";
import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function AdminView() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const usuarioId = userId || localStorage.getItem("usuario_id");

  const [usuarioData, setUsuarioData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [stats, setStats] = useState({
    total_usuarios: 0,
    total_lugares: 0,
    total_comentarios: 0,
    total_reportes: 0
  });

  const [vistaActual, setVistaActual] = useState("dashboard");
  const [usuarios, setUsuarios] = useState([]);
  const [lugares, setLugares] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [reportes, setReportes] = useState([]);
  
  const [busqueda, setBusqueda] = useState("");
  const [filtroRol, setFiltroRol] = useState("");
  const [paginaActual, setPaginaActual] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPorPagina = 10;

  const [modalEliminar, setModalEliminar] = useState(false);
  const [itemSeleccionado, setItemSeleccionado] = useState(null);

  const cargarEstadisticas = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:8000/api/admin/estadisticas");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
    }
  }, []);

  const cargarUsuarios = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        skip: paginaActual * itemsPorPagina,
        limit: itemsPorPagina
      });
      
      if (busqueda) params.append("buscar", busqueda);
      if (filtroRol) params.append("rol", filtroRol);

      const response = await fetch(`http://localhost:8000/api/admin/usuarios?${params}`);
      if (response.ok) {
        const data = await response.json();
        setUsuarios(data.usuarios);
        setTotalItems(data.total);
      }
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    }
  }, [paginaActual, busqueda, filtroRol]);

  const cargarLugares = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        skip: paginaActual * itemsPorPagina,
        limit: itemsPorPagina
      });
      
      if (busqueda) params.append("buscar", busqueda);

      const response = await fetch(`http://localhost:8000/api/admin/lugares?${params}`);
      if (response.ok) {
        const data = await response.json();
        setLugares(data.lugares);
        setTotalItems(data.total);
      }
    } catch (error) {
      console.error("Error al cargar lugares:", error);
    }
  }, [paginaActual, busqueda]);

  const cargarComentarios = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        skip: paginaActual * itemsPorPagina,
        limit: itemsPorPagina
      });

      const response = await fetch(`http://localhost:8000/api/admin/comentarios?${params}`);
      if (response.ok) {
        const data = await response.json();
        setComentarios(data.comentarios);
        setTotalItems(data.total);
      }
    } catch (error) {
      console.error("Error al cargar comentarios:", error);
    }
  }, [paginaActual]);

  const cargarReportes = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        skip: paginaActual * itemsPorPagina,
        limit: itemsPorPagina
      });

      const response = await fetch(`http://localhost:8000/api/admin/reportes?${params}`);
      if (response.ok) {
        const data = await response.json();
        setReportes(data.reportes);
        setTotalItems(data.total);
      }
    } catch (error) {
      console.error("Error al cargar reportes:", error);
    }
  }, [paginaActual]);

  const eliminarUsuario = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/admin/usuarios/${id}`, {
        method: "DELETE"
      });
      
      if (response.ok) {
        alert("Usuario eliminado exitosamente");
        cargarUsuarios();
        cargarEstadisticas();
        setModalEliminar(false);
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail}`);
      }
    } catch (error) {
      alert("Error al eliminar usuario");
    }
  };

  const eliminarLugar = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/admin/lugares/${id}`, {
        method: "DELETE"
      });
      
      if (response.ok) {
        alert("Lugar eliminado exitosamente");
        cargarLugares();
        cargarEstadisticas();
        setModalEliminar(false);
      }
    } catch (error) {
      alert("Error al eliminar lugar");
    }
  };

  const eliminarComentario = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/admin/comentarios/${id}`, {
        method: "DELETE"
      });
      
      if (response.ok) {
        alert("Comentario eliminado exitosamente");
        cargarComentarios();
        cargarEstadisticas();
        setModalEliminar(false);
      }
    } catch (error) {
      alert("Error al eliminar comentario");
    }
  };

  const fetchUsuarioData = useCallback(
    async (id, forceRefresh = false) => {
      try {
        if (usuarioData && !forceRefresh) return;
        setLoading(true);

        const response = await fetch(`http://localhost:8000/api/usuario/perfil/${id}`);

        if (response.ok) {
          const data = await response.json();
          setUsuarioData(data);
          localStorage.setItem("usuarioData", JSON.stringify(data));
          setError(null);
        } else if (response.status === 404) {
          setError("Usuario no encontrado");
          setTimeout(() => navigate("/login"), 2000);
        } else {
          setError("Error al cargar los datos del usuario");
        }
      } catch (error) {
        console.error("Error de conexión:", error);
        setError("Error de conexión con el servidor");
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  useEffect(() => {
    if (!usuarioId) {
      navigate("/login");
      return;
    }

    const rol = localStorage.getItem("user_rol");
    if (rol !== "administrador") {
      navigate(`/usuario/${usuarioId}`);
      return;
    }

    const savedUser = localStorage.getItem("usuarioData");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        if (!parsedUser.correo || !parsedUser.primer_nombre) {
          fetchUsuarioData(usuarioId, true);
        } else {
          setUsuarioData(parsedUser);
        }
      } catch (error) {
        localStorage.removeItem("usuarioData");
        fetchUsuarioData(usuarioId);
      }
    } else {
      fetchUsuarioData(usuarioId);
    }

    cargarEstadisticas();
  }, [usuarioId, navigate, fetchUsuarioData, cargarEstadisticas]);

  useEffect(() => {
    setPaginaActual(0);
    
    if (vistaActual === "usuarios") cargarUsuarios();
    else if (vistaActual === "lugares") cargarLugares();
    else if (vistaActual === "comentarios") cargarComentarios();
    else if (vistaActual === "reportes") cargarReportes();
  }, [vistaActual, busqueda, filtroRol]);

  useEffect(() => {
    if (vistaActual === "usuarios") cargarUsuarios();
    else if (vistaActual === "lugares") cargarLugares();
    else if (vistaActual === "comentarios") cargarComentarios();
    else if (vistaActual === "reportes") cargarReportes();
  }, [paginaActual]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  const totalPaginas = Math.ceil(totalItems / itemsPorPagina);

  if (loading && !usuarioData) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <h2>Cargando panel de administrador...</h2>
      </div>
    );
  }

  if (error && !usuarioData) {
    return (
      <div className="error-container">
        <h2>⚠️ {error}</h2>
        <button onClick={() => navigate("/login")}>Volver al Login</button>
      </div>
    );
  }

  return (
    <>
      <nav className="nav">
        <div className="container1">
          <div className="logo">
            <img src={Logo} alt="BogotaTuris Logo" />
            <h1>BogotaTuris - Admin</h1>
          </div>
          <ul className="nav-links">
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" role="button">
                <strong className="user-section">
                  Admin: {usuarioData?.correo || "Administrador"}
                  <img src={logoUser} alt="Logo Usuario" className="user-logo" />
                </strong>
              </a>
              <ul className="dropdown-menu">
                <li><a className="dropdown-item" onClick={() => navigate(`/usuario/${usuarioId}/perfil`)}>Mi Cuenta</a></li>
                <li><a className="dropdown-item" onClick={() => navigate(`/usuario/${usuarioId}/cambiar-password`)}>Cambiar Contraseña</a></li>
                <li><a className="dropdown-item" onClick={handleLogout}>Cerrar Sesión</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>

      <div className="admin-container">
        {vistaActual === "dashboard" && (
          <>
            <motion.div className="admin-header" initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="admin-title">Panel de Administración</h1>
              <p className="admin-subtitle">
                Bienvenido, {usuarioData?.primer_nombre || "Administrador"}. Gestiona el sistema desde aquí.
              </p>
            </motion.div>

            <div className="stats-grid">
              <motion.div className="stat-card" whileHover={{ scale: 1.05 }}>
                <div className="stat-icon users-icon">👥</div>
                <h3 className="stat-number">{stats.total_usuarios}</h3>
                <p className="stat-label">Usuarios Registrados</p>
              </motion.div>

              <motion.div className="stat-card" whileHover={{ scale: 1.05 }}>
                <div className="stat-icon places-icon">📍</div>
                <h3 className="stat-number">{stats.total_lugares}</h3>
                <p className="stat-label">Lugares Turísticos</p>
              </motion.div>

              <motion.div className="stat-card" whileHover={{ scale: 1.05 }}>
                <div className="stat-icon comments-icon">💬</div>
                <h3 className="stat-number">{stats.total_comentarios}</h3>
                <p className="stat-label">Comentarios</p>
              </motion.div>

              <motion.div className="stat-card" whileHover={{ scale: 1.05 }}>
                <div className="stat-icon reports-icon">⚠️</div>
                <h3 className="stat-number">{stats.total_reportes}</h3>
                <p className="stat-label">Reportes</p>
              </motion.div>
            </div>

            <motion.div className="actions-section">
              <h2 className="section-title">Acciones Rápidas</h2>
              <div className="actions-grid">
                <button className="action-btn users-btn" onClick={() => setVistaActual("usuarios")}>
                  <span className="action-icon">👤</span>
                  Gestionar Usuarios
                </button>
                <button className="action-btn places-btn" onClick={() => setVistaActual("lugares")}>
                  <span className="action-icon">🏛️</span>
                  Gestionar Lugares
                </button>
                <button className="action-btn comments-btn" onClick={() => setVistaActual("comentarios")}>
                  <span className="action-icon">💬</span>
                  Moderar Comentarios
                </button>
                <button className="action-btn reports-btn" onClick={() => setVistaActual("reportes")}>
                  <span className="action-icon">📋</span>
                  Ver Reportes
                </button>
              </div>
            </motion.div>
          </>
        )}

        {vistaActual === "usuarios" && (
          <div className="crud-section">
            <div className="crud-header">
              <h2>Gestión de Usuarios</h2>
              <button className="btn-back" onClick={() => setVistaActual("dashboard")}>← Volver</button>
            </div>

            <div className="filtros-container">
              <input
                type="text"
                placeholder="Buscar por nombre, apellido o correo..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="input-busqueda"
              />
              <select value={filtroRol} onChange={(e) => setFiltroRol(e.target.value)} className="select-filtro">
                <option value="">Todos los roles</option>
                <option value="usuario">Usuario</option>
                <option value="administrador">Administrador</option>
              </select>
            </div>

            <div className="tabla-container">
              <table className="tabla-crud">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Nacionalidad</th>
                    <th>Rol</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((usuario) => (
                    <tr key={usuario.id_usuario}>
                      <td>{usuario.id_usuario}</td>
                      <td>{`${usuario.primer_nombre} ${usuario.primer_apellido}`}</td>
                      <td>{usuario.correo}</td>
                      <td>{usuario.nacionalidad}</td>
                      <td><span className={`badge badge-${usuario.rol}`}>{usuario.rol}</span></td>
                      <td>
                        <button 
                          className="btn-eliminar"
                          onClick={() => {
                            setItemSeleccionado(usuario);
                            setModalEliminar(true);
                          }}
                        >
                          🗑️ Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="paginacion">
              <button 
                disabled={paginaActual === 0}
                onClick={() => setPaginaActual(p => p - 1)}
                className="btn-paginacion"
              >
                ← Anterior
              </button>
              <span>Página {paginaActual + 1} de {totalPaginas || 1}</span>
              <button 
                disabled={paginaActual >= totalPaginas - 1}
                onClick={() => setPaginaActual(p => p + 1)}
                className="btn-paginacion"
              >
                Siguiente →
              </button>
            </div>
          </div>
        )}

        {vistaActual === "lugares" && (
          <div className="crud-section">
            <div className="crud-header">
              <h2>Gestión de Lugares Turísticos</h2>
              <button className="btn-back" onClick={() => setVistaActual("dashboard")}>← Volver</button>
            </div>

            <div className="filtros-container">
              <input
                type="text"
                placeholder="Buscar por nombre o dirección..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="input-busqueda"
              />
            </div>

            <div className="tabla-container">
              <table className="tabla-crud">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Tipo</th>
                    <th>Dirección</th>
                    <th>Precio</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {lugares.map((lugar) => (
                    <tr key={lugar.id_lugar}>
                      <td>{lugar.id_lugar}</td>
                      <td>{lugar.nombre_lugar}</td>
                      <td>{lugar.tipo_lugar}</td>
                      <td>{lugar.direccion}</td>
                      <td>${lugar.precios || 0}</td>
                      <td>
                        <button 
                          className="btn-eliminar"
                          onClick={() => {
                            setItemSeleccionado(lugar);
                            setModalEliminar(true);
                          }}
                        >
                          🗑️ Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="paginacion">
              <button 
                disabled={paginaActual === 0}
                onClick={() => setPaginaActual(p => p - 1)}
                className="btn-paginacion"
              >
                ← Anterior
              </button>
              <span>Página {paginaActual + 1} de {totalPaginas || 1}</span>
              <button 
                disabled={paginaActual >= totalPaginas - 1}
                onClick={() => setPaginaActual(p => p + 1)}
                className="btn-paginacion"
              >
                Siguiente →
              </button>
            </div>
          </div>
        )}

        {vistaActual === "comentarios" && (
          <div className="crud-section">
            <div className="crud-header">
              <h2>Moderación de Comentarios</h2>
              <button className="btn-back" onClick={() => setVistaActual("dashboard")}>← Volver</button>
            </div>

            <div className="tabla-container">
              <table className="tabla-crud">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tipo</th>
                    <th>Fecha</th>
                    <th>Usuario</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {comentarios.map((comentario) => (
                    <tr key={comentario.id_com}>
                      <td>{comentario.id_com}</td>
                      <td>{comentario.tipo_com}</td>
                      <td>{comentario.fecha_com}</td>
                      <td>{comentario.nombre_usuario}</td>
                      <td>
                        <button 
                          className="btn-eliminar"
                          onClick={() => {
                            setItemSeleccionado(comentario);
                            setModalEliminar(true);
                          }}
                        >
                          🗑️ Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="paginacion">
              <button 
                disabled={paginaActual === 0}
                onClick={() => setPaginaActual(p => p - 1)}
                className="btn-paginacion"
              >
                ← Anterior
              </button>
              <span>Página {paginaActual + 1} de {totalPaginas || 1}</span>
              <button 
                disabled={paginaActual >= totalPaginas - 1}
                onClick={() => setPaginaActual(p => p + 1)}
                className="btn-paginacion"
              >
                Siguiente →
              </button>
            </div>
          </div>
        )}

        {vistaActual === "reportes" && (
          <div className="crud-section">
            <div className="crud-header">
              <h2>Gestión de Reportes</h2>
              <button className="btn-back" onClick={() => setVistaActual("dashboard")}>← Volver</button>
            </div>

            <div className="tabla-container">
              <table className="tabla-crud">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Descripción</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Usuario</th>
                  </tr>
                </thead>
                <tbody>
                  {reportes.map((reporte) => (
                    <tr key={reporte.id_report}>
                      <td>{reporte.id_report}</td>
                      <td>{reporte.descripcion}</td>
                      <td>{reporte.fecha_report}</td>
                      <td><span className={`badge badge-${reporte.estado}`}>{reporte.estado}</span></td>
                      <td>{reporte.nombre_usuario}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="paginacion">
              <button 
                disabled={paginaActual === 0}
                onClick={() => setPaginaActual(p => p - 1)}
                className="btn-paginacion"
              >
                ← Anterior
              </button>
              <span>Página {paginaActual + 1} de {totalPaginas || 1}</span>
              <button 
                disabled={paginaActual >= totalPaginas - 1}
                onClick={() => setPaginaActual(p => p + 1)}
                className="btn-paginacion"
              >
                Siguiente →
              </button>
            </div>
          </div>
        )}

        {modalEliminar && (
          <div className="modal-overlay" onClick={() => setModalEliminar(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>⚠️ Confirmar Eliminación</h3>
              <p>¿Estás seguro de que deseas eliminar este elemento?</p>
              <p className="modal-warning">Esta acción no se puede deshacer.</p>
              <div className="modal-actions">
                <button className="btn-cancelar" onClick={() => setModalEliminar(false)}>
                  Cancelar
                </button>
                <button 
                  className="btn-confirmar-eliminar"
                  onClick={() => {
                    if (vistaActual === "usuarios") eliminarUsuario(itemSeleccionado.id_usuario);
                    else if (vistaActual === "lugares") eliminarLugar(itemSeleccionado.id_lugar);
                    else if (vistaActual === "comentarios") eliminarComentario(itemSeleccionado.id_com);
                  }}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
