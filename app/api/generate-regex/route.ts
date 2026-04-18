/**
 * AI Regex Generator API - Dual API with Fallback
 * Supports Gemini and Grok APIs with automatic fallback on rate limits
 */

import { NextRequest, NextResponse } from 'next/server';
import { GenerateRegexRequest, GenerateRegexResponse } from '@/lib/types';

const htmlEncode = (text: string): string => {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
};

async function callGeminiAPI(description: string): Promise<any> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not configured');

  const prompt = `Generate 3 JavaScript regular expressions that match: "${description}"
Return ONLY a valid JSON array with no additional text or explanation:
[{"pattern":"regex","explanation":"brief description"}]`;

  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-lite:generateContent?key=' + apiKey, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 300,
      },
    }),
  });

  if (response.status === 429) {
    throw new Error('RATE_LIMIT');
  }

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!content) throw new Error('No content in Gemini response');

  // Parse JSON from response
  const jsonMatch = content.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error('Invalid JSON in Gemini response');

  return { regexes: JSON.parse(jsonMatch[0]), apiUsed: 'gemini' };
}

async function callGrokAPI(description: string): Promise<any> {
  const apiKey = process.env.GROK_API_KEY;
  if (!apiKey) throw new Error('GROK_API_KEY not configured');

  const prompt = `Generate 3 JavaScript regular expressions that match: "${description}"
Return ONLY a valid JSON array with no additional text or explanation:
[{"pattern":"regex","explanation":"brief description"}]`;

  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'grok-beta',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 300,
    }),
  });

  if (response.status === 429) {
    throw new Error('RATE_LIMIT');
  }

  if (!response.ok) {
    throw new Error(`Grok API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('No content in Grok response');

  // Parse JSON from response
  const jsonMatch = content.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error('Invalid JSON in Grok response');

  return { regexes: JSON.parse(jsonMatch[0]), apiUsed: 'grok' };
}

export async function POST(request: NextRequest): Promise<NextResponse<GenerateRegexResponse>> {
  try {
    let body: GenerateRegexRequest;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { regexes: [], error: 'Invalid JSON in request body', apiUsed: 'gemini' },
        { status: 400 }
      );
    }

    const { description } = body;

    // Validate input
    if (!description || typeof description !== 'string') {
      return NextResponse.json(
        { regexes: [], error: 'Description is required and must be a string', apiUsed: 'gemini' },
        { status: 400 }
      );
    }

    if (description.length > 1000) {
      return NextResponse.json(
        { regexes: [], error: 'Description too long (max 1000 characters)', apiUsed: 'gemini' },
        { status: 400 }
      );
    }

    if (description.trim().length === 0) {
      return NextResponse.json(
        { regexes: [], error: 'Description cannot be empty', apiUsed: 'gemini' },
        { status: 400 }
      );
    }

    // Check if at least one API key is available
    const hasGemini = !!process.env.GEMINI_API_KEY;
    const hasGrok = !!process.env.GROK_API_KEY;

    if (!hasGemini && !hasGrok) {
      return NextResponse.json(
        { regexes: [], error: 'No API keys configured', apiUsed: 'gemini' },
        { status: 503 }
      );
    }

    let result = null;
    let lastError = null;

    // Try primary API (Gemini by default)
    if (hasGemini) {
      try {
        result = await callGeminiAPI(description);
      } catch (err: any) {
        lastError = err;
        if (err.message === 'RATE_LIMIT' && hasGrok) {
          // Silently try Grok on rate limit
          try {
            result = await callGrokAPI(description);
          } catch (grokErr: any) {
            lastError = grokErr;
          }
        }
      }
    }

    // If Gemini not available or failed, try Grok
    if (!result && hasGrok && (!hasGemini || lastError?.message === 'RATE_LIMIT')) {
      try {
        result = await callGrokAPI(description);
      } catch (err: any) {
        lastError = err;
      }
    }

    // If still no result, return error
    if (!result) {
      const errorMsg = lastError?.message || 'Unable to generate regex';
      return NextResponse.json(
        { regexes: [], error: errorMsg, apiUsed: 'gemini' },
        { status: 500 }
      );
    }

    // Validate and sanitize generated regexes
    if (!Array.isArray(result.regexes)) {
      return NextResponse.json(
        { regexes: [], error: 'Invalid response format', apiUsed: result.apiUsed },
        { status: 500 }
      );
    }

    // HTML encode for security
    const sanitizedRegexes = result.regexes.map((regex: any) => ({
      pattern: htmlEncode(regex.pattern || ''),
      explanation: htmlEncode(regex.explanation || ''),
      flags: htmlEncode(regex.flags || ''),
    }));

    return NextResponse.json(
      { regexes: sanitizedRegexes, apiUsed: result.apiUsed },
      {
        headers: {
          'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          // Cache for 1 hour for identical descriptions
          'Cache-Control': 'public, max-age=3600',
        },
      }
    );
  } catch (error) {
    console.error('Error in /api/generate-regex:', error);
    return NextResponse.json(
      { regexes: [], error: 'Internal server error', apiUsed: 'gemini' },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}
