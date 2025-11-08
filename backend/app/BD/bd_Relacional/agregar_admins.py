"""
Script para agregar 3 administradores adicionales al sistema
Total: 4 administradores (incluyendo admin@bogotaturis.com)
"""
import bcrypt
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from db_connection import Usuario, Correo, Rol, Nacionalidad

# Configuración de base de datos
connection_url = 'mysql+pymysql://root@127.0.0.1:3306/BogotaTuris'
engine = create_engine(connection_url, echo=True)
SessionLocal = sessionmaker(bind=engine)

# Lista de administradores a crear
ADMINISTRADORES = [
    {
        "primer_nombre": "Carlos",
        "segundo_nombre": "Andrés",
        "primer_apellido": "Rodríguez",
        "segundo_apellido": "Martínez",
        "correo": "carlos.rodriguez@bogotaturis.com",
        "clave": "Admin123"
    },
    {
        "primer_nombre": "María",
        "segundo_nombre": "Fernanda",
        "primer_apellido": "González",
        "segundo_apellido": "López",
        "correo": "maria.gonzalez@bogotaturis.com",
        "clave": "Admin123"
    },
    {
        "primer_nombre": "Luis",
        "segundo_nombre": "Eduardo",
        "primer_apellido": "Pérez",
        "segundo_apellido": "Ramírez",
        "correo": "luis.perez@bogotaturis.com",
        "clave": "Admin123"
    }
]

def crear_administrador(db, admin_data, id_rol_admin, nacionalidad_id):
    """Crea un usuario administrador"""
    
    email = admin_data["correo"]
    
    # Verificar si el correo ya existe
    correo_existente = db.query(Correo).filter(Correo.correo == email).first()
    
    if correo_existente:
        usuario_existente = db.query(Usuario).filter(
            Usuario.id_correo == correo_existente.id_correo
        ).first()
        
        if usuario_existente:
            print(f"⚠️  El administrador {email} ya existe (ID: {usuario_existente.id_usuario})")
            return usuario_existente
    
    # Crear correo
    if not correo_existente:
        nuevo_correo = Correo(correo=email)
        db.add(nuevo_correo)
        db.flush()
        print(f"✅ Correo creado: {email}")
    else:
        nuevo_correo = correo_existente
        print(f"ℹ️  Usando correo existente: {email}")
    
    # Hash de la contraseña
    hashed_password = bcrypt.hashpw(
        admin_data["clave"].encode('utf-8'), 
        bcrypt.gensalt()
    ).decode('utf-8')
    
    # Crear usuario administrador
    nuevo_admin = Usuario(
        primer_nombre=admin_data["primer_nombre"],
        segundo_nombre=admin_data.get("segundo_nombre"),
        primer_apellido=admin_data["primer_apellido"],
        segundo_apellido=admin_data.get("segundo_apellido"),
        clave=hashed_password,
        id_rol=id_rol_admin,
        id_correo=nuevo_correo.id_correo,
        id_nac=nacionalidad_id
    )
    
    db.add(nuevo_admin)
    db.flush()
    
    print(f"✅ Administrador creado: {admin_data['primer_nombre']} {admin_data['primer_apellido']}")
    print(f"   📧 Email: {email}")
    print(f"   👤 ID: {nuevo_admin.id_usuario}")
    
    return nuevo_admin

def main():
    """Función principal"""
    print("\n" + "="*70)
    print("🚀 AGREGANDO ADMINISTRADORES ADICIONALES AL SISTEMA")
    print("="*70)
    
    db = SessionLocal()
    
    try:
        # 1. Obtener rol de administrador
        rol_admin = db.query(Rol).filter(Rol.rol == 'administrador').first()
        
        if not rol_admin:
            print("❌ ERROR: No existe el rol 'administrador'")
            print("   Ejecuta primero el script crear_admin.py")
            return
        
        print(f"\n✅ Rol administrador encontrado (ID: {rol_admin.id_rol})")
        
        # 2. Obtener nacionalidad Colombia (o la primera disponible)
        nacionalidad = db.query(Nacionalidad).filter(
            Nacionalidad.nacionalidad == 'Colombia'
        ).first()
        
        if not nacionalidad:
            nacionalidad = db.query(Nacionalidad).first()
        
        if not nacionalidad:
            print("❌ ERROR: No hay nacionalidades en la base de datos")
            print("   Ejecuta primero el script importar_datos_json.py")
            return
        
        print(f"✅ Nacionalidad: {nacionalidad.nacionalidad} (ID: {nacionalidad.id_nac})")
        
        # 3. Contar administradores actuales
        total_admins_antes = db.query(Usuario).filter(
            Usuario.id_rol == rol_admin.id_rol
        ).count()
        
        print(f"\n📊 Administradores actuales: {total_admins_antes}")
        
        # 4. Crear los nuevos administradores
        print("\n" + "="*70)
        print("📝 CREANDO NUEVOS ADMINISTRADORES")
        print("="*70)
        
        admins_creados = []
        
        for i, admin_data in enumerate(ADMINISTRADORES, 1):
            print(f"\n[{i}/{len(ADMINISTRADORES)}] Creando administrador...")
            admin = crear_administrador(
                db, 
                admin_data, 
                rol_admin.id_rol, 
                nacionalidad.id_nac
            )
            admins_creados.append(admin)
        
        # 5. Commit de todos los cambios
        db.commit()
        
        # 6. Contar administradores finales
        total_admins_despues = db.query(Usuario).filter(
            Usuario.id_rol == rol_admin.id_rol
        ).count()
        
        # 7. Resumen final
        print("\n" + "="*70)
        print("✅ PROCESO COMPLETADO EXITOSAMENTE")
        print("="*70)
        print(f"📊 Total de administradores: {total_admins_despues}")
        print(f"➕ Nuevos administradores agregados: {len(admins_creados)}")
        
        print("\n📋 LISTA DE TODOS LOS ADMINISTRADORES:")
        print("-"*70)
        
        todos_admins = db.query(Usuario).filter(
            Usuario.id_rol == rol_admin.id_rol
        ).all()
        
        for i, admin in enumerate(todos_admins, 1):
            correo_obj = db.query(Correo).filter(
                Correo.id_correo == admin.id_correo
            ).first()
            
            print(f"\n{i}. {admin.primer_nombre} {admin.primer_apellido}")
            print(f"   📧 Email: {correo_obj.correo if correo_obj else 'N/A'}")
            print(f"   👤 ID: {admin.id_usuario}")
        
        print("\n" + "="*70)
        print("🔐 CREDENCIALES DE ACCESO (Contraseña para todos: Admin123)")
        print("="*70)
        
        for admin_data in ADMINISTRADORES:
            print(f"📧 {admin_data['correo']}")
        
        print("\n⚠️  IMPORTANTE: Cambia las contraseñas después del primer inicio de sesión")
        print("="*70)
        
    except Exception as e:
        db.rollback()
        print(f"\n❌ ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    main()
