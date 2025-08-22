import os
import sys
project_root = os.path.dirname(os.path.dirname(__file__))
sys.path.append(os.path.join(project_root, 'backend'))
from audio_extractor import extract_audio

project_root = os.path.dirname(os.path.dirname(__file__))
video_path = os.path.join(project_root, 'media', 'videos', 'sample.mp4')
audio_path = os.path.join(project_root, 'media', 'extracted_audio', 'audio_sample.wav')
print(video_path)
print(os.path.isfile(video_path))
print(os.path.isfile(audio_path))

extract_audio(video_path=video_path, audio_path=audio_path)