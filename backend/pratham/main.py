import os
import sys

project_root = os.path.dirname(os.path.dirname(__file__))
sys.path.append(os.path.join(project_root, 'backend'))

from audio_extractor import extract_audio
from expressions import (
    calculate_smile_intensity,
    check_eye_contact,
    get_eye_gaze_direction,
    detect_blink,
    check_head_position
)
from confidence_calculation import evaluate_confidence

import cv2
import mediapipe as mp

from audio_confidence import evaluate_audio_confidence

video_path = os.path.join(project_root,'backend', 'media', 'videos', 'sample.mp4')
audio_path = os.path.join(project_root,'backend', 'media', 'extracted_audio', 'audio_sample.wav')

extract_audio(video_path, audio_path)

audio_confidence = evaluate_audio_confidence(audio_path)
print(f"Audio Confidence: {audio_confidence}")

mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(static_image_mode=True, max_num_faces=1, refine_landmarks=True)

frame = cv2.VideoCapture(video_path)
success, image = frame.read()
if not success:
    print("Could not read video.")
    sys.exit(1)

image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
results = face_mesh.process(image_rgb)
if not results.multi_face_landmarks:
    print("No face detected.")
    sys.exit(1)

landmarks = results.multi_face_landmarks[0].landmark
h, w, _ = image.shape


smile_intensity = calculate_smile_intensity(landmarks, w, h)
eye_contact, _ = check_eye_contact(landmarks, w, h)
gaze_direction = get_eye_gaze_direction(landmarks, w, h)
blink_rate = 15  
head_score, _ = check_head_position(landmarks, w, h)


vision_confidence = evaluate_confidence(
    smile_intensity=smile_intensity,
    eye_contact=eye_contact,
    gaze_direction=gaze_direction,
    blink_rate=blink_rate,
    head_pos=head_score
)


from linguistic_confidence import evaluate_linguistic_confidence

linguistic_confidence = int(evaluate_linguistic_confidence(audio_path))


print(f"Confidence (vision based): {vision_confidence}")
print(f"Confidence (audio based): {audio_confidence}")
print(f"Linguistic Confidence Score: {linguistic_confidence}")

total_confidence = int(round(vision_confidence * 0.4 + audio_confidence * 0.2 + linguistic_confidence * 0.4))
print(f"\nTotal Aggregated confidence: {total_confidence}")
