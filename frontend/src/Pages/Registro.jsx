import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useFormValidation from "../hooks/useFormValidation.jsx";
import usePoliticas from "../hooks/usePoliticas";
import PDFModal from "../components/PDFModal";
import { MapPin, Compass, Building2, Eye, EyeOff } from "lucide-react";

const FormSignUp = () => {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const navigate = useNavigate();
  const [showTerminosModal, setShowTerminosModal] = useState(false);
  const [showTratamientoModal, setShowTratamientoModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    formData,
    validationState,
    messages,
    passwordStrength,
    nacionalidades,
    interesesDisponibles,
    loadingNacionalidades,
    loadingIntereses,
    validarTodoElFormulario,
    handleInputChange,
    handleInteresesChange,
    calcularProgreso,
    formularioCompleto,
    updateValidationState,
    resetForm,
  } = useFormValidation();

  const {
    pdfVisualizado,
    sessionId,
    politicasAceptadas,
    registrarVisualizacionPDF,
    handlePoliticaChange,
    validarPoliticas,
    politicasCompletas,
    mensajesPoliticas,
    resetPoliticas,
  } = usePoliticas();

  const progreso = calcularProgreso();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarPoliticas()) {
      alert("Debes aceptar las políticas antes de registrarte");
      return;
    }

    const esValido = await validarTodoElFormulario(politicasAceptadas);
    if (!esValido) {
      alert("Por favor completa todos los campos correctamente");
      return;
    }

    if (formData.clave !== formData.confirmarClave) {
      alert("Las contraseñas no coinciden");
      return;
    }

    if (!sessionId) {
      alert("Error de sesión. Recarga la página");
      return;
    }

    const datosFormulario = {
      ...formData,
      session_id: sessionId,
      acepto_terminos: politicasAceptadas.acepto_terminos,
      acepto_tratamiento_datos: politicasAceptadas.acepto_tratamiento_datos,
    };

    console.log("Enviar datos:", datosFormulario);
    setShowWelcomeModal(true);
    resetForm();
    resetPoliticas();
  };

  const renderNacionalidades = () => {
    if (loadingNacionalidades) return <option>Cargando...</option>;
    return [
      <option key="default" value="">
        Selecciona una opción
      </option>,
      ...nacionalidades.map((nac) => (
        <option key={nac.id_nac} value={nac.id_nac}>
          {nac.nacionalidad}
        </option>
      )),
    ];
  };

  const renderIntereses = () => {
    const lista =
      interesesDisponibles.length > 0
        ? interesesDisponibles
        : [
            "Aventureros",
            "Arte",
            "Gastronomía",
            "Naturaleza",
            "Conciertos",
            "Museos",
            "Eventos",
            "Yoga",
            "Bares",
          ];
    
    return (
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", 
        gap: "10px", 
        padding: "15px", 
        backgroundColor: "#f9fafb", 
        borderRadius: "8px", 
        border: "1px solid #e0e0e0" 
      }}>
        {lista.map((interes, i) => (
          <label 
            key={i} 
            style={{ 
              display: "flex", 
              alignItems: "center", 
              cursor: "pointer", 
              fontSize: "14px",
              padding: "8px",
              backgroundColor: "white",
              borderRadius: "6px",
              border: "1px solid #ddd",
              transition: "all 0.2s"
            }}
          >
            <input
              type="checkbox"
              name="intereses"
              value={interes}
              checked={formData.intereses?.includes(interes)}
              onChange={handleInteresesChange}
              style={{ 
                marginRight: "8px", 
                width: "16px", 
                height: "16px", 
                cursor: "pointer" 
              }}
            />
            <span>{interes}</span>
          </label>
        ))}
      </div>
    );
  };

  const handleWelcomeClose = () => {
    setShowWelcomeModal(false);
    navigate("/login");
  };

  const getPasswordLabel = (nivel) => {
    if (nivel <= 1) return "Baja";
    if (nivel === 2) return "Media";
    return "Segura";
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "linear-gradient(135deg, #001a33 0%, #003366 50%, #004b8d 100%)",
      padding: "20px 0"
    }}>
      <div style={{ 
        minHeight: "100vh", 
        backgroundColor: "rgba(0, 26, 51, 0.7)", 
        display: "flex",
        flexDirection: { xs: "column", md: "row" }
      }}>
        
        {/* Panel izquierdo - Imagen de Bogotá */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            padding: { xs: "20px", md: "40px" },
            backgroundImage: "url(https://images.unsplash.com/photo-1568632234157-ce7aecd03d0d?q=80&w=2070)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: { xs: "300px", md: "auto" }
          }}
        >
          <div style={{ 
            backgroundColor: "rgba(0, 26, 51, 0.75)", 
            padding: { xs: "25px", md: "40px" }, 
            borderRadius: "20px", 
            backdropFilter: "blur(10px)", 
            textAlign: "center", 
            maxWidth: "500px",
            width: "100%"
          }}>
            <div style={{ 
              display: "flex", 
              justifyContent: "center", 
              gap: "30px", 
              marginBottom: "30px", 
              color: "#ffda44" 
            }}>
              <MapPin size={48} />
              <Compass size={48} />
              <Building2 size={48} />
            </div>
            <h1 style={{ 
              fontSize: { xs: "2rem", md: "2.5rem" }, 
              fontWeight: "bold", 
              marginBottom: "20px" 
            }}>
              Bienvenido a <span style={{ color: "#ffda44" }}>BogotaTuris</span>
            </h1>
            <p style={{ 
              color: "white", 
              fontSize: { xs: "0.9rem", md: "1rem" }, 
              lineHeight: "1.6" 
            }}>
              Vive la magia de la capital colombiana. Cultura, historia y aventura en un solo lugar. SAY NO MORE.
            </p>
          </div>
        </div>

        {/* Panel derecho - Formulario */}
        <div style={{ 
          flex: 1, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          padding: { xs: "20px", md: "30px 40px" }, 
          overflowY: "auto"
        }}>
          <div style={{ 
            backgroundColor: "rgba(255, 255, 255, 0.95)", 
            backdropFilter: "blur(10px)", 
            border: "1px solid #c9d6e8", 
            borderRadius: "20px", 
            padding: { xs: "20px", md: "30px" }, 
            width: "100%", 
            maxWidth: "520px", 
            boxShadow: "0 10px 40px rgba(0,0,0,0.3)" 
          }}>
            
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <h2 style={{ 
                fontSize: { xs: "1.5rem", md: "1.75rem" }, 
                fontWeight: "bold", 
                color: "#002855", 
                marginBottom: "8px" 
              }}>
                ✍ Registro
              </h2>
              <p style={{ color: "#5b5b5b", fontSize: "14px" }}>
                Únete a la comunidad de BogotaTuris
              </p>
            </div>

            {/* Barra de progreso */}
            <div style={{ 
              background: "#e0e0e0", 
              borderRadius: "10px", 
              overflow: "hidden", 
              height: "6px", 
              marginBottom: "8px" 
            }}>
              <div style={{ 
                width: `${progreso}%`, 
                height: "100%", 
                background: "linear-gradient(90deg, #004b8d, #0066cc)", 
                transition: "width 0.4s" 
              }} />
            </div>
            <p style={{ 
              textAlign: "center", 
              color: "#666", 
              marginBottom: "18px", 
              fontSize: "14px" 
            }}>
              Progreso: <strong>{progreso}%</strong>
            </p>

            <form onSubmit={handleSubmit} noValidate>
              {/* Datos Personales */}
              <div style={{ marginBottom: "20px" }}>
                <h3 style={{ 
                  marginBottom: "12px", 
                  color: "#002855", 
                  fontWeight: "600", 
                  fontSize: "16px" 
                }}>
                  Datos Personales
                </h3>
                
                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, 
                  gap: "12px", 
                  marginBottom: "12px" 
                }}>
                  <div>
                    <label style={{ 
                      display: "block", 
                      marginBottom: "6px", 
                      fontWeight: "600", 
                      color: "#002855", 
                      fontSize: "14px" 
                    }}>
                      Primer Nombre *
                    </label>
                    <input
                      name="primer_nombre"
                      value={formData.primer_nombre}
                      onChange={handleInputChange}
                      placeholder="Nombre"
                      style={{ 
                        width: "100%", 
                        padding: "12px", 
                        borderRadius: "8px", 
                        border: "1px solid #a9bcd0", 
                        fontSize: "14px", 
                        boxSizing: "border-box", 
                        outline: "none",
                        transition: "border-color 0.2s"
                      }}
                      onFocus={(e) => e.target.style.borderColor = "#004b8d"}
                      onBlur={(e) => e.target.style.borderColor = "#a9bcd0"}
                    />
                  </div>
                  <div>
                    <label style={{ 
                      display: "block", 
                      marginBottom: "6px", 
                      fontWeight: "600", 
                      color: "#002855", 
                      fontSize: "14px" 
                    }}>
                      Segundo Nombre
                    </label>
                    <input
                      name="segundo_nombre"
                      value={formData.segundo_nombre || ""}
                      onChange={handleInputChange}
                      placeholder="Opcional"
                      style={{ 
                        width: "100%", 
                        padding: "12px", 
                        borderRadius: "8px", 
                        border: "1px solid #a9bcd0", 
                        fontSize: "14px", 
                        boxSizing: "border-box", 
                        outline: "none",
                        transition: "border-color 0.2s"
                      }}
                      onFocus={(e) => e.target.style.borderColor = "#004b8d"}
                      onBlur={(e) => e.target.style.borderColor = "#a9bcd0"}
                    />
                  </div>
                </div>

                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, 
                  gap: "12px" 
                }}>
                  <div>
                    <label style={{ 
                      display: "block", 
                      marginBottom: "6px", 
                      fontWeight: "600", 
                      color: "#002855", 
                      fontSize: "14px" 
                    }}>
                      Primer Apellido *
                    </label>
                    <input
                      name="primer_apellido"
                      value={formData.primer_apellido}
                      onChange={handleInputChange}
                      placeholder="Apellido"
                      style={{ 
                        width: "100%", 
                        padding: "12px", 
                        borderRadius: "8px", 
                        border: "1px solid #a9bcd0", 
                        fontSize: "14px", 
                        boxSizing: "border-box", 
                        outline: "none",
                        transition: "border-color 0.2s"
                      }}
                      onFocus={(e) => e.target.style.borderColor = "#004b8d"}
                      onBlur={(e) => e.target.style.borderColor = "#a9bcd0"}
                    />
                  </div>
                  <div>
                    <label style={{ 
                      display: "block", 
                      marginBottom: "6px", 
                      fontWeight: "600", 
                      color: "#002855", 
                      fontSize: "14px" 
                    }}>
                      Segundo Apellido
                    </label>
                    <input
                      name="segundo_apellido"
                      value={formData.segundo_apellido || ""}
                      onChange={handleInputChange}
                      placeholder="Opcional"
                      style={{ 
                        width: "100%", 
                        padding: "12px", 
                        borderRadius: "8px", 
                        border: "1px solid #a9bcd0", 
                        fontSize: "14px", 
                        boxSizing: "border-box", 
                        outline: "none",
                        transition: "border-color 0.2s"
                      }}
                      onFocus={(e) => e.target.style.borderColor = "#004b8d"}
                      onBlur={(e) => e.target.style.borderColor = "#a9bcd0"}
                    />
                  </div>
                </div>
              </div>

              {/* Email y Clave */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ 
                  display: "block", 
                  marginBottom: "6px", 
                  fontWeight: "600", 
                  color: "#002855", 
                  fontSize: "14px" 
                }}>
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleInputChange}
                  placeholder="ejemplo@correo.com"
                  style={{ 
                    width: "100%", 
                    padding: "12px", 
                    borderRadius: "8px", 
                    border: "1px solid #a9bcd0", 
                    marginBottom: "12px", 
                    fontSize: "14px", 
                    boxSizing: "border-box", 
                    outline: "none",
                    transition: "border-color 0.2s"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#004b8d"}
                  onBlur={(e) => e.target.style.borderColor = "#a9bcd0"}
                />

                <label style={{ 
                  display: "block", 
                  marginBottom: "6px", 
                  fontWeight: "600", 
                  color: "#002855", 
                  fontSize: "14px" 
                }}>
                  Confirmar Correo *
                </label>
                <input
                  type="email"
                  name="confirmarCorreo"
                  value={formData.confirmarCorreo}
                  onChange={handleInputChange}
                  placeholder="Confirma tu correo"
                  style={{ 
                    width: "100%", 
                    padding: "12px", 
                    borderRadius: "8px", 
                    border: "1px solid #a9bcd0", 
                    marginBottom: "12px", 
                    fontSize: "14px", 
                    boxSizing: "border-box", 
                    outline: "none",
                    transition: "border-color 0.2s"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#004b8d"}
                  onBlur={(e) => e.target.style.borderColor = "#a9bcd0"}
                />

                <label style={{ 
                  display: "block", 
                  marginBottom: "6px", 
                  fontWeight: "600", 
                  color: "#002855", 
                  fontSize: "14px" 
                }}>
                  Contraseña *
                </label>
                <div style={{ position: "relative", marginBottom: "8px" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="clave"
                    value={formData.clave}
                    onChange={handleInputChange}
                    placeholder="Contraseña"
                    style={{ 
                      width: "100%", 
                      padding: "12px 45px 12px 12px", 
                      borderRadius: "8px", 
                      border: "1px solid #a9bcd0", 
                      fontSize: "14px", 
                      boxSizing: "border-box", 
                      outline: "none",
                      transition: "border-color 0.2s"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#004b8d"}
                    onBlur={(e) => e.target.style.borderColor = "#a9bcd0"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ 
                      position: "absolute", 
                      right: "12px", 
                      top: "50%", 
                      transform: "translateY(-50%)", 
                      background: "none", 
                      border: "none", 
                      cursor: "pointer", 
                      color: "#004b8d", 
                      padding: "4px" 
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Barra de fortaleza de contraseña */}
                <div style={{ marginBottom: "12px" }}>
                  <div style={{ 
                    height: "6px", 
                    background: "#e0e0e0", 
                    borderRadius: "3px", 
                    overflow: "hidden" 
                  }}>
                    <div style={{ 
                      width: `${(passwordStrength.nivel / 4) * 100}%`, 
                      height: "100%", 
                      backgroundColor: passwordStrength.color, 
                      transition: "width 0.3s, background-color 0.3s" 
                    }} />
                  </div>
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    marginTop: "6px" 
                  }}>
                    <span style={{ fontSize: "12px", color: "#333", fontWeight: "500" }}>
                      Seguridad: <strong>{getPasswordLabel(passwordStrength.nivel)}</strong>
                    </span>
                    <span style={{ fontSize: "12px", color: "#666" }}>
                      {passwordStrength.nivel}/4
                    </span>
                  </div>
                </div>

                <label style={{ 
                  display: "block", 
                  marginBottom: "6px", 
                  fontWeight: "600", 
                  color: "#002855", 
                  fontSize: "14px" 
                }}>
                  Confirmar Contraseña *
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmarClave"
                    value={formData.confirmarClave}
                    onChange={handleInputChange}
                    placeholder="Confirma contraseña"
                    style={{ 
                      width: "100%", 
                      padding: "12px 45px 12px 12px", 
                      borderRadius: "8px", 
                      border: "1px solid #a9bcd0", 
                      fontSize: "14px", 
                      boxSizing: "border-box", 
                      outline: "none",
                      transition: "border-color 0.2s"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#004b8d"}
                    onBlur={(e) => e.target.style.borderColor = "#a9bcd0"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ 
                      position: "absolute", 
                      right: "12px", 
                      top: "50%", 
                      transform: "translateY(-50%)", 
                      background: "none", 
                      border: "none", 
                      cursor: "pointer", 
                      color: "#004b8d", 
                      padding: "4px" 
                    }}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Nacionalidad */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ 
                  display: "block", 
                  marginBottom: "6px", 
                  fontWeight: "600", 
                  color: "#002855", 
                  fontSize: "14px" 
                }}>
                  Nacionalidad *
                </label>
                <select
                  name="nacionalidad"
                  value={formData.nacionalidad}
                  onChange={handleInputChange}
                  style={{ 
                    width: "100%", 
                    padding: "12px", 
                    borderRadius: "8px", 
                    border: "1px solid #a9bcd0", 
                    fontSize: "14px", 
                    boxSizing: "border-box", 
                    outline: "none",
                    transition: "border-color 0.2s"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#004b8d"}
                  onBlur={(e) => e.target.style.borderColor = "#a9bcd0"}
                >
                  {renderNacionalidades()}
                </select>
              </div>

              {/* Intereses */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ 
                  display: "block", 
                  marginBottom: "8px", 
                  fontWeight: "600", 
                  color: "#002855", 
                  fontSize: "14px" 
                }}>
                  Intereses Turísticos *
                </label>
                {renderIntereses()}
              </div>

              {/* Políticas */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ 
                  fontWeight: "600", 
                  display: "block", 
                  marginBottom: "10px", 
                  color: "#002855", 
                  fontSize: "14px" 
                }}>
                  Políticas y Consentimientos *
                </label>

                <div style={{ 
                  padding: "12px", 
                  border: "1px solid #c9d6e8", 
                  borderRadius: "8px", 
                  backgroundColor: "#f9fafb", 
                  marginBottom: "10px", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "space-between" 
                }}>
                  <label style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    cursor: "pointer", 
                    flex: 1, 
                    fontSize: "14px" 
                  }}>
                    <input
                      type="checkbox"
                      checked={politicasAceptadas.acepto_terminos}
                      onChange={(e) => handlePoliticaChange("acepto_terminos", e.target.checked)}
                      style={{ 
                        marginRight: "10px", 
                        width: "18px", 
                        height: "18px", 
                        cursor: "pointer" 
                      }}
                    />
                    <span>Acepto términos y condiciones</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowTerminosModal(true)}
                    style={{ 
                      padding: "6px 12px", 
                      background: "#004b8d", 
                      color: "#fff", 
                      border: "none", 
                      borderRadius: "6px", 
                      cursor: "pointer", 
                      fontSize: "12px", 
                      fontWeight: "600" 
                    }}
                  >
                    📄 Leer
                  </button>
                </div>

                <div style={{ 
                  padding: "12px", 
                  border: "1px solid #c9d6e8", 
                  borderRadius: "8px", 
                  backgroundColor: "#f9fafb", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "space-between" 
                }}>
                  <label style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    cursor: "pointer", 
                    flex: 1, 
                    fontSize: "14px" 
                  }}>
                    <input
                      type="checkbox"
                      checked={politicasAceptadas.acepto_tratamiento_datos}
                      onChange={(e) =>
                        handlePoliticaChange("acepto_tratamiento_datos", e.target.checked)
                      }
                      style={{ 
                        marginRight: "10px", 
                        width: "18px", 
                        height: "18px", 
                        cursor: "pointer" 
                      }}
                    />
                    <span>Acepto tratamiento de datos</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowTratamientoModal(true)}
                    style={{ 
                      padding: "6px 12px", 
                      background: "#004b8d", 
                      color: "#fff", 
                      border: "none", 
                      borderRadius: "6px", 
                      cursor: "pointer", 
                      fontSize: "12px", 
                      fontWeight: "600" 
                    }}
                  >
                    📄 Leer
                  </button>
                </div>
              </div>

              {/* Botón de registro */}
              <button
                type="submit"
                style={{ 
                  width: "100%", 
                  padding: "14px", 
                  backgroundColor: "#004b8d", 
                  color: "#fff", 
                  fontWeight: "600", 
                  border: "none", 
                  borderRadius: "8px", 
                  cursor: "pointer", 
                  fontSize: "16px", 
                  boxShadow: "0 4px 12px rgba(0, 75, 141, 0.3)",
                  transition: "all 0.2s"
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = "#003366"}
                onMouseOut={(e) => e.target.style.backgroundColor = "#004b8d"}
              >
                Registrarse
              </button>

              {/* Enlaces */}
              <div style={{ 
                textAlign: "center", 
                marginTop: "20px", 
                fontSize: "14px", 
                color: "#333" 
              }}>
                ¿Ya tienes cuenta?{" "}
                <a
                  href="/login"
                  style={{ 
                    color: "#004b8d", 
                    fontWeight: "600", 
                    textDecoration: "none" 
                  }}
                >
                  Inicia sesión aquí
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Modal de Bienvenida */}
      {showWelcomeModal && (
        <div
          style={{ 
            position: "fixed", 
            top: 0, 
            left: 0, 
            width: "100%", 
            height: "100%", 
            background: "rgba(0,0,0,0.6)", 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            zIndex: 1000 
          }}
          onClick={handleWelcomeClose}
        >
          <div
            style={{ 
              background: "#fff", 
              padding: "35px", 
              borderRadius: "16px", 
              textAlign: "center", 
              maxWidth: "400px", 
              boxShadow: "0 10px 40px rgba(0,0,0,0.4)" 
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ 
              marginBottom: "12px", 
              color: "#002855", 
              fontSize: "1.6rem" 
            }}>
              🎉 ¡Registro Exitoso!
            </h2>
            <p style={{ 
              marginBottom: "20px", 
              color: "#666", 
              fontSize: "0.95rem" 
            }}>
              Bienvenido a <strong style={{ color: "#004b8d" }}>BogotaTuris</strong>
            </p>
            <button
              onClick={handleWelcomeClose}
              style={{ 
                padding: "10px 35px", 
                background: "#004b8d", 
                color: "#fff", 
                border: "none", 
                borderRadius: "8px", 
                cursor: "pointer", 
                fontWeight: "600", 
                fontSize: "0.95rem" 
              }}
            >
              Ir al Login
            </button>
          </div>
        </div>
      )}

      <PDFModal
        isOpen={showTerminosModal}
        onClose={() => setShowTerminosModal(false)}
        pdfUrl="http://localhost:8000/api/politicas/pdf/terminos"
      />
      <PDFModal
        isOpen={showTratamientoModal}
        onClose={() => setShowTratamientoModal(false)}
        pdfUrl="http://localhost:8000/api/politicas/pdf/tratamiento-datos"
      />
    </div>
  );
};

export default FormSignUp;