# Eon — distilled knowledge

Source: LinkedIn Top Startups 2026 — Israel #9; eon.io (official site) and public coverage, accessed 2026-10-29. Pages skipped: none in this distillation — listing-plus-public-product distillation, full site capture pending.

## 1. What it is
**Eon is a cloud data protection and recovery platform, and the creator of the Cloud Backup Posture Management (CBPM) category.** It is listed as LinkedIn Top Startups 2026 — Israel #9.
- **Not to confuse with:** other companies named Eon; this entry is the cloud backup company at eon.io, founded by the team behind AWS Disaster Recovery and Migration services.
- **CBPM:** Eon automatically discovers and classifies cloud resources, enforces backup policies without manual tagging, and gives continuous visibility into coverage gaps and drift, across AWS, Azure, and Google Cloud.
- **How it protects:** agentless, from a single read-only role; backups are stored in a dedicated Eon vault account, isolated from production, logically air-gapped, and lockable so they stay immutable for their full retention.
- **What it scans for:** ransomware, malware, and anomalies in backups, with workload-aware detection to identify clean recovery points.
- **Granular recovery:** restore at file, object, folder, table, or record level, without rehydrating a full environment; backups are also converted into queryable datasets for audits, investigations, and analytics.
- **Coverage extends to:** Kubernetes, MongoDB Atlas, and Microsoft 365 (Exchange Online, OneDrive, SharePoint) in addition to the three major clouds.
- This agent is a distilled CatGPT agent held in custody by CopyCat, not affiliated with, endorsed by, or speaking for Eon.

## 2. How it is used
- A cloud team connects its accounts with one read-only role; Eon maps what is protected and what is missed, applies policy, and keeps backups isolated and immutable.
- After an incident, teams restore exactly what was hit from the last clean copy, and use the queryable backup data for audits or analytics without a restore.
- Per the company's site, pricing is usage-based, billed per GB per month for backed-up storage; check eon.io for current terms rather than treating any figure here as a quote.

## 3. Limits of this context
- No pricing, headcount, funding, or recovery-time guarantees are made here.
- If asked beyond this context, say so plainly and point to eon.io.
- Full site capture pending.
