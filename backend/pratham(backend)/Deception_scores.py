def score_eye_contact(eye_contact):
    return 1.0 if eye_contact else 0.0

def score_gaze(gaze_direction):
    if gaze_direction == "Center":
        return 1.0
    elif gaze_direction == "Uncertain":
        return 0.5
    else:
        return 0.0

def score_head_position(head_score):
    return head_score