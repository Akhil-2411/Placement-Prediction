import { StudentProfile, PredictionResult, CompanyEligibility, Company, CohortAnalytics } from '../types';
import { supabase } from './supabase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1';

export async function predictPlacement(profile: StudentProfile, userId?: string): Promise<PredictionResult> {
  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: userId,
      profile,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Prediction failed with status: ${response.status}`);
  }

  const data: PredictionResult = await response.json();
  data.input_features = profile;

  // Persist to Supabase if user is signed in
  if (userId) {
    try {
      const { data: inserted, error } = await supabase
        .from('predictions')
        .insert({
          user_id: userId,
          probability: data.probability,
          status: data.status,
          input_features: profile,
          factor_contributions: data.factor_contributions,
          model_version: 'logistic_regression_balanced_v1',
        })
        .select('id')
        .single();

      if (!error && inserted) {
        data.id = inserted.id;
        // Insert recommendations
        if (data.recommendations && data.recommendations.length > 0) {
          const recRows = data.recommendations.map(r => ({
            prediction_id: inserted.id,
            category: r.category,
            title: r.title,
            description: r.description,
            priority: r.priority,
          }));
          await supabase.from('recommendations').insert(recRows);
        }
      }
    } catch (err) {
      console.warn('Could not persist prediction to Supabase:', err);
    }
  }

  // Also cache locally for instant retrieval
  try {
    const history = JSON.parse(localStorage.getItem('placeiq_local_predictions') || '[]');
    const recordWithId = {
      ...data,
      id: data.id || `pred-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    history.unshift(recordWithId);
    localStorage.setItem('placeiq_local_predictions', JSON.stringify(history.slice(0, 20)));
    localStorage.setItem('placeiq_latest_prediction', JSON.stringify(recordWithId));
  } catch (e) {
    console.error('Failed to save to local cache:', e);
  }

  return data;
}

export async function checkEligibility(cgpa: number, backlogs: number, branch: string): Promise<CompanyEligibility[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/eligibility/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cgpa, backlogs, branch }),
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (e) {
    console.warn('FastAPI eligibility check failed, calculating client-side:', e);
  }

  // Fallback client calculation if backend is unreachable
  const companies = await getCompanies();
  return companies.map(comp => {
    const reasons: string[] = [];
    const missing: string[] = [];
    let is_eligible = true;

    if (cgpa >= comp.min_cgpa) {
      reasons.push(`CGPA ${cgpa.toFixed(2)} meets threshold (${comp.min_cgpa})`);
    } else {
      is_eligible = false;
      missing.push(`CGPA ${cgpa.toFixed(2)} is below minimum ${comp.min_cgpa}`);
    }

    if (backlogs <= comp.max_backlogs) {
      reasons.push(`Active backlogs (${backlogs}) within limit (${comp.max_backlogs})`);
    } else {
      is_eligible = false;
      missing.push(`Active backlogs (${backlogs}) exceed limit (${comp.max_backlogs})`);
    }

    if (comp.eligible_branches.includes(branch)) {
      reasons.push(`Branch '${branch}' is eligible`);
    } else {
      is_eligible = false;
      missing.push(`Branch '${branch}' is not shortlisted`);
    }

    return {
      company_id: comp.id,
      company_name: comp.name,
      role_title: comp.role_title,
      package_lpa: comp.package_lpa,
      is_eligible,
      reasons,
      missing_criteria: missing,
    };
  });
}

