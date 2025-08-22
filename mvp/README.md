# Nirvana MVP - AI Interview Analysis System

## Overview
A simplified MVP version of the Nirvana interview analysis system that provides real-time confidence scoring during video interviews.

## Features
- Video recording with webcam
- Real-time confidence analysis
- Audio transcription and linguistic analysis
- Simple web interface
- Basic scoring dashboard

## Quick Start

### Backend Setup
```bash
cd mvp/backend
pip install -r requirements.txt
python app.py
```

### Frontend Setup
```bash
cd mvp/frontend
npm install
npm run dev
```

### Environment Setup
Create a `.env` file in the backend directory:
```
OPENAI_API_KEY=your_openai_key_here
```

## Architecture
- **Backend**: Flask API with confidence analysis modules
- **Frontend**: React app with video recording capabilities
- **Analysis**: Multi-modal confidence scoring (audio, visual, linguistic)

## Usage
1. Open the web interface
2. Start video recording
3. Speak naturally during the mock interview
4. Stop recording to get confidence analysis
5. Review detailed scores and feedback

## MVP Limitations
- Single user session
- No user authentication
- Basic UI/UX
- Local storage only
- Limited interview questions

## Future Enhancements
- User management system
- Resume analysis integration
- Advanced deception detection
- Interview question generation
- Performance analytics dashboard
