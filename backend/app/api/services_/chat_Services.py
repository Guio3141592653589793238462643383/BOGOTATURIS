# app/services/chat_service.py
from pymongo import MongoClient
from openai import OpenAI
from fastapi.responses import JSONResponse
import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
client_openai = OpenAI(api_key=api_key)

# Conexión a MongoDB
client = MongoClient("mongodb://localhost:27017")
db = client["turismo"]
coleccion = db["inventario"]

localidades = [
    "Usaquén", "Chapinero", "Santa Fe", "San Cristóbal", "Usme", "Tunjuelito", "Bosa", "Kennedy",
    "Fontibón", "Engativá", "Suba", "Barrios Unidos", "Teusaquillo", "Los Mártires", "Antonio Nariño",
    "Puente Aranda", "La Candelaria", "Rafael Uribe Uribe", "Ciudad Bolívar", "Sumapaz"
]

# Funciones auxiliares
def buscar_por_localidad(localidad):
    resultados = coleccion.find({"properties.LOCALIDAD": {"$regex": localidad, "$options": "i"}})
    lugares = list(resultados)
    if not lugares:
        return None
    return formatear_lugares(lugares)

def buscar_por_nombre(nombre):
    resultado = coleccion.find_one({"properties.Nombre": {"$regex": nombre, "$options": "i"}})
    return formatear_lugar(resultado) if resultado else None

def buscar_en_campos(pregunta):
    campos = [
        "Nombre", "Direccion", "Tipo_de_Pa", "Iconografi",
        "Nombre_Pro", "Correo_Pro", "Telefono"
    ]
    filtros = [{"properties." + campo: {"$regex": pregunta, "$options": "i"}} for campo in campos]
    resultados = coleccion.find({"$or": filtros}).limit(5)
    lugares = list(resultados)
    return formatear_lugares(lugares) if lugares else None

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

def formatear_lugares(lista):
    return "\n\n".join([formatear_lugar({"properties": l["properties"]}) for l in lista[:5]])

# Función principal para procesar la pregunta
async def procesar_pregunta(pregunta: str):
    pregunta = pregunta.strip()
    if not 3 <= len(pregunta) <= 200:
        return JSONResponse(content={"reply": "Tu pregunta debe tener entre 3 y 200 caracteres."})

    # Buscar contexto
    localidad = next((l for l in localidades if l.lower() in pregunta.lower()), "")
    contexto = buscar_por_localidad(localidad) if localidad else None

    if not contexto:
        contexto = buscar_por_nombre(pregunta)

    if not contexto:
        contexto = buscar_en_campos(pregunta)

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

        # Guardar en historial
        db["historial"].insert_one({
            "pregunta": pregunta,
            "respuesta": texto_respuesta,
            "contexto_utilizado": contexto,
            "modelo": "gpt-4"
        })

        return {"reply": texto_respuesta}

    except Exception as e:
        return JSONResponse(content={"reply": f"Error al procesar la solicitud: {str(e)}"})
