 import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavbarView from "../components/NavbarView";
import Logo from "../assets/img/BogotaTurisLogo.png";
import bogotaNight from "../assets/img/bogota-night.jpg";
import Footer from "../components/Footer.jsx";
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";

import "../assets/css/UserView.css";

export default function ProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const usuarioId = userId || localStorage.getItem("usuario_id");

  const [usuarioData, setUsuarioData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [formData, setFormData] = useState({
    primer_nombre: "",
    segundo_nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    correo: "",
    id_nac: "",
  });


  const [fieldHelp, setFieldHelp] = useState({
    primer_nombre: { message: "", type: "" },
    segundo_nombre: { message: "", type: "" },
    primer_apellido: { message: "", type: "" },
    segundo_apellido: { message: "", type: "" },
    id_nac: { message: "", type: "" },
  });

  const [nacionalidades, setNacionalidades] = useState([]);
  const [loadingNacionalidades, setLoadingNacionalidades] = useState(false);

  // Función para mostrar notificaciones toast
  const showToast = useCallback((message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto-remove toast after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000);
  }, []);

  useEffect(() => {
    const validateField = (fieldName, value) => {
      let message = "";
      let type = "";

      switch (fieldName) {
        case "primer_nombre":
        case "primer_apellido":
          if (!value) {
            message = "⚠️ Este campo es obligatorio";
            type = "error";
          } else if (value.length < 2) {
            message = "⚠️ Debe tener al menos 2 caracteres";
            type = "warning";
          } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
            message = "⚠️ Solo se permiten letras";
            type = "error";
          } else {
            message = "✓ Correcto";
            type = "success";
          }
          break;

        case "segundo_nombre":
        case "segundo_apellido":
          if (value && value.length > 0) {
            if (value.length < 2) {
              message = "⚠️ Debe tener al menos 2 caracteres";
              type = "warning";
            } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
              message = "⚠️ Solo se permiten letras";
              type = "error";
            } else {
              message = "✓ Correcto";
              type = "success";
            }
          } else {
            message = "ℹ️ Campo opcional";
            type = "info";
          }
          break;

        case "id_nac":
          if (!value) {
            message = "ℹ️ Selecciona tu nacionalidad";
            type = "info";
          } else {
            message = "✓ Nacionalidad seleccionada";
            type = "success";
          }
          break;
      }

      setFieldHelp((prev) => ({
        ...prev,
        [fieldName]: { message, type },
      }));
    };

    Object.keys(formData).forEach((key) => {
      validateField(key, formData[key]);
    });
  }, [formData]);



    const fetchUsuarioData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/usuario/perfil/${usuarioId}`
        );
        if (response.ok) {
          const data = await response.json();
          setUsuarioData(data);
          setFormData({
            primer_nombre: data.primer_nombre || "",
            segundo_nombre: data.segundo_nombre || "",
            primer_apellido: data.primer_apellido || "",
            segundo_apellido: data.segundo_apellido || "",
            id_nac: data.id_nac ? String(data.id_nac) : "",
          });
        } else {
          showToast("No se pudo cargar el perfil.", "error");
        }
      } catch (error) {
        setError("Error de conexión con el servidor.");
      } finally {
        setLoading(false);
      }
    };
      useEffect(() => {
    if (!usuarioId) {
      navigate("/login");
      return;
    }
    fetchUsuarioData();
}, [usuarioId, navigate]);
    // 🔹 Refrescar datos (por ejemplo, usado por NavbarView)
    const refreshUserData = () => {
      if (usuarioId) fetchUsuarioData();
    };

  useEffect(() => {
    const fetchNacionalidades = async () => {
      setLoadingNacionalidades(true);
      try {
        const response = await fetch(
          "http://localhost:8000/api/usuario/nacionalidades"
        );
        if (response.ok) {
          const data = await response.json();
          setNacionalidades(data);
        } else {
          console.error("No se pudieron cargar las nacionalidades");
        }
      } catch (error) {
        console.error("Error al conectar con el servidor de nacionalidades");
      } finally {
        setLoadingNacionalidades(false);
      }
    };

    fetchNacionalidades();
  }, []);

  if (loading) return <h2 className="text-center mt-20">Cargando perfil...</h2>;
  if (error) return <h2 className="text-center mt-20 text-red-500">{error}</h2>;

  const isFormValid = () => {
    return (
      fieldHelp.primer_nombre.type === "success" &&
      fieldHelp.primer_apellido.type === "success" &&
      (fieldHelp.segundo_nombre.type === "success" ||
        fieldHelp.segundo_nombre.type === "info") &&
      (fieldHelp.segundo_apellido.type === "success" ||
        fieldHelp.segundo_apellido.type === "info")
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      alert(
        "Por favor, corrige los errores en el formulario antes de continuar"
      );
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/api/usuario/perfil/${usuarioId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const updatedData = await response.json();
        setUsuarioData(updatedData);
        localStorage.setItem("usuarioData", JSON.stringify(updatedData));

        const event = new CustomEvent("userDataUpdated", {
          detail: updatedData,
        });
        window.dispatchEvent(event);

        // Mostrar notificación de éxito
        showToast("Perfil actualizado correctamente", "success");
      } else {
        showToast("Error al actualizar el perfil", "error");
      }
    } catch (error) {
      console.error("Error al enviar datos:", error);
      showToast("Error de conexión con el servidor", "error");
    }
  };

  const FieldHelper = ({ fieldName }) => {
    const help = fieldHelp[fieldName];
    if (!help.message) return null;

    const colorClass =
      {
        success: "text-green-600",
        warning: "text-yellow-600",
        error: "text-red-600",
        info: "text-blue-600",
      }[help.type] || "";

    return (
      <small className={`${colorClass} text-sm mt-1 block`}>
        {help.message}
      </small>
    );
  };

  return (
    <>
      <NavbarView
        usuarioData={usuarioData}
        onRefreshUserData={refreshUserData}
      />
      <div className="min-h-screen bg-gradient-to-br from-[#001a33] via-[#003366] to-[#004b8d] pt-8" style={{ position: 'relative' }}>
        {/* Toast notifications */}
        <div className="toast-container">
          {toasts.map((toast) => (
            <div key={toast.id} className={`toast ${toast.type}`}>
              <div className="toast-icon">
                {toast.type === 'success' ? (
                  <FiCheckCircle size={20} />
                ) : (
                  <FiAlertCircle size={20} />
                )}
              </div>
              <div className="toast-message">{toast.message}</div>
            </div>
          ))}
        </div>
        <div
          className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-black/40 px-4 py-10"
          style={{
            backgroundImage: `url(${bogotaNight})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="form-container">
              <h2>Editar Información</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Primer Nombre *</label>
                  <input
                    type="text"
                    value={formData.primer_nombre}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        primer_nombre: e.target.value,
                      })
                    }
                    className={
                      fieldHelp.primer_nombre.type === "error"
                        ? "border-red-500"
                        : ""
                    }
                  />
                  <FieldHelper fieldName="primer_nombre" />
                </div>

                <div className="form-group">
                  <label>Segundo Nombre</label>
                  <input
                    type="text"
                    value={formData.segundo_nombre || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        segundo_nombre: e.target.value,
                      })
                    }
                  />
                  <FieldHelper fieldName="segundo_nombre" />
                </div>

                <div className="form-group">
                  <label>Primer Apellido *</label>
                  <input
                    type="text"
                    value={formData.primer_apellido}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        primer_apellido: e.target.value,
                      })
                    }
                    className={
                      fieldHelp.primer_apellido.type === "error"
                        ? "border-red-500"
                        : ""
                    }
                  />
                  <FieldHelper fieldName="primer_apellido" />
                </div>

                <div className="form-group">
                  <label>Segundo Apellido</label>
                  <input
                    type="text"
                    value={formData.segundo_apellido || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        segundo_apellido: e.target.value,
                      })
                    }
                  />
                  <FieldHelper fieldName="segundo_apellido" />
                </div>

                <div className="form-group">
                  <label>Nacionalidad</label>
                  <select
                    value={formData.id_nac}
                    onChange={(e) =>
                      setFormData({ ...formData, id_nac: e.target.value })
                    }
                  >
                    <option value="" disabled>
                      Selecciona una opción
                    </option>
                    {loadingNacionalidades ? (
                      <option value="">Cargando nacionalidades...</option>
                    ) : (
                      nacionalidades.map((nac) => (
                        <option key={nac.id_nac} value={String(nac.id_nac)}>
                          {nac.nacionalidad}
                        </option>
                      ))
                    )}
                  </select>
                  <FieldHelper fieldName="id_nac" />
                </div>

                <button
                  type="submit"
                  disabled={!isFormValid()}
                  className={!isFormValid() ? "opacity-50 cursor-not-allowed" : ""}
                >
                  Guardar Cambios
                </button>
              </form>
            </div>

            <div className="profile-card">
              <h2 >Mi Perfil</h2>
              <div className="profile-info">
                <p>
                  <span>Nombre:</span> {formData.primer_nombre}{" "}
                  {formData.segundo_nombre}
                </p>
                <p>
                  <span>Apellidos:</span> {formData.primer_apellido}{" "}
                  {formData.segundo_apellido}
                </p>
                <p>
                  <span>Nacionalidad:</span>{" "}
                  {nacionalidades.find((n) => String(n.id_nac) === formData.id_nac)
                    ?.nacionalidad || "No disponible"}
                </p>
              </div>
        </div>
      </div>
      </div>
      </div>
      <Footer />
    </>
  );
}
