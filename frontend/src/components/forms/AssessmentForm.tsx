import React, { useState } from 'react';
import { StudentProfile, BranchType, CollegeTierType } from '../../types';
import { 
  GraduationCap, 
  Code2, 
  Briefcase, 
  Sparkles, 
  Loader2, 
  CheckCircle2, 
  RotateCcw,
  Zap
} from 'lucide-react';

interface AssessmentFormProps {
  initialValues?: Partial<StudentProfile>;
  onSubmit: (values: StudentProfile) => Promise<void>;
  isLoading?: boolean;
}

const DEFAULT_PROFILE: StudentProfile = {
  branch: 'CSE',
  college_tier: 'Tier-2',
  cgpa: 8.2,
  backlogs: 0,
  coding_skills: 7,
  dsa_score: 7,
  aptitude_score: 75,
  communication_skills: 7,
  ml_knowledge: 5,
  system_design: 4,
  internships: 1,
  projects_count: 3,
  certifications: 2,
  hackathons: 1,
  open_source_contributions: 1,
  extracurriculars: 1,
};

const PRESETS = {
  high: {
    label: 'High Probability Profile',
    desc: 'CSE, Tier-1, CGPA 9.2, 2 Internships, Strong DSA',
    data: {
      branch: 'CSE' as BranchType,
      college_tier: 'Tier-1' as CollegeTierType,
      cgpa: 9.15,
      backlogs: 0,
      coding_skills: 9,
      dsa_score: 9,
      aptitude_score: 90,
      communication_skills: 8,
      ml_knowledge: 7,
      system_design: 6,
      internships: 2,
      projects_count: 4,
      certifications: 3,
      hackathons: 2,
      open_source_contributions: 2,
      extracurriculars: 2,
    },
  },
  average: {
    label: 'Moderate Readiness Profile',
    desc: 'ECE, Tier-2, CGPA 7.6, 1 Internship, 0 Backlogs',
    data: {
      branch: 'ECE' as BranchType,
      college_tier: 'Tier-2' as CollegeTierType,
      cgpa: 7.6,
      backlogs: 0,
      coding_skills: 6,
      dsa_score: 6,
      aptitude_score: 68,
      communication_skills: 6,
      ml_knowledge: 4,
      system_design: 3,
      internships: 1,
      projects_count: 2,
      certifications: 1,
      hackathons: 1,
      open_source_contributions: 0,
      extracurriculars: 1,
    },
  },
  atRisk: {
    label: 'At-Risk Profile',
    desc: 'Chemical, Tier-3, CGPA 5.8, 2 Backlogs, Low DSA',
    data: {
      branch: 'Chemical' as BranchType,
      college_tier: 'Tier-3' as CollegeTierType,
      cgpa: 5.8,
      backlogs: 2,
      coding_skills: 3,
      dsa_score: 3,
      aptitude_score: 42,
      communication_skills: 4,
      ml_knowledge: 1,
      system_design: 1,
      internships: 0,
      projects_count: 1,
      certifications: 0,
      hackathons: 0,
      open_source_contributions: 0,
      extracurriculars: 0,
    },
  },
};

