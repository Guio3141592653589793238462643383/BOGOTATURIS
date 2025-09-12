from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from pydantic import BaseModel, EmailStr, validator
from typing import List, Optional
import bcrypt
from datetime import datetime
import re

# Importar modelos correctos
from app.BD.bd_Relacional.db_connection import get_db, Usuario, Correo, Nacionalidad, Intereses, InteresesUsuario


router = APIRouter(prefix="/api/usuario", tags=["usuario"])

# ---------- Schemas ----------
class SignUpRequest(BaseModel):
    primer_nombre: str
    segundo_nombre: Optional[str] = None
    primer_apellido: str
    segundo_apellido: Optional[str] = None
    correo: EmailStr
    clave: str
    nacionalidad: str
    intereses: List[str]
    terminos: bool

    @validator("clave")
    def validar_password(cls, v):
        if len(v) < 8:
            raise ValueError("La contraseña debe tener al menos 8 caracteres")
        if not re.search(r"[A-Z]", v) or not re.search(r"[0-9]", v):
            raise ValueError("La contraseña debe contener mayúsculas y números")
        return v

class SignUpResponse(BaseModel):
    success: bool
    message: str
    usuario_id: Optional[int] = None

# ---------- Helpers ----------
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def buscar_nacionalidad(valor: str, db: Session) -> Optional[Nacionalidad]:
    try:
        return db.query(Nacionalidad).filter(
            (Nacionalidad.id_nac == valor) | (Nacionalidad.nacionalidad.ilike(f"%{valor}%"))
        ).first()
    except:
        return None

def validar_intereses(intereses: List[str], db: Session) -> List[int]:
    ids = []
    for interes_str in intereses:
        interes = None
        if interes_str.isdigit():
            interes = db.query(Intereses).filter(Intereses.id_inte == int(interes_str)).first()
        else:
            interes = db.query(Intereses).filter(Intereses.interes.ilike(interes_str)).first()
        if not interes:
            raise ValueError(f"El interés '{interes_str}' no existe")
        ids.append(interes.id_inte)
    return ids

# ---------- Endpoints ----------
@router.post("/registro", response_model=SignUpResponse)
def registrar_usuario(request: SignUpRequest, db: Session = Depends(get_db)):
    try:
        # 1. Verificar correo
        correo_existente = db.query(Correo).filter(Correo.correo.ilike(request.correo)).first()
        if correo_existente:
            raise HTTPException(status_code=400, detail="Este correo ya está registrado")

        # 2. Crear correo
        nuevo_correo = Correo(correo=request.correo.lower())
        db.add(nuevo_correo)
        db.flush()

        # 3. Validar nacionalidad
        nacionalidad = buscar_nacionalidad(request.nacionalidad, db)
        if not nacionalidad:
            raise HTTPException(status_code=400, detail="Nacionalidad no válida")

        # 4. Validar intereses
        intereses_ids = validar_intereses(request.intereses, db)

        # 5. Crear usuario
        nuevo_usuario = Usuario(
            primer_nombre=request.primer_nombre,
            segundo_nombre=request.segundo_nombre,
            primer_apellido=request.primer_apellido,
            segundo_apellido=request.segundo_apellido,
            clave=hash_password(request.clave),
            id_rol=1,  # rol por defecto
            id_correo=nuevo_correo.id_correo,
            id_nac=nacionalidad.id_nac
        )
        db.add(nuevo_usuario)
        db.flush()

        # 6. Asociar intereses
        for interes_id in intereses_ids:
            db.add(InteresesUsuario(id_usuario=nuevo_usuario.id_usuario, id_inte=interes_id))

        db.commit()

        return SignUpResponse(success=True, message="Usuario registrado exitosamente", usuario_id=nuevo_usuario.id_usuario)

    except HTTPException:
        db.rollback()
        raise
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Error de integridad en los datos")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error interno: {e}")

@router.get("/verificar-email/{email}")
def verificar_email(email: str, db: Session = Depends(get_db)):
    correo_existente = db.query(Correo).filter(Correo.correo.ilike(email)).first()
    return {
        "disponible": correo_existente is None,
        "mensaje": "Email disponible" if correo_existente is None else "Email ya registrado"
    }

@router.get("/nacionalidades")
def obtener_nacionalidades(db: Session = Depends(get_db)):
    return db.query(Nacionalidad).all()

@router.get("/intereses")
def obtener_intereses(db: Session = Depends(get_db)):
    return db.query(Intereses).all()
@router.post("/validar-campo")
def validar_campo(data: dict, db: Session = Depends(get_db)):
    campo = data.get("campo")
    valor = data.get("valor")

    if campo == "correo":
        correo_existente = db.query(Correo).filter(Correo.correo.ilike(valor)).first()
        return {"valido": correo_existente is None}
    
    if campo == "nacionalidad":
        nacionalidad = buscar_nacionalidad(valor, db)
        return {"valido": nacionalidad is not None}

    return {"valido": True}

