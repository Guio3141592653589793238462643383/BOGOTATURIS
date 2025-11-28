from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pymongo import MongoClient
from bson.json_util import dumps
import json
from dotenv import load_dotenv
from openai import OpenAI
import os

# -----------------------------
# Routers
# -----------------------------
from app.api.routers_.chat_router import router as chat_router
#from app.api.routers_.historial_router import router as historial_router
from app.api.routers_.signUp_router import router as signUp_router
from app.api.routers_.login_router import router as login_router
from app.api.routers_.admin_router import router as admin_router
from app.api.routers_.politicas_router import router as politicas_router
from app.api.routers_.notificaciones_router import router as notificaciones_router
from app.api.routers_.verificacion_router import router as verificacion_router
from app.api.routers_.lugares_router import router as lugares_router
from app.api.routers_.tipo_lugar_router import router as tipo_lugar_router
from app.api.routers_.recomendacion_router import router as recomendacion_router

# -----------------------------
# Configuración general
# -----------------------------
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
client_openai = OpenAI(api_key=api_key)

app = FastAPI(
    title="BogotaTuris API",
    description="API para sistema de turismo en Bogotá",
    version="1.0.0"
)

templates = Jinja2Templates(directory="templates")

# -----------------------------
# CORS
# -----------------------------
origins = [
    "http://localhost:5173",  # Frontend Vite
    "http://127.0.0.1:5173",  # Frontend Vite alternativo
    "http://localhost:3000",  # Frontend React alternativo
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# -----------------------------
# Conexión a MongoDB
# -----------------------------
client = MongoClient("mongodb://localhost:27017")
db = client["turismo"]

# -----------------------------
# Archivos estáticos
# -----------------------------
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# -----------------------------
# Routers
# -----------------------------
app.include_router(tipo_lugar_router)
app.include_router(chat_router)
#app.include_router(historial_router)
app.include_router(signUp_router)
app.include_router(login_router)
app.include_router(admin_router)
app.include_router(politicas_router)
app.include_router(notificaciones_router)
app.include_router(verificacion_router)
app.include_router(lugares_router, prefix="/api/lugares", tags=["lugares"])
app.include_router(recomendacion_router)

# -----------------------------
# Rutas principales
# -----------------------------
@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("asistente.html", {"request": request})

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "mongodb": "connected",
        "mysql": "connected"
    }

# -----------------------------
# Endpoints GeoJSON
# -----------------------------
@app.get("/api/transmilenio", tags=["geojson"])
async def get_transmilenio():
    data = list(db.transmilenio_stops.find())
    return JSONResponse(content=json.loads(dumps(data)))

@app.get("/api/sitp", tags=["geojson"])
async def get_sitp():
    data = list(db.sitp_stops.find())
    return JSONResponse(content=json.loads(dumps(data)))

@app.get("/api/inventario", tags=["geojson"])
async def get_inventario():
    data = list(db.inventario.find())
    return JSONResponse(content=json.loads(dumps(data)))

# -----------------------------
# Run Uvicorn
# -----------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
