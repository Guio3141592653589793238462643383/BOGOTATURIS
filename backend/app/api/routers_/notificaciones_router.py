from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

from app.BD.bd_Relacional.db_connection import get_db, Usuario, Correo, HistorialAceptaciones
from app.services.email_service import email_service

router = APIRouter(prefix="/api/notificaciones", tags=["notificaciones"])

# Schemas
class NotificarCambioPoliticasRequest(BaseModel):
    tipo_documento: str  # 'terminos' o 'tratamiento_datos'
    mensaje_adicional: Optional[str] = None

class NotificarCambioPoliticasResponse(BaseModel):
    success: bool
    message: str
    usuarios_notificados: int
    errores: int

# ---------- Endpoints ----------

@router.post("/notificar-cambio-politicas", response_model=NotificarCambioPoliticasResponse)
async def notificar_cambio_politicas(
    request: NotificarCambioPoliticasRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """
    Notifica a todos los usuarios registrados sobre cambios en las políticas
    
    Este endpoint:
    1. Obtiene todos los usuarios activos
    2. Envía correos de notificación en segundo plano
    3. Registra la notificación en el historial
    """
    try:
        # Validar tipo de documento
        if request.tipo_documento not in ['terminos', 'tratamiento_datos']:
            raise HTTPException(
                status_code=400,
                detail="Tipo de documento inválido. Debe ser 'terminos' o 'tratamiento_datos'"
            )
        
        # Obtener todos los usuarios con sus correos
        usuarios = db.query(Usuario, Correo).join(
            Correo, Usuario.id_correo == Correo.id_correo
        ).all()
        
        if not usuarios:
            return NotificarCambioPoliticasResponse(
                success=True,
                message="No hay usuarios registrados para notificar",
                usuarios_notificados=0,
                errores=0
            )
        
        # Preparar lista de correos
        usuarios_data = []
        for usuario, correo in usuarios:
            usuarios_data.append({
                'id_usuario': usuario.id_usuario,
                'nombre': usuario.primer_nombre,
                'correo': correo.correo
            })
        
        # Enviar correos en segundo plano
        def enviar_notificaciones():
            exitosos = 0
            errores = 0
            
            for user_data in usuarios_data:
                try:
                    # Enviar correo
                    resultado = email_service.send_policy_update_notification(
                        to_email=user_data['correo'],
                        policy_type=request.tipo_documento,
                        usuario_nombre=user_data['nombre']
                    )
                    
                    if resultado:
                        exitosos += 1
                        
                        # Registrar en historial (opcional)
                        # Esto registra que se notificó al usuario, no que aceptó
                        historial = HistorialAceptaciones(
                            id_usuario=user_data['id_usuario'],
                            tipo_documento=request.tipo_documento,
                            acepto=False,  # False porque es solo una notificación
                            fecha_accion=datetime.utcnow()
                        )
                        db.add(historial)
                    else:
                        errores += 1
                        
                except Exception as e:
                    print(f"Error al notificar a {user_data['correo']}: {e}")
                    errores += 1
            
            try:
                db.commit()
            except Exception as e:
                print(f"Error al guardar historial: {e}")
                db.rollback()
            
            print(f"✅ Notificaciones enviadas: {exitosos} exitosas, {errores} errores")
        
        # Agregar tarea en segundo plano
        background_tasks.add_task(enviar_notificaciones)
        
        return NotificarCambioPoliticasResponse(
            success=True,
            message=f"Proceso de notificación iniciado. Se enviarán correos a {len(usuarios_data)} usuarios.",
            usuarios_notificados=len(usuarios_data),
            errores=0
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al procesar notificaciones: {str(e)}")

@router.post("/notificar-usuario-especifico")
async def notificar_usuario_especifico(
    usuario_id: int,
    tipo_documento: str,
    db: Session = Depends(get_db)
):
    """
    Notifica a un usuario específico sobre cambios en las políticas
    """
    try:
        # Validar tipo de documento
        if tipo_documento not in ['terminos', 'tratamiento_datos']:
            raise HTTPException(
                status_code=400,
                detail="Tipo de documento inválido"
            )
        
        # Obtener usuario y correo
        usuario_correo = db.query(Usuario, Correo).join(
            Correo, Usuario.id_correo == Correo.id_correo
        ).filter(Usuario.id_usuario == usuario_id).first()
        
        if not usuario_correo:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        
        usuario, correo = usuario_correo
        
        # Enviar correo
        resultado = email_service.send_policy_update_notification(
            to_email=correo.correo,
            policy_type=tipo_documento,
            usuario_nombre=usuario.primer_nombre
        )
        
        if resultado:
            # Registrar en historial
            historial = HistorialAceptaciones(
                id_usuario=usuario.id_usuario,
                tipo_documento=tipo_documento,
                acepto=False,
                fecha_accion=datetime.utcnow()
            )
            db.add(historial)
            db.commit()
            
            return {
                "success": True,
                "message": f"Notificación enviada a {correo.correo}"
            }
        else:
            raise HTTPException(status_code=500, detail="Error al enviar correo")
            
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@router.get("/test-email")
async def test_email():
    """
    Endpoint de prueba para verificar configuración de correo
    """
    try:
        resultado = email_service.send_email(
            to_email=email_service.smtp_user,  # Enviar a ti mismo
            subject="Prueba de Correo - BogotaTuris",
            html_content="<h1>¡Correo de prueba exitoso!</h1><p>La configuración de correo funciona correctamente.</p>",
            text_content="Correo de prueba exitoso. La configuración funciona correctamente."
        )
        
        if resultado:
            return {
                "success": True,
                "message": "Correo de prueba enviado exitosamente",
                "smtp_server": email_service.smtp_server,
                "smtp_user": email_service.smtp_user
            }
        else:
            return {
                "success": False,
                "message": "Error al enviar correo de prueba"
            }
    except Exception as e:
        return {
            "success": False,
            "message": f"Error: {str(e)}"
        }
