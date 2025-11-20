# Google Maps API Contract

**Service**: Google Maps JavaScript API  
**Library**: @react-google-maps/api  
**Purpose**: Display interactive map with landmarks

## Overview

The application uses Google Maps JavaScript API via the `@react-google-maps/api` React wrapper to display an interactive map with embedded landmark reference points.

## API Key Configuration

**Environment Variable**: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`  
**Security**: API key stored in environment variable, never committed to repository  
**Restrictions**: Configure API key restrictions in Google Cloud Console (HTTP referrer restrictions recommended)

## Map Configuration

### Basic Map Setup

```typescript
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '100vh'
};

const defaultCenter = {
  lat: 40.7589,  // Default center (configurable)
  lng: -73.9851
};

const defaultZoom = 13;
```

### Map Options

```typescript
const mapOptions = {
  disableDefaultUI: false,           // Show default controls
  zoomControl: true,                  // Enable zoom controls
  mapTypeControl: true,               // Enable map type selector
  scaleControl: true,                 // Show scale
  streetViewControl: true,            // Enable Street View
  rotateControl: true,                // Enable rotation
  fullscreenControl: true,            // Enable fullscreen
  keyboardShortcuts: true,           // Enable keyboard navigation
  gestureHandling: 'auto',           // Touch gesture handling
  accessibilityOptions: {
    accessible: true                  // Enable accessibility features
  }
};
```

## Landmark Markers

### Marker Configuration

```typescript
interface MarkerConfig {
  position: {
    lat: number;
    lng: number;
  };
  title: string;                      // Accessible title for screen readers
  label?: string;                     // Optional text label
  icon?: string | google.maps.Icon;  // Custom icon (optional)
  clickable: boolean;                 // Enable click interaction
  zIndex?: number;                    // Z-index for stacking
}
```

### Marker Accessibility

- **ARIA Labels**: Each marker must have accessible title
- **Keyboard Navigation**: Markers must be keyboard accessible
- **Focus Management**: Focus moves to marker when activated
- **Screen Reader**: Announce marker information when focused

## Map Events

### Required Events

```typescript
interface MapEventHandlers {
  onLoad?: (map: google.maps.Map) => void;           // Map loaded
  onUnmount?: (map: google.maps.Map) => void;        // Map unmounted
  onBoundsChanged?: () => void;                      // Map bounds changed
  onCenterChanged?: () => void;                      // Center changed
  onZoomChanged?: () => void;                        // Zoom changed
}
```

### Marker Events

```typescript
interface MarkerEventHandlers {
  onClick?: (marker: google.maps.Marker) => void;     // Marker clicked
  onMouseOver?: (marker: google.maps.Marker) => void; // Hover
  onFocus?: (marker: google.maps.Marker) => void;    // Keyboard focus
}
```

## Accessibility Requirements

### Keyboard Navigation

1. **Map Controls**: All map controls must be keyboard accessible
2. **Markers**: Markers must be focusable via Tab key
3. **Focus Indicators**: Visible focus indicators on all interactive elements
4. **Keyboard Shortcuts**: Support standard map keyboard shortcuts

### Screen Reader Support

1. **ARIA Labels**: Proper ARIA labels on map and controls
2. **Live Regions**: Announce map state changes (zoom, center)
3. **Landmark Roles**: Use ARIA landmark roles appropriately
4. **Descriptive Text**: Provide text alternatives for map visualizations

### Implementation

```typescript
<GoogleMap
  mapContainerStyle={mapContainerStyle}
  center={center}
  zoom={zoom}
  options={mapOptions}
  onLoad={handleMapLoad}
  aria-label="Interactive map showing landmarks"
  role="application"
>
  {landmarks.map(landmark => (
    <Marker
      key={landmark.id}
      position={landmark.coordinates}
      title={landmark.name}
      onClick={() => handleMarkerClick(landmark)}
      aria-label={`${landmark.name} marker`}
    />
  ))}
</GoogleMap>
```

## Error Handling

### API Key Errors

- **Invalid Key**: Display error message, disable map
- **Quota Exceeded**: Display user-friendly message
- **Network Error**: Show fallback message, retry option

### Map Loading Errors

```typescript
function handleMapError(error: Error) {
  if (error.message.includes('API key')) {
    console.error('Google Maps API key error');
    // Display error message to user
  } else if (error.message.includes('network')) {
    console.error('Network error loading map');
    // Display network error message
  }
}
```

## Performance Considerations

1. **Lazy Loading**: Load map component only when needed
2. **Marker Clustering**: Consider clustering for many markers (future enhancement)
3. **Image Optimization**: Optimize custom marker icons
4. **Debouncing**: Debounce map event handlers (zoom, pan)

## Implementation Location

**Component**: `frontend/app/components/map/InteractiveMap.tsx`  
**Hooks**: `frontend/hooks/useLandmarks.ts`  
**Types**: `frontend/types/landmark.ts`

## Testing

- Test map loading with valid API key
- Test error handling with invalid API key
- Test marker interactions (click, keyboard)
- Test accessibility (keyboard navigation, screen readers)
- Test responsive behavior

