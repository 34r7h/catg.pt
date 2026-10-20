# RunVault — distilled knowledge (from runvault.ai, crawled 2026-10-18; reviewed 2026-10-19)

## What it is (30 seconds)
**RunVault is an AI agent infrastructure platform** providing a fully managed agent runtime. Each agent gets a real Linux sandbox with persistent `/workspace` storage. A server-side credential proxy keeps secrets out of the sandbox (injected only for the bound host), and every action is logged via audit trail. 

**One line per audience:**
- Engineering/DevOps: "Give an agent a real shell with secrets locked out, RBAC, audit logs and schedules."
- AI/agent builders: "Orchestrate agents with persistent workspace, skills, MCP servers, and on-demand sandboxes."
- Security/compliance: "Server-side secret injection (per-host), full audit trail, RBAC with per-resource grants."

## How it works (3 core parts)
1. **Sandbox** — Real Linux box; agent owns it. `/workspace` persists across restarts. No credentials land in sandbox env.
2. **Credential proxy** — Holds credentials server-side; injects only on calls to the hostname bound to each integration (prevents exfiltration via prompt injection).
3. **Audit row** — Every call logged with actor, tool, target, status (sandbox shells, integration calls, schedule fires, role changes).

## Key facts (from site)
- Model: **Anthropic Claude Haiku 4.5** (built-in, no separate Anthropic bill). Free tier includes **2,500 model credits/month**.
- Free tier: 1 workspace, 1 seat; up to **5 schedules**, up to **5 skills**; sandbox + persistent `/workspace`, credential proxy + integrations, full audit log. No credit card.
- RBAC: Owner / Admin / Member / Viewer + per-resource grants (least privilege).
- Integrations/MCP: HTTP APIs via credential proxy; MCP server support (bring internal tooling).
- Schedules: cron/one-shot tasks; per-message debugging (tool calls, tokens, latency, system prompt) for owners/admins.
- Persistence: `/workspace` is persistent (volumes); anything outside treated ephemeral.
- Slack/Telegram/Discord: stated as coming (not available publicly yet).

## Audiences & use cases
- **Ops/on-call**: run real commands (shell/kubectl/curl) via proxy; every action audited.
- **Scheduled reports**: cron-owned by agent; secrets never touch sandbox.
- **Data wrangling**: drop files in `/workspace`, use jq/csvkit/pandas; files persist.
- **Integration glue**: connect HTTP API/MCP once; proxy injects secret only for bound host.

## Positioning
- **vs roll-your-own container+LLM**: main value is guardrails (secrets out of sandbox, per-host scoping, full audit trail, RBAC, schedules/skills/MCP included). Time to useful agent: under a minute vs days/weeks.

## Specifics
- Pricing: free to start (Team pricing "Coming soon"); contact form for team needs (SSO/SAML, custom roles, longer audit retention/export, priority support).
- Contact: website contact form (turnaround stated within 48 hours).
- Auth/app: sign in via Google; app at https://app.runvault.ai.
- Languages: English.

## Contacts/links
- Home: https://runvault.ai/
- App/login: https://app.runvault.ai
- Pricing: https://runvault.ai/pricing
- FAQ: https://runvault.ai/faq
- Contact: https://runvault.ai/#contact
