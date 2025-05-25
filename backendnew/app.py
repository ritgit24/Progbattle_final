from fastapi import FastAPI, HTTPException, Depends, status, Form
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from passlib.context import CryptContext
import psycopg2
from psycopg2.extras import RealDictCursor
import os
from typing import Optional
from contextlib import contextmanager
from fastapi.responses import JSONResponse
from fastapi import  File, UploadFile
import shutil   ##shutil copies file content from one file-like object to another.
import subprocess
import uuid #to give unique names to the stored files
from pathlib import Path
import sys
from typing import List
import ast
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List
from fastapi import BackgroundTasks
import json
from io import StringIO
import sys
#to Initialize FastAPI
app = FastAPI() ## This creates FastAPI application. A FastAPI app is an instance of the FastAPI class — essentially our web application object.we define routes (API endpoints) on this app using decorators like @app.get(), @app.post(), etc.
#the app is more of like a backend application
#When you run the app (e.g., with Uvicorn), it listens for HTTP requests and handles them according to the routes you defined.

# # UPLOAD_DIR = "/tmp"
# UPLOAD_DIR = tempfile.gettempdir()
# SYSTEM_BOT_PATH = "bot1.py"  # This will automatically set UPLOAD_DIR to a valid temporary directory based on the operating system.
# # What tempfile.gettempdir() returns
# #Windows: Something like C:\Users\<YourUsername>\AppData\Local\Temp
# ENGINE_PATH = "engine.py"
# Configuration
UPLOAD_DIR = "user_bots"  #directory to store user-uploaded bots.
ENGINE_PATH = "engine.py" #path to our match engine script.
SYSTEM_BOT_PATH = "bot1.py" #path to the system's default bot (against which the user's bot competes).

#sycopg2 is a popular PostgreSQL database adapter for Python.
#In simple terms:
#It allows our Python code to connect to, interact with, and perform SQL queries on a PostgreSQL database.

# Create upload directory if not exists
Path(UPLOAD_DIR).mkdir(parents=True, exist_ok=True) 
#Ensures the upload directory exists.
#If it doesn't, it will be created, including parent directories if needed.

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# JWT Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
ALGORITHM = "HS256" #The client and server agree on this algorithm to encode/decode the JWT. HMAC using SHA-256 (a symmetric key algorithm)
ACCESS_TOKEN_EXPIRE_MINUTES = 30 #Tokens will expire after 30 minutes.This is a global config value that says tokens should expire after 30 minutes.
#It’s just a constant — not automatically used unless you pass it somewhere.
# #The SECRET_KEY must be kept secret, or anyone could forge valid tokens.

#It's like the password used to lock/unlock a session.

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto") #This line sets up a password hashing configuration using the passlib library.
#telling passlib to use the bcrypt algorithm for hashing.
# CryptContext Comes from the passlib.context module. It provides a standardized way to hash and verify passwords.
#his tells passlib: "If I ever change the hashing scheme in the future, mark the old one as deprecated automatically."
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login") 

# Database connection manager
#os.getenv is a Python function used to read environment variables(though i have directly used the values here)

@contextmanager
def get_db(): #Function to open a DB connection and ensure it gets closed properly
    conn = None #Prepares a variable conn to hold the connection object.
    try:
        conn = psycopg2.connect(
            host=os.getenv("DB_HOST", "localhost"),
            database=os.getenv("DB_NAME", "progbattle"),
            user=os.getenv("DB_USER", "postgres"),
            password=os.getenv("DB_PASSWORD", "ritikaSQL"),
            cursor_factory=RealDictCursor #RealDictCursor makes query results return as dictionaries, not tuples.
        )
        #get_db is a custom function you've defined yourself using the @contextmanager decorator from Python's contextlib module.Its purpose is to:Open a PostgreSQL database connection using psycopg2 (not SQLAlchemy),


        yield conn #Makes conn available to the calling code (e.g., with get_db() as conn:)
    except psycopg2.OperationalError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database connection failed"
        )
    finally:
        if conn:
            conn.close() #Ensures the DB connection is always closed, whether or not an error occurred.

