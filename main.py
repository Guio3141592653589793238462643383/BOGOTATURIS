#Importaciones necesarias
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from pymongo import MongoClient
from dotenv import load_dotenv
from openai import OpenAI
import os

#Cargar variables de entorno
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
client_openai = OpenAI(api_key=api_key)

#Inicializar FastAPI y carpetas
app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

#Conexión a MongoDB
client = MongoClient("mongodb://localhost:27017")
db = client["turismo"]
coleccion = db["inventario"]

#Modelo de datos para la petición
class Mensaje(BaseModel):
    mensaje: str

#Ruta principal
@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("asistente.html", {"request": request})

#Buscar por localidad
def buscar_por_localidad(localidad):
    resultados = coleccion.find({"properties.LOCALIDAD": {"$regex": localidad, "$options": "i"}})
    lugares = list(resultados)
    if not lugares:
        return None
    return formatear_lugares(lugares)

#Buscar por nombre
def buscar_por_nombre(nombre):
    resultado = coleccion.find_one({"properties.Nombre": {"$regex": nombre, "$options": "i"}})
    return formatear_lugar(resultado) if resultado else None

#Buscar en múltiples campos
def buscar_en_campos(pregunta):
    campos = [
        "Nombre", "Direccion", "Tipo_de_Pa", "Iconografi",
        "Nombre_Pro", "Correo_Pro", "Telefono"
    ]
    filtros = [{"properties." + campo: {"$regex": pregunta, "$options": "i"}} for campo in campos]
    resultados = coleccion.find({"$or": filtros}).limit(5)
    lugares = list(resultados)
    return formatear_lugares(lugares) if lugares else None

#Formatear un solo lugar
def formatear_lugar(p):
    props = p["properties"]
    return (
        f" *{props.get('Nombre', 'Sin nombre')}*\n"
        f" Dirección: {props.get('Direccion', 'No disponible')}\n"
        f" Tipo: {props.get('Tipo_de_Pa', 'No disponible')}\n"
        f"Iconografía: {props.get('Iconografi', 'No disponible')}\n"
        f" Administrado por: {props.get('Nombre_Pro', 'No disponible')}\n"
        f" Contacto: {props.get('Correo_Pro', 'No disponible')} / "
        f"{int(props['Telefono']) if props.get('Telefono') else 'Sin teléfono'}\n"
        f" Coordenadas: Lat {props.get('Latitud')}, Lon {props.get('Longitud')}"
    )

#Formatear múltiples lugares
def formatear_lugares(lista):
    return "\n\n".join([formatear_lugar({"properties": l["properties"]}) for l in lista[:5]])

#Ruta POST para el chatbot
@app.post("/chat")
async def chat(request: Mensaje):
    pregunta = request.mensaje.strip()
    if not 3<=len(pregunta)<=200:
        return JSONResponse(content={"reply": "Tu pregunta debe tener entre 3 y 200 caracteres."    })

    localidades = [
        "Usaquén", "Chapinero", "Santa Fe", "San Cristóbal", "Usme", "Tunjuelito", "Bosa", "Kennedy",
        "Fontibón", "Engativá", "Suba", "Barrios Unidos", "Teusaquillo", "Los Mártires", "Antonio Nariño",
        "Puente Aranda", "La Candelaria", "Rafael Uribe Uribe", "Ciudad Bolívar", "Sumapaz"
    ]

    #Buscar por localidad
    localidad = next((l for l in localidades if l.lower() in pregunta.lower()), "")
    contexto = buscar_por_localidad(localidad) if localidad else None

    #Buscar por nombre del lugar
    if not contexto:
        contexto = buscar_por_nombre(pregunta)

    # Buscar en todos los campos
    if not contexto:
        contexto = buscar_en_campos(pregunta)

    # Si no se encontró nada
    if not contexto:
        contexto = "No se encontró información relacionada con tu pregunta."

    # Llamada a OpenAI
    try:
        respuesta = client_openai.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "Eres un guía turístico de Bogotá con acceso a una base de datos oficial. Sé claro, útil y breve."},
            {"role": "user", "content": f"{contexto}\n\nPregunta: {pregunta}"}
        ]
    )
        texto_respuesta = respuesta.choices[0].message.content.strip()
        # Guardar en MongoDB el historial
        db["historial"].insert_one({
    "pregunta": pregunta,
    "respuesta": texto_respuesta,
    "contexto_utilizado": contexto,
    "modelo": "gpt-4"
})

    except Exception as e:
        return JSONResponse(content={"reply": f"Error al procesar la solicitud: {str(e)}"})

    return JSONResponse(content={"reply": texto_respuesta})


# Ruta para ver el historial de preguntas y respuestas
from fastapi import Request
from bson import ObjectId  # Cuando usa _id

@app.get("/historial", response_class=HTMLResponse)
async def historial(request: Request):
    registros = list(db["historial"].find())
    return templates.TemplateResponse("historial.html", {"request": request, "registros": registros})