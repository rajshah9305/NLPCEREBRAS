# API Documentation

## Overview

The RAJ AI APP BUILDER API provides endpoints for generating React components using AI. The API is built with Next.js 14 and uses the Cerebras AI model for code generation.

## Base URL

```
https://your-domain.com/api
```

## Authentication

All API requests require a valid Cerebras API key to be configured in the environment variables.

## Endpoints

### POST /api/generate

Generates React components based on natural language descriptions.

#### Request

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "prompt": "Create a beautiful todo list with animations and gradient design"
}
```

**Parameters:**
- `prompt` (string, required): Natural language description of the React component to generate
  - Minimum length: 10 characters
  - Maximum length: 2000 characters
  - Must contain only valid characters (alphanumeric, spaces, and common punctuation)

#### Response

**Success (200):**
```
Content-Type: text/event-stream
Cache-Control: no-cache, no-transform
Connection: keep-alive
X-Accel-Buffering: no
```

**Stream Format:**
```
data: {"stage":"code","content":"function App() {"}

data: {"stage":"code","content":"  return <div>Hello World</div>;"}

data: {"stage":"code","content":"}"}

data: {"stage":"done","timestamp":"2024-01-01T00:00:00.000Z"}
```

**Error (400):**
```json
{
  "error": "Prompt is required"
}
```

**Error (500):**
```json
{
  "error": "API key not configured. Please add CEREBRAS_API_KEY to your environment variables.",
  "details": "Please check server logs for more information"
}
```

#### Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid or missing prompt |
| 401 | Unauthorized - Invalid API key |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server or API error |

#### Rate Limiting

- **Requests per minute:** 60
- **Requests per hour:** 1000
- **Timeout:** 60 seconds per request

#### Example Usage

```javascript
const response = await fetch('/api/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    prompt: 'Create a modern login form with validation'
  })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value);
  const lines = chunk.split('\n').filter(line => line.trim().startsWith('data:'));
  
  for (const line of lines) {
    const data = line.replace('data: ', '').trim();
    if (data === '[DONE]') continue;
    
    try {
      const parsed = JSON.parse(data);
      if (parsed.stage === 'code' && parsed.content) {
        console.log(parsed.content);
      }
    } catch (error) {
      console.error('Error parsing chunk:', error);
    }
  }
}
```

## AI Model Configuration

The API uses the Cerebras `gpt-oss-120b` model with the following parameters:

- **Model:** `gpt-oss-120b`
- **Temperature:** 1.0
- **Max Completion Tokens:** 65536
- **Top P:** 1.0
- **Reasoning Effort:** medium
- **Streaming:** Enabled

## Security

### Headers

All responses include security headers:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `Referrer-Policy: origin-when-cross-origin`

### Input Validation

- Prompt length validation (10-2000 characters)
- Character set validation
- XSS protection
- SQL injection prevention

### Rate Limiting

- IP-based rate limiting
- Request frequency monitoring
- Automatic blocking of abusive requests

## Error Handling

The API provides comprehensive error handling:

1. **Input Validation Errors:** 400 status with specific error messages
2. **Authentication Errors:** 401 status for invalid API keys
3. **Rate Limiting:** 429 status with retry information
4. **Server Errors:** 500 status with generic error messages

## Monitoring and Logging

- All requests are logged with timestamps
- Performance metrics are collected
- Error rates are monitored
- Security events are tracked

## Best Practices

1. **Prompt Writing:**
   - Be specific about requirements
   - Include styling preferences
   - Mention responsive design needs
   - Specify component complexity

2. **Error Handling:**
   - Always handle network errors
   - Implement retry logic for transient failures
   - Provide user-friendly error messages

3. **Performance:**
   - Use streaming for better user experience
   - Implement proper loading states
   - Cache responses when appropriate

## SDK Examples

### JavaScript/TypeScript

```typescript
class RajAIBuilder {
  private apiKey: string;
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  async generateComponent(prompt: string): Promise<string> {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({ prompt })
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return this.parseStream(response.body);
  }
  
  private async parseStream(body: ReadableStream): Promise<string> {
    const reader = body.getReader();
    const decoder = new TextDecoder();
    let code = '';
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim().startsWith('data:'));
      
      for (const line of lines) {
        const data = line.replace('data: ', '').trim();
        if (data === '[DONE]') continue;
        
        try {
          const parsed = JSON.parse(data);
          if (parsed.stage === 'code' && parsed.content) {
            code += parsed.content;
          }
        } catch (error) {
          console.error('Error parsing chunk:', error);
        }
      }
    }
    
    return code;
  }
}
```

### Python

```python
import requests
import json

class RajAIBuilder:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://your-domain.com/api"
    
    def generate_component(self, prompt: str) -> str:
        response = requests.post(
            f"{self.base_url}/generate",
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {self.api_key}"
            },
            json={"prompt": prompt},
            stream=True
        )
        
        if response.status_code != 200:
            raise Exception(f"API Error: {response.status_code}")
        
        code = ""
        for line in response.iter_lines():
            if line.startswith(b"data: "):
                data = line[6:].decode("utf-8").strip()
                if data == "[DONE]":
                    continue
                try:
                    parsed = json.loads(data)
                    if parsed.get("stage") == "code" and parsed.get("content"):
                        code += parsed["content"]
                except json.JSONDecodeError:
                    continue
        
        return code
```

## Changelog

### Version 1.0.0
- Initial API release
- Support for React component generation
- Streaming response format
- Comprehensive error handling
- Security headers implementation
