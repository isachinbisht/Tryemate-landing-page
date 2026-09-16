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
    console.error('Unhandled app error:', error);
  }, [error]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      backgroundColor: '#0c0c0e',
      color: '#ffffff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      textAlign: 'center'
    }}>
      <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '12px' }}>
        Something went wrong
      </h2>
      <p style={{ color: '#a1a1aa', marginBottom: '24px', maxWidth: '400px', fontSize: '14px' }}>
        We encountered an issue while loading this view. Please try reloading.
      </p>
      <button
        onClick={() => reset()}
        style={{
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: 500,
          cursor: 'pointer'
        }}
      >
        Try again
      </button>
    </div>
  );
}
