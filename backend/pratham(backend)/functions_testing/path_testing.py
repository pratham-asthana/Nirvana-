import os

project_root = os.path.dirname(os.path.dirname(__file__))
video_path = os.path.join(project_root, 'media', 'videos', 'sample.mp4')
audio_path = os.path.join(project_root, 'media', 'extracted_audio', 'audio_sample.wav')

print(os.path.isfile(video_path))