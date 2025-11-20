# API Contract: OSRM Routing Service

**External API**: Open Source Routing Machine  
**Version**: v1  
**Type**: REST API  
**Authentication**: None required  
**Cost**: Free (community-hosted)

---

## Base URLs

```typescript
const OSRM_ENDPOINTS = {
  foot: 'https://routing.openstreetmap.de/routed-foot',
  bike: 'https://routing.openstreetmap.de/routed-bike',
  car: 'https://routing.openstreetmap.de/routed-car',
};
```

**Note**: These are public community servers. For production at scale, consider self-hosting OSRM.

---

## Endpoint: Calculate Route

### Request

**Method**: `GET`

**URL Pattern**:
```
{base_url}/route/v1/driving/{coordinates}
```

**Path Parameters**:
- `coordinates`: Semicolon-separated list of `{longitude},{latitude}` pairs
  - Format: `{lng},{lat};{lng},{lat}`
  - Example: `-75.5133,5.0700;-75.5200,5.0750`

**Query Parameters**:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `overview` | string | No | `simplified` | Geometry detail level |
| `steps` | boolean | No | `false` | Include turn-by-turn instructions |
| `geometries` | string | No | `polyline` | Geometry format |
| `alternatives` | boolean/number | No | `false` | Number of alternative routes |
| `continue_straight` | boolean | No | `default` | Force continuing straight at waypoints |

**Recommended Parameters**:
```
?overview=full&steps=true&geometries=geojson
```

- `overview=full`: Returns complete route geometry (not simplified)
- `steps=true`: Includes turn-by-turn navigation instructions
- `geometries=geojson`: Returns GeoJSON LineString (easier to work with)

**Complete Example**:
```
GET https://routing.openstreetmap.de/routed-foot/route/v1/driving/-75.5133,5.0700;-75.5200,5.0750?overview=full&steps=true&geometries=geojson
```

---

### Response

#### Success Response (HTTP 200)

**Content-Type**: `application/json`

```json
{
  "code": "Ok",
  "routes": [
    {
      "distance": 1234.5,
      "duration": 456.7,
      "weight_name": "routability",
      "weight": 456.7,
      "geometry": {
        "coordinates": [
          [-75.5133, 5.0700],
          [-75.5135, 5.0702],
          [-75.5200, 5.0750]
        ],
        "type": "LineString"
      },
      "legs": [
        {
          "distance": 1234.5,
          "duration": 456.7,
          "weight": 456.7,
          "summary": "Main Street, Second Avenue",
          "steps": [
            {
              "distance": 234.5,
              "duration": 56.7,
              "geometry": {
                "coordinates": [
                  [-75.5133, 5.0700],
                  [-75.5135, 5.0702]
                ],
                "type": "LineString"
              },
              "name": "Main Street",
              "ref": "",
              "pronunciation": "",
              "destinations": "",
              "exits": "",
              "mode": "walking",
              "maneuver": {
                "type": "depart",
                "modifier": "",
                "location": [-75.5133, 5.0700],
                "bearing_before": 0,
                "bearing_after": 45
              },
              "driving_side": "right",
              "weight": 56.7
            },
            {
              "distance": 500.0,
              "duration": 120.0,
              "geometry": {
                "coordinates": [
                  [-75.5135, 5.0702],
                  [-75.5145, 5.0720]
                ],
                "type": "LineString"
              },
              "name": "Main Street",
              "ref": "",
              "pronunciation": "",
              "destinations": "",
              "exits": "",
              "mode": "walking",
              "maneuver": {
                "type": "turn",
                "modifier": "left",
                "location": [-75.5135, 5.0702],
                "bearing_before": 45,
                "bearing_after": 90
              },
              "driving_side": "right",
              "weight": 120.0
            },
            {
              "distance": 500.0,
              "duration": 280.0,
              "geometry": {
                "coordinates": [
                  [-75.5145, 5.0720],
                  [-75.5200, 5.0750]
                ],
                "type": "LineString"
              },
              "name": "Second Avenue",
              "ref": "",
              "pronunciation": "",
              "destinations": "",
              "exits": "",
              "mode": "walking",
              "maneuver": {
                "type": "arrive",
                "modifier": "",
                "location": [-75.5200, 5.0750],
                "bearing_before": 90,
                "bearing_after": 0
              },
              "driving_side": "right",
              "weight": 280.0
            }
          ]
        }
      ]
    }
  ],
  "waypoints": [
    {
      "hint": "...",
      "distance": 4.152629,
      "name": "Main Street",
      "location": [-75.5133, 5.0700]
    },
    {
      "hint": "...",
      "distance": 0.0,
      "name": "Second Avenue",
      "location": [-75.5200, 5.0750]
    }
  ]
}
```

#### Response Fields

**Top Level**:
- `code` (string): Status code (`"Ok"`, `"NoRoute"`, `"NoSegment"`, etc.)
- `routes` (array): Array of calculated routes
- `waypoints` (array): Snapped waypoints used for routing

**Route Object**:
- `distance` (number): Total distance in meters
- `duration` (number): Total duration in seconds
- `weight` (number): Internal routing weight
- `weight_name` (string): Routing profile name
- `geometry` (object): GeoJSON LineString of the route
  - `coordinates` (array): Array of [lng, lat] pairs
  - `type` (string): Always `"LineString"`
- `legs` (array): Array of route legs (1 per waypoint pair)

**Leg Object**:
- `distance` (number): Leg distance in meters
- `duration` (number): Leg duration in seconds
- `weight` (number): Internal weight
- `summary` (string): Comma-separated list of road names
- `steps` (array): Turn-by-turn instructions

**Step Object**:
- `distance` (number): Step distance in meters
- `duration` (number): Step duration in seconds
- `geometry` (object): GeoJSON LineString for this step
- `name` (string): Road/street name (empty if unnamed)
- `mode` (string): Travel mode (`"walking"`, `"cycling"`, `"driving"`)
- `maneuver` (object): Navigation instruction
  - `type` (string): Maneuver type (see below)
  - `modifier` (string): Direction modifier (see below)
  - `location` (array): [lng, lat] where maneuver occurs
  - `bearing_before` (number): Bearing before maneuver (0-360)
  - `bearing_after` (number): Bearing after maneuver (0-360)

**Waypoint Object**:
- `hint` (string): Internal hint for routing (ignore)
- `distance` (number): Distance from original point (snapping distance)
- `name` (string): Name of nearest road
- `location` (array): Snapped [lng, lat] coordinates

---

### Maneuver Types

| Type | Description | Example |
|------|-------------|---------|
| `depart` | Start of route | "Sal hacia el norte" |
| `arrive` | End of route | "Has llegado a tu destino" |
| `turn` | Turn at intersection | "Gira a la izquierda" |
| `new name` | Road name changes | "Continúa por Calle Nueva" |
| `continue` | Continue on same road | "Continúa" |
| `merge` | Merge onto road | "Incorpórate a la autopista" |
| `on ramp` | Enter highway | "Toma la rampa de acceso" |
| `off ramp` | Exit highway | "Toma la salida" |
| `fork` | Road splits | "Mantente a la derecha en el desvío" |
| `end of road` | Road ends | "Al final de la calle gira" |
| `roundabout` | Enter roundabout | "Entra en la rotonda" |
| `rotary` | Enter traffic circle | "Entra en la glorieta" |
| `roundabout turn` | Exit roundabout | "Toma la segunda salida" |
| `notification` | Info only (no action) | "" |
| `exit roundabout` | Leave roundabout | "" |
| `exit rotary` | Leave traffic circle | "" |

### Maneuver Modifiers

| Modifier | Description | Use With |
|----------|-------------|----------|
| `uturn` | U-turn | turn |
| `sharp right` | Sharp right turn (> 135°) | turn, off ramp |
| `right` | Right turn (45-135°) | turn, off ramp, roundabout turn |
| `slight right` | Slight right (< 45°) | turn, fork |
| `straight` | Continue straight | on ramp, roundabout turn |
| `slight left` | Slight left (< 45°) | turn, fork |
| `left` | Left turn (45-135°) | turn, off ramp, roundabout turn |
| `sharp left` | Sharp left turn (> 135°) | turn, off ramp |

---

### Error Responses

#### HTTP 200 with Error Code

```json
{
  "code": "NoRoute",
  "message": "No route found between points"
}
```

**Error Codes**:

| Code | Description | Retryable | Client Action |
|------|-------------|-----------|---------------|
| `Ok` | Success | N/A | Process route |
| `NoRoute` | No route exists | No | Show error, suggest different mode |
| `NoSegment` | Point too far from roads | No | Show error, adjust location |
| `InvalidUrl` | Malformed request | No | Fix request format |
| `InvalidOptions` | Invalid parameters | No | Fix parameters |
| `InvalidQuery` | Invalid coordinates | No | Validate coordinates |
| `InvalidValue` | Invalid parameter value | No | Fix parameter value |

#### HTTP Error Codes

| Status | Meaning | Client Action |
|--------|---------|---------------|
| 400 | Bad Request | Fix request format |
| 404 | Route not found | Show error to user |
| 429 | Too Many Requests | Implement backoff, retry later |
| 500 | Server Error | Retry with backoff |
| 503 | Service Unavailable | Retry with backoff |

---

## Rate Limiting

