
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-vh-100 text-center px-4" style={{ height: '100vh', backgroundColor: '#f9f9f9' }}>
      <h1 className="text-6xl font-bold mb-4" style={{ fontFamily: 'var(--font-soria)' }}>404</h1>
      <h2 className="text-2xl mb-8" style={{ fontFamily: 'var(--font-vercetti)' }}>Page Not Found</h2>
      <p className="text-gray-600 mb-8 max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link 
        href="/"
        className="px-6 py-3 bg-black text-white rounded-full transition-transform hover:scale-105 active:scale-95"
        style={{ fontFamily: 'var(--font-vercetti)' }}
      >
        Back to Home
      </Link>
    </div>
  );
}
