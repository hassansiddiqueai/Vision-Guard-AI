import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, Flame } from 'lucide-react';

export const RiskBadge = ({ level = 'LOW', size = 'md', className = '' }) => {
  const normalizedLevel = (level || 'LOW').toUpperCase();

  const config = {
    LOW: {
      bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      dot: 'bg-emerald-400',
      icon: ShieldCheck,
      label: 'LOW',
    },
    MEDIUM: {
      bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      dot: 'bg-amber-400',
      icon: AlertTriangle,
      label: 'MEDIUM',
    },
    HIGH: {
      bg: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
      dot: 'bg-orange-400',
      icon: AlertOctagon,
      label: 'HIGH',
    },
    CRITICAL: {
      bg: 'bg-red-500/10 text-red-400 border-red-500/30',
      dot: 'bg-red-500',
      icon: Flame,
      label: 'CRITICAL',
    },
    SAFE: {
      bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      dot: 'bg-emerald-400',
      icon: ShieldCheck,
      label: 'SAFE',
    },
  }[normalizedLevel] || {
    bg: 'bg-slate-800 text-slate-400 border-slate-700',
    dot: 'bg-slate-400',
    icon: ShieldCheck,
    label: normalizedLevel,
  };

  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1.5',
    md: 'text-xs font-medium px-2.5 py-0.5 gap-1.5',
    lg: 'text-xs font-semibold px-3 py-1 gap-2',
  }[size] || 'text-xs px-2.5 py-0.5 gap-1.5';

  return (
    <span
      className={`inline-flex items-center rounded border font-medium uppercase tracking-wider ${config.bg} ${sizeClasses} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <Icon className="w-3 h-3" />
      <span>{config.label}</span>
    </span>
  );
};

