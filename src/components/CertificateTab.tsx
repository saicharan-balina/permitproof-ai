import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  ShieldCheck,
  ShieldAlert,
  Award,
  Layers,
} from 'lucide-react';
import { ProofSummary } from '../types';
import {
  generateCertificateMarkdown,
  generateCertificateJSON,
  exportCertificateFile,
} from '../engine/certificate';

interface CertificateTabProps {
  summary: ProofSummary;
}

export const CertificateTab: React.FC<CertificateTabProps> = ({ summary }) => {
  const [copied, setCopied] = useState(false);

  const handleExportJSON = () => {
    const json = generateCertificateJSON(summary);
    exportCertificateFile(json, `permitproof-certificate-${summary.runId}.json`, 'application/json');
  };

  const handleExportMarkdown = () => {
    const md = generateCertificateMarkdown(summary);
    exportCertificateFile(md, `permitproof-certificate-${summary.runId}.md`, 'text/markdown');
  };

  const handleCopySummary = () => {
    const text = `AUTHORIZATION CHANGE CERTIFICATE
Project: ${summary.project}
Candidate: ${summary.candidateVersion}
Scenarios: ${summary.totalScenarios}
Unchanged: ${summary.unchangedCount}
Access Changes: ${summary.changedCount}
Critical Findings: ${summary.criticalCount}
Final Status: ${summary.status}
Run ID: ${summary.runId}
Verification: Deterministic differential authorization proof`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isProven = summary.status === 'PROVEN';

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Certificate Frame */}
      <div className="bg-dark-900 border-2 border-dark-700 rounded-3xl shadow-2xl overflow-hidden relative">
        {/* Subtle Certificate Watermark */}
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Award className="w-96 h-96 text-white" />
        </div>

        {/* Certificate Header Banner */}
        <div className="bg-dark-850 border-b border-dark-750 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-brand-400 font-bold">
              <Award className="w-4 h-4" />
              <span>Official Verification Audit</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              AUTHORIZATION CHANGE CERTIFICATE
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Deterministic Differential Authorization Assurance Protocol v1.0
            </p>
          </div>

          {/* Export Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="cert-export-json-btn"
              onClick={handleExportJSON}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-dark-800 hover:bg-dark-750 border border-dark-700 transition-colors flex items-center space-x-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-brand-400" />
              <span>Export JSON</span>
            </button>

            <button
              id="cert-export-md-btn"
              onClick={handleExportMarkdown}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-dark-800 hover:bg-dark-750 border border-dark-700 transition-colors flex items-center space-x-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-brand-400" />
              <span>Export Markdown</span>
            </button>

            <button
              id="cert-copy-summary-btn"
              onClick={handleCopySummary}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-500/20 transition-colors flex items-center space-x-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-success-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Summary'}</span>
            </button>
          </div>
        </div>

        {/* Certificate Body */}
        <div className="p-6 sm:p-10 space-y-8">
          {/* Executive Verdict Banner */}
          <div
            className={`p-6 sm:p-8 rounded-2xl border text-center relative overflow-hidden ${
              isProven
                ? 'bg-success-500/10 border-success-500/40 text-success-300'
                : 'bg-danger-500/15 border-danger-500/40 text-danger-300'
            }`}
          >
            <div className="max-w-2xl mx-auto space-y-3">
              <span className="text-xs uppercase tracking-widest font-mono font-bold block text-slate-400">
                Deterministic Policy Audit Verdict
              </span>
              <div
                className={`text-3xl sm:text-5xl font-black font-mono tracking-tight flex items-center justify-center space-x-3 ${
                  isProven ? 'text-success-400' : 'text-danger-400'
                }`}
              >
                {isProven ? <ShieldCheck className="w-10 h-10" /> : <ShieldAlert className="w-10 h-10" />}
                <span>{summary.status}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {isProven
                  ? 'All authorization scenarios verified. No unexpected privilege escalations or tenant boundary leaks detected.'
                  : `Policy verification failed due to ${summary.criticalCount} critical security regressions. Zero-tolerance policy violation prevents authorization certification.`}
              </p>
              <div className="inline-block px-3 py-1 rounded bg-dark-900/80 border border-dark-750 text-[11px] font-mono text-slate-400">
                Rule: If any critical authorization regression exists → NOT PROVEN. (Deterministic Evaluation)
              </div>
            </div>
          </div>

          {/* Audit Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-dark-850 p-4 rounded-xl border border-dark-750">
              <span className="text-[11px] text-slate-400 uppercase font-mono block">Project</span>
              <span className="text-sm font-bold text-white mt-1 block">{summary.project}</span>
            </div>
            <div className="bg-dark-850 p-4 rounded-xl border border-dark-750">
              <span className="text-[11px] text-slate-400 uppercase font-mono block">Candidate PR</span>
              <span className="text-sm font-bold text-brand-300 font-mono mt-1 block">
                {summary.candidateVersion}
              </span>
            </div>
            <div className="bg-dark-850 p-4 rounded-xl border border-dark-750">
              <span className="text-[11px] text-slate-400 uppercase font-mono block">Baseline Policy</span>
              <span className="text-sm font-bold text-slate-300 font-mono mt-1 block">
                {summary.baselineVersion}
              </span>
            </div>
            <div className="bg-dark-850 p-4 rounded-xl border border-dark-750">
              <span className="text-[11px] text-slate-400 uppercase font-mono block">Run Execution ID</span>
              <span className="text-xs font-semibold text-slate-300 font-mono mt-1 block truncate">
                {summary.runId}
              </span>
            </div>
          </div>

          {/* Quantitative Proof Results */}
          <div className="bg-dark-850 rounded-2xl border border-dark-750 p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center space-x-2">
              <Layers className="w-4 h-4 text-brand-400" />
              <span>Quantitative Scenarios Audit</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3 bg-dark-900 rounded-xl border border-dark-800">
                <span className="text-xs text-slate-400">Total Scenarios</span>
                <div className="text-2xl font-bold font-mono text-white mt-1">
                  {summary.totalScenarios}
                </div>
              </div>
              <div className="p-3 bg-dark-900 rounded-xl border border-dark-800">
                <span className="text-xs text-slate-400">Unchanged Decisions</span>
                <div className="text-2xl font-bold font-mono text-success-400 mt-1">
                  {summary.unchangedCount}
                </div>
              </div>
              <div className="p-3 bg-dark-900 rounded-xl border border-dark-800">
                <span className="text-xs text-slate-400">Access Decision Changes</span>
                <div className="text-2xl font-bold font-mono text-warning-400 mt-1">
                  {summary.changedCount}
                </div>
              </div>
              <div className="p-3 bg-dark-900 rounded-xl border border-dark-800">
                <span className="text-xs text-slate-400">Critical Regressions</span>
                <div className="text-2xl font-bold font-mono text-danger-400 mt-1">
                  {summary.criticalCount}
                </div>
              </div>
            </div>
          </div>

          {/* Findings Summary Table */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono">
              Audit Findings Registry
            </h3>

            <div className="bg-dark-950 rounded-xl border border-dark-750 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-dark-850 text-slate-400 font-mono uppercase text-[11px] border-b border-dark-750">
                  <tr>
                    <th className="py-2.5 px-4">Finding ID</th>
                    <th className="py-2.5 px-4">Role & Action</th>
                    <th className="py-2.5 px-4">Resource</th>
                    <th className="py-2.5 px-4 text-center">Baseline</th>
                    <th className="py-2.5 px-4 text-center">Candidate</th>
                    <th className="py-2.5 px-4 text-right">Classification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-800 font-mono">
                  {summary.findings.map((f) => (
                    <tr key={f.id} className="hover:bg-dark-850/40">
                      <td className="py-2.5 px-4 font-bold text-danger-400">{f.id}</td>
                      <td className="py-2.5 px-4 text-slate-200">
                        {f.role} → {f.action}
                      </td>
                      <td className="py-2.5 px-4 text-slate-300">{f.resource}</td>
                      <td className="py-2.5 px-4 text-center text-slate-400">{f.baselineDecision}</td>
                      <td className="py-2.5 px-4 text-center font-bold text-danger-400">
                        {f.candidateDecision}
                      </td>
                      <td className="py-2.5 px-4 text-right text-slate-300 text-[11px]">
                        {f.classification}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cryptographic Compliance Sign-off Footer */}
          <div className="pt-4 border-t border-dark-800 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-500 font-mono gap-2">
            <span>Verified by PermitProof Engine • IBM Bob 2.0 Hackathon MVP</span>
            <span>Deterministic SHA-256 State Invariant Guaranteed</span>
          </div>
        </div>
      </div>
    </div>
  );
};
