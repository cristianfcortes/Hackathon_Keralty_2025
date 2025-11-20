# Research: Route Calculation Feature

**Phase**: 0 - Research & Discovery  
**Date**: 2025-11-20  
**Status**: Complete

---

## Executive Summary

This document consolidates research findings for implementing client-side route calculation using OSRM API, Leaflet visualization, and integration with native mapping applications. All technical unknowns from the planning phase have been resolved, and best practices have been identified.

---

## 1. OSRM API Investigation

### Decision: Use OSRM Public API
**Status**: ✅ Resolved

### Rationale

OSRM (Open Source Routing Machine) was selected as the routing provider because:
- **Free and Open Source**: No API keys or payment required
- **High Quality**: Uses OSM data with sophisticated algorithms
- **Multiple Modes**: Supports foot, bike, and car routing
- **Active Development**: Well-maintained project
- **Public Instances**: Community-hosted endpoints available

### API Endpoints

```typescript
const OSRM_ENDPOINTS = {
  foot: 'https://routing.openstreetmap.de/routed-foot',
  bike: 'https://routing.openstreetmap.de/routed-bike',
  car: 'https://routing.openstreetmap.de/routed-car',
};
```

### Request Format

```
GET {endpoint}/route/v1/driving/{lon},{lat};{lon},{lat}
  ?overview=full
  &steps=true
  &geometries=geojson
```

**Parameters**:
- `overview=full`: Returns complete route geometry
- `steps=true`: Includes turn-by-turn instructions
- `geometries=geojson`: GeoJSON LineString format (easier to work with)

### Response Structure

```json
{
  "code": "Ok",
  "routes": [{
    "distance": 1234.5,      // meters
    "duration": 456.7,       // seconds
    "geometry": {
      "coordinates": [[lng, lat], ...],
      "type": "LineString"
    },
    "legs": [{
      "steps": [{
        "distance": 100,
        "duration": 12,
        "name": "Main Street",
        "maneuver": {
          "type": "turn",
          "modifier": "left",
          "location": [lng, lat]
        }
      }]
    }]
  }],
  "waypoints": [...]
}
```

### Rate Limiting

**Public API Limits**:
- No official hard limit
- Community guidelines: "Reasonable use"
- Recommended: < 5 requests/second
- Best practice: Implement client-side caching

**Mitigation Strategy**:
- Cache routes by origin+destination+mode
- Debounce mode changes (500ms)
- Use AbortController for request cancellation
- Implement exponential backoff on errors

### Error Handling

**OSRM Error Codes**:
- `Ok`: Success
- `NoRoute`: No route found between points
- `NoSegment`: Point too far from any road
- `InvalidUrl`: Malformed request
- `InvalidOptions`: Invalid parameters

**Implementation**:
```typescript
if (data.code !== 'Ok') {
  switch(data.code) {
    case 'NoRoute':
      throw new NoRouteError('No se encontró una ruta disponible');
    case 'NoSegment':
      throw new InvalidLocationError('Ubicación demasiado lejos de calles');
    default:
      throw new RoutingError(data.message || 'Error desconocido');
  }
}
```

### Alternatives Considered

| Service | Pros | Cons | Decision |
|---------|------|------|----------|
| **Mapbox Directions** | Professional, reliable, good docs | Requires API key, $$ after free tier | ❌ Rejected - cost |
| **Google Maps Directions** | Best quality, worldwide coverage | Expensive, complex billing | ❌ Rejected - cost |
| **GraphHopper** | Open source, free tier | Less coverage than OSRM | ⚠️ Backup option |
| **OSRM** | Free, good quality, no keys | Public instance rate limits | ✅ **Selected** |

---

## 2. Leaflet Routing Integration

### Decision: Manual Polyline Rendering
**Status**: ✅ Resolved

### Rationale

Rather than using Leaflet Routing Machine plugin, we'll render routes manually using `L.polyline()` because:
- **More Control**: Fine-grained control over styling and behavior
- **Lighter**: No additional plugin bundle (~30KB saved)
- **Simpler**: Direct integration with our routing hook
- **Flexible**: Easy to customize animations and interactions

