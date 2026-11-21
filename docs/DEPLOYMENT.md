# Cloudflare deployment and compatibility notes

## Cloudflare documentation

- [Workers limits](https://developers.cloudflare.com/workers/platform/limits/)
- [Queues limits](https://developers.cloudflare.com/queues/platform/limits/)
- [Queues consumer concurrency](https://developers.cloudflare.com/queues/configuration/consumer-concurrency/)
- [Workflows limits](https://developers.cloudflare.com/workflows/reference/limits/)
- [Workflows Workers API](https://developers.cloudflare.com/workflows/build/workers-api/)
- [Durable Objects limits](https://developers.cloudflare.com/durable-objects/platform/limits/)
- [Containers limits and instance types](https://developers.cloudflare.com/containers/platform/limits/)
- [Containers Durable Object scheduling policy](https://developers.cloudflare.com/containers/configuration/scheduling-policy/)
- [Containers Durable Object API](https://developers.cloudflare.com/containers/api/durable-object-container/)
- [R2 upload limits](https://developers.cloudflare.com/r2/objects/upload-objects/)
- [D1 limits](https://developers.cloudflare.com/d1/platform/limits/)

## Why this design uses Workflows for agents

The Master Leader Workflow runs first and stores a structured work plan. Each enabled agent is represented by a persisted D1 record and a separate Cloudflare Workflow instance for a run. Queues perform the fan-out stage, creating at most 100 agent workflow instances per fan-out message. This keeps the queue payload small and respects Cloudflare's 100 Workflow creations/second/per-Workflow limit. Workflow instances are durable and can resume from persisted steps after interruptions.

The Wrangler configuration sets the app's Workflow concurrency limit to 250. Cloudflare Workers Paid documents up to 50,000 concurrent Workflow instances per account; 50,000 is an account ceiling, not an app reservation or a guarantee of 16,111 simultaneous model calls. Provider quotas and billing can be much lower. Workflows above the configured app limit are queued.

## Containers

Linux execution uses the Durable Object Container API with `scheduling_policy = "durable_object"`. Cloudflare documents this scheduling policy as public beta. The default scheduling policy is deprecated, and the Durable Object policy does not support `max_instances`; this project intentionally does not set it. Container sizes are selected at runtime (`lite`, `standard-1` through `standard-4`). The runtime does not accept the `basic` alias. The default is `standard-1` (0.5 vCPU, 4 GiB RAM, 8 GB disk) and can be changed through `WORKSPACE_INSTANCE`. Node.js, Python, Java 17, GCC/G++, Clang/LLVM, Git, CMake, and build tools are preinstalled; Android SDK is not. Docker-in-Docker is not available.

Container Internet access is disabled by default. Setting `ALLOW_WORKSPACE_INTERNET=true` enables outbound Internet access for package installs and remote Git operations. This is a broad network permission, not a per-domain allowlist, so only enable it for trusted workloads. Successful file writes and successful commands create Container snapshots. Cloudflare documents a 20-GB maximum snapshot size and a 30-day snapshot retention period; snapshot behavior and costs must be load-tested for long-running projects.

## Data services

- D1 stores users, agents, run rosters, task states, messages, and agent outputs. D1 is horizontally scalable across multiple databases, but each individual database is single-threaded and processes queries one at a time. This baseline uses one D1 database; production deployments must shard by tenant/project/department before attempting very high concurrent agent execution.
- Firebase Storage is the primary object store when its bucket and OAuth token are configured; R2 mirrors successful writes and provides fallback reads. R2 also stores the final ZIP. The current inline ZIP path is capped at 100 MB; larger archives need R2 FUSE or multipart streaming.
- Firebase is an optional external REST integration. It is not a native Cloudflare binding. The current integration uses a supplied OAuth access token; unattended deployments need a token refresh/service-account implementation.

## Deployment commands

See `README.md` for the full sequence. The essential commands are:

```bash
npm install
npx wrangler login
npx wrangler d1 create aether-db
npx wrangler r2 bucket create aether-artifacts
npx wrangler queues create aether-agent-fanout
npx wrangler queues create aether-agent-fanout-dlq
npm run db:migrate
npm test
npm run typecheck
npm run deploy
```

Replace `REPLACE_WITH_D1_DATABASE_ID` in `wrangler.toml` with the ID returned by `wrangler d1 create`. Configure the required secrets and replace `PUBLIC_APP_URL` before creating the owner account or starting an AI run. The `PUBLIC_APP_URL` setting is used to construct seven-day download links with a five-download limit.

## Verification status for this source bundle

- D1 migrations executed against a local SQLite engine: passed; exactly 16,111 seeded records, 5 correct hierarchy counts, 16,111 unique prompts, message/inbox tool grants, and no missing manager references.
- Node architecture tests: passed.
- Worker TypeScript typecheck: passed using the globally available TypeScript compiler.
- Frontend TSX syntax transpilation: passed.
- Full Vite production build and Cloudflare deployment: not verified in this environment because npm dependencies could not be downloaded. Run `npm install`, `npm run typecheck`, and `npm run deploy` in your local environment before relying on the deployment.

## Deploying from Android/Termux without Docker

The Container image is declared from `Dockerfile`. A local `npx wrangler deploy` therefore requires Docker or another Docker-compatible engine to be running. Cloudflare's Workers Builds environment can build the Dockerfile in CI. For an Android/Termux workflow, push the source repository to GitHub, connect it under Cloudflare Workers & Pages → Workers Builds, set the production build command to `npm install && npm run build`, and set the deploy command to `npx wrangler deploy`. Use a separate staging Worker for testing full Container image rollouts; `wrangler versions upload` does not publish a new Container image.
