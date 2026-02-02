# AlphaSignals - Trading Signals Platform

## Overview

AlphaSignals is a real-time trading signals platform that provides users with curated forex and cryptocurrency trading signals. The application features user authentication via Replit Auth, market data integration through Alpha Vantage API, and a modern dashboard for viewing and managing trading signals with entry/exit points, risk management levels, and performance tracking.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Animations**: Framer Motion for page transitions and card animations
- **Charts**: Recharts for performance visualization
- **Build Tool**: Vite with HMR support

The frontend follows a component-based architecture with:
- Pages in `client/src/pages/` (Landing, Dashboard, SignalDetails)
- Reusable components in `client/src/components/`
- Custom hooks in `client/src/hooks/` for data fetching and auth
- UI primitives from shadcn/ui in `client/src/components/ui/`

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful endpoints defined in `shared/routes.ts` with Zod validation
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Authentication**: Replit Auth (OpenID Connect) with Passport.js
- **Session Storage**: PostgreSQL-backed sessions via connect-pg-simple

The backend uses a layered architecture:
- Routes defined in `server/routes.ts`
- Storage layer in `server/storage.ts` implementing the repository pattern
- Auth integration isolated in `server/replit_integrations/auth/`
- Market data fetching in `server/market.ts`

### Data Storage
- **Database**: PostgreSQL
- **Schema Definition**: Drizzle schema in `shared/schema.ts`
- **Migrations**: Drizzle Kit with `db:push` command

Key tables:
- `signals` - Trading signals with pair, direction, entry/exit prices, status
- `market_data` - Cached market prices from Alpha Vantage
- `users` - User profiles (required for Replit Auth)
- `sessions` - Session storage (required for Replit Auth)

### Authentication
- Replit Auth via OpenID Connect
- Session-based authentication with PostgreSQL session store
- Protected routes require `isAuthenticated` middleware
- User data synced on login via `upsertUser`

## External Dependencies

### Third-Party APIs
- **Alpha Vantage**: Market data provider for real-time forex/stock prices
  - Environment variable: `ALPHA_VANTAGE_API_KEY`
  - Used for fetching live prices and generating signals

### Database
- **PostgreSQL**: Primary database
  - Environment variable: `DATABASE_URL`
  - Required for both application data and session storage

### Authentication
- **Replit Auth**: OpenID Connect provider
  - Environment variables: `ISSUER_URL`, `REPL_ID`, `SESSION_SECRET`
  - Handles user authentication and profile management

### Key NPM Packages
- `drizzle-orm` / `drizzle-kit`: Database ORM and migrations
- `express` / `express-session`: Web server and session handling
- `passport` / `openid-client`: Authentication
- `@tanstack/react-query`: Client-side data fetching
- `axios`: HTTP client for Alpha Vantage API
- `zod`: Runtime validation for API requests/responses
- `shadcn/ui` components: Full UI component library based on Radix primitives