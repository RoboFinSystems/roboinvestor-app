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

- `/api/utilities/health` - Health check endpoint
- `/api/companies/search` - Company search
- `/api/contact` - Contact form submission via SNS
- `/api/support` - Support request submission via SNS
- `/api/reports/holon` - Holon JSON-LD validation for report rendering
- `/api/session/sidebar` - Sidebar state management

**Route Structure:**

- `(app)` route group: Authenticated pages (home, companies, console, graphs, entities, entity, portfolio, reports, repositories, search, settings)
- `(landing)` route group: Public pages (login, register, auth, legal pages, landing page)
- `(blog)` route group: Public equity research pages (`/research`)
- `(docs)` route group: Public docs
- API routes follow RESTful patterns with proper session validation

**RoboInvestor-Specific Features:**

- Console examples come from core and follow the graph type (portfolio on a RoboInvestor graph, filing analysis on the SEC repository); this app supplies only the branding, in `src/lib/console-branding.ts`
- Portfolio page: create portfolios, add securities and positions, and view holdings grouped by entity (`clients.investor.*`); cost basis is submitted in integer cents, parsed by `portfolio/money.ts`
- Entity browser across the user's RoboInvestor graphs

## Key Development Patterns

**Component Organization:**

- Shared UI primitives from `@robosystems/core/ui` for consistent UI
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

- Deployed on AWS App Runner or ECS Express Mode (the `APP_COMPUTE` GitHub variable) behind CloudFront
- **Release notes**: `tag-release.yml` (the reusable workflow in `robosystems`) auto-generates the changelog from changes since the last tag (via the Claude API). For milestone releases, commit curated notes to `.github/release-notes/v<version>.md` _before_ dispatching `create-release.yml` — when that file exists at the tagged ref it replaces the generated changelog (and the stats section is skipped)
- Environment variables needed:
  - `NEXT_PUBLIC_ROBOSYSTEMS_API_URL` - RoboSystems API endpoint
  - `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` - CAPTCHA configuration
  - Cross-app URLs for SSO navigation between RoboSystems, RoboLedger, and RoboInvestor

## Important Notes

- Requires Node.js 26.x (specified in package.json engines)
- RoboSystems API URL configuration required
- Always run `npm run test:all` before commits
- Format code before submitting PRs

## Core Library (npm Package)

Shared components are consumed from the [`@robosystems/core`](https://www.npmjs.com/package/@robosystems/core) npm package (repo: `RoboFinSystems/robosystems-core`), shared across all RoboSystems frontend apps (robosystems-app, roboledger-app, roboinvestor-app). Import from `@robosystems/core` or its subpaths (e.g. `@robosystems/core/ui`, `@robosystems/core/ui-components`).

### Working with Core

- **Core changes happen in the robosystems-core repo**, not here: branch there, test with `npm run test:all`, and validate in this app with a local tarball (`npm run pack:local` in core, then `npm install ../robosystems-core/robosystems-core-<version>.tgz` here) before releasing
- **Releases**: core publishes to npm via its `create-release` workflow; adopt a new version here with `npm install @robosystems/core@<version>`
- **Version pinning**: this app pins a semver range in package.json — core changes land here deliberately via a version bump, not implicitly
- **App wiring**: the package is in the Tailwind `content` globs (`node_modules/@robosystems/core/**/*.js`) and inlined in vitest (`test.server.deps.inline`) — keep both if configs are reworked

### What's in Core

- **auth-components/**: Login, register, password reset forms
- **auth-core/**: Session management and JWT handling
- **components/**: Graph creation wizard and shared components
- **ui/**: UI primitives (Button, Modal, Table, ...)
- **ui-components/**: Layout, forms, chat, and settings components
- **contexts/**: Graph, organization, entity, service-offerings, and sidebar contexts
- **task-monitoring/**: SSE-based background job tracking
- **hooks/**: Shared React hooks
- **styles/**: Palette and form CSS
- **docs/**: Docs rendering

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
