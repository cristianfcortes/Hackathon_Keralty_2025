# Implementation Plan: Accessible Landmark Platform Website

**Branch**: `001-accessible-landmark-platform` | **Date**: 2025-01-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-accessible-landmark-platform/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build an accessible, modern website using Next.js static site generation with an interactive map featuring embedded landmark reference points. The platform includes five main pages: interactive map with landmarks, AI chat, records management, medical professional directory, and contact page. Landmark data (reference points) and medical professional data are embedded as static content at build time (no databases). User-specific data (records, attendance confirmations) uses client-side storage (localStorage/IndexedDB). The site must meet WCAG 2.1 Level AA accessibility standards.

## Technical Context

**Language/Version**: TypeScript 5.x  
**Primary Dependencies**: Next.js 15.5.3, React 19.1.0, Tailwind CSS 4.x, @react-google-maps/api 2.20.7  
**Storage**: 
- Static embedded data: JSON/TypeScript files for landmarks (reference points) and medical professionals (embedded at build time, no databases)
- Client-side storage: localStorage/IndexedDB for user-specific data (records, attendance confirmations)
- No databases or server-side storage
**Testing**: Jest, React Testing Library, Playwright (for accessibility testing)  
**Target Platform**: Web browsers (Chrome, Firefox, Safari, Edge) with assistive technology support  
**Project Type**: Web application (static site)  
**Performance Goals**: 
- Page load and interactivity within 2 seconds on standard broadband
- AI chat response within 3 seconds for 95% of queries
- Map interactions responsive (<100ms perceived latency)
**Constraints**: 
- Must be statically exportable (Next.js `output: 'export'`)
- No server-side rendering or API routes
- All external API calls must be client-side only
- WCAG 2.1 Level AA compliance required
- Must work with JavaScript disabled (graceful degradation)
**Scale/Scope**: 
- 5 main pages
- Embedded landmark data (reference points - static, not user-created)
- Embedded medical professional directory
- Client-side records management (user-created to-do items)
- Client-side attendance confirmations (user-specific)
- AI chat integration

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Static Site Generation (SSG) ✅
- **Requirement**: Application must be buildable as a static web application
- **Compliance**: Using Next.js with `output: 'export'` configuration
- **Status**: PASS - All pages will be pre-rendered at build time

### II. Next.js Static Export ✅
- **Requirement**: Configured for static export using Next.js `output: 'export'`
- **Compliance**: Will configure `next.config.ts` with `output: 'export'`
- **Status**: PASS - No server-side dependencies required

### III. TypeScript Compliance ✅
- **Requirement**: All source code must be valid TypeScript with strict type checking
- **Compliance**: TypeScript 5.x with `strict: true` in `tsconfig.json` (already configured)
- **Status**: PASS - Existing configuration meets requirements

### IV. Build Requirements ✅
- **Requirement**: Build process must execute npm install, TypeScript compilation, Tailwind CSS processing, generate static files in `out/` directory
- **Compliance**: Next.js build process handles all requirements
- **Status**: PASS - Standard Next.js build workflow

### V. Dependency Management ✅
- **Requirement**: All dependencies declared in `package.json` with exact or compatible version ranges
- **Compliance**: Dependencies already declared in `frontend/package.json`
- **Status**: PASS - No runtime dependency installation needed

**Overall Status**: ✅ ALL GATES PASS - Ready for Phase 0 research

### Post-Phase 1 Re-check

After Phase 1 design completion, all gates remain compliant:
- ✅ Static site generation maintained (embedded data, no server dependencies)
- ✅ Next.js static export configuration documented
- ✅ TypeScript compliance ensured in all design artifacts
- ✅ Build requirements align with Next.js static export
- ✅ No database dependencies (embedded data + client-side storage only)

**Post-Design Status**: ✅ ALL GATES PASS - Ready for Phase 2 (tasks)

## Project Structure

### Documentation (this feature)

```text
specs/001-accessible-landmark-platform/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
frontend/
├── app/
│   ├── page.tsx                    # Main page with interactive map
│   ├── chat_page/
│   │   └── page.tsx                # AI chat page
│   ├── records/
│   │   └── page.tsx                # Records/to-do list page
│   ├── directory/
│   │   └── page.tsx                # Medical professionals directory
│   ├── contact/
│   │   └── page.tsx                # Contact page
│   ├── layout.tsx                   # Root layout with navigation
│   └── components/
│       ├── map/
│       │   ├── InteractiveMap.tsx   # Main map component
│       │   ├── LandmarkMarker.tsx   # Landmark point marker
│       │   └── LandmarkModal.tsx    # Modal for landmark details
│       ├── chat/
│       │   ├── ChatInterface.tsx    # Chat UI component
│       │   └── ChatMessage.tsx      # Individual message component
│       ├── records/
│       │   ├── RecordsList.tsx     # To-do list component
│       │   └── RecordItem.tsx      # Individual record item
│       ├── directory/
│       │   ├── ProfessionalList.tsx # Directory listing
│       │   └── ProfessionalCard.tsx # Professional card component
│       └── accessibility/
│           ├── SkipLink.tsx         # Skip to main content link
│           └── FocusTrap.tsx        # Focus management utilities
├── data/
│   ├── landmarks.json              # Embedded landmark data (reference points)
│   └── professionals.json          # Embedded medical professional data
├── lib/
│   ├── storage/
│   │   ├── localStorage.ts         # Client-side storage utilities
│   │   └── records.ts              # Records storage logic
│   ├── api/
│   │   └── chat.ts                 # AI chat API client
│   └── accessibility/
│       ├── aria.ts                 # ARIA utilities
│       └── keyboard.ts             # Keyboard navigation helpers
├── hooks/
│   ├── useLandmarks.ts             # Landmark data management
│   ├── useAttendance.ts            # Attendance confirmation tracking
│   ├── useRecords.ts               # Records CRUD operations
│   └── useChat.ts                  # AI chat integration (already exists)
├── types/
│   ├── landmark.ts                 # Landmark type definitions
│   ├── professional.ts             # Medical professional types
│   ├── record.ts                   # Record type definitions
│   └── chat.ts                     # Chat message types
├── public/
│   └── [static assets]
└── style/
    └── globals.css                  # Global styles with accessibility focus
```

**Structure Decision**: Web application structure using Next.js App Router. Static data (landmarks, professionals) embedded as JSON files in `data/` directory, loaded at build time. User-specific data (records, attendance) managed via client-side storage utilities. Accessibility utilities centralized in `lib/accessibility/` and `components/accessibility/`.

## Complexity Tracking

> **No violations - all requirements align with constitution**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |

