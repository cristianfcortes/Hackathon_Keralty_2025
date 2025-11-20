# AI Chat API Contract

**Service**: External AI Chat API  
**Type**: Client-side HTTP API  
**Purpose**: Provide AI responses to user questions about landmarks

## Overview

The application integrates with an external AI service API to provide conversational responses about landmarks. All API calls are made client-side from the browser.

## Base URL

**Environment Variable**: `NEXT_PUBLIC_AI_API_URL`  
**Example**: `https://api.example.com/v1/chat`

## Authentication

**Method**: API Key in request header  
**Header**: `Authorization: Bearer {API_KEY}`  
**Environment Variable**: `NEXT_PUBLIC_AI_API_KEY`  
**Security**: API key stored in environment variable, never committed to repository

## Endpoints

### POST /chat

Send a user message and receive AI response.

**Request**:
```typescript
interface ChatRequest {
  message: string;              // User's question/message
  context?: {                   // Optional context
    landmarks?: string[];        // Array of landmark IDs mentioned
    conversationHistory?: Array<{
      role: 'user' | 'assistant';
      content: string;
    }>;                         // Previous messages for context
  };
}
```

**Response** (Success - 200):
```typescript
interface ChatResponse {
  message: string;              // AI response text
  timestamp: number;            // Response timestamp
  landmarks?: string[];         // Optional landmark IDs referenced in response
}
```

**Response** (Error - 4xx/5xx):
```typescript
interface ChatError {
  error: {
    code: string;               // Error code (e.g., "RATE_LIMIT", "INVALID_REQUEST")
    message: string;            // Human-readable error message
  };
}
```

## Error Handling

### Client-Side Error Handling

1. **Network Errors**: 
   - Display user-friendly message: "Unable to connect to chat service. Please check your internet connection."
   - Retry logic: Up to 3 retries with exponential backoff

2. **API Errors**:
   - 400 Bad Request: Display error message from API
   - 401 Unauthorized: Log error, display: "Authentication error. Please refresh the page."
   - 429 Rate Limit: Display: "Too many requests. Please wait a moment and try again."
   - 500 Server Error: Display: "Service temporarily unavailable. Please try again later."

3. **Timeout**:
   - Request timeout: 10 seconds
   - Display: "Request timed out. Please try again."

## Rate Limiting

- **Client-side**: Implement request throttling (max 1 request per 2 seconds)
- **Server-side**: Respect API rate limits (if specified)
- **User feedback**: Show loading indicator during API calls

## Implementation Notes

- All API calls must be client-side only (no server-side proxy)
- Use `fetch` API or axios for HTTP requests
- Handle CORS requirements
- Implement request cancellation for component unmount
- Cache recent responses (optional, in-memory only)

## Example Usage

```typescript
async function sendChatMessage(message: string, context?: ChatContext): Promise<string> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_AI_API_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_AI_API_KEY}`
    },
    body: JSON.stringify({ message, context })
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data: ChatResponse = await response.json();
  return data.message;
}
```

## Testing

- Mock API responses for development
- Test error handling scenarios
- Test timeout handling
- Test with invalid API keys
- Test rate limiting behavior

