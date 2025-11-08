import json
from sqlalchemy import create_engine, String, Integer, Column, BigInteger
from sqlalchemy.orm import DeclarativeBase, mapped_column, sessionmaker


# Tu configuración de base de datos
connection_url = 'mysql://root@127.0.0.1:3306/BogotaTuris'
engine = create_engine(connection_url)

class Base(DeclarativeBase):
    pass

# Definir las tablas que necesitamos para la importación
class Intereses(Base):
    __tablename__ = 'intereses'
    
    id_inte = Column(Integer, primary_key=True, autoincrement=True)
    interes = Column(String(80), nullable=False, unique=True)

class Nacionalidad(Base):
    __tablename__ = 'nacionalidad'
    
    id_nac = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    nacionalidad = mapped_column(String(50), nullable=False, unique=True)

class TipoLugar(Base):
    __tablename__ = 'tipo_lugar'
    
    id_tipo = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    nombre_tipo = mapped_column(String(60), nullable=False, unique=True)

class Rol(Base):
    __tablename__ = 'rol'
    
    id_rol = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    rol = mapped_column(String(50), nullable=False, unique=True)


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def importar_intereses():
    """Importa intereses desde datosIntereses.json"""
    db = SessionLocal()
    try:
        # Leer el archivo JSON de intereses
        with open("datosIntereses.json", "r", encoding="utf-8") as f:
            intereses_data = json.load(f)
        
        count_nuevos = 0
        count_existentes = 0
        
        for interes_item in intereses_data:
            # Verificar si ya existe usando 'interes'
            existe = db.query(Intereses).filter_by(interes=interes_item['interes']).first()
            
            if not existe:
                nuevo_interes = Intereses(interes=interes_item['interes'])
                db.add(nuevo_interes)
                count_nuevos += 1
                print(f"✓ Agregado: {interes_item['interes']}")
            else:
                count_existentes += 1
                print(f"- Ya existe: {interes_item['interes']}")
        
        db.commit()
        print(f"\nRESUMEN INTERESES:")
        print(f"   Nuevos insertados: {count_nuevos}")
        print(f"   Ya existían: {count_existentes}")
        print(f"   Total procesados: {len(intereses_data)}")
        
    except FileNotFoundError:
        print("Error: No se encontró el archivo datosIntereses.json")
        print("Asegúrate de que el archivo esté en la misma carpeta que este script.")
    except json.JSONDecodeError:
        print("Error: El archivo JSON no tiene un formato válido")
    except Exception as e:
        db.rollback()
        print(f"Error al importar intereses: {str(e)}")
    finally:
        db.close()

def importar_nacionalidades():
    """Importa nacionalidades desde datosNacionalidades.json"""
    db = SessionLocal()
    try:
        # Intentar leer el archivo JSON de nacionalidades
        with open("datosNacionalidad.json", "r", encoding="utf-8") as f:
            nacionalidades_data = json.load(f)
        
        count_nuevos = 0
        count_existentes = 0
        
        for nac_item in nacionalidades_data:
            # Verificar si ya existe usando 'nacionalidad'
            existe = db.query(Nacionalidad).filter_by(nacionalidad=nac_item['nacionalidad']).first()
            
            if not existe:
                nueva_nacionalidad = Nacionalidad(nacionalidad=nac_item['nacionalidad'])
                db.add(nueva_nacionalidad)
                count_nuevos += 1
                print(f"✓ Agregada: {nac_item['nacionalidad']}")
            else:
                count_existentes += 1
                print(f"- Ya existe: {nac_item['nacionalidad']}")
        
        db.commit()
        print(f"\nRESUMEN NACIONALIDADES:")
        print(f"   Nuevas insertadas: {count_nuevos}")
        print(f"   Ya existían: {count_existentes}")
        print(f"   Total procesadas: {len(nacionalidades_data)}")
        
    except FileNotFoundError:
        print("Error: No se encontró el archivo datosNacionalidades.json")
        print("Asegúrate de que el archivo esté en la misma carpeta que este script.")
    except json.JSONDecodeError:
        print("Error: El archivo JSON no tiene un formato válido")
    except Exception as e:
        db.rollback()
        print(f"Error al importar nacionalidades: {str(e)}")
    finally:
        db.close()
        
def importar_tipo_lugar():
    """Importa tipos de lugar desde datosTipoLugar.json"""
    db = SessionLocal()
    try:
        with open("datosTipoLugar.json", "r", encoding="utf-8") as f:
            tipos_data = json.load(f)

        count_nuevos = 0
        count_existentes = 0

        for tipo_item in tipos_data:
            # Usa el nombre correcto de la clave según tu modelo
            existe = db.query(TipoLugar).filter_by(nombre_tipo=tipo_item['nombre_tipo']).first()

            if not existe:
                nuevo_tipo = TipoLugar(nombre_tipo=tipo_item['nombre_tipo'])
                db.add(nuevo_tipo)
                count_nuevos += 1
                print(f"✓ Agregado: {tipo_item['nombre_tipo']}")
            else:
                count_existentes += 1
                print(f"- Ya existe: {tipo_item['nombre_tipo']}")

        db.commit()
        print(f"\nRESUMEN TIPOS DE LUGAR:")
        print(f"   Nuevos insertados: {count_nuevos}")
        print(f"   Ya existían: {count_existentes}")
        print(f"   Total procesados: {len(tipos_data)}")

    except FileNotFoundError:
        print("Error: No se encontró el archivo datosTipoLugar.json")
    except json.JSONDecodeError:
        print("Error: El archivo JSON no tiene un formato válido")
    except Exception as e:
        db.rollback()
        print(f"Error al importar tipos de lugar: {str(e)}")
    finally:
        db.close()


def crear_rol_usuario():
    """Crea el rol 'usuario' si no existe"""
    db = SessionLocal()
    try:
        rol_existe = db.query(Rol).filter_by(rol='usuario').first()
        
        if not rol_existe:
            nuevo_rol = Rol(rol='usuario')
            db.add(nuevo_rol)
            db.commit()
            print("✓ Rol 'usuario' creado exitosamente")
        else:
            print("- Rol 'usuario' ya existe")
            
    except Exception as e:
        db.rollback()
        print(f"Error al crear rol: {str(e)}")
    finally:
        db.close()

def main():
    """Función principal"""
    print("Iniciando importación de datos desde JSON...")
    print("=" * 50)
    
    # Verificar conexión a la base de datos
    try:
        Base.metadata.create_all(bind=engine)
        print("✓ Conexión a base de datos establecida")
    except Exception as e:
        print(f"Error al conectar con la base de datos: {str(e)}")
        print("Verifica que MySQL esté ejecutándose y que la base de datos 'BogotaTuris' exista.")
        return
    
    print("\n1. Importando intereses...")
    importar_intereses()
    
    print("\n2. Importando nacionalidades...")
    importar_nacionalidades()
    
    print("\n3. Importando tipos de lugar...")
    importar_tipo_lugar()
    
    print("\n4. Creando rol usuario...")
    crear_rol_usuario()
    
    print("\n" + "=" * 50)
    print("Importación completada!")

if __name__ == "__main__":
    main()
