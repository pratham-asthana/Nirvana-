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

video_path = os.path.join(project_root, 'backend', 'media', 'videos', 'sample.mp4')
audio_path = os.path.join(project_root, 'media', 'extracted_audio', 'audio_sample.wav')

extract_audio(video_path, audio_path)

audio_confidence = evaluate_audio_confidence(audio_path)
print(f"Audio Confidence: {audio_confidence}")

mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(static_image_mode=True, max_num_faces=1, refine_landmarks=True)


frame = cv2.VideoCapture(video_path)
num_frames = int(frame.get(cv2.CAP_PROP_FRAME_COUNT))
smile_list = []
eye_contact_list = []
gaze_list = []
head_list = []

blink_count = 0
valid_frames = 0
prev_blink_state = False

while True:
    success, image = frame.read()
    if not success:
        break
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    results = face_mesh.process(image_rgb)
    if not results.multi_face_landmarks:
        continue
    landmarks = results.multi_face_landmarks[0].landmark
    h, w, _ = image.shape
    smile_list.append(calculate_smile_intensity(landmarks, w, h))
    eye_contact, _ = check_eye_contact(landmarks, w, h)
    eye_contact_list.append(eye_contact)
    gaze_list.append(get_eye_gaze_direction(landmarks, w, h))
    head_score, _ = check_head_position(landmarks, w, h)
    head_list.append(head_score)

    # Blink detection
    blink_state = detect_blink(landmarks, w, h, prev_blink_state)
    if blink_state and not prev_blink_state:
        blink_count += 1
    prev_blink_state = blink_state
    valid_frames += 1

frame.release()

if valid_frames == 0:
    print("No valid frames with detected face.")
    sys.exit(1)

# Aggregate features
smile_intensity = sum(smile_list) / len(smile_list)
eye_contact = sum(eye_contact_list) / len(eye_contact_list)
def gaze_to_score(gaze):
    # Example: map gaze direction string to a numeric score
    # You may want to adjust this mapping based on your use case
    if gaze == 'center':
        return 1.0
    elif gaze == 'left' or gaze == 'right':
        return 0.5
    else:
        return 0.0

gaze_direction = sum(gaze_to_score(g) for g in gaze_list) / len(gaze_list)
head_score = sum(head_list) / len(head_list)

fps = frame.get(cv2.CAP_PROP_FPS)
if fps == 0:
    print("Warning: FPS is zero, cannot calculate blink rate accurately.")
    blink_rate = 0
else:
    blink_rate = blink_count / (num_frames / fps) * 60  # blinks per minute


vision_confidence = evaluate_confidence(
    smile_intensity=smile_intensity,
    eye_contact=eye_contact,
    gaze_direction=gaze_direction,
    blink_rate=blink_rate,
    head_pos=head_score
)

print(f"Confidence (vision based): {vision_confidence}")
print(f"Confidence (audio based): {audio_confidence}")

total_confidence = int(round(vision_confidence * 0.7 + audio_confidence * 0.3))
print(f"\nTotal Aggregated confidence: {total_confidence}")
