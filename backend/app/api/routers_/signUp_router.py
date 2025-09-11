from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from pydantic import BaseModel, EmailStr, validator
from typing import List, Optional
import re
import bcrypt
from datetime import datetime

# Importar tus modelos y dependencias
from bd_relacional.db_connection import get_db, Correo, Usuario, Nacionalidad, Interes, UsuarioInteres

router = APIRouter(prefix="/api/usuario", tags=["usuario"])

# Schemas de validación
class NacionalidadSchema(BaseModel):
    id: int
    codigo: str
    nombre: str

class InteresSchema(BaseModel):
    id: int
    nombre: str
    descripcion: Optional[str] = None

class ValidarCampoRequest(BaseModel):
    campo: str
    valor: str

class SignUpRequest(BaseModel):
    nombreCompleto: str
    apellidoCompleto: str
    correo: EmailStr
    password: str
    nacionalidad: str  # Puede ser ID, código o nombre
    intereses: List[str]
    terminos: bool

    @validator('nombreCompleto')
    def validar_nombre(cls, v):
        if not v or len(v.strip()) < 3:
            raise ValueError('El nombre debe tener al menos 3 caracteres')
        nombres = v.strip().split()
        if len(nombres) < 2:
            raise ValueError('Debe ingresar al menos 2 nombres')
        return v.strip()

    @validator('apellidoCompleto')
    def validar_apellido(cls, v):
        if not v or len(v.strip()) < 3:
            raise ValueError('El apellido debe tener al menos 3 caracteres')
        apellidos = v.strip().split()
        if len(apellidos) < 2:
            raise ValueError('Debe ingresar al menos 2 apellidos')
        return v.strip()

    @validator('password')
    def validar_password(cls, v):
        if len(v) < 8:
            raise ValueError('La contraseña debe tener al menos 8 caracteres')
        
        # Contar tipos de caracteres
        tipos = 0
        if re.search(r'[a-z]', v):
            tipos += 1
        if re.search(r'[A-Z]', v):
            tipos += 1
        if re.search(r'[0-9]', v):
            tipos += 1
        if re.search(r'[^A-Za-z0-9]', v):
            tipos += 1
            
        if tipos < 2:
            raise ValueError('La contraseña debe contener al menos 2 tipos de caracteres diferentes')
        return v

    @validator('intereses')
    def validar_intereses(cls, v):
        if not v or len(v) == 0:
            raise ValueError('Debe seleccionar al menos un interés')
        return v

    @validator('terminos')
    def validar_terminos(cls, v):
        if not v:
            raise ValueError('Debe aceptar los términos y condiciones')
        return v

class SignUpResponse(BaseModel):
    success: bool
    message: str
    usuario_id: Optional[int] = None

# Funciones auxiliares
def hash_password(password: str) -> str:
    """Hash de la contraseña usando bcrypt"""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def buscar_nacionalidad(valor: str, db: Session) -> Optional[Nacionalidad]:
    """Busca una nacionalidad por ID, código o nombre"""
    try:
        # Intentar buscar por ID primero
        try:
            nacionalidad_id = int(valor)
            nacionalidad = db.query(Nacionalidad).filter(Nacionalidad.id == nacionalidad_id).first()
            if nacionalidad:
                return nacionalidad
        except ValueError:
            pass
        
        # Buscar por código
        nacionalidad = db.query(Nacionalidad).filter(Nacionalidad.codigo.ilike(valor)).first()
        if nacionalidad:
            return nacionalidad
        
        # Buscar por nombre (coincidencia exacta)
        nacionalidad = db.query(Nacionalidad).filter(Nacionalidad.nombre.ilike(valor)).first()
        if nacionalidad:
            return nacionalidad
        
        # Buscar por nombre (coincidencia parcial)
        nacionalidad = db.query(Nacionalidad).filter(Nacionalidad.nombre.ilike(f"%{valor}%")).first()
        return nacionalidad
        
    except Exception as e:
        print(f"Error buscando nacionalidad: {e}")
        return None

