import React, { useState, useMemo } from 'react';
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Eye,
} from 'lucide-react';
import { ScenarioComparison } from '../types';

interface MatrixTabProps {
  comparisons: ScenarioComparison[];
  onOpenCounterexample: (finding: any) => void;
  onOpenTest: (finding: any) => void;
  onOpenEvidence: (comparison: ScenarioComparison) => void;
}

export const MatrixTab: React.FC<MatrixTabProps> = ({
  comparisons,
  onOpenCounterexample,
  onOpenTest,
  onOpenEvidence,
}) => {
  const [search, setSearch] = useState('');
  const [showOnlyChanged, setShowOnlyChanged] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [selectedResource, setSelectedResource] = useState<string>('ALL');

  const filteredComparisons = useMemo(() => {
    return comparisons.filter((c) => {
      if (showOnlyChanged && c.status === 'UNCHANGED') {
        return false;
      }
      if (selectedRole !== 'ALL' && c.scenario.role !== selectedRole) {
        return false;
      }
      if (selectedResource !== 'ALL' && c.scenario.resource !== selectedResource) {
        return false;
      }
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchRole = c.scenario.role.toLowerCase().includes(query);
        const matchResource = c.scenario.resource.toLowerCase().includes(query);
        const matchAction = c.scenario.action.toLowerCase().includes(query);
        const matchId = c.scenario.id.toLowerCase().includes(query);
        const matchName = c.scenario.name.toLowerCase().includes(query);
        if (!matchRole && !matchResource && !matchAction && !matchId && !matchName) {
          return false;
        }
      }
      return true;
    });
  }, [comparisons, showOnlyChanged, selectedRole, selectedResource, search]);

  const changedCount = useMemo(
    () => comparisons.filter((c) => c.status === 'CHANGED').length,
    [comparisons]
  );

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Header & Filters Bar */}
      <div className="bg-dark-900 border border-dark-750 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Authorization Decision Matrix</h2>
            <p className="text-xs text-slate-400">
              Deterministic verification grid evaluating {comparisons.length} enterprise access scenarios.
            </p>
          </div>

          {/* Toggle Show Only Changed */}
          <div className="flex items-center space-x-3 bg-dark-850 px-3.5 py-2 rounded-xl border border-dark-700">
            <label htmlFor="filter-show-changed" className="text-xs font-medium text-slate-300 cursor-pointer select-none">
              Show Only Changed ({changedCount})
            </label>
            <input
              id="filter-show-changed"
              type="checkbox"
              checked={showOnlyChanged}
              onChange={(e) => setShowOnlyChanged(e.target.checked)}
              className="w-4 h-4 rounded text-brand-600 bg-dark-900 border-dark-600 focus:ring-brand-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Search & Dropdown Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              id="matrix-search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search role, resource, action, id..."
              className="w-full bg-dark-950 border border-dark-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>

          {/* Role Filter */}
          <div className="relative">
            <select
              id="matrix-role-filter"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500 transition-colors cursor-pointer"
            >
              <option value="ALL">All Roles</option>
              <option value="Super Admin">Super Admin</option>
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Support">Support</option>
              <option value="Analyst">Analyst</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>

          {/* Resource Filter */}
          <div className="relative">
            <select
              id="matrix-resource-filter"
              value={selectedResource}
              onChange={(e) => setSelectedResource(e.target.value)}
              className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500 transition-colors cursor-pointer"
            >
              <option value="ALL">All Resources</option>
              <option value="Customer Profiles">Customer Profiles</option>
              <option value="Projects">Projects</option>
              <option value="Invoices">Invoices</option>
              <option value="Audit Logs">Audit Logs</option>
              <option value="API Keys">API Keys</option>
              <option value="Internal Notes">Internal Notes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="bg-dark-900 border border-dark-750 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-dark-850 text-slate-400 font-mono uppercase text-[11px] border-b border-dark-750">
              <tr>
                <th className="py-3 px-4">Scenario</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Resource</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Conditions</th>
                <th className="py-3 px-4 text-center">Baseline</th>
                <th className="py-3 px-4 text-center">Candidate</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800 text-slate-300">
              {filteredComparisons.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500 italic">
                    No matching scenarios found for the selected filters.
                  </td>
                </tr>
              ) : (
                filteredComparisons.map((item) => {
                  const isChanged = item.status === 'CHANGED';
                  const isCritical = item.finding?.severity === 'CRITICAL';

                  return (
                    <tr
                      key={item.scenario.id}
                      className={`hover:bg-dark-850/60 transition-colors ${
                        isCritical
                          ? 'bg-danger-950/20'
                          : isChanged
                          ? 'bg-warning-950/15'
                          : ''
                      }`}
                    >
                      {/* Scenario ID */}
                      <td className="py-3 px-4 font-mono font-medium text-slate-400">
                        {item.scenario.id}
                      </td>

                      {/* Role */}
                      <td className="py-3 px-4 font-semibold text-slate-200">
                        {item.scenario.role}
                      </td>

                      {/* Resource */}
                      <td className="py-3 px-4 text-slate-200">
                        {item.scenario.resource}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 font-mono">
                        <span className="px-1.5 py-0.5 rounded bg-dark-950 border border-dark-750 text-slate-300">
                          {item.scenario.action}
                        </span>
                      </td>

                      {/* Conditions */}
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                        <span className={item.scenario.conditions.sameTenant ? '' : 'text-danger-400 font-bold'}>
                          {item.scenario.conditions.sameTenant ? 'SameTenant' : 'CrossTenant'}
                        </span>
                        {' • '}
                        <span>{item.scenario.conditions.owner ? 'Owner' : 'Unowned'}</span>
                        {' • '}
                        <span className={item.scenario.conditions.active ? 'text-slate-400' : 'text-danger-400 font-bold'}>
                          {item.scenario.conditions.active ? 'Active' : 'Suspended'}
                        </span>
                      </td>

                      {/* Baseline */}
                      <td className="py-3 px-4 text-center font-mono">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            item.baseline.decision === 'ALLOW'
                              ? 'bg-success-500/10 text-success-400 border border-success-500/20'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}
                        >
                          {item.baseline.decision}
                        </span>
                      </td>

                      {/* Candidate */}
                      <td className="py-3 px-4 text-center font-mono">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            item.candidate.decision === 'ALLOW'
                              ? isCritical
                                ? 'bg-danger-500/20 text-danger-300 border border-danger-500/40 animate-pulse'
                                : 'bg-success-500/10 text-success-400 border border-success-500/20'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}
                        >
                          {item.candidate.decision}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3 px-4 text-center font-mono font-bold text-[10px]">
                        {isCritical ? (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-danger-500/20 text-danger-400 border border-danger-500/30">
                            <ShieldAlert className="w-3 h-3" />
                            <span>CRITICAL</span>
                          </span>
                        ) : isChanged ? (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-warning-500/10 text-warning-400 border border-warning-500/20">
                            <AlertTriangle className="w-3 h-3" />
                            <span>CHANGED</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-success-500/10 text-success-400 border border-success-500/20">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>PASS</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => onOpenEvidence(item)}
                            title="Inspect Evidence"
                            className="p-1 rounded text-slate-400 hover:text-white hover:bg-dark-800 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          {item.finding && (
                            <>
                              <button
                                onClick={() => onOpenCounterexample(item.finding)}
                                title="Find Minimal Counterexample"
                                className="px-1.5 py-0.5 rounded text-[11px] font-semibold text-danger-400 bg-danger-500/10 hover:bg-danger-500/20 border border-danger-500/20 transition-colors"
                              >
                                Counterex
                              </button>
                              <button
                                onClick={() => onOpenTest(item.finding)}
                                title="Generate Regression Test"
                                className="px-1.5 py-0.5 rounded text-[11px] font-semibold text-brand-400 bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/20 transition-colors"
                              >
                                Test
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="px-5 py-3 bg-dark-850 border-t border-dark-750 flex items-center justify-between text-xs text-slate-400">
          <span>Showing {filteredComparisons.length} of {comparisons.length} scenarios</span>
          <span className="font-mono text-slate-500">PermitProof Deterministic Matrix v1.0</span>
        </div>
      </div>
    </div>
  );
};
