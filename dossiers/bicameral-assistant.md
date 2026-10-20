# Bicameral — distilled knowledge (from the website as of 2026-10-19)

## What it is (30 seconds)
**Bicameral is a decision-recall and decision-governance layer for lean software teams working with AI — "the GitHub of Decisions."** It pulls decision context from the team's tools (tickets, docs, meeting notes, agent sessions), connects each decision to the code it governs, keeps a human-reviewed ledger of what was approved/superseded, and runs an advisory "preflight" that surfaces relevant past decisions — and conflicts — before new work starts. Today: **private alpha, local-first, human-reviewed**; it is not generally available.

**One line per audience:**
- Founder/CTO/eng leader: "A source of truth for decisions, so context stops getting lost in Slack and the same argument doesn't get relitigated."
- PM/engineering pair: "Recall and conflict checking in MCP — past decisions and contradictions surfaced before code is written."
- AI-agent user: "Human stays between evidence and authority — nothing enters the ledger automatically."

## How it works (4 steps, from /how-it-works)
1. **Bring in evidence** — a ticket, document, meeting note or agent session explaining what the team is trying to do.
2. **Connect it to the code** — show where the decision applies so the context is useful at the next implementation.
3. **Human review** — a person accepts, rejects or supersedes the candidate. **"Nothing becomes part of the ledger automatically."**
4. **Recall before coding** — advisory preflight returns the relevant decision, its source and its code references before work continues.

**Today:** local-first, human-reviewed — decision capture, code grounding, auditable ledger, advisory preflight (MCP).
**Next (being built, not shipped):** shared context across the team, live integrations (Slack, Linear), coding-agent host paths, drift detection.

## Key figures (site, as of 2026-10-19)
- **Featured on Hacker News — 193 points, 147 comments** (badge on the homepage; item 46866481).
- **Bicameral developer survey: 40+ responses (2026).** Findings: **35%** of technical-constraint communication leaves no persistent record; **52%** share constraints via copy-paste to Slack; **25%** mention them verbally with no written record; ~**one-third** of constraints are already in a product conversation; **~50%** are discovered only during implementation; **70%** of constraints need to reach people who don't regularly interact with the codebase.
- Blog: **7 posts**, Feb 2 – Aug 8, 2026 (authors: Jin Kuan, Leon Schwarzer).
- Alpha fit: team size **21–50 marked "(best fit)"** on the application form.
- Third-party stats the blog cites (attribute as "Bicameral cites…"): Index.dev 2025 (21% more tasks completed, no company-wide delivery improvement), METR 2025 (experienced devs 19% slower yet believed faster), Apiiro 2024 (48% of AI-generated code contains security vulnerabilities), IDC 2024 (only 16% of developer time writing code), Atlassian 2025 (~10 hours/week saved by assistants, largely cancelled out).

## The problem it names (homepage)
**"Communication is the new bottleneck."** Decision fatigue, 4 steps: an idea gets pitched → it gets lost in Slack → it gets lost in the cracks → when you need the result it isn't ready. "The decision gets reconstructed until the original context is gone."
Working example on the site: ticket **PAY-2847** ("Add retry for failed payments") conflicts with approved decision **PAY-1192** ("No automatic retries — customer re-submits payment", approved by Marco (eng), source Notion/ADR-0014, 2026-03-23) → the bicameral bot flags the conflict → "Supersede earlier decision" → "PAY-1192 superseded — recorded to the decision ledger."

## Product pieces shown on the site
- **Agent preflight** in the terminal: "bicameral preflight · 4 decisions on file · Payments" with context and PM notes (e.g. "Priya · PM note on PAY-2847 · 2026-06-20").
- **Controlled corpus:** "Maintains an evidence-backed list of specification decisions, surfacing potential conflicts before they are admitted to the canonical ledger."
- **Curate in the loop:** fetches source candidates from every integration at implementation time, then tracks the promoted ones as governing constraints.
- **Decision card detail:** status (proposed/approved), sources (e.g. `fathom://may-21-risk-review 00:23:47` with a quoted line), governed files (`kyc/review_queue.ts:71-94`), and explicit conflicts ("Overlaps with 'Manual review queue for failed auto-verify' · Marco (eng) · 2026-03-23") with Accept/Reject.
- **Trust model:** "Trust the process, not just the model… a human stays between evidence and authority — before anything becomes part of the ledger." Ungoverned "faulty path" is shown as the alternative that produces conflicting fallback policies.

## Research thesis (blog — the "why")
- **Feb 2, 2026 "Coding assistants are solving the wrong problem"** (Jin Kuan; the HN post): coding assistants bury requirement gaps instead of escalating them; tech debt "is created in product meetings" — deadlines, scope cuts, "ship now, optimize later."
- **Feb 9, 2026 "Why 'just prompt better' doesn't work"**: survey findings above; "AI speeds up implementation but bypasses the very process through which constraints were discovered."
- **Aug 8, 2026 "The Context Laundering Problem"** — "Context management is not a technical problem, it is an authority problem": context passing through customer → brief → Linear → GitHub → agents can be fused into a coherent-looking spec that "smuggles provisional guesses into the mix alongside binding constraints." Their fix borrows from finance KYC: attribute context at the point it enters the system, maintain a review queue separating proposed from binding decisions — "an upstream human provenance layer — who said what, carried across agent sessions." Also cites two Claude Opus 4.8 failure reports as why "unsolicited cleverness" in models is a problem ("when the model invents a product decision, who is held accountable?").
- Company belief: formal-verification techniques applied to spec checking and fast recall; "turn AI from a sycophantic coworker into a predictable tool developers can trust."

## Positioning / objections
- **"Is it another code-analysis/docs tool?"** No — "what is needed is not another code analysis or documentation tool, but ammunition to drive cross-functional alignment upstream."
- **"Will it auto-approve decisions?"** No — human review is mandatory; "Today that means a human stays between evidence and authority."
- **"Is it GA / can I buy it?"** No — private alpha; "See whether Bicameral fits your team." No pricing page exists.
- **"Does it replace my tools?"** No — evidence comes *from* Notion/Linear/Slack/git and lands in the ledger; those integrations are the "next" step.
- **Humans vs AI:** "Why We Bet on Humans" (Apr 28, 2026) — "Human intelligence will always remain king"; the tooling exists so "human developers with their superior ability to creatively problem-solve will always come up on top."

## Specifics for answers
- Alpha application (/waitlist): work email, role (Founder/CTO/VP Engineering/Engineering manager/Other), team size (1–5 / 6–20 / **21–50 (best fit)** / 51–150 / 151+), optional "Where does decision context get lost?". "We'll use your response to understand fit and follow up personally."
- Contact (/contact): form with problem categories; anonymous option; direct email jin@bicameral-ai.com.
- Community: Google Group groups.google.com/g/bicameral — "we would especially appreciate help in architecting our agent harness."
- Privacy page (/privacy) is largely a Google OAuth `drive.file` scope transparency doc: what flows where, what the company can/cannot see as OAuth app publisher, local data, telemetry, contact section.
- Legal entity: **Bicameral AI, Inc.** © 2026. Footer: "team governance layer for AI-accelerated software development."

## Contacts
- support@bicameral-ai.com (every page) · hello@bicameral-ai.com (alpha) · jin@bicameral-ai.com (contact page)
- Apply: www.bicameral-ai.com/waitlist · Contact: www.bicameral-ai.com/contact · Blog: www.bicameral-ai.com/blog · HN: news.ycombinator.com/item?id=46866481
- Per the founder's intro in the Connectors WhatsApp group — not stated on the site: Lovis Axon (LinkedIn lovisaxon/).
