import os 
import mediapipe as mp
import numpy as np

def calculate_smile_intensity(landmarks, image_width, image_height):
    left = landmarks[61]
    right = landmarks[291]
    top = landmarks[13]
    bottom = landmarks[14]

    def denorm(pt):
        return np.array([pt.x * image_width, pt.y * image_height])

    left_pt = denorm(left)
    right_pt = denorm(right)
    top_pt = denorm(top)
    bottom_pt = denorm(bottom)

    mouth_width = np.linalg.norm(right_pt - left_pt)
    mouth_height = np.linalg.norm(bottom_pt - top_pt)

    if mouth_width == 0:
        return 0.0
    
    intensity = (mouth_height / mouth_width) * 2.0
    return round(intensity)

def check_eye_contact(landmarks, image_width, image_height, threshold=0.15):
    def denorm(pt):
        return np.array([pt.x * image_width, pt.y * image_height])
    left_eye_outer = denorm(landmarks[33])
    left_eye_inner = denorm(landmarks[133])
    left_iris = denorm(landmarks[468])

    right_eye_inner = denorm(landmarks[362])
    right_eye_outer = denorm(landmarks[263])
    right_iris = denorm(landmarks[473])

    left_eye_width = np.linalg.norm(left_eye_outer - left_eye_inner)
    right_eye_width = np.linalg.norm(right_eye_outer - right_eye_inner)

    left_eye_center = (left_eye_outer + left_eye_inner) / 2
    right_eye_center = (right_eye_outer + right_eye_inner) / 2

    left_offset = np.linalg.norm(left_iris - left_eye_center) / left_eye_width
    right_offset = np.linalg.norm(right_iris - right_eye_center) / right_eye_width

    avg_offset = (left_offset + right_offset) / 2
    
    return avg_offset < threshold, round(avg_offset, 3)

def get_eye_gaze_direction(landmarks, image_width, image_height, side="left"):
    def denorm(pt):
        return np.array([pt.x * image_width, pt.y * image_height])

    if side == "left":
        outer = denorm(landmarks[33])
        inner = denorm(landmarks[133])
        iris = denorm(landmarks[468])
    else:
        outer = denorm(landmarks[263])
        inner = denorm(landmarks[362])
        iris = denorm(landmarks[473])

    eye_width = np.linalg.norm(outer - inner)
    if eye_width == 0:
        return "Unknown"

    eye_center = (outer + inner) / 2
    iris_offset = (iris - eye_center)[0]  

    normalized_offset = iris_offset / eye_width

    if normalized_offset < -0.12:
        return "Right"  
    elif normalized_offset > 0.12:
        return "Left"   
    else:
        return "Center"

def detect_blink(landmarks, image_width, image_height, prev_state, threshold=0.22):
    def denorm(pt): return np.array([pt.x * image_width, pt.y * image_height])

    top = denorm(landmarks[159])
    bottom = denorm(landmarks[145])
    left = denorm(landmarks[33])
    right = denorm(landmarks[133])

    vertical = np.linalg.norm(top - bottom)
    horizontal = np.linalg.norm(left - right)

    if horizontal == 0:
        return False, prev_state

    ear = vertical / horizontal

    if ear < threshold and prev_state == "open":
        return True, "closed"
    elif ear >= threshold:
        return False, "open"
    else:
        return False, prev_state
    
def check_head_position(landmarks, w, h, threshold=10):
    left_eye_outer = np.array([landmarks[33].x * w, landmarks[33].y * h])
    right_eye_outer = np.array([landmarks[263].x * w, landmarks[263].y * h])

    dx = right_eye_outer[0] - left_eye_outer[0]
    dy = right_eye_outer[1] - left_eye_outer[1]
    angle = np.degrees(np.arctan2(dy, dx))  

    tilt_score = max(0, 1 - abs(angle) / threshold)
    tilt_score = round(min(tilt_score, 1.0), 2)

    return tilt_score, round(angle, 2)

