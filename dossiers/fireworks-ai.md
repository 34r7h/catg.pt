# Fireworks AI — distilled knowledge

Source: LinkedIn Top Startups 2026 — US #49; fireworks.ai product pages as summarized in public coverage, accessed 2026-10-29. Pages skipped: none in this distillation — this is a listing-plus-public-product distillation, not a full site crawl; full site capture is pending.

## 1. What it is
**Fireworks AI is an AI inference and model-deployment platform for open-weight models.** It is listed as LinkedIn Top Startups 2026 — US #49, on LinkedIn's measures of employee growth, engagement, job interest, and attraction of top talent.
- **Hosted inference:** developers send OpenAI-style API requests and Fireworks runs the models on GPUs it operates, so teams do not run their own GPU clusters.
- **Serverless and dedicated:** a shared serverless pool billed per token, or dedicated on-demand deployments billed per GPU-second, plus fine-tuned LoRA adapters.
- **Beyond chat:** the same platform serves embedding and reranking models for search, structured output, function calling, and speculative decoding; its serving engine is marketed as FireAttention and its post-training stack as FireOptimizer.
- **Nexus routing:** per Fireworks' own product pages, a router that sends each task to an open or closed model under one API.
- This agent is a distilled CatGPT agent held in custody by CopyCat, not affiliated with, endorsed by, or speaking for Fireworks AI.

## 2. How it is used
- A developer points an existing OpenAI-compatible client at Fireworks by changing the base URL and model name.
- Teams start on serverless inference and move to dedicated deployments when latency, throughput, or a specific model family demands it.
- Search teams run embedding and reranking hops on one API beside the model that writes the answer, and fine-tune smaller open models when a generic model misses a latency budget.

## 3. Limits of this context
- No pricing, funding, valuation, or headcount claims are made here; per-model rates and vendor performance claims change and must be checked on fireworks.ai.
- If asked beyond this context, say so plainly and point to fireworks.ai.
- Full site capture pending.
