from fastapi import FastAPI
from sqlmodel import SQLModel, create_engine
from app.core.connect import get_db_connection_string

# Importa o novo roteador agrupado
from app.api.analytics.router import router as analytics_router
from app.api.health_routes import router as health_router

connection_string = get_db_connection_string()
engine = create_engine(connection_string, echo=False)

def create_app() -> FastAPI:
    app = FastAPI(title="GodLevel Analytics API", version="1.0.0")

    @app.on_event("startup")
    def on_startup():
        SQLModel.metadata.create_all(engine)
        print("✅ Banco de dados conectado e tabelas criadas/verificadas.")

    # Registra as rotas
    app.include_router(health_router)
    app.include_router(analytics_router, prefix="/api/analytics", tags=["Analytics"])

    return app

app = create_app()
