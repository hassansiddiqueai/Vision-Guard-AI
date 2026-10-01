import React from 'react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendPositive,
  accent = 'cyan',
  loading = false,
}) => {
  const accentConfigs = {
    cyan: {
      iconBg: 'bg-[#0B1220] text-cyan-400 border-[#243247]',
    },
    emerald: {
      iconBg: 'bg-[#0B1220] text-emerald-400 border-[#243247]',
    },
    amber: {
      iconBg: 'bg-[#0B1220] text-amber-400 border-[#243247]',
    },
    rose: {
      iconBg: 'bg-[#0B1220] text-red-400 border-[#243247]',
    },
  };

  const config = accentConfigs[accent] || accentConfigs.cyan;

  return (
    <div className="vg-card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-400 font-medium">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            {loading ? (
              <div className="h-8 w-20 bg-slate-800 rounded animate-pulse" />
            ) : (
              <span className="text-2xl lg:text-3xl font-bold font-mono text-slate-100">
                {value ?? '0'}
              </span>
            )}
            {trend && (
              <span
                className={`text-xs font-medium ${
                  trendPositive ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {trend}
              </span>
            )}
          </div>
          {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
        </div>

        {Icon && (
          <div className={`p-2 rounded border ${config.iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
};

