# STT is required because the candidate (or user) will speak, that audio will be recorded and sent to the Connector
# This file will convert the audio into text and give it back to Connector to send the text to Correctness_Analyser
def Speech_To_Text(AUDIO_FILE):
    import json
    import soundfile as sf
    from vosk import Model, KaldiRecognizer

    # AUDIO_FILE is the recorded audio preferably in wav or mp3 format
    MODEL_PATH = "Vosk_model"

    model = Model(MODEL_PATH)

    # Open the audio file
    with sf.SoundFile(AUDIO_FILE) as audio_file:
        sample_rate = audio_file.samplerate
        rec = KaldiRecognizer(model, sample_rate)
        
        # Transcription
        while True:
            data = audio_file.buffer_read(4000, dtype='int16')
            if not data:
                break  # Stops when file ends
            if rec.AcceptWaveform(data):
                result = json.loads(rec.Result())
                print("Segment:", result.get("text", ""))
        
        # Print final text
        final_result = json.loads(rec.FinalResult())
        return ("\nFinal Transcript:", final_result.get("text", ""))