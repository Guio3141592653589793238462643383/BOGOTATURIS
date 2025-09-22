import bcrypt
from typing import List
from fastapi import APIRouter, Body, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
import jwt
from datetime import date, datetime, timedelta

from app.BD.bd_Relacional.db_connection import Intereses, InteresesUsuario, Usuario, Correo, get_db, Nacionalidad, Comentarios, Lugar

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


class UsuarioUpdateRequest(BaseModel):
    primer_nombre: str
    segundo_nombre: str = None
    primer_apellido: str
    segundo_apellido: str = None
    correo: EmailStr
    id_nac: int 

class PerfilBasicoResponse(BaseModel):
    id_usuario: int
    primer_nombre: str
    segundo_nombre: str = None
    primer_apellido: str
    segundo_apellido: str = None
    correo: EmailStr
    id_nac: int



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
            "id_nac": usuario.id_nac,  # ✅ Agrega esto

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
    
# Schema de entrada
class ComentarioCreate(BaseModel):
    tipo_com: str
    fecha_com: date
    id_usuario: int

# Schema de salida (respuesta)
class ComentarioOut(BaseModel):
    id_com: int
    tipo_com: str
    fecha_com: date
    id_usuario: int

    class Config:
        orm_mode = True

@router.post("/comentarios", response_model=ComentarioOut)
def crear_comentario(com: ComentarioCreate, db: Session = Depends(get_db)):
    nuevo_com = Comentarios(
        tipo_com=com.tipo_com,
        fecha_com=com.fecha_com,
        id_usuario=com.id_usuario
    )
    db.add(nuevo_com)
    db.commit()
    db.refresh(nuevo_com)
    return nuevo_com

@router.get("/lugares/{id_lugar}")
def get_lugar(id_lugar: int, db: Session = Depends(get_db)):
    lugar = db.query(Lugar).filter(Lugar.id_lugar == id_lugar).first()
    if not lugar:
        raise HTTPException(status_code=404, detail="Lugar no encontrado")
    return {
        "id_lugar": lugar.id_lugar,
        "nombre_lugar": lugar.nombre_lugar,
        "tipo_lugar": lugar.tipo_lugar,
        "direccion": lugar.direccion,
        "hora_aper": lugar.hora_aper,
        "hora_cierra": lugar.hora_cierra,
        "precios": lugar.precios,
        "id_usuario": lugar.id_usuario,
    }
class NacionalidadResponse(BaseModel):
    id_nac: int
    nacionalidad: str
@router.get("/nacionalidades", response_model=List[NacionalidadResponse])
def listar_nacionalidades(db: Session = Depends(get_db)):
    nacionalidades = db.query(Nacionalidad).all()
    return [
        {"id_nac": n.id_nac, "nacionalidad": n.nacionalidad}
        for n in nacionalidades
    ]

@router.put("/perfil/{usuario_id}")  # ✅ Ahora está bien indentado
def actualizar_perfil_usuario(
    usuario_id: int,
    usuario_update: UsuarioUpdateRequest = Body(...),
    db: Session = Depends(get_db)
):
    usuario = db.query(Usuario).filter(Usuario.id_usuario == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    usuario.primer_nombre = usuario_update.primer_nombre
    usuario.segundo_nombre = usuario_update.segundo_nombre
    usuario.primer_apellido = usuario_update.primer_apellido
    usuario.segundo_apellido = usuario_update.segundo_apellido
    # Buscar el correo actual

    correo_obj = db.query(Correo).filter(Correo.id_correo == usuario.id_correo).first()
    # Actualizar correo
    correo_existente = db.query(Correo).filter(Correo.correo == usuario_update.correo, Correo.id_correo != usuario.id_correo).first()
    if correo_existente:
        raise HTTPException(status_code=400, detail="Este correo ya está registrado")
    if correo_obj:
        correo_obj.correo = usuario_update.correo
        db.add(correo_obj)
        db.commit()
        db.refresh(correo_obj)
        usuario.id_correo = correo_obj.id_correo
    else:
        nuevo_correo = Correo(correo=usuario_update.correo)
        db.add(nuevo_correo)
        db.commit()
        db.refresh(nuevo_correo)
        usuario.id_correo = nuevo_correo.id_correo

    # Actualizar id_nac en usuario
    usuario.id_nac = usuario_update.id_nac

    db.commit()
    return {"message": "Perfil actualizado exitosamente"}

# Schema para la petición
class CambiarPasswordRequest(BaseModel):
    actual: str
    nueva: str

@router.post("/cambiar-password/{usuario_id}")
def cambiar_password(usuario_id: int, request: CambiarPasswordRequest, db: Session = Depends(get_db)):
    # Buscar usuario en DB
    user = db.query(Usuario).filter(Usuario.id_usuario == usuario_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    # Verificar contraseña actual
    if not bcrypt.checkpw(request.actual.encode("utf-8"), user.clave.encode("utf-8")):
        raise HTTPException(status_code=401, detail="Contraseña actual incorrecta")

    # Hashear nueva contraseña
    hashed_password = bcrypt.hashpw(request.nueva.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    # Actualizar en BD
    user.clave = hashed_password
    db.commit()

    return {"message": "Contraseña actualizada correctamente"}
    

    # lista de IDs de intereses
# ✅ Obtener intereses seleccionados por un usuario
@router.get("/intereses/{usuario_id}")
def get_intereses_usuario(usuario_id: int, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.id_usuario == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    intereses_usuario = db.query(InteresesUsuario).filter(
        InteresesUsuario.id_usuario == usuario_id
    ).all()

    return [i.id_inte for i in intereses_usuario]

@router.get("/intereses")
def get_intereses(db: Session = Depends(get_db)):
    # tu lógica aquí
    intereses = db.query(Intereses).all()
    return intereses
class InteresesUpdateRequest(BaseModel):
    intereses: list[int]

@router.post("/actualizar-intereses/{usuario_id}")
def actualizar_intereses(usuario_id: int, request: InteresesUpdateRequest, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.id_usuario == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    # 🔹 Borrar intereses previos
    db.query(InteresesUsuario).filter(InteresesUsuario.id_usuario == usuario_id).delete()

    # 🔹 Insertar los nuevos
    for interes_id in request.intereses:
        nuevo = InteresesUsuario(id_usuario=usuario_id, id_inte=interes_id)
        db.add(nuevo)

    db.commit()
    return {"message": "Intereses actualizados correctamente"}


@router.delete("/comentario/{id_com}")
def eliminar_comentario(id_com: int, db: Session = Depends(get_db)):
    comentario = db.query(Comentarios).filter(Comentarios.id_com == id_com).first()

    if not comentario:
        raise HTTPException(status_code=404, detail="Comentario no encontrado")

    db.delete(comentario)
    db.commit()

    return {"message": "Comentario eliminado correctamente"}


