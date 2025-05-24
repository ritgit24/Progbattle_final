// import AcmeLogo from '@/app/ui/acme-logo';
// import { ArrowRightIcon } from '@heroicons/react/24/outline';
// import Link from 'next/link';
// import Image from 'next/image';

// export default function Page() {
//   return (
//     // // These are Tailwind classes:
//     // <main className="flex min-h-screen flex-col p-6">
//     //   <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52"></div>
//     // <main className="flex min-h-screen flex-col p-6">
//       <main className="bg-black text-white">
      
//       <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
//         <div >
//         <div
//   className="relative w-0 h-0 border-l-[15px] border-r-[15px] border-b-[26px] border-l-transparent border-r-transparent border-b-black"
// />
// <img src="https://i.pinimg.com/736x/cf/5a/4d/cf5a4ddeacf305312a16f1ec304aa6d3.jpg" style={{ width: '100px', height: '100px' }}  />
//           <p className={`text-xl text-white-1000 md:text-3xl md:leading-normal font- font-medium sm:w-auto justify-center`}>
//             Welcome to PROGBATTLE - YOUR GATEWAY TO MISSION MAZE
//           </p>
//           <div className="flex flex-col gap-2 mt-4 ml-4">
//           <Link
//             href="/login"
//             className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
//           >
//             <span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
//           </Link>
//           </div>
//           <div className="flex flex-col gap-2 mt-4 ml-4">
//           <Link
//             href="/signin"
//             className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
//           >
//             <span>Sign in</span> <ArrowRightIcon className="w-5 md:w-6" />
//           </Link>
//           </div>
//         </div>
//         <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          
//       <img src="https://wallpapersok.com/images/high/cool-gaming-desktop-pac-man-vector-02vnnqwadou5hq2b.jpg"/> 
      
//         </div>
        
//       </div>
      
//     </main>
//   );
// }
 
// import { ArrowRightIcon } from '@heroicons/react/24/outline';
// import Link from 'next/link';

// export default function Page() {
//   return (
//     <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
//       <div className="container mx-auto px-6 py-12 flex flex-col md:flex-row items-center">
//         {/* Left Column - Content */}
//         <div className="md:w-1/2 space-y-8">
//           <div className="space-y-4">
//             <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
//               PROGBATTLE
//             </h1>
//             <h2 className="text-xl md:text-2xl font-medium text-gray-300">
//               YOUR GATEWAY TO MISSION MAZE
//             </h2>
//             <p className="text-gray-400">
//               Compete, conquer, and climb the leaderboards in our programming battle arena
//             </p>
//           </div>

//           {/* Auth Buttons */}
//           <div className="flex flex-col space-y-4 w-full max-w-xs">
//             <Link
//               href="/login"
//               className="flex items-center justify-between rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3 text-sm font-medium text-white transition-all hover:from-blue-500 hover:to-blue-400 hover:shadow-lg md:text-base"
//             >
//               <span>Log in</span>
//               <ArrowRightIcon className="w-5 h-5" />
//             </Link>
            
//             <Link
//               href="/signin"
//               className="flex items-center justify-between rounded-lg bg-gradient-to-r from-purple-600 to-purple-500 px-6 py-3 text-sm font-medium text-white transition-all hover:from-purple-500 hover:to-purple-400 hover:shadow-lg md:text-base"
//             >
//               <span>Sign up</span>
//               <ArrowRightIcon className="w-5 h-5" />
//             </Link>
//           </div>
//         </div>

//         {/* Right Column - Visual Element */}
//         <div className="md:w-1/2 mt-12 md:mt-0">
//           <div className="relative">
//             {/* Abstract tech pattern */}
//             <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48cmVjdCB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjM2I0OTYxIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=')] opacity-20"></div>
            
//             {/* Code terminal mockup */}
//             <div className="relative bg-gray-800 rounded-xl p-6 shadow-2xl border border-gray-700">
//               <div className="flex space-x-2 mb-4">
//                 <div className="w-3 h-3 rounded-full bg-red-500"></div>
//                 <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
//                 <div className="w-3 h-3 rounded-full bg-green-500"></div>
//               </div>
//               <div className="font-mono text-sm text-green-400">
//                 <p>$ npm start battle</p>
//                 <p className="mt-2 text-white">Initializing mission maze...</p>
//                 <p className="text-blue-400">Loading challenges ███████▒ 90%</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }

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