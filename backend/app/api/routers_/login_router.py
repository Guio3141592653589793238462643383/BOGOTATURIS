from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from werkzeug.security import check_password_hash
from pydantic import BaseModel
import jwt
from datetime import datetime, timedelta

from bd_Relacional.db_connection import Usuario, get_db

router = APIRouter(
    prefix="/api/usuario",
    tags=["usuario"],
)

class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    access_token: str

@router.post("/login", response_model=LoginResponse)
def login(login_request: LoginRequest, db: Session = Depends(get_db)):
    # Buscar al usuario por correo electrónico
    user = db.query(Usuario).filter(Usuario.id_correo.correo == login_request.email).first()
    
    if not user or not check_password_hash(user.clave, login_request.password):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")
    
    # Generar token de acceso
    payload = {
        "user_id": user.id_usuario,
        "exp": datetime.utcnow() + timedelta(minutes=30)
    }
    token = jwt.encode(payload, "secret_key", algorithm="HS256")
    
    return {"access_token": token}
