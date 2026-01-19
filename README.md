# RoboInvestor App

> **Version 0.1 (Alpha)** — Core infrastructure complete, actively developing investment-specific features

RoboInvestor App is the web interface for AI-powered investment intelligence, providing portfolio analysis and Claude-powered investment insights via the RoboSystems knowledge graph.

- **Portfolio Intelligence**: Track and analyze investment holdings with AI-powered insights and recommendations
- **Securities Analysis**: Real-time market data integration with intelligent pattern recognition
- **Natural Language Queries**: Ask questions about your portfolio in plain English and get instant answers
- **AI-Powered Guidance**: Leverage Claude AI for investment analysis that understands market context
- **Knowledge Graph Foundation**: Investment data modeled as a semantic graph preserving relationships
- **MCP Integration**: Model Context Protocol support for Claude Desktop and Claude Code

## Core Features

### Available Now

- **Interactive Console**: Natural language and Cypher query terminal for graph exploration
- **Entity Browser**: Search and manage entities across graphs with relationships
- **Graph Creation**: Wizard-based portfolio graph setup with schema selection
- **AI Chat**: Natural language interface for investment queries and analysis
- **API Keys**: Secure programmatic access with key creation and rotation
- **Settings**: Profile management and credit balance monitoring
- **Authentication**: Full auth flow with session management

### Roadmap

- **Investment Dashboard**: Personalized portfolio overview with key metrics and AI insights
- **Securities Management**: Track stocks, bonds, and other securities with real-time data
- **Portfolio Tracking**: Real-time position tracking, performance, and cost basis
- **Asset Allocation**: Visualization by sector, asset class, and geography
- **Risk Analytics**: Beta, volatility, Sharpe ratio, and correlation analysis
- **Dividend Tracking**: Yield monitoring and reinvestment tracking
- **Report Generation**: Create and share investment reports with stakeholders

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

See the **[Bootstrap Guide](https://github.com/RoboFinSystems/robosystems/wiki/Bootstrap-Guide)** for complete instructions including access modes (internal, public-http, public).

## Architecture

**Application Layer:**

- Next.js 15 App Router with React Server Components
- TypeScript 5 for type safety
- Flowbite React with Tailwind CSS for UI components
- RoboSystems Client SDK for API communication and authentication

**Key Features:**

- **Interactive Console**: Natural language and Cypher query terminal with streaming results, built-in commands, and MCP setup guides
- **Entity Browser**: Search and manage entities across graphs with parent/subsidiary relationships
- **Graph Creation**: Wizard-based portfolio graph setup with RoboInvestor schema extensions
- **AI Chat**: Natural language interface for investment queries and analysis
- **Settings**: Profile management, API keys, and credit balance monitoring

**Roadmap Features:**

- **Investment Dashboard**: Personalized portfolio overview with key metrics and AI insights
- **Securities Management**: Track stocks, bonds, and other securities with real-time data
- **Portfolio Tracking**: Real-time position tracking, performance metrics, and cost basis
- **Asset Allocation**: Visualization by sector, asset class, and geography
- **Risk Analytics**: Beta, volatility, Sharpe ratio, and correlation analysis
- **Dividend Tracking**: Yield monitoring and reinvestment tracking

**Core Library (`/src/lib/core/`):**

Shared modules maintained as a git subtree across RoboSystems frontend apps:

- Auth components (login, register, password reset)
- Session management and JWT handling
- Graph creation wizard and shared components
- Layout, forms, chat, and settings components
- User, company, graph, and credit contexts
- SSE-based background job progress tracking

**Infrastructure:**

- AWS App Runner with auto-scaling
- S3 + CloudFront for static asset hosting
- CloudFormation templates in `/cloudformation/`

## CI/CD

### Workflows

- **`prod.yml`**: Production deployment to roboinvestor.ai
- **`staging.yml`**: Staging deployment to staging.roboinvestor.ai
- **`test.yml`**: Automated testing on pull requests
- **`build.yml`**: Docker image building for ECR

### Infrastructure

- **AWS App Runner** with auto-scaling
- **S3 + CloudFront** for static asset hosting
- **CloudFormation** templates in `/cloudformation/`

## Support

- [Issues](https://github.com/RoboFinSystems/roboinvestor-app/issues)
- [Wiki](https://github.com/RoboFinSystems/robosystems/wiki)
- [Projects](https://github.com/orgs/RoboFinSystems/projects)
- [Discussions](https://github.com/orgs/RoboFinSystems/discussions)

## License

Apache License 2.0 - see [LICENSE](LICENSE) for details.

Apache-2.0 © 2025 RFS LLC
