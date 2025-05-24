TASK-PROGBATTLE

A web portal where users can upload their bots to fight against the other bots and see the simulation video of the match to improve their bots.

EXPLAINING THE WORKFLOW OF MY WEBPAGE UI :

The web application opens with a home page wherein I have displayed the title of the tournament as Progbattle, and contains a login and a signup button.
When a new user checks in the home page, he/she should click on the sign in button to participate in the tournament. 
Upon successful signin , an alert message “Successful signin “is displayed on the screen and the user is automatically navigated to the login page. 
Upon filling in the credentials correctly, the user is automatically navigated to the Create Teams Portal.
(If an already existing user logs in, who has created a team previously, then he/she will be automatically navigated to the tournament page upon login.A person can create only one team using the same email and password)
Here I have decided that each team will have a single person. The user creates his/her team by entering the team name and this team name is registered in the “teams” table of my database. 
The team score is set to 0 initially. The teams table has team_id, team_name, created_by , team_score as its columns.
Upon successful team creation, the user is automatically directed to the tournament portal where the tournament portal , in a customizable manner,  displays the user’s name, the user’s team name, the team’s score , etc. 
The tournament page also has a leaderboard to its left side, which displays the registered teams in a descending order of their score. 
The leaderboard has a refresh button too, which refreshes the leaderboard(to update the team scores if match is fought). 
I have displayed the match rules and scoring policies for teams on the screen.
The users can submit their bot files by clicking on the “Submit Bot” option to fight against  the system bot in ROUND 1 ,and wait for the match results to be displayed. 
Once the match is over and the match details and winner are updated on the screen, the team’s score is also updated in the database. 
Consequenly, a show simulation button appears on the screen. Upon clicking this button, a simulation of the bot match is shown on the screen using HTML canvas, done using the frontend.
Upon clicking the refresh button, the team’s updated scores are visible on the leaderboard too.

EXPLAINING MY CODE : 
I have submitted a main folder called Campus Compass, which has 2 subfolders : assignment1/nextjs-dashboard and backendnew. 
My backendnew contains the backend files, written in python and the former folder contains the frontend written in nextjs. 

Backend : 
1.My routing file is app.py, which contains my database manager and has the routes :
/login, /signin, /team, / uploadbot, /getteams, / teams, etc.
2.I have used psycopg2 as my database connection manager. I have used FASTAPI app to handle my requests, and uvicorn to start the ASGI server on localhost-8000. 
3.I have used pydantic Basemodels as models for various entities in my system. For example, class UserCreate(BaseModel): 
    email: str
    password: str
    name: str
