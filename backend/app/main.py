from fastapi import FastAPI
from godlevelanalytics.backend.app.core.connect import conn, encerra_conn  # Atualize a importação com o caminho correto

# Conecta ao banco de dados quando o servidor é iniciado
connection = conn()

# Instância do FastAPI
app = FastAPI(title="Food Analytics API")

# Rota principal
@app.get("/")
def read_root():
    return {"message": "Hello, World!"}

# Quando o servidor for desligado, a conexão ao banco de dados é fechada
@app.on_event("shutdown")
def shutdown():
    encerra_conn(connection)
