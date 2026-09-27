import React from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  ArrowRight,
  FileCode,
  Search,
  CheckCircle2,
} from 'lucide-react';
import { Finding } from '../types';

interface FindingsTabProps {
  findings: Finding[];
  comparisons?: unknown[];
  onOpenCounterexample: (finding: Finding) => void;
  onOpenTest: (finding: Finding) => void;
  onOpenEvidence: (finding: Finding) => void;
}

export const FindingsTab: React.FC<FindingsTabProps> = ({
  findings,
  onOpenCounterexample,
  onOpenTest,
  onOpenEvidence,
}) => {
  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="bg-dark-900 border border-dark-750 rounded-2xl p-6 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <h2 className="text-xl font-bold text-white tracking-tight">Security & Authorization Regressions</h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-danger-500/20 text-danger-400 border border-danger-500/30">
              {findings.length} Detected
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Divergences between baseline policy v2.8.4 and candidate PR v3.0 that violate security bounds.
          </p>
        </div>
      </div>

      {/* Findings List */}
      {findings.length === 0 ? (
        <div className="bg-dark-900 border border-success-500/30 rounded-2xl p-12 text-center shadow-lg">
          <CheckCircle2 className="w-12 h-12 text-success-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No Authorization Regressions Detected</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
            All 50 scenarios evaluated deterministically against the candidate policy preserve expected authorization invariants.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {findings.map((finding) => {
            const isCritical = finding.severity === 'CRITICAL';

            return (
              <div
                key={finding.id}
                className={`bg-dark-900 rounded-2xl border transition-all duration-200 shadow-xl overflow-hidden ${
                  isCritical
                    ? 'border-danger-500/40 hover:border-danger-500/60'
                    : 'border-warning-500/30 hover:border-warning-500/50'
                }`}
              >
                {/* Top colored strip */}
                <div
                  className={`h-1.5 w-full ${
                    isCritical
                      ? 'bg-gradient-to-r from-danger-500 via-rose-500 to-amber-500'
                      : 'bg-warning-500'
                  }`}
                />

                <div className="p-6 space-y-4">
                  {/* Header Row */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center space-x-2.5">
                      <span
                        className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold border flex items-center space-x-1 ${
                          isCritical
                            ? 'bg-danger-500/20 text-danger-300 border-danger-500/40'
                            : 'bg-warning-500/20 text-warning-300 border-warning-500/40'
                        }`}
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>{finding.severity}</span>
                      </span>

                      <span className="font-mono text-xs font-semibold text-slate-400">
                        {finding.id}
                      </span>

                      <span className="text-slate-600">•</span>

                      <span className="px-2 py-0.5 rounded text-xs font-mono bg-dark-800 text-slate-300 border border-dark-700">
                        {finding.classification}
                      </span>
                    </div>

                    <span className="text-xs text-slate-500 font-mono">
                      Scenario Ref: {finding.scenarioId}
                    </span>
                  </div>

                  {/* Core Finding Title & Vector */}
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
                      <span className="text-indigo-300">{finding.role}</span>
                      <span className="text-slate-500">→</span>
                      <span>{finding.resource}</span>
                      <span className="text-slate-500">→</span>
                      <span className="font-mono text-amber-300 uppercase">{finding.action}</span>
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{finding.summary}</p>
                  </div>

                  {/* Decisions Side by Side & Conditions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    {/* Baseline vs Candidate Diffs */}
                    <div className="bg-dark-850 p-3.5 rounded-xl border border-dark-750 flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono block">
                          Baseline Policy (v2.8.4)
                        </span>
                        <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 text-xs font-mono font-bold inline-block">
                          {finding.baselineDecision}
                        </span>
                      </div>

                      <ArrowRight className="w-5 h-5 text-danger-400" />

                      <div className="space-y-1 text-right">
                        <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono block">
                          Candidate PR (v3.0)
                        </span>
                        <span className="px-2.5 py-1 rounded bg-danger-500/20 text-danger-300 border border-danger-500/40 text-xs font-mono font-bold inline-block">
                          {finding.candidateDecision}
                        </span>
                      </div>
                    </div>

                    {/* Conditions Breakdown */}
                    <div className="bg-dark-850 p-3.5 rounded-xl border border-dark-750 space-y-1">
                      <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono block">
                        Scenario Conditions
                      </span>
                      <div className="flex flex-wrap gap-2 text-xs font-mono pt-0.5">
                        <span
                          className={`px-2 py-0.5 rounded border ${
                            finding.conditions.sameTenant
                              ? 'bg-dark-900 text-slate-300 border-dark-750'
                              : 'bg-danger-500/10 text-danger-400 border-danger-500/30'
                          }`}
                        >
                          {finding.conditions.sameTenant ? 'Same Tenant' : 'Different Tenant'}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-dark-900 text-slate-300 border border-dark-750">
                          {finding.conditions.owner ? 'Owner: Yes' : 'Owner: No'}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded border ${
                            finding.conditions.active
                              ? 'bg-dark-900 text-slate-300 border-dark-750'
                              : 'bg-danger-500/10 text-danger-400 border-danger-500/30'
                          }`}
                        >
                          {finding.conditions.active ? 'Account: Active' : 'Account: Suspended'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-dark-800">
                    <span className="text-xs text-slate-500 italic">
                      "{finding.reason}"
                    </span>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onOpenEvidence(finding)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-dark-800 hover:bg-dark-750 border border-dark-700 transition-colors flex items-center space-x-1.5"
                      >
                        <Search className="w-3.5 h-3.5" />
                        <span>Inspect Evidence</span>
                      </button>

                      <button
                        onClick={() => onOpenCounterexample(finding)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-danger-300 hover:text-white bg-danger-500/10 hover:bg-danger-600 border border-danger-500/30 transition-colors flex items-center space-x-1.5"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Find Counterexample</span>
                      </button>

                      <button
                        onClick={() => onOpenTest(finding)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-500/20 transition-colors flex items-center space-x-1.5"
                      >
                        <FileCode className="w-3.5 h-3.5" />
                        <span>Generate Test</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
