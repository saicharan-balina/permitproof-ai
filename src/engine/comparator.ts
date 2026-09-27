import {
  Scenario,
  ScenarioComparison,
  Finding,
  DeltaClassification,
  Severity,
  ProofSummary,
} from '../types';
import { evaluateBaseline } from './baseline';
import { evaluateCandidate } from './candidate';
import { DETERMINISTIC_SCENARIOS } from './scenarios';

/**
 * Classifies the delta between baseline and candidate evaluation.
 */
export function classifyDelta(
  scenario: Scenario,
  baselineDecision: 'ALLOW' | 'DENY',
  candidateDecision: 'ALLOW' | 'DENY'
): { classification: DeltaClassification; severity: Severity; category: Finding['category'] } {
  if (baselineDecision === candidateDecision) {
    return { classification: 'UNCHANGED', severity: 'LOW', category: 'REGRESSION' };
  }

  // If candidate allowed what baseline denied
  if (baselineDecision === 'DENY' && candidateDecision === 'ALLOW') {
    // 1. Cross-tenant leakage
    if (!scenario.conditions.sameTenant) {
      return {
        classification: 'TENANT_ISOLATION_FAILURE',
        severity: 'CRITICAL',
        category: 'ISOLATION_BREACH',
      };
    }

    // 2. Suspended user account bypass
    if (!scenario.conditions.active) {
      return {
        classification: 'PRIVILEGE_ESCALATION',
        severity: 'CRITICAL',
        category: 'REGRESSION',
      };
    }

    // 3. Unowned resource destruction / mutation
    if (scenario.action === 'delete' && !scenario.conditions.owner) {
      return {
        classification: 'PRIVILEGE_ESCALATION',
        severity: 'CRITICAL',
        category: 'REGRESSION',
      };
    }

    // 4. Unauthorized data export (PII Leakage)
    if (scenario.action === 'export') {
      return {
        classification: 'PRIVILEGE_ESCALATION',
        severity: 'CRITICAL',
        category: 'UNINTENDED_EXPANSION',
      };
    }

    // 5. Unauthorized privilege escalation (e.g. Viewer mutating)
    if (scenario.role === 'Viewer' && (scenario.action === 'update' || scenario.action === 'create' || scenario.action === 'delete')) {
      return {
        classification: 'PRIVILEGE_ESCALATION',
        severity: 'CRITICAL',
        category: 'REGRESSION',
      };
    }

    return {
      classification: 'ACCESS_GRANTED',
      severity: 'HIGH',
      category: 'UNINTENDED_EXPANSION',
    };
  }

  // If candidate denied what baseline allowed (Regression/Outage)
  return {
    classification: 'ACCESS_REVOKED',
    severity: 'MEDIUM',
    category: 'ACCESS_REVOCATION',
  };
}

/**
 * Evaluates all scenarios deterministically and computes comparisons, deltas, and findings.
 */
export function runPermitProof(scenarios: Scenario[] = DETERMINISTIC_SCENARIOS): ProofSummary {
  const comparisons: ScenarioComparison[] = [];
  const findings: Finding[] = [];

  let findingCounter = 1;

  for (const scenario of scenarios) {
    const baseline = evaluateBaseline(scenario);
    const candidate = evaluateCandidate(scenario);
    const isUnchanged = baseline.decision === candidate.decision;

    const { classification, severity, category } = classifyDelta(
      scenario,
      baseline.decision,
      candidate.decision
    );

    let finding: Finding | undefined = undefined;

    if (!isUnchanged) {
      let summary = '';
      if (classification === 'TENANT_ISOLATION_FAILURE') {
        summary = `Cross-tenant boundary breach: ${scenario.role} was granted ${scenario.action} access to ${scenario.resource} belonging to another tenant.`;
      } else if (classification === 'PRIVILEGE_ESCALATION') {
        if (!scenario.conditions.active) {
          summary = `Account state enforcement failure: Suspended user retained ${scenario.action} rights on ${scenario.resource}.`;
        } else if (scenario.action === 'export') {
          summary = `PII exfiltration risk: ${scenario.role} was granted unauthorized bulk ${scenario.action} rights for ${scenario.resource}.`;
        } else if (scenario.action === 'delete' && !scenario.conditions.owner) {
          summary = `Resource isolation failure: ${scenario.role} was allowed to delete an unowned ${scenario.resource}.`;
        } else {
          summary = `Privilege escalation: ${scenario.role} was granted unauthorized ${scenario.action} permission on ${scenario.resource}.`;
        }
      } else if (classification === 'ACCESS_GRANTED') {
        summary = `Access expanded unexpectedly: ${scenario.role} was granted ${scenario.action} on ${scenario.resource}.`;
      } else {
        summary = `Legitimate access was revoked: ${scenario.role} can no longer ${scenario.action} ${scenario.resource}.`;
      }

      finding = {
        id: `FND-${String(findingCounter++).padStart(3, '0')}`,
        scenarioId: scenario.id,
        severity,
        classification,
        role: scenario.role,
        resource: scenario.resource,
        action: scenario.action,
        conditions: scenario.conditions,
        baselineDecision: baseline.decision,
        candidateDecision: candidate.decision,
        baselineReason: baseline.reason,
        candidateReason: candidate.reason,
        reason: candidate.reason,
        summary,
        category,
      };

      findings.push(finding);
    }

    comparisons.push({
      scenario,
      baseline,
      candidate,
      status: isUnchanged ? 'UNCHANGED' : 'CHANGED',
      classification,
      finding,
    });
  }

  const unchangedCount = comparisons.filter((c) => c.status === 'UNCHANGED').length;
  const changedCount = comparisons.filter((c) => c.status === 'CHANGED').length;
  const criticalCount = findings.filter((f) => f.severity === 'CRITICAL').length;

  // Rule: If any critical authorization regression exists: NOT PROVEN. Otherwise: PROVEN.
  const status: 'PROVEN' | 'NOT PROVEN' = criticalCount > 0 ? 'NOT PROVEN' : 'PROVEN';

  return {
    runId: `run-${new Date().toISOString().split(/[^0-9]/).join('').slice(0, 14)}`,
    timestamp: new Date().toISOString(),
    project: 'Northstar Workspace',
    baselineVersion: 'permission-policy-v2.8.4',
    candidateVersion: 'permission-policy-v3-pr',
    totalScenarios: scenarios.length,
    unchangedCount,
    changedCount,
    criticalCount,
    status,
    comparisons,
    findings,
  };
}
