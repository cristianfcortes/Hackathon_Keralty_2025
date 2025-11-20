# Research: Accessible Landmark Platform Website

**Feature**: 001-accessible-landmark-platform  
**Date**: 2025-01-27  
**Purpose**: Document technical decisions and research findings

## Technical Decisions

### 1. Static Site Generation with Next.js

**Decision**: Use Next.js 15.5.3 with `output: 'export'` for static site generation

**Rationale**: 
- Aligns with constitution requirements for static site generation
- Next.js provides excellent developer experience and built-in optimizations
- Static export ensures no server dependencies
- Supports TypeScript and modern React patterns

**Alternatives considered**:
- **Gatsby**: More complex setup, less active development
- **Astro**: Good for content sites but less flexible for interactive features
- **Vite + React**: Would require more manual configuration for routing and optimization

**Implementation**: Configure `next.config.ts` with `output: 'export'` and ensure all pages are statically generatable.

---

### 2. Embedded Landmark Data

**Decision**: Embed landmark reference points as static JSON/TypeScript files, loaded at build time

**Rationale**:
- User requirement: "data is embedded in the content for the referents points"
- No database needed - aligns with "no databases" constraint
- Fast initial load - data bundled with application
- Simple deployment - no data synchronization needed

**Alternatives considered**:
- **Client-side storage (localStorage)**: Would require user to add landmarks, but requirement specifies embedded reference points
- **External API**: Would require backend infrastructure, violates static site constraint
- **CMS integration**: Overkill for static reference data

**Implementation**: Create `frontend/data/landmarks.json` with landmark data structure, import in components.

---

### 3. Client-Side Storage for User Data

**Decision**: Use localStorage for records and attendance confirmations

**Rationale**:
- User-specific data (records, attendance) needs persistence
- No server-side storage available (static site)
- localStorage is sufficient for to-do lists and attendance tracking
- Simple API, widely supported

**Alternatives considered**:
- **IndexedDB**: More complex, only needed for large datasets
- **Session storage**: Data would be lost on tab close
- **External API**: Would require backend, violates static site constraint

**Implementation**: Create storage utilities in `frontend/lib/storage/` for records and attendance management.

---

### 4. Map Library Selection

**Decision**: Use @react-google-maps/api (already in dependencies)

**Rationale**:
- Already included in project dependencies
- Well-maintained React wrapper for Google Maps
- Good accessibility support with proper ARIA attributes
- Extensive documentation

**Alternatives considered**:
- **Mapbox**: Would require new dependency, similar functionality
- **Leaflet**: More lightweight but less polished React integration
- **OpenLayers**: More complex, overkill for this use case

**Implementation**: Use existing `@react-google-maps/api` package, ensure keyboard navigation and screen reader compatibility.

---

### 5. AI Chat Integration

**Decision**: Integrate with external AI service API (client-side only)

**Rationale**:
- Requirement specifies AI chat functionality
- Static site cannot host AI models
- Client-side API calls allowed per constitution
- Existing `useChat.ts` hook suggests integration pattern already established

**Alternatives considered**:
- **Embedded AI model**: Would require server-side processing, violates static site constraint
- **Pre-generated responses**: Not interactive, doesn't meet requirement
- **Third-party widget**: Less control over accessibility

**Implementation**: Use existing chat hook pattern, ensure API calls are client-side only, handle offline/error states gracefully.

---

### 6. Accessibility Implementation

**Decision**: Implement WCAG 2.1 Level AA compliance using semantic HTML, ARIA attributes, and keyboard navigation

**Rationale**:
- Core requirement: "easy to use for people with hearing or visual impairments"
- WCAG 2.1 Level AA is industry standard
- Next.js supports semantic HTML and accessibility features
- React has good ARIA support

**Key Implementation Areas**:
- Semantic HTML5 elements (`<nav>`, `<main>`, `<article>`, etc.)
- ARIA labels and roles for interactive elements
- Keyboard navigation for all interactive features
- Focus management (skip links, focus traps)
- Color contrast (4.5:1 for normal text, 3:1 for large text)
- Alt text for images
- Screen reader announcements

