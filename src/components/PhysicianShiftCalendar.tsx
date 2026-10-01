import React, { useState } from 'react';
import { Doctor } from '../types/aura';
import { Calendar, Clock, Phone, AlertCircle, CheckCircle2, ChevronRight, UserCheck, ShieldAlert, Sparkles, Filter, Radio, BellRing, ArrowRight } from 'lucide-react';

interface PhysicianShiftCalendarProps {
  doctors: Doctor[];
  isDark?: boolean;
}

interface ShiftRecord {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  department: string;
  shiftName: 'Day Shift' | 'Swing Shift' | 'Night Shift' | '24h On-Call';
  startHour: number; // 0-23
  endHour: number;   // 0-23
  status: 'Active On Duty' | 'In Procedure / OR' | 'On-Call Standby' | 'Upcoming Shift';
  responseRadius?: string;
  pager: string;
  contactExt: string;
}

export const PhysicianShiftCalendar: React.FC<PhysicianShiftCalendarProps> = ({ doctors, isDark = false }) => {
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [calendarView, setCalendarView] = useState<'timeline' | 'oncall' | 'weekly'>('timeline');
  const [pageAlertNotice, setPageAlertNotice] = useState<string | null>(null);

  // Shift schedule database
  const [shifts, setShifts] = useState<ShiftRecord[]>([
    {
      id: "SH-01",
      doctorId: "DOC-01",
      doctorName: "Dr. Elena Rostova",
      specialty: "Trauma Surgery",
      department: "Emergency & Trauma Resuscitation",
      shiftName: "Day Shift",
      startHour: 7,
      endHour: 19,
      status: "Active On Duty",
      responseRadius: "In-House (Trauma Bay 1)",
      pager: "PAGER #401",
      contactExt: "x4101"
    },
    {
      id: "SH-02",
      doctorId: "DOC-02",
      doctorName: "Dr. Marcus Vance",
      specialty: "Emergency Medicine",
      department: "Emergency & Trauma Resuscitation",
      shiftName: "Day Shift",
      startHour: 6,
      endHour: 18,
      status: "Active On Duty",
      responseRadius: "In-House (Resus Bay 2)",
      pager: "PAGER #402",
      contactExt: "x4102"
    },
    {
      id: "SH-03",
      doctorId: "DOC-03",
      doctorName: "Dr. Sarah Chen",
      specialty: "Interventional Cardiology",
      department: "Cardiac Cath Lab & Vascular",
      shiftName: "Day Shift",
      startHour: 8,
      endHour: 20,
      status: "Active On Duty",
      responseRadius: "In-House (Cath Lab)",
      pager: "PAGER #403",
      contactExt: "x4103"
    },
    {
      id: "SH-04",
      doctorId: "DOC-04",
      doctorName: "Dr. Tariq Al-Mansoor",
      specialty: "Pulmonology / Infection Control",
      department: "Pulmonary & Airborne Isolation",
      shiftName: "Day Shift",
      startHour: 7,
      endHour: 19,
      status: "Active On Duty",
      responseRadius: "In-House (Suite 201)",
      pager: "PAGER #404",
      contactExt: "x4104"
    },
    {
      id: "SH-05",
      doctorId: "DOC-05",
      doctorName: "Dr. Julianne Mercer",
      specialty: "Hematology / Oncology",
      department: "Hematology / Oncology Ward",
      shiftName: "Day Shift",
      startHour: 8,
      endHour: 18,
      status: "Active On Duty",
      responseRadius: "In-House (Tower 4)",
      pager: "PAGER #405",
      contactExt: "x4105"
    },
    {
      id: "SH-06",
      doctorId: "DOC-06",
      doctorName: "Dr. Kenneth Reynolds",
      specialty: "Neurosurgery",
      department: "Surgical Theaters & Neuro",
      shiftName: "24h On-Call",
      startHour: 0,
      endHour: 24,
      status: "On-Call Standby",
      responseRadius: "In-House Hospital Quarters",
      pager: "PAGER #406",
      contactExt: "x4106"
    },
    {
      id: "SH-07",
      doctorId: "DOC-07",
      doctorName: "Dr. Priya Nair",
      specialty: "Critical Care Medicine",
      department: "Medical Intensive Care Unit (MICU)",
      shiftName: "Day Shift",
      startHour: 7,
      endHour: 19,
      status: "Active On Duty",
      responseRadius: "In-House (MICU Floor 3)",
      pager: "PAGER #407",
      contactExt: "x4107"
    },
    {
      id: "SH-08",
      doctorId: "DOC-08",
      doctorName: "Dr. Arthur Pendelton",
      specialty: "Internal Medicine / Hospitalist",
      department: "General Medicine & Step-Down",
      shiftName: "Night Shift",
      startHour: 23,
      endHour: 7,
      status: "Active On Duty",
      responseRadius: "In-House Ward 2",
      pager: "PAGER #408",
      contactExt: "x4108"
    },
    {
      id: "SH-09",
      doctorId: "DOC-09",
      doctorName: "Dr. Maya Lin",
      specialty: "Trauma Surgery",
      department: "Emergency & Trauma Resuscitation",
      shiftName: "Swing Shift",
      startHour: 15,
      endHour: 23,
      status: "On-Call Standby",
      responseRadius: "Off-Site (12 mins ETA)",
      pager: "PAGER #409",
      contactExt: "x4109"
    },
    {
      id: "SH-10",
      doctorId: "DOC-10",
      doctorName: "Dr. Gregory Thorne",
      specialty: "Anesthesiology & Airway",
      department: "Surgical Theaters & Neuro",
      shiftName: "24h On-Call",
      startHour: 0,
      endHour: 24,
      status: "On-Call Standby",
      responseRadius: "Hospital Quarters (5 mins)",
      pager: "PAGER #410",
      contactExt: "x4110"
    }
  ]);

  // Current simulation time: 03:38 (Night shift / Early morning block)
  const currentHourDecimal = 3.65; // ~03:38

  const handlePageDoctor = (shift: ShiftRecord) => {
    setPageAlertNotice(`Stat Code Callback dispatched to ${shift.doctorName} via ${shift.pager}. Telemetry confirmation: Signal received, responding.`);
    setTimeout(() => setPageAlertNotice(null), 4000);
  };

  const departments = [
    'all',
    'Emergency & Trauma Resuscitation',
    'Medical Intensive Care Unit (MICU)',
    'Cardiac Cath Lab & Vascular',
    'Pulmonary & Airborne Isolation',
    'Hematology / Oncology Ward',
    'Surgical Theaters & Neuro'
  ];

  const filteredShifts = shifts.filter(s => {
    if (selectedDept === 'all') return true;
    return s.department === selectedDept;
  });

  const onCallSpecialists = shifts.filter(s => s.shiftName === '24h On-Call' || s.status === 'On-Call Standby');

  const cardBg = isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-xs';
  const subCardBg = isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200';
  const headingColor = isDark ? 'text-white' : 'text-slate-900';
  const mutedTextColor = isDark ? 'text-slate-400' : 'text-slate-600';

  return (
    <div className={`p-6 rounded-xl border space-y-6 ${cardBg}`}>
      {/* Calendar Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-blue-600 dark:text-cyan-400 mb-1 font-bold">
            <Calendar className="w-4 h-4 text-blue-500 dark:text-cyan-400" />
            <span>Staffing & Rotation Management</span>
            <span aria-hidden="true">·</span>
            <span>Physician Shift Calendar</span>
          </div>
          <h3 className={`text-lg sm:text-xl font-bold tracking-tight ${headingColor} flex items-center gap-2.5`}>
            <span>Clinical Department Shift & On-Call Rotation</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-100 dark:bg-cyan-950 text-blue-800 dark:text-cyan-300 border border-blue-300 dark:border-cyan-800">
              ● ROTATION BLOCK: NIGHT / DAY HANDOVER
            </span>
          </h3>
        </div>

        {/* Calendar View Switcher */}
        <div className={`flex items-center gap-1 p-1 rounded-lg border text-xs font-mono ${
          isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
        }`}>
          <button
            onClick={() => setCalendarView('timeline')}
            className={`px-3 py-1.5 rounded-md font-bold transition-colors cursor-pointer ${
              calendarView === 'timeline'
                ? isDark ? 'bg-cyan-500 text-slate-950' : 'bg-blue-600 text-white shadow-xs'
                : mutedTextColor
            }`}
          >
            24h Timeline
          </button>
          <button
            onClick={() => setCalendarView('oncall')}
            className={`px-3 py-1.5 rounded-md font-bold transition-colors cursor-pointer ${
              calendarView === 'oncall'
                ? isDark ? 'bg-cyan-500 text-slate-950' : 'bg-blue-600 text-white shadow-xs'
                : mutedTextColor
            }`}
          >
            On-Call Emergency Board ({onCallSpecialists.length})
          </button>
          <button
            onClick={() => setCalendarView('weekly')}
            className={`px-3 py-1.5 rounded-md font-bold transition-colors cursor-pointer ${
              calendarView === 'weekly'
                ? isDark ? 'bg-cyan-500 text-slate-950' : 'bg-blue-600 text-white shadow-xs'
                : mutedTextColor
            }`}
          >
            Weekly Coverage
          </button>
        </div>
      </div>

      {/* Global Stat Page Notice */}
      {pageAlertNotice && (
        <div className={`p-3.5 rounded-lg border text-xs font-mono flex items-center gap-2 ${
          isDark ? 'bg-emerald-950/60 border-emerald-500/80 text-emerald-300' : 'bg-emerald-50 border-emerald-300 text-emerald-800'
        }`}>
          <BellRing className="w-4 h-4 text-emerald-400 shrink-0 animate-bounce" />
          <span>{pageAlertNotice}</span>
        </div>
      )}

      {/* Department Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
        <span className="text-slate-400 text-[10px] uppercase font-bold mr-1 shrink-0 flex items-center gap-1">
          <Filter className="w-3 h-3" />
          Department:
        </span>
        {departments.map(dept => (
          <button
            key={dept}
            onClick={() => setSelectedDept(dept)}
            className={`px-2.5 py-1 rounded-md whitespace-nowrap cursor-pointer transition-colors ${
              selectedDept === dept
                ? isDark ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-blue-600 text-white font-bold'
                : isDark ? 'bg-slate-900 text-slate-400 hover:text-slate-200' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            {dept === 'all' ? 'All Departments' : dept.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* VIEW 1: 24-HOUR INTERACTIVE VISUAL TIMELINE */}
      {calendarView === 'timeline' && (
        <div className="space-y-4 font-mono">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400" />
              <span>Current Operating Time: <strong>03:38 UTC-7</strong> (Vertical Red Indicator)</span>
            </span>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block" /> Active Duty
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-purple-500 inline-block" /> In Surgery/OR
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-amber-500 inline-block" /> On-Call Standby
              </span>
            </div>
          </div>

          {/* Time axis header */}
          <div className="relative border-b border-slate-200 dark:border-slate-800 pb-2 text-[10px] text-slate-400 grid grid-cols-8 text-center">
            <span>00:00</span>
            <span>03:00</span>
            <span>06:00</span>
            <span>09:00</span>
            <span>12:00</span>
            <span>15:00</span>
            <span>18:00</span>
            <span>21:00</span>
          </div>

          {/* Timeline Bars for Each Physician */}
          <div className="space-y-3 relative">
            {/* Real-time Indicator Line (at ~3.65 hours out of 24 = 15.2%) */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-rose-500 z-10 pointer-events-none shadow-[0_0_8px_#f43f5e]"
              style={{ left: `${(currentHourDecimal / 24) * 100}%` }}
            >
              <span className="absolute -top-4 -translate-x-1/2 bg-rose-600 text-white text-[9px] px-1 py-0.2 rounded font-bold">
                03:38
              </span>
            </div>

            {filteredShifts.map(shift => {
              const startPercent = (shift.startHour / 24) * 100;
              let widthPercent = ((shift.endHour - shift.startHour) / 24) * 100;
              if (widthPercent < 0) widthPercent = ((24 - shift.startHour + shift.endHour) / 24) * 100;
              if (shift.startHour === 0 && shift.endHour === 24) widthPercent = 100;

              return (
                <div key={shift.id} className={`p-3 rounded-lg border space-y-1.5 ${subCardBg}`}>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <strong className={headingColor}>{shift.doctorName}</strong>
                      <span className="text-slate-400 text-[11px]">({shift.specialty})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400">{shift.shiftName} ({shift.startHour.toString().padStart(2, '0')}:00 - {shift.endHour.toString().padStart(2, '0')}:00)</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                        shift.status === 'Active On Duty' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                        shift.status === 'In Procedure / OR' ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300' :
                        'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {shift.status}
                      </span>
                    </div>
                  </div>

                  {/* Visual Bar Container */}
                  <div className="w-full bg-slate-200 dark:bg-slate-900 h-3 rounded-md overflow-hidden relative">
                    <div
                      className={`h-full rounded-md transition-all ${
                        shift.status === 'Active On Duty' ? 'bg-emerald-500' :
                        shift.status === 'In Procedure / OR' ? 'bg-purple-500' :
                        'bg-amber-500'
                      }`}
                      style={{
                        marginLeft: `${startPercent}%`,
                        width: `${Math.min(widthPercent, 100 - startPercent)}%`
                      }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-400 pt-0.5">
                    <span>Location: <strong className="text-slate-300">{shift.responseRadius}</strong></span>
                    <span>{shift.pager} · {shift.contactExt}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: ON-CALL EMERGENCY BOARD & STAT DISPATCH */}
      {calendarView === 'oncall' && (
        <div className="space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <div>
              <h4 className={`text-sm font-bold ${headingColor}`}>Emergency Trauma & Specialist On-Call Roster</h4>
              <p className="text-[11px] text-slate-400">Guaranteed sub-15 minute response time for Class 1 acute surges</p>
            </div>
            <span className="text-xs text-rose-500 font-bold">24H EMERGENCY ACTIVATION READY</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {onCallSpecialists.map(specialist => (
              <div key={specialist.id} className={`p-4 rounded-xl border space-y-3 ${subCardBg}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-blue-600 dark:text-cyan-400 font-bold uppercase block">
                      {specialist.specialty}
                    </span>
                    <h5 className={`text-sm font-bold ${headingColor} mt-0.5`}>
                      {specialist.doctorName}
                    </h5>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    specialist.status === 'In Procedure / OR' ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300' :
                    'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {specialist.status}
                  </span>
                </div>

                <div className="space-y-1 text-slate-400 text-[11px]">
                  <div className="flex justify-between">
                    <span>Assigned Department:</span>
                    <strong className={headingColor}>{specialist.department}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Response Proximity:</span>
                    <strong className="text-emerald-500">{specialist.responseRadius}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Primary Pager / Ext:</span>
                    <strong className={headingColor}>{specialist.pager} ({specialist.contactExt})</strong>
                  </div>
                </div>

                <button
                  onClick={() => handlePageDoctor(specialist)}
                  className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                >
                  <BellRing className="w-3.5 h-3.5" />
                  <span>Transmit Stat Emergency Callback Page</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: WEEKLY ROTATION SCHEDULE */}
      {calendarView === 'weekly' && (
        <div className="space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <div>
              <h4 className={`text-sm font-bold ${headingColor}`}>7-Day Departmental Rotation Matrix</h4>
              <p className="text-[11px] text-slate-400">Current Week: Oct 1 - Oct 7, 2026</p>
            </div>
            <span className="text-xs text-blue-600 dark:text-cyan-400 font-bold">100% SHIFT COMPLIANCE</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] text-slate-400">
                  <th className="py-2 pr-3">Attending Physician</th>
                  <th className="py-2 px-2">Mon (Today)</th>
                  <th className="py-2 px-2">Tue</th>
                  <th className="py-2 px-2">Wed</th>
                  <th className="py-2 px-2">Thu</th>
                  <th className="py-2 px-2">Fri</th>
                  <th className="py-2 px-2">Sat</th>
                  <th className="py-2 px-2">Sun</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                {filteredShifts.slice(0, 7).map(s => (
                  <tr key={s.id} className="hover:bg-slate-800/30">
                    <td className={`py-2.5 pr-3 font-bold ${headingColor}`}>
                      {s.doctorName}
                      <span className="block text-[10px] text-slate-400 font-normal">{s.specialty.split(' ')[0]}</span>
                    </td>
                    <td className="py-2.5 px-2">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-bold border border-emerald-800">
                        {s.shiftName.split(' ')[0]}
                      </span>
                    </td>
                    <td className="py-2.5 px-2">
                      <span className="px-1.5 py-0.5 rounded bg-blue-950 text-cyan-400 text-[10px] font-bold">
                        Day
                      </span>
                    </td>
                    <td className="py-2.5 px-2">
                      <span className="px-1.5 py-0.5 rounded bg-blue-950 text-cyan-400 text-[10px] font-bold">
                        Day
                      </span>
                    </td>
                    <td className="py-2.5 px-2">
                      <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-400 text-[10px] font-bold">
                        On-Call
                      </span>
                    </td>
                    <td className="py-2.5 px-2">
                      <span className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-500 text-[10px]">
                        Off
                      </span>
                    </td>
                    <td className="py-2.5 px-2">
                      <span className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-500 text-[10px]">
                        Off
                      </span>
                    </td>
                    <td className="py-2.5 px-2">
                      <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-400 text-[10px] font-bold">
                        On-Call
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
