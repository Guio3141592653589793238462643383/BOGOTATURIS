import mysql.connector
def create_connection():
    config = dict(
        host="localhost",
        user="root",
        password="",
        database="BogotaTuris",
        port="3306"
    )
    try:
        Connection = mysql.connector.connect(**config)
        return Connection
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return None
    
conectarBase = create_connection()

