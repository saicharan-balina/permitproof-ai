import React from 'react';
import { ShieldCheck, ShieldAlert, Cpu, GitBranch, Play } from 'lucide-react';
import { ProofSummary } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  summary: ProofSummary | null;
  onRunProof: () => void;
  isRunning: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  summary,
  onRunProof,
  isRunning,
}) => {
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'matrix', label: 'Authorization Matrix' },
    { id: 'findings', label: 'Findings', badge: summary ? summary.criticalCount : null },
    { id: 'certificate', label: 'Certificate' },
    { id: 'bob', label: 'Bob Workflow' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-dark-900/90 backdrop-blur-md border-b border-dark-750">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('overview')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-400 p-0.5 shadow-lg shadow-brand-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-dark-900 rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-brand-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-white tracking-tight">PermitProof</span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
                  Bob 2.0
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center space-x-1.5">
                <GitBranch className="w-3 h-3 text-slate-500" />
                <span>Northstar Workspace</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400">v2.8.4 → v3.0-pr</span>
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex space-x-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 flex items-center space-x-2 ${
                    isActive
                      ? 'bg-dark-800 text-white border border-dark-700 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-dark-850'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.badge !== null && tab.badge !== undefined && tab.badge > 0 && (
                    <span className="bg-danger-500/20 text-danger-400 border border-danger-500/30 text-xs px-1.5 py-0.2 rounded-full font-mono font-bold">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action button & Engine Status */}
          <div className="flex items-center space-x-3">
            {summary && (
              <div
                className={`hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-medium border ${
                  summary.status === 'PROVEN'
                    ? 'bg-success-500/10 text-success-400 border-success-500/20'
                    : 'bg-danger-500/10 text-danger-400 border-danger-500/20'
                }`}
              >
                {summary.status === 'PROVEN' ? (
                  <ShieldCheck className="w-3.5 h-3.5" />
                ) : (
                  <ShieldAlert className="w-3.5 h-3.5" />
                )}
                <span>VERDICT: {summary.status}</span>
              </div>
            )}

            <button
              id="header-run-proof-btn"
              onClick={onRunProof}
              disabled={isRunning}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold flex items-center space-x-2 transition-all duration-150 shadow-md ${
                isRunning
                  ? 'bg-brand-600/50 text-slate-300 cursor-not-allowed'
                  : 'bg-brand-600 hover:bg-brand-500 active:bg-brand-700 text-white shadow-brand-500/25 hover:shadow-brand-500/40'
              }`}
            >
              {isRunning ? (
                <>
                  <Cpu className="w-4 h-4 animate-spin text-brand-200" />
                  <span>Proving...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run Proof</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden overflow-x-auto py-2 space-x-1 border-t border-dark-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-dark-800 text-white border border-dark-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
              {tab.badge !== null && tab.badge !== undefined && tab.badge > 0 && (
                <span className="ml-1 text-danger-400 font-bold">({tab.badge})</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
