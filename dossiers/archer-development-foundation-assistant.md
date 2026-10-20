# Archer Development Foundation — distilled knowledge (from the website as of 2026-10-19)

## What it is (30 seconds)
**Archer Development Foundation is a nonprofit organization in formation that is drafting OASIS — the Open Agent Systems Interoperability Standard: an open interface so AI agents can discover specialized services, act with bounded permission, and carry attributable evidence of what happened — without being locked to one platform.** The site labels everything a working draft: "OASIS-0001 · v0.1-DRAFT", "Proposed architecture. No ratified standard or deployed network is implied."

**One line per audience:**
- Researchers/providers: "A public technical brief and an open research agenda on evidence, concurrency and offchain effects."
- Independent implementers/integrators: "An interface anyone can implement — conformance vectors and licensing terms still to be published."
- Institutions/sponsors: "A consortium now forming (Founding/Contributing/Supporting tiers), standing earned, governance proposed."

## How it works (the model, as proposed)
- **Problem the site states:** today an agent's access to a service depends on an operator's catalog, credentials, invocation conventions and private history; open client code alone doesn't remove that.
- **The six-stage conceptual lifecycle:** Discover → Verify → Route → Authorize → Consume → Attest (ServiceDescriptor → InvocationRequest → InvocationEnvelope → Delegation & consent → EffectReport → ExecutionReceipt/RecordUpdate; OASIS-0008 FeedbackEvidence is OPEN/informative).
- **One response, four independent concerns:** data · cost · authorizations[] · record.
- **Topology (proposed):** principal+agent → chosen indexer (signed descriptors) → compatible executor (policy/quote/invocation) → service adapter (provider logic/credentials) → external systems; optional registry/evidence chain anchors references, not raw credentials.
- **Design sequence:** first provider-hosted adapters (portable contracts with existing endpoints), later network-hosted workers (to be evaluated).
- **Payments:** rail-neutral profiles — flat-stablecoin profile in the first repo proposal; x402 compatibility needs a separate profile; cards via Stripe MPP Shared Payment Tokens as a candidate extension. "Signing or submitting a transaction does not establish finality or service delivery."

## Key figures (site, as of 2026-10-19)
- Status: **OASIS-0001 · v0.1-DRAFT · OPEN SPECIFICATION** (working draft, not ratified).
- Message contracts in the brief: OASIS-0002–0007 core, OASIS-0008 (FeedbackEvidence) informative/open.
- **4 design objectives** (identity that travels; catalog anyone can rebuild; execution with choice; history you can carry).
- **6 open research questions** (Q.01–Q.06: evidence/reputation, concurrency & shared budgets, offchain effects after ambiguous timeouts, availability & privacy, network economics, ongoing authority after invocation).
- **Proposed milestones:** 2026 make the contract explicit · 2027 demonstrate independence · 2028 evaluate/build coordination harness · 2029 groundwork for an open node network. The charter states: "Years express goals, not delivery commitments."
- Consortium: **3 proposed membership tiers** (Founding, Contributing, Supporting); **3 ways to participate** (Foundation team member, consortium member, integrator).
- Timeline page: Web1 (readable) → Web2 (platform) → Web3 (ownable) → Web4 (agentic, explicitly "a possible next chapter / proposed", not a settled era).

## Audiences and what each gets
### Researchers, service providers, institutions
- Public technical brief (/standard) and proposed charter (/charter) are discussion documents; the foundation invites counterexamples, threat models, test cases and reproducible experiments.
- Consortium "is forming"; governance and ratification rules remain proposed; "no membership confers control over the specification; it stays open to every implementer."
- Membership "begins with a conversation" — "a person reads every request and replies."

### Independent implementers / integrators
- Goal: "an interface anyone can implement; conformance and licensing terms still require publication and review."
- Proposed v0.1 program: core candidates OASIS-0001–0007; schemas and signing vectors; REST/MCP transport profiles; bare-key and custodian-assisted identity; flat-stablecoin payment profile. Informative: feedback evidence, x402 and MPP extensions, merchant linkage, ERC-8004 registry integration.
- **Proposed release gates:** shared vectors (independent TypeScript and Python verifiers agree); multi-provider continuity (execute through another compatible operator while the original is unavailable); user-controlled identity and recovery; honest implementation reports ("a mocked processor interaction is not payment-provider interoperability evidence").

### People who want to work with the Foundation
- Join form (/join): Foundation team member (contractor to board/director level), consortium member (asynchronous), integrator.
- Form fields: first/last name, business email, title, organization, LinkedIn, referral, X, Threads, website, ORCID, message, email consent. "This is an interest form… It creates no employment or other legal agreement."
- Member portal (/login): passkey or email code; "Access is limited to approved emails. Ask an administrator to add yours."

## Positioning / objections (site's own framing)
- **"Is this live?"** No — working draft; no ratified standard, no deployed network. Numbered specifications, public vectors and independent implementation reports are "proposed deliverables."
- **"Is there a token / which chain?"** No custom chain, L2, canonical anchor chain or native token is selected by the core proposal; "No token is required for the initial milestone." A chain is a profile choice to be evaluated later.
- **"Does a signature prove the outcome?"** The site's open question: no — payment confirmation is not proof of service fulfillment; signed/submitted/confirmed/fulfilled are distinct states.
- **"Is it affiliated with x402/ERC-8004/Stripe?"** No — related-work references only; "References do not imply affiliation, endorsement, or completed integration."
- **Privacy/security hedges:** public commitments must not expose secrets or personal data; keep redeemable payment credentials out of descriptors, logs, receipts and blockchain state.

## Specifics for answers
- Always hedge with the site's own words: proposed, working draft, candidate, informative, "remains to be demonstrated/developed".
- Safety invariants (proposed, to become executable conformance cases): authority before effect; negotiate before billable work; separate attempts from outcomes; scope replay protection; attribute each claim; specify availability and privacy.
- Spec source: github.com/Archer-Development-Foundation/oasis-standard/ (GitHub link is on the /standard page).
- No pricing, no fees, no funding amounts on the site; events and funding commitments "are not yet established."

## Contacts
- No public email or phone on the site.
- Contact channel: the participation form at https://archer.foundation/join ("a person reads every request and replies").
- Member login: https://archer.foundation/login · Spec on GitHub: https://github.com/Archer-Development-Foundation/oasis-standard/
- Per the founder's intro in the Connectors WhatsApp group — not stated on the site: Dan (LinkedIn dankazenoff/).
