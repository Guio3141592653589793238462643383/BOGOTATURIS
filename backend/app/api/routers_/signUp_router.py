from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from werkzeug.security import generate_password_hash
from pydantic import BaseModel
from typing import List, Optional

# Importa tus modelos y la función get_db
from bd_Relacional.db_connection import Usuario, Correo, Nacionalidad, Rol, Intereses, get_db

router = APIRouter(
    prefix="/api/usuario",
    tags=["usuario"],
)

# Esquemas de Pydantic
class UsuarioCreate(BaseModel):
    nombreCompleto: str
    apellidoCompleto: str
    correo: str
    password: str
    nacionalidad: str
    intereses: Optional[List[str]] = []  

class UsuarioResponse(BaseModel):
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

@router.post("/registrar", response_model=UsuarioResponse)
def registrar_usuario(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    try:
        # 1. Validar que el correo no esté ya registrado
        correo_existente = db.query(Correo).filter_by(correo=usuario.correo).first()
        if correo_existente:
            raise HTTPException(status_code=400, detail="El correo ya está registrado")
        
        # 2. Separar nombres y apellidos
        nombres = usuario.nombreCompleto.strip().split(' ')
        apellidos = usuario.apellidoCompleto.strip().split(' ')
        
        if len(nombres) < 1 or len(apellidos) < 1:
            raise HTTPException(status_code=400, detail="Nombre y apellido son obligatorios")

        primer_nombre = nombres[0]
        segundo_nombre = nombres[1] if len(nombres) > 1 else None
        primer_apellido = apellidos[0]
        segundo_apellido = apellidos[1] if len(apellidos) > 1 else None
        
        # 3. Hashear la contraseña
        clave_hasheada = generate_password_hash(usuario.password)
        
        # 4. Crear el correo
        correo_db = Correo(correo=usuario.correo)
        db.add(correo_db)
        db.flush()  # Para obtener el ID
        
        # 5. Buscar el rol 'usuario' (asegúrate de que exista en la BD)
        rol_db = db.query(Rol).filter_by(rol='usuario').first()
        if not rol_db:
            rol_db = Rol(rol='usuario')
            db.add(rol_db)
            db.flush()
        
        # 6. Buscar o crear la nacionalidad
        nacionalidad_db = db.query(Nacionalidad).filter_by(nacionalidad=usuario.nacionalidad).first()
        if not nacionalidad_db:
            nacionalidad_db = Nacionalidad(nacionalidad=usuario.nacionalidad)
            db.add(nacionalidad_db)
            db.flush()
        
        # 7. Manejar intereses (opcional)
        id_inte = None
        for interes in usuario.intereses:
            interes_db = db.query(Intereses).filter_by(interes=interes).first()
            if not interes_db:
                interes_db = Intereses(interes=interes)
                db.add(interes_db)
                db.flush()
            id_inte = interes_db.id_inte  # Guarda el último interés encontrado
        
        # 8. Crear el usuario
        nuevo_usuario = Usuario(
            primer_nombre=primer_nombre,
            segundo_nombre=segundo_nombre,
            primer_apellido=primer_apellido,
            segundo_apellido=segundo_apellido,
            clave=clave_hasheada,
            id_rol=rol_db.id_rol,
            id_correo=correo_db.id_correo,
            id_nac=nacionalidad_db.id_nac,
            id_inte=id_inte
        )
        
        db.add(nuevo_usuario)
        db.commit()
        db.refresh(nuevo_usuario)
        
        return {
            "mensaje": "Usuario registrado exitosamente",
            "id_usuario": nuevo_usuario.id_usuario,
            "primer_nombre": primer_nombre,
            "primer_apellido": primer_apellido,
            "correo": usuario.correo,
            "nacionalidad": usuario.nacionalidad,
            "rol": rol_db.rol
        }
        
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error en el servidor: {str(e)}")
