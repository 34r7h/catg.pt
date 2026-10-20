# Taxnova — distilled knowledge (from the website as of 2026-10-18)

## What it is (30 seconds)
Taxnova is an AI-powered R&D tax claims automation platform for tech companies. It finds qualifying capital expenditure (capex) and R&D tax credits directly from company engineering and financial data, rather than reconstructing them from timesheets and interviews. The platform connects to existing tools (GitHub, Jira, Linear, GitLab, Bitbucket, Azure DevOps, Confluence, Notion, Google Docs, Slack, Xero, QuickBooks, NetSuite) and produces audit-ready claim documentation.

**One line for different audiences:**
- Finance/Tax/CFO: "Automates R&D tax claim preparation with audit-ready evidence, reducing effort ~80% and improving defensibility."
- Engineering/CTO: "Zero engineer disruption on interviews or timesheets — pulls evidence from tools engineers already use."
- R&D advisors: "Complements advisors (doesn't replace them) by automating data collection and producing traceable documentation."

## How it works (3 steps)
1. **Connect** — read-only access to engineering/finance systems (setup ~30-60 min). Never writes back, no source code access, metadata only.
2. **Identify & size** — AI identifies qualifying R&D projects, contributors, time allocations across teams/countries from actual activity (tickets, commits, documents). 
3. **Claim ready** — generates technical narratives linked to source evidence (audit-ready), for review and submission with your advisor.

## Key facts
- **Coverage**: Live in US, UK, Canada, France, Spain. Planning 10 more countries by end of 2027.
- **Security/compliance**: SOC 2 Type 2 (Trust Center: trust.taxnova.ai), encrypted in transit/at rest, annual 3rd-party pen tests, no training/fine-tuning of LLMs on client data, isolated storage per customer, UK GDPR/GDPR, DPA available, read-only/scoped tokens revocable anytime, Slack limited to explicitly connected public channels.
- **AI**: Uses third-party LLM APIs (Anthropic, Google Gemini/Vertex AI); providers contractually prohibited from training/fine-tuning on client data. Processing is processor-side for client work.
- **Pricing**: Not stated on public site (price on request / via demo).
- **Integrations**: Engineering — Jira, Linear, GitHub, GitLab, Bitbucket, Azure DevOps. Docs — Confluence, Notion, Google Docs. Comm — Slack. Finance/Payroll — Xero, QuickBooks, NetSuite.
- **Differentiator**: Evidence-grounded (every claim item traced to source tickets/commits/docs), continuous capture (avoids year-end scramble), covers multi-country rules, works alongside advisors.
- **Backed by**: a16z Speedrun, s16vc, Karaoke Club and operators.

## Three audiences
### Finance leaders (CFO, FD, Controller)
- Audit-ready, traceable documentation with rationale for each decision.
- Earlier visibility into accumulated R&D amounts throughout the year (not just YE).
- Systematic coverage across teams/geographies, reduces underclaiming risk.
- Fits alongside existing advisor/internal tax team.

### Engineering leaders (CTO, VP/Head of Eng)
- Pulls evidence from tools already used; few targeted follow-ups (no broad surveys/interviews).
- Narratives grounded in tickets/commits/docs, reducing revision cycles.
- ~80% reduction in prep effort reported (per case studies).
- Preserves engineering focus on shipping.

### Advisors / multi-country orgs
- One platform covering multiple jurisdictions (US, UK, CA, FR, ES) with rule alignment; expands to 10 more by end-2027.
- Produces structured outputs designed for audit defense; advisors retain final review/sign-off.
- Transparent with assumptions/confidence and explicit decision rationale.

## Positioning / objections
- **Not replacing advisors**: Complements existing R&D tax advisors (handles heavy lifting, improves quality/evidence). Explicitly stated.
- **Reduces audit risk**: Evidence-first, traceability, consistent narratives, explicit assumptions/gaps.
- **Beyond generic LLMs**: A purpose-built pipeline beats general-purpose agents on completeness (missed projects/people/contributions), evidence depth, and ability to signal gaps (per published Claude vs Taxnova benchmark). General models struggle to cover multi-project people and large corpora without purpose-built ingestion/workflow.

## Case studies (highlights)
- **incident.io (UK, 40+ engineers)**: ~80% reduction in prep effort, lighter process, clearer defensible documentation, less senior engineer time.
- **causaLens (UK)**: Time allocation work reduced from weeks to a couple of hours; surfaced projects missed manually; systematic, evidence-backed.
- **Augment (US, ~100 engineers)**: Helped identify ~$500K R&D credit they lacked visibility into with more defensible, transparent, data-grounded approach; better economics.

## Specifics for answers
- **Source of truth**: taxnova.ai (RU/UK site; content in English). 
- **Data handling**: Read-only, metadata only, no source code, never trains/fine-tunes models on client data, isolated per customer, revocable tokens.
- **Scope**: Focuses on data preparation (project identification, time allocation, evidence/narratives). Costing/tax computation/filing typically done with advisor (out of scope of the automation layer).
- **Benchmark note**: Taxnova published a comparison vs Claude Fable (2026) showing purpose-built pipeline avoids missed projects/contributors and better represents multi-project work.

## Contacts
- Website: https://taxnova.ai/
- Trust Center (SOC 2): https://trust.taxnova.ai/
- Legal: Privacy/Terms at https://taxnova.ai/legal/privacy and https://taxnova.ai/legal/terms
- Demo: https://calendly.com/d/ctjs-87b-hch
- Founder: George Nichkov (CEO/CFO), Maria Malykh (CTO)
- LinkedIn per CSV: Emily Cummin (poster) — per founder's intro in the Connectors WhatsApp group — not stated on the site.

(End of file)
