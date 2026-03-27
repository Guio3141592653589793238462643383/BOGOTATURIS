from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.BD.bd_Relacional.db_connection import TipoLugar, get_db

router = APIRouter(prefix="/api/tipos_lugar", tags=["Tipo de Lugar"])

@router.get("/")
def listar_tipos_lugar(db: Session = Depends(get_db)):
    tipos = db.query(TipoLugar).all()
    return [{"id_tipo": t.id_tipo, "nombre_tipo": t.nombre_tipo} for t in tipos]
