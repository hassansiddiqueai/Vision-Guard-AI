import React from 'react';

export const ConfidenceBar = ({ score = 0, showLabel = true, size = 'md', className = '' }) => {
  // Score can be 0-1 (e.g., 0.94) or 0-100 (e.g., 94)
  const percentage = score <= 1 ? Math.round(score * 100) : Math.round(score);

  const getColor = (val) => {
    if (val >= 80) return { bar: 'bg-emerald-500', text: 'text-emerald-400' };
    if (val >= 60) return { bar: 'bg-amber-500', text: 'text-amber-400' };
    return { bar: 'bg-red-500', text: 'text-red-400' };
  };

  const barHeight = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-2.5',
  }[size] || 'h-2';

  const colorConfig = getColor(percentage);

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-slate-400">Confidence</span>
          <span className={`font-mono font-medium ${colorConfig.text}`}>
            {percentage}%
          </span>
        </div>
      )}
      <div className={`w-full bg-[#0B1220] rounded overflow-hidden border border-[#243247] ${barHeight}`}>
        <div
          className={`h-full ${colorConfig.bar} transition-all duration-300`}
          style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
        />
      </div>
    </div>
  );
};

