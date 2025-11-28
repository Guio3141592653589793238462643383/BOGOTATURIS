import json
from pymongo import MongoClient

# ----------------------------
# Conexión a MongoDB
# ----------------------------
client = MongoClient("mongodb://localhost:27017")
db = client["turismo"]

# ----------------------------
# Función para cargar un GeoJSON
# ----------------------------
def cargar_geojson(ruta, nombre_coleccion):
    with open(ruta, "r", encoding="utf-8") as f:
        data = json.load(f)

    coleccion = db[nombre_coleccion]

    # Limpiar colección previa
    coleccion.delete_many({})

    # Insertar características
    coleccion.insert_many(data["features"])

    # Crear índice 2dsphere si existe geometry
    try:
        coleccion.create_index([("geometry", "2dsphere")])
        print(f"Índice 2dsphere creado para {nombre_coleccion}")
    except Exception:
        print(f"{nombre_coleccion} no tiene geometry adecuado para 2dsphere")

    print(f"✔ Se importaron {len(data['features'])} documentos en {nombre_coleccion}.\n")


# ----------------------------
# CARGAS ESPECÍFICAS
# ----------------------------

# 1. Inventario turístico
cargar_geojson("inventario.geojson", "inventario")

# 2. Estaciones de TransMilenio (troncales)
cargar_geojson("Estaciones_Troncales_de_TRANSMILENIO.geojson", "transmilenio_stops")

# 3. Paraderos zonales del SITP
cargar_geojson("Paraderos_Zonales_del_SITP.geojson", "sitp_stops")

print("✨ Importación completada con éxito.")
