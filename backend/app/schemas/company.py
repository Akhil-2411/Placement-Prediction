from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import date, datetime

class CompanyBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    role_title: str = Field(..., min_length=2, max_length=100)
    min_cgpa: float = Field(default=6.0, ge=0.0, le=10.0)
    max_backlogs: int = Field(default=0, ge=0)
    eligible_branches: List[str] = Field(default=['CSE', 'IT', 'ECE', 'EE', 'ME', 'CE', 'Chemical'])
    package_lpa: Optional[float] = Field(None, ge=0.0)
    location: Optional[str] = None
    deadline: Optional[date] = None
    description: Optional[str] = None

class CompanyCreate(CompanyBase):
    pass

class CompanyResponse(CompanyBase):
    id: str
    created_at: Optional[datetime] = None

class EligibilityCheckRequest(BaseModel):
    cgpa: float
    backlogs: int
    branch: str

class CompanyEligibilityStatus(BaseModel):
    company_id: str
    company_name: str
    role_title: str
    package_lpa: Optional[float]
    is_eligible: bool
    reasons: List[str]
    missing_criteria: List[str]
