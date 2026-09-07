import math
from typing import List, Tuple
from ..schemas.prediction import StudentFeatures, PredictionResponse
from ..ml.inference import ml_model
from ..ml.explainability import explainer
from ..services.recommendation_service import recommendation_service

class PredictionService:
    @staticmethod
    def process_prediction(features: StudentFeatures) -> PredictionResponse:
        # 1. Inference
        raw_pred, probability, metadata = ml_model.predict(features)
        status = "Placed" if raw_pred == 1 else "Not Placed"

        # 2. Risk classification
        if probability >= 75.0:
            risk_tier = "High Readiness"
        elif probability >= 50.0:
            risk_tier = "Moderate Readiness"
        else:
            risk_tier = "At-Risk / Action Required"

        # 3. Percentile estimation (based on normal cumulative approx over dataset distribution)
        # Average probability across 100k data is ~68.5%
        z_approx = (probability - 68.5) / 18.0
        percentile = round(max(1.0, min(99.0, (1.0 / (1.0 + math.exp(-1.7 * z_approx))) * 100.0)), 1)
        confidence_score = round(abs(probability - 50.0) * 2.0, 1)

        # 4. Factor Contributions & Radar
        contributions = explainer.compute_factor_contributions(features)
        radar_data = explainer.generate_radar_data(features)

        # 5. Strengths and Weaknesses
        strengths: List[str] = []
        weaknesses: List[str] = []

        for item in contributions:
            if item.direction == 'positive' and len(strengths) < 4:
                strengths.append(f"{item.display_name}: {item.interpretation}")
            elif item.direction == 'negative' and len(weaknesses) < 4:
                weaknesses.append(f"{item.display_name}: {item.interpretation}")

        # 6. Actionable recommendations
        recommendations = recommendation_service.generate_recommendations(features, probability)

        return PredictionResponse(
            prediction=raw_pred,
            status=status,
            probability=probability,
            confidence_score=confidence_score,
            percentile_estimate=percentile,
            risk_tier=risk_tier,
            strengths=strengths,
            weaknesses=weaknesses,
            factor_contributions=contributions,
            recommendations=recommendations,
            radar_data=radar_data,
            model_metadata=metadata
        )

prediction_service = PredictionService()
