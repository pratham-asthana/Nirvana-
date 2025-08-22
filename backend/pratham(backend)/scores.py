def score_smile(smile_intensity):
    if smile_intensity > 0.4:
        return 1.0
    elif smile_intensity > 0.25:
        return 0.7
    elif smile_intensity > 0.15:
        return 0.4
    else:
        return 0.0

def score_eye_contact(eye_contact):
    return 1.0 if eye_contact else 0.0

def score_gaze(gaze_direction):
    if gaze_direction == "Center":
        return 1.0
    elif gaze_direction == "Uncertain":
        return 0.5
    else:
        return 0.0

def score_blink_rate(blink_rate):
    if 10 <= blink_rate <= 25:
        return 1.0
    elif 6 <= blink_rate <= 30:
        return 0.5
    else:
        return 0.0
def score_head_position(head_score):
    return head_score