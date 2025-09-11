from fastapi import FastAPI, Request
from pymongo import MongoClient
from dotenv import load_dotenv
from openai import OpenAI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from app.api.routers_.chat_router import router as chat_router
#from app.api.routers_.historial_router import router as historial_router
from app.api.routers_.signUp_router import router as signUp_router




load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")
client_openai = OpenAI(api_key=api_key)

app = FastAPI(
    title="BogotaTuris API",
    description="API para sistema de turismo en Bogotá",
    version="1.0.0"
)
# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # Puertos comunes de React
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = MongoClient("mongodb://localhost:27017")
db = client["turismo"]
coleccion = db["inventario"]

#@app.get("/", response_class=HTMLResponse)
#async def index(request: Request):
#    return templates.TemplateResponse("asistente.html", {"request": request})

# Incluir routers
app.include_router(chat_router)
#app.include_router(historial_router)
app.include_router(signUp_router)

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "mongodb": "connected",
        "mysql": "connected"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)