**Public Servers**:
- No official published limits
- Community guidelines: "Reasonable use"
- Recommended: < 5 requests per second
- Bulk usage: Consider self-hosting

**Best Practices**:
1. Implement client-side caching
2. Debounce rapid requests (500ms minimum)
3. Use AbortController to cancel outdated requests
4. Show loading states to prevent duplicate requests
5. Cache results for 24 hours

**Self-Hosting**: For high-volume production use, deploy your own OSRM instance:
- GitHub: https://github.com/Project-OSRM/osrm-backend
- Docker images available
- Full control over rate limits

---

## Response Processing

### Minimal Processing

```typescript
async function calculateRoute(origin, dest, mode): Promise<Route> {
  const url = `${OSRM_ENDPOINTS[mode]}/route/v1/driving/` +
              `${origin.lng},${origin.lat};${dest.lng},${dest.lat}` +
              `?overview=full&steps=true&geometries=geojson`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new NetworkError();
  }
  
  const data = await response.json();
  
  if (data.code !== 'Ok') {
    switch(data.code) {
      case 'NoRoute':
        throw new NoRouteError();
      case 'NoSegment':
        throw new InvalidLocationError();
      default:
        throw new RoutingError(data.message || 'Error desconocido');
    }
  }
  
  const osrmRoute = data.routes[0];
  
  return {
    distance: osrmRoute.distance,
    duration: osrmRoute.duration,
    geometry: osrmRoute.geometry.coordinates,
    steps: osrmRoute.legs[0].steps.map(step => ({
      distance: step.distance,
      duration: step.duration,
      instruction: generateInstruction(step.maneuver),
      name: step.name || 'Carretera sin nombre',
      maneuver: {
        type: step.maneuver.type,
        modifier: step.maneuver.modifier,
        location: step.maneuver.location,
      },
    })),
    summary: `${formatDistance(osrmRoute.distance)} - ${formatDuration(osrmRoute.duration)}`,
  };
}
```

---

## Testing

### Example Requests

**Walking Route (Manizales)**:
```bash
curl "https://routing.openstreetmap.de/routed-foot/route/v1/driving/-75.5133,5.0700;-75.5200,5.0750?overview=full&steps=true&geometries=geojson"
```

**Cycling Route**:
```bash
curl "https://routing.openstreetmap.de/routed-bike/route/v1/driving/-75.5133,5.0700;-75.5200,5.0750?overview=full&steps=true&geometries=geojson"
```

**Driving Route**:
```bash
curl "https://routing.openstreetmap.de/routed-car/route/v1/driving/-75.5133,5.0700;-75.5200,5.0750?overview=full&steps=true&geometries=geojson"
```

### Mock Response

For unit tests:

```typescript
export const mockOSRMResponse = {
  code: "Ok",
  routes: [{
    distance: 850,
    duration: 204,
    geometry: {
      coordinates: [
        [-75.5133, 5.0700],
        [-75.5140, 5.0710],
        [-75.5200, 5.0750]
      ],
      type: "LineString"
    },
    legs: [{
      distance: 850,
      duration: 204,
      steps: [
        {
          distance: 100,
          duration: 24,
          geometry: { coordinates: [[-75.5133, 5.0700], [-75.5135, 5.0702]], type: "LineString" },
          name: "Calle Principal",
          maneuver: { type: "depart", modifier: "", location: [-75.5133, 5.0700] },
          mode: "walking"
        },
        {
          distance: 750,
          duration: 180,
          geometry: { coordinates: [[-75.5135, 5.0702], [-75.5200, 5.0750]], type: "LineString" },
          name: "Avenida Segunda",
          maneuver: { type: "arrive", modifier: "", location: [-75.5200, 5.0750] },
          mode: "walking"
        }
      ]
    }]
  }],
  waypoints: [
    { location: [-75.5133, 5.0700], name: "Calle Principal" },
    { location: [-75.5200, 5.0750], name: "Avenida Segunda" }
  ]
};
```

---

## SLA & Reliability

**Availability**: Best effort (community servers)
- No uptime guarantee
- No SLA
- Consider self-hosting for production

**Performance**:
- Typical response time: 100-500ms
- Can spike during high traffic
- Timeout recommendation: 5 seconds

**Fallback Strategy**:
- Primary: OSRM (routing.openstreetmap.de)
- Fallback: GraphHopper public API
- Local: Cached routes

---

## References

- **Official Documentation**: http://project-osrm.org/docs/v5.24.0/api/
- **GitHub**: https://github.com/Project-OSRM/osrm-backend
- **Demo**: https://map.project-osrm.org/
- **Self-Hosting Guide**: https://github.com/Project-OSRM/osrm-backend/wiki

---

**Contract Version**: 1.0  
**Last Updated**: 2025-11-20  
**Status**: Stable