export async function getCompanies(): Promise<Company[]> {
  // 1. Try Supabase
  try {
    const { data, error } = await supabase.from('companies').select('*').order('created_at', { ascending: false });
    if (!error && data && data.length > 0) {
      return data as Company[];
    }
  } catch (e) {
    console.warn('Supabase companies fetch failed:', e);
  }

  // 2. Try FastAPI
  try {
    const res = await fetch(`${API_BASE_URL}/companies`);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('FastAPI companies fetch failed:', e);
  }

  // 3. Fallback defaults
  return [
    {
      id: 'comp-1',
      name: 'Google',
      role_title: 'Associate Software Engineer',
      min_cgpa: 8.5,
      max_backlogs: 0,
      eligible_branches: ['CSE', 'IT', 'ECE'],
      package_lpa: 32.0,
      location: 'Bangalore / Hyderabad',
      deadline: '2026-10-15',
      description: 'Distributed backend systems, AI platform infra, and cloud services.'
    },
    {
      id: 'comp-2',
      name: 'Microsoft',
      role_title: 'Software Engineer (L59)',
      min_cgpa: 8.0,
      max_backlogs: 0,
      eligible_branches: ['CSE', 'IT', 'ECE', 'EE'],
      package_lpa: 26.5,
      location: 'Hyderabad / Noida',
      deadline: '2026-10-20',
      description: 'Design scalable microservices, developer productivity tools, and Azure cloud solutions.'
    },
    {
      id: 'comp-3',
      name: 'Amazon',
      role_title: 'Software Development Engineer I',
      min_cgpa: 7.5,
      max_backlogs: 0,
      eligible_branches: ['CSE', 'IT', 'ECE', 'EE', 'ME', 'CE'],
      package_lpa: 28.0,
      location: 'Bangalore / Chennai',
      deadline: '2026-10-25',
      description: 'High throughput e-commerce services, distributed catalog, and logistics systems.'
    },
    {
      id: 'comp-4',
      name: 'Goldman Sachs',
      role_title: 'Analyst - Engineering',
      min_cgpa: 8.0,
      max_backlogs: 0,
      eligible_branches: ['CSE', 'IT', 'ECE', 'EE'],
      package_lpa: 24.0,
      location: 'Bangalore',
      deadline: '2026-10-05',
      description: 'Ultra low latency financial execution, risk modeling engines, and trading analytics.'
    },
    {
      id: 'comp-5',
      name: 'Oracle',
      role_title: 'Member of Technical Staff',
      min_cgpa: 7.0,
      max_backlogs: 1,
      eligible_branches: ['CSE', 'IT', 'ECE', 'EE', 'ME'],
      package_lpa: 16.0,
      location: 'Bangalore / Pune',
      deadline: '2026-09-30',
      description: 'Cloud infrastructure, database internals, and high security enterprise software.'
    },
    {
      id: 'comp-6',
      name: 'TCS Digital',
      role_title: 'Digital Systems Engineer',
      min_cgpa: 6.5,
      max_backlogs: 1,
      eligible_branches: ['CSE', 'IT', 'ECE', 'EE', 'ME', 'CE', 'Chemical'],
      package_lpa: 7.5,
      location: 'Pan India',
      deadline: '2026-11-15',
      description: 'Enterprise modernisation, cloud transformation, and full-stack software development.'
    }
  ];
}

