from sqlalchemy import CheckConstraint, Date, DateTime, Time, create_engine, String, BigInteger, Integer, ForeignKey, Boolean, Text, func, text
from sqlalchemy.orm import DeclarativeBase, mapped_column, sessionmaker, relationship
from datetime import datetime

# URL de conexión con driver pymysql
connection_url = 'mysql+pymysql://root@127.0.0.1:3306/BogotaTuris'

try:
    engine = create_engine(connection_url, echo=True) 
    print("✓ Database engine created successfully")
except Exception as e:
    print(f"✗ Error creating database engine: {e}")
    raise

class Base(DeclarativeBase):
    pass

class Usuario(Base):
    __tablename__ = 'usuario'

    id_usuario = mapped_column(BigInteger, primary_key=True, autoincrement=True) 
    primer_nombre = mapped_column(String(50), nullable=False)  
    segundo_nombre = mapped_column(String(250), nullable=True)
    primer_apellido = mapped_column(String(250), nullable=False)
    segundo_apellido = mapped_column(String(250), nullable=True)
    clave = mapped_column(String(250), nullable=False)
    id_rol = mapped_column(BigInteger, ForeignKey('rol.id_rol'), nullable=False)
    id_correo = mapped_column(BigInteger, ForeignKey('correo.id_correo'), nullable=False)
    id_nac = mapped_column(BigInteger, ForeignKey('nacionalidad.id_nac'), nullable=False)
    # Campos de aceptación de políticas
    acepto_terminos = mapped_column(Boolean, nullable=False, default=False)
    acepto_tratamiento_datos = mapped_column(Boolean, nullable=False, default=False)
    fecha_aceptacion_terminos = mapped_column(DateTime, nullable=True)
    fecha_aceptacion_tratamiento = mapped_column(DateTime, nullable=True)
    # Campos de verificación de email
    email_verificado = mapped_column(Boolean, nullable=False, default=False)
    fecha_verificacion_email = mapped_column(DateTime, nullable=True)
    fecha_registro = mapped_column(DateTime, server_default=func.current_timestamp())
    fecha_ultima_actualizacion = mapped_column(DateTime, server_default=func.current_timestamp(), onupdate=func.current_timestamp())
    activo = mapped_column(Boolean, server_default=text("TRUE"))


class Rol(Base):
    __tablename__ = 'rol'

    id_rol = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    rol = mapped_column(String(50), nullable=False)

class Correo(Base):
    __tablename__ = "correo"

    id_correo = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    correo = mapped_column(String(255), nullable=False, unique=True)
    fecha_creacion = mapped_column(DateTime, server_default=func.current_timestamp())

class Nacionalidad(Base):
    __tablename__ = 'nacionalidad'

    id_nac = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    nacionalidad = mapped_column(String(50), nullable=False, unique=True)  

class Intereses(Base):
    __tablename__ = 'intereses'

    id_inte = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    interes = mapped_column(String(80), nullable=False, unique=True)

class Categoria(Base):
    __tablename__ = "categoria"

    id_categoria = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    nombre_categoria = mapped_column(String(80), nullable=False)
    tipos = relationship("TipoLugar", back_populates="categoria")


class InteresCategoria(Base):
    __tablename__ = 'inte_categoria'

    id_inte_cate = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    categoria = mapped_column(String(80), nullable=False)
    id_inte = mapped_column(BigInteger, ForeignKey('intereses.id_inte'), nullable=False)

class InteresesUsuario(Base):
    __tablename__ = 'intereses_usuario'

    id_inte_usu = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    id_usuario = mapped_column(BigInteger, ForeignKey('usuario.id_usuario'), nullable=False)
    id_inte = mapped_column(BigInteger, ForeignKey('intereses.id_inte'), nullable=False)

class ReporteIncidente(Base):
    __tablename__ = "reporte_incidente"

    id_report = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    descripcion = mapped_column(String(255), nullable=False)
    fecha_report = mapped_column(DateTime, nullable=False)
    estado = mapped_column(String(80), nullable=False, server_default=text("'Pendiente'"))
    id_usuario = mapped_column(BigInteger, ForeignKey("usuario.id_usuario", ondelete="CASCADE"), nullable=False)
    id_lugar = mapped_column(BigInteger, ForeignKey("lugar.id_lugar", ondelete="SET NULL"))
    prioridad = mapped_column(String(20), server_default=text("'Media'"))

