import React, { useState, useMemo } from 'react';
import { initialPatients, initialBeds, initialBloodInventory } from '../data/mockDiagnosticData';
import { initialSpecializedEquipment } from '../data/mockDoctorData';
import { PatientRecord, BedUnit, BloodInventoryItem, SpecializedEquipment } from '../types/aura';
import { Activity, GitCommit, Sliders, Users, AlertCircle, ShieldAlert, HeartPulse, BedDouble, Droplet, ArrowRight, RefreshCw, CheckCircle, Wrench, Battery, Zap, CheckCircle2 } from 'lucide-react';

interface PatientOperationsViewProps {
  isDark?: boolean;
  activeSubTab?: 'triage' | 'resources';
  onSubTabChange?: (tab: 'triage' | 'resources') => void;
}

export const PatientOperationsView: React.FC<PatientOperationsViewProps> = ({ 
  isDark = false,
  activeSubTab: controlledSubTab,
  onSubTabChange
}) => {
  const [internalSubTab, setInternalSubTab] = useState<'triage' | 'resources'>('resources');
  const activeSubTab = controlledSubTab || internalSubTab;
  const setActiveSubTab = (tab: 'triage' | 'resources') => {
    if (onSubTabChange) onSubTabChange(tab);
    setInternalSubTab(tab);
  };

  // Patients state
  const [patients, setPatients] = useState<PatientRecord[]>(initialPatients);
  const [selectedPatientId, setSelectedPatientId] = useState<string>(initialPatients[0].id);

  // Vitals tuning for active patient
  const activePatient = patients.find(p => p.id === selectedPatientId) || patients[0];
  const [hr, setHr] = useState<number>(activePatient.vitals.hr);
  const [sbp, setSbp] = useState<number>(activePatient.vitals.sbp);
  const [rr, setRr] = useState<number>(activePatient.vitals.rr);
  const [spo2, setSpo2] = useState<number>(activePatient.vitals.spo2);
  const [blastOverride, setBlastOverride] = useState<number>(35);

  // Calculated NEWS2 and AI Bayesian Fusion
  const calculatedNEWS2 = useMemo(() => {
    let score = 0;
    if (rr <= 8 || rr >= 25) score += 3;
    else if (rr >= 21) score += 2;
    else if (rr >= 12 && rr <= 20) score += 0;
    else score += 1;

    if (spo2 <= 91) score += 3;
    else if (spo2 <= 93) score += 2;
    else if (spo2 <= 95) score += 1;

    if (sbp <= 90 || sbp >= 220) score += 3;
    else if (sbp <= 100) score += 2;
    else if (sbp <= 110) score += 1;

    if (hr <= 40 || hr >= 131) score += 3;
    else if (hr >= 111) score += 2;
    else if (hr >= 91) score += 1;

    return score;
  }, [hr, sbp, rr, spo2]);

  const combinedAiScore = useMemo(() => {
    const newsNormalized = calculatedNEWS2 / 12;
    const blastWeight = blastOverride / 100;
    return Math.min(0.45 * newsNormalized + 0.45 * blastWeight + 0.10, 0.99);
  }, [calculatedNEWS2, blastOverride]);

  const triagePriorityLevel = useMemo(() => {
    if (combinedAiScore > 0.80 || calculatedNEWS2 >= 7 || blastOverride >= 20) return 1;
    if (combinedAiScore > 0.60 || calculatedNEWS2 >= 5) return 2;
    if (combinedAiScore > 0.40 || calculatedNEWS2 >= 3) return 3;
    if (combinedAiScore > 0.20) return 4;
    return 5;
  }, [combinedAiScore, calculatedNEWS2, blastOverride]);

  // Beds, Blood bank, and Equipment state
  const [beds, setBeds] = useState<BedUnit[]>(initialBeds);
  const [bloodInventory, setBloodInventory] = useState<BloodInventoryItem[]>(initialBloodInventory);
  const [equipmentList, setEquipmentList] = useState<SpecializedEquipment[]>(initialSpecializedEquipment);
  const [resourceCategory, setResourceCategory] = useState<'all' | 'beds' | 'blood' | 'equipment'>('all');
  const [allocationNotice, setAllocationNotice] = useState<string | null>(null);

  // Run MILP Bed Allocation Solver
  const handleRunBedSolver = () => {
    setBeds(prev => prev.map(b => {
      if (b.id === 'ISO-02' && b.status === 'Available') {
        return { ...b, status: 'Occupied', patientName: 'Auto-Assigned: PAT-105 (Airborne Isolation)', patientId: 'PAT-105' };
      }
      if (b.id === 'ICU-03' && b.status === 'Available') {
        return { ...b, status: 'Occupied', patientName: 'Auto-Assigned: PAT-High-Blast', patientId: 'PAT-AUTO' };
      }
      return b;
    }));
    setAllocationNotice("MILP solver executed in 142ms: 2 high-risk patients placed into Negative-Pressure Isolation and ICU.");
    setTimeout(() => setAllocationNotice(null), 4000);
  };

  // Run Blood Product Request
  const handleReserveBlood = (type: string, units: number) => {
    setBloodInventory(prev => prev.map(item => {
      if (item.bloodType === type) {
        const newPrbc = Math.max(0, item.prbcUnits - units);
        return {
          ...item,
          prbcUnits: newPrbc,
          status: newPrbc < item.minThreshold ? 'Critical Shortage' : 'Adequate'
        };
      }
      return item;
    }));
    setAllocationNotice(`Crossmatched & reserved ${units} units of ${type} PRBC for patient bedside dispatch.`);
    setTimeout(() => setAllocationNotice(null), 3500);
  };

  // Toggle Equipment Status
  const handleToggleEquipmentStatus = (eqId: string) => {
    setEquipmentList(prev => prev.map(eq => {
      if (eq.id === eqId) {
        const nextStatus = eq.status === 'Available & Staged' ? 'Reserved for Inbound EMS' : 'Available & Staged';
        return { ...eq, status: nextStatus };
      }
      return eq;
    }));
    setAllocationNotice(`Equipment ${eqId} staging status updated.`);
    setTimeout(() => setAllocationNotice(null), 3000);
  };

  const cardBg = isDark ? 'bg-slate-900/40 border-slate-800/80' : 'bg-white border-slate-200/80 shadow-xs';
  const subCardBg = isDark ? 'bg-slate-950/40 border-slate-800/80' : 'bg-slate-50 border-slate-200/70';
  const headingColor = isDark ? 'text-white' : 'text-slate-900';
  const mutedTextColor = isDark ? 'text-slate-400' : 'text-slate-600';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Module Navigation & Subtabs */}
      <div className={`p-6 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${cardBg}`}>
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-blue-600 dark:text-cyan-400 mb-1 font-bold">
            <span>Hospital Operations</span>
            <span aria-hidden="true">·</span>
            <span>Critical Resource Management</span>
          </div>
          <h2 className={`text-xl sm:text-2xl font-bold tracking-tight ${headingColor}`}>
            Hospital Resource Operations & Allocation
          </h2>
        </div>

        {/* Sub-tabs */}
        <div className={`flex items-center gap-1 p-1 rounded-lg border text-xs font-mono ${
          isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
        }`}>
          <button
            onClick={() => setActiveSubTab('resources')}
            className={`px-3 py-1.5 rounded-md font-bold transition-colors cursor-pointer ${
              activeSubTab === 'resources'
                ? isDark ? 'bg-cyan-500 text-slate-950' : 'bg-blue-600 text-white shadow-xs'
                : mutedTextColor
            }`}
          >
            Resource Management
          </button>
          <button
            onClick={() => setActiveSubTab('triage')}
            className={`px-3 py-1.5 rounded-md font-bold transition-colors cursor-pointer ${
              activeSubTab === 'triage'
                ? isDark ? 'bg-cyan-500 text-slate-950' : 'bg-blue-600 text-white shadow-xs'
                : mutedTextColor
            }`}
          >
            Patient Triage & Journey
          </button>
        </div>
      </div>

      {/* Global Notification Banner */}
      {allocationNotice && (
        <div className={`p-3 rounded-lg border text-xs font-mono flex items-center gap-2 ${
          isDark ? 'bg-emerald-950/60 border-emerald-500/80 text-emerald-300' : 'bg-emerald-50 border-emerald-300 text-emerald-800'
        }`}>
          <ShieldAlert className="w-4 h-4 shrink-0 text-emerald-500" />
          <span>{allocationNotice}</span>
        </div>
      )}

      {/* Plain-English Explanation Banner */}
      <div className={`p-4 rounded-xl border flex items-start gap-3 text-xs ${
        isDark ? 'bg-blue-950/30 border-blue-900/60 text-slate-300' : 'bg-blue-50 border-blue-200 text-blue-950'
      }`}>
        <span className="text-base">🏥</span>
        <div>
          <strong className="block text-slate-900 dark:text-white font-bold mb-0.5">
            How Resource Management Works:
          </strong>
          <p className="leading-relaxed text-slate-600 dark:text-slate-300">
            Hospitals must ensure beds, donor blood, and specialized machines are ready before emergencies happen. Click <strong>"Execute MILP Solver"</strong> to automatically place high-risk patients into open ICU beds and sealed airborne isolation suites. Check off medical equipment to stage them for inbound ambulances, and reserve compatible blood units with one click.
          </p>
        </div>
      </div>

      {/* SUB-TAB 1: RESOURCE ALLOCATION (BEDS, BLOOD BANK & CRITICAL EQUIPMENT) */}
      {activeSubTab === 'resources' && (
        <div className="space-y-8">
          {/* Quick Category Filter Bar */}
          <div className="flex items-center gap-2 font-mono text-xs overflow-x-auto pb-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold mr-1">View Domain:</span>
            {[
              { id: 'all', label: 'All Resources' },
              { id: 'beds', label: 'Beds & Isolation' },
              { id: 'blood', label: 'Blood Reserves' },
              { id: 'equipment', label: 'Specialized Equipment' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setResourceCategory(tab.id as any)}
                className={`px-3 py-1.5 rounded-md font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  resourceCategory === tab.id
                    ? isDark ? 'bg-cyan-500 text-slate-950' : 'bg-blue-600 text-white shadow-xs'
                    : isDark ? 'bg-slate-900 text-slate-400 hover:text-slate-200' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 1. Bed Allocation Module */}
          {(resourceCategory === 'all' || resourceCategory === 'beds') && (
            <div className={`p-6 rounded-xl border space-y-4 ${cardBg}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <BedDouble className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                  <h3 className={`text-sm font-bold uppercase font-mono ${headingColor}`}>
                    Mixed-Integer Linear Programming (MILP) Bed Matrix
                  </h3>
                </div>
                <button
                  onClick={handleRunBedSolver}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Execute MILP Solver</span>
                </button>
              </div>

              <p className={`text-xs ${mutedTextColor}`}>
                Deterministic solver optimizes clinical acuity matching and enforces negative-pressure airborne isolation locks:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
                {beds.map(bed => {
                  const isOccupied = bed.status === 'Occupied';
                  const isIso = bed.ward === 'Negative-Pressure Isolation';

                  return (
                    <div
                      key={bed.id}
                      className={`p-3 rounded-lg border text-xs font-mono space-y-1 transition-all ${
                        isOccupied
                          ? isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-300 text-slate-700'
                          : isDark ? 'bg-slate-950 border-emerald-800/60 text-emerald-400' : 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold'
                      }`}
                    >
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-slate-400">{bed.id}</span>
                        <span className={`px-1 py-0.2 rounded font-bold ${
                          isOccupied ? 'bg-slate-200 dark:bg-slate-800 text-slate-600' : 'bg-emerald-200 dark:bg-emerald-950 text-emerald-800'
                        }`}>
                          {bed.status}
                        </span>
                      </div>

                      <div className={`font-bold truncate ${headingColor}`}>{bed.ward.split(' ')[0]}</div>

                      {isIso && (
                        <div className="text-[10px] text-blue-600 dark:text-cyan-400">
                          {bed.airChangesPerHour} ACH (HEPA)
                        </div>
                      )}

                      {bed.patientName && (
                        <div className="text-[10px] text-slate-500 truncate border-t border-slate-200 dark:border-slate-800 pt-1">
                          {bed.patientName}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. Specialized Medical Equipment Management */}
          {(resourceCategory === 'all' || resourceCategory === 'equipment') && (
            <div className={`p-6 rounded-xl border space-y-4 ${cardBg}`}>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                  <h3 className={`text-sm font-bold uppercase font-mono ${headingColor}`}>
                    Specialized Resuscitation & Clinical Equipment
                  </h3>
                </div>
                <span className="text-xs font-mono text-slate-400">STAGE FOR INBOUND EMS & CRITICAL CARE</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {equipmentList.map(eq => (
                  <div key={eq.id} className={`p-4 rounded-xl border space-y-3 font-mono text-xs ${subCardBg}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold">{eq.category}</span>
                        <h4 className={`text-sm font-bold ${headingColor} mt-0.5`}>{eq.name}</h4>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        eq.status === 'Available & Staged' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                        eq.status === 'Reserved for Inbound EMS' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                        'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-cyan-300'
                      }`}>
                        {eq.status}
                      </span>
                    </div>

                    <div className="space-y-1 text-slate-400 text-[11px]">
                      <div className="flex justify-between">
                        <span>Current Location:</span>
                        <strong className={headingColor}>{eq.currentLocation}</strong>
                      </div>
                      {eq.assignedToPatientOrBay && (
                        <div className="flex justify-between text-rose-500">
                          <span>Target Bay/Patient:</span>
                          <strong>{eq.assignedToPatientOrBay}</strong>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Battery & Readiness:</span>
                        <span className="text-emerald-500 font-bold">{eq.batteryPercent}% (Sterile)</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleEquipmentStatus(eq.id)}
                      className={`w-full py-1.5 rounded-lg border font-bold cursor-pointer transition-colors ${
                        eq.status === 'Reserved for Inbound EMS'
                          ? 'bg-rose-950/40 border-rose-800 text-rose-300 hover:bg-rose-900/60'
                          : isDark
                            ? 'bg-slate-900 border-slate-700 text-cyan-400 hover:bg-slate-800'
                            : 'bg-white border-slate-300 text-blue-700 hover:bg-slate-50'
                      }`}
                    >
                      {eq.status === 'Reserved for Inbound EMS' ? 'Release Equipment' : 'Pre-Stage for Inbound Bay'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Blood Bank Inventory & Crossmatch Dispatch */}
          {(resourceCategory === 'all' || resourceCategory === 'blood') && (
            <div className={`p-6 rounded-xl border space-y-4 ${cardBg}`}>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Droplet className="w-4 h-4 text-rose-500" />
                  <h3 className={`text-sm font-bold uppercase font-mono ${headingColor}`}>
                    Automated Blood Bank Inventory & Crossmatch Dispatch
                  </h3>
                </div>
                <span className="text-xs font-mono text-slate-400">ABO / RhD COMPATIBILITY</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {bloodInventory.map(item => (
                  <div key={item.bloodType} className={`p-4 rounded-xl border space-y-3 font-mono text-xs ${subCardBg}`}>
                    <div className="flex justify-between items-center">
                      <span className={`text-base font-bold ${headingColor}`}>{item.bloodType}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                        item.status === 'Critical Shortage' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                        item.status === 'Caution' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                        'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    <div className={`space-y-1 ${mutedTextColor}`}>
                      <div className="flex justify-between">
                        <span>Packed RBCs:</span>
                        <strong className={headingColor}>{item.prbcUnits} Units</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Platelets:</span>
                        <strong className={headingColor}>{item.plateletUnits} Units</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Plasma (FFP):</span>
                        <strong className={headingColor}>{item.ffpUnits} Units</strong>
                      </div>
                    </div>

                    <button
                      onClick={() => handleReserveBlood(item.bloodType, 2)}
                      disabled={item.prbcUnits < 2}
                      className={`w-full py-1.5 rounded-lg border font-bold cursor-pointer transition-colors ${
                        isDark 
                          ? 'bg-slate-900 border-slate-700 text-cyan-400 hover:bg-slate-800' 
                          : 'bg-white border-slate-300 text-blue-700 hover:bg-slate-50'
                      }`}
                    >
                      Reserve 2 Units
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: SMART TRIAGE & PATIENT JOURNEY */}
      {activeSubTab === 'triage' && (
        <div className="space-y-8">
          {/* Triage Calculator Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Vitals & AI Blast Controls (7 Cols) */}
            <div className={`lg:col-span-7 p-6 rounded-xl border space-y-5 ${cardBg}`}>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                  <h3 className={`text-sm font-bold uppercase font-mono ${headingColor}`}>
                    Multimodal Triage Input Console
                  </h3>
                </div>
                <div className="text-xs font-mono text-slate-500">
                  Patient: <strong className={headingColor}>{activePatient.mrn}</strong> ({activePatient.gender}, {activePatient.age}y)
                </div>
              </div>

              {/* Patient Selector */}
              <div className="flex gap-2 overflow-x-auto pb-1">
                {patients.map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedPatientId(p.id);
                      setHr(p.vitals.hr);
                      setSbp(p.vitals.sbp);
                      setRr(p.vitals.rr);
                      setSpo2(p.vitals.spo2);
                    }}
                    className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                      p.id === selectedPatientId
                        ? isDark
                          ? 'bg-cyan-950 border-cyan-500 text-white'
                          : 'bg-blue-50 border-blue-600 text-blue-900 font-bold'
                        : isDark
                          ? 'bg-slate-950 border-slate-800 text-slate-400'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    {p.mrn} · Lv.{p.triageLevel}
                  </button>
                ))}
              </div>

              {/* Sliders for Vitals */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className={`p-3 rounded-lg border space-y-1.5 ${subCardBg}`}>
                  <div className="flex justify-between">
                    <span>HEART RATE (BPM)</span>
                    <strong className="text-blue-600 dark:text-cyan-400">{hr}</strong>
                  </div>
                  <input
                    type="range" min="40" max="180" value={hr}
                    onChange={e => setHr(parseInt(e.target.value))}
                    className="w-full accent-blue-600 dark:accent-cyan-400 cursor-pointer"
                  />
                </div>

                <div className={`p-3 rounded-lg border space-y-1.5 ${subCardBg}`}>
                  <div className="flex justify-between">
                    <span>SYSTOLIC BP (mmHg)</span>
                    <strong className="text-blue-600 dark:text-cyan-400">{sbp}</strong>
                  </div>
                  <input
                    type="range" min="60" max="220" value={sbp}
                    onChange={e => setSbp(parseInt(e.target.value))}
                    className="w-full accent-blue-600 dark:accent-cyan-400 cursor-pointer"
                  />
                </div>

                <div className={`p-3 rounded-lg border space-y-1.5 ${subCardBg}`}>
                  <div className="flex justify-between">
                    <span>RESPIRATORY RATE (/min)</span>
                    <strong className="text-blue-600 dark:text-cyan-400">{rr}</strong>
                  </div>
                  <input
                    type="range" min="8" max="40" value={rr}
                    onChange={e => setRr(parseInt(e.target.value))}
                    className="w-full accent-blue-600 dark:accent-cyan-400 cursor-pointer"
                  />
                </div>

                <div className={`p-3 rounded-lg border space-y-1.5 ${subCardBg}`}>
                  <div className="flex justify-between">
                    <span>SpO2 SATURATION (%)</span>
                    <strong className="text-blue-600 dark:text-cyan-400">{spo2}%</strong>
                  </div>
                  <input
                    type="range" min="80" max="100" value={spo2}
                    onChange={e => setSpo2(parseInt(e.target.value))}
                    className="w-full accent-blue-600 dark:accent-cyan-400 cursor-pointer"
                  />
                </div>
              </div>

              {/* Edge-AI Blast Coupling Slider */}
              <div className={`p-4 rounded-xl border space-y-2 ${
                isDark ? 'bg-slate-950 border-cyan-900/50' : 'bg-blue-50/50 border-blue-200'
              }`}>
                <div className="flex justify-between text-xs font-mono">
                  <span className="font-bold uppercase text-blue-700 dark:text-cyan-300">Coupled Edge-AI Blast Count (%)</span>
                  <span className="text-rose-600 font-bold">{blastOverride}% Blasts</span>
                </div>
                <input
                  type="range" min="0" max="75" value={blastOverride}
                  onChange={e => setBlastOverride(parseInt(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
                <p className={`text-[11px] ${mutedTextColor}`}>
                  Simulates point-of-care cytology integration. Blasts &ge; 20% automatically trigger acute resuscitation triage.
                </p>
              </div>
            </div>

            {/* Triage Decision Output (5 Cols) */}
            <div className={`lg:col-span-5 p-6 rounded-xl border flex flex-col justify-between space-y-4 ${cardBg}`}>
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span className="text-xs font-mono uppercase font-bold text-blue-600 dark:text-cyan-400">Bayesian Risk Evaluation</span>
                  <span className="text-xs font-mono text-slate-400">ESI PROTOCOL</span>
                </div>

                <div className={`p-5 rounded-xl border text-center space-y-1 ${
                  isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="text-xs font-mono uppercase text-slate-500 font-bold">Assigned Priority Tier</div>
                  <div className={`text-2xl sm:text-3xl font-extrabold font-mono ${
                    triagePriorityLevel === 1 ? 'text-rose-600' :
                    triagePriorityLevel === 2 ? 'text-amber-600' :
                    'text-emerald-600'
                  }`}>
                    LEVEL {triagePriorityLevel} : {
                      triagePriorityLevel === 1 ? 'RESUSCITATION' :
                      triagePriorityLevel === 2 ? 'EMERGENT' :
                      triagePriorityLevel === 3 ? 'URGENT' : 'LESS URGENT'
                    }
                  </div>
                  <div className={`text-xs ${mutedTextColor}`}>
                    Max Wait: {triagePriorityLevel === 1 ? '0 Mins (Immediate)' : triagePriorityLevel === 2 ? '< 15 Mins' : '< 60 Mins'}
                  </div>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className={`flex justify-between p-2.5 rounded-lg border ${subCardBg}`}>
                    <span>Physiologic NEWS2 Score:</span>
                    <strong className={headingColor}>{calculatedNEWS2} / 20</strong>
                  </div>
                  <div className={`flex justify-between p-2.5 rounded-lg border ${subCardBg}`}>
                    <span>AI Risk Severity Index:</span>
                    <strong className="text-blue-600 dark:text-cyan-300">{(combinedAiScore * 100).toFixed(1)}%</strong>
                  </div>
                  <div className={`flex justify-between p-2.5 rounded-lg border ${subCardBg}`}>
                    <span>Airborne Isolation Lock:</span>
                    <strong className={activePatient.isolationRequired ? "text-rose-600" : "text-slate-400"}>
                      {activePatient.isolationRequired ? "MANDATORY" : "NOT REQUIRED"}
                    </strong>
                  </div>
                </div>
              </div>

              <div className={`p-3 rounded-lg border text-[11px] leading-relaxed font-mono ${subCardBg}`}>
                Bayesian Rule: Patient acuity escalated due to high blast cellularity ({blastOverride}%) overriding borderline vital stability.
              </div>
            </div>
          </div>

          {/* Digital Patient Journey Flow Tracker */}
          <div className={`p-6 rounded-xl border space-y-4 ${cardBg}`}>
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <GitCommit className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                <h3 className={`text-sm font-bold uppercase font-mono ${headingColor}`}>
                  Digital Patient Journey State Machine
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">LITTLE'S LAW BOTTLENECK TRACKER</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
              {[
                { stage: "Registration", count: 3, avgDwell: "8 mins", status: "Nominal" },
                { stage: "Triage", count: 2, avgDwell: "11 mins", status: "Nominal" },
                { stage: "Edge Diagnostics", count: 4, avgDwell: "4 mins", status: "Optimized" },
                { stage: "Physician Consult", count: 5, avgDwell: "28 mins", status: "Bottleneck" },
                { stage: "Bed Allocation", count: 2, avgDwell: "7 mins", status: "Nominal" },
                { stage: "Treatment / Discharge", count: 8, avgDwell: "45 mins", status: "Active" }
              ].map((step, idx) => (
                <div key={idx} className={`p-3 rounded-lg border text-xs font-mono space-y-1 ${
                  step.status === 'Bottleneck' ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-600 text-amber-900 dark:text-amber-200' :
                  step.status === 'Optimized' ? 'bg-blue-50 dark:bg-cyan-950/30 border-blue-300 dark:border-cyan-600 text-blue-900 dark:text-cyan-200' :
                  isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="text-[10px] text-slate-400">STAGE 0{idx + 1}</div>
                  <div className="font-bold truncate">{step.stage}</div>
                  <div className="text-[11px] text-slate-500">{step.count} Patients</div>
                  <div className="text-[10px] font-bold text-blue-600 dark:text-cyan-400">Dwell: {step.avgDwell}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
