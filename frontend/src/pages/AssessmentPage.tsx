import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AssessmentForm } from '../components/forms/AssessmentForm';
import { predictPlacement } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { StudentProfile } from '../types';
import { Sparkles, Info, ShieldAlert } from 'lucide-react';

export const AssessmentPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAssessmentSubmit = async (profile: StudentProfile) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const result = await predictPlacement(profile, user?.id);
      // Navigate to detailed results page with state
      navigate(`/results/${result.id || 'latest'}`, { state: { result } });
    } catch (err: any) {
      console.error('Failed to submit assessment:', err);
      setErrorMessage(err.message || 'Prediction service failed. Please verify the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Full 16-Feature ML Evaluation</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Comprehensive Placement Readiness Assessment
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
          Provide your academic standings, technical competencies, and practical exposure. The balanced Logistic Regression model will compute your placement probability and provide an actionable breakdown of positive and risk factors.
        </p>
      </div>

      {/* Info notice */}
      <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex items-start space-x-3 text-xs text-blue-900 leading-relaxed">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <p>
          <strong>Model Preprocessing:</strong> Categorical variables (Branch and College Tier) will be transformed via exact one-hot dummy encoding matching the balanced training pipeline. Values are validated against historical cohort limits.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start space-x-3 text-xs text-rose-800">
          <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <strong>Prediction Error:</strong> {errorMessage}
          </div>
        </div>
      )}

      {/* Assessment Form */}
      <AssessmentForm onSubmit={handleAssessmentSubmit} isLoading={isLoading} />
    </div>
  );
};
