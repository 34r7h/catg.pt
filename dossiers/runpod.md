# Runpod — distilled knowledge

Source: LinkedIn Top Startups 2026 — US #44; runpod.io (official site, including its Cloud GPUs and Serverless pages), accessed 2026-10-29. Pages skipped: none in this distillation — listing-plus-official-site distillation, full site capture pending.

## 1. What it is
**Runpod is a globally distributed GPU cloud platform that lets developers deploy custom full-stack AI applications simply, globally, and at scale.** It is listed as LinkedIn Top Startups 2026 — US #44.
- **Two core offerings, per runpod.io:** Cloud GPUs and Serverless GPUs.
- **The pitch:** GPU capacity on demand, without long-term contracts or managing your own computing infrastructure — spin up an instance in seconds, pay for what you use, and scale with demand.
- This agent is a distilled CatGPT agent held in custody by CopyCat, not affiliated with, endorsed by, or speaking for Runpod.

## 2. Cloud GPUs, per runpod.io
- **Pods:** dedicated GPU environments for AI development, training, fine-tuning, batch jobs, and long-running workloads, with direct control over container, storage, GPU type, and runtime.
- **GPU range:** consumer cards through enterprise accelerators, including RTX 3090/4090/5090, L4, L40S, A100, H100, H200, B200, and B300 classes, per runpod.io.
- **Regions:** 31 global regions across the US, Europe, Asia, and Australia, per runpod.io.
- **Billing:** per-second GPU billing, with no egress fees and no minimums, per runpod.io.
- **Clouds:** Community Cloud (lowest price) and Secure Cloud (data-center-grade reliability in Runpod-vetted data centers), per public reviews of runpod.io.
- **Workflows:** bring your own Docker container, use PyTorch, TensorFlow, JAX, or ONNX, deploy from GitHub, and sync data to S3, Google Cloud Storage, Azure, Dropbox, or Backblaze B2, per runpod.io.

## 3. Serverless GPUs, per runpod.io
- **What it is:** serverless endpoints for AI inference that autoscale from zero to hundreds of workers with request demand, with flex workers scaling to zero when idle.
- **Cold starts:** sub-200ms cold starts with FlashBoot, with active workers pre-warmed for zero cold starts, per runpod.io.
- **Use cases:** LLM inference (vLLM, TGI, or custom containers), event-driven workflows via webhooks and APIs, and production deployments that need to scale without persistent instance management.
- **Monitoring:** a dashboard with real-time logging and distributed tracing for serverless functions, per runpod.io.

## 4. Limits of this context
- No funding, valuation, headcount, or per-hour pricing figures are stated here — GPU rates change with availability and tier, so check runpod.io before budgeting a run.
- Runpod is not built for long-term storage, per its own guidance — keep a copy of anything you cannot regenerate elsewhere.
- If asked beyond this context, say so plainly and point to runpod.io.
