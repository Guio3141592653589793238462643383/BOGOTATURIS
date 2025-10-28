"""
Script para crear el rol de administrador y un usuario admin predeterminado
Ejecutar desde: backend/app/BD/bd_Relacional/
"""
import bcrypt
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from db_connection import Usuario, Correo, Rol, Nacionalidad

# Configuración de base de datos
connection_url = 'mysql+pymysql://root@127.0.0.1:3306/BogotaTuris'
engine = create_engine(connection_url, echo=True)
SessionLocal = sessionmaker(bind=engine)

def crear_rol_administrador(db):
    """Crea el rol 'administrador' si no existe"""
    print("\n" + "="*60)
    print("🔧 CREANDO ROL ADMINISTRADOR")
    print("="*60)
    
    # Verificar si ya existe
    rol_admin = db.query(Rol).filter(Rol.rol == 'administrador').first()
    
    if rol_admin:
        print(f"✅ El rol 'administrador' ya existe con ID: {rol_admin.id_rol}")
        return rol_admin
    
    # Crear nuevo rol
    nuevo_rol = Rol(rol='administrador')
    db.add(nuevo_rol)
    db.commit()
    db.refresh(nuevo_rol)
    
    print(f"✅ Rol 'administrador' creado exitosamente con ID: {nuevo_rol.id_rol}")
    return nuevo_rol

def crear_rol_usuario(db):
    """Crea el rol 'usuario' si no existe"""
    print("\n" + "="*60)
    print("🔧 VERIFICANDO ROL USUARIO")
    print("="*60)
    
    rol_usuario = db.query(Rol).filter(Rol.rol == 'usuario').first()
    
    if rol_usuario:
        print(f"✅ El rol 'usuario' ya existe con ID: {rol_usuario.id_rol}")
        return rol_usuario
    
    nuevo_rol = Rol(rol='usuario')
    db.add(nuevo_rol)
    db.commit()
    db.refresh(nuevo_rol)
    
    print(f"✅ Rol 'usuario' creado exitosamente con ID: {nuevo_rol.id_rol}")
    return nuevo_rol

def crear_usuario_admin(db, id_rol_admin):
    """Crea un usuario administrador predeterminado"""
    print("\n" + "="*60)
    print("👤 CREANDO USUARIO ADMINISTRADOR")
    print("="*60)
    
    # Datos del admin
    email_admin = "admin@bogotaturis.com"
    password_admin = "Admin123"  # Contraseña por defecto
    
    # Verificar si el correo ya existe
    correo_existente = db.query(Correo).filter(Correo.correo == email_admin).first()
    
    if correo_existente:
        # Verificar si ya hay un usuario con ese correo
        usuario_existente = db.query(Usuario).filter(
            Usuario.id_correo == correo_existente.id_correo
        ).first()
        
        if usuario_existente:
            print(f"⚠️  El usuario administrador ya existe:")
            print(f"   📧 Email: {email_admin}")
            print(f"   👤 ID Usuario: {usuario_existente.id_usuario}")
            print(f"   🔑 Rol ID: {usuario_existente.id_rol}")
            return usuario_existente
    
    # Crear correo
    if not correo_existente:
        nuevo_correo = Correo(correo=email_admin)
        db.add(nuevo_correo)
        db.flush()
        print(f"✅ Correo creado: {email_admin}")
    else:
        nuevo_correo = correo_existente
        print(f"ℹ️  Usando correo existente: {email_admin}")
    
    # Obtener una nacionalidad (Colombia por defecto, id_nac=47)
    nacionalidad = db.query(Nacionalidad).filter(Nacionalidad.nacionalidad == 'Colombia').first()
    if not nacionalidad:
        # Si no existe Colombia, usar la primera nacionalidad disponible
        nacionalidad = db.query(Nacionalidad).first()
    
    if not nacionalidad:
        print("❌ ERROR: No hay nacionalidades en la base de datos")
        print("   Por favor, ejecuta primero el script importar_datos_json.py")
        return None
    
    # Hash de la contraseña
    hashed_password = bcrypt.hashpw(password_admin.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    # Crear usuario administrador
    nuevo_admin = Usuario(
        primer_nombre="Admin",
        segundo_nombre=None,
        primer_apellido="BogotaTuris",
        segundo_apellido=None,
        clave=hashed_password,
        id_rol=id_rol_admin,
        id_correo=nuevo_correo.id_correo,
        id_nac=nacionalidad.id_nac
    )
    
    db.add(nuevo_admin)
    db.commit()
    db.refresh(nuevo_admin)
    
    print("\n" + "="*60)
    print("✅ USUARIO ADMINISTRADOR CREADO EXITOSAMENTE")
    print("="*60)
    print(f"📧 Email: {email_admin}")
    print(f"🔑 Contraseña: {password_admin}")
    print(f"👤 ID Usuario: {nuevo_admin.id_usuario}")
    print(f"🌍 Nacionalidad: {nacionalidad.nacionalidad}")
    print("="*60)
    print("\n⚠️  IMPORTANTE: Guarda estas credenciales para acceder al panel de administrador")
    
    return nuevo_admin

def main():
    """Función principal"""
    print("\n" + "="*60)
    print("🚀 INICIANDO CREACIÓN DE ADMINISTRADOR")
    print("="*60)
    
    db = SessionLocal()
    
    try:
        # 1. Crear rol usuario (si no existe)
        rol_usuario = crear_rol_usuario(db)
        
        # 2. Crear rol administrador
        rol_admin = crear_rol_administrador(db)
        
        # 3. Crear usuario administrador
        admin = crear_usuario_admin(db, rol_admin.id_rol)
        
        if admin:
            print("\n✅ Proceso completado exitosamente")
            print("\n📝 CREDENCIALES DE ACCESO:")
            print("   Email: admin@bogotaturis.com")
            print("   Contraseña: Admin123")
            print("\n🔐 Puedes cambiar la contraseña después de iniciar sesión")
        else:
            print("\n❌ No se pudo crear el usuario administrador")
            
    except Exception as e:
        db.rollback()
        print(f"\n❌ ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    main()
