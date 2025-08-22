import os 
import sys 
from audio_transcriber import transcribe_audio

project_root = os.path.dirname(os.path.dirname(__file__))
sys.path.append(os.path.join(project_root, 'backend'))
audio_path = os.path.join(project_root,'backend', 'media', 'extracted_audio', 'audio_sample.wav')

Transription = transcribe_audio(audio_path=audio_path)
print(Transription)