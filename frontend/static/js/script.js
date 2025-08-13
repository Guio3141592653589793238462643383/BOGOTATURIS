async function enviarMensaje() {
  const input = document.getElementById("mensaje");
  const chatBox = document.getElementById("chat-box");
  const typing = document.getElementById("typing");

  const mensaje = input.value.trim();
  if (!mensaje) return;

  // Mostrar mensaje del usuario
  const userBubble = document.createElement("div");
  userBubble.className = "message user";
  userBubble.innerText = mensaje;
  chatBox.appendChild(userBubble);
  chatBox.scrollTop = chatBox.scrollHeight;

  // Limpiar input
  input.value = "";

  // Mostrar "Escribiendo..."
  typing.style.display = "block";

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mensaje })
    });

    const data = await res.json();

    // Ocultar "Escribiendo..."
    typing.style.display = "none";

    // Mostrar respuesta de la IA
    const botBubble = document.createElement("div");
    botBubble.className = "message bot";
    botBubble.innerText = data.reply;
    chatBox.appendChild(botBubble);
    chatBox.scrollTop = chatBox.scrollHeight;
  } catch (error) {
    typing.style.display = "none";
    alert("Hubo un error al procesar tu mensaje.");
  }
}
