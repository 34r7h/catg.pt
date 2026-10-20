# Suwappu — distilled knowledge (from the website as of 2026-10-18)

## What it is (30 seconds)
**Suwappu is a full-stack cross-chain trading platform.** It provides execution, routing, research, and portfolio management across 45 chains from one venue. Users can trade via the web Terminal, Telegram bot/Mini App, or integrate programmatically via REST/MCP/A2A/SDKs. It supports spot swaps, bridges, HyperLiquid perps, copy trading, automation (DCA/limit/launch sniping), Polymarket, and research/signals.

**One line for different audiences:**
- Trader: "Trade spot, perps, and cross-chain from one venue (Terminal or Telegram)."
- DeFi user: "Route across many venues/bridges with optional preflight simulation."
- Agent/developer: "Integrate trading via REST/MCP/A2A/typed SDKs with metered billing."

## How it works (high level)
- **Access** — Terminal (https://terminal.suwappu.bot), Telegram (@suwappu_bot), Mini App (app.suwappu.bot), or Autopilot
- **Quote** — Get best quote across venues; optional zero-funds preflight/simulation before authorization
- **Execute** — Self-custody (returns unsigned tx to sign) or managed execution (signs/broadcasts under server controls)
- **Manage** — Cross-chain portfolio, PnL, position cards, research/signals

## Key details
- Coverage: 45 chains total; 21 routing venues; Agent API exposes 18 chains
- Venues/routing: Jupiter, OKX, 0x, Li.Fi, CoW, Socket, Jito, plus bridges (CCTP, Wormhole, LayerZero, Stargate, Across), Tempo (context), Curve (all pools)
- Products: Swaps/routing, bridges, HyperLiquid perps, copy trading, DCA/limit/launch sniping, Polymarket
- Agent access: Agent API (REST), MCP server, Agent Desk (WebMCP), A2A routes, TypeScript/Python SDKs; metered via x402
- Research/signals: Launch detection (Pump.fun/Raydium), HyperLiquid ecosystem monitor, market data capture; Signals API, public research
- Portfolio: Cross-chain aggregation, realized/unrealized PnL, position cards (NFTs), weekly digest
- Security/ethos: Intent → quote → optional simulate → authorize; in-house MEV searcher screens sandwich risk; executor benchmarking; failover RPC

## Audiences
- Cross-chain traders
- DeFi power users
- AI/agent builders integrating trading
- Developers building trading workflows

## Positioning / notes
- "Full-stack trading platform for cross-chain markets" with strong agent-first tooling (MCP/A2A/API/SDKs).
- CSV context: "Founder-led project; Toma is open to discussing stablecoins and hardware." (Toma, whatsapp_lid 226508002033713@lid) — per the founder's intro in the Connectors WhatsApp group (not stated on the site).
- Domain: https://suwappu.bot

## Specifics for answers
- Language: English
- Pricing: x402 metered billing mentioned for programmatic execution; public tiering not fully detailed in crawled pages — don't invent.
- Coverage differs by surface (platform vs Agent API).

## Contacts/links
- Home: https://suwappu.bot
- Terminal: https://terminal.suwappu.bot
- Telegram: https://t.me/suwappu_bot
- Mini App: https://app.suwappu.bot
- Docs: https://suwappu.bot/docs
- API reference: https://suwappu.bot/docs/api-reference/overview (OpenAPI https://api.suwappu.bot/v1/agent/openapi)
- Agent API/MCP: https://suwappu.bot/agents, https://suwappu.bot/docs/quick-start/mcp-clients
- Signals: https://suwappu.bot/signals, https://suwappu.bot/research
- Autopilot: https://suwappu.bot/autopilot
- Status: https://suwappu.bot/status
