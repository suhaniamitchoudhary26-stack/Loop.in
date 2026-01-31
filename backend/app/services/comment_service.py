from typing import List, Dict, Any
from beanie import PydanticObjectId
from app.models.comment import Comment
from app.models.user import User
from app.schemas.comment_schema import CommentCreate, CommentResponse

class CommentService:
    
    @staticmethod
    async def create_comment(data: CommentCreate, user: User) -> Comment:
        comment = Comment(
            content=data.content,
            post_id=PydanticObjectId(data.post_id),
            parent_id=PydanticObjectId(data.parent_id) if data.parent_id else None,
            author=user,
            is_anonymous=data.is_anonymous
        )
        await comment.insert()
        return comment

    @staticmethod
    async def get_comments_for_post(post_id: str) -> List[CommentResponse]:
        # Fetch all comments for the post
        # In a real app with massive comments, we'd use aggregation or graph lookup
        # For MVP, fetching all and assembling in memory is acceptable and simpler
        comments = await Comment.find(
            Comment.post_id == PydanticObjectId(post_id),
            fetch_links=True
        ).sort("+created_at").to_list()
        
        # Build map
        comment_map: Dict[str, CommentResponse] = {}
        roots: List[CommentResponse] = []
        
        # First pass: create Response objects
        for c in comments:
            author_name = "Anonymous"
            if not c.is_anonymous and c.author:
                author_name = c.author.full_name
            
            c_resp = CommentResponse(
                id=str(c.id),
                content=c.content,
                parent_id=str(c.parent_id) if c.parent_id else None,
                author_name=author_name,
                created_at=c.created_at,
                replies=[]
            )
            comment_map[str(c.id)] = c_resp
        
        # Second pass: assemble tree
        for _, c_resp in comment_map.items():
            if c_resp.parent_id:
                parent = comment_map.get(c_resp.parent_id)
                if parent:
                    parent.replies.append(c_resp)
                else:
                    # Parent not found (deleted?), treat as root or orphan (adding to root for visibility)
                    roots.append(c_resp) 
            else:
                roots.append(c_resp)
        
        return roots
