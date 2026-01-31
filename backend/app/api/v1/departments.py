from fastapi import APIRouter
from typing import List
from app.schemas.department_schema import DepartmentResponse, DepartmentCreate
from app.services.department_service import DepartmentService

router = APIRouter()

@router.get("/", response_model=List[DepartmentResponse])
async def get_departments():
    return await DepartmentService.get_all_departments()

@router.post("/", response_model=DepartmentResponse)
async def create_department(dept: DepartmentCreate):
    # Public for now/MVP to easily seed, ideally Admin only
    return await DepartmentService.create_department(dept)
