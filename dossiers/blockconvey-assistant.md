# BlockConvey — distilled knowledge (from the website as of 2026-10-19)

## What it is (30 seconds)
**Block Convey, Inc. builds PRISM — a reliability layer for AI apps that finds failures before users do: "Proof your agents work."** You describe what your AI should do, PRISM generates the users you never tested for, runs against your real app, and turns each failure into a re-runnable test and a fix you can validate. Core thesis: "A request can return 200 OK and still fail the user" — an average over everything hides the two things your AI does badly behind the six it does well. Founded on the direction "from visibility to improvement" (it began with AI governance and observability). Free plan with 100 credits/month; company © 2026, pre-launch polish (privacy/terms still "in legal review").

**One line per audience:**
- Builder/developer: "Connect one AI app on the free plan, find the first thing worth improving — 100 credits a month, no card."
- Production team: "Guardrails, evaluators and end-user intelligence on top of full traces — every failure ends with an owner, a date, and a human sign-off."
- Enterprise/regulated: "Evidence mapped to EU AI Act, NIST AI RMF, ISO 42001 and more — plus the AI Reliability Program: connect, baseline, review, prioritize, validate, report."

## How it works (the loop)
1. **Understand** — describe what the AI should do.
2. **Generate** — Synthetic Scenarios (Beta) create realistic users, changing requests, missing details, tool problems and edge cases ("Six people your agent has not met yet": intent persistence, slot filling, error handling, ambiguity, tone resilience, knowledge gap).
3. **Run** — connect your app (PRISM SDK, standard OpenTelemetry, LangChain/LangGraph, imports, or API; OpenAI/Gemini proxies at prism.blockconvey.com/proxy/...).
4. **Find** — traces, sessions, agent runs, retrieval, tools, timing, retries, scores, final result in one view (AI Observability).
5. **Diagnose** — Agent Intelligence clusters failures across all sessions (classified on every session, not a sample); AI Remediation brings user goal, actual outcome, trace and likely cause together: "User changed intent at 00:03… What to fix: confirm latest intent before processing irreversible actions."
6. **Prove** — Evaluators re-run the check; the fix is validated on the same cohort that found the problem; monthly artefact = score + deltas + report. "PRISM never merges on its own" — knowledge/guardrail changes in-platform, prompt changes as versioned diffs, code changes as PRs, all requiring explicit human sign-off.

## Platform — six capabilities (/prism)
| Capability | Tagline | Plan gate |
|---|---|---|
| Synthetic Scenarios | "Scenarios you never thought to test" | Beta, all plans (credits) |
| AI Observability | "Every step the agent took, in one view" | all plans |
| Agent Intelligence | "See what your AI keeps getting wrong" | all plans |
| Evaluators | "Quality as a check you can run again" | Builder+ |
| AI Remediation | "From failure to a clear next step" | all plans |
| End User Intelligence | "What users asked that nobody answered" | Growth+ |
- Positioning hook: "Your agent has a score, and the score is lying to you" — PRISM's score has six weighted dimensions (task success 25%, correctness 20%, guardrails 20%, user friction 15%, stability 10%, improvement velocity 10%), "fixed per client, stated in every report," Green at 85.
- "The unit of analysis… is a session, with what the user wanted still attached to what they got" — coverage is "100% of production sessions rather than a sample."

## Pricing (blockconvey.com/pricing, as of 2026-10-19)
| Plan | $/mo | Credits | Traces/mo | Retention | Members | Notable |
|---|---|---|---|---|---|---|
| Free | $0 | 100 | 10,000 | 14 days | 1 | core platform, all connectors, KB (50 docs), community support |
| Builder (most popular) | $20 | 400 | 100,000 | 90 days | 5 | + Guardrails (PII/PHI/prompt-injection/regex/off-topic, Monitor+Enforce), Evaluators Hub, human review queue, priority support |
| Growth | $50 | 1,000 | 250,000 | 180 days | 10 | + End User Management, User Risk Profiles, longer audit history |
| Scale | $300 | 4,000 | 1,000,000 | 365 days | 25 | + dedicated Slack, guided onboarding & architecture review, industry scoring (fintech/healthcare/legal) |
| Enterprise | contracted | in agreement | custom | custom | custom | + SSO/SCIM (when available), private deployment, data residency, dedicated infra, custom connectors, contractual SLAs, AI Reliability Program |
- Credit mechanics: one shared balance for all AI-powered actions; PRISM shows action cost + balance before every action; **no automatic overage or plan change** — at zero credits new AI actions pause and existing results stay readable; monthly credits reset, purchased credits persist; failed jobs release reserved credits; top-up minimum 100 credits for $10.
- "Exact limits are confirmed at signup and in the order form." **Compliance reporting is not part of any plan** — a service, on request, scoped before work starts.

