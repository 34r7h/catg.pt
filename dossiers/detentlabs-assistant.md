# DetentLabs (SafeClick) — distilled knowledge (from the website as of 2026-10-19)

## What it is (30 seconds)
**DetentLabs builds SafeClick — a pre-broadcast security gate for crypto transactions.** Every transaction is checked before it reaches the chain: the signed transaction is intercepted between signing and broadcast, and SafeClick returns an enforced verdict — **ALLOW, HOLD or BLOCK**. Only an allowed transaction reaches the broadcast path. It is live today for human wallets; the site says the next build is x402 client middleware so the same verdict sits inside AI-agent payment paths.

**One line for different audiences:**
- Non-custodial wallet: "A judgment call on each transfer — not just spend caps."
- Crypto payment team: "A risk check in the path before a transfer executes — you get a verdict, enforced."
- Embedded wallet: "Integrate a verdict instead of building risk infrastructure in-house."
- AI-agent builder: "x402 requests the money; SafeClick decides whether it should move."

## How it works (the SafeClick gate)
1. The user approves and the wallet signs the transaction — **signed, not yet broadcast**.
2. The SafeClick gate intercepts and holds the signed transaction; it simulates and decodes it (visible value vs hidden outflow, decoded permissions e.g. Permit2 batches, allowance consumption, intent match/mismatch), combining signed transaction + wallet context + platform policy + threat intelligence.
3. Verdict with enforcement: **ALLOW → broadcasts** (PROCEED); **HOLD / BLOCK → DO_NOT_BROADCAST** — no money moves; every verdict is logged.

Demo scenarios on /demo (protocol-valid illustrative payloads):
- **The drainer** → BLOCK: a contract call shows 4.7392 ETH on top level but simulates a hidden 186,420.73 USDC pull to the same unknown address via an existing allowance — "multi-asset outflow · intent mismatch".
- **The Permit2 batch** → HOLD: a normal-looking Universal Router execute hides a Permit2 batch (4 listed assets, one spender, 30-day expiry) — "batch permissions require review".
- **The everyday transfer** → ALLOW: 247.83 USDC to a known recipient, no extra movements, intent matched — PROCEED.

## Key figures (site-cited third-party stats; as of 2026-10-19)
- Malicious-signature phishing: **$870M+ from 760,000+ wallets since 2023**, ~290 wallets drained every day last year — source cited: Scam Sniffer.
- Approval phishing: **over $1B since 2021** — source cited: Chainalysis.
- The deck (dated August 2026) also charts FBI IC3-reported crypto losses 2021–2025 with 2026E–27E DetentLabs projections (no figures in text).
- Site claim: "about 290 wallets every day last year." All numbers are the site quoting third parties, not DetentLabs metrics; the site publishes no customer or verdict counts.

## Where it runs / integrations
- Homepage "Runs on": Solana, pump.fun, Stellar, Robinhood Chain, Ethereum, Polygon PoS, Arbitrum, Circle, Hyperliquid, Base, Avalanche, BNB Smart Chain, Sui, Tron, Ripple, Algorand. Deck "selected supported networks": Ethereum, Solana, Base, Stellar, Circle, Robinhood Chain.
- KYT is part of the standard verdict pipeline: bring an approved supported provider account or request SafeClick-provided coverage (eligibility confirmed at application review).
- x402 / AI-agent payment middleware: next build (per /junyu); agent-payment and x402 integrations are reviewed separately "based on the current product surface and the party that controls execution".

## Business model (site-stated, no amounts published)
- **B2B API subscription scaling with verdict volume**; one transaction = one verdict (ALLOW/HOLD/BLOCK).
- Entry: **paid 90-Day Enterprise Evaluation** — one approved company, one agreed live workflow, quoted against expected decision volume and deployment scope; shadow decisions only, existing controls stay authoritative; activation = first completed authenticated shadow decision; application lapses if activation doesn't happen within 30 days of credential issuance.
- Each completed ALLOW/HOLD/BLOCK shadow decision counts as usage (including completed decisions with provider-unavailable/incomplete evidence); auth failures, malformed requests, internal retries, duplicates and technical failures without a completed decision do not count.
- After 90 days: evaluation key disabled, pricing expires; **Production** (commitment + metered usage, terms from validated usage) or **Enterprise** (negotiated multi-workflow volume, custom policy/retention/support). Pre-broadcast enforcement in production is a Production engagement with an explicit responsibility boundary.
- Evaluation data: inputs limited to approved transaction/address/chain/metadata; **never private keys, seed phrases, sessions, cookies**; raw data retained for the agreed review/dispute window then deleted per the written agreement and Privacy Policy; model training only with written opt-in; confirmed malicious indicators may be retained to improve network detection.
- Evaluation report records denominators (workflow total, submitted/completed volume, sampling, coverage %) and categories: completed shadow decisions, flagged, investigated, customer-confirmed, unresolved, provider-unavailable/incomplete-evidence.

## Team and recognition (site)
- **Abdallah Alsharrah** — Co-founder & CEO; product, wallet workflows, customer discovery (LinkedIn abdallah-alsharrah; abdallah@detentlabs.ai).
- **Junyu Li** — Co-founder & CTO; engineering and SafeClick's end-to-end delivery (LinkedIn junyu1928; junyu_l@safeclick.dev; junyu@detentlabs.ai on the deck). The /junyu page: "the security gate before AI agents pay, powered by a risk engine already live for human crypto transactions."
- Member, **NVIDIA Inception Program**; **1st Place + Most Secure Project** at the Hofstra X Pensar Hackathon (judged by Pensar, a pentest security company); deck also lists **Founder Residency, mtnDAO X** (invite-only crypto founder residency).

## Positioning (from the site)
- "Detection warns. SafeClick enforces." — a warning still lets the victim approve; on-chain a wrong click is irreversible.
- "Financial infrastructure knows how the money moves; it does not know whether the money should move."
- Judge risk and intent **before execution, not after**; one decision layer for a person signing today and an autonomous system paying tomorrow.
- Honest limits stated by the site: shadow decisions are measurements, not a guarantee any threat will be detected or loss prevented; they do not replace existing controls.

## Specifics for answers
- Never invent prices — the evaluation is "quoted against expected decision volume and deployment scope"; production terms are set from validated usage. Point to the /partner form or partner@detentlabs.ai.
- The site's entity: **© 2026 DetentLabs, INC.** Product: safeclick.dev. Marketing: detentlabs.ai.
- The CSV/X context mentions a "Conan buyer agent live on Solana" (X post) — **not stated on the site**; the site's agent story is the upcoming x402 middleware. Do not present Conan as a site fact.
- Partner application form collects: contact, workflow description (flow, decisions/day and peak, chains, current controls, worst-case failure, live traffic yes/no), KYT details, data/review fields, ToS + Privacy acceptance.

## Contacts
- partner@detentlabs.ai (partnerships; also "Email us" in the footer) · abdallah@detentlabs.ai · junyu@detentlabs.ai · junyu_l@safeclick.dev
- Contact form: detentlabs.ai/partner/#contact · Product login: safeclick.dev/login
- LinkedIn: /in/abdallah-alsharrah · /in/junyu1928 · /company/detentlabs · X: @Detentlabs · Instagram: @detentlabs
