from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import database
from app.api.routes import analytics

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="GodLevelAnalytics - Sistema de análise para restaurantes",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    await database.connect()
    print("🚀 Backend iniciado e conectado ao banco!")

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

app.include_router(analytics.router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {"message": "GodLevelAnalytics API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "database": "connected"}