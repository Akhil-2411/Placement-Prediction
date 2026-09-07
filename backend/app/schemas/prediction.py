from typing import List, Optional, Literal, Dict, Any
from pydantic import BaseModel, Field, field_validator

BranchType = Literal['CSE', 'IT', 'ECE', 'EE', 'ME', 'CE', 'Chemical']
CollegeTierType = Literal['Tier-1', 'Tier-2', 'Tier-3']

class StudentFeatures(BaseModel):
    branch: BranchType = Field(..., description="Engineering discipline")
    college_tier: CollegeTierType = Field(..., description="Institutional classification")
    cgpa: float = Field(..., ge=0.0, le=10.0, description="Cumulative Grade Point Average (0.0 to 10.0)")
    backlogs: int = Field(default=0, ge=0, le=20, description="Count of active backlogs")
    coding_skills: int = Field(..., ge=1, le=10, description="Core programming proficiency (1 to 10)")
    dsa_score: int = Field(..., ge=1, le=10, description="Data Structures & Algorithms mastery (1 to 10)")
    aptitude_score: int = Field(..., ge=0, le=100, description="Quantitative & Logical Aptitude score (0 to 100)")
    communication_skills: int = Field(..., ge=1, le=10, description="Verbal and interview articulation (1 to 10)")
    ml_knowledge: int = Field(default=0, ge=0, le=10, description="Machine Learning domain knowledge (0 to 10)")
    system_design: int = Field(default=0, ge=0, le=10, description="Architecture and distributed systems knowledge (0 to 10)")
    internships: int = Field(default=0, ge=0, le=10, description="Completed industrial internships")
    projects_count: int = Field(default=0, ge=0, le=20, description="Completed software/engineering projects")
    certifications: int = Field(default=0, ge=0, le=20, description="Relevant professional or technical certifications")
    hackathons: int = Field(default=0, ge=0, le=20, description="Hackathons attended or awards won")
    open_source_contributions: int = Field(default=0, ge=0, le=20, description="Accepted pull requests or open source projects")
    extracurriculars: int = Field(default=0, ge=0, le=20, description="Leadership, clubs, and extracurricular activities")

    @field_validator('cgpa')
    @classmethod
    def round_cgpa(cls, v: float) -> float:
        return round(v, 2)

class PredictRequest(BaseModel):
    user_id: Optional[str] = Field(None, description="Optional Supabase user UUID to persist prediction")
    profile: StudentFeatures

class FactorContribution(BaseModel):
    feature_name: str
    display_name: str
    student_value: Any
    baseline_value: float
    coefficient: float
    impact_score: float = Field(..., description="Log-odds contribution relative to population benchmark")
    direction: Literal['positive', 'negative', 'neutral']
    interpretation: str

class RecommendationItem(BaseModel):
    category: str
    title: str
    description: str
    priority: Literal['high', 'medium', 'low']
    action_type: str
    expected_impact: str

class RadarDimension(BaseModel):
    dimension: str
    student_score: float
    benchmark_score: float
    full_mark: float = 10.0

class PredictionResponse(BaseModel):
    prediction: int = Field(..., description="Binary prediction: 1 for Placed, 0 for Not Placed")
    status: Literal['Placed', 'Not Placed']
    probability: float = Field(..., description="Calibrated placement probability percentage (0.0 to 100.0)")
    confidence_score: float
    percentile_estimate: float
    risk_tier: Literal['High Readiness', 'Moderate Readiness', 'At-Risk / Action Required']
    strengths: List[str]
    weaknesses: List[str]
    factor_contributions: List[FactorContribution]
    recommendations: List[RecommendationItem]
    radar_data: List[RadarDimension]
    model_metadata: Dict[str, Any]
    explanation_disclaimer: str = (
        "Factor contributions represent statistical associations learned by the Logistic Regression model "
        "on historical cohort placement data and should not be interpreted as deterministic causal guarantees."
    )