### Best Practices

#### 1. Drawing Routes

```typescript
// Convert OSRM coordinates [lng, lat] to Leaflet [lat, lng]
const routeCoordinates: [number, number][] = 
  route.geometry.map(([lng, lat]) => [lat, lng]);

// Create polyline with styling
const routeLine = L.polyline(routeCoordinates, {
  color: '#3B82F6',        // Blue
  weight: 5,               // 5px width
  opacity: 0.8,            // Slightly transparent
  lineJoin: 'round',       // Smooth corners
  lineCap: 'round',        // Smooth endpoints
  className: 'route-line'  // CSS class for animations
});

routeLine.addTo(map);
```

#### 2. Z-Index Management

**Layer Ordering** (bottom to top):
1. Base map tiles (z-index: 0)
2. Location circle (z-index: 0)
3. Route polyline (z-index: 400 - Leaflet default)
4. Landmark markers (z-index: 600)
5. User location marker (z-index: 1000)
6. UI overlays (z-index: 1000+)

**Implementation**:
```typescript
userMarker.setZIndexOffset(1000);  // Above everything
```

#### 3. Performance with Large Geometries

**Problem**: Routes with 1000+ coordinates can cause lag

**Solutions**:
- ✅ Use `simplify: true` in OSRM request (reduces coordinates)
- ✅ Use Leaflet's built-in rendering optimization
- ✅ Avoid frequent re-renders (useRef for polyline)
- ✅ Use `requestAnimationFrame` for smooth updates

```typescript
// Good: Reuse polyline instance
if (routeLayerRef.current) {
  routeLayerRef.current.setLatLngs(newCoordinates);
} else {
  routeLayerRef.current = L.polyline(coordinates).addTo(map);
}
```

#### 4. Animation Options

**Recommended**: Fade-in + Auto-pan

```typescript
// 1. Add route with CSS animation
routeLine.addTo(map);
routeLine.getElement()?.classList.add('route-fade-in');

// 2. Fit map bounds to show entire route
const bounds = routeLine.getBounds();
map.fitBounds(bounds, {
  padding: [50, 50],
  duration: 1.0,  // Smooth animation
});
```

**CSS**:
```css
.route-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 0.8; }
}
```

### Route Cleanup

**Important**: Always remove old routes before adding new ones

```typescript
useEffect(() => {
  // Cleanup function
  return () => {
    if (routeLayerRef.current) {
      routeLayerRef.current.remove();
      routeLayerRef.current = null;
    }
  };
}, [currentRoute]);
```

---

## 3. Client-Side API Patterns

### Decision: Fetch API with Custom Error Handling
**Status**: ✅ Resolved

### Rationale

Using native `fetch()` API instead of libraries (axios, ky) because:
- **Already Available**: No additional dependencies
- **Modern**: Supports AbortController natively
- **Simple**: Our needs don't require advanced features
- **Type-Safe**: Easy to type with TypeScript

### Error Handling Pattern

```typescript
export class RoutingError extends Error {
  constructor(
    message: string,
    public code: string,
    public retryable: boolean = false
  ) {
    super(message);
    this.name = 'RoutingError';
  }
}

export class NetworkError extends RoutingError {
  constructor() {
    super('Sin conexión a internet', 'NETWORK_ERROR', true);
  }
}

export class NoRouteError extends RoutingError {
  constructor(message: string) {
    super(message, 'NO_ROUTE', false);
  }
}

// Usage in service
try {
  const response = await fetch(url, { signal: abortController.signal });
  if (!response.ok) throw new NetworkError();
  // ... process response
} catch (error) {
  if (error.name === 'AbortError') {
    // Request was cancelled - ignore
    return;
  }
  if (error instanceof NetworkError) {
    // Show retry button
  }
  throw error;
}
```

### Retry Strategy

