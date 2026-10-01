import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInspections } from '../context/InspectionContext';
import {
  Building,
  Plus,
  Search,
  Camera,
  AlertTriangle,
  ShieldCheck,
  MapPin,
  Users,
  ExternalLink,
  X,
  CheckCircle2
} from 'lucide-react';

export const SitesManagementPage = () => {
  const navigate = useNavigate();
  const { sites, cameras, incidents, addSite, setSelectedSite } = useInspections();

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSite, setNewSite] = useState({
    name: '',
    code: '',
    address: '',
    type: 'Construction Site',
    activeSupervisors: '3'
  });

  const filteredSites = sites.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateSite = (e) => {
    e.preventDefault();
    if (!newSite.name) return;
    addSite(newSite);
    setIsAddModalOpen(false);
    setNewSite({
      name: '',
      code: '',
      address: '',
      type: 'Construction Site',
      activeSupervisors: '3'
    });
  };

  const handleSelectAndInspect = (siteName) => {
    setSelectedSite(siteName);
    navigate('/live-cameras');
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Building className="w-5 h-5 text-sky-700" />
            Monitored Industrial Sites & Facilities
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage high-risk physical job sites, active supervisor allocations, connected camera sensors, and OSHA compliance ratings.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="vg-btn-primary text-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Site</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="vg-card p-3 flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search facility name, address, code..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-600"
          />
        </div>
        <span className="text-xs text-slate-500 font-semibold hidden sm:inline">
          {filteredSites.length} Facilities Under Continuous Surveillance
        </span>
      </div>

      {/* Sites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSites.map((site) => {
          const siteCams = cameras.filter((c) => c.site === site.name);
          const siteIncidents = incidents.filter((i) => i.site === site.name && i.status !== 'CLOSED');

          return (
            <div key={site.id} className="vg-card p-5 space-y-4 flex flex-col justify-between hover:border-slate-300 transition">
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-md bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700 font-bold text-xs">
                      {site.code}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{site.name}</h3>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 shrink-0 text-slate-400" />
                        <span className="truncate max-w-[200px]">{site.address}</span>
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-700">
                    {site.type || 'Job Site'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 py-3 mt-3 border-y border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">CCTV Feeds</span>
                    <span className="font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                      <Camera className="w-3 h-3 text-slate-500" />
                      {siteCams.length}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Supervisors</span>
                    <span className="font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                      <Users className="w-3 h-3 text-slate-500" />
                      {site.activeSupervisors}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Safety Score</span>
                    <span className="font-bold text-emerald-700 mt-0.5 block">
                      {site.safetyScore}/100
                    </span>
                  </div>
                </div>

                <div className="mt-3">
                  {siteIncidents.length > 0 ? (
                    <div className="p-2 rounded-md bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      <span className="font-semibold">{siteIncidents.length} Active Hazard Incidents</span>
                    </div>
                  ) : (
                    <div className="p-2 rounded-md bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="font-semibold">Zero Critical Breaches</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => handleSelectAndInspect(site.name)}
                  className="w-full vg-btn-secondary justify-center text-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Launch Live CCTV Feeds</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Site Working Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-lg border border-slate-300 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-bold">Register New Facility / Job Site</h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSite} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Facility Name</label>
                <input
                  type="text"
                  required
                  value={newSite.name}
                  onChange={(e) => setNewSite({ ...newSite, name: e.target.value })}
                  placeholder="e.g. North Ridge Logistics Center"
                  className="w-full py-2 px-3 bg-white border border-slate-300 rounded-md text-slate-900 focus:ring-1 focus:ring-sky-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Site Code</label>
                  <input
                    type="text"
                    value={newSite.code}
                    onChange={(e) => setNewSite({ ...newSite, code: e.target.value })}
                    placeholder="e.g. NRL-01"
                    className="w-full py-2 px-3 bg-white border border-slate-300 rounded-md text-slate-900 font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Facility Type</label>
                  <select
                    value={newSite.type}
                    onChange={(e) => setNewSite({ ...newSite, type: e.target.value })}
                    className="w-full py-2 px-3 bg-white border border-slate-300 rounded-md text-slate-900 outline-none"
                  >
                    <option value="Construction Site">Construction Site</option>
                    <option value="Industrial Logistics">Industrial Logistics</option>
                    <option value="Chemical Facility">Chemical Facility</option>
                    <option value="Energy Substation">Energy Substation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Physical Address / Geo Coordinates</label>
                <input
                  type="text"
                  required
                  value={newSite.address}
                  onChange={(e) => setNewSite({ ...newSite, address: e.target.value })}
                  placeholder="e.g. 1040 North Industrial Way, Sector 8"
                  className="w-full py-2 px-3 bg-white border border-slate-300 rounded-md text-slate-900 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="vg-btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="vg-btn-primary text-xs font-bold"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Register Site</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
