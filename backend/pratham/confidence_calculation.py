from expressions import calculate_smile_intensity, check_eye_contact, get_eye_gaze_direction, detect_blink, check_head_position
from scores import score_smile, score_eye_contact, score_gaze, score_blink_rate, score_head_position
def evaluate_confidence(smile_intensity, eye_contact, gaze_direction, blink_rate, head_pos):
    s = score_smile(smile_intensity)
    e = score_eye_contact(eye_contact)
    g = score_gaze(gaze_direction)
    b = score_blink_rate(blink_rate)
    h = score_head_position(head_pos)

    final_score = (0.22 * s) + (0.25 * e) + (0.20 * g) + (0.15 * b) + (0.18 * h)
    return round(final_score * 100)