def speech_based_conf(video_path):
    from audio_extractor import extract_audio
    from audio_confidence import evaluate_audio_confidence
    from linguistic_confidence import evaluate_linguistic_confidence 

    audio_path = "media\\extracted_audio\\audio_sample.wav"
    
    extract_audio(video_path, audio_path)
    
    audio_confidence_score = (evaluate_audio_confidence(audio_path))
    linguistic_confidence_score = int(evaluate_linguistic_confidence(audio_path))

    calc = (0.40 * audio_confidence_score) + (0.60 * linguistic_confidence_score)
    speech_based_confidence_score = round(calc)

    return speech_based_confidence_score 