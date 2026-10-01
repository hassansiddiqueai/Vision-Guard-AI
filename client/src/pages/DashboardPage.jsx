import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { inspectionService } from '../services/inspectionService';
import { StatCard } from '../components/common/StatCard';
import { RiskBadge } from '../components/common/RiskBadge';
import { EmptyState } from '../components/common/EmptyState';
import {
  ScanEye,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Plus,
  ShieldCheck,
  History,
  BarChart3,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    total: 0,
    issuesDetected: 0,
    highRisk: 0,
    avgConfidence: 0,
    riskBreakdown: { low: 0, medium: 0, high: 0, critical: 0 },
  });

  const calculateMetrics = (list) => {
    if (!list || list.length === 0) {
      setMetrics({
        total: 0,
        issuesDetected: 0,
        highRisk: 0,
        avgConfidence: 0,
        riskBreakdown: { low: 0, medium: 0, high: 0, critical: 0 },
      });
      return;
    }

    let issuesCount = 0;
    let highRiskCount = 0;
    let totalConf = 0;
    const breakdown = { low: 0, medium: 0, high: 0, critical: 0 };

    list.forEach((item) => {
      const risk = (item.risk || item.risk_level || 'LOW').toLowerCase();
      if (breakdown[risk] !== undefined) {
        breakdown[risk] += 1;
      }

      if (risk === 'high' || risk === 'critical') {
        highRiskCount += 1;
      }

      const issues = (item.anomalies?.length || 0) + (item.detections?.length || 0);
      issuesCount += issues > 0 ? issues : (risk !== 'low' ? 1 : 0);

      const conf = item.confidence || item.confidence_score || 0;
      totalConf += conf <= 1 ? conf * 100 : conf;
    });

    setMetrics({
      total: list.length,
      issuesDetected: issuesCount,
      highRisk: highRiskCount,
      avgConfidence: list.length > 0 ? Math.round(totalConf / list.length) : 0,
      riskBreakdown: breakdown,
    });
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const data = await inspectionService.getInspections({ limit: 5 });
        const list = Array.isArray(data) ? data : data.inspections || [];
        setInspections(list);
        calculateMetrics(list);
      } catch (err) {
        console.info('Fetching from local audit cache:', err.message);
        const localList = JSON.parse(localStorage.getItem('vg_inspections_history') || '[]');
        setInspections(localList);
        calculateMetrics(localList);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-850">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Welcome back, {user?.name || 'Inspector'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Here's your visual inspection overview.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/inspect"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ New Inspection</span>
          </Link>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Inspections"
          value={metrics.total}
          subtitle="Processed through Vision AI"
          icon={ScanEye}
          accent="cyan"
          loading={loading}
        />
        <StatCard
          title="Issues Detected"
          value={metrics.issuesDetected}
          subtitle="Anomalies & violations flagged"
          icon={AlertTriangle}
          accent="amber"
          loading={loading}
        />
        <StatCard
          title="High Risk Findings"
          value={metrics.highRisk}
          subtitle="Critical & high severity alerts"
          icon={Flame}
          accent="rose"
          loading={loading}
        />
        <StatCard
          title="Average Confidence"
          value={metrics.avgConfidence > 0 ? `${metrics.avgConfidence}%` : '--'}
          subtitle="Model certainty score"
          icon={ShieldCheck}
          accent="emerald"
          loading={loading}
        />
      </div>

      {/* Grid: Risk Overview & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Overview Breakdown */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-200">
                Risk Severity Breakdown
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Distribution of hazard levels across completed visual audits
              </p>
            </div>
            <span className="text-xs font-mono text-cyan-400">
              {metrics.total} TOTAL
            </span>
          </div>

          {metrics.total === 0 && !loading ? (
            <div className="py-8 text-center text-xs text-slate-500 font-mono">
              No inspections logged yet. Run an inspection to populate risk distribution.
            </div>
          ) : (
            <div className="space-y-3.5 pt-2">
              {/* Critical */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-rose-400 font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
                    CRITICAL HAZARD
                  </span>
                  <span className="text-slate-300">
                    {metrics.riskBreakdown.critical} (
                    {metrics.total > 0
                      ? Math.round((metrics.riskBreakdown.critical / metrics.total) * 100)
                      : 0}
                    %)
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="bg-rose-500 h-full rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(244,63,94,0.5)]"
                    style={{
                      width: `${
                        metrics.total > 0
                          ? (metrics.riskBreakdown.critical / metrics.total) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* High */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-orange-400 font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(251,146,60,0.8)]" />
                    HIGH RISK
                  </span>
                  <span className="text-slate-300">
                    {metrics.riskBreakdown.high} (
                    {metrics.total > 0
                      ? Math.round((metrics.riskBreakdown.high / metrics.total) * 100)
                      : 0}
                    %)
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="bg-orange-500 h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${
                        metrics.total > 0
                          ? (metrics.riskBreakdown.high / metrics.total) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* Medium */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-amber-400 font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    MEDIUM RISK
                  </span>
                  <span className="text-slate-300">
                    {metrics.riskBreakdown.medium} (
                    {metrics.total > 0
                      ? Math.round((metrics.riskBreakdown.medium / metrics.total) * 100)
                      : 0}
                    %)
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${
                        metrics.total > 0
                          ? (metrics.riskBreakdown.medium / metrics.total) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* Low */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    LOW RISK (SAFE)
                  </span>
                  <span className="text-slate-300">
                    {metrics.riskBreakdown.low} (
                    {metrics.total > 0
                      ? Math.round((metrics.riskBreakdown.low / metrics.total) * 100)
                      : 0}
                    %)
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${
                        metrics.total > 0
                          ? (metrics.riskBreakdown.low / metrics.total) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-200 mb-1">
              Quick Operations
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Direct pathways to core visual intelligence modules
            </p>

            <div className="space-y-2.5">
              <Link
                to="/inspect"
                className="w-full flex items-center justify-between p-3 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold transition group"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Start Visual Inspection</span>
                </div>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
              </Link>

              <Link
                to="/history"
                className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium transition group"
              >
                <div className="flex items-center gap-2.5">
                  <History className="w-4 h-4 text-slate-400" />
                  <span>Browse Inspection Logs</span>
                </div>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
              </Link>

              <Link
                to="/analytics"
                className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium transition group"
              >
                <div className="flex items-center gap-2.5">
                  <BarChart3 className="w-4 h-4 text-slate-400" />
                  <span>View Telemetry Analytics</span>
                </div>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
              </Link>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800 text-[11px] font-mono text-slate-500 flex items-center justify-between">
            <span>CORE STATUS: SYNCHRONIZED</span>
            <span className="text-cyan-400">LATENCY 42MS</span>
          </div>
        </div>
      </div>

      {/* Recent Inspections Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-200">
              Recent Inspections
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Latest image scans, risk ratings, and AI diagnostic reports
            </p>
          </div>

          <Link
            to="/history"
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>View All History</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs font-mono text-slate-400">Loading audit history...</p>
          </div>
        ) : inspections.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={ScanEye}
              title="No Inspections Logged Yet"
              description="Upload an image to trigger VisionGuard's automated hazard analysis and anomaly detection."
              actionText="+ Start First Inspection"
              actionLink="/inspect"
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Inspection / Target</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Risk Level</th>
                  <th className="py-3 px-4">Confidence</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {inspections.slice(0, 5).map((item, idx) => {
                  const dateStr = item.createdAt || item.timestamp || '';
                  const formattedDate = dateStr
                    ? new Date(dateStr).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Recent';
                  const risk = item.risk || item.risk_level || 'LOW';
                  const category = item.category || 'General Inspection';
                  const title = item.title || item.fileName || `Inspection #${item.id?.slice?.(0, 6) || idx + 1}`;
                  const confidence = item.confidence || item.confidence_score || 95;

                  return (
                    <tr
                      key={item.id || idx}
                      className="hover:bg-slate-850/40 transition group"
                    >
                      <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                        {formattedDate}
                      </td>
                      <td className="py-3.5 px-4 font-sans font-medium text-slate-200">
                        <div className="flex items-center gap-2">
                          <span className="truncate max-w-[200px]">{title}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[11px]">
                          {category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <RiskBadge level={risk} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-cyan-400 font-semibold whitespace-nowrap">
                        {confidence <= 1 ? Math.round(confidence * 100) : Math.round(confidence)}%
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px]">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Analyzed</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <Link
                          to={`/inspection/${item.id || 'current'}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-200 text-xs font-semibold transition"
                        >
                          <span>View Report</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
