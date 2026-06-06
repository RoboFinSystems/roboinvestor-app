# RoboInvestor App

> **Version 0.2 (Alpha)** — Core infrastructure complete, actively developing investment-specific features

RoboInvestor App is the web interface for AI-powered investment intelligence, providing portfolio analysis and Claude-powered investment insights via the RoboSystems knowledge graph.

- **Portfolio Intelligence**: Track and analyze investment holdings with AI-powered insights and recommendations
- **Natural Language Queries**: Ask questions about your portfolio in plain English and get instant answers
- **AI-Powered Guidance**: Leverage Claude AI for investment analysis via the knowledge graph
- **Knowledge Graph Foundation**: Investment data modeled as a semantic graph preserving relationships
- **MCP Integration**: Model Context Protocol support for Claude Desktop and Claude Code

## Core Features

### Available Now

- **Investment Dashboard**: Portfolio overview with key metrics and quick actions
- **Portfolio Management**: Create portfolios, track positions and holdings, manage cost basis
- **Securities Management**: Track stocks, bonds, and other securities with mutual-handshake cross-graph linking to issuer entities
- **AI Console**: Natural language and Cypher query terminal with streaming results and MCP integration
- **Entity Browser**: Search and manage entities (native + linked from portfolio companies) across graphs
- **Shared Repository Access**: Subscribe to and query SEC XBRL filings for public-company holdings
- **Document Search**: Full-text and semantic search across connected sources
- **Graph Creation**: Wizard-based portfolio graph setup with schema selection
- **API Keys**: Secure programmatic access with key creation and rotation
- **Settings**: Profile and password management

### Roadmap

- **Asset Allocation**: Visualization by sector, asset class, and geography
- **Risk Analytics**: Beta, volatility, Sharpe ratio, and correlation analysis
- **Dividend Tracking**: Yield monitoring and reinvestment tracking
- **Performance Analytics**: TWR, IRR, and benchmark comparisons

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

### Core Subtree Management

```bash
npm run core:pull        # Pull latest core subtree updates
npm run core:push        # Push core subtree changes
npm run core:add         # Add core subtree (initial setup)
```

### Prerequisites

#### System Requirements

- Node.js 22+ (LTS recommended)
- npm 10+
- 4GB RAM minimum
- Modern browser (Chrome, Firefox, Safari, Edge)

#### Required Services

- RoboSystems API endpoint (local development or production)

#### Deployment Requirements

- Fork this repo (and the [robosystems](https://github.com/RoboFinSystems/robosystems) backend)
- AWS account with IAM Identity Center (SSO)
- Run `npm run setup:bootstrap` to configure OIDC and GitHub variables

See the **[Bootstrap Guide](https://github.com/RoboFinSystems/robosystems/wiki/Bootstrap-Guide)** for complete instructions including access modes (internal, public).

## Architecture

**Application Layer:**

- Next.js 16 App Router
- TypeScript 5 for type safety
- Flowbite React with Tailwind CSS for UI components
- RoboSystems Client SDK for API communication and authentication

**Core Library (`/src/lib/core/`):**

Shared modules maintained as a git subtree across RoboSystems frontend apps:

- Auth components (login, register, password reset)
- Session management and JWT handling
- Graph creation wizard and shared components
- Layout, forms, chat, and settings components
- Graph, organization, and entity contexts
- SSE-based background job progress tracking

**Infrastructure:**

- AWS App Runner with auto-scaling
- S3 + CloudFront for static asset hosting
- CloudFormation templates in `/cloudformation/`

## CI/CD

- **`prod.yml`**: Production deployment to roboinvestor.ai
- **`staging.yml`**: Staging deployment to staging.roboinvestor.ai
- **`test.yml`**: Automated testing on pull requests
- **`build.yml`**: Docker image building for ECR

## Support

- [Issues](https://github.com/RoboFinSystems/roboinvestor-app/issues)
- [Wiki](https://github.com/RoboFinSystems/robosystems/wiki)
- [Projects](https://github.com/orgs/RoboFinSystems/projects)
- [Discussions](https://github.com/orgs/RoboFinSystems/discussions)

## License

Apache License 2.0 - see [LICENSE](LICENSE) for details.

Apache-2.0 © 2026 RFS LLC
