import AcmeLogo from '@/app/ui/acme-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';

export default function Page() {
  return (
    // // These are Tailwind classes:
    // <main className="flex min-h-screen flex-col p-6">
    //   <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52"></div>
    // <main className="flex min-h-screen flex-col p-6">
      <main className="bg-black text-white">
      
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div >
        <div
  className="relative w-0 h-0 border-l-[15px] border-r-[15px] border-b-[26px] border-l-transparent border-r-transparent border-b-black"
/>
<img src="https://i.pinimg.com/736x/cf/5a/4d/cf5a4ddeacf305312a16f1ec304aa6d3.jpg" style={{ width: '100px', height: '100px' }}  />
          <p className={`text-xl text-white-1000 md:text-3xl md:leading-normal font- font-medium sm:w-auto justify-center`}>
            Welcome to PROGBATTLE - YOUR GATEWAY TO MISSION MAZE
          </p>
          <div className="flex flex-col gap-2 mt-4 ml-4">
          <Link
            href="/login"
            className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
          >
            <span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
          </div>
          <div className="flex flex-col gap-2 mt-4 ml-4">
          <Link
            href="/signin"
            className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
          >
            <span>Sign in</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
          </div>
        </div>
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          
      <img src="https://wallpapersok.com/images/high/cool-gaming-desktop-pac-man-vector-02vnnqwadou5hq2b.jpg"/> 
      
        </div>
        
      </div>
      
    </main>
  );
}
 
// import { inter } from '@/app/ui/fonts';
// import {
//   AtSymbolIcon,
//   KeyIcon,
//   ExclamationCircleIcon,
// } from '@heroicons/react/24/outline';
// import { ArrowRightIcon } from '@heroicons/react/20/solid';
// import { Button } from './ui/button';

//  function LoginForm() {
//   return (
//     <form className="space-y-3">
//       <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
//         <h1 className={`${inter.className} mb-3 text-2xl`}>
//           Please log in to continue.
//         </h1>
//         <div className="w-full">
//           <div>
//             <label
//               className="mb-3 mt-5 block text-xs font-medium text-gray-900"
//               htmlFor="email"
//             >
//               Email
//             </label>
//             <div className="relative">
//               <input
//                 className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
//                 id="email"
//                 type="email"
//                 name="email"
//                 placeholder="Enter your email address"
//                 required
//               />
//               <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
//             </div>
//           </div>
//           <div className="mt-4">
//             <label
//               className="mb-3 mt-5 block text-xs font-medium text-gray-900"
//               htmlFor="password"
//             >
//               Password
//             </label>
//             <div className="relative">
//               <input
//                 className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
//                 id="password"
//                 type="password"
//                 name="password"
//                 placeholder="Enter password"
//                 required
//                 minLength={6}
//               />
//               <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
//             </div>
//           </div>
//         </div>
//         <Button className="mt-4 w-full">
//           Log in <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
//         </Button>
//         <div className="flex h-8 items-end space-x-1">
//           {/* Add form errors here */}
//         </div>
//       </div>
//     </form>
//   );
// }

// export default function Page() {
//   return <div><LoginForm/></div>;
// }