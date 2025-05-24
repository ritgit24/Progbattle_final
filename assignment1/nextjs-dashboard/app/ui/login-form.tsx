"use client";
import { useState } from 'react';
import { inter } from '@/app/ui/fonts';
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from './button';
import { useRouter } from 'next/navigation';
import { setCookie } from 'cookies-next';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => { //It handles user login on the frontend, using React and fetch() to send login credentials to my FastAPI backend.
    e.preventDefault(); //It handles user login on the frontend, using React and fetch() to send login credentials to your FastAPI backend.
    setError('');   // Clears any previous error message

    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST', //Sends a POST request to /login with the user's email and password.Expects a response with access token and user info.
        headers: {
          'Content-Type': 'application/json', //This is sent in the body as JSON (Content-Type: application/json).
        },
        body: JSON.stringify({ email, password }), //// Converts login info to JSON to be sent along to the backend
      });

      const data = await response.json(); //const data = await response.json();  // Parse the JSON response

if (response.ok) { //If Login Is Successful, Set Cookies. token: Stores the JWT access token (for authentication). user: Stores some user data in JSON format.
  document.cookie = `token=${data.access_token}; path=/; max-age=${60*60*24*7}`; // expires in 7 days
  document.cookie = `user=${JSON.stringify({
    id: data.user_id,
    team: data.team 
  })}; path=/; max-age=${60*60*24*7}`;
} 
//These cookies are not HTTP-only, so they can be accessed from JavaScript (needed for frontend use).
// i am Storing JWT (access token) in a cookie . This allows me to use the token later for authenticated requests by attaching it in headers
//Storing user info in a separate cookie

      if (!response.ok) {
        throw new Error(data.detail || 'Login failed');
      }
//Cookies are not stored in localStorage in my case. They are stored using document.cookie, which is accessible via JavaScript.

    // Set user cookie (non-HTTP-only for frontend access)
  document.cookie = `user=${encodeURIComponent(JSON.stringify({ //Same cookie name (user) So cookie #2 replaces cookie #1
    //Only one user cookie will be stored — the last one that gets set.
    id: data.user_id,
    name: data.name,
    email: data.email,
    team: data.team || null  // Handle case where user has no team
  }))}; path=/; max-age=${60*60*24*7}; secure=${process.env.NODE_ENV === 'production'}; SameSite=Lax`;

  // Redirect based on team status
  router.push(data.team_name ? '/tournament' : '/team');

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  //below we are using React + Tailwind CSS code

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${inter.className} mb-3 text-2xl`}>
          Please log in to continue.
        </h1>
        {error && (
          <div className="mb-4 flex items-center gap-1 text-red-500">
            <ExclamationCircleIcon className="h-4 w-4" />
            <p className="text-sm">{error}</p>
          </div>
        )}
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              {/* full-width block input */}
              {/* outlines the input with 2px when focused (default behavior enhanced) */}
              {/* rounded-md border border-gray-200: styled border and rounded corners

               py-[9px] pl-10: vertical padding, and left padding (pl-10) to make room for the icon */}
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)} //onChange: updates state as the user types
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          {/* //Adds top margin (mt-4) to space the element from the one above it. */}
          {/* block: makes the label a block element (so it sits above the input */}
          <div className="mt-4"> 
            {/* text-xs is a Tailwind CSS utility class that sets the font size to extra small. */}
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              {/* htmlFor="password" ties the label to the input with id="password" for accessibility. */}
              Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        <Button type="submit" className="mt-4 w-full">
          Log in <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
      </div>
    </form>
  );
}