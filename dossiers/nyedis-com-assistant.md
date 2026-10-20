# Nyedis — distilled knowledge (from the website as of 2026-10-19)

## What it is (30 seconds)
**Nyedis builds enterprise AI security and governance software centered on "Argent Strategic Intelligence" — a checkpoint that enforces identity, data protection, access limits, spend controls and auditability for AI agents and tools.** It also offers enterprise AI services (development, security/governance, integration, strategy/advisory) and the "AI Sentinel Protocol" (four maturity stages from Aware to Autonomous).

## Core product: Argent Strategic Intelligence
"See. Prove. Stop." Argent is positioned as a checkpoint between AI agents and everything they touch (MCP, RAG, A2A). **Six areas of control** (all enforced on every request): 
1. Know who acted (named human owner for every agent; owner-leave/off blocks agent; one screen of all agents with dollar tags)
2. Protect company data (DLP redaction: SSNs, card numbers, API keys, source code, secrets replaced with placeholders on outbound; scanned on inbound)
3. Limit access (agents can call only approved tools/MCP, document search returns only what the human can see; default deny; agent-to-agent governed)
4. Protect credentials (no real keys held by people/agents — signed into Argent, which injects real key from vault; never exposed)
5. Control the bill (dollar caps per company/org/dept/person/agent; hold money up front, settle after; emergency cap stops runaway loops; forecasts; can switch to cheaper models)
6. Check the evidence (every allow/deny/redact/quarantine is a signed, hash-chained, write-once record; offline verifier; can build a SOC 2 evidence bundle in under 30 seconds)

**How one request flows (high level):** 26 checks, 33 steps; < 100 ms policy decision; fails closed (if checker down, refuse); real key injected from vault only after checks; outbound/inbound scanned; token cost captured; denial returns immediately with no provider call. 

## Deployment & stack
Runs where you work: local in 2 minutes (one command), your cloud in ~20 minutes (Docker Compose, Helm for K8s — EKS/AKS/GKE/k3s/RKE2, AWS/Azure/GCP/on-prem), air-gapped on your own models (no internet/API keys at runtime). Open source core (gateway, filter chain, MCP proxy, A2A governance, offline verifier, signed audit chain) under Apache-2.0. Integrates with 23+ AI tools/SDKs (Claude Code, OpenAI Codex, Gemini CLI, Cursor, Cline, OpenCode, LangChain/LangGraph, n8n, Ollama/LM Studio, Bedrock, etc.), many model providers, identity (Okta/Entra/Auth0/Keycloak/etc.), key vaults (Vault/OpenBao/CyberArk/1Password/etc.), policy engines (OPA built-in, Cerbos/SpiceDB/OpenFGA), guardrails, logs/alerts (Splunk/Prometheus/Grafana/Loki/OTel), object storage (S3/MinIO/Azure/GC).

## Enterprise AI Services
- **AI Agent Development** — custom agents, MCP integration, multi-cloud orchestration, RAG/fine-tuning, production deployment/scaling.
- **AI Security & Governance** — agent IAM, least-privilege, audit/SIEM, prompt-injection defense, compliance frameworks.
- **Enterprise Integration** — GCP/AWS/Azure, databases/data warehouses, SaaS (Salesforce/ServiceNow), legacy APIs, real-time pipelines.
- **AI Strategy & Advisory** — readiness, use-case prioritization/ROI, team structure/hiring, vendor selection, governance.
- **Identity & Cloud Engineering** — IGA, AM, PAM, identity orchestration, decentralized identity, PBAC, Web3; engagement models (Project, Staff Aug, Advisory, Managed Service, Support Blocks, Fixed-Bid/T&M/Milestone). 

## AI Sentinel Protocol
Four stages of AI security maturity: **Aware** (weekly threat intelligence), **Active** (real-time monitoring/alerts/playbooks), **Aligned** (central policy, compliance automation, audit trails, RBAC), **Autonomous** (self-defending AI, autonomous response, self-healing, predictive modeling, continuous evolution). Also "Why AI Sentinel?" — enterprise-grade security (20+ years IAM expertise), AI-native, full stack coverage, real-time response, evolving protection, compliance ready (SOC2, ISO 27001, GDPR). 

## About / Team (from pages)
Built by enterprise identity/access security experts with **20+ years** in financial institutions, government, healthcare, higher education. Co-founders: **Ted Balfour** (CEO/Co-Founder), **Adam Callen** (CIO/Co-Founder). Extended team named (Kurt Bitner, Sifer Aseph, Sam Ng, Matt Cox, Charles Fee, April Valot). Media: "Nyedis Anarchy Series" on YouTube (@nyedisiam). 

## Key facts / positioning
- Tagline: **"See. Prove. Stop."** (Argent)
- "Enterprise AI That Delivers" (homepage)
- Open source core under Apache-2.0
- "Zero phone-home" (air-gapped capable); nothing phones home at runtime
- 26 checks / 33 steps per request; < 100 ms policy decision
- Build SOC 2 evidence bundle in under 30 seconds (offline-verifiable)
- 500+ enterprise deployments (site claim, 2026-10-19)
- "No model training" guarantee stated in Trust/Security framing (data never used to train/fine-tune models)

## Contacts
- Email: **ai@nyedis.com** (demo/contact)
- YouTube: https://www.youtube.com/@nyedisiam
- Company: https://www.nyedis.com
