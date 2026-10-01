import React from 'react';

export const ConfidenceBar = ({ score = 0, showLabel = true, size = 'md', className = '' }) => {
  // Score can be 0-1 (e.g., 0.94) or 0-100 (e.g., 94)
  const percentage = score <= 1 ? Math.round(score * 100) : Math.round(score);

  const getColor = (val) => {
    if (val >= 90) return 'from-cyan-500 to-blue-500 text-cyan-400';
    if (val >= 75) return 'from-emerald-500 to-teal-500 text-emerald-400';
    if (val >= 50) return 'from-amber-500 to-yellow-500 text-amber-400';
    return 'from-rose-500 to-red-500 text-rose-400';
  };

  const barHeight = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  }[size] || 'h-2';

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs mb-1 font-mono">
          <span className="text-slate-400">Confidence Score</span>
          <span className={`font-semibold ${getColor(percentage).split(' ').pop()}`}>
            {percentage}%
          </span>
        </div>
      )}
      <div className={`w-full bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-700/50 ${barHeight}`}>
        <div
          className={`h-full rounded-full bg-gradient-to-r ${getColor(percentage)} transition-all duration-700 ease-out`}
          style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
        />
      </div>
    </div>
  );
};
