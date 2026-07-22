# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Core Development:**

```bash
npm run dev          # Start development server on PORT 3002
npm run build        # Production build
npm run start        # Production start
```

**Code Quality:**

```bash
npm run test:all     # All tests, formatting, linting, type checking, and CF linting
npm run test         # Run Vitest test suite
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues automatically
npm run typecheck    # Run TypeScript type checking
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
```

## Architecture Overview

**Authentication System:**

- RoboSystems Client SDK for user authentication and session management
- Cookie-based session persistence with automatic refresh
- Pre-built login/register forms via shared core library
- Session validation across authenticated routes

**API Routes:**

- `/api/utilities/health` - Health check endpoint for App Runner
- `/api/contact` - Contact form submission via SNS
- `/api/support` - Support request submission via SNS
- `/api/session/sidebar` - Sidebar state management

**Route Structure:**

- `(app)` route group: Authenticated pages (home, console, graphs, entities, entity, portfolio, repositories, research, search, settings)
- `(landing)` route group: Public pages (login, register, legal pages, landing page)
- API routes follow RESTful patterns with proper session validation

**RoboInvestor-Specific Features:**

- Console configured with investment-specific sample queries and `@robosystems/mcp` integration for AI analytics
- Portfolio page (coming soon placeholder with planned features)
- Graph creation enforces `roboinvestor` schema extension
- Entity browser with multi-graph traversal

## Key Development Patterns

**Component Organization:**

- Flowbite React components for consistent UI
- Dark mode support via Tailwind CSS
- Responsive design with mobile-first approach
- Component testing with React Testing Library

**Frontend Development:**

- Primarily client-side Next.js 16 application that connects to RoboSystems API
- Session validation on protected routes through API
- RoboSystems Client SDK for all API interactions
- Client-side error handling and user feedback

**Testing Strategy:**

- Vitest with jsdom environment for fast unit and component testing
- Component tests in `__tests__/` directories
- Path alias support for clean imports
- Test coverage reporting available with v8 provider

## Deployment

- Deployed on AWS App Runner behind CloudFront
- Environment variables needed:
  - `NEXT_PUBLIC_ROBOSYSTEMS_API_URL` - RoboSystems API endpoint
  - `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` - CAPTCHA configuration
  - Cross-app URLs for SSO navigation between RoboSystems, RoboLedger, and RoboInvestor

## Important Notes

- Requires Node.js 22.x (specified in package.json engines)
- RoboSystems API URL configuration required
- Always run `npm run test:all` before commits
- Format code before submitting PRs

## Core Library (npm Package)

Shared components are consumed from the [`@robosystems/core`](https://www.npmjs.com/package/@robosystems/core) npm package (repo: `RoboFinSystems/robosystems-core`), shared across all RoboSystems frontend apps (robosystems-app, roboledger-app, roboinvestor-app). Import from `@robosystems/core` or its subpaths (e.g. `@robosystems/core/ui-components`).

### Working with Core

- **Core changes happen in the robosystems-core repo**, not here: branch there, test with `npm run test:all`, and validate in this app with a local tarball (`npm run pack:local` in core, then `npm install ../robosystems-core/robosystems-core-<version>.tgz` here) before releasing
- **Releases**: core publishes to npm via its `create-release` workflow; adopt a new version here with `npm install @robosystems/core@<version>`
- **Version pinning**: this app pins a semver range in package.json — core changes land here deliberately via a version bump, not implicitly
- **App wiring**: the package is in the Tailwind `content` globs (`node_modules/@robosystems/core/**/*.js`) and inlined in vitest (`test.server.deps.inline`) — keep both if configs are reworked

### What's in Core

- **auth-components/**: Login, register, password reset forms
- **auth-core/**: Session management and JWT handling
- **components/**: Graph creation wizard and shared components
- **ui-components/**: Layout, forms, chat, and settings components
- **contexts/**: Graph, organization, entity, service-offerings, and sidebar contexts
- **task-monitoring/**: SSE-based background job tracking
- **hooks/**: Shared React hooks
- **theme/**: Flowbite theme customization
