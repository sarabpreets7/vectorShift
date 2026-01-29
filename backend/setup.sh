#!/bin/bash
# Setup script for VectorShift Backend

echo "Setting up Python virtual environment..."

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Upgrade pip (if available)
python3 -m pip install --upgrade pip 2>/dev/null || echo "pip not available, will install via ensurepip"

# Install requirements
echo "Installing dependencies..."
python3 -m pip install -r requirements.txt

echo ""
echo "Setup complete! To activate the virtual environment, run:"
echo "  source venv/bin/activate"
echo ""
echo "Then start the server with:"
echo "  uvicorn main:app --reload"
