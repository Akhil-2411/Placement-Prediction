import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';
import { RadarDimension } from '../../types';

interface SkillRadarProps {
  data: RadarDimension[];
}

export const SkillRadar: React.FC<SkillRadarProps> = ({ data }) => {
  const chartData = data.map((d) => ({
    subject: d.dimension,
    'Your Profile': d.student_score,
    'Placed Benchmark': d.benchmark_score,
    fullMark: d.full_mark,
  }));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
      <div className="mb-2">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight">Skill Balance & Profile Radar</h3>
        <p className="text-xs text-slate-500">Multidimensional comparison against placed candidate benchmarks (0-10)</p>
      </div>

      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
            <PolarGrid stroke="#E2E8F0" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: '#475569', fontSize: 11, fontWeight: 500 }}
            />
            <PolarRadiusAxis angle={30} domain={[0, 10]} stroke="#CBD5E1" tick={{ fontSize: 9 }} />
            <Radar
              name="Your Profile"
              dataKey="Your Profile"
              stroke="#2563EB"
              fill="#3B82F6"
              fillOpacity={0.45}
            />
            <Radar
              name="Placed Benchmark"
              dataKey="Placed Benchmark"
              stroke="#10B981"
              fill="#10B981"
              fillOpacity={0.2}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderRadius: '0.75rem',
                border: '1px solid #e2e8f0',
                fontSize: '12px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
              iconType="circle"
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <p className="text-[11px] text-slate-400 text-center mt-2">
        Benchmark reflects average scores from successful campus placements in historical records.
      </p>
    </div>
  );
};
