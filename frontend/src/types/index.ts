export type BranchType = 'CSE' | 'IT' | 'ECE' | 'EE' | 'ME' | 'CE' | 'Chemical';
export type CollegeTierType = 'Tier-1' | 'Tier-2' | 'Tier-3';
export type UserRole = 'student' | 'officer' | 'admin';

export interface StudentProfile {
  branch: BranchType;
  college_tier: CollegeTierType;
  cgpa: number;
  backlogs: number;
  coding_skills: number;
  dsa_score: number;
  aptitude_score: number;
  communication_skills: number;
  ml_knowledge: number;
  system_design: number;
  internships: number;
  projects_count: number;
  certifications: number;
  hackathons: number;
  open_source_contributions: number;
  extracurriculars: number;
}

export interface FactorContribution {
  feature_name: string;
  display_name: string;
  student_value: string | number;
  baseline_value: number;
  coefficient: number;
  impact_score: number;
  direction: 'positive' | 'negative' | 'neutral';
  interpretation: string;
}

export interface RecommendationItem {
  category: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  action_type: string;
  expected_impact: string;
}

export interface RadarDimension {
  dimension: string;
  student_score: number;
  benchmark_score: number;
  full_mark: number;
}

export interface PredictionResult {
  id?: string;
  prediction: number;
  status: 'Placed' | 'Not Placed';
  probability: number;
  confidence_score: number;
  percentile_estimate: number;
  risk_tier: 'High Readiness' | 'Moderate Readiness' | 'At-Risk / Action Required';
  strengths: string[];
  weaknesses: string[];
  factor_contributions: FactorContribution[];
  recommendations: RecommendationItem[];
  radar_data: RadarDimension[];
  model_metadata: {
    model_type: string;
    features_count: number;
    raw_log_odds: number;
    intercept: number;
    classes: number[];
  };
  explanation_disclaimer: string;
  created_at?: string;
  input_features?: StudentProfile;
}

export interface Company {
  id: string;
  name: string;
  role_title: string;
  min_cgpa: number;
  max_backlogs: number;
  eligible_branches: string[];
  package_lpa?: number;
  location?: string;
  deadline?: string;
  description?: string;
  created_at?: string;
}

export interface CompanyEligibility {
  company_id: string;
  company_name: string;
  role_title: string;
  package_lpa?: number;
  is_eligible: boolean;
  reasons: string[];
  missing_criteria: string[];
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
}

export interface CohortAnalytics {
  total_students: number;
  placement_ready_percentage: number;
  avg_placement_probability: number;
  at_risk_count: number;
  active_drives_count: number;
  branch_metrics: {
    branch: string;
    total_students: number;
    placed_count: number;
    placement_rate: number;
    avg_probability: number;
  }[];
  risk_distribution: {
    high_readiness: number;
    moderate: number;
    at_risk: number;
  };
  global_factors: {
    feature: string;
    display_name: string;
    coefficient: number;
    odds_ratio: number;
    description: string;
  }[];
}
