import { Scenario, EvaluationResult } from '../types';

/**
 * Deterministic Baseline Authorization Engine for Northstar Workspace.
 * Represents the verified, production-stable authorization policy (v2.8.4).
 */
export function evaluateBaseline(scenario: {
  role: Scenario['role'];
  resource: Scenario['resource'];
  action: Scenario['action'];
  conditions: Scenario['conditions'];
}): EvaluationResult {
  const { role, resource, action, conditions } = scenario;

  // 1. Mandatory Account State Check
  if (!conditions.active) {
    return {
      decision: 'DENY',
      reason: 'User account is suspended or inactive. All operations are strictly denied.',
    };
  }

  // 2. Strict Tenant Boundary Isolation
  if (!conditions.sameTenant) {
    return {
      decision: 'DENY',
      reason: `Tenant boundary isolation enforced. Cross-tenant access to ${resource} is strictly forbidden.`,
    };
  }

  // 3. Super Admin Role
  if (role === 'Super Admin') {
    return {
      decision: 'ALLOW',
      reason: 'Super Admin holds full administrative authority across all workspace assets.',
    };
  }

  // 4. Admin Role
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

  // 5. Manager Role
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
      if (action === 'update' || action === 'delete') {
        if (!conditions.owner) {
          return {
            decision: 'DENY',
            reason: 'Managers may only modify or delete invoices that they personally created/own.',
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

  // 6. Support Role
  if (role === 'Support') {
    if (resource === 'Customer Profiles') {
      if (action === 'read' || action === 'update') {
        return { decision: 'ALLOW', reason: 'Support agents can view and update customer records for tickets.' };
      }
      if (action === 'export') {
        return {
          decision: 'DENY',
          reason: 'Bulk export of customer profiles is restricted to prevent PII exfiltration.',
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

  // 7. Analyst Role
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

  // 8. Viewer Role
  if (role === 'Viewer') {
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
