import React from 'react';
import { AmbulanceDispatch } from '../types/aura';
import { Clock, MapPin, Radio, ShieldAlert, CheckCircle2, User, FileText, Compass, AlertTriangle } from 'lucide-react';

interface AmbulanceTelemetryProps {
  unit: AmbulanceDispatch;
  isDark?: boolean;
}

export const AmbulanceTelemetry: React.FC<AmbulanceTelemetryProps> = ({ unit, isDark = false }) => {
  // Transit route checkpoints
  const routeSteps = [
    { label: "Scene Departure", completed: true },
    { label: "Transit Corridor", completed: true },
    { label: "Hospital Geofence (2km)", completed: unit.etaMins <= 10 },
    { label: "Ambulance Bay Ramp", completed: unit.etaMins <= 3 },
    { label: "Bay Bed Handover", completed: unit.status === 'Arrived In-Bay' }
  ];

  const cardBg = isDark ? 'bg-slate-900/40 border-slate-800/80' : 'bg-white border-slate-200/80 shadow-xs';
  const subCardBg = isDark ? 'bg-slate-950/40 border-slate-800/80' : 'bg-slate-50 border-slate-200/70';
  const headingColor = isDark ? 'text-white' : 'text-slate-900';
  const mutedTextColor = isDark ? 'text-slate-400' : 'text-slate-600';

  return (
    <div className={`p-5 rounded-2xl border space-y-5 ${cardBg}`}>
      {/* Telemetry Header: Inbound ETA & Transit Priority */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-xs">
            <Radio className="w-4 h-4 text-cyan-200 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className={`font-bold ${isDark ? 'text-cyan-400' : 'text-blue-700'}`}>
                {unit.callSign}
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-xs text-rose-600 dark:text-rose-400 font-semibold">{unit.priorityCode}</span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Target Bay: <strong className={headingColor}>{unit.requiredResources.destinationBay}</strong>
            </div>
          </div>
        </div>

        {/* Dynamic Countdown */}
        <div className="flex items-center gap-3 text-xs">
          <div className={`px-3 py-2 rounded-xl border text-right ${subCardBg}`}>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Estimated Arrival</span>
            <div className="flex items-center justify-end gap-1.5 font-bold font-mono">
              <Clock className="w-3.5 h-3.5 text-rose-500" />
              <span className="text-base text-rose-600 dark:text-rose-400 font-bold">{unit.etaMins} Mins</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Route Corridor Progress */}
      <div className="space-y-2 text-xs">
        <div className="flex justify-between text-slate-500">
          <span className="font-medium flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400" />
            <span>Transit Corridor Status</span>
          </span>
          <span className="text-blue-600 dark:text-cyan-400 font-medium">In-Transit · Priority Routing</span>
        </div>
        <div className="grid grid-cols-5 gap-1.5 text-center text-xs">
          {routeSteps.map((step, idx) => (
            <div
              key={idx}
              className={`p-2 rounded-lg border transition-colors ${
                step.completed
                  ? isDark ? 'bg-cyan-950/40 border-cyan-500/60 text-cyan-300 font-semibold' : 'bg-blue-50 border-blue-300 text-blue-900 font-semibold'
                  : isDark ? 'bg-slate-950/40 border-slate-800 text-slate-500' : 'bg-slate-100 border-slate-200 text-slate-400'
              }`}
            >
              <div className="text-[10px] truncate">{step.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Patient Clinical Profile & Scene Notes (No vitals) */}
      <div className={`p-4 rounded-xl border space-y-2.5 ${subCardBg}`}>
        <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-200 dark:border-slate-800/80 pb-2">
          <span className="flex items-center gap-1.5 font-medium">
            <User className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400" />
            <span>Patient Field Assessment</span>
          </span>
          <span className="font-mono text-slate-400">
            {unit.patientSummary.gender}, {unit.patientSummary.age} years old
          </span>
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Chief Complaint / Condition</span>
          <div className={`text-sm font-semibold ${headingColor}`}>
            {unit.patientSummary.chiefComplaint}
          </div>
        </div>

        {unit.patientSummary.notes && (
          <div className="pt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Field Notes: </span>
            {unit.patientSummary.notes}
          </div>
        )}

        <div className="pt-1 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400 shrink-0" />
          <span>Incident Location: <strong className={headingColor}>{unit.incidentLocation}</strong></span>
        </div>
      </div>
    </div>
  );
};