is the model used for a user signup. 
4.To hash the passwords, I have used the passlib Python library and the algorithm used is HMAC using SHA-256.
5. I have used Dependency injection at various places in my code for example : 
async def get_current_user(token: str = Depends(oauth2_scheme)): 
    credentials_exception = HTTPException(
#code )
Here FastAPI dependency extracts and decodes the current user's JWT token. Depends(oauth2_scheme) extracts the token from the Authorization: Bearer header.
6. I have implemented CORS middleware in my system using from CORSMiddleware from fastapi.middleware.cors 
7. ABOUT THE /uploadbot/ route (The heart of the web application )
•	Accepts a file (UploadFile) and the current authenticated user via dependency injection (Depends(get_current_user)).
•	Validates that the uploaded file ends with .py.
•	Generates a unique filename using uuid4() to prevent name collisions.
•	Saves the uploaded file to the server using shutil.copyfileobj() — this copies the file’s contents from the upload stream to a real file on disk.
•	I have used subprocess.run() to execute a match between:
       A pre-defined system bot (SYSTEM_BOT_PATH)
The uploaded bot file
•	The subprocess runs a Python script (ENGINE_PATH) that handles the match logic.
•	The code captures stdout and stderr from the match.
•	If the match fails (non-zero return code in stderr), returns an error.
• The code looks through the output for a line like "Winner: bot1" to determine the winner.
•	Parses the full match output using parse_match_output() to extract scores
•	Based on the scores, I have calculated a new team score.
•	It Updates the user’s team score in the database (teams table) using their user_id.
•	The code returns a structured JSON response with:
The full output
The winner
Status of the operation
The match logs
•	The code then deletes the temporary uploaded bot file from disk to avoid clutter.

I have tried to well comment my app.py file to explain my code to the fullest.

FRONTEND – 
1.	The folder hierarchy stands as 
assignment1/nextjs-dashboard
          /app
  	           page.tsx
  	           layout.tsx 
               /team
               /tournament
               /ui ->    /MatchSimulation.tsx
                         /tournament-ui.tsx
                         /login-form.tsx 
                         /sigin-form.tsx
                         /team-management.tsx
  	
2.Features

Authentication System : Users can sign up, log in, and get JWT-based authentication tokens.
Team Management : Users can create and view their teams. Team scores are displayed in a leaderboard.
Bot Upload : Users can upload `.py` files (Python bots) which are evaluated in a backend match engine.
Match Result Display :
  - After a bot upload, match results are shown (winner, score).
  - A "Show Simulation" button allows visual replay of the match using HTML canvas.
Leaderboard : Displays all teams ranked by score, and gets refreshed upon clicking the refresh button.

3.UI Structure

- `/signup` and `/login` pages for authentication
- `/teams ` for user operations (create team)
- `/tournament ` for viewing all teams and bot upload
- Simulation rendered using  HTML Canvas after a match
  
4.	The ui folder contains various files such as login-form, signin-form, tournament-ui, team-management, etc. which are the Frontend files for /login , / signin , /tournament and /teams respectively.
5.	FOR THE CODE, I have used Typescript + Javascript along with Tailwind CSS. 

6.	My nextjs-dashboard folder also contains a global.css file. This file basically combines Tailwind CSS directives with custom styling for <input type="number"> elements.


To RUN LOCALLY IN LINUX:-

1. Clone the repository
git clone https://github.com/ritgit24/Progbattle_final
cd backendnew
 2. Create and activate a Python virtual environment
python3 -m venv venv
3. Install dependencies
pip install -r requirements.txt 
4. Start the server
python app.py
Use cd.. command to go back to main directory
1.Now to navigate to the frontend folder
   cd assignment1/nextjs-dashboard
2. To install the dependencies 
   npm install  
3. To  start the developement server
   npm run dev 

TEST USING POSTMAN 
To test the backend routes using postman, run the following steps :

1.POST /signup
•	URL: http://localhost:8000/signup
•	Body:
o	Select Body → raw → choose JSON format
o	Provide:
json
{
  "email": "test@example.com",
  "password": "yourpassword",
  "name": "Test User"
}

3. POST /login
•	URL: http://localhost:8000/login
•	Body:
o	Select Body → raw → choose JSON
o	Provide:
json
{
  "email": "test@example.com",
  "password": "yourpassword"
}
Response: json
{
  "access_token": "<JWT_TOKEN>",
  "token_type": "bearer",
  "name": "Test User",
  "email": "test@example.com",
  "user_id": 1,
  "has_team": false,
  "team_name": null
}

4. GET /users/{user_id}/team
•	URL:  http://localhost:8000/users/1/team  (Replace 1 with your user_id)
•	Authorization Tab:
o	Type: Bearer Token
o	Token: Paste the access_token from login response
If no team exists:
json
{
  "has_team": false,
  "team": null
}

5. POST /uploadbot/
URL:  http://localhost:8000/uploadbot/
•	Authorization: Bearer Token with your token.
•	Body → form-data:
o	Key: file
  Type: File
	Upload a .py file (your bot).
 Response: json
{
  "status": "success",
  "output": "Final Score: {'bot1': 5, 'bot2': 2}\nWinner: bot1",
  "winner": "bot1",
  "match_log": [...]
}

6.	GET  http://localhost:8000/users/1/team
•	Replace 1 with your user ID.
•	Authorization: Bearer token
Response: json
{
  "has_team": true,
  "team": {
    "team_id": 1,
    "team_name": "TeamA",
    "created_by": 1,
    "team_score": 2
  }
}

7. GET /getteams
•	URL: http://localhost:8000/getteams
•	Response: List of teams (in JSON)







