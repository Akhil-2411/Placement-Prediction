import pytest
from backend.app.schemas.prediction import StudentFeatures
from backend.app.ml.inference import ml_model
from backend.app.ml.explainability import explainer
from backend.app.services.prediction_service import prediction_service

def test_model_loading():
    assert ml_model.is_loaded is True
    assert ml_model.model is not None
    assert len(ml_model.model.coef_[0]) == 22

def test_prediction_output():
    # Strong profile
    strong_student = StudentFeatures(
        branch="CSE",
        college_tier="Tier-1",
        cgpa=9.2,
        backlogs=0,
        coding_skills=9,
        dsa_score=9,
        aptitude_score=90,
        communication_skills=9,
        ml_knowledge=8,
        system_design=7,
        internships=2,
        projects_count=4,
        certifications=3,
        hackathons=2,
        open_source_contributions=2,
        extracurriculars=2
    )
    
    pred, prob, meta = ml_model.predict(strong_student)
    assert pred == 1
    assert prob > 70.0
    assert 0.0 <= prob <= 100.0

def test_at_risk_student():
    # Low profile with arrears
    struggling_student = StudentFeatures(
        branch="Chemical",
        college_tier="Tier-3",
        cgpa=5.2,
        backlogs=3,
        coding_skills=2,
        dsa_score=2,
        aptitude_score=35,
        communication_skills=3,
        ml_knowledge=1,
        system_design=1,
        internships=0,
        projects_count=1,
        certifications=0,
        hackathons=0,
        open_source_contributions=0,
        extracurriculars=0
    )
    
    pred, prob, meta = ml_model.predict(struggling_student)
    assert pred == 0
    assert prob < 40.0

def test_full_prediction_service():
    student = StudentFeatures(
        branch="ECE",
        college_tier="Tier-2",
        cgpa=7.8,
        backlogs=0,
        coding_skills=7,
        dsa_score=7,
        aptitude_score=75,
        communication_skills=7,
        ml_knowledge=5,
        system_design=4,
        internships=1,
        projects_count=3,
        certifications=2,
        hackathons=1,
        open_source_contributions=0,
        extracurriculars=1
    )
    
    response = prediction_service.process_prediction(student)
    assert response.status in ["Placed", "Not Placed"]
    assert 0.0 <= response.probability <= 100.0
    assert len(response.factor_contributions) == 22
    assert len(response.radar_data) == 6
    assert len(response.recommendations) > 0
    assert response.risk_tier in ["High Readiness", "Moderate Readiness", "At-Risk / Action Required"]
