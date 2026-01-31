from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PostBase(BaseModel):
    title: str
    content: str
    is_anonymous: bool = False
    department_id: Optional[str] = None

class PostCreate(PostBase):
    pass

class PostResponse(PostBase):
    id: str
    author_name: Optional[str] = "Anonymous"
    created_at: datetime
    
    class Config:
        from_attributes = True
