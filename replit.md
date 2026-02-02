# AlphaSignals PRO - Trading Signals Platform

## Overview

AlphaSignals PRO is a professional-grade real-time trading signals platform powered by advanced AI (GPT-4o). It provides institutional-level forex and cryptocurrency trading signals with Smart Money Concepts analysis, multi-timeframe confluence, and professional risk management. The application features Replit Auth authentication, multiple free market data APIs, and a modern, professional dashboard.

## Recent Changes (February 2026)

- **AI System Upgrade**: Enhanced AI prompts with institutional-grade analysis methodology including Smart Money Concepts (Order Blocks, Fair Value Gaps, Liquidity Sweeps)
- **Professional UI Redesign**: Complete Landing page and Dashboard redesign with gradient backgrounds, animated elements, and premium styling
- **French Localization**: UI text translated to French for better user experience
- **Stats Display**: Added real-time stats (active signals, win rate) in Dashboard header

## User Preferences

Preferred communication style: Simple, everyday language (French preferred).

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
- **CoinGecko** (FREE, no API key required): Cryptocurrency price data
  - Supports: BTC, ETH, BNB, XRP, SOL, ADA, DOGE
  - Used for real-time crypto prices

- **ExchangeRate-API** (FREE, no API key required): Forex exchange rates
  - Supports: EUR/USD, GBP/USD, and other currency pairs
  - Used for real-time forex prices

- **Alpha Vantage** (Optional): Market data provider for stock prices
  - Environment variable: `ALPHA_VANTAGE_API_KEY`
  - Only required for stock trading signals (AAPL, TSLA, etc.)

- **Replit AI Integrations**: OpenAI-compatible API for AI signal generation
  - No API key required (uses Replit credits)
  - Powers the instant AI trading analysis

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