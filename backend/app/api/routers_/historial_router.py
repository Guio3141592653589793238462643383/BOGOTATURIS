# historial_router.py
from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from pymongo import MongoClient
from bson import ObjectId
import os

router = APIRouter()
templates = Jinja2Templates(directory="templates")

# Conexión a MongoDB (ajusta si estás usando una instancia compartida)
client = MongoClient("mongodb://localhost:27017")
db = client["turismo"]

@router.get("/historial", response_class=HTMLResponse)
async def historial(request: Request):
    registros = list(db["historial"].find())
    return templates.TemplateResponse("historial.html", {"request": request, "registros": registros})
