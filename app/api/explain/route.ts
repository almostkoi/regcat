/**
 * API route for regex explanations
 * Uses local parsing (NO external APIs - completely FREE)
 */

import { NextRequest, NextResponse } from 'next/server';
import { explainRegex } from '@/lib/regex-explainer';
import { ExplainRequest, ExplainResponse } from '@/lib/types';

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

export async function POST(request: NextRequest): Promise<NextResponse<ExplainResponse>> {
  try {
    let body: ExplainRequest;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { explanation: '', error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    let { pattern, flagsString } = body;

    if (!pattern || typeof pattern !== 'string') {
      return NextResponse.json(
        { explanation: '', error: 'Pattern is required and must be a string' },
        { status: 400 }
      );
    }

    if (pattern.length > 10000) {
      return NextResponse.json(
        { explanation: '', error: 'Pattern too long (max 10000 characters)' },
        { status: 400 }
      );
    }

    if (flagsString && typeof flagsString !== 'string') {
      return NextResponse.json(
        { explanation: '', error: 'Flags must be a string' },
        { status: 400 }
      );
    }

    flagsString = (flagsString || '').substring(0, 10);

    // Local explanation - NO API CALLS, completely FREE
    const explanation = explainRegex(pattern, flagsString);
    const encodedExplanation = htmlEncode(explanation);

    return NextResponse.json(
      { explanation: encodedExplanation },
      {
        headers: {
          'Access-Control-Allow-Origin': request.headers.get('origin') || request.headers.get('host') || 'null',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          // Cache response for 24 hours (can reuse for same patterns)
          'Cache-Control': 'public, max-age=86400',
        },
      }
    );
  } catch (error) {
    console.error('Error in /api/explain:', error);
    return NextResponse.json(
      { explanation: '', error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': request.headers.get('origin') || request.headers.get('host') || '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}
