from sqlalchemy import Date, DateTime, Time, create_engine, String, Integer, Column, ForeignKey
from sqlalchemy.orm import DeclarativeBase, mapped_column, sessionmaker

connection_url = 'mysql://root@127.0.0.1:3306/BogotaTuris'

engine = create_engine(connection_url)

class Base(DeclarativeBase):
    pass

class Usuario(Base):
    __tablename__ = 'usuario'

    id_usuario = mapped_column(Integer, primary_key=True, autoincrement=True)  # Agregado autoincrement
    primer_nombre = mapped_column(String(50), nullable=False)  # Agregado nullable
    segundo_nombre = mapped_column(String(50), nullable=True)
    primer_apellido = mapped_column(String(50), nullable=False)
    segundo_apellido = mapped_column(String(50), nullable=True)
    clave = mapped_column(String(255), nullable=False)  # Aumentado a 255 para hash
    id_rol = mapped_column(Integer, ForeignKey('rol.id_rol'), nullable=False)
    id_correo = mapped_column(Integer, ForeignKey('correo.id_correo'), nullable=False)
    id_nac = mapped_column(Integer, ForeignKey('nacionalidad.id_nac'), nullable=False)
    id_inte = mapped_column(Integer, ForeignKey('intereses.id_inte'), nullable=True)  # Opcional

class Rol(Base):
    __tablename__ = 'rol'

    id_rol = Column(Integer, primary_key=True, autoincrement=True)
    rol = Column(String(20), nullable=False, unique=True)  # Agregado unique

class Correo(Base):
    __tablename__ = 'correo'

    id_correo = Column(Integer, primary_key=True, autoincrement=True)
    correo = Column(String(255), nullable=False, unique=True)  # Agregado unique

class Nacionalidad(Base):
    __tablename__ = 'nacionalidad'

    id_nac = Column(Integer, primary_key=True, autoincrement=True)
    nacionalidad = Column(String(50), nullable=False, unique=True)  # Agregado unique

class Intereses(Base):
    __tablename__ = 'intereses'

    id_inte = Column(Integer, primary_key=True, autoincrement=True)
    interes = Column(String(80), nullable=False, unique=True)  # Agregado unique

class InteresCategoria(Base):
    __tablename__ = 'inte_categoria'

    id_inte_cate = Column(Integer, primary_key=True, autoincrement=True)
    categoria = Column(String(80), nullable=False)
    id_inte = Column(Integer, ForeignKey('intereses.id_inte'), nullable=False)

class ReporteIncidente(Base):
    __tablename__ = 'reporte_incidente'

    id_report = Column(Integer, primary_key=True, autoincrement=True)
    descripcion = Column(String(255), nullable=False)
    fecha_report = Column(DateTime, nullable=False)
    estado = Column(String(80), nullable=False)
    id_usuario = Column(Integer, ForeignKey('usuario.id_usuario'), nullable=False)

class Comentarios(Base):
    __tablename__ = 'comentarios'

    id_com = Column(Integer, primary_key=True, autoincrement=True)  # Agregado autoincrement
    tipo_com = Column(String(50), nullable=False)
    fecha_com = Column(Date, nullable=False)
    id_usuario = Column(Integer, ForeignKey('usuario.id_usuario'), nullable=False)

class Lugar(Base):
    __tablename__ = 'lugar'

    id_lugar = Column(Integer, primary_key=True, autoincrement=True)  # Agregado autoincrement
    nombre_lugar = Column(String(60), nullable=False)
    tipo_lugar = Column(String(60), nullable=False)
    direccion = Column(String(255), nullable=False)
    hora_aper = Column(Time, nullable=True)  # Cambiado a nullable=True
    hora_cierra = Column(Time, nullable=True)
    precios = Column(Integer, nullable=True, default=0)  # Cambiado a nullable=True
    id_usuario = Column(Integer, ForeignKey('usuario.id_usuario'), nullable=False)

class Alerta(Base):
    __tablename__ = 'alerta'

    id_alerta = Column(Integer, primary_key=True, autoincrement=True)  # Agregado autoincrement
    tipo_aler = Column(String(255), nullable=False)
    fecha_alerta = Column(Date, nullable=False)
    id_lugar = Column(Integer, ForeignKey('lugar.id_lugar'), nullable=False)

class Rutas(Base):
    __tablename__ = 'rutas'

    id_ruta = Column(Integer, primary_key=True, autoincrement=True)
    inicio_ruta = Column(String(50), nullable=False)
    fin_ruta = Column(String(50), nullable=False)
    id_lugar = Column(Integer, ForeignKey('lugar.id_lugar'), nullable=False)

# SessionLocal en lugar de Session para evitar confusión
SessionLocal = sessionmaker(bind=engine)

def get_db():
    """Función para obtener sesión de BD para FastAPI"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Función para crear tablas (ejecutar una vez)
def create_tables():
    Base.metadata.create_all(bind=engine)