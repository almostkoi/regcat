/**
 * AI Regex Generator API - Dual API with Fallback
 * Supports Gemini and Grok APIs with automatic fallback on rate limits
 * Falls back to pattern-based generation if APIs are unavailable
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

// Pattern-based regex generator (fallback when APIs are unavailable)
function generatePatternBasedRegex(description: string): any[] {
  const desc = description.toLowerCase();
  const regexes: any[] = [];

  // Email patterns
  if (desc.includes('email')) {
    regexes.push({
      pattern: String.raw`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`,
      explanation: 'Basic email validation: username@domain.extension',
    });
    regexes.push({
      pattern: String.raw`/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/`,
      explanation: 'More detailed email: alphanumeric with dot, underscore, plus, or hyphen',
    });
    regexes.push({
      pattern: String.raw`/^[^@\s]+@[^@\s]+\.com$/`,
      explanation: 'Email ending in .com domain',
    });
  }

  // Phone patterns
  if (desc.includes('phone')) {
    regexes.push({
      pattern: String.raw`/^\d{3}-\d{3}-\d{4}$/`,
      explanation: 'US phone: XXX-XXX-XXXX format',
    });
    regexes.push({
      pattern: String.raw`/^\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})$/`,
      explanation: 'Flexible US phone: (XXX) XXX-XXXX or XXX.XXX.XXXX',
    });
    regexes.push({
      pattern: String.raw`/^\d{10}$/`,
      explanation: 'US phone: 10 consecutive digits',
    });
  }

  // URL patterns
  if (desc.includes('url') || desc.includes('website') || desc.includes('http')) {
    regexes.push({
      pattern: String.raw`/^https?:\/\/[^\s]+$/`,
      explanation: 'HTTP or HTTPS URL',
    });
    regexes.push({
      pattern: String.raw`/^(https?):\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&/=]*)$/`,
      explanation: 'Valid HTTP(S) URL with domain validation',
    });
    regexes.push({
      pattern: String.raw`/(https?|ftp):\/\/[^\s]+/`,
      explanation: 'HTTP, HTTPS, or FTP URLs',
    });
  }

  // IP address patterns
  if (desc.includes('ip') && desc.includes('address')) {
    regexes.push({
      pattern: String.raw`/^(\d{1,3}\.){3}\d{1,3}$/`,
      explanation: 'IPv4 address: XXX.XXX.XXX.XXX',
    });
    regexes.push({
      pattern: String.raw`/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/`,
      explanation: 'Valid IPv4 (0-255 per octet)',
    });
  }

  // Hex color patterns
  if (desc.includes('hex') || desc.includes('color')) {
    regexes.push({
      pattern: String.raw`/#[0-9A-Fa-f]{6}/`,
      explanation: 'Hex color: #RRGGBB',
    });
    regexes.push({
      pattern: String.raw`/#[0-9A-Fa-f]{3,6}/`,
      explanation: 'Hex color: short (#RGB) or long (#RRGGBB)',
    });
  }

  // Date patterns
  if (desc.includes('date')) {
    regexes.push({
      pattern: String.raw`/^\d{4}-\d{2}-\d{2}$/`,
      explanation: 'ISO date format: YYYY-MM-DD',
    });
    regexes.push({
      pattern: String.raw`/^\d{2}\/\d{2}\/\d{4}$/`,
      explanation: 'US date: MM/DD/YYYY',
    });
    regexes.push({
      pattern: String.raw`/^\d{1,2}\/\d{1,2}\/\d{4}$/`,
      explanation: 'Flexible date: M/D/YYYY or MM/DD/YYYY',
    });
  }

  // Number patterns
  if (desc.includes('number') || desc.includes('digit')) {
    regexes.push({
      pattern: String.raw`/^\d+$/`,
      explanation: 'Positive integers only',
    });
    regexes.push({
      pattern: String.raw`/^-?\d+$/`,
      explanation: 'Integers (positive or negative)',
    });
    regexes.push({
      pattern: String.raw`/^-?\d+\.?\d*$/`,
      explanation: 'Decimal numbers',
    });
  }

  // Word patterns
  if (desc.includes('word') || desc.includes('alpha')) {
    regexes.push({
      pattern: String.raw`/^[A-Za-z]+$/`,
      explanation: 'English letters only',
    });
    regexes.push({
      pattern: String.raw`/^\w+$/`,
      explanation: 'Word characters: letters, digits, underscore',
    });
  }

  // If no patterns matched, return generic examples
  if (regexes.length === 0) {
    regexes.push({
      pattern: String.raw`/[a-z]+/`,
      explanation: 'Simple: lowercase letters',
    });
    regexes.push({
      pattern: String.raw`/[A-Za-z0-9]+/`,
      explanation: 'Alphanumeric characters',
    });
    regexes.push({
      pattern: String.raw`/\b\w+\b/`,
      explanation: 'Word boundaries',
    });
  }

  return regexes;
}

async function callGeminiAPI(description: string): Promise<any> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not configured');

  const prompt = `Generate 3 JavaScript regular expressions that match: "${description}"
Return ONLY a valid JSON array with no additional text or explanation:
[{"pattern":"regex","explanation":"brief description"}]`;

  const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + apiKey;

  const response = await fetch(url, {
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
    const errorText = await response.text();
    console.error(`Gemini API error ${response.status}:`, errorText);
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
    const errorText = await response.text();
    console.error(`Grok API error ${response.status}:`, errorText);
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
        { regexes: [], error: 'Invalid JSON in request body', apiUsed: 'pattern' },
        { status: 400 }
      );
    }

    const { description } = body;

    // Validate input
    if (!description || typeof description !== 'string') {
      return NextResponse.json(
        { regexes: [], error: 'Description is required and must be a string', apiUsed: 'pattern' },
        { status: 400 }
      );
    }

    if (description.length > 1000) {
      return NextResponse.json(
        { regexes: [], error: 'Description too long (max 1000 characters)', apiUsed: 'pattern' },
        { status: 400 }
      );
    }

    if (description.trim().length === 0) {
      return NextResponse.json(
        { regexes: [], error: 'Description cannot be empty', apiUsed: 'pattern' },
        { status: 400 }
      );
    }

    // Check if at least one API key is available
    const hasGemini = !!process.env.GEMINI_API_KEY;
    const hasGrok = !!process.env.GROK_API_KEY;

    let result = null;
    let lastError = null;

    // Try primary API (Gemini by default) if available
    if (hasGemini) {
      try {
        result = await callGeminiAPI(description);
      } catch (err: any) {
        lastError = err;
        // If rate limited and Grok available, silently try Grok
        if (err.message === 'RATE_LIMIT' && hasGrok) {
          try {
            result = await callGrokAPI(description);
          } catch (grokErr: any) {
            lastError = grokErr;
          }
        }
      }
    }

    // If Gemini not available or failed, try Grok
    if (!result && hasGrok && !hasGemini) {
      try {
        result = await callGrokAPI(description);
      } catch (err: any) {
        lastError = err;
      }
    }

    // As final fallback, if both configured but Gemini failed with non-rate-limit error, try Grok
    if (!result && hasGemini && hasGrok && lastError?.message !== 'RATE_LIMIT') {
      try {
        result = await callGrokAPI(description);
      } catch (err: any) {
        lastError = err;
      }
    }

    // If still no result from APIs, use pattern-based fallback
    if (!result) {
      console.warn('Both APIs failed, falling back to pattern-based regex generation');
      const patternRegexes = generatePatternBasedRegex(description);
      result = {
        regexes: patternRegexes,
        apiUsed: 'pattern',
      };
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
      { regexes: [], error: 'Internal server error', apiUsed: 'pattern' },
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
