from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.BD.bd_Relacional.db_connection import get_db, Lugar, InteresesUsuario, InteresCategoria, TipoLugar

router = APIRouter(prefix="/api/recomendaciones", tags=["Recomendaciones"])

@router.get("/{id_usuario}")
def lugares_recomendados(id_usuario: int, db: Session = Depends(get_db)):
    # 1️⃣ Buscar intereses del usuario
    intereses_usuario = db.query(InteresesUsuario.id_inte).filter(
        InteresesUsuario.id_usuario == id_usuario
    ).all()

    if not intereses_usuario:
        raise HTTPException(status_code=404, detail="El usuario no tiene intereses registrados")

    ids_intereses = [i[0] for i in intereses_usuario]

    # 2️⃣ Buscar categorías asociadas a esos intereses
    categorias = db.query(InteresCategoria.id_categoria).filter(
        InteresCategoria.id_inte.in_(ids_intereses)
    ).all()

    ids_categorias = [c[0] for c in categorias]

    # 3️⃣ Buscar tipos de lugar que correspondan a esas categorías
    tipos = db.query(TipoLugar.id_tipo).filter(
        TipoLugar.id_categoria.in_(ids_categorias)
    ).all()

    ids_tipos = [t[0] for t in tipos]

    # 4️⃣ Buscar lugares con esos tipos
    lugares = db.query(Lugar).filter(Lugar.id_tipo.in_(ids_tipos)).all()

    # 5️⃣ Devolver el resultado
    return [
    {
        "id_lugar": l.id_lugar,
        "nombre": l.nombre_lugar,
        "descripcion": l.descripcion,
        "direccion": l.direccion,
        "hora_aper": str(l.hora_aper) if l.hora_aper else None,
        "hora_cierra": str(l.hora_cierra) if l.hora_cierra else None,
        "precios": l.precios,
        "imagen_url": l.imagen_url,
    }
    for l in lugares
]
