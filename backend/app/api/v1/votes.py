from fastapi import APIRouter, Depends
from app.schemas.vote_schema import VoteCreate, VoteResponse
from app.services.vote_service import VoteService
from app.api import deps
from app.models.user import User

router = APIRouter()

@router.post("/", response_model=VoteResponse)
async def vote(
    vote_in: VoteCreate, 
    current_user: User = Depends(deps.get_current_user)
):
    await VoteService.add_vote(vote_in, current_user)
    
    # In a full impl, we'd return the new total count.
    # For now returning success message.
    return VoteResponse(
        message="Vote added",
        target_id=vote_in.target_id,
        new_count=0 # Placeholder
    )
