from pyAudioAnalysis import audioBasicIO, ShortTermFeatures
import numpy as np

def evaluate_audio_confidence(audio_path):
    
    [Fs, x] = audioBasicIO.read_audio_file(audio_path)
    if x is None or len(x) == 0:
        return 0
    
    features, feature_names = ShortTermFeatures.feature_extraction(x, Fs, 0.050*Fs, 0.025*Fs)
    
    energy = np.mean(features[1])  
    zcr = np.mean(features[0])     
    pitch = np.mean(features[2])   
    
    score = (energy + (1-zcr) + pitch/1000) / 3
    confidence_percent = int(np.clip(score * 100, 0, 100))
    return confidence_percent
