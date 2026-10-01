import React from 'react';
import { CheckCircle2, CircleDashed, AlertCircle } from 'lucide-react';

export const PipelineStep = ({
  stepNumber,
  title,
  subtitle,
  status = 'pending', // 'completed' | 'active' | 'pending' | 'error'
}) => {
  return (
    <div className="flex items-start gap-3.5 relative">
      <div className="flex flex-col items-center">
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs transition-all duration-300 ${
            status === 'completed'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
              : status === 'active'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)] animate-pulse'
              : status === 'error'
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50'
              : 'bg-slate-800/80 text-slate-500 border border-slate-700/60'
          }`}
        >
          {status === 'completed' ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : status === 'active' ? (
            <CircleDashed className="w-4 h-4 animate-spin text-cyan-400" />
          ) : status === 'error' ? (
            <AlertCircle className="w-4 h-4" />
          ) : (
            <span>{stepNumber}</span>
          )}
        </div>
      </div>

      <div className="pt-0.5">
        <p
          className={`text-sm font-medium ${
            status === 'active'
              ? 'text-cyan-300 font-semibold'
              : status === 'completed'
              ? 'text-slate-200'
              : status === 'error'
              ? 'text-rose-400 font-semibold'
              : 'text-slate-500'
          }`}
        >
          {title}
        </p>
        {subtitle && (
          <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{subtitle}</p>
        )}
      </div>
    </div>
  );
};