## Solutions (/solutions — four paths)
- **For Builders:** "From working demo to real-user ready" — test what you didn't try, connect without rebuilding, see what broke and what to fix first; full core product free before you pay.
- **AI Agents:** "The tool call returned 200. The task still failed." — test the whole run, find the step that changed the result, keep the failure as a test.
- **Conversational AI:** "Turn four is where conversations break" — people don't follow a script; catch the turn where context is lost; measure outcome, not wording.
- **RAG Applications:** "Know whether retrieval or generation failed" — find missing knowledge, separate retrieval vs generation failure, re-run the same question after the fix.

## Enterprise, compliance, security
- **AI Reliability Program** (Enterprise): recurring flow Connect → Baseline → Review → Prioritize → Validate → Report; six deliverables (platform access, guided setup + architecture review, reliability baseline, recurring technical review, priorititized remediation backlog, quarterly executive reliability report); for customer-facing AI in production, high-impact/regulated workflows, and leadership asking for quality/risk/ROI; starts with one important workflow; "does not make changes to production automatically."
- **Compliance** (/compliance): "Evidence, not certification" — PRISM records what the AI did and why; reports map stored evidence to frameworks as a **service on request**: EU AI Act, NIST AI RMF, ISO/IEC 42001, SR 11-7, NY DFS Part 500, NAIC Model Bulletin, CFPB/Reg B, HIPAA, GDPR, DORA, SOX, PCI DSS (12 framework pages linked). New frameworks "added through sponsored development: the first customer who needs one funds it." Trust Packs and human-reviewed, attested reports. Every plan records underlying evidence from day one.
- **Security** (/security): data path — user/app and AI workflow = customer; PRISM connection path = shared; processing/storage/dashboard = Block Convey. Collects only "what the product needs to explain a failure": prompts/responses when configured, session/trace IDs, model metadata, tool calls when supplied, retrieval context, timing/token/cost/errors, eval/guardrail/remediation results, user IDs "only as configured by the customer." Hosted by default; private deployment/dedicated infra/data residency on contract (Enterprise).
- **Legal status (honest gap):** Privacy Policy, Terms and the subprocessor list all state they are "in legal review ahead of the PRISM launch — contact us and we'll send the current copy." Compliance certifications are explicitly NOT offered ("Does this certify us? No.").

## Sample numbers (illustrative — never quote as customer results)
PRISM's own pages show a "sample FinVault reliability report. Design-partner data, synthetic and illustrative": reliability score 78/100 (+6 vs May), failure rate 8.4% (was 12.7%), 48,210 sessions → 4,050 failures clustered → 14 backlog items → 9 fixes proposed → 7 human-approved → 5 shipped & validated; "~$9,700/month measurable value against $5,000/month program cost — ~1.9×"; escalations 9.2%→7.6% (≈771 avoided, ~154 support hours, ~$5,400); ~48 engineering hours saved (~$4,300). The site's footnotes call these "placeholder loaded rates, measured effects only."

## Company, resources, contacts
- **Team (about page):** Arun Prasad — CEO · Aishwarya Birla — CTO · Pavan Marisetti — COO. "Titles are current public information. Full bios are being finalised." Spoken at: NYU AI Conference 2024, Venture Studios Summit 2024.
- **Beliefs:** real outcomes matter (final user result > clean API response); builders need clear next steps (a score isn't enough); "Trust starts with evidence."
- **Resources:** Docs (74KB — integration brief: choose path → instrument → verify → report, API contract, data controls, account limits, failure modes); Guides — 12 titles listed, **all "Coming soon"**; Blog — **"No posts published yet"**; Glossary — "Definitions are being published."
- **Contact:** /contact form exists but **"The form is not connected yet. Email us directly and we will reply from the same address" → arunprasad@blockconvey.com** (only email on the site). Self-serve: /signup (Full Name, Email, Password, Company Name) → free plan; sign in at prism.blockconvey.com/login. Socials: LinkedIn (block-convey-inc), X @blockconvey, Instagram, Threads.
- **CSV contacts (not site channels):** WhatsApp 229020608258273@lid "Pavan" (= COO Pavan Marisetti); LinkedIn post link (Pavan's "I killed founder-led sales" post).

## For answers
- Pricing → quote the five-plan table verbatim with "as of 2026-10-19"; stress free is real ("connect a real AI app… before you pay"), no auto-overage, credits not access.
- Beta/coming-soon honesty: Synthetic Scenarios = Beta; MLflow + tracing platforms + database imports = coming soon/beta; guides/blog/glossary/legal docs = pending — say so plainly.
- Never present FinVault/sample metrics as customer proof; say "the site's illustrative design-partner sample."
- Compliance questions → "evidence, not certification," service on request, 12 supported frameworks.
