# Quick Start Guide - Running Frontend and Backend

## Prerequisites

1. **Node.js and npm** (for frontend)
   - Check: `node --version` and `npm --version`
   - Install if needed: https://nodejs.org/

2. **Python 3 and pip** (for backend)
   - Check: `python3 --version`
   - Install pip: `sudo apt install python3-pip python3-venv`

## Step-by-Step Instructions

### Option 1: Manual Setup (Recommended for first time)

#### Terminal 1: Start Backend

```bash
# Navigate to backend directory
cd /home/sarabpreetsingh/Documents/proj/backend

# Create virtual environment (first time only)
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies (first time only)
pip install -r requirements.txt

# Start the backend server
uvicorn main:app --reload
```

**Expected output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Application startup complete.
```

✅ Backend is now running on **http://localhost:8000**

#### Terminal 2: Start Frontend

```bash
# Navigate to frontend directory
cd /home/sarabpreetsingh/Documents/proj/node-flow

# Install dependencies (first time only)
npm install

# Start the development server
npm run dev
```

**Expected output:**
```
  ▲ Next.js 16.1.4
  - Local:        http://localhost:3000
```

✅ Frontend is now running on **http://localhost:3000**

### Option 2: Using Helper Scripts

I've created helper scripts to make this easier (see below).

## Testing the Application

1. **Open your browser** and go to: `http://localhost:3000`

2. **Test the features:**
   - Add nodes from the library
   - Create edges between nodes
   - Edit text in Text nodes (try: `Hello {{name}}!`)
   - Click "Submit Pipeline" button
   - You should see a modal with pipeline statistics

3. **Verify backend is working:**
   - The submit button should show "Submitting..." briefly
   - A modal should appear with:
     - Number of Nodes
     - Number of Edges
     - Is DAG (Yes/No)

## Troubleshooting

### Backend Issues

**Problem**: `pip` command not found
```bash
# Install pip
sudo apt install python3-pip python3-venv
```

**Problem**: Port 8000 already in use
```bash
# Use a different port
uvicorn main:app --reload --port 8001
# Then update frontend API URL in page.tsx
```

**Problem**: CORS errors
- Make sure backend is running before frontend
- Check that backend CORS allows `http://localhost:3000`

### Frontend Issues

**Problem**: Port 3000 already in use
```bash
# Next.js will automatically use the next available port
# Or specify a port:
PORT=3001 npm run dev
```

**Problem**: `npm install` fails
```bash
# Clear cache and try again
rm -rf node_modules package-lock.json
npm install
```

**Problem**: Can't connect to backend
- Verify backend is running on port 8000
- Check browser console for errors
- Make sure both services are running

## Stopping the Servers

- **Backend**: Press `CTRL+C` in Terminal 1
- **Frontend**: Press `CTRL+C` in Terminal 2

## Development Tips

- Backend auto-reloads on file changes (thanks to `--reload` flag)
- Frontend auto-reloads on file changes (Next.js hot reload)
- Check browser console (F12) for any errors
- Check terminal output for backend logs
