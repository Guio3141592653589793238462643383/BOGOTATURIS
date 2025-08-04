import json
from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")
db = client["turismo"]
coleccion = db["inventario"]

with open("inventario.geojson", "r", encoding="utf-8") as f:
    geojson = json.load(f)

coleccion.delete_many({})
coleccion.insert_many(geojson["features"])

print(f"✅ Se importaron {len(geojson['features'])} lugares.")
