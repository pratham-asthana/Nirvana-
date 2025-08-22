from SPEECH_BASED_CONFIDENCE import speech_based_conf
video_path = "media\\videos\\sample.mp4"
speech_confidence = speech_based_conf(video_path)
print(f"Speech-based confidence score: {speech_confidence}")