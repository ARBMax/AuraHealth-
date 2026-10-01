import React, { useState } from 'react';
import { mockDiagnosticSamples } from '../data/mockDiagnosticData';
import { DiagnosticSample } from '../types/aura';
import { Eye, Sliders, Dna, Activity, AlertTriangle, ShieldCheck, Microscope, ArrowRight, Check } from 'lucide-react';

interface DiagnosticsLabProps {
  onSendToTriage?: (sample: DiagnosticSample) => void;
  isDark?: boolean;
}

export const DiagnosticsLab: React.FC<DiagnosticsLabProps> = ({ onSendToTriage, isDark = false }) => {
  const [selectedSampleId, setSelectedSampleId] = useState<string>(mockDiagnosticSamples[0].id);
  const [showBoxes, setShowBoxes] = useState<boolean>(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(0.85);
  const [selectedCellId, setSelectedCellId] = useState<string | null>(null);
  const [transmittedNotice, setTransmittedNotice] = useState<boolean>(false);

  const sample = mockDiagnosticSamples.find(s => s.id === selectedSampleId) || mockDiagnosticSamples[0];
  const filteredCells = sample.detectedCells.filter(c => c.confidence >= confidenceThreshold);
  const selectedCell = sample.detectedCells.find(c => c.id === selectedCellId);

  const handleTransmit = () => {
    if (onSendToTriage) {
      onSendToTriage(sample);
    }
    setTransmittedNotice(true);
    setTimeout(() => setTransmittedNotice(false), 3000);
  };

  const cardBg = isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-xs';
  const headingColor = isDark ? 'text-white' : 'text-slate-900';
  const mutedTextColor = isDark ? 'text-slate-400' : 'text-slate-600';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className={`p-6 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${cardBg}`}>
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-blue-600 dark:text-cyan-400 mb-1 font-bold">
            <span>Component 01</span>
            <span aria-hidden="true">·</span>
            <span>Edge-AI & Genomics Diagnostics Suite</span>
          </div>
          <h2 className={`text-xl sm:text-2xl font-bold tracking-tight ${headingColor}`}>
            Point-of-Care Cytology & Transcriptomic Profiling
          </h2>
          <p className={`text-xs sm:text-sm mt-1 ${mutedTextColor}`}>
            Inference using INT8 MobileNetV3/YOLOv8 edge neural models and DESeq2-normalized oncology biomarker panels.
          </p>
        </div>

        {/* Sample Selection Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          {mockDiagnosticSamples.map(s => (
            <button
              key={s.id}
              onClick={() => { setSelectedSampleId(s.id); setSelectedCellId(null); }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border whitespace-nowrap transition-colors cursor-pointer ${
                s.id === selectedSampleId
                  ? isDark
                    ? 'bg-cyan-950 border-cyan-500 text-white shadow-xs'
                    : 'bg-blue-50 border-blue-600 text-blue-900 font-bold shadow-xs'
                  : isDark
                    ? 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              {s.name.split('(')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Microscopy Canvas + Diagnostic Findings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Microscope Stage (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className={`flex items-center justify-between text-xs font-mono px-1 ${mutedTextColor}`}>
            <div className="flex items-center gap-2">
              <Microscope className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
              <span className={`font-semibold ${headingColor}`}>{sample.sampleType}</span>
            </div>
            <div className="flex items-center gap-3">
              <span>MAG: 100x OIL</span>
              <span>FOV: 500μm²</span>
            </div>
          </div>

          {/* Interactive SVG Stage Canvas */}
          <div className="relative aspect-[4/3] w-full bg-slate-950 border border-slate-800 rounded-xl overflow-hidden select-none shadow-inner">
            <svg className="w-full h-full" viewBox="0 0 550 350" preserveAspectRatio="xMidYMid meet">
              <defs>
                <radialGradient id="smearBg" cx="50%" cy="50%" r="60%">
                  <stop offset="0%" stopColor="#1e1838" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#080812" stopOpacity="0.95" />
                </radialGradient>
              </defs>

              <rect width="550" height="350" fill="url(#smearBg)" />

              {/* Render Biological Cells */}
              {sample.detectedCells.map(cell => {
                const isSelected = cell.id === selectedCellId;
                const isBlast = cell.type === 'blast';
                const isParasite = cell.type === 'parasite';
                const isNeutrophil = cell.type === 'neutrophil';

                let strokeColor = "#38bdf8";
                let fillColor = "rgba(56, 189, 248, 0.15)";
                if (isBlast) { strokeColor = "#f43f5e"; fillColor = "rgba(244, 63, 94, 0.25)"; }
                if (isParasite) { strokeColor = "#fbbf24"; fillColor = "rgba(251, 191, 36, 0.25)"; }
                if (isNeutrophil) { strokeColor = "#a855f7"; fillColor = "rgba(168, 85, 247, 0.25)"; }

                return (
                  <g
                    key={cell.id}
                    onClick={() => setSelectedCellId(cell.id)}
                    className="cursor-pointer group"
                  >
                    {/* Simulated Biological Cell Morphology */}
                    <circle
                      cx={cell.x + cell.w / 2}
                      cy={cell.y + cell.h / 2}
                      r={cell.w / 2 - 2}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={isSelected ? "2.5" : "1.2"}
                      strokeDasharray={isSelected ? "4 2" : "none"}
                    />

                    {/* Internal Nucleus */}
                    <circle
                      cx={cell.x + cell.w / 2}
                      cy={cell.y + cell.h / 2}
                      r={isBlast ? (cell.w / 2) * 0.78 : (cell.w / 2) * 0.45}
                      fill={isBlast ? "rgba(225, 29, 72, 0.6)" : isParasite ? "rgba(245, 158, 11, 0.7)" : "rgba(126, 34, 206, 0.5)"}
                    />

                    {/* Parasite Intracellular Chromatin Dot */}
                    {isParasite && (
                      <circle
                        cx={cell.x + cell.w / 2 - 4}
                        cy={cell.y + cell.h / 2 - 4}
                        r="3"
                        fill="#ef4444"
                      />
                    )}

                    {/* AI Bounding Box & Label Overlay */}
                    {showBoxes && cell.confidence >= confidenceThreshold && (
                      <>
                        <rect
                          x={cell.x}
                          y={cell.y}
                          width={cell.w}
                          height={cell.h}
                          fill="none"
                          stroke={strokeColor}
                          strokeWidth="1"
                          strokeDasharray="2 2"
                          opacity="0.85"
                        />
                        <rect
                          x={cell.x}
                          y={cell.y - 16}
                          width={Math.min(cell.label.length * 6.5 + 42, 140)}
                          height="14"
                          fill="#090d16"
                          rx="2"
                        />
                        <text
                          x={cell.x + 3}
                          y={cell.y - 5}
                          fill={strokeColor}
                          fontSize="9"
                          fontFamily="JetBrains Mono"
                        >
                          {cell.label.slice(0, 14)} {(cell.confidence * 100).toFixed(0)}%
                        </text>
                      </>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Canvas HUD Bottom Ribbon */}
            <div className="absolute bottom-2 left-2 right-2 px-3 py-1.5 bg-slate-900/90 backdrop-blur border border-slate-800 rounded-lg flex items-center justify-between text-[11px] font-mono text-white">
              <div className="flex items-center gap-3">
                <span>DETECTED CELLS: <strong>{filteredCells.length}</strong></span>
                <span>BLAST COUNT: <strong className={sample.blastPercentage > 20 ? "text-rose-400" : "text-emerald-400"}>{sample.blastPercentage}%</strong></span>
              </div>
              <div className="text-cyan-400 hidden sm:inline">CLICK CELL TO INSPECT</div>
            </div>
          </div>

          {/* Canvas Controls */}
          <div className={`p-3 rounded-xl border flex flex-wrap items-center justify-between gap-4 text-xs font-mono ${cardBg}`}>
            <label className="flex items-center gap-2 cursor-pointer font-medium">
              <input
                type="checkbox"
                checked={showBoxes}
                onChange={e => setShowBoxes(e.target.checked)}
                className="rounded text-blue-600 focus:ring-0"
              />
              <span>Overlay Bounding Boxes</span>
            </label>

            <div className="flex items-center gap-3">
              <span className={mutedTextColor}>CONFIDENCE THRESHOLD:</span>
              <input
                type="range"
                min="0.5"
                max="0.98"
                step="0.02"
                value={confidenceThreshold}
                onChange={e => setConfidenceThreshold(parseFloat(e.target.value))}
                className="w-24 accent-blue-600 dark:accent-cyan-400 cursor-pointer"
              />
              <span className="font-bold">{(confidenceThreshold * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>

        {/* Right Column: Findings & Transmission (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Primary Diagnosis Card */}
          <div className={`p-5 rounded-xl border space-y-3 ${cardBg}`}>
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <span className="text-xs font-mono font-bold uppercase text-blue-600 dark:text-cyan-400">Classification Output</span>
              <span className={`text-xs font-mono font-bold uppercase ${
                sample.severityLevel === 'critical' ? 'text-rose-600' : 'text-amber-600'
              }`}>
                ● {sample.severityLevel} Acuity
              </span>
            </div>

            <div>
              <h3 className={`text-base font-bold ${headingColor}`}>{sample.primaryDiagnosis}</h3>
              <p className={`text-xs mt-1 leading-relaxed ${mutedTextColor}`}>{sample.description}</p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800 text-xs font-mono">
              <span className={mutedTextColor}>MODEL CONFIDENCE:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">{(sample.confidenceScore * 100).toFixed(1)}% mAP</span>
            </div>
          </div>

          {/* Morphometric Parameters */}
          <div className={`p-5 rounded-xl border space-y-3 ${cardBg}`}>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
              Biophysical Morphometry & Findings
            </h4>
            <div className="space-y-2">
              {sample.morphologyFindings.map((finding, idx) => (
                <div key={idx} className={`p-2.5 rounded-lg border text-xs space-y-0.5 ${
                  isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center justify-between font-medium">
                    <span className={headingColor}>{finding.feature}</span>
                    <span className="font-mono font-bold text-blue-700 dark:text-cyan-300">{finding.value}</span>
                  </div>
                  <div className={`text-[11px] ${mutedTextColor}`}>
                    Significance: {finding.clinicalSignificance}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Cell Inspector */}
          {selectedCell && (
            <div className={`p-3.5 rounded-xl border text-xs font-mono space-y-1 ${
              isDark ? 'bg-cyan-950/20 border-cyan-800 text-slate-300' : 'bg-blue-50 border-blue-200 text-blue-900'
            }`}>
              <div className="font-bold uppercase">Inspected Cell: {selectedCell.id}</div>
              <div>Type: {selectedCell.label}</div>
              <div>Confidence: {(selectedCell.confidence * 100).toFixed(1)}%</div>
            </div>
          )}

          {/* Transmit findings button */}
          <button
            onClick={handleTransmit}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <span>Transmit Findings to Triage & Bed Solver</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          {transmittedNotice && (
            <div className="p-2.5 text-center text-xs font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-lg">
              ✓ Findings successfully forwarded to Bayesian Triage Bus and Bed Solver.
            </div>
          )}
        </div>
      </div>

      {/* Part 2: RNA-seq / Microarray Cancer Transcriptomics Panel */}
      <div className={`p-6 rounded-xl border space-y-4 ${cardBg}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Dna className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
            <h3 className={`text-sm font-bold uppercase tracking-wider font-mono ${headingColor}`}>
              RNA-seq & Microarray Gene Expression Heatmap
            </h3>
          </div>
          <div className="text-xs font-mono text-slate-500">
            NORMALIZATION: DESeq2 | CLASSIFIER: LASSO-SVM
          </div>
        </div>

        <p className={`text-xs ${mutedTextColor}`}>
          Molecular subtyping risk profile showing standardized z-scores across key oncology pathways:
        </p>

        {/* Gene Expression Heatmap Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {sample.geneExpression.map((item, idx) => {
            const isUp = item.zScore > 1.5;
            const isDown = item.zScore < -1.5;
            let barColor = isDark ? "bg-slate-700" : "bg-slate-300";
            if (isUp) barColor = "bg-rose-500";
            if (isDown) barColor = "bg-blue-500";

            return (
              <div key={idx} className={`p-3.5 rounded-lg border space-y-2 ${
                isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-mono font-bold ${headingColor}`}>{item.gene}</span>
                  <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded font-medium ${
                    item.mutationalStatus === 'Mutated / Fusion' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                    item.mutationalStatus === 'Overexpressed' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                    item.mutationalStatus === 'Downregulated' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                    'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                  }`}>
                    {item.mutationalStatus}
                  </span>
                </div>

                <div className={`text-[11px] ${mutedTextColor}`}>
                  <span>Pathway: </span>
                  <span className={headingColor}>{item.pathway}</span>
                </div>

                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>z-score: {item.zScore > 0 ? `+${item.zScore.toFixed(2)}` : item.zScore.toFixed(2)}</span>
                    <span>log2FC: {item.log2FoldChange > 0 ? `+${item.log2FoldChange.toFixed(2)}` : item.log2FoldChange.toFixed(2)}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full ${barColor}`}
                      style={{ width: `${Math.min(Math.abs(item.zScore) * 20 + 20, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
