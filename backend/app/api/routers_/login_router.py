import bcrypt
from typing import List, Optional
from fastapi import APIRouter, Body, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr, Field
import jwt
from datetime import date, datetime, timedelta

from app.BD.bd_Relacional.db_connection import Intereses, InteresesUsuario, Usuario, Correo, get_db, Nacionalidad, Comentarios, Lugar, Alerta

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
    id_rol: int
    rol: str
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

    # ✅ Verificar si el email está verificado (excepto para administradores)
    from app.BD.bd_Relacional.db_connection import Rol
    rol_obj = db.query(Rol).filter(Rol.id_rol == user.id_rol).first()
    rol_nombre = rol_obj.rol if rol_obj else "usuario"
    
    if rol_nombre != "administrador" and not user.email_verificado:
        print("❌ Email no verificado para el usuario:", login_request.correo)
        raise HTTPException(
            status_code=403, 
            detail="Debes verificar tu correo electrónico antes de iniciar sesión. Revisa tu bandeja de entrada."
        )

    # ✅ Comparar contraseñas con bcrypt
    if not bcrypt.checkpw(login_request.clave.encode('utf-8'), user.clave.encode('utf-8')):
        print("❌ Contraseña incorrecta para el usuario:", login_request.correo)
        raise HTTPException(status_code=401, detail="Credenciales inválidas")

    # ✅ Generar token de acceso
    payload = {
        "user_id": user.id_usuario,
        "rol": rol_nombre,
        "exp": datetime.utcnow() + timedelta(minutes=30)
    }
    token = jwt.encode(payload, "secret_key", algorithm="HS256")

    print(f"✅ Login exitoso para usuario: {user.id_usuario} con rol: {rol_nombre}")

    return {
        "access_token": token,
        "usuario_id": user.id_usuario,
        "id_rol": user.id_rol,
        "rol": rol_nombre,
        "message": "Inicio de sesión exitoso"
    }


class UsuarioUpdateRequest(BaseModel):
    primer_nombre: str
    segundo_nombre: Optional[str] = None 
    primer_apellido: str
    segundo_apellido:  Optional[str] = None 
    id_nac: int 

class PerfilBasicoResponse(BaseModel):
    id_usuario: int
    primer_nombre: str
    segundo_nombre: Optional[str] = None 
    primer_apellido: str
    segundo_apellido: Optional[str] = None 
    correo: EmailStr
    id_nac: int
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
    tipo_com: str = Field(..., min_length=1, max_length=500)
    calificacion: int = Field(..., ge=1, le=5)  # Entre 1 y 5
    id_usuario: int
    id_lugar: int

# Schema de salida (respuesta)
class ComentarioOut(BaseModel):
    id_com: int
    tipo_com: str
    calificacion: int
    fecha_com: date
    id_usuario: int
    id_lugar: int

    class Config:
        orm_mode = True

#  CREAR COMENTARIO
@router.post("/comentarios", response_model=ComentarioOut)
def crear_comentario(com: ComentarioCreate, db: Session = Depends(get_db)):
    from datetime import date
    
    nuevo_com = Comentarios(
        tipo_com=com.tipo_com,
        calificacion=com.calificacion,
         fecha_com=date.today(),
        id_usuario=com.id_usuario,
        id_lugar=com.id_lugar
    )
    db.add(nuevo_com)
    db.commit()
    db.refresh(nuevo_com)
    return nuevo_com

#  OBTENER COMENTARIOS DE UN LUGAR
@router.get("/lugares/{id_lugar}/comentarios") 
def obtener_comentarios_lugar(id_lugar: int, db: Session = Depends(get_db)):
    # Hacemos un JOIN entre Comentarios y Usuario
    resultados = (
        db.query(
            Comentarios.id_com,
            Comentarios.tipo_com,
            Comentarios.calificacion,
            Comentarios.fecha_com,
            Comentarios.id_usuario,
            Comentarios.id_lugar,
            Usuario.primer_nombre.label("nombre"),
            Usuario.primer_apellido.label("apellido")
        )
        .join(Usuario, Comentarios.id_usuario == Usuario.id_usuario)
        .filter(Comentarios.id_lugar == id_lugar)
        .order_by(Comentarios.fecha_com.desc())
        .all()
    )

    # Convertimos los resultados en una lista de diccionarios
    comentarios = [
        {
            "id_com": r.id_com,
            "tipo_com": r.tipo_com,
            "calificacion": r.calificacion,
            "fecha_com": r.fecha_com,
            "id_usuario": r.id_usuario,
            "id_lugar": r.id_lugar,
            "nombre": r.nombre,
            "apellido": r.apellido
        }
        for r in resultados
    ]

    return comentarios
