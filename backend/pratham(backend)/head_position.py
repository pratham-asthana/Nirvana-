import numpy as np 
def check_head_position(landmarks, w, h, threshold=20):
    left_eye_outer = np.array([landmarks[33].x * w, landmarks[33].y * h])
    right_eye_outer = np.array([landmarks[263].x * w, landmarks[263].y * h])

    dx = right_eye_outer[0] - left_eye_outer[0]
    dy = right_eye_outer[1] - left_eye_outer[1]
    angle = np.degrees(np.arctan2(dy, dx))  

    tilt_score = max(0, 1 - abs(angle) / threshold)
    tilt_score = round(min(tilt_score, 1.0), 2)

    return tilt_score, round(angle, 2)