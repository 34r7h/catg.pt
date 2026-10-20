# Diagrm — distilled knowledge (from the website as of 2026-10-19)

## What it is (30 seconds)
**Diagrm is the visual system of record for AWS architecture** — a shared canvas where architects, FinOps and security can all see cost, risk and compliance **before a single resource ships**. You drag, configure and connect real AWS services (no YAML, no code), get inline AI flags for security/compliance/best-practice risk with plain-language explanations and suggested fixes, and watch real-time cost and ROI estimates update as the diagram takes shape. The company calls the category **Infrastructure-as-Diagram**: the diagram is the architecture, not a picture of it.

**One line for different audiences:**
- Solutions architect: "Draw, configure and deploy real AWS resources on one canvas — the primary workspace, not a side diagramming tool bolted onto code."
- FinOps: "Forecast cloud cost and ROI as the architecture takes shape — budget conversations at design time, not invoice time."
- Security/compliance: "Best-practice and compliance flags (HIPAA, PCI, SOC2) surface inline on the canvas, in language a non-engineer can act on."

## How it works (3 questions, one canvas)
1. **Build** — drag, configure and connect real AWS services on a visual canvas; no YAML, no code required to see the shape of your system.
2. **Validate** — inline AI flags for security, compliance and best-practice risk appear as you design, each with a plain-language explanation and a suggested fix ("not a black box").
3. **Forecast** — real-time cost and ROI estimates update alongside the diagram, so spend is a design input, not a surprise after deployment.

Category mechanics (from the blog): every canvas operation is captured as an **immutable, versioned declaration of infrastructure intent — "design as a commit."** One authoritative record means no drift; designs are versioned and reversible (compare two architectures, promote deliberately); the same model supports role-specific views (cost, security, performance, compliance, reliability); findings are **deterministic and explainable**, not probabilistic scores.

## Key figures and status (with dates, as of 2026-10-19)
- **Beta launched August 1, 2026** — canvas, cost calculator and best-practice flags live ("Live with Continuous Feature Improvements").
- **Soft launch September 15, 2026** — wider rollout as the beta hardens.
- **Ongoing** — security, performance and cost view modes ship progressively.
- **Free beta · AWS-first** (site badge).
- Blog series: 5 posts by the founder, **Jun 30 – Sep 2, 2026**.
- Third-party stats the blog cites (attribute always): **Flexera 2026 State of the Cloud** (750+ decision-makers): ~**29% of cloud spend wasted** — first rise in five years, attributed to AI workloads; up to **50%** in container-heavy environments. **Uber burned its entire annual AI budget in four months** (April 2026 admission; Fortune, May 2026). Site claims bad AI architecture choices can inflate a bill **5x–10x**.

## Why it exists (the blog's argument, in order)
1. **Pandemic origin (6/30/26):** in 2020 a food-delivery platform the founder advised survived a demand spike by spending millions on reactive scaling — duplicating whole parts of a monolith instead of the 2–3 constrained components. "The most expensive infrastructure decisions are almost always made months before anyone realizes they are expensive." Tools exist for the *after* (deploy, monitor, optimize); nothing serious for the *before*.
2. **AI costs (7/9/26):** architecture locks in AI cost before deployment — shared autoscaling inference + caching + data placement can run **5–10x cheaper** than a always-on dedicated GPU endpoint; FinOps tools only look backward at invoices.
3. **Architecture drift (7/22/26):** manual diagrams start true and drift; teams run "two architectures" (the one they think they have vs the one running); discipline never fixes it because diagram and system are two separate artifacts; IaC captures implementation, not intent.
4. **System of record (8/5/26):** finance has ERP, sales has CRM, engineering has Git — cloud infrastructure has nothing; knowledge is fragmented across diagrams, IaC, observability, FinOps and scanners, so nobody can answer "why does this exist?"; enterprises resort to multi-million-dollar ground-up re-architecture when careful analysis would do.
5. **Infrastructure-as-Diagram (9/2/26):** the category that fills the gap — cost before spend, reversible decisions, one diagram many lenses, deterministic analysis; NOT prettier diagramming, NOT an IaC replacement — the design-time layer underneath existing tools; long-term vision: "the blueprint becomes the primary point of access for infrastructure — the way Git became the primary point of access for code," then an infrastructure operating system.

## Three audiences (homepage)
- **Solutions architects** — design without switching tools; the canvas is the primary workspace.
- **FinOps** — see spend before it happens; budget talks at design time.
- **Security & compliance** — "Review posture, not paperwork"; HIPAA, PCI, SOC2 flags inline in non-engineer language.
- Site framing: "Cloud tooling was built for one specialist. But deployment decisions aren't made in a silo." — bridging solution architecture, FinOps and security.

## Positioning (objections from the site)
- **"We already have diagramming tools."** → They "describe, they don't govern, and they drift"; a system of record can't be assembled from tools that each begin after the decision is made.
- **"Our IaC is the truth."** → IaC describes implementation, not intent — "a pile of templates is not a blueprint any more than a transcript is an explanation."
- **"We have FinOps dashboards."** → They operate on running infrastructure: excellent at what you spent, structurally incapable of what you're about to spend.
- **"Just keep diagrams updated."** → Manual sync loses to deadlines every time; structural fix = one artifact (design = record).

## Specifics for answers
- Sign up: **beta.diagrm.com/create-account** (Login: beta.diagrm.com/login). Product is in beta.
- Pricing: **free beta**; for anything commercial the blog says email **contact@diagrm.com** — "we will price a real design with you." Never quote prices.
- AWS-first: the canvas models real AWS services (examples in diagrams: API Gateway, Lambda, DynamoDB); no other cloud provider is stated.
- **The /shop and /cart pages are uncustomized store-template placeholders** ("Product Name", $25.00) — do NOT present them as products or pricing.
- Founder quote: "The most expensive infrastructure decisions are almost always made months before anyone realizes they're expensive."
- The site does not state fundraising activity — do not claim it's "raising a Seed" (not on the site).

## Contacts
- contact@diagrm.com (footer + blog CTA) · Founder: **Javier Navarro-Machuca, PhD** — Founder & CEO; formerly a principal solutions architect scaling infrastructure for fast-growing tech companies (LinkedIn: javiernavarromachuca) · Company LinkedIn: linkedin.com/company/diagrm
- © Diagrm, Inc. · Privacy · Terms · Contact · Newsletter form on the homepage
