import bcrypt
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
import jwt
from datetime import datetime, timedelta

from app.BD.bd_Relacional.db_connection import Usuario, Correo, get_db

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
