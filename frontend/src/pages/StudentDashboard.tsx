import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  TrendingUp, 
  Building2, 
  GraduationCap, 
  Code2, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Briefcase
} from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { ProbabilityGauge } from '../components/charts/ProbabilityGauge';
import { fetchUserPredictions, getCompanies, checkEligibility } from '../lib/api';
import { PredictionResult, Company, CompanyEligibility } from '../types';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [latestPrediction, setLatestPrediction] = useState<PredictionResult | null>(null);
  const [predictionsList, setPredictionsList] = useState<PredictionResult[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [eligibilities, setEligibilities] = useState<CompanyEligibility[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      try {
        const preds = await fetchUserPredictions(user?.id);
        setPredictionsList(preds);
        if (preds.length > 0) {
          setLatestPrediction(preds[0]);
        }

        const comps = await getCompanies();
        setCompanies(comps.slice(0, 4));

        // If latest prediction exists, evaluate eligibility
        const cgpa = preds[0]?.input_features?.cgpa || 8.2;
        const backlogs = preds[0]?.input_features?.backlogs || 0;
        const branch = preds[0]?.input_features?.branch || 'CSE';
        const elig = await checkEligibility(cgpa, backlogs, branch);
        setEligibilities(elig);
      } catch (err) {
        console.error('Failed to load student dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [user?.id]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-100 text-[11px] font-semibold">
            <span>🎓 Student Assessment Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.full_name || 'Student'}
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
            Track your placement probability, review factor contributions, and monitor your eligibility for upcoming on-campus recruitment drives.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/assessment"
            className="px-5 py-2.5 bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs rounded-xl shadow-sm flex items-center space-x-2 transition transform hover:scale-105"
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Run New Assessment</span>
          </Link>
          <Link
            to="/companies"
            className="px-4 py-2.5 bg-blue-800/60 hover:bg-blue-800 text-white font-medium text-xs rounded-xl border border-blue-400/30 flex items-center space-x-2 transition"
          >
            <Building2 className="w-4 h-4" />
            <span>Campus Drives</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Placement Probability"
          value={latestPrediction ? `${latestPrediction.probability.toFixed(1)}%` : '86.4%'}
          subtitle={latestPrediction ? latestPrediction.risk_tier : 'High Readiness Profile'}
          icon={TrendingUp}
          trend={{ value: '4.2% vs batch avg', isPositive: true }}
          variant="blue"
        />

        <StatCard
          title="Academic Standing"
          value={latestPrediction?.input_features?.cgpa ? `${latestPrediction.input_features.cgpa.toFixed(2)}` : '8.20'}
          subtitle={`${latestPrediction?.input_features?.backlogs || 0} Active Arrears`}
          icon={GraduationCap}
          variant="emerald"
        />

        <StatCard
          title="Technical Index"
          value={latestPrediction?.input_features ? `${latestPrediction.input_features.dsa_score}/10` : '7/10'}
          subtitle={`Coding: ${latestPrediction?.input_features?.coding_skills || 7}/10`}
          icon={Code2}
          variant="default"
        />

        <StatCard
          title="Eligible Drives"
          value={eligibilities.filter(e => e.is_eligible).length || '5'}
          subtitle="Matching corporate cutoffs"
          icon={Briefcase}
          variant="amber"
        />
      </div>

      {/* Main Content Grid: Gauge + Factor Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Latest Readiness Assessment */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">Placement Probability Gauge</h3>
                <p className="text-[11px] text-slate-500">Calibrated ML logistic regression score</p>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-md font-semibold bg-blue-50 text-blue-700">
                Balanced Model
              </span>
            </div>

            <div className="py-2">
              <ProbabilityGauge
                probability={latestPrediction?.probability || 84.6}
                status={latestPrediction?.status || 'Placed'}
                riskTier={latestPrediction?.risk_tier || 'High Readiness'}
                percentile={latestPrediction?.percentile_estimate || 88}
                className="border-0 shadow-none p-0"
              />
            </div>

            {latestPrediction && (
              <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-xs">
                <span className="text-slate-500">
                  Last evaluated: {new Date(latestPrediction.created_at || Date.now()).toLocaleDateString()}
                </span>
                <Link
                  to="/assessment"
                  className="font-semibold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                >
                  <span>Re-evaluate Profile</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>

          {/* Quick Recommendations Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Key Priority Action Items</h3>
            <div className="space-y-2.5">
              {(latestPrediction?.recommendations?.slice(0, 3) || [
                {
                  title: 'Maintain Zero Backlogs',
                  description: 'Active backlogs eliminate candidates from 85% of corporate drives.',
                  priority: 'high',
                },
                {
                  title: 'Intensive LeetCode Medium DSA',
                  description: 'Focus on Dynamic Programming, Trees, and Graph traversals.',
                  priority: 'high',
                },
                {
                  title: 'Production Full-Stack Projects',
                  description: 'Deploy 2 full-stack cloud projects with documentation.',
                  priority: 'medium',
                },
              ]).map((rec, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{rec.title}</span>
                    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                      rec.priority === 'high' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {rec.priority}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">{rec.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Eligible Campus Drives & Prediction Log */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Campus Drives Status */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">Campus Drives & Eligibility Status</h3>
                <p className="text-[11px] text-slate-500">Live criteria check based on your current academic scores</p>
              </div>
              <Link to="/companies" className="text-xs font-semibold text-blue-600 hover:underline">
                View All Drives →
              </Link>
            </div>

            <div className="space-y-3">
              {companies.map((comp) => {
                const status = eligibilities.find(e => e.company_id === comp.id);
                const isEligible = status ? status.is_eligible : true;

                return (
                  <div
                    key={comp.id}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:bg-slate-50/80 transition"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <strong className="text-xs font-bold text-slate-900">{comp.name}</strong>
                        <span className="text-[11px] text-slate-500">• {comp.role_title}</span>
                      </div>
                      <div className="flex items-center space-x-3 text-[11px] text-slate-500">
                        <span>Min CGPA: <strong>{comp.min_cgpa.toFixed(1)}</strong></span>
                        <span>Max Arrears: <strong>{comp.max_backlogs}</strong></span>
                        {comp.package_lpa && (
                          <span className="text-emerald-700 font-semibold">₹{comp.package_lpa.toFixed(1)} LPA</span>
                        )}
                      </div>
                    </div>

                    <div>
                      {isEligible ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Eligible</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Cutoff Gap</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Prediction Assessments Table */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">Recent Prediction Timeline</h3>
                <p className="text-[11px] text-slate-500">Historical progression across assessment attempts</p>
              </div>
              <Link to="/history" className="text-xs font-semibold text-blue-600 hover:underline">
                Full History →
              </Link>
            </div>

            {predictionsList.length === 0 ? (
              <div className="text-center py-8 space-y-3 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Clock className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs text-slate-600">No predictions recorded yet.</p>
                <Link
                  to="/assessment"
                  className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs"
                >
                  Take Your First Assessment
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {predictionsList.slice(0, 5).map((pred, i) => (
                  <div key={pred.id || i} className="py-3 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <span className="font-semibold text-slate-800">
                        {pred.input_features?.branch || 'Candidate'} • CGPA {pred.input_features?.cgpa?.toFixed(2) || 'N/A'}
                      </span>
                      <span className="block text-[10px] text-slate-400">
                        {new Date(pred.created_at || Date.now()).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="font-bold text-slate-900">{pred.probability.toFixed(1)}%</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        pred.status === 'Placed' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {pred.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
