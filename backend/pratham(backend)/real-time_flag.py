import cv2
import mediapipe as mp
import time
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

cap = cv2.VideoCapture(0)
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

            cv2.putText(frame, f"Eye Contact: {eye_label} (Offset: {offset})",
                        (30, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.7, eye_color, 2)

            # Gaze Direction
            left_gaze = get_eye_gaze_direction(landmarks, w, h, side="left")
            right_gaze = get_eye_gaze_direction(landmarks, w, h, side="right")
            gaze_label = left_gaze if left_gaze == right_gaze else "Uncertain"
            gaze_score = 1.0 if gaze_label == "Center" else 0.5 if gaze_label != "Uncertain" else 0.0

            cv2.putText(frame, f"Gaze: {gaze_label}",
                        (30, 90), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 0), 2)
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
            conf_color = (0, 200, 0) if conf_label.lower() in ["ok", "perfect"] else (0, 0, 200)


            cv2.putText(frame, f"Evaluation: {conf_label}", (30, 120),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, conf_color, 2)
            cv2.putText(frame, f"Warning Count: {warnings}",
                        (30, 150), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 0, 0), 2)
    if warnings > 7:
        cv2.putText(frame, "Multiple Warnings Detected! ", (100, 250),
                    cv2.FONT_HERSHEY_SIMPLEX, 1.0, (0, 0, 255), 3)
        disqualified = True
    if disqualified:
        cv2.putText(frame, "DISQUALIFIED", (220, 300),
                    cv2.FONT_HERSHEY_SIMPLEX, 1.0, (0, 0, 255), 3)
    cv2.imshow('Real-time Deception Analyser', frame)
    if cv2.waitKey(1) & 0xFF == 27:
        break

cap.release()
cv2.destroyAllWindows()
