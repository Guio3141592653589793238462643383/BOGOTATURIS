import mysql.connector
from db_connection import create_connection
def fetch_users():
    connection = create_connection()
    if connection is None:
        print("No se pudo conectar a la base de datos.")
        return 
    try:
        cursor = connection.cursor()
        print("Conexión exitosa a la base de datos.")
        query = "SELECT * FROM usuario"
        cursor.execute(query)
        results = cursor.fetchall()
        for row in results:
            print(row)
    except mysql.connector.Error as err:
        print(f"Error: {err}")
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
if __name__ == "__main__":
    fetch_users()