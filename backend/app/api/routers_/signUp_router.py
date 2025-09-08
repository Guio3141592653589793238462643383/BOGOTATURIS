from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from werkzeug.security import generate_password_hash
from pydantic import BaseModel, validator
from typing import List, Optional
import re

# Importa tus modelos y la función get_db
# Asume que tienes estos modelos definidos según tu esquema de BD
from BD.bd_Relacional.db_connection import (
    Usuario, Correo, Nacionalidad, Rol, Intereses, InteresesUsuario, get_db
)

router = APIRouter(
    prefix="/api/usuario",
    tags=["usuario"],
)

# Esquemas de Pydantic mejorados
class UsuarioCreate(BaseModel):
    nombreCompleto: str
    apellidoCompleto: str
    correo: str
    confirmarCorreo: str
    password: str
    confirmarPassword: str
    nacionalidad: str
    intereses: List[str] = []
    terminos: bool

    @validator('nombreCompleto')
    def validar_nombre_completo(cls, v):
        nombres = v.strip().split(' ')
        nombres_filtrados = [n for n in nombres if len(n) > 0]
        if len(nombres_filtrados) < 2 or len(v) < 3:
            raise ValueError('Ingresa al menos 2 nombres completos')
        return v.strip()

    @validator('apellidoCompleto')
    def validar_apellido_completo(cls, v):
        apellidos = v.strip().split(' ')
        apellidos_filtrados = [a for a in apellidos if len(a) > 0]
        if len(apellidos_filtrados) < 2 or len(v) < 3:
            raise ValueError('Ingresa al menos 2 apellidos completos')
        return v.strip()

    @validator('correo')
    def validar_correo(cls, v):
        email_regex = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
        if not re.match(email_regex, v):
            raise ValueError('Formato de email inválido')
        return v.lower()

    @validator('confirmarCorreo')
    def validar_confirmar_correo(cls, v, values):
        if 'correo' in values and v.lower() != values['correo']:
            raise ValueError('Los correos no coinciden')
        return v.lower()

    @validator('password')
    def validar_password(cls, v):
        if len(v) < 8:
            raise ValueError('La contraseña debe tener al menos 8 caracteres')
        
        # Verificar complejidad
        criterios = 0
        if re.search(r'[a-z]', v): criterios += 1
        if re.search(r'[A-Z]', v): criterios += 1
        if re.search(r'[0-9]', v): criterios += 1
        if re.search(r'[^A-Za-z0-9]', v): criterios += 1
        
        if criterios < 2:
            raise ValueError('Contraseña muy débil. Debe contener al menos 2 tipos de caracteres (minúsculas, mayúsculas, números, símbolos)')
        
        return v

    @validator('confirmarPassword')
    def validar_confirmar_password(cls, v, values):
        if 'password' in values and v != values['password']:
            raise ValueError('Las contraseñas no coinciden')
        return v

    @validator('nacionalidad')
    def validar_nacionalidad(cls, v):
        if not v or v.strip() == "":
            raise ValueError('Debes seleccionar tu nacionalidad')
        return v

    @validator('intereses')
    def validar_intereses(cls, v):
        if len(v) == 0:
            raise ValueError('Selecciona al menos un interés turístico')
        return v

    @validator('terminos')
    def validar_terminos(cls, v):
        if not v:
            raise ValueError('Debes aceptar los términos y condiciones')
        return v

class UsuarioResponse(BaseModel):
    id_usuario: int
    primer_nombre: str
    segundo_nombre: Optional[str]
    primer_apellido: str
    segundo_apellido: Optional[str]
    correo: str
    nacionalidad: str
    intereses: List[str]
    rol: str
    mensaje: str

class NacionalidadResponse(BaseModel):
    id_nac: int
    nacionalidad: str

class InteresResponse(BaseModel):
    id_inte: int
    interes: str

class ErrorResponse(BaseModel):
    detail: str
    campo: Optional[str] = None

