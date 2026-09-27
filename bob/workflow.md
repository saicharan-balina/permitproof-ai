# IBM Bob Autonomous Verification Workflow

## Objective
To pair developer pull requests with IBM Bob's agentic reasoning and PermitProof's deterministic differential verification engine, eliminating authorization regressions and cross-tenant data leaks before production deployment.

---

## 7-Stage End-to-End Workflow

```
[ Developer PR ] 
       ↓
[ 1. Analyze Repo ]  ── (Bob maps endpoint decorators, middleware, & policies)
       ↓
[ 2. Map Auth Logic ] ── (Bob constructs baseline vs candidate rule sets)
       ↓
[ 3. Run PermitProof ] ── (Pure client-side deterministic evaluation across 50 scenarios)
       ↓
[ 4. Investigate Findings ] ── (Bob ingests minimal counterexamples)
       ↓
[ 5. Generate Tests ] ── (Deterministically compiles Vitest regression guards)
       ↓
[ 6. Review Evidence ] ── (Audit traces verify tenant boundaries & role scopes)
       ↓
[ 7. Change Certificate ] ── (PROVEN / NOT PROVEN gatekeeper blocks merge if regressions exist)
```

---

## Step Breakdown

### Step 1: Analyze Repository
IBM Bob analyzes the codebase structure, scanning policy files (`src/engine/baseline.ts`, `src/engine/candidate.ts`) and associated route definitions.

### Step 2: Map Authorization Logic
Bob identifies the discrete authorization dimensions:
- Roles: Super Admin, Admin, Manager, Support, Analyst, Viewer
- Resources: Customer Profiles, Projects, Invoices, Audit Logs, API Keys, Internal Notes
- Actions: read, create, update, delete, export
- Contexts: sameTenant, owner, active

### Step 3: Run PermitProof Verification
PermitProof executes the deterministic scenario matrix. Because it uses differential decision logic rather than stochastic inference, findings are 100% reproducible and tamper-proof.

### Step 4: Investigate Findings via Minimal Counterexample
PermitProof identifies the exact attribute divergence (e.g. `Support + Customer Profiles + Export`) without confusing surrounding context.

### Step 5: Synthesize Regression Tests
PermitProof generates drop-in Vitest / Jest test code guaranteeing that the unauthorized access is strictly asserted to `DENY`.

### Step 6: Autonomous Remediation with IBM Bob
The developer exports `BOB_HANDOFF.md` and hands it to IBM Bob. Bob applies the precise code edits in `candidate.ts` to restore the baseline invariants.

### Step 7: Issue Change Certificate
PermitProof re-runs the 50 scenarios. Once all 5 regressions are patched, status transitions from `NOT PROVEN` to `PROVEN`, enabling safe PR merge and deployment.
