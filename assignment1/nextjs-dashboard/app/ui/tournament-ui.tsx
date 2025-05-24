'use client';
import { useState, useEffect } from 'react';
import { getCookie } from 'cookies-next';
import MatchSimulation from './MatchSimulation'; // path to the component

interface UserData {
  name: string;
  email: string;
  user_id: number;
  team_name: string;
}
interface TeamType {
  team_id: number;
  team_name: string;
  team_score: number;
  members?: string[];
}

interface Team {
  id: number;
  name: string;
  score: number;
}

interface UserTeam {
  name: string;
  score: number;
  rank: number;
}

export default function Tournament() {
  const [user, setUser] = useState<UserData | null>(null);
  const [userTeam, setUserTeam] = useState<UserTeam>({
    name: '',
    score: 0,
    rank: 0
  });
  const [topTeams, setTopTeams] = useState<TeamType[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSimulation, setShowSimulation] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCanvas, setShowCanvas] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submissionStatus, setSubmissionStatus] = useState<{
    success: boolean;
    message: string;
    details: string;
    match_log?: any[]; 
  } | null>(null);

  // Load user and team data on component mount
  useEffect(() => {
    const loadData = async () => { //You define an async function loadData inside the useEffect.This lets you use await for fetching data.
      const userCookie = getCookie('user'); //Gets the user's data (probably stored as a JSON string).
      const token = getCookie('token'); //Gets the authentication token (JWT).
      
      if (userCookie) {

        const fetchTeams = async () => {
      try {
        const response = await fetch('http://localhost:8000/getteams');
        if (!response.ok) {
          throw new Error('Failed to fetch teams');
        }
        const data = await response.json();
        setTeams(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false); // Mark loading as complete
      }
    };
    fetchTeams();
        try {
          // Parse user data from cookies
          const userData = JSON.parse(userCookie.toString()); //userCookie.toString Converts the userCookie (which is probably a Buffer, or raw cookie value) into a string.
          //JSON.parse(...)Takes that string (which must be a valid JSON string) and converts it into a JavaScript object
          //We need userData as an object so we can access individual properties like id, email, team_name, etc., using dot notation. 
          setUser(userData);
          console.log(userData)
          console.log(userData.id)
          console.log(userData.email)

          // Set team name from user data
          setUserTeam({
            name: userData.team_name || `${userData.name}'s Team`,
            score: 0, // Will be updated from API
            rank: 0   // Will be updated from API
          });

          // Fetch top teams from API
          if (token) {
            const response = await fetch('http://localhost:8000/teams/top', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            const teamsData = await response.json();
            setTopTeams(teamsData);

            // Fetch user's team details
            const teamResponse = await fetch(`http://localhost:8000/users/${userData.id}/team`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            const teamData = await teamResponse.json();
            if (teamData.team) {
              setUserTeam({
                name: teamData.team.team_name,
                score: teamData.team.team_score,
                rank: teamData.team.rank || 0
              });
            }
          }
        } catch (e) {
          console.error('Error loading data:', e);
        }
      }
      
    };
    

    loadData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]); //// Save the first selected file
      setSubmissionStatus(null); //Clear any previous submission status. Stores the first selected file (e.target.files[0]) in state selectedFile
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!selectedFile) {
    setSubmissionStatus({ 
      success: false, 
      message: 'Please select a file before submitting' ,details : "",
    });
    return;
  }

  if (!selectedFile.name.endsWith('.py')) {
    setSubmissionStatus({ 
      success: false, 
      message: 'Only Python (.py) files are allowed' ,details : "",
    });
    return;
  }

  setIsSubmitting(true);

  //A file is selected.
//The file ends with .py (only Python files allowed).
//If validation fails, sets a failure status message and stops.
//Sets loading flag setIsSubmitting(true)
  

  try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            // const token = getCookie('token');

            // Get token from cookies
    const token = getCookie('token');
    if (!token) {
      throw new Error('Authentication required. Please login again.');
    }
    console.log(token)

            const response = await fetch('http://localhost:8000/uploadbot/', {
                method: 'POST',
                headers: {
        'Authorization': `Bearer ${token}`  // Add Authorization header
      },
                body: formData
                //multipart/form-data is a content type used in HTTP requests when we want to send files or binary data (like images, PDFs, or code files) along with regular form fields.Normally, when I submit a form, data is sent as application/x-www-form-urlencoded (like key=value&key2=value2).But if your my upload includes file uploads, I must use multipart/form-data.
                
                
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Submission failed');
            }

            setSubmissionStatus({ 
                success: true, 
                message: `Bot evaluated! Winner: ${data.winner}` 
                ,details : data.output, // Extract output details from backend
                match_log: data.match_log,
                
            });
            console.log("Match output:", data.output);
            console.log("Match logs:" ,data.match_log);
            // Show the simulation button after the match result is available
            setShowSimulation(true);
            

        
  } catch (error) {
    setSubmissionStatus({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Submission failed',
      details : ""
    });
  } finally {
    setIsSubmitting(false);
  }
};

