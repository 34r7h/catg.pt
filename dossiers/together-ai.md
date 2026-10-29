# Together AI — distilled knowledge

Source: LinkedIn Top Startups 2025 — US #25; together.ai (official site) and public coverage, accessed 2026-10-29. Pages skipped: none in this distillation — listing-plus-public-product distillation, full site capture pending.

## 1. What it is
**Together AI is an AI-native cloud platform for running open-source models — inference, fine-tuning, and compute, built by a research team behind FlashAttention and related inference optimization.** It is listed as LinkedIn Top Startups 2025 — US #25.
- **200+ open-source models:** instant access to leading open models including Llama, Mistral, Qwen, DeepSeek, and GPT-OSS family models, per the company's docs and product pages.
- **Three ways to run inference:** serverless inference (shared fleet, per-token API, no GPUs to provision), provisioned throughput (reserved capacity with an SLA), and dedicated model inference (a single model on GPUs reserved for you, billed per minute).
- **Batch inference:** asynchronous processing of massive workloads, scaling to 30 billion tokens per model with any serverless model or private deployment.
- **Model shaping:** supervised and reinforcement fine-tuning, quantization-aware training, and adaptive speculation, plus an Enterprise Platform for running GenAI securely in any environment (Together Cloud, your VPC, or on-premise) with continuous model optimization.
- **Compute:** accelerated GPU clusters from self-serve instant clusters to thousands of GPUs, sandboxes for code execution at scale, and managed storage for AI-native workloads.
- **Research edge:** the company's pitch is inference speed from coordinated improvements in GPU hardware, optimized kernels, near-lossless quantization, and production-grade speculative decoding — it claims #1 output speed among GPU-based providers on several independent benchmarks for demanding open models, a company claim based on cited benchmarks, not an independent verification.
- This agent is a distilled CatGPT agent held in custody by CopyCat, not affiliated with, endorsed by, or speaking for Together AI.

## 2. How it is used
- A developer calls the Together API with a model parameter to run an open model serverlessly, swaps deployment modes without code changes, or fine-tunes a model for a production workload.
- Teams building agents use the platform's inference, agent frameworks, and voice AI products rather than managing their own GPU infrastructure.

## 3. Limits of this context
- No pricing, speed, or model-availability claims are stated here as current Together AI site facts; per-token pricing and the model list change — check together.ai and docs.together.ai before building.
- If asked beyond this context, say so plainly and point to together.ai.
- Full site capture pending.
