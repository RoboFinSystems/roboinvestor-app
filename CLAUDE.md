# CLAUDE.md

This file provides comprehensive guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Application Overview

RoboInvestor App is a modern Next.js 15 application that serves as a comprehensive financial reporting and investment management platform. Built with TypeScript, React 18, Tailwind CSS, and Flowbite React, it provides:

- **Investment Management**: Portfolio tracking and analytics
- **Financial Reporting**: Secure financial report sharing for private companies
- **User Management**: Authentication, permissions, and API key management
- **AI Integration**: Claude AI-powered features for investment guidance
- **Real-time Data**: Market data integration and analytics

The application is designed for private companies to securely share financial reports with shareholders and stakeholders, featuring customizable reports, user permissions, and real-time collaboration capabilities.

## Technology Stack

### Core Framework

- **Next.js 15**: App Router with React Server Components
- **React 18**: Modern React with concurrent features
- **TypeScript**: Non-strict mode configuration for flexibility
- **Node.js 22.x**: Latest LTS version

### UI & Styling

- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Flowbite React**: Component library with extensive theming
- **Space Grotesk & Orbitron**: Custom typography
- **Custom Color Palette**: Brand-specific primary, secondary, and accent colors

### Backend Integration

- **Auto-generated SDK**: `@hey-api/openapi-ts` for type-safe API calls
- **Authentication**: Custom auth system with session management

### Development Tools

- **ESLint & Prettier**: Code linting and formatting
- **Vitest & React Testing Library**: Unit testing
- **Turbo**: Fast development server

## Common Commands

### Development

```bash
npm run dev              # Start development server with Turbo mode
npm run build            # Build Next.js application
```

### Code Quality

```bash
npm run lint             # Run ESLint
npm run lint:fix         # Fix linting issues automatically
npm run typecheck        # Run TypeScript type checking
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting
```

### Testing

```bash
npm run test             # Run all tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage report
```

## Architecture & Directory Structure

### Next.js App Router Structure

```
src/app/
├── (app)/                    # Authenticated application routes
│   ├── home/                 # Dashboard/home page
│   ├── settings/             # User settings
│   ├── layout.tsx           # Authenticated layout with sidebar
│   ├── navbar.tsx           # Top navigation bar
│   └── sidebar.tsx          # Collapsible sidebar navigation
├── (landing)/               # Public/unauthenticated routes
│   ├── login/               # Login page
│   ├── register/            # Registration page
│   ├── pages/               # Static pages (404, 500, privacy, terms)
│   └── maintenance.tsx      # Maintenance mode page
├── api/                     # API routes
│   ├── session/sidebar/     # Sidebar state management
│   └── utilities/health/    # Health check endpoint
├── globals.css              # Global styles and Tailwind imports
├── layout.tsx              # Root layout with AuthProvider
└── theme.ts                # Flowbite React custom theme
```

### Component Organization

```
src/components/
├── AuthGuard.tsx           # Route protection component
├── AuthProvider.tsx        # Authentication context provider
├── layouts/                # Layout components
│   ├── PageContainer.tsx   # Standard page wrapper
│   └── SettingsContainer.tsx # Settings page wrapper
└── __tests__/              # Component tests
```

### Core Libraries

```
src/lib/
├── common/                 # Shared library modules
│   ├── auth-components/    # Reusable auth UI components
│   ├── auth-core/         # Authentication logic and types
│   ├── sdk/               # Auto-generated API SDK
│   ├── ui-components/     # Reusable UI components
│   └── index.ts           # Main exports
├── sidebar-cookie.ts      # Sidebar state persistence
└── ...
```

### Key Files & Configurations

#### TypeScript Configuration

- **tsconfig.json**: Non-strict mode, path aliases (`@/*` → `src/*`)
- **Target**: ES2017 for broad compatibility
- **Module Resolution**: Bundler mode for Next.js

#### Styling & Theming

- **tailwind.config.ts**: Comprehensive brand color system and custom components
- **src/app/theme.ts**: Flowbite React theme customization
- **Custom Fonts**: Orbitron (headings), Space Grotesk (body), JetBrains Mono (code)

#### Testing Setup

- **vitest.config.ts**: Vitest configuration with jsdom environment
- **vitest.setup.ts**: Global test setup
- **Test Pattern**: `**/__tests__/**/*.test.[jt]s?(x)`

