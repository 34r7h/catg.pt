# DesignLoop — distilled knowledge (from the website as of 2026-10-19)

## What it is (30 seconds)
**DesignLoop is a client website-feedback tool for agencies and freelancers.** The owner creates a review link for a website (or PDF); the client opens it and leaves comments pinned to the exact spot on the page — no account, no extension. Each request keeps the original screenshot, device size and suggested replacement copy. The owner then hands selected requests to their coding tool (Claude Code, Cursor, Codex — via copy, AI link or MCP), checks the returned proof on a private Implementation board, and only the owner can mark a request complete.

**One line for different audiences:**
- Agency/freelancer: "One review link replaces the email/chat/screenshot mess — and requests go straight to your coding agent, but you keep final approval."
- Client (guest reviewer): "Open the link, click what you want changed, suggest the exact wording — no account needed."
- Founder/dev using coding agents: "Your agent implements agreed client requests and submits proof; you approve before anything is closed."

## How it works (the review loop)
1. **Create a review** — add the website URL, start a named feedback round.
2. **Share one link** — the client browses the site (even at phone width), selects an area or text, comments, can suggest replacement copy (Copy mode → Suggest), request removal (Strike), and attach reference images.
3. **Hand off** — the owner sends agreed requests to Claude Code, Cursor or Codex: Copy for AI (one request), Copy AI link (whole current round; tool must support reading links), or Connect the review via MCP (private progress + submitted screenshots return to DesignLoop).
4. **Review and approve** — the Implementation board shows progress and submitted proof (private to the owner); the owner compares against the original request (Compare view: original screenshot beside the current result), asks for another pass if needed, and marks items "Approve and mark implemented". Clients see statuses; they never see owner notes or implementation activity.
5. **Rounds** — each review has named versions: one open for new comments, closed rounds stay as read-only history. Topics, contributor filters and bulk status updates are available.

## Key figures (website, with dates, as of 2026-10-19)
- Pricing: **Freelancer $19/mo ($190/yr) — 5 active projects; Studio $39/mo ($390/yr) — 15; Business $99/mo ($990/yr) — 50**. All plans: unlimited guest reviewers, unlimited feedback rounds, coding tool handoff, before/after comparisons.
- **7-day free trial**, starts with the first project, **no card required**; existing feedback stays readable after the trial.
- PDF reviews: PDFs **≤ 20 MB**. Submitted changes: up to **3 screenshots** (PNG/JPEG/WebP, ≤ 5 MB each).
- Guests always review for free; finished projects can be archived to free active-project slots.
- Site copyright: © 2026 DesignLoop. No customer/user counters published.

## Three audiences and what each gets

### Agency / freelancer / small team (owner)
- One review link per project; clients comment on the page itself; the original screenshot stays with the request even after the site changes.
- Active/History views, named rounds, topics, contributor filters, bulk status changes, reopen for another pass.
- Website reviews and PDF reviews in the same project list (same Active/History, versions, approval flow).
- Before-and-after comparison for every change; the client request stays open until the owner approves.
- Checklists for verifying changes (copy, images, layout, buttons, menus/forms, removed content) on the same device size as the original request.

### Client / guest reviewer
- Opens the shared link, identifies as a guest, comments — **no account, no extension, always free**.
- Can select text and suggest exact replacement copy, pin numbered comments to elements, review at phone width (device size captured), attach reference images.

### Developer / founder with a coding agent
- Three handoff options: Copy for AI, Copy AI link, MCP connection (named project token per review, or account-level connection via ChatGPT/custom MCP at mcp.designloop.ai/mcp with OAuth).
- Claude Code / Cursor / Codex each have a step-by-step workflow guide: connect → list active feedback to confirm the right review → make the agreed changes → submit with screenshots → owner approves on the Implementation board.
- Permissions: one-review connections (that review's feedback + private owner notes + implementation activity) vs account connections (all reviews you own + can create website/PDF reviews); revocable from the review or dashboard Connections page. **A connection never grants publishing access to the website.**

## Positioning (objections from the site)
- **Vs. screenshot markup / browser extensions / installed widgets:** DesignLoop is a shared review link — nothing for the client to install, comments stay connected to the page area, and the original screenshot survives site changes (the site compares these four annotation methods in a table on /website-annotation-tool).
- **"Do AI changes go live automatically?"** No. DesignLoop is a place to review implementation proof before marking feedback complete; publishing is controlled by the permissions and workflow in your coding tool — a DesignLoop connection does not grant access to the publishing account.
- **"Can the agent mark things done itself?"** No — only the project owner can approve and mark a client request implemented; agents return progress and proof privately.
- **Staging sites:** yes, when the staging URL is publicly reachable; sites behind private networks or logins may need another setup.

## Specifics for answers
- Clients never need an account; anyone with a shared link can view the review and comment as a guest.
- Works on public websites incl. Webflow and WordPress builds, plus coding-tool-built sites; the coding tool needs access to the site's source project to implement changes.
- PDF reviews: page comments, selected text, suggested replacement text, image attachments.
- MCP endpoint: https://mcp.designloop.ai/mcp (Streamable HTTP, OAuth; ChatGPT connection needs Developer mode; consent grants access to reviews you own incl. private notes and implementation activity; revoke via Connections).
- ChatGPT can create website/PDF feedback links, find a review, and summarize current-round feedback.
- Trial: 7 days from first project, no card; the trial is also started when connecting an MCP client that creates a first review.
- Pricing page/FAQ do not exist as separate URLs — they are homepage anchors (#pricing, #faq); /about, /contact etc. return errors.

## Contacts
- No public email or support channel is listed on the site. Start free / sign in: https://app.designloop.ai/login
- Site guides are authored "By Vince" (matches the Connectors WhatsApp contact Vince, lid 120736429637646@lid).
