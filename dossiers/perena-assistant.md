# Perena — distilled knowledge (from the website as of 2026-10-19)

## What it is (30 seconds)
**Perena is a decentralized financial protocol on Solana that offers USD STAR (USD*), a yield-bearing digital dollar whose value grows automatically as yield accrues (no staking or claiming).** It also offers risk-asset wrappers **SOL* and BTC*** and **tranching** (USD*-P Protected / USD*-J Junior). The goal is a full suite of on-chain "stablebanking" products.

## Products
- **USD STAR (USD*)** — fully collateralized, yield-bearing digital dollar; yield accrues into the price (compound), so balance becomes worth more over time; **no lock-ups**, redeem anytime in seconds on Solana. Backed by diversified portfolio: delta-neutral hedged positions, secured borrow-lend, stablecoins, and tokenized real-world assets (e.g. reinsurance fund by **OnRe**). Performance fee on yield (never on principal). Variable APY.
- **USD* Protected (USD*-P) / USD* Junior (USD*-J)** — tranching: protected seat sits behind a buffer of junior capital; junior absorbs losses first in exchange for higher upside. Lets users choose risk/return profile.
- **SOL*** — yield-bearing SOL wrapper (deposited SOL put to work across managed yield sources); yield accrues into exchange rate; SOL exposure (dollar value moves with SOL). Variable APY; performance fee on yield.
- **BTC*** — yield-bearing BTC wrapper (deposited cbBTC put to work); yield accrues into exchange rate; BTC exposure. Variable APY; performance fee on yield.
- **Perena Smart Borrow** (mentioned in docs) — borrowing-related product in the stack (docs structure exists).

## How it works (key mechanics)
- **Backing & reserves**: USD* is fully collateralized by a diversified portfolio of yield-generating positions; reserves attested publicly on the **Transparency Dashboard** (https://app.perena.org//transparency).
- **Yield accrues into price/exchange rate** (not distributed as claimable yield) — "nothing to claim or restake"; balance simply becomes worth more over time.
- **Liquid**: no lock-ups; redeem for supported stablecoin on Solana in seconds.
- **Deposits/withdrawals**: deposit USDC (or supported stablecoin) to receive USD* at current price; redeem back to supported stablecoin. For SOL*/BTC*: can deposit SOL/cbBTC (or supported stablecoin swapped in-txn) to mint; burning returns SOL/cbBTC; larger withdrawals may use redemption queue (usually minutes).
- **Risks**: "Perena structures risk, it does not remove it." USD* holders share proportional exposure; losses in underlying strategies would show up as lower USD* price. SOL*/BTC* carry price and strategy risks.
- **Fees**: performance fee on yield (deducted from returns, never from principal). No Perena deposit/withdrawal fees (standard Solana network fees may apply).

## Transparency & security
- **Transparency Dashboard** shows where capital is deployed across venues/strategies and reserve attestations (app.perena.org//transparency).
- **Diversification** across multiple venues/protocols to reduce reliance on single strategy/counterparty.
- **RWA repository** mentioned in docs (OnRe reinsurance fund cited as an example).

## Documentation / links
- Docs: https://perena.gitbook.io/perena (Welcome to Perena: "Your Stablebank")
- App: https://app.perena.org (Enter the app / dashboard/earn/convert)
- Discord: https://discord.gg/RRJDKJYneN
- Twitter/X: x.com/perena
- LinkedIn: linkedin.com/company/perenafi
- USD* on Solscan: https://solscan.io/token/star9agSpjiFe3M49B3RniVU4CMBBEK3Qnaqn3RGiFM
- Support: help@perena.org

## Careers (per site)
"Welcome to Perena: Your Stablebank" — building liquid yield-bearing digital dollar and full suite of on-chain stablebanking products on Solana. Open roles listed on careers page.

## Notes
- The site emphasizes variable APY, performance fees on yield, and risk transparency (tranching, diversification, public dashboard).
