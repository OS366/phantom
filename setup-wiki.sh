#!/bin/bash

# Script to set up and push wiki files to GitHub
# Make sure you've enabled Wikis in your GitHub repository settings first

echo "Setting up Phantom.js wiki..."

# Check if wiki directory exists
if [ ! -d "wiki" ]; then
    echo "Error: wiki directory not found!"
    exit 1
fi

# Try to clone the wiki repository
echo "Attempting to clone wiki repository..."
if git clone https://github.com/OS366/phantom.wiki.git phantom-wiki 2>/dev/null; then
    echo "Wiki repository cloned successfully!"
    
    # Copy wiki files
    echo "Copying wiki files..."
    cp -r wiki/* phantom-wiki/
    
    # Navigate to wiki directory
    cd phantom-wiki
    
    # Add all files
    git add .
    
    # Commit
    git commit -m "Add comprehensive wiki documentation
    
    - Home page with navigation
    - Getting Started guide
    - Complete Map, String, and Number operations documentation
    - 10 real-world examples
    - Best practices and troubleshooting guides
    - Complete API reference"
    
    # Push to GitHub
    echo "Pushing to GitHub..."
    git push origin master
    
    echo "Wiki setup complete! Check https://github.com/OS366/phantom/wiki"
    
    # Clean up
    cd ..
    rm -rf phantom-wiki
    
else
    echo ""
    echo "Wiki repository not found. Please enable Wikis in your GitHub repository:"
    echo "1. Go to https://github.com/OS366/phantom/settings"
    echo "2. Scroll to 'Features' section"
    echo "3. Check 'Wikis' checkbox"
    echo "4. Click 'Save'"
    echo "5. Run this script again"
    echo ""
    exit 1
fi

