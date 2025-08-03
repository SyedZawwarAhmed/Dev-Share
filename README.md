# Dev-Share

A full-stack social media content management application built with modern web technologies. Create, manage, and schedule content across multiple social media platforms with AI-powered content generation.

## Features

- **Multi-platform Content Management**: Create and manage posts for LinkedIn, Twitter, and Bluesky
- **Note-to-Post Workflow**: Draft content as notes and convert them to platform-specific posts
- **AI Content Generation**: Integrated Gemini AI for content optimization and generation
- **Multi-provider Authentication**: Support for Google, LinkedIn OAuth, and local authentication
- **Scheduling**: Schedule posts for optimal timing
- **Analytics Dashboard**: Track performance and engagement statistics
- **Modern UI**: Clean, responsive interface built with Tailwind CSS and shadcn/ui

## Tech Stack

### Backend

- **NestJS** - Scalable Node.js framework
- **Prisma ORM** - Type-safe database access
- **PostgreSQL** - Primary database
- **JWT** - Authentication tokens
- **Gemini AI** - Content generation

### Frontend

- **React** - UI library
- **Vite** - Build tool and dev server
- **TanStack Router** - File-based routing
- **TanStack Query** - Server state management
- **Zustand** - Global state management
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Reusable UI components

## Project Structure

This is a Turborepo monorepo with two main applications:

### Apps and Packages

- `apps/server/` - NestJS backend API with Prisma ORM
- `apps/web/` - React frontend using Vite, TanStack Router, and Tailwind CSS
- `@repo/eslint-config` - Shared ESLint configurations
- `@repo/typescript-config` - Shared TypeScript configurations

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

## Getting Started

### Prerequisites

- Node.js >=18
- PostgreSQL database
- pnpm package manager

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:

   - Copy `.env.example` to `.env` in `apps/server/`
   - Configure database connection and OAuth credentials

4. Set up the database:
   ```bash
   cd apps/server
   npx prisma migrate dev
   ```

### Development

To develop all apps and packages:

```bash
pnpm dev
```

To run individual applications:

```bash
# Backend only
pnpm dev --filter=server

# Frontend only
pnpm dev --filter=web
```

### Building

To build all apps and packages:

```bash
pnpm build
```

To build individual applications:

```bash
# Backend only
pnpm build --filter=server

# Frontend only
pnpm build --filter=web
```

## Available Scripts

### Code Quality

```bash
# Run ESLint across all packages
pnpm lint

# Format code with Prettier
pnpm format

# Run TypeScript type checking
pnpm check-types
```

### Backend Development (apps/server/)

```bash
# Run Jest unit tests
pnpm test

# Run end-to-end tests
pnpm test:e2e

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:cov
```

### Database Management (Prisma)

```bash
# Generate Prisma client (runs automatically on install)
npx prisma generate

# Run database migrations in development
npx prisma migrate dev

# Open Prisma Studio database GUI
npx prisma studio
```

## Architecture

### Key Modules

**Backend (NestJS)**

- `AuthModule` - Multi-provider OAuth and JWT authentication
- `UsersModule` - User management and profiles
- `NotesModule` - Draft content creation with pagination
- `PostsModule` - Social media post scheduling with status filtering
- `StatsModule` - Dashboard analytics and statistics
- `GeminiModule` - AI content generation integration

**Frontend (React)**

- Context-based authentication with JWT tokens
- File-based routing with TanStack Router
- Server state management with TanStack Query
- Global state management with Zustand
- Responsive UI with Tailwind CSS and shadcn/ui components

### Data Flow

1. **Content Creation**: Users create Notes (draft content)
2. **Platform Targeting**: Notes can be converted to Posts for specific platforms (LinkedIn, Twitter, Bluesky)
3. **Scheduling**: Posts can be scheduled or published immediately
4. **AI Enhancement**: Integrated AI helps generate and optimize content
5. **Analytics**: Track performance and engagement across platforms

## Database Schema

- **Users**: Authentication, profiles, and social media links
- **Notes**: Draft content that can be converted to posts
- **Posts**: Social media posts with scheduling and platform targeting
- **Accounts/Sessions**: OAuth account linking and session management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

<!-- ## License -->
<!---->
<!-- [Add your license information here] -->
