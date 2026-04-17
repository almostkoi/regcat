/**
 * API route for generating test strings from regex patterns
 * Uses randexp library to instantly generate examples matching the pattern
 */

import { NextRequest, NextResponse } from 'next/server';
import RandExp from 'randexp';

interface GenerateRequest {
  pattern: string;
  flagsString?: string;
}

interface GenerateResponse {
  testStrings?: string[];
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<GenerateResponse>> {
  try {
    // Parse request body
    let body: GenerateRequest;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { pattern, flagsString } = body;

    if (!pattern || typeof pattern !== 'string') {
      return NextResponse.json(
        { error: 'Pattern is required and must be a string' },
        { status: 400 }
      );
    }

    if (pattern.length > 10000) {
      return NextResponse.json(
        { error: 'Pattern too long (max 10000 characters)' },
        { status: 400 }
      );
    }

    try {
      // Create regex from pattern and flags
      const regex = new RegExp(pattern, flagsString || '');

      // Generate 5 test strings using randexp
      const testStrings: string[] = [];
      const randexp = new RandExp(regex);

      // Generate up to 5 examples
      for (let i = 0; i < 5; i++) {
        try {
          const testString = randexp.gen();
          if (testString && typeof testString === 'string') {
            testStrings.push(testString);
          }
        } catch (e) {
          // Skip this iteration if generation fails
          continue;
        }
      }

      if (testStrings.length === 0) {
        return NextResponse.json(
          { error: 'Could not generate examples for this pattern' },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { testStrings },
        {
          headers: {
            'Access-Control-Allow-Origin': request.headers.get('origin') || 'null',
            'Access-Control-Allow-Credentials': 'true',
          },
        }
      );
    } catch (regexError) {
      return NextResponse.json(
        { error: 'Invalid regex pattern' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error in /api/generate-test-strings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
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
    },
  });
}
