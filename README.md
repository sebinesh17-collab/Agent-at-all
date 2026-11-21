# AETHER Multi-Agent OS — Cloudflare Edition

A chat-first autonomous development platform built around Cloudflare Workers, D1, Queues, Workflows, Durable Objects, Containers, and R2. The uploaded master specification defines a five-level organization of **16,111 logical agents**. This repository now seeds that organization as persistent records and dispatches each enabled agent as a durable Cloudflare Workflow instance.

## What is implemented in this source package

- **16,111 seeded agent records**: 1 Master Leader, 10 Principals, 100 HODs, 1,000 Team Leaders, and 15,000 Workers. Each seeded agent has a unique ID, name, category, job title, manager ID, individual system prompt, model/provider fields, skills, permissions, tool allowlist, memory flag, execution limits, resource budget, and status. SQL migration checks verified the exact counts and manager links.
- **61 specialist prompt templates**: reusable role profiles used by the platform; they are not extra agents added on top of the 16,111 hierarchy.
- **139 registered tool modules**: tools include metadata and permission checks. Some tools are implemented in the current Worker service layer; tools requiring external integrations explicitly report that the connector is not configured rather than pretending to work.
- **20 provider entries**: OpenAI-compatible and provider-specific adapters. Provider/model compatibility and credentials must be configured. Up to 1,000 API keys can be stored per provider; the router selects a rotating least-recently-used candidate pool of 25 keys at a time. Bedrock and Vertex require cloud-native signed-auth work before they should be treated as ready.
- **Master-led planning**: the Master Leader runs first and writes a structured department/specialist work plan. The fan-out queue then starts the remaining agents with role- and department-specific work packages. If the Master response is not valid JSON or fails, a deterministic fallback plan is recorded.
- **Durable agent execution**: one run snapshots its enabled-agent roster into D1, Cloudflare Queues fan out workflow creation in batches of 100, and each agent runs in its own durable Workflow instance. The default per-Workflow concurrency cap is **250** and is configurable in `wrangler.toml`. Excess instances queue instead of being falsely shown as running.
- **Agent execution records and collaboration**: per-agent tasks, statuses, outputs, failures, messages, and run-level counters are persisted in D1. Agents can message their manager, direct reports, peers, and same-department agents. File-write leases prevent two agents from editing the same path at the same time. Final synthesis uses a bounded sample of agent results; detailed records are available through run-agent and run-task APIs. Managers can create, update, dispatch to, and delete eligible custom agents.
- **Cloud Linux workspaces**: Cloudflare Containers are managed through Durable Objects. Workspaces are isolated by user and run, command execution uses argv plus an allowlist and a process timeout, Internet access is disabled by default, and successful writes/commands create Container snapshots. Node.js, Python, Java 17, GCC/G++, Clang/LLVM, Git, CMake, and build tools are installed. Android SDK is not preinstalled; Docker-in-Docker is not provided.
- **Storage and delivery**: D1 stores structured metadata; Firebase Storage is the primary object store when configured, with R2 mirroring/fallback. R2 is the Cloudflare-native artifact store. Completed runs create a ZIP archive (inline package limit 100 MB), store it in R2, and can email a seven-day download token limited to five downloads. Browser downloads save to the user’s device; Workers cannot write directly to a phone’s local filesystem.
- **Email**: completion email uses Resend when credentials are configured. Email errors are recorded separately and do not erase completed agent work.

## Critical concurrency truth

The platform creates up to 16,111 durable agent workflow instances for a full organization run. That does **not** mean 16,111 model API calls are guaranteed to be executing at the exact same instant. The default concurrency cap is 250; Cloudflare account limits, Workflow creation rate, Container capacity, model-provider rate limits, API-key quotas, and billing determine actual live execution. Increase concurrency only after load tests and provider approval.

Cloudflare's current documentation lists 50,000 concurrent Workflow instances per Workers Paid account, 300 Workflow creations/second per account and 100/second per Workflow. This app creates agent Workflow instances in batches of 100 to stay within the per-Workflow creation rate. The default app cap of 250 is deliberately below the account ceiling to protect provider APIs and the current single D1 database. D1 is single-threaded per database; scaling beyond this cap requires database sharding and provider-aware scheduling. See the Cloudflare docs linked in `docs/DEPLOYMENT.md`.

## Important Cloudflare constraints

- **Workers Paid is required** for the configured Container/Workflow setup. The project is not a Free-plan deployment target as currently configured.
- Cloudflare documents up to **50,000 concurrent Workflow instances per Workers Paid account** (100 on Free). This application creates 16,111 logical agent Workflow instances for the full organization, but deliberately caps this Workflow at **250 concurrent instances** by default. The other instances remain durable and queued.
- Cloudflare documents **100 Workflow creations/second per Workflow**. The queue fan-out sends 100 creations and waits 1.1 seconds before the next batch, so creating the full organization takes a few minutes rather than one burst.
- A single D1 database is **single-threaded**. This source package uses one D1 database and a conservative concurrency cap. True 16,111-way live execution requires D1 sharding, provider-aware concurrency controls, account capacity, and load testing; do not simply set the cap to 16,111 in production.
- Cloudflare Containers currently use the Durable Object scheduling policy, documented as public beta. This app creates one isolated Container workspace per user/run, not 16,111 Linux containers. All agents in a run share that workspace, with D1 file-write leases to prevent simultaneous edits to the same path.

## Cloudflare product compatibility

