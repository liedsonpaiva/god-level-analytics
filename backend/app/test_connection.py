from app.core.connect import conn

connection = conn()
if connection:
    print("Conexão bem-sucedida!")
else:
    print("Falha ao conectar!")
