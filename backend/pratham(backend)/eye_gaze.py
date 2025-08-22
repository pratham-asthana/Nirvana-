import numpy as np 
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