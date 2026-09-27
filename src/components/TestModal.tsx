import React from 'react';
import { X, Copy, Check, Terminal, FileCode, CheckCircle2 } from 'lucide-react';
import { Finding } from '../types';
import { generateRegressionTest } from '../engine/testGenerator';

interface TestModalProps {
  finding: Finding | null;
  onClose: () => void;
}

export const TestModal: React.FC<TestModalProps> = ({ finding, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!finding) return null;

  const testCode = generateRegressionTest(finding);

  const handleCopy = () => {
    navigator.clipboard.writeText(testCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-dark-900 border border-dark-700 rounded-2xl w-full max-w-3xl shadow-2xl shadow-black/60 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-dark-750 bg-dark-850">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
              <FileCode className="w-4 h-4 text-brand-400" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Automated Regression Test Generator</h3>
              <p className="text-xs text-slate-400 font-mono">
                Vitest / Jest Guard for {finding.role} → {finding.resource}:{finding.action}
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
        <div className="p-6 space-y-4 overflow-y-auto">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              Target Finding: <strong className="text-slate-200">{finding.id}</strong> ({finding.classification})
            </span>
            <span className="font-mono text-brand-400">tests/regression-{finding.id.toLowerCase()}.test.ts</span>
          </div>

          {/* Code Window */}
          <div className="relative rounded-xl overflow-hidden border border-dark-700 bg-dark-950 shadow-inner">
            <div className="flex items-center justify-between px-4 py-2 bg-dark-900 border-b border-dark-800 text-xs font-mono text-slate-400">
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/40 inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/40 inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/40 inline-block"></span>
                <span className="ml-2 text-slate-500">typescript (vitest)</span>
              </div>
              <button
                id="copy-test-btn"
                onClick={handleCopy}
                className="flex items-center space-x-1 text-slate-300 hover:text-white px-2 py-0.5 rounded bg-dark-800 hover:bg-dark-750 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-success-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Test'}</span>
              </button>
            </div>
            <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed whitespace-pre selection:bg-brand-500 selection:text-white">
              <code>{testCode}</code>
            </pre>
          </div>

          {/* Run instructions */}
          <div className="p-3.5 bg-dark-850 border border-dark-750 rounded-xl space-y-2">
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-200">
              <Terminal className="w-3.5 h-3.5 text-brand-400" />
              <span>CI/CD Pipeline Integration</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Add this test to your test suite to permanently guarantee that this authorization regression cannot be reintroduced in future pull requests. Run with:
            </p>
            <div className="bg-dark-950 px-3 py-1.5 rounded-lg font-mono text-xs text-slate-300 border border-dark-800">
              npm run test
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-dark-750 bg-dark-850">
          <span className="text-xs text-slate-400 flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-success-400" />
            <span>Deterministic counterexample verification test</span>
          </span>
          <div className="flex space-x-2">
            <button
              onClick={handleCopy}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 flex items-center space-x-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Test'}</span>
            </button>
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
