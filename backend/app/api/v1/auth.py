from fastapi import APIRouter, Depends
from app.schemas.user_schema import UserCreate, UserLogin, UserResponse, Token
from app.services.auth_service import AuthService

router = APIRouter()

@router.post("/register", response_model=UserResponse)
async def register(user_data: UserCreate):
    user = await AuthService.register_user(user_data)
    # Beanie IDs are ObjectIds, convert to str for Pydantic response
    return UserResponse(
        id=str(user.id),
        email=user.email,
        full_name=user.full_name,
        role=user.role,
        is_banned=user.is_banned
    )

@router.post("/login", response_model=Token)
async def login(login_data: UserLogin):
    return await AuthService.authenticate_user(login_data)
