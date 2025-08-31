# Backend README

## Objective
The backend folder contains the server-side logic for the Nirvana- project. It provides APIs and processing modules for audio, video, and text analysis, supporting features such as confidence scoring, deception detection, and resume analysis.

## Folder Structure
```
backend/
├── app.py                  # Main Flask application (API entry point)
├── Akshat/                 # NLP, QnA, and resume analysis modules
│   ├── Connector.py        # Data connector utilities
│   ├── Correctness_Analysis.py # Correctness analysis logic
│   ├── Do_Main.py          # Main orchestration for Akshat modules
│   ├── QNA_Main.py         # QnA main logic
│   ├── Question_Gen.py     # Question generation
│   ├── Requirements.txt    # Akshat module dependencies
│   ├── Res_Main.py         # Resume analysis main
│   ├── Resume_Analysis_2.py# Alternate resume analysis
│   ├── Resume_Analysis.py  # Resume analysis
│   ├── STT.py              # Speech-to-text
│   ├── Testing.py          # Akshat module tests
│   └── __pycache__/        # Python cache files
├── functions_testing/      # Standalone test scripts for backend functions (does not exist, remove from structure)
├── media/                  # Media files for analysis and testing
│   ├── face.jpg                 # Sample image
│   ├── extracted_audio/         # Extracted audio samples
│   │   └── audio_sample.wav
│   └── videos/                  # Video samples
│       └── sample.mp4
├── pratham(backend)/       # Main backend modules (audio, video, deception, scoring)
│   ├── app.py                  # Alternate/legacy Flask app
│   ├── audio_confidence.py     # Audio confidence scoring
│   ├── audio_extractor.py      # Audio extraction from media
│   ├── audio_transcriber.py    # Audio transcription
│   ├── calling_main_test.py    # Main test runner
│   ├── confidence_calculation.py
│   ├── DECEPTION_FLAGS.py      # Deception flag logic
│   ├── Deception_scores.py     # Deception scoring
│   ├── deception.py            # Deception detection
│   ├── expressions.py          # Facial expression analysis
│   ├── eye_contact.py          # Eye contact detection
│   ├── eye_gaze.py             # Eye gaze tracking
│   ├── flags.py
│   ├── flags2.py
│   ├── function.py
│   ├── head_position.py        # Head position analysis
│   ├── linguistic_confidence.py# Linguistic confidence scoring
│   ├── MAIN_MAIN.py            # Main orchestration script
│   ├── main.py
│   ├── main2.py
│   ├── README.md               # Submodule documentation
│   ├── real-time_flag.py       # Real-time flagging
│   ├── requirements.txt        # Pratham backend dependencies
│   ├── scores.py               # Scoring logic
│   ├── SPEECH_BASED_CONFIDENCE.py
│   ├── speech_based.py
│   ├── tempCodeRunnerFile.py
│   ├── VISION_BASED_CONFIDENCE.py
│   ├── visuals.py              # Visual analysis
│   └── __pycache__/            # Python cache files
│   ├── deception/              # Deception submodules
│   └── media/                  # Media for pratham backend
```

## Functionality
- **API Server**: `app.py` runs a Flask server exposing endpoints for analysis and data processing.
- **Audio Analysis**: Modules for extracting, transcribing, and scoring audio confidence.
- **Video Analysis**: Modules for visual cues, eye contact, gaze, and head position.
- **Deception Detection**: Algorithms and flags for identifying deceptive behavior.
- **Resume & QnA Analysis**: Specialized scripts for resume parsing and question-answer evaluation.
- **Testing**: Scripts for validating backend functions and modules.

## Usage
1. **Install Dependencies**
   - Navigate to the relevant subfolder (e.g., `pratham(backend)` or `Akshat`) and install requirements:
     ```powershell
     pip install -r requirements.txt
     ```
2. **Run the Server**
   - Start the Flask server:
     ```powershell
     python app.py
     ```
3. **API Endpoints**
   - Use tools like Postman or curl to interact with the backend APIs for analysis tasks.

## Notes
- Media files for testing should be placed in the `media/` subfolders.
  
- Each submodule may have its own requirements and usage instructions.

## Contact
For questions or contributions, contact the repository owner or refer to the main project README.
