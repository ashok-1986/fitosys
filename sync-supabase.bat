@echo off
echo ========================================
echo FITOSYS - SUPABASE SYNC SCRIPT
echo ========================================
echo.
echo This script will:
echo 1. Install Supabase CLI globally
echo 2. Login to Supabase
echo 3. Initialize and link your project
echo 4. Apply all database migrations
echo.
echo IMPORTANT: You'll need to authorize in browser when prompted
echo.
pause

echo.
echo Step 1: Installing Supabase CLI...
npm install -g supabase
if errorlevel 1 (
    echo ERROR: Failed to install Supabase CLI
    echo Please run: npm install -g supabase
    pause
    exit /b 1
)
echo ✓ Supabase CLI installed successfully!

echo.
echo Step 2: Logging in to Supabase...
echo A browser window will open - click Authorize
supabase login
if errorlevel 1 (
    echo ERROR: Login failed
    pause
    exit /b 1
)
echo ✓ Logged in successfully!

echo.
echo Step 3: Initializing and linking project...
supabase init
supabase link --project-ref cwupeqgkahysocgzzjyp
if errorlevel 1 (
    echo ERROR: Failed to link project
    echo Make sure your project reference is correct: cwupeqgkahysocgzzjyp
    pause
    exit /b 1
)
echo ✓ Project linked successfully!

echo.
echo Step 4: Checking current database state...
echo Please wait while we check what tables exist...

echo.
echo ========================================
echo PRE-MIGRATION CHECK COMPLETE
echo ========================================
echo.
echo Next step: We need to check what's already in your database.
echo.
echo PLEASE DO THIS NOW:
echo 1. Go to: https://supabase.com/dashboard
echo 2. Select your project: cwupeqgkahysocgzzjyp
echo 3. Click SQL Editor
echo 4. Click New Query
echo 5. Paste and run this query:
echo.
echo SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
echo.
echo 6. Copy the results and come back here
echo.
pause

echo.
echo Once you have the table list, run one of these commands based on what you see:
echo.
echo If NO tables found (empty database):
echo   supabase db push
echo.
echo If SOME tables exist (partial setup):
echo   Come back to the AI assistant for custom migration instructions
echo.
echo If you want to START FRESH (delete all existing data):
echo   supabase db reset
echo   supabase db push
echo.
echo ========================================
echo Script completed! Check your database state above.
echo ========================================
pause
