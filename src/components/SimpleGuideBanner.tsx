import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Truck, BedDouble, Stethoscope, ArrowRight, X, Info } from 'lucide-react';
import { ActiveTab } from '../types/aura';

interface SimpleGuideBannerProps {
  onNavigateTab: (tab: ActiveTab) => void;
  isDark?: boolean;
}

export const SimpleGuideBanner: React.FC<SimpleGuideBannerProps> = ({ onNavigateTab, isDark = false }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="w-full">
      {/* Sleek Minimal Trigger Banner */}
      {!isOpen ? (
        <div className={`px-4 py-3 rounded-xl border flex items-center justify-between text-xs transition-colors ${
          isDark 
            ? 'bg-slate-900/40 border-slate-800/80 text-slate-300 hover:border-slate-700' 
            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 shadow-xs'
        }`}>
          <div className="flex items-center gap-2.5">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="font-medium">
              New to AuraHealth? Understand the 3-step hospital flow: Ambulances &rarr; Resources &rarr; Doctors.
            </span>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className={`px-3 py-1 rounded-lg font-medium text-xs cursor-pointer transition-colors ${
              isDark 
                ? 'bg-slate-800 text-cyan-300 hover:bg-slate-700' 
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            Show Quick Guide
          </button>
        </div>
      ) : (
        /* Expanded Clean Modal/Card */
        <div className={`p-5 rounded-2xl border space-y-4 transition-all ${
          isDark ? 'bg-slate-900/90 border-slate-800 text-slate-200 shadow-xl' : 'bg-white border-blue-100 text-slate-800 shadow-md'
        }`}>
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-slate-900 dark:text-white">
                How AuraHealth Works (3 Simple Steps)
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-200 cursor-pointer"
              title="Close guide"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {/* Step 1 */}
            <div
              onClick={() => onNavigateTab('ambulances')}
              className={`p-3.5 rounded-xl border space-y-2 cursor-pointer transition-all hover:scale-[1.01] ${
                isDark ? 'bg-slate-950/50 border-slate-800/80 hover:border-blue-500/50' : 'bg-slate-50 border-slate-200/80 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-medium text-blue-600 dark:text-cyan-400">
                <span>1. Ambulances Alert ER</span>
                <Truck className="w-4 h-4" />
              </div>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">
                Paramedics stream live patient vitals and request blood or equipment before arriving.
              </p>
              <span className="text-[11px] text-blue-600 dark:text-cyan-400 font-semibold flex items-center gap-1">
                View Fleet <ArrowRight className="w-3 h-3" />
              </span>
            </div>

            {/* Step 2 */}
            <div
              onClick={() => onNavigateTab('resources')}
              className={`p-3.5 rounded-xl border space-y-2 cursor-pointer transition-all hover:scale-[1.01] ${
                isDark ? 'bg-slate-950/50 border-slate-800/80 hover:border-emerald-500/50' : 'bg-slate-50 border-slate-200/80 hover:border-emerald-300'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                <span>2. Prep Beds & Blood</span>
                <BedDouble className="w-4 h-4" />
              </div>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">
                Hospital reserves an ICU bed, stages blood units, and pre-powers resuscitation machines.
              </p>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                View Resources <ArrowRight className="w-3 h-3" />
              </span>
            </div>

            {/* Step 3 */}
            <div
              onClick={() => onNavigateTab('doctors')}
              className={`p-3.5 rounded-xl border space-y-2 cursor-pointer transition-all hover:scale-[1.01] ${
                isDark ? 'bg-slate-950/50 border-slate-800/80 hover:border-purple-500/50' : 'bg-slate-50 border-slate-200/80 hover:border-purple-300'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-medium text-purple-600 dark:text-purple-400">
                <span>3. Assign Specialists</span>
                <Stethoscope className="w-4 h-4" />
              </div>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">
                Surgeons and cardiologists are automatically matched to patients so care starts immediately.
              </p>
              <span className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-1">
                View Doctors <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
