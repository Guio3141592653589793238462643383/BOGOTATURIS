# ChatBot Turístico Bogotá

Asistente virtual para explorar lugares turísticos de Bogotá, basado en FastAPI, OpenAI y MongoDB.

## Requisitos

- Python 3.10+
- MongoDB en localhost
- Clave de API de OpenAI

## Instalación

1. **Clona el repositorio**  
   ```sh
   git clone <URL-del-repo>
   cd chat_Bot
   ```

2. **Instala las dependencias**  
   ```sh
   pip install -r requirements.txt
   ```

3. **Configura las variables de entorno**  
   Crea un archivo `.env` con tu clave de OpenAI:
   ```
   OPENAI_API_KEY=tu_clave_openai
   ```

4. **Carga los datos iniciales**  
   Si tienes un archivo `inventario.geojson`, usa el script para importar:
   ```sh
   python importar_geojson.py
   ```

## Uso

1. **Inicia MongoDB**  
   Asegúrate de que el servicio de MongoDB esté corriendo en tu máquina.

2. **Ejecuta la aplicación**  
   ```sh
   uvicorn main:app --reload
   ```

3. **Abre el navegador**  
   Ve a [http://localhost:8000](http://localhost:8000) para usar el asistente.

4. **Consulta el historial**  
   Accede a [http://localhost:8000/historial](http://localhost:8000/historial) para ver el historial de preguntas y respuestas.

## Estructura del proyecto

- `main.py`: Lógica principal de la API y chatbot
- `importar_geojson.py`: Script para cargar datos a MongoDB
- `static/`: Archivos estáticos (CSS, JS)
- `templates/`: Plantillas HTML (`asistente.html`, `historial.html`)
- `inventario.geojson`: Datos de lugares turísticos

## Créditos

Desarrollado con FastAPI, OpenAI