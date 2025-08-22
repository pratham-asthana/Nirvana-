def main(video_path):
    from SPEECH_BASED_CONFIDENCE import speech_based_conf
    from VISION_BASED_CONFIDENCE import visual_confidence
    from DECEPTION_FLAGS import deception

    flags, disqualified = deception(video_path)
    speech_confidence = speech_based_conf(video_path)
    vision_confidence = visual_confidence(video_path)
    
    total_confidence = (0.60 * speech_confidence) + (0.40 * vision_confidence)
    return speech_confidence, vision_confidence, total_confidence, flags, disqualified