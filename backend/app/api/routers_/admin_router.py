"""
Router de administrador con funcionalidades CRUD
Endpoints protegidos para gestión del sistema
"""
from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
import bcrypt

from app.BD.bd_Relacional.db_connection import (
    get_db, Usuario, Correo, Nacionalidad, Rol, 
    Lugar, Comentarios, ReporteIncidente, Intereses, InteresesUsuario, TipoLugar
)

router = APIRouter(
    prefix="/api/admin",
    tags=["admin"],
)

# ==================== SCHEMAS ====================

class EstadisticasResponse(BaseModel):
    total_usuarios: int
    total_lugares: int
    total_comentarios: int
    total_reportes: int

class UsuarioListItem(BaseModel):
    id_usuario: int
    primer_nombre: str
    segundo_nombre: Optional[str]
    primer_apellido: str
    segundo_apellido: Optional[str]
    correo: str
    nacionalidad: str
    rol: str
    
    class Config:
        from_attributes = True

class UsuarioUpdateAdmin(BaseModel):
    primer_nombre: str
    segundo_nombre: Optional[str] = None
    primer_apellido: str
    segundo_apellido: Optional[str] = None
    correo: EmailStr
    id_nac: int
    id_rol: int

class LugarListItem(BaseModel):
    id_lugar: int
    nombre_lugar: str
    tipo_lugar: str
    direccion: str
    precios: Optional[int]
    
    class Config:
        from_attributes = True

class ComentarioListItem(BaseModel):
    id_com: int
    tipo_com: str
    fecha_com: str
    id_usuario: int
    nombre_usuario: str
    
    class Config:
        from_attributes = True

class ReporteListItem(BaseModel):
    id_report: int
    descripcion: str
    fecha_report: str
    estado: str
    id_usuario: int
    nombre_usuario: str
    
    class Config:
        from_attributes = True

# ==================== ENDPOINTS DE ESTADÍSTICAS ====================

