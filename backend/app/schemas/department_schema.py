from pydantic import BaseModel

class DepartmentCreate(BaseModel):
    name: str
    code: str

class DepartmentResponse(BaseModel):
    id: str
    name: str
    code: str
    
    class Config:
        from_attributes = True
