# RoboInvestor App

Part of RoboSystems, the open-source knowledge graph for finance.

RoboInvestor: equity research on public companies, your fund's positions with their terms, and the reports your portfolio companies share from RoboLedger. This repository is the web app at [roboinvestor.ai](https://roboinvestor.ai).

- **Portfolio**: Private positions with their terms recorded, grouped by issuer with cost basis and the marks you record
- **Portfolio Reports**: Statements a portfolio company shares from its RoboLedger graph, when both sides opt in
- **Research**: Equity research and every listed filer's statements, rendered from SEC XBRL filings
- **Natural Language Queries**: Ask about your positions and the filings in plain English, from the AI assistant you already use
- **MCP Integration**: Model Context Protocol support for Claude, ChatGPT, Cursor, and any MCP client

## Core Features

### Available Now

- **Investment Dashboard**: Portfolio overview with key metrics and quick actions
- **Portfolio Management**: Create portfolios, record positions and holdings, manage cost basis
- **Securities Management**: Record LLC units, LP interests, SAFEs, notes, warrants, options, and RSUs, with mutual-handshake cross-graph linking to issuer entities
- **AI Console**: Natural language and Cypher query terminal with streaming results and MCP integration
- **Entity Browser**: Search and manage entities (native + linked from portfolio companies) across graphs
- **Shared Repository Access**: Subscribe to SEC XBRL filings and browse rendered financial reports for public companies
- **Research**: SEC-filing-grounded equity research browser, every figure traceable to a filing
- **Document Search**: Full-text and semantic search over the selected graph
- **Portfolio Reports**: Reports shared from RoboLedger
- **Repository API Keys**: Generate a repository-scoped key from a repository's getting-started page for programmatic and MCP connector access

### Building Next

- **Positions linked to the ledger**
- **Brokerage sync**
- **Portfolio analytics**

## Quick Start

```bash
npm install              # Install dependencies
cp .env.example .env     # Configure environment (edit with your API endpoint)
npm run dev              # Start development server
```

The application will be available at http://localhost:3002

## Development Commands

### Core Development

```bash
npm run dev              # Start development server (port 3002)
npm run build            # Production build
```

### Testing

```bash
npm run test:all         # All tests and code quality checks
npm run test             # Run Vitest test suite
npm run test:coverage    # Generate coverage report
```

### Code Quality

```bash
npm run lint             # ESLint validation
npm run lint:fix         # Auto-fix linting issues
npm run format           # Prettier code formatting
npm run format:check     # Check formatting compliance
npm run typecheck        # TypeScript type checking
```

### SDLC Commands

```bash
npm run feature:create   # Create a feature branch
npm run release:create   # Create GitHub release
npm run deploy:staging   # Deploy to staging environment
npm run deploy:prod      # Deploy to production
```

### Shared Core Library

Shared components live in the [`@robosystems/core`](https://www.npmjs.com/package/@robosystems/core) npm package (repo: [robosystems-core](https://github.com/RoboFinSystems/robosystems-core)). Bump the pinned version to pick up changes:

```bash
npm install @robosystems/core@latest
```

### Prerequisites

#### System Requirements

- Node.js 26+ (LTS)
- 4GB RAM minimum
- Modern browser (Chrome, Firefox, Safari, Edge)

#### Required Services

- RoboSystems API endpoint (local development or production)

#### Deployment Requirements

- Fork this repo (and the [robosystems](https://github.com/RoboFinSystems/robosystems) backend)
- AWS account with IAM Identity Center (SSO)
- Run `just bootstrap` in the backend repo: it deploys OIDC and sets this
  repository's `AWS_ROLE_ARN`, `AWS_ACCOUNT_ID` and `AWS_REGION`
- Run `npm run setup:gha` here to configure the remaining deployment variables

See the **[Bootstrap Guide](https://robosystems.ai/docs/technical/bootstrap-guide)** for complete instructions including access modes (internal, public).

## Architecture

**Application Layer:**

- Next.js 16 App Router
- TypeScript 5 for type safety
- Tailwind CSS with the shared UI primitives in `@robosystems/core/ui`
- RoboSystems Client SDK for API communication and authentication
- Statement and report rendering via [`@robosystems/report-components`](https://www.npmjs.com/package/@robosystems/report-components)

**Core Library ([`@robosystems/core`](https://www.npmjs.com/package/@robosystems/core)):**

Shared modules consumed as an npm package across RoboSystems frontend apps:

- Auth components (login, register, password reset)
- Session management and JWT handling
- Graph creation wizard and shared components
- Layout, forms, chat, and settings components
- Graph, organization, and entity contexts
- SSE-based background job progress tracking

**Infrastructure:**

- AWS App Runner or Amazon ECS Express Mode with auto-scaling, chosen by the `APP_COMPUTE` GitHub variable (`apprunner` by default; per environment with `APP_COMPUTE_PROD` / `APP_COMPUTE_STAGING`). App Runner is closed to new AWS customers, so an account that has never used it must set `APP_COMPUTE=ecs-express`. Without a default VPC, also set `ECS_SUBNETS` to comma-separated public subnet IDs in at least two AZs.
- S3 + CloudFront for static asset hosting
- CloudFormation templates in `/cloudformation/`

## Support

- [Issues](https://github.com/RoboFinSystems/roboinvestor-app/issues)
- [Documentation](https://roboinvestor.ai/docs)
- [Technical docs](https://robosystems.ai/docs/technical)
- [Projects](https://github.com/orgs/RoboFinSystems/projects)
- [Discussions](https://github.com/orgs/RoboFinSystems/discussions)

## License

Apache License 2.0 - see [LICENSE](LICENSE) for details.

Apache-2.0 © 2026 RFS LLC