**Tools for Validation**:
- axe DevTools (browser extension)
- WAVE (Web Accessibility Evaluation Tool)
- Lighthouse accessibility audit
- Manual testing with screen readers (NVDA, JAWS, VoiceOver)

---

### 7. Medical Professional Directory Data

**Decision**: Embed medical professional data as static JSON/TypeScript files

**Rationale**:
- Similar to landmarks - reference data that doesn't change frequently
- No database constraint
- Fast loading, simple implementation
- Can be updated at build time

**Implementation**: Create `frontend/data/professionals.json` with professional directory data.

---

## Best Practices Research

### Next.js Static Export Best Practices

1. **Avoid dynamic routes that can't be pre-rendered**: Use `generateStaticParams` for dynamic routes
2. **No API routes**: All API functionality must be client-side or external
3. **Image optimization**: Use `next/image` with proper configuration for static export
4. **Environment variables**: Use `NEXT_PUBLIC_` prefix for client-side variables only

### Accessibility Best Practices for Maps

1. **Keyboard navigation**: Ensure map controls are keyboard accessible
2. **Screen reader support**: Provide text alternatives for map visualizations
3. **Focus management**: Manage focus when opening/closing modals
4. **ARIA landmarks**: Use proper ARIA regions for map and controls

### Client-Side Storage Best Practices

1. **Error handling**: Check for localStorage availability (private browsing mode)
2. **Data validation**: Validate data before storing/retrieving
3. **Storage limits**: Be aware of localStorage size limits (~5-10MB)
4. **Migration strategy**: Handle schema changes gracefully

---

## Dependencies Analysis

### Required Dependencies (already in package.json)
- `next`: 15.5.3 - Framework
- `react`: 19.1.0 - UI library
- `react-dom`: 19.1.0 - React DOM renderer
- `@react-google-maps/api`: ^2.20.7 - Map integration
- `typescript`: ^5 - Type safety
- `tailwindcss`: ^4 - Styling

### Potential Additional Dependencies
- **Accessibility testing**: `@axe-core/react` (optional, for development)
- **Focus management**: Consider `focus-trap-react` for modal focus management
- **Form validation**: May need form library if contact form is added

---

## Performance Considerations

1. **Code splitting**: Next.js automatically splits code by route
2. **Image optimization**: Use Next.js Image component
3. **Font loading**: Already using `next/font` for optimal font loading
4. **Map loading**: Lazy load map component to reduce initial bundle size
5. **Data loading**: Embed small JSON files, consider code splitting for large datasets

---

## Security Considerations

1. **API keys**: Store Google Maps API key in environment variables (`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`)
2. **AI API keys**: Store securely, never commit to repository
3. **XSS prevention**: React automatically escapes content, but validate user inputs
4. **CORS**: Ensure external APIs support CORS for client-side requests

---

## Testing Strategy

1. **Unit tests**: Jest + React Testing Library for components
2. **Integration tests**: Test user flows across pages
3. **Accessibility tests**: Automated (axe-core) + manual (screen readers)
4. **E2E tests**: Playwright for full user journeys
5. **Visual regression**: Consider Percy or Chromatic for UI consistency

---

## Deployment Considerations

1. **Static hosting**: Can deploy to Vercel, Netlify, GitHub Pages, or any static host
2. **Build process**: `npm run build` generates `out/` directory
3. **Environment variables**: Configure in hosting platform
4. **CDN**: Static assets automatically benefit from CDN caching

---

## Open Questions Resolved

✅ **Storage method for landmarks**: Embedded static data (JSON files)  
✅ **Storage method for user data**: Client-side localStorage  
✅ **Map library**: @react-google-maps/api (existing dependency)  
✅ **AI integration**: External API (client-side calls)  
✅ **Accessibility approach**: WCAG 2.1 Level AA with semantic HTML + ARIA  
✅ **Medical directory data**: Embedded static data (JSON files)  

**Status**: All technical decisions resolved. Ready for Phase 1 design.
