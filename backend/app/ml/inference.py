import logging
import os
import joblib
import numpy as np
import pandas as pd
from typing import Dict, Any, Tuple
from ..core.config import settings
from ..schemas.prediction import StudentFeatures

logger = logging.getLogger(__name__)

FEATURE_ORDER = [
    'cgpa',
    'backlogs',
    'coding_skills',
    'dsa_score',
    'aptitude_score',
    'communication_skills',
    'ml_knowledge',
    'system_design',
    'internships',
    'projects_count',
    'certifications',
    'hackathons',
    'open_source_contributions',
    'extracurriculars',
    'branch_CSE',
    'branch_Chemical',
    'branch_ECE',
    'branch_EE',
    'branch_IT',
    'branch_ME',
    'college_tier_Tier-2',
    'college_tier_Tier-3'
]

# Population baseline means computed from the 100,000 student dataset
POPULATION_MEANS = {
    'cgpa': 7.206,
    'backlogs': 0.547,
    'coding_skills': 5.995,
    'dsa_score': 5.501,
    'aptitude_score': 64.991,
    'communication_skills': 5.991,
    'ml_knowledge': 4.509,
    'system_design': 4.008,
    'internships': 1.095,
    'projects_count': 2.397,
    'certifications': 1.500,
    'hackathons': 0.746,
    'open_source_contributions': 0.451,
    'extracurriculars': 1.151,
    'branch_CSE': 0.143,
    'branch_Chemical': 0.143,
    'branch_ECE': 0.143,
    'branch_EE': 0.143,
    'branch_IT': 0.143,
    'branch_ME': 0.143,
    'college_tier_Tier-2': 0.333,
    'college_tier_Tier-3': 0.333
}

class PlacementMLModel:
    def __init__(self, model_path: str = None):
        self.model_path = model_path or settings.MODEL_PATH
        self.model = None
        self.is_loaded = False
        self._load_model()

    def _load_model(self):
        try:
            if os.path.exists(self.model_path):
                self.model = joblib.load(self.model_path)
                self.is_loaded = True
                logger.info(f"Loaded placement model successfully from {self.model_path}")
            else:
                logger.warning(f"Model file not found at {self.model_path}. ML features may fail.")
        except Exception as e:
            logger.error(f"Failed to load ML model from {self.model_path}: {e}")
            self.is_loaded = False

    def preprocess(self, features: StudentFeatures) -> pd.DataFrame:
        """
        Transforms raw StudentFeatures Pydantic schema into exact 22-column DataFrame
        matching notebook pd.get_dummies(..., drop_first=True) encoding.
        """
        data = {
            'cgpa': float(features.cgpa),
            'backlogs': int(features.backlogs),
            'coding_skills': int(features.coding_skills),
            'dsa_score': int(features.dsa_score),
            'aptitude_score': float(features.aptitude_score),
            'communication_skills': int(features.communication_skills),
            'ml_knowledge': int(features.ml_knowledge),
            'system_design': int(features.system_design),
            'internships': int(features.internships),
            'projects_count': int(features.projects_count),
            'certifications': int(features.certifications),
            'hackathons': int(features.hackathons),
            'open_source_contributions': int(features.open_source_contributions),
            'extracurriculars': int(features.extracurriculars),
            # Branch one-hot encoding (baseline is 'CE')
            'branch_CSE': 1 if features.branch == 'CSE' else 0,
            'branch_Chemical': 1 if features.branch == 'Chemical' else 0,
            'branch_ECE': 1 if features.branch == 'ECE' else 0,
            'branch_EE': 1 if features.branch == 'EE' else 0,
            'branch_IT': 1 if features.branch == 'IT' else 0,
            'branch_ME': 1 if features.branch == 'ME' else 0,
            # College tier one-hot encoding (baseline is 'Tier-1')
            'college_tier_Tier-2': 1 if features.college_tier == 'Tier-2' else 0,
            'college_tier_Tier-3': 1 if features.college_tier == 'Tier-3' else 0,
        }
        df = pd.DataFrame([data], columns=FEATURE_ORDER)
        return df

    def predict(self, features: StudentFeatures) -> Tuple[int, float, Dict[str, Any]]:
        """
        Executes inference, returning:
        - prediction (0 or 1)
        - probability (0.0 - 100.0)
        - metadata dict
        """
        if not self.is_loaded or self.model is None:
            self._load_model()
            if not self.is_loaded:
                raise RuntimeError("ML model is not loaded. Cannot execute prediction.")

        df_input = self.preprocess(features)
        
        # Scikit-learn Logistic Regression inference
        raw_pred = self.model.predict(df_input)[0]
        raw_prob = self.model.predict_proba(df_input)[0]
        
        # Placement class is index 1
        placed_prob = float(raw_prob[1]) * 100.0
        placed_prob = round(max(0.0, min(100.0, placed_prob)), 2)
        
        metadata = {
            "model_type": type(self.model).__name__,
            "features_count": len(FEATURE_ORDER),
            "raw_log_odds": float(self.model.decision_function(df_input)[0]),
            "intercept": float(self.model.intercept_[0]),
            "classes": [int(c) for c in self.model.classes_]
        }
        
        return int(raw_pred), placed_prob, metadata

# Singleton instance
ml_model = PlacementMLModel()