def validar_intereses_existen(intereses_ids: List[str], db: Session) -> List[int]:
    """Valida que los intereses existan y devuelve sus IDs"""
    intereses_validados = []
    
    for interes_str in intereses_ids:
        try:
            # Intentar convertir a entero
            interes_id = int(interes_str)
            interes = db.query(Interes).filter(Interes.id == interes_id).first()
            if interes:
                intereses_validados.append(interes_id)
            else:
                raise ValueError(f"El interés con ID {interes_id} no existe")
        except ValueError as ve:
            if "invalid literal" in str(ve):
                # Buscar por nombre si no es un número válido
                interes = db.query(Interes).filter(Interes.nombre.ilike(interes_str)).first()
                if interes:
                    intereses_validados.append(interes.id)
                else:
                    raise ValueError(f"El interés '{interes_str}' no existe")
            else:
                raise ve
    
    return intereses_validados

# Endpoints

@router.get("/nacionalidades", response_model=List[NacionalidadSchema])
async def obtener_nacionalidades(db: Session = Depends(get_db)):
    """Obtiene todas las nacionalidades disponibles"""
    try:
        nacionalidades = db.query(Nacionalidad).order_by(Nacionalidad.nombre).all()
        return nacionalidades
    except Exception as e:
        print(f"Error obteniendo nacionalidades: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor al obtener nacionalidades"
        )

@router.get("/intereses", response_model=List[InteresSchema])
async def obtener_intereses(db: Session = Depends(get_db)):
    """Obtiene todos los intereses disponibles"""
    try:
        intereses = db.query(Interes).order_by(Interes.nombre).all()
        return intereses
    except Exception as e:
        print(f"Error obteniendo intereses: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor al obtener intereses"
        )

@router.post("/validar-campo")
async def validar_campo(request: ValidarCampoRequest, db: Session = Depends(get_db)):
    """Valida un campo específico del formulario"""
    try:
        campo = request.campo.lower()
        valor = request.valor.strip()
        
        print(f"Validando campo: {campo} = {valor}")
        
        if campo == "correo":
            # Validar formato de email
            email_regex = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
            if not re.match(email_regex, valor):
                return {
                    "valido": False,
                    "mensaje": "Formato de email inválido"
                }
            
            # Verificar si el email ya existe
            usuario_existente = db.query(Usuario).filter(Usuario.correo.ilike(valor)).first()
            if usuario_existente:
                return {
                    "valido": False,
                    "mensaje": "Este email ya está registrado"
                }
            
            return {
                "valido": True,
                "mensaje": "Email disponible"
            }
        
        elif campo == "nacionalidad":
            nacionalidad = buscar_nacionalidad(valor, db)
            if not nacionalidad:
                return {
                    "valido": False,
                    "mensaje": "Nacionalidad no válida"
                }
            
            return {
                "valido": True,
                "mensaje": f"Nacionalidad válida: {nacionalidad.nombre}",
                "data": {
                    "id": nacionalidad.id,
                    "codigo": nacionalidad.codigo,
                    "nombre": nacionalidad.nombre
                }
            }
        
        elif campo == "intereses":
            # Validar que los intereses existan
            try:
                intereses_lista = valor.split(",") if "," in valor else [valor]
                intereses_validados = validar_intereses_existen(intereses_lista, db)
                return {
                    "valido": True,
                    "mensaje": f"Intereses válidos: {len(intereses_validados)}",
                    "data": intereses_validados
                }
            except ValueError as e:
                return {
                    "valido": False,
                    "mensaje": str(e)
                }
        
        else:
            return {
                "valido": False,
                "mensaje": f"Campo '{campo}' no soportado para validación"
            }
            
    except Exception as e:
        print(f"Error validando campo {request.campo}: {e}")
        return {
            "valido": False,
            "mensaje": "Error interno del servidor"
        }

