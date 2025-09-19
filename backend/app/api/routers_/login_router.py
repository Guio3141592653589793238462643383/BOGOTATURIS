import bcrypt
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
import jwt
from datetime import datetime, timedelta

from app.BD.bd_Relacional.db_connection import Usuario, Correo, get_db, Nacionalidad

router = APIRouter(
    prefix="/api/usuario",
    tags=["usuario"],
)

class LoginRequest(BaseModel):
    correo: str
    clave: str

class LoginResponse(BaseModel):
    access_token: str
    usuario_id: int
    message: str

@router.post("/login", response_model=LoginResponse)
def login(login_request: LoginRequest, db: Session = Depends(get_db)):
    print("📩 Petición recibida:", login_request.dict())

    # ✅ Paso 1: Buscar si el correo existe
    correo_obj = db.query(Correo).filter(Correo.correo == login_request.correo).first()
    if not correo_obj:
        print("❌ Correo no encontrado:", login_request.correo)
        raise HTTPException(status_code=401, detail="Correo no registrado")

    # ✅ Paso 2: Buscar el usuario con ese id_correo
    user = db.query(Usuario).filter(
        Usuario.id_correo == correo_obj.id_correo
    ).first()
    print("👤 Usuario encontrado:", user)

    if not user:
        print("❌ Usuario no existe en la base de datos")
        raise HTTPException(status_code=401, detail="Usuario no encontrado")

    # ✅ Comparar contraseñas con bcrypt
    if not bcrypt.checkpw(login_request.clave.encode('utf-8'), user.clave.encode('utf-8')):
        print("❌ Contraseña incorrecta para el usuario:", login_request.correo)
        raise HTTPException(status_code=401, detail="Credenciales inválidas")

    # ✅ Generar token de acceso
    payload = {
        "user_id": user.id_usuario,
        "exp": datetime.utcnow() + timedelta(minutes=30)
    }
    token = jwt.encode(payload, "secret_key", algorithm="HS256")

    print("✅ Login exitoso para usuario:", user.id_usuario)

    return {
        "access_token": token,
        "usuario_id": user.id_usuario,
        "message": "Inicio de sesión exitoso"
    }


class PerfilBasicoResponse(BaseModel):
    """Modelo para respuesta básica del perfil"""
    id_usuario: int
    primer_nombre: str
    segundo_nombre: str = None
    primer_apellido: str
    segundo_apellido: str = None
    correo: str
    nacionalidad: str = None
    message: str

@router.get("/perfil/{usuario_id}", response_model=PerfilBasicoResponse)
def obtener_perfil_usuario(usuario_id: int, db: Session = Depends(get_db)):
    """
    Obtener información básica del perfil de un usuario
    Solo trae: nombres, apellidos, correo y nacionalidad
    """
    print(f"🔍 [PERFIL] Buscando usuario con ID: {usuario_id}")
    
    try:
        # 🔍 1. Buscar el usuario por ID
        usuario = db.query(Usuario).filter(Usuario.id_usuario == usuario_id).first()
        
        if not usuario:
            print(f"❌ [PERFIL] Usuario con ID {usuario_id} no encontrado")
            raise HTTPException(
                status_code=404, 
                detail=f"Usuario con ID {usuario_id} no encontrado"
            )
        
        print(f"✅ [PERFIL] Usuario encontrado: {usuario.primer_nombre} {usuario.primer_apellido}")
        
        # 🔍 2. Obtener el correo usando la relación
        correo_obj = db.query(Correo).filter(Correo.id_correo == usuario.id_correo).first()
        correo_texto = correo_obj.correo if correo_obj else "No disponible"
        
        # 🔍 3. Obtener la nacionalidad usando la relación
        nacionalidad_obj = db.query(Nacionalidad).filter(Nacionalidad.id_nac == usuario.id_nac).first()
        nacionalidad_texto = nacionalidad_obj.nacionalidad if nacionalidad_obj else "No disponible"
        
        print(f"✅ [PERFIL] Datos cargados - Correo: {correo_texto}, Nacionalidad: {nacionalidad_texto}")
        
        # 🎯 4. Retornar solo los datos básicos del perfil
        return {
            "id_usuario": usuario.id_usuario,
            "primer_nombre": usuario.primer_nombre,
            "segundo_nombre": usuario.segundo_nombre,
            "primer_apellido": usuario.primer_apellido,
            "segundo_apellido": usuario.segundo_apellido,
            "correo": correo_texto,
            "nacionalidad": nacionalidad_texto,
            "message": "Perfil básico obtenido exitosamente"
        }
        
    except HTTPException:
        # Re-lanzar errores HTTP específicos
        raise
    except Exception as e:
        print(f"💥 [PERFIL] Error inesperado: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error interno del servidor: {str(e)}"
        )