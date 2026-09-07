import React from 'react';
import { GraduationCap, ShieldCheck, Database, Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-slate-900">PlaceIQ</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              AI-driven campus placement readiness platform powered by scikit-learn Logistic Regression, Supabase PostgreSQL, and real-time factor attribution.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">Platform</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><a href="/assessment" className="hover:text-blue-600">Placement Assessment</a></li>
              <li><a href="/dashboard" className="hover:text-blue-600">Student Dashboard</a></li>
              <li><a href="/companies" className="hover:text-blue-600">Campus Drives</a></li>
              <li><a href="/officer/dashboard" className="hover:text-blue-600">Officer Analytics</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">Architecture</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center space-x-1.5">
                <Cpu className="w-3.5 h-3.5 text-blue-600" />
                <span>FastAPI + scikit-learn</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <Database className="w-3.5 h-3.5 text-emerald-600" />
                <span>Supabase PostgreSQL + RLS</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>Log-Odds Attribution Engine</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">Compliance & Ethics</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Statistical predictions represent empirical model correlations from 100,000+ benchmark historical training records. Factor contributions are informational and non-deterministic.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <p>© {new Date().getFullYear()} PlaceIQ. Built with React, TypeScript, FastAPI & Supabase.</p>
          <div className="flex space-x-6 mt-3 sm:mt-0">
            <span>Model: Logistic Regression (Balanced)</span>
            <span>Version: 1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
