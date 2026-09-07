import numpy as np
from typing import List, Dict, Any, Tuple
from .inference import ml_model, FEATURE_ORDER, POPULATION_MEANS
from ..schemas.prediction import StudentFeatures, FactorContribution, RadarDimension

FEATURE_LABELS = {
    'branch_CSE': 'Computer Science Branch',
    'branch_IT': 'Information Technology Branch',
    'branch_ECE': 'Electronics & Communication',
    'branch_EE': 'Electrical Engineering',
    'branch_ME': 'Mechanical Engineering',
    'branch_Chemical': 'Chemical Engineering',
    'college_tier_Tier-2': 'Tier-2 Institutional Tier',
    'college_tier_Tier-3': 'Tier-3 Institutional Tier',
    'cgpa': 'Academic CGPA',
    'backlogs': 'Active Academic Backlogs',
    'coding_skills': 'Core Coding Proficiency',
    'dsa_score': 'DSA & Problem Solving',
    'aptitude_score': 'Aptitude & Reasoning',
    'communication_skills': 'Communication & Articulation',
    'ml_knowledge': 'Machine Learning Knowledge',
    'system_design': 'System Architecture Design',
    'internships': 'Industrial Internships',
    'projects_count': 'Technical Projects',
    'certifications': 'Industry Certifications',
    'hackathons': 'Hackathons & Contests',
    'open_source_contributions': 'Open Source Contributions',
    'extracurriculars': 'Extracurricular Activities'
}

class PlacementExplainer:
    def __init__(self):
        self.model = ml_model.model

    def compute_factor_contributions(self, features: StudentFeatures) -> List[FactorContribution]:
        if ml_model.model is None:
            ml_model._load_model()
            
        coefficients = ml_model.model.coef_[0]
        intercept = ml_model.model.intercept_[0]
        df_input = ml_model.preprocess(features)
        
        contributions = []
        
        for i, col in enumerate(FEATURE_ORDER):
            coef = float(coefficients[i])
            val = float(df_input[col].iloc[0])
            base_val = POPULATION_MEANS.get(col, 0.0)
            
            # Log-odds contribution relative to cohort baseline
            impact = coef * (val - base_val)
            
            if abs(impact) < 0.01:
                direction = 'neutral'
            elif impact > 0:
                direction = 'positive'
            else:
                direction = 'negative'
                
            # Descriptive interpretation
            label = FEATURE_LABELS.get(col, col)
            if col == 'backlogs':
                if val == 0:
                    interpretation = "Zero active backlogs removes significant ATS filtration risk."
                else:
                    interpretation = f"{int(val)} active backlogs negatively affects corporate eligibility cutoffs."
            elif col == 'cgpa':
                if val >= 8.0:
                    interpretation = f"High CGPA ({val:.2f}) provides strong statistical advantage across tech shortlists."
                elif val >= 7.0:
                    interpretation = f"Adequate CGPA ({val:.2f}) meets most baseline cutoffs."
                else:
                    interpretation = f"CGPA of {val:.2f} restricts eligibility for Tier-1 company criteria."
            elif col == 'internships':
                if val > 0:
                    interpretation = f"{int(val)} internship(s) demonstrates proven industry workplace readiness."
                else:
                    interpretation = "Absence of prior internship experience lowers candidate differentiation."
            elif col == 'dsa_score':
                if val >= 7:
                    interpretation = f"Strong DSA rating ({int(val)}/10) closely correlates with clearing technical coding rounds."
                else:
                    interpretation = f"DSA score of {int(val)}/10 represents a key technical screening bottleneck."
            elif 'college_tier' in col:
                if val == 1:
                    interpretation = f"{label} historically experiences fewer on-campus tier-1 recruitment drives."
                else:
                    interpretation = f"Baseline institutional tier advantage."
            else:
                interpretation = f"Contributes {'positively' if impact > 0 else 'negatively'} to overall log-odds."

            # Human-readable student value
            if col.startswith('branch_'):
                student_display_val = "Yes" if val == 1 else "No"
            elif col.startswith('college_tier_'):
                student_display_val = "Yes" if val == 1 else "No"
            else:
                student_display_val = val

            contributions.append(
                FactorContribution(
                    feature_name=col,
                    display_name=label,
                    student_value=student_display_val,
                    baseline_value=round(base_val, 2),
                    coefficient=round(coef, 4),
                    impact_score=round(impact, 3),
                    direction=direction,
                    interpretation=interpretation
                )
            )

        # Sort by absolute impact magnitude
        contributions.sort(key=lambda x: abs(x.impact_score), reverse=True)
        return contributions

    def generate_radar_data(self, features: StudentFeatures) -> List[RadarDimension]:
        """
        Generates 6 standardized radar benchmark dimensions (0 - 10 scale).
        """
        # 1. Academics (CGPA is 0-10)
        academics = float(features.cgpa)
        
        # 2. DSA & Algorithms (1-10)
        dsa = float(features.dsa_score)
        
        # 3. Core Coding (1-10)
        coding = float(features.coding_skills)
        
        # 4. Architecture & Emerging Tech (avg of system_design and ml_knowledge)
        tech_breadth = round((features.system_design + features.ml_knowledge) / 2.0, 1)
        
        # 5. Practical Execution (normalized score from internships, projects, hackathons)
        practical = min(10.0, round((features.internships * 2.5) + (features.projects_count * 1.2) + (features.hackathons * 0.8), 1))
        
        # 6. Communication & Aptitude (weighted avg)
        comm_apt = round((features.communication_skills * 0.5) + ((features.aptitude_score / 10.0) * 0.5), 1)

        return [
            RadarDimension(dimension="Academic Standing", student_score=round(academics, 1), benchmark_score=7.8),
            RadarDimension(dimension="DSA & Problem Solving", student_score=round(dsa, 1), benchmark_score=7.2),
            RadarDimension(dimension="Core Development", student_score=round(coding, 1), benchmark_score=7.5),
            RadarDimension(dimension="System & Emerging Tech", student_score=round(tech_breadth, 1), benchmark_score=6.0),
            RadarDimension(dimension="Practical Projects", student_score=round(practical, 1), benchmark_score=6.8),
            RadarDimension(dimension="Articulation & Aptitude", student_score=round(comm_apt, 1), benchmark_score=7.0),
        ]

explainer = PlacementExplainer()
