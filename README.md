# RoboInvestor App

RoboInvestor is an AI-powered investment management platform that provides intelligent portfolio tracking, securities analysis, and personalized investment guidance powered by Claude AI.

- **Portfolio Intelligence**: Track and analyze investment holdings with AI-powered insights and recommendations
- **Securities Analysis**: Real-time market data integration with intelligent pattern recognition
- **Natural Language Queries**: Ask questions about your portfolio in plain English and get instant answers
- **AI-Powered Guidance**: Leverage Claude AI for investment analysis that understands market context
- **Secure Report Sharing**: Share financial reports with shareholders and stakeholders

## Core Features

RoboInvestor transforms traditional portfolio management into an intelligent system that enables AI agents to understand investment context, not just data points.

- **Investment Dashboard**: Personalized portfolio overview with key metrics and AI insights
- **Securities Management**: Track stocks, bonds, and other securities with real-time data
- **AI Chat Interface**: Natural language interaction for investment guidance and analysis
- **User Preferences**: Customizable investment preferences and risk profiles
- **Report Generation**: Create and share investment reports with stakeholders
- **API Key Authentication**: Secure programmatic access for integrations

## Quick Start

### Development Environment

```bash
# Clone the repository
git clone https://github.com/RoboFinSystems/roboinvestor-app.git
cd roboinvestor-app

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your API credentials

# Start development server
npm run dev
```

The application will be available at: http://localhost:3002

### Docker Development

```bash
# Build and run with Docker
docker build -t roboinvestor-app .
docker run -p 3002:3000 --env-file .env roboinvestor-app
```

## Development Commands

### Core Development

```bash
npm run dev              # Start development server (port 3002)
npm run build           # Production build with optimization
```

### Code Quality

```bash
npm run lint            # ESLint validation
npm run lint:fix        # Auto-fix linting issues
npm run format          # Prettier code formatting
npm run format:check    # Check formatting compliance
npm run typecheck       # TypeScript type checking
```

### Testing

```bash
npm run test            # Run Vitest test suite
npm run test:watch      # Interactive test watch mode
npm run test:coverage   # Generate coverage report
```

### Prerequisites

#### System Requirements

- Node.js 22+ (LTS recommended)
- npm 10+ or yarn 1.22+
- 4GB RAM minimum
- Modern browser (Chrome, Firefox, Safari, Edge)

#### Required Services

- RoboSystems API endpoint (production or development)
- Optional: AWS account for production deployment

## Architecture

### Application Layer

- **Next.js 15 App Router** with React Server Components for optimal performance
- **TypeScript 5** for type safety and developer experience
- **Flowbite React Components** with Tailwind CSS for consistent UI
- **RoboSystems Client SDK** for API communication and authentication

### Key Application Features

#### Dashboard (`/app/(app)/home/`)

The primary interface for investment overview:

- **Portfolio Summary**: Key metrics and investment balances at a glance
- **Holdings Overview**: Current positions across all accounts
- **AI Insights**: Claude-powered analysis of investment trends

#### Securities (`/app/(app)/securities/`)

Securities management interface:

- **Portfolio Tracking**: Real-time position tracking and performance
- **Market Data**: Live quotes and historical data
- **Analysis Tools**: Technical and fundamental analysis capabilities

#### Settings (`/app/(app)/settings/`)

User configuration and preferences:

- **Investment Preferences**: Risk tolerance and investment goals
- **Account Settings**: Profile and notification preferences
- **API Keys**: Manage programmatic access credentials

### Core Library (`/src/lib/core/`)

Shared authentication and utility modules maintained as a git subtree:

- **Auth Components**: Login/register forms with RoboInvestor branding
- **Auth Core**: Session management and JWT handling
- **UI Components**: Consistent interface elements across RoboSystems apps
- **Contexts**: User, company, and credit system contexts

### GitHub Actions Workflows

#### Primary Deployment Workflows

- **`prod.yml`**: Production deployment pipeline
  - Manual deployment via workflow_dispatch
  - Deploys to roboinvestor.ai with S3 static hosting
  - Full testing, build, and ECS deployment
  - Auto-scaling configuration with Fargate Spot

- **`staging.yml`**: Staging environment deployment
  - Manual workflow dispatch
  - Deploys to staging.roboinvestor.ai
  - Integration testing environment

- **`test.yml`**: Automated testing suite
  - Runs on pull requests and main branch
  - TypeScript, ESLint, and Prettier checks
  - Vitest unit and integration tests
  - Build verification

- **`build.yml`**: Docker image building
  - Multi-architecture support (AMD64/ARM64)
  - Pushes to Amazon ECR
  - Static asset upload to S3

### CloudFormation Templates

Infrastructure as Code templates in `/cloudformation/`:

- **`template.yaml`**: Complete ECS Fargate stack with auto-scaling
- **`s3.yaml`**: Static asset hosting for CloudFront CDN

## Support

- Issues: [GitHub Issues](https://github.com/RoboFinSystems/roboinvestor-app/issues)
- Discussions: [GitHub Discussions](https://github.com/RoboFinSystems/roboinvestor-app/discussions)
- Wiki: [GitHub Wiki](https://github.com/RoboFinSystems/roboinvestor-app/wiki)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

MIT © 2025 RFS LLC