@router.get("/estadisticas", response_model=EstadisticasResponse)
def obtener_estadisticas(db: Session = Depends(get_db)):
    """Obtener estadísticas generales del sistema"""
    try:
        total_usuarios = db.query(func.count(Usuario.id_usuario)).scalar()
        total_lugares = db.query(func.count(Lugar.id_lugar)).scalar()
        total_comentarios = db.query(func.count(Comentarios.id_com)).scalar()
        total_reportes = db.query(func.count(ReporteIncidente.id_report)).scalar()
        
        return {
            "total_usuarios": total_usuarios or 0,
            "total_lugares": total_lugares or 0,
            "total_comentarios": total_comentarios or 0,
            "total_reportes": total_reportes or 0
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener estadísticas: {str(e)}")

# ==================== GESTIÓN DE USUARIOS ====================

@router.get("/usuarios")
def listar_usuarios(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    buscar: Optional[str] = None,
    rol: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Listar usuarios con filtros y paginación
    - buscar: Busca en nombre, apellido o correo
    - rol: Filtra por rol (usuario/administrador)
    """
    try:
        query = db.query(Usuario)
        
        # Aplicar filtro de búsqueda
        if buscar:
            correos_ids = db.query(Correo.id_correo).filter(
                Correo.correo.ilike(f"%{buscar}%")
            ).all()
            correos_ids = [c[0] for c in correos_ids]
            
            query = query.filter(
                or_(
                    Usuario.primer_nombre.ilike(f"%{buscar}%"),
                    Usuario.primer_apellido.ilike(f"%{buscar}%"),
                    Usuario.id_correo.in_(correos_ids)
                )
            )
        
        # Aplicar filtro de rol
        if rol:
            rol_obj = db.query(Rol).filter(Rol.rol == rol).first()
            if rol_obj:
                query = query.filter(Usuario.id_rol == rol_obj.id_rol)
        
        # Contar total antes de paginar
        total = query.count()
        
        # Aplicar paginación
        usuarios = query.offset(skip).limit(limit).all()
        
        # Formatear respuesta con datos relacionados
        resultado = []
        for usuario in usuarios:
            correo_obj = db.query(Correo).filter(Correo.id_correo == usuario.id_correo).first()
            nac_obj = db.query(Nacionalidad).filter(Nacionalidad.id_nac == usuario.id_nac).first()
            rol_obj = db.query(Rol).filter(Rol.id_rol == usuario.id_rol).first()
            
            resultado.append({
                "id_usuario": usuario.id_usuario,
                "primer_nombre": usuario.primer_nombre,
                "segundo_nombre": usuario.segundo_nombre,
                "primer_apellido": usuario.primer_apellido,
                "segundo_apellido": usuario.segundo_apellido,
                "correo": correo_obj.correo if correo_obj else "N/A",
                "nacionalidad": nac_obj.nacionalidad if nac_obj else "N/A",
                "rol": rol_obj.rol if rol_obj else "N/A"
            })
        
        return {
            "total": total,
            "usuarios": resultado,
            "skip": skip,
            "limit": limit
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al listar usuarios: {str(e)}")

@router.get("/usuarios/{usuario_id}")
def obtener_usuario_detalle(usuario_id: int, db: Session = Depends(get_db)):
    """Obtener detalles completos de un usuario"""
    usuario = db.query(Usuario).filter(Usuario.id_usuario == usuario_id).first()
    
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    correo_obj = db.query(Correo).filter(Correo.id_correo == usuario.id_correo).first()
    nac_obj = db.query(Nacionalidad).filter(Nacionalidad.id_nac == usuario.id_nac).first()
    rol_obj = db.query(Rol).filter(Rol.id_rol == usuario.id_rol).first()
    
    # Obtener intereses del usuario
    intereses_usuario = db.query(InteresesUsuario).filter(
        InteresesUsuario.id_usuario == usuario_id
    ).all()
    
    intereses_nombres = []
    for iu in intereses_usuario:
        interes = db.query(Intereses).filter(Intereses.id_inte == iu.id_inte).first()
        if interes:
            intereses_nombres.append(interes.interes)
    
    return {
        "id_usuario": usuario.id_usuario,
        "primer_nombre": usuario.primer_nombre,
        "segundo_nombre": usuario.segundo_nombre,
        "primer_apellido": usuario.primer_apellido,
        "segundo_apellido": usuario.segundo_apellido,
        "correo": correo_obj.correo if correo_obj else "N/A",
        "id_correo": usuario.id_correo,
        "nacionalidad": nac_obj.nacionalidad if nac_obj else "N/A",
        "id_nac": usuario.id_nac,
        "rol": rol_obj.rol if rol_obj else "N/A",
        "id_rol": usuario.id_rol,
        "intereses": intereses_nombres
    }

@router.put("/usuarios/{usuario_id}")
def actualizar_usuario_admin(
    usuario_id: int,
    datos: UsuarioUpdateAdmin,
    db: Session = Depends(get_db)
):
    """Actualizar usuario (solo administrador)"""
    usuario = db.query(Usuario).filter(Usuario.id_usuario == usuario_id).first()
    
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    try:
        # Actualizar datos básicos
        usuario.primer_nombre = datos.primer_nombre
        usuario.segundo_nombre = datos.segundo_nombre
        usuario.primer_apellido = datos.primer_apellido
        usuario.segundo_apellido = datos.segundo_apellido
        usuario.id_nac = datos.id_nac
        usuario.id_rol = datos.id_rol
        
        # Actualizar correo
        correo_obj = db.query(Correo).filter(Correo.id_correo == usuario.id_correo).first()
        if correo_obj:
            # Verificar que el nuevo correo no esté en uso por otro usuario
            correo_existente = db.query(Correo).filter(
                Correo.correo == datos.correo,
                Correo.id_correo != usuario.id_correo
            ).first()
            
            if correo_existente:
                raise HTTPException(status_code=400, detail="El correo ya está en uso")
            
            correo_obj.correo = datos.correo
        
        db.commit()
        return {"message": "Usuario actualizado exitosamente"}
        
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al actualizar usuario: {str(e)}")

@router.delete("/usuarios/{usuario_id}")
def eliminar_usuario(usuario_id: int, db: Session = Depends(get_db)):
    """Eliminar usuario (solo administrador)"""
    usuario = db.query(Usuario).filter(Usuario.id_usuario == usuario_id).first()
    
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    # Verificar que no sea el último administrador
    if usuario.id_rol == 1:  # Rol administrador
        total_admins = db.query(Usuario).filter(Usuario.id_rol == 1).count()
        if total_admins <= 1:
            raise HTTPException(
                status_code=400,
                detail="No se puede eliminar el último administrador del sistema"
            )
    
    try:
        # Eliminar relaciones primero
        db.query(InteresesUsuario).filter(InteresesUsuario.id_usuario == usuario_id).delete()
        db.query(Comentarios).filter(Comentarios.id_usuario == usuario_id).delete()
        db.query(ReporteIncidente).filter(ReporteIncidente.id_usuario == usuario_id).delete()
        db.query(Lugar).filter(Lugar.id_usuario == usuario_id).delete()
        
        # Eliminar usuario
        correo_id = usuario.id_correo
        db.delete(usuario)
        
        # Eliminar correo asociado
        correo_obj = db.query(Correo).filter(Correo.id_correo == correo_id).first()
        if correo_obj:
            db.delete(correo_obj)
        
        db.commit()
        return {"message": "Usuario eliminado exitosamente"}
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al eliminar usuario: {str(e)}")

# ==================== GESTIÓN DE LUGARES ====================
@router.get("/lugares")
def listar_lugares(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    buscar: Optional[str] = None,
    tipo: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Listar lugares turísticos con filtros:
    - buscar: nombre o dirección
    - tipo: nombre del tipo de lugar
    - paginación: skip y limit
    """
    try:
        query = db.query(Lugar)

        # Búsqueda por nombre o dirección
        if buscar:
            query = query.filter(
                or_(
                    Lugar.nombre_lugar.ilike(f"%{buscar}%"),
                    Lugar.direccion.ilike(f"%{buscar}%")
                )
            )

        # Filtrado por tipo de lugar (incluye lugares sin tipo)
        if tipo:
            query = query.join(Lugar.tipo, isouter=True).filter(
            TipoLugar.nombre_tipo.ilike(f"%{tipo}%")
        )


        total = query.count()  # total de registros filtrados
        lugares = query.offset(skip).limit(limit).all()

        # Respuesta serializada
        return {
            "total": total,
            "lugares": [
                {
                    "id_lugar": l.id_lugar,
                    "nombre_lugar": l.nombre_lugar,
                    "descripcion": l.descripcion,
                    "direccion": l.direccion,
                    "hora_aper": str(l.hora_aper),
                    "hora_cierra": str(l.hora_cierra),
                    "precios": l.precios,
                    "imagen_url": l.imagen_url,
                    "id_tipo": l.id_tipo,
                    "tipo_lugar": l.tipo.nombre_tipo if l.tipo else None
                }
                for l in lugares
            ],
            "skip": skip,
            "limit": limit
        }

    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Error al listar lugares: {str(e)}")


@router.delete("/lugares/{lugar_id}")
def eliminar_lugar(lugar_id: int, db: Session = Depends(get_db)):
    """Eliminar lugar turístico"""
    lugar = db.query(Lugar).filter(Lugar.id_lugar == lugar_id).first()
    
    if not lugar:
        raise HTTPException(status_code=404, detail="Lugar no encontrado")
    
    try:
        db.delete(lugar)
        db.commit()
        return {"message": "Lugar eliminado exitosamente"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al eliminar lugar: {str(e)}")

# ==================== GESTIÓN DE COMENTARIOS ====================

@router.get("/comentarios")
def listar_comentarios(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Listar comentarios"""
    try:
        query = db.query(Comentarios)
        total = query.count()
        comentarios = query.offset(skip).limit(limit).all()
        
        resultado = []
        for com in comentarios:
            usuario = db.query(Usuario).filter(Usuario.id_usuario == com.id_usuario).first()
            nombre_usuario = f"{usuario.primer_nombre} {usuario.primer_apellido}" if usuario else "Usuario eliminado"
            
            resultado.append({
                "id_com": com.id_com,
                "tipo_com": com.tipo_com,
                "fecha_com": str(com.fecha_com),
                "id_usuario": com.id_usuario,
                "nombre_usuario": nombre_usuario
            })
        
        return {
            "total": total,
            "comentarios": resultado,
            "skip": skip,
            "limit": limit
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al listar comentarios: {str(e)}")

@router.delete("/comentarios/{comentario_id}")
def eliminar_comentario_admin(comentario_id: int, db: Session = Depends(get_db)):
    """Eliminar comentario (moderación)"""
    comentario = db.query(Comentarios).filter(Comentarios.id_com == comentario_id).first()
    
    if not comentario:
        raise HTTPException(status_code=404, detail="Comentario no encontrado")
    
    try:
        db.delete(comentario)
        db.commit()
        return {"message": "Comentario eliminado exitosamente"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al eliminar comentario: {str(e)}")

# ==================== GESTIÓN DE REPORTES ====================

@router.get("/reportes")
def listar_reportes(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    estado: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Listar reportes de incidentes"""
    try:
        query = db.query(ReporteIncidente)
        
        if estado:
            query = query.filter(ReporteIncidente.estado.ilike(f"%{estado}%"))
        
        total = query.count()
        reportes = query.offset(skip).limit(limit).all()
        
        resultado = []
        for rep in reportes:
            usuario = db.query(Usuario).filter(Usuario.id_usuario == rep.id_usuario).first()
            nombre_usuario = f"{usuario.primer_nombre} {usuario.primer_apellido}" if usuario else "Usuario eliminado"
            
            resultado.append({
                "id_report": rep.id_report,
                "descripcion": rep.descripcion,
                "fecha_report": str(rep.fecha_report),
                "estado": rep.estado,
                "id_usuario": rep.id_usuario,
                "nombre_usuario": nombre_usuario
            })
        
        return {
            "total": total,
            "reportes": resultado,
            "skip": skip,
            "limit": limit
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al listar reportes: {str(e)}")

@router.put("/reportes/{reporte_id}/estado")
def actualizar_estado_reporte(
    reporte_id: int,
    estado: str,
    db: Session = Depends(get_db)
):
    """Actualizar estado de un reporte"""
    reporte = db.query(ReporteIncidente).filter(ReporteIncidente.id_report == reporte_id).first()
    
    if not reporte:
        raise HTTPException(status_code=404, detail="Reporte no encontrado")
    
    try:
        reporte.estado = estado
        db.commit()
        return {"message": "Estado del reporte actualizado"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al actualizar reporte: {str(e)}")
