#!/bin/bash
# Run this script FIRST to install required system packages
# This requires sudo access

echo "🔧 Installing required system packages..."
echo "This will ask for your password:"
echo ""

sudo apt update && sudo apt install -y python3-venv python3-pip

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ System packages installed successfully!"
    echo ""
    echo "Now you can run:"
    echo "  cd backend && ./auto-setup.sh"
    echo ""
    echo "Or use the start scripts:"
    echo "  ./start-backend.sh"
else
    echo ""
    echo "❌ Installation failed. Please check the error above."
    exit 1
fi
