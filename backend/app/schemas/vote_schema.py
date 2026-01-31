from pydantic import BaseModel, Field
from typing import Literal

class VoteCreate(BaseModel):
    target_id: str
    target_type: Literal["post", "comment"]

class VoteResponse(BaseModel):
    message: str
    target_id: str
    new_count: int # For UI update (placeholder, real count usually fetched separately or computed)