//multipart/form-data = HTTP format to send files & form data together

//i define an interface here
//An interface in TypeScript is a way to define the shape of an object — which properties it has and their types — without providing implementation.
//It's like a blueprint that says:
//"This object should have a team_id property that's a number."
// //"It should have a team_name that's a string."
//Etc.

interface Team {
  team_id: number;
  team_name: string;
  team_score: number;
  created_at: string;
}

const sortedTeams = [...teams].sort((a, b) => b.team_score - a.team_score);



  // SVG Icon Components
  const TrophyIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
  );

  const UsersIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );

  const UploadIcon = () => (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-indigo-800 text-white p-4 flex flex-col">
        <div className="mb-8">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <TrophyIcon />
            Leaderboard
          </h2>
        </div>

        {/* Teams List */}
        <div className="mb-8 flex-1 overflow-y-auto">
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-2">
            Registered Teams ({teams.length})
          </h3>
          
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            </div>
          ) : error ? (
            <p className="text-red-300 text-sm">{error}</p>
          ) : teams.length === 0 ? (
            <p className="text-indigo-200">No teams registered yet</p>
          ) : (
            <ul className="space-y-3">
              {sortedTeams.map((team, index) => (
                <li 
                  key={team.team_id}
                  className="bg-indigo-700 rounded-lg p-3 hover:bg-indigo-600 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">
                        <span className="text-yellow-300 mr-2">#{index + 1}</span>
                        {team.team_name}
                      </h4>
                      
                    </div>
                    <span className="bg-indigo-900 px-2 py-1 rounded text-sm">
                      {team.team_score} pts
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Refresh Button */}
        <button
          onClick={() => window.location.reload()}
          className="mt-auto bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
        >
          Refresh Leaderboard
        </button>
      

        {/* User Team */}
        <div className="mt-auto">
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
            <UsersIcon />
            Your Team
          </h3>
          <div className="bg-indigo-700 p-3 rounded-lg">
            <p className="font-medium">{userTeam.name}</p>
            <div className="flex justify-between mt-1">
              <span className="text-sm">Score</span>
              <span className="text-yellow-300 font-medium">{userTeam.score}</span>
            </div>
          </div>
        </div>
        </div>
      

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Hello, {user?.name || 'Team Member'}!
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Welcome to the Tournament, {userTeam?.name || 'Your Team'}!
          </h2>
          <p>This is ROUND-1</p>
          <p className="text-gray-600 mb-6">
            Submit your Python bot file to compete against the system bot. The top performers will 
            advance to ROUND-2 where the bots will compete with each other to get the Title of PROGBATTLE WINNER.
          </p>
          <p>In the match results, bot1 refers to the system bot while bot2 refers to your team's bot</p>
          <p>Scoring policy :</p>
          <p>If Bot1 wins, team score = score of Bot2</p>
          <p>If Bot2 wins, team score = score of Bot2 + score of Bot1 </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <UploadIcon />
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="text-indigo-600 font-medium">
                  {selectedFile ? selectedFile.name : 'Click to select your Python file'}
                </span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  accept=".py"
                  onChange={handleFileChange}
                />
              </label>
              <p className="text-xs text-gray-500 mt-2">Only .py files accepted</p>
            </div>

            {submissionStatus && (
              <div className={`p-3 rounded-md ${
                submissionStatus.success 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {submissionStatus.message}
                <pre >
      {submissionStatus.details}
    </pre>
              </div>
            )}

            

            <button
              type="submit"
              disabled={isSubmitting || !selectedFile}
              className={`w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                isSubmitting || !selectedFile ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Bot'}
            </button>
          </form>
        </div>
{/* Show the simulation button if the match is over */}
      {showSimulation && (
        <button onClick={() => setShowCanvas(true)} style={{
      padding: '10px 20px',
      backgroundColor: '#4CAF50', // Green color
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
      transition: 'all 0.3s ease',
      margin: '10px 0',
     
      
    }} >
          Show Simulation
        </button>
      )}
       {/* Canvas Simulation (conditionally shown after button click) */}
      {showCanvas && submissionStatus?.match_log && (
        <MatchSimulation matchLog={submissionStatus.match_log} />
      )}
      

        {/* Tournament Rules */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Tournament Rules</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            
            <li>Bots must be written in Python 3.8+</li>
            
            <li>No malicious code allowed</li>
          </ul>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="text-gray-500 italic">
            {submissionStatus?.success 
              ? `Your bot "${selectedFile?.name.replace('.py', '')}" is in the queue` 
              : 'No recent submissions yet'}
          </div>
        </div>
      </div>
    </div>
  );
}