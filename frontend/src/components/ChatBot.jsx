import React, { useState } from "react";
import { FaMobileAlt, FaTimes } from "react-icons/fa";
import "../assets/css/ChatBot.css";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "👋 ¡Hola! Soy tu asistente virtual, ¿en qué te puedo ayudar?" },
  ]);
  const [input, setInput] = useState("");

  // Manejar envío de mensaje
  const handleSend = () => {
    if (!input.trim()) return;

    // Mensaje del usuario
    const newMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, newMessage]);

    // Respuesta automática simple
    setTimeout(() => {
      const botReply = { from: "bot", text: "🤖 Entendido, pronto tendré una respuesta para ti." };
      setMessages((prev) => [...prev, botReply]);
    }, 800);

    setInput(""); // limpiar input
  };

  return (
    <div>
      {/* Botón flotante */}
      {!isOpen && (
        <button className="chatbot-button" onClick={() => setIsOpen(true)}>
          <FaMobileAlt size={22} />
        </button>
      )}

      {/* Ventana del chat */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <span>Chat de Ayuda</span>
            <FaTimes className="close-btn" onClick={() => setIsOpen(false)} />
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`chatbot-message ${msg.from === "user" ? "user" : "bot"}`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="chatbot-input-area">
            <input
              type="text"
              placeholder="Escribe un mensaje..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="chatbot-input"
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend} className="chatbot-send">Enviar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
