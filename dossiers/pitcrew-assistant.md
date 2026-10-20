# PitCrew — distilled knowledge (from the website as of 2026-10-19)

## What it is (30 seconds)
**PitCrew is "The AI Crew Built for Financial Firms" — a governed AI platform of work with agents, policies (Ground Truth), documents/data (Collections), a Q&A assistant (Ask Kitt) and an evidence trail.** Delivers configured, running automation in ~5 working days (live in production on Day 5) via a PitCrew expert who maps workflows and calibrates to firm rules. 

## Core platform (from Platform page)
- **Agent Crew / agents:** 60+ ready-made agents, by the work they do (/agents). Build your own in **Factory** (/platform#factory).
- **Collections:** documents and data agents read/produce (agreements, policies, statements, meeting notes, client files) — upload or connect SharePoint/Google Drive/Box; client documents stay in client pools.
- **Ground Truth:** your firm's rules applied on every run — upload manuals/policies → named rules with owner/version; agents check against them. Three layers: firm policies, client signed docs, regulations. Formal verification (AWS Automated Reasoning) — rule either holds or doesn't.
- **Ask Kitt:** sits on every run/collection/firm; answers cite run, page, rule. Slash commands start agents (e.g. `/run <agent>`).
- **Integrations:** 40+ custodians/CRMs/portfolio systems + Garage (add firm's own API); 127 built-in capabilities. Runs in **Claude, Slack, email, API** — no new app to open.
- **Evidence/Artifacts (Laps/Evidence packs):** every run produces documented output (analysis, exception logs, decision rationale, citations) landing in evidence vault; can assemble exam packs (e.g. SEC Exam Pack) — auto audit trails, organized by regulation, pre-share checklist.
- **"Exam-ready evidence generated as a byproduct of every run"** — addresses multi-day SEC exam prep (cite evidence pack completeness, items).

## Engagement model ("How we work")
- **Four phases, five days:** Catalog (Day 1) → Configure (Day 2) → Calibrate (Days 3–4) → Operate (Day 5). Live in production Day 5.
- **Commitments:** FDE-led (PitCrew expert maps/owns/trains), Factory-delivered (built on platform, you don't touch builder), Outcome-tracked (QA sign-off, SLA reporting, ROI billing monthly tied to skills running, not seats).
- **Guardrails:** scope freezes at Pilot Memo; Day 7 hard ceiling (narrow scope, don't extend); no build without spec; if < 80% calibration agreement after reasonable effort → stop/re-scope; clock pauses when waiting on firm; 20 working days hard ceiling; zero data retention (processed in memory, leaves, nothing trained on); **SOC 2 Type II certified** (three-tier AWS network isolation, KMS encryption, TLS 1.2+).

## Trust & Security (from security page)
- **SOC 2 Type II** — independently audited (Security, Availability, Confidentiality); audit period Oct 2025–Mar 2026; audited by Assurion Services LLC; trust criteria TSP 100 2017 (revised 2022). Full report available on request.
- **Zero data retention** — customer data processed in memory during execution and not stored after completion; removed on request or per contract.
- **No model training** — client data/workflows/outputs never used to train/fine-tune any AI model (by PitCrew or third-party providers).
- **Stateless inference** — LLM calls stateless (no retention beyond request).
- **Infrastructure** — AWS (VPC private subnets, multi-AZ, AES-256 at rest via KMS, TLS 1.2+ in transit), continuous monitoring, DR documented/tested, least privilege + MFA, background checks, security training, SDLC security, vendor risk.

## Skills / use cases (examples)
Covers lifecycle: Marketing & referrals, Prospects & proposals, Client onboarding, Client meetings, Client service, Portfolio oversight, Billing & fees, Data & reporting, Compliance & risk. Billing & fees agents include fee schedule validation, quarterly reconciliation, cash availability analysis, fee calculation/invoices, fee settings vs agreement/ADV, signed agreement check.

## Free resource
**"Five Steps to Governed AI"** — 85-page free e-book (read online or download PDF) outlining a 5-step discipline (Decide / Ground / Calibrate / Prove / Operate). 95% of AI pilots never reach production; argues advantage is proving AI followed firm rules.

## Team (from About/Team)
Built by operators from LegalZoom, Intuit, Atlassian, Freshworks. Co-founder/leadership: Rishi Kulkarni (co-founder of Revvsales, acquired by LegalZoom; led LegalZoom India ops, AI CoE), Sameer Goel (solutions specialist, 30 years), Ramesh May (product exec; led Mint at Intuit, Commerce at Atlassian), Nixon James, CFP® (founder Shepherd Advisor LLC).

## Contacts
- Book diagnostic call / Get in touch via site (forms)
- "Tell us what's eating your team's time" form on homepage/platform
- Social/links: LinkedIn https://www.linkedin.com/company/pitcrewinc/
