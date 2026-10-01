import React, { useState, useEffect } from 'react';
import { AmbulanceDispatch } from '../types/aura';
import { AmbulanceTelemetry } from './AmbulanceTelemetry';
import { loadAmbulanceDispatches, saveAmbulanceDispatches } from '../utils/ambulanceStorage';
import { initialDoctors } from '../data/mockDoctorData';
import { Truck, Clock, MapPin, Wrench, CheckCircle2, Radio, Droplet, Plus, Trash2, X, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';

interface AmbulanceDispatchViewProps {
  isDark?: boolean;
}

export const AmbulanceDispatchView: React.FC<AmbulanceDispatchViewProps> = ({ isDark = false }) => {
  const [fleet, setFleet] = useState<AmbulanceDispatch[]>([]);
  const [selectedUnitId, setSelectedUnitId] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [equipmentChecked, setEquipmentChecked] = useState<{ [key: string]: boolean }>({});
  const [acknowledgedNotice, setAcknowledgedNotice] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  // New Dispatch Form State
  const [formData, setFormData] = useState({
    callSign: '',
    unitType: 'ALS (Advanced Life Support)' as AmbulanceDispatch['unitType'],
    status: 'Inbound to Hospital' as AmbulanceDispatch['status'],
    etaMins: 6,
    priorityCode: 'Code 3 (Emergent/Lights & Sirens)' as AmbulanceDispatch['priorityCode'],
    incidentLocation: '',
    patientAge: 45,
    patientGender: 'Male',
    chiefComplaint: '',
    patientNotes: '',
    destinationBay: 'Trauma Bay 1' as AmbulanceDispatch['requiredResources']['destinationBay'],
    assignedDoctorId: 'DOC-01',
    medicalEquipment: [] as string[],
    bloodUnitsOminus: 2,
    bloodUnitsFFP: 0,
    crewNotes: ''
  });

  // Load from real user storage on mount & sync across components
  useEffect(() => {
    const loadData = () => {
      const stored = loadAmbulanceDispatches();
      setFleet(stored);
      if (stored.length > 0 && !selectedUnitId) {
        setSelectedUnitId(stored[0].id);
      }
    };
    loadData();

    window.addEventListener('aura_ambulance_sync', loadData);
    return () => window.removeEventListener('aura_ambulance_sync', loadData);
  }, []);

  const selectedUnit = fleet.find(u => u.id === selectedUnitId) || fleet[0];

  const handleAcknowledge = (unitId: string) => {
    const updated = fleet.map(u => u.id === unitId ? { ...u, acknowledgedByED: true } : u);
    setFleet(updated);
    saveAmbulanceDispatches(updated);
    setAcknowledgedNotice(`Inbound requirements for ${selectedUnit?.callSign || 'unit'} acknowledged. Bay prepped.`);
    setTimeout(() => setAcknowledgedNotice(null), 3500);
  };

  const handleToggleEquipment = (eqName: string) => {
    setEquipmentChecked(prev => ({
      ...prev,
      [eqName]: !prev[eqName]
    }));
  };

  const handleDeleteUnit = (id: string) => {
    const updated = fleet.filter(u => u.id !== id);
    setFleet(updated);
    saveAmbulanceDispatches(updated);
    if (selectedUnitId === id && updated.length > 0) {
      setSelectedUnitId(updated[0].id);
    }
    setAcknowledgedNotice(`Dispatch ${id} removed.`);
    setTimeout(() => setAcknowledgedNotice(null), 2500);
  };

  const handleClearAll = () => {
    setFleet([]);
    saveAmbulanceDispatches([]);
    setSelectedUnitId('');
    setAcknowledgedNotice("All ambulance dispatches cleared. Ready for real user intake.");
    setTimeout(() => setAcknowledgedNotice(null), 3000);
  };

  const handleUpdateUnitStatus = (id: string, newStatus: AmbulanceDispatch['status']) => {
    const updated = fleet.map(u => u.id === id ? { ...u, status: newStatus } : u);
    setFleet(updated);
    saveAmbulanceDispatches(updated);
    setAcknowledgedNotice(`Status updated to ${newStatus}.`);
    setTimeout(() => setAcknowledgedNotice(null), 2500);
  };

  // Create real user dispatch
  const handleCreateDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.callSign || !formData.chiefComplaint) return;

    const assignedDoc = initialDoctors.find(d => d.id === formData.assignedDoctorId);

    const bloodProductsList: AmbulanceDispatch['requiredResources']['bloodProducts'] = [];
    if (formData.bloodUnitsOminus > 0) {
      bloodProductsList.push({
        product: "O-Negative Uncrossed PRBC",
        quantity: formData.bloodUnitsOminus,
        status: "Pre-Warmed in Bay"
      });
    }
    if (formData.bloodUnitsFFP > 0) {
      bloodProductsList.push({
        product: "Liquid Plasma (FFP)",
        quantity: formData.bloodUnitsFFP,
        status: "Thawing in Blood Bank"
      });
    }

    const newDispatch: AmbulanceDispatch = {
      id: `DISP-${Date.now().toString().slice(-4)}`,
      callSign: formData.callSign,
      unitType: formData.unitType,
      status: formData.status,
      etaMins: Number(formData.etaMins),
      priorityCode: formData.priorityCode,
      incidentLocation: formData.incidentLocation || "Highway Transit Corridor",
      patientSummary: {
        age: Number(formData.patientAge),
        gender: formData.patientGender,
        chiefComplaint: formData.chiefComplaint,
        notes: formData.patientNotes
      },
      requiredResources: {
        destinationBay: formData.destinationBay,
        medicalEquipment: formData.medicalEquipment.length > 0 ? formData.medicalEquipment : ["Rapid Blood Infuser", "Hamilton-T1 Ventilator"],
        bloodProducts: bloodProductsList,
        hospitalTeamActivation: formData.priorityCode.includes('Code 3') ? 'Level 1 Trauma Surgical Alert' : 'Urgent Emergency Care Team',
        bedAssignedId: formData.destinationBay.replace(/\s+/g, '-').slice(0, 8),
        assignedDoctorId: assignedDoc?.id,
        assignedDoctorName: assignedDoc?.name
      },
      crewNotes: formData.crewNotes || "En route to hospital emergency bay. Direct corridor clear.",
      acknowledgedByED: false
    };

    const updated = [newDispatch, ...fleet];
    setFleet(updated);
    saveAmbulanceDispatches(updated);
    setSelectedUnitId(newDispatch.id);
    setIsCreateModalOpen(false);

    // Reset form
    setFormData({
      callSign: '',
      unitType: 'ALS (Advanced Life Support)',
      status: 'Inbound to Hospital',
      etaMins: 6,
      priorityCode: 'Code 3 (Emergent/Lights & Sirens)',
      incidentLocation: '',
      patientAge: 45,
      patientGender: 'Male',
      chiefComplaint: '',
      patientNotes: '',
      destinationBay: 'Trauma Bay 1',
      assignedDoctorId: 'DOC-01',
      medicalEquipment: [],
      bloodUnitsOminus: 2,
      bloodUnitsFFP: 0,
      crewNotes: ''
    });

    setAcknowledgedNotice(`New dispatch ${newDispatch.callSign} logged and queued.`);
    setTimeout(() => setAcknowledgedNotice(null), 3500);
  };

  const filteredFleet = fleet.filter(u => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'inbound') return u.status === 'Inbound to Hospital';
    if (statusFilter === 'active') return u.status !== 'Available';
    return true;
  });

  const inboundCount = fleet.filter(u => u.status === 'Inbound to Hospital').length;

  const cardBg = isDark ? 'bg-slate-900/40 border-slate-800/80' : 'bg-white border-slate-200/80 shadow-xs';
  const subCardBg = isDark ? 'bg-slate-950/40 border-slate-800/80' : 'bg-slate-50 border-slate-200/70';
  const headingColor = isDark ? 'text-white' : 'text-slate-900';
  const mutedTextColor = isDark ? 'text-slate-400' : 'text-slate-600';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Clean Header Banner with Create Dispatch Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-blue-600 dark:text-cyan-400 mb-1 font-semibold">
            <span>Pre-Hospital Transport</span>
            <span aria-hidden="true">·</span>
            <span>EMS Inbound Dispatch System</span>
          </div>
          <h1 className={`text-2xl font-bold tracking-tight ${headingColor} flex items-center gap-3`}>
            <span>Ambulance Dispatches</span>
            <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              ● {inboundCount} Inbound
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Filter Tabs */}
          <div className={`flex items-center gap-1 p-1 rounded-xl border text-xs font-medium ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                statusFilter === 'all'
                  ? isDark ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-white text-blue-700 font-semibold shadow-xs'
                  : mutedTextColor
              }`}
            >
              All ({fleet.length})
            </button>
            <button
              onClick={() => setStatusFilter('inbound')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                statusFilter === 'inbound'
                  ? isDark ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-white text-blue-700 font-semibold shadow-xs'
                  : mutedTextColor
              }`}
            >
              Inbound ({inboundCount})
            </button>
          </div>

          {/* Clear All Dispatches if fleet exists */}
          {fleet.length > 0 && (
            <button
              onClick={handleClearAll}
              className={`px-3 py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                isDark ? 'border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-900' : 'border-slate-200 text-slate-600 hover:text-rose-600'
              }`}
              title="Clear all dispatches to zero"
            >
              Clear All
            </button>
          )}

          {/* Real User Dispatch Creation Button */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-xl transition-colors cursor-pointer shadow-xs whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Dispatch</span>
          </button>
        </div>
      </div>

      {/* Global Notice */}
      {acknowledgedNotice && (
        <div className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 ${
          isDark ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
        }`}>
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{acknowledgedNotice}</span>
        </div>
      )}

      {/* Main Grid: Ambulance Fleet List (5 Cols) + Selected Inbound Details (7 Cols) */}
      {fleet.length === 0 ? (
        <div className={`p-12 text-center rounded-2xl border space-y-4 ${cardBg}`}>
          <Truck className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className={`text-base font-bold ${headingColor}`}>No Active Ambulance Dispatches</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            You currently have no active ambulance dispatches. Click "New Dispatch" above to log an incoming ambulance with patient condition and required hospital supplies.
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl cursor-pointer"
          >
            + Create First Ambulance Dispatch
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Ambulance Units Column (5 Cols) */}
          <div className="lg:col-span-5 space-y-3">
            {filteredFleet.map(unit => {
              const isSelected = unit.id === selectedUnitId;
              const isInbound = unit.status === 'Inbound to Hospital';
              const isAir = unit.unitType === 'Air MedEvac';

              return (
                <div
                  key={unit.id}
                  onClick={() => setSelectedUnitId(unit.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
                    isSelected
                      ? isDark
                        ? 'bg-slate-900/90 border-cyan-500/80 shadow-md ring-1 ring-cyan-500/20'
                        : 'bg-blue-50/70 border-blue-500 shadow-xs'
                      : isDark
                        ? 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
                        : 'bg-white border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Truck className={`w-4 h-4 ${isAir ? 'text-purple-400' : 'text-blue-500 dark:text-cyan-400'}`} />
                      <span className={`text-sm font-bold ${headingColor}`}>
                        {unit.callSign}
                      </span>
                    </div>
                    {isInbound ? (
                      <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                        ETA {unit.etaMins}m
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-xs text-slate-500 bg-slate-100 dark:bg-slate-800">
                        {unit.status}
                      </span>
                    )}
                  </div>

                  <div className={`text-xs ${mutedTextColor} line-clamp-1`}>
                    {unit.patientSummary.chiefComplaint}
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800/60 pt-2">
                    <span className="truncate max-w-[200px]">
                      Dest: <strong className={headingColor}>{unit.requiredResources.destinationBay}</strong>
                    </span>
                    <span className={`text-[11px] font-medium ${
                      unit.acknowledgedByED ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
                    }`}>
                      {unit.acknowledgedByED ? "✓ Staged" : "! Action Needed"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Unit Inbound Requirements & Pre-Arrival Checklist (7 Cols) */}
          {selectedUnit && (
            <div className="lg:col-span-7 space-y-6">
              {/* Transit & Patient Information (No vitals) */}
              <AmbulanceTelemetry unit={selectedUnit} isDark={isDark} />

              {/* REQUIRED BY AMBULANCE UPON ARRIVAL */}
              <div className={`p-6 rounded-2xl border space-y-5 ${cardBg}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-blue-500 dark:text-cyan-400" />
                    <h3 className={`text-sm font-bold ${headingColor}`}>
                      Hospital Supplies & Team Demanded by {selectedUnit.callSign}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    {!selectedUnit.acknowledgedByED ? (
                      <button
                        onClick={() => handleAcknowledge(selectedUnit.id)}
                        className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer shadow-xs whitespace-nowrap"
                      >
                        Acknowledge & Mobilize Bay
                      </button>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                        ✓ Bay Ready
                      </span>
                    )}

                    <button
                      onClick={() => handleDeleteUnit(selectedUnit.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg border border-transparent hover:border-slate-700 transition-colors cursor-pointer"
                      title="Delete dispatch"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Status Switcher for Real Dispatch Workflow */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400 text-[11px] font-medium">Update Status:</span>
                  {(['Inbound to Hospital', 'Arrived In-Bay', 'Available'] as AmbulanceDispatch['status'][]).map(st => (
                    <button
                      key={st}
                      onClick={() => handleUpdateUnitStatus(selectedUnit.id, st)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                        selectedUnit.status === st
                          ? 'bg-blue-600 text-white font-semibold'
                          : isDark ? 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                {/* Destination Bay & Clinical Team */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className={`p-3.5 rounded-xl border space-y-1 ${subCardBg}`}>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Assigned Trauma Bay</span>
                    <div className="text-sm font-bold text-blue-600 dark:text-cyan-300">
                      {selectedUnit.requiredResources.destinationBay}
                    </div>
                    <div className="text-[11px] text-slate-500">Bay ID: {selectedUnit.requiredResources.bedAssignedId}</div>
                  </div>

                  <div className={`p-3.5 rounded-xl border space-y-1 ${subCardBg}`}>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Designated Receiving Doctor</span>
                    <div className="text-xs font-bold text-rose-600 dark:text-rose-400">
                      {selectedUnit.requiredResources.assignedDoctorName || "Trauma Surgeon on Duty"}
                    </div>
                    <div className="text-[11px] text-slate-500">Pre-assigned lead physician</div>
                  </div>
                </div>

                {/* Medical Equipment Demanded */}
                <div className="space-y-2">
                  <div className="text-xs text-slate-400 font-semibold uppercase">
                    Specialized Equipment Checklist (Click to Stage):
                  </div>
                  <div className="space-y-1.5">
                    {selectedUnit.requiredResources.medicalEquipment.map((eq, idx) => {
                      const isChecked = equipmentChecked[eq] || selectedUnit.acknowledgedByED;
                      return (
                        <div
                          key={idx}
                          onClick={() => handleToggleEquipment(eq)}
                          className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                            isChecked
                              ? isDark ? 'bg-cyan-950/20 border-cyan-800/60 text-cyan-200' : 'bg-blue-50 border-blue-200 text-blue-900'
                              : isDark ? 'bg-slate-950/40 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <CheckCircle2 className={`w-4 h-4 ${isChecked ? "text-emerald-500" : "text-slate-400"}`} />
                            <span>{eq}</span>
                          </span>
                          <span className={`text-[10px] font-semibold uppercase ${isChecked ? "text-emerald-500" : "text-amber-500"}`}>
                            {isChecked ? "Staged in Bay" : "Pending Staging"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Blood Products Demanded */}
                {selectedUnit.requiredResources.bloodProducts.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs text-slate-400 font-semibold uppercase flex items-center gap-1.5">
                      <Droplet className="w-3.5 h-3.5 text-rose-500" />
                      <span>Demanded Blood Products:</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedUnit.requiredResources.bloodProducts.map((bp, idx) => (
                        <div key={idx} className={`p-3 rounded-xl border text-xs space-y-1 ${subCardBg}`}>
                          <div className="flex justify-between font-bold">
                            <span className={headingColor}>{bp.product}</span>
                            <span className="text-rose-600 dark:text-rose-400">{bp.quantity} Units</span>
                          </div>
                          <div className="text-[11px] text-amber-600 dark:text-amber-400">
                            Status: {bp.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* CREATE REAL DISPATCH MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`w-full max-w-xl p-6 rounded-2xl border max-h-[90vh] overflow-y-auto space-y-5 ${
            isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-xl'
          }`}>
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold">Log New Ambulance Dispatch</h3>
                <p className="text-xs text-slate-400">Enter real dispatch data, patient scenario, and required hospital supplies.</p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDispatch} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Ambulance Call Sign *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Medic-07, Rescue-2"
                    value={formData.callSign}
                    onChange={e => setFormData({ ...formData, callSign: e.target.value })}
                    className={`w-full p-2 rounded-lg border ${
                      isDark ? 'bg-slate-950 border-slate-700' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Transport Unit Type</label>
                  <select
                    value={formData.unitType}
                    onChange={e => setFormData({ ...formData, unitType: e.target.value as any })}
                    className={`w-full p-2 rounded-lg border ${
                      isDark ? 'bg-slate-950 border-slate-700' : 'bg-slate-50 border-slate-300'
                    }`}
                  >
                    <option value="ALS (Advanced Life Support)">ALS (Advanced Life Support)</option>
                    <option value="BLS (Basic Life Support)">BLS (Basic Life Support)</option>
                    <option value="Critical Care Transport">Critical Care Transport</option>
                    <option value="Air MedEvac">Air MedEvac (Helicopter)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">ETA (Minutes)</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={formData.etaMins}
                    onChange={e => setFormData({ ...formData, etaMins: parseInt(e.target.value) || 5 })}
                    className={`w-full p-2 rounded-lg border ${
                      isDark ? 'bg-slate-950 border-slate-700' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Priority Code</label>
                  <select
                    value={formData.priorityCode}
                    onChange={e => setFormData({ ...formData, priorityCode: e.target.value as any })}
                    className={`w-full p-2 rounded-lg border ${
                      isDark ? 'bg-slate-950 border-slate-700' : 'bg-slate-50 border-slate-300'
                    }`}
                  >
                    <option value="Code 3 (Emergent/Lights & Sirens)">Code 3 (Emergent/Lights & Sirens)</option>
                    <option value="Code 2 (Urgent)">Code 2 (Urgent)</option>
                    <option value="Code 1 (Routine)">Code 1 (Routine)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Destination Bay</label>
                  <select
                    value={formData.destinationBay}
                    onChange={e => setFormData({ ...formData, destinationBay: e.target.value as any })}
                    className={`w-full p-2 rounded-lg border ${
                      isDark ? 'bg-slate-950 border-slate-700' : 'bg-slate-50 border-slate-300'
                    }`}
                  >
                    <option value="Trauma Bay 1">Trauma Bay 1</option>
                    <option value="Resuscitation Bay 2">Resuscitation Bay 2</option>
                    <option value="Negative-Pressure Suite 201">Negative-Pressure Suite 201</option>
                    <option value="Cardiac Cath Lab">Cardiac Cath Lab</option>
                    <option value="Acute Bay 4">Acute Bay 4</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Incident Location</label>
                <input
                  type="text"
                  placeholder="e.g. Highway 101 Mile 14, Downtown Metro Plaza"
                  value={formData.incidentLocation}
                  onChange={e => setFormData({ ...formData, incidentLocation: e.target.value })}
                  className={`w-full p-2 rounded-lg border ${
                    isDark ? 'bg-slate-950 border-slate-700' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-slate-400 mb-1">Patient Chief Complaint / Scenario *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Motor vehicle collision, chest pain, stroke symptoms"
                    value={formData.chiefComplaint}
                    onChange={e => setFormData({ ...formData, chiefComplaint: e.target.value })}
                    className={`w-full p-2 rounded-lg border ${
                      isDark ? 'bg-slate-950 border-slate-700' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Age / Gender</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="1"
                      max="110"
                      value={formData.patientAge}
                      onChange={e => setFormData({ ...formData, patientAge: parseInt(e.target.value) || 40 })}
                      className={`w-16 p-2 rounded-lg border ${
                        isDark ? 'bg-slate-950 border-slate-700' : 'bg-slate-50 border-slate-300'
                      }`}
                    />
                    <select
                      value={formData.patientGender}
                      onChange={e => setFormData({ ...formData, patientGender: e.target.value })}
                      className={`flex-1 p-2 rounded-lg border ${
                        isDark ? 'bg-slate-950 border-slate-700' : 'bg-slate-50 border-slate-300'
                      }`}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Assigned Receiving Specialist Doctor</label>
                <select
                  value={formData.assignedDoctorId}
                  onChange={e => setFormData({ ...formData, assignedDoctorId: e.target.value })}
                  className={`w-full p-2 rounded-lg border ${
                    isDark ? 'bg-slate-950 border-slate-700' : 'bg-slate-50 border-slate-300'
                  }`}
                >
                  {initialDoctors.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.specialty})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Pre-Arrive O- Blood (Units)</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={formData.bloodUnitsOminus}
                    onChange={e => setFormData({ ...formData, bloodUnitsOminus: parseInt(e.target.value) || 0 })}
                    className={`w-full p-2 rounded-lg border ${
                      isDark ? 'bg-slate-950 border-slate-700' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Pre-Arrive Plasma FFP (Units)</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={formData.bloodUnitsFFP}
                    onChange={e => setFormData({ ...formData, bloodUnitsFFP: parseInt(e.target.value) || 0 })}
                    className={`w-full p-2 rounded-lg border ${
                      isDark ? 'bg-slate-950 border-slate-700' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Paramedic Scene / Field Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. IV access established, collar applied, ETA confirmed"
                  value={formData.patientNotes}
                  onChange={e => setFormData({ ...formData, patientNotes: e.target.value })}
                  className={`w-full p-2 rounded-lg border ${
                    isDark ? 'bg-slate-950 border-slate-700' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl cursor-pointer shadow-xs"
                >
                  Log & Dispatch Unit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
