from DECEPTION_FLAGS import deception 
video_path = "media\\videos\\deception.mp4"
deception_flags, disqualified = deception(video_path)
print(f"Flags: {deception_flags}, Disqualified: {disqualified}")