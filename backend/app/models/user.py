from typing import Optional
from beanie import Document, Indexed
from pydantic import Field
from datetime import datetime

class User(Document):
    email: Indexed(str, unique=True)
    password_hash: str
    full_name: str
    role: str = "student"  # student, faculty, admin
    is_banned: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "users"
