from typing import List
from beanie import PydanticObjectId
from fastapi import HTTPException, status
from app.models.user import User
from app.models.post import Post
from app.schemas.user_schema import UserResponse

class AdminService:
    
    @staticmethod
    async def get_all_users() -> List[UserResponse]:
        users = await User.find_all().to_list()
        return [
            UserResponse(
                id=str(u.id),
                email=u.email,
                full_name=u.full_name,
                role=u.role,
                is_banned=u.is_banned
            ) for u in users
        ]

    @staticmethod
    async def ban_user(user_id: str):
        user = await User.get(PydanticObjectId(user_id))
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        user.is_banned = True
        await user.save()
        return True

    @staticmethod
    async def delete_post(post_id: str):
        post = await Post.get(PydanticObjectId(post_id))
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        
        await post.delete()
        return True
