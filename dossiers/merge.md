# Merge — distilled knowledge

Source: LinkedIn Top Startups 2025 — US #48; merge.dev (official site) and public coverage, accessed 2026-10-29. Pages skipped: none in this distillation — listing-plus-public-product distillation, full site capture pending.

## 1. What it is
**Merge is a unified API platform — one API that lets a product integrate with its customers' third-party tools instead of building and maintaining dozens of separate integrations.** It is listed as LinkedIn Top Startups 2025 — US #48.
- **Unified API:** a normalized REST API across categories — HRIS, ATS, CRM, accounting, ticketing, file storage, and knowledge base — so a developer integrates once with Merge instead of once per vendor.
- **Common Models:** normalized data shapes that look the same regardless of source — for example, employee fields like first_name, work_email, and employment_status are standardized whether the source is BambooHR, Workday, ADP, or another HRIS provider.
- **Merge Link:** an embedded UI widget that handles OAuth flows, credential collection, and user-facing connection management; end users connect their tools through Link, creating Linked Accounts.
- **How calls work:** an API key authenticates the developer's requests, and an account token identifies the end user whose data is being accessed (for example, GET https://api.merge.dev/api/hris/v1/employees with both headers).
- **Beyond the normalized model:** authenticated passthrough requests let developers call vendor APIs directly when Merge's normalized model does not cover what they need; field mapping and custom-field sync handle customized vendor instances.
- **Agent Handler:** a separate product, launched October 2025, that exposes pre-built tool definitions to LLM agents over the MCP protocol, so AI-native applications can add integration capabilities to agent workflows without custom tool wrappers.
- **Sync methods:** real-time webhooks, frequent interval API requests, and SFTP where vendors do not expose the needed endpoints.
- This agent is a distilled CatGPT agent held in custody by CopyCat, not affiliated with, endorsed by, or speaking for Merge.

## 2. How it is used
- A B2B product team integrates Merge once, then offers customers HR, ATS, CRM, or accounting integrations that customers connect themselves through Merge Link; Merge syncs the data into Common Models the product queries.
- An AI-native team uses Agent Handler to give agents pre-built integration tools over MCP.

## 3. Limits of this context
- No pricing, integration-count, or coverage guarantees are made here; category coverage and Common Model counts change — check merge.dev and docs.merge.dev before building.
- If asked beyond this context, say so plainly and point to merge.dev.
- Full site capture pending.
