from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.core.config import settings
from app.core.database import init_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_db()
    yield
    # Shutdown
    pass

from app.api.v1 import auth
from app.api.v1 import posts
from app.api.v1 import comments
from app.api.v1 import votes
from app.api.v1 import announcements
from app.api.v1 import departments
from app.api.v1 import admin

app = FastAPI(
    title=settings.PROJECT_NAME,
    lifespan=lifespan
)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(posts.router, prefix="/api/v1/posts", tags=["Posts"])
app.include_router(comments.router, prefix="/api/v1/comments", tags=["Comments"])
app.include_router(votes.router, prefix="/api/v1/votes", tags=["Votes"])
app.include_router(announcements.router, prefix="/api/v1/announcements", tags=["Announcements"])
app.include_router(departments.router, prefix="/api/v1/departments", tags=["Departments"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["Admin"])

@app.get("/health")
async def health_check():
    return {"status": "ok", "db": "connected"}

@app.get("/")
async def root():
    return {"message": "Welcome to the Student Community Platform API"}
