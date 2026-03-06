
'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-vh-100 text-center px-4" style={{ height: '100vh', backgroundColor: '#fff0f0' }}>
      <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-soria)' }}>Something went wrong!</h1>
      <p className="text-gray-600 mb-8 max-w-md" style={{ fontFamily: 'var(--font-vercetti)' }}>
        An unexpected error occurred. We have been notified and are working on it.
      </p>
      <button
        onClick={() => reset()}
        className="px-6 py-3 bg-red-600 text-white rounded-full transition-transform hover:scale-105 active:scale-95"
        style={{ fontFamily: 'var(--font-vercetti)' }}
      >
        Try again
      </button>
    </div>
  );
}
