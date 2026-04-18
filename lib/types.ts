/**
 * Core type definitions for Catex regex tester
 */

export type RegexFlag = 'g' | 'i' | 'm' | 's' | 'u' | 'd' | 'y';

/**
 * All 7 JavaScript regex flags with boolean values
 */
export interface FlagSet {
  g: boolean; // global
  i: boolean; // ignoreCase
  m: boolean; // multiline
  s: boolean; // dotAll
  u: boolean; // unicode
  d: boolean; // hasIndices
  y: boolean; // sticky
}

/**
 * A named or unnamed capture group from a regex match
 */
export interface CaptureGroup {
  name?: string;
  value: string | undefined;
  index?: number;
}

/**
 * A single regex match result with all its properties
 */
export interface MatchResult {
  fullMatch: string;
  index: number;
  groups: CaptureGroup[];
  indices?: {
    start: number;
    end: number;
  };
}

/**
 * Complete results from regex matching against test string
 */
export interface MatchResults {
  valid: boolean;
  matches: MatchResult[];
  error?: string;
  executionTime: number;
}

/**
 * Application state for regex testing
 */
export interface RegexState {
  pattern: string;
  testString: string;
  flags: FlagSet;
  substitution: string;
  debugMode: boolean;
  debugCurrentMatchIndex: number;
}

/**
 * Gemini API response structure
 */
export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

/**
 * API route request body for Gemini explanation
 */
export interface ExplainRequest {
  pattern: string;
  flagsString: string;
}

/**
 * API route response
 */
export interface ExplainResponse {
  explanation: string;
  error?: string;
}

/**
 * AI-generated regex from natural language description
 */
export interface GeneratedRegex {
  pattern: string;
  explanation: string;
  flags?: string;
}

/**
 * Request body for regex generation API
 */
export interface GenerateRegexRequest {
  description: string;
  count?: number;
}

/**
 * Response from regex generation API
 */
export interface GenerateRegexResponse {
  regexes: GeneratedRegex[];
  error?: string;
  apiUsed: 'gemini' | 'grok' | 'pattern';
}