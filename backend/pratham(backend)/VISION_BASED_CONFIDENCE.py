def visual_confidence(video_path):
    from confidence_calculation import evaluate_confidence
    from expressions import calculate_smile_intensity, check_eye_contact, get_eye_gaze_direction, check_head_position, detect_blink
    from scores import score_smile, score_eye_contact, score_gaze, score_blink_rate, score_head_position
    import cv2 
    import mediapipe as mp
    import sys 
    import os 
    import numpy as np
   
    if not os.path.exists(video_path):
        print("Video file does not exist.")
        sys.exit(1)

    #Intitialize MediaPipe Face Mesh
    mp_face_mesh = mp.solutions.face_mesh
    face_mesh = mp_face_mesh.FaceMesh(static_image_mode=True, max_num_faces=1, refine_landmarks=True)
    
    vision_confidence_frames = [] # List to store confidence scores for each frame
    
    #capture video frames
    frame = cv2.VideoCapture(video_path)
    prev_eye_state = "open"  
    blink_count = 0 
    
    while True:
        success, image = frame.read()
        if not success:
            break  # Exit loop when no more frames
        
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        results = face_mesh.process(image_rgb)
        if not results.multi_face_landmarks:
            continue  # Skip frame if no face detected
        
        landmarks = results.multi_face_landmarks[0].landmark
        h, w, _ = image.shape
        
        smile_intensity = calculate_smile_intensity(landmarks, w, h)
        eye_contact, _ = check_eye_contact(landmarks, w, h)
        gaze_direction = get_eye_gaze_direction(landmarks, w, h)
        head_position_score, _ = check_head_position(landmarks, w, h)
        
        blink_detected, prev_eye_state = detect_blink(landmarks, w, h, prev_eye_state)
        if blink_detected:
            blink_count += 1
        
        blink_rate_score = score_blink_rate(blink_count)
        smile_score = score_smile(smile_intensity)
        eye_contact_score = score_eye_contact(eye_contact)
        gaze_score = score_gaze(gaze_direction)
        head_position_score = score_head_position(head_position_score)
        confidence_score = evaluate_confidence(smile_score, eye_contact_score, gaze_score, blink_rate_score, head_position_score)  # Use 0 for blink rate in each frame
        vision_confidence_frames.append(confidence_score)
        
    frame.release()

    vision_confidence = round(np.mean(vision_confidence_frames)*1.3) if vision_confidence_frames else 0
    
    return vision_confidence