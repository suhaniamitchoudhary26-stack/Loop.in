from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.core.config import settings

from app.models.user import User
from app.models.post import Post
from app.models.comment import Comment
from app.models.vote import Vote
from app.models.announcement import Announcement
from app.models.department import Department

async def init_db():
    client = AsyncIOMotorClient(settings.MONGO_URI)
    
    # Initialize Beanie with the database and models
    await init_beanie(database=client[settings.MONGO_DB_NAME], document_models=[User, Post, Comment, Vote, Announcement, Department])
    
    # For now, just verification of connection
    print(f"Connected to MongoDB at {settings.MONGO_URI}")
    return client
