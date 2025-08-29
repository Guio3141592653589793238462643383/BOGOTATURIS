from xmlrpc.client import DateTime
from sqlalchemy import Date, Time, create_engine, String, Integer, Column, ForeignKey
from sqlalchemy.orm import DeclarativeBase, mapped_column

connection_url = 'mysql://root@127.0.0.1:3306/BogotaTuris'

engine = create_engine(connection_url)

class Base(DeclarativeBase):
    pass

class Usuario(Base):
    __tablename__ = 'usuario'

    id_usuario = mapped_column(Integer, primary_key=True)
    primer_nombre = mapped_column(String(50))
    segundo_nombre = mapped_column(String(50))
    primer_apellido = mapped_column(String(50))
    segundo_apellido = mapped_column(String(50))
    clave = mapped_column(String(50), unique=True)
    id_rol = mapped_column(Integer, ForeignKey('rol.id_rol'))
    id_correo = mapped_column(Integer, ForeignKey('correo.id_correo'))
    id_nac = mapped_column(Integer, ForeignKey('nacionalidad.id_nac'))
    id_inte = mapped_column(Integer, ForeignKey('intereses.id_inte'))


class Rol(Base):
    __tablename__ = 'rol'

    id_rol = Column(Integer, primary_key=True, autoincrement=True)
    rol = Column(String(20), nullable=False)

class Correo(Base):
    __tablename__ = 'correo'

    id_correo = Column(Integer, primary_key=True, autoincrement=True)
    correo = Column(String(255), nullable=False)

class Nacionalidad(Base):
    __tablename__ = 'nacionalidad'

    id_nac = Column(Integer, primary_key=True, autoincrement=True)
    nacionalidad = Column(String(50), nullable=False)

class Intereses(Base):
    __tablename__ = 'intereses'

    id_inte = Column(Integer, primary_key=True, autoincrement=True)
    interes = Column(String(80), nullable=False)

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

    id_com = Column(Integer, primary_key=True)
    tipo_com = Column(String(50), nullable=False)
    fecha_com = Column(Date, nullable=False)
    id_usuario = Column(Integer, ForeignKey('usuario.id_usuario'), nullable=False)

class Lugar(Base):
    __tablename__ = 'lugar'

    id_lugar = Column(Integer, primary_key=True)
    nombre_lugar = Column(String(60), nullable=False)
    tipo_lugar = Column(String(60), nullable=False)
    direccion = Column(String(255), nullable=False)
    hora_aper = Column(Time, nullable=False)
    hora_cierra = Column(Time, nullable=False)
    precios = Column(Integer, nullable=False)
    id_usuario = Column(Integer, ForeignKey('usuario.id_usuario'), nullable=False)

class Alerta(Base):
    __tablename__ = 'alerta'

    id_alerta = Column(Integer, primary_key=True)
    tipo_aler = Column(String(255), nullable=False)
    fecha_alerta = Column(Date, nullable=False)
    id_lugar = Column(Integer, ForeignKey('lugar.id_lugar'), nullable=False)

class Rutas(Base):
    __tablename__ = 'rutas'

    id_ruta = Column(Integer, primary_key=True, autoincrement=True)
    inicio_ruta = Column(String(50), nullable=False)
    fin_ruta = Column(String(50), nullable=False)
    id_lugar = Column(Integer, ForeignKey('lugar.id_lugar'), nullable=False)

