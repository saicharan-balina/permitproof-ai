import { describe, it, expect } from 'vitest';
import { evaluateBaseline } from './baseline';
import { evaluateCandidate } from './candidate';
import { DETERMINISTIC_SCENARIOS } from './scenarios';
import { runPermitProof, classifyDelta } from './comparator';
import { computeMinimalCounterexample } from './counterexample';
import {
  generateCertificateMarkdown,
  generateCertificateJSON,
} from './certificate';
import { generateRegressionTest } from './testGenerator';
import { generateBobHandoffMarkdown } from './bobHandoff';

describe('PermitProof Engine Tests', () => {
  describe('1. Baseline Authorization Verification', () => {
    it('allows Super Admin full access within same tenant when active', () => {
      const res = evaluateBaseline({
        role: 'Super Admin',
        resource: 'Customer Profiles',
        action: 'read',
        conditions: { sameTenant: true, owner: true, active: true },
      });
      expect(res.decision).toBe('ALLOW');
    });

    it('denies Super Admin when account is suspended', () => {
      const res = evaluateBaseline({
        role: 'Super Admin',
        resource: 'Audit Logs',
        action: 'read',
        conditions: { sameTenant: true, owner: false, active: false },
      });
      expect(res.decision).toBe('DENY');
    });

    it('denies cross-tenant access in baseline even for Admin', () => {
      const res = evaluateBaseline({
        role: 'Admin',
        resource: 'Invoices',
        action: 'read',
        conditions: { sameTenant: false, owner: false, active: true },
      });
      expect(res.decision).toBe('DENY');
    });

    it('denies Support role from exporting Customer Profiles', () => {
      const res = evaluateBaseline({
        role: 'Support',
        resource: 'Customer Profiles',
        action: 'export',
        conditions: { sameTenant: true, owner: false, active: true },
      });
      expect(res.decision).toBe('DENY');
    });

    it('denies Manager from deleting unowned Invoices', () => {
      const res = evaluateBaseline({
        role: 'Manager',
        resource: 'Invoices',
        action: 'delete',
        conditions: { sameTenant: true, owner: false, active: true },
      });
      expect(res.decision).toBe('DENY');
    });

    it('denies Viewer from updating Projects', () => {
      const res = evaluateBaseline({
        role: 'Viewer',
        resource: 'Projects',
        action: 'update',
        conditions: { sameTenant: true, owner: false, active: true },
      });
      expect(res.decision).toBe('DENY');
    });
  });

  describe('2. Candidate Authorization & Regression Detection', () => {
    it('detects regression 1: Support can export Customer Profiles in candidate', () => {
      const scenario = {
        role: 'Support' as const,
        resource: 'Customer Profiles' as const,
        action: 'export' as const,
        conditions: { sameTenant: true, owner: false, active: true },
      };
      const baseline = evaluateBaseline(scenario);
      const candidate = evaluateCandidate(scenario);

      expect(baseline.decision).toBe('DENY');
      expect(candidate.decision).toBe('ALLOW');
    });

    it('detects regression 2: Manager can delete unowned Invoices in candidate', () => {
      const scenario = {
        role: 'Manager' as const,
        resource: 'Invoices' as const,
        action: 'delete' as const,
        conditions: { sameTenant: true, owner: false, active: true },
      };
      const baseline = evaluateBaseline(scenario);
      const candidate = evaluateCandidate(scenario);

      expect(baseline.decision).toBe('DENY');
      expect(candidate.decision).toBe('ALLOW');
    });

    it('detects regression 3: Tenant isolation check missing for Internal Notes in candidate', () => {
      const scenario = {
        role: 'Support' as const,
        resource: 'Internal Notes' as const,
        action: 'read' as const,
        conditions: { sameTenant: false, owner: false, active: true },
      };
      const baseline = evaluateBaseline(scenario);
      const candidate = evaluateCandidate(scenario);

      expect(baseline.decision).toBe('DENY');
      expect(candidate.decision).toBe('ALLOW');
    });

    it('detects regression 4: Suspended users incorrectly retain access to Projects in candidate', () => {
      const scenario = {
        role: 'Viewer' as const,
        resource: 'Projects' as const,
        action: 'read' as const,
        conditions: { sameTenant: true, owner: false, active: false },
      };
      const baseline = evaluateBaseline(scenario);
      const candidate = evaluateCandidate(scenario);

      expect(baseline.decision).toBe('DENY');
      expect(candidate.decision).toBe('ALLOW');
    });

    it('detects regression 5: Viewer incorrectly receives UPDATE permission for Projects in candidate', () => {
      const scenario = {
        role: 'Viewer' as const,
        resource: 'Projects' as const,
        action: 'update' as const,
        conditions: { sameTenant: true, owner: false, active: true },
      };
      const baseline = evaluateBaseline(scenario);
      const candidate = evaluateCandidate(scenario);

      expect(baseline.decision).toBe('DENY');
      expect(candidate.decision).toBe('ALLOW');
    });
  });

  describe('3. Delta Classification & Severity Engine', () => {
    it('classifies cross-tenant allowance as TENANT_ISOLATION_FAILURE with CRITICAL severity', () => {
      const scenario = DETERMINISTIC_SCENARIOS.find((s) => s.id === 'SCN-033')!;
      const { classification, severity } = classifyDelta(scenario, 'DENY', 'ALLOW');

      expect(classification).toBe('TENANT_ISOLATION_FAILURE');
      expect(severity).toBe('CRITICAL');
    });

    it('classifies privilege escalation with CRITICAL severity', () => {
      const scenario = DETERMINISTIC_SCENARIOS.find((s) => s.id === 'SCN-029')!;
      const { classification, severity } = classifyDelta(scenario, 'DENY', 'ALLOW');

      expect(classification).toBe('PRIVILEGE_ESCALATION');
      expect(severity).toBe('CRITICAL');
    });
  });

  describe('4. Full Suite Deterministic Evaluation', () => {
    it('runs permit proof across all 50 deterministic scenarios', () => {
      const summary = runPermitProof(DETERMINISTIC_SCENARIOS);

      expect(summary.totalScenarios).toBe(50);
      expect(summary.unchangedCount).toBe(45);
      expect(summary.changedCount).toBe(5);
      expect(summary.criticalCount).toBe(5);
      expect(summary.status).toBe('NOT PROVEN');
    });
  });

  describe('5. Minimal Counterexample Generation', () => {
    it('generates minimal counterexample for Support profile export', () => {
      const summary = runPermitProof(DETERMINISTIC_SCENARIOS);
      const finding = summary.findings.find((f) => f.role === 'Support' && f.action === 'export')!;
      const scenario = DETERMINISTIC_SCENARIOS.find((s) => s.id === finding.scenarioId)!;

      const counterexample = computeMinimalCounterexample(finding, scenario);
      expect(counterexample.minimalFactors.role).toBe('Support');
      expect(counterexample.minimalFactors.resource).toBe('Customer Profiles');
      expect(counterexample.minimalFactors.action).toBe('export');
      expect(counterexample.explanation).toContain('smallest scenario in the demo');
    });
  });

  describe('6. Regression Test Generator', () => {
    it('generates executable Vitest code with describe and expect(DENY)', () => {
      const summary = runPermitProof(DETERMINISTIC_SCENARIOS);
      const finding = summary.findings[0];
      const testSnippet = generateRegressionTest(finding);

      expect(testSnippet).toContain("import { describe, it, expect } from 'vitest';");
      expect(testSnippet).toContain('evaluateCandidate(scenario)');
      expect(testSnippet).toContain('expect(result.decision).toBe("DENY");');
    });
  });

  describe('7. Change Certificate & Bob Handoff Generation', () => {
    it('generates valid Markdown certificate with NOT PROVEN verdict', () => {
      const summary = runPermitProof(DETERMINISTIC_SCENARIOS);
      const md = generateCertificateMarkdown(summary);

      expect(md).toContain('# AUTHORIZATION CHANGE CERTIFICATE');
      expect(md).toContain('NOT PROVEN');
      expect(md).toContain('Critical Security Findings');
    });

    it('generates valid JSON certificate containing findings and tests', () => {
      const summary = runPermitProof(DETERMINISTIC_SCENARIOS);
      const jsonStr = generateCertificateJSON(summary);
      const parsed = JSON.parse(jsonStr);

      expect(parsed.certificateHeader).toBe('AUTHORIZATION CHANGE CERTIFICATE');
      expect(parsed.verdict.status).toBe('NOT PROVEN');
      expect(parsed.findings.length).toBe(5);
    });

    it('generates valid Bob Handoff markdown', () => {
      const summary = runPermitProof(DETERMINISTIC_SCENARIOS);
      const bobHandoff = generateBobHandoffMarkdown(summary);

      expect(bobHandoff).toContain('# IBM BOB HANDOFF DOSSIER');
      expect(bobHandoff).toContain('Minimal Counterexample');
      expect(bobHandoff).toContain('Suggested Next Investigation for IBM Bob');
    });
  });
});
