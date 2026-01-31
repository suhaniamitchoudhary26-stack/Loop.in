from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class CommentBase(BaseModel):
    content: str
    post_id: str
    parent_id: Optional[str] = None
    is_anonymous: bool = False

class CommentCreate(CommentBase):
    pass

class CommentBuilderResponse(BaseModel):
    # Flat structure for internal builder use, or simple API response
    id: str
    content: str
    parent_id: Optional[str]
    author_name: str
    created_at: datetime
    
class CommentResponse(BaseModel):
    id: str
    content: str
    parent_id: Optional[str]
    author_name: str
    created_at: datetime
    replies: List['CommentResponse'] = []
    
    class Config:
        from_attributes = True