**Exponential Backoff**:
```typescript
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = 3
): Promise<Response> {
  let lastError: Error;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fetch(url, options);
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry on cancellation
      if (error.name === 'AbortError') throw error;
      
      // Wait before retry: 1s, 2s, 4s
      if (i < maxRetries - 1) {
        await delay(Math.pow(2, i) * 1000);
      }
    }
  }
  
  throw lastError!;
}
```

### Caching Strategy

**localStorage Implementation**:
```typescript
interface CachedRoute {
  route: Route;
  timestamp: number;
  origin: string;
  destination: string;
  mode: TransportMode;
}

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

function getCacheKey(origin, dest, mode): string {
  return `route:${origin.lat},${origin.lng}:${dest.lat},${dest.lng}:${mode}`;
}

function getCachedRoute(key: string): Route | null {
  const cached = localStorage.getItem(key);
  if (!cached) return null;
  
  const data: CachedRoute = JSON.parse(cached);
  
  // Check expiration
  if (Date.now() - data.timestamp > CACHE_DURATION) {
    localStorage.removeItem(key);
    return null;
  }
  
  return data.route;
}

function setCachedRoute(key: string, route: Route, origin, dest, mode): void {
  const data: CachedRoute = {
    route,
    timestamp: Date.now(),
    origin: `${origin.lat},${origin.lng}`,
    destination: `${dest.lat},${dest.lng}`,
    mode,
  };
  
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    // Quota exceeded - clear old caches
    clearOldCaches();
  }
}
```

### Request Cancellation

**AbortController Pattern**:
```typescript
const useRouting = () => {
  const abortControllerRef = useRef<AbortController>();
  
  const calculateRoute = async (...) => {
    // Cancel previous request
    abortControllerRef.current?.abort();
    
    // Create new controller
    abortControllerRef.current = new AbortController();
    
    try {
      const response = await fetch(url, {
        signal: abortControllerRef.current.signal,
      });
      // ... process
    } catch (error) {
      if (error.name === 'AbortError') {
        // Silently ignore cancellation
        return;
      }
      throw error;
    }
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);
};
```

---

## 4. Mobile Integration

### Decision: URL Scheme Detection
**Status**: ✅ Resolved

### Rationale

Different platforms use different URL schemes for opening maps:
- iOS: Apple Maps (`maps://`)
- Android: Google Maps (`google.navigation:`)
- Desktop: Web fallback (Google Maps web)

### Platform Detection

```typescript
function detectPlatform(): 'ios' | 'android' | 'web' {
  const ua = navigator.userAgent;
  
  if (/iPad|iPhone|iPod/.test(ua)) {
    return 'ios';
  }
  
  if (/Android/.test(ua)) {
    return 'android';
  }
  
  return 'web';
}
```

### URL Schemes

#### iOS (Apple Maps)
```typescript
const appleMapsUrl = `maps://maps.apple.com/?` +
  `saddr=${originLat},${originLng}&` +
  `daddr=${destLat},${destLng}&` +
  `dirflg=d`; // d=driving, w=walking, r=transit

// dirflg options:
// d = driving
// w = walking
// r = public transit
```

#### Android (Google Maps)
```typescript
const googleMapsUrl = 
  `google.navigation:q=${destLat},${destLng}&mode=w`;

// mode options:
// d = driving
// w = walking
// b = bicycling
// t = transit
```

#### Web Fallback
```typescript
const webUrl = 
  `https://www.google.com/maps/dir/?api=1&` +
  `origin=${originLat},${originLng}&` +
  `destination=${destLat},${destLng}&` +
  `travelmode=walking`;

