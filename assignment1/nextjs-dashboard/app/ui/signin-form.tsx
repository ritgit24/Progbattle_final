"use client"; 
// Mark as Client Component

import { inter } from '@/app/ui/fonts';
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from './button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SigninForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();


  const handleSubmit = async (e: React.FormEvent) => { //declares an asynchronous event handler function for a form submission in TypeScript + React.
    //Marks the function as asynchronous, meaning it can use await inside to handle asynchronous operations like API calls.await allows you to pause execution until a Promise resolves — useful for API requests like fetch()
    e.preventDefault();
    setError('');

    try {
      const response = await fetch("http://localhost:8000/signup", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        throw new Error('Failed to sign in');
      }

      const data = await response.json();
      console.log('User created:', data);
      alert('Sign-in successful!');
      router.push('/login');
    } catch (err) {
  if (err instanceof Error) {
    setError(err.message);
  } else {
    setError('Something went wrong');
  }
}
  };
  return (
    <form className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${inter.className} mb-3 text-2xl`}>
          Please signin in to continue.
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          
        </div>
        <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Name
            </label>
        <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="name"
                type="text"
                name="name"
                placeholder="Enter your name"
                onChange={(e) => setName(e.target.value)}
                required
                minLength={6}
              />
        <Button className="mt-4 w-full" onClick={handleSubmit}>
          Sign in<ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
        <div className="flex h-8 items-end space-x-1">
          {/* Add form errors here */}
        </div>
      </div>
    </form>
  );
}
