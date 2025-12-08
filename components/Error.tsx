import React from 'react';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export const Error: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '256px' }}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '48px', color: '#e74c3c', marginBottom: '16px' }}>⚠️</div>
        <p style={{ color: '#e74c3c', marginBottom: '16px' }}>{error}</p>
      </div>
    </div>
  );
};
