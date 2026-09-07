# PlaceIQ REST API Specification (v1)

Base URL: `/api/v1`

---

## 1. Inference & Prediction

### `POST /api/v1/predict`
Calculates placement probability and factor attributions from student profile metrics.

#### Request Body
```json
{
  "user_id": "optional-uuid-string",
  "profile": {
    "branch": "CSE",
    "college_tier": "Tier-1",
    "cgpa": 8.75,
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
```

#### Response (200 OK)
```json
{
  "prediction": 1,
  "status": "Placed",
  "probability": 94.37,
  "confidence_score": 88.7,
  "percentile_estimate": 93.2,
  "risk_tier": "High Readiness",
  "strengths": [
    "Academic CGPA: High CGPA (8.75) provides strong statistical advantage across tech shortlists."
  ],
  "weaknesses": [],
  "factor_contributions": [
    {
      "feature_name": "cgpa",
      "display_name": "Academic CGPA",
      "student_value": 8.75,
      "baseline_value": 7.21,
      "coefficient": 0.2941,
      "impact_score": 0.454,
      "direction": "positive",
      "interpretation": "High CGPA provides strong statistical advantage."
    }
  ],
  "recommendations": [
    {
      "category": "Excellence",
      "title": "Target Super-Dream & High-CTC Product Companies",
      "description": "Your profile shows strong readiness across academic, DSA, and technical dimensions.",
      "priority": "low",
      "action_type": "Advanced Specialization",
      "expected_impact": "Qualify for 20+ LPA product engineering roles"
    }
  ],
  "radar_data": [
    { "dimension": "Academic Standing", "student_score": 8.8, "benchmark_score": 7.8, "full_mark": 10.0 }
  ],
  "model_metadata": {
    "model_type": "LogisticRegression",
    "features_count": 22,
    "raw_log_odds": 2.81,
    "intercept": -4.9037,
    "classes": [0, 1]
  },
  "explanation_disclaimer": "Factor contributions represent statistical associations learned by the Logistic Regression model..."
}
```

---

## 2. Model Metadata & Constraints

### `GET /api/v1/features/metadata`
Returns allowable disciplines, institutional tiers, and numerical limits used for frontend validation and slider constraints.

---

## 3. Eligibility & Campus Recruitment

### `POST /api/v1/eligibility/check`
Evaluates student eligibility against all active company recruitment drives.

#### Request Body
```json
{
  "cgpa": 8.2,
  "backlogs": 0,
  "branch": "CSE"
}
```

#### Response (200 OK)
```json
[
  {
    "company_id": "comp-1",
    "company_name": "Google",
    "role_title": "Associate Software Engineer",
    "package_lpa": 32.0,
    "is_eligible": false,
    "reasons": ["Active backlogs (0) within allowable limit (0)"],
    "missing_criteria": ["CGPA 8.20 is below minimum requirement of 8.50"]
  }
]
```

---

## 4. Cohort Analytics (Officers & Admins)

### `GET /api/v1/analytics/cohort`
Provides cohort-level intelligence: total students assessed, placement ready %, risk category distributions, and discipline-wise conversion rates.

### `GET /api/v1/analytics/factors`
Returns global Logistic Regression model coefficients, log-odds values, and odds ratios ($e^w$) for all 22 features.
