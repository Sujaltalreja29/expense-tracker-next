// app/api/chat/route.ts
import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GOOGLE_GEMINI_API_KEY is not configured');
    }

    const google = createGoogleGenerativeAI({ apiKey });
    const { messages } = await req.json();

    if (!Array.isArray(messages)) {
      throw new Error('Chat request must include a messages array');
    }

    // Extract the system message if present
    const systemMessage = messages.find((m: any) => m.role === 'system');

    // Filter out system messages for Gemini
    const userMessages = messages.filter((m: any) => m.role !== 'system');

    // Create a complete version of the system message
    let systemPrompt = `You are a financial assistant helping with budgeting and expense management.`;

    if (systemMessage) {
      systemPrompt = systemMessage.content;

      // Add this section to ensure expense details are analyzed correctly
      systemPrompt += `
When analyzing expense data:
1. Focus on the TOP SPENDING CATEGORIES section
2. Provide specific amounts and percentages when discussing spending
3. Never say you don't have enough information about expenses`;
    }

    const result = streamText({
      model: google('gemini-1.5-flash'),
      system: systemPrompt,
      messages: userMessages,
      temperature: 0.3,
      maxTokens: 800,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Error handling chat request:', error);
    return new Response(JSON.stringify({
      error: 'Unable to process chat request',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}