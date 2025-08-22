# Confidence Research Backend

## Project Structure

```
backend/
├── audio_extractor.py           # Extracts audio from video files
├── audio_confidence.py          # Calculates audio-based confidence using pyAudioAnalysis
├── expressions.py               # Extracts facial features from video frames
├── scores.py                    # Scoring functions for facial features
├── confidence_calculation.py    # Aggregates feature scores into vision confidence
├── linguistic_confidence.py     # Calculates linguistic confidence using OpenAI API
├── audio_transcriber.py         # Transcribes audio to text
├── main.py                      # Main pipeline script
├── media/
│   ├── videos/
│   │   └── sample.mp4           # Input video file
│   └── extracted_audio/
│       └── audio_sample.wav     # Extracted audio file
└── README.md                    # Project documentation
```

## Overview

This backend analyzes confidence from video and audio using three modalities:
- **Vision-based confidence**: Extracts facial features (smile, eye contact, gaze, blink, head position) from video frames using Mediapipe and OpenCV, then scores them.
- **Audio-based confidence**: Analyzes tone, pitch, and energy from the extracted audio using pyAudioAnalysis.
- **Linguistic confidence**: Transcribes audio and uses OpenAI GPT to score clarity, coherence, and quality of spoken content.

All scores are aggregated in `main.py` for a final confidence score.

## Usage

1. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   # Also ensure ffmpeg is installed and available in PATH
   ```

2. **Prepare media files**
   - Place your video in `backend/media/videos/sample.mp4`.

3. **Run the pipeline**
   ```bash
   python main.py
   ```
   Output:
   ```
   Confidence (vision based): 60
   Confidence (audio based): 28
   Linguistic Confidence Score: 58
   Total Aggregated confidence: 53
   ```

4. **Linguistic Confidence**
   - Requires OpenAI API key in a `.env` file:
     ```
     OPENAI_API_KEY=your_openai_key_here
     ```

## File Descriptions

- `audio_extractor.py`: Uses ffmpeg to extract audio from video.
- `audio_confidence.py`: Uses pyAudioAnalysis to analyze audio features.
- `expressions.py`: Uses Mediapipe to extract facial features.
- `scores.py`: Functions to score each facial feature.
- `confidence_calculation.py`: Combines feature scores into a vision confidence score.
- `linguistic_confidence.py`: Transcribes audio and uses OpenAI GPT for linguistic scoring.
- `main.py`: Orchestrates the full pipeline and prints all confidence scores.

## Notes
- Ensure all paths are correct and files exist before running.
- For best results, use clear, well-lit videos with audible speech.
- You can adjust the weights for each modality in `main.py` as needed.

---

Feel free to reach out for improvements or troubleshooting!
