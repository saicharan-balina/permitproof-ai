import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { OverviewTab } from './components/OverviewTab';
import { MatrixTab } from './components/MatrixTab';
import { FindingsTab } from './components/FindingsTab';
import { CertificateTab } from './components/CertificateTab';
import { BobWorkflowTab } from './components/BobWorkflowTab';
import { CounterexampleModal } from './components/CounterexampleModal';
import { TestModal } from './components/TestModal';
import { EvidenceModal } from './components/EvidenceModal';
import { runPermitProof } from './engine/comparator';
import { computeMinimalCounterexample } from './engine/counterexample';
import { ProofSummary, Finding, ScenarioComparison } from './types';
import { ShieldCheck } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [summary, setSummary] = useState<ProofSummary | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [progressStep, setProgressStep] = useState<number>(0);

  // Modals state
  const [counterexampleFinding, setCounterexampleFinding] = useState<Finding | null>(null);
  const [testModalFinding, setTestModalFinding] = useState<Finding | null>(null);
  const [evidenceComparison, setEvidenceComparison] = useState<ScenarioComparison | null>(null);

  // Initialize summary deterministically on mount
  useEffect(() => {
    const initialSummary = runPermitProof();
    setSummary(initialSummary);
  }, []);

  const handleRunProof = () => {
    setIsRunning(true);
    setProgressStep(0);

    const stepInterval = setInterval(() => {
      setProgressStep((prev) => {
        if (prev < 5) {
          return prev + 1;
        } else {
          clearInterval(stepInterval);
          setTimeout(() => {
            const freshSummary = runPermitProof();
            setSummary(freshSummary);
            setIsRunning(false);
          }, 300);
          return prev;
        }
      });
    }, 220);
  };

  const handleOpenCounterexample = (finding: Finding) => {
    setCounterexampleFinding(finding);
  };

  const handleOpenTest = (finding: Finding) => {
    setTestModalFinding(finding);
  };

  const handleOpenEvidenceFromFinding = (finding: Finding) => {
    if (!summary) return;
    const match = summary.comparisons.find((c) => c.scenario.id === finding.scenarioId);
    if (match) {
      setEvidenceComparison(match);
    }
  };

  const handleOpenEvidenceFromComparison = (comparison: ScenarioComparison) => {
    setEvidenceComparison(comparison);
  };

  // Find matching scenario for counterexample modal
  const activeCounterexample = React.useMemo(() => {
    if (!counterexampleFinding || !summary) return null;
    const match = summary.comparisons.find((c) => c.scenario.id === counterexampleFinding.scenarioId);
    const scenario = match
      ? match.scenario
      : {
          id: counterexampleFinding.scenarioId,
          name: `${counterexampleFinding.role} ${counterexampleFinding.action} ${counterexampleFinding.resource}`,
          role: counterexampleFinding.role,
          resource: counterexampleFinding.resource,
          action: counterexampleFinding.action,
          conditions: counterexampleFinding.conditions,
        };
    return computeMinimalCounterexample(counterexampleFinding, scenario);
  }, [counterexampleFinding, summary]);

  return (
    <div className="min-h-screen flex flex-col bg-dark-950 text-slate-100">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        summary={summary}
        onRunProof={handleRunProof}
        isRunning={isRunning}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'overview' && (
          <OverviewTab
            summary={summary}
            isRunning={isRunning}
            progressStep={progressStep}
            onRunProof={handleRunProof}
            onSelectTab={setActiveTab}
            onOpenCounterexample={handleOpenCounterexample}
            onOpenTest={handleOpenTest}
            onOpenEvidence={handleOpenEvidenceFromFinding}
          />
        )}

        {activeTab === 'matrix' && summary && (
          <MatrixTab
            comparisons={summary.comparisons}
            onOpenCounterexample={handleOpenCounterexample}
            onOpenTest={handleOpenTest}
            onOpenEvidence={handleOpenEvidenceFromComparison}
          />
        )}

        {activeTab === 'findings' && summary && (
          <FindingsTab
            findings={summary.findings}
            comparisons={summary.comparisons}
            onOpenCounterexample={handleOpenCounterexample}
            onOpenTest={handleOpenTest}
            onOpenEvidence={handleOpenEvidenceFromFinding}
          />
        )}

        {activeTab === 'certificate' && summary && (
          <CertificateTab summary={summary} />
        )}

        {activeTab === 'bob' && (
          <BobWorkflowTab summary={summary} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-dark-800 bg-dark-900/60 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-brand-400" />
            <span className="font-semibold text-slate-300">PermitProof</span>
            <span className="text-slate-600">•</span>
            <span>Prove Authorization Changes Before They Ship</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-slate-400">IBM Bob 2.0 Hackathon Submission</span>
            <span className="text-slate-600">•</span>
            <span className="font-mono text-slate-400">Pure Client-Side Deterministic Engine</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <CounterexampleModal
        counterexample={activeCounterexample}
        onClose={() => setCounterexampleFinding(null)}
        onOpenTest={() => {
          if (counterexampleFinding) {
            setTestModalFinding(counterexampleFinding);
          }
        }}
      />

      <TestModal
        finding={testModalFinding}
        onClose={() => setTestModalFinding(null)}
      />

      <EvidenceModal
        comparison={evidenceComparison}
        onClose={() => setEvidenceComparison(null)}
        onOpenCounterexample={() => {
          if (evidenceComparison?.finding) {
            setCounterexampleFinding(evidenceComparison.finding);
          }
        }}
        onOpenTest={() => {
          if (evidenceComparison?.finding) {
            setTestModalFinding(evidenceComparison.finding);
          }
        }}
      />
    </div>
  );
};
