# devrandom — distilled knowledge (from the website as of 2026-10-19)

## What it is (30 seconds)
**devrandom is an open-source, Rust-based accountability stack for AI agents** — "agents you can prove. agents you can stop." Anyone can watch an agent; devrandom lets you **revoke** one: cryptographic identity, a signed history, and a kill switch that works offline. Four layers — an ID card, a flight recorder, a place to run, and a leash — running **on your hardware, cloud optional**.

**One line for different audiences:**
- Developer/team: "Open-source Rust crates you can install today (`cargo add cesr-rs`) — issue your own agent IDs, sign every action, revoke authority mid-task, even offline."
- Company giving agents shell/API/money access: "A record no one can doctor, and a kill switch that actually stops the next action — not a log anyone can rewrite."
- Vendor-wary buyer: "IDs you issue — portable across models, clouds, vendors; your devices form their own network."

## How it works (the site's four-layer stack)
1. **cesr — an ID card for every agent.** Verifiable IDs — issued by you, rotatable, revocable. Implements **KERI**, the open standard.
2. **mnesis — a flight recorder.** Every action signed, hash-chained, replayable. "Don't investigate — rewind."
3. **bombay — a place to run.** Agents live on your devices, talk directly, keep working offline.
4. **agency — a leash.** Grant exact powers, watch them used, take them back mid-task.

Demo shown on the site (illustrative CLI flow): `agency create researcher` (ID issued by you, not a vendor) → `agency watch researcher` (signed: read repo, opened pull request) → `agency kill researcher` (stopped mid-task — authority gone, provably).

## Status / key figures (site's own markers, as of 2026-10-19)
- **cesr: SHIPPED v0.11.0** on crates.io — fuzzed, reference parity, "pre-1.0 by choice". Also keri-rs on crates.io; docs on docs.rs; CI receipts public.
- **mnesis: FROZEN v0.2.0** — API settled; "1.0 waits on bombay". Embedded and Postgres storage.
- **bombay: IN PROGRESS** — the runtime, rebuilt in the open under a strict quality bar.
- **agency:** the leash layer (github.com/devrandom-labs); no version marker published.

## Roadmap (site's stages)
- **[shipped] foundations** — identity & memory kernels (cesr + keri shipped, frozen pre-1.0; mnesis API frozen).
- **[now] runtime** — actors over the wire; bombay rebuilt piece by piece; the identity engine (issue, rotate, delegate, revoke) as pure, testable logic.
- **[next] accountable agents** — identity-bearing actors; grant authority, watch it being used, take it back mid-task; the demo: kill a live agent's authority in front of you, even offline.
- **[later] clients & mesh** — command line, web and phone apps ("your keys never leave your device"); the airplane-mode demo (devices keep working as a team offline); share your GPU — serve local models to your own devices with permissions and receipts.

## Positioning (the site's `diff status-quo devrandom`)
| Status quo | With devrandom |
|---|---|
| No real record — a log anyone could rewrite | A record no one can doctor — signed, ordered, replayable |
| No real kill switch — watching isn't stopping; the API key can't stop what's already running | Revoke mid-task — the next action fails cryptographically, not a rule that might miss. Even offline |
| Not really yours — agents live in a vendor's account | IDs you issue — portable across models, clouds, vendors |
| Nowhere but the cloud — offline, your agents die | Your devices form their own network — even on a plane |

Problem framing: "You're handing AI agents your shell, your APIs, your money — and detecting what one did isn't the same as being able to stop it."

## Specifics for answers
- **Open source, in Rust, on your hardware — cloud optional.** Install today: `cargo add cesr-rs`.
- Principle (repeated on the site): "software that acts on your behalf should be provable, stoppable, and yours."
- **Pricing: nothing on the site** — it's open source; do not invent paid tiers. Access routes: GitHub + milestones-only email list.
- Built in public: "The receipts are in CI. Your email gets the milestones — demos, releases, no noise."
- The web/phone clients and offline mesh are **roadmap, not shipped** — always mark them as planned stages.

## Founder and contacts
- **Joel D'Souza** — founder, "building all of it": 14 years building software other people's businesses run on; Rust by choice (Java/TypeScript by history). LinkedIn joeldsouzax · GitHub joeldsouzax · Twitter @joeldsouzax.
- Email: **hello@devrandom.co** (footer) · GitHub org: **github.com/devrandom-labs** · Homepage email form for milestones.
- "made in oslo, norway" · © 2026 devrandom · built in the open.
