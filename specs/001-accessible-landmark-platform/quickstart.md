# Quickstart Guide: Accessible Landmark Platform Website

**Feature**: 001-accessible-landmark-platform  
**Date**: 2025-01-27  
**Purpose**: Get started with development quickly

## Prerequisites

- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher (or compatible: yarn, pnpm, bun)
- **Git**: For version control
- **Code Editor**: VS Code recommended (with TypeScript support)

## Initial Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

This installs all required dependencies including:
- Next.js 15.5.3
- React 19.1.0
- TypeScript 5.x
- Tailwind CSS 4.x
- @react-google-maps/api

### 2. Configure Environment Variables

Create a `.env.local` file in the `frontend/` directory:

```bash
# Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# AI Chat API (if applicable)
NEXT_PUBLIC_AI_API_URL=https://api.example.com/v1/chat
NEXT_PUBLIC_AI_API_KEY=your_ai_api_key_here
```

**Note**: 
- Replace placeholder values with actual API keys
- Never commit `.env.local` to version control (already in `.gitignore`)
- Get Google Maps API key from [Google Cloud Console](https://console.cloud.google.com/)

### 3. Configure Next.js for Static Export

Update `frontend/next.config.ts`:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',  // Enable static export
  images: {
    unoptimized: true,  // Required for static export
  },
};

export default nextConfig;
```

### 4. Create Data Files

Create embedded data files:

**`frontend/data/landmarks.json`**:
```json
[
  {
    "id": "landmark-001",
    "name": "Central Medical Center",
    "description": "A modern medical facility with full accessibility features",
    "coordinates": {
      "lat": 40.7589,
      "lng": -73.9851
    },
    "address": "123 Main Street, New York, NY 10001",
    "category": "medical",
    "accessibilityInfo": {
      "wheelchairAccessible": true,
      "hearingAssistance": true,
      "visualAssistance": true
    }
  }
]
```

**`frontend/data/professionals.json`**:
```json
[
  {
    "id": "prof-001",
    "name": "Jane Smith",
    "title": "Dr.",
    "specialty": "Cardiology",
    "organization": "Central Medical Center",
    "contact": {
      "email": "jane.smith@medicalcenter.com",
      "phone": "+1-555-0123"
    }
  }
]
```

## Development Workflow

### Start Development Server

```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:3000`

### Type Checking

```bash
npm run lint
```

This runs ESLint which includes TypeScript type checking.

### Build Static Site

```bash
npm run build
```

This generates static files in the `frontend/out/` directory.

### Preview Production Build

```bash
# After building, serve the static files
npx serve frontend/out
```

Or use any static file server to serve the `out/` directory.

## Project Structure

```
frontend/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Main page (map)
│   ├── chat_page/page.tsx        # AI chat page
│   ├── records/page.tsx          # Records/to-do page
│   ├── directory/page.tsx        # Medical professionals directory
│   ├── contact/page.tsx          # Contact page
│   ├── layout.tsx                # Root layout
│   └── components/               # React components
├── data/                          # Embedded static data
│   ├── landmarks.json
│   └── professionals.json
├── lib/                          # Utility libraries
│   ├── storage/                   # Client-side storage
│   ├── api/                       # API clients
│   └── accessibility/             # Accessibility utilities
├── hooks/                        # React hooks
├── types/                        # TypeScript type definitions
└── style/                        # Global styles
```

## Key Implementation Tasks

### 1. Create Type Definitions

Create type files in `frontend/types/`:
- `landmark.ts` - Landmark interface
- `professional.ts` - MedicalProfessional interface
- `record.ts` - Record interface
- `attendance.ts` - AttendanceConfirmation interface
- `chat.ts` - ChatMessage interface

### 2. Create Storage Utilities

Create storage utilities in `frontend/lib/storage/`:
- `records.ts` - Records storage API
- `attendance.ts` - Attendance storage API
- `localStorage.ts` - Base localStorage utilities

### 3. Create Map Components

Create map components in `frontend/app/components/map/`:
- `InteractiveMap.tsx` - Main map component
- `LandmarkMarker.tsx` - Marker component
- `LandmarkModal.tsx` - Modal for landmark details

### 4. Create Accessibility Components

Create accessibility utilities in `frontend/app/components/accessibility/`:
- `SkipLink.tsx` - Skip to main content link
- `FocusTrap.tsx` - Focus management for modals

### 5. Implement Pages

Implement the five main pages:
1. **Main page** (`app/page.tsx`) - Interactive map
2. **Chat page** (`app/chat_page/page.tsx`) - AI chat interface
3. **Records page** (`app/records/page.tsx`) - To-do list
4. **Directory page** (`app/directory/page.tsx`) - Medical professionals
5. **Contact page** (`app/contact/page.tsx`) - Contact information

## Testing

### Run Tests (when implemented)

```bash
npm test
```

### Accessibility Testing

1. **Automated**: Use browser extensions (axe DevTools, WAVE)
2. **Manual**: Test with screen readers (NVDA, JAWS, VoiceOver)
3. **Keyboard**: Navigate entire site using only keyboard
4. **Lighthouse**: Run Lighthouse accessibility audit

## Common Issues

### Issue: Map not loading

**Solution**: 
- Check `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set correctly
- Verify API key has Maps JavaScript API enabled
- Check browser console for errors

### Issue: Build fails with "output: 'export'"

**Solution**:
- Ensure no API routes exist in `app/api/`
- Remove any `getServerSideProps` or server components that can't be statically generated
- Check `next.config.ts` has `output: 'export'`

### Issue: localStorage not working

**Solution**:
- Check if browser supports localStorage
- Handle private browsing mode (localStorage may be unavailable)
- Implement error handling in storage utilities

### Issue: TypeScript errors

**Solution**:
- Run `npm run lint` to see all errors
- Ensure all type definitions are created
- Check `tsconfig.json` has `strict: true`

## Next Steps

1. **Review Specifications**: Read `spec.md` for detailed requirements
2. **Review Data Model**: See `data-model.md` for data structures
3. **Review Contracts**: Check `contracts/` for API specifications
4. **Create Tasks**: Run `/speckit.tasks` to break down implementation
5. **Start Implementation**: Begin with P1 user story (interactive map)

## Resources

- **Next.js Documentation**: https://nextjs.org/docs
- **React Documentation**: https://react.dev
- **Google Maps API**: https://developers.google.com/maps/documentation/javascript
- **WCAG 2.1 Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/

## Getting Help

- Check existing code in `frontend/` for patterns
- Review `research.md` for technical decisions
- Consult `plan.md` for architecture overview
- Review constitution in `memory/constitution.md` for constraints

