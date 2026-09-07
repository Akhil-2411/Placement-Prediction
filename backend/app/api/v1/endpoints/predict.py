from fastapi import APIRouter, HTTPException, status
from ....schemas.prediction import PredictRequest, PredictionResponse, StudentFeatures
from ....services.prediction_service import prediction_service
from ....ml.inference import ml_model, FEATURE_ORDER, POPULATION_MEANS

router = APIRouter()

@router.post(
    "/predict",
    response_model=PredictionResponse,
    status_code=status.HTTP_200_OK,
    summary="Predict placement probability and explainability insights",
    description="Validates student profile, performs one-hot encoding, runs balanced Logistic Regression, and computes factor contributions."
)
async def predict_placement(request: PredictRequest):
    try:
        response = prediction_service.process_prediction(request.profile)
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference execution failed: {str(e)}"
        )

@router.get(
    "/features/metadata",
    summary="Get feature constraints, allowable categories, and dataset baselines",
    description="Returns metadata used by client forms for input validation and interactive sliders."
)
async def get_feature_metadata():
    return {
        "branches": ['CSE', 'IT', 'ECE', 'EE', 'ME', 'CE', 'Chemical'],
        "college_tiers": ['Tier-1', 'Tier-2', 'Tier-3'],
        "ranges": {
            "cgpa": {"min": 0.0, "max": 10.0, "step": 0.01, "default": 7.5},
            "backlogs": {"min": 0, "max": 10, "step": 1, "default": 0},
            "coding_skills": {"min": 1, "max": 10, "step": 1, "default": 6},
            "dsa_score": {"min": 1, "max": 10, "step": 1, "default": 6},
            "aptitude_score": {"min": 0, "max": 100, "step": 1, "default": 65},
            "communication_skills": {"min": 1, "max": 10, "step": 1, "default": 6},
            "ml_knowledge": {"min": 0, "max": 10, "step": 1, "default": 5},
            "system_design": {"min": 0, "max": 10, "step": 1, "default": 4},
            "internships": {"min": 0, "max": 10, "step": 1, "default": 1},
            "projects_count": {"min": 0, "max": 15, "step": 1, "default": 2},
            "certifications": {"min": 0, "max": 10, "step": 1, "default": 1},
            "hackathons": {"min": 0, "max": 10, "step": 1, "default": 1},
            "open_source_contributions": {"min": 0, "max": 10, "step": 1, "default": 0},
            "extracurriculars": {"min": 0, "max": 10, "step": 1, "default": 1}
        },
        "feature_order": FEATURE_ORDER,
        "population_baselines": POPULATION_MEANS
    }
