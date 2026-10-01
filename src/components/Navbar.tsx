import React from 'react';
import { ActiveTab } from '../types/aura';
import { Copy, Printer, Check, Sun, Moon, FileText, Microscope, Activity, LayoutDashboard, BedDouble, Truck, Stethoscope } from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onCopyAll: () => void;
  onPrint: () => void;
  copied: boolean;
  isDark: boolean;
  toggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onCopyAll,
  onPrint,
  copied,
  isDark,
  toggleTheme
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'command_center', label: 'Command Center', icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
    { id: 'ambulances', label: 'EMS Ambulances', icon: <Truck className="w-3.5 h-3.5" /> },
    { id: 'resources', label: 'Resource Management', icon: <BedDouble className="w-3.5 h-3.5" /> },
    { id: 'doctors', label: 'Doctor Allocation', icon: <Stethoscope className="w-3.5 h-3.5" /> },
    { id: 'triage', label: 'Patient Triage', icon: <Activity className="w-3.5 h-3.5" /> },
    { id: 'specs', label: 'System Architecture', icon: <FileText className="w-3.5 h-3.5" /> }
  ];

  return (
    <header className={`sticky top-0 z-50 transition-colors border-b backdrop-blur-md ${
      isDark 
        ? 'bg-slate-950/95 border-slate-800 text-slate-100' 
        : 'bg-white/95 border-slate-200 text-slate-800 shadow-xs'
    }`}>
      {/* Primary Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element Brand Wordmark */}
        <button
          onClick={() => setActiveTab('command_center')}
          className={`text-lg font-bold tracking-tight cursor-pointer text-left shrink-0 ${
            isDark ? 'text-white hover:text-cyan-400' : 'text-slate-900 hover:text-blue-600'
          }`}
        >
          AuraHealth
        </button>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 font-mono text-xs">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                  isActive
                    ? isDark
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-xs'
                      : 'bg-blue-50 text-blue-700 border border-blue-200 font-semibold'
                    : isDark
                      ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={toggleTheme}
            title={isDark ? "Switch to Clinical Light Theme" : "Switch to Dark Telemetry Theme"}
            className={`p-2 rounded-md border transition-colors cursor-pointer ${
              isDark 
                ? 'bg-slate-900 border-slate-700 text-amber-300 hover:bg-slate-800' 
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={onCopyAll}
            title="Export full system architecture and technical specifications in Markdown"
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
              isDark
                ? 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span className="hidden sm:inline">{copied ? 'Copied Specs' : 'Export Specs'}</span>
            <span className="sm:hidden">{copied ? 'Copied' : 'Export'}</span>
          </button>

          <button
            onClick={onPrint}
            title="Print or export clinical operations dossier"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-md transition-colors cursor-pointer shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print Report</span>
            <span className="sm:hidden">Print</span>
          </button>
        </div>
      </div>

      {/* Responsive Secondary Navigation Strip */}
      <div className={`lg:hidden flex items-center gap-1.5 px-4 py-2 overflow-x-auto scrollbar-none border-t ${
        isDark ? 'border-slate-800 bg-slate-950/80' : 'border-slate-100 bg-slate-50'
      }`}>
        {navItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs whitespace-nowrap rounded-md font-mono transition-colors cursor-pointer ${
                isActive
                  ? isDark
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-blue-600 text-white font-bold'
                  : isDark
                    ? 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
                    : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
