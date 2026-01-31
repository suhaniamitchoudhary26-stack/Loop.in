from typing import Optional
from beanie import Document, Link
from pydantic import Field
from datetime import datetime
from app.models.user import User

class Announcement(Document):
    title: str
    content: str
    author: Link[User]
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "announcements"
