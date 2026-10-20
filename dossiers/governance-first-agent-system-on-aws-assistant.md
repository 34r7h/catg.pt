# Governance-first agent system on AWS — distilled knowledge (from the website as of 2026-10-19)

## What it is (30 seconds)
**"My AI Board Voted Against Me — Building a Governance-First Agent System on AWS" is an AWS Builder Center article (published Sep 20, 2026) by solo founder Sairaj Moulasab Nadaf about his hackathon project Boardagents: an autonomous board of AI agents, running entirely on AWS, built in about two days with no agent frameworks.** The pitch in one line (the author's): *"founders without a board deserve a board that acts — and knows when not to."* The project is open (MIT, GitHub) with a public demo; it is a demo project, not a commercial product.

**One line for different audiences:**
- Builder/founder: "An AI 'board' that watches your company signals, acts on real code with real tests — and votes you down when the evidence says no."
- AWS learner: "A reference build of serverless governance-first agents: Lambda + DynamoDB + S3 + EventBridge + Bedrock, no Step Functions, no LangChain."

## How it works (per the article + the project's GitHub README)
1. **It watches and acts.** Signals flow in (dependency advisories, billing anomalies, usage dips). A pipeline summarizes each with evidence, decides what to do and — only when the risk level allows — patches code in a sandbox. **Verification is a real pytest run executed by a subprocess; the model saying "tests pass" is never used as truth — the recorded exit code is.**
2. **It refuses.** A deterministic policy engine sits above the models: billing anomalies (sensitive) get drafted for human approval even from the most confident model; unknown event types fail closed to sensitive. A governance checklist (tests unmodified, no secrets in the diff, no scope creep, approval record where required) is code — models can only add concerns, never remove checks.
3. **The demo story:** when the author asked the board to pause all paid marketing and hire three salespeople pre-launch, four agents — CTO seat on Qwen3-Coder, CFO on GLM-4.7, Risk & Compliance on Magistral, Customer & Growth on Gemma-3-27b, all on Amazon Bedrock — debated, cited actual runway numbers from a company context file and **voted nay 4–0**. His policy engine capped the motion's confidence from 0.90 to 0.55 and escalated to the human with the reason: "the board voted against acting: 4 against, 0 for."
4. **State machine (GitHub README):** Ingested → Summarized → Decided → ActingDirect | AwaitingApproval | Escalated; ActingDirect → Verifying → GovernanceReview | retry | Escalated; GovernanceReview → Closed | Escalated. Risk is derived from event_type by deterministic code — the model never decides risk; policy always wins over the model (a policy_override audit row is written on disagreement).

## Key figures (article, as of 2026-09-20/21; README fetched 2026-10-19)
- Built in **about two days, by one person, no agent frameworks**; hackathon project.
- One CloudFormation stack (AWS SAM, ap-south-1): **two Lambdas** (public API on Function URL + worker 1024 MB / 600s), **three on-demand DynamoDB tables** (findings with optimistic concurrency, append-only audit trail with model ID/tokens/latency, raw event feed), **S3** for patch diffs/test artifacts, **EventBridge** monitor every **5 minutes**, CloudWatch everywhere.
- **Four model families** on Bedrock routed per stage (small/fast for summarize & governance, reasoning model for decisions, coding model for patches), swapped by config via a single adapter.
- No Step Functions, no LangChain — the state machine is a plain dict of legal transitions; retry loop ≈20 lines with exponential backoff + jitter.
- Article hashtags: amazon-bedrock, amazon-cloudfront, amazon-dynamodb, agentic-ai, aws-lambda. GitHub: MIT license, 15 commits; demo company "Lumen Labs" is simulated (fixtures) per the README.

## Honest limitations (README, 2026-10-19)
- Simulated company data, not a real deployment; sandbox is a copy of a small demo repo on the worker's /tmp.
- Single tenant; no auth beyond a demo token for destructive actions; no calibration claims beyond the audit log.
- Reserved concurrency impossible on a 10-concurrent-execution account → app-level protection (call caps, daily counter, pause flag).

## Per audience
- **Solo founders:** the "when not to act" half is the point — an agent system that argues with its owner and (in the demo) loses on purpose.
- **AWS builders:** deploy with ./scripts/deploy.sh, tear down with ./scripts/teardown.sh; cost decisions documented (Lambda over EC2/Fargate for spiky load; DynamoDB on-demand; Converse API for one request/response shape across model families).
- **Reader of the article:** it's an individual author's build story; AWS disclaims: "Any opinions in this article are those of the individual author and may not reflect the opinions of AWS."

## Positioning / objections
- **vs agent frameworks:** deliberately framework-free — "when your state machine is your own code, 'the board has no mandate' is one deterministic function, not a workflow hack."
- **vs LLM-as-judge:** evidence beats model claims — pytest exit codes, not model say-so; deterministic policy above the models.
- **Not a product:** no pricing, no signup, no support SLA. GitHub + demo link only.

## Contacts
- Author: Sairaj Moulasab Nadaf — Builder Center profile builder.aws.com/community/@sairaj18; GitHub github.com/SairajMN; YouTube @sairajnadaf6093; project listing contact "Sahil" via the Connectors group; LinkedIn sairaj-m-n (per project listing).
- Code: https://github.com/SairajMN/BoardAgents (MIT) · Demo: https://6z3tp5noeqs6z33xiej2ouq3g40yqjbj.lambda-url.ap-south-1.on.aws
