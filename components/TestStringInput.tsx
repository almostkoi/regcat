/**
 * TestStringInput - textarea for the string to test regex against
 */

'use client';

interface TestStringInputProps {
  testString: string;
  onChange: (testString: string) => void;
}

/**
 * Component for entering the test string to match regex against
 */
export function TestStringInput({ testString, onChange }: TestStringInputProps) {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-regcat-text-secondary font-mono text-xs uppercase tracking-widest font-semibold">
        Test String
      </label>
      <textarea
        value={testString}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste text to test here..."
        className="w-full bg-regcat-surface border border-regcat-border text-regcat-text font-mono text-sm p-3 rounded-sm focus:outline-none focus:border-regcat-accent focus:ring-1 focus:ring-regcat-accent/30 resize-none h-32 transition-all duration-200 hover:border-regcat-border/80"
        spellCheck="false"
      />
      <div className="text-xs text-regcat-text-tertiary font-mono flex justify-between">
        <span>{testString.length} chars</span>
        {testString && <span className="text-regcat-accent/70">ready</span>}
      </div>
    </div>
  );
}
