import React, { useState } from 'react';
import {
  Cpu,
  Download,
  Check,
  GitBranch,
  ShieldCheck,
  FileCode,
  Search,
  Bot,
  Terminal,
  CheckCircle2,
} from 'lucide-react';
import { ProofSummary } from '../types';
import { generateBobHandoffMarkdown } from '../engine/bobHandoff';
import { exportCertificateFile } from '../engine/certificate';

interface BobWorkflowTabProps {
  summary: ProofSummary | null;
}

export const BobWorkflowTab: React.FC<BobWorkflowTabProps> = ({ summary }) => {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownloadHandoff = () => {
    if (!summary) return;
    const markdown = generateBobHandoffMarkdown(summary);
    exportCertificateFile(markdown, 'BOB_HANDOFF.md', 'text/markdown');
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  const steps = [
    {
      num: '1',
      title: 'Analyze Repository',
      description: 'IBM Bob analyzes the codebase AST, routes, policies, and authorization decorators.',
      icon: Search,
    },
    {
      num: '2',
      title: 'Map Authorization Logic',
      description: 'Bob identifies baseline vs candidate policy handlers across endpoints and middleware.',
      icon: GitBranch,
    },
    {
      num: '3',
      title: 'Run PermitProof',
      description: 'PermitProof deterministically evaluates the matrix of scenarios against both policies.',
      icon: Cpu,
    },
    {
      num: '4',
      title: 'Investigate Findings',
      description: 'Bob receives minimal counterexamples isolating exact condition divergences.',
      icon: Bot,
    },
    {
      num: '5',
      title: 'Generate Regression Tests',
      description: 'Vitest / Jest guards are deterministically compiled from counterexamples.',
      icon: FileCode,
    },
    {
      num: '6',
      title: 'Review Evidence',
      description: 'Differential audit traces are inspected for tenant boundaries and role scopes.',
      icon: CheckCircle2,
    },
    {
      num: '7',
      title: 'Prepare Change Certificate',
      description: 'Official change certificate generated. CI passes only when status is PROVEN.',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Top Banner */}
      <div className="bg-dark-900 border border-dark-750 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold">
            <Bot className="w-3.5 h-3.5" />
            <span>Autonomous Agent Collaboration</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            How IBM Bob Powers Autonomous Authorization Verification
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            PermitProof provides deterministic ground truth for authorization policies. When a developer PR introduces regressions, PermitProof hands off structured counterexamples and generated tests to IBM Bob to autonomously diagnose and repair the offending code.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              id="continue-bob-btn"
              onClick={handleDownloadHandoff}
              disabled={!summary}
              className={`px-5 py-3 rounded-xl font-bold text-sm flex items-center space-x-2.5 shadow-xl transition-all ${
                !summary
                  ? 'bg-dark-800 text-slate-500 cursor-not-allowed border border-dark-700'
                  : 'bg-brand-600 hover:bg-brand-500 active:bg-brand-700 text-white shadow-brand-500/25 hover:scale-[1.02]'
              }`}
            >
              {downloaded ? (
                <>
                  <Check className="w-4 h-4 text-success-300" />
                  <span>BOB_HANDOFF.md Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Continue with IBM Bob (Export BOB_HANDOFF.md)</span>
                </>
              )}
            </button>
            <span className="text-xs text-slate-400 font-mono">
              Ready for immediate paste or upload into your IBM Bob session.
            </span>
          </div>
        </div>
      </div>

      {/* 7-Step Workflow Grid */}
      <div className="bg-dark-900 border border-dark-750 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-dark-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">The 7-Step Bob & PermitProof Lifecycle</h3>
            <p className="text-xs text-slate-400">
              End-to-end continuous authorization assurance before production deployment.
            </p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-dark-850 border border-dark-750 text-slate-300">
            Step-by-Step Architecture
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="bg-dark-850 border border-dark-750 rounded-xl p-5 space-y-3 hover:border-brand-500/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-dark-900 border border-dark-700 flex items-center justify-center font-mono font-bold text-xs text-brand-400">
                    0{step.num}
                  </div>
                  <Icon className="w-4 h-4 text-slate-400" />
                </div>
                <h4 className="font-bold text-sm text-slate-200">{step.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* IBM Bob Agent Integration Guide */}
      <div className="bg-dark-900 border border-dark-750 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
        <h3 className="text-base font-bold text-white tracking-tight flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-brand-400" />
          <span>IBM Bob Execution Protocol</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          The exported <code className="text-brand-300 font-mono">BOB_HANDOFF.md</code> provides the exact minimal counterexamples, baseline reasons, candidate reasons, and the generated Vitest regression test suites.
        </p>

        <div className="p-4 bg-dark-950 rounded-xl border border-dark-800 text-xs font-mono space-y-2 text-slate-300">
          <div className="text-slate-500">// Example Prompt for IBM Bob Agent:</div>
          <div className="text-brand-300">
            "I have loaded BOB_HANDOFF.md generated by PermitProof. Review the 3 critical findings where candidate PR broke tenant isolation and owner constraints. Fix candidate.ts to pass all regression tests and re-verify until PermitProof issues a PROVEN certificate."
          </div>
        </div>

        <div className="p-4 bg-dark-850 border border-dark-750 rounded-xl text-xs text-slate-400 flex items-start space-x-3">
          <CheckCircle2 className="w-4 h-4 text-success-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-200 block mb-0.5">Evidence Submission Transparency:</strong>
            Session screenshots from your live IBM Bob interaction should be archived in <code className="text-slate-300">bob_sessions/</code> prior to final hackathon submission.
          </div>
        </div>
      </div>
    </div>
  );
};