| Feature | Cloudflare component | Compatibility / caveat |
|---|---|---|
| Web app and API | Workers + Static Assets | Supported |
| Structured records | D1 | Supported; a single D1 database is single-threaded, so monitor query throughput |
| Task fan-out | Queues | Supported; batch/retry/DLQ configuration included |
| Long-running agent execution | Workflows | Supported; Paid plan concurrency and creation limits apply |
| Agent coordination state | Durable Objects | Supported; use sharding for high-volume coordination |
| Linux development environment | Containers + Durable Object scheduling | Supported in public beta; Paid plan and account capacity required |
| Project artifacts | R2 | Supported; use multipart upload for large objects |
| Firebase Cloud Storage | External Firebase REST API | Used as primary when configured; requires valid OAuth access token and bucket/IAM setup; R2 mirrors writes |
| Completion email | Resend API | External integration; requires Resend secrets |
| Local phone storage | Browser download | Cloudflare cannot directly write to a user's Android/desktop filesystem |

## Setup

Requirements: Node.js 22+, npm, a Cloudflare account with Workers Paid features enabled, and either a local Docker-compatible engine or Cloudflare Workers Builds (recommended when developing from Android/Termux without Docker).

1. Install dependencies:
   ```bash
   npm install
   ```
2. Authenticate:
   ```bash
   npx wrangler login
   ```
3. Create the D1 database and copy the returned ID into `wrangler.toml`:
   ```bash
   npx wrangler d1 create aether-db
   ```
4. Create R2:
   ```bash
   npx wrangler r2 bucket create aether-artifacts
   ```
5. Create the fan-out queue (the configured dead-letter queue is declared in Wrangler):
   ```bash
   npx wrangler queues create aether-agent-fanout
   npx wrangler queues create aether-agent-fanout-dlq
   ```
6. Apply the database migrations. Migration `0004_massive_agent_organization.sql` seeds and verifies the 16,111-agent hierarchy:
   ```bash
   npm run db:migrate
   ```
7. Configure secrets:
   ```bash
   npx wrangler secret put AUTH_SECRET
   npx wrangler secret put ENCRYPTION_KEY
   npx wrangler secret put RESEND_API_KEY
   npx wrangler secret put EMAIL_FROM
   npx wrangler secret put COMPLETION_EMAIL_TO
   npx wrangler secret put WEB_SEARCH_API_KEY
   npx wrangler secret put FIREBASE_STORAGE_BUCKET
   npx wrangler secret put FIREBASE_STORAGE_TOKEN
   ```
   Only set Firebase secrets if you want the optional Firebase integration. `FIREBASE_STORAGE_TOKEN` must be a valid, refreshed OAuth access token; a short-lived token will expire.
8. Replace `PUBLIC_APP_URL` in `wrangler.toml` with the deployed Worker URL so completion emails can include expiring download links. Review the workspace settings in `wrangler.toml`:
   - `ALLOW_WORKSPACE_INTERNET = "false"` is the safe default. Set it to `"true"` only when a trusted build needs outbound network access; this enables general container Internet access, not a fine-grained domain allowlist.
   - `WORKSPACE_INSTANCE = "standard-1"` selects the default 0.5-vCPU / 4-GiB workspace size. You can choose `lite`, `standard-2`, `standard-3`, or `standard-4` based on account capacity and budget.
   - `workflows.concurrency.limit = 250` is the default maximum running agent workflows. Change it only after provider-aware load testing.
9. Verify locally:
   ```bash
   npm test
   npm run typecheck
   ```
   For a local deploy, Docker or a Docker-compatible engine must be running because Wrangler builds the Container image from `Dockerfile`. If you are using Android/Termux without Docker, push the repository to GitHub and connect it to Cloudflare Workers Builds. Configure the production build command as `npm install && npm run build` and the deploy command as `npx wrangler deploy`; Workers Builds can build the Dockerfile image in its build environment. Do not use `wrangler versions upload` for a full Container release because it uploads Worker code without publishing the new Container image.
10. Open the deployed URL, create the owner account, add an active model API key in API Vault, and set the organization-wide provider/model in Settings before starting a full run.

## Local development

```bash
npm run db:local
npm run dev
```

For a local Container/Workflow environment, use the current Wrangler and Cloudflare local development support. `npm run db:local` applies migrations; it does not execute the old static schema directly.

## Security and production-readiness checklist

This is a deployable engineering baseline, not a verified production launch. Before exposing it publicly:

- Restrict CORS to the production domain and add rate limiting / Turnstile.
- Add per-user tenancy and row-level authorization to every database query; the current owner-first setup is a single-workspace baseline.
- Add a full audit log, key rotation UX, quota/budget enforcement, and provider-specific token/rate-limit scheduling.
- Add per-project Git worktrees and explicit patch/merge ownership; current Container workspaces are isolated by user/run; the Container process itself runs with root-equivalent capabilities under the Durable Object scheduling policy, so treat it as a container boundary rather than a Linux UID sandbox.
- Finish or remove tool modules whose external connector is not implemented.
- Implement a full Firebase service-account token refresh flow if Firebase is required for unattended long-running storage.
- Load-test the 100 MB inline ZIP packaging path; implement R2 FUSE or multipart streaming for larger release archives.
- Run load tests against your Cloudflare account and real model providers before increasing concurrency. The default 250 concurrency cap is not a promise of 16,111 simultaneous provider requests.
- Review Container Internet egress, snapshot retention, resource quotas, and the Cloudflare Container public-beta terms.

Never place API keys or service-account credentials in the frontend or generated ZIP packages.
