from Deception_scores import(
    score_eye_contact,
    score_gaze,
    score_head_position
)
def evaluate_deception(eye_contact, gaze_direction, head_pos):
    e = score_eye_contact(eye_contact)
    g = score_gaze(gaze_direction)
    h = score_head_position(head_pos)

    final_score =  (0.30 * e) + (0.25 * g) + (0.45 * h)
    return round(final_score * 100)