export const AssessmentForm: React.FC<AssessmentFormProps> = ({
  initialValues,
  onSubmit,
  isLoading = false,
}) => {
  const [profile, setProfile] = useState<StudentProfile>({
    ...DEFAULT_PROFILE,
    ...initialValues,
  });

  const [activeStep, setActiveStep] = useState<number>(1);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = <K extends keyof StudentProfile>(field: K, value: StudentProfile[K]) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const applyPreset = (presetKey: keyof typeof PRESETS) => {
    setProfile(PRESETS[presetKey].data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(profile);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Quick Test Presets Banner */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2 text-xs text-slate-700">
          <Zap className="w-4 h-4 text-blue-600" />
          <span className="font-semibold">Quick Test Presets:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(PRESETS).map(([key, preset]) => (
            <button
              key={key}
              type="button"
              onClick={() => applyPreset(key as keyof typeof PRESETS)}
              className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50 text-slate-700 font-medium transition"
              title={preset.desc}
            >
              {preset.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setProfile(DEFAULT_PROFILE)}
            className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-500 transition flex items-center space-x-1"
            title="Reset to default"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Step Navigation Tabs */}
      <div className="border-b border-slate-200 px-6 pt-4 flex space-x-6 text-sm font-semibold">
        <button
          type="button"
          onClick={() => setActiveStep(1)}
          className={`pb-3 border-b-2 flex items-center space-x-2 transition ${
            activeStep === 1
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>1. Academic Standing</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveStep(2)}
          className={`pb-3 border-b-2 flex items-center space-x-2 transition ${
            activeStep === 2
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>2. Technical & Coding</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveStep(3)}
          className={`pb-3 border-b-2 flex items-center space-x-2 transition ${
            activeStep === 3
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>3. Practical Experience</span>
        </button>
      </div>

      <div className="p-6">
        {/* STEP 1: Academics */}
        {activeStep === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Branch */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Engineering Discipline (Branch)
                </label>
                <select
                  value={profile.branch}
                  onChange={(e) => handleChange('branch', e.target.value as BranchType)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition"
                >
                  <option value="CSE">Computer Science & Engineering (CSE)</option>
                  <option value="IT">Information Technology (IT)</option>
                  <option value="ECE">Electronics & Communication (ECE)</option>
                  <option value="EE">Electrical Engineering (EE)</option>
                  <option value="ME">Mechanical Engineering (ME)</option>
                  <option value="CE">Civil Engineering (CE)</option>
                  <option value="Chemical">Chemical Engineering</option>
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Categorical variable mapped to model dummy indicators.
                </p>
              </div>

              {/* College Tier */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  College Institutional Tier
                </label>
                <select
                  value={profile.college_tier}
                  onChange={(e) => handleChange('college_tier', e.target.value as CollegeTierType)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition"
                >
                  <option value="Tier-1">Tier-1 (IITs, NITs, BITS, Top Universities)</option>
                  <option value="Tier-2">Tier-2 (State Govt, Established Autonomous Colleges)</option>
                  <option value="Tier-3">Tier-3 (Affiliated Regional Colleges)</option>
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Impacts on-campus recruiter visit density.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* CGPA */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Cumulative CGPA (0.00 – 10.00)
                  </label>
                  <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    {profile.cgpa.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="4.0"
                  max="10.0"
                  step="0.05"
                  value={profile.cgpa}
                  onChange={(e) => handleChange('cgpa', parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>Min: 4.0</span>
                  <span>Avg: 7.21</span>
                  <span>Max: 10.0</span>
                </div>
              </div>

              {/* Active Backlogs */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Active Arrears / Backlogs
                  </label>
                  <span
                    className={`text-sm font-bold px-2 py-0.5 rounded ${
                      profile.backlogs === 0
                        ? 'text-emerald-700 bg-emerald-50'
                        : 'text-rose-700 bg-rose-50'
                    }`}
                  >
                    {profile.backlogs} Backlog{profile.backlogs !== 1 ? 's' : ''}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="1"
                  value={profile.backlogs}
                  onChange={(e) => handleChange('backlogs', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>0 (Clear)</span>
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5+</span>
                </div>
                {profile.backlogs > 0 && (
                  <p className="text-[11px] text-rose-600 mt-1">
                    Warning: Active arrears trigger automated rejections in 85%+ corporate recruitment filters.
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
              >
                Next: Technical Proficiency →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Technical & Coding Mastery */}
        {activeStep === 2 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* DSA Score */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    DSA & Problem Solving Mastery (1 – 10)
                  </label>
                  <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    {profile.dsa_score} / 10
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={profile.dsa_score}
                  onChange={(e) => handleChange('dsa_score', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Confidence in Trees, Graphs, DP, and LeetCode medium questions.
                </p>
              </div>

              {/* Coding Skills */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Core Programming & Syntax (1 – 10)
                  </label>
                  <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    {profile.coding_skills} / 10
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={profile.coding_skills}
                  onChange={(e) => handleChange('coding_skills', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Proficiency in Python, Java, C++, or TypeScript OOP & debugging.
                </p>
              </div>

              {/* Aptitude Score */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Quantitative & Logical Aptitude (0 – 100)
                  </label>
                  <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                    {profile.aptitude_score} %
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="1"
                  value={profile.aptitude_score}
                  onChange={(e) => handleChange('aptitude_score', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Score on speed math, logic puzzles, and verbal reasoning.
                </p>
              </div>

              {/* Communication Skills */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Communication & Interview Articulation (1 – 10)
                  </label>
                  <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    {profile.communication_skills} / 10
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={profile.communication_skills}
                  onChange={(e) => handleChange('communication_skills', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Ability to explain architecture and handle behavioral interview questions.
                </p>
              </div>

              {/* ML Knowledge */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Machine Learning / AI Knowledge (0 – 10)
                  </label>
                  <span className="text-sm font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                    {profile.ml_knowledge} / 10
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={profile.ml_knowledge}
                  onChange={(e) => handleChange('ml_knowledge', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-600"
                />
              </div>

              {/* System Design */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    System Design & Architecture (0 – 10)
                  </label>
                  <span className="text-sm font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                    {profile.system_design} / 10
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={profile.system_design}
                  onChange={(e) => handleChange('system_design', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-600"
                />
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setActiveStep(1)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold rounded-xl transition"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setActiveStep(3)}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
              >
                Next: Practical Experience →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Experience & Extracurriculars */}
        {activeStep === 3 && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {/* Internships */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center">
                <label className="block text-[11px] font-semibold text-slate-600 mb-2">
                  Internships
                </label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  value={profile.internships}
                  onChange={(e) => handleChange('internships', parseInt(e.target.value) || 0)}
                  className="w-16 mx-auto text-center font-bold text-lg rounded-lg border border-slate-300 py-1"
                />
                <span className="block text-[10px] text-emerald-600 font-medium mt-1">+0.25 Coef</span>
              </div>

              {/* Projects */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center">
                <label className="block text-[11px] font-semibold text-slate-600 mb-2">
                  Projects Count
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={profile.projects_count}
                  onChange={(e) => handleChange('projects_count', parseInt(e.target.value) || 0)}
                  className="w-16 mx-auto text-center font-bold text-lg rounded-lg border border-slate-300 py-1"
                />
                <span className="block text-[10px] text-emerald-600 font-medium mt-1">+0.14 Coef</span>
              </div>

              {/* Certifications */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center">
                <label className="block text-[11px] font-semibold text-slate-600 mb-2">
                  Certifications
                </label>
                <input
                  type="number"
                  min="0"
                  max="6"
                  value={profile.certifications}
                  onChange={(e) => handleChange('certifications', parseInt(e.target.value) || 0)}
                  className="w-16 mx-auto text-center font-bold text-lg rounded-lg border border-slate-300 py-1"
                />
                <span className="block text-[10px] text-emerald-600 font-medium mt-1">+0.12 Coef</span>
              </div>

              {/* Hackathons */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center">
                <label className="block text-[11px] font-semibold text-slate-600 mb-2">
                  Hackathons
                </label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  value={profile.hackathons}
                  onChange={(e) => handleChange('hackathons', parseInt(e.target.value) || 0)}
                  className="w-16 mx-auto text-center font-bold text-lg rounded-lg border border-slate-300 py-1"
                />
                <span className="block text-[10px] text-emerald-600 font-medium mt-1">+0.09 Coef</span>
              </div>

              {/* Open Source */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center">
                <label className="block text-[11px] font-semibold text-slate-600 mb-2">
                  Open Source PRs
                </label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  value={profile.open_source_contributions}
                  onChange={(e) => handleChange('open_source_contributions', parseInt(e.target.value) || 0)}
                  className="w-16 mx-auto text-center font-bold text-lg rounded-lg border border-slate-300 py-1"
                />
                <span className="block text-[10px] text-emerald-600 font-medium mt-1">+0.07 Coef</span>
              </div>

              {/* Extracurriculars */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center">
                <label className="block text-[11px] font-semibold text-slate-600 mb-2">
                  Extracurriculars
                </label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  value={profile.extracurriculars}
                  onChange={(e) => handleChange('extracurriculars', parseInt(e.target.value) || 0)}
                  className="w-16 mx-auto text-center font-bold text-lg rounded-lg border border-slate-300 py-1"
                />
                <span className="block text-[10px] text-slate-500 font-medium mt-1">Leadership</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900">Ready for Machine Learning Inference</h4>
                <p className="text-[11px] text-slate-500">
                  Profile data will be encoded into 22 features and evaluated by the balanced Logistic Regression model.
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-semibold rounded-xl transition"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 flex items-center space-x-2 transition disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Computing Prediction...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-blue-200" />
                      <span>Compute Placement Probability</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </form>
  );
};
