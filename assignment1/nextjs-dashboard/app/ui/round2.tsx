'use client'
import { useState } from 'react';
import { getCookie } from 'cookies-next';


export default function Round2AdminPanel() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{
    status?: string;
    bot_count?: number;
    admin_id?: number;
    sample_output?: string[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const triggerRound2 = async () => {
    setIsLoading(true);
    setError(null);
    setResults(null);
    const token = getCookie('token');

        if (!token) 
            {
          throw new Error('Authentication required. Please login again.');
        }
    
    
    try {
      const response = await fetch('http://localhost:8000/start-round2/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      setResults(data);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start tournament');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Round 2 Tournament</h2>
      <h4>Admin access only</h4>
      
      <div className="flex justify-center mb-6">
        <button
          onClick={triggerRound2}
          disabled={isLoading}
          className={`px-6 py-3 rounded-md text-white font-medium ${
            isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Running Tournament...' : 'Start Round 2'}
        </button>
      </div>

      {error && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-md">
          Error: {error}
        </div>
      )}

      {results && (
        <div className="mt-6 space-y-4">
          <div className="p-3 bg-gray-100 rounded-md">
            <p><strong>Status:</strong> {results.status}</p>
            <p><strong>Bots Count:</strong> {results.bot_count}</p>
            <p><strong>Admin ID:</strong> {results.admin_id}</p>
          </div>

          <h3 className="text-xl font-semibold">Tournament Output</h3>
          <pre className="p-4 bg-black text-green-400 rounded-md overflow-auto max-h-[60vh]">
            {results.sample_output?.join('\n')}
          </pre>
        </div>
      )}
    </div>
  );
}