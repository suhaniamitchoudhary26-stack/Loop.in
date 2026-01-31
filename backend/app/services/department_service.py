from typing import List
from app.models.department import Department
from app.schemas.department_schema import DepartmentCreate, DepartmentResponse

class DepartmentService:
    
    @staticmethod
    async def get_all_departments() -> List[DepartmentResponse]:
        departments = await Department.find_all().to_list()
        return [
            DepartmentResponse(id=str(d.id), name=d.name, code=d.code) 
            for d in departments
        ]

    @staticmethod
    async def create_department(data: DepartmentCreate) -> Department:
        # Helper for seeding
        dept = await Department(name=data.name, code=data.code).insert()
        return dept
