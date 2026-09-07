from fastapi import APIRouter
from .endpoints import predict, analytics, eligibility, companies

api_router = APIRouter()

api_router.include_router(predict.router, tags=["Prediction"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])
api_router.include_router(eligibility.router, prefix="/eligibility", tags=["Eligibility"])
api_router.include_router(companies.router, prefix="/companies", tags=["Companies"])
