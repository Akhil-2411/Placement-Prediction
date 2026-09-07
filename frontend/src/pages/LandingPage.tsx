import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  BarChart2, 
  ShieldCheck, 
  BrainCircuit, 
  Building, 
  GraduationCap, 
  Layers,
  ChevronRight
} from 'lucide-react';
import { ProbabilityGauge } from '../components/charts/ProbabilityGauge';

export const LandingPage: React.FC = () => {
  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Balanced Machine Learning Placement Model</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Evaluate Your Campus Placement Readiness with{' '}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Explainable AI
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Enter your academic, coding, and internship profile to receive your calibrated placement probability, mathematical log-odds factor attribution, personalized skill gap recommendations, and real-time company eligibility.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
                <Link
                  to="/assessment"
                  className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-2 transition transform hover:-translate-y-0.5"
                >
                  <Sparkles className="w-4 h-4 text-blue-200" />
                  <span>Take Placement Assessment</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/officer/dashboard"
                  className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-sm rounded-xl shadow-xs flex items-center justify-center space-x-2 transition"
                >
                  <BarChart2 className="w-4 h-4 text-slate-500" />
                  <span>View Cohort Analytics</span>
                </Link>
              </div>

              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>100,000+ Historical Benchmarks</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Exact 22-Feature Pipeline</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Zero Biased Heuristics</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Preview Card */}
            <div className="lg:col-span-5 relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-3xl blur-2xl -z-10" />
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                      AS
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Arjun Sharma</h4>
                      <p className="text-[11px] text-slate-500">B.Tech CSE • Tier-1 • CGPA 8.65</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                    High Probability
                  </span>
                </div>

                <div className="flex justify-center">
                  <ProbabilityGauge
                    probability={86.4}
                    status="Placed"
                    riskTier="High Readiness"
                    percentile={89}
                    className="border-0 shadow-none p-0"
                  />
                </div>

                <div className="space-y-2 border-t border-slate-100 pt-4">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Strongest Model Predictors
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-500 block text-[10px]">Academic Standing</span>
                      <strong className="text-slate-800">CGPA 8.65 (+14.2%)</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-500 block text-[10px]">Coding Proficiency</span>
                      <strong className="text-slate-800">DSA 9/10 (+11.8%)</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-500 block text-[10px]">Industry Experience</span>
                      <strong className="text-slate-800">2 Internships (+9.4%)</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-500 block text-[10px]">Company Matches</span>
                      <strong className="text-emerald-700">6 / 6 Eligible</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Step Methodology Workflow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
            Structured Workflow
          </h2>
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            How PlaceIQ Predicts & Guides Student Career Readiness
          </h3>
          <p className="text-sm text-slate-600 mt-2">
            A scientifically sound pipeline built on scikit-learn Logistic Regression and empirical factor attribution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm mb-4">
              01
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-2">16-Feature Intake</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Capture verified academic grades, DSA scores, system design, arrears, internships, and hackathons.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm mb-4">
              02
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-2">Balanced ML Inference</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Execute exact 22-column one-hot encoded logistic regression pipeline calibrated for class balance.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm mb-4">
              03
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-2">Log-Odds Attribution</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Decompose individual feature impacts relative to cohort benchmarks to highlight positive drivers and risks.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm mb-4">
              04
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-2">Actionable Guidance</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Deliver targeted corrective roadmaps and company drive eligibility verification to maximize conversion.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="bg-slate-100/70 border-y border-slate-200/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Zero Artificial Guarantees</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                PlaceIQ explicitly adheres to rigorous statistical ethics. Predictions reflect calibrated log-odds associations rather than deterministic causal claims.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                <Building className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Campus Drive Matcher</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Live filtering against actual company hiring drives (Google, Microsoft, Amazon, TCS) evaluating CGPA cutoffs, backlog tolerances, and branch eligibility.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
                <BarChart2 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Placement Officer Analytics</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Institutional dashboards providing department-wise placement rates, at-risk student cohorts, and historical trend monitoring for college administrators.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Ready to evaluate your placement readiness?
            </h3>
            <p className="text-sm text-blue-100 max-w-xl">
              Complete your profile assessment in less than 2 minutes and receive your comprehensive explainable readiness report.
            </p>
          </div>
          <Link
            to="/assessment"
            className="px-6 py-3 bg-white hover:bg-blue-50 text-blue-700 font-bold text-sm rounded-xl shadow-md transition transform hover:scale-105 shrink-0"
          >
            Start Free Assessment →
          </Link>
        </div>
      </section>
    </div>
  );
};
