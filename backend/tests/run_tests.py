import unittest
import sys
from pathlib import Path

# Add project root to sys.path
ROOT_DIR = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(ROOT_DIR))

from backend.app.schemas.prediction import StudentFeatures
from backend.app.ml.inference import ml_model
from backend.app.ml.explainability import explainer
from backend.app.services.prediction_service import prediction_service
from backend.app.services.eligibility_service import eligibility_service
from starlette.testclient import TestClient
from backend.app.main import app

class BackendTestSuite(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_01_model_loading(self):
        self.assertTrue(ml_model.is_loaded)
        self.assertIsNotNone(ml_model.model)
        self.assertEqual(len(ml_model.model.coef_[0]), 22)

    def test_02_strong_student_prediction(self):
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
        self.assertEqual(pred, 1)
        self.assertGreater(prob, 70.0)

    def test_03_at_risk_prediction(self):
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
        self.assertEqual(pred, 0)
        self.assertLess(prob, 40.0)

    def test_04_factor_contributions_and_radar(self):
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
        res = prediction_service.process_prediction(student)
        self.assertIn(res.status, ["Placed", "Not Placed"])
        self.assertEqual(len(res.factor_contributions), 22)
        self.assertEqual(len(res.radar_data), 6)
        self.assertGreater(len(res.recommendations), 0)

    def test_05_health_endpoint(self):
        res = self.client.get("/health")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["status"], "healthy")

    def test_06_predict_endpoint(self):
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
        res = self.client.post("/api/v1/predict", json=payload)
        self.assertEqual(res.status_code, 200)
        body = res.json()
        self.assertEqual(body["status"], "Placed")
        self.assertGreater(body["probability"], 60.0)

    def test_07_eligibility_endpoint(self):
        res = self.client.post("/api/v1/eligibility/check", json={"cgpa": 8.2, "backlogs": 0, "branch": "CSE"})
        self.assertEqual(res.status_code, 200)
        items = res.json()
        self.assertGreaterEqual(len(items), 5)

    def test_08_analytics_endpoint(self):
        res = self.client.get("/api/v1/analytics/cohort")
        self.assertEqual(res.status_code, 200)
        self.assertGreater(res.json()["total_students"], 0)

if __name__ == "__main__":
    unittest.main()
