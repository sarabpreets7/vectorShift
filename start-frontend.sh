#!/bin/bash

# Start Frontend Server Script
# This script sets up and starts the Next.js frontend

cd "$(dirname "$0")/node-flow"

echo "🚀 Starting VectorShift Frontend..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📥 Installing dependencies..."
    npm install
fi

echo ""
echo "✅ Starting frontend server on http://localhost:3000"
echo "   Press CTRL+C to stop"
echo ""

# Start the development server
npm run dev
