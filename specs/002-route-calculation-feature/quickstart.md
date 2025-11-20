# Quick Start: Route Calculation Feature

**For Developers** | **Last Updated**: 2025-11-20

---

## Prerequisites

✅ Node.js 18+ installed  
✅ npm or compatible package manager  
✅ Git repository cloned  
✅ Existing project dependencies installed (`npm install`)

---

## Overview

This feature adds client-side route calculation to the existing Leaflet map implementation. Users can click on landmarks to see optimal routes from their current location.

**Key Facts**:
- 🎯 No new dependencies required
- 🚀 5 new files, ~1000 lines of code
- ⏱️ Est. implementation time: 3-4 days
- 📱 Works on desktop and mobile
- 🌐 Fully client-side (no SSR)

---

## Getting Started

### Step 1: Checkout Branch

```bash
# Ensure you're on master and up to date
git checkout master
git pull origin master

# Checkout the feature branch
git checkout feature/002-route-calculation
```

### Step 2: Understand the Architecture

```
User clicks landmark
      ↓
useRouting hook → OSRM Service → OSRM API
      ↓                              ↓
Route object ←──────────────────────┘
      ↓
InteractiveMap renders route
      ↓
RoutePanel shows details
```

**Key Files**:
- `frontend/lib/routing/osrm.ts` - API integration
- `frontend/hooks/useRouting.ts` - React hook
- `frontend/app/components/map/RoutePanel.tsx` - UI component
- `frontend/app/components/map/InteractiveMap.tsx` - Integration point
- `frontend/types/routing.ts` - TypeScript types

---

## Implementation Order

Follow this order to minimize merge conflicts and enable incremental testing:

### Phase 1: Core (Day 1) ⭐

#### 1.1 Create Type Definitions

**File**: `frontend/types/routing.ts`

```bash
# Create the file
touch frontend/types/routing.ts
```

**Content**: Copy all types from [data-model.md](./data-model.md)

**Test**: Run TypeScript compilation
```bash
npm run lint
```

---

#### 1.2 Create OSRM Service

**File**: `frontend/lib/routing/osrm.ts`

```bash
# Create directory and file
mkdir -p frontend/lib/routing
touch frontend/lib/routing/osrm.ts
```

