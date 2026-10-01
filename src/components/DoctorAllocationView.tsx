import React, { useState, useEffect } from 'react';
import { initialDoctors } from '../data/mockDoctorData';
import { initialPatients } from '../data/mockDiagnosticData';
import { loadAmbulanceDispatches, saveAmbulanceDispatches } from '../utils/ambulanceStorage';
import { Doctor, PatientRecord, AmbulanceDispatch } from '../types/aura';
import { PhysicianShiftCalendar } from './PhysicianShiftCalendar';
import { Stethoscope, UserCheck, Users, MapPin, CheckCircle2, Sparkles, Truck, ArrowRight, Calendar, UserMinus, Plus } from 'lucide-react';

interface DoctorAllocationViewProps {
  isDark?: boolean;
}

export const DoctorAllocationView: React.FC<DoctorAllocationViewProps> = ({ isDark = false }) => {
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [patients, setPatients] = useState<PatientRecord[]>(initialPatients);
  const [ambulances, setAmbulances] = useState<AmbulanceDispatch[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [activeView, setActiveView] = useState<'allocation' | 'calendar'>('allocation');
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => {
      setAmbulances(loadAmbulanceDispatches());
    };
    sync();
    window.addEventListener('aura_ambulance_sync', sync);
    return () => window.removeEventListener('aura_ambulance_sync', sync);
  }, []);

  // Quick Stats
  const totalDocs = doctors.length;
  const availableDocs = doctors.filter(d => d.status === 'Available').length;
  const inProcedureDocs = doctors.filter(d => d.status === 'In Procedure / OR').length;
  const unassignedPatients = patients.filter(p => !p.assignedDoctorId);

  // Auto-Match Solver
  const handleAutoAssign = () => {
    let assignedCount = 0;
    const updatedDoctors = [...doctors];
    const updatedPatients = patients.map(patient => {
      if (patient.assignedDoctorId) return patient;

      let candidateDoc = updatedDoctors.find(d => {
        if (d.currentPatientIds.length >= d.maxPatientLoad) return false;
        if (d.status === 'In Procedure / OR') return false;

        if (patient.presentingComplaint.toLowerCase().includes('blast') || patient.presentingComplaint.toLowerCase().includes('leukemia')) {
          return d.specialty === 'Hematology / Oncology';
        }
        if (patient.isolationRequired || patient.presentingComplaint.toLowerCase().includes('malaria') || patient.presentingComplaint.toLowerCase().includes('respiratory')) {
          return d.specialty === 'Pulmonology / Infection Control' || d.specialty === 'Emergency Medicine';
        }
        if (patient.triageLevel === 1) {
          return d.specialty === 'Trauma Surgery' || d.specialty === 'Emergency Medicine' || d.specialty === 'Critical Care Medicine';
        }
        return true;
      });

      if (!candidateDoc) {
        candidateDoc = updatedDoctors.find(d => d.currentPatientIds.length < d.maxPatientLoad && d.status !== 'In Procedure / OR');
      }

      if (candidateDoc) {
        assignedCount++;
        candidateDoc.currentPatientIds.push(patient.id);
        if (candidateDoc.currentPatientIds.length >= candidateDoc.maxPatientLoad) {
          candidateDoc.status = 'Assigned / In Bay';
        }
        return {
          ...patient,
          assignedDoctorId: candidateDoc.id,
          assignedDoctorName: candidateDoc.name
        };
      }
      return patient;
    });

    setDoctors(updatedDoctors);
    setPatients(updatedPatients);
    setNotification(`Auto-matched ${assignedCount} patients to qualified specialists.`);
    setTimeout(() => setNotification(null), 3500);
  };

  // Manual Doctor-Patient Allocation
  const handleAssignDoctor = (patientId: string, doctorId: string) => {
    const doc = doctors.find(d => d.id === doctorId);
    if (!doc) return;

    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        return {
          ...p,
          assignedDoctorId: doc.id,
          assignedDoctorName: doc.name
        };
      }
      return p;
    }));

    setDoctors(prev => prev.map(d => {
      if (d.id === doctorId && !d.currentPatientIds.includes(patientId)) {
        const newIds = [...d.currentPatientIds, patientId];
        return {
          ...d,
          currentPatientIds: newIds,
          status: newIds.length >= d.maxPatientLoad ? 'Assigned / In Bay' : d.status
        };
      }
      return d;
    }));

    setNotification(`Patient ${patientId} assigned to ${doc.name}.`);
    setTimeout(() => setNotification(null), 3000);
  };

  // Unassign patient
  const handleUnassignPatient = (patientId: string, doctorId: string) => {
    setPatients(prev => prev.map(p => p.id === patientId ? { ...p, assignedDoctorId: undefined, assignedDoctorName: undefined } : p));
    setDoctors(prev => prev.map(d => {
      if (d.id === doctorId) {
        const newIds = d.currentPatientIds.filter(id => id !== patientId);
        return {
          ...d,
          currentPatientIds: newIds,
          status: newIds.length === 0 ? 'Available' : 'Assigned / In Bay'
        };
      }
      return d;
    }));
    setNotification(`Patient unassigned from doctor.`);
    setTimeout(() => setNotification(null), 2500);
  };

  // Assign doctor to inbound ambulance
  const handleAssignAmbulanceDoc = (ambulanceId: string, doctorId: string) => {
    const doc = doctors.find(d => d.id === doctorId);
    if (!doc) return;

    const updatedAmbulances = ambulances.map(a => {
      if (a.id === ambulanceId) {
        return {
          ...a,
          requiredResources: {
            ...a.requiredResources,
            assignedDoctorId: doc.id,
            assignedDoctorName: doc.name
          }
        };
      }
      return a;
    });

    setAmbulances(updatedAmbulances);
    saveAmbulanceDispatches(updatedAmbulances);

    setDoctors(prev => prev.map(d => {
      if (d.id === doctorId) {
        return { ...d, assignedInboundUnitId: ambulanceId };
      }
      if (d.assignedInboundUnitId === ambulanceId && d.id !== doctorId) {
        return { ...d, assignedInboundUnitId: undefined };
      }
      return d;
    }));

    setNotification(`${doc.name} assigned as receiving lead for inbound ${ambulanceId}.`);
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredDoctors = doctors.filter(d => {
    if (selectedSpecialty === 'all') return true;
    return d.specialty === selectedSpecialty;
  });

  const cardBg = isDark ? 'bg-slate-900/40 border-slate-800/80' : 'bg-white border-slate-200/80 shadow-xs';
  const subCardBg = isDark ? 'bg-slate-950/40 border-slate-800/80' : 'bg-slate-50 border-slate-200/70';
  const headingColor = isDark ? 'text-white' : 'text-slate-900';
  const mutedTextColor = isDark ? 'text-slate-400' : 'text-slate-600';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Clean Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-blue-600 dark:text-cyan-400 mb-1 font-semibold">
            <span>Provider Operations</span>
            <span aria-hidden="true">·</span>
            <span>Doctor Staffing & Shifts</span>
          </div>
          <h1 className={`text-2xl font-bold tracking-tight ${headingColor} flex items-center gap-3`}>
            <span>Physician Allocation & Roster</span>
            <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              ● {availableDocs} Available Now
            </span>
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View Switcher Tabs */}
          <div className={`flex items-center gap-1 p-1 rounded-xl border text-xs font-medium ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={() => setActiveView('allocation')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeView === 'allocation'
                  ? isDark ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-white text-blue-700 font-semibold shadow-xs'
                  : mutedTextColor
              }`}
            >
              Patient Allocation
            </button>
            <button
              onClick={() => setActiveView('calendar')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeView === 'calendar'
                  ? isDark ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-white text-blue-700 font-semibold shadow-xs'
                  : mutedTextColor
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Shift Calendar & On-Call</span>
            </button>
          </div>

          {activeView === 'allocation' && (
            <button
              onClick={handleAutoAssign}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer shadow-xs whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Auto-Match</span>
            </button>
          )}
        </div>
      </div>

      {/* Global Notification */}
      {notification && (
        <div className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 ${
          isDark ? 'bg-cyan-950/40 border-cyan-800/40 text-cyan-300' : 'bg-blue-50 border-blue-200 text-blue-900'
        }`}>
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* VIEW 1: PHYSICIAN SHIFT CALENDAR SUB-COMPONENT */}
      {activeView === 'calendar' ? (
        <PhysicianShiftCalendar doctors={doctors} isDark={isDark} />
      ) : (
        /* VIEW 2: PATIENT-TO-DOCTOR ALLOCATION CONSOLE */
        <div className="space-y-6">
          {/* Quick Metrics (4 Columns) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className={`p-4 rounded-2xl border space-y-1 ${cardBg}`}>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Doctors on Shift</span>
              <div className={`text-xl font-bold font-mono ${headingColor}`}>{totalDocs} On Duty</div>
              <span className="text-[11px] text-slate-500">Full hospital coverage</span>
            </div>

            <div className={`p-4 rounded-2xl border space-y-1 ${cardBg}`}>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Available Now</span>
              <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">{availableDocs} Ready</div>
              <span className="text-[11px] text-slate-500">Ready for incoming patients</span>
            </div>

            <div className={`p-4 rounded-2xl border space-y-1 ${cardBg}`}>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">In Surgery / OR</span>
              <div className="text-xl font-bold font-mono text-purple-600 dark:text-purple-400">{inProcedureDocs} Operating</div>
              <span className="text-[11px] text-slate-500">Active procedures</span>
            </div>

            <div className={`p-4 rounded-2xl border space-y-1 ${cardBg}`}>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Unassigned Patients</span>
              <div className={`text-xl font-bold font-mono ${unassignedPatients.length > 0 ? 'text-amber-500' : 'text-slate-400'}`}>
                {unassignedPatients.length} Pending
              </div>
              <span className="text-[11px] text-slate-500">
                {unassignedPatients.length === 0 ? "All allocated" : "Awaiting assignment"}
              </span>
            </div>
          </div>

          {/* Inbound Ambulance Receiving Doctor Pre-Assignment */}
          <div className={`p-5 rounded-2xl border space-y-3 ${cardBg}`}>
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 dark:text-rose-400">
                <Truck className="w-4 h-4" />
                <span>Pre-Assign Lead Doctors for Inbound Ambulances</span>
              </div>
              <span className="text-[11px] text-slate-400">Meeting Patients at Bay</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              {ambulances.slice(0, 3).map(amb => {
                const currentDoc = doctors.find(d => d.id === amb.requiredResources.assignedDoctorId) || doctors.find(d => d.assignedInboundUnitId === amb.id);

                return (
                  <div key={amb.id} className={`p-3.5 rounded-xl border space-y-2 ${subCardBg}`}>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-rose-600 dark:text-rose-400">{amb.callSign}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold">
                        ETA {amb.etaMins}m
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 truncate">
                      {amb.patientSummary.chiefComplaint}
                    </div>

                    <div className="pt-1 border-t border-slate-200 dark:border-slate-800/60">
                      <select
                        value={currentDoc?.id || ""}
                        onChange={e => handleAssignAmbulanceDoc(amb.id, e.target.value)}
                        className={`w-full p-1.5 text-xs rounded-lg border cursor-pointer font-medium ${
                          isDark ? 'bg-slate-900 border-slate-700 text-cyan-300' : 'bg-white border-slate-300 text-blue-900'
                        }`}
                      >
                        <option value="">Choose Assigned Doctor...</option>
                        {doctors.map(d => (
                          <option key={d.id} value={d.id}>
                            {d.name} ({d.specialty.split(' ')[0]})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main Doctor Roster Grid */}
          <div className="space-y-4">
            {/* Clean Specialty Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <span className="text-slate-400 text-[10px] uppercase font-bold mr-1">Specialty:</span>
              {['all', 'Trauma Surgery', 'Emergency Medicine', 'Critical Care Medicine', 'Interventional Cardiology', 'Hematology / Oncology', 'Pulmonology / Infection Control'].map(spec => (
                <button
                  key={spec}
                  onClick={() => setSelectedSpecialty(spec)}
                  className={`px-3 py-1 rounded-lg whitespace-nowrap cursor-pointer transition-colors ${
                    selectedSpecialty === spec
                      ? isDark ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-blue-600 text-white font-semibold'
                      : isDark ? 'bg-slate-900/60 text-slate-400 hover:text-slate-200' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {spec === 'all' ? 'All Specialties' : spec.split(' ')[0]}
                </button>
              ))}
            </div>

            {/* Doctor Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDoctors.map(doctor => {
                const assignedPatientsList = patients.filter(p => doctor.currentPatientIds.includes(p.id) || p.assignedDoctorId === doctor.id);
                const loadPercent = Math.round((assignedPatientsList.length / doctor.maxPatientLoad) * 100);

                return (
                  <div key={doctor.id} className={`p-5 rounded-2xl border space-y-4 ${cardBg}`}>
                    {/* Doctor Card Header */}
                    <div className="flex items-start justify-between gap-2 border-b border-slate-200 dark:border-slate-800/80 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-base font-bold ${headingColor}`}>
                            {doctor.name}
                          </span>
                          <span className="text-xs text-slate-400">{doctor.title}</span>
                        </div>
                        <div className={`text-xs ${isDark ? 'text-cyan-400' : 'text-blue-700'} font-medium mt-0.5`}>
                          {doctor.specialty}
                        </div>
                      </div>

                      {/* Status Badge */}
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                        doctor.status === 'Available' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                        doctor.status === 'Assigned / In Bay' ? 'bg-blue-500/10 text-blue-600 dark:text-cyan-400 border border-blue-500/20' :
                        'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                      }`}>
                        {doctor.status}
                      </span>
                    </div>

                    {/* Location & Caseload Progress */}
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400" />
                          <span>{doctor.activeLocation}</span>
                        </span>
                        <span className="font-mono text-slate-400">{doctor.pager}</span>
                      </div>

                      {/* Caseload Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-slate-500">
                          <span>Patient Caseload</span>
                          <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                            {assignedPatientsList.length} / {doctor.maxPatientLoad}
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              loadPercent >= 100 ? 'bg-rose-500' : 'bg-blue-600 dark:bg-cyan-500'
                            }`}
                            style={{ width: `${Math.min(loadPercent, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Assigned Patients List */}
                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                      <div className="text-[11px] text-slate-400 uppercase font-semibold">
                        Assigned Patients:
                      </div>

                      {assignedPatientsList.length === 0 ? (
                        <div className="text-xs text-slate-500 italic py-1">
                          No active patients assigned. Available for new intakes.
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          {assignedPatientsList.map(pat => (
                            <div key={pat.id} className={`p-2 rounded-xl border flex items-center justify-between text-xs ${subCardBg}`}>
                              <div>
                                <span className={`font-semibold ${headingColor}`}>{pat.mrn}</span>
                                <span className="text-slate-400 ml-1.5">({pat.gender}, {pat.age}y)</span>
                                <div className="text-[11px] text-slate-500 truncate max-w-[200px]">
                                  {pat.presentingComplaint}
                                </div>
                              </div>
                              <button
                                onClick={() => handleUnassignPatient(pat.id, doctor.id)}
                                className="px-2 py-1 text-[11px] text-slate-400 hover:text-rose-500 rounded transition-colors cursor-pointer"
                                title="Release patient"
                              >
                                Release
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Manual Add Patient Dropdown */}
                      {assignedPatientsList.length < doctor.maxPatientLoad && unassignedPatients.length > 0 && (
                        <select
                          onChange={e => {
                            if (e.target.value) handleAssignDoctor(e.target.value, doctor.id);
                          }}
                          defaultValue=""
                          className={`w-full p-2 text-xs rounded-xl border cursor-pointer ${
                            isDark ? 'bg-slate-950/60 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-800'
                          }`}
                        >
                          <option value="" disabled>+ Assign Waiting Patient...</option>
                          {unassignedPatients.map(p => (
                            <option key={p.id} value={p.id}>
                              {p.mrn} - Lv.{p.triageLevel} ({p.presentingComplaint.slice(0, 30)})
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