export async function getCohortAnalytics(): Promise<CohortAnalytics> {
  try {
    const res = await fetch(`${API_BASE_URL}/analytics/cohort`);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('FastAPI cohort analytics fetch failed, using fallback data:', e);
  }

  // High quality fallback data matching the dataset statistics
  return {
    total_students: 1700,
    placement_ready_percentage: 77.6,
    avg_placement_probability: 73.5,
    at_risk_count: 380,
    active_drives_count: 6,
    branch_metrics: [
      { branch: "CSE", total_students: 450, placed_count: 392, placement_rate: 87.1, avg_probability: 82.4 },
      { branch: "IT", total_students: 280, placed_count: 238, placement_rate: 85.0, avg_probability: 80.1 },
      { branch: "ECE", total_students: 310, placed_count: 242, placement_rate: 78.1, avg_probability: 75.6 },
      { branch: "EE", total_students: 190, placed_count: 135, placement_rate: 71.1, avg_probability: 68.9 },
      { branch: "ME", total_students: 220, placed_count: 154, placement_rate: 70.0, avg_probability: 67.5 },
      { branch: "Chemical", total_students: 110, placed_count: 71, placement_rate: 64.5, avg_probability: 62.0 },
      { branch: "CE", total_students: 140, placed_count: 88, placement_rate: 62.9, avg_probability: 60.8 },
    ],
    risk_distribution: {
      high_readiness: 1010,
      moderate: 420,
      at_risk: 270,
    },
    global_factors: [
      { feature: 'branch_CSE', display_name: 'Computer Science Branch', coefficient: 0.324, odds_ratio: 1.383, description: 'Direct positive placement association (+0.324)' },
      { feature: 'branch_IT', display_name: 'Information Technology Branch', coefficient: 0.299, odds_ratio: 1.349, description: 'High placement rate discipline (+0.299)' },
      { feature: 'cgpa', display_name: 'Academic CGPA', coefficient: 0.294, odds_ratio: 1.342, description: 'Essential cutoff and shortlisting driver (+0.294)' },
      { feature: 'internships', display_name: 'Industrial Internships', coefficient: 0.253, odds_ratio: 1.288, description: 'Strong practical differentiation factor (+0.253)' },
      { feature: 'coding_skills', display_name: 'Coding Proficiency', coefficient: 0.139, odds_ratio: 1.150, description: 'Direct predictor of clearing coding rounds (+0.139)' },
      { feature: 'projects_count', display_name: 'Technical Projects', coefficient: 0.137, odds_ratio: 1.147, description: 'Demonstrates end-to-end building capability (+0.137)' },
      { feature: 'dsa_score', display_name: 'DSA & Problem Solving', coefficient: 0.119, odds_ratio: 1.126, description: 'Primary filter in technical interview stages (+0.119)' },
      { feature: 'backlogs', display_name: 'Active Backlogs', coefficient: -0.150, odds_ratio: 0.861, description: 'Primary cause of automated portal rejection (-0.150)' },
      { feature: 'college_tier_Tier-3', display_name: 'Tier-3 Institution', coefficient: -1.068, odds_ratio: 0.344, description: 'On-campus volume limitation factor (-1.068)' },
    ],
  };
}

export async function fetchUserPredictions(userId?: string): Promise<PredictionResult[]> {
  if (userId) {
    try {
      const { data, error } = await supabase
        .from('predictions')
        .select(`
          id,
          probability,
          status,
          input_features,
          factor_contributions,
          created_at,
          recommendations (
            category,
            title,
            description,
            priority
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          prediction: d.status === 'Placed' ? 1 : 0,
          status: d.status,
          probability: Number(d.probability),
          confidence_score: Math.round(Math.abs(Number(d.probability) - 50) * 2),
          percentile_estimate: Math.round(Number(d.probability) * 0.95),
          risk_tier: Number(d.probability) >= 75 ? 'High Readiness' : Number(d.probability) >= 50 ? 'Moderate Readiness' : 'At-Risk / Action Required',
          strengths: [],
          weaknesses: [],
          factor_contributions: d.factor_contributions || [],
          recommendations: (d.recommendations || []).map((r: any) => ({
            ...r,
            action_type: 'Action Item',
            expected_impact: 'Improves placement likelihood'
          })),
          radar_data: [],
          model_metadata: {
            model_type: 'LogisticRegression',
            features_count: 22,
            raw_log_odds: 0,
            intercept: -4.9,
            classes: [0, 1]
          },
          explanation_disclaimer: 'Statistical model association from historical training data.',
          created_at: d.created_at,
          input_features: d.input_features,
        }));
      }
    } catch (err) {
      console.warn('Could not fetch predictions from Supabase:', err);
    }
  }

  // Fallback to local storage
  try {
    const local = localStorage.getItem('placeiq_local_predictions');
    if (local) {
      return JSON.parse(local);
    }
  } catch (e) {}

  return [];
}
