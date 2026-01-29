#!/bin/bash

# Start Backend Server Script
# This script sets up and starts the FastAPI backend

cd "$(dirname "$0")/backend"

echo "🚀 Starting VectorShift Backend..."
echo ""

# Check if pip is available
if ! python3 -m pip --version &>/dev/null; then
    echo "❌ Error: pip is not installed"
    echo ""
    echo "Please install pip first by running:"
    echo "  sudo apt update"
    echo "  sudo apt install -y python3-pip python3-venv"
    echo ""
    exit 1
fi

# Check if virtual environment exists and is valid
if [ ! -d "venv" ] || [ ! -f "venv/bin/python3" ]; then
    echo "📦 Creating virtual environment..."
    if ! python3 -m venv venv; then
        echo "❌ Error: Failed to create virtual environment"
        echo "   Make sure python3-venv is installed:"
        echo "   sudo apt install python3-venv"
        exit 1
    fi
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Check if pip is available in venv, if not, install it using get-pip.py
if [ ! -f "venv/bin/pip" ] && [ ! -f "venv/bin/pip3" ]; then
    echo "📦 Installing pip in virtual environment..."
    curl -sS https://bootstrap.pypa.io/get-pip.py -o /tmp/get-pip.py
    venv/bin/python3 /tmp/get-pip.py
    rm /tmp/get-pip.py
fi

# Use venv's pip explicitly
VENV_PIP="venv/bin/pip"
if [ ! -f "$VENV_PIP" ]; then
    VENV_PIP="venv/bin/pip3"
fi

# Check if dependencies are installed
if [ ! -f "venv/bin/uvicorn" ]; then
    echo "📥 Installing dependencies..."
    "$VENV_PIP" install -r requirements.txt
    if [ $? -ne 0 ]; then
        echo "❌ Error: Failed to install dependencies"
        exit 1
    fi
fi

echo ""
echo "✅ Starting backend server on http://localhost:8000"
echo "   Press CTRL+C to stop"
echo ""

# Start the server
uvicorn main:app --reload
