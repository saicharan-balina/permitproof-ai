# PermitProof — Short Description

**Prove Authorization Changes Before They Ship.**

PermitProof is a deterministic, differential verification engine for authorization-sensitive code changes. When developers refactor permissions or access middleware, ordinary unit tests often remain green while subtle regressions accidentally grant unauthorized privileges or breach multi-tenant isolation. 

PermitProof systematically evaluates 50 realistic enterprise access scenarios across baseline and candidate policies, isolates security regressions, computes minimal counterexamples, auto-generates Vitest guards, and compiles cryptographic change certificates for seamless agentic remediation with IBM Bob.
