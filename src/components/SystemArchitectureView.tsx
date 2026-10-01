import React, { useState } from 'react';
import { systemArchitectureData } from '../data/systemSpecs';
import { Check, Copy, Activity, Cpu, Dna, Network, Database, ShieldAlert, FileText, ChevronRight, Layers, FileSpreadsheet } from 'lucide-react';

interface SystemArchitectureViewProps {
  isDark?: boolean;
}

export const SystemArchitectureView: React.FC<SystemArchitectureViewProps> = ({ isDark = false }) => {
  const [selectedArchStep, setSelectedArchStep] = useState<number>(1);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopySection = (title: string, text: string) => {
    navigator.clipboard.writeText(`## ${title}\n\n${text}`);
    setCopiedSection(title);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const currentStep = systemArchitectureData.systemArchitecture.dataFlowStages.find(s => s.step === selectedArchStep) || systemArchitectureData.systemArchitecture.dataFlowStages[0];

  const cardBg = isDark ? 'bg-slate-900/60 border-slate-800 text-slate-200' : 'bg-white border-slate-200/90 text-slate-800 shadow-xs';
  const subCardBg = isDark ? 'bg-slate-950/70 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700';
  const headingColor = isDark ? 'text-white' : 'text-slate-900';
  const mutedTextColor = isDark ? 'text-slate-400' : 'text-slate-600';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Enterprise System Specifications Dossier */}
      <div className={`p-6 sm:p-8 rounded-xl border ${cardBg}`}>
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-wider mb-3">
          <span className={isDark ? 'text-cyan-400 font-semibold' : 'text-blue-700 font-bold'}>
            {systemArchitectureData.systemName}
          </span>
          <span className="text-slate-400">·</span>
          <span className={mutedTextColor}>{systemArchitectureData.version}</span>
          <span className="text-slate-400">·</span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
            isDark ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-emerald-100 text-emerald-800'
          }`}>
            FDA SaMD Class II Compliant
          </span>
        </div>

        <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight ${headingColor} leading-tight`}>
          {systemArchitectureData.fullTitle}
        </h1>

        <p className={`mt-4 text-sm sm:text-base leading-relaxed ${mutedTextColor}`}>
          An end-to-end biomedical system design and software architecture integrating point-of-care cytology edge machine learning, RNA-sequencing transcriptomics, Bayesian triage fusion, Mixed-Integer Linear Programming (MILP) bed optimization, and continuous in-silico epidemic/surge simulation.
        </p>

        {/* Quick Jump Bar */}
        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-2 text-xs font-mono">
          <a href="#executive-overview" className={`px-2.5 py-1 rounded border transition-colors ${
            isDark ? 'bg-slate-950 border-slate-800 text-slate-300 hover:text-cyan-400' : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-blue-600'
          }`}>
            1. Executive Overview
          </a>
          <a href="#system-pipeline" className={`px-2.5 py-1 rounded border transition-colors ${
            isDark ? 'bg-slate-950 border-slate-800 text-slate-300 hover:text-cyan-400' : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-blue-600'
          }`}>
            2. Ingestion & Workflow Pipeline
          </a>
          <a href="#algorithmic-specs" className={`px-2.5 py-1 rounded border transition-colors ${
            isDark ? 'bg-slate-950 border-slate-800 text-slate-300 hover:text-cyan-400' : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-blue-600'
          }`}>
            3. Algorithmic Formulations
          </a>
          <a href="#production-stack" className={`px-2.5 py-1 rounded border transition-colors ${
            isDark ? 'bg-slate-950 border-slate-800 text-slate-300 hover:text-cyan-400' : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-blue-600'
          }`}>
            4. Production Tech Stack
          </a>
          <a href="#verified-outcomes" className={`px-2.5 py-1 rounded border transition-colors ${
            isDark ? 'bg-slate-950 border-slate-800 text-slate-300 hover:text-cyan-400' : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-blue-600'
          }`}>
            5. Clinical Efficacy & Outcomes
          </a>
        </div>
      </div>

      {/* SECTION 1: Executive Overview */}
      <section id="executive-overview" className="scroll-mt-20 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
              isDark ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'bg-blue-100 text-blue-800'
            }`}>
              Section 1.0
            </span>
            <h2 className={`text-xl font-bold ${headingColor}`}>Executive System Overview</h2>
          </div>
          <button
            onClick={() => handleCopySection("Executive Overview", systemArchitectureData.executiveOverview)}
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded border transition-colors cursor-pointer ${
              isDark ? 'border-slate-700 text-slate-400 hover:text-cyan-400' : 'border-slate-300 text-slate-600 hover:text-blue-600 bg-white'
            }`}
          >
            {copiedSection === "Executive Overview" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSection === "Executive Overview" ? 'Copied' : 'Copy Overview'}</span>
          </button>
        </div>

        <div className={`p-6 rounded-xl border leading-relaxed text-sm sm:text-base ${
          isDark ? 'bg-slate-900/80 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800 shadow-xs'
        }`}>
          {systemArchitectureData.executiveOverview}
        </div>

        {/* Clinical Problem Context & Failure Modes */}
        <div className="space-y-3 pt-2">
          <h3 className={`text-xs font-mono uppercase tracking-wider font-semibold ${mutedTextColor}`}>
            Operational Failure Modes Solved by AuraHealth
          </h3>
          <p className={`text-xs leading-relaxed ${mutedTextColor}`}>
            {systemArchitectureData.problemStatement.clinicalContext}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {systemArchitectureData.problemStatement.operationalFailureModes.map((fm, idx) => (
              <div key={idx} className={`p-3.5 rounded-lg border ${subCardBg}`}>
                <div className="text-xs font-mono font-bold text-rose-500 mb-1">
                  0{idx + 1}. {fm.mode}
                </div>
                <div className="text-xs leading-relaxed">
                  {fm.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: System Architecture & Workflow Pipeline */}
      <section id="system-pipeline" className="scroll-mt-20 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
              isDark ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'bg-blue-100 text-blue-800'
            }`}>
              Section 2.0
            </span>
            <h2 className={`text-xl font-bold ${headingColor}`}>System Architecture & Ingestion Pipeline</h2>
          </div>
          <button
            onClick={() => handleCopySection(
              "System Architecture & Ingestion Pipeline",
              systemArchitectureData.systemArchitecture.dataFlowStages.map(s => `Stage ${s.step}: ${s.name}\nProtocol: ${s.protocol} | Latency: ${s.latency}\n${s.description}`).join('\n\n')
            )}
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded border transition-colors cursor-pointer ${
              isDark ? 'border-slate-700 text-slate-400 hover:text-cyan-400' : 'border-slate-300 text-slate-600 hover:text-blue-600 bg-white'
            }`}
          >
            {copiedSection === "System Architecture & Ingestion Pipeline" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSection === "System Architecture & Ingestion Pipeline" ? 'Copied' : 'Copy Architecture'}</span>
          </button>
        </div>

        <p className={`text-xs sm:text-sm ${mutedTextColor}`}>
          {systemArchitectureData.systemArchitecture.overview} Select any stage below to inspect its data communication protocols, latency budget, and computational formulation:
        </p>

        {/* 7-Stage Architectural Stepper */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
          {systemArchitectureData.systemArchitecture.dataFlowStages.map((stage) => {
            const isSelected = stage.step === selectedArchStep;
            return (
              <button
                key={stage.step}
                onClick={() => setSelectedArchStep(stage.step)}
                className={`p-3 text-left rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? isDark
                      ? 'bg-cyan-950/70 border-cyan-500 text-white shadow-xs'
                      : 'bg-blue-50 border-blue-500 text-blue-900 shadow-xs'
                    : isDark
                      ? 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900'
                }`}
              >
                <div className="text-[10px] font-mono text-slate-400 font-bold mb-1">STAGE 0{stage.step}</div>
                <div className="text-xs font-semibold leading-tight line-clamp-2">{stage.name}</div>
                <div className={`text-[11px] font-mono font-bold mt-2 ${
                  isDark ? 'text-cyan-400' : 'text-blue-600'
                }`}>
                  {stage.latency}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Detail Panel */}
        <div className={`p-5 sm:p-6 rounded-xl border space-y-4 ${cardBg}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <span className={`text-xs font-mono uppercase font-bold ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}>
                Stage 0{currentStep.step} Operational Specifications
              </span>
              <h3 className={`text-lg font-bold ${headingColor}`}>{currentStep.name}</h3>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-medium">
                Protocol: {currentStep.protocol}
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                Latency: {currentStep.latency}
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm leading-relaxed">
            {currentStep.description}
          </p>

          <div className={`p-3.5 rounded-lg border font-mono text-xs ${
            isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-900 border-slate-800 text-cyan-200'
          }`}>
            <span className="text-slate-400 block text-[10px] uppercase mb-1">Computational Kernel:</span>
            {currentStep.step === 1 && <code>GigE Vision Stream → (YUV422 to RGB Deconv) → Normalization Tensor X ∈ [0, 1]^(3 × 1024 × 1024)</code>}
            {currentStep.step === 2 && <code>[BBoxes, Classes] = YOLOv8-Nano_INT8(X); N:C Ratio = Area_nucleus / (Area_cell - Area_nucleus)</code>}
            {currentStep.step === 3 && <code>Normalized Transcript Counts z_g = (x_g - μ_g)/σ_g; Risk Index R_gen = σ(w^T · z + b)</code>}
            {currentStep.step === 4 && <code>Bayesian Triage Utility: S_triage = 0.45 · NEWS2_norm + 0.45 · (% Blasts) + 0.10 · R_gen</code>}
            {currentStep.step === 5 && <code>MILP Solver: min Σ (w_i · Wait_i) s.t. x_i,iso = 1 if Pathogen_i == True; Σ_i x_ij ≤ Capacity_j</code>}
            {currentStep.step === 6 && <code>SEIR ODE: dI/dt = σ·E - γ·I - δ_iso·I; Erlang-C Queue: P(Wait &gt; 0) = [(cρ)^c / c!(1-ρ)] / Denom</code>}
            {currentStep.step === 7 && <code>WSS PubSub Event Bus: State Delta ΔS broadcast to React Fiber Tree (Render Latency &lt; 60ms)</code>}
          </div>
        </div>
      </section>

      {/* SECTION 3: Algorithmic Specifications */}
      <section id="algorithmic-specs" className="scroll-mt-20 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
              isDark ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'bg-blue-100 text-blue-800'
            }`}>
              Section 3.0
            </span>
            <h2 className={`text-xl font-bold ${headingColor}`}>Algorithmic Specifications & Mathematical Models</h2>
          </div>
          <button
            onClick={() => handleCopySection(
              "Algorithmic Specifications",
              systemArchitectureData.coreFeatures.map(c => `### ${c.category}\n` + c.modules.map(m => `**${m.name}**\n- Algorithms: ${m.algorithms}\n- Specs: ${m.specifications}`).join('\n\n')).join('\n\n')
            )}
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded border transition-colors cursor-pointer ${
              isDark ? 'border-slate-700 text-slate-400 hover:text-cyan-400' : 'border-slate-300 text-slate-600 hover:text-blue-600 bg-white'
            }`}
          >
            {copiedSection === "Algorithmic Specifications" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSection === "Algorithmic Specifications" ? 'Copied' : 'Copy Specs'}</span>
          </button>
        </div>

        <div className="space-y-5">
          {systemArchitectureData.coreFeatures.map((cat, idx) => (
            <div key={idx} className={`p-5 sm:p-6 rounded-xl border space-y-4 ${cardBg}`}>
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className={`text-xs font-mono font-bold ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}>0{idx + 1}.</span>
                <h3 className={`text-base font-bold ${headingColor}`}>{cat.category}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cat.modules.map((mod, mIdx) => (
                  <div key={mIdx} className={`p-4 rounded-lg border space-y-2 ${subCardBg}`}>
                    <h4 className={`text-sm font-bold ${isDark ? 'text-cyan-300' : 'text-blue-700'}`}>{mod.name}</h4>
                    <div className="text-xs">
                      <span className="font-semibold text-slate-900 dark:text-white">Algorithmic Formulation: </span>
                      <span className={mutedTextColor}>{mod.algorithms}</span>
                    </div>
                    <div className="text-xs leading-relaxed pt-1">
                      <span className="font-semibold text-slate-900 dark:text-white">Implementation Specs: </span>
                      <span className={mutedTextColor}>{mod.specifications}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: Suggested Production Tech Stack */}
      <section id="production-stack" className="scroll-mt-20 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
              isDark ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'bg-blue-100 text-blue-800'
            }`}>
              Section 4.0
            </span>
            <h2 className={`text-xl font-bold ${headingColor}`}>Production Tech Stack & Hardware Specs</h2>
          </div>
          <button
            onClick={() => handleCopySection(
              "Production Tech Stack",
              systemArchitectureData.suggestedTechStack.map(t => `### ${t.tier}\n` + t.components.map(c => `- **${c.name}**: ${c.purpose}`).join('\n')).join('\n\n')
            )}
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded border transition-colors cursor-pointer ${
              isDark ? 'border-slate-700 text-slate-400 hover:text-cyan-400' : 'border-slate-300 text-slate-600 hover:text-blue-600 bg-white'
            }`}
          >
            {copiedSection === "Production Tech Stack" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSection === "Production Tech Stack" ? 'Copied' : 'Copy Stack'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {systemArchitectureData.suggestedTechStack.map((tier, idx) => (
            <div key={idx} className={`p-5 rounded-xl border space-y-3 ${cardBg}`}>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <h3 className={`text-xs font-mono uppercase font-bold tracking-wider ${isDark ? 'text-cyan-400' : 'text-blue-700'}`}>
                  {tier.tier}
                </h3>
                <span className="text-[11px] font-mono text-slate-400">{tier.components.length} components</span>
              </div>
              <ul className="space-y-2">
                {tier.components.map((comp, cIdx) => (
                  <li key={cIdx} className="text-xs leading-relaxed">
                    <strong className={`font-mono ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{comp.name}</strong>
                    <span className={mutedTextColor}> — {comp.purpose}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: Key Benefits & Outcomes */}
      <section id="verified-outcomes" className="scroll-mt-20 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
              isDark ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'bg-blue-100 text-blue-800'
            }`}>
              Section 5.0
            </span>
            <h2 className={`text-xl font-bold ${headingColor}`}>Quantified Operational & Clinical Outcomes</h2>
          </div>
          <button
            onClick={() => handleCopySection(
              "Quantified Clinical Outcomes",
              systemArchitectureData.keyBenefits.map(b => `### ${b.domain}\n- Metric: ${b.metric}\n- Detail: ${b.detail}`).join('\n\n')
            )}
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded border transition-colors cursor-pointer ${
              isDark ? 'border-slate-700 text-slate-400 hover:text-cyan-400' : 'border-slate-300 text-slate-600 hover:text-blue-600 bg-white'
            }`}
          >
            {copiedSection === "Quantified Clinical Outcomes" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSection === "Quantified Clinical Outcomes" ? 'Copied' : 'Copy Outcomes'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {systemArchitectureData.keyBenefits.map((b, idx) => (
            <div key={idx} className={`p-5 rounded-xl border flex flex-col justify-between space-y-3 ${cardBg}`}>
              <div>
                <span className={`text-xs font-mono uppercase font-bold tracking-wider block mb-1 ${
                  isDark ? 'text-cyan-400' : 'text-blue-600'
                }`}>
                  {b.domain}
                </span>
                <div className={`text-2xl font-bold font-mono tracking-tight ${headingColor}`}>
                  {b.metric}
                </div>
              </div>
              <p className={`text-xs leading-relaxed border-t border-slate-200 dark:border-slate-800 pt-3 ${mutedTextColor}`}>
                {b.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 6: Deployment Roadmap */}
      <section className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
            isDark ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'bg-blue-100 text-blue-800'
          }`}>
            Section 6.0
          </span>
          <h2 className={`text-xl font-bold ${headingColor}`}>Enterprise Clinical Deployment Roadmap</h2>
        </div>

        <div className="space-y-2.5">
          {systemArchitectureData.deploymentRoadmap.map((item, idx) => (
            <div key={idx} className={`p-4 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${subCardBg}`}>
              <div className="sm:w-1/3">
                <span className={`text-xs font-mono font-bold uppercase ${
                  isDark ? 'text-cyan-400' : 'text-blue-700'
                }`}>
                  {item.phase}
                </span>
              </div>
              <div className={`sm:w-2/3 text-xs leading-relaxed ${mutedTextColor}`}>
                {item.deliverables}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
