🏙️ BogotáTuris – Asistente Turístico con IA

BogotáTuris es un asistente virtual para turismo en Bogotá, desarrollado con FastAPI, MongoDB, React y la API de OpenAI.
Permite a los usuarios consultar información sobre lugares turísticos, visualizar datos en formato GeoJSON y almacenar un historial de consultas en una base de datos NoSQL.

📌 Características

🤖 Chatbot con IA basado en OpenAI para responder preguntas sobre turismo en Bogotá.

🗺️ Base de datos NoSQL (MongoDB) con lugares turísticos almacenados como GeoJSON.

💻 Frontend moderno en React, comunicándose con el backend mediante API REST.

📝 Historial de consultas almacenado automáticamente en MongoDB.

⚡ Backend modular con FastAPI, con rutas separadas y servicios independientes.

🔗 Integración con IA, bases de datos no relacionales y capa de frontend SPA.

📂 Estructura del Proyecto
BOGOTATURIS/
│── backend/
│   ├── app/
│   │   ├── BD/
│   │   │   ├── bd_no_relacional/
│   │   │   │   ├── importar_geojson.py
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── main.py
│   ├── requirements.txt
│
│── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   ├── package.json
│
│── README.md

⚙️ Instalación y Ejecución
1️⃣ Clonar el repositorio
git clone https://github.com/Guio3141592653589793238462643383/BOGOTATURIS.git
cd BOGOTATURIS

🖥️ Backend (FastAPI)
2️⃣ Crear entorno virtual
cd backend
python -m venv venv


Activación:

Linux/Mac:

source venv/bin/activate


Windows:

venv\Scripts\activate

3️⃣ Instalar dependencias
pip install -r requirements.txt

4️⃣ Importar datos GeoJSON a MongoDB
cd app/BD/bd_no_relacional
python importar_geojson.py

5️⃣ Ejecutar el servidor
cd ../..
uvicorn main:app --reload

💻 Frontend (React)
1️⃣ Instalar dependencias
cd frontend
npm install

2️⃣ Ejecutar aplicación React
npm run dev

📘 Documentación PSP Asociada

El proyecto se desarrolló aplicando actividades del Personal Software Process (PSP) orientadas a la mejora personal del proceso de desarrollo.

🧩 Diagnóstico del proceso personal

Se identificaron fortalezas, debilidades y el flujo de trabajo inicial antes del PSP.

🧮 Método PROBE (Estimación)

Basado en datos históricos:

LOC estimados: 6,000

Tiempo estimado: 130 h

Tiempo real: 100 h

Error relativo medio: 23%

📊 Evaluación PSP

Métricas registradas:

Métrica	Valor
LOC reales	6,000
Defectos	38
Productividad	60 LOC/h
Densidad de defectos	6.3/KLOC
Tiempo en revisión	8%
Tiempo en corrección	22%
Error de estimación	16%
🛠️ Herramientas digitales utilizadas
Área	Herramienta
Time tracking	Clockify
Gestión	Trello
Control de defectos	GitHub Issues
Estadísticas PSP	Google Sheets
📑 Postmortem y PPIP
