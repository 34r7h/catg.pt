# GlossDocs (Gloss) — distilled knowledge (from the website as of 2026-10-18)

**Gloss** (glossdocs.com) is a review layer for AI-generated documents: "Publish rich HTML reports, proposals and plans. Collect comments directly on the document, then bring the feedback back to your agent for revision." Headline: "Beautiful HTML. Thoughtful feedback."

## The workflow (5 steps shown on the site)
1. **publish** — the agent writes HTML and publishes it to Gloss → stable link (e.g. https://glossdocs.com/d/kX2…), version 1.
2. **review** — reviewers invited by email; they sign in with Google and comment in context ("one link for everyone").
3. **brief & replies** — `gloss:brief` returns open threads as Markdown grouped by the document's own outline (example: 8 comments, 7 threads, 4 sections); the agent drafts replies shown before posting.
4. **replies land** — replies post under the reviewer's words; threads stay open.
5. **revise & republish** — the agent edits and republishes to the **same link**; re-placed comments show on the new version.

## Positioning and behavior
- Comments stay anchored to unchanged passages; rewritten passages have their comment "set aside" and included in the feedback so it stays visible.
- Reviewers: one link, Google sign-in, nothing to install, **reviewing is free, always**, no reviewer subscription.
- Authors: "Anyone with a Google account can sign in and publish." Sign-in is Google-only — there is no password and no API key.
- Gloss connects through **MCP**; reviewers only need their browser.
- Documents: **scripts are removed** (JS removed, publish response lists what changed); HTML layouts, tables and expandable sections are preserved; **Markdown works too** and is rendered with the same highlighting.
- Republish: link stays the same, every version stays readable, comments re-place themselves.
- Comment deletion: withdrawal removes the words permanently while the thread keeps its shape, so replies survive.
- Data: documents encrypted at rest under per-document keys ("the database alone cannot read them"); **titles and comment text are not encrypted** (stated deliberately).

## Pricing (site, as of 2026-10-18)
| | Included (Free) | Pro |
|---|---|---|
| Price | **$0** | **$12/month per author** |
| Documents | 3 | Unlimited |
| Reviewers per document | 5 | Unlimited |
| One upload | 10 MB | 64 MB |
| Storage | 100 MB | 5 GB |
| Invitation emails / 30 days | 20 | 500 |

"Billed monthly in USD. Cancel anytime; Pro continues through the paid period. 500 invitation emails per 30 days is the fair-use ceiling on Pro. If you reach a limit, your existing documents stay readable and reviewable." **Reviewers never pay; authors start free.**

## Practical details (FAQ on home page)
- Scripts: removed; the publish response lists what changed. Markdown: supported. Reviewers: no install, Google sign-in.
- Non-Claude clients: "Any MCP client that speaks Streamable HTTP and OAuth connects with the same address. There is also a plain HTTP API."
- Can delete a comment? Withdrawal removes words permanently; replies survive.
- Data: encrypted at rest per-document keys; titles and comment text not encrypted.

## Connecting (site /connect)
- Gloss is a **remote MCP server**: address **https://glossdocs.com/mcp**, transport **Streamable HTTP (not SSE, not a local command)**, auth **OAuth in a browser — no API key exists to paste**.
- Claude Code: `claude mcp add --transport http gloss -s user https://glossdocs.com/mcp`
- Codex CLI: `codex mcp add gloss --url https://glossdocs.com/mcp` (writes `[mcp_servers.gloss]` to ~/.codex/config.toml; `codex mcp list`, `codex mcp login gloss`)
- JSON clients (Claude Desktop, Cursor): `{"mcpServers":{"gloss":{"type":"http","url":"https://glossdocs.com/mcp"}}}`
- Client registration is open → approving the client on the consent page is "the only thing standing between anything that can make an HTTP request and a token"; approve once per client, tokens then refresh themselves.
- **15 tools:** publish · list · read · invite · members · remove · brief · comment · reply · withdraw · edit · react · star · delete · restore.
- stdio-only clients need a third-party stdio-to-HTTP bridge ("somebody else's tool and not ours").
- Troubleshooting table: no tools listed → usually transport set to sse/command; browser never opened → ask session to list documents; refused on approval → account lacks permission to publish; else contact hello@glossdocs.com.

## Terms / Privacy (both "Updated 28 September 2026")
- Terms: Gloss is a review layer; author keeps ownership ("What you publish stays yours"), license limited to running the service; acceptable use forbids phishing/malware/spam and attempts to defeat isolation; enforcement = takedown (reversible, destroys nothing) or delisting an author (never unpublishes docs or locks out reviewers); **payments by Stripe**, subscription managed/cancelled via customer portal; **beta** — features/limits may change, service as-is, liability capped at what you paid in the prior 12 months.
- Privacy: holds email + display name from Google sign-in, documents/versions/comments/reactions/reviewer lists, Stripe customer/subscription IDs (never card details), server logs incl. IPs for rate limiting. **No advertising, no third-party trackers, no tracking pixels** ("we cannot tell whether you opened an email"); Cloudflare Web Analytics (cookieless) counts page views but never runs inside a published document (isolated frame); PostHog receives account-activity records keyed by internal identifier, plus e-mail domain; the small on-page script stores nothing on your device — "that is why this site has no cookie banner." Document titles, comment text and quoted passages are deliberately not encrypted. Account closure: write to the site — sign-in/memberships removed, owned documents taken offline, encryption keys destroyed, comments withdrawn.

## Contacts
- **hello@glossdocs.com** (support, privacy and terms contact).
- Sign in: /auth/signin ("Continue with Google"). Example doc: /examples/client-launch-plan (+ .html download). Footer: Gloss · Sign in · Connect a client · Terms · Privacy.
- CSV context (not on site): poster Alex Biba; LinkedIn alexander-biba-b9794771; x.com/AiBuilderMan; github.com/AlexanderBiba.
