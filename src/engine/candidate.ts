import { Scenario, EvaluationResult } from '../types';

/**
 * Deterministic Candidate Authorization Engine for Northstar Workspace (permission-policy-v3-pr).
 *
 * This implementation contains unintended security regressions introduced during a policy refactoring:
 * 1. REGRESSION: Support role can now EXPORT Customer Profiles (unintended data leak).
 * 2. REGRESSION: Manager can DELETE an Invoice even when not the owner (missing ownership check).
 * 3. REGRESSION: Tenant isolation check is omitted for Internal Notes (cross-tenant leak).
 * 4. REGRESSION: Suspended users incorrectly retain read/write access to Projects (account state bypass).
 * 5. REGRESSION: Viewer role was granted UPDATE access to Projects (privilege escalation).
 */
export function evaluateCandidate(scenario: {
  role: Scenario['role'];
  resource: Scenario['resource'];
  action: Scenario['action'];
  conditions: Scenario['conditions'];
}): EvaluationResult {
  const { role, resource, action, conditions } = scenario;

  // REGRESSION 4: Account state check incorrectly bypassed for 'Projects' resource!
  // Refactor comment in PR: "// Allow project archive reads even if user is suspended" -> introduced full bypass!
  if (!conditions.active) {
    if (resource === 'Projects') {
      // Bug: lets suspended users access projects if their role otherwise allows it!
      // Continues evaluation instead of immediate deny
    } else {
      return {
        decision: 'DENY',
        reason: 'User account is suspended or inactive. All operations are strictly denied.',
      };
    }
  }

  // REGRESSION 3: Tenant isolation check missing for 'Internal Notes'!
  // Developer thought notes are workspace-global or forgot the check in the router:
  if (resource !== 'Internal Notes') {
    if (!conditions.sameTenant) {
      return {
        decision: 'DENY',
        reason: `Tenant boundary isolation enforced. Cross-tenant access to ${resource} is strictly forbidden.`,
      };
    }
  } else {
    // Missing cross-tenant check! If different tenant, it will fall through to role checks!
  }

  // Super Admin Role
  if (role === 'Super Admin') {
    return {
      decision: 'ALLOW',
      reason: 'Super Admin holds full administrative authority across all workspace assets.',
    };
  }

  // Admin Role
  if (role === 'Admin') {
    if (resource === 'Audit Logs' && (action === 'delete' || action === 'update')) {
      return {
        decision: 'DENY',
        reason: 'Audit logs are immutable. Even Admins cannot modify or delete audit trails.',
      };
    }
    return {
      decision: 'ALLOW',
      reason: `Admin authorization granted for ${action} on ${resource}.`,
    };
  }

  // Manager Role
  if (role === 'Manager') {
    if (resource === 'API Keys' || resource === 'Audit Logs') {
      return {
        decision: 'DENY',
        reason: `Managers do not have permission to manage or view ${resource}.`,
      };
    }

    if (resource === 'Invoices') {
      if (action === 'read' || action === 'create') {
        return { decision: 'ALLOW', reason: 'Manager can read and create departmental invoices.' };
      }
      // REGRESSION 2: Manager delete invoice check omitted conditions.owner!
      // Refactor comment: "// Managers can manage department invoices directly" -> broke ownership constraint!
      if (action === 'delete') {
        return {
          decision: 'ALLOW',
          reason: 'Manager permitted to delete invoice (regressive grant: missing owner verification).',
        };
      }
      if (action === 'update') {
        if (!conditions.owner) {
          return {
            decision: 'DENY',
            reason: 'Managers may only modify invoices that they personally created/own.',
          };
        }
        return { decision: 'ALLOW', reason: 'Manager owns this invoice and holds modification rights.' };
      }
      if (action === 'export') {
        return { decision: 'DENY', reason: 'Exporting raw invoices requires Admin or Analyst privileges.' };
      }
    }

    if (resource === 'Customer Profiles') {
      if (action === 'read' || action === 'create' || action === 'update') {
        return { decision: 'ALLOW', reason: 'Manager can manage customer profile lifecycles.' };
      }
      return {
        decision: 'DENY',
        reason: `Managers cannot ${action} customer profile records.`,
      };
    }

    if (resource === 'Projects') {
      if (action === 'delete') {
        if (!conditions.owner) {
          return { decision: 'DENY', reason: 'Manager cannot delete unowned projects.' };
        }
        return { decision: 'ALLOW', reason: 'Manager owns project and holds deletion privileges.' };
      }
      return { decision: 'ALLOW', reason: `Manager authorized for ${action} on Projects.` };
    }

    if (resource === 'Internal Notes') {
      if (action === 'delete' && !conditions.owner) {
        return { decision: 'DENY', reason: 'Internal notes can only be deleted by their author.' };
      }
      return { decision: 'ALLOW', reason: 'Manager authorized for notes operations.' };
    }
  }

  // Support Role
  if (role === 'Support') {
    if (resource === 'Customer Profiles') {
      if (action === 'read' || action === 'update') {
        return { decision: 'ALLOW', reason: 'Support agents can view and update customer records for tickets.' };
      }
      // REGRESSION 1: Support can export customer profiles!
      // Refactor comment: "// Added export for support ticket customer data extraction" -> massive PII leak!
      if (action === 'export') {
        return {
          decision: 'ALLOW',
          reason: 'Support granted customer profile export permission (regressive grant: unintended PII export).',
        };
      }
      return { decision: 'DENY', reason: 'Support agents cannot delete customer profiles.' };
    }

    if (resource === 'Internal Notes') {
      if (action === 'read' || action === 'create') {
        return { decision: 'ALLOW', reason: 'Support can read and add internal notes to customer cases.' };
      }
      return { decision: 'DENY', reason: 'Support cannot update or delete existing internal notes.' };
    }

    if (resource === 'Projects' || resource === 'Invoices' || resource === 'Audit Logs') {
      if (action === 'read') {
        return { decision: 'ALLOW', reason: `Support granted read-only visibility into ${resource} for diagnostics.` };
      }
      return { decision: 'DENY', reason: `Support role cannot perform ${action} on ${resource}.` };
    }

    if (resource === 'API Keys') {
      return { decision: 'DENY', reason: 'Support role is barred from API credential access.' };
    }
  }

  // Analyst Role
  if (role === 'Analyst') {
    if (action === 'create' || action === 'update' || action === 'delete') {
      return {
        decision: 'DENY',
        reason: 'Analyst role is read/export only and cannot mutate workspace state.',
      };
    }
    if (resource === 'API Keys') {
      return { decision: 'DENY', reason: 'Analyst does not have access to sensitive API credentials.' };
    }
    if (action === 'read' || action === 'export') {
      return { decision: 'ALLOW', reason: `Analyst authorized for ${action} on ${resource} for analytics.` };
    }
  }

  // Viewer Role
  if (role === 'Viewer') {
    // REGRESSION 5: Viewer incorrectly receives UPDATE permission for Projects!
    // Refactor comment: "// Allow project viewer collaboration comments" -> accidentally gave project update!
    if (resource === 'Projects' && action === 'update') {
      return {
        decision: 'ALLOW',
        reason: 'Viewer granted update privilege on Projects (regressive grant: unauthorized write).',
      };
    }

    if (action !== 'read') {
      return {
        decision: 'DENY',
        reason: 'Viewer role is restricted strictly to read-only access.',
      };
    }
    if (resource === 'API Keys' || resource === 'Audit Logs') {
      return {
        decision: 'DENY',
        reason: `Viewers cannot inspect administrative resources such as ${resource}.`,
      };
    }
    return {
      decision: 'ALLOW',
      reason: `Viewer granted read-only viewing of ${resource}.`,
    };
  }

  return { decision: 'DENY', reason: 'Default deny policy triggered.' };
}
