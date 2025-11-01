from fastapi import FastAPI
from sqlmodel import SQLModel
from app.core.config import settings
from app.core.middleware import setup_cors
from app.core.connect import engine
from app.api import api_router

def create_app() -> FastAPI:
    app = FastAPI(
        title="GodLevel Analytics API", 
        version="1.0.0",
        docs_url="/docs",  # Habilita Swagger UI
        redoc_url="/redoc"  # Habilita Redoc
    )

    # 🔧 CORS configurado de forma organizada
    setup_cors(app)

    @app.on_event("startup")
    def on_startup():
        SQLModel.metadata.create_all(engine)
        print("✅ Banco de dados conectado e tabelas criadas/verificadas.")

    # Rota raiz
    @app.get("/")
    def read_root():
        return {"message": "GodLevel Analytics API - Acesse /docs para documentação"}

    # Health check
    @app.get("/health")
    def health_check():
        return {"status": "healthy", "database": "connected"}

    # Inclui todas as rotas da API
    app.include_router(api_router, prefix="/api")

    return app

app = create_app()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)