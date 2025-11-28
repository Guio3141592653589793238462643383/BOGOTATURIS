// ChatMapResponsive.jsx
import { useState, useEffect, useRef } from "react";
import axios from "axios";

const colors = {
  oxfordBlue: "#192338",
  spaceCadet: "#1E2E4F",
  yinmnBlue: "#31487A",
  steelBlue: "#395886",
  jordyBlue: "#8FB3E2",
  mediumBlue: "#628ECB",
  lightBlue: "#8AAEE0", // corregido
  lavender: "#D9E1F1",
  white: "#FFFFFF",
};

const ChatMapResponsive = () => {
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { role: "bot", text: "👋 ¡Hola! Soy tu asistente virtual. Pregunta lo que quieras." },
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  const mapRef = useRef(null);
  const markersLayerRef = useRef(null);
  const leafletLoadedRef = useRef(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [chatMessages, chatLoading]);

  useEffect(() => {
    if (leafletLoadedRef.current) return;

    const cssL = document.createElement("link");
    cssL.rel = "stylesheet";
    cssL.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";

    const cssGeocoder = document.createElement("link");
    cssGeocoder.rel = "stylesheet";
    cssGeocoder.href = "https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.css";

    const scriptL = document.createElement("script");
    scriptL.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";

    const scriptGeocoder = document.createElement("script");
    scriptGeocoder.src = "https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.js";

    document.head.appendChild(cssL);
    document.head.appendChild(cssGeocoder);
    document.body.appendChild(scriptL);
    document.body.appendChild(scriptGeocoder);

    scriptGeocoder.onload = initMap;
  }, []);

  const initMap = () => {
    if (!window.L) return;
    const L = window.L;

    mapRef.current = L.map("chat-map", { zoomControl: true }).setView([4.711, -74.0721], 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(mapRef.current);
    L.Control.geocoder().addTo(mapRef.current);
  };

  const updateMarkers = (markers = []) => {
    const L = window.L;
    if (!mapRef.current) return;

    if (!markersLayerRef.current) markersLayerRef.current = L.layerGroup().addTo(mapRef.current);
    else markersLayerRef.current.clearLayers();

    markers.forEach((m) => {
      L.marker(m.position).bindPopup(`<strong>${m.nombre}</strong><br/>${m.tipo || ""}`).addTo(markersLayerRef.current);
    });

    if (markers.length) mapRef.current.setView(markers[0].position, 15);
  };

  const handleChatSubmit = async (e) => {
    e?.preventDefault();
    const q = chatInput.trim();
    if (!q) return;

    setChatMessages(prev => [...prev, { role: "user", text: q }]);
    setChatInput("");
    setChatLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/chat/",
        { mensaje: q },
        { headers: { "Content-Type": "application/json" } }
      );
      const data = response.data;
      setChatMessages(prev => [...prev, { role: "bot", text: data.reply || "No hay respuesta." }]);

      if (data.mapa?.leaflet?.markers?.length) updateMarkers(data.mapa.leaflet.markers);
    } catch (err) {
      console.error(err);
      setChatMessages(prev => [...prev, { role: "bot", text: "❌ Error al comunicarse con el servidor." }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "row",
      height: "58vh",                // compacto
      maxWidth: "1080px",            // no ocupa toda la pantalla
      margin: "24px auto",           // centrado y respiración
      gap: "12px",
      fontFamily: "Arial, sans-serif",
      padding: "12px",
      boxSizing: "border-box",
      flexWrap: "wrap",
      background: colors.white,      // fondo blanco del componente
      border: `1px solid ${colors.lavender}`,
      borderRadius: "12px",
    }}>
      {/* Chat */}
      <div style={{
        flex: "1 1 320px",
        display: "flex",
        flexDirection: "column",
        border: `1px solid ${colors.lavender}`,
        borderRadius: "12px",
        overflow: "hidden",
        background: colors.white,
        boxShadow: "0 2px 8px rgba(25,35,56,0.08)" // oxfordBlue suave
      }}>
        <div style={{ 
          flex: 1, 
          overflowY: "auto", 
          padding: "12px", 
          background: colors.white 
        }}>
          {chatMessages.map((m, i) => {
            const isBot = m.role === "bot";
            return (
              <div key={i} style={{ 
                textAlign: isBot ? "left" : "right", 
                margin: "8px 0" 
              }}>
                <span style={{
                  background: isBot ? colors.lavender : colors.jordyBlue,
                  color: isBot ? colors.spaceCadet : colors.white,
                  padding: "10px 14px",
                  borderRadius: "14px",
                  display: "inline-block",
                  fontSize: "0.92rem",
                  lineHeight: "1.45",
                  maxWidth: "80%",
                  wordWrap: "break-word",
                  border: isBot ? `1px solid ${colors.mediumBlue}` : `1px solid ${colors.yinmnBlue}`
                }}>
                  {m.text}
                </span>
              </div>
            );
          })}
          {chatLoading && (
            <div style={{ textAlign: "left", margin: "6px 0" }}>
              <span style={{ fontStyle: "italic", color: colors.steelBlue }}>Escribiendo...</span>
            </div>
          )}
          <div ref={messagesEndRef}></div>
        </div>

        {/* Input + botón */}
        <form onSubmit={handleChatSubmit} style={{
          display: "flex",
          alignItems: "center",
          padding: "10px",
          gap: "8px",
          background: colors.white,
          borderTop: `1px solid ${colors.lavender}`
        }}>
          <div style={{ position: "relative", flex: 1 }}>
            <input
              type="text"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              placeholder="Escribe tu mensaje..."
              aria-label="Campo de texto para el chat"
              style={{
                width: "100%",
                padding: "10px 40px 10px 14px",
                borderRadius: "18px",
                border: `1px solid ${colors.mediumBlue}`,
                fontSize: "0.95rem",
                outline: "none",
                transition: "border-color 0.2s, box-shadow 0.2s",
                color: colors.spaceCadet,
                background: colors.white,
                boxShadow: "0 1px 2px rgba(25,35,56,0.06)"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = colors.jordyBlue;
                e.target.style.boxShadow = `0 0 0 3px ${colors.lavender}`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = colors.mediumBlue;
                e.target.style.boxShadow = "0 1px 2px rgba(25,35,56,0.06)";
              }}
            />
            <span style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "1rem",
              color: colors.mediumBlue
            }}>💬</span>
          </div>
          <button
            type="submit"
            disabled={chatLoading}
            aria-label="Botón para enviar mensaje"
            style={{
              height: "36px",
              padding: "0 18px",
              borderRadius: "18px",
              background: chatLoading ? colors.steelBlue : colors.yinmnBlue,
              color: colors.white,
              border: `1px solid ${colors.spaceCadet}`,
              cursor: chatLoading ? "not-allowed" : "pointer",
              fontSize: "0.95rem",
              transition: "transform 0.15s ease, background 0.2s ease",
              boxShadow: "0 2px 4px rgba(25,35,56,0.12)"
            }}
            onMouseEnter={(e) => {
              if (!chatLoading) e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {chatLoading ? "..." : "Enviar"}
          </button>
        </form>
      </div>

      {/* Mapa */}
      <div style={{
        flex: "2 1 420px",
        border: `1px solid ${colors.lavender}`,
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(25,35,56,0.08)",
        background: colors.white
      }}>
        <div id="chat-map" style={{ height: "100%", width: "100%" }}></div>
      </div>
    </div>
  );
};

export default ChatMapResponsive;
