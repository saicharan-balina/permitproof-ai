# PermitProof — Long Description

## Product Overview & Developer Problem

In modern SaaS development, authorization logic is among the highest-risk yet least protected surfaces in the engineering lifecycle. A developer refactoring authorization handlers, ABAC policies, or routing middleware can inadvertently introduce subtle bugs:
- A customer support role is accidentally granted bulk PII export rights.
- A department manager is permitted to delete financial records they do not own.
- A missing tenant isolation boundary in an endpoint router allows cross-tenant note access.
- A suspended account retains write privileges on legacy projects.

Standard test suites frequently test only happy paths, leaving these subtle security breaches undetected until production data leaks occur.

## The Solution: Deterministic Differential Authorization Verification

**PermitProof** solves this by shifting authorization assurance left into the CI/CD pipeline and developer desktop. Rather than relying on stochastic AI guesses or slow manual audits, PermitProof executes a deterministic differential verification engine:
1. **Parallel Policy Evaluation:** Runs 50 realistic, synthetic scenarios against the verified production `baseline` (v2.8.4) and the proposed pull request `candidate` (v3.0).
2. **Deterministic Delta Classification:** Categorizes every divergence into precise security categories:
   - `UNCHANGED`
   - `ACCESS_GRANTED`
   - `ACCESS_REVOKED`
   - `TENANT_ISOLATION_FAILURE`
   - `PRIVILEGE_ESCALATION`
3. **Minimal Counterexample Extraction:** Automatically calculates the exact minimal tuple of attributes that triggers the failure (e.g. `Support + Customer Profiles + Export`), stripped of irrelevant noise.
4. **Automated Regression Test Synthesis:** Generates ready-to-run Vitest test suites asserting expected `DENY` outcomes.
5. **Cryptographic Change Certification:** Issues a machine-readable JSON and human-readable Markdown certificate with a strict rule: if *any* critical regression exists, the release is marked `NOT PROVEN`.

## IBM Bob 2.0 Integration & Autonomous Remediation

PermitProof seamlessly pairs with IBM Bob:
- **Dossier Generation:** Through the "Continue with IBM Bob" button, PermitProof generates `BOB_HANDOFF.md`, packaging all findings, counterexamples, and generated tests.
- **Autonomous Repair:** Developers prompt IBM Bob with the dossier to locate root causes in the codebase AST, implement fixes, run `npm run test`, and confirm all regression tests pass.
- **Audit Trails:** Change certificates provide immutable audit evidence for security compliance reviews.

## Zero External Dependencies & GitHub Pages Native

PermitProof was engineered with zero external backends, databases, logins, or proprietary API keys. It runs 100% in-browser and deploys statically to GitHub Pages via automated GitHub Actions workflows.
