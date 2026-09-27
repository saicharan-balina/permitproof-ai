# AGENTS.md — IBM Bob & AI Agent Guidelines

This repository is designed for autonomous agent development and automated differential policy verification with IBM Bob.

## Core Directives for Autonomous Agents

1. **Deterministic Ground Truth First**
   - Never mock or hallucinate authorization verification results.
   - All scenario evaluations, delta classifications, and certificate verdicts are computed deterministically via `src/engine/comparator.ts`.

2. **No Backend / Static Architecture**
   - The application is a client-side single page application built for GitHub Pages deployment.
   - Do not add database connectors, remote microservices, external LLM API keys, or stateful authentication backends.

3. **Interpreting Policy Regressions**
   - Baseline policy is in `src/engine/baseline.ts` (representing production stable v2.8.4).
   - Candidate policy is in `src/engine/candidate.ts` (representing pull request v3.0-pr).
   - If `evaluateCandidate` returns `ALLOW` where `evaluateBaseline` returns `DENY`, this constitutes an authorization regression.

4. **Generating Counterexamples & Remediation**
   - Always derive minimal counterexamples by isolating the critical attribute difference (`src/engine/counterexample.ts`).
   - Every regression must have an accompanying regression test generated via `src/engine/testGenerator.ts`.

5. **Certification Protocol**
   - A change certificate cannot be marked `PROVEN` while any critical security finding exists.
   - Remediate candidate defects until `npm run test` passes and `runPermitProof()` yields `status: "PROVEN"`.