# Endpoint para obtener nacionalidades disponibles
@router.get("/nacionalidades", response_model=List[NacionalidadResponse])
def obtener_nacionalidades(db: Session = Depends(get_db)):
    try:
        nacionalidades = db.query(Nacionalidad).order_by(Nacionalidad.nacionalidad).all()
        return [
            {"id_nac": nac.id_nac, "nacionalidad": nac.nacionalidad} 
            for nac in nacionalidades
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener nacionalidades: {str(e)}")

# Endpoint para obtener intereses disponibles
@router.get("/intereses", response_model=List[InteresResponse])
def obtener_intereses(db: Session = Depends(get_db)):
    try:
        intereses = db.query(Intereses).order_by(Intereses.interes).all()
        return [
            {"id_inte": interes.id_inte, "interes": interes.interes} 
            for interes in intereses
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener intereses: {str(e)}")

@router.post("/registrar", response_model=UsuarioResponse)
def registrar_usuario(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    try:
        # 1. Validar que el correo no esté ya registrado
        correo_existente = db.query(Correo).filter(
            Correo.correo.ilike(usuario.correo)
        ).first()
        if correo_existente:
            raise HTTPException(
                status_code=400, 
                detail={"detail": "El correo ya está registrado", "campo": "correo"}
            )
        
        # 2. Separar nombres y apellidos
        nombres = usuario.nombreCompleto.strip().split(' ')
        nombres_filtrados = [n for n in nombres if len(n) > 0]
        apellidos = usuario.apellidoCompleto.strip().split(' ')
        apellidos_filtrados = [a for a in apellidos if len(a) > 0]
        
        primer_nombre = nombres_filtrados[0]
        segundo_nombre = ' '.join(nombres_filtrados[1:]) if len(nombres_filtrados) > 1 else None
        primer_apellido = apellidos_filtrados[0]
        segundo_apellido = ' '.join(apellidos_filtrados[1:]) if len(apellidos_filtrados) > 1 else None
        
        # 3. Hashear la contraseña
        clave_hasheada = generate_password_hash(usuario.password)
        
        # 4. Crear el correo
        correo_db = Correo(correo=usuario.correo)
        db.add(correo_db)
        db.flush()  # Para obtener el ID
        
        # 5. Buscar el rol 'usuario' (debe existir en la BD)
        rol_db = db.query(Rol).filter_by(rol='usuario').first()
        if not rol_db:
            # Crear rol por defecto si no existe
            rol_db = Rol(rol='usuario')
            db.add(rol_db)
            db.flush()
        
        # 6. Validar que la nacionalidad exista en la BD
        # Buscar por nombre exacto (case insensitive)
        nacionalidad_db = db.query(Nacionalidad).filter(
            Nacionalidad.nacionalidad.ilike(usuario.nacionalidad)
        ).first()
        if not nacionalidad_db:
            raise HTTPException(
                status_code=400, 
                detail={"detail": f"Nacionalidad '{usuario.nacionalidad}' no válida", "campo": "nacionalidad"}
            )
        
        # 7. Validar que todos los intereses existan en la BD
        intereses_db = []
        for interes_nombre in usuario.intereses:
            interes_db = db.query(Intereses).filter(
                Intereses.interes.ilike(interes_nombre.strip())
            ).first()
            if not interes_db:
                raise HTTPException(
                    status_code=400, 
                    detail={"detail": f"Interés '{interes_nombre}' no válido", "campo": "intereses"}
                )
            intereses_db.append(interes_db)
        
        # 8. Crear el usuario (sin campo de intereses directo según tu esquema)
        nuevo_usuario = Usuario(
            primer_nombre=primer_nombre,
            segundo_nombre=segundo_nombre,
            primer_apellido=primer_apellido,
            segundo_apellido=segundo_apellido,
            clave=clave_hasheada,
            id_rol=rol_db.id_rol,
            id_correo=correo_db.id_correo,
            id_nac=nacionalidad_db.id_nac
        )
        
        db.add(nuevo_usuario)
        db.flush()  # Para obtener el ID del usuario
        
        # 9. Crear las relaciones usuario-intereses en la tabla intereses_usuario
        for interes_db in intereses_db:
            interes_usuario = InteresesUsuario(
                id_usuario=nuevo_usuario.id_usuario,
                id_inte=interes_db.id_inte
            )
            db.add(interes_usuario)
        
        # 10. Confirmar todas las transacciones
        db.commit()
        db.refresh(nuevo_usuario)
        
        # 11. Preparar respuesta con todos los datos
        intereses_nombres = [interes.interes for interes in intereses_db]
        
        response_data = {
            "id_usuario": nuevo_usuario.id_usuario,
            "primer_nombre": primer_nombre,
            "segundo_nombre": segundo_nombre,
            "primer_apellido": primer_apellido,
            "segundo_apellido": segundo_apellido,
            "correo": usuario.correo,
            "nacionalidad": nacionalidad_db.nacionalidad,
            "intereses": intereses_nombres,
            "rol": rol_db.rol,
            "mensaje": "Usuario registrado exitosamente"
        }
        
        return response_data
        
    except HTTPException:
        db.rollback()
        raise
    except ValueError as ve:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error en el servidor: {str(e)}")

# Endpoint adicional para validar campos individuales (útil para validación en tiempo real)
@router.post("/validar-campo")
def validar_campo_individual(campo: str, valor: str, db: Session = Depends(get_db)):
    """Valida campos individuales para feedback en tiempo real"""
    try:
        if campo == "correo":
            # Validar formato
            email_regex = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
            if not re.match(email_regex, valor):
                return {"valido": False, "mensaje": "Formato de email inválido"}
            
            # Validar unicidad
            correo_existente = db.query(Correo).filter(
                Correo.correo.ilike(valor)
            ).first()
            if correo_existente:
                return {"valido": False, "mensaje": "El correo ya está registrado"}
            
            return {"valido": True, "mensaje": "Email disponible"}
            
        elif campo == "nacionalidad":
            nacionalidad_db = db.query(Nacionalidad).filter(
                Nacionalidad.nacionalidad.ilike(valor)
            ).first()
            if not nacionalidad_db:
                return {"valido": False, "mensaje": "Nacionalidad no válida"}
            
            return {"valido": True, "mensaje": "Nacionalidad válida"}
            
        elif campo == "interes":
            interes_db = db.query(Intereses).filter(
                Intereses.interes.ilike(valor)
            ).first()
            if not interes_db:
                return {"valido": False, "mensaje": "Interés no válido"}
            
            return {"valido": True, "mensaje": "Interés válido"}
            
        else:
            return {"valido": False, "mensaje": "Campo no reconocido"}
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al validar: {str(e)}")

# Endpoint para obtener información completa de un usuario (opcional)
@router.get("/perfil/{user_id}")
def obtener_perfil_usuario(user_id: int, db: Session = Depends(get_db)):
    try:
        # Buscar usuario
        usuario = db.query(Usuario).filter_by(id_usuario=user_id).first()
        if not usuario:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        
        # Obtener datos relacionados
        correo = db.query(Correo).filter_by(id_correo=usuario.id_correo).first()
        nacionalidad = db.query(Nacionalidad).filter_by(id_nac=usuario.id_nac).first()
        rol = db.query(Rol).filter_by(id_rol=usuario.id_rol).first()
        
        # Obtener intereses del usuario
        intereses_usuario = db.query(InteresesUsuario, Intereses).join(
            Intereses, InteresesUsuario.id_inte == Intereses.id_inte
        ).filter(InteresesUsuario.id_usuario == user_id).all()
        
        intereses_nombres = [interes.Intereses.interes for interes in intereses_usuario]
        
        return {
            "id_usuario": usuario.id_usuario,
            "primer_nombre": usuario.primer_nombre,
            "segundo_nombre": usuario.segundo_nombre,
            "primer_apellido": usuario.primer_apellido,
            "segundo_apellido": usuario.segundo_apellido,
            "correo": correo.correo if correo else None,
            "nacionalidad": nacionalidad.nacionalidad if nacionalidad else None,
            "rol": rol.rol if rol else None,
            "intereses": intereses_nombres
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener perfil: {str(e)}")