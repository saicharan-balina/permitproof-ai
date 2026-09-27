# PermitProof — 2-Minute Video Demo Script

**Project Title:** PermitProof — Prove Authorization Changes Before They Ship  
**Target Duration:** 2 minutes (120 seconds)  
**Hackathon:** IBM Bob 2.0 Hackathon

---

### [0:00 - 0:20] Hook & Problem Statement
- **Visual:** Show a developer PR on GitHub touching authorization logic.
- **Narrator:**
  *"You just refactored your authorization logic. Your standard test suites are all green. But did you accidentally leak customer data or break tenant isolation? Authorization bugs are silent killers. They don't throw syntax errors. They just grant unauthorized access to the wrong people."*

---

### [0:20 - 0:45] Introducing PermitProof & Running the Proof
- **Visual:** Landing page of PermitProof with the hero: *"Authorization changed. Who can access what now?"*
- **Action:** Click the primary button **"Run Authorization Proof"**.
- **Visual:** Watch the real-time progress sequence: evaluating baseline, evaluating candidate, comparing access decisions, building evidence.
- **Narrator:**
  *"Meet PermitProof. We deterministically compare your baseline and candidate authorization logic across 50 realistic enterprise access scenarios. No external APIs, no stochastic AI guesses — pure differential proof."*

---

### [0:45 - 1:10] The Findings & Minimal Counterexample
- **Visual:** Results reveal: 50 Scenarios Evaluated, 45 Unchanged, 5 Regressions, 5 Critical Findings. Status: **NOT PROVEN**.
- **Action:** Click **"Find Counterexample"** on the spotlight finding: `Support → Customer Profiles → Export`.
- **Visual:** Counterexample modal opens, isolating the minimal condition: `Support + Customer Profiles + Export + Different Tenant`.
- **Narrator:**
  *"Immediately, PermitProof catches a critical data leak: Support can now export Customer Profiles across tenant boundaries. Clicking 'Find Counterexample' isolates the exact minimal tuple of attributes that triggers the failure — without noise or exploit instructions."*

---

### [1:10 - 1:35] Regression Test & Change Certificate
- **Action:** Click **"Generate Regression Test"** and show the Vitest snippet, then click **[Copy Test]**.
- **Visual:** Navigate to the **Change Certificate** tab. Show the executive verdict: `NOT PROVEN`.
- **Action:** Click **[Export JSON]** and **[Export Markdown]**.
- **Narrator:**
  *"PermitProof automatically compiles an executable Vitest test for CI/CD guarding. On the Certificate tab, our strict policy engine marks the release NOT PROVEN. If any critical regression exists, the PR is blocked from merging."*

---

### [1:35 - 2:00] IBM Bob 2.0 Integration & Call to Action
- **Visual:** Navigate to **Bob Workflow** tab. Click **"Continue with IBM Bob"** and show the downloaded `BOB_HANDOFF.md`.
- **Narrator:**
  *"Finally, with one click on 'Continue with IBM Bob', we export a complete remediation dossier. IBM Bob ingests the counterexamples, locates the defect lines in the code, and synthesizes the fix. PermitProof: Prove authorization changes before they ship."*
