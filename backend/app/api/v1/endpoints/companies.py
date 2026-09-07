import uuid
from typing import List
from fastapi import APIRouter
from ....schemas.company import CompanyResponse, CompanyCreate
from ....services.eligibility_service import SAMPLE_COMPANIES

router = APIRouter()

# In-memory storage with initial seed for demonstration / mock fallbacks
ACTIVE_COMPANIES = [
    CompanyResponse(
        id=c["company_id"],
        name=c["company_name"],
        role_title=c["role_title"],
        min_cgpa=c["min_cgpa"],
        max_backlogs=c["max_backlogs"],
        eligible_branches=c["eligible_branches"],
        package_lpa=c["package_lpa"],
        location="Bangalore / Hyderabad",
        description="Campus placement engineering role."
    )
    for c in SAMPLE_COMPANIES
]

@router.get(
    "",
    response_model=List[CompanyResponse],
    summary="List all active campus placement drives"
)
async def list_companies():
    return ACTIVE_COMPANIES

@router.post(
    "",
    response_model=CompanyResponse,
    summary="Register a new company drive (Officers & Admins)"
)
async def create_company(company_in: CompanyCreate):
    new_company = CompanyResponse(
        id=f"comp-{uuid.uuid4().hex[:8]}",
        **company_in.model_dump()
    )
    ACTIVE_COMPANIES.append(new_company)
    return new_company
