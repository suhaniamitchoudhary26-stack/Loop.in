from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.schemas.user_schema import UserResponse
from app.services.admin_service import AdminService
from app.api import deps
from app.models.user import User

router = APIRouter()

# Dependency to check admin role
async def get_current_admin(current_user: User = Depends(deps.get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user doesn't have enough privileges"
        )
    return current_user

@router.get("/users", response_model=List[UserResponse])
async def list_users(admin: User = Depends(get_current_admin)):
    return await AdminService.get_all_users()

@router.put("/users/{user_id}/ban")
async def ban_user(user_id: str, admin: User = Depends(get_current_admin)):
    await AdminService.ban_user(user_id)
    return {"message": "User banned successfully"}

@router.delete("/posts/{post_id}")
async def delete_post(post_id: str, admin: User = Depends(get_current_admin)):
    await AdminService.delete_post(post_id)
    return {"message": "Post deleted successfully"}
