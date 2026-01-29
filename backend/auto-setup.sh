#!/bin/bash
# Automated Backend Setup Script
# Run this AFTER installing python3-venv and python3-pip with sudo

set -e  # Exit on error

cd "$(dirname "$0")"

echo "🚀 Setting up VectorShift Backend..."
echo ""

# Check if venv module is available
if ! python3 -m venv --help &>/dev/null; then
    echo "❌ Error: python3-venv is not installed"
    echo ""
    echo "Please run this command first (requires sudo):"
    echo "  sudo apt update && sudo apt install -y python3-venv python3-pip"
    echo ""
    exit 1
fi

# Remove old venv if it exists
if [ -d "venv" ]; then
    echo "🧹 Cleaning up old virtual environment..."
    rm -rf venv
fi

# Create virtual environment
echo "📦 Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "⬆️  Upgrading pip..."
python3 -m pip install --upgrade pip --quiet

# Install dependencies
echo "📥 Installing dependencies..."
python3 -m pip install -r requirements.txt --quiet

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the backend server, run:"
echo "  source venv/bin/activate"
echo "  uvicorn main:app --reload"
echo ""
echo "Or use: ./start-backend.sh"
