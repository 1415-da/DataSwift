#!/bin/bash

# Restart the backend with increased upload limits
echo "Stopping any running backend processes..."
pkill -f "python.*app.py" || true
pkill -f "uvicorn.*app:app" || true

echo "Starting backend with increased upload limits..."
cd backend
python app.py
