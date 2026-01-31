from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.schemas.announcement_schema import AnnouncementCreate, AnnouncementResponse
from app.services.announcement_service import AnnouncementService
from app.api import deps
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[AnnouncementResponse])
async def get_announcements():
    return await AnnouncementService.get_announcements()

@router.post("/", response_model=AnnouncementResponse)
async def create_announcement(
    announcement_in: AnnouncementCreate, 
    current_user: User = Depends(deps.get_current_user)
):
    if current_user.role not in ["admin", "faculty"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin or faculty can create announcements"
        )
        
    announcement = await AnnouncementService.create_announcement(announcement_in, current_user)
    
    return AnnouncementResponse(
        id=str(announcement.id),
        title=announcement.title,
        content=announcement.content,
        author_name=current_user.full_name,
        created_at=announcement.created_at
    )
