# Deepshi — distilled knowledge (from the website as of 2026-10-19)

## What it is (30 seconds)
**Deepshi (deepshi.ai)** is a private, unrestricted ("uncensored") AI platform from **Evermind Labs, Inc.** — one interface for chat, image, video, music and code, with a privacy architecture that stores your chats **locally on your device** rather than on Deepshi servers. Tagline: "Where AI meets freedom… Experience unrestricted intelligence with complete privacy." The site's claim: "**The only AI with third-party privacy verification**" (verified by Assured Information Solutions).

**One line for different audiences:**
- Privacy-conscious users: "Free to try with no account; conversations stored only on your device, not Deepshi's servers; independently verified."
- Power users / prosumers: "One subscription replaces ChatGPT + Claude + Gemini + image/video/music tools; Plus $19/mo, Pro $99/mo."
- Developers: "OpenAI-compatible API — Deepshi API access 100 req/min (Plus) and 500 req/min (Pro)."
- Writers / roleplay / creative: "Unfiltered native models (Deepshi Flash 2.0 / Deepshi Pro 3.0) plus AI characters, voice chat and a social feed."

## How it works
- **One chat interface**: write, generate images, produce videos, create music, and write/run code without switching tools.
- **Local-first privacy**: requests go to a proxy → a pool of GPUs across decentralized providers → response streamed back to your browser, **not persisted on Deepshi storage**; conversation history is kept in your local browser storage, encrypted (XSalsa20-Poly1305 / NaCl secretbox for chats; AES-GCM for saved images/videos).
- **Models**: built by Evermind Labs — **Deepshi Flash 2.0** (instant, everyday) and **Deepshi Pro 3.0** (deep reasoning/research); paid tiers add access to mainstream frontier models "including GPT, Claude Opus, Gemini, Nano Banana, Sora, Google Veo + more."
- **Features**: AI characters (pre-edited + user-generated with earning potential), interactive voice chat (named voices: Companion, Maya, Spruce, Annie, Hannah, Trevor, Narrator), image/video/music generation, API access, cross-device sync (paid), social feed for generated media.
- **No account needed for free tier**: "Try for free. No sign up required." (at /chat).

## Key figures (site claims, 2026-10-18 crawl)
- "Over **70% of AI users** say censorship limits creativity" (homepage framing stat).
- Free tier: **30 messages daily** (first 5 at Deepshi Pro-level quality), **5 image generations daily**, never expires, no account/email.
- Plus: **$19/month** (still labeled "Deepershi plan" in some blog text), **1,200 multimedia credits** one-time.
- Pro: **$99/month**, **6,000 multimedia credits** one-time.
- Annual subscriptions: **save 20%**.
- Company: **Evermind Labs, Inc.**, "Copyright © 2026 Evermind Labs, Inc."
- Third-party privacy verification: **Assured Information Solutions**.

## Pricing (as displayed on /pricing and homepage, 2026-10-18)
| Plan | Price | Highlights |
|---|---|---|
| **Deepshi** | **$0 / forever** | 30 msgs/day (first 5 Pro-level), 5 images/day, smart reasoning + basic web search for citations, AI characters, post to feed; "your data is never used for training" |
| **Deepshi Plus** ("Most value") | **$19 / month** | Faster responses, expanded limits; top third-party models (Claude Opus, GPT-5.2, and more); Deep Research; create/customize characters; 1 free video/day; 10 free music/day; one-time 1,200 multimedia credits; encrypted cross-device sync + local or Cloud Vault backup; API 100 req/min |
| **Deepshi Pro** | **$99 / month** | Everything unlimited (messages, images, Deep Research, character creation), unlimited uploads/document+image analysis, fastest VIP processing, 5 videos/day, 30 music/day, 6,000 multimedia credits, early access + priority support, API 500 req/min |
- "Save 20% on annual subscriptions." · "Secure payment method." Upgrade/downgrade/cancel anytime, no long-term commitments.

## Positioning / objections (site's answers)
- **vs mainstream AI**: "Many AI systems are designed to avoid, redirect, or shut down conversations… Deepshi stays engaged and expressive while adapting to your tone and intent." Homepage demo contrasts "Model stupid 2.0" refusal vs a full Deepshi answer.
- **Free-to-try objection** → free tier exists and is designed "to show the real product behavior, not just a limited demo."
- **Credit card objection** → "No. You can start… without entering any payment information."
- **Privacy objection** → local storage only, no server-side prompt/response logging, third-party verified.
- **Censorship scope caveat** → the no-moderation experience applies to Deepshi's **native** models; third-party models (GPT-5.2, Claude Opus, Gemini) still follow their own policies.
- Blog positions it vs **Venice AI**, and publishes guides on uncensored AI, anonymous chat, coding-privacy, and "poaching rivals' clients" (marketing spin).

## Specifics for answers
- **No account users**: Deepshi collects basic metadata only (timezone, browser type, IP address). **Free account**: + email. **Pro**: card payments handled only by **Stripe** (not shared with Deepshi); crypto/MOR-token payers have their **public wallet key** recorded.
- **Delete a chat** → it's deleted from your own browser/device (the only place it was stored).
- **Standards cited** (privacy-architecture page): TLS 1.3 (RFC 8446); NaCl secretbox (XSalsa20-Poly1305) for chat history; AES-GCM (NIST SP 800-38D) for saved media; HKDF (RFC 5869) for media key derivation; W3C Web Cryptography API; NIST Privacy Framework.
- **API**: OpenAI-compatible endpoint ("existing integrations work unchanged").
- **Sync caveat**: on Free, conversations stay on the device you used; cross-device sync is a paid feature (see sync/backup blog posts).

## Contacts
- Support email: **support@deepshi.ai** · Contact page: /contact (form + "Message on Discord")
- **Discord**: discord.gg/deepshi (site says "For the fastest support, join our Discord")
- Socials: X @AskDeepshi · Instagram @deepshi.ai · TikTok @deepshi.ai · YouTube @deepshi_ai · Reddit r/Deepshi · Status page status.deepshi.ai
- Company: Evermind Labs (evermindlabs.io) for "About"
- Per the Connectors WhatsApp group CSV (not stated on the site): WhatsApp "Drew M" (106558272889028@lid) — same lid listed for DeepGreenAI.
