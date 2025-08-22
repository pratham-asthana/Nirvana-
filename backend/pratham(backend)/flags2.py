import cv2 
import mediapipe as mp
import time 
import numpy as np
from eye_contact import check_eye_contact
from eye_gaze import get_eye_gaze_direction
from head_position import check_head_position
from deception import evaluate_deception

mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(
    static_image_mode=False,
    max_num_faces=1,
    refine_landmarks=True
)
mp_drawing = mp.solutions.drawing_utils

def flags(video_path):
    cap = cv2.VideoCapture(video_path)
    warning_counter = 0
    warnings = 0
    disqualified = False
    
    while cap.isOpened():
        success, frame = cap.read()
        if not success:
            break
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = face_mesh.process(frame_rgb)
        
        if results.multi_face_landmarks:
            
            for face_landmarks in results.multi_face_landmarks:
                h, w, _ = frame.shape
                landmarks = face_landmarks.landmark
                # Eye Contact
                eye_contact, offset = check_eye_contact(landmarks, w, h)
                eye_label = "Looking at Camera" if eye_contact else "Not Looking"
                eye_color = (0, 200, 0) if eye_contact else (0, 0, 200)
                # Gaze Direction
                left_gaze = get_eye_gaze_direction(landmarks, w, h, side="left")
                right_gaze = get_eye_gaze_direction(landmarks, w, h, side="right")
                gaze_label = left_gaze if left_gaze == right_gaze else "Uncertain"
                gaze_score = 1.0 if gaze_label == "Center" else 0.5 if gaze_label != "Uncertain" else 0.0
                # Head Position
                score_head, head_angle = check_head_position(landmarks, w, h)
                # Evaluation
                deception_score = evaluate_deception(
                    eye_contact=1.0 if eye_contact else 0.0,
                    gaze_direction=gaze_score,
                    head_pos=score_head
                    )
                # Label
                if deception_score > 75:
                    conf_label = "Perfect"
                elif deception_score > 50:
                    conf_label = "ok"
                else:
                    conf_label = "WARNING"
                    warning_counter += 1 
                    warnings = warning_counter//30
            
            if warnings > 7:
                disqualified = True
    cap.release()
    cv2.destroyAllWindows()
    return warnings, disqualified

