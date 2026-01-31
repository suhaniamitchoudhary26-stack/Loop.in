from fastapi import APIRouter, Depends
from app.schemas.post_schema import PostResponse, PostCreate
from app.services.post_service import PostService
from app.schemas.comment_schema import CommentResponse
from app.services.comment_service import CommentService
from app.api import deps
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[PostResponse])
async def get_posts(department_id: str = None):
    return await PostService.get_posts(department_id)

@router.post("/", response_model=PostResponse)
async def create_post(post_in: PostCreate, current_user: User = Depends(deps.get_current_user)):
    post = await PostService.create_post(post_in, current_user)
    
    # Manually construct response to handle anonymous logic check immediately
    author_name = "Anonymous"
    if not post.is_anonymous:
        author_name = current_user.full_name

    return PostResponse(
        id=str(post.id),
        title=post.title,
        content=post.content,
        is_anonymous=post.is_anonymous,
        department_id=post.department_id,
        author_name=author_name,
        created_at=post.created_at
    )

@router.get("/{post_id}/comments", response_model=List[CommentResponse])
async def get_post_comments(post_id: str):
    return await CommentService.get_comments_for_post(post_id)
