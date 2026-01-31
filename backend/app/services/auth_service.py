from app.models.user import User
from app.schemas.user_schema import UserCreate, UserLogin
from app.core.security import get_password_hash, verify_password, create_access_token
from fastapi import HTTPException, status

class AuthService:
    
    @staticmethod
    async def register_user(user_data: UserCreate) -> User:
        existing_user = await User.find_one(User.email == user_data.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        hashed_password = get_password_hash(user_data.password)
        new_user = User(
            email=user_data.email,
            password_hash=hashed_password,
            full_name=user_data.full_name,
            role=user_data.role
        )
        await new_user.insert()
        return new_user

    @staticmethod
    async def authenticate_user(login_data: UserLogin) -> dict:
        user = await User.find_one(User.email == login_data.email)
        if not user or not verify_password(login_data.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        if user.is_banned:
             raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User is banned"
            )

        access_token = create_access_token(user.id, user.role)
        return {"access_token": access_token, "token_type": "bearer"}
