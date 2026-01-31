from typing import Optional
from beanie import Document, Indexed
from pydantic import Field

class Department(Document):
    name: str
    code: Indexed(str, unique=True)
    
    class Settings:
        name = "departments"
