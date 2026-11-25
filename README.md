# RoboInvestor App

**The equity research and portfolio app built on [RoboSystems](https://github.com/RoboFinSystems/robosystems), the open-source knowledge graph for finance.** RoboInvestor covers equity research on public companies, your fund's positions with their terms, and the reports your portfolio companies send. This repository is its web app, served at [roboinvestor.ai](https://roboinvestor.ai).

A fund's graph holds its portfolios, positions and securities, and the reports its portfolio companies send, shared from RoboLedger or loaded from a holon, a compiled model, or rows read out of a PDF or workbook. When a portfolio company keeps its books on RoboLedger and shares a published report, the holding links through to that company's own reported facts, and public companies' filings come from the SEC repository on the same ontology. The app shows the graph and handles the everyday writes; the rest (instrument terms, current values, loading a report from a file, changing or disposing of a position) goes through your AI agent over MCP, against the same operations.

## What it does

- **Portfolio**: create portfolios and add securities (common, preferred, SAFEs, convertible notes, warrants, options, RSUs, LLC units, LP interests) with their starting position. Holdings are grouped by issuer, with cost basis and the current values your agent records
- **Issuer links**: record a portfolio company's graph id on a security, so its shared reports meet the holding; or attach the security to an issuer your agent added for a report sent as a file
- **Portfolio Reports**: the reports this fund has received, shared from a company's RoboLedger graph or loaded from a file, each rendered from its holon
- **Research**: any listed filer's filings and statements, read from the public filing catalog with no graph needed, and the published equity research briefs at `/research`, every figure traced to a filing
- **Console**: ask questions of the selected graph, in plain language or Cypher, from a drawer at the bottom of every page
- **Search**: full-text and semantic search over the selected graph's documents, or across SEC filings on the repository
- **Entities**: the fund or holder each of your RoboInvestor graphs is for
- **Repositories**: subscribe to the SEC repository; its getting-started page gives the MCP URL and a repository-scoped API key

Sign-in, graph creation and account settings come from the shared [`@robosystems/core`](https://github.com/RoboFinSystems/robosystems-core) library; settings hand off to the RoboSystems app. The same app serves the public site at roboinvestor.ai: the landing page, the research briefs, and the product docs at [`/docs`](https://roboinvestor.ai/docs).

## Quick Start

Needs Node.js 26 (see `.nvmrc`) and a RoboSystems API: `just start` in a [robosystems](https://github.com/RoboFinSystems/robosystems) checkout, or a hosted one. Against a local API, sign in with the demo user that `just demo-user` creates there; `just demo-roboinvestor` builds a graph with a private holding linked to its issuer's report.

```bash
npm install
cp .env.example .env     # points at a local API on http://localhost:8000
npm run dev              # http://localhost:3002
```

**In Docker instead.** From the backend checkout, `just start apps` runs the published images of all three apps against your local API: RoboSystems on http://localhost:3000, RoboLedger on 3001, RoboInvestor on 3002. `just clone-apps` and `just start apps build` build them from your checkouts instead. More: [Local Development](https://robosystems.ai/docs/technical/local-development).

Either way, `.env.example` turns on maintenance mode, so the landing page shows a maintenance screen; sign in at `/login`.

The settings that matter locally, all in `.env.example`:

| Variable                                                            | Purpose                                                              |
| ------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `NEXT_PUBLIC_ROBOSYSTEMS_API_URL`                                   | The API the app calls                                                |
| `NEXT_PUBLIC_ROBOSYSTEMS_APP_URL`, `NEXT_PUBLIC_ROBOLEDGER_APP_URL` | The sibling apps, for moving between them signed in                  |
| `NEXT_PUBLIC_FILINGS_CDN_URL`                                       | The public filing catalog Research reads                             |
| `NEXT_PUBLIC_S3_ENDPOINT_URL`                                       | The local stack's S3 server, for report bundles; unset in production |

### Deploying your own

1. Fork this repository and the [robosystems](https://github.com/RoboFinSystems/robosystems) backend.
2. Run `just bootstrap` in the backend: it deploys OIDC and sets this repository's `AWS_ROLE_ARN`, `AWS_ACCOUNT_ID` and `AWS_REGION`.
3. Run `npm run setup:gha` here to set the remaining deployment variables.
4. Deploy with `npm run deploy:staging` or `npm run deploy:prod`, which run the deployment workflows.

The compute is chosen by the `APP_COMPUTE` GitHub variable (`apprunner` by default; per environment with `APP_COMPUTE_PROD` / `APP_COMPUTE_STAGING`). App Runner is closed to new AWS customers, so an account that has never used it must set `APP_COMPUTE=ecs-express`. Without a default VPC, also set `ECS_SUBNETS` to comma-separated public subnet IDs in at least two AZs. See the [Bootstrap Guide](https://robosystems.ai/docs/technical/bootstrap-guide).

## Development

```bash
npm run dev              # development server on port 3002
npm run build            # production build (npm run start to serve it)
npm run test             # Vitest suite
npm run test:coverage    # coverage report
npm run test:all         # tests, then format, lint fix, typecheck and cfn-lint
npm run lint             # ESLint (lint:fix to fix)
npm run format:check     # Prettier (format to write)
npm run typecheck        # TypeScript
```

`test:all` rewrites files (Prettier and `eslint --fix`), and its `cfn-lint` step runs through `uvx`, so it needs [uv](https://docs.astral.sh/uv/).

Shared components come from [`@robosystems/core`](https://www.npmjs.com/package/@robosystems/core) ([robosystems-core](https://github.com/RoboFinSystems/robosystems-core)), used by all three apps. Changes are made there and reach this app through a version bump: `npm install @robosystems/core@latest`.

## Architecture

- **Next.js 16** App Router, React 19, TypeScript 5 and Tailwind CSS 4
- **[`@robosystems/core`](https://www.npmjs.com/package/@robosystems/core)**: sign-in, session and JWT handling, the graph and entity contexts, the graph creation wizard, layout, the console drawer, background-job progress over SSE, and the UI primitives in `@robosystems/core/ui`
- **[`@robosystems/report-components`](https://www.npmjs.com/package/@robosystems/report-components)**: renders received reports from their holon and SEC filings from the public catalog. A small same-origin route (`/api/reports/holon`) fetches a report's holon bundle for the browser
- **[`@robosystems/client`](https://www.npmjs.com/package/@robosystems/client)**: every call to the API. Reads are GraphQL at `/extensions/{graph_id}/graphql`; writes are named operations at `/extensions/roboinvestor/{graph_id}/operations/{name}`. See [Extensions Surface Overview](https://robosystems.ai/docs/technical/extensions-surface-overview)
- **Rendering**: the public pages (landing, `/research`, `/docs`) render on the server; the signed-in workspace is client-side

**On AWS:** App Runner or ECS Express Mode behind CloudFront, with static assets on S3, deployed from the CloudFormation templates in [`cloudformation/`](cloudformation/) by GitHub Actions.

## Documentation

- **Product docs**: [roboinvestor.ai/docs](https://roboinvestor.ai/docs): portfolio, reports you receive, reports from a file, research
- **Technical docs**: [robosystems.ai/docs/technical](https://robosystems.ai/docs/technical). For this app: [RoboInvestor Operations](https://robosystems.ai/docs/technical/roboinvestor-operations) · [Shared Repositories](https://robosystems.ai/docs/technical/shared-repositories) · [AI Operators & MCP](https://robosystems.ai/docs/technical/ai-operators-and-mcp)
- **API reference**: [robosystems.ai/docs/api](https://robosystems.ai/docs/api)

## Support

- [Issues](https://github.com/RoboFinSystems/roboinvestor-app/issues) · [Discussions](https://github.com/orgs/RoboFinSystems/discussions) · [Projects](https://github.com/orgs/RoboFinSystems/projects)
- [CONTRIBUTING.md](.github/CONTRIBUTING.md): branch conventions, coding standards and the pull request process

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details. The license does not cover the RoboSystems and RoboLedger names or logos; see [NOTICE](NOTICE).

Apache-2.0 © 2026 RFS LLC
