from db_connection import Usuario, engine 
from sqlalchemy import select, insert, update, delete
conexion = engine.connect()
#consultando la tabla de usuario 
stmt = select(Usuario)
data = conexion.execute(stmt)
print(data)
for row in data:
    print(row)
    #Insertando en usuario 
stmt1 = insert(Usuario).values(primer_nombre="Juan", segundo_nombre="Carlos", primer_apellido="Perez", segundo_apellido="Lopez", clave="password123", id_rol=2, id_correo=2, id_nac=2, id_inte=2)
#actualizando usuario
stmt2 = update(Usuario).where(Usuario.id_usuario == 3).values(primer_nombre="Jose", segundo_nombre="Juan", primer_apellido="Perez", segundo_apellido="Lopez", clave="password123", id_rol=2, id_correo=2, id_nac=2, id_inte=2)
#eliminando usuario 
stmt3 = delete(Usuario).where(Usuario.id_usuario == 3)
conexion.execute(stmt3)

conexion.commit()

conexion.close()

