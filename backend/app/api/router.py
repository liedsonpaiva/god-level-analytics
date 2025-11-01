from fastapi import APIRouter
from app.api.health_routes import router as health_router
from app.api.analytics import router as analytics_router


api_router = APIRouter()

api_router.include_router(health_router, prefix="/health", tags=["Health Check"])
api_router.include_router(analytics_router, prefix="/analytics", tags=["Analytics"])
