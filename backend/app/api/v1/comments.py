from fastapi import APIRouter, Depends
from typing import List
from app.schemas.comment_schema import CommentCreate, CommentResponse
from app.services.comment_service import CommentService
from app.api import deps
from app.models.user import User

router = APIRouter()

@router.post("/", response_model=CommentResponse)
async def create_comment(
    comment_in: CommentCreate, 
    current_user: User = Depends(deps.get_current_user)
):
    comment = await CommentService.create_comment(comment_in, current_user)
    
    # Construct response (flat for creation return, or could return full tree if we wanted)
    # Returning simple flat rep for created item is standard, but matching schema req
    author_name = "Anonymous"
    if not comment.is_anonymous:
        author_name = current_user.full_name
        
    return CommentResponse(
        id=str(comment.id),
        content=comment.content,
        parent_id=str(comment.parent_id) if comment.parent_id else None,
        author_name=author_name,
        created_at=comment.created_at,
        replies=[]
    )

@router.get("/post/{post_id}", response_model=List[CommentResponse])
async def get_comments(post_id: str):
    return await CommentService.get_comments_for_post(post_id)
