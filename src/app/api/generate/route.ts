import { NextRequest } from "next/server";

export const runtime = "edge";
export const maxDuration = 60;

interface CerebrasChunk {
  choices: Array<{
    delta: {
      content?: string;
    };
    finish_reason?: string;
  }>;
}

const SYSTEM_PROMPT = `You are an expert React developer who creates beautiful, production-ready components. 

CRITICAL REQUIREMENTS:
1. Use ONLY function syntax: function App() {}
2. Use React.useState, React.useEffect, React.useCallback (with React. prefix)
3. Use Tailwind CSS for ALL styling - create stunning designs with:
   - Beautiful gradients (bg-gradient-to-br, from-color-500, to-color-600)
   - Smooth shadows (shadow-lg, shadow-xl, shadow-2xl)
   - Elegant animations (transition-all, duration-200, hover:scale-105, animate-pulse)
   - Modern rounded corners (rounded-xl, rounded-2xl)
   - Professional spacing and typography
4. Component must be fully functional and interactive
5. NO imports, NO exports - ONLY the function declaration
6. Return ONLY the component code, nothing else
7. Use semantic HTML5 elements
8. Add ARIA attributes for accessibility
9. Include smooth transitions and hover effects on all interactive elements
10. Make it fully responsive with mobile-first approach
11. Include proper error handling and loading states
12. Use modern React patterns (hooks, composition)
13. Add visual feedback for all user interactions
14. Use lucide-react icons when appropriate (import them at top of function if needed)

DESIGN STANDARDS:
- Color palettes: Use vibrant gradients (purple, pink, blue, orange combinations)
- Spacing: Generous padding and margins for breathing room
- Typography: Clear hierarchy with varying font sizes and weights
- Interactive elements: Add hover effects, active states, focus rings
- Backgrounds: Use subtle gradients or patterns
- Cards: Include shadows, borders, and rounded corners
- Buttons: Make them prominent with gradients, shadows, and transitions
- Forms: Add proper validation feedback with colors and icons

Return ONLY the complete React component function, nothing else.`;

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt?.trim()) {
      return new Response(
        JSON.stringify({ error: "Prompt is required" }), 
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const apiKey = process.env.CEREBRAS_API_KEY;
    if (!apiKey) {
      console.error("CEREBRAS_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "API key not configured. Please add CEREBRAS_API_KEY to your environment variables." }), 
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const response = await fetch("https://api.cerebras.ai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model: "gpt-oss-120b",
              messages: [
                {
                  role: "system",
                  content: SYSTEM_PROMPT,
                },
                {
                  role: "user",
                  content: `Create a React component: ${prompt}`,
                },
              ],
              stream: true,
              max_completion_tokens: 65536,
              temperature: 1,
              top_p: 1,
              reasoning_effort: "medium",
            }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error("Cerebras API error:", response.status, errorText);
            throw new Error(`Cerebras API error: ${response.status} - ${errorText}`);
          }

          const reader = response.body?.getReader();
          if (!reader) {
            throw new Error("No response body from Cerebras API");
          }

          const decoder = new TextDecoder();
          let buffer = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              const trimmedLine = line.trim();
              if (!trimmedLine || !trimmedLine.startsWith("data:")) continue;

              const data = trimmedLine.slice(5).trim();
              if (data === "[DONE]") continue;

              try {
                const parsed: CerebrasChunk = JSON.parse(data);
                const content = parsed.choices[0]?.delta?.content || "";
                
                if (content) {
                  controller.enqueue(
                    encoder.encode(
                      `data: ${JSON.stringify({
                        stage: "code",
                        content: content,
                      })}\n\n`
                    )
                  );
                }

                if (parsed.choices[0]?.finish_reason === "stop") {
                  controller.enqueue(
                    encoder.encode(
                      `data: ${JSON.stringify({
                        stage: "done",
                        timestamp: new Date().toISOString(),
                      })}\n\n`
                    )
                  );
                }
              } catch (parseError) {
                console.error("Error parsing SSE data:", parseError);
              }
            }
          }

          controller.close();
        } catch (error: unknown) {
          console.error("Stream error:", error);
          const errorMessage = error instanceof Error ? error.message : "Generation failed";
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                stage: "error",
                error: errorMessage,
              })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error: unknown) {
    console.error("API route error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: "Please check server logs for more information"
      }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json" } 
      }
    );
  }
}
