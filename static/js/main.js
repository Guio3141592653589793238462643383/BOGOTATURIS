// Este archivo se encarga de dar interactividad al sitio Bogotá Turis

document.addEventListener("DOMContentLoaded", () => {
  // Agrega un mensaje de bienvenida dinámico en la sección .bienvenida (index.html)
  const bienvenida = document.querySelector(".bienvenida");
  if (bienvenida) {
    bienvenida.innerHTML += '<p style="color: #01497c; font-weight: bold;">¡Planea tu aventura en Bogotá con confianza y seguridad! 🌆</p>';
  }

  // Muestra una alerta cuando se envía el formulario de contacto
  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault(); // Evita el envío real del formulario
      alert("Gracias por contactarnos. Te responderemos pronto.");
      form.reset(); // Limpia el formulario
    });
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const carrusel = document.querySelector('.carrusel-imagenes');
  const prevBtn = document.querySelector('.btn-carrusel.prev');
  const nextBtn = document.querySelector('.btn-carrusel.next');
  const totalSlides = carrusel.children.length;
  let index = 0;

  function showSlide(i) {
    const width = carrusel.clientWidth;
    carrusel.style.transform = `translateX(-${i * width}px)`;
  }

  function nextSlide() {
    index = (index + 1) % totalSlides;
    showSlide(index);
  }

  function prevSlide() {
    index = (index - 1 + totalSlides) % totalSlides;
    showSlide(index);
  }

  nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAutoplay();
  });

  prevBtn.addEventListener('click', () => {
    prevSlide();
    resetAutoplay();
  });

  window.addEventListener('resize', () => showSlide(index));

  // AUTOPLAY cada 3 segundos
  let autoplay = setInterval(nextSlide, 3000);

  function resetAutoplay() {
    clearInterval(autoplay);
    autoplay = setInterval(nextSlide, 3000);
  }
});