# Models
class UserCreate(BaseModel): #Model for user registration input.
    email: str
    password: str
    name: str

class UserLogin(BaseModel): #Model for login input.
    email: str
    password: str

class Token(BaseModel): #Defines the structure of the JWT token response.
    access_token: str
    token_type: str
    name: str
    email: str
    user_id: int

class TeamCreate(BaseModel): #Used when creating a new team.
    team_name: str

class TeamResponse(BaseModel): #Model for returning team data.
    team_id: int
    team_name: str
    created_by: int
    team_score: int

# Helper functions
def verify_password(plain_password: str, hashed_password: str): #Checks if the user-provided password matches the hashed password in DB.
    return pwd_context.verify(plain_password, hashed_password) #pwd_context is an object from the Passlib library. #Hashes the plain_password using the same algorithm (bcrypt).Compares it to hashed_password.

def get_user(email: str): #Retrieves a user by email from the DB.
    with get_db() as conn:
        with conn.cursor() as cursor:
            cursor.execute(
                "SELECT * FROM users WHERE email = %s",
                (email,)
            )
            return cursor.fetchone()

def authenticate_user(email: str, password: str):  #Authenticates the user by Looking them up by email. Verifying the password. Returning the user if valid, else None
    user = get_user(email)
    if not user:
        return None
    if not verify_password(password, user["password_hash"]):
        return None
    return user #this is returned as a dict aince we are using realDictcursor(line 78)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None): #Creates a JWT token with user data.Our setting is also to expire the jwt token after 15 min
    to_encode = data.copy() #Makes a copy so the original data isn't modified.
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15) #Sets the token's expiration time (default: 15 minutes).
    to_encode.update({"exp": expire})  #Adds the expiration to the payload and encodes it using the secret and algorithm (HS256)
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


async def get_current_user(token: str = Depends(oauth2_scheme)): #FastAPI dependency that extracts and decodes the current user's JWT token. Depends(oauth2_scheme) extracts the token from the Authorization: Bearer header.
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id") #Extracts user_id from the payload.
        if user_id is None:
            raise credentials_exception
        
        # Return minimal necessary data
        return {
            "user_id": user_id,  # Essential for DB operations
            "is_active": True    # Optional: for activity checks
        }
        
    except JWTError as e:
        raise credentials_exception
#Dependency Injection is a design pattern where you don’t create dependencies inside a function/class,
#  but instead you provide them from outside.def greet_user():
#name = "Alice"
#print(f"Hello, {name}!")
#read_users() needs a database.
#Instead of creating it inside, we use Depends(get_db) to inject it from the outside.

def send_verification_email(to_email: str, user_name: str):
    sender_email = "rbatra06avengers@gmail.com"
    app_password = "hywu icln mava xtmy"  # Not your Gmail password!

    # Email content
    subject = "Verify your email address"
    body = f"""
    Hello {user_name},

    Thanks for signing up! Please click the link below to verify your Gmail address.
    verification_link = f"http://localhost:8000/verify?email={to_email}"

    We hope you have a good journey with us and enjoy our game. 

    Best,
    Team ProgBattle
    """

    msg = MIMEMultipart()
    msg["From"] = sender_email
    msg["To"] = to_email
    msg["Subject"] = subject

    msg.attach(MIMEText(body, "plain"))

    # Send the email
    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(sender_email, app_password)
        server.send_message(msg)
        print("Verification email sent.")


