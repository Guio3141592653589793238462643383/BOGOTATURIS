import os
import uuid
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from app.BD.bd_Relacional.db_connection import Lugar, get_db 

router = APIRouter()

# Carpeta donde se guardarán las imágenes
UPLOAD_DIR = "uploads/lugares"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Generar nombres seguros y únicos
def secure_filename(filename: str) -> str:
    ext = filename.split(".")[-1] if "." in filename else ""
    return f"{uuid.uuid4().hex}.{ext}" if ext else uuid.uuid4().hex


# -------------------------
# POST - Crear lugar
# -------------------------
@router.post("/", response_model=dict)
async def crear_lugar(
    nombre_lugar: str = Form(...),
    descripcion: str = Form(None),
    direccion: str = Form(None),
    hora_aper: str = Form(None),
    hora_cierra: str = Form(None),
    precios: int = Form(0),
    imagen_url: str = Form(None),
    id_tipo: int = Form(...),
    imagen: UploadFile = File(None), 
    db: Session = Depends(get_db)
):
    final_imagen_url = imagen_url

    # Si viene una imagen nueva subida
    if imagen:
        content = await imagen.read()
        if len(content) > 5 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="Imagen demasiado grande (máx. 5MB)")

        filename = secure_filename(imagen.filename)
        path = os.path.join(UPLOAD_DIR, filename)
        with open(path, "wb") as f:
            f.write(content)
        final_imagen_url = f"/uploads/lugares/{filename}"

    # Crear registro en la BD
    nuevo = Lugar(
        nombre_lugar=nombre_lugar,
        descripcion=descripcion,
        direccion=direccion,
        hora_aper=hora_aper,
        hora_cierra=hora_cierra,
        precios=precios,
        imagen_url=final_imagen_url,
        id_tipo=id_tipo
    )

    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)

    return {
        "message": "Lugar creado correctamente",
        "lugar": {
            "id_lugar": nuevo.id_lugar,
            "nombre_lugar": nuevo.nombre_lugar,
            "imagen_url": nuevo.imagen_url,
             "id_tipo": nuevo.id_tipo,
        }
    }


# -------------------------
# GET - Listar lugares
# -------------------------
@router.get("/", response_model=list)
def listar_lugares(db: Session = Depends(get_db)):
    lugares = db.query(Lugar).all()
    host = "http://localhost:8000"  # Cambia si tu backend usa otro dominio o puerto
    resultado = []

    for l in lugares:
        resultado.append({
            "id_lugar": l.id_lugar,
            "nombre_lugar": l.nombre_lugar,
            "tipo_lugar": {
                "id_tipo": l.id_tipo,
                "nombre_tipo": l.tipo.nombre_tipo if l.tipo else None
            }, 
            "direccion": l.direccion,
            "hora_aper": str(l.hora_aper) if l.hora_aper else None,
            "hora_cierra": str(l.hora_cierra) if l.hora_cierra else None,
            "precios": l.precios,
            "imagen_url": f"{host}{l.imagen_url}" if l.imagen_url else None
        })

    return resultado


@router.get("/imagenes")
def listar_imagenes():
    archivos = os.listdir(UPLOAD_DIR)
    imagenes = [
        {"nombre": archivo, "url": f"uploads/lugares/{archivo}"}
        for archivo in archivos if archivo.endswith((".jpg", ".png", ".jpeg"))
    ]
    return imagenes

