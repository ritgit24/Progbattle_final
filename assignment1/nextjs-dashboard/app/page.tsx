import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Header with Auth Buttons */}
      <header className="flex justify-end p-6">
        <div className="flex space-x-4">
          <Link
            href="/login"
            className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 md:text-base"
          >
            <span>Log in</span>
          </Link>
          <Link
            href="/signin"
            className="flex items-center rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-500 md:text-base"
          >
            <span>Sign up</span>
          </Link>
        </div>
      </header>

      {/* Centered Content */}
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
        {/* Main Title */}
        <h1 className="text-5xl md:text-6xl font-bold mb-8 font-['Poppins'] tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            PROGBATTLE
          </span>
        </h1>
        
        {/* Subtitle */}
        <h2 className="text-xl md:text-2xl font-medium text-gray-300 mb-12 font-['Inter']">
          YOUR GATEWAY TO MISSION MAZE
        </h2>

        {/* Terminal Image */}
        <div className="max-w-md w-full bg-gray-800 rounded-xl p-6 shadow-2xl border border-gray-700">
          <div className="flex space-x-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="font-mono text-sm text-green-400">
            <p>$ npm start battle</p>
            <p className="mt-2 text-white">Initializing mission maze...</p>
            <p className="text-blue-400">Loading challenges ███████▒ 90%</p>
          </div>
        </div>
      </div>
    </main>
  );
}