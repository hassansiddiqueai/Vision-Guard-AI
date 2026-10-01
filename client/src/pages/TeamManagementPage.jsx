import React, { useState } from 'react';
import { useInspections } from '../context/InspectionContext';
import {
  Users,
  Plus,
  Search,
  Shield,
  ShieldCheck,
  UserCheck,
  Trash2,
  X,
  CheckCircle2,
  Lock,
  Eye,
  AlertTriangle
} from 'lucide-react';

export const TeamManagementPage = () => {
  const { teamMembers, addTeamMember, updateTeamMemberRole, removeTeamMember, sites } = useInspections();

  const [searchTerm, setSearchTerm] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    role: 'Safety Officer',
    site: 'All Sites'
  });

  const rolesList = [
    {
      role: 'Admin',
      badge: 'bg-red-50 text-red-700 border-red-200',
      desc: 'Full platform authority: camera provisioning, AI thresholds, audit sign-offs, and user management.'
    },
    {
      role: 'Safety Manager',
      badge: 'bg-amber-50 text-amber-700 border-amber-200',
      desc: 'Authority to halt worksites, review critical risk escalations, assign corrective actions, and export certified OSHA reports.'
    },
    {
      role: 'Safety Supervisor',
      badge: 'bg-sky-50 text-sky-700 border-sky-200',
      desc: 'Execute automated visual audits, monitor live CCTV feeds, and sign off on completed remediations.'
    },
    {
      role: 'Safety Officer',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      desc: 'Inspect job sites, review detection bounding boxes, and log field corrective notes.'
    },
    {
      role: 'Operator',
      badge: 'bg-slate-100 text-slate-700 border-slate-200',
      desc: 'Live CCTV grid monitoring and incident dispatch only.'
    },
    {
      role: 'Viewer',
      badge: 'bg-slate-100 text-slate-500 border-slate-200',
      desc: 'Read-only analytics and historical compliance report review.'
    }
  ];

  const permissionsMatrix = [
    { module: 'Live CCTV Feeds & PTZ', Admin: true, 'Safety Manager': true, 'Safety Supervisor': true, 'Safety Officer': true, Operator: true, Viewer: true },
    { module: 'Camera Addition / Deletion', Admin: true, 'Safety Manager': true, 'Safety Supervisor': false, 'Safety Officer': false, Operator: false, Viewer: false },
    { module: 'Run CV Inspections', Admin: true, 'Safety Manager': true, 'Safety Supervisor': true, 'Safety Officer': true, Operator: false, Viewer: false },
    { module: 'Acknowledge & Assign Incidents', Admin: true, 'Safety Manager': true, 'Safety Supervisor': true, 'Safety Officer': true, Operator: true, Viewer: false },
    { module: 'Close Corrective Actions', Admin: true, 'Safety Manager': true, 'Safety Supervisor': true, 'Safety Officer': false, Operator: false, Viewer: false },
    { module: 'Generate Audit Reports', Admin: true, 'Safety Manager': true, 'Safety Supervisor': true, 'Safety Officer': true, Operator: false, Viewer: true },
    { module: 'Manage Team & Access Control', Admin: true, 'Safety Manager': false, 'Safety Supervisor': false, 'Safety Officer': false, Operator: false, Viewer: false }
  ];

  const filteredMembers = teamMembers.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInvite = (e) => {
    e.preventDefault();
    if (!newMember.name || !newMember.email) return;
    addTeamMember(newMember);
    setIsInviteModalOpen(false);
    setNewMember({ name: '', email: '', role: 'Safety Officer', site: 'All Sites' });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-sky-700" />
            Team & Role-Based Access Control
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure safety personnel authorization tiers, site scoping, incident response permissions, and audit sign-off rights.
          </p>
        </div>

        <button
          onClick={() => setIsInviteModalOpen(true)}
          className="vg-btn-primary text-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Invite Team Member</span>
        </button>
      </div>

      {/* Member Directory */}
      <div className="vg-card overflow-hidden">
        <div className="p-3 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search member name, email, role..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-600"
            />
          </div>
          <span className="text-xs text-slate-500 font-semibold">
            {filteredMembers.length} Authorized Safety Personnel
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-4">Member Name</th>
                <th className="py-2.5 px-3">Role Authorization</th>
                <th className="py-2.5 px-3">Assigned Site Scope</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Last Active</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMembers.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold shrink-0">
                        {m.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{m.name}</p>
                        <p className="text-[11px] text-slate-500 font-mono">{m.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <select
                      value={m.role}
                      onChange={(e) => updateTeamMemberRole(m.id, e.target.value)}
                      className="py-1 px-2 bg-white border border-slate-200 rounded text-xs font-semibold text-slate-800 outline-none focus:ring-1 focus:ring-sky-600 cursor-pointer"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Safety Manager">Safety Manager</option>
                      <option value="Safety Supervisor">Safety Supervisor</option>
                      <option value="Safety Officer">Safety Officer</option>
                      <option value="Operator">Operator</option>
                      <option value="Viewer">Viewer</option>
                    </select>
                  </td>

                  <td className="py-3 px-3 font-semibold text-slate-700">
                    {m.site || 'All Sites'}
                  </td>

                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      {m.status}
                    </span>
                  </td>

                  <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                    {m.lastActive}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => removeTeamMember(m.id)}
                      title="Revoke Member Authorization"
                      className="p-1.5 rounded bg-slate-100 hover:bg-red-100 text-slate-500 hover:text-red-700 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Definitions & Permissions Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Role Definitions */}
        <div className="lg:col-span-5 space-y-3">
          <div className="vg-card p-4 space-y-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-sky-700" />
              Role Authorization Tiers
            </h3>
            <div className="space-y-2.5">
              {rolesList.map((r) => (
                <div key={r.role} className="p-2.5 rounded-md bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{r.role}</span>
                    <span className={`px-2 py-0.2 text-[10px] font-bold rounded border ${r.badge}`}>Tier {r.role === 'Admin' ? '1' : r.role === 'Safety Manager' ? '2' : '3'}</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">{r.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Permissions Grid Matrix */}
        <div className="lg:col-span-7">
          <div className="vg-card p-4 space-y-3 overflow-hidden">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-sky-700" />
              Module Permissions Matrix
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold text-[10px] uppercase">
                    <th className="py-2 pr-2">Capability</th>
                    <th className="py-2 text-center">Admin</th>
                    <th className="py-2 text-center">Manager</th>
                    <th className="py-2 text-center">Supervisor</th>
                    <th className="py-2 text-center">Officer</th>
                    <th className="py-2 text-center">Operator</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[11px]">
                  {permissionsMatrix.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-2.5 pr-2 font-medium text-slate-800">{row.module}</td>
                      <td className="py-2.5 text-center">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mx-auto" />
                      </td>
                      <td className="py-2.5 text-center">
                        {row['Safety Manager'] ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mx-auto" />
                        ) : (
                          <span className="text-slate-300 font-bold">&mdash;</span>
                        )}
                      </td>
                      <td className="py-2.5 text-center">
                        {row['Safety Supervisor'] ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mx-auto" />
                        ) : (
                          <span className="text-slate-300 font-bold">&mdash;</span>
                        )}
                      </td>
                      <td className="py-2.5 text-center">
                        {row['Safety Officer'] ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mx-auto" />
                        ) : (
                          <span className="text-slate-300 font-bold">&mdash;</span>
                        )}
                      </td>
                      <td className="py-2.5 text-center">
                        {row['Operator'] ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mx-auto" />
                        ) : (
                          <span className="text-slate-300 font-bold">&mdash;</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Member Working Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-lg border border-slate-300 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-bold">Invite Safety Personnel</h3>
              </div>
              <button onClick={() => setIsInviteModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInvite} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  placeholder="e.g. Jonathan Vance"
                  className="w-full py-2 px-3 bg-white border border-slate-300 rounded-md text-slate-900 focus:ring-1 focus:ring-sky-600 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Work Email Address</label>
                <input
                  type="email"
                  required
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  placeholder="j.vance@enterprise.com"
                  className="w-full py-2 px-3 bg-white border border-slate-300 rounded-md text-slate-900 focus:ring-1 focus:ring-sky-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assigned Role</label>
                  <select
                    value={newMember.role}
                    onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                    className="w-full py-2 px-3 bg-white border border-slate-300 rounded-md text-slate-900 outline-none"
                  >
                    <option value="Safety Officer">Safety Officer</option>
                    <option value="Safety Supervisor">Safety Supervisor</option>
                    <option value="Safety Manager">Safety Manager</option>
                    <option value="Operator">Operator</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assigned Facility</label>
                  <select
                    value={newMember.site}
                    onChange={(e) => setNewMember({ ...newMember, site: e.target.value })}
                    className="w-full py-2 px-3 bg-white border border-slate-300 rounded-md text-slate-900 outline-none"
                  >
                    <option value="All Sites">All Sites</option>
                    {sites.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="vg-btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="vg-btn-primary text-xs font-bold"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Send Authorization Invite</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
