'use client';
import { useState } from 'react';
import { getCookie, setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';

export default function TeamManagement() {
  const [teamName, setTeamName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError('');

    try {
      // 1. Validate inputs
      const trimmedName = teamName.trim();
      if (!trimmedName) {
        throw new Error('Team name cannot be empty');
      }
      if (trimmedName.length > 50) {
        throw new Error('Team name must be less than 50 characters');
      }
      

      // 2. Get and verify auth token
      const token = getCookie('token');
      if (!token) {
        throw new Error('Authentication required. Please login again.');
      }
    const formData = new FormData();
    formData.append('team_name', trimmedName);

    // 4. Make API request
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/teams`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Do not set 'Content-Type' when using FormData; it will be set automatically
      },
      body: formData,
      credentials: 'include'
    });
 
      const data = await response.json();

      // 5. Update client state
      try {
        const userCookie = getCookie('user');
        if (userCookie) {
          const userData = typeof userCookie === 'string' ? 
            JSON.parse(userCookie) : userCookie;
          
          setCookie('user', JSON.stringify({
            ...userData,
            team: {
              id: data.team_id,
              name: data.team_name,
              score: data.team_score
            },
            has_team: true
          }), {
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/'
          });
        }
      } catch (parseError) {
        console.error('User data update failed:', parseError);
      }

      router.push('/tournament?created=true');

    } catch (err) {
      const errorMessage = err instanceof Error ? 
        err.message : 
        'Failed to create team. Please try again.';
      
      setError(errorMessage);
      console.error('Team creation error:', err);
      
      // Auto-dismiss error after 5 seconds
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Create Your Team</h1>
        <p className="text-gray-600 mb-6">
          You need a team to participate in the tournament. Each team has exactly one member.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleCreateTeam} className="space-y-4">
          <div>
            <label htmlFor="team-name" className="block text-sm font-medium text-gray-700 mb-1">
              Team Name
            </label>
            <input
              id="team-name"
              type="text"
              required
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter your team name"
            />
          </div>

          <button
            type="submit"
            disabled={isCreating}
            className={`w-full bg-indigo-600 text-white py-2 px-4 rounded-md ${
              isCreating ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-700'
            }`}
          >
            {isCreating ? 'Creating Team...' : 'Create Team'}
          </button>
        </form>
      </div>
    </div>
  );
}