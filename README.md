# 🏙️ BogotáTuris – Asistente Turístico con IA  

Proyecto de formación desarrollado en el **Servicio Nacional de Aprendizaje – SENA** por **Andrés Felipe Guio Aponte**.  
Consiste en un asistente virtual para turismo en Bogotá, construido con **FastAPI**, **MongoDB** y la API de **OpenAI**.  
Permite a los usuarios interactuar con un chatbot para obtener información de lugares turísticos, guardar historial de consultas y visualizar datos desde una base de datos no relacional.  

---

## 📌 Características  
- **Chatbot con IA** usando OpenAI para responder sobre turismo en Bogotá.  
- **Base de datos NoSQL** (MongoDB) con datos de lugares turísticos en formato GeoJSON.  
- **Frontend dinámico** con plantillas Jinja2.  
- **Historial de consultas** almacenado en MongoDB.  
- **Enrutado modular** con FastAPI y organización por carpetas.  

---

## 📂 Estructura del Proyecto  
BOGOTATURIS/
│── backend/
│ ├── app/
│ │ ├── api/
│ │ │ ├── routers_/
│ │ │ │ ├── chat_router.py
│ │ │ │ ├── historial_router.py
│ │ │ ├── schemas_/
│ │ │ │ ├── chat_Schemas.py
│ │ │ ├── services_/
│ │ │ │ ├── chat_Service.py
│── frontend/
│ ├── static/
│ ├── templates/
│ ├── asistente.html
│ ├── historial.html
│ ├── lugares.html
│ ├── contacto.html
│ ├── Sign_Up.html
│── inventario.geojson
│── importar_geojson.py
│── main.py
│── requirements.txt
│── README.md
│── .env

---

## ⚙️ Instalación y Ejecución  

### 1️⃣ Clonar el repositorio  
```bash
git clone https://github.com/tuusuario/BOGOTATURIS.git
cd BOGOTATURIS
python -m venv venv
source venv/bin/activate  # En Linux/Mac
venv\Scripts\activate     # En Windows

pip install -r requirements.txt
python importar_geojson.py
uvicorn main:app --reload
