# IBM Bob Task Prompts & Agent Scripts

This document details the exact task prompt templates utilized when prompting IBM Bob during development and remediation cycles.

---

## Task 1: Architecture & Authorization Boundary Mapping
**Target Agent:** IBM Bob Code Analysis / Architect Agent  
**Prompt:**
```text
Analyze this repository's authorization policy implementations located in src/engine/baseline.ts and src/engine/candidate.ts.
1. Map out all roles: Super Admin, Admin, Manager, Support, Analyst, Viewer.
2. Identify resources: Customer Profiles, Projects, Invoices, Audit Logs, API Keys, Internal Notes.
3. Trace the condition gates: sameTenant, owner, active.
4. Output a summary table comparing the rule trees between baseline.ts and candidate.ts.
```

---

## Task 2: Handoff Ingestion & Defect Localization
**Target Agent:** IBM Bob Autonomous Debugger Agent  
**Prompt:**
```text
I have run PermitProof and generated a BOB_HANDOFF.md dossier revealing 5 critical authorization regressions in candidate.ts:
1. Support role can export Customer Profiles (PII data leak).
2. Manager can delete an Invoice without owning it (missing owner verification).
3. Cross-tenant isolation check is missing for Internal Notes.
4. Suspended accounts retain access to Projects.
5. Viewer role was accidentally granted update permission on Projects.

Review the minimal counterexamples and generated Vitest tests in the handoff.
Locate the exact lines in src/engine/candidate.ts where these rules diverge from baseline.ts.
```

---

## Task 3: Patch Synthesis & Regression Verification
**Target Agent:** IBM Bob Automated Remediation Agent  
**Prompt:**
```text
Synthesize a safe patch for src/engine/candidate.ts that restores expected baseline invariants without breaking intended functional additions.
1. Re-introduce the strict tenant isolation gate across all resources including Internal Notes.
2. Restore the suspended account deny gate before resource routing.
3. Re-apply the owner check on Manager invoice deletions.
4. Deny Customer Profiles export for Support role.
5. Restrict Viewer role to read-only access on Projects.
6. Run `npm run test` to verify that all suites pass and re-evaluate PermitProof to ensure status switches to PROVEN.
```