class Comentarios(Base):
    __tablename__ = 'comentarios'

    id_com = mapped_column(BigInteger, primary_key=True, autoincrement=True)  
    tipo_com = mapped_column(String(50), nullable=False)
    calificacion = mapped_column(Integer, CheckConstraint('calificacion BETWEEN 1 AND 5'), nullable=False)
    fecha_com = mapped_column(Date, nullable=False)
    id_usuario = mapped_column(BigInteger, ForeignKey('usuario.id_usuario'), nullable=False)
    id_lugar = mapped_column(BigInteger, ForeignKey('lugar.id_lugar'), nullable=True)

class TipoLugar(Base):
    __tablename__ = 'tipo_lugar'
    
    id_tipo = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    nombre_tipo = mapped_column(String(60), nullable=False, unique=True)
    id_categoria = mapped_column(BigInteger, ForeignKey("categoria.id_categoria"), nullable=True)
    categoria = relationship("Categoria", back_populates="tipos")
    lugares = relationship("Lugar", back_populates="tipo")


class Lugar(Base):
    __tablename__ = "lugar"

    id_lugar = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    nombre_lugar = mapped_column(String(60), nullable=False)
    descripcion  = mapped_column(String(255), nullable=False)
    direccion  = mapped_column(String(255), nullable=False)
    hora_aper = mapped_column(Time, nullable=False)
    hora_cierra  = mapped_column(Time, nullable=False)
    precios  = mapped_column(Integer, nullable=False)
    imagen_url = mapped_column(String(500), nullable=True)
    id_tipo = mapped_column(BigInteger, ForeignKey("tipo_lugar.id_tipo"), nullable=True)
    tipo = relationship("TipoLugar", back_populates="lugares")
class Alerta(Base):
    __tablename__ = 'alerta'

    id_alerta = mapped_column(BigInteger, primary_key=True, autoincrement=True)  
    tipo_aler = mapped_column(String(255), nullable=False)
    fecha_alerta = mapped_column(Date, nullable=False)
    id_usuario = mapped_column(BigInteger, ForeignKey('usuario.id_usuario'), nullable=False)
    id_lugar = mapped_column(BigInteger, ForeignKey('lugar.id_lugar'), nullable=False)


class HistorialAceptaciones(Base):
    __tablename__ = 'historial_aceptaciones'

    id_historial = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    id_usuario = mapped_column(BigInteger, ForeignKey('usuario.id_usuario'), nullable=False)
    tipo_documento = mapped_column(String(50), nullable=False)  # 'terminos' o 'tratamiento_datos'
    acepto = mapped_column(Boolean, nullable=False)
    fecha_accion = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    ip_address = mapped_column(String(45), nullable=True)  # Para IPv4 e IPv6
    user_agent = mapped_column(Text, nullable=True)

class VisualizacionPDF(Base):
    __tablename__ = 'visualizacion_pdf'

    id_visualizacion = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    id_usuario = mapped_column(BigInteger, ForeignKey('usuario.id_usuario'), nullable=True)  # Puede ser null si no está registrado aún
    session_id = mapped_column(String(255), nullable=False)  # Para tracking antes del registro
    tipo_documento = mapped_column(String(50), nullable=False)
    fecha_visualizacion = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    tiempo_visualizacion = mapped_column(Integer, nullable=True)  # Segundos que estuvo viendo el PDF

class TokenVerificacion(Base):
    __tablename__ = 'token_verificacion'

    id_token = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    id_usuario = mapped_column(BigInteger, ForeignKey('usuario.id_usuario'), nullable=False)
    token = mapped_column(String(255), nullable=False, unique=True)
    fecha_creacion = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    fecha_expiracion = mapped_column(DateTime, nullable=False)
    usado = mapped_column(Boolean, nullable=False, default=False)
    fecha_uso = mapped_column(DateTime, nullable=True)

SessionLocal = sessionmaker(bind=engine)

def get_db():
    """Función para obtener sesión de BD para FastAPI"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_tables():
    Base.metadata.create_all(bind=engine)