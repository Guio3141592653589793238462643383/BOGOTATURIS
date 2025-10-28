from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import os
from pathlib import Path

from app.BD.bd_Relacional.db_connection import get_db, VisualizacionPDF, HistorialAceptaciones

router = APIRouter(prefix="/api/politicas", tags=["politicas"])

# Configuración de rutas de PDFs
BASE_DIR = Path(__file__).resolve().parent.parent.parent
PDF_DIR = BASE_DIR / "static" / "pdfs"

# Asegurar que el directorio existe
PDF_DIR.mkdir(parents=True, exist_ok=True)

# Schemas
class RegistrarVisualizacionRequest(BaseModel):
    session_id: str
    tipo_documento: str  # 'terminos' o 'tratamiento_datos'
    tiempo_visualizacion: Optional[int] = None

class VerificarVisualizacionRequest(BaseModel):
    session_id: str

class VerificarVisualizacionResponse(BaseModel):
    terminos_visto: bool
    tratamiento_visto: bool
    puede_registrarse: bool

# ---------- Endpoints ----------

@router.get("/pdf/terminos")
async def obtener_terminos_condiciones():
    """Sirve el PDF de términos y condiciones"""
    pdf_path = PDF_DIR / "terminos_condiciones.pdf"
    
    if not pdf_path.exists():
        raise HTTPException(
            status_code=404, 
            detail="El archivo de términos y condiciones no está disponible. Por favor contacta al administrador."
        )
    
    return FileResponse(
        path=pdf_path,
        media_type="application/pdf",
        headers={
            "Content-Disposition": "inline; filename=terminos_condiciones.pdf"
        }
    )

@router.get("/pdf/tratamiento-datos")
async def obtener_tratamiento_datos():
    """Sirve el PDF de tratamiento de datos"""
    pdf_path = PDF_DIR / "tratamiento_datos.pdf"
    
    if not pdf_path.exists():
        raise HTTPException(
            status_code=404,
            detail="El archivo de tratamiento de datos no está disponible. Por favor contacta al administrador."
        )
    
    return FileResponse(
        path=pdf_path,
        media_type="application/pdf",
        headers={
            "Content-Disposition": "inline; filename=tratamiento_datos.pdf"
        }
    )

@router.post("/registrar-visualizacion")
async def registrar_visualizacion(
    request: RegistrarVisualizacionRequest,
    db: Session = Depends(get_db)
):
    """Registra que un usuario visualizó un PDF"""
    try:
        # Verificar que el tipo de documento sea válido
        if request.tipo_documento not in ['terminos', 'tratamiento_datos']:
            raise HTTPException(
                status_code=400,
                detail="Tipo de documento inválido. Debe ser 'terminos' o 'tratamiento_datos'"
            )
        
        # Verificar si ya existe una visualización para esta sesión y documento
        visualizacion_existente = db.query(VisualizacionPDF).filter(
            VisualizacionPDF.session_id == request.session_id,
            VisualizacionPDF.tipo_documento == request.tipo_documento
        ).first()
        
        if visualizacion_existente:
            # Actualizar el tiempo de visualización si se proporciona
            if request.tiempo_visualizacion:
                visualizacion_existente.tiempo_visualizacion = request.tiempo_visualizacion
                visualizacion_existente.fecha_visualizacion = datetime.utcnow()
                db.commit()
            
            return {
                "success": True,
                "message": "Visualización actualizada",
                "ya_visto": True
            }
        
        # Crear nuevo registro de visualización
        nueva_visualizacion = VisualizacionPDF(
            session_id=request.session_id,
            tipo_documento=request.tipo_documento,
            fecha_visualizacion=datetime.utcnow(),
            tiempo_visualizacion=request.tiempo_visualizacion
        )
        
        db.add(nueva_visualizacion)
        db.commit()
        
        return {
            "success": True,
            "message": "Visualización registrada exitosamente",
            "ya_visto": False
        }
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al registrar visualización: {str(e)}")

@router.post("/verificar-visualizacion", response_model=VerificarVisualizacionResponse)
async def verificar_visualizacion(
    request: VerificarVisualizacionRequest,
    db: Session = Depends(get_db)
):
    """Verifica si un usuario ha visualizado ambos PDFs"""
    try:
        # Buscar visualizaciones de términos
        terminos_visto = db.query(VisualizacionPDF).filter(
            VisualizacionPDF.session_id == request.session_id,
            VisualizacionPDF.tipo_documento == 'terminos'
        ).first() is not None
        
        # Buscar visualizaciones de tratamiento de datos
        tratamiento_visto = db.query(VisualizacionPDF).filter(
            VisualizacionPDF.session_id == request.session_id,
            VisualizacionPDF.tipo_documento == 'tratamiento_datos'
        ).first() is not None
        
        puede_registrarse = terminos_visto and tratamiento_visto
        
        return VerificarVisualizacionResponse(
            terminos_visto=terminos_visto,
            tratamiento_visto=tratamiento_visto,
            puede_registrarse=puede_registrarse
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al verificar visualización: {str(e)}")

@router.get("/info")
async def obtener_info_politicas():
    """Retorna información sobre las políticas disponibles"""
    terminos_path = PDF_DIR / "terminos_condiciones.pdf"
    tratamiento_path = PDF_DIR / "tratamiento_datos.pdf"
    
    return {
        "terminos_disponible": terminos_path.exists(),
        "tratamiento_disponible": tratamiento_path.exists(),
        "ruta_terminos": "/api/politicas/pdf/terminos",
        "ruta_tratamiento": "/api/politicas/pdf/tratamiento-datos",
        "version": "1.0.0",
        "fecha_actualizacion": "2025-10-09"
    }
