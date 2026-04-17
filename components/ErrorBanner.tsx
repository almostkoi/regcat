/**
 * ErrorBanner - displays error messages inline without modals
 */

'use client';

interface ErrorBannerProps {
  message: string | null;
}

/**
 * Component for displaying error messages in a prominent banner
 * Appears inline at the top of the interface when an error occurs
 */
export function ErrorBanner({ message }: ErrorBannerProps) {
  if (!message) return null;

  return (
    <div className="bg-regcat-error/20 border border-regcat-error text-regcat-error px-3 py-2 rounded font-mono text-sm">
      {message}
    </div>
  );
}
