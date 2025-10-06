
/**
 * Comprehensive API tests for generate route
 * Testing all API functionality and error handling
 */

import { NextRequest } from 'next/server';
import { POST } from '@/app/api/generate/route';

// Mock environment variables
const mockEnv = {
  CEREBRAS_API_KEY: 'csk-test-key-for-testing',
};

describe('/api/generate', () => {
  beforeEach(() => {
    process.env = { ...process.env, ...mockEnv };
    jest.clearAllMocks();
  });

  describe('POST handler', () => {
    it('should handle valid request', async () => {
      const mockResponse = {
        ok: true,
        body: {
          getReader: jest.fn(() => ({
            read: jest.fn()
              .mockResolvedValueOnce({
                done: false,
                value: new TextEncoder().encode('data: {"stage":"code","content":"function App() {"}\n\n'),
              })
              .mockResolvedValueOnce({
                done: false,
                value: new TextEncoder().encode('data: {"stage":"code","content":"{ return <div>Hello</div>; }"}\n\n'),
              })
              .mockResolvedValueOnce({
                done: false,
                value: new TextEncoder().encode('data: {"stage":"done"}\n\n'),
              })
              .mockResolvedValueOnce({ done: true }),
          })),
        },
      };

      global.fetch = jest.fn().mockResolvedValue(mockResponse);

      const request = new NextRequest('http://localhost:3000/api/generate', {
        method: 'POST',
        body: JSON.stringify({ prompt: 'Create a simple component' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('text/event-stream');
    });

    it('should handle missing prompt', async () => {
      const request = new NextRequest('http://localhost:3000/api/generate', {
        method: 'POST',
        body: JSON.stringify({}),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const responseData = await response.json();
      
      expect(response.status).toBe(400);
      expect(responseData.error).toBe('Prompt is required');
    });

    it('should handle empty prompt', async () => {
      const request = new NextRequest('http://localhost:3000/api/generate', {
        method: 'POST',
        body: JSON.stringify({ prompt: '' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const responseData = await response.json();
      
      expect(response.status).toBe(400);
      expect(responseData.error).toBe('Prompt is required');
    });

    it('should handle missing API key', async () => {
      delete process.env.CEREBRAS_API_KEY;

      const request = new NextRequest('http://localhost:3000/api/generate', {
        method: 'POST',
        body: JSON.stringify({ prompt: 'Create a component' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const responseData = await response.json();
      
      expect(response.status).toBe(500);
      expect(responseData.error).toContain('API key not configured');
    });

    it('should handle API errors', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 401,
        text: () => Promise.resolve('Unauthorized'),
      });

      const request = new NextRequest('http://localhost:3000/api/generate', {
        method: 'POST',
        body: JSON.stringify({ prompt: 'Create a component' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const responseData = await response.json();
      
      expect(response.status).toBe(500);
      expect(responseData.error).toContain('Cerebras API error');
    });

    it('should handle network errors', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

      const request = new NextRequest('http://localhost:3000/api/generate', {
        method: 'POST',
        body: JSON.stringify({ prompt: 'Create a component' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const responseData = await response.json();
      
      expect(response.status).toBe(500);
      expect(responseData.error).toContain('Network error');
    });

    it('should handle malformed JSON in request', async () => {
      const request = new NextRequest('http://localhost:3000/api/generate', {
        method: 'POST',
        body: 'invalid json',
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const responseData = await response.json();
      
      expect(response.status).toBe(500);
      expect(responseData.error).toBeDefined();
    });

    it('should handle streaming response with errors', async () => {
      const mockResponse = {
        ok: true,
        body: {
          getReader: jest.fn(() => ({
            read: jest.fn()
              .mockResolvedValueOnce({
                done: false,
                value: new TextEncoder().encode('data: {"stage":"error","error":"Generation failed"}\n\n'),
              })
              .mockResolvedValueOnce({ done: true }),
          })),
        },
      };

      global.fetch = jest.fn().mockResolvedValue(mockResponse);

      const request = new NextRequest('http://localhost:3000/api/generate', {
        method: 'POST',
        body: JSON.stringify({ prompt: 'Create a component' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });

    it('should handle invalid JSON in stream', async () => {
      const mockResponse = {
        ok: true,
        body: {
          getReader: jest.fn(() => ({
            read: jest.fn()
              .mockResolvedValueOnce({
                done: false,
                value: new TextEncoder().encode('data: invalid json\n\n'),
              })
              .mockResolvedValueOnce({ done: true }),
          })),
        },
      };

      global.fetch = jest.fn().mockResolvedValue(mockResponse);

      const request = new NextRequest('http://localhost:3000/api/generate', {
        method: 'POST',
        body: JSON.stringify({ prompt: 'Create a component' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });

    it('should handle DONE signal', async () => {
      const mockResponse = {
        ok: true,
        body: {
          getReader: jest.fn(() => ({
            read: jest.fn()
              .mockResolvedValueOnce({
                done: false,
                value: new TextEncoder().encode('data: [DONE]\n\n'),
              })
              .mockResolvedValueOnce({ done: true }),
          })),
        },
      };

      global.fetch = jest.fn().mockResolvedValue(mockResponse);

      const request = new NextRequest('http://localhost:3000/api/generate', {
        method: 'POST',
        body: JSON.stringify({ prompt: 'Create a component' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });

    it('should handle finish_reason stop', async () => {
      const mockResponse = {
        ok: true,
        body: {
          getReader: jest.fn(() => ({
            read: jest.fn()
              .mockResolvedValueOnce({
                done: false,
                value: new TextEncoder().encode('data: {"choices":[{"finish_reason":"stop"}]}\n\n'),
              })
              .mockResolvedValueOnce({ done: true }),
          })),
        },
      };

      global.fetch = jest.fn().mockResolvedValue(mockResponse);

      const request = new NextRequest('http://localhost:3000/api/generate', {
        method: 'POST',
        body: JSON.stringify({ prompt: 'Create a component' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });

    it('should set correct headers', async () => {
      const mockResponse = {
        ok: true,
        body: {
          getReader: jest.fn(() => ({
            read: jest.fn().mockResolvedValueOnce({ done: true }),
          })),
        },
      };

      global.fetch = jest.fn().mockResolvedValue(mockResponse);

      const request = new NextRequest('http://localhost:3000/api/generate', {
        method: 'POST',
        body: JSON.stringify({ prompt: 'Create a component' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      
      expect(response.headers.get('Content-Type')).toBe('text/event-stream');
      expect(response.headers.get('Cache-Control')).toBe('no-cache, no-transform');
      expect(response.headers.get('Connection')).toBe('keep-alive');
      expect(response.headers.get('X-Accel-Buffering')).toBe('no');
    });

    it('should handle very long prompts', async () => {
      const longPrompt = 'Create a component '.repeat(1000);
      
      const mockResponse = {
        ok: true,
        body: {
          getReader: jest.fn(() => ({
            read: jest.fn().mockResolvedValueOnce({ done: true }),
          })),
        },
      };

      global.fetch = jest.fn().mockResolvedValue(mockResponse);

      const request = new NextRequest('http://localhost:3000/api/generate', {
        method: 'POST',
        body: JSON.stringify({ prompt: longPrompt }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });
  });
});
