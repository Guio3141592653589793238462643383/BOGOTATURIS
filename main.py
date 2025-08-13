from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pymongo import MongoClient
from dotenv import load_dotenv
from openai import OpenAI
import os

from backend.app.api.routers_.chat_router import router as chat_router
from backend.app.api.routers_.historial_router import router as historial_router


load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")
client_openai = OpenAI(api_key=api_key)

app = FastAPI()
app.mount("/static", StaticFiles(directory="frontend/static"), name="static")
templates = Jinja2Templates(directory="frontend/templates")

client = MongoClient("mongodb://localhost:27017")
db = client["turismo"]
coleccion = db["inventario"]

@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("asistente.html", {"request": request})

# Incluir routers
app.include_router(chat_router)
app.include_router(historial_router)
 