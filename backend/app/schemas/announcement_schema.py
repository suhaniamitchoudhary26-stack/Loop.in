from pydantic import BaseModel
from datetime import datetime

class AnnouncementCreate(BaseModel):
    title: str
    content: str

class AnnouncementResponse(BaseModel):
    id: str
    title: str
    content: str
    author_name: str
    created_at: datetime
    
    class Config:
        from_attributes = True
