# Full-Stack TypeScript Starter

A reusable full-stack TypeScript monorepo starter for building web applications with a React frontend, Hono API, PostgreSQL database, and shared TypeScript packages.

The goal of this starter is to provide the common infrastructure needed for a modern TypeScript application without adding application-specific architecture or unnecessary dependencies.

## Stack

### Frontend

- React
- Vite
- TypeScript
- Tailwind CSS
- shadcn/ui
- Base UI
- Lucide icons

### Backend

- Hono
- Node.js
- TypeScript
- Zod
- Kysely
- PostgreSQL

### Tooling

- pnpm workspaces
- ESLint
- Prettier
- Vitest

## Project Structure

```text
.
├── apps/
│   ├── api/
│   │   ├── src/
│   │   │   ├── config/
│   │   │   ├── db/
│   │   │   │   └── migrations/
│   │   │   ├── app.ts
│   │   │   ├── app.test.ts
│   │   │   └── server.ts
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── tsconfig.build.json
│   │
│   └── web/
│       ├── src/
│       │   ├── components/
│       │   │   └── ui/
│       │   ├── lib/
│       │   ├── App.tsx
│       │   └── index.css
│       ├── components.json
│       ├── package.json
│       ├── tsconfig.json
│       └── vite.config.ts
│
├── packages/
│   ├── shared/
│   │   ├── src/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── tsconfig.build.json
│   │
│   └── typescript-config/
│       ├── base.json
│       ├── node.json
│       ├── react.json
│       └── package.json
│
├── .env.example
├── .gitignore
├── .prettierignore
├── .prettierrc
├── eslint.config.mjs
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
└── README.md
```

## Requirements

Install the following before setting up the project:

- Node.js
- pnpm
- PostgreSQL

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd <project-directory>
```

### 2. Install dependencies

```bash
pnpm install
```

pnpm installs dependencies for all applications and packages in the workspace using the root `pnpm-lock.yaml`.

### 3. Configure the environment

Copy the example environment file:

```bash
cp .env.example .env
```

The default example configuration is:

```dotenv
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/app_development
```

Update `DATABASE_URL` to match your local PostgreSQL configuration.

The real `.env` file is ignored by Git and should not be committed.

### 4. Create the PostgreSQL database

Create a database matching the database name configured in `DATABASE_URL`.

For example:

```sql
CREATE DATABASE app_development;
```

For a real application, consider creating a dedicated PostgreSQL role and database instead of using the default `postgres` user.

For example:

```sql
CREATE ROLE app_dev_user
WITH LOGIN PASSWORD 'dev_password';

CREATE DATABASE app_development
OWNER app_dev_user;
```

The corresponding environment variable would be:

```dotenv
DATABASE_URL=postgresql://app_dev_user:dev_password@localhost:5432/app_development
```

These credentials are only examples. Choose appropriate credentials for your own development environment.

### 5. Run database migrations

```bash
pnpm --filter @starter/api db:migrate
```

The starter intentionally contains no application-specific migrations.

Add migrations to:

```text
apps/api/src/db/migrations/
```

### 6. Start development

```bash
pnpm dev
```

This starts the API and frontend development servers in parallel.

By default:

- API: `http://localhost:3000`
- API health check: `http://localhost:3000/health`
- Web: Vite displays the local development URL in the terminal

Open the Vite URL in your browser to access the frontend.

## Root Commands

Run the following commands from the repository root.

### Development

```bash
pnpm dev
```

Starts the API and web development servers in parallel.

### Type Checking

```bash
pnpm typecheck
```

Runs TypeScript type checking across the workspaces.

### Tests

```bash
pnpm test
```

Runs tests in every workspace that defines a `test` script.

### Linting

```bash
pnpm lint
```

Runs ESLint across the repository.

### Formatting

Format the repository with Prettier:

```bash
pnpm format
```

Check formatting without modifying files:

```bash
pnpm format:check
```

The check command is useful for CI because it reports formatting problems without changing source files.

### Production Build

```bash
pnpm build
```

The build process first builds the shared package:

```text
packages/shared
```

It then builds the API and web applications.

The shared package must be built first because the applications consume its compiled output.

