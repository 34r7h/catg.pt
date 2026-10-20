# ARF AI — distilled knowledge (from the website as of 2026-10-19)

## What it is (30 seconds)
**ARF AI is a governance and reliability control plane that sits between autonomous AI agents and enterprise infrastructure: before a governed write action runs, deterministic policy gates, an explainable risk score and (where required) a human approval decide whether it proceeds — and every decision is recorded in a signed, tamper-evident audit trail.** Actions ARF cannot model are refused outright ("zero upstream calls"). Storage/ONTAP operations first. Current release label on the site: **v4.3.2 — Axiom** (as of 2026-10-19).

**One line per audience:**
- Platform/SRE leads: "You decide what AI tooling may do in production — ARF enforces that decision, not just documents it."
- Founders/CTOs with nobody to delegate to: "When a customer's security review asks who governs your agents' actions, the answer is something you can show, not describe."
- Teams adopting AI-driven operations: "The speed of autonomous AI, with the ability to explain in writing what happened and why."

## How it works (7-step pipeline from the site)
1. **Application** — any client, any request shape.
2. **LLM / AI agent** — non-deterministic reasoning (probabilistic).
3. **Policies** — matched to tenant rules (ARF control plane).
4. **Risk engine** — explainable scoring (site shows example score 0.31).
5. **Approval** — deterministic gate (the agent cannot approve its own request; an approval admits exactly the call it was given for).
6. **Execution** — runs only once cleared.
7. **Audit trail** — signed, hash-chained, tamper-evident; editing any entry afterwards makes the chain fail verification.

**Recorded demo (simulated ONTAP cluster):** an agent asks to delete production volume `app_data` → ARF records the attempt before anything runs → the delete is held until a storage admin approves → the approval names `app_data` only, so deleting another volume waits again → after approval the delete runs and an independent read confirms the volume is gone → an unmodeled delete (`delete_lun`) is refused with zero upstream calls.

## Key figures (site, as of 2026-10-19)
- Version: **v4.3.2 — Axiom**.
- Free sandbox: **1,000 evaluations/month**, mock responses, no agreement required.
- Pilot snapshot: **free · 3 founding slots**, in exchange for a written reference.
- Write-access review: **$4,500 fixed** for one agent (card or invoice).
- 4 capability subsystems · 7 architecture steps · SOC 2: criteria mapped to control and code, **"Not yet audited."**
- Response commitment: "We reply within two business days."
- Terms of Service effective **October 2, 2026**; AI chat logs retained 30 days; pilot signup data up to 12 months.
- The site states: "No customer quotes or numbers appear here until they are real."

## Four capability subsystems ("Four subsystems, one control plane")
| # | Subsystem | What it does (site) |
|---|---|---|
| 01 | Policy Enforcement | Deterministic execution gates, approval workflows, regional policy controls, cost guardrails |
| 02 | Decision Governance | Audit trail of every governed decision, cryptographic attestation, attribution & accountability, PDF audit report export |
| 03 | Continuous Reliability | Anomaly detection, predictive health scoring, control-theoretic stability monitoring, Lyapunov-guided stabilising actions |
| 04 | Operational Transparency | Explainable risk scores, counterfactual what-if analysis, live Prometheus metrics, causal attribution |

## Three properties a compliance officer asks for (site: "a mechanism, not a policy document")
- **Tamper-evident audit trail** — recorded, timestamped, attributed (including the action proposed alongside the one that ran); anyone holding an export can verify integrity.
- **Mechanical enforcement** — on a governed write path, gates cannot be silently overridden; every override is recorded with its approver.
- **Explainable reasoning** — every risk score comes with its inputs: the prior, the evidence, and the expected loss of allowing, denying or escalating. "Never a black box."

## Three access models (pricing page)
| | Sandbox | Pilot snapshot | Write-access review |
|---|---|---|---|
| Price | Free, no agreement | Free · 3 founding slots | **$4,500** fixed, card or invoice |
| What you get | Simulated decisions | Five-tool write-access map | Map of every write path in the agreed tool inventory + recoverability + scored history + gap list |
| What they need | Synthetic or redacted payloads | Tool list + representative traces | Tool definitions + action history |
| Access to your systems | None | Read-only material only | Read-only material only |
| Enforcement | Simulated only | None — analysis only | None in the review; a gate is by invitation afterwards |
| Support | Community | Founder-led | Founder-led |
After a review, **a continuous gate is available by invitation**, scoped and priced per engagement. "Nothing automatic. No subscription starts and nothing else is billed."

## Positioning / objections (site's own answers)
- **"Is this real / audited?"** SOC 2 trust-services criteria are mapped to the control and code — **"Not yet audited."** No customer quotes or numbers are shown "until they are real."
- **"Is the sandbox production-grade?"** No — "returns simulated responses only… treat it as a demonstration surface," use synthetic or redacted payloads. Terms: sandbox API returns mock data only, rate-limited, "as is", not suitable for production.
- **"Is the engine open source?"** No — "The core engine is proprietary — no public license is granted." The public agentic-reliability-framework code on GitHub is not the ARF engine; the public specification is shared under written terms, not open source.
- **"Is this instead of evaluation/adoption?"** "ARF is built for the step after evaluation, not instead of it."
- **"Why now?"** Autonomous AI is moving from copilots to autonomous workflows; as AI acts rather than recommends, organisations need infrastructure that governs execution, manages operational risk and provides auditability by design.
- **"Why not just use an LLM/agent?"** "Foundation models are probabilistic. Enterprise operations require deterministic control. ARF bridges that gap."
- **"Which agents is this for?"** Teams whose agents move from read-only recommendations to production changes — infrastructure and storage first; other consequential changes (e.g. customer-facing commitments) can be scoped on a call.
- **Regulated answer:** "You may not be the regulated enterprise — your customer is, and their security review is the deadline." Sectors: financial services, healthcare, government & defence, critical infrastructure, enterprise AI platforms.

## Specifics for answers
- Pricing: only the three published tiers; continuous gate "by invitation, scoped and priced per engagement" — never invent a price for it.
- Sandbox API example: `POST https://arf-ai-arf-sandbox-api.hf.space/v1/evaluate` with JSON `{"service_name":"api","event_type":"latency","severity":"high","metrics":{"latency_ms":450}}`.
- Specs (Core Governance Engine, API Control Plane, Enterprise Layer, Enterprise Specification) are "pilot only" — request via /signup.
- Signup form: 3 steps (about you → technical details → budget & terms); fields include industry, role, company size, HQ. Work email used only for pilot coordination — "no mailing lists, no spam."
- Privacy: data may be processed in the US (Standard Contractual Clauses); no sale of personal data; demo hosted on Hugging Face (mock data only).
- FAQ page lists 15 question headings (general, usage, performance & limitations, engagement & licensing) but the answers are rendered client-side and were not captured in the crawl — do not invent answers; direct to juan@arf-ai.com.

## Contacts
- juan@arf-ai.com (on every page) · Book a call: https://calendly.com/petter2025us/30min · LinkedIn: https://www.linkedin.com/company/agentic-reliability
- Slack community (invite link in footer) · GitHub: https://github.com/arf-foundation · Hugging Face: https://huggingface.co/ARF-AI · Risk demo: https://arf-foundation.github.io/arf-risk-demo/
- Pilot request: https://arf-ai.com/signup ("The founder replies personally, with no commitment required.")
- Per the founder's intro in the Connectors WhatsApp group — not stated on the site: Juan Petter.
