from fastapi import FastAPI, Depends
from sqlmodel import SQLModel, create_engine, Session, select
import os
from dotenv import load_dotenv

# Carrega variáveis do .env
load_dotenv()

# Configuração direta do SQLModel (sem imports complexos)
DB_PASSWORD = os.getenv("DB_PASSWORD")
connection_string = f"postgresql://postgres:{DB_PASSWORD}@localhost:5432/food_analytics"
engine = create_engine(connection_string)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

# Instância do FastAPI
app = FastAPI(title="Food Analytics API")

# Criar tabelas ao iniciar
@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    print("✅ Tabelas criadas/verificadas com sucesso!")

# Rota principal
@app.get("/")
def read_root():
    return {"message": "Hello, World! - Food Analytics API"}

# Rota de health check
@app.get("/health")
def health_check(session: Session = Depends(get_session)):
    try:
        # Import aqui para evitar circular imports
        from app.models.catalog.stores import Store
        store_count = session.exec(select(Store)).first()
        return {
            "status": "healthy", 
            "database": "connected",
            "message": "API and database are running correctly"
        }
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)