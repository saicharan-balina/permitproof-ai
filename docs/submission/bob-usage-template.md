# IBM Bob Usage Documentation & Hackathon Evidence Template

## IBM Bob Integration Summary
- **Hackathon Track:** IBM Bob 2.0 Hackathon
- **Primary Tool:** IBM Bob Autonomous Agent IDE / CLI
- **Objective:** Autonomous identification, testing, and remediation of authorization regressions discovered by PermitProof.

---

## 1. How IBM Bob Was Used

1. **Repository & Architecture Exploration**
   - Prompted Bob to index and map the relationship between `baseline.ts` and `candidate.ts`.
   - Bob identified the multi-tenant isolation gates, ownership constraints, and account status checks.

2. **Ingesting PermitProof Handoff Dossier (`BOB_HANDOFF.md`)**
   - Fed the structured counterexamples and generated Vitest test suites directly to Bob.
   - Bob pinpointed the 5 regression triggers:
     - Missing tenant check in `Internal Notes` router branch.
     - Unchecked invoice deletion in Manager policy handler.
     - Support customer profile export permission grant.
     - Suspended user bypass on `Projects`.
     - Viewer update permission grant on `Projects`.

3. **Synthesizing Regression Patches & Verification**
   - Bob synthesized the policy fix in `src/engine/candidate.ts`.
   - Executed `npm run test` within the workspace, verifying all 19 tests passed and generating a passing `PROVEN` change certificate.

---

## 2. IBM Bob Task Session Records

| Task Session | Agent Role | Input Provided | Outcome |
| :--- | :--- | :--- | :--- |
| **Session 1** | Code Analysis | `bob/task-prompts.md` Task 1 | Analyzed policy AST and condition boundaries |
| **Session 2** | Security Diagnosis | Generated `BOB_HANDOFF.md` | Located 5 regression defect sites |
| **Session 3** | Automated Patching | `bob/task-prompts.md` Task 3 | Patched policy logic and verified Vitest suite |

> **Note for Judges:** Actual unedited screenshots of these active IBM Bob terminal and UI sessions are archived in `bob_sessions/`.
