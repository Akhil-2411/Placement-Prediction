import React, { useEffect, useState } from 'react';
import { getCohortAnalytics } from '../lib/api';
import { CohortAnalytics } from '../types';
import { StatCard } from '../components/ui/StatCard';
import { 
  BarChart3, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Building2, 
  Download, 
  Search, 
  Filter,
  GraduationCap,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Sample cohort student list for institutional tracking
const SAMPLE_STUDENTS = [
  { id: '1', name: 'Arjun Sharma', branch: 'CSE', tier: 'Tier-1', cgpa: 8.85, backlogs: 0, dsa: 9, prob: 88.4, status: 'Placed', risk: 'High Readiness' },
  { id: '2', name: 'Sneha Patel', branch: 'IT', tier: 'Tier-1', cgpa: 8.40, backlogs: 0, dsa: 8, prob: 84.1, status: 'Placed', risk: 'High Readiness' },
  { id: '3', name: 'Rohan Verma', branch: 'ECE', tier: 'Tier-2', cgpa: 7.60, backlogs: 0, dsa: 7, prob: 76.5, status: 'Placed', risk: 'High Readiness' },
  { id: '4', name: 'Ananya Roy', branch: 'EE', tier: 'Tier-2', cgpa: 7.15, backlogs: 0, dsa: 6, prob: 66.2, status: 'Placed', risk: 'Moderate' },
  { id: '5', name: 'Karan Mehra', branch: 'ME', tier: 'Tier-2', cgpa: 6.80, backlogs: 1, dsa: 5, prob: 54.0, status: 'Placed', risk: 'Moderate' },
  { id: '6', name: 'Vikram Singh', branch: 'Chemical', tier: 'Tier-3', cgpa: 5.60, backlogs: 2, dsa: 3, prob: 32.4, status: 'Not Placed', risk: 'At-Risk' },
  { id: '7', name: 'Pooja Hegde', branch: 'CE', tier: 'Tier-3', cgpa: 5.90, backlogs: 1, dsa: 4, prob: 41.8, status: 'Not Placed', risk: 'At-Risk' },
  { id: '8', name: 'Rahul Joshi', branch: 'CSE', tier: 'Tier-2', cgpa: 8.10, backlogs: 0, dsa: 8, prob: 81.0, status: 'Placed', risk: 'High Readiness' },
];

export const OfficerDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<CohortAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getCohortAnalytics();
      setAnalytics(data);
      setLoading(false);
    }
    load();
  }, []);

  const riskPieData = analytics ? [
    { name: 'High Readiness (>75%)', value: analytics.risk_distribution.high_readiness, color: '#10B981' },
    { name: 'Moderate (50-75%)', value: analytics.risk_distribution.moderate, color: '#F59E0B' },
    { name: 'At-Risk (<50%)', value: analytics.risk_distribution.at_risk, color: '#EF4444' },
  ] : [];

  const filteredStudents = SAMPLE_STUDENTS.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBranch = branchFilter === 'ALL' || s.branch === branchFilter;
    const matchesRisk = riskFilter === 'ALL' || s.risk === riskFilter;
    return matchesSearch && matchesBranch && matchesRisk;
  });

  const exportCSV = () => {
    const headers = 'ID,Name,Branch,Tier,CGPA,Backlogs,DSA_Score,Placement_Probability,Status,Risk_Tier\n';
    const rows = filteredStudents
      .map(s => `${s.id},"${s.name}",${s.branch},${s.tier},${s.cgpa},${s.backlogs},${s.dsa},${s.prob}%,${s.status},${s.risk}`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `placement_cohort_report_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Officer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Placement Cell & Administrative Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Institutional Placement Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Cohort readiness forecasting, branch-level success rates, and student intervention tracking.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl shadow-xs flex items-center space-x-2 transition self-start"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Export Cohort CSV</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Students Assessed"
          value={analytics?.total_students ? `${analytics.total_students.toLocaleString()}` : '1,700'}
          subtitle="Across 7 engineering branches"
          icon={Users}
          variant="blue"
        />

        <StatCard
          title="Placement Ready Rate"
          value={analytics?.placement_ready_percentage ? `${analytics.placement_ready_percentage}%` : '77.6%'}
          subtitle="Probability threshold ≥ 50%"
          icon={CheckCircle2}
          trend={{ value: '3.1% vs last year', isPositive: true }}
          variant="emerald"
        />

        <StatCard
          title="At-Risk Cohort"
          value={analytics?.at_risk_count ? `${analytics.at_risk_count}` : '380'}
          subtitle="Require targeted training"
          icon={AlertTriangle}
          variant="rose"
        />

        <StatCard
          title="Active Drives"
          value={analytics?.active_drives_count || '6'}
          subtitle="Campus recruiters registered"
          icon={Building2}
          variant="default"
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Branch-wise Placement Rate */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">Branch-Wise Placement Rates</h3>
              <p className="text-xs text-slate-500">Placement conversion % and average probability by discipline</p>
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              7 Disciplines
            </span>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.branch_metrics || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="branch" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '0.75rem',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="placement_rate" name="Placement Rate %" fill="#2563EB" radius={[4, 4, 0, 0]} />
                <Bar dataKey="avg_probability" name="Avg Probability %" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Risk Category Donut */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">Cohort Risk Distribution</h3>
              <p className="text-xs text-slate-500">Breakdown of candidates by readiness tier</p>
            </div>
          </div>

          <div className="w-full h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {riskPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '0.75rem',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [`${val} students`, 'Count']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            {riskPieData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <strong className="text-slate-900">{item.value} ({Math.round((item.value / 1700) * 100)}%)</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Searchable Student Directory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">Student Readiness Roster</h3>
            <p className="text-xs text-slate-500">Filter candidates by discipline, risk status, or arrears</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search candidate..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:border-blue-600"
              />
            </div>

            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-white"
            >
              <option value="ALL">All Branches</option>
              <option value="CSE">CSE</option>
              <option value="IT">IT</option>
              <option value="ECE">ECE</option>
              <option value="EE">EE</option>
              <option value="ME">ME</option>
              <option value="CE">CE</option>
              <option value="Chemical">Chemical</option>
            </select>

            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-white"
            >
              <option value="ALL">All Risk Tiers</option>
              <option value="High Readiness">High Readiness</option>
              <option value="Moderate">Moderate</option>
              <option value="At-Risk">At-Risk</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-y border-slate-200">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Branch</th>
                <th className="py-3 px-4">Tier</th>
                <th className="py-3 px-4">CGPA</th>
                <th className="py-3 px-4">Backlogs</th>
                <th className="py-3 px-4">DSA</th>
                <th className="py-3 px-4">Probability</th>
                <th className="py-3 px-4">Risk Category</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-4 font-bold text-slate-900">{s.name}</td>
                  <td className="py-3 px-4 font-semibold text-slate-700">{s.branch}</td>
                  <td className="py-3 px-4 text-slate-500">{s.tier}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{s.cgpa.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <span className={s.backlogs > 0 ? 'text-rose-600 font-bold' : 'text-slate-500'}>
                      {s.backlogs}
                    </span>
                  </td>
                  <td className="py-3 px-4">{s.dsa}/10</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{s.prob.toFixed(1)}%</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        s.risk === 'High Readiness'
                          ? 'bg-emerald-100 text-emerald-800'
                          : s.risk === 'Moderate'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {s.risk}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => alert(`Reviewing candidate profile: ${s.name}`)}
                      className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
