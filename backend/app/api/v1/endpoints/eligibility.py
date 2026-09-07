from typing import List
from fastapi import APIRouter
from ....schemas.company import EligibilityCheckRequest, CompanyEligibilityStatus
from ....services.eligibility_service import eligibility_service

router = APIRouter()

@router.post(
    "/check",
    response_model=List[CompanyEligibilityStatus],
    summary="Evaluate student eligibility against all active campus drives",
    description="Filters companies by minimum CGPA, maximum backlogs, and permitted branches."
)
async def check_eligibility(req: EligibilityCheckRequest):
    return eligibility_service.evaluate_companies(
        cgpa=req.cgpa,
        backlogs=req.backlogs,
        branch=req.branch
    )
