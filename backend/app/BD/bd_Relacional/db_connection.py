from sqlalchemy import Date, DateTime, Time, create_engine, String, BigInteger, Integer, ForeignKey
from sqlalchemy.orm import DeclarativeBase, mapped_column, sessionmaker

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

class Rol(Base):
    __tablename__ = 'rol'

    id_rol = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    rol = mapped_column(String(20), nullable=False, unique=True)  

class Correo(Base):
    __tablename__ = 'correo'

    id_correo = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    correo = mapped_column(String(255), nullable=False, unique=True)  

class Nacionalidad(Base):
    __tablename__ = 'nacionalidad'

    id_nac = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    nacionalidad = mapped_column(String(50), nullable=False, unique=True)  

class Intereses(Base):
    __tablename__ = 'intereses'

    id_inte = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    interes = mapped_column(String(80), nullable=False, unique=True)  

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
    __tablename__ = 'reporte_incidente'

    id_report = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    descripcion = mapped_column(String(255), nullable=False)
    fecha_report = mapped_column(DateTime, nullable=False)
    estado = mapped_column(String(80), nullable=False)
    id_usuario = mapped_column(BigInteger, ForeignKey('usuario.id_usuario'), nullable=False)

class Comentarios(Base):
    __tablename__ = 'comentarios'

    id_com = mapped_column(BigInteger, primary_key=True, autoincrement=True)  
    tipo_com = mapped_column(String(50), nullable=False)
    fecha_com = mapped_column(Date, nullable=False)
    id_usuario = mapped_column(BigInteger, ForeignKey('usuario.id_usuario'), nullable=False)

class Lugar(Base):
    __tablename__ = 'lugar'

    id_lugar = mapped_column(BigInteger, primary_key=True, autoincrement=True)  
    nombre_lugar = mapped_column(String(60), nullable=False)
    tipo_lugar = mapped_column(String(60), nullable=False)
    direccion = mapped_column(String(255), nullable=False)
    hora_aper = mapped_column(Time, nullable=True)  
    hora_cierra = mapped_column(Time, nullable=True)
    precios = mapped_column(Integer, nullable=True, default=0)  
    id_usuario = mapped_column(BigInteger, ForeignKey('usuario.id_usuario'), nullable=False)

class Alerta(Base):
    __tablename__ = 'alerta'

    id_alerta = mapped_column(BigInteger, primary_key=True, autoincrement=True)  
    tipo_aler = mapped_column(String(255), nullable=False)
    fecha_alerta = mapped_column(Date, nullable=False)
    id_lugar = mapped_column(BigInteger, ForeignKey('lugar.id_lugar'), nullable=False)

class Rutas(Base):
    __tablename__ = 'rutas'

    id_ruta = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    inicio_ruta = mapped_column(String(50), nullable=False)
    fin_ruta = mapped_column(String(50), nullable=False)
    id_lugar = mapped_column(BigInteger, ForeignKey('lugar.id_lugar'), nullable=False)

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