## SDK Integration & API Patterns

### Auto-Generated SDK

The application uses a type-safe SDK generated from OpenAPI specifications:

- **Location**: `src/lib/common/sdk/`
- **Generator**: `@hey-api/openapi-ts` v0.72.1
- **Client**: `@hey-api/client-fetch` v0.13.0
- **Types**: `src/lib/common/sdk/types.gen.ts`
- **Functions**: `src/lib/common/sdk/sdk.gen.ts`

### SDK Response Structure

All SDK functions return responses wrapped by `@hey-api/client-fetch`:

```typescript
{
  data: TResponseData,    // The actual API response data
  error: undefined,       // Error if request failed
  request: Request,       // The original request object
  response: Response      // The raw fetch Response object
}
```

### SDK Usage Patterns

#### Basic API Call

```typescript
import { SDK } from '@/lib/common'
import type { UserResponse } from '@/lib/common/sdk/types.gen'

// API call with proper type checking
SDK.getCurrentUser()
  .then((response) => {
    const userData = response.data
    if (userData && typeof userData === 'object' && 'id' in userData) {
      const user = userData as UserResponse
      // Use user data safely
    }
  })
  .catch((error) => {
    console.error('Failed to fetch user:', error)
  })
```

#### Type Safety Best Practices

- Always import response types from `@/lib/common/sdk/types.gen`
- Use runtime type guards before casting API responses
- Handle optional fields with nullish coalescing (`??`) or logical OR (`||`)
- Prefer runtime type checking over direct type assertions

## Authentication Architecture

### Authentication Flow

The application implements a custom authentication system with:

1. **Credentials-based Login**: Email/password through the backend API
2. **Session Management**: Cookie-based sessions with automatic refresh
3. **Route Protection**: AuthGuard component for authenticated routes
4. **Global State**: AuthProvider context for authentication state

### Key Authentication Components

#### AuthProvider (`src/components/AuthProvider.tsx`)

Global authentication context that manages:

- User session state
- Login/logout functionality
- Automatic session refresh
- Loading states

#### AuthGuard (`src/components/AuthGuard.tsx`)

Route protection wrapper that:

- Redirects unauthenticated users to login
- Shows loading states during authentication checks
- Wraps authenticated routes

#### SDK Authentication

- Automatic API key injection for authenticated requests
- Session management through HTTP-only cookies
- Type-safe user data handling

### Usage Example

```typescript
import { useAuth } from '@/lib/common'

function MyComponent() {
  const { user, isLoading, isAuthenticated, login, logout } = useAuth()

  if (isLoading) return <div>Loading...</div>
  if (!isAuthenticated) return <div>Please log in</div>

  return <div>Welcome, {user?.name}!</div>
}
```

## Design System & UI Components

### Brand Colors