// travelmode options: driving, walking, bicycling, transit
```

### Implementation

```typescript
function openInMaps(
  origin: {lat: number, lng: number},
  destination: {lat: number, lng: number},
  mode: TransportMode
): void {
  const platform = detectPlatform();
  
  // Map our mode to platform-specific values
  const modeMap = {
    foot: { ios: 'w', android: 'w', web: 'walking' },
    bike: { ios: 'b', android: 'b', web: 'bicycling' },
    car: { ios: 'd', android: 'd', web: 'driving' },
  };
  
  const platformMode = modeMap[mode][platform];
  
  let url: string;
  
  switch (platform) {
    case 'ios':
      url = `maps://maps.apple.com/?` +
            `saddr=${origin.lat},${origin.lng}&` +
            `daddr=${destination.lat},${destination.lng}&` +
            `dirflg=${platformMode}`;
      break;
      
    case 'android':
      url = `google.navigation:q=${destination.lat},${destination.lng}&` +
            `mode=${platformMode}`;
      break;
      
    case 'web':
      url = `https://www.google.com/maps/dir/?api=1&` +
            `origin=${origin.lat},${origin.lng}&` +
            `destination=${destination.lat},${destination.lng}&` +
            `travelmode=${platformMode}`;
      break;
  }
  
  // Open in new tab/window
  window.open(url, '_blank');
}
```

### Fallback Strategy

If URL scheme fails (app not installed):
1. Detect if window.open() succeeded
2. If not, fall back to web URL after timeout
3. Show user message about installing app

```typescript
const opened = window.open(nativeUrl, '_blank');

// Check if it opened (not reliable on all browsers)
setTimeout(() => {
  if (document.hasFocus()) {
    // Native app didn't open, use web fallback
    window.open(webFallbackUrl, '_blank');
  }
}, 1000);
```

---

## 5. Additional Best Practices

### TypeScript Strict Mode

**Recommendation**: Enable strict null checks for routing types

```typescript
// Good: Explicit null handling
interface RoutingState {
  currentRoute: Route | null;  // Explicit null
  error: Error | null;
}

// Bad: Implicit undefined
interface RoutingState {
  currentRoute?: Route;  // Could be undefined OR null
}
```

### Performance Monitoring

**Recommendation**: Track key metrics

```typescript
const startTime = performance.now();
const route = await calculateRoute(...);
const endTime = performance.now();

// Log for analytics
console.log(`Route calculated in ${endTime - startTime}ms`);

// Track in analytics (if available)
analytics?.track('route_calculated', {
  duration_ms: endTime - startTime,
  distance_km: route.distance / 1000,
  mode: currentMode,
});
```

### Accessibility

**Recommendations**:
- Use `aria-live="polite"` for route calculation status
- Announce "Ruta calculada" when complete
- Provide keyboard shortcuts for transport mode
- Ensure all buttons have descriptive `aria-label`

```typescript
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {loading && "Calculando ruta..."}
  {currentRoute && "Ruta calculada exitosamente"}
  {error && `Error: ${error.message}`}
</div>
```

---

## 6. Decisions Summary

| Decision Point | Choice | Rationale |
|----------------|--------|-----------|
| **Routing Provider** | OSRM Public API | Free, no keys, good quality |
| **Visualization** | Manual L.polyline() | More control, lighter weight |
| **HTTP Client** | Native fetch() | Already available, type-safe |
| **Error Handling** | Custom Error classes | Clear error types, retryable flag |
| **Caching** | localStorage | Simple, works offline |
| **Request Cancellation** | AbortController | Native, well-supported |
| **Mobile Integration** | URL schemes | Standard approach, good UX |
| **Performance** | Debouncing + caching | Reduces API calls |

---

## 7. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| OSRM API downtime | Low | High | Implement fallback to GraphHopper |
| Rate limiting | Medium | Medium | Aggressive caching, debouncing |
| Slow route calculation | Medium | Low | Show loading state, timeout after 10s |
| Browser compatibility | Low | Medium | Polyfills for older browsers |
| localStorage quota | Low | Low | Clear old caches, handle quota errors |

---

## 8. Next Steps

✅ **Phase 0 Complete** - All research questions resolved

**Ready for Phase 1**:
1. Create data-model.md with TypeScript interfaces
2. Document OSRM API contract
3. Create quickstart.md for developers
4. Update agent context with findings

---

**Research Completed**: 2025-11-20  
**Reviewed By**: Development Team  
**Status**: Ready for Phase 1 Design

