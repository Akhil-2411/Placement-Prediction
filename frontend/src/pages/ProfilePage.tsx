import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, GraduationCap, Building2, Save, Trash2, CheckCircle2 } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, loginAsDemo } = useAuth();

  const [fullName, setFullName] = useState(user?.full_name || 'Student');
  const [email, setEmail] = useState(user?.email || '');
  const [branch, setBranch] = useState('CSE');
  const [tier, setTier] = useState('Tier-1');
  const [targetPackage, setTargetPackage] = useState('18');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear your local prediction history?')) {
      localStorage.removeItem('placeiq_local_predictions');
      localStorage.removeItem('placeiq_latest_prediction');
      alert('Local history cleared.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Profile & Account Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Manage your academic credentials, institutional tier, and placement preferences.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        {savedSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center space-x-2 text-xs text-emerald-800 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile preferences updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Campus Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Default Discipline (Branch)
              </label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
              >
                <option value="CSE">Computer Science & Engineering (CSE)</option>
                <option value="IT">Information Technology (IT)</option>
                <option value="ECE">Electronics & Communication (ECE)</option>
                <option value="EE">Electrical Engineering (EE)</option>
                <option value="ME">Mechanical Engineering (ME)</option>
                <option value="CE">Civil Engineering (CE)</option>
                <option value="Chemical">Chemical Engineering</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Institutional Classification
              </label>
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
              >
                <option value="Tier-1">Tier-1 Institution</option>
                <option value="Tier-2">Tier-2 Institution</option>
                <option value="Tier-3">Tier-3 Institution</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Target Compensation (LPA)
              </label>
              <input
                type="number"
                value={targetPackage}
                onChange={(e) => setTargetPackage(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Account Role (RBAC)
              </label>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
                  {user?.role || 'student'}
                </span>
                <button
                  type="button"
                  onClick={() => loginAsDemo(user?.role === 'student' ? 'officer' : 'student')}
                  className="text-xs font-semibold text-slate-600 hover:text-blue-600 underline"
                >
                  Switch Perspective
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleClearHistory}
              className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center space-x-1.5"
            >
              <Trash2 className="w-4 h-4" />
              <span>Reset Assessment History</span>
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-2 transition"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
