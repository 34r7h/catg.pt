# Biobase — distilled knowledge (from the website as of 2026-10-19)

## What it is (30 seconds)
**Biobase (Biobase, Inc.) is a governed network between the systems that hold clinical data — EHR, LIS, PACS, biobanks, billing — and the researchers who need it: one platform, two sides, with the data staying where it lives.** Health systems, labs and biobanks put their archives to work on their own terms; pharma, biotech and AI teams specify a cohort in plain language and get feasibility in minutes instead of a six-month broker cycle. Self-positioning: "We're not another data marketplace. We're the rails that power precision medicine." Mission: "make clinical data accessible across the healthcare value chain, so that data generated in the course of care can accelerate the medicine that follows it."

**One line per audience:**
- Pharma / biotech / AI buyer: "Describe the cohort you need in plain language, see feasibility across the network without any data changing hands, and receive normalized, linked, research-ready data or specimens."
- Health system / lab / biobank supplier: "The most valuable dataset in medicine is already yours — we turn what you hold into revenue through a governed, federated marketplace, on your terms, with custody kept where it belongs."
- Candidate: "Small AI-native team (remote US) building the rails for precision medicine — Claude Code every day, no ticket queue."

## How it works
1. **Describe the cohort** — natural-language intent or precise criteria (indication, stage, specimen, molecular markers); request at biobase.ai/request?intent=data|images|specimens.
2. **Feasibility across the network** — counts and attributes from participating institutions, without data changing hands.
3. **Order with governance built in** — IRB, BAAs and de-identification handled in the workflow; "agents move the process; humans approve the consequential steps."
4. **Receive research-ready data** — normalized, linked, quality-checked, fully traceable; physical specimens or digital datasets.
- Platform's four functions: **Normalizes** (HL7, FHIR, VCF, DICOM, LIMS exports, flat files → OMOP, CDISC, FHIR), **Unifies** (pathology, imaging, molecular, outcomes linked at patient level, across institutions, without data leaving home), **Indexes** (discoverable by research intent, not by knowing which server it sits on), **Bridges** (governed, compliant access between holders and researchers).
- Supplier side: institution keeps custody; de-identification, lineage and audit trails are "enforced by the pipeline itself"; zero-lift onboarding to existing systems; named account ownership and defined response SLAs.

## Key figures (biobase.ai/platform, as displayed 2026-10-19)
- **2 weeks** from request to delivery vs **12 months** of dead ends — top-20 global pharmaceutical company, rare-disease samples Biobase delivered where traditional channels found none; **8 reorders in the next two months**.
- **3 weeks** to onboarded and contracted vs **9-month standard** — global life-science tools & diagnostics company.
- Response timing (biobase.ai/request): most pharma, biotech and AI teams hear back "in the moment they submit; everyone else hears from us within two days."
- No headcount, funding amount, customer count or network-size number is published.

## For the buyer (Life Sciences — pharma, biotech, AI)
- Four claims ("Four things the network gives you"): procurement in minutes not months; multimodal, linked, research-ready (WSI, FFPE blocks, molecular data, clinical outcomes linked at patient level); regulatory-ready packages (CDISC-aligned, FDA/EMA-ready, full provenance and de-identification lineage); built for AI development (scale, diversity, clean labels).
- Also available through existing procurement channels: Registered supplier on scientist.com, Verified supplier on Science Exchange.
- Platform extras: AI-powered dataset search, natural-language querying, federated architecture, HIPAA-aligned de-identification, multi-modal integration, agentic workflows (human in the loop for every consequential action), clinical trial matching (feasibility → site selection).
- Buyer intake (staff view) shows what requests can specify: WSI only / WSI + pathology reports / WSI + clinical outcomes / WSI + genomics; FFPE blocks, slides; indications (breast, lung, prostate, colorectal, other GI, skin, heme, pan-cancer, non-oncology); stains (H&E, IHC, special, multiplex/IF); volumes (<1k → 100k+ slides); must-haves (commercial-use license, de-identified/HIPAA, US-origin, exclusivity).

