import React, { useState } from 'react';
import { ActiveTab } from './types/aura';
import { Navbar } from './components/Navbar';
import { SystemArchitectureView } from './components/SystemArchitectureView';
import { PatientOperationsView } from './components/PatientOperationsView';
import { CommandCenterView } from './components/CommandCenterView';
import { AmbulanceDispatchView } from './components/AmbulanceDispatchView';
import { DoctorAllocationView } from './components/DoctorAllocationView';
import { systemArchitectureData } from './data/systemSpecs';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('command_center');
  const [copied, setCopied] = useState<boolean>(false);
  const [isDark, setIsDark] = useState<boolean>(true);

  // Compile clinical system architecture specifications in Markdown
  const handleCopyAll = () => {
    let md = `# ${systemArchitectureData.fullTitle}\n`;
    md += `**System:** ${systemArchitectureData.systemName} (${systemArchitectureData.version})\n`;
    md += `**Classification:** ${systemArchitectureData.classification}\n`;
    md += `**Regulatory Scope:** ${systemArchitectureData.regulatoryScope}\n\n`;

    md += `## 1. Executive System Overview\n${systemArchitectureData.executiveOverview}\n\n`;

    md += `## 2. Clinical Problem Statement & Hospital Failure Modes\n`;
    md += `${systemArchitectureData.problemStatement.clinicalContext}\n\n`;
    systemArchitectureData.problemStatement.operationalFailureModes.forEach((fm, i) => {
      md += `### Failure Mode ${i + 1}: ${fm.mode}\n${fm.description}\n\n`;
    });

    md += `## 3. End-to-End System Architecture & Ingestion Pipeline\n`;
    md += `${systemArchitectureData.systemArchitecture.overview}\n\n`;
    systemArchitectureData.systemArchitecture.dataFlowStages.forEach(s => {
      md += `### Stage ${s.step}: ${s.name}\n`;
      md += `- **Protocol:** ${s.protocol}\n`;
      md += `- **Computational Latency:** ${s.latency}\n`;
      md += `- **Description:** ${s.description}\n\n`;
    });

    md += `## 4. Core Features & Algorithmic Formulations\n\n`;
    systemArchitectureData.coreFeatures.forEach((cat, i) => {
      md += `### ${i + 1}. ${cat.category}\n\n`;
      cat.modules.forEach(m => {
        md += `#### ${m.name}\n`;
        md += `- **Algorithmic Formulation:** ${m.algorithms}\n`;
        md += `- **Implementation Specifications:** ${m.specifications}\n\n`;
      });
    });

    md += `## 5. Production Tech Stack & Hardware Specs\n\n`;
    systemArchitectureData.suggestedTechStack.forEach(t => {
      md += `### ${t.tier}\n`;
      t.components.forEach(c => {
        md += `- **${c.name}**: ${c.purpose}\n`;
      });
      md += `\n`;
    });

    md += `## 6. Quantified Clinical & Operational Outcomes\n\n`;
    systemArchitectureData.keyBenefits.forEach(b => {
      md += `### ${b.domain}\n`;
      md += `- **Metric:** ${b.metric}\n`;
      md += `- **Clinical Context:** ${b.detail}\n\n`;
    });

    md += `## 7. Enterprise Clinical Deployment Roadmap\n\n`;
    systemArchitectureData.deploymentRoadmap.forEach(r => {
      md += `- **${r.phase}:** ${r.deliverables}\n`;
    });
    md += `\n`;

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Enterprise Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onCopyAll={handleCopyAll}
        onPrint={handlePrint}
        copied={copied}
        isDark={isDark}
        toggleTheme={() => setIsDark(!isDark)}
      />

      {/* Main Operational Stage */}
      <main className="flex-1 pb-16">
        {activeTab === 'command_center' && (
          <CommandCenterView 
            isDark={isDark} 
            onNavigateToAmbulances={() => setActiveTab('ambulances')}
            onNavigateToDoctors={() => setActiveTab('doctors')}
          />
        )}
        {activeTab === 'ambulances' && (
          <AmbulanceDispatchView isDark={isDark} />
        )}
        {activeTab === 'resources' && (
          <PatientOperationsView 
            isDark={isDark} 
            activeSubTab="resources" 
            onSubTabChange={(tab) => setActiveTab(tab)} 
          />
        )}
        {activeTab === 'doctors' && (
          <DoctorAllocationView isDark={isDark} />
        )}
        {activeTab === 'triage' && (
          <PatientOperationsView 
            isDark={isDark} 
            activeSubTab="triage" 
            onSubTabChange={(tab) => setActiveTab(tab)} 
          />
        )}
        {activeTab === 'specs' && (
          <SystemArchitectureView isDark={isDark} />
        )}
      </main>

      {/* Production Clinical Footer */}
      <footer className={`border-t px-6 py-6 text-xs font-mono transition-colors ${
        isDark ? 'bg-slate-950 border-slate-900 text-slate-500' : 'bg-white border-slate-200 text-slate-500'
      }`}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>AuraHealth OS</span>
            <span aria-hidden="true">·</span>
            <span>Hospital Operations, Resource Management & Pre-Hospital EMS Platform</span>
            <span aria-hidden="true">·</span>
            <span>v3.4 Production</span>
          </div>
          <div className="flex items-center gap-3">
            <span>EMS Telematics</span>
            <span>/</span>
            <span>MILP Bed Matrix</span>
            <span>/</span>
            <span>Physician Allocation</span>
            <span>/</span>
            <span>Blood Reserves</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
