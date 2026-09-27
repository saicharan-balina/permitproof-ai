import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Play,
  ArrowRight,
  AlertTriangle,
  Layers,
  CheckCircle2,
  FileCode,
  Search,
  Sparkles,
  GitCompare,
  Zap,
} from 'lucide-react';
import { ProofSummary, Finding } from '../types';

interface OverviewTabProps {
  summary: ProofSummary | null;
  isRunning: boolean;
  progressStep: number;
  onRunProof: () => void;
  onSelectTab: (tab: string) => void;
  onOpenCounterexample: (finding: Finding) => void;
  onOpenTest: (finding: Finding) => void;
  onOpenEvidence: (finding: Finding) => void;
}

const PROGRESS_STEPS = [
  'Loading scenarios...',
  'Evaluating baseline policy (v2.8.4)...',
  'Evaluating candidate PR policy (v3.0-pr)...',
  'Comparing access decisions deterministically...',
  'Finding authorization deltas & security regressions...',
  'Building cryptographically verifiable evidence...',
];

export const OverviewTab: React.FC<OverviewTabProps> = ({
  summary,
  isRunning,
  progressStep,
  onRunProof,
  onSelectTab,
  onOpenCounterexample,
  onOpenTest,
  onOpenEvidence,
}) => {
  const topCriticalFinding = summary?.findings.find(
    (f) => f.role === 'Support' && f.resource === 'Customer Profiles' && f.action === 'export'
  ) || summary?.findings[0];

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-dark-900 via-dark-900 to-dark-850 border border-dark-750 p-8 sm:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-danger-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Bob 2.0 Autonomous Verification Engine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight sm:leading-none mb-4">
            Authorization changed. <br />
            <span className="bg-gradient-to-r from-brand-400 via-indigo-300 to-slate-200 bg-clip-text text-transparent">
              Who can access what now?
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl">
            Deterministic verification for authorization-sensitive code changes. Compare baseline and candidate implementations across realistic scenarios without stochastic hallucinations or external dependencies.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              id="hero-run-proof-btn"
              onClick={onRunProof}
              disabled={isRunning}
              className={`px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base flex items-center space-x-2.5 shadow-xl transition-all duration-200 ${
                isRunning
                  ? 'bg-brand-600/50 text-slate-300 cursor-not-allowed'
                  : 'bg-brand-600 hover:bg-brand-500 active:bg-brand-700 text-white shadow-brand-500/30 hover:scale-[1.02]'
              }`}
            >
              {isRunning ? (
                <>
                  <Zap className="w-5 h-5 animate-spin" />
                  <span>Evaluating 50 Scenarios...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Run Authorization Proof</span>
                </>
              )}
            </button>

            <button
              onClick={() => onSelectTab('matrix')}
              className="px-5 py-3.5 rounded-xl font-semibold text-sm sm:text-base text-slate-300 hover:text-white bg-dark-800 hover:bg-dark-750 border border-dark-700 transition-colors flex items-center space-x-2"
            >
              <Layers className="w-4 h-4" />
              <span>Explore Matrix</span>
            </button>
          </div>
        </div>

        {/* Running Progress Animation */}
        {isRunning && (
          <div className="mt-8 p-6 bg-dark-950/90 border border-brand-500/40 rounded-2xl animate-pulse-glow">
            <div className="flex items-center justify-between mb-3 text-xs font-mono text-brand-300">
              <span className="font-semibold flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-brand-400 animate-ping inline-block" />
                <span>Deterministic Differential Analysis in Progress</span>
              </span>
              <span>{Math.round(((progressStep + 1) / PROGRESS_STEPS.length) * 100)}%</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-dark-800 rounded-full h-2 mb-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-brand-500 to-indigo-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((progressStep + 1) / PROGRESS_STEPS.length) * 100}%` }}
              />
            </div>

            <p className="text-sm font-mono text-slate-200 flex items-center space-x-2">
              <span className="text-brand-400">❯</span>
              <span>{PROGRESS_STEPS[progressStep] || 'Evaluating scenarios...'}</span>
            </p>
          </div>
        )}
      </div>

      {/* Metrics Section (Only shown after evaluation / when summary is available) */}
      {summary && !isRunning && (
        <div className="space-y-8 animate-fadeIn">
          {/* Key Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Scenarios Evaluated */}
            <div className="bg-dark-900 border border-dark-750 rounded-2xl p-5 shadow-lg">
              <span className="text-xs font-medium text-slate-400 block mb-1">Total Scenarios</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                {summary.totalScenarios}
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">Deterministic Suite</span>
            </div>

            {/* Unchanged / Passing */}
            <div className="bg-dark-900 border border-dark-750 rounded-2xl p-5 shadow-lg">
              <span className="text-xs font-medium text-slate-400 block mb-1">Unchanged Decisions</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-success-400 font-mono">
                {summary.unchangedCount}
              </div>
              <span className="text-[11px] text-success-500/80 mt-1 block flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Behavior Preserved</span>
              </span>
            </div>

            {/* Access Changes */}
            <div className="bg-dark-900 border border-dark-750 rounded-2xl p-5 shadow-lg">
              <span className="text-xs font-medium text-slate-400 block mb-1">Access Changes</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-warning-400 font-mono">
                {summary.changedCount}
              </div>
              <span className="text-[11px] text-warning-500/80 mt-1 block">Policy Deltas</span>
            </div>

            {/* Critical Findings */}
            <div className="bg-dark-900 border border-danger-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-danger-500/10 rounded-full blur-xl pointer-events-none" />
              <span className="text-xs font-medium text-danger-300 block mb-1">Critical Findings</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-danger-400 font-mono">
                {summary.criticalCount}
              </div>
              <span className="text-[11px] text-danger-400/80 mt-1 block font-semibold">
                Security Regressions
              </span>
            </div>

            {/* Verification Verdict */}
            <div
              className={`col-span-2 lg:col-span-1 rounded-2xl p-5 shadow-lg border flex flex-col justify-between ${
                summary.status === 'PROVEN'
                  ? 'bg-success-500/10 border-success-500/30'
                  : 'bg-danger-500/15 border-danger-500/40'
              }`}
            >
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Change Verdict
              </span>
              <div className="my-1">
                <div
                  className={`text-xl sm:text-2xl font-black font-mono tracking-tight flex items-center space-x-2 ${
                    summary.status === 'PROVEN' ? 'text-success-400' : 'text-danger-400'
                  }`}
                >
                  {summary.status === 'PROVEN' ? (
                    <ShieldCheck className="w-6 h-6" />
                  ) : (
                    <ShieldAlert className="w-6 h-6" />
                  )}
                  <span>{summary.status}</span>
                </div>
              </div>
              <span className="text-[11px] text-slate-400">Zero Critical Regressions Rule</span>
            </div>
          </div>

          {/* Primary Critical Regression Highlight */}
          {topCriticalFinding && (
            <div className="bg-gradient-to-r from-danger-950/60 via-dark-900 to-dark-900 border border-danger-500/30 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-danger-500/20 text-danger-400 border border-danger-500/30">
                      CRITICAL REGRESSION SPOTLIGHT
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-mono bg-dark-800 text-slate-300 border border-dark-700">
                      {topCriticalFinding.classification}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {topCriticalFinding.role} → {topCriticalFinding.resource} ({topCriticalFinding.action})
                  </h3>

                  <div className="flex items-center space-x-3 text-sm font-mono">
                    <span className="text-slate-400">Baseline:</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-bold">
                      {topCriticalFinding.baselineDecision}
                    </span>
                    <ArrowRight className="w-4 h-4 text-danger-400" />
                    <span className="text-slate-400">Candidate:</span>
                    <span className="px-2 py-0.5 rounded bg-danger-500/20 text-danger-300 border border-danger-500/40 font-bold">
                      {topCriticalFinding.candidateDecision}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {topCriticalFinding.summary}
                  </p>
                </div>

                {/* Direct Action Buttons */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full sm:w-auto shrink-0">
                  <button
                    id="spotlight-counterexample-btn"
                    onClick={() => onOpenCounterexample(topCriticalFinding)}
                    className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-danger-600 hover:bg-danger-500 shadow-md shadow-danger-600/20 flex items-center justify-center space-x-2 transition-colors"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>Find Counterexample</span>
                  </button>
                  <button
                    id="spotlight-test-btn"
                    onClick={() => onOpenTest(topCriticalFinding)}
                    className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-200 bg-dark-800 hover:bg-dark-750 border border-dark-700 flex items-center justify-center space-x-2 transition-colors"
                  >
                    <FileCode className="w-4 h-4 text-brand-400" />
                    <span>Generate Regression Test</span>
                  </button>
                  <button
                    id="spotlight-evidence-btn"
                    onClick={() => onOpenEvidence(topCriticalFinding)}
                    className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-400 hover:text-slate-200 bg-dark-850 hover:bg-dark-800 border border-dark-750 flex items-center justify-center space-x-2 transition-colors"
                  >
                    <Search className="w-4 h-4" />
                    <span>Inspect Evidence</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Quick Workflow Walkthrough */}
          <div className="bg-dark-900 border border-dark-750 rounded-2xl p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 font-mono mb-4 flex items-center space-x-2">
              <GitCompare className="w-4 h-4 text-brand-400" />
              <span>Deterministic Verification Sequence</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div
                className="p-3.5 bg-dark-850 rounded-xl border border-dark-800 cursor-pointer hover:border-brand-500/40 transition-colors"
                onClick={() => onSelectTab('matrix')}
              >
                <div className="font-bold text-slate-200 mb-1">1. Authorization Matrix</div>
                <p className="text-slate-400 leading-relaxed">
                  Interactive side-by-side grid comparing every role and action against baseline.
                </p>
              </div>
              <div
                className="p-3.5 bg-dark-850 rounded-xl border border-dark-800 cursor-pointer hover:border-brand-500/40 transition-colors"
                onClick={() => onSelectTab('findings')}
              >
                <div className="font-bold text-slate-200 mb-1">2. Security Findings</div>
                <p className="text-slate-400 leading-relaxed">
                  Isolate critical privilege escalations and tenant boundary leaks.
                </p>
              </div>
              <div
                className="p-3.5 bg-dark-850 rounded-xl border border-dark-800 cursor-pointer hover:border-brand-500/40 transition-colors"
                onClick={() => onSelectTab('certificate')}
              >
                <div className="font-bold text-slate-200 mb-1">3. Change Certificate</div>
                <p className="text-slate-400 leading-relaxed">
                  Cryptographically structured compliance proof for PR audits and CI gating.
                </p>
              </div>
              <div
                className="p-3.5 bg-dark-850 rounded-xl border border-dark-800 cursor-pointer hover:border-brand-500/40 transition-colors"
                onClick={() => onSelectTab('bob')}
              >
                <div className="font-bold text-slate-200 mb-1">4. IBM Bob Handoff</div>
                <p className="text-slate-400 leading-relaxed">
                  Export structured dossier for IBM Bob to remediate policy defects.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
