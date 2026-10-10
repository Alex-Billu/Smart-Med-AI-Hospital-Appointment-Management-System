@echo off
echo Starting Hospital Appointment Booking System...

cd /d "%~dp0"

echo Checking backend...
start "Backend Server" cmd /k "cd backend && npm install && npm run dev"

echo Checking frontend...
start "Frontend Server" cmd /k "cd frontend && npm install && npm run dev"

echo Both servers are starting up! Please wait a moment for them to initialize.
