import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import { PredictionResult } from '../types';
import { ProbabilityGauge } from '../components/charts/ProbabilityGauge';
import { FactorWaterfall } from '../components/charts/FactorWaterfall';
import { SkillRadar } from '../components/charts/SkillRadar';
import { 
  Sparkles, 
  ArrowLeft, 
  Building2, 
  Printer, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Share2,
  HelpCircle,
  Briefcase
} from 'lucide-react';

export const PredictionResultPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [result, setResult] = useState<PredictionResult | null>(() => {
    // 1. From location state
    if (location.state?.result) {
      return location.state.result;
    }
    // 2. From local cache
    try {
      const cached = localStorage.getItem('placeiq_latest_prediction');
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return null;
  });

  if (!result) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">No Assessment Data Found</h2>
        <p className="text-xs text-slate-500">
          Please run a placement assessment first to view your personalized readiness report.
        </p>
        <Link
          to="/assessment"
          className="inline-block px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs"
        >
          Start Assessment Now
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 print:p-0">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4 print:hidden">
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center space-x-3">
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 flex items-center space-x-1.5 shadow-xs transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
          <Link
            to="/companies"
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-xs transition"
          >
            <Building2 className="w-4 h-4" />
            <span>View Eligible Companies</span>
          </Link>
          <Link
            to="/assessment"
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-xs transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Simulate Profile</span>
          </Link>
        </div>
      </div>

      {/* Result Hero Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Gauge Widget */}
          <div className="lg:col-span-4 flex justify-center border-b lg:border-b-0 lg:border-r border-slate-100 pb-6 lg:pb-0 lg:pr-6">
            <ProbabilityGauge
              probability={result.probability}
              status={result.status}
              riskTier={result.risk_tier}
              percentile={result.percentile_estimate}
              className="border-0 shadow-none p-0"
            />
          </div>

          {/* Profile Overview & Strengths */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                Evaluation Completed
              </span>
              <span className="text-xs text-slate-400">
                {result.model_metadata?.model_type || 'Logistic Regression'} (Balanced)
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {result.status === 'Placed'
                ? 'High Placement Likelihood Detected'
                : 'Action Required: Key Placement Bottlenecks Identified'}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Based on historical data from candidates with similar academic metrics and technical scores, your profile exhibits an estimated placement likelihood of{' '}
              <strong className="text-slate-900">{result.probability.toFixed(1)}%</strong>.
            </p>

            {/* Strengths & Gaps Pills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Strongest Positive Model Drivers</span>
                </div>
                <ul className="text-[11px] text-emerald-800 space-y-1 pl-5 list-disc">
                  {result.strengths && result.strengths.length > 0 ? (
                    result.strengths.map((s, idx) => <li key={idx}>{s}</li>)
                  ) : (
                    <li>Consistent academic baseline across disciplines.</li>
                  )}
                </ul>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-1">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-rose-900">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Key Shortlisting Bottlenecks</span>
                </div>
                <ul className="text-[11px] text-rose-800 space-y-1 pl-5 list-disc">
                  {result.weaknesses && result.weaknesses.length > 0 ? (
                    result.weaknesses.map((w, idx) => <li key={idx}>{w}</li>)
                  ) : (
                    <li>No immediate high-risk constraints detected.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Factor Waterfall & Skill Radar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7">
          <FactorWaterfall factors={result.factor_contributions || []} limit={8} />
        </div>

        <div className="lg:col-span-5">
          <SkillRadar data={result.radar_data || []} />
        </div>
      </div>

      {/* Prioritized Actionable Recommendations */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Personalized Improvement Action Plan
          </h3>
          <p className="text-xs text-slate-500">
            Recommended corrective steps prioritized by potential placement log-odds recovery
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(result.recommendations || []).map((rec, i) => (
            <div
              key={i}
              className={`rounded-2xl border p-5 flex flex-col justify-between space-y-3 ${
                rec.priority === 'high'
                  ? 'bg-rose-50/30 border-rose-200'
                  : rec.priority === 'medium'
                  ? 'bg-amber-50/30 border-amber-200'
                  : 'bg-slate-50/50 border-slate-200'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    {rec.category}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      rec.priority === 'high'
                        ? 'bg-rose-100 text-rose-800'
                        : rec.priority === 'medium'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {rec.priority} Priority
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 leading-snug">{rec.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{rec.description}</p>
              </div>

              <div className="pt-2 border-t border-slate-200/60 text-[11px] font-semibold text-blue-700">
                Target Impact: {rec.expected_impact}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Model Ethics & Methodology Footer Notice */}
      <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-500 leading-relaxed flex items-start space-x-2.5">
        <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p>
          {result.explanation_disclaimer ||
            'Factor contributions represent statistical associations learned by the Logistic Regression model on historical cohort data, not deterministic causal guarantees.'}
        </p>
      </div>
    </div>
  );
};
