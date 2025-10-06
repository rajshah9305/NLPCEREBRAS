#!/bin/bash

echo "🚀 RAJ AI APP BUILDER - Quick Start"
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Create environment file
echo "🔑 Setting up environment variables..."
echo "CEREBRAS_API_KEY=csk-4txetdxrcmpdxjht5kv2t95pefkdjfvjkcep4pyetpe3xefp" > .env.local

# Type check
echo "🔍 Running type checks..."
npm run type-check

if [ $? -ne 0 ]; then
    echo "❌ TypeScript errors found"
    exit 1
fi

# Build test
echo "🏗️  Testing build..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "✅ Dependencies installed"
echo "✅ Environment configured"
echo "✅ TypeScript checks passed"
echo "✅ Build successful"
echo ""
echo "🚀 To start the development server:"
echo "   npm run dev"
echo ""
echo "🌐 Then open: http://localhost:3000"
echo ""
echo "📚 For more information, see README.md"
echo ""
echo "Happy coding! 🎨"
