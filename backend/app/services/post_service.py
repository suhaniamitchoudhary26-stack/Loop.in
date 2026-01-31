from typing import List
from app.models.post import Post
from app.schemas.post_schema import PostResponse

class PostService:
    
    @staticmethod
    async def get_posts(department_id: str = None) -> List[PostResponse]:
        # Fetch posts with author info populated
        query = Post.find_all(fetch_links=True, sort=[("-created_at")])
        if department_id:
            query = Post.find(Post.department_id == department_id, fetch_links=True, sort=[("-created_at")])
        
        posts = await query.to_list()

        response_posts = []
        for post in posts:
            author_name = "Anonymous"
            if not post.is_anonymous and post.author:
                author_name = post.author.full_name
            
            response_posts.append(PostResponse(
                id=str(post.id),
                title=post.title,
                content=post.content,
                is_anonymous=post.is_anonymous,
                department_id=post.department_id,
                author_name=author_name,
                created_at=post.created_at
            ))
        return response_posts
        
    @staticmethod
    async def create_post(post_data, user: User) -> Post:
        post = Post(
            title=post_data.title,
            content=post_data.content,
            is_anonymous=post_data.is_anonymous,
            department_id=post_data.department_id,
            author=user
        )
        await post.insert()
        return post