# now i am defining the variious routes used in my web portal   
@app.post("/signup") #Pydantic Models (used in FastAPI, data validation) #a model in Python refers to a class that represents data 
#These models define and validate the structure of incoming or outgoing data using Python classes.
#Pydantic is a Python library used to: #Define data models using regular Python classes. #Validate and parse data automatically (e.g. from JSON, user input).
async def create_user(user: UserCreate):
    hashed_password = pwd_context.hash(user.password)
    if user.email.endswith("@gmail.com"):
     send_verification_email(user.email, user.name)
    try:
        with get_db() as conn:
            with conn.cursor() as cursor:
                # Check if email already exists
                cursor.execute(
                    "SELECT 1 FROM users WHERE email = %s",
                    (user.email,)
                )
                if cursor.fetchone():
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Email already exists"
                    )

                # Create new user
                cursor.execute(
                    """
                    INSERT INTO users (email, password_hash, name)
                    VALUES (%s, %s, %s)
                    RETURNING user_id, email, name
                    """,
                    (user.email, hashed_password, user.name)
                )
                new_user = cursor.fetchone() #This line fetches one row from the result of a SQL query.#The first row of the result (as a dictionary if using RealDictCursor) is returned by fetchtone
                conn.commit() #This saves changes you made to the database during this connection.
                return new_user
    
    except psycopg2.IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already exists"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
    

    
@app.get("/protected") #made this to test a protected route
async def protected_route(current_user: dict = Depends(get_current_user)):
    return {
        "message": "You are authenticated",
        "user": current_user
    }

@app.post("/login")
async def login_for_access_token(user: UserLogin):
    authenticated_user = authenticate_user(user.email, user.password) #returns the user as a dict
    if not authenticated_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    #here by mistake I have craeted the token twice
    access_token = create_access_token(
        data={"sub": authenticated_user["email"], "user_id": authenticated_user["user_id"]},
        expires_delta=access_token_expires
    )
    
    print(f"Checking team for user_id: {authenticated_user['user_id']}")

    
    with get_db() as conn:
        with conn.cursor() as cursor:
            cursor.execute(
                "SELECT team_name FROM teams WHERE created_by = %s",
                (authenticated_user["user_id"],)  # Properly closed tuple
            )
            team = cursor.fetchone() #If a team exists, team is a dictionary like {"team_name": "TeamX"}.
            print(f"Team query result: {team}")
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": authenticated_user["email"], "user_id": authenticated_user["user_id"]},
        expires_delta=access_token_expires
    )


    response_data = {
    "access_token": access_token,
    "token_type": "bearer",
    "name": authenticated_user["name"],
    "email": authenticated_user["email"],
    "user_id": authenticated_user["user_id"],
    "has_team": bool(team),
    "team_name": team["team_name"] if team else None  # Note: Using team["team_name"] for RealDictRow
    }

# Debug: Print the final response before returning
    print("Final response data:", response_data)

    return JSONResponse(content=response_data)


@app.get("/users/{user_id}/team")
async def get_user_team(
    user_id: int,
    current_user: dict = Depends(get_current_user)  # Add authentication
):
    
    # Verify the requested user matches the token owner
    if user_id != current_user["user_id"]:
        raise HTTPException(
            status_code=403,
            detail="Can only view your own team"
        )

    try:
        with get_db() as conn:
            with conn.cursor() as cursor:
                cursor.execute(
                    """
                    SELECT * FROM teams 
                    WHERE created_by = %s
                    """,
                    (user_id,)
                )
                team = cursor.fetchone()
                return {"has_team": bool(team), "team": team}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@app.post("/teams")
