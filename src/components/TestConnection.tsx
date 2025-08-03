'use client';

import { useState } from 'react';
import { testConnection } from '@/services/api';

export default function TestConnection() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleTest = async () => {
    setLoading(true);
    try {
      const response = await testConnection();
      setResult(`✅ Connection successful! Status: ${response.status}`);
    } catch (error: any) {
      setResult(`❌ Connection failed: ${error.message}`);
      console.error('Connection test error:', error);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md max-w-md">
      <h3 className="text-lg font-semibold mb-4">Backend Connection Test</h3>
      <button
        onClick={handleTest}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Connection'}
      </button>
      {result && (
        <p className="mt-4 text-sm">{result}</p>
      )}
      <div className="mt-4 text-xs text-gray-600">
        <p>Testing URL: {process.env.NEXT_PUBLIC_API_URL}</p>
      </div>
    </div>
  );
}
