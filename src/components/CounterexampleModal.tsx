import React from 'react';
import { X, AlertTriangle, ArrowRight, ShieldX, Copy, Check, Code2 } from 'lucide-react';
import { MinimalCounterexample } from '../types';

interface CounterexampleModalProps {
  counterexample: MinimalCounterexample | null;
  onClose: () => void;
  onOpenTest: () => void;
}

export const CounterexampleModal: React.FC<CounterexampleModalProps> = ({
  counterexample,
  onClose,
  onOpenTest,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!counterexample) return null;

  const { originalScenario, finding, minimalFactors, explanation, diffSummary } = counterexample;

  const copyCounterexampleText = () => {
    const text = `MINIMAL COUNTEREXAMPLE
Role: ${minimalFactors.role}
Resource: ${minimalFactors.resource}
Action: ${minimalFactors.action}
Key Condition: ${minimalFactors.criticalCondition}
Baseline: ${finding.baselineDecision}
Candidate: ${finding.candidateDecision}
Diff: ${diffSummary}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-dark-900 border border-dark-700 rounded-2xl w-full max-w-2xl shadow-2xl shadow-black/60 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-dark-750 bg-dark-850">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-danger-500/10 border border-danger-500/20 flex items-center justify-center">
              <ShieldX className="w-4 h-4 text-danger-400" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Minimal Counterexample Analysis</h3>
              <p className="text-xs text-slate-400 font-mono">Finding ID: {finding.id} • {finding.classification}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-dark-750 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Comparison Cards: Original vs Counterexample */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Original Scenario */}
            <div className="bg-dark-850/80 border border-dark-750 rounded-xl p-4">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block mb-3">
                Original Evaluated Scenario
              </span>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-dark-800">
                  <span className="text-slate-400">Role:</span>
                  <span className="font-semibold text-slate-200">{originalScenario.role}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-dark-800">
                  <span className="text-slate-400">Resource:</span>
                  <span className="font-semibold text-slate-200">{originalScenario.resource}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-dark-800">
                  <span className="text-slate-400">Action:</span>
                  <span className="font-semibold text-slate-200 font-mono">{originalScenario.action}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-dark-800">
                  <span className="text-slate-400">Tenant:</span>
                  <span className={`font-semibold ${originalScenario.conditions.sameTenant ? 'text-slate-200' : 'text-danger-400'}`}>
                    {originalScenario.conditions.sameTenant ? 'Same Tenant' : 'Tenant-B (Different Tenant)'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-dark-800">
                  <span className="text-slate-400">Owner:</span>
                  <span className="font-semibold text-slate-200">
                    {originalScenario.conditions.owner ? 'Yes (Owner)' : 'No (Non-Owner)'}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Account State:</span>
                  <span className={`font-semibold ${originalScenario.conditions.active ? 'text-success-400' : 'text-danger-400'}`}>
                    {originalScenario.conditions.active ? 'Active' : 'Suspended'}
                  </span>
                </div>
              </div>
            </div>

            {/* Minimal Counterexample */}
            <div className="bg-dark-850/80 border border-brand-500/30 rounded-xl p-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 px-2.5 py-0.5 bg-brand-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-bl-lg">
                Minimal
              </div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-brand-400 font-semibold block mb-3">
                Minimal Counterexample
              </span>
              <div className="p-3 bg-dark-900 rounded-lg border border-dark-750 mb-3 text-sm space-y-1.5 font-mono">
                <div className="text-brand-300 font-semibold">{minimalFactors.role}</div>
                <div className="text-slate-500 text-xs">+</div>
                <div className="text-brand-300 font-semibold">{minimalFactors.resource}</div>
                <div className="text-slate-500 text-xs">+</div>
                <div className="text-brand-300 font-semibold">{minimalFactors.action}</div>
                <div className="text-slate-500 text-xs">+</div>
                <div className="text-danger-400 font-bold bg-danger-500/10 px-2 py-0.5 rounded border border-danger-500/20 inline-block">
                  {minimalFactors.criticalCondition}
                </div>
              </div>
              <div className="text-xs text-slate-300 leading-relaxed bg-dark-900/50 p-2.5 rounded border border-dark-800">
                <span className="text-slate-400">Diff: </span>
                <span className="text-danger-300 font-mono font-medium">{diffSummary}</span>
              </div>
            </div>
          </div>

          {/* Explanation banner */}
          <div className="p-3.5 bg-dark-800/80 border border-dark-700 rounded-xl flex items-start space-x-3">
            <AlertTriangle className="w-4 h-4 text-warning-400 mt-0.5 shrink-0" />
            <div className="text-xs text-slate-300 leading-relaxed">
              <p className="font-semibold text-slate-200 mb-1">{explanation}</p>
              <p className="text-slate-400">
                Notice: Minimal counterexamples isolate the root failure attributes without generating exploit payloads, adhering strictly to enterprise security testing standards.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-dark-750 bg-dark-850">
          <button
            onClick={copyCounterexampleText}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-dark-800 hover:bg-dark-750 border border-dark-700 flex items-center space-x-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-success-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Counterexample'}</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              Close
            </button>
            <button
              id="counterexample-generate-test-btn"
              onClick={() => {
                onClose();
                onOpenTest();
              }}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-500/20 flex items-center space-x-1.5 transition-colors"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Generate Regression Test</span>
              <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
