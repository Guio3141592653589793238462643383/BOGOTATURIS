from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.BD.bd_Relacional.db_connection import get_db, Comentarios, Lugar
from pydantic import BaseModel
from datetime import date

router = APIRouter()

class ComentarioCreate(BaseModel):
    tipo_com: str
    fecha_com: date
    id_usuario: int

@router.post("/comentarios")
def crear_comentario(com: ComentarioCreate, db: Session = Depends(get_db)):
    nuevo_com = Comentarios(
        tipo_com=com.tipo_com,
        fecha_com=com.fecha_com,
        id_usuario=com.id_usuario
    )
    db.add(nuevo_com)
    db.commit()
    db.refresh(nuevo_com)
    return {"mensaje": "Comentario creado", "comentario": nuevo_com}

@router.get("/lugares/{id_lugar}")
def get_lugar(id_lugar: int, db: Session = Depends(get_db)):
    lugar = db.query(Lugar).filter(Lugar.id_lugar == id_lugar).first()
    if not lugar:
        return {"error": "Lugar no encontrado"}
    return {
        "id_lugar": lugar.id_lugar,
        "nombre_lugar": lugar.nombre_lugar,
        "tipo_lugar": lugar.tipo_lugar,
        "direccion": lugar.direccion,
        "hora_aper": str(lugar.hora_aper),
        "hora_cierra": str(lugar.hora_cierra),
        "precios": lugar.precios
    }
