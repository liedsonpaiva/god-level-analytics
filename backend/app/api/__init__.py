from fastapi import APIRouter
from app.api.analytics.router import router as analytics_router

# Roteador principal da API
api_router = APIRouter()

# Inclui todas as rotas de analytics sob o prefixo /analytics
api_router.include_router(analytics_router, prefix="/analytics", tags=["Analytics"])