async def create_team(
    team_name: str = Form(...),
    current_user: dict = Depends(get_current_user)  # we need to ensure this returns user_id
):
    
    team_name = team_name.strip()
    print(f" Attempting to create team '{team_name}' for user {current_user['user_id']}")

    # Additional validation
    if not team_name or len(team_name.strip()) < 3:
        raise HTTPException(
            status_code=422,
            detail="Team name must be at least 3 characters"
        )

    try:
        with get_db() as conn:
            with conn.cursor() as cursor:
                # Debug: Print the user_id being used
                print(f"Creating team for user_id: {current_user['user_id']}")

                # Check for existing team
                cursor.execute(
                    "SELECT team_id FROM teams WHERE created_by = %s",
                    (current_user["user_id"],)
                )
                if cursor.fetchone():
                    raise HTTPException(
                        status_code=400,
                        detail="You already have a team"
                    )

                # Create new team
                cursor.execute(
                    """
                    INSERT INTO teams (team_name, created_by, team_score)
                    VALUES (%s, %s, 0)
                    RETURNING team_id, team_name, team_score
                    """,
                    (team_name.strip(), current_user["user_id"])
                )
                new_team = cursor.fetchone()
                print(f"📊 Database returned: {new_team}")
                
                if not new_team:
                    raise HTTPException(
                        status_code=500,
                        detail="Failed to create team"
                    )
                
                conn.commit()
                print(" Team successfully created") 
                
                # return response
                team_data = dict(new_team)
                return {
                    "status": "success",
                    "team": team_data
                }

   
    except psycopg2.IntegrityError as e: #Catches database integrity errors such as duplicate key violations or foreign key constraint failures that happen during database operations.
        print(f" Integrity Error: {e.pgerror}") #Logs the database-specific error message (pgerror) for debugging.
        if 'conn' in locals(): #Checks if the database connection object (conn) exists in the current local scope.If it does, it rolls back the current transaction to undo partial changes caused by the failed operation. This prevents the database from getting into an inconsistent state.
            conn.rollback()
        raise HTTPException(400, "Database constraint violated")
    except HTTPException:
        raise
    except Exception as e:
        print(f" Unexpected error: {str(e)}") #Raises a FastAPI HTTPException with a 400 status code, indicating a client error because the input violates database constraints
        raise HTTPException(500, "Internal server error")
    

def parse_match_output(output: str): #this function has been defined to parse the output given after a match such that to obtain which bot is the winner andwhat are the final bots 
    final_score = None

    # Split output into lines and look for the Final Score
    for line in output.strip().splitlines():
        line = line.strip()
        if line.startswith("Final Score:"):
            try:
                # Extract the dictionary part after the colon
                score_str = line.split(":", 1)[1].strip()
                final_score = ast.literal_eval(score_str)  # e.g. {'bot1': 5, 'bot2': 4}
            except Exception as e:
                raise ValueError(f"Failed to parse final score: {e}")

    if not final_score:
        raise ValueError("Final score not found in output")

    # Determine winner
    if final_score['bot1'] > final_score['bot2']:
        winner = "bot1"
    elif final_score['bot2'] > final_score['bot1']:
        winner = "bot2"
    else:
        winner = "draw"

    return {
        "winner": winner,
        "score": final_score
    }


@app.post("/uploadbot/") #a FastAPI POST endpoint at /uploadbot/
async def upload_bot(file: UploadFile = File(...),
                     current_user: dict = Depends(get_current_user) #user information fetched via dependency injection (Depends(get_current_user)
):
    
    user_id = current_user["user_id"]
    print(f"User {user_id} is uploading a bot.") #Retrieves and shows the current user's ID to track who is uploading a bot.
    # Validate file type
    if not file.filename.endswith(".py"):
        raise HTTPException(status_code=400, detail="Only .py files are allowed.") #Validates the uploaded file.

    # Generate unique filename
    user_filename = f"{uuid.uuid4().hex}_userbot.py" #Generates a unique filename using uuid4() to avoid filename conflicts.
    file_path = os.path.join(UPLOAD_DIR, user_filename) #Combines it with the upload directory path.

    # Save uploaded file
    with open(file_path, "wb") as buffer:  #Saves the uploaded file to disk by copying the uploaded file stream to a new file.
        shutil.copyfileobj(file.file, buffer) #shutil copies file content from one file-like object to another.