### Start the Production API

After building:

```bash
pnpm --filter @starter/api start
```

The production API runs the compiled JavaScript from:

```text
apps/api/dist/
```

## Workspace Structure

This repository uses pnpm workspaces.

The workspace configuration is defined in:

```text
pnpm-workspace.yaml
```

Applications live under:

```text
apps/*
```

Reusable packages live under:

```text
packages/*
```

Workspace packages reference each other using pnpm's `workspace:*` protocol.

For example:

```json
{
  "dependencies": {
    "@starter/shared": "workspace:*"
  }
}
```

This tells pnpm to use the local workspace package rather than downloading a package with the same name from a registry.

## API

The backend application lives in:

```text
apps/api/
```

It uses Hono running on Node.js.

### Application

The Hono application is defined in:

```text
apps/api/src/app.ts
```

The application is intentionally kept separate from the HTTP server.

This makes the application easier to test because tests can make requests directly against the Hono app without starting a real TCP server.

### Server

The Node.js server entry point is:

```text
apps/api/src/server.ts
```

This file is responsible for starting the HTTP server and reading the configured port.

### Health Check

The starter includes a simple health endpoint:

```text
GET /health
```

A successful response looks like:

```json
{
  "status": "ok"
}
```

The health endpoint provides a simple way to verify that the API is running.

## Environment Validation

Environment configuration is validated with Zod.

The environment schema lives in:

```text
apps/api/src/config/env.ts
```

Expected variables include:

```text
NODE_ENV
PORT
DATABASE_URL
```

The application fails early when required configuration is invalid or missing rather than failing later during application execution.

## Database

Database access uses PostgreSQL with Kysely.

The database client lives in:

```text
apps/api/src/db/client.ts
```

Database types live in:

```text
apps/api/src/db/database.types.ts
```

The `Database` interface is intentionally empty in the starter.

Add application tables as the database schema is designed.

For example:

```ts
export interface Database {
  users: UserTable
}
```

The exact table definitions should belong to the application built from this starter rather than the starter itself.

## Database Migrations

Kysely migrations live in:

```text
apps/api/src/db/migrations/
```

Run all pending migrations with:

```bash
pnpm --filter @starter/api db:migrate
```

The migration runner is located at:

```text
apps/api/src/db/migrate.ts
```

The starter contains no domain-specific migrations.

## Web Application

The frontend lives in:

```text
apps/web/
```

It uses:

- React
- Vite
- TypeScript
- Tailwind CSS
- shadcn/ui
- Base UI

The main application component is:

```text
apps/web/src/App.tsx
```

## shadcn/ui

shadcn/ui configuration lives in:

```text
apps/web/components.json
```

UI components are installed into:

```text
apps/web/src/components/ui/
```

To add another component, run the shadcn CLI from the repository root.

For example:

```bash
pnpm dlx shadcn@latest add card -c apps/web
```

The starter keeps UI components inside the web application.

A separate shared UI package should only be introduced if multiple frontend applications eventually need to share the same components.

## Path Aliases

The web application supports the `@/` path alias.

Instead of:

```ts
import { Button } from '../../../components/ui/button'
```

use:

```ts
import { Button } from '@/components/ui/button'
```

The alias points to:

```text
apps/web/src/
```

It is configured for both TypeScript and Vite so the compiler, development server, production build, and tooling resolve imports consistently.

## Shared Package

The shared package lives in:

```text
packages/shared/
```

It is intended for code that genuinely needs to be consumed by both the frontend and backend.

Good candidates include:

- Zod schemas
- API request schemas
- API response schemas
- Shared TypeScript types
- Shared constants
- Shared API contracts

For example, an application might eventually define:

```ts
import { z } from 'zod'

export const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
})

export type CreateUserInput = z.infer<typeof createUserSchema>
```

Both the frontend and API could then consume the same contract.

Avoid putting server-only or browser-only application logic in the shared package.

## Shared TypeScript Configuration

Reusable TypeScript configuration lives in:

```text
packages/typescript-config/
```

The package provides separate configurations for different environments.

```text
base.json
node.json
react.json
```

`base.json` contains common strict TypeScript settings.

