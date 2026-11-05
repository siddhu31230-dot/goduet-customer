import { NextRequest, NextResponse } from 'next/server';
import { AiQueryInputSchema } from '@/lib/security/validator';
import { queryGemmaAi } from '@/lib/ai/gemmaService';
import { checkRateLimit } from '@/lib/security/rateLimiter';
import { verifySessionToken } from '@/lib/security/auth';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';

    // 1. Rate Limiting Check: 15 queries per minute per IP
    const rateCheck = checkRateLimit(ip, 'ai');
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `AI assistant rate limit reached. Please wait ${rateCheck.resetInSeconds} seconds before your next question.`
        },
        { status: 429 }
      );
    }

    // 2. Extract Optional User Identity
    const sessionCookie = req.cookies.get('goduet_session')?.value;
    const session = sessionCookie ? verifySessionToken(sessionCookie) : null;
    const userId = session?.userId;

    // 3. Validate Request Payload
    const body = await req.json();
    const parseResult = AiQueryInputSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid prompt format.', details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const { prompt } = parseResult.data;

    // 4. Execute Gemma 4 AI Assistant with Security Guardrails
    const aiResponse = await queryGemmaAi(prompt, userId);

    return NextResponse.json({
      success: true,
      ...aiResponse
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'AI concierge encountered an error. Please try again.' },
      { status: 500 }
    );
  }
}
