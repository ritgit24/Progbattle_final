(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/app_d47089._.js", {

"[project]/app/ui/round2.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
// // components/Round2AdminPanel.tsx
// import { useState } from 'react';
// export default function Round2AdminPanel({ isAdmin }: { isAdmin: boolean }) {
//   const [isLoading, setIsLoading] = useState(false);
//   const [results, setResults] = useState<any>(null);
//   const [error, setError] = useState<string | null>(null);
//   const triggerRound2 = async () => {
//     if (!isAdmin) return;
//     setIsLoading(true);
//     setError(null);
//     try {
//       const response = await fetch('http://localhost:8000/start-round2/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });
//       if (!response.ok) {
//         throw new Error(await response.text());
//       }
//       const data = await response.json();
//       setResults(data);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to start tournament');
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   if (!isAdmin) return null;
//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold mb-4 text-center">Round 2 Tournament</h2>
//       <div className="flex justify-center mb-6">
//         <button
//           onClick={triggerRound2}
//           disabled={isLoading}
//           className={`px-6 py-3 rounded-md text-white font-medium ${
//             isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
//           }`}
//         >
//           {isLoading ? 'Running Tournament...' : 'Start Round 2'}
//         </button>
//       </div>
//       {error && (
//         <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-md">
//           Error: {error}
//         </div>
//       )}
//       {results && (
//         <div className="mt-6 space-y-4">
//           <h3 className="text-xl font-semibold">Tournament Results</h3>
//           <div className="grid grid-cols-3 gap-4 font-medium bg-gray-100 p-2 rounded-t-md">
//             <div>Match</div>
//             <div>Winner</div>
//             <div>Details</div>
//           </div>
//           {results.matches?.map((match: any, index: number) => (
//             <div key={index} className="grid grid-cols-3 gap-4 border-b py-2">
//               <div>{match.team1_name} vs {match.team2_name}</div>
//               <div className={match.winner === 'unknown' ? 'text-yellow-600' : 'text-green-600'}>
//                 {match.winner_name}
//               </div>
//               <div className="text-sm text-gray-600 truncate">
//                 {match.output?.split('\n')[0] || 'No details'}
//               </div>
//             </div>
//           ))}
//           <div className="p-4 bg-gray-50 rounded-b-md">
//             <p><strong>Total Matches:</strong> {results.total_matches}</p>
//             <p><strong>Winning Teams:</strong> {results.summary?.winners?.join(', ') || 'None'}</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
__turbopack_esm__({});
'use client';
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
 // export default function Round2AdminPanel() {
 //   const [isLoading, setIsLoading] = useState(false);
 //   const [results, setResults] = useState<any>(null);
 //   const [error, setError] = useState<string | null>(null);
 //   const triggerRound2 = async () => {
 //     setIsLoading(true);
 //     setError(null);
 //     const token = getCookie('token');
 //         if (!token) 
 //             {
 //           throw new Error('Authentication required. Please login again.');
 //         }
 //     try {
 //       const response = await fetch('http://localhost:8000/start-round2/', {
 //         method: 'POST',
 //         headers: {
 //           'Content-Type': 'application/json',
 //           'Authorization': `Bearer ${token}`
 //         }
 //       });
 //       if (!response.ok) {
 //         const errorData = await response.json();
 //         throw new Error(errorData.detail || 'Failed to start tournament');
 //       }
 //       const data = await response.json();
 //       setResults(data);
 //     } catch (err) {
 //       setError(err instanceof Error ? err.message : 'Failed to start tournament');
 //     } finally {
 //       setIsLoading(false);
 //     }
 //   };
 //   return (
 //     <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
 //       <h2 className="text-2xl font-bold mb-4 text-center">Round 2 Tournament</h2>
 //       <div className="flex justify-center mb-6">
 //         <button
 //           onClick={triggerRound2}
 //           disabled={isLoading}
 //           className={`px-6 py-3 rounded-md text-white font-medium ${
 //             isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
 //           }`}
 //         >
 //           {isLoading ? 'Running Tournament...' : 'Start Round 2'}
 //         </button>
 //       </div>
 //       {error && (
 //         <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-md">
 //           Error: {error}
 //         </div>
 //       )}
 //       {results && (
 //         <div className="mt-6 space-y-4">
 //           <h3 className="text-xl font-semibold">Tournament Results</h3>
 //           <div className="grid grid-cols-3 gap-4 font-medium bg-gray-100 p-2 rounded-t-md">
 //             <div>Match</div>
 //             <div>Winner</div>
 //             <div>Details</div>
 //           </div>
 //           {results.matches?.map((match: any, index: number) => (
 //             <div key={index} className="grid grid-cols-3 gap-4 border-b py-2">
 //               <div>{match.team1_name} vs {match.team2_name}</div>
 //               <div className={match.winner === 'unknown' ? 'text-yellow-600' : 'text-green-600'}>
 //                 {match.winner_name}
 //               </div>
 //               <div className="text-sm text-gray-600 truncate">
 //                 {match.output?.split('\n')[0] || 'No details'}
 //               </div>
 //             </div>
 //           ))}
 //           <div className="p-4 bg-gray-50 rounded-b-md">
 //             <p><strong>Total Matches:</strong> {results.total_matches}</p>
 //             <p><strong>Winning Teams:</strong> {results.summary?.winners?.join(', ') || 'None'}</p>
 //           </div>
 //         </div>
 //       )}
 //     </div>
 //   );
 // }
 // export default function Round2AdminPanel() {
 //   const [isLoading, setIsLoading] = useState(false);
 //   const [tournamentData, setTournamentData] = useState<{
 //     status?: string;
 //     total_matches?: number;
 //     matches?: Array<{
 //       team1_name: string;
 //       team2_name: string;
 //       winner_name: string;
 //       output: string;
 //     }>;
 //     summary?: {
 //       winners: string[];
 //     };
 //   } | null>(null);
 //   const [error, setError] = useState<string | null>(null);
 //   const triggerRound2 = async () => {
 //     setIsLoading(true);
 //     setError(null);
 //     const token = getCookie('token');
 //         if (!token) 
 //             {
 //           throw new Error('Authentication required. Please login again.');
 //         }
 //     try {
 //       const response = await fetch('http://localhost:8000/start-round2/', {
 //         method: 'POST',
 //         headers: {
 //           'Content-Type': 'application/json',
 //           'Authorization': `Bearer ${token}`
 //         }
 //       });
 //       if (!response.ok) {
 //         throw new Error(`HTTP error! status: ${response.status}`);
 //       }
 //       const data = await response.json();
 //       console.log("Backend response:", data); // Debug log
 //       setTournamentData(data);
 //     } catch (err) {
 //       console.error("Tournament error:", err);
 //       setError(err instanceof Error ? err.message : 'Failed to start tournament');
 //     } finally {
 //       setIsLoading(false);
 //     }
 //   };
 //   return (
 //     <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
 //       <h2 className="text-2xl font-bold mb-4 text-center">Round 2 Tournament</h2>
 //       <div className="flex justify-center mb-6">
 //         <button
 //           onClick={triggerRound2}
 //           disabled={isLoading}
 //           className={`px-6 py-3 rounded-md text-white font-medium ${
 //             isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
 //           }`}
 //         >
 //           {isLoading ? 'Running Tournament...' : 'Start Round 2'}
 //         </button>
 //       </div>
 //       {error && (
 //         <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-md">
 //           Error: {error}
 //         </div>
 //       )}
 //       {tournamentData && (
 //         <div className="mt-6 space-y-4">
 //           <h3 className="text-xl font-semibold">Tournament Results</h3>
 //           <div className="grid grid-cols-3 gap-4 font-medium bg-gray-100 p-2 rounded-t-md">
 //             <div>Match</div>
 //             <div>Winner</div>
 //             <div>Details</div>
 //           </div>
 //           {tournamentData.matches?.map((match, index) => (
 //             <div key={index} className="grid grid-cols-3 gap-4 border-b py-2">
 //               <div>{match.team1_name} vs {match.team2_name}</div>
 //               <div className={match.winner_name === 'Draw' ? 'text-yellow-600' : 'text-green-600'}>
 //                 {match.winner_name}
 //               </div>
 //               <div className="text-sm text-gray-600 truncate">
 //                 {match.output.split('\n')[0] || 'No details'}
 //               </div>
 //             </div>
 //           ))}
 //           <div className="p-4 bg-gray-50 rounded-b-md">
 //             <p><strong>Total Matches:</strong> {tournamentData.total_matches}</p>
 //             <p><strong>Winning Teams:</strong> 
 //               {tournamentData.summary?.winners?.length 
 //                 ? tournamentData.summary.winners.join(', ') 
 //                 : 'None'}
 //             </p>
 //           </div>
 //         </div>
 //       )}
 //     </div>
 //   );
 // }
}}),
"[project]/app/round2start/page.tsx [app-rsc] (ecmascript, Next.js server component, client modules)": ((__turbopack_context__) => {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
}}),
}]);

//# sourceMappingURL=app_d47089._.js.map