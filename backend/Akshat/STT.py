# STT is required because the candidate (or user) will speak, that audio will be recorded and sent to the Connector
# This file will convert the audio into text and give it back to Connector to send the text to Correctness_Analyser
def Speech_To_Text_2(AUDIO_FILE, MODEL_PATH):
    import json
    import soundfile as sf
    from vosk import Model, KaldiRecognizer

    # AUDIO_FILE is the recorded audio preferably in wav or mp3 format

    model = Model(MODEL_PATH)

    # Open the audio file
    with sf.SoundFile(AUDIO_FILE) as audio_file:
        sample_rate = audio_file.samplerate
        rec = KaldiRecognizer(model, sample_rate)
        
        # Transcription
        while True:
            data = audio_file.read(frames=4000, dtype='int16')
            if not data:
                break  # Stops when file ends
            if rec.AcceptWaveform(data):
                result = json.loads(rec.Result())
                print("Segment:", result.get("text", ""))
        
        # Print final text
        final_result = json.loads(rec.FinalResult())
        return ("\nFinal Transcript:", final_result.get("text", ""))

def STT_Vosk(AUDIO_FILE, MODEL_PATH):
    import wave, json, audioop
    from vosk import Model, KaldiRecognizer, SetLogLevel

    SetLogLevel(0)
    model = Model(MODEL_PATH)

    with wave.open(AUDIO_FILE, "rb") as wf:
        if wf.getsampwidth() != 2:
            raise ValueError("Audio must be 16-bit PCM WAV")
        rec = KaldiRecognizer(model, wf.getframerate())

        while True:
            data = wf.readframes(4000)
            if not data:
                break
            if wf.getnchannels() == 2:
                data = audioop.tomono(data, 2, 0.5, 0.5)
            if rec.AcceptWaveform(data):
                print(json.loads(rec.Result())["text"])

        print(json.loads(rec.FinalResult())["text"])

def Speech_To_Text(AUDIO_FILE):
    import whisper

    # Load the "base" model
    model = whisper.load_model("base")

    # Transcribe an audio file
    result = model.transcribe(AUDIO_FILE)

    # Print recognized text
    return result
