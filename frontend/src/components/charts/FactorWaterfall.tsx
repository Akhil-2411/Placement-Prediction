import React from 'react';
import { FactorContribution } from '../../types';
import { HelpCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface FactorWaterfallProps {
  factors: FactorContribution[];
  limit?: number;
}

export const FactorWaterfall: React.FC<FactorWaterfallProps> = ({ factors, limit = 8 }) => {
  const displayFactors = factors.slice(0, limit);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <span>Model Factor Contribution Analysis</span>
          </h3>
          <p className="text-xs text-slate-500">
            Log-odds feature impact relative to historical cohort benchmarks
          </p>
        </div>
        <span className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
          Top {displayFactors.length} Factors
        </span>
      </div>

      {/* Factor Bars */}
      <div className="space-y-3">
        {displayFactors.map((factor) => {
          const isPositive = factor.direction === 'positive';
          const isNegative = factor.direction === 'negative';
          // Calculate bar width percentage (cap at 100%)
          const barWidth = Math.min(100, Math.max(12, Math.abs(factor.impact_score) * 60));

          return (
            <div key={factor.feature_name} className="group border border-slate-100 rounded-xl p-3 hover:bg-slate-50/70 transition">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center space-x-2">
                  {isPositive ? (
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  ) : isNegative ? (
                    <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
                  ) : (
                    <Minus className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span className="font-semibold text-slate-800">{factor.display_name}</span>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-slate-500 text-[11px]">
                    Your Score: <strong className="text-slate-700">{factor.student_value}</strong>
                  </span>
                  <span
                    className={`font-mono font-bold text-xs px-1.5 py-0.5 rounded ${
                      isPositive
                        ? 'bg-emerald-50 text-emerald-700'
                        : isNegative
                        ? 'bg-rose-50 text-rose-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {factor.impact_score > 0 ? `+${factor.impact_score}` : factor.impact_score}
                  </span>
                </div>
              </div>

              {/* Progress Bar Track */}
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    isPositive ? 'bg-emerald-500' : isNegative ? 'bg-rose-500' : 'bg-slate-400'
                  }`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-500 mt-1.5 leading-snug">
                {factor.interpretation}
              </p>
            </div>
          );
        })}
      </div>

      {/* Non-causal scientific alert */}
      <div className="mt-4 p-3 rounded-xl bg-blue-50/70 border border-blue-100/80 flex items-start space-x-2 text-[11px] text-blue-900 leading-relaxed">
        <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <p>
          <strong>Scientific Methodology:</strong> Factor contributions quantify the statistical weights (log-odds $\Delta z_i$) assigned by the balanced Logistic Regression model. They indicate historical associations and do not imply guaranteed deterministic causality.
        </p>
      </div>
    </div>
  );
};