#When a user uploads a file via FastAPI, it's not immediately saved to the disk — it exists as a stream of data in memory or a temporary location.
#Opens (or creates) a file on disk at file_path.
#Takes the uploaded file’s stream (file.file) and copy its contents into the newly opened file.
#It is copying the contents of the user's uploaded file (in memory or a temp file) into a new file —we're not "moving" the file directly.
#We're creating a new file on disk at the location file_path, and filling it with the same contents as the uploaded file.
#FastAPI handles file uploads as streamed file-like objects, not real files on your disk.
    try:
        

        python_executable = sys.executable  # Uses the same Python running your FastAPI app #Ensures the subprocess runs with the same Python environment.
        result = subprocess.run(            #Runs a subprocess (executes a match between two bots)
           [python_executable, ENGINE_PATH, "--p1", SYSTEM_BOT_PATH, "--p2", file_path],
           capture_output=True,
           text=True,
           timeout=10  #Limits execution time to 10 seconds so that user-uploaded code doesn't hang (e.g., an infinite loop) and the server resources are protected
        )

        output = result.stdout.strip() #Retrieves and trims the output and errors from the subprocess. stdout stands for Standard Output — it’s where programs normally print their output.
#When we run a Python script or subprocess, and it prints something with print(), that output goes to stdout.
#.strip() is a python method which removes whitespace (spaces, newlines, tabs) from the beginning and end of a string.
        error_output = result.stderr.strip()

          # Save bot file
        bot_filename = f"{uuid.uuid4().hex}_bot.py"
        file_path = os.path.join(UPLOAD_DIR, bot_filename)

        # Get team_id for the user
        with get_db() as conn:
         with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:  # <-- Use RealDictCursor
            cursor.execute(
                "SELECT team_id FROM teams WHERE created_by = %s",
                (user_id,)
            )
            team = cursor.fetchone()
            if not team:
                raise HTTPException(status_code=404, detail="Team not found")
            team_id = team["team_id"]

        with get_db() as conn:
            with conn.cursor() as cursor:
                # Deactivate old paths
                cursor.execute(
                    "UPDATE teams_path SET is_active = FALSE WHERE team_id = %s",
                    (team_id,)
                )
                # Insert new path
                cursor.execute(
                    """
                    INSERT INTO teams_path (team_id, bot_file_path)
                    VALUES (%s, %s)
                    RETURNING path_id
                    """,
                    (team_id, file_path)
                )
                conn.commit()


        
    

        if result.returncode != 0:
            raise HTTPException(
                status_code=500,
                detail=f"Error running match:\n{error_output}"
            )

        # Extract winner info from output
        winner_line = next(
            (line for line in output.splitlines() if "Winner:" in line),
            "Winner: unknown"
        )
        winner = winner_line.split(":")[1].strip()
        print(type(output))

        lines = output.splitlines()

        # Find the index of the "Winner:" line
        winner_index = next((i for i, line in enumerate(lines) if "Winner:" in line), None)

        if winner_index is not None:
    # Keep lines only up to and including Winner line
          trimmed_output = "\n".join(lines[:winner_index + 1])
        else:
          trimmed_output = output  # fallback
        raw_match_log = lines[-1]

        try:
          match_log = ast.literal_eval(raw_match_log)  # Convert string to Python list safely
        except Exception as e:
          match_log = []
          print("Failed to parse match_log:", e)

        

        result_final = parse_match_output(output)
        print(result_final)

        bot1_score = result_final['score']['bot1']
        bot2_score = result_final['score']['bot2']

        if bot1_score > bot2_score:
         team_score = bot2_score
        else:
         team_score = bot1_score + bot2_score

        print("team_score:", team_score)

        # Update team_score in DB where created_by = current_user['user_id']
        with get_db() as conn:
            with conn.cursor() as cursor:
                update_query = """
                    UPDATE teams
                    SET team_score = %s
                    WHERE created_by = %s
                """
                cursor.execute(update_query, (team_score, current_user['user_id']))
                conn.commit()


        return JSONResponse(content={  #JSONResponse is a FastAPI response class that sends JSON data back to the client.
            "status": "success",
            "output": trimmed_output,
            "winner": winner,
            "match_log": match_log , # <== return this so frontend can render animation
            "bot_path": file_path
        })

    except subprocess.TimeoutExpired:
        raise HTTPException(status_code=500, detail="Bot execution timed out.")
    finally:
        # Clean up temp file
        if os.path.exists(file_path): #os is a built-in Python module that provides a way to interact with the operating system.It lets us do things like work with files and directories (check if a file exists, create folders, delete files, etc.)


            os.remove(file_path)


