import React from 'react';
import { cn } from '../../lib/utils';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface ProbabilityGaugeProps {
  probability: number;
  status: 'Placed' | 'Not Placed';
  riskTier?: string;
  percentile?: number;
  className?: string;
}

export const ProbabilityGauge: React.FC<ProbabilityGaugeProps> = ({
  probability,
  status,
  riskTier,
  percentile,
  className,
}) => {
  const isHigh = probability >= 75.0;
  const isMedium = probability >= 50.0 && probability < 75.0;

  // Stroke math for SVG circle
  const size = 180;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (probability / 100) * circumference;

  const colorConfig = isHigh
    ? { stroke: '#10B981', text: 'text-emerald-600', bg: 'bg-emerald-50', badge: 'bg-emerald-100 text-emerald-800' }
    : isMedium
    ? { stroke: '#F59E0B', text: 'text-amber-600', bg: 'bg-amber-50', badge: 'bg-amber-100 text-amber-800' }
    : { stroke: '#EF4444', text: 'text-rose-600', bg: 'bg-rose-50', badge: 'bg-rose-100 text-rose-800' };

  return (
    <div className={cn('bg-white rounded-2xl border border-slate-200 p-6 flex flex-col items-center text-center shadow-xs', className)}>
      <div className="relative flex items-center justify-center mb-3">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated active circle track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colorConfig.stroke}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn('text-4xl font-extrabold tracking-tight', colorConfig.text)}>
            {probability.toFixed(1)}%
          </span>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Probability
          </span>
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex items-center space-x-2 mt-1">
        <span
          className={cn(
            'inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider',
            colorConfig.badge
          )}
        >
          {status === 'Placed' ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <XCircle className="w-4 h-4" />
          )}
          <span>Predicted {status}</span>
        </span>
      </div>

      {riskTier && (
        <p className="text-xs font-medium text-slate-600 mt-2">
          Readiness Tier: <span className="font-semibold text-slate-800">{riskTier}</span>
        </p>
      )}

      {percentile && (
        <div className="w-full bg-slate-50 border border-slate-100 rounded-xl p-2.5 mt-4 text-xs text-slate-600 flex items-center justify-between">
          <span>Cohort Standing:</span>
          <span className="font-bold text-blue-600">Top {100 - percentile}% of candidates</span>
        </div>
      )}
    </div>
  );
};