- **Primary**: Blue palette (#1B3A57 to #3B7AF5) - Trust, professionalism
- **Secondary**: Green palette (#00D4AA variants) - Growth, success
- **Accent**: Orange palette (#FF6B35 variants) - Energy, attention
- **Semantic**: Success (green), Warning (orange), Error (red), Info (blue)

### Component Library Structure

```
src/lib/common/ui-components/
├── api-keys/              # API key management components
├── forms/                 # Form components and validation
├── layout/                # Layout and container components
├── settings/              # Settings page components
└── types/                 # TypeScript definitions
```

### Theming

- **Flowbite React**: Base component library
- **Custom Theme**: Brand-specific styling in `src/app/theme.ts`
- **Dark Mode**: Full dark mode support
- **Responsive**: Mobile-first responsive design

## Environment Variables & Configuration

### Required Environment Variables

Environment variables are organized in `secrets/` directory:

- **API Integration**: Backend service URLs (client and server-side)
- **Authentication**: Session secrets and configuration

## Testing Strategy

### Unit Testing

- **Framework**: Vitest with React Testing Library
- **Setup**: `vitest.setup.ts` with global configurations
- **Mock Strategy**: Mock Next.js router, fetch API, and external dependencies using `vi.mock()`
- **Test Location**: `__tests__` directories alongside components

### Coverage Targets

- **Statements**: >80%
- **Branches**: >75%
- **Functions**: >80%
- **Lines**: >80%

### Testing Patterns

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MyComponent } from '../MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Expected text')).toBeInTheDocument()
  })

  it('handles user interaction', async () => {
    const user = userEvent.setup()
    render(<MyComponent />)

    await user.click(screen.getByRole('button'))
    expect(screen.getByText('Updated text')).toBeInTheDocument()
  })
})
```

## Deployment

### Docker Configuration

- **Multi-stage Build**: Separate build and runtime stages
- **CI/CD**: GitHub Actions for automated deployments

### Environment Configurations

- **Production**: www.roboinvestor.ai
- **Staging**: staging.roboinvestor.ai
- **Health Checks**: `/api/utilities/health` endpoint

## Development Guidelines

### Code Style & Formatting

- **Prettier**: Consistent code formatting with `prettier-plugin-tailwindcss`
- **ESLint**: Next.js recommended rules with TypeScript support
- **Import Organization**: Automatic import sorting
- **Trailing Commas**: ES5 style for better diffs

### TypeScript Patterns

- **Non-strict Mode**: Flexibility for rapid development
- **Type Imports**: Use `import type` for type-only imports
- **API Types**: Always use generated SDK types
- **Runtime Checks**: Prefer type guards over assertions

### Component Patterns

- **Server Components**: Use for static content and data fetching
- **Client Components**: Mark with 'use client' for interactivity
- **Composition**: Prefer composition over inheritance
- **Props**: Use TypeScript interfaces for component props

### Performance Considerations

- **Code Splitting**: Automatic with Next.js App Router
- **Image Optimization**: Use `next/image` for all images
- **Font Loading**: Optimized font loading with `next/font`
- **Bundle Analysis**: Regular bundle size monitoring

## Security Considerations

### Authentication Security

- **Session Management**: HTTP-only cookies with secure flags
- **API Security**: Automatic authentication header injection
- **Route Protection**: Server-side authentication checks
- **Token Refresh**: Automatic session refresh

### Data Protection

- **Environment Variables**: Secrets stored securely, never committed
- **API Keys**: Rotation support and proper scoping
- **Input Validation**: Client and server-side validation
- **HTTPS**: SSL/TLS everywhere

### Security Best Practices

- **Secrets Management**: Environment variables for sensitive data
- **Regular Updates**: Automated dependency updates
- **CI/CD Security**: GitHub Actions workflows for deployments

## Troubleshooting & Common Issues

### Development Issues

- **Port Conflicts**: Default Next.js dev server uses port 3002
- **TypeScript Errors**: Run `npm run typecheck` to identify issues
- **SDK Type Issues**: Use runtime type guards for API responses
- **Auth Debugging**: Check browser dev tools for authentication cookies

### Build Issues

- **Memory Limits**: Increase Node.js memory for large builds
- **TypeScript Compilation**: Ensure all types are properly imported
- **Asset Optimization**: Check image and font loading configurations

### Testing Issues

- **Mock Configuration**: Ensure proper mocking of Next.js features
- **Async Testing**: Use proper async/await patterns in tests
- **Component Testing**: Wrap components with necessary providers

## Core Library (Git Subtree)

The `/src/lib/core/` directory is a shared library maintained as a git subtree across all RoboSystems frontend apps (robosystems-app, roboledger-app, roboinvestor-app).

### Subtree Commands

```bash
npm run core:pull        # Pull latest changes from core repository
npm run core:push        # Push local core changes back to repository
npm run core:add         # Initial setup (only needed once)
```

### Important Guidelines

- **Pull before making changes**: Always run `npm run core:pull` before modifying core components
- **Test locally first**: Verify changes work in this app before pushing to core
- **Push changes back**: After testing, use `npm run core:push` to share improvements
- **Sync other apps**: After pushing, other apps need to run `core:pull` to get updates
- **Avoid conflicts**: Coordinate with team when making significant core changes

### What's in Core

- **auth-components/**: Login, register, password reset forms
- **auth-core/**: Session management and JWT handling
- **components/**: Graph creation wizard and shared components
- **ui-components/**: Layout, forms, settings components
- **contexts/**: User, company, graph, credit contexts
- **task-monitoring/**: SSE-based background job tracking
- **hooks/**: Shared React hooks
- **theme/**: Flowbite theme customization
