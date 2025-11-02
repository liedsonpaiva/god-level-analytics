from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # CORS
    cors_origins: list = [
        "http://localhost:5173",
        "http://127.0.0.1:5173", 
        "http://localhost:8000"
    ]
    
    # Database
    database_url: str = "postgresql://postgres:37106@localhost:5432/food_analytics"
    
    class Config:
        env_file = ".env"

settings = Settings()