@app.post("/start-round2/")
async def start_round2(
    background_tasks: BackgroundTasks,
    current_user: dict = Depends(get_current_user)
):
    # Admin check
    if current_user["user_id"] != 3:
        raise HTTPException(status_code=403, detail="Admin access required")

    # Get all active bot paths with team info
    with get_db() as conn:
         with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:  # <-- This line changed
            cursor.execute("""
                SELECT tp.path_id, t.team_id, t.team_name, tp.bot_file_path
                FROM teams_path tp
                JOIN teams t ON tp.team_id = t.team_id
                WHERE tp.is_active = TRUE
                ORDER BY t.team_score DESC
            """)
            active_bots = cursor.fetchall()

    if len(active_bots) < 2:
        raise HTTPException(status_code=400, detail="Need at least 2 active bots")
    
    output_buffer = StringIO()
    old_stdout = sys.stdout
    sys.stdout = output_buffer

    try:
        # Run tournament synchronously just to capture output
        results = await run_bot_tournament(active_bots, current_user)
        output_text = output_buffer.getvalue()
    finally:
        sys.stdout = old_stdout

    # Start tournament in background
    # background_tasks.add_task(run_bot_tournament, active_bots, current_user=current_user  )
    background_tasks.add_task(
    run_bot_tournament,
    active_bots=active_bots,
    current_user=current_user
    )

    # Run tournament synchronously
    results = await run_bot_tournament(active_bots, current_user)

    
    return {"status": "Round 2 tournament started", "bot_count": len(active_bots),"admin_id": current_user["user_id"],"sample_output": output_text.splitlines()}


async def run_bot_tournament(active_bots: List[dict], current_user: dict):
    results = []
    admin_id = current_user["user_id"]
    
    # Extract all needed bot information
    bot_paths = [bot["bot_file_path"] for bot in active_bots]
    team_ids = [bot["team_id"] for bot in active_bots]
    team_names = {bot["team_id"]: bot["team_name"] for bot in active_bots}  # Map team_id to name
    
    print(f"\n=== Starting Tournament with {len(active_bots)} bots ===")
    
    # Round-robin matches
    for i in range(len(bot_paths)):
        for j in range(i+1, len(bot_paths)):
            team1_id = team_ids[i]
            team2_id = team_ids[j]
            
            print(f"\n⚔️ Match: {team_names[team1_id]} vs {team_names[team2_id]}")
            
            try:
                # Run the match
                result = subprocess.run(
                    [sys.executable, ENGINE_PATH, "--p1", bot_paths[i], "--p2", bot_paths[j]],
                    capture_output=True,
                    text=True,
                    timeout=10
                )
                
                # Parse and store results
                winner = parse_winner(result.stdout)
                winner_name = team_names.get(winner, "Draw/Unknown")
                
                match_result = {
                    "team1": team1_id,
                    "team1_name": team_names[team1_id],
                    "team2": team2_id,
                    "team2_name": team_names[team2_id],
                    "winner": winner,
                    "winner_name": winner_name,
                    "output": result.stdout
                }
                results.append(match_result)
                
                # Print immediate result
                print(f"🏆 Winner: {winner_name}")
                print("📜 Game Log:")
                print(result.stdout.strip()[:500] + "...")  # Show first 500 chars of output
                
            except subprocess.TimeoutExpired:
                error_msg = f" Timeout: {team_names[team1_id]} vs {team_names[team2_id]}"
                print(error_msg)
                results.append({
                    "team1": team1_id,
                    "team1_name": team_names[team1_id],
                    "team2": team2_id,
                    "team2_name": team_names[team2_id],
                    "winner": "unknown",
                    "winner_name": "Timeout",
                    "output": error_msg
                })
            except Exception as e:
                error_msg = f" Error in {team_names[team1_id]} vs {team_names[team2_id]}: {str(e)}"
                print(error_msg)
                results.append({
                    "team1": team1_id,
                    "team1_name": team_names[team1_id],
                    "team2": team2_id,
                    "team2_name": team_names[team2_id],
                    "winner": "unknown",
                    "winner_name": "Error",
                    "output": error_msg
                })
    
    # Database operations
    try:
        with get_db() as conn:
            with conn.cursor() as cursor:
                # Save tournament results
                cursor.execute(
                    """
                    INSERT INTO tournaments (created_by, results)
                    VALUES (%s, %s)
                    RETURNING tournament_id
                    """,
                    (admin_id, json.dumps({
                        "matches": results,
                        "summary": {
                            "total_matches": len(results),
                            "wins": {team_id: sum(1 for r in results if r["winner"] == team_id) 
                                    for team_id in set(team_ids)},
                            "winners": list(set(r["winner"] for r in results 
                                              if r["winner"] != "unknown"))
                        }
                    }))
                )
                
                # Update team scores (3 points per win)
                for team_id in set(r["winner"] for r in results if r["winner"] != "unknown"):
                    cursor.execute(
                        "UPDATE teams SET team_score = team_score + 3 WHERE team_id = %s",
                        (team_id,)
                    )
                
                conn.commit()
                
                print("\n✅ Tournament completed successfully!")
                print(f"📊 Total matches: {len(results)}")
                winning_teams = [team_names[t] for t in set(r["winner"] for r in results 
                                                             if r["winner"] != "unknown")]
                print(f"🏅 Winning teams: {', '.join(winning_teams) if winning_teams else 'None'}")

    except Exception as db_error:
        print(f"❌ Database error: {str(db_error)}")
        # Consider adding retry logic here
    
    return results


