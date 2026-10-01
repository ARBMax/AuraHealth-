import React, { useState, useEffect } from 'react';
import { initialBeds, initialBloodInventory } from '../data/mockDiagnosticData';
import { loadAmbulanceDispatches } from '../utils/ambulanceStorage';
import { initialDoctors } from '../data/mockDoctorData';
import { SimpleGuideBanner } from './SimpleGuideBanner';
import { ActiveTab, AmbulanceDispatch } from '../types/aura';
import { ShieldCheck, BedDouble, Droplet, Users, Bell, MapPin, Truck, ArrowRight, Stethoscope, Clock, CheckCircle2, AlertCircle, Plus } from 'lucide-react';

interface CommandCenterViewProps {
  isDark?: boolean;
  onNavigateToAmbulances?: () => void;
  onNavigateToDoctors?: () => void;
  onNavigateToTab?: (tab: ActiveTab) => void;
}

export const CommandCenterView: React.FC<CommandCenterViewProps> = ({ 
  isDark = false, 
  onNavigateToAmbulances,
  onNavigateToDoctors,
  onNavigateToTab 
}) => {
  const [fleet, setFleet] = useState<AmbulanceDispatch[]>([]);

  useEffect(() => {
    const sync = () => {
      setFleet(loadAmbulanceDispatches());
    };
    sync();
    window.addEventListener('aura_ambulance_sync', sync);
    return () => window.removeEventListener('aura_ambulance_sync', sync);
  }, []);

  const totalBeds = initialBeds.length;
  const occupiedBeds = initialBeds.filter(b => b.status === 'Occupied').length;
  const occupancyRate = Math.round((occupiedBeds / totalBeds) * 100);

  const totalOminus = initialBloodInventory.find(b => b.bloodType === 'O-')?.prbcUnits || 0;
  const inboundUnits = fleet.filter(u => u.status === 'Inbound to Hospital');
  const availableDocs = initialDoctors.filter(d => d.status === 'Available').length;
  const closestAmbulance = inboundUnits[0] || fleet[0];

  const handleTabRoute = (tab: ActiveTab) => {
    if (onNavigateToTab) {
      onNavigateToTab(tab);
    } else if (tab === 'ambulances' && onNavigateToAmbulances) {
      onNavigateToAmbulances();
    } else if (tab === 'doctors' && onNavigateToDoctors) {
      onNavigateToDoctors();
    }
  };

  const cardBg = isDark ? 'bg-slate-900/40 border-slate-800/80' : 'bg-white border-slate-200/80 shadow-xs';
  const headingColor = isDark ? 'text-white' : 'text-slate-900';
  const mutedTextColor = isDark ? 'text-slate-400' : 'text-slate-600';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Clean Executive Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-blue-600 dark:text-cyan-400 mb-1 font-semibold">
            <span>Hospital Operations Command</span>
            <span aria-hidden="true">·</span>
            <span>Live Executive Matrix</span>
          </div>
          <h1 className={`text-2xl font-bold tracking-tight ${headingColor} flex items-center gap-3`}>
            <span>Central Operations Dashboard</span>
            <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              ● All Systems Nominal
            </span>
          </h1>
        </div>

        {/* Clean Meta Stats Pill */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
          <span className={`px-3 py-1.5 rounded-lg border ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            Local Time: <strong className={headingColor}>03:52 UTC-7</strong>
          </span>
        </div>
      </div>

      {/* Clean Collapsible Quick Guide */}
      <SimpleGuideBanner onNavigateTab={handleTabRoute} isDark={isDark} />

      {/* Hero Metric Cards (4 Clean Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Bed Availability */}
        <div className={`p-5 rounded-2xl border transition-all ${cardBg}`}>
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-2">
            <span>Bed Availability</span>
            <BedDouble className="w-4 h-4 text-blue-500 dark:text-cyan-400" />
          </div>
          <div className={`text-2xl font-bold font-mono ${headingColor}`}>
            {totalBeds - occupiedBeds} <span className="text-sm font-normal text-slate-400">/ {totalBeds} Beds Open</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-3 mb-2">
            <div className="bg-blue-600 dark:bg-cyan-500 h-full rounded-full transition-all" style={{ width: `${occupancyRate}%` }} />
          </div>
          <div className="text-[11px] text-slate-500">
            {occupancyRate}% hospital occupancy
          </div>
        </div>

        {/* Inbound Ambulances */}
        <div 
          onClick={onNavigateToAmbulances}
          className={`p-5 rounded-2xl border transition-all cursor-pointer hover:border-rose-500/50 ${cardBg}`}
        >
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-2">
            <span>Incoming Ambulances</span>
            <Truck className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-400">
            {inboundUnits.length} <span className="text-sm font-normal text-slate-400">Inbound</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-3 flex items-center justify-between">
            <span>
              {closestAmbulance ? `Next: ${closestAmbulance.callSign}` : "No Active Dispatches"}
            </span>
            {closestAmbulance ? (
              <span className="font-semibold text-rose-600 dark:text-rose-400">ETA {closestAmbulance.etaMins}m</span>
            ) : (
              <span className="text-blue-600 dark:text-cyan-400 font-medium">+ Add</span>
            )}
          </div>
        </div>

        {/* Doctors on Duty */}
        <div 
          onClick={onNavigateToDoctors}
          className={`p-5 rounded-2xl border transition-all cursor-pointer hover:border-blue-500/50 ${cardBg}`}
        >
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-2">
            <span>Doctors on Duty</span>
            <Stethoscope className="w-4 h-4 text-blue-500 dark:text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            {availableDocs} <span className="text-sm font-normal text-slate-400">/ {initialDoctors.length} Ready</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-3 flex items-center justify-between">
            <span>All acute codes covered</span>
            <span className="text-blue-600 dark:text-cyan-400 font-medium">Manage &rarr;</span>
          </div>
        </div>

        {/* Universal Blood Reserves */}
        <div className={`p-5 rounded-2xl border transition-all ${cardBg}`}>
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-2">
            <span>Emergency O- Blood</span>
            <Droplet className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
            {totalOminus} <span className="text-sm font-normal text-slate-400">Units Available</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-3">
            Universal donor supply replenished
          </div>
        </div>
      </div>

      {/* Main Clean 2-Column Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Priority Inbound Ambulance & Bed Capacity (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Priority Inbound Alert Card (Dynamic or Empty Prompt) */}
          {closestAmbulance ? (
            <div className={`p-5 rounded-2xl border space-y-4 ${
              isDark ? 'bg-rose-950/20 border-rose-900/40' : 'bg-rose-50/60 border-rose-200'
            }`}>
              <div className="flex items-center justify-between border-b border-rose-200 dark:border-rose-900/40 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-rose-600 text-white shadow-xs">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase font-mono">
                      Priority Pre-Arrival Alert
                    </div>
                    <h3 className={`text-base font-bold ${headingColor}`}>
                      {closestAmbulance.callSign} · Arriving in {closestAmbulance.etaMins} mins
                    </h3>
                  </div>
                </div>

                {onNavigateToAmbulances && (
                  <button
                    onClick={onNavigateToAmbulances}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer shadow-xs whitespace-nowrap"
                  >
                    View Dispatch
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className={`p-3 rounded-xl border ${
                  isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Patient Scenario</span>
                  <strong className={headingColor}>
                    {closestAmbulance.patientSummary.gender}, {closestAmbulance.patientSummary.age}y · {closestAmbulance.patientSummary.chiefComplaint}
                  </strong>
                  {closestAmbulance.patientSummary.notes && (
                    <div className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                      {closestAmbulance.patientSummary.notes}
                    </div>
                  )}
                </div>

                <div className={`p-3 rounded-xl border ${
                  isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Assigned Receiving Bay</span>
                  <strong className="text-blue-600 dark:text-cyan-400">
                    {closestAmbulance.requiredResources.destinationBay}
                  </strong>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Pre-assigned: {closestAmbulance.requiredResources.assignedDoctorName || "Trauma Attending"}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={`p-6 rounded-2xl border text-center space-y-3 ${cardBg}`}>
              <div className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 w-12 h-12 mx-auto flex items-center justify-center text-slate-500">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h3 className={`text-sm font-bold ${headingColor}`}>No Inbound Ambulances Active</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  All trauma and resuscitation bays are currently available and cleared.
                </p>
              </div>
              {onNavigateToAmbulances && (
                <button
                  onClick={onNavigateToAmbulances}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log Real Inbound Ambulance</span>
                </button>
              )}
            </div>
          )}

          {/* Hospital Ward Capacity Summary */}
          <div className={`p-5 rounded-2xl border space-y-4 ${cardBg}`}>
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-500 dark:text-cyan-400" />
                <h3 className={`text-sm font-bold ${headingColor}`}>
                  Hospital Wards & Bed Status
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">Capacity Overview</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
              <div className={`p-3 rounded-xl border ${
                isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className="text-slate-400 text-[10px] block">ICU Floor</span>
                <strong className={headingColor}>2 / 4 Open</strong>
                <div className="text-[10px] text-emerald-500 mt-1">Ventilators Ready</div>
              </div>

              <div className={`p-3 rounded-xl border ${
                isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className="text-slate-400 text-[10px] block">Isolation Suite</span>
                <strong className="text-blue-600 dark:text-cyan-400">1 / 3 Open</strong>
                <div className="text-[10px] text-slate-400 mt-1">Negative-Pressure</div>
              </div>

              <div className={`p-3 rounded-xl border ${
                isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className="text-slate-400 text-[10px] block">Trauma Bay</span>
                <strong className={closestAmbulance ? "text-rose-500" : "text-emerald-500"}>
                  {closestAmbulance ? "Bay 1 Staged" : "Available"}
                </strong>
                <div className="text-[10px] text-slate-400 mt-1">
                  {closestAmbulance ? `Prepped for ${closestAmbulance.callSign}` : "Cleared for intakes"}
                </div>
              </div>

              <div className={`p-3 rounded-xl border ${
                isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className="text-slate-400 text-[10px] block">Step-Down</span>
                <strong className={headingColor}>1 / 3 Open</strong>
                <div className="text-[10px] text-slate-400 mt-1">Continuous Monitoring</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Operations Feed & Doctor Quick Roster (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Doctor On-Duty Quick Strip */}
          <div className={`p-5 rounded-2xl border space-y-3 ${cardBg}`}>
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-blue-500 dark:text-cyan-400" />
                <h3 className={`text-sm font-bold ${headingColor}`}>
                  Specialist Doctors on Shift
                </h3>
              </div>
              {onNavigateToDoctors && (
                <button
                  onClick={onNavigateToDoctors}
                  className="text-xs text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer"
                >
                  Manage Roster &rarr;
                </button>
              )}
            </div>

            <div className="space-y-2 text-xs">
              {initialDoctors.slice(0, 3).map(doc => (
                <div 
                  key={doc.id}
                  className={`p-2.5 rounded-xl border flex items-center justify-between ${
                    isDark ? 'bg-slate-950/40 border-slate-800/80' : 'bg-slate-50 border-slate-200/70'
                  }`}
                >
                  <div>
                    <strong className={headingColor}>{doc.name}</strong>
                    <div className="text-[11px] text-slate-400">{doc.specialty}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    doc.status === 'Available' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                    doc.status === 'Assigned / In Bay' ? 'bg-blue-500/10 text-blue-600 dark:text-cyan-400' :
                    'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                  }`}>
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Live Hospital Activity Stream (Dynamic from Real Data) */}
          <div className={`p-5 rounded-2xl border space-y-3 ${cardBg}`}>
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-500 dark:text-cyan-400" />
                <h3 className={`text-sm font-bold ${headingColor}`}>
                  Live Activity Stream
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">Real-Time</span>
            </div>

            <div className="space-y-2.5 text-xs">
              {fleet.length > 0 ? (
                fleet.map(u => (
                  <div key={u.id} className="flex items-start gap-2.5 text-slate-600 dark:text-slate-300">
                    <span className="h-2 w-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                    <div>
                      <strong className={headingColor}>{u.callSign} (ETA {u.etaMins}m):</strong> {u.patientSummary.chiefComplaint}. Staged for {u.requiredResources.destinationBay}.
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-slate-500 italic py-2">
                  No active ambulance dispatches. Systems standing by for real intakes.
                </div>
              )}

              <div className="flex items-start gap-2.5 text-slate-600 dark:text-slate-300">
                <span className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div>
                  <strong className={headingColor}>Isolation Room 201:</strong> Negative pressure air filters verified active.
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-slate-600 dark:text-slate-300">
                <span className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <div>
                  <strong className={headingColor}>Blood Bank:</strong> Universal O- blood reserve monitored and ready.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
