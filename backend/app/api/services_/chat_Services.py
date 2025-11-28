import re
import os
from pymongo import MongoClient
from openai import OpenAI
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

# ------------------------
# Inicialización
# ------------------------
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
client_openai = OpenAI(api_key=api_key)

client = MongoClient("mongodb://localhost:27017")
db = client["turismo"]

# Colecciones
col_turismo = db["inventario"]
col_tm = db["transmilenio_stops"]
col_sitp = db["sitp_stops"]

localidades = [
    "Usaquén", "Chapinero", "Santa Fe", "San Cristóbal", "Usme", "Tunjuelito", "Bosa", "Kennedy",
    "Fontibón", "Engativá", "Suba", "Barrios Unidos", "Teusaquillo", "Los Mártires", "Antonio Nariño",
    "Puente Aranda", "La Candelaria", "Rafael Uribe Uribe", "Ciudad Bolívar", "Sumapaz"
]

# ------------------------
# Normalización – Formatos
# ------------------------
def formatear_turismo(p):
    props = p.get("properties", {})
    return {
        "tipo": "lugar_turistico",
        "nombre": props.get("Nombre"),
        "direccion": props.get("Direccion"),
        "categoria": props.get("Tipo_de_Pa"),
        "iconografia": props.get("Iconografi"),
        "administrado_por": props.get("Nombre_Pro"),
        "telefono": props.get("Telefono"),
        "correo": props.get("Correo_Pro"),
        "coordenadas": p.get("geometry", {}).get("coordinates")
    }

def formatear_tm(p):
    props = p.get("properties", {})
    return {
        "tipo": "estacion_transmilenio",
        "nombre": props.get("nom_est"),
        "codigo": props.get("num_est"),
        "ubicacion": props.get("ub_est"),
        "coordenadas": p.get("geometry", {}).get("coordinates")
    }

def formatear_sitp(p):
    props = p.get("properties", {})
    return {
        "tipo": "paradero_sitp",
        "nombre": props.get("nombre"),
        "via": props.get("via"),
        "localidad": props.get("localidad"),
        "audio": props.get("audio"),
        "coordenadas": p.get("geometry", {}).get("coordinates")
    }

# ------------------------
# Búsquedas
# ------------------------
def buscar_lugares_texto(q):
    regex = {"$regex": q, "$options": "i"}
    return (
        list(col_turismo.find({"properties.Nombre": regex}).limit(3)) +
        list(col_tm.find({"properties.nom_est": regex}).limit(3)) +
        list(col_sitp.find({"properties.nombre": regex}).limit(3))
    )

def buscar_por_localidad(localidad):
    regex = {"$regex": localidad, "$options": "i"}
    return (
        list(col_turismo.find({"properties.LOCALIDAD": regex})) +
        list(col_sitp.find({"properties.localidad": regex}))
    )

# ------------------------
# Generar mapa
# ------------------------
def generar_mapa(lugares):
    if not lugares or not lugares[0].get("coordenadas"):
        return None

    lat, lon = lugares[0]["coordenadas"][1], lugares[0]["coordenadas"][0]
    mapa_url = f"https://www.openstreetmap.org/?mlat={lat}&mlon={lon}#map=16/{lat}/{lon}"

    leaflet_conf = {
        "center": [lat, lon],
        "zoom": 16,
        "markers": [
            {
                "nombre": l["nombre"],
                "tipo": l["tipo"],
                "position": [l["coordenadas"][1], l["coordenadas"][0]]
            }
            for l in lugares if l.get("coordenadas")
        ]
    }

    return {"url": mapa_url, "leaflet": leaflet_conf}

# ------------------------
# Extraer coordenadas del texto (fallback)
# ------------------------
def extraer_coordenadas(texto):
    match = re.findall(r"(-?\d+\.\d+)", texto)
    if len(match) >= 2:
        lat, lon = float(match[0]), float(match[1])
        return [lon, lat]
    return None

# ------------------------
# Función principal
# ------------------------
async def procesar_pregunta(pregunta: str):
    pregunta = pregunta.strip()
    if not 3 <= len(pregunta) <= 200:
        return JSONResponse(content={"reply": "Tu pregunta debe tener entre 3 y 200 caracteres."})

    localidad = next((l for l in localidades if l.lower() in pregunta.lower()), "")
    resultados_raw = buscar_por_localidad(localidad) if localidad else []

    if not resultados_raw:
        resultados_raw = buscar_lugares_texto(pregunta)

    resultados = []
    for r in resultados_raw[:5]:
        props = r.get("properties", {})
        if "Nombre" in props:
            resultados.append(formatear_turismo(r))
        elif "nom_est" in props:
            resultados.append(formatear_tm(r))
        elif "nombre" in props:
            resultados.append(formatear_sitp(r))

    contexto = (
        "No se encontró información relacionada con tu búsqueda."
        if not resultados else "\n".join([str(x) for x in resultados[:3]])
    )

    try:
        respuesta = client_openai.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "Eres un experto guía turístico de Bogotá."},
                {"role": "user", "content": f"Contexto:\n{contexto}\n\nPregunta: {pregunta}"}
            ]
        )
        texto = respuesta.choices[0].message.content.strip()
    except Exception as e:
        texto = f"No se pudo generar una respuesta automática. Error: {str(e)}"

    if not resultados:
        coords = extraer_coordenadas(texto)
        if coords:
            resultados = [{
                "tipo": "lugar_turistico",
                "nombre": pregunta,
                "direccion": "No disponible",
                "categoria": "Lugar",
                "coordenadas": coords
            }]

    mapa = generar_mapa(resultados)

    return {
        "reply": texto,
        "lugares": resultados[:3],
        "mapa": mapa
    }
