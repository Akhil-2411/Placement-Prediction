import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchUserPredictions } from '../lib/api';
import { PredictionResult } from '../types';
import { 
  History, 
  Sparkles, 
  ArrowRight, 
  TrendingUp, 
  Clock, 
  Calendar,
  CheckCircle2,
  XCircle,
  FileText
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export const PredictionHistoryPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState<PredictionResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      setLoading(true);
      const data = await fetchUserPredictions(user?.id);
      setHistory(data);
      setLoading(false);
    }
    loadHistory();
  }, [user?.id]);

  // Reverse data chronologically for progression graph
  const trendData = [...history].reverse().map((item, idx) => ({
    attempt: `Attempt ${idx + 1}`,
    probability: item.probability,
    date: new Date(item.created_at || Date.now()).toLocaleDateString(),
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
            <History className="w-3.5 h-3.5" />
            <span>Assessment Log</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Prediction History & Progression
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Review how your profile iterations have impacted your predicted placement probability over time.
          </p>
        </div>

        <Link
          to="/assessment"
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-2 transition self-start"
        >
          <Sparkles className="w-4 h-4" />
          <span>New Assessment</span>
        </Link>
      </div>

      {/* Progression Chart */}
      {history.length > 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span>Placement Probability Progression Curve</span>
              </h3>
              <p className="text-xs text-slate-500">Score evolution across assessment submissions</p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              {history[0].probability >= history[history.length - 1].probability ? '↑ Upward Trajectory' : 'Score Fluctuating'}
            </span>
          </div>

          <div className="w-full h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="attempt" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '0.75rem',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                  formatter={(value: any) => [`${value}%`, 'Probability']}
                />
                <Line
                  type="monotone"
                  dataKey="probability"
                  stroke="#2563EB"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#2563EB' }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* History List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Recorded Assessments</h3>
          <span className="text-xs text-slate-500">{history.length} Total Submissions</span>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <Clock className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-500">No predictions recorded yet.</p>
            <Link
              to="/assessment"
              className="inline-block px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-xs"
            >
              Take Your First Assessment
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {history.map((record, index) => (
              <div
                key={record.id || index}
                className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-sm text-slate-900">
                      {record.input_features?.branch || 'Candidate'} Profile
                    </span>
                    <span
                      className={`inline-flex items-center space-x-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        record.status === 'Placed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {record.status === 'Placed' ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      <span>{record.status}</span>
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span>CGPA: <strong>{record.input_features?.cgpa?.toFixed(2) || '8.20'}</strong></span>
                    <span>•</span>
                    <span>Backlogs: <strong>{record.input_features?.backlogs ?? 0}</strong></span>
                    <span>•</span>
                    <span>DSA: <strong>{record.input_features?.dsa_score || 7}/10</strong></span>
                    <span>•</span>
                    <span>Internships: <strong>{record.input_features?.internships ?? 1}</strong></span>
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center space-x-1.5 pt-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(record.created_at || Date.now()).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4 self-end sm:self-center">
                  <div className="text-right">
                    <span className="text-xl font-bold text-slate-900">
                      {record.probability.toFixed(1)}%
                    </span>
                    <span className="block text-[10px] text-slate-400 uppercase tracking-wider">
                      Probability
                    </span>
                  </div>

                  <button
                    onClick={() => navigate(`/results/${record.id || 'record'}`, { state: { result: record } })}
                    className="px-3.5 py-2 border border-slate-200 hover:bg-white text-slate-700 text-xs font-semibold rounded-xl flex items-center space-x-1 shadow-xs transition"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
