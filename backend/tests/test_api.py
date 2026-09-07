from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["model_loaded"] is True

def test_feature_metadata():
    response = client.get("/api/v1/features/metadata")
    assert response.status_code == 200
    data = response.json()
    assert "CSE" in data["branches"]
    assert "Tier-1" in data["college_tiers"]
    assert "cgpa" in data["ranges"]

def test_prediction_endpoint():
    payload = {
        "profile": {
            "branch": "CSE",
            "college_tier": "Tier-1",
            "cgpa": 8.5,
            "backlogs": 0,
            "coding_skills": 8,
            "dsa_score": 8,
            "aptitude_score": 80,
            "communication_skills": 8,
            "ml_knowledge": 6,
            "system_design": 5,
            "internships": 2,
            "projects_count": 3,
            "certifications": 2,
            "hackathons": 1,
            "open_source_contributions": 1,
            "extracurriculars": 1
        }
    }
    response = client.post("/api/v1/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "Placed"
    assert data["probability"] > 60.0
    assert len(data["factor_contributions"]) == 22
    assert len(data["radar_data"]) == 6
    assert len(data["recommendations"]) > 0

def test_eligibility_check():
    payload = {
        "cgpa": 8.2,
        "backlogs": 0,
        "branch": "CSE"
    }
    response = client.post("/api/v1/eligibility/check", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 5
    # Should be eligible for Google (min cgpa 8.5? no, 8.2 < 8.5 so Google is false, Microsoft min 8.0 is true)
    msft = next((c for c in data if c["company_name"] == "Microsoft"), None)
    assert msft is not None
    assert msft["is_eligible"] is True

def test_cohort_analytics():
    response = client.get("/api/v1/analytics/cohort")
    assert response.status_code == 200
    data = response.json()
    assert data["total_students"] > 0
    assert len(data["branch_metrics"]) > 0
    assert len(data["global_factors"]) == 22