**Implementation**: See [spec.md](./spec.md#1-servicio-de-enrutamiento)

**Test**: Create unit test
```bash
# Create test file
mkdir -p frontend/__tests__/lib/routing
touch frontend/__tests__/lib/routing/osrm.test.ts
```

**Sample Test**:
```typescript
import { calculateRoute, formatDistance, formatDuration } from '@/lib/routing/osrm';

describe('OSRM Service', () => {
  it('formats distance correctly', () => {
    expect(formatDistance(500)).toBe('500 m');
    expect(formatDistance(1500)).toBe('1.5 km');
  });
  
  it('formats duration correctly', () => {
    expect(formatDuration(120)).toBe('2 min');
    expect(formatDuration(3720)).toBe('1 h 2 min');
  });
});
```

**Run test**:
```bash
npm test osrm.test.ts
```

---

#### 1.3 Create Routing Hook

**File**: `frontend/hooks/useRouting.ts`

```bash
touch frontend/hooks/useRouting.ts
```

**Implementation**: See [spec.md](./spec.md#2-hook-de-enrutamiento)

**Test**:
```bash
touch frontend/__tests__/hooks/useRouting.test.ts
```

**Quick Manual Test**:
```typescript
// In a test component
import { useRouting } from '@/hooks/useRouting';

function TestComponent() {
  const { calculateOptimalRoute, currentRoute, loading } = useRouting();
  
  const testRoute = async () => {
    const route = await calculateOptimalRoute(
      { lat: 5.0700, lng: -75.5133 },  // Manizales
      { lat: 5.0750, lng: -75.5200 },
      'foot'
    );
    console.log('Route:', route);
  };
  
  return (
    <div>
      <button onClick={testRoute}>Test Route</button>
      {loading && <p>Loading...</p>}
      {currentRoute && <p>Distance: {currentRoute.distance}m</p>}
    </div>
  );
}
```

---

### Phase 2: UI (Day 2) 🎨

#### 2.1 Create RoutePanel Component

**File**: `frontend/app/components/map/RoutePanel.tsx`

```bash
touch frontend/app/components/map/RoutePanel.tsx
```

**Implementation**: See [tasks.md](./tasks.md#tarea-21-crear-componente-routepanel)

**Visual Test**: 
1. Start dev server: `npm run dev`
2. Navigate to map page
3. Import and render RoutePanel with mock data:

```typescript
<RoutePanel
  route={{
    distance: 5234,
    duration: 720,
    geometry: [],
    steps: [],
    summary: "5.2 km - 12 min"
  }}
  loading={false}
  error={null}
  currentMode="foot"
  onModeChange={(mode) => console.log(mode)}
  onClose={() => console.log('close')}
  onOpenInMaps={() => console.log('open maps')}
/>
```

---

#### 2.2 Integrate with InteractiveMap

**File**: `frontend/app/components/map/InteractiveMap.tsx` (modify existing)

**Changes**:
1. Import useRouting hook
2. Add route calculation on marker click
3. Add route rendering with Leaflet
4. Render RoutePanel component

**See**: [tasks.md](./tasks.md#tarea-24-integrar-routepanel-en-interactivemap)

---

### Phase 3: Polish (Day 3) ✨

#### 3.1 Add Native Maps Integration

**In InteractiveMap.tsx**, add handler:

```typescript
const handleOpenInMaps = () => {
  if (!currentRoute || !userPosition || !selectedLandmark) return;
  
  const platform = detectPlatform();
  // ... see research.md for full implementation
};
```

**Test on mobile devices**: iOS simulator and Android emulator

---

#### 3.2 Error Handling

Add user-friendly error messages in RoutePanel:

```typescript
{error && (
  <div className="p-4 bg-red-50 border-red-200">
    <p className="text-red-800">{error.message}</p>
    {error.retryable && (
      <button onClick={retry}>Reintentar</button>
    )}
  </div>
)}
```

---

#### 3.3 Loading States

Ensure smooth UX with proper loading indicators:

```typescript
{loading && (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
    <p className="ml-4">Calculando ruta...</p>
  </div>
)}
```

---

## Testing Checklist

### Unit Tests
- [ ] OSRM service functions (formatDistance, formatDuration, generateInstruction)
- [ ] useRouting hook state management
- [ ] Error class instantiation
- [ ] Coordinate conversion helpers

### Integration Tests
- [ ] Route calculation flow (click → API → display)
- [ ] Mode switching recalculates route
- [ ] Error states display correctly
- [ ] Cache works (second request is instant)

### Manual Testing
- [ ] Click landmark with location enabled → route shows
- [ ] Click landmark without location → proper error
- [ ] Switch transport modes → route updates
- [ ] View turn-by-turn instructions
- [ ] Open in native maps (test iOS and Android)
- [ ] Works on slow network (3G throttling)
- [ ] Works offline with cached routes
- [ ] Keyboard navigation works
- [ ] Screen reader announces route

---

## Development Tips

### 1. Use Browser DevTools

**Network Tab**:
- Monitor OSRM API calls
- Check response times
- Verify caching works

**Console**:
- Log route objects to inspect data
- Check for errors
- Monitor performance

**React DevTools**:
- Inspect useRouting hook state
- Verify component re-renders
- Check prop drilling

---

### 2. Test with Real Coordinates

**Manizales, Colombia** (project location):
```typescript
const origin = { lat: 5.0700, lng: -75.5133 };  // Centro
const dest = { lat: 5.0669, lng: -75.5174 };    // Nearby landmark
```

**Edge Cases**:
```typescript
// Very short distance (< 100m)
const nearby = { lat: 5.0701, lng: -75.5134 };

// Longer distance (~5km)
const farther = { lat: 5.0500, lng: -75.5300 };

// No route (across river without bridge)
const noRoute = { lat: 5.1000, lng: -75.4000 };
```

---

### 3. Debug OSRM Responses

If route calculation fails, test the API directly:

```bash
# Test in browser or curl
curl "https://routing.openstreetmap.de/routed-foot/route/v1/driving/-75.5133,5.0700;-75.5174,5.0669?overview=full&steps=true&geometries=geojson"
```

**Common Issues**:
- Coordinates in wrong order (lng, lat not lat, lng)
- Invalid coordinates (out of bounds)
- No road network at location
- API temporarily unavailable

---

### 4. Performance Monitoring

Add timing logs:

```typescript
const start = performance.now();
const route = await calculateRoute(...);
const end = performance.now();
console.log(`Route calculated in ${end - start}ms`);
```

**Targets**:
- API call: < 1000ms
- Route rendering: < 500ms
- UI update: < 100ms

---

## Troubleshooting

### Issue: "No route found"

**Possible Causes**:
1. Points too far from roads
2. No road connection exists
3. Invalid coordinates

**Solutions**:
- Check coordinates are valid
- Try different transport mode
- Verify points are near roads on OpenStreetMap

---

### Issue: TypeScript errors

**Common**:
```
Cannot find module '@/types/routing'
```

**Solution**:
```bash
# Restart TypeScript server in VS Code
Cmd+Shift+P → "TypeScript: Restart TS Server"

# Or rebuild
npm run build
```

---

### Issue: Route not showing on map

**Checklist**:
1. Check browser console for errors
2. Verify route object has geometry
3. Ensure Leaflet polyline is added to map
4. Check z-index (should be 400)
5. Verify coordinates converted to [lat, lng]

**Debug**:
```typescript
console.log('Route geometry:', currentRoute?.geometry);
console.log('Polyline added:', routeLayerRef.current);
```

---

### Issue: Slow performance

**Causes**:
- Too many route coordinates
- Frequent re-renders
- No request cancellation

**Solutions**:
- Use `useRef` for polyline instance
- Implement debouncing (500ms)
- Use AbortController for cancellation
- Enable caching

---

## Code Review Checklist

Before submitting PR, verify:

- [ ] All TypeScript types are defined
- [ ] No `any` types used
- [ ] Error handling is comprehensive
- [ ] Loading states are shown
- [ ] Accessibility attributes present (aria-*)
- [ ] Comments explain complex logic
- [ ] No console.log in production code
- [ ] Tests pass (`npm test`)
- [ ] Linting passes (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] Feature works in Firefox, Chrome, Safari
- [ ] Feature works on mobile (iOS and Android)
- [ ] No new dependencies added (unless justified)

---

## Useful Commands

```bash
# Development
npm run dev              # Start dev server (http://localhost:3000)

# Type checking
npm run lint             # Run linter + TypeScript

# Testing
npm test                 # Run all tests
npm test osrm            # Run specific test file
npm test -- --coverage   # With coverage report

# Building
npm run build            # Build for production
npm run start            # Serve production build

# Git
git status               # Check current state
git add .                # Stage all changes
git commit -m "feat: add route calculation"  # Commit
git push origin feature/002-route-calculation  # Push to remote
```

---

## Next Steps

1. ✅ Complete Phase 1 (Core)
2. ✅ Complete Phase 2 (UI)
3. ✅ Complete Phase 3 (Polish)
4. ⬜ Run full test suite
5. ⬜ Manual testing on all browsers/devices
6. ⬜ Create Pull Request
7. ⬜ Code review
8. ⬜ Merge to master

---

## Resources

- **Specification**: [spec.md](./spec.md)
- **Tasks**: [tasks.md](./tasks.md)
- **Data Model**: [data-model.md](./data-model.md)
- **API Contract**: [contracts/osrm-api.md](./contracts/osrm-api.md)
- **Research**: [research.md](./research.md)

**External**:
- [OSRM API Docs](http://project-osrm.org/docs/v5.24.0/api/)
- [Leaflet Docs](https://leafletjs.com/reference.html)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

---

## Questions?

If you run into issues:

1. Check this quickstart guide
2. Review the research.md for technical decisions
3. Look at tasks.md for detailed implementation steps
4. Test API directly with curl/browser
5. Check browser console for errors

**Happy Coding!** 🚀

---

**Last Updated**: 2025-11-20  
**Status**: Ready for implementation

