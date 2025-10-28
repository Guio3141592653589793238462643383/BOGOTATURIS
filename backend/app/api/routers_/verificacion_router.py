from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime, timedelta
import secrets

from app.BD.bd_Relacional.db_connection import get_db, Usuario, TokenVerificacion, Correo
from app.services.email_service import email_service

router = APIRouter(prefix="/api/verificacion", tags=["verificacion"])

# Schemas
class VerificarEmailRequest(BaseModel):
    token: str

class ReenviarVerificacionRequest(BaseModel):
    email: str

# ---------- Funciones auxiliares ----------

def generar_token_verificacion():
    """Genera un token único de verificación"""
    return secrets.token_urlsafe(32)

def crear_token_verificacion(db: Session, id_usuario: int):
    """Crea un token de verificación para un usuario"""
    # Eliminar tokens anteriores no usados
    db.query(TokenVerificacion).filter(
        TokenVerificacion.id_usuario == id_usuario,
        TokenVerificacion.usado == False
    ).delete()
    
    # Crear nuevo token
    token = generar_token_verificacion()
    fecha_expiracion = datetime.utcnow() + timedelta(hours=24)
    
    nuevo_token = TokenVerificacion(
        id_usuario=id_usuario,
        token=token,
        fecha_expiracion=fecha_expiracion
    )
    
    db.add(nuevo_token)
    db.commit()
    
    return token

# ---------- Endpoints ----------

@router.post("/verificar-email")
async def verificar_email(request: VerificarEmailRequest, db: Session = Depends(get_db)):
    """Verifica el email de un usuario usando el token"""
    try:
        # Buscar el token
        token_db = db.query(TokenVerificacion).filter(
            TokenVerificacion.token == request.token
        ).first()
        
        if not token_db:
            raise HTTPException(
                status_code=400,
                detail="Token inválido o no encontrado"
            )
        
        # Verificar si ya fue usado
        if token_db.usado:
            raise HTTPException(
                status_code=400,
                detail="Este token ya fue utilizado"
            )
        
        # Verificar si expiró
        if datetime.utcnow() > token_db.fecha_expiracion:
            raise HTTPException(
                status_code=400,
                detail="El token ha expirado. Por favor solicita un nuevo correo de verificación"
            )
        
        # Buscar el usuario
        usuario = db.query(Usuario).filter(
            Usuario.id_usuario == token_db.id_usuario
        ).first()
        
        if not usuario:
            raise HTTPException(
                status_code=404,
                detail="Usuario no encontrado"
            )
        
        # Verificar si ya está verificado
        if usuario.email_verificado:
            return {
                "success": True,
                "message": "Tu email ya estaba verificado",
                "ya_verificado": True
            }
        
        # Marcar email como verificado
        usuario.email_verificado = True
        usuario.fecha_verificacion_email = datetime.utcnow()
        
        # Marcar token como usado
        token_db.usado = True
        token_db.fecha_uso = datetime.utcnow()
        
        db.commit()
        
        return {
            "success": True,
            "message": "¡Email verificado exitosamente! Ya puedes iniciar sesión",
            "ya_verificado": False
        }
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al verificar email: {str(e)}")

@router.post("/reenviar-verificacion")
async def reenviar_verificacion(request: ReenviarVerificacionRequest, db: Session = Depends(get_db)):
    """Reenvía el correo de verificación a un usuario"""
    try:
        # Buscar el correo
        correo_db = db.query(Correo).filter(
            Correo.correo == request.email
        ).first()
        
        if not correo_db:
            raise HTTPException(
                status_code=404,
                detail="No existe una cuenta con ese correo electrónico"
            )
        
        # Buscar el usuario
        usuario = db.query(Usuario).filter(
            Usuario.id_correo == correo_db.id_correo
        ).first()
        
        if not usuario:
            raise HTTPException(
                status_code=404,
                detail="Usuario no encontrado"
            )
        
        # Verificar si ya está verificado
        if usuario.email_verificado:
            return {
                "success": True,
                "message": "Tu email ya está verificado. Puedes iniciar sesión",
                "ya_verificado": True
            }
        
        # Crear nuevo token
        token = crear_token_verificacion(db, usuario.id_usuario)
        
        # Enviar correo
        nombre_completo = f"{usuario.primer_nombre} {usuario.primer_apellido}"
        email_enviado = email_service.send_verification_email(
            to_email=request.email,
            usuario_nombre=nombre_completo,
            token=token
        )
        
        if not email_enviado:
            raise HTTPException(
                status_code=500,
                detail="Error al enviar el correo de verificación. Intenta nuevamente más tarde"
            )
        
        return {
            "success": True,
            "message": "Correo de verificación enviado. Revisa tu bandeja de entrada",
            "ya_verificado": False
        }
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al reenviar verificación: {str(e)}")

@router.get("/estado/{email}")
async def verificar_estado_email(email: str, db: Session = Depends(get_db)):
    """Verifica si un email está verificado"""
    try:
        # Buscar el correo
        correo_db = db.query(Correo).filter(
            Correo.correo == email
        ).first()
        
        if not correo_db:
            raise HTTPException(
                status_code=404,
                detail="No existe una cuenta con ese correo electrónico"
            )
        
        # Buscar el usuario
        usuario = db.query(Usuario).filter(
            Usuario.id_correo == correo_db.id_correo
        ).first()
        
        if not usuario:
            raise HTTPException(
                status_code=404,
                detail="Usuario no encontrado"
            )
        
        return {
            "email": email,
            "verificado": usuario.email_verificado,
            "fecha_verificacion": usuario.fecha_verificacion_email.isoformat() if usuario.fecha_verificacion_email else None
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al verificar estado: {str(e)}")
