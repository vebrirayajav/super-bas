#!/bin/bash
# Script to open the project in Visual Studio Code

# Check if code command is available
if ! command -v code &> /dev/null; then
    echo "Error: VS Code command-line tool 'code' is not found."
    echo "Please install VS Code and ensure it's in your PATH."
    echo "Visit: https://code.visualstudio.com/download"
    exit 1
fi

# Open the current directory in VS Code
echo "Opening project in VS Code..."
if code .; then
    echo "VS Code opened successfully!"
else
    echo "Error: Failed to open VS Code."
    exit 1
fi