@router.post("/registro", response_model=SignUpResponse)
async def registrar_usuario(request: SignUpRequest, db: Session = Depends(get_db)):
    """Registra un nuevo usuario"""
    try:
        print(f"Iniciando registro para: {request.correo}")
        
        # 1. Verificar si el email ya existe
        usuario_existente = db.query(Usuario).filter(Usuario.correo.ilike(request.correo)).first()
        if usuario_existente:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Este email ya está registrado"
            )
        
        # 2. Validar nacionalidad
        nacionalidad = buscar_nacionalidad(request.nacionalidad, db)
        if not nacionalidad:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Nacionalidad no válida"
            )
        
        # 3. Validar intereses
        try:
            intereses_ids = validar_intereses_existen(request.intereses, db)
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )
        
        # 4. Hash de la contraseña
        password_hash = hash_password(request.password)
        
        # 5. Crear el usuario
        nuevo_usuario = Usuario(
            nombre_completo=request.nombreCompleto,
            apellido_completo=request.apellidoCompleto,
            correo=request.correo.lower(),
            password_hash=password_hash,
            nacionalidad_id=nacionalidad.id,
            fecha_registro=datetime.utcnow(),
            activo=True
        )
        
        db.add(nuevo_usuario)
        db.flush()  # Para obtener el ID del usuario
        
        # 6. Asociar intereses del usuario
        for interes_id in intereses_ids:
            usuario_interes = UsuarioInteres(
                usuario_id=nuevo_usuario.id,
                interes_id=interes_id
            )
            db.add(usuario_interes)
        
        # 7. Confirmar transacción
        db.commit()
        
        print(f"Usuario registrado exitosamente: ID {nuevo_usuario.id}")
        
        return SignUpResponse(
            success=True,
            message="Usuario registrado exitosamente",
            usuario_id=nuevo_usuario.id
        )
        
    except HTTPException:
        db.rollback()
        raise
        
    except IntegrityError as e:
        db.rollback()
        print(f"Error de integridad: {e}")
        
        if "correo" in str(e).lower() or "email" in str(e).lower():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Este email ya está registrado"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Error de integridad en los datos"
            )
            
    except Exception as e:
        db.rollback()
        print(f"Error inesperado en registro: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )

@router.get("/verificar-email/{email}")
async def verificar_email_disponible(email: str, db: Session = Depends(get_db)):
    """Verifica si un email está disponible"""
    try:
        correo_existente = db.query(Correo).filter(Correo.correo.ilike(email)).first()
        return {
            "disponible": correo_existente is None,
            "mensaje": "Email disponible" if correo_existente is None else "Email ya registrado"
        }
    except Exception as e:
        print(f"Error verificando email: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error verificando disponibilidad del email"
        )

@router.get("/nacionalidad/{identificador}")
async def obtener_nacionalidad_por_id(identificador: str, db: Session = Depends(get_db)):
    """Obtiene una nacionalidad específica por ID o nombre"""
    try:
        nacionalidad = buscar_nacionalidad(identificador, db)
        if not nacionalidad:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Nacionalidad no encontrada"
            )
        
        return {
            "id_nac": nacionalidad.id_nac,
            "nacionalidad": nacionalidad.nacionalidad
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error obteniendo nacionalidad: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )

# Endpoint adicional para debugging (remover en producción)
@router.get("/debug/usuario/{email}")
async def debug_usuario(email: str, db: Session = Depends(get_db)):
    """Endpoint de debug para verificar datos del usuario"""
    try:
        correo_obj = db.query(Correo).filter(Correo.correo.ilike(email)).first()
        if not correo_obj:
            return {"encontrado": False}
        
        usuario = db.query(Usuario).filter(Usuario.id_correo == correo_obj.id_correo).first()
        if not usuario:
            return {"encontrado": False, "correo_existe": True, "usuario_existe": False}
        
        return {
            "encontrado": True,
            "id_usuario": usuario.id_usuario,
            "primer_nombre": usuario.primer_nombre,
            "segundo_nombre": usuario.segundo_nombre,
            "primer_apellido": usuario.primer_apellido,
            "segundo_apellido": usuario.segundo_apellido,
            "correo": correo_obj.correo,
            "id_nac": usuario.id_nac,
            "id_rol": usuario.id_rol
        }
    except Exception as e:
        print(f"Error en debug: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error en debug"
        )