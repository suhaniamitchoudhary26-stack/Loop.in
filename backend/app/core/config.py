from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Student Community Platform"
    
    # Database
    MONGO_INITDB_ROOT_USERNAME: str = "admin"
    MONGO_INITDB_ROOT_PASSWORD: str = "password"
    MONGO_HOST: str = "localhost"
    MONGO_PORT: int = 27017
    MONGO_DB_NAME: str = "student_platform"
    
    # Construct MONGO_URI from components if not provided directly
    MONGO_URI: str = "mongodb://localhost:27017"

    # JWT
    SECRET_KEY: str = "CHANGE_THIS_IN_PRODUCTION_SECRET_KEY"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173"]

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)

settings = Settings()
