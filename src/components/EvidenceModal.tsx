import React from 'react';
import { X, Search, ShieldCheck, ShieldAlert, GitCommit, Layers } from 'lucide-react';
import { ScenarioComparison } from '../types';

interface EvidenceModalProps {
  comparison: ScenarioComparison | null;
  onClose: () => void;
  onOpenCounterexample?: () => void;
  onOpenTest?: () => void;
}

export const EvidenceModal: React.FC<EvidenceModalProps> = ({
  comparison,
  onClose,
  onOpenCounterexample,
  onOpenTest,
}) => {
  if (!comparison) return null;

  const { scenario, baseline, candidate, finding, classification } = comparison;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-dark-900 border border-dark-700 rounded-2xl w-full max-w-3xl shadow-2xl shadow-black/60 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-dark-750 bg-dark-850">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <Search className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Authorization Evidence Inspector</h3>
              <p className="text-xs text-slate-400 font-mono">
                Scenario {scenario.id}: {scenario.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-dark-750 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Status Banner */}
          <div
            className={`p-4 rounded-xl border flex items-center justify-between ${
              comparison.status === 'UNCHANGED'
                ? 'bg-success-500/10 border-success-500/20 text-success-300'
                : 'bg-danger-500/10 border-danger-500/20 text-danger-300'
            }`}
          >
            <div className="flex items-center space-x-3">
              {comparison.status === 'UNCHANGED' ? (
                <ShieldCheck className="w-5 h-5 text-success-400" />
              ) : (
                <ShieldAlert className="w-5 h-5 text-danger-400" />
              )}
              <div>
                <h4 className="font-semibold text-sm">
                  {comparison.status === 'UNCHANGED' ? 'Authorization Decision Invariant Preserved' : 'Authorization Divergence Detected'}
                </h4>
                <p className="text-xs opacity-90 font-mono">Classification: {classification}</p>
              </div>
            </div>
            {finding && (
              <span className="px-2.5 py-1 rounded bg-danger-500/20 text-danger-300 font-mono text-xs font-bold border border-danger-500/30">
                {finding.severity}
              </span>
            )}
          </div>

          {/* Side by Side Evaluation Diffs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Baseline Policy */}
            <div className="bg-dark-850 border border-dark-750 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                  <GitCommit className="w-3.5 h-3.5 text-slate-500" />
                  <span>Baseline Policy (v2.8.4)</span>
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-bold font-mono ${
                    baseline.decision === 'ALLOW'
                      ? 'bg-success-500/10 text-success-400 border border-success-500/20'
                      : 'bg-slate-700/50 text-slate-300 border border-slate-600'
                  }`}
                >
                  {baseline.decision}
                </span>
              </div>
              <div className="bg-dark-900 p-3 rounded-lg border border-dark-800 text-xs text-slate-300 leading-relaxed font-mono">
                {baseline.reason}
              </div>
            </div>

            {/* Candidate Policy */}
            <div className="bg-dark-850 border border-brand-500/30 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-brand-300 flex items-center space-x-1.5">
                  <GitCommit className="w-3.5 h-3.5 text-brand-400" />
                  <span>Candidate PR (v3.0-pr)</span>
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-bold font-mono ${
                    candidate.decision === 'ALLOW'
                      ? 'bg-danger-500/20 text-danger-300 border border-danger-500/40'
                      : 'bg-slate-700/50 text-slate-300 border border-slate-600'
                  }`}
                >
                  {candidate.decision}
                </span>
              </div>
              <div className="bg-dark-900 p-3 rounded-lg border border-dark-800 text-xs text-slate-300 leading-relaxed font-mono">
                {candidate.reason}
              </div>
            </div>
          </div>

          {/* Scenario Details */}
          <div className="bg-dark-850/60 border border-dark-750 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <span>Evaluated Context & Attributes</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-dark-900 p-2.5 rounded-lg border border-dark-800">
                <span className="text-slate-400 block text-[11px]">Role:</span>
                <span className="font-semibold text-slate-200">{scenario.role}</span>
              </div>
              <div className="bg-dark-900 p-2.5 rounded-lg border border-dark-800">
                <span className="text-slate-400 block text-[11px]">Resource:</span>
                <span className="font-semibold text-slate-200">{scenario.resource}</span>
              </div>
              <div className="bg-dark-900 p-2.5 rounded-lg border border-dark-800">
                <span className="text-slate-400 block text-[11px]">Action:</span>
                <span className="font-semibold text-slate-200 font-mono">{scenario.action}</span>
              </div>
              <div className="bg-dark-900 p-2.5 rounded-lg border border-dark-800">
                <span className="text-slate-400 block text-[11px]">Tenant Boundary:</span>
                <span className={`font-semibold ${scenario.conditions.sameTenant ? 'text-slate-200' : 'text-danger-400'}`}>
                  {scenario.conditions.sameTenant ? 'Same Tenant' : 'Cross-Tenant (Violation)'}
                </span>
              </div>
              <div className="bg-dark-900 p-2.5 rounded-lg border border-dark-800">
                <span className="text-slate-400 block text-[11px]">Ownership:</span>
                <span className="font-semibold text-slate-200">
                  {scenario.conditions.owner ? 'Owner (Self)' : 'Not Owner'}
                </span>
              </div>
              <div className="bg-dark-900 p-2.5 rounded-lg border border-dark-800">
                <span className="text-slate-400 block text-[11px]">Account State:</span>
                <span className={`font-semibold ${scenario.conditions.active ? 'text-success-400' : 'text-danger-400'}`}>
                  {scenario.conditions.active ? 'Active' : 'Suspended'}
                </span>
              </div>
            </div>
            {scenario.description && (
              <p className="text-xs text-slate-400 pt-1 italic">{scenario.description}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-dark-750 bg-dark-850">
          <div className="flex items-center space-x-2">
            {finding && onOpenCounterexample && (
              <button
                onClick={() => {
                  onClose();
                  onOpenCounterexample();
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-brand-300 bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/20 transition-colors"
              >
                Find Counterexample
              </button>
            )}
            {finding && onOpenTest && (
              <button
                onClick={() => {
                  onClose();
                  onOpenTest();
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-dark-800 hover:bg-dark-750 border border-dark-700 transition-colors"
              >
                View Test
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-dark-800 hover:bg-dark-750 border border-dark-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