# ELIMINAR COMENTARIO

@router.delete("/comentarios/{id_com}")
def eliminar_comentario(
    id_com: int, 
    id_usuario: int,  # Validar que sea el dueño
    db: Session = Depends(get_db)
):
    comentario = db.query(Comentarios).filter(
        Comentarios.id_com == id_com,
        Comentarios.id_usuario == id_usuario  # Solo puede eliminar el dueño
    ).first()
    
    if not comentario:
        raise HTTPException(status_code=404, detail="Comentario no encontrado o no autorizado")
    
    db.delete(comentario)
    db.commit()
    return {"message": "Comentario eliminado exitosamente"}

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

@router.put("/perfil/{usuario_id}")  
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
    usuario.id_nac = usuario_update.id_nac

    db.commit()
    db.refresh(usuario)

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


    # --- ALERTAS ---
class AlertaCreate(BaseModel):
    tipo_aler: str = Field(..., min_length=1, max_length=500)
    id_lugar: int
    id_usuario: int 

class AlertaOut(BaseModel):
    id_alerta: int
    tipo_aler: str
    fecha_alerta: date
    id_lugar: int
    id_usuario: int 

    class Config:
        orm_mode = True

#  CREAR ALERTA
@router.post("/alertas", response_model=AlertaOut)
def crear_alerta(alerta: AlertaCreate, db: Session = Depends(get_db)):
    nueva_alerta = Alerta(
        tipo_aler=alerta.tipo_aler,
        fecha_alerta=date.today(),
        id_lugar=alerta.id_lugar,
        id_usuario=alerta.id_usuario,
    )
    db.add(nueva_alerta)
    db.commit()
    db.refresh(nueva_alerta)
    return nueva_alerta


#  OBTENER ALERTAS DE UN LUGAR
@router.get("/lugares/{id_lugar}/alertas")
def obtener_alertas_lugar(id_lugar: int, db: Session = Depends(get_db)):
    resultados = (
        db.query(
            Alerta.id_alerta,
            Alerta.tipo_aler,
            Alerta.fecha_alerta,
            Usuario.primer_nombre,
            Usuario.primer_apellido,
        )
        .join(Usuario, Usuario.id_usuario == Alerta.id_usuario)
        .filter(Alerta.id_lugar == id_lugar)
        .order_by(Alerta.fecha_alerta.desc())
        .all()
    )

    alertas = [
        {
            "id_alerta": r.id_alerta,
            "tipo_aler": r.tipo_aler, 
            "usuario": f"{r.primer_nombre} {r.primer_apellido}",
            "fecha": r.fecha_alerta,
        }
        for r in resultados
    ]
    return alertas


class ComentarioUpdate(BaseModel):
    tipo_com: str
    calificacion: int

@router.put("/comentario/{id_com}")
def actualizar_comentario(
    id_com: int,
    comentario_data: ComentarioUpdate,
    db: Session = Depends(get_db)
):
    comentario = db.query(Comentarios).filter(Comentarios.id_com == id_com).first()
    if not comentario:
        raise HTTPException(status_code=404, detail="Comentario no encontrado")
    
    comentario.tipo_com = comentario_data.tipo_com
    comentario.calificacion = comentario_data.calificacion

    db.commit()
    db.refresh(comentario)
    return comentario
@router.get("/", summary="Obtener todos los lugares")
def obtener_lugares(db: Session = Depends(get_db)):
    lugares = db.query(Lugar).all()
    if not lugares:
        raise HTTPException(status_code=404, detail="No hay lugares registrados")

    # Retornamos la lista de lugares con todos los campos importantes
    return [
        {
            "id_lugar": lugar.id_lugar,
            "nombre_lugar": lugar.nombre_lugar,
            "descripcion": lugar.descripcion,
            "direccion": lugar.direccion,
            "hora_aper": str(lugar.hora_aper),
            "hora_cierra": str(lugar.hora_cierra),
            "precios": lugar.precios,
            "imagen_url": lugar.imagen_url,
            "id_tipo": lugar.id_tipo,
        }
        for lugar in lugares
    ]

    




