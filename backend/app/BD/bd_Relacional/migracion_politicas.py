"""
Script de migración para agregar campos de políticas y términos
Ejecutar este script para actualizar la base de datos existente
"""
from sqlalchemy import text
from db_connection import engine, Base, Usuario, HistorialAceptaciones, VisualizacionPDF

def migrar_base_datos():
    """Agrega las nuevas columnas y tablas a la base de datos"""
    
    print("🔄 Iniciando migración de base de datos...")
    
    with engine.connect() as connection:
        try:
            # 1. Agregar columnas a la tabla usuario
            print("📝 Agregando columnas a tabla 'usuario'...")
            
            columnas_usuario = [
                "ALTER TABLE usuario ADD COLUMN acepto_terminos BOOLEAN NOT NULL DEFAULT FALSE",
                "ALTER TABLE usuario ADD COLUMN acepto_tratamiento_datos BOOLEAN NOT NULL DEFAULT FALSE",
                "ALTER TABLE usuario ADD COLUMN fecha_aceptacion_terminos DATETIME NULL",
                "ALTER TABLE usuario ADD COLUMN fecha_aceptacion_tratamiento DATETIME NULL"
            ]
            
            for sql in columnas_usuario:
                try:
                    connection.execute(text(sql))
                    connection.commit()
                    print(f"  ✓ Ejecutado: {sql[:50]}...")
                except Exception as e:
                    if "Duplicate column name" in str(e):
                        print(f"  ⚠ Columna ya existe, saltando...")
                    else:
                        print(f"  ✗ Error: {e}")
            
            # 2. Crear tabla historial_aceptaciones
            print("\n📝 Creando tabla 'historial_aceptaciones'...")
            try:
                sql_historial = """
                CREATE TABLE IF NOT EXISTS historial_aceptaciones (
                    id_historial BIGINT AUTO_INCREMENT PRIMARY KEY,
                    id_usuario BIGINT NOT NULL,
                    tipo_documento VARCHAR(50) NOT NULL,
                    acepto BOOLEAN NOT NULL,
                    fecha_accion DATETIME NOT NULL,
                    ip_address VARCHAR(45) NULL,
                    user_agent TEXT NULL,
                    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
                    INDEX idx_usuario_tipo (id_usuario, tipo_documento),
                    INDEX idx_fecha (fecha_accion)
                )
                """
                connection.execute(text(sql_historial))
                connection.commit()
                print("  ✓ Tabla 'historial_aceptaciones' creada")
            except Exception as e:
                print(f"  ⚠ Tabla ya existe o error: {e}")
            
            # 3. Crear tabla visualizacion_pdf
            print("\n📝 Creando tabla 'visualizacion_pdf'...")
            try:
                sql_visualizacion = """
                CREATE TABLE IF NOT EXISTS visualizacion_pdf (
                    id_visualizacion BIGINT AUTO_INCREMENT PRIMARY KEY,
                    id_usuario BIGINT NULL,
                    session_id VARCHAR(255) NOT NULL,
                    tipo_documento VARCHAR(50) NOT NULL,
                    fecha_visualizacion DATETIME NOT NULL,
                    tiempo_visualizacion INT NULL,
                    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE SET NULL,
                    INDEX idx_session (session_id),
                    INDEX idx_tipo (tipo_documento),
                    INDEX idx_fecha (fecha_visualizacion)
                )
                """
                connection.execute(text(sql_visualizacion))
                connection.commit()
                print("  ✓ Tabla 'visualizacion_pdf' creada")
            except Exception as e:
                print(f"  ⚠ Tabla ya existe o error: {e}")
            
            print("\n✅ Migración completada exitosamente!")
            print("\n📊 Resumen:")
            print("  - Columnas agregadas a 'usuario': 4")
            print("  - Nuevas tablas creadas: 2")
            print("    * historial_aceptaciones")
            print("    * visualizacion_pdf")
            
        except Exception as e:
            print(f"\n❌ Error durante la migración: {e}")
            raise

def verificar_migracion():
    """Verifica que las tablas y columnas existan"""
    print("\n🔍 Verificando migración...")
    
    with engine.connect() as connection:
        # Verificar columnas en usuario
        result = connection.execute(text("DESCRIBE usuario"))
        columnas = [row[0] for row in result]
        
        columnas_requeridas = [
            'acepto_terminos',
            'acepto_tratamiento_datos', 
            'fecha_aceptacion_terminos',
            'fecha_aceptacion_tratamiento'
        ]
        
        print("\n📋 Columnas en tabla 'usuario':")
        for col in columnas_requeridas:
            existe = col in columnas
            print(f"  {'✓' if existe else '✗'} {col}")
        
        # Verificar tablas
        result = connection.execute(text("SHOW TABLES"))
        tablas = [row[0] for row in result]
        
        tablas_requeridas = ['historial_aceptaciones', 'visualizacion_pdf']
        
        print("\n📋 Tablas nuevas:")
        for tabla in tablas_requeridas:
            existe = tabla in tablas
            print(f"  {'✓' if existe else '✗'} {tabla}")

if __name__ == "__main__":
    print("=" * 60)
    print("  MIGRACIÓN DE BASE DE DATOS - POLÍTICAS Y TÉRMINOS")
    print("=" * 60)
    
    respuesta = input("\n¿Deseas continuar con la migración? (s/n): ")
    
    if respuesta.lower() == 's':
        migrar_base_datos()
        verificar_migracion()
    else:
        print("❌ Migración cancelada")
