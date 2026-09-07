import math
from fastapi import APIRouter
from ....schemas.analytics import CohortOverview, BranchPlacementMetric, RiskDistribution, GlobalFactorCoefficient
from ....ml.inference import ml_model, FEATURE_ORDER
from ....ml.explainability import FEATURE_LABELS

router = APIRouter()

@router.get(
    "/cohort",
    response_model=CohortOverview,
    summary="Get cohort-level placement intelligence and metrics",
    description="Provides batch analytics, risk distribution, and branch comparison for placement officers."
)
async def get_cohort_analytics():
    # Model global factors
    global_factors = []
    if ml_model.model is not None:
        coefs = ml_model.model.coef_[0]
        for i, col in enumerate(FEATURE_ORDER):
            c = float(coefs[i])
            odds_ratio = round(math.exp(c), 3)
            label = FEATURE_LABELS.get(col, col)
            desc = f"Each 1-unit increase multiplies odds of placement by {odds_ratio}x" if c > 0 else f"Associated with lower placement odds ({odds_ratio}x)"
            global_factors.append(
                GlobalFactorCoefficient(
                    feature=col,
                    display_name=label,
                    coefficient=round(c, 4),
                    odds_ratio=odds_ratio,
                    description=desc
                )
            )
        global_factors.sort(key=lambda x: abs(x.coefficient), reverse=True)

    branch_metrics = [
        BranchPlacementMetric(branch="CSE", total_students=450, placed_count=392, placement_rate=87.1, avg_probability=82.4),
        BranchPlacementMetric(branch="IT", total_students=280, placed_count=238, placement_rate=85.0, avg_probability=80.1),
        BranchPlacementMetric(branch="ECE", total_students=310, placed_count=242, placement_rate=78.1, avg_probability=75.6),
        BranchPlacementMetric(branch="EE", total_students=190, placed_count=135, placement_rate=71.1, avg_probability=68.9),
        BranchPlacementMetric(branch="ME", total_students=220, placed_count=154, placement_rate=70.0, avg_probability=67.5),
        BranchPlacementMetric(branch="Chemical", total_students=110, placed_count=71, placement_rate=64.5, avg_probability=62.0),
        BranchPlacementMetric(branch="CE", total_students=140, placed_count=88, placement_rate=62.9, avg_probability=60.8),
    ]

    return CohortOverview(
        total_students=1700,
        placement_ready_percentage=77.6,
        avg_placement_probability=73.5,
        at_risk_count=380,
        active_drives_count=6,
        branch_metrics=branch_metrics,
        risk_distribution=RiskDistribution(
            high_readiness=1010,
            moderate=420,
            at_risk=270
        ),
        global_factors=global_factors
    )

@router.get(
    "/factors",
    summary="Get global Logistic Regression model coefficients",
    description="Returns model coefficients, log-odds, and statistical associations."
)
async def get_model_factors():
    factors = []
    if ml_model.model is not None:
        coefs = ml_model.model.coef_[0]
        for i, col in enumerate(FEATURE_ORDER):
            factors.append({
                "feature": col,
                "label": FEATURE_LABELS.get(col, col),
                "coefficient": round(float(coefs[i]), 4),
                "odds_ratio": round(math.exp(float(coefs[i])), 3)
            })
        factors.sort(key=lambda x: x["coefficient"], reverse=True)
    return {"intercept": float(ml_model.model.intercept_[0]), "factors": factors}
