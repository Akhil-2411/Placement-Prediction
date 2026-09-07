from typing import List, Dict, Any
from pydantic import BaseModel

class BranchPlacementMetric(BaseModel):
    branch: str
    total_students: int
    placed_count: int
    placement_rate: float
    avg_probability: float

class RiskDistribution(BaseModel):
    high_readiness: int
    moderate: int
    at_risk: int

class GlobalFactorCoefficient(BaseModel):
    feature: str
    display_name: str
    coefficient: float
    odds_ratio: float
    description: str

class CohortOverview(BaseModel):
    total_students: int
    placement_ready_percentage: float
    avg_placement_probability: float
    at_risk_count: int
    active_drives_count: int
    branch_metrics: List[BranchPlacementMetric]
    risk_distribution: RiskDistribution
    global_factors: List[GlobalFactorCoefficient]
