import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { inspectionService } from '../services/inspectionService';
import { StatCard } from '../components/common/StatCard';
import { RiskBadge } from '../components/common/RiskBadge';
import { EmptyState } from '../components/common/EmptyState';
import {
  BarChart3,
  PieChart,
  ShieldCheck,
  Flame,
  AlertTriangle,
  ScanEye,
  Layers,
  Zap,
} from 'lucide-react';

export const AnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [inspections, setInspections] = useState([]);
  const [analytics, setAnalytics] = useState({
    total: 0,
    riskCounts: { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 },
    categoryCounts: {},
    avgConfidence: 0,
    anomalyCount: 0,
  });

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoading(true);
      try {
        const data = await inspectionService.getInspections();
        const list = Array.isArray(data) ? data : data.inspections || [];
        setInspections(list);
        computeAnalytics(list);
      } catch (err) {
        const localList = JSON.parse(localStorage.getItem('vg_inspections_history') || '[]');
        setInspections(localList);
        computeAnalytics(localList);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  const computeAnalytics = (list) => {
    if (!list || list.length === 0) {
      setAnalytics({
        total: 0,
        riskCounts: { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 },
        categoryCounts: {},
        avgConfidence: 0,
        anomalyCount: 0,
      });
      return;
    }

    const riskCounts = { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 };
    const categoryCounts = {};
    let totalConf = 0;
    let anomalyTotal = 0;

    list.forEach((item) => {
      const r = (item.risk || item.risk_level || 'LOW').toUpperCase();
      if (riskCounts[r] !== undefined) riskCounts[r] += 1;
      else riskCounts.LOW += 1;

      const cat = item.category || 'General';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;

      const conf = item.confidence || item.confidence_score || 0;
      totalConf += conf <= 1 ? conf * 100 : conf;

      anomalyTotal += (item.anomalies?.length || 0);
    });

    setAnalytics({
      total: list.length,
      riskCounts,
      categoryCounts,
      avgConfidence: list.length > 0 ? Math.round(totalConf / list.length) : 0,
      anomalyCount: anomalyTotal,
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-850">
        <div>
          <h2 className="text-2xl font-bold font-display text-white">
            Operational Risk & Telemetry Analytics
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Aggregate hazard trends, model confidence distributions, and category breakdowns.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
          <Zap className="w-3.5 h-3.5" />
          <span>DATA SOURCE: LIVE AUDIT LOGS</span>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Scans Processed"
          value={analytics.total}
          subtitle="All recorded visual datasets"
          icon={ScanEye}
          accent="cyan"
          loading={loading}
        />
        <StatCard
          title="Anomalies Flagged"
          value={analytics.anomalyCount}
          subtitle="Specific defects & violations"
          icon={AlertTriangle}
          accent="amber"
          loading={loading}
        />
        <StatCard
          title="High/Critical Hazards"
          value={analytics.riskCounts.HIGH + analytics.riskCounts.CRITICAL}
          subtitle="Urgent remediation items"
          icon={Flame}
          accent="rose"
          loading={loading}
        />
        <StatCard
          title="Avg Model Certainty"
          value={analytics.avgConfidence > 0 ? `${analytics.avgConfidence}%` : '--'}
          subtitle="Statistical neural confidence"
          icon={ShieldCheck}
          accent="emerald"
          loading={loading}
        />
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-mono text-slate-400">CALCULATING TELEMETRY METRICS...</p>
        </div>
      ) : analytics.total === 0 ? (
        <EmptyState
          icon={BarChart3}
          title="No Analytics Available Yet"
          description="Analytics and distribution charts will automatically populate once you perform visual inspections."
          actionText="+ Start Your First Inspection"
          actionLink="/inspect"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Risk Level Distribution Chart Panel */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-200">
                  Risk Severity Distribution
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Proportion of safety hazards categorized by urgency
                </p>
              </div>
              <PieChart className="w-5 h-5 text-cyan-400" />
            </div>

            <div className="space-y-4 pt-2">
              {[
                { label: 'CRITICAL HAZARD', count: analytics.riskCounts.CRITICAL, color: 'bg-rose-500', text: 'text-rose-400' },
                { label: 'HIGH RISK', count: analytics.riskCounts.HIGH, color: 'bg-orange-500', text: 'text-orange-400' },
                { label: 'MEDIUM RISK', count: analytics.riskCounts.MEDIUM, color: 'bg-amber-500', text: 'text-amber-400' },
                { label: 'LOW RISK (SAFE)', count: analytics.riskCounts.LOW, color: 'bg-emerald-500', text: 'text-emerald-400' },
              ].map((row) => {
                const pct = analytics.total > 0 ? Math.round((row.count / analytics.total) * 100) : 0;
                return (
                  <div key={row.label} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className={`font-semibold ${row.text}`}>{row.label}</span>
                      <span className="text-slate-300">
                        {row.count} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={`${row.color} h-full rounded-full transition-all duration-700`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category Volume Breakdown */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-200">
                  Inspections by Domain / Category
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Operational distribution across target environments
                </p>
              </div>
              <Layers className="w-5 h-5 text-cyan-400" />
            </div>

            <div className="space-y-3 pt-2">
              {Object.keys(analytics.categoryCounts).length === 0 ? (
                <p className="text-xs text-slate-500 font-mono py-4">No categories recorded.</p>
              ) : (
                Object.entries(analytics.categoryCounts).map(([cat, count]) => {
                  const pct = analytics.total > 0 ? Math.round((count / analytics.total) * 100) : 0;
                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-200 font-semibold">{cat}</span>
                        <span className="text-cyan-400">
                          {count} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
