#!/bin/bash

# Start BOTH Frontend and Backend together
# Backend runs in background; Frontend runs in foreground
# Press CTRL+C to stop both

cd "$(dirname "$0")"

# Cleanup function: kill backend when script exits
cleanup() {
    echo ""
    echo "🛑 Stopping backend..."
    kill $BACKEND_PID 2>/dev/null
    exit 0
}
trap cleanup EXIT INT TERM

# --- Start Backend ---
if [ -d "backend/venv" ]; then
    echo "🚀 Starting Backend (background)..."
    cd backend
    source venv/bin/activate
    uvicorn main:app --reload --host 127.0.0.1 --port 8000 &
    BACKEND_PID=$!
    cd ..
    sleep 2
    if kill -0 $BACKEND_PID 2>/dev/null; then
        echo "   ✅ Backend running at http://localhost:8000"
    else
        echo "   ❌ Backend failed to start. Run ./start-backend.sh for details."
    fi
    echo ""
else
    echo "⚠️  Backend venv not found. Start backend manually: ./start-backend.sh"
    echo ""
fi

# --- Start Frontend ---
echo "🚀 Starting Frontend..."
echo "   Frontend will be at http://localhost:3000"
echo "   Press CTRL+C to stop both servers"
echo ""

cd node-flow
if [ ! -d "node_modules" ]; then
    npm install
fi
npm run dev
