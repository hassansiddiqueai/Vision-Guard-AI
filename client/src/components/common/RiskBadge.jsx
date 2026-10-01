import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, Flame } from 'lucide-react';

export const RiskBadge = ({ level = 'LOW', size = 'md', className = '' }) => {
  const normalizedLevel = (level || 'LOW').toUpperCase();

  const config = {
    LOW: {
      bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      dot: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]',
      icon: ShieldCheck,
      label: 'LOW RISK',
    },
    MEDIUM: {
      bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      dot: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]',
      icon: AlertTriangle,
      label: 'MEDIUM RISK',
    },
    HIGH: {
      bg: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
      dot: 'bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.6)]',
      icon: AlertOctagon,
      label: 'HIGH RISK',
    },
    CRITICAL: {
      bg: 'bg-rose-500/15 text-rose-400 border-rose-500/40 animate-pulse',
      dot: 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]',
      icon: Flame,
      label: 'CRITICAL HAZARD',
    },
  }[normalizedLevel] || {
    bg: 'bg-slate-800 text-slate-400 border-slate-700',
    dot: 'bg-slate-400',
    icon: ShieldCheck,
    label: normalizedLevel,
  };

  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-xs font-semibold px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-bold px-3 py-1.5 gap-2',
  }[size] || 'text-xs px-2.5 py-1 gap-1.5';

  return (
    <span
      className={`inline-flex items-center rounded-md border font-mono uppercase tracking-wide ${config.bg} ${sizeClasses} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <Icon className="w-3.5 h-3.5" />
      <span>{config.label}</span>
    </span>
  );
};