def parse_winner(output: str) -> str:
    winner_line = next(
        (line for line in output.splitlines() if "Winner:" in line),
        None
    )
    return winner_line.split(":")[1].strip() if winner_line else "unknown"


class TeamResponse(BaseModel): #BaseModel is a class from the Pydantic library — a popular data validation and settings management tool often used with FastAPI.It lets you define data models with type annotations. Type annotations in Python are a way to explicitly declare the expected data type of variables, function parameters, and return values
    team_id: int              #Defines a model TeamResponse with 4 fields.
    team_name: str
    created_by: int
    team_score: int


    

@app.get("/getteams", response_model=List[TeamResponse])
async def get_all_teams():
    try:
        # Establish database connection
        with get_db() as conn:
         with conn.cursor() as cursor:
            # Query to get all teams with owner information
            cursor.execute("""
                SELECT 
                    t.team_id,
                    t.team_name,
                    t.created_by,
                    t.team_score
                    
                    
                FROM teams t
                JOIN users u ON t.created_by = u.user_id
                ORDER BY t.team_score DESC
            """)
            
            teams = cursor.fetchall()
            return teams
            
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Database error: {str(e)}"
        )
    finally:
        if 'conn' in locals(): #Checks if the database connection object (conn) exists in the current local scope.If it does, it rolls back the current transaction to undo partial changes caused by the failed operation. This prevents the database from getting into an inconsistent state.
            conn.close()

    



if __name__ == "__main__":  #to start a FastAPI app using Uvicorn, a lightning-fast ASGI server. ASGI stands for Asynchronous Server Gateway Interface. It’s a specification (a standard) that defines how Python web servers communicate with web applications/frameworks asynchronously.
    #Uvicorn basically runs my FastAPI app as an ASGI server.It handles incoming HTTP requests, manages connections, and communicates with your FastAPI app.
    import uvicorn  #this dynamically imports the Uvicorn server module. Only load Uvicorn if running script directly. This can speed up imports and avoid side effects when your file is imported.


    uvicorn.run(app, host="0.0.0.0", port=8000)

    #host="0.0.0.0" tells Uvicorn to listen on all network interfaces, making our app accessible from other devices on your network or from the internet (if our machine allows it).


#Uvicorn runs an event loop to asynchronously handle incoming HTTP requests.
#When a request arrives, it passes it to my FastAPI app.
#My FastAPI app processes it and returns a response.
#Uvicorn sends the response back to the client.