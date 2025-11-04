# app/core/config.py
import os
from typing import Optional
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql://postgres:37106@localhost:5432/food_analytics"
    
    # API
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "GodLevelAnalytics"
    
    # CORS
    BACKEND_CORS_ORIGINS: list = ["http://localhost:3000", "http://127.0.0.1:3000"]
    
    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()

def get_settings() -> Settings:
    return settings