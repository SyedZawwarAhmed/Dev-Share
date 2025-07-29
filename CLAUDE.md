# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a Turborepo monorepo with two main applications:
- `apps/server/` - NestJS backend API with Prisma ORM
- `apps/web/` - React frontend using Vite, TanStack Router, and Tailwind CSS

## Commands

### Development
- `pnpm dev` - Start both applications in development mode
- `pnpm dev --filter=server` - Start only the backend server
- `pnpm dev --filter=web` - Start only the frontend web app

### Building
- `pnpm build` - Build all applications
- `pnpm build --filter=server` - Build only the server
- `pnpm build --filter=web` - Build only the web app

### Code Quality
- `pnpm lint` - Run ESLint across all packages
- `pnpm format` - Format code with Prettier
- `pnpm check-types` - Run TypeScript type checking

### Backend Specific (in apps/server/)
- `pnpm test` - Run Jest unit tests
- `pnpm test:e2e` - Run end-to-end tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:cov` - Run tests with coverage

### Database (Prisma)
- `npx prisma generate` - Generate Prisma client (runs automatically on install)
- `npx prisma migrate dev` - Run database migrations in development
- `npx prisma studio` - Open Prisma Studio database GUI

## Architecture

### Backend (NestJS)
- **Authentication**: Multi-provider OAuth (Google, LinkedIn) + local auth with JWT
- **Database**: PostgreSQL with Prisma ORM
- **Key Modules**:
  - `AuthModule` - Authentication and authorization
  - `UsersModule` - User management
  - `NotesModule` - Note creation and management with pagination support
  - `PostsModule` - Social media post scheduling and publishing with status filtering
  - `StatsModule` - Dashboard statistics and analytics
  - `GeminiModule` - AI content generation integration

### Frontend (React)
- **Routing**: TanStack Router with file-based routing
- **State Management**: Zustand for global state, TanStack Query for server state
- **UI**: Tailwind CSS with shadcn/ui components
- **Authentication**: Context-based auth provider with JWT tokens

### Database Schema
- **Users**: Authentication, profiles, social media links
- **Notes**: Draft content that can be converted to posts
- **Posts**: Social media posts with scheduling and platform targeting
- **Accounts/Sessions**: OAuth account linking and session management

### Key Data Flow
1. Users create Notes (draft content)
2. Notes can be converted to Posts for specific platforms (LinkedIn, Twitter, Bluesky)
3. Posts can be scheduled or published immediately
4. AI integration helps generate and optimize content

## Environment Setup
- Backend requires `.env` file with database and OAuth credentials
- PostgreSQL database required
- Node.js >=18 required
- Uses pnpm as package manager

## Chat Memory
- Discussed comprehensive project setup for a full-stack social media content management application
- Explored integration of AI (Gemini) for content generation
- Reviewed multi-provider authentication strategy
- Analyzed modular architecture with NestJS backend and React frontend
- Highlighted use of modern web technologies: Prisma, TanStack Router, Zustand, Tailwind CSS

- Reviewed deployment strategy focusing on containerization and cloud-native approach