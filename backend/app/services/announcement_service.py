from typing import List
from app.models.announcement import Announcement
from app.models.user import User
from app.schemas.announcement_schema import AnnouncementCreate, AnnouncementResponse

class AnnouncementService:
    
    @staticmethod
    async def create_announcement(data: AnnouncementCreate, user: User) -> Announcement:
        announcement = Announcement(
            title=data.title,
            content=data.content,
            author=user
        )
        await announcement.insert()
        return announcement

    @staticmethod
    async def get_announcements() -> List[AnnouncementResponse]:
        announcements = await Announcement.find_all(fetch_links=True, sort=[("-created_at")]).to_list()
        
        response = []
        for a in announcements:
            author_name = a.author.full_name if a.author else "Unknown"
            
            response.append(AnnouncementResponse(
                id=str(a.id),
                title=a.title,
                content=a.content,
                author_name=author_name,
                created_at=a.created_at
            ))
        return response
