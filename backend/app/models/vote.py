from typing import Optional
from beanie import Document, Link, PydanticObjectId
from pydantic import Field
from datetime import datetime
from app.models.user import User

class Vote(Document):
    user_id: PydanticObjectId
    target_id: PydanticObjectId # Post or Comment ID
    target_type: str # "post" or "comment"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "votes"
        indexes = [
            # Compound index to ensure a user can only vote once per target
            [("user_id", 1), ("target_id", 1), ("target_type", 1)],
        ]
