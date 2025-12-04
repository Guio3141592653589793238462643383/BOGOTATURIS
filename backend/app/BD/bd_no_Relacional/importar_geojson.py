import json
import os
from pymongo import MongoClient

# Leer desde variable de entorno o usar localhost por defecto
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "turismo")

print(f"🔌 Conectando a: {MONGO_URI}")

try:
    client = MongoClient(MONGO_URI)
    db = client[MONGO_DB_NAME]
    coleccion = db["inventario"]
    
    # Verificar conexión
    client.admin.command('ping')
    print("✅ Conexión exitosa a MongoDB")
    
    with open("inventario.geojson", "r", encoding="utf-8") as f:
        geojson = json.load(f)
    
    # Limpiar colección existente
    result = coleccion.delete_many({})
    print(f"🗑️  Eliminados {result.deleted_count} documentos previos")
    
    # Insertar nuevos datos
    coleccion.insert_many(geojson["features"])
    print(f"✅ Se importaron {len(geojson['features'])} lugares exitosamente")
    
except Exception as e:
    print(f"❌ Error: {e}")
finally:
    client.close()