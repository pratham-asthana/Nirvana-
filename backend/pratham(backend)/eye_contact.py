import numpy as np

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