`node.json` extends the base configuration for the Node.js API.

`react.json` extends the base configuration for the React frontend.

This keeps important TypeScript settings consistent without duplicating the entire configuration across applications.

## Testing

The API uses Vitest.

The starter includes a health endpoint test in:

```text
apps/api/src/app.test.ts
```

The test calls the Hono application directly rather than starting the HTTP server.

Run all tests with:

```bash
pnpm test
```

As application features are added, keep tests close to the code they verify when practical.

## ESLint

ESLint configuration is centralized at:

```text
eslint.config.mjs
```

The root configuration handles:

- TypeScript
- Node.js
- React
- React Hooks
- React Fast Refresh

Run ESLint with:

```bash
pnpm lint
```

## Prettier

Prettier configuration is defined in:

```text
.prettierrc
```

Format the repository with:

```bash
pnpm format
```

Verify formatting with:

```bash
pnpm format:check
```

ESLint is responsible for code-quality rules.

Prettier is responsible for formatting.

TypeScript is responsible for type checking.

Keeping these responsibilities separate makes the development tooling easier to understand and maintain.

## Building for Production

Run:

```bash
pnpm build
```

The build order is:

```text
shared package
      ↓
API + Web
```

The API and web applications can build in parallel after the shared package has been compiled.

Build output is generated under each application's or package's `dist` directory.

These directories are ignored by Git.

## Verifying the Project

Before committing significant changes, run:

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Together these check:

1. formatting
2. lint rules
3. TypeScript correctness
4. automated tests
5. production compilation

For local development:

```bash
pnpm dev
```

Then verify:

```text
http://localhost:3000/health
```

returns:

```json
{
  "status": "ok"
}
```

## Starting a New Project From This Starter

After creating a new repository from this starter:

### 1. Rename the project

Change the root package name in:

```text
package.json
```

### 2. Optionally rename the workspace scope

The starter uses:

```text
@starter/api
@starter/web
@starter/shared
@starter/typescript-config
```

You can leave these names in place or replace `@starter` with a project-specific scope.

If you rename the scope, update all workspace references and root scripts.

### 3. Install dependencies

```bash
pnpm install
```

### 4. Create the environment file

```bash
cp .env.example .env
```

Update the database connection and any application-specific configuration.

### 5. Create the database

Create a PostgreSQL development database for the application.

### 6. Run migrations

```bash
pnpm --filter @starter/api db:migrate
```

### 7. Start development

```bash
pnpm dev
```

### 8. Begin adding application features

Add application-specific:

- database migrations
- schemas
- API routes
- services
- repositories
- React features
- tests

as the project requires them.

## Adding Dependencies

This starter intentionally avoids installing every library that might eventually be useful.

Add dependencies when the application has a real requirement for them.

Examples include:

- TanStack Query for server-state management
- Zustand for client-side state management
- Better Auth or another authentication solution
- OpenAPI tooling for documented APIs
- Pino for structured logging
- Playwright for end-to-end testing
- Docker for containerized environments
- queues and background jobs
- email providers
- file storage
- observability tooling

This keeps new projects small and avoids committing to architectural decisions before the application needs them.

## Architecture Philosophy

This starter provides infrastructure, not a complete application architecture.

It deliberately does not include domain-specific folders such as:

```text
customers/
orders/
inventory/
tires/
appointments/
```

Those belong in applications built from the starter.

Similarly, architectural patterns such as repositories, services, vertical slices, or feature modules should be introduced according to the complexity of the application.

The starter should remain generic enough to support different kinds of projects.

## Starter Philosophy

The starter follows a few principles:

**Keep the foundation reusable.**

Infrastructure that nearly every project needs belongs here.

**Keep domain logic out.**

Business rules belong to the application created from the starter.

**Add dependencies when they solve a real problem.**

Avoid turning the starter into a kitchen-sink framework.

**Keep development and production behavior close.**

Production builds should be tested rather than assuming development tooling behaves identically.

**Prefer explicit configuration over unnecessary abstraction.**

The monorepo is intentionally small enough that its build order and workspace relationships remain easy to understand without additional orchestration tooling.

## License

Add an appropriate license before distributing the starter publicly.
