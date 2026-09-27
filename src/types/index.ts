export type Role =
  | 'Super Admin'
  | 'Admin'
  | 'Manager'
  | 'Support'
  | 'Analyst'
  | 'Viewer';

export type Resource =
  | 'Customer Profiles'
  | 'Projects'
  | 'Invoices'
  | 'Audit Logs'
  | 'API Keys'
  | 'Internal Notes';

export type Action =
  | 'read'
  | 'create'
  | 'update'
  | 'delete'
  | 'export';

export interface ScenarioConditions {
  sameTenant: boolean;
  owner: boolean;
  active: boolean;
}

export interface Scenario {
  id: string;
  name: string;
  role: Role;
  resource: Resource;
  action: Action;
  conditions: ScenarioConditions;
  description?: string;
}

export type Decision = 'ALLOW' | 'DENY';

export interface EvaluationResult {
  decision: Decision;
  reason: string;
}

export type DeltaClassification =
  | 'UNCHANGED'
  | 'ACCESS_GRANTED'
  | 'ACCESS_REVOKED'
  | 'TENANT_ISOLATION_FAILURE'
  | 'PRIVILEGE_ESCALATION';

export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

export interface Finding {
  id: string;
  scenarioId: string;
  severity: Severity;
  classification: DeltaClassification;
  role: Role;
  resource: Resource;
  action: Action;
  conditions: ScenarioConditions;
  baselineDecision: Decision;
  candidateDecision: Decision;
  baselineReason: string;
  candidateReason: string;
  reason: string;
  summary: string;
  category: 'REGRESSION' | 'ISOLATION_BREACH' | 'UNINTENDED_EXPANSION' | 'ACCESS_REVOCATION';
}

export interface ScenarioComparison {
  scenario: Scenario;
  baseline: EvaluationResult;
  candidate: EvaluationResult;
  status: 'UNCHANGED' | 'CHANGED';
  classification: DeltaClassification;
  finding?: Finding;
}

export interface MinimalCounterexample {
  originalScenario: Scenario;
  finding: Finding;
  minimalFactors: {
    role: Role;
    resource: Resource;
    action: Action;
    criticalCondition: string;
  };
  explanation: string;
  diffSummary: string;
}

export interface ProofSummary {
  runId: string;
  timestamp: string;
  project: string;
  baselineVersion: string;
  candidateVersion: string;
  totalScenarios: number;
  unchangedCount: number;
  changedCount: number;
  criticalCount: number;
  status: 'PROVEN' | 'NOT PROVEN';
  comparisons: ScenarioComparison[];
  findings: Finding[];
}
