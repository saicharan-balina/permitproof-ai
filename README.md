# PermitProof

> **Prove Authorization Changes Before They Ship.**  
> Deterministic differential verification engine for authorization-sensitive code changes. Built for the **IBM Bob 2.0 Hackathon**.

[![CI & Deploy to GitHub Pages](https://github.com/USERNAME/permitproof/actions/workflows/deploy.yml/badge.svg)](https://github.com/USERNAME/permitproof/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Zero Backend](https://img.shields.io/badge/Backend-Zero%20Dependencies-brightgreen.svg)]()
[![Deterministic](https://img.shields.io/badge/Verification-100%25%20Deterministic-indigo.svg)]()

---

## Problem

In enterprise cloud and multi-tenant SaaS architectures, authorization regressions are among the most catastrophic yet insidious software defects:
- A developer refactors routing middleware or role-based permission tables.
- Conventional unit and integration tests remain completely green because they assert expected happy paths.
- Subtle policy defects slip through: customer support agents accidentally gain customer PII export rights, managers are permitted to delete invoices owned by other team members, or tenant isolation checks are accidentally omitted.
- Traditional testing requires manually crafting endless permutations of roles, actions, and tenant boundaries, leaving high-risk blind spots that lead to silent data leaks and privilege escalations.

---

## Solution

**PermitProof** solves this by shifting differential authorization verification directly into developer workflows and automated CI/CD gating:
- **Zero Hallucinations:** 100% deterministic TypeScript evaluation engine without stochastic AI models or probabilistic guessing.
- **Side-by-Side Policy Comparison:** Simultaneously evaluates realistic access requests across a production baseline (`permission-policy-v2.8.4`) and a candidate pull request (`permission-policy-v3-pr`).
- **Automated Minimal Counterexamples:** Automatically isolates the smallest condition divergence triggering the authorization breach.
- **Drop-in Regression Test Generation:** Generates executable Vitest assertions ensuring `DENY` invariants are locked down.
- **Cryptographic Change Certification:** Issues tamper-evident Change Certificates (`PROVEN` / `NOT PROVEN`) that strictly block pull request merges if any critical regression exists.
- **Autonomous Remediation with IBM Bob:** Exports structured `BOB_HANDOFF.md` dossiers allowing IBM Bob agents to locate, explain, and patch authorization defects autonomously.

---

## How It Works

```
AUTHORIZATION CHANGE
       ↓
RUN SCENARIOS (50 Matrix Scenarios)
       ↓
BASELINE VS CANDIDATE EVALUATION
       ↓
ACCESS DELTAS & CLASSIFICATION
       ↓
FINDINGS IDENTIFICATION
       ↓
MINIMAL COUNTEREXAMPLE EXTRACTION
       ↓
REGRESSION TEST GENERATION
       ↓
CHANGE CERTIFICATE & BOB HANDOFF
```

1. **Deterministic Scenario Matrix:** Evaluates 50 enterprise scenarios across 6 roles, 6 resources, 5 actions, and 3 condition gates (tenant isolation, ownership, active status).
2. **Delta Classifier:** Classifies each scenario into `UNCHANGED`, `ACCESS_GRANTED`, `ACCESS_REVOKED`, `TENANT_ISOLATION_FAILURE`, or `PRIVILEGE_ESCALATION`.
3. **Severity Assignment:** Flagged as `CRITICAL`, `HIGH`, `MEDIUM`, or `LOW`.
4. **Certification Rule:** If *any* critical authorization regression exists, the final status is mathematically enforced as **`NOT PROVEN`**.

---

## Demo Walkthrough

1. **Launch Dashboard:** Land on the enterprise dark dashboard featuring the core question: *"Authorization changed. Who can access what now?"*
2. **Run Authorization Proof:** Click the primary action button to trigger the animated progress sequence across 50 scenarios.
3. **Review Metrics:** View live counts: 50 Scenarios, 45 Unchanged, 5 Regressions, 5 Critical Findings, Status: **NOT PROVEN**.
4. **Examine Spotlight Finding:** Observe the critical regression where `Support` role can `export` `Customer Profiles`.
5. **Inspect Minimal Counterexample:** Click **"Find Counterexample"** to view the isolated minimal trigger (`Support + Customer Profiles + Export + Different Tenant`).
6. **Generate Vitest Test:** Click **"Generate Regression Test"** and copy the ready-to-run test code.
7. **Audit Change Certificate:** View the official Change Certificate and export as JSON or Markdown.
8. **Export IBM Bob Handoff:** Click **"Continue with IBM Bob"** to download `BOB_HANDOFF.md`.

---

## Architecture

PermitProof is designed as an ultra-reliable, zero-backend, pure client-side application deployable statically anywhere:

```
permitproof/
├── .github/workflows/deploy.yml  # Automated CI/CD & GitHub Pages deployment
├── bob/                          # IBM Bob integration resources
│   ├── task-prompts.md           # Prompt templates for IBM Bob agents
│   └── workflow.md               # 7-step autonomous agent lifecycle
├── bob_sessions/                 # Archive for IBM Bob session screenshots
│   └── README.md
├── docs/submission/              # Hackathon submission documentation
│   ├── submission-short-description.md
│   ├── submission-long-description.md
│   ├── bob-usage-template.md
│   └── video-script.md
├── src/
│   ├── types/index.ts            # TypeScript interfaces & domain models
│   ├── engine/                   # Pure deterministic core
│   │   ├── baseline.ts           # Production baseline policy (v2.8.4)
│   │   ├── candidate.ts          # Candidate policy with intentional regressions
│   │   ├── scenarios.ts          # 50 synthetic deterministic scenarios
│   │   ├── comparator.ts         # Delta classification & evaluation engine
│   │   ├── counterexample.ts     # Minimal counterexample extractor
│   │   ├── testGenerator.ts      # Automated Vitest test synthesizer
│   │   ├── certificate.ts        # Change certificate & exporters (JSON/MD)
│   │   ├── bobHandoff.ts         # IBM Bob handoff dossier generator
│   │   └── engine.test.ts        # Comprehensive Vitest test suite
│   ├── components/               # React UI components
│   │   ├── Header.tsx            # Navigation & status bar
│   │   ├── OverviewTab.tsx       # Hero, live stats, spotlight card
│   │   ├── MatrixTab.tsx         # Filterable 50-row authorization matrix
│   │   ├── FindingsTab.tsx       # Detailed finding cards
│   │   ├── CertificateTab.tsx    # Official certificate & export buttons
│   │   ├── BobWorkflowTab.tsx    # 7-step lifecycle & BOB_HANDOFF exporter
│   │   ├── CounterexampleModal.tsx # Minimal condition visualizer
│   │   ├── TestModal.tsx         # Vitest code copy & run instructions
│   │   └── EvidenceModal.tsx     # Deep differential trace inspector
│   ├── App.tsx                   # Main React container
│   ├── main.tsx                  # React DOM mount point
│   └── index.css                 # Tailwind CSS styling & gradients
├── AGENTS.md                     # Agent coding directives
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # TypeScript strict configuration
└── vite.config.ts                # Vite with relative-safe base for GitHub Pages
```

---

## Deterministic Verification

Unlike stochastic LLM evaluation which can suffer from hallucinations, non-determinism, and latency, PermitProof's verification engine is **100% deterministic**:
- Input: Scenario attributes `(role, resource, action, conditions)`.
- Execution: Pure, side-effect-free TypeScript policy evaluation.
- Output: Exact `ALLOW` or `DENY` verdict with discrete reasoning.
- Comparison: Mathematical equality comparison across versions.
- Certification: Deterministic state machine ensuring reproducible audits.

---

## IBM Bob Workflow

PermitProof integrates directly with IBM Bob:
1. **Analyze Repository:** Bob inspects policy files and maps authorization routes.
2. **Map Authorization Logic:** Bob maps roles, actions, and boundary conditions.
3. **Run PermitProof:** Deterministic differential evaluation computes deltas.
4. **Investigate Findings:** Bob ingests minimal counterexamples.
5. **Generate Regression Tests:** Vitest test suites compiled automatically.
6. **Review Evidence:** Differential traces verified by developer and agent.
7. **Prepare Change Certificate:** Final `PROVEN` certificate unlocks production merge.

Clicking **"Continue with IBM Bob"** in the app downloads `BOB_HANDOFF.md`, providing a complete dossier ready to paste into an IBM Bob agent session.

---

## Local Setup

### Prerequisites
- Node.js 18+ or 20+
- npm 9+

### Installation & Execution
```bash
# Clone the repository
git clone https://github.com/USERNAME/permitproof.git
cd permitproof

# Install dependencies
npm install

# Run the Vitest test suite
npm run test

# Start local development server
npm run dev

# Build production bundle
npm run build
```

Open your browser to `http://localhost:5173`.

---

## GitHub Pages Deployment

PermitProof is pre-configured with a relative-safe base path (`base: './'`) in `vite.config.ts`, making it completely portable across any GitHub username and repository name.

### Automated Deployment via GitHub Actions
1. Push this repository to GitHub on `main` or `master`.
2. Go to your repository on GitHub: **Settings → Pages**.
3. Under **Build and deployment → Source**, select **GitHub Actions**.
4. The workflow in `.github/workflows/deploy.yml` will automatically build, test, and publish the application to `https://USERNAME.github.io/REPOSITORY/`.

---

## Testing

PermitProof includes a comprehensive test suite covering the entire deterministic engine:

```bash
npm run test
```

### Verified Test Coverage:
- Baseline authorization decisions for all roles and resources.
- Detection of the 5 intentional candidate regressions.
- Delta classification (`TENANT_ISOLATION_FAILURE`, `PRIVILEGE_ESCALATION`, etc.).
- Minimal counterexample factor isolation.
- Vitest regression test generation.
- Certificate JSON and Markdown compilation.
- Bob handoff dossier generation.

---

## Security

- **Zero Secret Footprint:** No API keys, passwords, database credentials, or third-party cloud secrets exist in this repository.
- **Client-Side Sandbox:** Scenarios are evaluated locally in-browser memory without network telemetry or data exfiltration.
- **Non-Exploitable Counterexamples:** Minimal counterexamples identify policy divergence factors without providing weaponized payloads.

---

## Synthetic Dataset

PermitProof tests a synthetic multi-tenant enterprise SaaS model: **Northstar Workspace**.

- **Roles (6):** Super Admin, Admin, Manager, Support, Analyst, Viewer.
- **Resources (6):** Customer Profiles, Projects, Invoices, Audit Logs, API Keys, Internal Notes.
- **Actions (5):** read, create, update, delete, export.
- **Boundary Conditions (3):**
  - `sameTenant`: same tenant vs cross-tenant boundary.
  - `owner`: resource creator/owner vs unowned.
  - `active`: active account vs suspended account.

### Included Realistic Candidate Regressions:
1. **Support role can export Customer Profiles:** PII exfiltration vulnerability.
2. **Manager can delete unowned Invoices:** Resource destruction constraint violation.
3. **Cross-tenant isolation check missing for Internal Notes:** Multi-tenant boundary leak.
4. **Suspended accounts retain access to Projects:** Inactive account enforcement bypass.
5. **Viewer role receives update permission on Projects:** Read-only role privilege escalation.

---

## Limitations

- Evaluates discrete, attribute-based policy functions; complex time-based rate-limiting or external token revocation protocols require runtime integration.
- Scenarios in the MVP are synthetically generated to model enterprise permission graphs; production extensions can ingest OpenAPI specs or AWS IAM policies.

---

## Future Work

- Direct AST parser for Open Policy Agent (OPA / Rego) and AWS Cedar policies.
- Real-time GitHub PR bot commenting with inline diff certificates.
- Dynamic scenario fuzzer synthesizing boundary cases with property-based testing.
- Two-way bidirectional sync with IBM Bob API for fully automated pull request patching.

---

## License

MIT © 2026 PermitProof Contributors. Built for the IBM Bob 2.0 Hackathon.
