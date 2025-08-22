#!/bin/bash

# Nirvana MVP Setup Script

echo "🧘 Setting up Nirvana MVP..."

# Backend setup
echo "📦 Setting up backend..."
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

echo "⚙️ Creating environment file..."
cp .env.example .env
echo "Please edit backend/.env and add your OpenAI API key"

# Frontend setup
echo "🎨 Setting up frontend..."
cd ../frontend
npm install

echo "✅ Setup complete!"
echo ""
echo "🚀 To run the application:"
echo "1. Terminal 1 - Backend:"
echo "   cd backend && python app.py"
echo ""
echo "2. Terminal 2 - Frontend:"
echo "   cd frontend && npm run dev"
echo ""
echo "3. Don't forget to add your OpenAI API key to backend/.env"
echo ""
echo "📱 Open http://localhost:3000 in your browser"
