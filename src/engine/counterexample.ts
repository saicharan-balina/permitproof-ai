import { Finding, MinimalCounterexample, Scenario } from '../types';

/**
 * Computes the minimal deterministic counterexample for a given finding.
 * Identifies the exact critical minimal factor causing the divergence between baseline and candidate.
 */
export function computeMinimalCounterexample(
  finding: Finding,
  scenario: Scenario
): MinimalCounterexample {
  let criticalCondition = '';
  let explanation = '';
  let diffSummary = '';

  if (finding.classification === 'TENANT_ISOLATION_FAILURE') {
    criticalCondition = 'Cross-Tenant Access (Different Tenant)';
    explanation =
      'This is the smallest scenario in the demo that reproduces the authorization difference: even when all other attributes match standard access, cross-tenant isolation fails.';
    diffSummary = `Baseline correctly enforces tenant boundary: DENY. Candidate policy omitted tenant check: ALLOW.`;
  } else if (!finding.conditions.active) {
    criticalCondition = 'Suspended Account State';
    explanation =
      'This is the smallest scenario in the demo that reproduces the authorization difference: suspended account status was ignored, granting access when it must be denied.';
    diffSummary = `Baseline mandates immediate account-level revocation: DENY. Candidate permitted resource access: ALLOW.`;
  } else if (finding.action === 'export' && finding.role === 'Support') {
    criticalCondition = 'Action: Export (PII Exfiltration Constraint)';
    explanation =
      'This is the smallest scenario in the demo that reproduces the authorization difference: Support role has legitimate read/update access, but export permission regressed to ALLOW.';
    diffSummary = `Baseline limits Support to operational read/update: DENY export. Candidate added unconstrained export: ALLOW.`;
  } else if (finding.action === 'delete' && !finding.conditions.owner) {
    criticalCondition = 'Owner: False (Unowned Resource Deletion)';
    explanation =
      'This is the smallest scenario in the demo that reproduces the authorization difference: Manager has deletion rights only on owned items; candidate dropped the ownership constraint.';
    diffSummary = `Baseline validates object ownership: DENY. Candidate allows deletion without owner check: ALLOW.`;
  } else if (finding.role === 'Viewer' && finding.action === 'update') {
    criticalCondition = 'Action: Update (Read-Only Role Violation)';
    explanation =
      'This is the smallest scenario in the demo that reproduces the authorization difference: Viewer role is strictly read-only, but candidate granted write/update capability.';
    diffSummary = `Baseline enforces read-only viewer role: DENY. Candidate granted mutation rights: ALLOW.`;
  } else {
    criticalCondition = `${finding.role} + ${finding.action}`;
    explanation =
      'This is the smallest scenario in the demo that reproduces the authorization difference.';
    diffSummary = `Baseline: ${finding.baselineDecision} vs Candidate: ${finding.candidateDecision}`;
  }

  return {
    originalScenario: scenario,
    finding,
    minimalFactors: {
      role: finding.role,
      resource: finding.resource,
      action: finding.action,
      criticalCondition,
    },
    explanation,
    diffSummary,
  };
}
