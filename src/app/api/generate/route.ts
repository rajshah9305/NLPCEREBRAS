import { NextRequest } from 'next/server';
import { errorHandler } from '@/lib/error-handler';

export const runtime = 'edge';
export const maxDuration = 60;

interface CerebrasChunk {
  choices: Array<{
    delta: { content?: string };
    finish_reason?: string;
  }>;
}

const SYSTEM_PROMPT = `You are an expert React developer …`; // (truncated for brevity)

export async function POST(req: NextRequest) {
  let prompt = '';
  try {
    const body = await req.json();
    prompt = body.prompt?.trim() ?? '';
    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const apiKey = process.env.CEREBRAS_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const encoder = new TextEncoder();
    const abortCerebras = new AbortController();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const res = await fetch('https://api.cerebras.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model: 'gpt-oss-120b',
              messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: `Create a React component: ${prompt}` },
              ],
              stream: true,
              max_completion_tokens: 65536,
              temperature: 1,
              top_p: 1,
              reasoning_effort: 'medium',
            }),
            signal: abortCerebras.signal,
          });

          if (!res.ok) {
            const text = await res.text();
            throw new Error(`Cerebras API error: ${res.status} - ${text}`);
          }

          const reader = res.body?.getReader();
          if (!reader) throw new Error('No response body');

          const decoder = new TextDecoder();
          let buf = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buf += decoder.decode(value, { stream: true });
            const lines = buf.split('\n');
            buf = lines.pop() || '';

            for (const line of lines) {
              const trim = line.trim();
              if (!trim.startsWith('data:')) continue;
              const data = trim.slice(5).trim();
              if (data === '[DONE]') continue;

              try {
                const parsed: CerebrasChunk = JSON.parse(data);
                const content = parsed.choices[0]?.delta?.content || '';
                if (content) {
                  const safe = JSON.stringify({ stage: 'code', content });
                  controller.enqueue(encoder.encode(`data: ${safe}\n\n`));
                }
                if (parsed.choices[0]?.finish_reason === 'stop') {
                  const safe = JSON.stringify({ stage: 'done', timestamp: new Date().toISOString() });
                  controller.enqueue(encoder.encode(`data: ${safe}\n\n`));
                }
              } catch (e) {
                /* ignore parse errors per SSE spec */
              }
            }
          }
          controller.close();
        } catch (err) {
          // await is required to catch async rejection
          const appErr = await errorHandler.handleGenerationError(
            err instanceof Error ? err : new Error(String(err)),
            prompt
          );
          const safe = JSON.stringify({ stage: 'error', error: appErr.message });
          controller.enqueue(encoder.encode(`data: ${safe}\n\n`));
          controller.close();
        }
      },
      cancel() {
        abortCerebras.abort();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (outer) {
    const appErr = await errorHandler.handleGenerationError(
      outer instanceof Error ? outer : new Error(String(outer)),
      prompt
    );
    return new Response(
      JSON.stringify({ error: appErr.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
