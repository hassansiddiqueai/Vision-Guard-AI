import React from 'react';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

export const PipelineStep = ({
  stepNumber,
  title,
  subtitle,
  status = 'pending', // 'completed' | 'active' | 'pending' | 'error'
}) => {
  return (
    <div className="flex items-start gap-3 relative">
      <div className="flex flex-col items-center">
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs transition-colors ${
            status === 'completed'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              : status === 'active'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500'
              : status === 'error'
              ? 'bg-red-500/20 text-red-400 border border-red-500/40'
              : 'bg-[#111C2E] text-slate-500 border border-[#243247]'
          }`}
        >
          {status === 'completed' ? (
            <CheckCircle2 className="w-3.5 h-3.5" />
          ) : status === 'active' ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
          ) : status === 'error' ? (
            <AlertCircle className="w-3.5 h-3.5" />
          ) : (
            <span>{stepNumber}</span>
          )}
        </div>
      </div>

      <div className="pt-0.5">
        <p
          className={`text-xs font-medium ${
            status === 'active'
              ? 'text-cyan-300 font-semibold'
              : status === 'completed'
              ? 'text-slate-200'
              : status === 'error'
              ? 'text-red-400 font-semibold'
              : 'text-slate-400'
          }`}
        >
          {title}
        </p>
        {subtitle && (
          <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