## For the supplier (Healthcare Partners — hospitals, labs, health systems)
- Three pillars: cohort discovery on your own data (also powers internal work: readmission risk, care pathways, quality metrics, trial-candidate identification); federation on your terms (queries and governed results, not copies — you decide what is discoverable, to whom, under what terms); universal data connection (any format, any quality — "messy, partial, or pristine").
- What partnering looks like: zero-lift onboarding; "new revenue from what you hold"; a real human owns your account with defined response SLAs.
- Contribute flow at biobase.ai/healthcare: tell them what you hold (clinical data / biospecimens / imaging / more than one) — "what it could be worth and how a partnership would work. No commitment, and nothing moves until you approve the terms."
- Referrals (biobase.ai/referrals): refer a buyer or a supplier; "if it turns into a relationship, we'll make it worth your while." Easy pitch line: "data stays where it lives, institutions keep custody."

## Positioning / objections
- vs data marketplaces: "We're not another data marketplace" — federation means the data never leaves the institution; Biobase is a "governed layer," not a warehouse.
- vs traditional brokers: feasibility in minutes "not after a six-month broker cycle."
- Compliance: HIPAA-aligned de-identification, lineage, audit trails are "part of the pipeline, not bolted on afterward"; Terms §7 — the marketing site is NOT intended to receive PHI, healthcare-data obligations live in separate platform agreements; governing law Delaware.
- AI trust stance (careers page): "Our honest position is that AI output isn't trustworthy unverified" — agents handle cohort building/feasibility/procurement, humans approve consequential steps.
- Privacy (as of 2026-10-19): does not sell personal information; uses RB2B/Retention.com visitor identification (opt-out: app.retention.com/optout); stored data requests incl. chat transcripts kept up to 180 days; sign-in tokens ~15 minutes.

## Specifics for answers
- **Pricing:** none published — every deal quoted; say "contact hello@biobase.ai or use /contact" — never invent fees. Supplier revenue is framed as "see what your archive is worth," case studies show outcomes, not rates.
- **Website vs careers:** the CSV pointed at biobase.ai/careers; /careers has two open roles (remote US, report to CPO): Senior Technical Product Engineer $150,000–230,000 + equity; Technical Product Engineer $90,000–170,000 + equity; apply by email to jobs@biobase.ai with links over résumés, no cover letter. Stack: Python/FastAPI, TypeScript/React, Postgres, Azure.
- **Requesting:** plain-language form at /request (plus email fallback), track requests by email one-time link at /track, demo at /contact, supplier at /healthcare, refer at /referrals, staff-only tools at /capture (don't advertise /capture — it's "Staff sign in").
- **Newsletter:** The Biobase Brief, monthly, one edition each for Life Sciences and Healthcare Partners; issues 01 (September 2026) and 02 (October 2026); note from CEO Todd Parker; subscribe at /newsletter.
- **Insights:** two practical guides (preparing a collection for a research partnership; what to include in a biospecimen request) plus Brief adaptations — 6 insight posts total, Aug–Oct 2026.
- **Team (site as of 2026-10-19):** 6 co-founders — Todd Parker (CEO, ex-Paige/Danaher/PictorLabs), Terence O'Keeffe (COO, ex-PwC/Walgreens/Elephas), Jonathan Maddison (CTO, ex-OTTO/Paige), Sam Seymour (CPO, ex-Arterys/Paige/Tempus), Joel Duckworth (CCO, ex-Olympus/Philips/IBEX); Andreas Matthes (CFO, ex-Scientist.com); Akash Parvatikar, PhD (Director of Artificial Intelligence, ex-HistoWiz/UPMC/Oak Ridge); plus advisors (Novartis, Mount Sinai, WashU, Institut Curie) and ~14 named people on the team page.
- **Backing (site):** Nina Capital, DigiTx Partners, Washington Research Foundation, BJC Healthcare, Plug and Play; technology partners Techcyte and ViewsML; member of NVIDIA Inception Program and Alliance for SoCal Innovation. Funding amount not stated.
- **Entity/legal:** "© 2026 Biobase, Inc."; contact for legal: hello@biobase.ai.
- **Response promise:** pharma/biotech/AI teams "in the moment they submit; everyone else within two days" — attribute to /request.

## Contacts
- **hello@biobase.ai** — general, demo, privacy and terms (the only email the site publishes for business)
- **jobs@biobase.ai** — applications for both open roles
- Forms: /contact (demo), /request (buyer intake), /healthcare (supplier), /referrals (introductions), /newsletter (Brief)
- LinkedIn: linkedin.com/company/biobase-ai
- Calendly: calendly.com/tparker-biobase ("Book time with Todd", CEO)
- CSV contacts (not from the site): WhatsApp LID 235089380270095@lid, name "Kash"; LinkedIn akash007 — likely Akash Parvatikar (Director of AI) but the site does not confirm this.
