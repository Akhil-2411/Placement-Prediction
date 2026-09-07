import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getCompanies, checkEligibility } from '../lib/api';
import { Company, CompanyEligibility } from '../types';
import { 
  Building2, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  IndianRupee, 
  SlidersHorizontal,
  Plus,
  ArrowRight
} from 'lucide-react';

export const CompaniesPage: React.FC = () => {
  const { user, isOfficer } = useAuth();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [eligibilities, setEligibilities] = useState<CompanyEligibility[]>([]);
  const [loading, setLoading] = useState(true);

  // Student test parameters for live eligibility check
  const [testCgpa, setTestCgpa] = useState<number>(8.2);
  const [testBacklogs, setTestBacklogs] = useState<number>(0);
  const [testBranch, setTestBranch] = useState<string>('CSE');

  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'eligible' | 'highCtc'>('all');

  // Load companies
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const comps = await getCompanies();
      setCompanies(comps);
      const elig = await checkEligibility(testCgpa, testBacklogs, testBranch);
      setEligibilities(elig);
      setLoading(false);
    }
    loadData();
  }, []);

  // Recalculate eligibility on slider change
  const handleRecalculate = async (cgpa: number, backlogs: number, branch: string) => {
    setTestCgpa(cgpa);
    setTestBacklogs(backlogs);
    setTestBranch(branch);
    const elig = await checkEligibility(cgpa, backlogs, branch);
    setEligibilities(elig);
  };

  const filteredCompanies = companies.filter((comp) => {
    const matchesSearch =
      comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.role_title.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    const status = eligibilities.find((e) => e.company_id === comp.id);
    const isEligible = status ? status.is_eligible : true;

    if (filterMode === 'eligible') return isEligible;
    if (filterMode === 'highCtc') return (comp.package_lpa || 0) >= 20.0;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>Campus Recruitment Drives</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Company Drives & Eligibility Filter
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Check live eligibility criteria, cutoffs, and eligible branches across current active placement drives.
          </p>
        </div>

        {isOfficer && (
          <button
            onClick={() => alert('Add Company Drive dialog: In this deployment, drives are managed through Supabase or API.')}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-2 transition self-start"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Campus Drive</span>
          </button>
        )}
      </div>

      {/* Interactive Eligibility Test Simulator Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-800">
          <SlidersHorizontal className="w-4 h-4 text-blue-600" />
          <span>Live Candidate Criteria Simulator (Adjust sliders to test drive matches)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-600 font-medium">Candidate CGPA</span>
              <strong className="text-blue-600">{testCgpa.toFixed(2)}</strong>
            </div>
            <input
              type="range"
              min="5.0"
              max="10.0"
              step="0.1"
              value={testCgpa}
              onChange={(e) => handleRecalculate(parseFloat(e.target.value), testBacklogs, testBranch)}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-600 font-medium">Active Backlogs</span>
              <strong className={testBacklogs === 0 ? 'text-emerald-600' : 'text-rose-600'}>
                {testBacklogs}
              </strong>
            </div>
            <input
              type="range"
              min="0"
              max="4"
              step="1"
              value={testBacklogs}
              onChange={(e) => handleRecalculate(testCgpa, parseInt(e.target.value), testBranch)}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-700"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-600 font-medium mb-1">Discipline</label>
            <select
              value={testBranch}
              onChange={(e) => handleRecalculate(testCgpa, testBacklogs, e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-300 py-1.5 px-2.5 bg-white focus:border-blue-600"
            >
              <option value="CSE">CSE</option>
              <option value="IT">IT</option>
              <option value="ECE">ECE</option>
              <option value="EE">EE</option>
              <option value="ME">ME</option>
              <option value="CE">CE</option>
              <option value="Chemical">Chemical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search company or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:border-blue-600"
          />
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-center">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              filterMode === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            All Drives ({companies.length})
          </button>
          <button
            onClick={() => setFilterMode('eligible')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              filterMode === 'eligible'
                ? 'bg-emerald-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Eligible Only ({eligibilities.filter(e => e.is_eligible).length})
          </button>
          <button
            onClick={() => setFilterMode('highCtc')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              filterMode === 'highCtc'
                ? 'bg-purple-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Super-Dream (&gt;20 LPA)
          </button>
        </div>
      </div>

      {/* Company Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.map((comp) => {
          const status = eligibilities.find((e) => e.company_id === comp.id);
          const isEligible = status ? status.is_eligible : true;

          return (
            <div
              key={comp.id}
              className={`rounded-2xl border bg-white p-6 shadow-xs flex flex-col justify-between space-y-4 transition hover:shadow-md ${
                isEligible ? 'border-slate-200' : 'border-rose-100 opacity-90'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{comp.name}</h3>
                    <p className="text-xs font-medium text-slate-500">{comp.role_title}</p>
                  </div>
                  {isEligible ? (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Eligible</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Not Eligible</span>
                    </span>
                  )}
                </div>

                {comp.package_lpa && (
                  <div className="text-lg font-extrabold text-blue-700">
                    ₹{comp.package_lpa.toFixed(1)} LPA
                  </div>
                )}

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {comp.description || 'Full-time graduate placement engineering role.'}
                </p>

                {/* Criteria specs */}
                <div className="bg-slate-50 rounded-xl p-3 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Min CGPA Required:</span>
                    <strong className={testCgpa >= comp.min_cgpa ? 'text-slate-900' : 'text-rose-600'}>
                      {comp.min_cgpa.toFixed(2)}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Max Backlogs Allowed:</span>
                    <strong className={testBacklogs <= comp.max_backlogs ? 'text-slate-900' : 'text-rose-600'}>
                      {comp.max_backlogs}
                    </strong>
                  </div>
                  <div className="pt-1">
                    <span className="text-slate-500 text-[10px] block mb-1">Eligible Branches:</span>
                    <div className="flex flex-wrap gap-1">
                      {comp.eligible_branches.map((b) => (
                        <span
                          key={b}
                          className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                            b === testBranch
                              ? 'bg-blue-600 text-white font-bold'
                              : 'bg-slate-200/80 text-slate-700'
                          }`}
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Status reasons */}
                {status && status.missing_criteria.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-200/80 text-[11px] text-rose-800 space-y-0.5">
                    <strong>Cutoff Gap:</strong>
                    <ul className="list-disc pl-4 space-y-0.5">
                      {status.missing_criteria.map((m, idx) => (
                        <li key={idx}>{m}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center space-x-1 text-[11px]">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Deadline: {comp.deadline || 'Rolling'}</span>
                </div>
                <span className="font-semibold text-blue-600 hover:text-blue-800 cursor-pointer">
                  Drive Details →
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
