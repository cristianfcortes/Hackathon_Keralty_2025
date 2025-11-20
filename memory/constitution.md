# Keralty Constitution

## Core Principles

### I. Static Site Generation (SSG)
The application must be buildable as a static web application. All pages must be pre-rendered at build time. No server-side rendering (SSR) or API routes are permitted. Client-side data fetching is allowed only for external APIs.

### II. Next.js Static Export
The application must be configured for static export using Next.js `output: 'export'` configuration. All pages must be statically generatable without runtime server dependencies.

### III. TypeScript Compliance
All source code must be valid TypeScript. The build process must include TypeScript compilation with strict type checking enabled. No JavaScript-only files in the source code.

### IV. Build Requirements
The build process must:
- Execute `npm install` to install all dependencies
- Run TypeScript compilation via Next.js build
- Process Tailwind CSS styles
- Generate static HTML, CSS, and JavaScript assets
- Output to a `out/` directory (Next.js default for static export)

### V. Dependency Management
All dependencies must be declared in `package.json` with exact or compatible version ranges. No runtime dependency installation is permitted. All build-time dependencies must be installable via npm.

## Technology Stack Requirements

### Required Runtime Environment
- **Node.js**: Version 18.x or higher (required for Next.js 15.5.3)
- **npm**: Version 9.x or higher (or compatible package manager: yarn, pnpm, bun)

### Required Build Tools
- **Next.js**: 15.5.3 (with Turbopack support)
- **TypeScript**: ^5.x
- **React**: 19.1.0
- **Tailwind CSS**: ^4.x (via PostCSS)

### Build Configuration
- Next.js must be configured with `output: 'export'` in `next.config.ts`
- TypeScript must use strict mode (`strict: true` in `tsconfig.json`)
- Tailwind CSS must be processed via PostCSS during build

## Development Workflow

### Build Process
1. Install dependencies: `npm install`
2. Type check: `npm run lint` (includes TypeScript validation)
3. Build static site: `npm run build` (must generate static files in `out/` directory)
4. Verify output: Ensure `out/` directory contains HTML, CSS, JS, and static assets

### Quality Gates
- All TypeScript files must compile without errors
- All pages must be statically generatable
- No server-side features (API routes, `getServerSideProps`, etc.)
- External API calls must be client-side only
- Build must complete successfully and produce deployable static files

## Governance

This constitution defines the minimum requirements for building the static web application. All build processes, deployment pipelines, and development workflows must comply with these requirements. Any changes to the build configuration or technology stack must maintain static site generation capability.

**Version**: 1.0.0 | **Ratified**: 2025-01-27 | **Last Amended**: 2025-01-27
