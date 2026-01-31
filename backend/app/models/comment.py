from typing import Optional, List
from beanie import Document, Link, PydanticObjectId
from pydantic import Field
from datetime import datetime
from app.models.user import User

class Comment(Document):
    content: str
    post_id: PydanticObjectId
    parent_id: Optional[PydanticObjectId] = None
    author: Link[User]
    is_anonymous: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "comments"
